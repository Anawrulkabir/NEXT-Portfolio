/** Garage props — original pixel sprites (§05.2 Zone 3, §13.2). */
import { paint } from '../draw'
import { sprite } from '../pixel'

/** Brass cup on a wooden plinth. Pale brass, so it doesn't read as the amber highlight. */
export const trophySprite = sprite(
  { o: '#4d3f1e', y: '#cbb26a', Y: '#e8d9a0', b: '#9a8340', w: '#6b5238' },
  paint(16, 22, (p) => {
    p.box(0, 2, 3, 5, '.')
    p.box(13, 2, 3, 5, '.')
    p.box(2, 1, 12, 9, 'y')
    p.vline(4, 2, 6, 'Y')
    p.vline(11, 2, 7, 'b')
    p.box(4, 9, 8, 3, 'y')
    p.box(6, 11, 4, 5, 'y')
    p.vline(7, 12, 3, 'Y')
    p.box(3, 15, 10, 3, 'b')
    p.box(2, 17, 12, 5, 'w')
    p.hline(6, 19, 4, 'Y')
  })
)

const tablePalette = {
  o: '#23282b',
  t: '#8a9199',
  T: '#b7bec4',
  l: '#3b3f42',
  G: '#1d3436',
  g: '#6fb7b9',
}

/** Folding table with an open laptop. `screen` picks the abstract screen content. */
function laptopTable(screen: 'code' | 'chat') {
  return paint(36, 24, (p) => {
    p.box(11, 0, 14, 10, 'G')
    if (screen === 'code') {
      p.hline(13, 2, 6, 'g')
      p.hline(13, 4, 9, 'g')
      p.hline(15, 6, 5, 'g')
    } else {
      p.rect(13, 2, 6, 2, 'g')
      p.rect(17, 5, 6, 2, 'T')
    }
    p.box(9, 9, 18, 3, 'l')
    p.box(0, 11, 36, 3, 'T')
    for (const x0 of [3, 24]) {
      p.line(x0, 14, x0 + 8, 23, 'o')
      p.line(x0 + 1, 14, x0 + 9, 23, 't')
      p.line(x0 + 8, 14, x0, 23, 'o')
      p.line(x0 + 9, 14, x0 + 1, 23, 't')
    }
  })
}

export const laptopCodeSprite = sprite(tablePalette, laptopTable('code'))
export const laptopChatSprite = sprite(tablePalette, laptopTable('chat'))

/** Easel with a blank chart — axes only, no invented numbers. */
export const pitchBoardSprite = sprite(
  { o: '#2b2418', p: '#e7e1d1', k: '#3b3f42', w: '#8a6a45', W: '#6b5238' },
  paint(26, 42, (p) => {
    p.vline(12, 20, 22, 'W')
    p.line(6, 20, 1, 41, 'o')
    p.line(7, 20, 2, 41, 'w')
    p.line(19, 20, 24, 41, 'o')
    p.line(18, 20, 23, 41, 'w')
    p.box(1, 1, 24, 20, 'p')
    p.rect(11, 0, 4, 2, 'w')
    p.vline(5, 4, 13, 'k')
    p.hline(5, 16, 17, 'k')
    for (let x = 8; x < 22; x += 3) p.px(x, 10, 'k')
    p.box(2, 20, 22, 3, 'w')
  })
)

/** Whiteboard covered in sticky notes. */
export const stickyWallSprite = sprite(
  { o: '#2f3330', m: '#8a9199', p: '#dfe3e0', a: '#d8c07a', b: '#a9c4d9', c: '#c98a6a' },
  paint(44, 28, (p) => {
    p.box(0, 0, 44, 25, 'm')
    p.rect(2, 2, 40, 21, 'p')
    const notes: [number, number, string][] = [
      [4, 4, 'a'],
      [11, 3, 'b'],
      [18, 5, 'c'],
      [26, 3, 'a'],
      [33, 5, 'b'],
      [5, 12, 'c'],
      [13, 11, 'a'],
      [21, 13, 'b'],
      [29, 12, 'c'],
      [35, 14, 'a'],
    ]
    for (const [x, y, ch] of notes) {
      p.rect(x, y, 6, 6, ch)
      p.hline(x + 1, y + 2, 3, 'o')
    }
    p.box(6, 24, 32, 3, 'm')
    p.hline(10, 25, 3, 'b')
  })
)
