#!/usr/bin/env node
/**
 * Raster images in static/images → WebP siblings (same basename).
 * Safe for GitHub Pages: outputs static files checked in after `npm run optimize-images`.
 */
import { readdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
/** All raster assets under static/ (e.g. images/, noise.png). */
const STATIC_DIR = path.join(ROOT, "static");

/** Max edge for thumbnails (grid tiles are ~200px; carousel expands to ~300px wide). */
const MAX_WIDTH = 900;
const WEBP_QUALITY = 82;

const RASTER_EXT = /\.(png|jpe?g)$/i;

async function* walkRasterFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      yield* walkRasterFiles(full);
    } else if (ent.isFile() && RASTER_EXT.test(ent.name)) {
      yield full;
    }
  }
}

async function optimizeFile(inputPath) {
  const meta = await stat(inputPath);
  if (!meta.isFile()) return null;

  const outPath = inputPath.replace(RASTER_EXT, ".webp");

  const tmpPath = `${outPath}.tmp`;
  await sharp(inputPath)
    .rotate()
    .resize({ width: MAX_WIDTH, height: MAX_WIDTH, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(tmpPath);
  await rename(tmpPath, outPath);

  return outPath;
}

async function main() {
  await stat(STATIC_DIR).catch(() => {
    console.error(`Missing directory: ${STATIC_DIR}`);
    process.exit(1);
  });

  const files = [];
  for await (const f of walkRasterFiles(STATIC_DIR)) {
    files.push(f);
  }
  if (files.length === 0) {
    console.log("No PNG/JPEG images under static/. Run from repo root.");
    return;
  }

  console.log(`Optimizing ${files.length} image(s) → WebP (max edge ${MAX_WIDTH}px)…`);
  for (const f of files) {
    try {
      const out = await optimizeFile(f);
      console.log("  ✓", path.relative(ROOT, f), "→", path.relative(ROOT, out));
    } catch (e) {
      console.error("  ✗", f, e.message || e);
    }
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
