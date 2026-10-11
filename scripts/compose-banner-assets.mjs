import fs from 'node:fs/promises';
import sharp from 'sharp';

const directory = 'assets/image-sources';
const sources = JSON.parse(await fs.readFile(`${directory}/product-cutouts/sources.json`, 'utf8'));
const layerDirectory = 'reports/banner-correction-2026-10-11/layers';
await fs.mkdir(layerDirectory, { recursive: true });
const parts = [];
for (const { name } of sources) {
  const { data, info } = await sharp(`${directory}/product-cutouts/${name}.png`)
    .resize({ height: 490, withoutEnlargement: true }).png().toBuffer({ resolveWithObject: true });
  parts.push({ name, data, width: info.width, height: info.height });
}
const gap = 24;
const totalWidth = parts.reduce((sum, part) => sum + part.width, 0) + gap * (parts.length - 1);
let left = Math.round((2800 - totalWidth) / 2);
// Import these seven full-canvas transparent layers into a white 2800×1200
// Compositor canvas. Export the composed master as banner-products-desktop.png.
for (const [index, part] of parts.entries()) {
  await sharp({ create: { width: 2800, height: 1200, channels: 4, background: '#00000000' } })
    .composite([{ input: part.data, left, top: 1010 - part.height }]).png()
    .toFile(`${layerDirectory}/${index + 1}-${part.name}.png`);
  left += part.width + gap;
}

const mobile = [];
for (const [index, { name }] of sources.entries()) {
  const box = index < 4
    ? { width: 295, height: 475, center: 210 + index * 340, bottom: 520 }
    : { width: 355, height: 490, center: 300 + (index - 4) * 420, bottom: 1110 };
  const { data, info } = await sharp(`${directory}/product-cutouts/${name}.png`)
    .resize(box.width, box.height, { fit: 'inside', withoutEnlargement: true })
    .png().toBuffer({ resolveWithObject: true });
  mobile.push({ input: data, left: Math.round(box.center - info.width / 2), top: box.bottom - info.height });
}
await sharp({ create: { width: 1440, height: 1200, channels: 3, background: '#ffffff' } })
  .composite(mobile).png().toFile(`${directory}/banner-products-mobile.png`);

const { data: gas, info } = await sharp(`${directory}/product-cutouts/ca768-gas.png`)
  .resize(1150, 1250, { fit: 'inside', withoutEnlargement: true })
  .png().toBuffer({ resolveWithObject: true });
await sharp({ create: { width: 1440, height: 1440, channels: 3, background: '#ffffff' } })
  .composite([{ input: gas, left: Math.round((1440 - info.width) / 2), top: Math.round((1440 - info.height) / 2) }])
  .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
  .toFile('public/images/products/gas/prepaid-gas-meter-front.jpg');
console.log(`Prepared ${parts.length} Compositor layers, the mobile composition, and the front-facing gas photo.`);
