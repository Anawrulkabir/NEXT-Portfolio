/** Archive Room and Field Office props — original pixel sprites (§05.2 Rooms R1-R2). */
import { paint } from '../draw'
import { sprite } from '../pixel'

const wood = { o: '#2b2418', w: '#8a6a45', W: '#a8845a', d: '#6b5238' }

/** Map table: a wooden table with an unrolled map and three pins. */
export const mapTableSprite = sprite(
  { ...wood, m: '#4f7a4a', M: '#6a9a5a', s: '#1d3436', r: '#c9663a', p: '#e7e1d1' },
  paint(56, 30, (p) => {
    p.box(2, 4, 52, 10, 's')
    p.rect(8, 5, 14, 8, 'm')
    p.rect(12, 6, 8, 3, 'M')
    p.rect(26, 6, 10, 7, 'm')
    p.rect(40, 5, 8, 5, 'M')
    for (const [x, y] of [
      [14, 6],
      [31, 8],
      [44, 6],
    ] as const) {
      p.rect(x, y - 3, 2, 3, 'r')
      p.px(x, y - 4, 'p')
    }
    p.box(0, 13, 56, 4, 'W')
    p.box(3, 17, 4, 13, 'd')
    p.box(49, 17, 4, 13, 'd')
    p.hline(7, 22, 42, 'w')
  })
)

/** Mailbox on a post. */
export const mailboxSprite = sprite(
  { ...wood, b: '#4f7a8c', B: '#6a8a9a', r: '#b5523a', p: '#e7e1d1' },
  paint(22, 38, (p) => {
    p.box(1, 2, 20, 14, 'b')
    p.hline(2, 3, 18, 'B')
    p.rect(1, 0, 20, 3, 'o')
    p.rect(3, 1, 16, 2, 'B')
    p.box(4, 7, 12, 3, 'p')
    p.box(18, 4, 3, 7, 'r')
    p.box(9, 16, 4, 20, 'd')
    p.box(5, 34, 12, 4, 'w')
  })
)

/** The CV pinned to the wall. */
export const cvPinSprite = sprite(
  { o: '#3b3f42', p: '#e7e1d1', P: '#c9cfd2', k: '#3b3f42', r: '#c9663a', g: '#4f7a4a' },
  paint(24, 30, (p) => {
    p.box(0, 2, 24, 28, 'p')
    p.rect(3, 5, 6, 6, 'P')
    p.hline(11, 6, 10, 'k')
    p.hline(11, 9, 7, 'k')
    for (let y = 14; y < 27; y += 3) p.hline(3, y, y % 2 ? 16 : 18, 'k')
    p.rect(3, 13, 2, 1, 'g')
    p.rect(11, 0, 2, 4, 'r')
  })
)

/** Board of links — text labels, no brand logos (§08.7). */
export const linkBoardSprite = sprite(
  { o: '#3d2f20', k: '#a8845a', p: '#e7e1d1', b: '#a9c4d9', s: '#3b3f42', g: '#6fb7b9' },
  paint(48, 34, (p) => {
    p.box(0, 0, 48, 34, 'k')
    const cards: [number, number, string][] = [
      [4, 4, 'p'],
      [26, 5, 'b'],
      [5, 19, 'b'],
      [27, 19, 'p'],
    ]
    for (const [x, y, c] of cards) {
      p.rect(x, y, 17, 11, c)
      p.hline(x + 2, y + 4, 11, 's')
      p.hline(x + 2, y + 7, 7, 's')
      p.px(x + 8, y + 1, 'g')
    }
    p.line(21, 9, 26, 10, 'g')
    p.line(13, 15, 13, 19, 'g')
  })
)

/** Drafting table — scenery. */
export const draftingTableSprite = sprite(
  { ...wood, p: '#e7e1d1', b: '#a9c4d9', k: '#3b3f42' },
  paint(52, 36, (p) => {
    p.line(2, 14, 48, 4, 'o')
    for (let i = 0; i < 8; i++) p.line(3, 14 + i, 49, 4 + i, i < 6 ? 'W' : 'd')
    p.rect(14, 8, 18, 5, 'p')
    p.hline(16, 10, 12, 'b')
    p.line(34, 5, 44, 3, 'k')
    p.box(8, 20, 4, 16, 'd')
    p.box(40, 13, 4, 23, 'd')
    p.hline(10, 30, 32, 'w')
  })
)
