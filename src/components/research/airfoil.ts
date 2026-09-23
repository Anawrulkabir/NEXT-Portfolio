/**
 * Precomputed frames for the airfoil illustration (§09 I-10). This is a
 * drawing, not a flow solver: streamlines bend around a NACA 0012 outline,
 * turn down behind it with angle of attack, and wobble (separate) past an
 * illustrative threshold. Nothing here is a result.
 */
export const W = 120
export const H = 56
export const ANGLES = Array.from({ length: 11 }, (_, i) => i * 2) // 0°..20°
export const OOD_THRESHOLD = 12 // illustrative only

const CX = 56 // quarter-chord pivot
const CY = 28
const CHORD = 40

const thickness = (x: number) =>
  5 * 0.12 * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x ** 2 + 0.2843 * x ** 3 - 0.1015 * x ** 4)

export type Frame = { airfoil: [number, number][]; lines: { pts: [number, number][]; separated: boolean }[] }

function frame(deg: number): Frame {
  const a = (deg * Math.PI) / 180
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  const le = CX - CHORD / 4

  // Rasterise the rotated airfoil: inverse-rotate each pixel into chord space.
  const airfoil: [number, number][] = []
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const dx = x + 0.5 - CX
      const dy = y + 0.5 - CY
      const u = dx * cos + dy * sin // along chord
      const v = -dx * sin + dy * cos
      const xc = (u + CHORD / 4) / CHORD
      if (xc >= 0 && xc <= 1 && Math.abs(v) <= thickness(xc) * CHORD) airfoil.push([x, y])
    }

  const ood = deg > OOD_THRESHOLD
  const lines: Frame['lines'] = []
  for (let y0 = 6; y0 <= H - 6; y0 += 6) {
    const side = y0 < CY ? -1 : 1
    const dist = Math.abs(y0 - CY)
    const pts: [number, number][] = []
    const separated = ood && side < 0 && dist <= 12
    for (let x = 0; x < W; x++) {
      const t = (x - (le + CHORD / 2)) / 14
      const bump = Math.exp(-t * t) * (7 / (1 + dist / 5)) * side // flow parts around the body
      const turn = (deg / 20) * 9 * (1 / (1 + Math.exp(-(x - CX) / 6)) - 0.35) * (1 / (1 + dist / 18)) // up-wash ahead, down-wash behind
      let y = y0 + bump + turn
      if (separated && x > CX) y += Math.sin(x * 0.7 + y0) * Math.min(3, (x - CX) / 8)
      y = Math.round(y)
      if (y >= 1 && y < H - 1) pts.push([x, y])
    }
    lines.push({ pts, separated })
  }
  return { airfoil, lines }
}

export const FRAMES: Record<number, Frame> = Object.fromEntries(ANGLES.map((d) => [d, frame(d)]))
