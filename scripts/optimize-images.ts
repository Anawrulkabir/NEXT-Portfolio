#!/usr/bin/env tsx
/**
 * Image pipeline (§13.4). Walks public/media and:
 *   1. converts every .png/.jpg/.jpeg into a .webp sibling (max 1600 px wide,
 *      EXIF stripped) when the .webp is missing or older than its source;
 *   2. writes src/content/.generated/media.json — width, height and a tiny
 *      blur placeholder for every image — which MediaSlot reads, so content
 *      never needs hand-typed dimensions and images never shift layout.
 *
 * Usage: npm run optimize-images   (add a file, run this, commit both)
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.join(__dirname, '..')
const MEDIA = path.join(ROOT, 'public', 'media')
const OUT = path.join(ROOT, 'src', 'content', '.generated', 'media.json')
const MAX_W = 1600

type Entry = { width: number; height: number; blur: string }

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    return d.isDirectory() ? walk(p) : [p]
  })
}

async function main() {
  let converted = 0
  for (const file of walk(MEDIA)) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue
    const webp = file.replace(/\.(png|jpe?g)$/i, '.webp')
    if (fs.existsSync(webp) && fs.statSync(webp).mtimeMs >= fs.statSync(file).mtimeMs) continue
    await sharp(file).rotate().resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: 80 }).toFile(webp)
    converted++
    console.log('webp  ', path.relative(ROOT, webp))
  }

  const manifest: Record<string, Entry> = {}
  for (const file of walk(MEDIA).sort()) {
    if (!/\.(png|jpe?g|webp|avif)$/i.test(file)) continue
    const img = sharp(file).rotate()
    const meta = await img.metadata()
    const blur = await sharp(file).rotate().resize(16).webp({ quality: 40 }).toBuffer()
    const key = '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/')
    const swap = meta.orientation && meta.orientation >= 5
    manifest[key] = {
      width: (swap ? meta.height : meta.width) ?? 0,
      height: (swap ? meta.width : meta.height) ?? 0,
      blur: `data:image/webp;base64,${blur.toString('base64')}`,
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`${converted} converted · ${Object.keys(manifest).length} images in media.json`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
