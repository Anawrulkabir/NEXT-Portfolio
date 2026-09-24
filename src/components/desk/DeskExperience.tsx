'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ArrowLeft, Monitor } from 'lucide-react'
import { DeskScene, HOTSPOT_LABEL, SCREEN_PX, type Hotspot } from './scene'
import { FahadOS } from './os/FahadOS'
import { onMotionChange, prefersReducedMotion } from '@/lib/motion'

const BIOS = [
  'FAHAD-BIOS v2.6  (C) 2022–2026 Md Anawrul Kabir Fahad',
  '',
  'CPU   : Mechanical Engineering @ CUET ........ OK',
  'GPU   : RTX 4090 × 6 × 8 GB slices (HAMi) .... OK',
  'MEM   : 300+ problems, 50+ contests .......... OK',
  'DISK  : AI Studio · TensorCode ............... OK',
  'LAB   : PINN airfoil · R455A · R1336mzz(E) ... OK',
  '',
  'Booting desk…',
]

type Mode = 'intro' | 'idle' | 'zooming' | 'screen'

/**
 * /desk mockup: the author's real desk in 3D (Henry Heffernan-style). Click
 * the monitor to fly into FahadOS; Esc or "Back to desk" flies out.
 */
export default function DeskExperience() {
  const hostRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<DeskScene | null>(null)
  const [screenEl, setScreenEl] = useState<HTMLDivElement | null>(null)
  const [booted, setBooted] = useState(false)
  const [lines, setLines] = useState(0)
  const [mode, setMode] = useState<Mode>('intro')
  const [hover, setHover] = useState<Hotspot | null>(null)

  // BIOS text types out, then waits for a click/key.
  useEffect(() => {
    if (booted) return
    const fast = prefersReducedMotion()
    const t = setInterval(() => setLines((n) => (n < BIOS.length ? n + 1 : n)), fast ? 30 : 220)
    return () => clearInterval(t)
  }, [booted])

  useEffect(() => {
    const el = document.createElement('div')
    el.style.width = `${SCREEN_PX.w}px`
    el.style.height = `${SCREEN_PX.h}px`
    setScreenEl(el)
    const scene = new DeskScene(hostRef.current!, el)
    sceneRef.current = scene
    scene.onHover = setHover
    scene.onModeChange = setMode
    scene.setReducedMotion(prefersReducedMotion())
    const off = onMotionChange(() => scene.setReducedMotion(prefersReducedMotion()))
    scene.start()
    return () => {
      off()
      scene.dispose()
    }
  }, [])

  const boot = () => {
    if (booted) return
    setBooted(true)
    sceneRef.current?.enter()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!booted && (e.key === 'Enter' || e.key === ' ')) boot()
      if (e.key === 'Escape' && mode === 'screen') sceneRef.current?.zoomOut()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="fixed inset-0 z-[70] bg-[#0b0d0c] text-parchment overflow-hidden">
      <div ref={hostRef} className="absolute inset-0" />
      {screenEl && createPortal(<FahadOS active={mode === 'screen'} onShutdown={() => sceneRef.current?.zoomOut()} />, screenEl)}

      {/* BIOS boot overlay */}
      {!booted && (
        <button
          type="button"
          onClick={boot}
          className="absolute inset-0 z-10 bg-black text-left font-mono text-[13px] md:text-[15px] text-[#c8c8c8] p-6 md:p-12 cursor-pointer"
          aria-label="Start: enter the desk"
        >
          {BIOS.slice(0, lines).map((l, i) => (
            <div key={i} className="whitespace-pre min-h-[1.4em]">
              {l}
            </div>
          ))}
          {lines >= BIOS.length && (
            <p className="mt-6 text-[#9fe0a8] bios-caret">Click or press Enter to start </p>
          )}
        </button>
      )}

      {/* Idle HUD */}
      {booted && mode === 'idle' && (
        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-3 pointer-events-none">
          <p className="text-sm bg-black/60 px-3 py-1.5 border border-parchment/30" aria-live="polite">
            {hover ? HOTSPOT_LABEL[hover] : 'Click the monitor to boot FahadOS · try the lamp, the plant, the keyboard'}
          </p>
          <button
            type="button"
            onClick={() => sceneRef.current?.zoomIn()}
            className="pointer-events-auto pixel-btn-primary pixel-frame pixel-focus inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            <Monitor className="h-4 w-4" aria-hidden="true" /> Use the computer
          </button>
        </div>
      )}

      {/* Screen HUD */}
      {mode === 'screen' && (
        <button
          type="button"
          onClick={() => sceneRef.current?.zoomOut()}
          className="absolute left-3 top-3 z-20 pixel-focus inline-flex items-center gap-1.5 bg-black/70 border border-parchment/40 px-3 py-1.5 text-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to desk <kbd className="opacity-70 text-xs">Esc</kbd>
        </button>
      )}

      {booted && mode !== 'screen' && (
        <nav className="absolute right-3 top-3 flex gap-2 text-xs">
          <Link href="/hire" className="pixel-focus bg-black/60 border border-parchment/30 px-2.5 py-1.5 hover:text-amber">
            Skip to the 1-minute brief
          </Link>
          <Link href="/" className="pixel-focus bg-black/60 border border-parchment/30 px-2.5 py-1.5 hover:text-amber">
            Classic site
          </Link>
        </nav>
      )}
    </div>
  )
}
