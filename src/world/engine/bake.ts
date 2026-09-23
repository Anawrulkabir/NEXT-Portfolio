/**
 * Terrain baker — draws a zone's ground and scenery into a canvas once, at
 * source resolution. The canvas is CSS-scaled by an integer factor with
 * image-rendering: pixelated, so it stays crisp (§05.1, §15.5).
 */
import { GROUND_Y, TILE, WORLD_HEIGHT } from '../constants'
import { drawGrid } from '../pixel'
import type { ZoneLayout } from '../layout'
import { workshopScenery } from '../layout'
import { dirtTile, grassTile, groundPalette } from '../tilesets/workshop'

// Canvas can't read CSS variables, so placeholder zones use literal hexes
// matching the zone key colours in src/styles/tokens.css.
const placeholderHex: Record<string, string> = {
  dungeon: '#7c8a8f',
  garage: '#9a7b4f',
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
function tileCanvas(key: string, grid: string[]) {
  let c = tileCache.get(key)
  if (!c) {
    c = document.createElement('canvas')
    c.width = TILE
    c.height = TILE
    drawGrid(c.getContext('2d')!, grid, groundPalette, 0, 0)
    tileCache.set(key, c)
  }
  return c
}

function drawWorkshop(ctx: CanvasRenderingContext2D, width: number) {
  const rand = rng(7)

  // Far hills (two layers) and a treeline, dawn-muted.
  const hill = (base: number, amp: number, color: string, step: number) => {
    ctx.fillStyle = color
    let y = base
    for (let x = 0; x < width; x += step) {
      y = Math.max(base - amp, Math.min(base + 4, y + Math.round((rand() - 0.5) * 6)))
      ctx.fillRect(x, y, step, GROUND_Y - y)
    }
  }
  hill(92, 10, '#26332a', 8)
  hill(108, 8, '#2c3f31', 4)
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

  // Ground: one grass row, two dirt rows.
  const grass = tileCanvas('grass', grassTile)
  const dirt = tileCanvas('dirt', dirtTile)
  for (let x = 0; x < width; x += TILE) {
    ctx.drawImage(grass, x, GROUND_Y)
    ctx.drawImage(dirt, x, GROUND_Y + TILE)
    ctx.drawImage(dirt, x, GROUND_Y + 2 * TILE)
  }
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
  else drawPlaceholder(ctx, width, placeholderHex[zone.id] ?? '#4f7a4a')
}
