'use client'
/**
 * "How a session starts": the two launch paths as animated architecture
 * diagrams with each service's logo. Press Launch and a request travels
 * through every service, one step at a time.
 */
import { useEffect, useRef, useState } from 'react'
import { Check, Play, RotateCcw } from 'lucide-react'
import { FLOWS, type Flow, type Logo, type Node } from './flows'

const SX = 1.07 // diagram coordinates are authored on a 900-wide grid
const NODE_W = 140
const NODE_H = 54
const GROUP = {
  aws: { fill: '#fff8ef', stroke: '#f29a1e', text: '#b4640b', logo: '/media/logos/aws-cloud.svg' },
  k8s: { fill: '#f1f5ff', stroke: '#326ce5', text: '#2250b8', logo: '/media/logos/kubernetes.svg' },
  metal: { fill: '#f2f8f3', stroke: '#3d8f5a', text: '#2d6b43', logo: null },
}
const ACCENT: Record<NonNullable<Node['kind']>, string> = {
  you: '#1d1d1f',
  svc: '#326ce5',
  data: '#d9822b',
  infra: '#3d8f5a',
  gpu: '#76b900',
}

/** Logo for a node: the real brand mark where one exists, a simple glyph otherwise. */
function NodeLogo({ logo, x, y, s }: { logo: Logo; x: number; y: number; s: number }) {
  if (logo === 'you')
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle cx={s / 2} cy={s / 2} r={s / 2} fill="#1d1d1f" />
        <circle cx={s / 2} cy={s * 0.4} r={s * 0.17} fill="#fff" />
        <path d={`M${s * 0.2} ${s * 0.84} a${s * 0.3} ${s * 0.26} 0 0 1 ${s * 0.6} 0`} fill="#fff" />
      </g>
    )
  if (logo === 'api')
    return (
      <g transform={`translate(${x} ${y})`}>
        <rect width={s} height={s} rx={s * 0.24} fill="#23392a" />
        <text x={s / 2} y={s * 0.68} textAnchor="middle" fontSize={s * 0.46} fontWeight={800} fill="#efe6d6">
          AI
        </text>
      </g>
    )
  if (logo === 'hami')
    return (
      <g transform={`translate(${x} ${y})`}>
        <rect width={s} height={s} rx={s * 0.22} fill="#eef6e0" stroke="#76b900" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={s * 0.16 + (i % 3) * s * 0.24} y={s * 0.26 + Math.floor(i / 3) * s * 0.26} width={s * 0.18} height={s * 0.2} rx={1.5} fill={i === 2 ? '#f2a33a' : '#76b900'} />
        ))}
      </g>
    )
  return <image href={`/media/logos/${logo}.svg`} x={x} y={y} width={s} height={s} preserveAspectRatio="xMidYMid meet" />
}

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
  const byId = Object.fromEntries(flow.nodes.map((n) => [n.id, { ...n, x: n.x * SX }]))
  const spans = cumulative(flow)
  const cur = t === null ? -1 : t >= 1 ? flow.steps.length : spans.findIndex((s) => t < s.end)
  const visited = new Set<string>()
  flow.steps.forEach((s, i) => {
    if (i <= cur) visited.add(s.from)
    if (i < cur) visited.add(s.to)
  })
  const sliceLit = flow.id === 'metal' && cur >= 5

  return (
    <svg viewBox="0 0 960 430" className="h-full w-full" role="img" aria-label={`${flow.label}: how a session is launched`}>
      <defs>
        <filter id="card" x="-10%" y="-20%" width="120%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000" floodOpacity="0.1" />
        </filter>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="#e8a317" />
        </marker>
      </defs>

      {flow.groups.map((g) => {
        const c = GROUP[g.tone]
        const gx = g.x * SX
        const gw = g.w * SX
        return (
          <g key={g.label}>
            <rect x={gx} y={g.y} width={gw} height={g.h} rx={14} fill={c.fill} stroke={c.stroke} strokeOpacity={0.7} strokeDasharray={g.tone === 'k8s' ? '6 4' : undefined} />
            {c.logo ? (
              <image href={c.logo} x={gx + 10} y={g.y + 8} width={g.tone === 'aws' ? 34 : 18} height={g.tone === 'aws' ? 22 : 18} />
            ) : (
              <g transform={`translate(${gx + 10} ${g.y + 9})`} aria-hidden="true">
                <rect width={18} height={6} rx={1.5} fill={c.stroke} />
                <rect y={7} width={18} height={6} rx={1.5} fill={c.stroke} opacity={0.7} />
                <circle cx={15} cy={3} r={1.1} fill="#fff" />
                <circle cx={15} cy={10} r={1.1} fill="#fff" />
              </g>
            )}
            <text x={gx + (g.tone === 'aws' ? 50 : 34)} y={g.y + 22} fontSize={12} fontWeight={650} fill={c.text}>
              {g.label}
            </text>
          </g>
        )
      })}

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
            stroke={active ? '#e8a317' : done ? '#3d8f5a' : '#b9b5ad'}
            strokeWidth={active ? 3 : 1.8}
            strokeDasharray={active || done ? undefined : '5 5'}
          />
        )
      })}

      {flow.nodes.map((raw) => {
        const n = byId[raw.id]
        const isTarget = cur >= 0 && cur < flow.steps.length && flow.steps[cur].to === n.id
        const lit = visited.has(n.id) || isTarget
        const accent = ACCENT[n.kind ?? 'svc']
        return (
          <g key={n.id} transform={`translate(${n.x - NODE_W / 2} ${n.y - NODE_H / 2})`}>
            {isTarget && <rect x={-5} y={-5} width={NODE_W + 10} height={NODE_H + 10} rx={14} fill="none" stroke="#e8a317" strokeWidth={2.5} className="bb-pulse" />}
            <rect width={NODE_W} height={NODE_H} rx={11} fill="#fff" stroke={lit ? accent : '#e2dfd8'} strokeWidth={lit ? 2 : 1} filter="url(#card)" />
            <NodeLogo logo={n.logo} x={10} y={13} s={28} />
            <text x={46} y={25} fontSize={12.5} fontWeight={650} fill="#1d1d1f">
              {n.title}
            </text>
            <text x={46} y={41} fontSize={10.5} fill="#6e6e73">
              {n.sub}
            </text>
            {n.id === 'gpu' && flow.id === 'metal' && (
              <g transform={`translate(${NODE_W / 2 - 39} ${NODE_H + 7})`}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={i} x={i * 13.5} width={11} height={11} rx={2} fill={i === 2 && sliceLit ? '#f2a33a' : i === 0 || i === 4 ? '#76b900' : '#e3efcf'} stroke="#76b900" strokeOpacity={0.6} />
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
        return (
          <g>
            <circle cx={a.x + (b.x - a.x) * p} cy={a.y + (b.y - a.y) * p} r={11} fill="#e8a317" opacity={0.25} />
            <circle cx={a.x + (b.x - a.x) * p} cy={a.y + (b.y - a.y) * p} r={6.5} fill="#e8a317" stroke="#fff" strokeWidth={2} />
          </g>
        )
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
    <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[1fr_330px]">
      <div className="flex min-h-[240px] flex-col p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg bg-black/[0.06] p-0.5" role="radiogroup" aria-label="Which setup">
            {(['aws', 'metal'] as const).map((w) => (
              <button
                key={w}
                type="button"
                role="radio"
                aria-checked={which === w}
                onClick={() => pick(w)}
                className={`rounded-md px-3 py-1 text-[12.5px] ${which === w ? 'bg-white font-semibold shadow-sm' : 'text-black/60 hover:text-black'}`}
              >
                {FLOWS[w].label}
              </button>
            ))}
          </div>
          <span className="text-[12px] text-black/50">{flow.when}</span>
        </div>
        <div className="min-h-0 flex-1">
          <Diagram flow={flow} t={t} />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-black/50">
          {flow.notes.map((n) => (
            <span key={n} className="rounded-full border border-black/10 bg-white px-2 py-0.5">
              {n}
            </span>
          ))}
          <span className="ml-auto">Step lengths are illustrative. The totals are real.</span>
        </div>
      </div>

      <aside className="flex min-h-0 flex-col gap-3 overflow-y-auto border-t border-black/10 bg-white p-4 md:border-l md:border-t-0 mac-scroll">
        <div className="flex items-baseline justify-between">
          <p className="text-[28px] font-semibold tabular-nums tracking-tight">{t === null ? flow.total : `${minutes.toFixed(1)} min`}</p>
          <p className="text-[11px] text-black/45">1 s here = 1 min there</p>
        </div>
        <button type="button" onClick={launch} className="flex items-center justify-center gap-2 rounded-lg bg-[#1f5fd6] py-2 font-semibold text-white hover:bg-[#1a52bb]">
          {t === null ? <Play className="h-4 w-4" aria-hidden="true" /> : <RotateCcw className="h-4 w-4" aria-hidden="true" />}
          {t === null ? 'Launch a session' : t < 1 ? 'Restart' : 'Launch again'}
        </button>
        <ol className="space-y-2 text-[12.5px] leading-snug" aria-live="polite">
          {flow.steps.map((s, i) => (
            <li key={i} className={`flex gap-2 ${i === cur ? 'text-black' : i < cur ? 'text-black/50' : 'text-black/35'}`}>
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${i < cur ? 'bg-[#3d8f5a] text-white' : i === cur ? 'bg-[#e8a317] text-white' : 'bg-black/[0.07]'}`}>
                {i < cur ? <Check className="h-3 w-3" aria-hidden="true" /> : i + 1}
              </span>
              <span className={i === cur ? 'font-medium' : ''}>{s.text}</span>
            </li>
          ))}
        </ol>
        {results.aws && results.metal && (
          <div className="rounded-xl border border-black/10 bg-[#fbfaf7] p-3 text-[12px]">
            <p className="mb-2 text-black/55">What the migration changed</p>
            {(['aws', 'metal'] as const).map((w) => (
              <div key={w} className="mb-1.5">
                <div className="flex justify-between">
                  <span>{FLOWS[w].label}</span>
                  <span className="font-semibold">{FLOWS[w].total}</span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-black/[0.07]">
                  <div className={`h-1.5 rounded ${w === 'aws' ? 'bg-[#f29a1e]' : 'bg-[#3d8f5a]'}`} style={{ width: `${(FLOWS[w].seconds / 12) * 100}%` }} />
                </div>
              </div>
            ))}
            <p className="mt-2 font-medium text-[#2d6b43]">About 70% faster to start.</p>
          </div>
        )}
        {which === 'aws' && t !== null && t >= 1 && !results.metal && (
          <button type="button" onClick={() => pick('metal')} className="rounded-lg bg-[#3d8f5a] py-2 font-semibold text-white hover:bg-[#347a4d]">
            Now try the bare-metal version →
          </button>
        )}
      </aside>
    </div>
  )
}
