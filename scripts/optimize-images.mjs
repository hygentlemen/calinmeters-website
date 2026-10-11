import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

// Original URLs remain available for external links and structured data.
const sources = [
  'banners/banner-product.jpg', 'banners/banner-field.jpg', 'banners/banner-factory.jpg',
  'company/factory.jpg', 'manufacturing/board-inspection.jpg',
  'projects/meter-installation.jpeg', 'projects/meter-platform.png',
  'products/electricity/single-phase.jpg', 'products/electricity/ca168-lorawan-1.png',
  'products/electricity/ca168-gprs-1.png', 'products/electricity/ca168-sts-1.jpg',
  'products/electricity/ca368-gprs-1.png', 'products/electricity/ca368-sts-1.png',
  'products/electricity/ct-meter.jpg', 'products/water/prepaid-water-meter.jpg',
  'products/water/multi-jet-plastic-1.webp', 'products/water/multi-jet-brass-1.webp',
  'products/water/ultrasonic-1.webp', 'products/gas/prepaid-gas-meter-front.jpg',
  'products/gas/ca768-1.png', 'products/ciu/ciu.png', 'products/dcu/dcu.png',
  'products/gateway/gateway.png',
];
const outputDirectory = 'public/images/optimized';
await fs.mkdir(outputDirectory, { recursive: true });
const banner = await fs.readFile('assets/image-sources/banner-products-desktop.png');
// Both compositions are made from seven independent transparent product photos.
const mobileBanner = await fs.readFile('assets/image-sources/banner-products-mobile.png');
const manifest = {};
const audit = [];
const retained = new Set();

for (const source of [...sources, 'banners/banner-product-mobile.webp']) {
  const key = `/images/${source}`;
  const mobile = source.endsWith('banner-product-mobile.webp');
  const input = mobile ? mobileBanner : source === 'banners/banner-product.jpg' ? banner : await fs.readFile(`public${key}`);
  const originalBytes = mobile ? 0 : (await fs.stat(`public${key}`)).size;
  const master = await sharp(input).rotate().png().toBuffer();
  const metadata = await sharp(master).metadata();
  const screenshot = source === 'projects/meter-platform.png';
  const productBanner = source === 'banners/banner-product.jpg';
  const maxWidth = Math.min(metadata.width, productBanner ? 2800 : screenshot ? 1920 : 1440);
  const widths = [...new Set([160, 320, 480, 720, 1080, ...(productBanner ? [1400, 1920, 2560] : []), maxWidth].filter(width => width <= maxWidth))].sort((a, b) => a - b);
  const variants = [];
  for (const width of widths) {
    const encoded = source.endsWith('.webp') && !mobile && width === metadata.width
      ? input // Keep the already optimized water masters; avoid lossy recompression.
      : await sharp(master).resize({ width, withoutEnlargement: true })
        .webp({ quality: productBanner || mobile ? 90 : source.includes('products/') ? 86 : 82, effort: 6, lossless: screenshot }).toBuffer();
    const hash = createHash('sha256').update(encoded).digest('hex').slice(0, 12);
    const filename = `${path.parse(source).name}-${width}-${hash}.webp`;
    await fs.writeFile(path.join(outputDirectory, filename), encoded);
    retained.add(filename);
    variants.push({ src: `/images/optimized/${filename}`, width, bytes: encoded.length });
  }
  const fallback = variants.find(variant => variant.width >= 720) ?? variants[variants.length - 1];
  manifest[key] = {
    width: metadata.width, height: metadata.height,
    src: fallback.src,
    srcSet: variants.map(variant => `${variant.src} ${variant.width}w`).join(', '),
  };
  audit.push({ source: key, originalBytes, variants });
}
// Only prune this script's generated directory; never remove original/source files.
for (const filename of await fs.readdir(outputDirectory)) {
  if (!retained.has(filename) && /^[\w-]+-\d+-[a-f0-9]{12}\.webp$/.test(filename)) await fs.unlink(path.join(outputDirectory, filename));
}
await fs.writeFile('data/image-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
await fs.mkdir('reports/image-optimization-2026-10-11', { recursive: true });
await fs.writeFile('reports/image-optimization-2026-10-11/asset-audit.json', `${JSON.stringify(audit, null, 2)}\n`);
const measured = audit.filter(item => item.originalBytes > 0);
const before = measured.reduce((sum, item) => sum + item.originalBytes, 0);
const after = measured.reduce((sum, item) => sum + item.variants[item.variants.length - 1].bytes, 0);
console.log(`${audit.length} image families generated. Original active files: ${before} bytes; largest delivered candidates: ${after} bytes (${(100 * (1 - after / before)).toFixed(1)}% smaller).`);
