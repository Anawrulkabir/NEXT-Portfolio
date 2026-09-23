'use client'
import { useId, useState } from 'react'
import type { EventItem } from '@/content'
import { EventCard } from '@/components/panels/EventCard'

/**
 * Events map (§09 I-12): a stylised pixel map at Bangladesh scale — no
 * external tiles — with pins per city, filter chips by type, and an
 * "Elsewhere" tray for events whose place isn't recorded. Pins drop in
 * sequence once (CSS, off under reduced motion).
 */

// Coarse, hand-drawn outline (not survey-accurate) — 20×26 cells.
const LAND = [
  '....####............',
  '...######..###......',
  '..########.#####....',
  '..################..',
  '.#################..',
  '.################...',
  '..###############...',
  '..##############....',
  '...#############....',
  '...############.....',
  '....###########.....',
  '....###########.....',
  '....############....',
  '.....###########....',
  '.....############...',
  '......###########...',
  '......##.#.#######..',
  '.......#.#..#######.',
  '............######..',
  '............######..',
  '.............#####..',
  '.............####...',
  '..............###...',
  '..............###...',
  '...............##...',
  '...............#....',
]
const CELL = 8

type City = { id: string; label: string; x: number; y: number; match: RegExp }
const CITIES: City[] = [
  { id: 'dhaka', label: 'Dhaka', x: 8, y: 10, match: /dhaka/i },
  { id: 'chattogram', label: 'Chattogram', x: 14, y: 18, match: /chattogram|chittagong|cuet|iiuc/i },
]

const TYPE_LABEL: Record<EventItem['type'], string> = {
  hackathon: 'Hackathons',
  competition: 'Competitions',
  conference: 'Conferences',
  'research-event': 'Research events',
  'business-competition': 'Business competition',
}

const cityOf = (e: EventItem) =>
  typeof e.place === 'string' ? CITIES.find((c) => c.match.test(e.place as string)) : undefined

export function EventsMap({ events }: { events: EventItem[] }) {
  const named = events.filter((e) => typeof e.name === 'string')
  const types = Array.from(new Set(named.map((e) => e.type)))
  const [filter, setFilter] = useState<Set<EventItem['type']>>(new Set(types))
  const [selected, setSelected] = useState<string>('chattogram')
  const listId = useId()

  const shown = named.filter((e) => filter.has(e.type))
  const byCity = (id: string) => shown.filter((e) => cityOf(e)?.id === id)
  const elsewhere = shown.filter((e) => !cityOf(e))
  const list = selected === 'elsewhere' ? elsewhere : byCity(selected)
  const selLabel = selected === 'elsewhere' ? 'Elsewhere' : CITIES.find((c) => c.id === selected)?.label

  const toggle = (t: EventItem['type']) =>
    setFilter((f) => {
      const next = new Set(f)
      if (next.has(t) && next.size > 1) next.delete(t)
      else next.add(t)
      return next
    })

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Filter events by type" className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={filter.has(t)}
            onClick={() => toggle(t)}
            className="pixel-focus border-2 border-loam px-2 py-1 text-xs aria-pressed:bg-moss aria-pressed:text-parchment aria-pressed:border-moss"
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[auto_1fr] gap-5 items-start">
        <div className="relative mx-auto" style={{ width: 20 * CELL * 1.5, height: LAND.length * CELL * 1.5 }}>
          <svg
            viewBox={`0 0 ${20 * CELL} ${LAND.length * CELL}`}
            className="absolute inset-0 w-full h-full"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <rect width={20 * CELL} height={LAND.length * CELL} fill="#1d3436" />
            {LAND.flatMap((row, y) =>
              row
                .split('')
                .map((ch, x) =>
                  ch === '#' ? (
                    <rect
                      key={`${x}-${y}`}
                      x={x * CELL}
                      y={y * CELL}
                      width={CELL}
                      height={CELL}
                      fill={(x + y) % 5 === 0 ? '#3e6339' : '#4f7a4a'}
                    />
                  ) : null
                )
            )}
          </svg>
          {CITIES.map((c, i) => {
            const count = byCity(c.id).length
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                aria-pressed={selected === c.id}
                aria-controls={listId}
                aria-label={`${c.label}: ${count} event${count === 1 ? '' : 's'}`}
                className="map-pin pixel-focus absolute -translate-x-1/2 -translate-y-full flex flex-col items-center"
                style={{
                  left: `${((c.x + 0.5) / 20) * 100}%`,
                  top: `${((c.y + 0.5) / LAND.length) * 100}%`,
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <span className="bg-parchment text-ink text-[11px] font-semibold px-1.5 border-2 border-loam whitespace-nowrap">
                  {c.label} {'·'} {count}
                </span>
                <span
                  className={`block w-3 h-3 border-2 border-ink ${selected === c.id ? 'bg-amber' : 'bg-ember'}`}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>

        <div>
          {elsewhere.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected('elsewhere')}
              aria-pressed={selected === 'elsewhere'}
              aria-controls={listId}
              className="pixel-focus mb-3 border-2 border-dashed border-loam px-2 py-1 text-xs aria-pressed:bg-loam aria-pressed:text-parchment"
            >
              Elsewhere / place not recorded {'·'} {elsewhere.length}
            </button>
          )}
          <h3 className="font-display text-base">{selLabel}</h3>
          <ul id={listId} aria-live="polite" className="mt-3 space-y-3">
            {list.map((e) => (
              <li key={e.id} className="border-2 border-loam p-3 text-sm">
                <EventCard event={e} headingLevel={4} compact />
              </li>
            ))}
            {!list.length && <li className="text-sm">No events here for the selected types.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
