/**
 * Algorithm Dungeon floor maze (§05.2 Zone 2): a fixed 20×6 grid whose
 * shortest path is found with BFS once, at module load, and lit in amber when
 * the maze is hovered, focused or approached.
 */
export const MAZE: string[] = [
  'S..#.....#......#...',
  '.#.#.###.#.####.#.#.',
  '.#...#...#....#...#.',
  '.#####.#####.####.#.',
  '.....#.....#......#.',
  '####...###...####..E',
]

export const MAZE_COLS = MAZE[0].length
export const MAZE_ROWS = MAZE.length

type Cell = [number, number] // [col, row]

function find(ch: string): Cell {
  for (let r = 0; r < MAZE_ROWS; r++) {
    const c = MAZE[r].indexOf(ch)
    if (c >= 0) return [c, r]
  }
  throw new Error(`maze: no "${ch}"`)
}

/** Breadth-first search from S to E; returns the cells on the shortest path. */
export function shortestPath(grid: string[] = MAZE): Cell[] {
  const start = find('S')
  const end = find('E')
  const key = ([c, r]: Cell) => r * MAZE_COLS + c
  const prev = new Map<number, Cell | null>([[key(start), null]])
  const queue: Cell[] = [start]
  while (queue.length) {
    const cur = queue.shift()!
    if (cur[0] === end[0] && cur[1] === end[1]) break
    for (const [dc, dr] of [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ]) {
      const next: Cell = [cur[0] + dc, cur[1] + dr]
      const [c, r] = next
      if (c < 0 || r < 0 || c >= MAZE_COLS || r >= MAZE_ROWS) continue
      if (grid[r][c] === '#' || prev.has(key(next))) continue
      prev.set(key(next), cur)
      queue.push(next)
    }
  }
  if (!prev.has(key(end))) throw new Error('maze: unsolvable')
  const path: Cell[] = []
  for (let at: Cell | null = end; at; at = prev.get(key(at)) ?? null) path.unshift(at)
  return path
}

export const MAZE_PATH = shortestPath()
