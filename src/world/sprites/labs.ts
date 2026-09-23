/**
 * Physics-Informed Lab, Thermal Systems Lab and Overlook props — original
 * pixel sprites (§05.2 Zones 6-7, Destination, §13.2). No equations, no
 * refrigerant brand labels.
 */
import { paint } from '../draw'
import { sprite } from '../pixel'

const lab = {
  o: '#1f2528',
  m: '#8a9199',
  M: '#b7bec4',
  d: '#4f575c',
  G: '#1d3436',
  g: '#6fb7b9',
}

/** Open-circuit wind tunnel: inlet bell, test section with an airfoil, diffuser, fan. */
export const windTunnelSprite = sprite(
  { ...lab, p: '#e7e1d1' },
  paint(60, 40, (p) => {
    // inlet bell
    p.box(0, 4, 10, 24, 'm')
    p.box(8, 8, 8, 16, 'm')
    // test section with window
    p.box(15, 9, 22, 14, 'd')
    p.box(17, 11, 18, 10, 'G')
    for (const y of [13, 18]) p.hline(18, y, 16, 'g')
    p.rect(23, 15, 8, 2, 'p')
    p.px(22, 15, 'p')
    p.px(31, 16, 'p')
    // diffuser widening to the fan housing
    p.line(37, 9, 48, 5, 'o')
    p.line(37, 22, 48, 26, 'o')
    p.rect(37, 10, 11, 12, 'm')
    for (let x = 38; x < 48; x++) {
      const spread = Math.round(((x - 37) * 4) / 11)
      p.vline(x, 10 - spread, 12 + 2 * spread, 'm')
    }
    p.box(47, 3, 13, 26, 'M')
    p.rect(50, 8, 7, 16, 'd')
    p.line(50, 8, 56, 23, 'M')
    p.line(56, 8, 50, 23, 'M')
    // stand
    p.hline(1, 1, 8, 'M')
    p.box(4, 28, 3, 12, 'd')
    p.box(24, 23, 3, 17, 'd')
    p.box(52, 29, 3, 11, 'd')
    p.hline(2, 36, 54, 'd')
  })
)

/** Chalkboard with one sketch: streamlines around an airfoil, no equations. */
export const chalkboardSprite = sprite(
  { o: '#2b2418', w: '#8a6a45', b: '#2f4a34', c: '#e7e1d1', C: '#a9c4d9' },
  paint(48, 30, (p) => {
    p.box(0, 0, 48, 27, 'w')
    p.rect(2, 2, 44, 23, 'b')
    p.rect(17, 12, 12, 2, 'c')
    p.px(16, 12, 'c')
    p.px(29, 13, 'c')
    for (const [y, lift] of [
      [6, -2],
      [9, -1],
      [17, 1],
      [20, 2],
    ] as const) {
      for (let x = 5; x < 43; x++) {
        const near = Math.exp(-(((x - 23) / 8) ** 2))
        const yy = Math.round(y + lift * near * 2)
        if (x % 2 === 0) p.px(x, yy, 'C')
      }
    }
    p.box(8, 26, 32, 3, 'w')
    p.rect(12, 27, 3, 1, 'c')
  })
)

/** Workstation showing a contour-style figure (placeholder for real thesis figures). */
export const workstationSprite = sprite(
  { ...lab, a: '#2f5f61', b: '#4f7a8c', c: '#a9c4d9', w: '#a8845a' },
  paint(36, 30, (p) => {
    p.box(6, 0, 24, 15, 'G')
    p.rect(8, 2, 20, 11, 'a')
    p.rect(10, 4, 16, 7, 'b')
    p.rect(13, 6, 10, 3, 'c')
    p.rect(16, 7, 4, 1, 'g')
    p.box(16, 14, 4, 3, 'd')
    p.box(0, 17, 36, 3, 'w')
    p.box(3, 20, 3, 10, 'd')
    p.box(30, 20, 3, 10, 'd')
  })
)

/**
 * Plate heat exchanger rig: plate pack between end plates, four ports,
 * insulated lines. `tone` distinguishes evaporation (cool) from condensation
 * (warm) — the physics, not a status.
 */
function pheRig(tone: 'cool' | 'warm') {
  const line = tone === 'cool' ? '#a9c4d9' : '#c9663a'
  const lineD = tone === 'cool' ? '#6f8fa6' : '#9a4a2c'
  return sprite(
    { o: '#1f2528', f: '#6d7479', F: '#8a9199', p: '#b7bec4', c: '#b87333', l: line, L: lineD },
    paint(40, 46, (p) => {
      // frame
      p.box(4, 6, 3, 36, 'f')
      p.box(33, 6, 3, 36, 'f')
      p.hline(4, 6, 32, 'o')
      // end plates + plate pack
      p.box(8, 10, 4, 28, 'F')
      p.box(28, 10, 4, 28, 'F')
      for (let x = 12; x < 28; x += 2) {
        p.vline(x, 11, 26, 'p')
        p.vline(x + 1, 11, 26, 'f')
      }
      // four ports with copper stubs and insulated lines
      for (const [x, y] of [
        [9, 13],
        [9, 32],
        [29, 13],
        [29, 32],
      ] as const) {
        p.box(x, y, 3, 3, 'c')
      }
      p.box(0, 12, 10, 4, 'l')
      p.hline(1, 15, 8, 'L')
      p.box(0, 31, 10, 4, 'l')
      p.hline(1, 34, 8, 'L')
      p.box(31, 12, 9, 4, 'c')
      p.box(31, 31, 9, 4, 'c')
      // gauges / sensors
      p.box(15, 2, 5, 5, 'p')
      p.px(17, 4, 'o')
      p.vline(17, 6, 4, 'o')
      p.box(21, 3, 4, 4, 'p')
      p.vline(22, 6, 4, 'o')
      // skid
      p.box(2, 42, 36, 4, 'f')
    })
  )
}

export const pheRigCoolSprite = pheRig('cool')
export const pheRigWarmSprite = pheRig('warm')

/** Data logger on a stand; its screen shows a sparse scatter — few points. */
export const dataLoggerSprite = sprite(
  { ...lab, p: '#e7e1d1', c: '#b87333' },
  paint(24, 34, (p) => {
    p.box(0, 0, 24, 18, 'm')
    p.box(2, 2, 20, 11, 'G')
    for (const [x, y] of [
      [5, 10],
      [8, 8],
      [11, 9],
      [14, 6],
      [18, 4],
    ] as const)
      p.rect(x, y, 1, 1, 'g')
    p.hline(3, 11, 18, 'd')
    for (let x = 4; x < 21; x += 4) p.rect(x, 15, 2, 1, 'c')
    p.box(10, 18, 4, 12, 'd')
    p.box(4, 30, 16, 4, 'd')
  })
)

/** Cork board with six pinned cards — the research interests. */
export const interestsBoardSprite = sprite(
  { o: '#3d2f20', k: '#a8845a', K: '#8a6a45', p: '#e7e1d1', a: '#a9c4d9', g: '#6fb7b9' },
  paint(44, 30, (p) => {
    p.box(0, 0, 44, 30, 'k')
    for (let i = 0; i < 40; i += 3) p.px(2 + ((i * 7) % 40), 2 + ((i * 5) % 26), 'K')
    const cards: [number, number][] = [
      [3, 3],
      [17, 4],
      [31, 3],
      [4, 16],
      [18, 17],
      [31, 16],
    ]
    cards.forEach(([x, y], i) => {
      p.rect(x, y, 10, 10, i === 1 ? 'a' : 'p')
      p.hline(x + 2, y + 4, 6, 'o')
      p.hline(x + 2, y + 6, 4, 'o')
      p.px(x + 5, y + 1, 'g')
    })
  })
)

/** Door on the rooftop shed. The icon distinguishes Archive (frame) from Field Office (envelope). */
function roomDoor(icon: 'frame' | 'mail') {
  return sprite(
    { o: '#1f2528', f: '#6d7479', d: '#8a6a45', D: '#6b5238', p: '#e7e1d1', y: '#cbb26a' },
    paint(24, 40, (p) => {
      p.box(0, 0, 24, 40, 'f')
      p.box(3, 3, 18, 37, 'd')
      p.vline(4, 4, 35, 'D')
      p.box(16, 22, 3, 3, 'y')
      if (icon === 'frame') {
        p.box(7, 8, 10, 8, 'p')
        p.rect(9, 10, 6, 4, 'D')
      } else {
        p.box(7, 9, 10, 7, 'p')
        p.line(8, 10, 12, 13, 'o')
        p.line(16, 10, 12, 13, 'o')
      }
    })
  )
}

export const archiveDoorSprite = roomDoor('frame')
export const officeDoorSprite = roomDoor('mail')
