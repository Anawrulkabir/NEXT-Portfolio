'use client'
/** GPU Academy visual kit: chunky 3D buttons, the Chip mascot, confetti, little sounds. */
import { useMemo, type ButtonHTMLAttributes, type ReactNode } from 'react'

export const COLORS = {
  green: ['#58cc02', '#58a700'],
  blue: ['#1cb0f6', '#1899d6'],
  red: ['#ff4b4b', '#ea2b2b'],
  orange: ['#ff9600', '#cd7900'],
  purple: ['#ce82ff', '#a568cc'],
  gold: ['#ffc800', '#e5a400'],
  white: ['#ffffff', '#e5e5e5'],
} as const
export type Tone = keyof typeof COLORS

export function Duo({
  tone = 'green',
  children,
  className = '',
  style,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; children: ReactNode }) {
  const [c, s] = COLORS[tone]
  return (
    <button
      type="button"
      className={`duo ${tone === 'white' ? 'duo-white' : ''} ${className}`}
      style={{ ['--c' as string]: c, ['--s' as string]: s, ...style }}
      {...rest}
    >
      {children}
    </button>
  )
}

export type Mood = 'happy' | 'think' | 'sad' | 'wow' | 'wave'

/** Chip: a little GPU with a face. */
export function Chip({ mood = 'happy', size = 110, className = '' }: { mood?: Mood; size?: number; className?: string }) {
  const mouth =
    mood === 'sad' ? 'M46 80 Q60 70 74 80' : mood === 'wow' ? '' : mood === 'think' ? 'M50 78 L70 76' : 'M44 72 Q60 90 76 72'
  return (
    <svg viewBox="0 0 120 130" width={size} height={size * (130 / 120)} className={`chip-mascot ${mood === 'happy' || mood === 'wow' ? 'chip-hop' : 'chip-bob'} ${className}`} aria-hidden="true">
      <ellipse cx="60" cy="124" rx="34" ry="5" fill="#000" opacity="0.1" />
      {/* pins */}
      {[30, 44, 58, 72, 86].map((y) => (
        <g key={y}>
          <rect x="6" y={y - 22} width="12" height="7" rx="3" fill="#c9a24a" />
          <rect x="102" y={y - 22} width="12" height="7" rx="3" fill="#c9a24a" />
        </g>
      ))}
      {[34, 50, 66, 82].map((x) => (
        <rect key={x} x={x} y="108" width="7" height="12" rx="3" fill="#c9a24a" />
      ))}
      {/* body */}
      <rect x="14" y="8" width="92" height="104" rx="26" fill="#46a302" />
      <rect x="14" y="4" width="92" height="100" rx="26" fill="#58cc02" />
      <rect x="26" y="14" width="68" height="18" rx="9" fill="#89e219" opacity="0.6" />
      {/* face */}
      {mood === 'wave' && <path d="M104 40 q14 -6 12 -22" stroke="#46a302" strokeWidth="9" strokeLinecap="round" fill="none" className="chip-wave" />}
      <g className="chip-eyes">
        <ellipse cx="42" cy="52" rx="12" ry={mood === 'sad' ? 10 : 14} fill="#fff" />
        <ellipse cx="78" cy="52" rx="12" ry={mood === 'sad' ? 10 : 14} fill="#fff" />
        <circle cx={mood === 'think' ? 46 : 44} cy={mood === 'think' ? 47 : 54} r="7" fill="#1d1d1f" />
        <circle cx={mood === 'think' ? 82 : 80} cy={mood === 'think' ? 47 : 54} r="7" fill="#1d1d1f" />
        <circle cx={mood === 'think' ? 48 : 46} cy={mood === 'think' ? 45 : 51} r="2.4" fill="#fff" />
        <circle cx={mood === 'think' ? 84 : 82} cy={mood === 'think' ? 45 : 51} r="2.4" fill="#fff" />
      </g>
      {mood === 'sad' && (
        <>
          <path d="M30 36 L50 42" stroke="#2b6b00" strokeWidth="4" strokeLinecap="round" />
          <path d="M90 36 L70 42" stroke="#2b6b00" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      <circle cx="30" cy="70" r="6" fill="#ff86a0" opacity="0.55" />
      <circle cx="90" cy="70" r="6" fill="#ff86a0" opacity="0.55" />
      {mood === 'wow' ? <ellipse cx="60" cy="78" rx="8" ry="10" fill="#1d1d1f" /> : <path d={mouth} stroke="#1d1d1f" strokeWidth="5" strokeLinecap="round" fill={mood === 'happy' || mood === 'wave' ? '#ff4b4b' : 'none'} />}
      {/* the "GPU" label on the belly */}
      <text x="60" y="100" textAnchor="middle" fontSize="11" fontWeight="900" fill="#2b6b00" opacity="0.55" fontFamily="var(--font-round), sans-serif">
        GPU
      </text>
    </svg>
  )
}

export function Bubble({ children, side = 'left' }: { children: ReactNode; side?: 'left' | 'bottom' }) {
  return <div className={`duo-bubble ${side === 'bottom' ? 'duo-bubble-bottom' : ''}`}>{children}</div>
}

export function Confetti({ count = 70 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 1.8 + Math.random() * 1.6,
        rot: Math.random() * 360,
        color: ['#58cc02', '#1cb0f6', '#ffc800', '#ff4b4b', '#ce82ff', '#ff9600'][i % 6],
        w: 6 + Math.random() * 6,
      })),
    [count]
  )
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="duo-confetti"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, background: p.color, width: p.w, height: p.w * 0.45, transform: `rotate(${p.rot}deg)` }}
        />
      ))}
    </div>
  )
}

/** Tiny synthesised sound effects. */
let ctx: AudioContext | null = null
function tone(freqs: number[], dur = 0.12, type: OscillatorType = 'sine', gap = 0.09, vol = 0.07) {
  try {
    ctx ??= new AudioContext()
    const t0 = ctx.currentTime + 0.01
    freqs.forEach((f, i) => {
      const o = ctx!.createOscillator()
      const g = ctx!.createGain()
      o.type = type
      o.frequency.value = f
      g.gain.setValueAtTime(0, t0 + i * gap)
      g.gain.linearRampToValueAtTime(vol, t0 + i * gap + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * gap + dur)
      o.connect(g).connect(ctx!.destination)
      o.start(t0 + i * gap)
      o.stop(t0 + i * gap + dur + 0.05)
    })
  } catch {
    /* no audio: fine */
  }
}
export const sfx = {
  tap: (m: boolean) => !m && tone([660], 0.05, 'triangle', 0, 0.04),
  good: (m: boolean) => !m && tone([784, 1175], 0.16, 'sine', 0.09),
  bad: (m: boolean) => !m && tone([196, 147], 0.18, 'square', 0.12, 0.035),
  win: (m: boolean) => !m && tone([523, 659, 784, 1047], 0.22, 'triangle', 0.1, 0.06),
}
