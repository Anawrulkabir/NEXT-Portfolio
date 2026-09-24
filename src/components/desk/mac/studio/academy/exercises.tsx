'use client'
/** The exercise types of GPU Academy. Each reports { ready, correct } to the lesson. */
import { useEffect, useRef, useState } from 'react'
import type { Choice, Match, Order } from './lessons'
import { Bubble, Chip, Duo, sfx } from './ui'

export type Report = (r: { ready: boolean; correct: boolean }) => void
type Base = { checked: boolean; report: Report; muted: boolean }

function shuffle<T>(xs: T[]) {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ------------------------------------------------------------------ choice */

export function ChoiceEx({ ex, checked, report, muted }: Base & { ex: Choice }) {
  const [order] = useState(() => shuffle(ex.options.map((_, i) => i)))
  const [pick, setPick] = useState<number | null>(null)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-3">
        <Chip mood={checked ? (pick === ex.answer ? 'happy' : 'sad') : 'think'} size={96} />
        <Bubble>{ex.prompt}</Bubble>
      </div>
      <div className="grid gap-3">
        {order.map((i, n) => {
          const o = ex.options[i]
          const state = checked && i === ex.answer ? 'good' : checked && pick === i ? 'bad' : pick === i ? 'sel' : ''
          return (
            <button
              key={i}
              type="button"
              disabled={checked}
              onClick={() => {
                sfx.tap(muted)
                setPick(i)
                report({ ready: true, correct: i === ex.answer })
              }}
              className={`duo-card flex items-center gap-4 px-4 py-3.5 text-left ${state}`}
            >
              <span className="duo-key">{n + 1}</span>
              {o.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.logo} alt="" className="h-8 w-8 shrink-0 rounded-md" />
              )}
              <span className="text-[16px] font-bold">{o.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- order */

export function OrderEx({ ex, checked, report, muted }: Base & { ex: Order }) {
  const [bank] = useState(() => shuffle(ex.steps.map((_, i) => i)))
  const [placed, setPlaced] = useState<number[]>([])
  const toggle = (i: number) => {
    if (checked) return
    sfx.tap(muted)
    setPlaced((p) => {
      const next = p.includes(i) ? p.filter((x) => x !== i) : [...p, i]
      report({ ready: next.length === ex.steps.length, correct: next.every((x, k) => x === k) })
      return next
    })
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-3">
        <Chip mood="think" size={70} />
        <Bubble>{ex.prompt}</Bubble>
      </div>
      <ol className="duo-lines flex min-h-[190px] flex-col gap-1.5 rounded-2xl p-1.5">
        {placed.map((i, k) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className={`duo-tile duo-pop w-full text-left ${checked ? (i === k ? 'good' : 'bad') : ''}`}
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] text-[12px]">{k + 1}</span>
              {ex.steps[i]}
            </button>
          </li>
        ))}
        {placed.length === 0 && <li className="m-auto text-[14px] font-bold text-[#afafaf]">Tap the steps below, first step first</li>}
      </ol>
      <div className="flex flex-wrap justify-center gap-2">
        {bank.map((i) => (
          <button key={i} type="button" onClick={() => toggle(i)} disabled={placed.includes(i) || checked} className={`duo-tile ${placed.includes(i) ? 'ghost' : ''}`}>
            {ex.steps[i]}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- match */

export function MatchEx({ ex, report, muted }: Base & { ex: Match }) {
  const [jobs] = useState(() => shuffle(ex.pairs.map((_, i) => i)))
  const [tools] = useState(() => shuffle(ex.pairs.map((_, i) => i)))
  const [left, setLeft] = useState<number | null>(null)
  const [done, setDone] = useState<number[]>([])
  const [wrong, setWrong] = useState<[number, number] | null>(null)

  const pickTool = (t: number) => {
    if (left === null) return
    if (t === left) {
      sfx.good(muted)
      const next = [...done, t]
      setDone(next)
      setLeft(null)
      if (next.length === ex.pairs.length) report({ ready: true, correct: true })
    } else {
      sfx.bad(muted)
      setWrong([left, t])
      setLeft(null)
      setTimeout(() => setWrong(null), 600)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-3">
        <Chip mood={done.length === ex.pairs.length ? 'happy' : 'think'} size={84} />
        <Bubble>{ex.prompt}</Bubble>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {jobs.map((j) => (
            <button
              key={j}
              type="button"
              disabled={done.includes(j)}
              onClick={() => {
                sfx.tap(muted)
                setLeft(j)
              }}
              className={`duo-card min-h-[62px] px-3 py-2 text-[14px] font-bold ${done.includes(j) ? 'gone' : left === j ? 'sel' : wrong?.[0] === j ? 'bad duo-shake' : ''}`}
            >
              {ex.pairs[j].job}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {tools.map((t) => (
            <button
              key={t}
              type="button"
              disabled={done.includes(t)}
              onClick={() => pickTool(t)}
              className={`duo-card flex min-h-[62px] items-center gap-3 px-3 py-2 text-[15px] font-extrabold ${done.includes(t) ? 'gone' : wrong?.[1] === t ? 'bad duo-shake' : ''}`}
            >
              {ex.pairs[t].logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ex.pairs[t].logo} alt="" className="h-8 w-8 shrink-0" />
              )}
              {ex.pairs[t].tool}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- GPU sandbox */

const PEOPLE = ['#ff9600', '#1cb0f6', '#ce82ff', '#ff4b4b', '#ffc800', '#2bd9c4']

function Tank({ level, cap, state, label }: { level: number; cap?: boolean; state: 'ok' | 'crash' | 'wall'; label: string }) {
  const color = state === 'crash' ? '#ff4b4b' : state === 'wall' ? '#ff9600' : '#1cb0f6'
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`duo-tank ${state === 'crash' ? 'duo-shake' : ''}`}>
        <div className="duo-liquid" style={{ height: `${Math.min(100, level)}%`, background: color }}>
          <span className="duo-wave" style={{ background: color }} />
        </div>
        {cap && <span className="duo-lid" />}
        {state === 'crash' && <span className="absolute inset-0 flex items-center justify-center text-[22px]">💥</span>}
      </div>
      <span className={`text-[11px] font-extrabold ${state === 'crash' ? 'text-[#ea2b2b]' : state === 'wall' ? 'text-[#cd7900]' : 'text-[#777]'}`}>{label}</span>
    </div>
  )
}

export function GpuEx({ ex, report, muted }: Base & { ex: { prompt: string } }) {
  const [mode, setMode] = useState<'timeslice' | 'hami'>('timeslice')
  const [phase, setPhase] = useState<'idle' | 'filling' | 'done'>('idle')
  const [greed, setGreed] = useState(12)
  const [tried, setTried] = useState<Set<string>>(new Set())
  const raf = useRef(0)
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const run = () => {
    sfx.tap(muted)
    setPhase('filling')
    const t0 = performance.now()
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / 1600)
      setGreed(12 + p * 88)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else {
        setPhase('done')
        mode === 'timeslice' ? sfx.bad(muted) : sfx.good(muted)
        setTried((t) => {
          const n = new Set(t).add(mode)
          if (n.size === 2) report({ ready: true, correct: true })
          return n
        })
      }
    }
    raf.current = requestAnimationFrame(tick)
  }
  const switchMode = (m: typeof mode) => {
    cancelAnimationFrame(raf.current)
    sfx.tap(muted)
    setMode(m)
    setPhase('idle')
    setGreed(12)
  }

  const shared = mode === 'timeslice'
  const overflow = phase !== 'idle' && greed > 70
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        <Chip mood={phase === 'done' ? (shared ? 'sad' : 'happy') : 'think'} size={62} />
        <Bubble>{ex.prompt}</Bubble>
      </div>
      <div className="flex justify-center gap-2">
        <Duo tone={shared ? 'orange' : 'white'} onClick={() => switchMode('timeslice')} className="px-4 py-2 text-[13px]">
          {tried.has('timeslice') ? '✓ ' : ''}Time-slicing
        </Duo>
        <Duo tone={!shared ? 'green' : 'white'} onClick={() => switchMode('hami')} className="px-4 py-2 text-[13px]">
          {tried.has('hami') ? '✓ ' : ''}HAMi slices
        </Duo>
      </div>

      {/* The card */}
      <div className="duo-gpu relative mx-auto w-full max-w-[560px] rounded-[22px] p-4 pt-9">
        <div className="absolute left-4 top-2.5 flex items-center gap-2 text-[12px] font-black tracking-wider text-white/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/logos/nvidia.svg" alt="" className="h-4 w-4" /> RTX 4090
        </div>
        <div className="absolute right-4 top-2 flex gap-1.5" aria-hidden="true">
          {[0, 1].map((i) => (
            <span key={i} className={`duo-fan ${phase === 'filling' ? 'spin-fast' : ''}`} />
          ))}
        </div>
        <div className="mb-3 flex justify-around">
          {PEOPLE.map((c, i) => (
            <span key={i} className={`duo-person ${i === 2 ? 'greedy' : ''} ${phase !== 'idle' && shared && overflow && i !== 2 ? 'crashed' : ''}`} style={{ background: c }}>
              {i === 2 ? '😈' : phase !== 'idle' && shared && overflow ? '😵' : '🙂'}
            </span>
          ))}
        </div>
        {shared ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="duo-tank wide">
              <div className="duo-liquid" style={{ height: `${Math.min(100, 30 + (greed - 12) * 0.9)}%`, background: overflow ? '#ff4b4b' : '#1cb0f6' }}>
                <span className="duo-wave" style={{ background: overflow ? '#ff4b4b' : '#1cb0f6' }} />
              </div>
              {overflow && <span className="absolute inset-0 flex items-center justify-center text-[15px] font-black text-white drop-shadow">OUT OF MEMORY · EVERYONE CRASHED</span>}
            </div>
            <span className="text-[11px] font-extrabold text-white/70">one shared memory pool</span>
          </div>
        ) : (
          <div className="flex justify-around">
            {PEOPLE.map((_, i) => (
              <Tank key={i} cap level={i === 2 ? Math.min(100, greed) : 34 + ((i * 13) % 20)} state={i === 2 && greed >= 99 ? 'wall' : 'ok'} label={i === 2 && greed >= 99 ? 'hit 8 GB' : '8 GB'} />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Duo tone="red" onClick={run} disabled={phase === 'filling'} className="px-6 py-3 text-[14px]">
          😈 Run the greedy job
        </Duo>
      </div>
      {phase === 'done' && (
        <p className={`duo-pop text-center text-[15px] font-extrabold ${shared ? 'text-[#ea2b2b]' : 'text-[#58a700]'}`}>
          {shared ? 'One job ate all the memory. Five neighbours crashed.' : 'The greedy job hit its own 8 GB wall. Everyone else kept working.'}
          {tried.size < 2 && <span className="block text-[13px] font-bold text-[#777]">Now try the other setup.</span>}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------- race */

const LANES = [
  { id: 'aws', label: 'AWS', logo: '/media/logos/aws-ec2.svg', rider: '🚚', secs: 7.5, total: '12 min', stops: ['boot g4dn', 'join cluster', 'pull image', 'IDE'] },
  { id: 'metal', label: 'Bare metal', logo: '/media/logos/kubernetes.svg', rider: '🚀', secs: 2.4, total: '4 min', stops: ['pod', 'HAMi slice', 'IDE'] },
]

export function RaceEx({ ex, report, muted }: Base & { ex: { prompt: string } }) {
  const [t, setT] = useState<number | null>(null)
  const raf = useRef(0)
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  const go = () => {
    sfx.tap(muted)
    const t0 = performance.now()
    let metalDone = false
    const tick = () => {
      const s = (performance.now() - t0) / 1000
      setT(s)
      if (!metalDone && s >= LANES[1].secs) {
        metalDone = true
        sfx.good(muted)
      }
      if (s < LANES[0].secs) raf.current = requestAnimationFrame(tick)
      else report({ ready: true, correct: true })
    }
    raf.current = requestAnimationFrame(tick)
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-3">
        <Chip mood={t !== null && t >= LANES[0].secs ? 'wow' : 'happy'} size={84} />
        <Bubble>{ex.prompt}</Bubble>
      </div>
      <div className="flex flex-col gap-4">
        {LANES.map((l) => {
          const p = t === null ? 0 : Math.min(1, t / l.secs)
          return (
            <div key={l.id}>
              <div className="mb-1 flex items-center justify-between text-[13px] font-extrabold text-[#4b4b4b]">
                <span className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.logo} alt="" className="h-5 w-5" /> {l.label}
                </span>
                <span className={p >= 1 ? 'duo-pop text-[#58a700]' : 'text-[#afafaf]'}>{p >= 1 ? `🏁 ${l.total}` : t === null ? '' : `${Math.round(p * (l.id === 'aws' ? 12 : 4))} min`}</span>
              </div>
              <div className="duo-road">
                {l.stops.map((s, i) => (
                  <span key={s} className={`duo-stop ${p >= (i + 1) / (l.stops.length + 0.2) ? 'on' : ''}`} style={{ left: `${((i + 1) / (l.stops.length + 0.2)) * 88}%` }}>
                    {s}
                  </span>
                ))}
                <span className="duo-flag" />
                <span className={`duo-rider ${t !== null && p < 1 ? 'moving' : ''}`} style={{ left: `calc(${p * 88}% + 4px)` }}>
                  <span className={l.id === 'metal' ? 'inline-block rotate-45' : 'inline-block -scale-x-100'}>{l.rider}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-center">
        <Duo tone="purple" onClick={go} disabled={t !== null && t < LANES[0].secs} className="px-8 py-3 text-[15px]">
          {t === null ? '🏁 Launch both!' : t < LANES[0].secs ? 'Racing…' : '↻ Race again'}
        </Duo>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ launch */

export function LaunchEx({ ex, report }: Base & { ex: { prompt: string; why: string } }) {
  useEffect(() => {
    report({ ready: true, correct: true })
  }, [report])
  return (
    <div className="flex flex-col items-center gap-5 pt-4 text-center">
      <div className="relative">
        <Chip mood="wave" size={150} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/logos/jupyter.svg" alt="" className="duo-float absolute -right-20 -top-2 h-12 w-12" />
      </div>
      <p className="text-[26px] font-black text-[#3c3c3c]">{ex.prompt}</p>
      <p className="max-w-[420px] text-[16px] font-bold text-[#777]">{ex.why}</p>
    </div>
  )
}
