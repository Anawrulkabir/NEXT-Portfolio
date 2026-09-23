import { routeZones } from '@/world/layout'
import { RouteStrip } from './RouteStrip'

/**
 * Static strip shown before the interactive world loads — and the no-JS
 * experience. Same reserved height as the live world, so there's no layout
 * shift when it swaps in (§07.2).
 */
export function WorldFallback() {
  return (
    <div>
      <div className="world-frame world-sky relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-[#4f7a4a] border-t-4 border-[#6a9a5a]" />
        <ol className="absolute inset-x-0 bottom-[28%] flex justify-around px-4 text-parchment/80 text-xs font-display">
          {routeZones.map((z) => (
            <li key={z.id}>{z.chapter.name}</li>
          ))}
        </ol>
      </div>
      <RouteStrip />
    </div>
  )
}
