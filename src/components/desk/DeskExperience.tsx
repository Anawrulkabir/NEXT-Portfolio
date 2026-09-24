'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DeskScene, HOTSPOT_LABEL, SCREEN_PX, type Hotspot, type Mode } from './scene'
import { DeskAudio } from './audio'
import { DeskDataProvider } from './DeskDataContext'
import type { DeskData } from './data'
import { FahadOS } from './os/FahadOS'
import { Showcase } from './os/Showcase'
import { TitleGlyph } from './os/Win95'
import { onMotionChange, prefersReducedMotion } from '@/lib/motion'

type Stage = 'loading' | 'ready' | 'running'

function useClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [])
  return t
}

/**
 * /desk: the author's real desk as a 3D diorama. A BIOS loader lists what is
 * actually being built, START unlocks sound, the camera drifts around the
 * desk, click to sit down, click the monitor to use FahadOS.
 */
export default function DeskExperience({ data }: { data: DeskData }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<DeskScene | null>(null)
  const audioRef = useRef(new DeskAudio())
  const [screenEl, setScreenEl] = useState<HTMLDivElement | null>(null)
  const [stage, setStage] = useState<Stage>('loading')
  const [loaded, setLoaded] = useState<{ label: string; pct: number }[]>([])
  const [total, setTotal] = useState(0)
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
      .build((label, done, n) => {
        if (cancelled) return
        setTotal(n)
        setLoaded((l) => [...l, { label, pct: Math.round((done / n) * 100) }])
      })
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
    setStage('running')
    sceneRef.current?.showOrbit()
  }

  // Keys and clicks make sound; real key presses also press 3D keycaps.
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
    const onKey = (e: KeyboardEvent) => e.key === 'Enter' && begin()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const toggleMute = () => {
    setMuted((m) => {
      audioRef.current.setMuted(!m)
      return !m
    })
  }

  const date = new Date()
  const today = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`

  return (
    <DeskDataProvider value={data}>
      <div className="desk-void fixed inset-0 z-[70] overflow-hidden text-black">
        <div ref={hostRef} className="absolute inset-0" />
        {screenEl &&
          createPortal(
            <FahadOS active={mode === 'screen' && !narrow} muted={muted} onToggleMute={toggleMute} onShutdown={() => sceneRef.current?.zoomOut()} />,
            screenEl
          )}

        {/* BIOS loader */}
        {stage !== 'running' && (
          <div className="absolute inset-0 z-30 bg-black text-[#d0d0d0] font-mono text-[12px] sm:text-[13px] leading-[1.35] p-5 sm:p-8 flex flex-col">
            <div className="flex gap-10">
              <p className="font-bold text-white">
                FAHAD KABIR,
                <br />
                SHOWCASE INC.
              </p>
              <p>
                Released: 09/2026
                <br />
                FKBIOS (C)2026 {data.profile.name}
              </p>
            </div>
            <p className="mt-5">FK Showcase(tm) 26.0 &nbsp;&nbsp; WebGL + CSS3D</p>
            <p className="mt-4">
              LOADING RESOURCES ({loaded.length}/{total || '-'}).
            </p>
            <ul className="mt-1 pl-4">
              {loaded.map((l) => (
                <li key={l.label} className="whitespace-pre">
                  {`Loaded ${l.label}`.padEnd(30, ' ')}... {l.pct}%
                </li>
              ))}
            </ul>
            {stage === 'loading' && <p className="bios-caret mt-2" />}
            <p className="mt-auto">
              Press <b className="text-white">ENTER</b> to start · {today}
            </p>

            {stage === 'ready' && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="border-[3px] border-white bg-black px-6 py-5 text-center text-white">
                  <p>{data.profile.name} Portfolio Showcase 2026</p>
                  <p className="bios-caret">Click start to begin </p>
                  <button
                    type="button"
                    onClick={begin}
                    autoFocus
                    className="mt-4 border-2 border-white px-4 py-1 hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black outline-none"
                  >
                    START
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 'running' && (
          <>
            {/* HUD tags */}
            {mode !== 'screen' && mode !== 'zooming' && (
              <div className="absolute left-4 right-4 top-4 flex flex-col items-start gap-1 pointer-events-none">
                <span className="hud-tag">{data.profile.name}</span>
                <span className="hud-tag max-w-full">{data.profile.positioning}</span>
                <span className="flex gap-1 pointer-events-auto">
                  <span className="hud-tag tabular-nums">{clock}</span>
                  <button type="button" onClick={toggleMute} className="hud-tag hover:bg-[#333]" aria-label={muted ? 'Unmute' : 'Mute'}>
                    {muted ? 'SOUND OFF' : 'SOUND ON'}
                  </button>
                  <a href="/hire" className="hud-tag hover:bg-[#333] sm:hidden">
                    BRIEF
                  </a>
                  <a href="/" className="hud-tag hover:bg-[#333] sm:hidden">
                    CLASSIC
                  </a>
                </span>
              </div>
            )}
            {mode !== 'screen' && mode !== 'zooming' && (
              <nav aria-label="Other views" className="absolute right-4 top-4 hidden sm:flex gap-1">
                <a href="/hire" className="hud-tag hover:bg-[#333]">
                  1-MIN BRIEF
                </a>
                <a href="/" className="hud-tag hover:bg-[#333]">
                  CLASSIC SITE
                </a>
              </nav>
            )}

            {mode === 'orbit' && (
              <p className="absolute inset-x-0 bottom-10 flex justify-center pointer-events-none">
                <span className="hud-tag bios-caret">Click anywhere to begin </span>
              </p>
            )}
            {mode === 'desk' && (
              <div className="absolute inset-x-0 bottom-6 flex justify-center gap-1">
                <button type="button" onClick={() => sceneRef.current?.zoomIn()} className="hud-tag hover:bg-[#333]">
                  USE THE COMPUTER
                </button>
                <span className="hud-tag bg-black/70 hidden sm:inline">Try the lamp, the plant, the chair · Esc to step back</span>
              </div>
            )}
            {mode === 'desk' && hover && (
              <span className="hud-tag absolute pointer-events-none" style={{ left: hover.x + 14, top: hover.y + 14 }}>
                {HOTSPOT_LABEL[hover.h]}
              </span>
            )}
            {mode === 'screen' && !narrow && (
              <button
                type="button"
                onClick={() => sceneRef.current?.zoomOut()}
                className="hud-tag absolute left-3 top-3 opacity-60 hover:opacity-100 focus-visible:opacity-100"
              >
                ESC · BACK TO DESK
              </button>
            )}

            {/* Phones: the Showcase opens full-screen instead of on the tiny 3D monitor. */}
            {mode === 'screen' && narrow && (
              <div className="absolute inset-0 z-40 w95 flex flex-col bg-[#c0c0c0] p-[3px]" role="dialog" aria-label="Showcase">
                <div className="w95-title flex items-center h-[26px] px-2 shrink-0">
                  <span className="flex-1 font-bold text-[13px] truncate">Fahad Kabir - Showcase &rsquo;26</span>
                  <button type="button" className="w95-btn w-6 h-5 flex items-center justify-center" aria-label="Close" onClick={() => sceneRef.current?.zoomOut()}>
                    <TitleGlyph kind="close" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 mt-[3px] w95-sunken p-[2px] bg-white">
                  <Showcase />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DeskDataProvider>
  )
}
