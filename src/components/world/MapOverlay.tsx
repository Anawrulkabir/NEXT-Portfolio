'use client'
import { useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { journeyChapterById } from '@/content'
import type { WorldObjectRef, ZoneId } from '@/content/types'
import { WORLD_HEIGHT } from '@/world/constants'
import { WORLD_WIDTH, zones } from '@/world/layout'
import { bakeZone } from '@/world/engine/bake'
import { skyAt } from '@/world/engine/sky'

const MINI = 4 // mini map = world / 4

/**
 * Map overlay (§09 I-06): the whole world at a glance — a scaled render of
 * every zone — plus a text list of every zone and object. Choosing one
 * closes the overlay and jumps there.
 */
export function MapOverlay({
  open,
  onOpenChange,
  avatarX,
  onZone,
  onObject,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  avatarX: number
  onZone: (id: ZoneId) => void
  onObject: (ref: WorldObjectRef) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!open) return
    // Radix mounts the content a frame later; draw once it exists.
    const id = requestAnimationFrame(() => {
      const c = canvasRef.current
      if (!c) return
      c.width = WORLD_WIDTH / MINI
      c.height = WORLD_HEIGHT / MINI
      const ctx = c.getContext('2d')!
      const tmp = document.createElement('canvas')
      for (const z of zones) {
        const sky = skyAt((z.startX + z.endX) / 2)
        const g = ctx.createLinearGradient(0, 0, 0, c.height)
        g.addColorStop(0, sky.top)
        g.addColorStop(0.7, sky.low)
        ctx.fillStyle = g
        ctx.fillRect(z.startX / MINI, 0, (z.endX - z.startX) / MINI, c.height)
        bakeZone(tmp, z)
        ctx.drawImage(tmp, z.startX / MINI, 0, (z.endX - z.startX) / MINI, c.height)
      }
      ctx.fillStyle = '#e0a23c'
      ctx.fillRect(Math.round(avatarX / MINI) - 1, c.height - 18, 4, 10)
    })
    return () => cancelAnimationFrame(id)
  }, [open, avatarX])

  const chapters = [...zones.map((z) => z.chapter), journeyChapterById.archive, journeyChapterById.contact]

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby="map-desc"
          className="fixed z-50 inset-x-2 top-6 bottom-6 md:inset-x-10 flex flex-col bg-parchment text-ink border-2 border-loam pixel-shadow data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <div className="pixel-panel-header flex items-center justify-between px-5 py-3 shrink-0">
            <Dialog.Title className="font-display text-base">Map</Dialog.Title>
            <Dialog.Close className="pixel-focus p-1" aria-label="Close map">
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="overflow-y-auto p-5 space-y-6">
            <p id="map-desc" className="text-sm">
              The whole journey, left to right. Choose a place or an object to go straight there.
            </p>
            <canvas ref={canvasRef} aria-hidden="true" className="w-full h-auto border-2 border-loam bg-night" />
            <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              {chapters.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onZone(c.id)}
                    className="pixel-focus font-display text-sm underline underline-offset-2 text-left"
                  >
                    {c.name}
                  </button>
                  {c.objects.length > 0 && (
                    <ul className="mt-1.5 space-y-1 text-sm pl-3 border-l-2 border-loam/40">
                      {c.objects.map((o) => (
                        <li key={o.objectId}>
                          <button
                            type="button"
                            onClick={() => onObject(o)}
                            className="pixel-focus hover:underline text-left"
                          >
                            {o.tooltip}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
