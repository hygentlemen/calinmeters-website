import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://calinmeters.com';
const OUT_DIR = path.resolve('out');
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
const forbiddenClaims = [
  /STS certified/i,
  /multiple product certifications/i,
  /15\+\s*years/i,
  /50\+\s*countries/i,
  /18 months from the date/i,
  /over 1,000 units deployed/i,
  /up to 2 kilometers/i,
  /500 meters per LoRaWAN gateway/i,
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

const titles = new Map();
const canonicals = new Map();

for (const page of pages) {
  const html = await readFile(page.file, 'utf8');
  const route = page.route;
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

  const h1Matches = [...html.matchAll(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi)];
  if (h1Matches.length !== 1) report(route, `expected one H1, found ${h1Matches.length}`);

  const jsonLdBlocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  if (jsonLdBlocks.length === 0) report(route, 'missing JSON-LD');
  for (const [, json] of jsonLdBlocks) {
    try {
      JSON.parse(json);
    } catch (error) {
      report(route, `invalid JSON-LD: ${error.message}`);
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

const sitemap = await readFile(path.join(OUT_DIR, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const page of pages) {
  const url = new URL(page.route, SITE_URL).toString();
  const occurrences = sitemapUrls.filter((candidate) => candidate === url).length;
  if (occurrences !== 1) failures.push(`sitemap contains ${occurrences} entries for ${url}`);
}
if (sitemapUrls.length !== pages.length) {
  failures.push(`sitemap has ${sitemapUrls.length} URLs but export has ${pages.length} public HTML pages`);
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

console.log(`SEO verification passed: ${pages.length} HTML pages, ${sitemapUrls.length} sitemap URLs, ${expectedProductSlugs.length} product routes.`);
