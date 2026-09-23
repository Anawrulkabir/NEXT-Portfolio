/**
 * Avatar — original 18×24 pixel character (§05.3). The outfit changes at zone
 * boundaries — the progression system made visible:
 *   workshop: work apron, safety goggles pushed up on the forehead
 *   hoodie:   hoodie, laptop under the arm (Dungeon, Garage)
 *   lanyard:  shirt, lanyard badge, headset around the neck (Software, Data Center)
 * The lab-coat outfit lands with the labs (Phase 5); until then later zones
 * keep the lanyard.
 *
 * Physical traits are placeholders pending the author's choice
 * [NEEDS CONFIRMATION]: neutral dark hair, no glasses, mid skin tone.
 * Faces right; facing left is a CSS scaleX(-1).
 *
 * Frame order: 0-1 idle (1 = blink), 2-5 walk cycle.
 */
import type { ZoneId } from '@/content/types'
import { sprite, type Grid } from '../pixel'

const palette = {
  h: '#1f1a17',
  H: '#3a302a',
  s: '#b8855f',
  S: '#946646',
  e: '#1e211d',
  k: '#2a2f2b',
  l: '#a9c4d9',
  t: '#5d7a8c',
  T: '#455d6b',
  a: '#a07d4f',
  A: '#7d5f3a',
  p: '#3b3f47',
  P: '#2a2d33',
  b: '#4a3526',
  B: '#33241a',
  u: '#4a5a6e',
  U: '#3a4757',
  w: '#c9cfd2',
  L: '#8a9199',
  r: '#c9663a',
}

const head = (eye: string, goggles: boolean): Grid => [
  '......hhhhhh......',
  '.....hhHHhhhh.....',
  '....hhhhhhhhhh....',
  goggles ? '....hkkkllkkkh....' : '....hhhhhhhhhh....',
  goggles ? '....hkkllllkkh....' : '....hhHhhhhhhh....',
  '....hhhsssssss....',
  `....hhsssss${eye}ss....`,
  '....hhssssssss....',
  '.....hsssssSs.....',
  '......SssssS......',
]

const apronTorso: Grid = [
  '.....tttttttt.....',
  '....ttaaaaaatt....',
  '....tTaaaaaaTt....',
  '....tTaaaaaaTts...',
  '....ssaaaaaaAss...',
  '.....aaaaaaaa.....',
  '.....AAAAAAAA.....',
]

const hoodieTorso: Grid = [
  '.....UuuuuuuU.....',
  '....uuuwuuwuuu....',
  '....uuuwuuwuuu....',
  '....uUuuuuuuULLs..',
  '....ssuuuuuuuLLs..',
  '.....uuuuuuuu.....',
  '.....UUUUUUUU.....',
]

const lanyardTorso: Grid = [
  '.....kttttttk.....',
  '....tttrttrttt....',
  '....tTttrrttTt....',
  '....tTttwwttTts...',
  '....sstttttttss...',
  '.....tttttttt.....',
  '.....TTTTTTTT.....',
]

const legsStand: Grid = [
  '......pppppp......',
  '......pp..pp......',
  '......pp..pp......',
  '......PP..PP......',
  '......PP..PP......',
  '.....bbb..bbbb....',
  '.....BBB..BBBB....',
]

const legsStrideA: Grid = [
  '......pppppp......',
  '.....pp....pp.....',
  '....pp......pp....',
  '....PP......PP....',
  '...PP........PP...',
  '..bbb........bbbb.',
  '..BBB........BBBB.',
]

const legsStrideB: Grid = [
  '......pppppp......',
  '.....PP....pp.....',
  '....PP......pp....',
  '....pp......PP....',
  '...pp........PP...',
  '..bbb........bbbb.',
  '..BBB........BBBB.',
]

function outfit(torso: Grid, goggles: boolean) {
  const frame = (eye: string, legs: Grid): Grid => [...head(eye, goggles), ...torso, ...legs]
  return sprite(
    palette,
    frame('e', legsStand),
    frame('s', legsStand),
    frame('e', legsStrideA),
    frame('e', legsStand),
    frame('e', legsStrideB),
    frame('e', legsStand)
  )
}

export type OutfitId = 'workshop' | 'hoodie' | 'lanyard'

export const avatarOutfits: Record<OutfitId, ReturnType<typeof sprite>> = {
  workshop: outfit(apronTorso, true),
  hoodie: outfit(hoodieTorso, false),
  lanyard: outfit(lanyardTorso, false),
}

export const outfitForZone = (zone: ZoneId): OutfitId =>
  zone === 'workshop' ? 'workshop' : zone === 'dungeon' || zone === 'garage' ? 'hoodie' : 'lanyard'

/** Default (Workshop) outfit. */
export const avatarSprite = avatarOutfits.workshop

export const AVATAR_IDLE_FRAMES = [0, 1] as const
export const AVATAR_WALK_FRAMES = [2, 3, 4, 5] as const
