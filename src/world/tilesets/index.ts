/**
 * Ground tilesets per zone (§05.1, §13.2): a surface tile for the walk row
 * and a fill tile for the two rows beneath it. Zone boundaries blend the two
 * neighbouring sets over four tiles (see blendTile).
 */
import type { ZoneId } from '@/content/types'
import { TILE } from '../constants'
import { paint } from '../draw'
import type { Grid, Palette } from '../pixel'
import { dirtTile, grassTile, groundPalette } from './workshop'

export type Tile = { key: string; grid: Grid; palette: Palette }
export type Tileset = { top: Tile; fill: Tile }

/** Deterministic speckle so generated tiles have texture but never change. */
function speckle(seed: number, ch: string, count: number) {
  return (p: { px: (x: number, y: number, c: string) => void }, y0 = 0) => {
    let s = seed
    for (let i = 0; i < count; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff
      const x = s % TILE
      const y = y0 + ((s >> 8) % (TILE - y0))
      p.px(x, y, ch)
    }
  }
}

const stonePalette: Palette = { S: '#9aa1a6', s: '#7d8488', d: '#5f666a', j: '#3b4043', k: '#2c3033' }

const slabTop: Grid = paint(TILE, TILE, (p) => {
  p.rect(0, 0, TILE, TILE, 'd')
  p.rect(0, 0, TILE, 6, 's')
  p.hline(0, 0, TILE, 'S')
  p.vline(9, 0, 6, 'j')
  p.hline(0, 6, TILE, 'j')
  p.vline(4, 7, 5, 'k')
  p.vline(12, 7, 5, 'k')
  p.hline(0, 12, TILE, 'k')
  speckle(3, 'j', 5)(p, 7)
})

const stoneFill: Grid = paint(TILE, TILE, (p) => {
  p.rect(0, 0, TILE, TILE, 'd')
  p.hline(0, 7, TILE, 'k')
  p.hline(0, 15, TILE, 'k')
  p.vline(5, 0, 7, 'k')
  p.vline(13, 8, 7, 'k')
  speckle(11, 'j', 6)(p)
})

const concretePalette: Palette = { C: '#a39a8c', c: '#8c8477', d: '#6f685e', j: '#565048', k: '#433e38' }

const concreteTop: Grid = paint(TILE, TILE, (p) => {
  p.rect(0, 0, TILE, TILE, 'd')
  p.rect(0, 0, TILE, 5, 'c')
  p.hline(0, 0, TILE, 'C')
  p.hline(0, 5, TILE, 'j')
  p.vline(15, 0, 5, 'j')
  speckle(5, 'j', 4)(p, 1)
  speckle(9, 'k', 6)(p, 6)
})

const concreteFill: Grid = paint(TILE, TILE, (p) => {
  p.rect(0, 0, TILE, TILE, 'd')
  p.hline(0, 10, TILE, 'j')
  speckle(17, 'k', 7)(p)
  speckle(23, 'c', 3)(p)
})

export const tilesets: Partial<Record<ZoneId, Tileset>> = {
  workshop: {
    top: { key: 'grass', grid: grassTile, palette: groundPalette },
    fill: { key: 'dirt', grid: dirtTile, palette: groundPalette },
  },
  dungeon: {
    top: { key: 'slab', grid: slabTop, palette: stonePalette },
    fill: { key: 'stone', grid: stoneFill, palette: stonePalette },
  },
  garage: {
    top: { key: 'concrete', grid: concreteTop, palette: concretePalette },
    fill: { key: 'foundation', grid: concreteFill, palette: concretePalette },
  },
}

// 4×4 ordered-dither matrix, applied to 2×2 pixel blocks for a chunkier blend.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

/** Colour at (x, y) of a blend of tile a → b, where t is b's share (0..1). */
export function blendColor(a: Tile, b: Tile, t: number, x: number, y: number): string | null {
  const useB = BAYER[(y >> 1) & 3][(x >> 1) & 3] / 16 < t
  const tile = useB ? b : a
  return tile.palette[tile.grid[y][x]] ?? null
}
