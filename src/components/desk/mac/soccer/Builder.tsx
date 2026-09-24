'use client'
/**
 * The workbench: follow the manual, pick each real part from the tray, place
 * it on the chassis, wire the terminals, upload the sketch, power on.
 */
import { useEffect, useMemo, useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { PARTS, PartArt, PartDefs, PartThumb, type PartId } from './parts'
import { BOARD, CHASSIS, SKETCH, SLOTS, STEPS, TERMINALS, wireKey, type Wire } from './manual'

const slotById = Object.fromEntries(SLOTS.map((s) => [s.id, s]))
const termById = Object.fromEntries(TERMINALS.map((t) => [t.id, t]))

function wirePath(w: Wire) {
  const a = termById[w.a]
  const b = termById[w.b]
  const my = (a.y + b.y) / 2
  return `M${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`
}

type Msg = { tone: 'ok' | 'err'; text: string } | null

export function Builder({ onDone, onSkip }: { onDone: () => void; onSkip: () => void }) {
  const [step, setStep] = useState(0)
  const [placed, setPlaced] = useState<Set<string>>(new Set())
  const [wires, setWires] = useState<Wire[]>([])
  const [part, setPart] = useState<PartId | null>(null)
  const [term, setTerm] = useState<string | null>(null)
  const [msg, setMsg] = useState<Msg>(null)
  const [charge, setCharge] = useState(0)
  const [uploadLog, setUploadLog] = useState<string[]>([])
  const [powered, setPowered] = useState(false)
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set())

  const s = STEPS[step]
  const wireKeys = useMemo(() => new Set(wires.map((w) => wireKey(w.a, w.b))), [wires])
  const used = (id: PartId) => SLOTS.filter((sl) => sl.part === id && placed.has(sl.id)).length
  const stepDone = doneSteps.has(step)

  const complete = (text: string) => {
    setDoneSteps((d) => new Set(d).add(step))
    setMsg({ tone: 'ok', text })
    setPart(null)
    setTerm(null)
  }
  const next = () => {
    setMsg(null)
    setStep((i) => Math.min(STEPS.length - 1, i + 1))
  }

  // Place steps finish when all their slots are filled; wire steps when all wires exist.
  useEffect(() => {
    if (stepDone) return
    if (s.kind === 'place' && s.slots.every((id) => placed.has(id))) complete('Done. Nicely seated.')
    if (s.kind === 'wire' && s.wires.every((w) => wireKeys.has(wireKey(w.a, w.b)))) complete('All connected.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed, wireKeys, step])

  const needed = new Set<PartId>(s.kind === 'place' ? s.slots.filter((id) => !placed.has(id)).map((id) => slotById[id].part) : [])

  const pickPart = (id: PartId) => {
    if (s.kind !== 'place') return setMsg({ tone: 'err', text: 'No parts needed right now. Follow the manual on the right.' })
    if (!needed.has(id)) return setMsg({ tone: 'err', text: `Not yet. This step needs: ${[...needed].map((n) => PARTS[n].name).join(', ')}.` })
    setPart(id)
    setMsg(null)
  }

  const dropOn = (slotId: string) => {
    const sl = slotById[slotId]
    if (!part) return setMsg({ tone: 'err', text: `Pick a ${PARTS[sl.part].name} from the parts tray first.` })
    if (part !== sl.part) return setMsg({ tone: 'err', text: `That spot is for the ${PARTS[sl.part].name}.` })
    setPlaced((p) => new Set(p).add(slotId))
    const left = PARTS[part].qty - used(part) - 1
    if (left <= 0) setPart(null)
    setMsg(null)
  }

  const clickTerm = (id: string) => {
    if (s.kind !== 'wire') return
    if (!term) return setTerm(id)
    if (term === id) return setTerm(null)
    const want = s.wires.find((w) => wireKey(w.a, w.b) === wireKey(term, id))
    if (want && !wireKeys.has(wireKey(term, id))) {
      setWires((ws) => [...ws, want])
      setTerm(null)
      setMsg(null)
    } else if (want) {
      setTerm(null)
      setMsg({ tone: 'err', text: 'Those two are already connected.' })
    } else {
      setTerm(null)
      setMsg({ tone: 'err', text: `Not quite. ${s.hint}` })
    }
  }

  const runAction = () => {
    if (s.kind !== 'action' || stepDone) return
    if (s.id === 'charge') {
      const t0 = performance.now()
      const tick = () => {
        const p = Math.min(1, (performance.now() - t0) / 2200)
        setCharge(p)
        if (p < 1) requestAnimationFrame(tick)
        else complete('Balanced and full: 4.2 V per cell, 12.6 V in total.')
      }
      requestAnimationFrame(tick)
    } else if (s.id === 'upload') {
      const lines = ['Compiling sketch…', 'Uploading to Arduino Uno…', 'Done uploading.']
      lines.forEach((l, i) => setTimeout(() => setUploadLog((x) => [...x, l]), 500 + i * 700))
      setTimeout(() => complete('The Uno is listening for Bluetooth commands.'), 500 + lines.length * 700)
    } else {
      setPowered(true)
      complete('It’s alive. Pair a phone and drive.')
    }
  }

  const reset = () => {
    setStep(0)
    setPlaced(new Set())
    setWires([])
    setPart(null)
    setTerm(null)
    setMsg(null)
    setCharge(0)
    setUploadLog([])
    setPowered(false)
    setDoneSteps(new Set())
  }

  const activeTerms = new Set(s.kind === 'wire' ? s.wires.flatMap((w) => [w.a, w.b]) : [])

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[210px_1fr_300px] bg-[#1f2a22] text-[#efe6d6] text-[13px] min-h-0">
      {/* Parts tray */}
      <aside aria-label="Parts tray" className="order-3 md:order-1 border-t md:border-t-0 md:border-r border-white/10 p-3 overflow-y-auto mac-scroll">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45 mb-2">Parts tray</p>
        <ul className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
          {(Object.keys(PARTS) as PartId[]).map((id) => {
            const left = PARTS[id].qty - used(id)
            const want = needed.has(id)
            return (
              <li key={id}>
                <button
                  type="button"
                  disabled={left === 0}
                  onClick={() => pickPart(id)}
                  aria-pressed={part === id}
                  className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                    part === id ? 'bg-[#efe6d6] text-black' : want ? 'bg-white/10 ring-1 ring-[#f2c14e]/70 hover:bg-white/15' : 'hover:bg-white/5'
                  } disabled:opacity-30`}
                >
                  <span className="shrink-0 rounded-md bg-black/25 p-0.5">
                    <PartThumb id={id} size={40} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium leading-tight truncate">{PARTS[id].name}</span>
                    <span className={`block text-[11px] truncate ${part === id ? 'text-black/60' : 'text-white/50'}`}>
                      {left > 0 ? `×${left} · ${PARTS[id].spec}` : 'all used'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      {/* The bot, top-down */}
      <div className="order-1 md:order-2 relative min-h-[260px] flex items-center justify-center p-2">
        <svg viewBox={`0 0 ${BOARD.w} ${BOARD.h}`} className="w-full h-full max-h-full" role="img" aria-label="The robot chassis, seen from above">
          <PartDefs />
          <rect x={CHASSIS.x} y={CHASSIS.y} width={CHASSIS.w} height={CHASSIS.h} rx={10} fill="url(#ply)" stroke="#8a6238" strokeWidth={3} />
          <text x={CHASSIS.x + 12} y={CHASSIS.y + CHASSIS.h - 12} fontSize={12} fill="#6e4d2a" fontFamily="monospace">
            FRONT ↑ · plywood chassis
          </text>

          {/* Empty targets for this step */}
          {s.kind === 'place' &&
            s.slots
              .filter((id) => !placed.has(id))
              .map((id) => {
                const sl = slotById[id]
                const p = PARTS[sl.part]
                const hot = part === sl.part
                return (
                  <g
                    key={id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Place here: ${sl.label}`}
                    onClick={() => dropOn(id)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && dropOn(id)}
                    className="cursor-pointer outline-none"
                  >
                    <rect
                      x={sl.x - p.w / 2 - 6}
                      y={sl.y - p.h / 2 - 6}
                      width={p.w + 12}
                      height={p.h + 12}
                      rx={8}
                      fill={hot ? 'rgba(242,193,78,0.25)' : 'rgba(255,255,255,0.08)'}
                      stroke={hot ? '#f2c14e' : 'rgba(255,255,255,0.55)'}
                      strokeWidth={2}
                      strokeDasharray="7 5"
                      className={hot ? 'bb-pulse' : ''}
                    />
                    <text x={sl.x} y={sl.y + 4} textAnchor="middle" fontSize={11} fill="#fff" style={{ pointerEvents: 'none' }}>
                      {sl.label}
                    </text>
                  </g>
                )
              })}

          {/* Placed parts */}
          {SLOTS.filter((sl) => placed.has(sl.id)).map((sl) => (
            <g key={sl.id} transform={`translate(${sl.x} ${sl.y}) scale(${sl.flip ? -1 : 1} 1)`} className="bb-pop">
              <PartArt id={sl.part} />
            </g>
          ))}

          {/* Wires */}
          {wires.map((w) => (
            <g key={wireKey(w.a, w.b)}>
              <path d={wirePath(w)} fill="none" stroke="#111" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
              <path d={wirePath(w)} fill="none" stroke={w.color} strokeWidth={3.5} strokeLinecap="round" className="bb-wire" />
            </g>
          ))}

          {/* Terminals for this wiring step */}
          {TERMINALS.filter((t) => activeTerms.has(t.id) && placed.has(t.slot)).map((t) => {
            const sel = term === t.id
            return (
              <g
                key={t.id}
                role="button"
                tabIndex={0}
                aria-label={`${slotById[t.slot].label}: ${t.label}`}
                aria-pressed={sel}
                onClick={() => clickTerm(t.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && clickTerm(t.id)}
                className="cursor-pointer outline-none"
              >
                <circle cx={t.x} cy={t.y} r={14} fill="transparent" />
                <circle cx={t.x} cy={t.y} r={8} fill={sel ? '#f2c14e' : '#fff'} stroke="#111" strokeWidth={2} className={sel ? '' : 'bb-pulse'} />
                <text x={t.x} y={t.y - 13} textAnchor="middle" fontSize={10} fill="#fff" stroke="#000" strokeWidth={3} paintOrder="stroke" style={{ pointerEvents: 'none' }}>
                  {t.label}
                </text>
              </g>
            )
          })}

          {/* Lid on, power LED */}
          {powered && (
            <g className="bb-pop">
              <rect x={CHASSIS.x} y={CHASSIS.y} width={CHASSIS.w} height={CHASSIS.h} rx={10} fill="url(#ply)" opacity={0.92} stroke="#8a6238" strokeWidth={3} />
              <rect x={CHASSIS.x + 10} y={CHASSIS.y - 34} width={70} height={40} rx={4} fill="#f4f2ec" stroke="#cfcac0" />
              <rect x={CHASSIS.x + CHASSIS.w - 80} y={CHASSIS.y - 34} width={70} height={40} rx={4} fill="#f4f2ec" stroke="#cfcac0" />
              <circle cx={400} cy={270} r={9} fill="#7cf08f" className="bb-pulse" />
              <text x={400} y={300} textAnchor="middle" fontSize={14} fill="#4b3218" fontFamily="monospace">
                POWER ON
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Manual */}
      <section aria-label="Build manual" className="order-2 md:order-3 border-t md:border-t-0 md:border-l border-white/10 p-4 flex flex-col min-h-0 overflow-y-auto mac-scroll">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/45">
          <span>
            Manual · step {step + 1} of {STEPS.length}
          </span>
          <button type="button" onClick={reset} className="flex items-center gap-1 hover:text-white" aria-label="Start the build again">
            <RotateCcw className="h-3 w-3" aria-hidden="true" /> restart
          </button>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1 flex-1 rounded-full ${doneSteps.has(i) ? 'bg-[#7fc08c]' : i === step ? 'bg-[#efe6d6]' : 'bg-white/15'}`} />
          ))}
        </div>
        <h3 className="mt-3 text-[18px] font-semibold leading-snug">{s.title}</h3>
        <p className="mt-1.5 leading-relaxed text-white/80">{s.text}</p>
        {s.why && <p className="mt-2 text-[12px] leading-relaxed text-white/50 italic">{s.why}</p>}

        {s.kind === 'place' && (
          <ul className="mt-3 space-y-1">
            {s.slots.map((id) => (
              <li key={id} className={`flex items-center gap-2 ${placed.has(id) ? 'text-[#7fc08c]' : 'text-white/70'}`}>
                <Check className={`h-3.5 w-3.5 ${placed.has(id) ? '' : 'opacity-20'}`} aria-hidden="true" /> {slotById[id].label}
              </li>
            ))}
          </ul>
        )}
        {s.kind === 'wire' && (
          <ul className="mt-3 space-y-1">
            {s.wires.map((w) => {
              const ok = wireKeys.has(wireKey(w.a, w.b))
              return (
                <li key={wireKey(w.a, w.b)} className={`flex items-center gap-2 ${ok ? 'text-[#7fc08c]' : 'text-white/70'}`}>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: w.color }} />
                  {slotById[termById[w.a].slot].label} → {slotById[termById[w.b].slot].label}
                  {ok && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </li>
              )
            })}
          </ul>
        )}
        {s.kind === 'action' && s.id === 'charge' && (
          <div className="mt-3 flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="flex flex-col items-center gap-1 text-[11px] text-white/50">
                <span className={`h-3 w-3 rounded-full ${charge > (i + 1) / 3 - 0.02 ? 'bg-[#7cf08f]' : charge > 0 ? 'bg-[#e0503a] animate-pulse' : 'bg-white/20'}`} />
                cell {i + 1}
              </span>
            ))}
            <span className="ml-2 tabular-nums text-white/70">{(11.1 + 1.5 * charge).toFixed(1)} V</span>
          </div>
        )}
        {s.kind === 'action' && s.id === 'upload' && (
          <>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-[#cfe8d4]">{SKETCH}</pre>
            {uploadLog.length > 0 && (
              <pre className="mt-2 rounded-lg bg-black/40 p-2 font-mono text-[11px] text-white/70">{uploadLog.join('\n')}</pre>
            )}
          </>
        )}
        {s.kind === 'action' && !stepDone && (
          <button type="button" onClick={runAction} className="mt-4 rounded-lg bg-[#efe6d6] py-2 font-semibold text-black hover:bg-white">
            {s.button}
          </button>
        )}

        <p aria-live="polite" className={`mt-3 min-h-[1.5em] text-[12.5px] ${msg?.tone === 'err' ? 'text-[#ff9a8f]' : 'text-[#9fe0a8]'}`}>
          {msg?.text ?? (s.kind === 'place' && part ? `Now click a highlighted spot for the ${PARTS[part].name}.` : s.kind === 'wire' && term ? 'Now click where it connects to.' : '')}
        </p>

        <div className="mt-auto pt-3 flex flex-col gap-2">
          {stepDone && step < STEPS.length - 1 && (
            <button type="button" onClick={next} autoFocus className="rounded-lg bg-[#7fc08c] py-2 font-semibold text-black hover:bg-[#98d3a3]">
              Next step →
            </button>
          )}
          {stepDone && step === STEPS.length - 1 && (
            <button type="button" onClick={onDone} autoFocus className="rounded-lg bg-[#7fc08c] py-2 font-semibold text-black hover:bg-[#98d3a3]">
              Take it to the pitch →
            </button>
          )}
          <button type="button" onClick={onSkip} className="text-[12px] text-white/45 hover:text-white">
            Skip the build and just play
          </button>
        </div>
      </section>
    </div>
  )
}
