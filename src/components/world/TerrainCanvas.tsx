'use client'
import { useEffect, useRef } from 'react'
import { WORLD_HEIGHT } from '@/world/constants'
import { bakeZone } from '@/world/engine/bake'
import type { ZoneLayout } from '@/world/layout'

/**
 * One canvas per zone, baked once at source resolution the first time the
 * camera comes within one zone of it (lazy bake, §05.1/§15.8), then CSS-
 * scaled by an integer factor with image-rendering: pixelated.
 */
export function TerrainCanvas({ zone, scale, near }: { zone: ZoneLayout; scale: number; near: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const baked = useRef(false)

  useEffect(() => {
    if (!near || baked.current || !ref.current) return
    bakeZone(ref.current, zone)
    baked.current = true
  }, [near, zone])

  const width = zone.endX - zone.startX
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute top-0 pixelated"
      style={{
        left: zone.startX * scale,
        width: width * scale,
        height: WORLD_HEIGHT * scale,
      }}
    />
  )
}
