/** Algorithm Dungeon props — original pixel sprites (§05.2 Zone 2, §13.2). */
import { paint } from '../draw'
import { MAZE, MAZE_COLS, MAZE_PATH, MAZE_ROWS } from '../maze'
import { sprite } from '../pixel'

const stone = {
  o: '#2a2d30',
  s: '#6f767a',
  S: '#8a9296',
  d: '#4f5559',
  k: '#15181a',
}

/** CRT terminal on a stone pedestal; cyan glyph rows are abstract, not code. */
export const terminalSprite = sprite(
  { ...stone, c: '#8a9199', C: '#b7bec4', G: '#1d3436', g: '#6fb7b9' },
  paint(24, 36, (p) => {
    p.box(1, 0, 22, 19, 'c')
    p.hline(2, 1, 20, 'C')
    p.vline(2, 1, 17, 'C')
    p.hline(2, 17, 20, 'd')
    p.box(4, 3, 16, 12, 'G')
    p.hline(6, 5, 8, 'g')
    p.hline(6, 7, 4, 'g')
    p.hline(11, 7, 5, 'g')
    p.hline(6, 9, 10, 'g')
    p.hline(6, 11, 3, 'g')
    p.rect(10, 11, 2, 2, 'g')
    p.px(19, 16, 'g')
    p.box(9, 18, 6, 5, 'd')
    p.box(2, 22, 20, 4, 'S')
    p.box(4, 25, 16, 11, 's')
    p.hline(5, 26, 14, 'S')
    p.hline(5, 30, 14, 'o')
  })
)

/** Stone doorway with a portcullis. The team door carries a three-person plaque. */
function gate(plaque: boolean) {
  return paint(28, 44, (p) => {
    p.box(0, 4, 28, 40, 's')
    p.vline(1, 5, 38, 'S')
    p.hline(1, 5, 26, 'S')
    for (const y of [14, 24, 34]) {
      p.hline(1, y, 4, 'o')
      p.hline(23, y, 4, 'o')
    }
    p.rect(5, 12, 18, 32, 'k')
    p.rect(7, 10, 14, 2, 'k')
    p.rect(9, 9, 10, 1, 'k')
    p.px(13, 7, 'S')
    p.rect(12, 6, 4, 3, 'S')
    for (const x of [7, 11, 16, 20]) p.vline(x, 10, 34, 'd')
    p.hline(5, 20, 18, 'd')
    p.hline(5, 32, 18, 'd')
    if (plaque) {
      p.box(7, 0, 14, 6, 'p')
      for (const x of [9, 13, 17]) {
        p.rect(x, 2, 2, 1, 'o')
        p.rect(x, 3, 2, 2, 'd')
      }
    }
  })
}

const gatePalette = { ...stone, p: '#e7e1d1' }
export const teamDoorSprite = sprite(gatePalette, gate(true))
export const gateSprite = sprite(gatePalette, gate(false))

/** Small wall-mounted screen — scenery only. */
export const wallScreenSprite = sprite(
  { o: '#2a2d30', c: '#6f767a', G: '#1d3436', g: '#6fb7b9' },
  paint(16, 11, (p) => {
    p.box(0, 0, 16, 11, 'c')
    p.box(2, 2, 12, 7, 'G')
    p.hline(3, 3, 6, 'g')
    p.hline(3, 5, 9, 'g')
    p.hline(3, 7, 4, 'g')
  })
)

/* ---- Floor maze: 4-px cells inside a 1-px border ---- */
const CELL = 4
const MW = MAZE_COLS * CELL + 2
const MH = MAZE_ROWS * CELL + 2
const cellX = (c: number) => 1 + c * CELL
const cellY = (r: number) => 1 + r * CELL

export const mazeSprite = sprite(
  { o: '#2a2d30', f: '#3b4043', w: '#8a9296', W: '#6f767a', g: '#6fb7b9', p: '#e7e1d1' },
  paint(MW, MH, (p) => {
    p.box(0, 0, MW, MH, 'f')
    MAZE.forEach((row, r) =>
      row.split('').forEach((ch, c) => {
        const x = cellX(c)
        const y = cellY(r)
        if (ch === '#') {
          p.rect(x, y, CELL, CELL, 'W')
          p.hline(x, y, CELL, 'w')
        } else if (ch === 'S') p.rect(x + 1, y + 1, 2, 2, 'g')
        else if (ch === 'E') p.rect(x + 1, y + 1, 2, 2, 'p')
      })
    )
  })
)

/** The BFS shortest path, drawn as a 2-px amber trail through cell centres. */
export const mazePathSprite = sprite(
  { a: '#e0a23c' },
  paint(MW, MH, (p) => {
    MAZE_PATH.forEach(([c, r], i) => {
      const x = cellX(c) + 1
      const y = cellY(r) + 1
      p.rect(x, y, 2, 2, 'a')
      const next = MAZE_PATH[i + 1]
      if (!next) return
      const nx = cellX(next[0]) + 1
      const ny = cellY(next[1]) + 1
      p.rect(Math.min(x, nx), Math.min(y, ny), Math.abs(nx - x) + 2, Math.abs(ny - y) + 2, 'a')
    })
  })
)
