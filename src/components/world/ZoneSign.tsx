import { isPending } from '@/content'
import { GROUND_Y, TILE } from '@/world/constants'
import type { ZoneLayout } from '@/world/layout'

/** Sign at the start of each zone: name + period, as real text (§07.2). */
export function ZoneSign({ zone, scale }: { zone: ZoneLayout; scale: number }) {
  const period = zone.chapter.period
  const postH = 2 * TILE
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: (zone.startX + TILE) * scale, top: (GROUND_Y - postH - 22) * scale }}
      aria-hidden="true"
    >
      <div className="bg-loam border-2 border-[#3d2f20] px-2 py-1 text-parchment whitespace-nowrap leading-tight pixel-shadow">
        <p className="font-display text-sm">{zone.chapter.name}</p>
        {period && !isPending(period) && <p className="text-[11px]">{period}</p>}
      </div>
      <div className="bg-[#6b5238]" style={{ width: 3 * scale, height: postH * scale }} />
    </div>
  )
}
