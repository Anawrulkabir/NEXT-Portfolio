/**
 * Time of day by position (§05.1): dawn in the Workshop, day through the
 * Software Workshop, dusk in the Data Center, night in the labs, first light
 * at the Overlook. Sky colours are interpolated from the camera centre and
 * written as three CSS variables — one style update per frame, only when the
 * rounded colour actually changes.
 */
import type { ZoneId } from '@/content/types'
import { zoneById } from '../layout'

type RGB = [number, number, number]
type Sky = { top: RGB; mid: RGB; low: RGB }

const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const sky = (top: string, mid: string, low: string): Sky => ({ top: hex(top), mid: hex(mid), low: hex(low) })

const DAWN = sky('#27304a', '#5f5a70', '#b98a6c')
const MORNING = sky('#2f4a6e', '#6f7f96', '#b9a48e')
const DAY = sky('#355f82', '#6f93ad', '#a9bfc4')
const DUSK = sky('#1f2340', '#4f3a58', '#9a5d48')
const NIGHT = sky('#0e1220', '#172033', '#263247')
const FIRST_LIGHT = sky('#28324f', '#6f6a82', '#d0a174')

/** One stop at the centre of each zone. */
const plan: [ZoneId, Sky][] = [
  ['workshop', DAWN],
  ['dungeon', MORNING],
  ['garage', DAY],
  ['software', DAY],
  ['datacenter', DUSK],
  ['physics-lab', NIGHT],
  ['thermal-lab', NIGHT],
  ['overlook', FIRST_LIGHT],
]

const stops = plan.map(([id, s]) => {
  const z = zoneById[id]
  return { x: (z.startX + z.endX) / 2, sky: s }
})

const lerp = (a: RGB, b: RGB, t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(' ')})`

export function skyAt(x: number): { top: string; mid: string; low: string } {
  let i = 0
  while (i < stops.length - 1 && stops[i + 1].x < x) i++
  const a = stops[i]
  const b = stops[Math.min(i + 1, stops.length - 1)]
  const t = b === a ? 0 : Math.max(0, Math.min(1, (x - a.x) / (b.x - a.x)))
  return { top: lerp(a.sky.top, b.sky.top, t), mid: lerp(a.sky.mid, b.sky.mid, t), low: lerp(a.sky.low, b.sky.low, t) }
}
