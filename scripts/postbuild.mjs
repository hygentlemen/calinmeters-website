import { copyFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://calinmeters.com';
const OUT_DIR = path.resolve('out');

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

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

await copyFile(path.resolve('public/CNAME'), path.join(OUT_DIR, 'CNAME'));

const htmlFiles = await walk(OUT_DIR);
const routes = htmlFiles
  .filter((file) => file.endsWith('.html'))
  .map(routeFromHtml)
  .filter(Boolean)
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

const urlEntries = routes
  .map((route) => `  <url>\n    <loc>${escapeXml(new URL(route, SITE_URL).toString())}</loc>\n  </url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

await writeFile(path.join(OUT_DIR, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Postbuild complete: CNAME preserved and sitemap generated for ${routes.length} HTML pages.`);
