'use client'
/**
 * "How it works": the two launch paths as animated diagrams. Press Launch and
 * a request travels through every service, one step at a time.
 */
import { useEffect, useRef, useState } from 'react'
import { Check, Play, RotateCcw } from 'lucide-react'
import { FLOWS, type Flow, type Node } from './flows'

const NODE_W = 124
const NODE_H = 54
const KIND: Record<NonNullable<Node['kind']>, { fill: string; stroke: string }> = {
  you: { fill: '#efe6d6', stroke: '#efe6d6' },
  svc: { fill: '#1e2a33', stroke: '#6aa7ff' },
  data: { fill: '#2a2320', stroke: '#e0a458' },
  infra: { fill: '#1f2a22', stroke: '#7fc08c' },
  gpu: { fill: '#2a1f24', stroke: '#e58a92' },
}
const GROUP = { aws: '#f2a33a', k8s: '#6aa7ff', metal: '#7fc08c' }

function cumulative(f: Flow) {
  const total = f.steps.reduce((a, s) => a + s.weight, 0)
  let acc = 0
  return f.steps.map((s) => {
    const start = acc / total
    acc += s.weight
    return { start, end: acc / total }
  })
}

function Diagram({ flow, t }: { flow: Flow; t: number | null }) {
  const byId = Object.fromEntries(flow.nodes.map((n) => [n.id, n]))
  const spans = cumulative(flow)
  const cur = t === null ? -1 : t >= 1 ? flow.steps.length : spans.findIndex((s) => t < s.end)
  const visited = new Set<string>()
  flow.steps.forEach((s, i) => {
    if (i < cur || (i === cur && t !== null)) {
      visited.add(s.from)
      if (i < cur) visited.add(s.to)
    }
  })
  const sliceLit = flow.id === 'metal' && cur >= 5

  return (
    <svg viewBox="0 0 900 430" className="h-full w-full" role="img" aria-label={`${flow.label}: how a session is launched`}>
      {flow.groups.map((g) => (
        <g key={g.label}>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={14} fill={`${GROUP[g.tone]}10`} stroke={GROUP[g.tone]} strokeOpacity={0.55} strokeDasharray="6 5" />
          <text x={g.x + 12} y={g.y + 20} fontSize={12} fontWeight={600} fill={GROUP[g.tone]}>
            {g.label}
          </text>
        </g>
      ))}

      {flow.steps.map((s, i) => {
        const a = byId[s.from]
        const b = byId[s.to]
        const active = i === cur
        const done = i < cur
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={active ? '#f2c14e' : done ? '#7fc08c' : '#ffffff'}
            strokeOpacity={active || done ? 0.9 : 0.14}
            strokeWidth={active ? 3 : 2}
            strokeDasharray={active ? '0' : '5 5'}
          />
        )
      })}

      {flow.nodes.map((n) => {
        const k = KIND[n.kind ?? 'svc']
        const isTarget = cur >= 0 && cur < flow.steps.length && flow.steps[cur].to === n.id
        const lit = visited.has(n.id) || isTarget
        return (
          <g key={n.id} transform={`translate(${n.x - NODE_W / 2} ${n.y - NODE_H / 2})`}>
            {isTarget && <rect x={-5} y={-5} width={NODE_W + 10} height={NODE_H + 10} rx={14} fill="none" stroke="#f2c14e" strokeWidth={2} className="bb-pulse" />}
            <rect width={NODE_W} height={NODE_H} rx={10} fill={k.fill} stroke={k.stroke} strokeOpacity={lit ? 1 : 0.5} strokeWidth={lit ? 2 : 1.2} />
            <text x={NODE_W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={600} fill={n.kind === 'you' ? '#1d1d1f' : '#efe6d6'}>
              {n.title}
            </text>
            <text x={NODE_W / 2} y={39} textAnchor="middle" fontSize={10.5} fill={n.kind === 'you' ? '#1d1d1f' : '#efe6d6'} opacity={0.6}>
              {n.sub}
            </text>
            {n.id === 'gpu' && flow.id === 'metal' && (
              <g transform={`translate(${NODE_W / 2 - 39} ${NODE_H + 6})`}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={i} x={i * 13.5} width={11} height={11} rx={2} fill={i === 2 && sliceLit ? '#f2c14e' : i === 0 || i === 4 ? '#e58a92' : '#3a2c31'} stroke="#e58a92" strokeOpacity={0.5} />
                ))}
              </g>
            )}
          </g>
        )
      })}

      {/* The request, travelling along the current edge */}
      {cur >= 0 && cur < flow.steps.length && t !== null && (() => {
        const s = flow.steps[cur]
        const span = spans[cur]
        const p = Math.min(1, Math.max(0, (t - span.start) / (span.end - span.start)))
        const a = byId[s.from]
        const b = byId[s.to]
        return <circle cx={a.x + (b.x - a.x) * p} cy={a.y + (b.y - a.y) * p} r={7} fill="#f2c14e" stroke="#10150f" strokeWidth={2} />
      })()}
    </svg>
  )
}

export function Architecture() {
  const [which, setWhich] = useState<'aws' | 'metal'>('aws')
  const [t, setT] = useState<number | null>(null)
  const [results, setResults] = useState<Partial<Record<'aws' | 'metal', number>>>({})
  const raf = useRef(0)
  const flow = FLOWS[which]
  const spans = cumulative(flow)
  const cur = t === null ? -1 : t >= 1 ? flow.steps.length : spans.findIndex((s) => t < s.end)

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const launch = () => {
    cancelAnimationFrame(raf.current)
    const t0 = performance.now()
    const f = flow
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / (f.seconds * 1000))
      setT(p)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else setResults((r) => ({ ...r, [f.id]: f.seconds }))
    }
    raf.current = requestAnimationFrame(tick)
  }

  const pick = (w: 'aws' | 'metal') => {
    cancelAnimationFrame(raf.current)
    setT(null)
    setWhich(w)
  }

  const minutes = t === null ? 0 : t * flow.seconds

  return (
    <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[1fr_320px]">
      <div className="flex min-h-[240px] flex-col p-3">
        <div className="inline-flex self-start rounded-lg bg-white/10 p-0.5" role="radiogroup" aria-label="Which setup">
          {(['aws', 'metal'] as const).map((w) => (
            <button
              key={w}
              type="button"
              role="radio"
              aria-checked={which === w}
              onClick={() => pick(w)}
              className={`rounded-md px-3 py-1 text-[12px] ${which === w ? 'bg-[#efe6d6] font-medium text-black' : 'text-white/70 hover:text-white'}`}
            >
              {FLOWS[w].label}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1">
          <Diagram flow={flow} t={t} />
        </div>
        <div className="flex flex-wrap gap-1.5 text-[11px] text-white/50">
          {flow.notes.map((n) => (
            <span key={n} className="rounded-full border border-white/15 px-2 py-0.5">
              {n}
            </span>
          ))}
          <span className="ml-auto">Step lengths are illustrative. The totals are real.</span>
        </div>
      </div>

      <aside className="flex min-h-0 flex-col gap-3 overflow-y-auto border-t border-white/10 p-4 md:border-l md:border-t-0 mac-scroll">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">{flow.when}</p>
        <div className="flex items-baseline justify-between">
          <p className="text-[26px] font-semibold tabular-nums">{t === null ? flow.total : `${minutes.toFixed(1)} min`}</p>
          <p className="text-[11px] text-white/45">1 s here = 1 min there</p>
        </div>
        <button type="button" onClick={launch} className="flex items-center justify-center gap-2 rounded-lg bg-[#efe6d6] py-2 font-semibold text-black hover:bg-white">
          {t === null ? <Play className="h-4 w-4" aria-hidden="true" /> : <RotateCcw className="h-4 w-4" aria-hidden="true" />}
          {t === null ? 'Launch a session' : t < 1 ? 'Restart' : 'Launch again'}
        </button>
        <ol className="space-y-2 text-[12.5px] leading-snug" aria-live="polite">
          {flow.steps.map((s, i) => (
            <li key={i} className={`flex gap-2 ${i === cur ? 'text-white' : i < cur ? 'text-white/45' : 'text-white/30'}`}>
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${i < cur ? 'bg-[#7fc08c] text-black' : i === cur ? 'bg-[#f2c14e] text-black' : 'bg-white/10'}`}>
                {i < cur ? <Check className="h-3 w-3" aria-hidden="true" /> : i + 1}
              </span>
              {s.text}
            </li>
          ))}
        </ol>
        {results.aws && results.metal && (
          <div className="rounded-xl border border-white/10 p-3 text-[12px]">
            <p className="mb-2 text-white/50">What the migration changed</p>
            {(['aws', 'metal'] as const).map((w) => (
              <div key={w} className="mb-1.5">
                <div className="flex justify-between">
                  <span>{FLOWS[w].label}</span>
                  <span>{FLOWS[w].total}</span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-white/10">
                  <div className={`h-1.5 rounded ${w === 'aws' ? 'bg-[#e58a92]' : 'bg-[#7fc08c]'}`} style={{ width: `${(FLOWS[w].seconds / 12) * 100}%` }} />
                </div>
              </div>
            ))}
            <p className="mt-2 text-white/50">About 70% faster to start.</p>
          </div>
        )}
        {which === 'aws' && t !== null && t >= 1 && !results.metal && (
          <button type="button" onClick={() => pick('metal')} className="rounded-lg bg-[#7fc08c] py-2 font-semibold text-black hover:bg-[#98d3a3]">
            Now try the bare-metal version →
          </button>
        )}
      </aside>
    </div>
  )
}
