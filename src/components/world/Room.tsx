'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { filledCertifications, journeyChapterById, type WorldObjectRef } from '@/content'
import { GROUND_Y, TILE, WORLD_HEIGHT } from '@/world/constants'
import type { Sprite } from '@/world/pixel'
import { avatarOutfits } from '@/world/sprites/avatar'
import { cvPinSprite, draftingTableSprite, linkBoardSprite, mailboxSprite, mapTableSprite } from '@/world/sprites/rooms'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { CertificateLightbox } from '@/components/archive/CertificateLightbox'
import { mediaMeta } from '@/lib/media'

export type RoomId = 'archive' | 'contact'

/** Room scenes are 24 tiles wide, centred in the viewport (§05.1). */
export const ROOM_W = 24 * TILE

type Placed = { objectId: string; x: number; y: number; sprite: Sprite }

const layout: Record<RoomId, { wall: string; name: string; objects: Placed[]; scenery: Placed[] }> = {
  archive: {
    wall: 'room-archive',
    name: 'Archive Room',
    objects: [{ objectId: 'map-table', x: 312, y: GROUND_Y - mapTableSprite.h, sprite: mapTableSprite }],
    scenery: [],
  },
  contact: {
    wall: 'room-office',
    name: 'Field Office',
    objects: [
      { objectId: 'mailbox', x: 150, y: GROUND_Y - mailboxSprite.h, sprite: mailboxSprite },
      { objectId: 'cv-pin', x: 216, y: 62, sprite: cvPinSprite },
      { objectId: 'link-board', x: 280, y: 58, sprite: linkBoardSprite },
    ],
    scenery: [{ objectId: 'drafting-table', x: 60, y: GROUND_Y - draftingTableSprite.h, sprite: draftingTableSprite }],
  },
}

// Certificate frames: up to 5 × 2 on the archive wall (§05.2 Room R1).
const FRAME = { x0: 36, y0: 26, w: 46, h: 36, gap: 6, cols: 5 }

/**
 * Archive Room / Field Office (§05.2, §09 I-07). A separate interior scene,
 * entered through the Overlook doors. Objects are real buttons; frames open
 * the certificate lightbox, the rest open their cards in the shared panel.
 */
export function Room({
  id,
  scale: s,
  onOpen,
  onExit,
}: {
  id: RoomId
  scale: number
  onOpen: (ref: WorldObjectRef, invoker: HTMLElement) => void
  onExit: () => void
}) {
  const spec = layout[id]
  const refs = journeyChapterById[id].objects
  const refFor = (objectId: string) => refs.find((r) => r.objectId === objectId)!
  const backRef = useRef<HTMLButtonElement>(null)
  const [cert, setCert] = useState<number | null>(null)
  const certInvoker = useRef<HTMLElement | null>(null)
  const certs = id === 'archive' ? filledCertifications.slice(0, FRAME.cols * 2) : []

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true })
  }, [id])

  return (
    <div className={`absolute inset-0 ${spec.wall}`} role="group" aria-label={spec.name}>
      <div className="absolute inset-x-0 bottom-0 room-floor" style={{ top: GROUND_Y * s }} aria-hidden="true" />
      <div className="absolute top-3 left-3 z-10 flex items-center gap-3">
        <button
          ref={backRef}
          type="button"
          onClick={onExit}
          className="pixel-focus pixel-btn-secondary pixel-frame inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-parchment text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back outside
        </button>
        <h2 className="font-display text-sm bg-loam text-parchment border-2 border-[#3d2f20] px-2 py-1">{spec.name}</h2>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: ROOM_W * s, height: WORLD_HEIGHT * s }}>
        {spec.scenery.map((o) => (
          <div key={o.objectId} className="absolute" style={{ left: o.x * s, top: o.y * s }} aria-hidden="true">
            <PixelSprite sprite={o.sprite} scale={s} frame={0} />
          </div>
        ))}

        {certs.map((c, i) => {
          const col = i % FRAME.cols
          const row = Math.floor(i / FRAME.cols)
          const src = typeof c.image.src === 'string' ? c.image.src : ''
          const meta = mediaMeta(src)
          return (
            <button
              key={c.id}
              type="button"
              className="room-obj cert-wall-frame absolute"
              style={{
                left: (FRAME.x0 + col * (FRAME.w + FRAME.gap)) * s,
                top: (FRAME.y0 + row * (FRAME.h + FRAME.gap)) * s,
                width: FRAME.w * s,
                height: FRAME.h * s,
              }}
              aria-label={`${typeof c.name === 'string' ? c.name : 'Certificate'}. Open certificate`}
              onClick={(e) => {
                certInvoker.current = e.currentTarget
                setCert(i)
              }}
            >
              <Image
                src={src}
                alt=""
                width={meta.width}
                height={meta.height}
                sizes="140px"
                className="w-full h-full object-cover"
              />
            </button>
          )
        })}

        {spec.objects.map((o) => {
          const ref = refFor(o.objectId)
          return (
            <button
              key={o.objectId}
              type="button"
              className="room-obj world-obj absolute"
              style={{ left: o.x * s, top: o.y * s }}
              aria-label={ref.tooltip}
              onClick={(e) => onOpen(ref, e.currentTarget)}
            >
              <PixelSprite sprite={o.sprite} scale={s} frame={0} />
              <span className="room-tip" aria-hidden="true">
                {ref.tooltip}
              </span>
            </button>
          )
        })}

        <div
          className="absolute px-anim pointer-events-none"
          data-frame="idle"
          style={{ left: 8 * s, top: (GROUND_Y - avatarOutfits.labcoat.h) * s }}
          aria-hidden="true"
        >
          <PixelSprite sprite={avatarOutfits.labcoat} scale={s} />
        </div>
      </div>

      {id === 'archive' && (
        <CertificateLightbox
          certificates={certs}
          index={cert}
          onIndexChange={setCert}
          onClose={() => setCert(null)}
          returnFocus={certInvoker.current}
        />
      )}
    </div>
  )
}
