/**
 * Avatar — original 18×24 pixel character (§05.3). Workshop outfit: work
 * apron, safety goggles pushed up on the forehead. Other outfits land with
 * their zones (Phase 3+).
 *
 * Physical traits are placeholders pending the author's choice
 * [NEEDS CONFIRMATION]: neutral dark hair, no glasses, mid skin tone.
 * Faces right; facing left is a CSS scaleX(-1).
 *
 * Frame order: 0-1 idle (1 = blink), 2-5 walk cycle.
 */
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
}

const head = (eye: string): Grid => [
  '......hhhhhh......',
  '.....hhHHhhhh.....',
  '....hhhhhhhhhh....',
  '....hkkkllkkkh....',
  '....hkkllllkkh....',
  '....hhhsssssss....',
  `....hhsssss${eye}ss....`,
  '....hhssssssss....',
  '.....hsssssSs.....',
  '......SssssS......',
]

const torso: Grid = [
  '.....tttttttt.....',
  '....ttaaaaaatt....',
  '....tTaaaaaaTt....',
  '....tTaaaaaaTts...',
  '....ssaaaaaaAss...',
  '.....aaaaaaaa.....',
  '.....AAAAAAAA.....',
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

const frame = (eye: string, legs: Grid): Grid => [...head(eye), ...torso, ...legs]

export const avatarSprite = sprite(
  palette,
  frame('e', legsStand),
  frame('s', legsStand),
  frame('e', legsStrideA),
  frame('e', legsStand),
  frame('e', legsStrideB),
  frame('e', legsStand)
)

export const AVATAR_IDLE_FRAMES = [0, 1] as const
export const AVATAR_WALK_FRAMES = [2, 3, 4, 5] as const
