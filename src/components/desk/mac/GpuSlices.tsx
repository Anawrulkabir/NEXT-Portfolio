'use client'
/**
 * GPU Slices: a toy that explains the AI Studio change. Launch sessions the
 * old way (a fresh cloud GPU instance, 10–15 min) or the new way (a free HAMi
 * slice on the bare-metal cluster, 3–5 min). Times are scaled 60× so a minute
 * becomes a second. Numbers follow the CV; the rest is illustration.
 */
import { useEffect, useRef, useState } from 'react'

type Mode = 'before' | 'after'
type Session = { id: number; mode: Mode; slice: number | null; start: number; dur: number; ready: boolean }

const SLICES = 6
const rand = (a: number, b: number) => a + Math.random() * (b - a)

export function GpuSlicesApp() {
  const [mode, setMode] = useState<Mode>('after')
  const [sessions, setSessions] = useState<Session[]>([])
  const [queue, setQueue] = useState(0)
  const [now, setNow] = useState(() => performance.now())
  const nextId = useRef(1)
  const [times, setTimes] = useState<{ before: number[]; after: number[] }>({ before: [], after: [] })

  useEffect(() => {
    let raf = 0
    const tick = () => {
      setNow(performance.now())
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Finish launches whose time is up.
  useEffect(() => {
    const done = sessions.filter((s) => !s.ready && now - s.start >= s.dur)
    if (!done.length) return
    setSessions((ss) => ss.map((s) => (done.includes(s) ? { ...s, ready: true } : s)))
    setTimes((t) => {
      const n = { ...t }
      done.forEach((s) => (n[s.mode] = [...n[s.mode], s.dur / 1000]))
      return n
    })
  }, [now, sessions])

  const usedSlices = new Set(sessions.filter((s) => s.mode === 'after').map((s) => s.slice))
  const freeSlice = [...Array(SLICES).keys()].find((i) => !usedSlices.has(i))

  const launch = () => {
    const id = nextId.current++
    if (mode === 'after') {
      if (freeSlice === undefined) {
        setQueue((q) => q + 1)
        return
      }
      setSessions((ss) => [...ss, { id, mode, slice: freeSlice, start: performance.now(), dur: rand(3000, 5000), ready: false }])
    } else {
      setSessions((ss) => [...ss, { id, mode, slice: null, start: performance.now(), dur: rand(10000, 15000), ready: false }])
    }
  }

  const end = (id: number) => setSessions((ss) => ss.filter((s) => s.id !== id))

  // Serve the queue when a slice frees up.
  useEffect(() => {
    if (queue > 0 && freeSlice !== undefined && mode === 'after') {
      setQueue((q) => q - 1)
      setSessions((ss) => [...ss, { id: nextId.current++, mode: 'after', slice: freeSlice, start: performance.now(), dur: rand(3000, 5000), ready: false }])
    }
  }, [queue, freeSlice, mode])

  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)
  const cloud = sessions.filter((s) => s.mode === 'before')

  return (
    <div className="h-full flex flex-col bg-[#10150f] text-[#e9e6de] text-[13px]">
      <header className="px-5 pt-4 pb-3 border-b border-white/10">
        <p className="text-[18px] font-semibold">How AI Studio shares a GPU</p>
        <p className="text-white/55 text-[12px] mt-0.5">
          An illustration of my work at Poridhi.io. Times are scaled 60×: one second here is one minute there.
        </p>
        <div className="mt-3 inline-flex rounded-lg bg-white/10 p-0.5" role="radiogroup" aria-label="Setup">
          {(
            [
              ['before', 'Before: a cloud GPU per session'],
              ['after', 'After: HAMi slices on bare metal'],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-[12px] ${mode === m ? 'bg-[#efe6d6] text-black font-medium' : 'text-white/70 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-[1.25fr_1fr] gap-5 p-5 min-h-0">
        {mode === 'after' ? (
          <section aria-label="One RTX 4090, six slices">
            <div className="rounded-xl border border-white/15 bg-gradient-to-b from-[#1b241d] to-[#121812] p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">RTX 4090</p>
                <p className="text-white/50 text-[12px]">HAMi · 6 slices × 8 GB · hard isolation</p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[...Array(SLICES).keys()].map((i) => {
                  const s = sessions.find((x) => x.slice === i && x.mode === 'after')
                  const pct = s ? Math.min(1, (now - s.start) / s.dur) : 0
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!s?.ready}
                      onClick={() => s && end(s.id)}
                      className={`relative h-[76px] overflow-hidden rounded-lg border text-left px-2.5 py-2 transition-colors ${
                        s ? (s.ready ? 'border-[#7fc08c] bg-[#7fc08c]/15 hover:bg-[#a9444c]/25' : 'border-[#efe6d6]/40 bg-white/5') : 'border-white/10 bg-white/[0.03]'
                      }`}
                      title={s?.ready ? 'Click to end this session' : undefined}
                    >
                      <span className="block text-[11px] text-white/45">slice {i + 1} · 8 GB</span>
                      <span className="block mt-1 font-medium">{s ? (s.ready ? `session ${s.id}` : 'starting…') : 'free'}</span>
                      {s && !s.ready && <span className="absolute left-0 bottom-0 h-1 bg-[#efe6d6]" style={{ width: `${pct * 100}%` }} />}
                      {s?.ready && <span className="block text-[11px] text-[#7fc08c]">running · click to end</span>}
                    </button>
                  )
                })}
              </div>
            </div>
            {queue > 0 && <p className="mt-3 text-[#f2c14e]">{queue} waiting for a free slice. End a session to let one in.</p>}
          </section>
        ) : (
          <section aria-label="Cloud GPU instances">
            <div className="rounded-xl border border-white/15 bg-gradient-to-b from-[#1b1f24] to-[#121418] p-4 min-h-[190px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold">AWS · one g4dn instance per session</p>
                <p className="text-white/50 text-[12px]">boot · pull image · mount storage</p>
              </div>
              <ul className="mt-3 space-y-2">
                {cloud.length === 0 && <li className="text-white/40">No sessions yet.</li>}
                {cloud.map((s) => {
                  const pct = Math.min(1, (now - s.start) / s.dur)
                  return (
                    <li key={s.id} className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2">
                      <div className="flex justify-between text-[12px]">
                        <span>session {s.id}</span>
                        {s.ready ? (
                          <button type="button" onClick={() => end(s.id)} className="text-[#7fc08c] hover:underline">
                            ready · end
                          </button>
                        ) : (
                          <span className="text-white/50">{pct < 0.35 ? 'booting instance…' : pct < 0.75 ? 'pulling image…' : 'mounting storage…'}</span>
                        )}
                      </div>
                      <div className="mt-1.5 h-1 rounded bg-white/10">
                        <div className="h-1 rounded bg-[#a9444c]" style={{ width: `${pct * 100}%` }} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        )}

        <aside className="flex flex-col gap-3">
          <button type="button" onClick={launch} className="rounded-lg bg-[#efe6d6] py-2.5 font-semibold text-black hover:bg-white active:translate-y-px">
            Launch a session
          </button>
          <div className="rounded-xl border border-white/10 p-3">
            <p className="text-white/50 text-[12px]">Average launch time (seen here)</p>
            {(['before', 'after'] as const).map((m) => {
              const a = avg(times[m])
              return (
                <p key={m} className="mt-1.5 flex justify-between">
                  <span>{m === 'before' ? 'Before' : 'After'}</span>
                  <span className={m === 'after' ? 'text-[#7fc08c]' : 'text-[#e58a92]'}>{a ? `${a.toFixed(1)} min` : '—'}</span>
                </p>
              )
            })}
            <p className="mt-2 text-[11px] text-white/40">Real numbers: 10–15 min before, 3–5 min after.</p>
          </div>
          <p className="text-[12px] leading-relaxed text-white/60">
            Kubernetes can time-slice a GPU, but sessions then share its memory. HAMi gives each slice its own hard
            8 GB limit, so one user&rsquo;s job can&rsquo;t crowd out another&rsquo;s.
          </p>
        </aside>
      </div>
    </div>
  )
}
