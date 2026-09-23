'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isPending, journeyChapters, profile } from '@/content'
import type { WorldObjectRef, ZoneId } from '@/content/types'
import { Field } from '@/components/content/Field'
import { AVATAR_H, GROUND_Y } from '@/world/constants'
import { SCENE_H, SCENE_W, SKY_H, deckScenes, frameFor, type DeckScene } from '@/world/deck'
import { zoneById } from '@/world/layout'
import { bakeZone } from '@/world/engine/bake'
import { skyAt } from '@/world/engine/sky'
import { avatarOutfits, outfitForZone } from '@/world/sprites/avatar'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { Panel } from '@/components/panels/Panel'
import { ObjectCard } from '@/components/panels/ObjectCard'
import { Room, type RoomId } from './Room'
import { onMotionChange, prefersReducedMotion } from '@/lib/motion'
import { routeLabel } from './RouteStrip'

const refById: Record<string, WorldObjectRef> = Object.fromEntries(
  journeyChapters.flatMap((c) => c.objects.map((o) => [o.objectId, o]))
)
const ROOMS: RoomId[] = ['archive', 'contact']
const roomOf = (objectId: string): RoomId | undefined =>
  ROOMS.find((r) => journeyChapters.find((c) => c.id === r)?.objects.some((o) => o.objectId === objectId))
const SEEN_KEY = 'deck:seen'
const TAP = 44 // minimum tap target, css px (§12.3)

/**
 * Integer device-pixel scale: the scene is drawn at a whole number of device
 * pixels per source pixel, so pixel art stays crisp on any phone.
 */
function deckScale(cssWidth: number) {
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1
  const dev = Math.floor((cssWidth * dpr) / SCENE_W)
  return dev >= 1 ? dev / dpr : cssWidth / SCENE_W
}

function syncUrl(params: { at?: ZoneId; open?: string | null }) {
  const url = new URL(window.location.href)
  if (params.at) url.searchParams.set('at', params.at)
  if (params.open === null) url.searchParams.delete('open')
  else if (params.open) url.searchParams.set('open', params.open)
  window.history.replaceState(window.history.state, '', url)
}

function Scene({
  scene,
  k,
  near,
  frame,
  onOpen,
}: {
  scene: DeckScene
  k: number
  near: boolean
  frame: number
  onOpen: (ref: WorldObjectRef, invoker: HTMLElement) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const baked = useRef(false)
  const zone = zoneById[scene.zone]
  const sky = skyAt((zone.startX + zone.endX) / 2)
  const avatar = avatarOutfits[outfitForZone(scene.zone)]
  const x0 = scene.frames[frame] ?? 0

  useEffect(() => {
    if (!near || baked.current || !canvasRef.current) return
    bakeZone(canvasRef.current, zone)
    baked.current = true
  }, [near, zone])

  return (
    <div
      className="relative overflow-hidden mx-auto"
      style={{
        width: SCENE_W * k,
        height: SCENE_H * k,
        background: `linear-gradient(${sky.top} 0%, ${sky.mid} 45%, ${sky.low} 75%)`,
      }}
    >
      <div
        className="deck-pan absolute top-0 left-0"
        style={{ width: scene.zoneWidth * k, height: SCENE_H * k, transform: `translate3d(${-x0 * k}px,0,0)` }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute left-0 pixelated"
          style={{ top: SKY_H * k, width: scene.zoneWidth * k, height: (SCENE_H - SKY_H) * k }}
        />
        {scene.objects.map((o) => {
          const { sprite, ref } = o.placed
          const sw = sprite.w * k
          const sh = sprite.h * k
          const bw = Math.max(sw, TAP)
          const bh = Math.max(sh, TAP)
          const visible = o.x >= x0 && o.x + sprite.w <= x0 + SCENE_W
          return (
            <button
              key={ref.objectId}
              type="button"
              className="deck-obj absolute flex items-end justify-center"
              style={{
                left: o.x * k + sw / 2 - bw / 2,
                top: (SKY_H + o.y) * k + sh - bh,
                width: bw,
                height: bh,
              }}
              aria-label={ref.tooltip}
              tabIndex={visible ? 0 : -1}
              aria-hidden={visible ? undefined : true}
              onClick={(e) => onOpen(ref, e.currentTarget)}
            >
              <span className="relative block" style={{ width: sw, height: sh }}>
                <PixelSprite sprite={sprite} scale={k} frame={0} />
                {o.placed.overlay && (
                  <PixelSprite sprite={o.placed.overlay} scale={k} frame={0} className="obj-overlay" />
                )}
              </span>
            </button>
          )
        })}
      </div>
      <div
        className="absolute pointer-events-none px-anim"
        data-frame="idle"
        style={{ left: 6 * k, top: (SKY_H + GROUND_Y - AVATAR_H) * k }}
        aria-hidden="true"
      >
        <PixelSprite sprite={avatar} scale={k} />
      </div>
    </div>
  )
}

/**
 * Scene Deck (§12): the mobile world as eight swipeable scenes. Native CSS
 * scroll-snap, no gesture library; pager dots and Previous/Next buttons for
 * people who don't swipe. Objects open the same Panel as a bottom sheet.
 */
export default function SceneDeck() {
  const router = useRouter()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const invokerRef = useRef<HTMLElement | null>(null)
  const [k, setK] = useState(1)
  const [index, setIndex] = useState(0)
  const [frames, setFrames] = useState<Record<number, number>>({})
  const [room, setRoom] = useState<RoomId | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [labels, setLabels] = useState(false)
  const reduced = useRef(false)

  const n = deckScenes.length
  const scene = deckScenes[index]
  const chapter = zoneById[scene.zone].chapter

  const goTo = useCallback(
    (i: number, instant = false) => {
      const el = scrollerRef.current
      if (!el) return
      const next = Math.max(0, Math.min(n - 1, i))
      el.scrollTo({ left: next * el.clientWidth, behavior: instant || reduced.current ? 'auto' : 'smooth' })
      setIndex(next)
    },
    [n]
  )

  const open = useCallback(
    (ref: WorldObjectRef, invoker: HTMLElement | null) => {
      invokerRef.current = invoker
      if (ref.opens.type === 'route') {
        router.push(ref.opens.href)
        return
      }
      if (ref.opens.type === 'room') {
        setRoom(ref.opens.id)
        syncUrl({ at: ref.opens.id, open: null })
        return
      }
      setOpenId(ref.objectId)
      syncUrl({ open: ref.objectId })
    },
    [router]
  )

  // Size, reduced motion, first-view labels, deep links — once on mount.
  useEffect(() => {
    reduced.current = prefersReducedMotion()
    const offMotion = onMotionChange(() => (reduced.current = prefersReducedMotion()))
    const measure = () => wrapRef.current && setK(deckScale(wrapRef.current.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    if (wrapRef.current) ro.observe(wrapRef.current)
    try {
      if (!sessionStorage.getItem(SEEN_KEY)) {
        setLabels(true)
        sessionStorage.setItem(SEEN_KEY, '1')
      }
    } catch {
      setLabels(true)
    }

    const params = new URLSearchParams(window.location.search)
    const at = params.get('at') as ZoneId | null
    const openParam = params.get('open')
    const r = openParam ? roomOf(openParam) : (ROOMS as string[]).includes(at ?? '') ? (at as RoomId) : undefined
    if (r) {
      goTo(n - 1, true)
      setRoom(r)
      if (openParam && refById[openParam]) setOpenId(openParam)
    } else if (openParam && refById[openParam]) {
      const i = deckScenes.findIndex((s) => s.objects.some((o) => o.placed.ref.objectId === openParam))
      if (i >= 0) {
        requestAnimationFrame(() => goTo(i, true))
        setFrames((f) => ({ ...f, [i]: frameFor(deckScenes[i], openParam) }))
        setOpenId(openParam)
      }
    } else if (at) {
      const i = deckScenes.findIndex((s) => s.zone === at)
      if (i >= 0) requestAnimationFrame(() => goTo(i, true))
    }
    return () => {
      ro.disconnect()
      offMotion()
    }
  }, [goTo, n])

  // Hero "Explore the world" (§04.2): on phones, focus the current scene's first object.
  useEffect(() => {
    const onFocus = () =>
      requestAnimationFrame(() =>
        wrapRef.current
          ?.querySelector<HTMLElement>('section:not([inert]) .deck-obj:not([tabindex="-1"])')
          ?.focus({ preventScroll: true })
      )
    window.addEventListener('world:focus', onFocus)
    return () => window.removeEventListener('world:focus', onFocus)
  }, [])

  const onScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== index) {
      setIndex(i)
      setLabels(false)
      syncUrl({ at: deckScenes[i].zone })
    }
  }

  const exitRoom = () => {
    const r = room
    setRoom(null)
    syncUrl({ at: 'overlook', open: null })
    requestAnimationFrame(() => {
      goTo(n - 1, true)
      document.getElementById(`deck-room-${r}`)?.focus({ preventScroll: true })
    })
  }

  const openRef = openId ? refById[openId] : null
  const isDC = scene.frames.length > 1
  const frame = frames[index] ?? 0

  return (
    <div ref={wrapRef} className="world-deck">
      {/* The scroller stays mounted under a room so its scroll position survives. */}
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className={`deck-scroller flex overflow-x-auto snap-x snap-mandatory ${room ? 'invisible absolute inset-x-0 top-0' : ''}`}
          aria-hidden={room ? true : undefined}
          aria-roledescription="carousel"
          aria-label="Journey scenes"
        >
          {deckScenes.map((s, i) => (
            <section
              key={s.zone}
              className="snap-center shrink-0 w-full"
              aria-roledescription="slide"
              aria-label={`Scene ${i + 1} of ${n}: ${zoneById[s.zone].chapter.name}`}
              // Off-screen scenes are inert: not focusable, not read out. Set via the
              // DOM because React 18 has no `inert` prop.
              ref={(el) => {
                if (el) el.toggleAttribute('inert', i !== index)
              }}
            >
              <Scene scene={s} k={k} near={Math.abs(i - index) <= 1} frame={frames[i] ?? 0} onOpen={open} />
            </section>
          ))}
        </div>
        {room && (
          <div className="relative overflow-hidden mx-auto" style={{ width: SCENE_W * k, height: SCENE_H * k }}>
            <Room id={room} scale={k} onOpen={(ref, inv) => open(ref, inv)} onExit={exitRoom} />
          </div>
        )}
      </div>
      {!room && (
        <>
          <nav aria-label="Scenes" className="mt-3 px-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="pixel-focus inline-flex items-center justify-center min-w-[44px] min-h-[44px] disabled:opacity-40"
              aria-label="Previous scene"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <ol className="flex flex-wrap justify-center gap-0.5">
              {deckScenes.map((s, i) => (
                <li key={s.zone}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Scene ${i + 1} of ${n}: ${zoneById[s.zone].chapter.name}`}
                    aria-current={i === index ? 'step' : undefined}
                    className="pixel-focus min-w-[28px] min-h-[44px] inline-flex items-center justify-center"
                  >
                    <span
                      className={`block h-3 w-3 border-2 ${i === index ? 'bg-amber border-amber' : 'border-parchment/60'}`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === n - 1}
              className="pixel-focus inline-flex items-center justify-center min-w-[44px] min-h-[44px] disabled:opacity-40"
              aria-label="Next scene"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
          {labels && (
            <ol className="px-4 mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 font-display text-[11px] text-parchment/80">
              {deckScenes.map((s, i) => (
                <li key={s.zone}>
                  {i + 1}. {routeLabel(zoneById[s.zone])}
                </li>
              ))}
            </ol>
          )}
        </>
      )}

      <div className="px-4 mt-3" aria-live="polite">
        {room ? (
          <p className="text-sm">
            Tap a frame or an object. {'“'}Back outside{'”'} returns to the roof.
          </p>
        ) : scene.zone === 'overlook' ? (
          <div>
            <h2 className="font-display text-lg">{profile.destination.heading}</h2>
            <Field as="p" value={profile.destination.line} className="mt-1 text-signal" />
            <p className="mt-1 text-sm leading-relaxed">{profile.destination.sentence}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/research" className="pixel-btn-primary pixel-frame pixel-focus px-3 py-2 text-sm">
                See research
              </Link>
              <button
                id="deck-room-archive"
                type="button"
                onClick={(e) => open(refById['door-archive'], e.currentTarget)}
                className="pixel-btn-secondary pixel-frame pixel-focus px-3 py-2 text-sm"
              >
                Archive
              </button>
              <button
                id="deck-room-contact"
                type="button"
                onClick={(e) => open(refById['door-contact'], e.currentTarget)}
                className="pixel-btn-secondary pixel-frame pixel-focus px-3 py-2 text-sm"
              >
                Field Office
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-display text-sm">
              {chapter.name}
              {chapter.period && !isPending(chapter.period) && (
                <>
                  {' '}
                  {'·'} {chapter.period}
                </>
              )}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-parchment/85">{chapter.summary}</p>
            {isDC && (
              <button
                type="button"
                onClick={() => setFrames((f) => ({ ...f, [index]: frame ? 0 : 1 }))}
                className="mt-3 pixel-btn-secondary pixel-frame pixel-focus px-3 py-2 text-sm"
              >
                {frame ? `${'◂'} Back to the GPU` : `Continue pipeline ${'▸'}`}
              </button>
            )}
          </div>
        )}
      </div>

      <Panel
        open={!!openRef}
        onOpenChange={(o) => {
          if (!o) {
            setOpenId(null)
            syncUrl({ open: null })
          }
        }}
        title={openRef?.tooltip ?? ''}
        onCloseAutoFocus={(e) => {
          if (invokerRef.current) {
            e.preventDefault()
            invokerRef.current.focus({ preventScroll: true })
          }
        }}
      >
        {openRef && <ObjectCard object={openRef} />}
      </Panel>
    </div>
  )
}
