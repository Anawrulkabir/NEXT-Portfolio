'use client'
/**
 * fahadOS: a macOS-style desktop for the HP M22f on the desk. Rendered at a
 * fixed 1280×720 CSS px inside a CSS3DObject, so it scales with the 3D
 * screen. Notes carries the stories; the other apps are ways to poke at them.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Volume2, VolumeX, Wifi } from 'lucide-react'
import { SCREEN_PX } from '../scene'
import { glassSmudgeDataUrl } from '../textures'
import { OSProvider, type AppId } from './context'
import { AppIcon, FMark, type IconId } from './icons'
import { NotesApp } from './Notes'
import { AboutApp, MailApp, PhotosApp, PreviewApp, TerminalApp } from './apps'
import { StudioApp } from './studio/StudioApp'
import { SoccerBotApp } from './soccer/SoccerBotApp'

const MENU = 25
const DOCK = 78

type Def = { name: string; icon: IconId; w: number; h: number; x: number; y: number; dark?: boolean }
const APPS: Record<AppId, Def> = {
  notes: { name: 'Notes', icon: 'notes', w: 990, h: 580, x: 90, y: 42 },
  photos: { name: 'Photos', icon: 'photos', w: 860, h: 540, x: 210, y: 60 },
  gpu: { name: 'AI Studio', icon: 'gpu', w: 1100, h: 615, x: 90, y: 28, dark: true },
  soccer: { name: 'Soccer Bot', icon: 'soccer', w: 1080, h: 610, x: 100, y: 30, dark: true },
  terminal: { name: 'Terminal', icon: 'terminal', w: 660, h: 410, x: 330, y: 140, dark: true },
  mail: { name: 'Mail', icon: 'mail', w: 620, h: 470, x: 360, y: 100 },
  preview: { name: 'Résumé.pdf', icon: 'preview', w: 620, h: 600, x: 330, y: 38 },
  about: { name: 'About This Mac', icon: 'about', w: 400, h: 400, x: 440, y: 110 },
}
const DOCK_APPS: AppId[] = ['notes', 'photos', 'gpu', 'soccer', 'terminal', 'mail']

type Win = { id: AppId; x: number; y: number; z: number; min: boolean; max: boolean; arg?: string; key: number }
type Power = 'on' | 'off' | 'booting'

function useNow(ms: number) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

const TODO = ['Build the Soccer Bot, then score', 'Launch a notebook in AI Studio', 'Type neofetch in Terminal', 'Press a key on your real keyboard']

export function MacOS({
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
  const [wins, setWins] = useState<Win[]>([{ id: 'notes', ...pos('notes'), z: 1, min: false, max: false, key: 0 }])
  const [note, setNote] = useState('read-me')
  const [menu, setMenu] = useState(false)
  const [dialog, setDialog] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [power, setPower] = useState<Power>('on')
  const [done, setDone] = useState<Set<number>>(new Set())
  const z = useRef(1)
  const rootRef = useRef<HTMLDivElement>(null)
  const now = useNow(15_000)
  const smudge = useMemo(() => (typeof document !== 'undefined' ? glassSmudgeDataUrl() : ''), [])

  function pos(id: AppId) {
    return { x: APPS[id].x, y: APPS[id].y }
  }

  // Only interactive (and tabbable) once the camera is at the screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (active) el.removeAttribute('inert')
    else el.setAttribute('inert', '')
  }, [active])

  useEffect(() => {
    if (!dialog) return
    setCountdown(60)
    const t = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [dialog])

  const top = wins.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]

  const focus = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++z.current, min: false } : w)))
  const open = (id: AppId, arg?: string) => {
    setMenu(false)
    if (id === 'notes' && arg) setNote(arg)
    setWins((ws) => {
      const has = ws.find((w) => w.id === id)
      if (has) return ws.map((w) => (w.id === id ? { ...w, z: ++z.current, min: false, ...(arg && id !== 'notes' ? { arg, key: w.key + 1 } : {}) } : w))
      return [...ws, { id, ...pos(id), z: ++z.current, min: false, max: false, arg, key: 0 }]
    })
  }
  const close = (id: AppId) => setWins((ws) => ws.filter((w) => w.id !== id))
  const minimize = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)))
  const zoom = (id: AppId) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, max: !w.max, z: ++z.current } : w)))

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
                x: Math.max(-APPS[id].w + 120, Math.min(SCREEN_PX.w - 120, w0.x + (ev.clientX - sx) / k)),
                y: Math.max(MENU, Math.min(SCREEN_PX.h - DOCK - 30, w0.y + (ev.clientY - sy) / k)),
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

  const shutDown = () => {
    setDialog(false)
    setMenu(false)
    setPower('off')
    setTimeout(onShutdown, 700)
    setTimeout(() => setPower('booting'), 2600)
    setTimeout(() => {
      setWins([{ id: 'notes', ...pos('notes'), z: ++z.current, min: false, max: false, key: 0 }])
      setNote('read-me')
      setPower('on')
    }, 5200)
  }
  useEffect(() => {
    if (dialog && countdown === 0) shutDown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, dialog])

  const body = (w: Win): JSX.Element => {
    switch (w.id) {
      case 'notes':
        return <NotesApp selected={note} onSelect={setNote} />
      case 'photos':
        return <PhotosApp key={w.key} focus={w.arg} />
      case 'gpu':
        return <StudioApp />
      case 'soccer':
        return <SoccerBotApp />
      case 'terminal':
        return <TerminalApp />
      case 'mail':
        return <MailApp />
      case 'preview':
        return <PreviewApp />
      case 'about':
        return <AboutApp />
    }
  }

  const icons: { label: string; icon: IconId; run: () => void }[] = [
    { label: 'Résumé.pdf', icon: 'preview', run: () => open('preview') },
    { label: 'Certificates', icon: 'folder', run: () => open('photos', 'album:Certificates') },
    { label: 'thesis-notes', icon: 'notes', run: () => open('notes', 'thesis') },
  ]

  const clock = now
    ? `${now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}  ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : ''

  return (
    <OSProvider value={{ open }}>
      <div
        ref={rootRef}
        className="fahad-mac relative overflow-hidden select-none"
        style={{ width: SCREEN_PX.w, height: SCREEN_PX.h }}
        onPointerDown={() => menu && setMenu(false)}
      >
        {power === 'on' && (
          <>
            {/* Menu bar */}
            <header className="mac-menubar absolute inset-x-0 top-0 z-[1500] flex items-center gap-4 px-3 text-[13px]" style={{ height: MENU }}>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setMenu((m) => !m)}
                aria-expanded={menu}
                aria-label="fahadOS menu"
                className={`-mx-1 rounded px-1.5 ${menu ? 'bg-black/10' : ''}`}
              >
                <FMark size={17} />
              </button>
              <span className="font-semibold">{top ? APPS[top.id].name : 'Finder'}</span>
              {['File', 'Edit', 'View', 'Window', 'Help'].map((m) => (
                <span key={m} className="text-black/85">
                  {m}
                </span>
              ))}
              <span className="flex-1" />
              <button type="button" onClick={onToggleMute} aria-label={muted ? 'Turn sound on' : 'Turn sound off'} className="opacity-80 hover:opacity-100">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <Wifi className="h-4 w-4 opacity-80" aria-hidden="true" />
              <span aria-hidden="true" className="flex items-center gap-0.5 opacity-80">
                <span className="relative h-[11px] w-[22px] rounded-[3px] border border-black/70 p-[1.5px]">
                  <span className="block h-full w-[80%] rounded-[1px] bg-black/80" />
                </span>
                <span className="h-[4px] w-[1.5px] rounded-r bg-black/60" />
              </span>
              <span className="tabular-nums">{clock}</span>
            </header>

            {menu && (
              <nav
                aria-label="fahadOS"
                onPointerDown={(e) => e.stopPropagation()}
                className="mac-menu absolute left-2 z-[1600] w-[230px] py-1 text-[13px]"
                style={{ top: MENU + 2 }}
              >
                <button type="button" className="mac-menu-item" onClick={() => open('about')}>
                  About This Mac
                </button>
                <hr className="my-1 border-black/10" />
                <button type="button" className="mac-menu-item" onClick={() => open('preview')}>
                  Open Résumé
                </button>
                <button type="button" className="mac-menu-item" onClick={() => open('mail')}>
                  Write to Fahad…
                </button>
                <hr className="my-1 border-black/10" />
                <button
                  type="button"
                  className="mac-menu-item"
                  onClick={() => {
                    setMenu(false)
                    setDialog(true)
                  }}
                >
                  Shut Down…
                </button>
              </nav>
            )}

            {/* Desktop icons, top right like a real Mac */}
            <ul className="absolute right-4 flex flex-col items-center gap-3" style={{ top: MENU + 14 }}>
              {icons.map((a) => (
                <li key={a.label}>
                  <button type="button" onClick={a.run} className="mac-desk-icon flex w-[84px] flex-col items-center gap-1 rounded-md p-1.5 text-[12px] text-white">
                    <AppIcon id={a.icon} size={50} />
                    <span className="rounded px-1 leading-tight">{a.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Sticky note */}
            <div className="mac-sticky absolute right-3 w-[164px] rotate-[1.5deg] p-2.5 pt-2" style={{ top: MENU + 330 }}>
              <p className="font-hand text-[21px] leading-none mb-1.5">things to try</p>
              <ul className="space-y-1 text-[12px] leading-snug">
                {TODO.map((t, i) => (
                  <li key={t}>
                    <button
                      type="button"
                      onClick={() => setDone((d) => new Set(d.has(i) ? [...d].filter((x) => x !== i) : [...d, i]))}
                      className={`flex items-start gap-1.5 text-left ${done.has(i) ? 'line-through opacity-50' : ''}`}
                    >
                      <span aria-hidden="true" className="mt-[3px] inline-block h-3 w-3 shrink-0 rounded-[3px] border border-black/40 text-[9px] leading-[10px] text-center">
                        {done.has(i) ? '✓' : ''}
                      </span>
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Windows */}
            {wins.map((w) => {
              const app = APPS[w.id]
              const isTop = top?.id === w.id
              const box = w.max
                ? { left: 0, top: MENU, width: SCREEN_PX.w, height: SCREEN_PX.h - MENU - DOCK }
                : { left: w.x, top: w.y, width: app.w, height: app.h }
              return (
                <section
                  key={w.id}
                  aria-label={app.name}
                  className={`mac-window absolute flex flex-col ${isTop ? 'is-top' : ''} ${app.dark ? 'is-dark' : ''}`}
                  style={{ ...box, zIndex: w.z, display: w.min ? 'none' : 'flex' }}
                  onPointerDown={() => focus(w.id)}
                >
                  <header className="mac-titlebar relative flex h-[30px] shrink-0 items-center px-3" onPointerDown={(e) => drag(e, w.id)} onDoubleClick={() => zoom(w.id)}>
                    <span className="mac-lights flex gap-2">
                      <button type="button" aria-label="Close" className="mac-light bg-[#ff5f57]" onClick={() => close(w.id)} />
                      <button type="button" aria-label="Minimize" className="mac-light bg-[#febc2e]" onClick={() => minimize(w.id)} />
                      <button type="button" aria-label="Zoom" className="mac-light bg-[#28c840]" onClick={() => zoom(w.id)} />
                    </span>
                    <span className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold opacity-80">{app.name}</span>
                  </header>
                  <div className="min-h-0 flex-1 overflow-hidden rounded-b-[11px]">{body(w)}</div>
                </section>
              )
            })}

            {/* Dock */}
            <nav aria-label="Dock" className="absolute inset-x-0 bottom-2 z-[1400] flex justify-center">
              <ul className="mac-dock flex items-end gap-2 px-2.5 pb-1.5 pt-1.5">
                {DOCK_APPS.map((id) => (
                  <DockItem key={id} label={APPS[id].name} icon={APPS[id].icon} running={wins.some((w) => w.id === id)} onClick={() => (top?.id === id ? minimize(id) : open(id))} />
                ))}
                <li aria-hidden="true" className="mx-1 h-11 w-px self-center bg-black/15" />
                <DockItem label="Résumé.pdf" icon="preview" running={wins.some((w) => w.id === 'preview')} onClick={() => open('preview')} />
              </ul>
            </nav>

            {/* Shut down dialog */}
            {dialog && (
              <div className="absolute inset-0 z-[1700] flex items-center justify-center bg-black/10">
                <div role="alertdialog" aria-label="Shut down" className="mac-dialog w-[300px] p-5 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#23392a] text-[#efe6d6]">
                    <FMark size={36} />
                  </div>
                  <p className="mt-3 text-[14px] font-semibold">Are you sure you want to shut down your computer now?</p>
                  <p className="mt-1 text-[12px] text-black/60">If you do nothing, it will shut down in {countdown} seconds.</p>
                  <div className="mt-4 flex gap-2">
                    <button type="button" className="flex-1 rounded-md bg-black/[0.07] py-1.5 text-[13px] hover:bg-black/10" onClick={() => setDialog(false)}>
                      Cancel
                    </button>
                    <button type="button" autoFocus className="flex-1 rounded-md bg-[#1f5fd6] py-1.5 text-[13px] font-medium text-white hover:bg-[#1a52bb]" onClick={shutDown}>
                      Shut Down
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {power !== 'on' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
            {power === 'booting' && (
              <>
                <FMark size={70} color="#f2f0ea" />
                <div className="mt-8 h-[5px] w-[200px] overflow-hidden rounded-full bg-white/20">
                  <div className="mac-bootbar h-full rounded-full bg-[#f2f0ea]" />
                </div>
              </>
            )}
          </div>
        )}

        {/* LCD glass: a soft glare and a little dust. No scanlines; this is an IPS panel. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2000]">
          <div className="lcd-glare absolute inset-0" />
          <div className="absolute inset-0 opacity-[0.07] mix-blend-screen" style={{ backgroundImage: smudge ? `url(${smudge})` : undefined, backgroundSize: 'cover' }} />
        </div>
      </div>
    </OSProvider>
  )
}

function DockItem({ label, icon, running, onClick }: { label: string; icon: IconId; running: boolean; onClick: () => void }) {
  return (
    <li className="group relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-[#2b2b2b]/90 px-2 py-0.5 text-[12px] text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>
      <button type="button" onClick={onClick} aria-label={label} className="origin-bottom transition-transform duration-150 group-hover:-translate-y-2 group-hover:scale-[1.28]">
        <AppIcon id={icon} size={52} />
      </button>
      <span aria-hidden="true" className={`mt-0.5 h-1 w-1 rounded-full ${running ? 'bg-black/70' : 'bg-transparent'}`} />
    </li>
  )
}

