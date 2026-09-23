'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import type { Research } from '@/content'
import { Field } from '@/components/content/Field'
import { isLiveRoute } from '@/lib/routes'
import { StatusBadge } from './StatusBadge'
import { researchTitle } from './ResearchCard'

/**
 * Research pipeline (§09 I-09): experimental system → measurements →
 * physics-based features → machine learning → validation → interpretation.
 * Stage chips are a tab list: click, or ←/→ to step.
 */
export function ResearchPipeline({ research: r, showHeader = true }: { research: Research; showHeader?: boolean }) {
  const stages = r.pipeline ?? []
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  if (!stages.length) return null

  const go = (i: number) => {
    const next = (i + stages.length) % stages.length
    setActive(next)
    tabs.current[next]?.focus()
  }
  const stage = stages[active]
  const href = `/research/${r.id}`

  return (
    <div className="space-y-4">
      {showHeader && (
        <>
          <StatusBadge status={r.status} />
          <h3 className="font-display text-lg leading-snug">{researchTitle(r)}</h3>
          <p className="leading-relaxed">{r.oneLine}</p>
        </>
      )}

      {/* Phones: a vertical stepper, each stage expandable (§12.2). */}
      <ol className="sm:hidden space-y-2" aria-label="Research pipeline">
        {stages.map((s, i) => (
          <li key={s.stage}>
            <details className="group border-2 border-loam" open={i === 0}>
              <summary className="pixel-focus cursor-pointer list-none flex items-center gap-3 px-3 py-3 min-h-[44px]">
                <span className="font-display text-xs w-6 h-6 inline-flex items-center justify-center bg-moss text-parchment shrink-0">
                  {i + 1}
                </span>
                <span className="font-semibold text-sm flex-1">{s.stage}</span>
                <span className="text-xs group-open:rotate-90 transition-transform" aria-hidden="true">
                  {'▸'}
                </span>
              </summary>
              <div className="px-3 pb-3 pl-12 text-sm">
                {s.text !== undefined && <Field as="p" value={s.text} className="leading-relaxed" />}
                {s.detail && <Field as="p" value={s.detail} className="mt-2" />}
              </div>
            </details>
          </li>
        ))}
      </ol>

      <div className="hidden sm:block space-y-4">
        <div
          role="tablist"
          aria-label="Research pipeline"
          className="grid grid-cols-3 sm:grid-cols-6 gap-1"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              go(active + 1)
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault()
              go(active - 1)
            }
          }}
        >
          {stages.map((s, i) => (
            <button
              key={s.stage}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`stage-tab-${i}`}
              aria-selected={i === active}
              aria-controls="stage-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`pixel-focus border-2 px-1.5 py-1.5 text-[11px] leading-tight text-left ${
                i === active ? 'bg-moss border-moss text-parchment' : 'border-loam'
              } ${i < active ? 'bg-moss/15' : ''}`}
            >
              <span className="block font-display">{i + 1}</span>
              {s.stage}
            </button>
          ))}
        </div>

        <div
          id="stage-panel"
          role="tabpanel"
          aria-labelledby={`stage-tab-${active}`}
          className="border-2 border-loam p-4 min-h-[96px]"
        >
          <p className="font-semibold text-sm">{stage.stage}</p>
          {stage.text !== undefined && <Field as="p" value={stage.text} className="mt-1 leading-relaxed" />}
          {stage.detail && <Field as="p" value={stage.detail} className="mt-2" />}
        </div>
      </div>

      {showHeader && isLiveRoute(href) && (
        <p className="text-sm">
          <Link href={href} className="pixel-focus underline underline-offset-2">
            Read the full summary {'→'}
          </Link>
        </p>
      )}
    </div>
  )
}
