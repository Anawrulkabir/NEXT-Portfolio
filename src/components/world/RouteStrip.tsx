import { isPending } from '@/content'
import type { ZoneId } from '@/content/types'
import { routeZones, type ZoneLayout } from '@/world/layout'

/**
 * The route strip doubles as navigation and progression indicator (§05.4):
 * unvisited = outline, visited = filled with the zone colour, current =
 * filled + amber marker. No percentages, XP or levels.
 */
export function routeLabel(zone: ZoneLayout) {
  const word = zone.chapter.progressWord
  // An unconfirmed progression word falls back to the zone's own name.
  return word && !isPending(word) ? word : zone.chapter.name.toUpperCase()
}

export function RouteStrip({
  current,
  visited,
  onJump,
}: {
  current?: ZoneId
  visited?: ZoneId[]
  onJump?: (id: ZoneId) => void
}) {
  return (
    <nav aria-label="Journey" className="h-14 border-t-2 border-loam bg-slate/80 overflow-x-auto">
      <ol className="flex items-center h-full w-max min-w-full px-3 gap-1 justify-start lg:justify-center">
        {routeZones.map((zone, i) => {
          const isCurrent = zone.id === current
          const isVisited = isCurrent || visited?.includes(zone.id)
          const label = routeLabel(zone)
          const dot = (
            <span
              className="inline-block h-3 w-3 border-2 shrink-0"
              style={{
                borderColor: zone.keyColor,
                background: isVisited ? zone.keyColor : 'transparent',
                boxShadow: isCurrent ? '0 0 0 2px var(--amber)' : undefined,
              }}
              aria-hidden="true"
            />
          )
          return (
            <li key={zone.id} className="flex items-center">
              {i > 0 && <span className="hidden lg:block w-5 h-px bg-parchment/30 mr-1" aria-hidden="true" />}
              {onJump ? (
                <button
                  type="button"
                  onClick={() => onJump(zone.id)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className="pixel-focus flex items-center gap-1.5 px-1.5 py-1 font-display text-[11px] md:text-xs tracking-wide text-parchment/80 hover:text-amber aria-[current=step]:text-parchment"
                >
                  {dot}
                  <span>{label}</span>
                  <span className="sr-only">
                    {' '}
                    — {zone.chapter.name}
                    {isVisited && !isCurrent ? ', visited' : ''}
                  </span>
                </button>
              ) : (
                <span className="flex items-center gap-1.5 px-1.5 py-1 font-display text-[11px] md:text-xs tracking-wide text-parchment/80">
                  {dot}
                  <span>{label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
