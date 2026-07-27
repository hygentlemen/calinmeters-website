import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://calinmeters.com';
const OUT_DIR = path.resolve('out');
const localizedRoutePairs = JSON.parse(
  await readFile(path.resolve('data/i18n-routes.json'), 'utf8'),
);
const localizedRouteLookup = new Map(
  localizedRoutePairs.flatMap((pair) => [
    [pair.en, pair],
    [pair.fr, pair],
  ]),
);
const expectedProductSlugs = [
  'sts-prepaid-electricity-meter',
  'sts-prepaid-water-meter',
  'sts-prepaid-gas-meter',
  'ca168-lorawan-sts-prepaid-electricity-meter',
  'ca168-gprs-sts-prepaid-electricity-meter',
  'ca168-sts-prepaid-electricity-meter',
  'ca368-gprs-sts-prepaid-three-phase-electricity-meter',
  'ca368-sts-prepaid-three-phase-electricity-meter',
  'ct-operated-electricity-meter',
  'sts-prepaid-multi-jet-water-meter-plastic',
  'sts-prepaid-multi-jet-water-meter-brass',
  'sts-prepaid-ultrasonic-water-meter',
  'ca768-lorawan-sts-prepaid-gas-meter',
];
const expectedFrenchSlugs = [
  'compteur-electricite-prepaye-sts',
  'compteur-eau-prepaye-sts',
  'ca168-compteur-electricite-prepaye-sts-lorawan',
  'ca168-compteur-electricite-prepaye-sts-gprs',
  'ca168-compteur-electricite-prepaye-sts',
  'ca368-compteur-electricite-prepaye-triphase-gprs',
  'ca368-compteur-electricite-prepaye-triphase-sts',
  'ca568-compteur-eau-prepaye-multijet-plastique',
  'ca568-compteur-eau-prepaye-multijet-laiton',
  'ca568-compteur-eau-prepaye-ultrasonique',
];
const forbiddenClaims = [
  /STS certified/i,
  /multiple product certifications/i,
  /15\+\s*years/i,
  /50\+\s*countries/i,
  /18 months from the date/i,
  /over 1,000 units deployed/i,
  /up to 2 kilometers/i,
  /500 meters per LoRaWAN gateway/i,
  /client au Cameroun/i,
  /déploiement (?:au|en) (?:Cameroun|Sénégal|Côte d['’]Ivoire|Togo|Haïti)/i,
  /bureau local (?:au|en) (?:Afrique|Cameroun|Sénégal|Côte d['’]Ivoire|Togo|Haïti)/i,
];

const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  }));

  return files.flat();
}

function routeFromHtml(filePath) {
  const relative = path.relative(OUT_DIR, filePath).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (!relative.endsWith('/index.html')) return null;

  const route = `/${relative.slice(0, -'index.html'.length)}`;
  return route === '/404/' ? null : route;
}

function extractAttribute(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'));
  return match?.[1];
}

function report(route, message) {
  failures.push(`${route}: ${message}`);
}

function routeTarget(value) {
  const clean = value.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return path.join(OUT_DIR, 'index.html');
  if (path.extname(clean)) return path.join(OUT_DIR, clean.slice(1));
  return path.join(OUT_DIR, clean.slice(1), 'index.html');
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const allFiles = await walk(OUT_DIR);
const pages = allFiles
  .filter((file) => file.endsWith('.html'))
  .map((file) => ({ file, route: routeFromHtml(file) }))
  .filter((page) => page.route)
  .sort((a, b) => a.route.localeCompare(b.route));

if (pages.length !== 25) {
  failures.push(`expected exactly 25 public HTML pages, received ${pages.length}`);
}

for (const pair of localizedRoutePairs) {
  for (const route of [pair.en, pair.fr]) {
    if (!pages.some((page) => page.route === route)) {
      failures.push(`missing localized route from registry: ${route}`);
    }
  }
}

const titles = new Map();
const canonicals = new Map();

for (const page of pages) {
  const html = await readFile(page.file, 'utf8');
  const route = page.route;
  const expectedLanguage = route.startsWith('/fr/') ? 'fr' : 'en';
  const htmlLanguage = html.match(/<html[^>]*\slang=["']([^"']+)["']/i)?.[1];
  if (htmlLanguage !== expectedLanguage) {
    report(route, `html lang should be ${expectedLanguage}, received ${htmlLanguage ?? 'missing'}`);
  }
  const titleMatches = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  if (titleMatches.length !== 1 || !titleMatches[0][1].trim()) {
    report(route, `expected one non-empty title, found ${titleMatches.length}`);
  } else {
    const title = titleMatches[0][1].trim();
    if (titles.has(title)) report(route, `duplicate title also used by ${titles.get(title)}`);
    titles.set(title, route);
  }

  const descriptionTags = [...html.matchAll(/<meta\s+[^>]*name=["']description["'][^>]*>/gi)].map((match) => match[0]);
  if (descriptionTags.length !== 1 || !extractAttribute(descriptionTags[0], 'content')?.trim()) {
    report(route, `expected one non-empty meta description, found ${descriptionTags.length}`);
  }

  const canonicalTags = [...html.matchAll(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi)].map((match) => match[0]);
  const canonical = canonicalTags.length === 1 ? extractAttribute(canonicalTags[0], 'href') : undefined;
  const expectedCanonical = new URL(route, SITE_URL).toString();
  if (canonicalTags.length !== 1 || canonical !== expectedCanonical) {
    report(route, `canonical should be ${expectedCanonical}, received ${canonical ?? 'missing'}`);
  } else {
    if (canonicals.has(canonical)) report(route, `duplicate canonical also used by ${canonicals.get(canonical)}`);
    canonicals.set(canonical, route);
  }

  const alternateTags = [...html.matchAll(/<link\s+[^>]*rel=["']alternate["'][^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => extractAttribute(tag, 'hreflang'));
  const expectedPair = localizedRouteLookup.get(route);
  if (expectedPair) {
    const expectedAlternates = new Map([
      ['en', new URL(expectedPair.en, SITE_URL).toString()],
      ['fr', new URL(expectedPair.fr, SITE_URL).toString()],
      ['x-default', new URL(expectedPair.en, SITE_URL).toString()],
    ]);
    for (const [hreflang, href] of expectedAlternates) {
      const matches = alternateTags.filter(
        (tag) =>
          extractAttribute(tag, 'hreflang') === hreflang
          && extractAttribute(tag, 'href') === href,
      );
      if (matches.length !== 1) {
        report(route, `expected one ${hreflang} alternate to ${href}, found ${matches.length}`);
      }
    }
    if (alternateTags.length !== expectedAlternates.size) {
      report(route, `expected exactly ${expectedAlternates.size} hreflang alternates, found ${alternateTags.length}`);
    }
  } else if (alternateTags.some((tag) => extractAttribute(tag, 'hreflang') === 'fr')) {
    report(route, 'unmapped English page has an invented French alternate');
  }

  const h1Matches = [...html.matchAll(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi)];
  if (h1Matches.length !== 1) report(route, `expected one H1, found ${h1Matches.length}`);

  const jsonLdBlocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  if (jsonLdBlocks.length === 0) report(route, 'missing JSON-LD');
  const parsedJsonLd = [];
  for (const [, json] of jsonLdBlocks) {
    try {
      parsedJsonLd.push(JSON.parse(json));
    } catch (error) {
      report(route, `invalid JSON-LD: ${error.message}`);
    }
  }

  if (route.startsWith('/fr/')) {
    const graphNodes = parsedJsonLd.flatMap((block) =>
      Array.isArray(block?.['@graph']) ? block['@graph'] : [block],
    );
    const pageNode = graphNodes.find((node) =>
      ['WebPage', 'CollectionPage'].includes(node?.['@type']),
    );
    if (pageNode?.inLanguage !== 'fr-FR') {
      report(route, 'French webpage JSON-LD must declare inLanguage fr-FR');
    }
    if (!/<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
      report(route, 'French page must remain noindex until professional copy review');
    }
    for (const englishHeading of [
      'Verified specifications',
      'Request a quote',
      'Back to',
      'Published specifications',
      'View product details',
    ]) {
      if (html.includes(`>${englishHeading}<`)) {
        report(route, `contains English-only UI heading: ${englishHeading}`);
      }
    }
  }

  if (/href=["']#["']/i.test(html)) report(route, 'contains placeholder href="#"');
  for (const pattern of forbiddenClaims) {
    if (pattern.test(html)) report(route, `contains unsupported claim matching ${pattern}`);
  }

  const localReferences = [...html.matchAll(/(?:href|src)=["'](\/(?!\/)[^"']*)["']/gi)].map((match) => match[1]);
  for (const reference of new Set(localReferences)) {
    if (reference.startsWith('/_next/')) continue;
    const target = routeTarget(reference);
    if (!(await exists(target))) report(route, `broken local reference ${reference}`);
  }
}

for (const slug of expectedProductSlugs) {
  const file = path.join(OUT_DIR, 'products', slug, 'index.html');
  if (!(await exists(file))) failures.push(`missing expected product route /products/${slug}/`);
}
for (const slug of expectedFrenchSlugs) {
  const file = path.join(OUT_DIR, 'fr', 'produits', slug, 'index.html');
  if (!(await exists(file))) failures.push(`missing expected French route /fr/produits/${slug}/`);
}

const sitemap = await readFile(path.join(OUT_DIR, 'sitemap.xml'), 'utf8');
if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
  failures.push('sitemap is missing the XHTML namespace');
}
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const page of pages) {
  const url = new URL(page.route, SITE_URL).toString();
  const occurrences = sitemapUrls.filter((candidate) => candidate === url).length;
  if (occurrences !== 1) failures.push(`sitemap contains ${occurrences} entries for ${url}`);
}
if (sitemapUrls.length !== pages.length) {
  failures.push(`sitemap has ${sitemapUrls.length} URLs but export has ${pages.length} public HTML pages`);
}
if (sitemapUrls.length !== 25) {
  failures.push(`expected exactly 25 sitemap URLs, received ${sitemapUrls.length}`);
}

const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
for (const entry of sitemapEntries) {
  const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!loc) {
    failures.push('sitemap contains a URL entry without loc');
    continue;
  }
  const route = new URL(loc).pathname;
  const pair = localizedRouteLookup.get(route);
  const alternateTags = [...entry.matchAll(/<xhtml:link\s+[^>]*\/>/g)].map((match) => match[0]);

  if (!pair) {
    if (alternateTags.length !== 0) {
      failures.push(`unmapped sitemap entry ${loc} contains hreflang alternates`);
    }
    continue;
  }

  const expectedAlternates = new Map([
    ['en', new URL(pair.en, SITE_URL).toString()],
    ['fr', new URL(pair.fr, SITE_URL).toString()],
    ['x-default', new URL(pair.en, SITE_URL).toString()],
  ]);
  for (const [hreflang, href] of expectedAlternates) {
    const count = alternateTags.filter(
      (tag) =>
        extractAttribute(tag, 'hreflang') === hreflang
        && extractAttribute(tag, 'href') === href,
    ).length;
    if (count !== 1) {
      failures.push(`sitemap ${loc} has ${count} ${hreflang} alternates to ${href}`);
    }
  }
  if (alternateTags.length !== expectedAlternates.size) {
    failures.push(`sitemap ${loc} has ${alternateTags.length} alternate links instead of 3`);
  }
}

const robots = await readFile(path.join(OUT_DIR, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://calinmeters.com/sitemap.xml')) {
  failures.push('robots.txt does not reference the absolute production sitemap');
}

if (failures.length > 0) {
  console.error(`SEO verification failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO verification passed: ${pages.length} HTML pages, ${sitemapUrls.length} sitemap URLs, ${localizedRoutePairs.length} reciprocal locale pairs.`);
