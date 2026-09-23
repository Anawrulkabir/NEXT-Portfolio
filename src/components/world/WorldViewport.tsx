'use client'
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Keyboard, Map as MapIcon, X } from 'lucide-react'
import { journeyChapters, profile } from '@/content'
import type { WorldObjectRef, ZoneId } from '@/content/types'
import { Field } from '@/components/content/Field'
import { AVATAR_H, AVATAR_W, GROUND_Y, PROXIMITY, WALK_SPEED } from '@/world/constants'
import {
  AVATAR_START_X,
  CABLE_Y,
  PIPELINE,
  WORLD_WIDTH,
  datacenterLeds,
  overlookScenery,
  objectCenterX,
  placedObjects,
  routeZones,
  zoneAt,
  zoneById,
  zoneEntranceX,
  zones,
  type PlacedObject,
} from '@/world/layout'
import { centeredCameraX, clampCamera, desiredCameraX } from '@/world/engine/camera'
import { PARALLAX, bakeFar, farWidth } from '@/world/engine/bake'
import { skyAt } from '@/world/engine/sky'
import { readVisited, worldReducer, writeVisited } from '@/world/state'
import { avatarOutfits, outfitForZone } from '@/world/sprites/avatar'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { Panel } from '@/components/panels/Panel'
import { ObjectCard } from '@/components/panels/ObjectCard'
import { TerrainCanvas } from './TerrainCanvas'
import { ZoneSign } from './ZoneSign'
import { RouteStrip } from './RouteStrip'
import { Room, type RoomId } from './Room'
import { MapOverlay } from './MapOverlay'
import { WorldControls } from './WorldControls'
import { onMotionChange, prefersReducedMotion } from '@/lib/motion'

const objectById: Record<string, PlacedObject> = Object.fromEntries(placedObjects.map((o) => [o.ref.objectId, o]))
/** Every object's content ref — placed in the world or inside a room. */
const refById: Record<string, WorldObjectRef> = Object.fromEntries(
  journeyChapters.flatMap((c) => c.objects.map((o) => [o.objectId, o]))
)
const ROOMS: RoomId[] = ['archive', 'contact']
const roomOf = (objectId: string): RoomId | undefined =>
  ROOMS.find((r) => journeyChapters.find((c) => c.id === r)?.objects.some((o) => o.objectId === objectId))
const doorFor = (room: RoomId) => placedObjects.find((o) => o.ref.opens.type === 'room' && o.ref.opens.id === room)!
const zoneIndex = (id: ZoneId) => zones.findIndex((z) => z.id === id)
const clampX = (x: number) => Math.max(0, Math.min(x, WORLD_WIDTH - AVATAR_W))
/** Where the avatar stands to use an object: just to its left, facing it. */
const standXFor = (o: PlacedObject) => clampX(o.x - AVATAR_W - 4)
const HINT_KEY = 'world:hint-seen'
const INTRO_KEY = 'world:intro-seen'
const INTRO_MS = 2200

function syncUrl(params: { at?: ZoneId; open?: string | null }) {
  const url = new URL(window.location.href)
  if (params.at) url.searchParams.set('at', params.at)
  if (params.open === null) url.searchParams.delete('open')
  else if (params.open) url.searchParams.set('open', params.open)
  window.history.replaceState(window.history.state, '', url)
}

export default function WorldViewport() {
  const router = useRouter()
  const routerRef = useRef(router)
  routerRef.current = router

  const viewportRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const farRef = useRef<HTMLCanvasElement>(null)
  const packetRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef<HTMLDivElement>(null)
  const invokerRef = useRef<HTMLElement | null>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  const [scale, setScale] = useState(2)
  const [hint, setHint] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [room, setRoom] = useState<RoomId | null>(null)
  const [iris, setIris] = useState<'closing' | 'opening' | null>(null)
  const [mapOpen, setMapOpen] = useState(false)
  const [controlsOpen, setControlsOpen] = useState(false)
  // Zone under the camera centre while the intro pans (lights the route strip, bakes terrain ahead).
  const [camZone, setCamZone] = useState<ZoneId | null>(null)
  const irisTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  // Room transitions live in React state; the engine reaches them through this ref.
  const roomApi = useRef({ enter: (_: RoomId) => {}, exit: () => {}, inRoom: false })
  const [state, dispatch] = useReducer(worldReducer, {
    zone: 'workshop',
    nearestId: null,
    focusedId: null,
    openObjectId: null,
    visited: ['workshop'],
    moving: false,
  })

  // Hot, per-frame values. Never put these in React state.
  const hot = useRef({
    avatarX: AVATAR_START_X,
    camX: 0,
    camGoal: null as number | null,
    dir: 0 as -1 | 0 | 1,
    facing: 1 as -1 | 1,
    target: null as { x: number; objectId?: string } | null,
    raf: 0,
    last: 0,
    phase: 0,
    vw: 0,
    scale: 2,
    zone: 'workshop' as ZoneId,
    nearest: null as string | null,
    keyboardWalk: false,
    reduced: false,
    contrast: false, // prefers-contrast: more → no parallax (§15.9)
    lastSaid: { text: '', at: 0 },
    sky: '',
  })

  const engine = useMemo(() => {
    const h = hot.current

    const paint = () => {
      const s = h.scale
      if (layerRef.current) {
        layerRef.current.style.transform = `translate3d(${-Math.round(h.camX * s)}px,0,0)`
      }
      if (farRef.current) {
        // Reduced motion or more contrast: no parallax — the far layer holds still.
        const fx = h.reduced || h.contrast ? 0 : Math.round(h.camX * PARALLAX) * s
        farRef.current.style.transform = `translate3d(${-fx}px,0,0)`
      }
      const vp = viewportRef.current
      if (vp && h.vw) {
        const sky = skyAt(h.camX + h.vw / 2)
        const key = sky.top + sky.mid + sky.low
        if (key !== h.sky) {
          h.sky = key
          vp.style.setProperty('--sky-top', sky.top)
          vp.style.setProperty('--sky-mid', sky.mid)
          vp.style.setProperty('--sky-low', sky.low)
        }
      }
      if (avatarRef.current) {
        avatarRef.current.style.transform = `translate3d(${Math.round(h.avatarX * s)}px,${
          (GROUND_Y - AVATAR_H) * s
        }px,0) scaleX(${h.facing})`
      }
    }

    const setFrame = (frame: string) => {
      if (avatarRef.current && avatarRef.current.dataset.frame !== frame) {
        avatarRef.current.dataset.frame = frame
      }
    }

    /** I-08: a light packet runs along the cable from the GPU to the opened machine. */
    const pulse = (id: string) => {
      const el = packetRef.current
      if (!el || h.reduced || !(PIPELINE as readonly string[]).includes(id) || !el.animate) return
      const s = h.scale
      const x0 = objectCenterX(objectById[PIPELINE[0]]) * s
      const x1 = objectCenterX(objectById[id]) * s
      const steps = Math.max(1, Math.round(Math.abs(x1 - x0) / (16 * s)))
      el.animate(
        [
          { transform: `translate3d(${x0}px,0,0)`, opacity: 1 },
          { transform: `translate3d(${x1}px,0,0)`, opacity: 1, offset: 0.8 },
          { transform: `translate3d(${x1}px,0,0)`, opacity: 0 },
        ],
        { duration: 500, easing: `steps(${steps}, end)` }
      )
    }

    const openObject = (id: string) => {
      const ref = refById[id]
      if (!ref) return
      if (ref.opens.type === 'route') {
        routerRef.current.push(ref.opens.href)
        return
      }
      if (ref.opens.type === 'room') {
        roomApi.current.enter(ref.opens.id)
        return
      }
      dispatch({ type: 'open', id })
      syncUrl({ open: id })
      pulse(id)
    }

    const updateProximity = () => {
      const center = h.avatarX + AVATAR_W / 2
      let best: string | null = null
      let bestD = PROXIMITY
      for (const o of placedObjects) {
        const d = Math.abs(objectCenterX(o) - center)
        if (d <= bestD) {
          bestD = d
          best = o.ref.objectId
        }
      }
      if (best !== h.nearest) {
        h.nearest = best
        dispatch({ type: 'nearest', id: best })
        if (best && h.keyboardWalk && liveRef.current) {
          // Throttled: at most one announcement per 800 ms, never the same twice in a row.
          const text = `${objectById[best].ref.tooltip}. Press E to open.`
          const now = performance.now()
          if (text !== h.lastSaid.text && now - h.lastSaid.at > 800) {
            liveRef.current.textContent = text
            h.lastSaid = { text, at: now }
          }
        }
      }
    }

    const tick = (t: number) => {
      const dt = Math.min(0.05, h.last ? (t - h.last) / 1000 : 1 / 60)
      h.last = t
      let walking = false

      if (h.dir !== 0) {
        h.target = null
        h.avatarX = clampX(h.avatarX + h.dir * WALK_SPEED * dt)
        h.facing = h.dir
        walking = true
      } else if (h.target) {
        const dx = h.target.x - h.avatarX
        const step = WALK_SPEED * dt
        if (Math.abs(dx) <= step) {
          h.avatarX = h.target.x
          h.facing = 1
          const id = h.target.objectId
          h.target = null
          if (id) openObject(id)
        } else {
          h.avatarX += Math.sign(dx) * step
          h.facing = dx > 0 ? 1 : -1
          walking = true
        }
      }

      if (walking) h.camGoal = null
      const goal = h.camGoal ?? desiredCameraX(h.avatarX, h.camX, h.vw, WORLD_WIDTH)
      if (h.reduced) h.camX = goal
      else h.camX += (goal - h.camX) * (1 - Math.exp(-dt * 10))
      const settling = Math.abs(goal - h.camX) > 0.5
      if (!settling) h.camX = goal

      if (walking) {
        h.phase += dt
        setFrame(String(2 + (Math.floor(h.phase * 8) % 4)))
      } else {
        setFrame('idle')
      }

      const zone = zoneAt(h.avatarX + AVATAR_W / 2).id
      if (zone !== h.zone) {
        h.zone = zone
        dispatch({ type: 'zone', zone })
        syncUrl({ at: zone })
      }
      updateProximity()
      paint()

      if (walking || h.target || settling) {
        h.raf = requestAnimationFrame(tick)
      } else {
        h.raf = 0
        h.last = 0
        dispatch({ type: 'moving', moving: false })
      }
    }

    const startLoop = () => {
      if (!h.raf) {
        h.last = 0
        dispatch({ type: 'moving', moving: true })
        h.raf = requestAnimationFrame(tick)
      }
    }

    const activate = (o: PlacedObject, invoker: HTMLElement | null) => {
      invokerRef.current = invoker
      if (o.ref.opens.type === 'route') {
        routerRef.current.push(o.ref.opens.href)
        return
      }
      const standX = standXFor(o)
      h.dir = 0
      h.camGoal = null
      // Walk if it's close (≤ 0.9 s); otherwise teleport so nobody waits (§09 I-04).
      if (h.reduced || Math.abs(standX - h.avatarX) / WALK_SPEED > 0.9) {
        h.avatarX = standX
        h.facing = 1
        h.target = null
        startLoop()
        openObject(o.ref.objectId)
      } else {
        h.target = { x: standX, objectId: o.ref.objectId }
        startLoop()
      }
    }

    const focusObject = (o: PlacedObject) => {
      const s = o.x
      const e = o.x + o.sprite.w
      if (s < h.camX || e > h.camX + h.vw) {
        h.camGoal = centeredCameraX(objectCenterX(o), h.vw, WORLD_WIDTH)
        startLoop()
      }
    }

    const jumpToZone = (id: ZoneId) => {
      if (roomApi.current.inRoom) roomApi.current.exit()
      h.dir = 0
      h.target = null
      h.avatarX = clampX(zoneEntranceX(id))
      h.facing = 1
      h.camGoal = clampCamera(zoneById[id].startX, h.vw, WORLD_WIDTH)
      startLoop()
    }

    const stop = () => {
      if (h.raf) cancelAnimationFrame(h.raf)
      h.raf = 0
    }

    /** Tap-to-walk (§08.8): walk to a point on the ground, source px. */
    const walkTo = (x: number) => {
      h.dir = 0
      h.camGoal = null
      h.target = { x: clampX(x - AVATAR_W / 2) }
      startLoop()
    }

    /** Put the avatar at a room's door on the Overlook (entering or leaving it). */
    const standAtDoor = (r: RoomId) => {
      const door = doorFor(r)
      h.avatarX = standXFor(door)
      h.facing = 1
      h.camGoal = centeredCameraX(objectCenterX(door), h.vw, WORLD_WIDTH)
      startLoop()
    }

    /**
     * Intro rewind (§09 I-01): the camera starts at the Overlook and pans back
     * to the Workshop in 2.2 s. Any key, click, scroll or touch skips to the end.
     */
    const intro = { raf: 0, onZone: (_: ZoneId | null) => {} }
    const playIntro = (onZone: (z: ZoneId | null) => void) => {
      intro.onZone = onZone
      const from = clampCamera(WORLD_WIDTH, h.vw, WORLD_WIDTH)
      const to = desiredCameraX(h.avatarX, 0, h.vw, WORLD_WIDTH)
      let t0 = 0
      let last: ZoneId | null = null
      const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
      const step = (t: number) => {
        if (!t0) t0 = t
        const k = Math.min(1, (t - t0) / INTRO_MS)
        h.camX = from + (to - from) * ease(k)
        const z = zoneAt(h.camX + h.vw / 2).id
        if (z !== last) {
          last = z
          onZone(z)
        }
        paint()
        if (k < 1) intro.raf = requestAnimationFrame(step)
        else endIntro()
      }
      h.camX = from
      paint()
      intro.raf = requestAnimationFrame(step)
    }
    const endIntro = () => {
      if (intro.raf) cancelAnimationFrame(intro.raf)
      intro.raf = 0
      h.camX = desiredCameraX(h.avatarX, 0, h.vw, WORLD_WIDTH)
      paint()
      intro.onZone(null)
    }

    return {
      paint,
      startLoop,
      activate,
      focusObject,
      jumpToZone,
      openObject,
      standAtDoor,
      walkTo,
      playIntro,
      endIntro,
      introRunning: () => intro.raf !== 0,
      stop: () => {
        stop()
        if (intro.raf) cancelAnimationFrame(intro.raf)
      },
    }
  }, [])

  // Scale, viewport width, reduced motion, deep links — once on mount.
  useEffect(() => {
    const h = hot.current
    const tall = window.matchMedia('(min-height: 1000px)')
    const contrast = window.matchMedia('(prefers-contrast: more)')
    const applyScale = () => {
      h.scale = tall.matches ? 3 : 2
      setScale(h.scale)
      if (viewportRef.current) h.vw = viewportRef.current.clientWidth / h.scale
      engine.paint()
    }
    const applyReduced = () => {
      h.reduced = prefersReducedMotion()
      h.contrast = contrast.matches
      engine.paint()
    }
    applyScale()
    applyReduced()
    tall.addEventListener('change', applyScale)
    const offMotion = onMotionChange(applyReduced)
    contrast.addEventListener('change', applyReduced)

    const ro = new ResizeObserver(() => {
      if (!viewportRef.current) return
      h.vw = viewportRef.current.clientWidth / h.scale
      h.camX = clampCamera(h.camX, h.vw, WORLD_WIDTH)
      engine.paint()
    })
    if (viewportRef.current) ro.observe(viewportRef.current)

    dispatch({ type: 'hydrateVisited', visited: readVisited() })
    if (farRef.current) bakeFar(farRef.current, WORLD_WIDTH)

    // Deep links: ?at=<zone>&open=<objectId> (§03.1)
    const params = new URLSearchParams(window.location.search)
    const at = params.get('at') as ZoneId | null
    const open = params.get('open')
    const openRoom = open ? roomOf(open) : undefined
    if (openRoom || (at && (ROOMS as string[]).includes(at))) {
      // Rooms: arrive inside, without the iris (§03.1 deep links).
      const r = openRoom ?? (at as RoomId)
      engine.standAtDoor(r)
      h.camX = h.camGoal ?? h.camX
      setRoom(r)
      if (open && openRoom) {
        dispatch({ type: 'open', id: open })
      }
    } else if (open && objectById[open]) {
      const o = objectById[open]
      h.avatarX = standXFor(o)
      h.camGoal = centeredCameraX(objectCenterX(o), h.vw, WORLD_WIDTH)
      h.camX = h.camGoal
      engine.startLoop()
      engine.openObject(open)
    } else if (at && zoneById[at]) {
      engine.jumpToZone(at)
      h.camX = h.camGoal ?? h.camX
    }
    engine.paint()

    // First visit only, never with a deep link, reduced motion or on small screens.
    let introSeen = true
    try {
      introSeen = !!localStorage.getItem(INTRO_KEY)
      localStorage.setItem(INTRO_KEY, '1')
    } catch {
      // storage blocked — treat as seen so it can't replay on every load
    }
    const skipIntro = () => engine.introRunning() && engine.endIntro()
    const skipEvents = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const
    if (!introSeen && !open && !at && !h.reduced && window.innerWidth >= 768) {
      engine.playIntro(setCamZone)
      skipEvents.forEach((ev) => window.addEventListener(ev, skipIntro, { passive: true, once: true }))
    }

    const onExternalFocus = () => {
      viewportRef.current?.focus({ preventScroll: true })
      showHint()
    }
    window.addEventListener('world:focus', onExternalFocus)

    return () => {
      tall.removeEventListener('change', applyScale)
      offMotion()
      contrast.removeEventListener('change', applyReduced)
      window.removeEventListener('world:focus', onExternalFocus)
      skipEvents.forEach((ev) => window.removeEventListener(ev, skipIntro))
      ro.disconnect()
      engine.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine])

  // Door transition (I-07): iris shut → swap scene → iris open. Instant under reduced motion.
  useEffect(() => {
    const later = (ms: number, fn: () => void) => irisTimers.current.push(setTimeout(fn, ms))
    const swap = (fn: () => void) => {
      irisTimers.current.forEach(clearTimeout)
      irisTimers.current = []
      if (hot.current.reduced) {
        fn()
        setIris(null)
        return
      }
      setIris('closing')
      later(200, () => {
        fn()
        setIris('opening')
        later(200, () => setIris(null))
      })
    }
    roomApi.current.enter = (r: RoomId) =>
      swap(() => {
        dispatch({ type: 'close' })
        engine.standAtDoor(r)
        setRoom(r)
        syncUrl({ at: r, open: null })
      })
    roomApi.current.exit = () =>
      swap(() => {
        setRoom((r) => {
          if (r) {
            syncUrl({ at: 'overlook', open: null })
            // Back on the roof, focus returns to the door we came through.
            requestAnimationFrame(() =>
              document
                .querySelector<HTMLElement>(`[data-object-id="${doorFor(r).ref.objectId}"]`)
                ?.focus({ preventScroll: true })
            )
          }
          return null
        })
      })
    return () => irisTimers.current.forEach(clearTimeout)
  }, [engine])

  useEffect(() => {
    roomApi.current.inRoom = room !== null
  }, [room])

  // Repaint when the integer scale changes (element sizes change with it).
  useEffect(() => {
    engine.paint()
  }, [scale, engine])

  useEffect(() => {
    writeVisited(state.visited)
  }, [state.visited])

  const hintTimer = useRef<ReturnType<typeof setTimeout>>()
  function showHint() {
    try {
      if (sessionStorage.getItem(HINT_KEY)) return
      sessionStorage.setItem(HINT_KEY, '1')
    } catch {
      // no storage — still show it once for this mount
    }
    setHint(true)
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setHint(false), 4000)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const h = hot.current
    const k = e.key
    if (k === 'm' || k === 'M') {
      e.preventDefault()
      setMapOpen(true)
      return
    }
    if (k === '?') {
      e.preventDefault()
      setControlsOpen(true)
      return
    }
    if (room) return // no walking inside a room
    if (k === 'ArrowRight' || k === 'd' || k === 'D') {
      e.preventDefault()
      h.dir = 1
      h.keyboardWalk = true
      engine.startLoop()
    } else if (k === 'ArrowLeft' || k === 'a' || k === 'A') {
      e.preventDefault()
      h.dir = -1
      h.keyboardWalk = true
      engine.startLoop()
    } else if ((k === 'e' || k === 'E') && h.nearest) {
      e.preventDefault()
      engine.activate(objectById[h.nearest], document.activeElement as HTMLElement)
    }
  }
  const onKeyUp = (e: React.KeyboardEvent) => {
    const h = hot.current
    if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && h.dir === 1) h.dir = 0
    if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && h.dir === -1) h.dir = 0
  }
  const onBlur = (e: React.FocusEvent) => {
    if (!viewportRef.current?.contains(e.relatedTarget as Node)) hot.current.dir = 0
  }

  const s = scale
  const current = zoneIndex(state.zone)
  const outfit = outfitForZone(state.zone)
  const tooltipId = state.focusedId ?? hoveredId ?? state.nearestId
  const tooltipObj = tooltipId ? objectById[tooltipId] : null
  const tooltipHint =
    tooltipId === state.focusedId ? 'Enter to open' : tooltipId === hoveredId ? 'Click to open' : 'E to open'

  const openRef = state.openObjectId ? refById[state.openObjectId] : null
  const openObj = state.openObjectId ? objectById[state.openObjectId] : null
  const openZoneIdx = openObj ? routeZones.findIndex((z) => z.id === openObj.zone) : -1
  const nextZone = openZoneIdx >= 0 ? routeZones[openZoneIdx + 1] : undefined

  return (
    <div>
      <div
        ref={viewportRef}
        tabIndex={0}
        role="region"
        aria-label="Interactive journey map"
        aria-describedby="world-help"
        className="world-frame bg-black relative overflow-hidden outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-amber focus-visible:outline-offset-[-3px]"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onPointerDown={(e) => {
          // Tap/click on open ground walks there; objects, links and the room ignore it.
          if (room || (e.target as HTMLElement).closest('button, a, [data-no-walk]')) return
          const rect = viewportRef.current!.getBoundingClientRect()
          engine.walkTo((e.clientX - rect.left) / hot.current.scale + hot.current.camX)
        }}
        onBlur={onBlur}
        onFocus={(e) => {
          if (e.target === viewportRef.current) showHint()
        }}
      >
        <div
          ref={sceneRef}
          className={`absolute inset-0 world-sky ${iris === 'closing' ? 'iris-closing' : iris === 'opening' ? 'iris-opening' : ''}`}
        >
          <canvas
            ref={farRef}
            aria-hidden="true"
            className={`absolute top-0 left-0 pixelated will-change-transform ${room ? 'invisible' : ''}`}
            style={{ width: farWidth(WORLD_WIDTH) * s, height: '100%' }}
          />
          <div
            ref={layerRef}
            className={`absolute inset-y-0 left-0 will-change-transform ${room ? 'invisible' : ''}`}
            style={{ width: WORLD_WIDTH * s }}
            aria-hidden={room ? true : undefined}
          >
            {zones.map((z, i) => (
              <TerrainCanvas
                key={z.id}
                zone={z}
                scale={s}
                near={Math.abs(i - current) <= 1 || (camZone !== null && Math.abs(i - zoneIndex(camZone)) <= 1)}
              />
            ))}
            {/* Rack LEDs sit on the terrain, under every object. */}
            {Math.abs(current - zoneIndex('datacenter')) <= 1 && (
              <svg
                className="absolute top-0 pointer-events-none"
                style={{ left: zoneById.datacenter.startX * s }}
                width={(zoneById.datacenter.endX - zoneById.datacenter.startX) * s}
                height={GROUND_Y * s}
                viewBox={`0 0 ${zoneById.datacenter.endX - zoneById.datacenter.startX} ${GROUND_Y}`}
                shapeRendering="crispEdges"
                aria-hidden="true"
              >
                {datacenterLeds.map((led, i) => (
                  <rect
                    key={i}
                    className="world-led"
                    x={led.x}
                    y={led.y}
                    width={1}
                    height={1}
                    fill={led.color}
                    style={{ animationDelay: `${-led.delay}ms` }}
                  />
                ))}
              </svg>
            )}
            {zones.map((z) => (
              <ZoneSign key={z.id} zone={z} scale={s} />
            ))}
            {placedObjects.map((o) => (
              <button
                key={o.ref.objectId}
                type="button"
                className="world-obj absolute"
                style={{ left: o.x * s, top: o.y * s }}
                aria-label={o.ref.tooltip}
                data-object-id={o.ref.objectId}
                data-near={state.nearestId === o.ref.objectId}
                onClick={(e) => engine.activate(o, e.currentTarget)}
                onFocus={() => {
                  dispatch({ type: 'focus', id: o.ref.objectId })
                  engine.focusObject(o)
                }}
                onBlur={() => dispatch({ type: 'focus', id: null })}
                onMouseEnter={() => setHoveredId(o.ref.objectId)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <PixelSprite
                  sprite={o.sprite}
                  scale={s}
                  frame={o.animate ? undefined : 0}
                  className={o.animate === 'tick' ? 'px-tick' : undefined}
                />
                {o.overlay && <PixelSprite sprite={o.overlay} scale={s} frame={0} className="obj-overlay" />}
              </button>
            ))}
            {state.zone === 'overlook' && (
              // I-15: the destination, rendered in the scene on arrival.
              <section
                aria-labelledby="overlook-h"
                data-no-walk
                className="overlook-in absolute z-10 max-w-[560px] bg-night/85 border-2 border-parchment/40 px-5 py-4 text-parchment"
                style={{ left: (zoneById.overlook.startX + overlookScenery.panelX) * s, top: 12 * s }}
              >
                <h2 id="overlook-h" className="font-display text-xl md:text-2xl">
                  {profile.destination.heading}
                </h2>
                <Field as="p" value={profile.destination.line} className="mt-2 text-lg md:text-2xl text-signal" />
                <p className="mt-2 text-sm md:text-base leading-relaxed">{profile.destination.sentence}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/research" className="pixel-btn-primary pixel-frame pixel-focus px-3 py-1.5 text-sm">
                    See research
                  </Link>
                  <Link
                    href={profile.cv.viewHref}
                    className="pixel-btn-secondary pixel-frame pixel-focus px-3 py-1.5 text-sm"
                  >
                    View CV
                  </Link>
                  <Link href="/contact" className="pixel-btn-secondary pixel-frame pixel-focus px-3 py-1.5 text-sm">
                    Get in touch
                  </Link>
                </div>
              </section>
            )}
            <div
              ref={packetRef}
              className="absolute left-0 pointer-events-none opacity-0"
              style={{ top: (CABLE_Y - 1) * s, width: 8 * s, height: 3 * s, marginLeft: -4 * s, background: '#dff3f3' }}
              aria-hidden="true"
            />
            <div
              ref={avatarRef}
              className="absolute left-0 top-0 px-anim pointer-events-none"
              data-frame="idle"
              style={{ transformOrigin: 'center' }}
              aria-hidden="true"
            >
              <div key={outfit} className="outfit-swap">
                <PixelSprite sprite={avatarOutfits[outfit]} scale={s} />
              </div>
            </div>
            {tooltipObj && (
              <div
                className="absolute pointer-events-none z-10"
                style={{
                  left: objectCenterX(tooltipObj) * s,
                  top: tooltipObj.y * s - 10,
                  transform: 'translate(-50%, -100%)',
                }}
                aria-hidden="true"
              >
                <div className="bg-parchment text-ink border-2 border-loam pixel-shadow px-2.5 py-1.5 whitespace-nowrap text-center">
                  <p className="font-display text-sm">{tooltipObj.ref.tooltip}</p>
                  <p className="text-[11px] opacity-70">{tooltipHint}</p>
                </div>
              </div>
            )}
          </div>
          {room && (
            <Room
              id={room}
              scale={s}
              onOpen={(ref, invoker) => {
                invokerRef.current = invoker
                engine.openObject(ref.objectId)
              }}
              onExit={() => roomApi.current.exit()}
            />
          )}
        </div>

        <div className="absolute right-3 top-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={() => setControlsOpen(true)}
            className="pixel-focus inline-flex items-center gap-1.5 bg-parchment text-ink border-2 border-loam px-2.5 py-1 text-xs"
            aria-keyshortcuts="Shift+/"
          >
            <Keyboard className="h-3.5 w-3.5" aria-hidden="true" /> Controls
          </button>
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="pixel-focus inline-flex items-center gap-1.5 bg-parchment text-ink border-2 border-loam px-2.5 py-1 text-xs"
            aria-keyshortcuts="M"
          >
            <MapIcon className="h-3.5 w-3.5" aria-hidden="true" /> Map
          </button>
        </div>

        {hint && (
          <div className="absolute left-3 bottom-3 flex items-center gap-2 bg-parchment/95 text-ink border-2 border-loam px-3 py-1.5 text-xs">
            <span>{'← →'} to walk · click anything glowing · M for map · ? for controls</span>
            <button
              type="button"
              onClick={() => setHint(false)}
              aria-label="Dismiss controls hint"
              className="pixel-focus"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        <p id="world-help" className="sr-only">
          Use the left and right arrow keys to walk. Tab moves between objects; Enter opens one. Press M for a map of
          every place and object. The same content is on the Journey page as text.
        </p>
        <div ref={liveRef} aria-live="polite" className="sr-only" />
      </div>

      <RouteStrip current={camZone ?? state.zone} visited={state.visited} onJump={engine.jumpToZone} />

      <WorldControls open={controlsOpen} onOpenChange={setControlsOpen} />

      <MapOverlay
        open={mapOpen}
        onOpenChange={setMapOpen}
        avatarX={hot.current.avatarX}
        onZone={(id) => {
          setMapOpen(false)
          invokerRef.current = viewportRef.current
          if ((ROOMS as ZoneId[]).includes(id)) roomApi.current.enter(id as RoomId)
          else engine.jumpToZone(id)
        }}
        onObject={(ref) => {
          setMapOpen(false)
          invokerRef.current = viewportRef.current
          const r = roomOf(ref.objectId)
          if (r) {
            // Enter the room, then open the object once the iris has finished.
            if (room !== r) roomApi.current.enter(r)
            setTimeout(() => engine.openObject(ref.objectId), room === r || hot.current.reduced ? 0 : 450)
          } else if (objectById[ref.objectId]) {
            engine.jumpToZone(objectById[ref.objectId].zone)
            engine.activate(objectById[ref.objectId], viewportRef.current)
          }
        }}
      />

      <Panel
        open={!!openRef}
        onOpenChange={(open) => {
          if (!open) {
            dispatch({ type: 'close' })
            syncUrl({ open: null })
          }
        }}
        title={openRef?.tooltip ?? ''}
        wide={
          (openRef?.opens.type === 'research' && !!openRef.opens.view && openRef.opens.view !== 'card') ||
          openRef?.opens.type === 'events-map'
        }
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          ;(invokerRef.current ?? viewportRef.current)?.focus({ preventScroll: true })
        }}
        footer={
          nextZone ? (
            <button
              type="button"
              className="pixel-btn-primary pixel-frame pixel-focus px-3 py-1.5 text-sm"
              onClick={() => {
                invokerRef.current = viewportRef.current
                dispatch({ type: 'close' })
                syncUrl({ open: null })
                engine.jumpToZone(nextZone.id)
              }}
            >
              Next stop: {nextZone.chapter.name} {'→'}
            </button>
          ) : undefined
        }
      >
        {openRef && <ObjectCard object={openRef} />}
      </Panel>
    </div>
  )
}
