'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft } from 'lucide-react'
import { DeskScene, HOTSPOT_LABEL, SCREEN_PX, type Hotspot, type Mode } from './scene'
import { DeskAudio } from './audio'
import { DeskDataProvider } from './DeskDataContext'
import type { DeskData } from './data'
import { MacOS } from './mac/MacOS'
import { NotesApp } from './mac/Notes'
import { GpuSlicesApp } from './mac/GpuSlices'
import { MailApp, PhotosApp, PreviewApp } from './mac/apps'
import { OSProvider, type AppId } from './mac/context'
import { FMark } from './mac/icons'
import { onMotionChange, prefersReducedMotion } from '@/lib/motion'

type Stage = 'loading' | 'ready' | 'running'

// What each build step actually does, in words.
const STEP_LABEL: Record<string, string> = {
  studioEnvironment: 'Setting up the room',
  tableclothTexture: 'Spreading the tablecloth',
  deskMatTexture: 'Laying down the world-map mat',
  monitorModel: 'Placing the HP M22f',
  macbookModel: 'Opening the MacBook Air',
  keyboardModel: 'Plugging in the R65 and the Rapoo',
  moneyPlantModel: 'Watering the money plant',
  cabinetModel: 'Stacking books on the cabinet',
  lampModel: 'Switching on the lamp',
  chairModel: 'Pulling up the blue chair',
  contactShadows: 'Softening the shadows',
  lighting: 'Setting the lights',
  shaders: 'Warming up the GPU',
}

function useClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
    tick()
    const i = setInterval(tick, 10_000)
    return () => clearInterval(i)
  }, [])
  return t
}

/** Phones: the Mac screen is too small to read in 3D, so apps open flat, full-screen. */
function PhoneScreen({ onClose }: { onClose: () => void }) {
  const [app, setApp] = useState<AppId | null>(null)
  const [note, setNote] = useState('read-me')
  const [arg, setArg] = useState<string | undefined>()
  const open = (id: AppId, a?: string) => {
    if (id === 'notes') {
      if (a) setNote(a)
      setApp(null)
    } else if (id === 'soccer' || id === 'terminal' || id === 'about') {
      setApp(null) // keyboard-only toys stay on desktop
    } else {
      setArg(a)
      setApp(id)
    }
  }
  return (
    <OSProvider value={{ open }}>
      <div className="fahad-mac absolute inset-0 z-40 flex flex-col" role="dialog" aria-label="fahadOS">
        <div className="mac-menubar flex h-11 shrink-0 items-center justify-between px-3 text-[15px]">
          {app ? (
            <button type="button" onClick={() => setApp(null)} className="flex items-center text-[#b3261e]">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Notes
            </button>
          ) : (
            <span className="flex items-center gap-1 font-semibold">
              <FMark size={18} /> fahadOS
            </span>
          )}
          <button type="button" onClick={onClose} className="rounded-full bg-black/10 px-3 py-1 text-[13px]">
            Back to desk
          </button>
        </div>
        <div className="min-h-0 flex-1 bg-[#fbfaf7]">
          {app === 'photos' ? (
            <PhotosApp focus={arg} />
          ) : app === 'mail' ? (
            <MailApp />
          ) : app === 'preview' ? (
            <PreviewApp />
          ) : app === 'gpu' ? (
            <div className="h-full overflow-y-auto">
              <GpuSlicesApp />
            </div>
          ) : (
            <NotesApp selected={note} onSelect={setNote} compact />
          )}
        </div>
      </div>
    </OSProvider>
  )
}

/**
 * /desk: the author's real desk as a 3D diorama. It boots like a Mac, the
 * camera drifts around the desk, click to sit down, click the monitor to use
 * fahadOS.
 */
export default function DeskExperience({ data }: { data: DeskData }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<DeskScene | null>(null)
  const audioRef = useRef(new DeskAudio())
  const [screenEl, setScreenEl] = useState<HTMLDivElement | null>(null)
  const [stage, setStage] = useState<Stage>('loading')
  const [step, setStep] = useState({ label: 'Starting', pct: 0 })
  const [mode, setMode] = useState<Mode>('loading')
  const [hover, setHover] = useState<{ h: Hotspot; x: number; y: number } | null>(null)
  const [muted, setMuted] = useState(false)
  const [narrow, setNarrow] = useState(false)
  const clock = useClock()

  useEffect(() => {
    const el = document.createElement('div')
    el.style.width = `${SCREEN_PX.w}px`
    el.style.height = `${SCREEN_PX.h}px`
    setScreenEl(el)
    const scene = new DeskScene(hostRef.current!, el)
    sceneRef.current = scene
    scene.onHover = (h, x, y) => setHover(h ? { h, x, y } : null)
    scene.onModeChange = setMode
    scene.onTravel = () => audioRef.current.whoosh()
    scene.setReducedMotion(prefersReducedMotion())
    const off = onMotionChange(() => scene.setReducedMotion(prefersReducedMotion()))
    scene.start()
    let cancelled = false
    scene
      .build((label, done, n) => !cancelled && setStep({ label: STEP_LABEL[label] ?? label, pct: done / n }))
      .then(() => !cancelled && setStage('ready'))
    const audio = audioRef.current
    const onResize = () => {
      const n = window.innerWidth < 700
      scene.flatScreen = n
      setNarrow(n)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      off()
      window.removeEventListener('resize', onResize)
      scene.dispose()
      audio.dispose()
    }
  }, [])

  const begin = () => {
    if (stage !== 'ready') return
    audioRef.current.start()
    audioRef.current.chime()
    setStage('running')
    sceneRef.current?.showOrbit()
  }

  // Keys and clicks make sound; real key presses press the same key on the 3D R65.
  useEffect(() => {
    if (stage !== 'running') return
    const audio = audioRef.current
    const down = () => audio.mouseDown()
    const up = () => audio.mouseUp()
    const key = (e: KeyboardEvent) => {
      if (e.repeat) return
      audio.key()
      sceneRef.current?.pressKey(e.code)
      if (e.key === 'Escape') {
        const s = sceneRef.current
        if (s?.currentMode === 'screen') s.zoomOut()
        else if (s?.currentMode === 'desk') s.toOrbit()
      }
    }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('keydown', key)
    }
  }, [stage])

  useEffect(() => {
    if (stage !== 'ready') return
    const onKey = (e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && begin()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const toggleMute = () => {
    setMuted((m) => {
      audioRef.current.setMuted(!m)
      return !m
    })
  }

  return (
    <DeskDataProvider value={data}>
      <div className="desk-void fixed inset-0 z-[70] overflow-hidden text-black">
        <div ref={hostRef} className="absolute inset-0" />
        {screenEl &&
          createPortal(
            <MacOS active={mode === 'screen' && !narrow} muted={muted} onToggleMute={toggleMute} onShutdown={() => sceneRef.current?.zoomOut()} />,
            screenEl
          )}

        {/* Boot: logo, a real progress bar, and what is being built right now. */}
        {stage !== 'running' && (
          <button
            type="button"
            onClick={begin}
            disabled={stage === 'loading'}
            aria-label={stage === 'ready' ? 'Start: enter the desk' : 'Loading'}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black text-[#f2f0ea] disabled:cursor-progress"
          >
            <FMark size={84} color="#f2f0ea" />
            <span className="mt-10 block h-[5px] w-[220px] overflow-hidden rounded-full bg-white/20">
              <span className="block h-full rounded-full bg-[#f2f0ea] transition-[width] duration-300" style={{ width: `${step.pct * 100}%` }} />
            </span>
            <span className="mt-4 h-5 text-[13px] text-white/45" aria-live="polite">
              {stage === 'ready' ? <span className="text-white/85">Click anywhere to start. Sound on.</span> : `${step.label}…`}
            </span>
          </button>
        )}

        {stage === 'running' && (
          <>
            {mode !== 'screen' && mode !== 'zooming' && (
              <div className="absolute left-4 right-4 top-4 flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="hud-pill dark font-semibold">{data.profile.shortName}</span>
                  <span className="hud-pill">{data.profile.positioning}</span>
                  <span className="hud-pill tabular-nums">{clock}</span>
                </div>
                <nav aria-label="Other views" className="flex gap-1.5">
                  <button type="button" onClick={toggleMute} className="hud-pill" aria-pressed={!muted}>
                    {muted ? 'Sound off' : 'Sound on'}
                  </button>
                  <a href="/hire" className="hud-pill">
                    1-minute brief
                  </a>
                  <a href="/" className="hud-pill">
                    Classic site
                  </a>
                </nav>
              </div>
            )}

            {mode === 'orbit' && (
              <p className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
                <span className="hud-pill dark">Click the desk to sit down</span>
              </p>
            )}
            {mode === 'desk' && (
              <div className="absolute inset-x-0 bottom-6 flex flex-wrap justify-center gap-1.5 px-4">
                <button type="button" onClick={() => sceneRef.current?.zoomIn()} className="hud-pill dark">
                  Use the computer
                </button>
                <span className="hud-pill hidden sm:inline-flex">Type on your keyboard. Click the lamp, the plant, the chair. Esc steps back.</span>
              </div>
            )}
            {mode === 'desk' && hover && (
              <span className="hud-pill dark pointer-events-none absolute" style={{ left: hover.x + 14, top: hover.y + 14 }}>
                {HOTSPOT_LABEL[hover.h]}
              </span>
            )}
            {mode === 'screen' && !narrow && (
              <button type="button" onClick={() => sceneRef.current?.zoomOut()} className="hud-pill absolute left-3 top-3 opacity-70 hover:opacity-100 focus-visible:opacity-100">
                Esc · back to the desk
              </button>
            )}
            {mode === 'screen' && narrow && <PhoneScreen onClose={() => sceneRef.current?.zoomOut()} />}
          </>
        )}
      </div>
    </DeskDataProvider>
  )
}
