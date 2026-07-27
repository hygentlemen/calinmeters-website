import { readFileSync } from 'node:fs';

import { allFaqItems } from '../data/faq';
import {
  frenchFaqItems,
  frenchFaqTranslations,
} from '../data/locales/fr/faq';
import { frenchProducts } from '../data/locales/fr/products';
import { frenchCategorySeoPages } from '../data/locales/fr/seoPages';
import {
  getAllFrenchProductSlugs,
  getFrenchProductById,
} from '../lib/localizedCatalog';

interface RoutePair {
  en: string;
  fr: string;
}

const routes = JSON.parse(
  readFileSync(new URL('../data/i18n-routes.json', import.meta.url), 'utf8'),
) as RoutePair[];
const failures: string[] = [];

const expectedRoutes: RoutePair[] = [
  { en: '/', fr: '/fr/' },
  {
    en: '/products/sts-prepaid-electricity-meter/',
    fr: '/fr/produits/compteur-electricite-prepaye-sts/',
  },
  {
    en: '/products/sts-prepaid-water-meter/',
    fr: '/fr/produits/compteur-eau-prepaye-sts/',
  },
  {
    en: '/products/ca168-lorawan-sts-prepaid-electricity-meter/',
    fr: '/fr/produits/ca168-compteur-electricite-prepaye-sts-lorawan/',
  },
  {
    en: '/products/ca168-gprs-sts-prepaid-electricity-meter/',
    fr: '/fr/produits/ca168-compteur-electricite-prepaye-sts-gprs/',
  },
  {
    en: '/products/ca168-sts-prepaid-electricity-meter/',
    fr: '/fr/produits/ca168-compteur-electricite-prepaye-sts/',
  },
  {
    en: '/products/ca368-gprs-sts-prepaid-three-phase-electricity-meter/',
    fr: '/fr/produits/ca368-compteur-electricite-prepaye-triphase-gprs/',
  },
  {
    en: '/products/ca368-sts-prepaid-three-phase-electricity-meter/',
    fr: '/fr/produits/ca368-compteur-electricite-prepaye-triphase-sts/',
  },
  {
    en: '/products/sts-prepaid-multi-jet-water-meter-plastic/',
    fr: '/fr/produits/ca568-compteur-eau-prepaye-multijet-plastique/',
  },
  {
    en: '/products/sts-prepaid-multi-jet-water-meter-brass/',
    fr: '/fr/produits/ca568-compteur-eau-prepaye-multijet-laiton/',
  },
  {
    en: '/products/sts-prepaid-ultrasonic-water-meter/',
    fr: '/fr/produits/ca568-compteur-eau-prepaye-ultrasonique/',
  },
];

if (routes.length !== expectedRoutes.length) {
  failures.push(
    `expected ${expectedRoutes.length} localized route pairs, received ${routes.length}`,
  );
}

for (let index = 0; index < expectedRoutes.length; index += 1) {
  const expected = expectedRoutes[index];
  const actual = routes[index];
  if (!actual || actual.en !== expected.en || actual.fr !== expected.fr) {
    failures.push(
      `route pair ${index} differs from the approved contract: expected ${expected.en} ↔ ${expected.fr}`,
    );
  }
}

for (let index = 0; index < routes.length; index += 1) {
  const pair = routes[index];
  for (const locale of ['en', 'fr'] as const) {
    const value = pair[locale];
    if (
      typeof value !== 'string' ||
      !value.startsWith('/') ||
      !value.endsWith('/')
    ) {
      failures.push(`route pair ${index} has invalid ${locale} path`);
    }
  }
  if (!pair.fr.startsWith('/fr/')) {
    failures.push(`French route must start with /fr/: ${pair.fr}`);
  }
}

for (const locale of ['en', 'fr'] as const) {
  const values = routes.map((pair) => pair[locale]);
  if (new Set(values).size !== values.length) {
    failures.push(`duplicate ${locale} route`);
  }
}

const expectedProductIds = [
  'ca168-lorawan',
  'ca168-gprs',
  'ca168-sts',
  'ca368-gprs',
  'ca368-sts',
  'water-multi-jet-plastic',
  'water-multi-jet-brass',
  'water-ultrasonic',
];

if (frenchProducts.length !== expectedProductIds.length) {
  failures.push(
    `expected ${expectedProductIds.length} French products, received ${frenchProducts.length}`,
  );
}

const actualProductIds = frenchProducts.map((product) => product.id);
if (
  [...actualProductIds].sort().join('\n') !==
  [...expectedProductIds].sort().join('\n')
) {
  failures.push('French product IDs differ from the approved eight-product scope');
}

const frenchRoutePaths = routes.map((pair) => pair.fr);
for (const product of frenchProducts) {
  const expectedPath = `/fr/produits/${product.slug}/`;
  const occurrences = frenchRoutePaths.filter((path) => path === expectedPath).length;
  if (occurrences !== 1) {
    failures.push(
      `French product ${product.id} must have exactly one route mapping; received ${occurrences}`,
    );
  }

  for (const field of ['name', 'description', 'categoryName', 'subCategoryName'] as const) {
    if (!product[field].trim()) {
      failures.push(`French product ${product.id} has an empty ${field}`);
    }
  }

  for (const field of [
    'highlights',
    'applications',
    'confirmBeforeQuote',
  ] as const) {
    if (!product[field].length || product[field].some((value) => !value.trim())) {
      failures.push(`French product ${product.id} has incomplete ${field}`);
    }
  }

  for (let index = 0; index < product.verifiedSpecs.length; index += 1) {
    const spec = product.verifiedSpecs[index];
    for (const field of ['sourceLabel', 'sourceValue', 'label', 'value'] as const) {
      if (!spec[field].trim()) {
        failures.push(
          `French product ${product.id} specification ${index} has an empty ${field}`,
        );
      }
    }
  }

  try {
    if (!getFrenchProductById(product.id)) {
      failures.push(`French product ${product.id} could not be resolved`);
    }
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }
}

if (getAllFrenchProductSlugs().length !== expectedProductIds.length) {
  failures.push('localized catalog does not expose eight product slugs');
}

const expectedCategorySlugs = [
  'compteur-electricite-prepaye-sts',
  'compteur-eau-prepaye-sts',
];
const actualCategorySlugs = Object.keys(frenchCategorySeoPages);
if (
  [...actualCategorySlugs].sort().join('\n') !==
  [...expectedCategorySlugs].sort().join('\n')
) {
  failures.push('French category slugs differ from the approved two-category scope');
}

const faqQuestions = new Set(frenchFaqItems.map((item) => item.question));
if (faqQuestions.size !== frenchFaqItems.length) {
  failures.push('French FAQ questions must be unique');
}

const sourceFaqQuestions = new Set(allFaqItems.map((item) => item.question));
for (const faq of frenchFaqTranslations) {
  if (!sourceFaqQuestions.has(faq.sourceQuestion)) {
    failures.push(`French FAQ has a missing English source: ${faq.sourceQuestion}`);
  }
  if (!faq.question.trim() || !faq.answer.trim()) {
    failures.push(`French FAQ translated from ${faq.sourceQuestion} is incomplete`);
  }
}

for (const category of Object.values(frenchCategorySeoPages)) {
  if (category.selectionSteps.length !== 5) {
    failures.push(`${category.slug} must have exactly five selection steps`);
  }
  if (category.workflowSteps.length !== 4) {
    failures.push(`${category.slug} must have exactly four workflow steps`);
  }
  if (category.quotationChecklist.length < 6) {
    failures.push(`${category.slug} must have at least six quotation checklist items`);
  }
  if (category.faqQuestions.length < 5) {
    failures.push(`${category.slug} must reference at least five FAQs`);
  }
  for (const question of category.faqQuestions) {
    if (!faqQuestions.has(question)) {
      failures.push(`${category.slug} references an unknown French FAQ: ${question}`);
    }
  }
  for (const productId of category.productIds) {
    if (!expectedProductIds.includes(productId)) {
      failures.push(`${category.slug} references an out-of-scope product: ${productId}`);
    }
  }

  const expectedPath = `/fr/produits/${category.slug}/`;
  if (frenchRoutePaths.filter((path) => path === expectedPath).length !== 1) {
    failures.push(`${category.slug} must have exactly one route mapping`);
  }
}

const visibleFrenchCopy = JSON.stringify({
  products: frenchProducts.map(({ verifiedSpecs, ...product }) => ({
    ...product,
    verifiedSpecs: verifiedSpecs.map(({ label, value }) => ({ label, value })),
  })),
  categories: frenchCategorySeoPages,
  faqs: frenchFaqItems,
});
const forbiddenPatterns: Array<[RegExp, string]> = [
  [/\b(?:TBD|TODO|FIXME|lorem ipsum)\b/i, 'unfinished drafting marker'],
  [/\b(?:request a quote|learn more|water meter|electricity meter)\b/i, 'English filler copy'],
  [
    /\b(?:certified for|approved by|guaranteed|market leader|best in class)\b/i,
    'unsupported English claim',
  ],
  [
    /\b(?:certifié pour|homologué par|garanti|leader du marché|meilleur de sa catégorie)\b/i,
    'unsupported French claim',
  ],
  [
    /\b(?:client au Cameroun|installation au Cameroun|déploiement au Cameroun)\b/i,
    'confidential customer reference',
  ],
];

for (const [pattern, description] of forbiddenPatterns) {
  if (pattern.test(visibleFrenchCopy)) {
    failures.push(`French content contains ${description}: ${pattern}`);
  }
}

const inquiryFormSource = readFileSync(
  new URL('../components/FrenchInquiryForm.tsx', import.meta.url),
  'utf8',
);
const deployWorkflowSource = readFileSync(
  new URL('../.github/workflows/deploy.yml', import.meta.url),
  'utf8',
);
const frenchEventSource = [
  inquiryFormSource,
  readFileSync(new URL('../components/Navbar.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../components/SocialSidebar.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../components/catalog/InquiryCta.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../components/catalog/ProductPdfLink.tsx', import.meta.url), 'utf8'),
].join('\n');

for (const requiredSnippet of [
  'process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT',
  'process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  "action: 'fr_inquiry'",
  "trackEvent('fr_quote_start'",
  "trackEvent('fr_quote_submit'",
  'mailto:',
  'site.whatsappUrl',
  'tabIndex={-1}',
]) {
  if (!inquiryFormSource.includes(requiredSnippet)) {
    failures.push(`French inquiry form is missing required behavior: ${requiredSnippet}`);
  }
}

for (const secretName of [
  'TURNSTILE_SECRET_KEY',
  'RESEND_API_KEY',
  'RATE_LIMIT_KEY_SECRET',
]) {
  if (inquiryFormSource.includes(secretName)) {
    failures.push(`French inquiry form must not reference Worker secret ${secretName}`);
  }
}

for (const productId of expectedProductIds) {
  if (!inquiryFormSource.includes(`'${productId}'`)) {
    failures.push(`French inquiry form allowlist is missing ${productId}`);
  }
}

const analyticsCalls = Array.from(
  inquiryFormSource.matchAll(/trackEvent\([\s\S]*?\n\s*\}\);/g),
  (match) => match[0],
);
const analyticsContextSource = inquiryFormSource.match(
  /function analyticsContext\(\) \{([\s\S]*?)\n  \}/,
)?.[1];
if (!analyticsContextSource) {
  failures.push('French inquiry form is missing the controlled analytics context');
}
for (const eventName of ['fr_quote_start', 'fr_quote_submit']) {
  if (!analyticsCalls.some((call) => call.includes(`'${eventName}'`))) {
    failures.push(`French inquiry form does not emit ${eventName}`);
  }
}
for (const call of analyticsCalls.filter((source) => source.includes('fr_quote_'))) {
  for (const forbiddenParameter of [
    'contactName',
    'jobRole',
    'company',
    'email',
    'whatsapp',
    'country',
    'application',
    'technicalRequirements',
    'targetPeriod',
    'notes',
    'message',
  ]) {
    if (call.includes(forbiddenParameter)) {
      failures.push(`GA4 inquiry event contains forbidden parameter ${forbiddenParameter}`);
    }
  }
}
for (const forbiddenParameter of [
  'contactName',
  'jobRole',
  'company',
  'email',
  'whatsapp',
  'country',
  'application',
  'technicalRequirements',
  'targetPeriod',
  'notes',
  'message',
]) {
  if (analyticsContextSource?.includes(forbiddenParameter)) {
    failures.push(`GA4 analytics context contains forbidden parameter ${forbiddenParameter}`);
  }
}

for (const variableName of [
  'NEXT_PUBLIC_INQUIRY_ENDPOINT',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
]) {
  if (!deployWorkflowSource.includes(`vars.${variableName}`)) {
    failures.push(`GitHub Pages workflow does not pass repository variable ${variableName}`);
  }
}
for (const eventName of [
  'fr_quote_start',
  'fr_quote_submit',
  'fr_whatsapp_click',
  'fr_email_click',
  'fr_specification_download',
  'language_switch',
]) {
  if (!frenchEventSource.includes(`'${eventName}'`)) {
    failures.push(`French analytics implementation is missing ${eventName}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(
  `i18n validation passed: ${routes.length} routes, ${frenchProducts.length} products, ${actualCategorySlugs.length} categories, ${frenchFaqItems.length} FAQs`,
);
