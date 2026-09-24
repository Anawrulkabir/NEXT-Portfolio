'use client'
/**
 * GPU Academy: a Duolingo-style path through how AI Studio launches a GPU
 * session. Five short lessons, hearts, XP, a mascot, and at the end a
 * session you launch yourself.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Lock, X } from 'lucide-react'
import { useOS } from '../../context'
import { LESSONS, type Lesson } from './lessons'
import { ChoiceEx, GpuEx, LaunchEx, MatchEx, OrderEx, RaceEx } from './exercises'
import { Bubble, Chip, Confetti, Duo, sfx } from './ui'

const KEY = 'gpu-academy:v1'
type Progress = { done: string[]; xp: number }

function load(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? '')
    if (Array.isArray(p.done) && typeof p.xp === 'number') return p
  } catch {
    /* ignore */
  }
  return { done: [], xp: 0 }
}
function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------ decorations */

function Rack({ x, y }: { x: number; y: number }) {
  return (
    <svg className="duo-deco" style={{ left: x, top: y }} width="54" height="80" viewBox="0 0 54 80" aria-hidden="true">
      <ellipse cx="27" cy="77" rx="24" ry="3" fill="#000" opacity="0.08" />
      <rect x="4" y="2" width="46" height="72" rx="8" fill="#4b4b4b" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="9" y={8 + i * 16} width="36" height="12" rx="3" fill="#3c3c3c" />
          <circle cx="15" cy={14 + i * 16} r="2" fill={i % 2 ? '#58cc02' : '#1cb0f6'} className="duo-blink" style={{ animationDelay: `${i * 0.3}s` }} />
          <rect x="21" y={13 + i * 16} width="18" height="2" rx="1" fill="#777" />
        </g>
      ))}
    </svg>
  )
}
function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <svg className="duo-deco duo-drift" style={{ left: x, top: y }} width={90 * s} height={44 * s} viewBox="0 0 90 44" aria-hidden="true">
      <path d="M20 40 a14 14 0 0 1 2-28 a18 18 0 0 1 34-4 a14 14 0 0 1 20 10 a11 11 0 0 1-4 22z" fill="#fff" stroke="#e5e5e5" strokeWidth="2" />
    </svg>
  )
}

/* -------------------------------------------------------------------- map */

const OFFSETS = [0, 70, 100, 70, 0, -70]

function PathMap({ progress, onStart }: { progress: Progress; onStart: (l: Lesson) => void }) {
  const [open, setOpen] = useState<string | null>(null)
  const nextIdx = LESSONS.findIndex((l) => !progress.done.includes(l.id))
  return (
    <div className="relative mx-auto flex max-w-[560px] flex-col items-center pb-10 pt-4">
      <div className="duo-unit mb-16 w-full rounded-2xl px-5 py-4 text-white">
        <p className="text-[12px] font-extrabold uppercase tracking-widest opacity-80">Unit 1 · Poridhi.io, 2025–now</p>
        <p className="text-[21px] font-black leading-tight">How AI Studio hands you a GPU</p>
      </div>
      <Cloud x={-10} y={120} />
      <Cloud x={430} y={330} s={0.8} />
      <Rack x={60} y={380} />
      <Rack x={450} y={120} />

      {LESSONS.map((l, i) => {
        const done = progress.done.includes(l.id)
        const current = i === nextIdx
        const locked = !done && !current
        const off = OFFSETS[i % OFFSETS.length]
        return (
          <div key={l.id} className="relative mb-7 flex flex-col items-center" style={{ transform: `translateX(${off}px)` }}>
            {current && open !== l.id && (
              <span className="duo-start" aria-hidden="true">
                {progress.done.length ? 'NEXT' : 'START'}
              </span>
            )}
            <div className="relative">
              {current && (
                <svg className="pointer-events-none absolute -inset-[9px]" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#e5e5e5" strokeWidth="7" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke={l.color} strokeWidth="7" strokeDasharray="289" strokeDashoffset="220" strokeLinecap="round" transform="rotate(-90 50 50)" />
                </svg>
              )}
              <button
                type="button"
                disabled={locked}
                onClick={() => setOpen(open === l.id ? null : l.id)}
                aria-label={`${l.title}${done ? ', completed' : locked ? ', locked' : ''}`}
                className="duo-node"
                style={{ ['--c' as string]: locked ? '#e5e5e5' : done ? '#ffc800' : l.color, ['--s' as string]: locked ? '#cfcfcf' : done ? '#e5a400' : `color-mix(in srgb, ${l.color} 75%, black)` }}
              >
                {locked ? (
                  <Lock className="h-8 w-8 text-[#afafaf]" strokeWidth={3} aria-hidden="true" />
                ) : done ? (
                  <span className="text-[30px]" aria-hidden="true">
                    👑
                  </span>
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.icon} alt="" className="h-7 w-7" />
                  </span>
                )}
              </button>
            </div>
            {open === l.id && (
              <div className="duo-pop absolute top-[92px] z-10 w-[260px] rounded-2xl p-4 text-white shadow-lg" style={{ background: done ? '#ffc800' : l.color }}>
                <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45" style={{ background: done ? '#ffc800' : l.color }} />
                <p className="text-[18px] font-black">{l.title}</p>
                <p className="mb-3 text-[14px] font-bold opacity-90">{l.blurb}</p>
                <Duo tone="white" className="w-full py-2.5 text-[14px]" style={{ color: done ? '#cd9900' : l.color }} onClick={() => onStart(l)}>
                  {done ? 'Practise again +5 XP' : `Start +${l.exercises.length * 10} XP`}
                </Duo>
              </div>
            )}
          </div>
        )
      })}

      <div className="absolute -left-24 top-[150px] hidden flex-col items-center md:flex">
        <Bubble side="bottom">{progress.done.length === LESSONS.length ? 'You did it all!' : progress.done.length ? 'Keep going!' : 'Tap START!'}</Bubble>
        <Chip mood="wave" size={100} />
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- lesson */

type Stat = { xp: number; mistakes: number; seconds: number }

function Player({ lesson, muted, onExit, onDone }: { lesson: Lesson; muted: boolean; onExit: () => void; onDone: (s: Stat) => void }) {
  const [queue, setQueue] = useState<number[]>(() => lesson.exercises.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [solved, setSolved] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [mistakes, setMistakes] = useState(0)
  const [status, setStatus] = useState<'answer' | 'good' | 'bad'>('answer')
  const [rep, setRep] = useState({ ready: false, correct: false })
  const [attempt, setAttempt] = useState(0)
  const started = useRef(Date.now())
  const scroller = useRef<HTMLDivElement>(null)
  const report = useCallback((r: { ready: boolean; correct: boolean }) => setRep(r), [])

  const idx = queue[pos]
  const ex = lesson.exercises[idx]
  const isLaunch = ex.kind === 'launch'

  const check = () => {
    if (!rep.ready) return
    if (rep.correct) {
      sfx.good(muted)
      setStatus('good')
      setSolved((s) => s + 1)
    } else {
      sfx.bad(muted)
      setStatus('bad')
      setMistakes((m) => m + 1)
      setHearts((h) => Math.max(0, h - 1))
      setQueue((q) => [...q, idx]) // try it again at the end, like Duolingo
    }
  }
  const next = () => {
    if (status === 'good' && solved >= lesson.exercises.length) {
      onDone({ xp: lesson.exercises.length * 10, mistakes, seconds: Math.round((Date.now() - started.current) / 1000) })
      return
    }
    setPos((p) => p + 1)
    setStatus('answer')
    setRep({ ready: false, correct: false })
    setAttempt((a) => a + 1)
    if (scroller.current) scroller.current.scrollTop = 0
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (status === 'answer') check()
      else next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const pct = (solved / lesson.exercises.length) * 100
  const props = { checked: status !== 'answer', report, muted }

  if (hearts === 0 && status === 'answer')
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <Chip mood="sad" size={130} />
        <p className="text-[24px] font-black text-[#3c3c3c]">Out of hearts!</p>
        <p className="text-[15px] font-bold text-[#777]">Happens to everyone. Here, have a refill.</p>
        <Duo tone="red" className="px-8 py-3 text-[15px]" onClick={() => setHearts(5)}>
          ❤️ Refill hearts
        </Duo>
      </div>
    )

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto flex w-full max-w-[640px] items-center gap-4 px-4 pt-4">
        <button type="button" onClick={onExit} aria-label="Quit lesson" className="text-[#afafaf] hover:text-[#777]">
          <X className="h-7 w-7" strokeWidth={3} />
        </button>
        <div className="duo-progress flex-1" aria-label={`${Math.round(pct)}% done`}>
          <span style={{ width: `${Math.max(4, pct)}%` }} />
        </div>
        <span className="flex items-center gap-1 text-[16px] font-black text-[#ff4b4b]">❤️ {hearts}</span>
      </div>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto mac-scroll">
        <div key={`${idx}-${attempt}`} className="duo-enter mx-auto w-full max-w-[600px] px-4 py-4">
          {ex.kind === 'choice' && <ChoiceEx ex={ex} {...props} />}
          {ex.kind === 'order' && <OrderEx ex={ex} {...props} />}
          {ex.kind === 'match' && <MatchEx ex={ex} {...props} />}
          {ex.kind === 'gpu' && <GpuEx ex={ex} {...props} />}
          {ex.kind === 'race' && <RaceEx ex={ex} {...props} />}
          {ex.kind === 'launch' && <LaunchEx ex={ex} {...props} />}
        </div>
      </div>

      <div className={`duo-footer ${status}`}>
        <div className="mx-auto flex w-full max-w-[640px] flex-wrap items-center gap-4 px-4">
          {status === 'answer' ? (
            <>
              <span className="flex-1" />
              <Duo tone="green" disabled={!rep.ready} onClick={check} className="min-w-[150px] px-6 py-3 text-[15px]">
                {isLaunch ? 'Let’s go' : 'Check'}
              </Duo>
            </>
          ) : (
            <>
              <span className="duo-pop hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[28px] sm:flex">{status === 'good' ? '✅' : '❌'}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-[20px] font-black ${status === 'good' ? 'text-[#58a700]' : 'text-[#ea2b2b]'}`}>
                  {status === 'good' ? ['Nice!', 'Great job!', 'Correct!', 'You got it!'][solved % 4] : 'Not quite'}
                </p>
                <p className={`text-[14px] font-bold ${status === 'good' ? 'text-[#58a700]' : 'text-[#ea2b2b]'}`}>{ex.why}</p>
              </div>
              <Duo tone={status === 'good' ? 'green' : 'red'} onClick={next} autoFocus className="w-full min-w-[150px] px-6 py-3 text-[15px] sm:w-auto">
                {status === 'good' ? 'Continue' : 'Got it'}
              </Duo>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- complete */

function Complete({ lesson, stat, muted, onContinue }: { lesson: Lesson; stat: Stat; muted: boolean; onContinue: () => void }) {
  useEffect(() => {
    sfx.win(muted)
  }, [muted])
  const acc = Math.round((lesson.exercises.length / (lesson.exercises.length + stat.mistakes)) * 100)
  const time = `${Math.floor(stat.seconds / 60)}:${String(stat.seconds % 60).padStart(2, '0')}`
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5 overflow-hidden px-6 text-center">
      <Confetti />
      <Chip mood="happy" size={150} />
      <p className="duo-pop text-[32px] font-black text-[#ffc800] drop-shadow-[0_2px_0_#e5a400]">Lesson complete!</p>
      <div className="flex gap-3">
        {[
          ['Total XP', `⚡ ${stat.xp}`, '#ffc800'],
          [acc === 100 ? 'Amazing' : 'Good', `🎯 ${acc}%`, '#58cc02'],
          ['Speedy', `⏱ ${time}`, '#1cb0f6'],
        ].map(([label, value, c], i) => (
          <div key={label} className="duo-stat duo-pop" style={{ ['--c' as string]: c, animationDelay: `${0.15 + i * 0.12}s` }}>
            <p className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-white">{label}</p>
            <p className="rounded-b-[13px] bg-white px-4 py-3 text-[18px] font-black" style={{ color: c }}>
              {value}
            </p>
          </div>
        ))}
      </div>
      <Duo tone="green" onClick={onContinue} autoFocus className="mt-2 min-w-[220px] px-8 py-3 text-[15px]">
        {lesson.id === 'launch' ? 'Open the launcher' : 'Continue'}
      </Duo>
    </div>
  )
}

/* ------------------------------------------------------------------ shell */

export function Academy({ onLaunch }: { onLaunch: () => void }) {
  const { muted } = useOS()
  const [progress, setProgress] = useState<Progress>({ done: [], xp: 0 })
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [stat, setStat] = useState<Stat | null>(null)
  useEffect(() => {
    setProgress(load())
  }, [])

  const finish = (s: Stat) => {
    if (!lesson) return
    const again = progress.done.includes(lesson.id)
    const p = { done: again ? progress.done : [...progress.done, lesson.id], xp: progress.xp + (again ? 5 : s.xp) }
    setProgress(p)
    save(p)
    setStat({ ...s, xp: again ? 5 : s.xp })
  }

  return (
    <div className="duo-root flex h-full min-h-0 flex-col">
      {!lesson && (
        <div className="flex items-center justify-end gap-5 border-b-2 border-[#e5e5e5] px-5 py-2 text-[15px] font-black">
          <span className="text-[#ff9600]" title="Lessons finished">
            🔥 {progress.done.length}
          </span>
          <span className="text-[#1cb0f6]" title="XP">
            💎 {progress.xp}
          </span>
          <span className="text-[#ff4b4b]" title="Hearts">
            ❤️ 5
          </span>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden mac-scroll">
        {!lesson && <PathMap progress={progress} onStart={(l) => setLesson(l)} />}
        {lesson && !stat && <Player key={lesson.id} lesson={lesson} muted={muted} onExit={() => setLesson(null)} onDone={finish} />}
        {lesson && stat && (
          <Complete
            lesson={lesson}
            stat={stat}
            muted={muted}
            onContinue={() => {
              const wasLaunch = lesson.id === 'launch'
              setLesson(null)
              setStat(null)
              if (wasLaunch) onLaunch()
            }}
          />
        )}
      </div>
    </div>
  )
}
