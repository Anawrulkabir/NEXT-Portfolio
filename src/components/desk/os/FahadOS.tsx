'use client'
/**
 * FahadOS: a Win95-style shell on the desk monitor. It renders at a fixed
 * 1280×720 CSS px inside a CSS3DObject, so it scales with the 3D screen, and
 * a CRT/glass layer sits on top so it reads as a physical screen.
 */
import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { SCREEN_PX } from '../scene'
import { glassSmudgeDataUrl } from '../textures'
import { useDesk } from '../DeskDataContext'
import { Showcase, type Page } from './Showcase'
import { CreditsApp, MinesweeperApp, TerminalApp } from './apps'
import { PixelIcon, TitleGlyph, type IconName } from './Win95'

type AppId = 'showcase' | 'terminal' | 'minesweeper' | 'credits'
type AppDef = { title: string; icon: IconName; w: number | 'auto'; h: number | 'auto'; x: number; y: number }

const TASKBAR = 30
const APPS: Record<AppId, AppDef> = {
  showcase: { title: "Fahad Kabir - Showcase '26", icon: 'showcase', w: 1120, h: 640, x: 110, y: 14 },
  terminal: { title: 'MS-DOS Prompt', icon: 'terminal', w: 660, h: 400, x: 300, y: 120 },
  minesweeper: { title: 'Minesweeper', icon: 'mine', w: 'auto', h: 'auto', x: 520, y: 150 },
  credits: { title: 'Credits.txt - Notepad', icon: 'notepad', w: 560, h: 320, x: 380, y: 200 },
}

type Win = { id: AppId; x: number; y: number; z: number; min: boolean; max: boolean }
type Power = 'on' | 'shutdown' | 'off' | 'booting'

const SHUTDOWN: [string, number][] = [
  ['Beginning shutdown sequence...', 500],
  ['Saving open windows ................ done.', 450],
  ['Closing terminal sessions .......... done.', 450],
  ['Releasing GPU slices ............... done.', 600],
  ['Asking Fahad to stop building things ', 900],
  ['........................ [FAILED]', 700],
  ['', 200],
  ['ERROR 0x26: user is still building something.', 700],
  ['Shutdown aborted. Rebooting...', 1200],
]

function Clock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])
  return <span>{now ? now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}</span>
}

export function FahadOS({
  active,
  muted,
  onToggleMute,
  onShutdown,
}: {
  active: boolean
  muted: boolean
  onToggleMute: () => void
  onShutdown: () => void
}) {
  const { profile } = useDesk()
  const [wins, setWins] = useState<Win[]>([{ id: 'showcase', ...pos('showcase'), z: 1, min: false, max: false }])
  const [showcasePage, setShowcasePage] = useState<{ page: Page; key: number }>({ page: 'home', key: 0 })
  const [start, setStart] = useState(false)
  const [power, setPower] = useState<Power>('on')
  const [log, setLog] = useState<string[]>([])
  const z = useRef(1)
  const rootRef = useRef<HTMLDivElement>(null)
  const smudge = useMemo(() => (typeof document !== 'undefined' ? glassSmudgeDataUrl() : ''), [])

  // Only interactive (and tabbable) once the camera is at the screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (active) el.removeAttribute('inert')
    else el.setAttribute('inert', '')
  }, [active])

  function pos(id: AppId) {
    return { x: APPS[id].x, y: APPS[id].y }
  }

  const focus = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++z.current, min: false } : w)))

  const open = (id: AppId) => {
    setStart(false)
    setWins((ws) => {
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, z: ++z.current, min: false } : w))
      return [...ws, { id, ...pos(id), z: ++z.current, min: false, max: false }]
    })
  }
  const openShowcase = (page: Page) => {
    setShowcasePage((s) => ({ page, key: s.key + 1 }))
    open('showcase')
  }
  const link = (href: string) => {
    setStart(false)
    window.open(href, '_blank', 'noopener')
  }
  const close = (id: AppId) => setWins((ws) => ws.filter((w) => w.id !== id))
  const minimize = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)))
  const toggleMax = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, max: !w.max, z: ++z.current } : w)))

  // Drag: pointer deltas are in screen px; the OS is scaled by CSS3D, so divide.
  const drag = (e: React.PointerEvent, id: AppId) => {
    if ((e.target as HTMLElement).closest('button')) return
    const w0 = wins.find((w) => w.id === id)!
    if (w0.max) return
    focus(id)
    const k = rootRef.current!.getBoundingClientRect().width / SCREEN_PX.w
    const sx = e.clientX
    const sy = e.clientY
    const move = (ev: PointerEvent) =>
      setWins((ws) =>
        ws.map((w) =>
          w.id === id
            ? {
                ...w,
                x: Math.max(-300, Math.min(SCREEN_PX.w - 100, w0.x + (ev.clientX - sx) / k)),
                y: Math.max(0, Math.min(SCREEN_PX.h - TASKBAR - 22, w0.y + (ev.clientY - sy) / k)),
              }
            : w
        )
      )
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const shutdown = async () => {
    setStart(false)
    setPower('shutdown')
    setLog([])
    for (const [line, wait] of SHUTDOWN) {
      await new Promise((r) => setTimeout(r, wait))
      setLog((l) => (line.startsWith('....') ? [...l.slice(0, -1), l[l.length - 1] + line] : [...l, line]))
    }
    setPower('off')
    setTimeout(onShutdown, 500)
    setTimeout(() => setPower('booting'), 2200)
    setTimeout(() => {
      setPower('on')
      setWins([])
    }, 4200)
  }

  const desktopIcons: { label: string; icon: IconName; run: () => void }[] = [
    { label: 'My Showcase', icon: 'showcase', run: () => openShowcase('home') },
    { label: 'Certificates', icon: 'folder', run: () => openShowcase('certificates') },
    { label: 'Resume.pdf', icon: 'document', run: () => link(profile.cv.view) },
    { label: 'MS-DOS Prompt', icon: 'terminal', run: () => open('terminal') },
    { label: 'Minesweeper', icon: 'mine', run: () => open('minesweeper') },
    { label: 'The Journey', icon: 'gamepad', run: () => link('/') },
    { label: 'Credits', icon: 'notepad', run: () => open('credits') },
  ]

  return (
    <div
      ref={rootRef}
      className="fahad-os w95 relative overflow-hidden select-none"
      style={{ width: SCREEN_PX.w, height: SCREEN_PX.h }}
      onPointerDown={() => start && setStart(false)}
    >
      {power === 'on' && (
        <>
          {/* Desktop icons */}
          <ul className="absolute left-2 top-2 flex flex-col gap-2.5">
            {desktopIcons.map((a) => (
              <li key={a.label}>
                <button
                  type="button"
                  onClick={a.run}
                  className="w95-icon w-[76px] flex flex-col items-center gap-1 p-1 text-white text-[11px] text-center"
                >
                  <PixelIcon name={a.icon} />
                  <span className="leading-tight px-0.5">{a.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Windows */}
          {wins.map((w) => {
            const app = APPS[w.id]
            const isTop = w.z === Math.max(...wins.filter((x) => !x.min).map((x) => x.z))
            const box = w.max
              ? { left: 0, top: 0, width: SCREEN_PX.w, height: SCREEN_PX.h - TASKBAR }
              : { left: w.x, top: w.y, width: app.w, height: app.h }
            return (
              <section
                key={w.id}
                aria-label={app.title}
                className="w95-window absolute flex flex-col p-[3px]"
                style={{ ...box, zIndex: w.z, display: w.min ? 'none' : 'flex' }}
                onPointerDown={() => focus(w.id)}
              >
                <header
                  className={`w95-title ${isTop ? '' : 'inactive'} flex items-center gap-1 h-[20px] pl-1 pr-[2px] shrink-0`}
                  onPointerDown={(e) => drag(e, w.id)}
                  onDoubleClick={() => toggleMax(w.id)}
                >
                  <span className="scale-50 -mx-2 -my-2 origin-center">
                    <PixelIcon name={app.icon} />
                  </span>
                  <span className="flex-1 truncate font-bold text-[12px] ml-1">{app.title}</span>
                  <button type="button" className="w95-btn w-4 h-[14px] flex items-center justify-center" aria-label="Minimize" onClick={() => minimize(w.id)}>
                    <TitleGlyph kind="min" />
                  </button>
                  <button type="button" className="w95-btn w-4 h-[14px] flex items-center justify-center" aria-label="Maximize" onClick={() => toggleMax(w.id)}>
                    <TitleGlyph kind="max" />
                  </button>
                  <button type="button" className="w95-btn w-4 h-[14px] ml-[2px] flex items-center justify-center" aria-label="Close" onClick={() => close(w.id)}>
                    <TitleGlyph kind="close" />
                  </button>
                </header>
                <div className="flex-1 min-h-0 mt-[2px] w95-sunken p-[2px] bg-white overflow-hidden">
                  {w.id === 'showcase' && <Showcase key={showcasePage.key} initial={showcasePage.page} />}
                  {w.id === 'terminal' && <TerminalApp />}
                  {w.id === 'minesweeper' && <MinesweeperApp />}
                  {w.id === 'credits' && <CreditsApp />}
                </div>
              </section>
            )
          })}

          {/* Start menu */}
          {start && (
            <nav aria-label="Start menu" className="w95-window absolute left-[2px] z-[999] flex p-[3px]" style={{ bottom: TASKBAR - 2 }} onPointerDown={(e) => e.stopPropagation()}>
              <div className="w-[26px] bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center pb-2">
                <span className="text-white font-bold text-[17px] [writing-mode:vertical-rl] rotate-180 tracking-wide">
                  Fahad<span className="font-normal">OS</span>
                </span>
              </div>
              <ul className="py-1 min-w-[190px]">
                {desktopIcons.map((a) => (
                  <li key={a.label}>
                    <button type="button" onClick={a.run} className="w-full flex items-center gap-2.5 pl-2 pr-6 py-1 text-[12px] hover:bg-[#000080] hover:text-white">
                      <PixelIcon name={a.icon} size={24} /> {a.label}
                    </button>
                  </li>
                ))}
                <li className="mx-1 my-1 border-t border-[#808080] border-b border-b-white" />
                <li>
                  <button type="button" onClick={shutdown} className="w-full flex items-center gap-2.5 pl-2 pr-6 py-1 text-[12px] hover:bg-[#000080] hover:text-white">
                    <PixelIcon name="speaker" size={24} /> Shut Down...
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {/* Taskbar */}
          <footer className="w95-taskbar absolute inset-x-0 bottom-0 flex items-center gap-1 px-[2px] z-[1000]" style={{ height: TASKBAR }}>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setStart((s) => !s)}
              className={`w95-btn h-[22px] px-1.5 flex items-center gap-1 font-bold text-[12px] ${start ? 'pressed' : ''}`}
              aria-expanded={start}
            >
              <PixelIcon name="showcase" size={16} /> Start
            </button>
            <span className="w-[2px] h-[22px] border-l border-[#808080] border-r border-r-white mx-0.5" aria-hidden="true" />
            <div className="flex-1 flex gap-1 overflow-hidden">
              {wins.map((w) => {
                const top = !w.min && w.z === Math.max(...wins.filter((x) => !x.min).map((x) => x.z))
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => (top ? minimize(w.id) : focus(w.id))}
                    className={`w95-btn h-[22px] px-1.5 w-[160px] flex items-center gap-1.5 text-[11px] ${top ? 'pressed font-bold' : ''}`}
                  >
                    <PixelIcon name={APPS[w.id].icon} size={16} />
                    <span className="truncate">{APPS[w.id].title}</span>
                  </button>
                )
              })}
            </div>
            <div className="w95-sunken h-[22px] px-2 flex items-center gap-2 text-[11px]">
              <button type="button" onClick={onToggleMute} aria-label={muted ? 'Unmute sounds' : 'Mute sounds'} className="flex items-center" title={muted ? 'Sound off' : 'Sound on'}>
                <span className={muted ? 'opacity-40' : ''}>
                  <PixelIcon name="speaker" size={16} />
                </span>
              </button>
              <Clock />
            </div>
          </footer>
        </>
      )}

      {power !== 'on' && (
        <div className="absolute inset-0 bg-black text-[#c8c8c8] font-mono text-[15px] leading-[1.45] p-8">
          {power === 'shutdown' && log.map((l, i) => <div key={i} className="whitespace-pre min-h-[1.45em]">{l}</div>)}
          {power === 'booting' && (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <span className="w-16 h-16 bg-white border-4 border-[#c8c8c8] text-black font-showcase font-black text-[42px] flex items-center justify-center">F</span>
              <span className="font-sans text-[20px] text-white">
                Starting Fahad<b>OS</b>...
              </span>
            </div>
          )}
        </div>
      )}

      {/* CRT + glass: scanlines, a drifting refresh band, smudges, glare, vignette. */}
      <div aria-hidden="true" className={`crt pointer-events-none absolute inset-0 z-[2000] ${power === 'off' ? 'crt-off' : ''}`}>
        <div className="crt-scan" />
        <div className="crt-band" />
        <div className="crt-smudge" style={{ backgroundImage: smudge ? `url(${smudge})` : undefined }} />
        <div className="crt-glare" />
        <div className="crt-vignette" />
      </div>
    </div>
  )
}
