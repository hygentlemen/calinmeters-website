import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Optional source preparation. Routine image builds use the committed cutouts.
const root = process.argv[2] ?? '/Volumes/My Passport/表计';
const directory = 'assets/image-sources/product-cutouts';
const sources = JSON.parse(await fs.readFile(`${directory}/sources.json`, 'utf8'));
for (const { name, source } of sources) {
  const { data, info } = await sharp(path.join(root, source)).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const count = width * height;
  const seen = new Uint8Array(count);
  const queue = new Int32Array(count);
  let start = 0, end = 0;
  const background = (i) => data[i * 4 + 3] < 8 || (data[i * 4] >= 242 && data[i * 4 + 1] >= 242 && data[i * 4 + 2] >= 242);
  const enqueue = (i) => {
    if (!seen[i] && background(i)) { seen[i] = 1; queue[end++] = i; }
  };
  // Remove only edge-connected white backdrop; keep enclosed white product parts.
  const hasTransparency = data.some((value, index) => index % 4 === 3 && value === 0);
  if (!hasTransparency) {
    for (let x = 0; x < width; x++) { enqueue(x); enqueue((height - 1) * width + x); }
    for (let y = 0; y < height; y++) { enqueue(y * width); enqueue(y * width + width - 1); }
    while (start < end) {
      const i = queue[start++], x = i % width;
      data[i * 4 + 3] = 0;
      if (x > 0) enqueue(i - 1);
      if (x < width - 1) enqueue(i + 1);
      if (i >= width) enqueue(i - width);
      if (i < count - width) enqueue(i + width);
    }
  }
  // Keep the product component, excluding the separate corner logo and dust.
  seen.fill(0);
  let largest = [];
  for (let seed = 0; seed < count; seed++) {
    if (seen[seed] || data[seed * 4 + 3] < 8) continue;
    start = 0; end = 1; queue[0] = seed; seen[seed] = 1;
    const add = (i) => {
      if (!seen[i] && data[i * 4 + 3] >= 8) { seen[i] = 1; queue[end++] = i; }
    };
    while (start < end) {
      const i = queue[start++], x = i % width;
      if (x > 0) add(i - 1);
      if (x < width - 1) add(i + 1);
      if (i >= width) add(i - width);
      if (i < count - width) add(i + width);
    }
    if (end > largest.length) largest = queue.slice(0, end);
  }
  const keep = new Uint8Array(count);
  let left = width, top = height, right = 0, bottom = 0;
  for (const i of largest) {
    keep[i] = 1;
    const x = i % width, y = Math.floor(i / width);
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  for (let i = 0; i < count; i++) if (!keep[i]) data[i * 4 + 3] = 0;
  await sharp(data, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .png({ compressionLevel: 9 }).toFile(`${directory}/${name}.png`);
  console.log(`${name}: ${right - left + 1} × ${bottom - top + 1} transparent cutout`);
}
