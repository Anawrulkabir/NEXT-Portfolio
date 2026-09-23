/**
 * Palette-indexed pixel grids — see docs/PORTFOLIO_REDESIGN.md §13.2.
 * A grid is an array of equal-length strings; each char maps to a colour in
 * the palette, '.' is transparent.
 */
export type Palette = Record<string, string>
export type Grid = string[]

export type Sprite = { w: number; h: number; palette: Palette; frames: Grid[] }

export type Run = { x: number; y: number; w: number; fill: string }

/** Merge horizontal runs of the same colour so an SVG needs fewer <rect>s. */
export function gridToRuns(grid: Grid, palette: Palette): Run[] {
  const runs: Run[] = []
  grid.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      if (ch === '.' || !palette[ch]) {
        x++
        continue
      }
      let end = x + 1
      while (end < row.length && row[end] === ch) end++
      runs.push({ x, y, w: end - x, fill: palette[ch] })
      x = end
    }
  })
  return runs
}

export function sprite(palette: Palette, ...frames: Grid[]): Sprite {
  const h = frames[0].length
  const w = Math.max(...frames[0].map((r) => r.length))
  return { w, h, palette, frames }
}

/** Draw a grid into a 2D context at (ox, oy), one fillRect per run. */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  palette: Palette,
  ox: number,
  oy: number
) {
  for (const run of gridToRuns(grid, palette)) {
    ctx.fillStyle = run.fill
    ctx.fillRect(ox + run.x, oy + run.y, run.w, 1)
  }
}
