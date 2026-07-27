# French Site Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an indexable, technically accurate French edition of the CalinMeters site that targets qualified prepaid-electricity and prepaid-water inquiries from Francophone Africa without weakening the existing English SEO footprint.

**Architecture:** Keep the Next.js 14 static export and GitHub Pages deployment. Move the existing English routes under an `(en)` route group and add a separate `(fr)` root layout so emitted French pages use `<html lang="fr">`. English product facts remain authoritative in `data/products.ts`; French files translate and select those facts but cannot invent new specifications. A checked English/French route registry drives switcher links, metadata alternates, sitemap `xhtml:link` entries, and reciprocal validation.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.3, Tailwind CSS, Node.js 24 in GitHub Actions, static export, GA4, Google Search Console, Cloudflare Turnstile, and the companion Cloudflare Worker defined in `docs/superpowers/plans/2026-07-26-french-inquiry-worker.md`.

---

## Global Constraints

- Production remains `https://calinmeters.com/` on GitHub Pages. Do not introduce Vercel deployment.
- Preserve `public/CNAME`, Google Analytics, `robots.txt`, `sitemap.xml`, `llms.txt`, all current English URLs, images, and PDF URLs.
- `data/products.ts` and `data/faq.ts` remain the sources of truth for technical facts. French data may translate facts and select an approved subset, but must not add unsupported capabilities, certifications, approvals, prices, market presence, warranty terms, deployment counts, or performance guarantees.
- Release exactly 11 French URLs: one homepage, two category authority pages, five electricity product pages, and three water product pages.
- Do not publish French gas, CIU, DCU, gateway, country, or Haiti pages in this release.
- Do not disclose the confidential Cameroon customer. Public market wording may describe target countries or official prepaid-meter context, but cannot imply a CalinMeters customer, deployment, approval, or local office.
- French technical PDFs remain the current English files and are visibly labelled `Fiche technique en anglais (PDF)`.
- A native or professional French technical review is a release gate before French pages become indexable.
- The inquiry form sends only to the companion Worker. Browser code never contains Resend credentials or Turnstile secret keys.
- GA4 events contain only controlled values such as locale, product ID, product family, and status. Never send name, company, email, phone, country free text, notes, or complete form payloads.
- Work test-first: add or extend a failing validation before each behavior change, make it pass, then commit.
- Multiple root layouts intentionally cause a full document load when switching between English and French in Next.js 14. Use ordinary `<a>` links for the language switcher and preserve the exact mapped URL.
- Keep all pages compatible with `output: 'export'`: dynamic routes require complete `generateStaticParams()`, and browser APIs or query-string reads must stay inside client effects.

## Exact Route Contract

Create `data/i18n-routes.json` with this complete bidirectional mapping:

```json
[
  { "en": "/", "fr": "/fr/" },
  {
    "en": "/products/sts-prepaid-electricity-meter/",
    "fr": "/fr/produits/compteur-electricite-prepaye-sts/"
  },
  {
    "en": "/products/sts-prepaid-water-meter/",
    "fr": "/fr/produits/compteur-eau-prepaye-sts/"
  },
  {
    "en": "/products/ca168-lorawan-sts-prepaid-electricity-meter/",
    "fr": "/fr/produits/ca168-compteur-electricite-prepaye-sts-lorawan/"
  },
  {
    "en": "/products/ca168-gprs-sts-prepaid-electricity-meter/",
    "fr": "/fr/produits/ca168-compteur-electricite-prepaye-sts-gprs/"
  },
  {
    "en": "/products/ca168-sts-prepaid-electricity-meter/",
    "fr": "/fr/produits/ca168-compteur-electricite-prepaye-sts/"
  },
  {
    "en": "/products/ca368-gprs-sts-prepaid-three-phase-electricity-meter/",
    "fr": "/fr/produits/ca368-compteur-electricite-prepaye-triphase-gprs/"
  },
  {
    "en": "/products/ca368-sts-prepaid-three-phase-electricity-meter/",
    "fr": "/fr/produits/ca368-compteur-electricite-prepaye-triphase-sts/"
  },
  {
    "en": "/products/sts-prepaid-multi-jet-water-meter-plastic/",
    "fr": "/fr/produits/ca568-compteur-eau-prepaye-multijet-plastique/"
  },
  {
    "en": "/products/sts-prepaid-multi-jet-water-meter-brass/",
    "fr": "/fr/produits/ca568-compteur-eau-prepaye-multijet-laiton/"
  },
  {
    "en": "/products/sts-prepaid-ultrasonic-water-meter/",
    "fr": "/fr/produits/ca568-compteur-eau-prepaye-ultrasonique/"
  }
]
```

Every mapping must emit:

- English canonical to the `en` URL.
- French canonical to the `fr` URL.
- `hreflang="en"` to the English URL.
- `hreflang="fr"` to the French URL.
- `hreflang="x-default"` to the English URL.
- The same three alternates in the matching sitemap `<url>` entries.

Existing English pages that have no French counterpart keep only their canonical; they do not receive a misleading French alternate.

## Exact French Product Scope

| Source product ID | French slug | French H1/product name |
|---|---|---|
| `ca168-lorawan` | `ca168-compteur-electricite-prepaye-sts-lorawan` | `Compteur électrique prépayé STS CA168-S-NS06 sur rail DIN avec LoRaWAN` |
| `ca168-gprs` | `ca168-compteur-electricite-prepaye-sts-gprs` | `Compteur électrique prépayé STS CA168-CS23 avec communication GPRS` |
| `ca168-sts` | `ca168-compteur-electricite-prepaye-sts` | `Compteur électrique prépayé STS monophasé CA168` |
| `ca368-gprs` | `ca368-compteur-electricite-prepaye-triphase-gprs` | `Compteur électrique prépayé STS triphasé CA368-WS23 avec GPRS` |
| `ca368-sts` | `ca368-compteur-electricite-prepaye-triphase-sts` | `Compteur électrique prépayé STS triphasé CA368-WS21` |
| `water-multi-jet-plastic` | `ca568-compteur-eau-prepaye-multijet-plastique` | `Compteur d'eau prépayé STS CA568-R01 multijet en plastique` |
| `water-multi-jet-brass` | `ca568-compteur-eau-prepaye-multijet-laiton` | `Compteur d'eau prépayé STS CA568-R01 multijet en laiton` |
| `water-ultrasonic` | `ca568-compteur-eau-prepaye-ultrasonique` | `Compteur d'eau prépayé STS ultrasonique CA568-R22` |

## File Map

Create:

- `app/(en)/layout.tsx`
- `app/(en)/page.tsx`
- `app/(en)/products/[slug]/page.tsx`
- `app/(fr)/layout.tsx`
- `app/(fr)/fr/page.tsx`
- `app/(fr)/fr/produits/[slug]/page.tsx`
- `components/HomePage.tsx`
- `components/LanguageSwitcher.tsx`
- `components/FrenchInquiryForm.tsx`
- `data/i18n-routes.json`
- `data/locales/types.ts`
- `data/locales/en/common.ts`
- `data/locales/fr/common.ts`
- `data/locales/fr/home.ts`
- `data/locales/fr/products.ts`
- `data/locales/fr/seoPages.ts`
- `data/locales/fr/faq.ts`
- `lib/i18n.ts`
- `lib/localizedCatalog.ts`
- `scripts/verify-i18n.ts`
- `docs/FRENCH-COPY-REVIEW.md`
- `docs/SEO-GEO-OPERATIONS.md`

Move:

- `app/layout.tsx` to `app/(en)/layout.tsx`
- `app/page.tsx` to `app/(en)/page.tsx`
- `app/products/[slug]/page.tsx` to `app/(en)/products/[slug]/page.tsx`

Modify:

- `components/AboutSection.tsx`
- `components/BannerCarousel.tsx`
- `components/ContactSection.tsx`
- `components/FaqSection.tsx`
- `components/FeaturesSection.tsx`
- `components/Footer.tsx`
- `components/Navbar.tsx`
- `components/ProductsSection.tsx`
- `components/SocialSidebar.tsx`
- `components/SolutionsSection.tsx`
- `components/catalog/Breadcrumbs.tsx`
- `components/catalog/CategoryAuthorityPage.tsx`
- `components/catalog/InquiryCta.tsx`
- `components/catalog/ProductDetailPage.tsx`
- `components/catalog/ProductPdfLink.tsx`
- `lib/site.ts`
- `scripts/postbuild.mjs`
- `scripts/verify-seo.mjs`
- `scripts/daily-analytics-report.mjs`
- `scripts/seo-geo-weekly-issue.mjs`
- `.github/workflows/deploy.yml`
- `package.json`
- `package-lock.json`
- `public/llms.txt`
- `README.md`

Delete after successful moves:

- `app/layout.tsx`
- `app/page.tsx`
- `app/products/[slug]/page.tsx`

---

### Task 1: Add the locale registry and route-group foundation

**Files:**

- Create: `data/i18n-routes.json`
- Create: `lib/i18n.ts`
- Create: `scripts/verify-i18n.ts`
- Move: `app/layout.tsx` → `app/(en)/layout.tsx`
- Move: `app/page.tsx` → `app/(en)/page.tsx`
- Move: `app/products/[slug]/page.tsx` → `app/(en)/products/[slug]/page.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Write the failing registry validation**

Create `scripts/verify-i18n.ts` with these first checks:

```ts
import { readFile } from 'node:fs/promises';

const routes = JSON.parse(
  await readFile(new URL('../data/i18n-routes.json', import.meta.url), 'utf8'),
);
const failures = [];
const expectedCount = 11;

if (routes.length !== expectedCount) {
  failures.push(`expected ${expectedCount} localized route pairs, received ${routes.length}`);
}

for (const [index, pair] of routes.entries()) {
  for (const locale of ['en', 'fr']) {
    const value = pair[locale];
    if (typeof value !== 'string' || !value.startsWith('/') || !value.endsWith('/')) {
      failures.push(`route pair ${index} has invalid ${locale} path`);
    }
  }
  if (!pair.fr.startsWith('/fr/')) {
    failures.push(`French route must start with /fr/: ${pair.fr}`);
  }
}

for (const locale of ['en', 'fr']) {
  const values = routes.map((pair) => pair[locale]);
  if (new Set(values).size !== values.length) failures.push(`duplicate ${locale} route`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`i18n registry passed: ${routes.length} route pairs`);
```

Add:

```json
"verify:i18n": "tsx scripts/verify-i18n.ts"
```

Add `"tsx": "4.23.1"` to root `devDependencies`.

Run:

```bash
npm install
npm run verify:i18n
```

Expected: fail because `data/i18n-routes.json` does not exist.

**Step 2: Add the exact route registry**

Create `data/i18n-routes.json` using the complete 11-entry contract above. Re-run:

```bash
npm run verify:i18n
```

Expected: pass with `i18n registry passed: 11 route pairs`.

**Step 3: Add typed route helpers**

Create `lib/i18n.ts`:

```ts
import routePairs from '@/data/i18n-routes.json';

export type Locale = 'en' | 'fr';

export interface LocalizedRoutePair {
  en: string;
  fr: string;
}

export const localizedRoutePairs = routePairs satisfies LocalizedRoutePair[];

export function normalizePublicPath(pathname: string) {
  const clean = pathname.split('#')[0].split('?')[0] || '/';
  return clean === '/' ? '/' : `${clean.replace(/^\/+|\/+$/g, '')}/`.replace(/^/, '/');
}

export function findLocalizedRoute(pathname: string) {
  const normalized = normalizePublicPath(pathname);
  return localizedRoutePairs.find((pair) => pair.en === normalized || pair.fr === normalized);
}

export function alternateLanguages(pathname: string) {
  const pair = findLocalizedRoute(pathname);
  if (!pair) return undefined;

  return {
    en: pair.en,
    fr: pair.fr,
    'x-default': pair.en,
  } as const;
}

export function localeSwitchPath(pathname: string, target: Locale) {
  return findLocalizedRoute(pathname)?.[target] ?? (target === 'fr' ? '/fr/' : '/');
}
```

If TypeScript rejects the JSON import, set `"resolveJsonModule": true` in `tsconfig.json`; do not duplicate the mapping in TypeScript.

**Step 4: Move the existing English routes without changing their public paths**

Use:

```bash
mkdir -p 'app/(en)/products/[slug]'
git mv app/layout.tsx 'app/(en)/layout.tsx'
git mv app/page.tsx 'app/(en)/page.tsx'
git mv 'app/products/[slug]/page.tsx' 'app/(en)/products/[slug]/page.tsx'
rmdir 'app/products/[slug]' app/products
```

In `app/(en)/layout.tsx`, change the CSS import from `./globals.css` to `../globals.css`. Do not change metadata or markup in this task.

There must be no top-level `app/layout.tsx` after the move. Both `(en)` and `(fr)` become independent root layouts, and the `/` page remains inside `(en)` as required by Next.js 14's multiple-root-layout convention.

**Step 5: Verify the no-op route migration**

Run:

```bash
npm run typecheck
npm run build
npm run verify:seo
```

Expected: all current 14 HTML pages still build; every current English canonical and URL stays unchanged.

**Step 6: Commit**

```bash
git add app data/i18n-routes.json lib/i18n.ts scripts/verify-i18n.ts package.json package-lock.json tsconfig.json
git commit -m "refactor: prepare locale route groups"
```

---

### Task 2: Add checked French translation data

**Files:**

- Create: `data/locales/types.ts`
- Create: `data/locales/en/common.ts`
- Create: `data/locales/fr/common.ts`
- Create: `data/locales/fr/home.ts`
- Create: `data/locales/fr/products.ts`
- Create: `data/locales/fr/seoPages.ts`
- Create: `data/locales/fr/faq.ts`
- Create: `lib/localizedCatalog.ts`
- Modify: `scripts/verify-i18n.ts`

**Step 1: Extend the failing validation**

Extend `scripts/verify-i18n.ts` to import `frenchProducts`, `frenchCategorySeoPages`, and French FAQs directly through `tsx`. Validate:

- exactly eight French product translations;
- IDs equal the eight IDs in the scope table;
- each French slug appears once in `data/i18n-routes.json`;
- each entry has non-empty `name`, `description`, `highlights`, `applications`, and `confirmBeforeQuote`;
- each translated verified specification includes `sourceLabel`, `sourceValue`, `label`, and `value`;
- category SEO data has exactly the two French category slugs;
- every category has five selection steps, four token/workflow steps, at least six quotation checklist items, and at least five FAQs;
- there are no unfinished drafting markers, filler English sentences, confidential customer names, or unsupported claim phrases.

Run:

```bash
npm run verify:i18n
```

Expected: fail because the French data does not exist.

**Step 2: Define strict translation types**

Create `data/locales/types.ts`:

```ts
import type { CategorySeoPage } from '@/data/seoPages';

export interface CommonMessages {
  nav: {
    products: string;
    solutions: string;
    about: string;
    faq: string;
    contact: string;
  };
  actions: {
    requestQuote: string;
    compareModels: string;
    downloadPdf: string;
    pdfEnglish: string;
    backToCategory: string;
    switchLanguage: string;
  };
  catalog: {
    verifiedSpecifications: string;
    highlights: string;
    applications: string;
    confirmBeforeQuote: string;
    relatedModels: string;
    model: string;
    home: string;
  };
  footer: {
    summary: string;
    products: string;
    contact: string;
    rights: string;
  };
}

export interface CheckedSpecTranslation {
  sourceLabel: string;
  sourceValue: string;
  label: string;
  value: string;
}

export interface FrenchProductTranslation {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryName: string;
  subCategoryName: string;
  highlights: string[];
  verifiedSpecs: CheckedSpecTranslation[];
  applications: string[];
  confirmBeforeQuote: string[];
}

export interface FrenchCategorySeoPage extends Omit<CategorySeoPage, 'productIds'> {
  productIds: string[];
}
```

**Step 3: Add complete common and homepage copy**

Use these fixed terminology choices throughout:

- STS prepaid electricity meter → `compteur électrique prépayé STS`
- STS prepaid water meter → `compteur d'eau prépayé STS`
- token → `jeton`
- vending system → `système de vente de crédit`
- Customer Interface Unit → `unité d'interface client (CIU)`
- utility → `service public d'électricité` or `service public d'eau`, according to context
- distributor/integrator → `distributeur ou intégrateur`
- request a quote → `demander un devis`
- specification PDF → `fiche technique en anglais (PDF)`

`data/locales/fr/home.ts` must contain this hero contract:

```ts
export const frenchHome = {
  title: 'Compteurs prépayés STS pour les projets d’électricité et d’eau',
  description:
    'Comparez des compteurs électriques et des compteurs d’eau prépayés STS pour les distributeurs, intégrateurs et projets de services publics.',
  eyebrow: 'Solutions de comptage prépayé',
  h1: 'Compteurs prépayés STS pour les projets d’électricité et d’eau',
  directAnswer:
    'CalinMeters fournit des compteurs prépayés STS pour l’électricité et l’eau, avec des modèles monophasés, triphasés, multijets et ultrasoniques. Nous aidons les distributeurs et intégrateurs à comparer le raccordement, le courant ou le débit, l’accès au clavier, la communication et les exigences du projet avant le devis.',
  primaryAction: 'Comparer les compteurs',
  secondaryAction: 'Demander un devis',
} as const;
```

The French homepage may reference Cameroon, Senegal, Côte d’Ivoire, Togo, or Francophone Africa only as neutral target/project contexts, never as proof of CalinMeters sales, installations, approvals, or offices. Haiti appears only as a country-selector option and internal reporting segment in this release; do not add Haiti-specific visible market copy.

**Step 4: Add complete French product translations**

Create one entry per scope-table ID in `data/locales/fr/products.ts`.

Each description must state what the current English record supports:

- `ca168-lorawan`: rail DIN, monophasé, STS, LoRaWAN, optional CIU.
- `ca168-gprs`: monophasé, clavier intégré, STS, GPRS/cellular options.
- `ca168-sts`: monophasé, clavier intégré, standalone token workflow; do not add remote communication.
- `ca368-gprs`: triphasé quatre fils, clavier, STS, GPRS/cellular options.
- `ca368-sts`: triphasé quatre fils, clavier, STS, no continuously connected cellular requirement.
- plastic water: multijet plastic body, DN15/DN20/DN25, STS keypad, published IP68, optional concentrated reading.
- brass water: multijet brass body, published size/spec range only, STS keypad, published IP68.
- ultrasonic water: no moving measuring parts, published sizes/flow/battery facts only.

For every translated `verifiedSpecs` entry, copy the exact English label/value into `sourceLabel` and `sourceValue`. `lib/localizedCatalog.ts` must throw during build if the current source record no longer contains that exact pair:

```ts
import { frenchProducts } from '@/data/locales/fr/products';
import { getProductById, type CatalogProduct } from '@/lib/catalog';

function assertSourceSpec(
  productId: string,
  sourceLabel: string,
  sourceValue: string,
  source: CatalogProduct,
) {
  const matched = source.product.verifiedSpecs?.some(
    (spec) => spec.label === sourceLabel && spec.value === sourceValue,
  );
  if (!matched) {
    throw new Error(
      `French translation for ${productId} is stale: ${sourceLabel} = ${sourceValue}`,
    );
  }
}

export function getFrenchProductBySlug(slug: string) {
  const translation = frenchProducts.find((candidate) => candidate.slug === slug);
  if (!translation) return undefined;

  const source = getProductById(translation.id);
  if (!source) throw new Error(`Missing source product ${translation.id}`);

  for (const spec of translation.verifiedSpecs) {
    assertSourceSpec(translation.id, spec.sourceLabel, spec.sourceValue, source);
  }

  return {
    ...source,
    product: {
      ...source.product,
      slug: translation.slug,
      name: translation.name,
      description: translation.description,
      highlights: translation.highlights,
      verifiedSpecs: translation.verifiedSpecs.map(({ label, value }) => ({ label, value })),
      applications: translation.applications,
      confirmBeforeQuote: translation.confirmBeforeQuote,
      specs: source.product.specs.map((spec) => ({
        ...spec,
        label: 'Fiche technique en anglais (PDF)',
      })),
    },
    category: { ...source.category, name: translation.categoryName },
    subCategory: source.subCategory
      ? { ...source.subCategory, name: translation.subCategoryName }
      : undefined,
  };
}
```

Also export `getAllFrenchProductSlugs()` and `getFrenchProductById()`.

**Step 5: Add two authority pages and French FAQs**

Create category records with these metadata and H1 values:

```ts
{
  slug: 'compteur-electricite-prepaye-sts',
  primaryKeyword: 'compteur électrique prépayé STS',
  title: 'Compteurs électriques prépayés STS pour projets',
  description:
    'Comparez des compteurs électriques prépayés STS monophasés, triphasés, sur rail DIN, GPRS et LoRaWAN pour vos projets.',
  eyebrow: 'Comptage électrique prépayé',
  h1: 'Compteurs électriques prépayés STS pour vos projets',
  productIds: ['ca168-lorawan', 'ca168-gprs', 'ca168-sts', 'ca368-gprs', 'ca368-sts']
}
```

```ts
{
  slug: 'compteur-eau-prepaye-sts',
  primaryKeyword: "compteur d'eau prépayé STS",
  title: "Compteurs d'eau prépayés STS pour projets",
  description:
    "Comparez des compteurs d'eau prépayés STS multijets en plastique ou en laiton et un modèle ultrasonique pour vos projets.",
  eyebrow: "Comptage d'eau prépayé",
  h1: "Compteurs d'eau prépayés STS pour vos projets",
  productIds: ['water-multi-jet-plastic', 'water-multi-jet-brass', 'water-ultrasonic']
}
```

Write complete French `directAnswer`, `intro`, five selection steps, four workflow steps, quotation checklist, and at least five FAQs for each category. The content must answer buyer questions about:

- electricity: single/three phase, voltage/current, built-in keypad vs CIU, standalone/GPRS/LoRaWAN, vending/key-management scope, pilot and destination requirements;
- water: pipe size/flow/pressure/temperature, multijet plastic vs brass vs ultrasonic, keypad access, valve/communication, LoRaWAN coverage planning, pilot and destination requirements.

Translate only answers supported by `data/faq.ts`. Give each French FAQ a stable French question key and make the authority page reference those exact keys.

**Step 6: Verify**

Run:

```bash
npm run verify:i18n
npm run typecheck
```

Expected: the translation source checks and all type checks pass.

**Step 7: Commit**

```bash
git add data/locales lib/localizedCatalog.ts scripts/verify-i18n.ts
git commit -m "feat: add checked French catalog content"
```

---

### Task 3: Make the shared shell and catalog components locale-aware

**Files:**

- Create: `components/LanguageSwitcher.tsx`
- Modify: `components/Navbar.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/SocialSidebar.tsx`
- Modify: `components/catalog/Breadcrumbs.tsx`
- Modify: `components/catalog/CategoryAuthorityPage.tsx`
- Modify: `components/catalog/InquiryCta.tsx`
- Modify: `components/catalog/ProductDetailPage.tsx`
- Modify: `components/catalog/ProductPdfLink.tsx`
- Modify: `data/locales/en/common.ts`
- Modify: `data/locales/fr/common.ts`

**Step 1: Add failing source-contract assertions**

Extend `scripts/verify-i18n.ts` to require:

- `Navbar`, `Footer`, `CategoryAuthorityPage`, and `ProductDetailPage` accept a `locale` or `messages` prop;
- `LanguageSwitcher` contains no browser-language redirect;
- French PDF label is present;
- no component contains a hard-coded `/products/` link that is used for French output;
- English default messages preserve the current visible English labels.

Run `npm run verify:i18n`; expect failure.

**Step 2: Add a small language switcher**

Create:

```tsx
interface LanguageSwitcherProps {
  href: string;
  label: string;
  ariaLabel: string;
}

export default function LanguageSwitcher({
  href,
  label,
  ariaLabel,
}: LanguageSwitcherProps) {
  return (
    <a
      href={href}
      hrefLang={label === 'FR' ? 'fr' : 'en'}
      aria-label={ariaLabel}
      className="rounded border border-white/40 px-2 py-1 text-sm font-semibold text-white hover:bg-white/10"
    >
      {label}
    </a>
  );
}
```

The switcher links to the exact mapped counterpart. It must not automatically redirect by browser language, IP, country, cookie, or `Accept-Language`.

Use the ordinary anchor shown above, not client-router state. A full page load between `(en)` and `(fr)` is expected behavior for independent root layouts and ensures the new root emits the correct `<html lang>`.

**Step 3: Add locale props without duplicating component trees**

Use this common prop pattern:

```ts
interface LocalizedComponentProps {
  locale?: 'en' | 'fr';
  messages?: CommonMessages;
  currentPath?: string;
}
```

English remains the default so existing callers render identically. French callers pass `frCommon`.

For catalog links, inject:

```ts
type ProductHref = (slug: string) => string;
```

English uses `(slug) => productPath(slug)`. French uses `(slug) => \`/fr/produits/${slug}/\``. Do not infer a path by translating text.

**Step 4: Localize semantic and accessibility text**

Translate:

- navbar anchors and mobile menu labels;
- breadcrumb home/category labels and `aria-label`;
- section headings and buttons;
- product comparison table headings;
- specifications, highlights, applications, related models, quote checklist;
- PDF label and link title;
- footer headings, company summary, copyright suffix;
- WhatsApp and email action labels.

Keep the legal company name, postal address, email, phone number, model numbers, technical units, and brand name unchanged.

**Step 5: Verify**

Run:

```bash
npm run verify:i18n
npm run typecheck
npm run build
npm run verify:seo
```

Expected: English output stays valid and the shared components type-check before French routes are added.

**Step 6: Commit**

```bash
git add components data/locales/en/common.ts data/locales/fr/common.ts scripts/verify-i18n.ts
git commit -m "refactor: localize shared site components"
```

---

### Task 4: Add French layouts, product routes, metadata, and structured data

**Files:**

- Create: `app/(fr)/layout.tsx`
- Create: `app/(fr)/fr/produits/[slug]/page.tsx`
- Modify: `app/(en)/layout.tsx`
- Modify: `app/(en)/products/[slug]/page.tsx`
- Modify: `lib/site.ts`
- Modify: `scripts/verify-i18n.ts`
- Modify: `scripts/verify-seo.mjs`

**Step 1: Add failing export checks**

Extend `scripts/verify-seo.mjs` with the exact 10 French product/category routes. For each French page require:

- output file exists;
- `<html lang="fr">`;
- exactly one H1;
- self-canonical;
- `en`, `fr`, and `x-default` alternate tags exactly match the registry;
- French title and description;
- JSON-LD parses and declares `inLanguage: "fr-FR"` on the webpage node;
- no English-only UI headings such as `Verified specifications`, `Request a quote`, or `Back to`;
- no unsupported claim pattern.

For mapped English pages, require reciprocal alternates. Run `npm run build`; expect failure because French routes are missing.

**Step 2: Add the independent French root layout**

`app/(fr)/layout.tsx` must import `../globals.css`, include `GoogleAnalytics`, and emit:

```tsx
<html lang="fr">
  <body>
    <GoogleAnalytics />
    {children}
  </body>
</html>
```

Its default metadata:

- `metadataBase`: `https://calinmeters.com`
- French default title and template
- French description limited to electricity and water
- Open Graph `locale: 'fr_FR'`
- canonical `/fr/`
- `robots: { index: true, follow: true }` only after Task 9 copy-review gate has passed; until then use `index: false, follow: true`.

**Step 3: Add alternate metadata to mapped English pages**

At homepage and product/category `generateMetadata`, call `alternateLanguages(path)` and set:

```ts
alternates: {
  canonical: path,
  languages: alternateLanguages(path),
}
```

Leave unmapped English product pages with their canonical and no language alternates.

**Step 4: Add French route generation**

`generateStaticParams()` returns the two French category slugs plus all eight French product slugs. `dynamicParams = false`.

The page resolver first checks `getFrenchCategorySeoPage(params.slug)`, then `getFrenchProductBySlug(params.slug)`, else calls `notFound()`.

Metadata must:

- use the translated title/description;
- set self-canonical and registry alternates;
- use `openGraph.locale = 'fr_FR'`;
- use source product/category images with absolute URLs;
- avoid claims beyond the translated source record.

**Step 5: Build French JSON-LD from translated facts**

Category graph:

- `CollectionPage` with French name, description, `inLanguage: 'fr-FR'`;
- `BreadcrumbList` with `Accueil`;
- `ItemList` linking only the approved French product URLs;
- `FAQPage` using French questions and answers.

Product graph:

- `Product` with French name, description, category, model, image, and translated checked specs;
- `WebPage` with `inLanguage: 'fr-FR'`;
- French breadcrumb;
- no Offer, AggregateRating, Review, certification, price, availability, country, or warranty nodes.

**Step 6: Verify**

Run:

```bash
npm run typecheck
npm run build
npm run verify:seo
```

Expected: 10 French product/category pages exist, reciprocal head alternates pass, and no existing English page disappears.

**Step 7: Commit**

```bash
git add app lib/site.ts scripts/verify-i18n.ts scripts/verify-seo.mjs
git commit -m "feat: add French catalog routes and metadata"
```

---

### Task 5: Add the French homepage using shared sections

**Files:**

- Create: `components/HomePage.tsx`
- Create: `app/(fr)/fr/page.tsx`
- Modify: `app/(en)/page.tsx`
- Modify: `components/BannerCarousel.tsx`
- Modify: `components/ProductsSection.tsx`
- Modify: `components/SolutionsSection.tsx`
- Modify: `components/FeaturesSection.tsx`
- Modify: `components/AboutSection.tsx`
- Modify: `components/FaqSection.tsx`
- Modify: `components/ContactSection.tsx`
- Modify: `scripts/verify-i18n.ts`
- Modify: `scripts/verify-seo.mjs`

**Step 1: Add failing homepage checks**

Require `/fr/` to have:

- `<html lang="fr">`;
- exact hero H1 from `frenchHome`;
- one H1 only;
- links to both French authority pages;
- no link to a French gas, CIU, DCU, gateway, country, or Haiti page;
- a French contact section;
- reciprocal `en`/`fr`/`x-default` alternates;
- French Organization/WebSite/WebPage JSON-LD where applicable;
- no confidential-customer or false-market wording.

Run build and expect `/fr/` missing.

**Step 2: Extract the current homepage composition**

Create `components/HomePage.tsx` as a server component that takes:

```ts
interface HomePageProps {
  locale: 'en' | 'fr';
}
```

Move the existing English section composition from `app/(en)/page.tsx` into this component without changing the current English order, visible copy, IDs, links, images, or JSON-LD. `app/(en)/page.tsx` should render `<HomePage locale="en" />`.

**Step 3: Add French section props**

For each shared homepage component, pass content rather than reading English literals internally. Use explicit typed content objects so both locales keep the same layout.

French homepage structure:

1. Hero and direct answer using `frenchHome`.
2. Two product-family cards only:
   - `Compteurs électriques prépayés STS`
   - `Compteurs d'eau prépayés STS`
3. Project-selection section for distributor/integrator buyers.
4. Technical decision section covering service, installation, communication, vending, and pilot inputs.
5. Company section with factual manufacturer/contact information only.
6. French FAQ teaser drawn from `data/locales/fr/faq.ts`.
7. French inquiry form and direct-contact fallbacks.

Do not render the gas card or create an empty French gas destination. English keeps all current product families.

**Step 4: Add French homepage metadata**

`app/(fr)/fr/page.tsx`:

```tsx
export const metadata: Metadata = {
  title: 'Compteurs prépayés STS pour l’électricité et l’eau',
  description:
    'Comparez des compteurs électriques et des compteurs d’eau prépayés STS pour les distributeurs, intégrateurs et projets de services publics.',
  alternates: {
    canonical: '/fr/',
    languages: {
      en: '/',
      fr: '/fr/',
      'x-default': '/',
    },
  },
  openGraph: {
    locale: 'fr_FR',
    url: 'https://calinmeters.com/fr/',
  },
};
```

Render `<HomePage locale="fr" />`.

**Step 5: Verify**

Run:

```bash
npm run verify:i18n
npm run typecheck
npm run build
npm run verify:seo
```

Expected: the full export has 25 public HTML pages: 14 existing English pages plus 11 French pages.

**Step 6: Commit**

```bash
git add app components data/locales/fr/home.ts scripts/verify-i18n.ts scripts/verify-seo.mjs
git commit -m "feat: add French market homepage"
```

---

### Task 6: Add the French inquiry form and privacy-safe analytics

**Files:**

- Create: `components/FrenchInquiryForm.tsx`
- Modify: `components/ContactSection.tsx`
- Modify: `components/catalog/InquiryCta.tsx`
- Modify: `.github/workflows/deploy.yml`
- Modify: `scripts/verify-i18n.ts`
- Modify: `README.md`

**Companion dependency:** Deploy the Worker plan in `docs/superpowers/plans/2026-07-26-french-inquiry-worker.md` before supplying its production endpoint to the GitHub Pages build.

**Step 1: Add failing static privacy checks**

Extend `scripts/verify-i18n.ts` to require:

- form endpoint comes from `NEXT_PUBLIC_INQUIRY_ENDPOINT`;
- public Turnstile site key comes from `NEXT_PUBLIC_TURNSTILE_SITE_KEY`;
- the Turnstile widget declares `data-action="fr_inquiry"`;
- source contains no `RESEND_API_KEY`, Turnstile secret, recipient secret, or Worker secret;
- `gtag` payloads never include field names `contactName`, `jobRole`, `company`, `email`, `whatsapp`, `country`, `application`, `technicalRequirements`, `targetPeriod`, `notes`, or `message`;
- fallback email and WhatsApp links exist;
- honeypot field is hidden and omitted from the visible tab order.

Run `npm run verify:i18n`; expect failure.

**Step 2: Implement the exact client form contract**

Create a client component with these visible fields:

| JSON key | French label | Required |
|---|---|---|
| `contactName` | `Nom du contact` | yes |
| `jobRole` | `Fonction` | yes |
| `company` | `Entreprise` | yes |
| `email` | `E-mail professionnel` | yes |
| `whatsapp` | `Numéro WhatsApp` | yes |
| `country` | `Pays ou région` | yes |
| `buyerType` | `Type d'acheteur` | yes |
| `productCategory` | `Produit recherché` | yes |
| `application` | `Application` | yes |
| `estimatedQuantity` | `Quantité estimée` | yes |
| `technicalRequirements` | `Phase/courant ou diamètre, communication et autres exigences` | yes |
| `vendingStatus` | `Système de vente de crédit STS` | yes |
| `targetPeriod` | `Période cible du pilote ou de l'achat` | yes |
| `notes` | `Notes du projet` | no |

The component also keeps an optional hidden `productId` limited to the eight approved source IDs. It is prefilled only from the controlled product CTA query and is sent to the Worker as non-PII model context.

Controlled select values:

```ts
const BUYER_TYPES = [
  ['distributor', 'Distributeur'],
  ['integrator', 'Intégrateur'],
  ['engineering_company', "Entreprise d'ingénierie"],
  ['utility', 'Service public'],
  ['property_operator', 'Gestionnaire immobilier'],
  ['industrial', 'Client industriel'],
  ['other', 'Autre'],
] as const;

const PRODUCT_CATEGORIES = [
  ['electricity', 'Compteur électrique prépayé STS'],
  ['water', "Compteur d'eau prépayé STS"],
] as const;

const VENDING_STATUSES = [
  ['existing', 'Système existant'],
  ['needed', 'Système requis'],
  ['unknown', 'À confirmer'],
] as const;
```

Also submit:

```ts
{
  sourcePage: window.location.pathname,
  language: 'fr',
  productId: allowedPrefilledProductId,
  website: honeypotValue,
  turnstileToken: turnstileResponse,
}
```

The component loads:

```html
https://challenges.cloudflare.com/turnstile/v0/api.js
```

with `async` and `defer`, then renders the explicit widget with the public site key and action `fr_inquiry`.

**Step 3: Handle success and errors**

- Disable the submit button during a request.
- Require a Turnstile token before `fetch`.
- POST JSON to the configured Worker endpoint.
- On `200` with `{ "ok": true }`, reset fields and widget, show `Votre demande a été envoyée. Nous vous répondrons par e-mail.`
- On validation error, keep the entered fields and show the returned safe field message.
- On Turnstile failure, reset the widget and ask the visitor to retry verification.
- On rate limit, show a neutral retry-later message plus email/WhatsApp fallbacks.
- On endpoint/network/server error, retain fields and show both fallbacks.
- If the endpoint or site key is absent at build time, render only direct-contact fallbacks and do not render a non-working submit button.

**Step 4: Add privacy-safe GA4 events**

Emit:

```ts
gtag('event', 'fr_quote_start', {
  interface_language: 'fr',
  product_category: selectedProductCategory,
  product_id: allowedPrefilledProductId,
  buyer_type: selectedBuyerType,
  source_path_group: sourcePage.startsWith('/fr/produits/') ? 'product' : 'home',
});
```

```ts
gtag('event', 'fr_quote_submit', {
  interface_language: 'fr',
  product_category: selectedProductCategory,
  product_id: allowedPrefilledProductId,
  buyer_type: selectedBuyerType,
  result: 'success' | 'validation_error' | 'challenge_error' | 'rate_limited' | 'server_error',
});
```

Never attach raw path when it contains query parameters. Never attach PII or free text.

**Step 5: Wire product CTA prefill**

French product inquiry links use:

```text
/fr/?product=ca168-gprs#contact
```

Use the corresponding approved source ID for each product CTA. The homepage form accepts only one of the eight allowed IDs, maps it to `electricity` or `water`, sends the ID as controlled non-PII inquiry context, and ignores every other query value. Do not put contact name, job role, email, company, WhatsApp number, application, requirements, or notes in the URL.

Because this is a static export, do not read the page `searchParams` prop or opt the route into dynamic rendering. In the client form, read `window.location.search` inside `useEffect`, validate `product` against the eight-ID allowlist, and then update the controlled product category. Do not call `useSearchParams`; this avoids a production-build Suspense requirement and keeps the initial French homepage fully pre-rendered.

**Step 6: Configure GitHub Pages build variables**

Add repository-variable passthrough to the build step:

```yaml
env:
  NEXT_PUBLIC_INQUIRY_ENDPOINT: ${{ vars.NEXT_PUBLIC_INQUIRY_ENDPOINT }}
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: ${{ vars.NEXT_PUBLIC_TURNSTILE_SITE_KEY }}
```

Document the two GitHub repository variables in `README.md`. State that the Turnstile secret and Resend key belong only in Cloudflare Worker secrets.

For local functional testing, use Cloudflare's always-pass public test site key `1x00000000000000000000AA` and the local Worker test configuration. Do not put the matching test secret in the website repository.

**Step 7: Verify**

Run:

```bash
npm run verify:i18n
npm run typecheck
npm run build
npm run verify:seo
```

Then serve the static output and test at desktop and mobile widths:

```bash
npx serve out
```

Check validation, Turnstile, success, retry, keyboard operation, focus states, and both fallback links.

**Step 8: Commit**

```bash
git add components .github/workflows/deploy.yml scripts/verify-i18n.ts README.md
git commit -m "feat: add protected French inquiry form"
```

---

### Task 7: Generate sitemap alternates and strengthen SEO verification

**Files:**

- Modify: `scripts/postbuild.mjs`
- Modify: `scripts/verify-seo.mjs`
- Modify: `scripts/verify-i18n.ts`
- Modify: `public/llms.txt`
- Modify: `package.json`

**Step 1: Add failing sitemap assertions**

Update `scripts/verify-seo.mjs` to require:

- sitemap declares `xmlns:xhtml="http://www.w3.org/1999/xhtml"`;
- every mapped English and French `<url>` entry has three exact `xhtml:link` alternates;
- reciprocal route values match `data/i18n-routes.json`;
- unmapped English pages have no invented French alternate;
- 25 `<loc>` entries match 25 exported public HTML routes exactly once.

Run `npm run build`; expect failure because `postbuild.mjs` emits no `xhtml:link`.

**Step 2: Drive sitemap alternates from the registry**

In `scripts/postbuild.mjs`, read `data/i18n-routes.json` with `readFile`, normalize each route, and build a lookup. Emit:

```xml
<url>
  <loc>https://calinmeters.com/fr/produits/ca168-compteur-electricite-prepaye-sts-gprs/</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://calinmeters.com/products/ca168-gprs-sts-prepaid-electricity-meter/" />
  <xhtml:link rel="alternate" hreflang="fr" href="https://calinmeters.com/fr/produits/ca168-compteur-electricite-prepaye-sts-gprs/" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://calinmeters.com/products/ca168-gprs-sts-prepaid-electricity-meter/" />
</url>
```

Escape all attribute values. Keep plain `<loc>`-only entries for unmapped pages.

Set the root element:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
```

Do not manually maintain `public/sitemap.xml`; `postbuild` remains responsible for the deployed `out/sitemap.xml`.

**Step 3: Add the French content to `llms.txt`**

Add a concise French section listing:

- `/fr/`;
- both French authority pages;
- all eight French product pages;
- that PDFs are in English;
- factual scope: STS electricity and water meter selection, verified published specifications, quotation inputs.

Do not say pages are independent evidence of certification, approval, country deployment, or warranty.

**Step 4: Make the validation pipeline explicit**

Update scripts:

```json
"verify": "npm run verify:i18n && npm run typecheck && npm run build && npm run verify:seo"
```

Because `npm run build` already runs `postbuild`, do not call `postbuild` separately.

**Step 5: Verify**

Run:

```bash
npm run verify
```

Expected:

- 25 exported HTML pages;
- 25 sitemap URLs;
- 11 reciprocal localized pairs;
- correct root-language attributes;
- no missing canonical, duplicate title, broken local link, unsupported claim, or malformed JSON-LD.

**Step 6: Commit**

```bash
git add scripts/postbuild.mjs scripts/verify-seo.mjs scripts/verify-i18n.ts public/llms.txt package.json
git commit -m "feat: add French hreflang sitemap validation"
```

---

### Task 8: Add French acquisition reporting to the weekly workflow

**Files:**

- Modify: `scripts/daily-analytics-report.mjs`
- Modify: `scripts/seo-geo-weekly-issue.mjs`
- Modify: `.github/workflows/daily-analytics-report.yml`
- Modify: `.github/workflows/seo-geo-weekly.yml`
- Create: `docs/SEO-GEO-OPERATIONS.md`

**Step 1: Add failing report-shape checks**

Add a `--fixture` or exported pure-renderer path to both scripts so local fixtures can assert the Markdown without Google credentials. The fixture must fail until reports include:

- French organic landing sessions;
- French Search Console clicks, impressions, CTR, and average position;
- French queries by country when Search Console returns country dimension;
- `fr_quote_start` and `fr_quote_submit` results;
- priority French landing pages with zero impressions/clicks;
- 30-day and 90-day comparison windows.

Create deterministic fixture JSON inside each script or under `scripts/fixtures/` without real visitor PII.

**Step 2: Add GA4 French segments**

Query landing pages where path begins `/fr/`. Report:

- users, sessions, engaged sessions, engagement rate;
- organic sessions;
- homepage vs category vs product page;
- inquiry starts, successful submits, error-result counts;
- product category, product ID, buyer type, and result controlled dimensions.

Do not report free-text form fields.

**Step 3: Add Search Console French segments**

Use `dimensionFilterGroups` with page contains `https://calinmeters.com/fr/`. Request:

- dimensions `page`, `query`;
- a second report with `country`, `query`;
- clicks, impressions, CTR, position;
- 30-day window with the normal Search Console processing delay;
- 90-day window for trend context.

Country is analytical context only. It must not automatically create a public country page.

**Step 4: Update the weekly issue decision gates**

Add checklist sections:

- French indexing coverage for all 11 URLs;
- reciprocal hreflang validation;
- queries for electricity and water intent;
- Cameroon/Senegal electricity interest, Côte d’Ivoire water interest, Togo electricity/water interest, and Haiti electricity signal as internal priorities only;
- content gaps derived from real queries;
- inquiry quality and spam rate;
- native-French copy corrections.

Country-page gate:

```text
Create a country-page proposal only when a country has either:
1. at least two qualified inquiries in the rolling 90 days, or
2. sustained non-brand organic query demand in the rolling 90 days,
and the team can add unique, factual value beyond changing the country name.
```

The issue must explicitly say that the current release has no country pages.

**Step 5: Verify fixture output and workflows**

Run:

```bash
node scripts/daily-analytics-report.mjs --fixture
node scripts/seo-geo-weekly-issue.mjs --fixture
actionlint .github/workflows/daily-analytics-report.yml .github/workflows/seo-geo-weekly.yml
```

If `actionlint` is unavailable, inspect with:

```bash
gh workflow view daily-analytics-report.yml --yaml
gh workflow view seo-geo-weekly.yml --yaml
```

Then run:

```bash
npm run verify
```

**Step 6: Commit**

```bash
git add scripts .github/workflows docs/SEO-GEO-OPERATIONS.md
git commit -m "feat: report French SEO and inquiry signals"
```

---

### Task 9: Complete language QA, deploy, and request indexing

**Files:**

- Create: `docs/FRENCH-COPY-REVIEW.md`
- Modify: French copy files only when the reviewer identifies corrections
- Modify: `docs/SEO-GEO-OPERATIONS.md`
- Modify: `README.md`

**Step 1: Record the professional French review**

Create `docs/FRENCH-COPY-REVIEW.md` with:

- reviewer name or vendor;
- review date;
- all 11 reviewed URLs;
- terminology decision list;
- confirmation that model numbers, units, technical values, and limitations match source PDFs/data;
- confirmation that no text implies unsupported certification, approval, deployment, customer, local office, price, warranty, or performance;
- corrections made, if any;
- final status `APPROVED FOR INDEXATION`.

Do not change `robots.index` on French pages to `true` until the file contains that final status from a real reviewer.

**Step 2: Run complete local verification**

```bash
npm ci
npm run lint
npm run verify
git diff --check
```

Expected: all pass.

**Step 3: Perform browser QA**

Serve:

```bash
npx serve out
```

Check at minimum:

- `/fr/`;
- both French category pages;
- one single-phase electricity page;
- one three-phase electricity page;
- one multi-jet water page;
- the ultrasonic water page.

At 390×844 and 1440×900 verify:

- no horizontal overflow or text clipping;
- accents display correctly;
- one visible H1;
- mobile navigation and language switcher work;
- mapped switcher links are reciprocal;
- product cards, breadcrumbs, CTA, form, WhatsApp, email, images, and PDFs work;
- keyboard focus is visible;
- form errors are associated with fields;
- Turnstile and success/error states work;
- there is no French dead-end link.

**Step 4: Deploy the companion Worker**

Follow `docs/superpowers/plans/2026-07-26-french-inquiry-worker.md`. Set the Worker production origin to `https://calinmeters.com`, configure secrets, deploy, and pass its endpoint and Turnstile public site key as GitHub repository variables.

Send one end-to-end test inquiry clearly marked as a test and verify receipt at the configured inbox. Do not record the message body or personal data in GitHub logs.

**Step 5: Enable indexation and deploy the website**

After the French review and Worker test pass:

- set French metadata robots to `index: true, follow: true`;
- run `npm run verify` again;
- commit the review record and indexation change;
- push to `main`;
- wait for `.github/workflows/deploy.yml` to finish successfully;
- verify the production homepage, one category, one product, form, `robots.txt`, `sitemap.xml`, and `llms.txt`.

**Step 6: Submit the updated sitemap**

Run the existing write-enabled workflow:

```bash
gh workflow run search-console-submit.yml
submit_run_id=$(gh run list --workflow search-console-submit.yml --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$submit_run_id" --exit-status
```

Confirm the response records success for:

```text
https://calinmeters.com/sitemap.xml
```

The OAuth token must have Search Console `webmasters` write scope and access to the exact site property. Never print or commit it.

**Step 7: Request inspection for priority French URLs**

Use the existing URL-inspection workflow for:

- `/fr/`;
- both authority pages;
- the five electricity product pages;
- the three water product pages.

Inspection does not guarantee indexing. Record coverage state and follow up through the weekly workflow rather than repeatedly resubmitting.

**Step 8: Establish measurement checkpoints**

Record launch date and baseline in `docs/SEO-GEO-OPERATIONS.md`.

- Day 30: crawl/index status, impressions, first queries, landing engagement, form reliability.
- Day 90: non-brand clicks, query clusters, country signals, qualified inquiry count, page gaps.
- Month 3–6: movement toward top-five ranking targets for qualified French electricity/water terms, page-level conversions, and country-page gate evaluation.

Treat “top five” as the target, not a guaranteed outcome.

**Step 9: Final commit**

```bash
git add app docs README.md
git commit -m "chore: approve French pages for indexation"
git push origin main
```

---

## Final Acceptance Checklist

- Exactly 11 approved French URLs are live; no French gas, auxiliary-device, country, or Haiti pages exist.
- Existing English URLs, visuals, product data, PDFs, GA4, CNAME, robots, sitemap, llms, and GitHub Pages deployment remain functional.
- Every mapped page has a self-canonical and reciprocal `en`, `fr`, `x-default` alternates in HTML and sitemap.
- Every French page emits `<html lang="fr">`, one French H1, French metadata, and French JSON-LD using checked source facts.
- All eight French product pages derive images, PDFs, IDs, models, and technical truth from `data/products.ts`.
- English PDFs are clearly labelled as English.
- The language switcher never redirects automatically.
- The French inquiry form is protected by server-validated Turnstile, rate limited by the Worker, and has working direct-contact fallbacks.
- Browser code and GA4 contain no form PII or secret.
- Native/professional French technical review is documented before indexation.
- `npm run lint`, `npm run verify`, mobile/desktop QA, Worker end-to-end test, GitHub Pages deployment, and sitemap submission pass.
- Weekly reporting covers 30-day and 90-day French search and inquiry signals while keeping country-page creation behind the evidence gate.

## Reference Sources

- Approved design: `docs/superpowers/specs/2026-07-26-french-francophone-market-design.md`
- Companion inquiry Worker plan: `docs/superpowers/plans/2026-07-26-french-inquiry-worker.md`
- STS Association overview: `https://www.sts.org.za/who-we-are/what-is-the-sts-and-who-is-the-sts-association/`
- Senelec Woyofal: `https://www.senelec.sn/woyofal/page/a-propos/`
- Eneo Cameroon prepaid portal: `https://my.eneo.cm/`
- CIE PEPT: `https://www.cie.ci/pept/achat-energie`
- SONABEL Cash Power STS notice: `https://www.sonabel.bf/actualites/communique-mise-a-jour-des-compteurs-prepayes-cash-power/`
- CEET LAFIA: `https://www.ceet.tg/tg/?page_id=70`
- Cloudflare Turnstile server-side validation: `https://developers.cloudflare.com/turnstile/get-started/server-side-validation/`
- Cloudflare Turnstile test keys: `https://developers.cloudflare.com/turnstile/troubleshooting/testing/`
- Next.js 14 route groups and multiple root layouts: `https://nextjs.org/docs/14/app/building-your-application/routing/route-groups`
- Next.js 14 static export constraints: `https://nextjs.org/docs/14/app/building-your-application/deploying/static-exports`
- Next.js 14 metadata alternates: `https://nextjs.org/docs/14/app/api-reference/functions/generate-metadata#alternates`
