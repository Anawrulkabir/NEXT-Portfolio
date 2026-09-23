/** GPU Data Center props — original pixel sprites (§05.2 Zone 5, §13.2). No vendor logos. */
import { paint } from '../draw'
import { sprite } from '../pixel'

const metal = {
  o: '#1b1f21',
  m: '#4f575c',
  M: '#6d7479',
  k: '#2c3033',
  g: '#6fb7b9',
}

/** Open rack with a GPU card (twin fans) on a rail — pipeline stage 1. */
export const gpuRackSprite = sprite(
  { ...metal, f: '#8a9199', F: '#b7bec4' },
  paint(28, 46, (p) => {
    p.box(0, 0, 28, 46, 'k')
    p.vline(1, 1, 44, 'M')
    p.vline(26, 1, 44, 'm')
    for (let y = 4; y < 44; y += 6) p.hline(2, y, 24, 'm')
    // GPU card
    p.box(2, 17, 24, 12, 'm')
    p.hline(3, 18, 22, 'M')
    for (const cx of [8, 19]) {
      p.box(cx - 4, 19, 9, 9, 'f')
      p.rect(cx - 2, 21, 5, 5, 'F')
      p.rect(cx, 22, 1, 3, 'o')
      p.rect(cx - 1, 23, 3, 1, 'o')
    }
    p.hline(3, 28, 22, 'g')
  })
)

/** Shipping container crate — pipeline stage 2. */
export const crateSprite = sprite(
  { o: '#1f2a30', c: '#4f6b7a', C: '#6a8a9a', d: '#3a5260', p: '#e7e1d1' },
  paint(34, 24, (p) => {
    p.box(0, 0, 34, 24, 'c')
    p.hline(1, 1, 32, 'C')
    for (let x = 3; x < 32; x += 3) p.vline(x, 3, 19, 'd')
    p.vline(16, 1, 22, 'o')
    p.vline(14, 6, 12, 'p')
    p.vline(18, 6, 12, 'p')
    p.box(4, 5, 8, 5, 'p')
  })
)

/** Control console with a cluster-grid display — pipeline stage 3. */
export const consoleSprite = sprite(
  { ...metal, G: '#1d3436' },
  paint(32, 36, (p) => {
    p.box(3, 0, 26, 18, 'G')
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 4; c++) {
        const lit = (r * 4 + c) % 3 !== 2
        p.rect(6 + c * 6, 3 + r * 5, 4, 3, lit ? 'g' : 'k')
      }
    p.box(13, 17, 6, 4, 'm')
    p.box(0, 20, 32, 5, 'M')
    p.hline(3, 22, 10, 'k')
    p.px(20, 22, 'g')
    p.px(23, 22, 'g')
    p.box(3, 24, 26, 12, 'm')
    p.hline(4, 28, 24, 'k')
  })
)

/** Conveyor with parcels — pipeline stage 4 (session lifecycle). */
export const conveyorSprite = sprite(
  { ...metal, b: '#9a7b4f', B: '#b8956a', t: '#6b5238' },
  paint(44, 22, (p) => {
    p.box(2, 0, 11, 9, 'b')
    p.hline(3, 1, 9, 'B')
    p.vline(7, 1, 7, 't')
    p.box(17, 2, 9, 7, 'B')
    p.hline(18, 5, 7, 't')
    p.box(30, 1, 11, 8, 'b')
    p.hline(31, 2, 9, 'B')
    p.box(0, 9, 44, 5, 'k')
    for (let x = 3; x < 42; x += 5) p.rect(x, 11, 2, 1, 'M')
    p.hline(1, 10, 42, 'm')
    p.box(3, 14, 4, 8, 'm')
    p.box(37, 14, 4, 8, 'm')
    p.hline(3, 17, 38, 'm')
  })
)

/** Desk pod with a notebook-style screen — pipeline stage 5 (AI workspace). */
export const podSprite = sprite(
  { ...metal, G: '#1d3436', p: '#e7e1d1', b: '#a9c4d9' },
  paint(34, 36, (p) => {
    p.box(0, 0, 34, 36, 'm')
    p.rect(1, 1, 32, 2, 'M')
    p.box(5, 5, 24, 15, 'G')
    for (let y = 7; y < 18; y += 4) {
      p.rect(7, y, 2, 2, 'b')
      p.hline(10, y, 16, 'p')
      p.hline(10, y + 1, 10, 'g')
    }
    p.box(14, 19, 6, 4, 'k')
    p.box(3, 22, 28, 4, 'M')
    p.hline(6, 23, 12, 'k')
    p.rect(3, 26, 28, 10, 'k')
  })
)

/** Loading bay opening to the sky — pipeline stage 6 (cloud). Its interior is
 *  transparent; the baker punches a hole in the wall behind it so the real
 *  sky shows through. */
export const cloudGateSprite = sprite(
  { ...metal, y: '#b8956a', Y: '#2b2418', w: '#e7e1d1', W: '#c9cfd2' },
  paint(36, 48, (p) => {
    p.box(0, 0, 36, 48, '.')
    p.box(1, 1, 34, 6, 'M')
    p.rect(1, 1, 3, 47, 'M')
    p.rect(32, 1, 3, 47, 'M')
    for (let x = 4; x < 32; x += 4) {
      p.rect(x, 2, 2, 4, 'y')
      p.rect(x + 2, 2, 2, 4, 'Y')
    }
    // a small cloud
    p.rect(12, 16, 10, 3, 'w')
    p.rect(14, 14, 5, 2, 'w')
    p.rect(11, 19, 13, 1, 'W')
  })
)

/** Glowing core in a glass cylinder — the TensorCode reactor. */
export const reactorSprite = sprite(
  { ...metal, l: '#a9c4d9', c: '#6fb7b9', C: '#dff3f3' },
  paint(22, 50, (p) => {
    p.box(1, 0, 20, 5, 'M')
    p.box(3, 4, 16, 38, 'l')
    p.rect(4, 5, 14, 36, 'k')
    p.rect(5, 6, 1, 34, 'l')
    p.box(7, 10, 8, 26, 'c')
    p.rect(9, 12, 4, 22, 'C')
    p.box(0, 41, 22, 9, 'm')
    p.hline(1, 42, 20, 'M')
    p.px(5, 45, 'g')
    p.px(16, 45, 'g')
  })
)

/** Operations desk with two small dashboards. */
export const opsDeskSprite = sprite(
  { ...metal, G: '#1d3436', p: '#e7e1d1', a: '#9aa36a' },
  paint(34, 30, (p) => {
    for (const x of [2, 18]) {
      p.box(x, 0, 14, 11, 'G')
      p.rect(x + 2, 7, 2, 2, 'g')
      p.rect(x + 5, 5, 2, 4, 'g')
      p.rect(x + 8, 3, 2, 6, 'g')
      p.px(x + 11, 3, 'a')
      p.box(x + 5, 10, 4, 3, 'm')
    }
    p.box(0, 13, 34, 3, 'M')
    p.hline(6, 14, 10, 'k')
    p.box(2, 16, 30, 14, 'm')
    p.hline(3, 21, 28, 'k')
    p.hline(3, 25, 28, 'k')
  })
)
