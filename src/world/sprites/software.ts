/** Software Workshop props — original pixel sprites (§05.2 Zone 4, §13.2). */
import { paint } from '../draw'
import { sprite } from '../pixel'

const deskPalette = {
  o: '#23282b',
  d: '#a8845a',
  D: '#c09a6a',
  m: '#3b3f42',
  G: '#1d3436',
  g: '#6fb7b9',
}

/** Desk with two monitors and a keyboard — the internship desk. */
export const deskDualSprite = sprite(
  deskPalette,
  paint(44, 30, (p) => {
    for (const x of [6, 22]) {
      p.box(x, 0, 16, 11, 'G')
      p.hline(x + 2, 2, 8, 'g')
      p.hline(x + 2, 4, 11, 'g')
      p.hline(x + 4, 6, 6, 'g')
      p.hline(x + 2, 8, 9, 'g')
      p.box(x + 6, 10, 4, 3, 'm')
    }
    p.box(12, 11, 20, 2, 'm')
    p.box(0, 13, 44, 3, 'D')
    p.hline(1, 14, 42, 'd')
    p.box(2, 16, 4, 14, 'd')
    p.box(38, 16, 4, 14, 'd')
    p.box(28, 16, 10, 8, 'd')
    p.hline(29, 19, 8, 'o')
  })
)

/** Whiteboard with a service diagram: boxes and arrows only, no labels. */
export const whiteboardSprite = sprite(
  { o: '#2f3330', m: '#8a9199', p: '#dfe3e0', k: '#3b3f42', b: '#a9c4d9', c: '#6fb7b9' },
  paint(52, 32, (p) => {
    p.box(0, 0, 52, 28, 'm')
    p.rect(2, 2, 48, 24, 'p')
    const node = (x: number, y: number, fill: string) => {
      p.box(x, y, 10, 7, fill, 'k')
    }
    node(5, 5, 'b')
    node(21, 4, 'p')
    node(21, 16, 'p')
    node(37, 10, 'c')
    p.hline(15, 8, 6, 'k')
    p.px(20, 7, 'k')
    p.px(20, 9, 'k')
    p.line(15, 10, 20, 18, 'k')
    p.hline(31, 7, 3, 'k')
    p.line(33, 7, 36, 12, 'k')
    p.hline(31, 19, 3, 'k')
    p.line(33, 19, 36, 15, 'k')
    p.box(10, 28, 32, 3, 'm')
    p.hline(14, 29, 4, 'c')
  })
)

/** Standing desk with one monitor showing a page layout (frontend work). */
export const monitorDeskSprite = sprite(
  { ...deskPalette, p: '#e7e1d1', b: '#a9c4d9' },
  paint(36, 30, (p) => {
    p.box(6, 0, 24, 15, 'p')
    p.rect(7, 1, 22, 2, 'b')
    p.rect(7, 4, 5, 10, 'G')
    p.box(14, 5, 6, 4, 'b', 'm')
    p.box(21, 5, 6, 4, 'b', 'm')
    p.hline(14, 11, 13, 'm')
    p.box(16, 14, 4, 3, 'm')
    p.box(0, 17, 36, 3, 'D')
    p.box(4, 20, 3, 10, 'm')
    p.box(29, 20, 3, 10, 'm')
    p.hline(4, 26, 28, 'm')
  })
)

/** Toolbox — opens a tool drawer (§09 I-13). */
function toolbox(body: string, lid: string) {
  return sprite(
    { o: '#2b2418', r: body, R: lid, m: '#8a9199', k: '#3b3f42' },
    paint(24, 16, (p) => {
      p.box(8, 0, 8, 4, '.')
      p.box(0, 3, 24, 5, 'R')
      p.box(0, 7, 24, 9, 'r')
      p.hline(1, 7, 22, 'o')
      p.box(10, 5, 4, 4, 'm')
      p.hline(3, 11, 18, 'k')
    })
  )
}

export const toolboxRedSprite = toolbox('#9a4a36', '#b5523a')
export const toolboxSteelSprite = toolbox('#5f666a', '#7d8488')

/** Coffee machine — scenery only. */
export const coffeeSprite = sprite(
  { o: '#23282b', m: '#5f666a', M: '#7d8488', k: '#2c3033', w: '#e7e1d1', c: '#6b5238' },
  paint(14, 22, (p) => {
    p.box(0, 0, 14, 22, 'm')
    p.hline(1, 1, 12, 'M')
    p.box(2, 3, 10, 5, 'k')
    p.px(4, 5, 'w')
    p.rect(3, 9, 8, 9, 'k')
    p.box(5, 13, 4, 4, 'w')
    p.hline(6, 14, 2, 'c')
    p.hline(1, 19, 12, 'M')
  })
)

/** Server-closet door at the back of the office, glowing cyan (foreshadows Zone 5). */
export const serverDoorSprite = sprite(
  { o: '#23282b', f: '#5f666a', d: '#3b4043', g: '#6fb7b9', G: '#2f5f61', w: '#e7e1d1' },
  paint(28, 52, (p) => {
    p.box(0, 0, 28, 52, 'f')
    p.box(3, 3, 22, 49, 'd')
    p.rect(4, 8, 20, 1, 'G')
    p.rect(4, 49, 20, 3, 'g')
    p.box(8, 12, 12, 8, 'G')
    for (let y = 14; y < 19; y += 2) p.hline(10, y, 8, 'g')
    p.rect(20, 28, 2, 4, 'w')
  })
)
