'use client'
/**
 * FahadOS — the operating system on the desk monitor (a Win95-style shell in
 * the site's own palette). It renders at a fixed 1280×740 CSS px inside a
 * CSS3DObject, so it scales with the 3D screen.
 */
import { useEffect, useRef, useState, type ComponentType } from 'react'
import {
  Award,
  Briefcase,
  FileText,
  FlaskConical,
  FolderGit2,
  Gamepad2,
  Mail,
  Minus,
  Power,
  Terminal,
  User,
  Wrench,
  X,
  Sparkles,
} from 'lucide-react'
import { profile } from '@/content'
import { SCREEN_PX } from '../scene'
import {
  AboutApp,
  CertificatesApp,
  ContactApp,
  ExperienceApp,
  ProjectsApp,
  ResearchApp,
  SkillsApp,
  TerminalApp,
  WelcomeApp,
} from './apps'

type AppDef = {
  id: string
  title: string
  icon: ComponentType<{ className?: string }>
  color: string
  w: number
  h: number
  href?: string // opens a page instead of a window
  body?: ComponentType<{ open: (id: string) => void }>
}

const APPS: AppDef[] = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles, color: '#e0a23c', w: 560, h: 330, body: WelcomeApp },
  { id: 'about', title: 'About me', icon: User, color: '#6fb7b9', w: 680, h: 420, body: AboutApp },
  { id: 'experience', title: 'Experience', icon: Briefcase, color: '#4f7a4a', w: 760, h: 520, body: ExperienceApp },
  { id: 'projects', title: 'Projects', icon: FolderGit2, color: '#9a7b4f', w: 760, h: 460, body: ProjectsApp },
  { id: 'research', title: 'Research', icon: FlaskConical, color: '#a9c4d9', w: 640, h: 500, body: ResearchApp },
  { id: 'certificates', title: 'Certificates', icon: Award, color: '#cbb26a', w: 800, h: 500, body: CertificatesApp },
  { id: 'skills', title: 'Skills', icon: Wrench, color: '#8fa3a8', w: 720, h: 460, body: SkillsApp },
  { id: 'terminal', title: 'Terminal', icon: Terminal, color: '#1d3436', w: 620, h: 360, body: TerminalApp },
  { id: 'contact', title: 'Contact', icon: Mail, color: '#c9663a', w: 460, h: 300, body: ContactApp },
  { id: 'resume', title: 'Resume.pdf', icon: FileText, color: '#e7e1d1', w: 0, h: 0, href: '/cv' },
  { id: 'journey', title: 'The Journey (game)', icon: Gamepad2, color: '#b5523a', w: 0, h: 0, href: '/' },
]
const byId = Object.fromEntries(APPS.map((a) => [a.id, a]))

type Win = { id: string; x: number; y: number; z: number; min: boolean }

function Clock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 20_000)
    return () => clearInterval(t)
  }, [])
  return <span>{now ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
}

export function FahadOS({ onShutdown, active }: { onShutdown: () => void; active: boolean }) {
  const [wins, setWins] = useState<Win[]>([{ id: 'welcome', x: 360, y: 90, z: 1, min: false }])
  const [start, setStart] = useState(false)
  const z = useRef(1)
  const rootRef = useRef<HTMLDivElement>(null)

  const focus = (id: string) =>
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++z.current, min: false } : w)))

  const open = (id: string) => {
    const app = byId[id]
    setStart(false)
    if (app.href) {
      window.open(app.href, '_blank')
      return
    }
    setWins((ws) => {
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, z: ++z.current, min: false } : w))
      const n = ws.length
      return [...ws, { id, x: 190 + n * 34, y: 40 + n * 28, z: ++z.current, min: false }]
    })
  }
  const close = (id: string) => setWins((ws) => ws.filter((w) => w.id !== id))
  const minimize = (id: string) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)))

  // Drag: pointer deltas are in screen px; the OS is scaled by CSS3D, so divide.
  const drag = (e: React.PointerEvent, id: string) => {
    if ((e.target as HTMLElement).closest('button')) return
    focus(id)
    const root = rootRef.current!
    const k = root.getBoundingClientRect().width / SCREEN_PX.w
    const w0 = wins.find((w) => w.id === id)!
    const sx = e.clientX
    const sy = e.clientY
    const move = (ev: PointerEvent) =>
      setWins((ws) =>
        ws.map((w) =>
          w.id === id
            ? {
                ...w,
                x: Math.max(-200, Math.min(SCREEN_PX.w - 120, w0.x + (ev.clientX - sx) / k)),
                y: Math.max(0, Math.min(SCREEN_PX.h - 90, w0.y + (ev.clientY - sy) / k)),
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

  return (
    <div
      ref={rootRef}
      className="fahad-os relative overflow-hidden select-none"
      style={{ width: SCREEN_PX.w, height: SCREEN_PX.h }}
      aria-hidden={active ? undefined : true}
      // The OS is only interactive once the camera is at the screen.
      {...(!active ? { tabIndex: -1 } : {})}
    >
      {/* Desktop icons */}
      <ul className="absolute left-4 top-4 grid grid-flow-col grid-rows-6 gap-x-2 gap-y-1">
        {APPS.filter((a) => a.id !== 'welcome').map((a) => (
          <li key={a.id}>
            <button
              type="button"
              tabIndex={active ? 0 : -1}
              onClick={() => open(a.id)}
              className="os-icon w-24 flex flex-col items-center gap-1 p-1.5 text-white text-[13px] text-center"
            >
              <span className="w-12 h-12 flex items-center justify-center os-bevel" style={{ background: a.color }}>
                <a.icon className="w-7 h-7 text-[#101412]" aria-hidden="true" />
              </span>
              <span className="leading-tight drop-shadow-[1px_1px_0_#000]">{a.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Watermark */}
      <div className="absolute right-10 bottom-20 text-right text-white/25 pointer-events-none">
        <p className="font-display text-7xl">FahadOS</p>
        <p className="text-lg">{profile.positioning}</p>
      </div>

      {/* Windows */}
      {wins.map((w) => {
        const app = byId[w.id]
        const Body = app.body!
        return (
          <section
            key={w.id}
            aria-label={app.title}
            className="os-window absolute flex flex-col"
            style={{ left: w.x, top: w.y, width: app.w, height: app.h, zIndex: w.z, display: w.min ? 'none' : 'flex' }}
            onPointerDown={() => focus(w.id)}
          >
            <header
              className="os-titlebar flex items-center gap-2 px-2 h-8 shrink-0 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => drag(e, w.id)}
            >
              <app.icon className="w-4 h-4" aria-hidden="true" />
              <span className="font-display text-sm flex-1 truncate">{app.title}</span>
              <button type="button" tabIndex={active ? 0 : -1} className="os-btn w-6 h-5 flex items-center justify-center" aria-label="Minimize" onClick={() => minimize(w.id)}>
                <Minus className="w-3 h-3" />
              </button>
              <button type="button" tabIndex={active ? 0 : -1} className="os-btn w-6 h-5 flex items-center justify-center" aria-label="Close" onClick={() => close(w.id)}>
                <X className="w-3 h-3" />
              </button>
            </header>
            <div className="flex-1 min-h-0 overflow-auto bg-[#f4f1e8] text-[#1e211d] m-1 os-inset">
              <Body open={open} />
            </div>
          </section>
        )
      })}

      {/* Start menu */}
      {start && (
        <nav aria-label="Start menu" className="os-window absolute left-1 bottom-11 w-64 z-[999] flex">
          <div className="w-9 bg-gradient-to-t from-[#2f4a34] to-[#4f7a4a] text-white font-display text-lg [writing-mode:vertical-rl] rotate-180 flex items-center justify-start p-1">
            FahadOS
          </div>
          <ul className="flex-1 py-1">
            {APPS.map((a) => (
              <li key={a.id}>
                <button type="button" onClick={() => open(a.id)} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-[#2f4a34] hover:text-white">
                  <a.icon className="w-4 h-4" aria-hidden="true" /> {a.title}
                </button>
              </li>
            ))}
            <li className="border-t border-[#8a8a8a] mt-1 pt-1">
              <button type="button" onClick={onShutdown} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-[#2f4a34] hover:text-white">
                <Power className="w-4 h-4" aria-hidden="true" /> Shut down (back to desk)
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Taskbar */}
      <footer className="os-taskbar absolute inset-x-0 bottom-0 h-10 flex items-center gap-1.5 px-1.5 z-[1000]">
        <button
          type="button"
          tabIndex={active ? 0 : -1}
          onClick={() => setStart((s) => !s)}
          className="os-btn h-8 px-3 flex items-center gap-1.5 font-display text-sm"
          aria-expanded={start}
        >
          <span className="w-4 h-4 bg-[#4f7a4a] inline-block" aria-hidden="true" /> Start
        </button>
        <div className="flex-1 flex gap-1 overflow-hidden">
          {wins.map((w) => {
            const app = byId[w.id]
            return (
              <button
                key={w.id}
                type="button"
                tabIndex={active ? 0 : -1}
                onClick={() => focus(w.id)}
                className={`h-8 px-2 w-40 flex items-center gap-1.5 text-xs truncate ${w.min ? 'os-btn' : 'os-inset bg-[#e6e1d3]'}`}
              >
                <app.icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> {app.title}
              </button>
            )
          })}
        </div>
        <div className="os-inset h-8 px-3 flex items-center text-xs">
          <Clock />
        </div>
      </footer>
    </div>
  )
}
