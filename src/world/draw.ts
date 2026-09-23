/**
 * Tiny drawing DSL for boxy sprites: shapes are painted into a char grid,
 * which then goes through the same palette/sprite path as hand-written grids.
 * Runs once at module load — the output is plain strings.
 */
import type { Grid } from './pixel'

export type Painter = {
  rect: (x: number, y: number, w: number, h: number, ch: string) => void
  px: (x: number, y: number, ch: string) => void
  hline: (x: number, y: number, w: number, ch: string) => void
  vline: (x: number, y: number, h: number, ch: string) => void
  line: (x0: number, y0: number, x1: number, y1: number, ch: string) => void
  /** Filled box with a 1-px outline of `edge`. */
  box: (x: number, y: number, w: number, h: number, fill: string, edge?: string) => void
}

export function paint(w: number, h: number, draw: (p: Painter) => void): Grid {
  const cells: string[][] = Array.from({ length: h }, () => Array(w).fill('.'))
  const px = (x: number, y: number, ch: string) => {
    if (x >= 0 && y >= 0 && x < w && y < h) cells[y][x] = ch
  }
  const rect = (x: number, y: number, rw: number, rh: number, ch: string) => {
    for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) px(i, j, ch)
  }
  const p: Painter = {
    px,
    rect,
    hline: (x, y, lw, ch) => rect(x, y, lw, 1, ch),
    vline: (x, y, lh, ch) => rect(x, y, 1, lh, ch),
    line: (x0, y0, x1, y1, ch) => {
      const dx = Math.abs(x1 - x0)
      const dy = -Math.abs(y1 - y0)
      const sx = x0 < x1 ? 1 : -1
      const sy = y0 < y1 ? 1 : -1
      let err = dx + dy
      for (;;) {
        px(x0, y0, ch)
        if (x0 === x1 && y0 === y1) break
        const e2 = 2 * err
        if (e2 >= dy) {
          err += dy
          x0 += sx
        }
        if (e2 <= dx) {
          err += dx
          y0 += sy
        }
      }
    },
    box: (x, y, bw, bh, fill, edge = 'o') => {
      rect(x, y, bw, bh, edge)
      rect(x + 1, y + 1, bw - 2, bh - 2, fill)
    },
  }
  draw(p)
  return cells.map((row) => row.join(''))
}
