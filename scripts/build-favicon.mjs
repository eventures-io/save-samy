import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const src = join(root, "public", "samy.jpeg");
const appDir = join(root, "app");

const SOURCE_W = 608;
const CROP = 440;
const CROP_LEFT = Math.round((SOURCE_W - CROP) / 2);
const CROP_TOP = 150;

const base = sharp(readFileSync(src))
  .extract({ left: CROP_LEFT, top: CROP_TOP, width: CROP, height: CROP });

async function pngBuffer(size) {
  return base
    .clone()
    .resize(size, size, { fit: "cover" })
    .ensureAlpha()
    .png({ compressionLevel: 9, force: true })
    .toBuffer();
}

async function writePng(size, outName) {
  const buf = await pngBuffer(size);
  writeFileSync(join(appDir, outName), buf);
  console.log(`wrote ${outName} (${size}x${size}, ${buf.length} bytes)`);
}

function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  const images = [];
  let offset = 6 + pngs.length * 16;
  for (const { size, buf } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    images.push(buf);
    offset += buf.length;
  }
  return Buffer.concat([header, ...entries, ...images]);
}

await writePng(32, "icon.png");
await writePng(180, "apple-icon.png");

const icoSizes = [16, 32, 48];
const icoPngs = await Promise.all(icoSizes.map(async (size) => ({ size, buf: await pngBuffer(size) })));
const ico = buildIco(icoPngs);
writeFileSync(join(appDir, "favicon.ico"), ico);
console.log(`wrote favicon.ico (${icoSizes.join("+")}, ${ico.length} bytes)`);
