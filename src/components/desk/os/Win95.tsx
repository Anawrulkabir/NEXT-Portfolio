'use client'
/**
 * Win95 building blocks: bevelled buttons and hand-drawn 16×16 pixel icons.
 */
import type { ReactNode } from 'react'

const PALETTE: Record<string, string> = {
  k: '#000000',
  w: '#ffffff',
  s: '#c0c0c0',
  g: '#808080',
  r: '#c0282d',
  y: '#f7d774',
  Y: '#c9a43c',
  b: '#1f4fbf',
}

const GRIDS = {
  terminal: [
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kssssssssssssk.',
    '.kskkkkkkkkkksk.',
    '.kskwkkkkkkkksk.',
    '.kskkwkkkkkkksk.',
    '.kskwkkkkkkkksk.',
    '.kskkkkwwwkkksk.',
    '.kskkkkkkkkkksk.',
    '.kskkkkkkkkkksk.',
    '.kssssssssssssk.',
    '.kkkkkkkkkkkkkk.',
    '......kssk......',
    '....kkkkkkkk....',
    '....kssssssk....',
    '....kkkkkkkk....',
  ],
  mine: [
    '................',
    '.......k........',
    '.......k........',
    '...k.kkkkk.k....',
    '....kkkkkkk.....',
    '...kkwwkkkkk....',
    '...kkwwkkkkk....',
    '.kkkkkkkkkkkkk..',
    '...kkkkkkkkk....',
    '...kkkkkkkkk....',
    '....kkkkkkk.....',
    '...k.kkkkk.k....',
    '.......k........',
    '.......k........',
    '................',
    '................',
  ],
  document: [
    '...kkkkkkkk.....',
    '...kwwwwwwkk....',
    '...kwwwwwwkwk...',
    '...kwggggwkkkk..',
    '...kwwwwwwwwwk..',
    '...kwgggggggwk..',
    '...kwwwwwwwwwk..',
    '...kwgggggggwk..',
    '...kwwwwwwwwwk..',
    '...kwgggggwwwk..',
    '...kwwwwwwwwwk..',
    '...kwrrrwwwwwk..',
    '...kwrrrwwwwwk..',
    '...kwwwwwwwwwk..',
    '...kkkkkkkkkkk..',
    '................',
  ],
  folder: [
    '................',
    '................',
    '..kkkkk.........',
    '.kyyyyyk........',
    '.kyyyyyykkkkkkk.',
    '.kyyyyyyyyyyyyk.',
    '.kyyyyyyyyyyyyk.',
    '.kyyyyyyyyyyyyk.',
    '.kyyyyyyyyyyyyk.',
    '.kyyyyyyyyyyyyk.',
    '.kyyyyyyyyyyyyk.',
    '.kyyyyyyyyyyyyk.',
    '.kYYYYYYYYYYYYk.',
    '.kkkkkkkkkkkkkk.',
    '................',
    '................',
  ],
  gamepad: [
    '................',
    '................',
    '................',
    '..kkkkkkkkkkkk..',
    '.kssssssssssssk.',
    '.ksskssssssrssk.',
    '.kskkkssssrsrsk.',
    '.ksskssssssrssk.',
    '.kssssssssssssk.',
    '.ksssskkkkssssk.',
    '..kssk....kssk..',
    '...kk......kk...',
    '................',
    '................',
    '................',
    '................',
  ],
  notepad: [
    '..kkkkkkkkkkk...',
    '..kbbbbbbbbbk...',
    '..kwwwwwwwwwk...',
    '..kwkkkkkkwwk...',
    '..kwwwwwwwwwk...',
    '..kwkkkkkkkwk...',
    '..kwwwwwwwwwk...',
    '..kwkkkkkwwwk...',
    '..kwwwwwwwwwk...',
    '..kwkkkkkkkwk...',
    '..kwwwwwwwwwk...',
    '..kwkkkkwwwwk...',
    '..kwwwwwwwwwk...',
    '..kkkkkkkkkkk...',
    '................',
    '................',
  ],
  speaker: [
    '................',
    '......kk........',
    '.....kgk........',
    '....kggk........',
    '.kkkkggk..k.....',
    '.kssskgk...k....',
    '.kssskgk.k..k...',
    '.kssskgk..k.k...',
    '.kssskgk.k..k...',
    '.kssskgk...k....',
    '.kkkkggk..k.....',
    '....kggk........',
    '.....kgk........',
    '......kk........',
    '................',
    '................',
  ],
} as const

export type IconName = keyof typeof GRIDS | 'showcase'

export function PixelIcon({ name, size = 32 }: { name: IconName; size?: number }) {
  if (name === 'showcase') {
    return (
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center bg-white text-black border-2 border-black font-showcase font-black leading-none"
        style={{ width: size * 0.9, height: size * 0.9, fontSize: size * 0.62 }}
      >
        F
      </span>
    )
  }
  const grid = GRIDS[name]
  const rects: ReactNode[] = []
  grid.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c !== '.') rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={PALETTE[c]} />)
    })
  )
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
      {rects}
    </svg>
  )
}

export function Btn({
  children,
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button type="button" className={`w95-btn ${className}`} {...rest}>
      {children}
    </button>
  )
}

const GLYPHS = {
  min: ['........', '........', '........', '........', '........', 'kkkkkk..', 'kkkkkk..'],
  max: ['kkkkkkkk', 'kkkkkkkk', 'k......k', 'k......k', 'k......k', 'k......k', 'kkkkkkkk'],
  close: ['kk....kk', '.kk..kk.', '..kkkk..', '...kk...', '..kkkk..', '.kk..kk.', 'kk....kk'],
}

/** Title-bar glyphs drawn in pixels, like the real ones. */
export function TitleGlyph({ kind }: { kind: keyof typeof GLYPHS }) {
  return (
    <svg aria-hidden="true" width="8" height="7" viewBox="0 0 8 7" shapeRendering="crispEdges">
      {GLYPHS[kind].flatMap((row, y) =>
        [...row].map((c, x) => (c === 'k' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#000" /> : null))
      )}
    </svg>
  )
}
