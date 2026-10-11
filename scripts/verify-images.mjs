import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const manifest = JSON.parse(await fs.readFile('data/image-manifest.json', 'utf8'));
const verified = new Map();
for (const [source, asset] of Object.entries(manifest)) {
  const candidates = asset.srcSet.split(', ').map(candidate => {
    const [url, descriptor] = candidate.split(' ');
    return { url, width: Number.parseInt(descriptor, 10) };
  });
  assert(candidates.some(candidate => candidate.url === asset.src), `Missing fallback: ${source}`);
  let previousWidth = 0;
  for (const { url, width } of candidates) {
    assert(width > previousWidth, `Unsorted/duplicate widths: ${source}`);
    previousWidth = width;
    const metadata = await sharp(`public${url}`).metadata();
    assert.equal(metadata.width, width, `Inaccurate srcset descriptor: ${url}`);
    assert(Math.abs(metadata.height - width * asset.height / asset.width) <= 1, `Distorted ratio: ${url}`);
    assert(width <= asset.width, `Upscaled image: ${url}`);
    assert(!metadata.exif, `Unexpected EXIF: ${url}`);
    assert.deepEqual(await fs.readFile(`out${url}`), await fs.readFile(`public${url}`), `Stale/missing export: ${url}`);
    verified.set(url, metadata);
  }
}
const screenshot = manifest['/images/projects/meter-platform.png'].srcSet.split(', ').at(-1).split(' ')[0];
const originalPixels = await sharp('public/images/projects/meter-platform.png').rotate().ensureAlpha().raw().toBuffer();
const deliveredPixels = await sharp(`public${screenshot}`).ensureAlpha().raw().toBuffer();
assert.deepEqual(deliveredPixels, originalPixels, 'Platform screenshot must remain pixel-identical at full resolution');
for (const name of ['multi-jet-plastic-1', 'multi-jet-brass-1', 'ultrasonic-1']) {
  const source = `/images/products/water/${name}.webp`;
  const largest = manifest[source].srcSet.split(', ').at(-1).split(' ')[0];
  assert.deepEqual(await fs.readFile(`public${source}`), await fs.readFile(`public${largest}`), `Water master recompressed: ${name}`);
}
async function htmlFiles(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(file));
    else if (entry.name.endsWith('.html')) files.push(file);
  }
  return files;
}
const files = await htmlFiles('out');
let imageCount = 0;
for (const file of files) {
  const html = await fs.readFile(file, 'utf8');
  for (const [tag] of html.matchAll(/<(?:img|source)\b[^>]*>/g)) {
    const attributes = Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1].toLowerCase(), match[2]]));
    if (tag.startsWith('<img')) {
      assert(attributes.alt?.trim(), `Missing alt: ${file}`);
      if (attributes.src?.startsWith('/images/')) {
        assert(verified.has(attributes.src), `Unoptimized/missing rendered image: ${file} ${attributes.src}`);
        assert(attributes.sizes, `Missing responsive sizes: ${file}`);
        assert(attributes.width && attributes.height || attributes.style?.includes('position:absolute'), `Missing reserved dimensions: ${file}`);
        if (attributes.fetchpriority === 'high') assert.equal(attributes.loading, 'eager');
        imageCount++;
      }
    }
    if (attributes.srcset) {
      for (const candidate of attributes.srcset.split(', ')) {
        const [url] = candidate.split(' ');
        if (url.startsWith('/images/')) assert(verified.has(url), `Broken srcset: ${file} ${url}`);
      }
    }
  }
}
const homepage = await fs.readFile('out/index.html', 'utf8');
const renderedTags = [...homepage.matchAll(/<(?:img|source)\b[^>]*>/g)].map(match => match[0]).join('\n');
assert(renderedTags.includes('banner-product-mobile'), 'Missing mobile art direction');
assert(!renderedTags.includes('banner-field-') && !renderedTags.includes('banner-factory-'), 'Hidden carousel images load before first visit');
console.log(`Image verification passed: ${Object.keys(manifest).length} families, ${verified.size} decoded candidates, ${imageCount} responsive images in ${files.length} HTML files; lossless screenshot and original water masters verified.`);
