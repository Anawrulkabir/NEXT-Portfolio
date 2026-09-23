/**
 * Terrain baker — draws a zone's ground and scenery into a canvas once, at
 * source resolution. The canvas is CSS-scaled by an integer factor with
 * image-rendering: pixelated, so it stays crisp (§05.1, §15.5).
 */
import type { ZoneId } from '@/content/types'
import { GROUND_Y, TILE, WORLD_HEIGHT } from '../constants'
import { drawGrid, type Sprite } from '../pixel'
import type { ZoneLayout } from '../layout'
import { GARAGE_SHELF_Y, dungeonScenery, garageScenery, workshopScenery, zones } from '../layout'
import { blendColor, tilesets, type Tile } from '../tilesets'
import { gateSprite, wallScreenSprite } from '../sprites/dungeon'

// Canvas can't read CSS variables, so placeholder zones use literal hexes
// matching the zone key colours in src/styles/tokens.css.
const placeholderHex: Record<string, string> = {
  software: '#8fa3a8',
  datacenter: '#6fb7b9',
  'physics-lab': '#a9c4d9',
  'thermal-lab': '#c9663a',
  overlook: '#2f4a34',
}

function shade(hex: string, factor: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * factor)
  const g = Math.round(((n >> 8) & 255) * factor)
  const b = Math.round((n & 255) * factor)
  return `rgb(${Math.min(r, 255)},${Math.min(g, 255)},${Math.min(b, 255)})`
}

/** Deterministic PRNG so scenery is identical on every render. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

const tileCache = new Map<string, HTMLCanvasElement>()

/** A 16×16 tile canvas; with `blend`, an ordered-dither mix toward tile b. */
function tileCanvas(a: Tile, blend?: { b: Tile; t: number }) {
  const key = blend ? `${a.key}>${blend.b.key}@${blend.t}` : a.key
  let c = tileCache.get(key)
  if (!c) {
    c = document.createElement('canvas')
    c.width = TILE
    c.height = TILE
    const ctx = c.getContext('2d')!
    if (!blend) drawGrid(ctx, a.grid, a.palette, 0, 0)
    else
      for (let y = 0; y < TILE; y++)
        for (let x = 0; x < TILE; x++) {
          const fill = blendColor(a, blend.b, blend.t, x, y)
          if (!fill) continue
          ctx.fillStyle = fill
          ctx.fillRect(x, y, 1, 1)
        }
    tileCache.set(key, c)
  }
  return c
}

const drawSprite = (ctx: CanvasRenderingContext2D, sprite: Sprite, x: number, y: number) =>
  drawGrid(ctx, sprite.frames[0], sprite.palette, x, y)

const BLEND_TILES = 2 // per side → 4 blended tiles across each boundary

/**
 * Ground rows (surface + two fill rows). The first/last two tiles blend
 * toward the neighbouring zone's tileset so boundaries change gradually.
 */
function drawGround(ctx: CanvasRenderingContext2D, zone: ZoneLayout, width: number) {
  const own = tilesets[zone.id]
  if (!own) return
  const i = zones.findIndex((z) => z.id === zone.id)
  const prev = i > 0 ? tilesets[zones[i - 1].id as ZoneId] : undefined
  const next = tilesets[zones[i + 1]?.id as ZoneId]
  const count = width / TILE
  for (let n = 0; n < count; n++) {
    const x = n * TILE
    // Share of the neighbouring set: 0.4, 0.2 entering; 0.2, 0.4 leaving.
    let other: typeof own | undefined
    let t = 0
    if (prev && n < BLEND_TILES) {
      other = prev
      t = (BLEND_TILES - n) * 0.2
    } else if (next && n >= count - BLEND_TILES) {
      other = next
      t = (n - (count - BLEND_TILES) + 1) * 0.2
    }
    const tile = (a: Tile, b?: Tile) => (b ? tileCanvas(a, { b, t }) : tileCanvas(a))
    ctx.drawImage(tile(own.top, other?.top), x, GROUND_Y)
    ctx.drawImage(tile(own.fill, other?.fill), x, GROUND_Y + TILE)
    ctx.drawImage(tile(own.fill, other?.fill), x, GROUND_Y + 2 * TILE)
  }
}

function drawWorkshop(ctx: CanvasRenderingContext2D, width: number) {
  const rand = rng(7)

  // Near hill band and a treeline (far hills are the parallax layer).
  ctx.fillStyle = '#2c3f31'
  let hy = 108
  for (let x = 0; x < width; x += 4) {
    hy = Math.max(100, Math.min(112, hy + Math.round((rand() - 0.5) * 6)))
    ctx.fillRect(x, hy, 4, GROUND_Y - hy)
  }
  for (let x = 4; x < width; x += 14 + Math.floor(rand() * 18)) {
    const h = 14 + Math.floor(rand() * 12)
    const top = GROUND_Y - h
    ctx.fillStyle = '#35503a'
    ctx.fillRect(x, top + 4, 8, h - 4)
    ctx.fillRect(x + 2, top, 4, 4)
    ctx.fillStyle = '#2a2016'
    ctx.fillRect(x + 3, GROUND_Y - 3, 2, 3)
  }

  // Lean-to: back wall planks, pegboard, two posts and a slanted roof.
  const { leanTo, pitch } = workshopScenery
  ctx.fillStyle = '#4a3a28'
  ctx.fillRect(leanTo.x, 100, leanTo.w, GROUND_Y - 100)
  ctx.fillStyle = '#3d2f20'
  for (let x = leanTo.x; x < leanTo.x + leanTo.w; x += 6) ctx.fillRect(x, 100, 1, GROUND_Y - 100)
  ctx.fillStyle = '#8a6a45'
  ctx.fillRect(leanTo.x + 36, 104, 48, 16)
  ctx.fillStyle = '#5a4630'
  for (let y = 106; y < 120; y += 3) for (let x = leanTo.x + 38; x < leanTo.x + 84; x += 3) ctx.fillRect(x, y, 1, 1)
  ctx.fillStyle = '#8a9199' // hanging tools
  ctx.fillRect(leanTo.x + 44, 107, 2, 9)
  ctx.fillRect(leanTo.x + 42, 107, 6, 2)
  ctx.fillRect(leanTo.x + 58, 108, 8, 2)
  ctx.fillRect(leanTo.x + 64, 108, 2, 7)
  ctx.fillRect(leanTo.x + 74, 107, 3, 10)
  ctx.fillStyle = '#6b5238'
  ctx.fillRect(leanTo.x, 90, 3, GROUND_Y - 90)
  ctx.fillRect(leanTo.x + leanTo.w - 3, 98, 3, GROUND_Y - 98)
  for (let i = 0; i < leanTo.w + 8; i++) {
    const y = 88 + Math.floor((i * 10) / (leanTo.w + 8))
    ctx.fillStyle = '#8a6a45'
    ctx.fillRect(leanTo.x - 4 + i, y, 1, 4)
    ctx.fillStyle = '#5a4630'
    ctx.fillRect(leanTo.x - 4 + i, y + 4, 1, 1)
  }

  // Robo-soccer pitch: felt surface, low front wall, two goals.
  ctx.fillStyle = '#3e6339'
  ctx.fillRect(pitch.x, 132, pitch.w, 4)
  ctx.fillStyle = '#e7e1d1'
  ctx.fillRect(pitch.x + Math.floor(pitch.w / 2), 132, 1, 4)
  ctx.fillStyle = '#8a6a45'
  ctx.fillRect(pitch.x, 136, pitch.w, 8)
  ctx.fillStyle = '#e7e1d1'
  ctx.fillRect(pitch.x, 136, pitch.w, 1)
  ctx.fillStyle = '#6b5238'
  ctx.fillRect(pitch.x, 143, pitch.w, 1)
  for (const gx of [pitch.x - 2, pitch.x + pitch.w - 6]) {
    ctx.fillStyle = '#e7e1d1'
    ctx.fillRect(gx, 118, 8, 2)
    ctx.fillRect(gx, 118, 2, 18)
    ctx.fillRect(gx + 6, 118, 2, 18)
    ctx.fillStyle = 'rgba(231,225,209,0.35)'
    for (let y = 121; y < 136; y += 3) ctx.fillRect(gx + 2, y, 4, 1)
  }
}

/** Punch a window through the wall so the CSS sky (time of day) shows through. */
function windowHole(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frame: string) {
  ctx.fillStyle = frame
  ctx.fillRect(x - 2, y - 2, w + 4, h + 4)
  ctx.clearRect(x, y, w, h)
}

function drawDungeon(ctx: CanvasRenderingContext2D, width: number) {
  const rand = rng(21)
  const top = dungeonScenery.wallTop

  // Keep wall: stone courses with offset joints, crenellated top edge.
  ctx.fillStyle = '#3a3f44'
  ctx.fillRect(0, top, width, GROUND_Y - top)
  for (let x = 0; x < width; x += 16) {
    ctx.fillRect(x, top - 8, 10, 8)
    ctx.fillStyle = '#474d52'
    ctx.fillRect(x, top - 8, 10, 1)
    ctx.fillStyle = '#3a3f44'
  }
  for (let y = top; y < GROUND_Y; y += 8) {
    const row = (y - top) / 8
    ctx.fillStyle = '#2c3034'
    ctx.fillRect(0, y + 7, width, 1)
    for (let x = row % 2 ? 8 : 0; x < width; x += 16) ctx.fillRect(x, y, 1, 7)
    ctx.fillStyle = '#474d52'
    for (let x = row % 2 ? 9 : 1; x < width; x += 16) {
      if (rand() < 0.6) ctx.fillRect(x, y, 6 + Math.floor(rand() * 8), 1)
    }
  }

  // Pillars.
  for (const px of dungeonScenery.pillars) {
    ctx.fillStyle = '#52595e'
    ctx.fillRect(px, top - 12, 12, GROUND_Y - top + 12)
    ctx.fillStyle = '#6f767a'
    ctx.fillRect(px, top - 12, 12, 3)
    ctx.fillRect(px, top - 12, 2, GROUND_Y - top + 12)
    ctx.fillStyle = '#2c3034'
    ctx.fillRect(px + 11, top - 9, 1, GROUND_Y - top + 9)
  }

  // Entrance archway lit by a terminal glow (transition from the Workshop).
  ctx.fillStyle = '#1d2326'
  ctx.fillRect(16, 84, 28, GROUND_Y - 84)
  ctx.fillRect(20, 80, 20, 4)
  ctx.fillRect(24, 77, 12, 3)
  ctx.fillStyle = 'rgba(111,183,185,0.18)'
  ctx.fillRect(18, 92, 24, GROUND_Y - 92)
  ctx.fillStyle = '#6f767a'
  ctx.fillRect(27, 72, 6, 5)

  // Barred slit windows.
  for (const wx of dungeonScenery.windows) {
    windowHole(ctx, wx, 56, 10, 22, '#52595e')
    ctx.fillStyle = '#2c3034'
    ctx.fillRect(wx + 3, 56, 1, 22)
    ctx.fillRect(wx + 7, 56, 1, 22)
  }

  for (const gx of dungeonScenery.gates) drawSprite(ctx, gateSprite, gx, GROUND_Y - gateSprite.h)
  for (const sx of dungeonScenery.screens) {
    drawSprite(ctx, wallScreenSprite, sx, 84)
    ctx.fillStyle = 'rgba(111,183,185,0.12)'
    ctx.fillRect(sx - 4, 95, wallScreenSprite.w + 8, 6)
  }

  // Skirting where wall meets floor.
  ctx.fillStyle = '#2c3034'
  ctx.fillRect(0, GROUND_Y - 3, width, 3)
}

function drawGarage(ctx: CanvasRenderingContext2D, width: number) {
  const { roofY, shelf, windows, lamps, crates } = garageScenery

  // Corrugated back wall under a flat roof.
  ctx.fillStyle = '#5b5048'
  ctx.fillRect(0, roofY, width, GROUND_Y - roofY)
  for (let x = 0; x < width; x += 4) {
    ctx.fillStyle = '#4d433c'
    ctx.fillRect(x, roofY + 6, 1, GROUND_Y - roofY - 6)
    ctx.fillStyle = '#6d6158'
    ctx.fillRect(x + 1, roofY + 6, 1, GROUND_Y - roofY - 6)
  }
  ctx.fillStyle = '#3d3530'
  ctx.fillRect(0, roofY, width, 6)
  ctx.fillStyle = '#7a6d62'
  ctx.fillRect(0, roofY, width, 1)

  // Roll-up door at the entrance, raised: drum, guides, bottom slats.
  ctx.fillStyle = '#2e2925'
  ctx.fillRect(4, 58, 40, GROUND_Y - 58)
  ctx.fillStyle = 'rgba(224,190,140,0.10)'
  ctx.fillRect(6, 70, 36, GROUND_Y - 70)
  ctx.fillStyle = '#8a8f93'
  ctx.fillRect(2, 52, 44, 6)
  ctx.fillStyle = '#a9aeb2'
  ctx.fillRect(2, 52, 44, 1)
  ctx.fillStyle = '#6d7276'
  for (let y = 58; y < 66; y += 2) ctx.fillRect(4, y, 40, 1)
  ctx.fillStyle = '#6d7276'
  ctx.fillRect(2, 58, 2, GROUND_Y - 58)
  ctx.fillRect(44, 58, 2, GROUND_Y - 58)

  for (const wx of windows) {
    windowHole(ctx, wx, 58, 24, 14, '#3d3530')
    ctx.fillStyle = '#3d3530'
    ctx.fillRect(wx + 11, 58, 2, 14)
  }

  // Hanging lamps with a warm spill.
  for (const lx of lamps) {
    ctx.fillStyle = '#2e2925'
    ctx.fillRect(lx + 5, roofY + 6, 1, 14)
    ctx.fillStyle = '#6d7276'
    ctx.fillRect(lx, roofY + 20, 11, 3)
    ctx.fillStyle = '#e8d9a0'
    ctx.fillRect(lx + 3, roofY + 23, 5, 1)
    ctx.fillStyle = 'rgba(232,217,160,0.07)'
    ctx.fillRect(lx - 10, roofY + 24, 31, GROUND_Y - roofY - 24)
  }

  // Trophy shelf on brackets, with a storage box beside the trophy.
  ctx.fillStyle = '#8a6a45'
  ctx.fillRect(shelf.x, GARAGE_SHELF_Y, shelf.w, 3)
  ctx.fillStyle = '#6b5238'
  ctx.fillRect(shelf.x, GARAGE_SHELF_Y + 3, shelf.w, 1)
  ctx.fillRect(shelf.x + 4, GARAGE_SHELF_Y + 4, 2, 6)
  ctx.fillRect(shelf.x + shelf.w - 6, GARAGE_SHELF_Y + 4, 2, 6)
  ctx.fillStyle = '#9a7b4f'
  ctx.fillRect(shelf.x + 52, GARAGE_SHELF_Y - 10, 18, 10)
  ctx.fillStyle = '#7d6244'
  ctx.fillRect(shelf.x + 52, GARAGE_SHELF_Y - 6, 18, 1)

  // Stacked crates at the back.
  for (const [dx, dy, w, h] of [
    [0, 0, 28, 20],
    [30, 0, 22, 16],
    [6, 20, 22, 14],
  ]) {
    const x = crates + dx
    const y = GROUND_Y - dy - h
    ctx.fillStyle = '#7d6244'
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = '#9a7b4f'
    ctx.fillRect(x, y, w, 1)
    ctx.fillStyle = '#574230'
    ctx.fillRect(x, y + Math.floor(h / 2), w, 1)
  }

  // Extension cord along the floor to a power strip.
  ctx.fillStyle = '#1f1d1b'
  for (let x = 150; x < 340; x++) ctx.fillRect(x, GROUND_Y - 2 + (Math.floor(x / 23) % 2), 1, 1)
  ctx.fillStyle = '#d9d4c7'
  ctx.fillRect(326, GROUND_Y - 4, 14, 3)
  ctx.fillStyle = '#b5523a'
  ctx.fillRect(328, GROUND_Y - 3, 1, 1)
}

/** Phase 2 placeholder: flat colour blocks at the zone's real width (§16). */
function drawPlaceholder(ctx: CanvasRenderingContext2D, width: number, hex: string) {
  ctx.fillStyle = shade(hex, 0.28)
  ctx.fillRect(0, 96, width, GROUND_Y - 96)
  ctx.fillStyle = shade(hex, 0.36)
  for (let x = 0; x < width; x += 32) ctx.fillRect(x, 96, 1, GROUND_Y - 96)
  ctx.fillStyle = shade(hex, 0.75)
  ctx.fillRect(0, GROUND_Y, width, 2)
  ctx.fillStyle = shade(hex, 0.5)
  ctx.fillRect(0, GROUND_Y + 2, width, TILE - 2)
  ctx.fillStyle = shade(hex, 0.35)
  ctx.fillRect(0, GROUND_Y + TILE, width, WORLD_HEIGHT - GROUND_Y - TILE)
}

export function bakeZone(canvas: HTMLCanvasElement, zone: ZoneLayout) {
  const width = zone.endX - zone.startX
  canvas.width = width
  canvas.height = WORLD_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, width, WORLD_HEIGHT)
  if (zone.id === 'workshop') drawWorkshop(ctx, width)
  else if (zone.id === 'dungeon') drawDungeon(ctx, width)
  else if (zone.id === 'garage') drawGarage(ctx, width)
  else drawPlaceholder(ctx, width, placeholderHex[zone.id] ?? '#4f7a4a')
  drawGround(ctx, zone, width)
}

/** Parallax factor for the far silhouette layer (§05.1 layer 2). */
export const PARALLAX = 0.3
/** Far layer width: the parallaxed world plus room for the widest viewport. */
export const farWidth = (worldWidth: number) => Math.ceil(worldWidth * PARALLAX) + 1400

/**
 * Far silhouettes — hills, then a distant town skyline behind the later
 * zones. Translucent dark shapes so they sit in any time-of-day sky.
 */
export function bakeFar(canvas: HTMLCanvasElement, worldWidth: number) {
  const width = farWidth(worldWidth)
  canvas.width = width
  canvas.height = WORLD_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const rand = rng(3)
  const band = (base: number, amp: number, color: string, step: number) => {
    ctx.fillStyle = color
    let y = base
    for (let x = 0; x < width; x += step) {
      y = Math.max(base - amp, Math.min(base + 4, y + Math.round((rand() - 0.5) * 6)))
      ctx.fillRect(x, y, step, GROUND_Y - y)
    }
  }
  band(84, 12, 'rgba(18,26,22,0.45)', 8)
  // Distant town from the Software Workshop onward. The far layer scrolls at
  // 0.3×, so a feature meant to sit behind a zone is offset by roughly half a
  // viewport; the town also rises gradually instead of starting as a wall.
  const townStart = Math.floor(zones.find((z) => z.id === 'software')!.startX * PARALLAX) + 420
  for (let x = townStart; x < width; x += 10 + Math.floor(rand() * 14)) {
    const rise = Math.min(1, (x - townStart) / 160)
    const h = Math.round((20 + Math.floor(rand() * 30)) * rise)
    const w = 8 + Math.floor(rand() * 10)
    ctx.fillStyle = 'rgba(14,18,24,0.55)'
    ctx.fillRect(x, GROUND_Y - 30 - h, w, h + 30)
  }
  band(98, 8, 'rgba(22,32,26,0.7)', 4)
}
