'use client'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useDesk } from '../DeskDataContext'
import { useOS, type AppId } from './context'
import { AppIcon, FMark } from './icons'

/* -------------------------------------------------------------- Terminal */

const GEAR = [
  ['OS', 'fahadOS 26 (a three.js desk)'],
  ['Host', 'MacBook Air (M1, 2020)'],
  ['Display', 'HP M22f, 21.5" 1920×1080'],
  ['Keyboard', 'Royal Kludge R65'],
  ['Mouse', 'Rapoo MT760L'],
  ['Shell', 'zsh'],
] as const

export function TerminalApp() {
  const d = useDesk()
  const { open } = useOS()
  const prompt = 'fahad@MacBook-Air ~ %'
  const [lines, setLines] = useState<string[]>([`Last login: ${new Date().toDateString()} on ttys000`, "Type 'help' to see what I can do."])
  const [cmd, setCmd] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => endRef.current?.scrollIntoView({ block: 'end' }), [lines])

  const apps: Record<string, AppId> = { notes: 'notes', photos: 'photos', mail: 'mail', gpu: 'gpu', soccer: 'soccer', resume: 'preview' }

  const run = (raw: string) => {
    const [c0, ...args] = raw.trim().split(/\s+/)
    const c = (c0 ?? '').toLowerCase()
    const out: string[] = []
    const x = d.experience[0]
    switch (c) {
      case 'help':
        out.push(
          'whoami       who is this',
          'neofetch     the desk you are looking at',
          'work         where I work',
          'research     what I study',
          'projects     things I built',
          'skills       tools I use',
          'contact      how to reach me',
          'open <app>   notes · photos · mail · gpu · soccer · resume',
          'clear'
        )
        break
      case 'whoami':
        out.push(d.profile.name, d.profile.positioning, d.profile.location)
        break
      case 'neofetch':
        out.push(
          '   ____      fahad@MacBook-Air',
          '  / __/      -----------------',
          ...GEAR.map(([k, v], i) => `${[' / /_  ', '/ __/  ', '/_/    ', '       ', '       ', '       '][i]}      ${k}: ${v}`),
          `             Work: ${x.org} (AI Studio, TensorCode)`,
          `             Study: Mechanical Engineering, CUET`
        )
        break
      case 'work':
        x.roles.forEach((r) => out.push(`${r.title} @ ${x.org}  ${r.start} – ${r.end}`))
        break
      case 'research':
        d.research.forEach((r) => out.push(`[${r.status}] ${r.shortTitle}`))
        break
      case 'projects':
        d.projects.forEach((p) => out.push(`${p.title}${p.result ? `  ★ ${p.result}` : ''}`))
        break
      case 'skills':
        d.skills.forEach((g) => out.push(`${g.name}: ${g.items.join(', ')}`))
        break
      case 'contact':
        out.push(d.profile.email, ...d.profile.links.map((l) => l.href))
        break
      case 'open': {
        const app = apps[(args[0] ?? '').toLowerCase()]
        if (app) {
          open(app)
          out.push(`Opening ${args[0]}…`)
        } else out.push(`open: try one of ${Object.keys(apps).join(', ')}`)
        break
      }
      case 'ls':
        out.push('notes/  photos/  resume.pdf  soccer-bot.app  gpu-slices.app')
        break
      case 'pwd':
        out.push('/Users/fahad')
        break
      case 'sudo':
        out.push('fahad is not in the sudoers file. This incident will be reported.')
        break
      case 'clear':
        setLines([])
        return
      case '':
        break
      default:
        out.push(`zsh: command not found: ${c0}`)
    }
    setLines((l) => [...l, `${prompt} ${raw}`, ...out])
    if (raw.trim()) setHistory((h) => [...h, raw])
    setHi(-1)
  }

  return (
    <div className="h-full bg-[#1e1e1e] text-[#e6e3dc] font-mono text-[13px] leading-[1.45] p-3 overflow-auto mac-scroll" onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap min-h-[1.45em]">
          {l}
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(cmd)
          setCmd('')
        }}
        className="flex"
      >
        <span className="text-[#9fd3a8]">{prompt}&nbsp;</span>
        <input
          ref={inputRef}
          aria-label="Command"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' && history.length) {
              e.preventDefault()
              const n = hi < 0 ? history.length - 1 : Math.max(0, hi - 1)
              setHi(n)
              setCmd(history[n])
            }
          }}
          className="flex-1 bg-transparent outline-none caret-[#e6e3dc]"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      <div ref={endRef} />
    </div>
  )
}

/* ---------------------------------------------------------------- Photos */

export function PhotosApp({ focus }: { focus?: string }) {
  const d = useDesk()
  const items = [
    ...(d.profile.portrait ? [{ id: 'portrait', src: d.profile.portrait.src, alt: d.profile.portrait.alt, caption: 'Me', album: 'Me' }] : []),
    ...d.certificates.map((c) => ({ id: c.id, src: c.src, alt: c.alt, caption: c.name, album: 'Certificates' })),
    ...d.projects.flatMap((p) => p.images.map((i) => ({ id: i.id, src: i.src, alt: i.alt, caption: `${p.title}: ${i.caption}`, album: 'Projects' }))),
  ]
  const albums = ['All', 'Certificates', 'Projects', 'Me']
  const [album, setAlbum] = useState(() => (focus?.startsWith('album:') ? focus.slice(6) : 'All'))
  const [view, setView] = useState<number | null>(() => {
    const i = items.findIndex((x) => x.id === focus)
    return i >= 0 ? i : null
  })
  const shown = album === 'All' ? items : items.filter((i) => i.album === album)
  const cur = view !== null ? items[view] : null

  return (
    <div className="h-full flex text-[13px]">
      <aside className="w-[160px] bg-[#ebe8e1] border-r border-black/10 p-2">
        <p className="px-2 pb-1 text-[11px] font-semibold text-black/40">Albums</p>
        {albums.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => {
              setAlbum(a)
              setView(null)
            }}
            className={`w-full text-left rounded-md px-2 py-1 ${album === a && view === null ? 'bg-black/[0.08] font-medium' : 'hover:bg-black/[0.04]'}`}
          >
            {a}
          </button>
        ))}
      </aside>
      {cur ? (
        <div className="flex-1 flex flex-col bg-[#1c1c1e] text-white min-w-0">
          <div className="flex items-center gap-2 px-3 py-2">
            <button type="button" onClick={() => setView(null)} className="rounded-md px-2 py-0.5 hover:bg-white/10">
              ← {album}
            </button>
            <span className="flex-1 truncate text-center text-white/80">{cur.caption}</span>
            <button type="button" aria-label="Previous" onClick={() => setView((view! - 1 + items.length) % items.length)} className="rounded-md p-1 hover:bg-white/10">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Next" onClick={() => setView((view! + 1) % items.length)} className="rounded-md p-1 hover:bg-white/10">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cur.src} alt={cur.alt} className="flex-1 min-h-0 object-contain p-4" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto mac-scroll p-4 bg-[#fbfaf7]">
          <p className="text-[22px] font-bold mb-3">{album}</p>
          <div className="grid grid-cols-4 gap-1.5">
            {shown.map((it) => (
              <button key={it.id} type="button" onClick={() => setView(items.indexOf(it))} className="group relative aspect-square overflow-hidden rounded-sm bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={it.alt} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ Mail */

export function MailApp() {
  const d = useDesk()
  const [f, setF] = useState({ from: '', subject: '', body: '' })
  const send = () => {
    const body = f.from ? `${f.body}\n\n— ${f.from}` : f.body
    window.location.href = `mailto:${d.profile.email}?subject=${encodeURIComponent(f.subject || 'Hello')}&body=${encodeURIComponent(body)}`
  }
  const row = 'flex items-center gap-2 border-b border-black/10 px-4 py-2 text-[13px]'
  return (
    <form
      className="h-full flex flex-col bg-white"
      onSubmit={(e) => {
        e.preventDefault()
        send()
      }}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-[#f4f2ee] border-b border-black/10">
        <span className="text-[13px] font-semibold">New Message</span>
        <button type="submit" className="rounded-md bg-[#1f5fd6] px-3 py-1 text-[12px] font-medium text-white hover:bg-[#1a52bb]">
          Send
        </button>
      </div>
      <p className={row}>
        <span className="w-16 text-black/45">To:</span>
        <span className="rounded bg-[#1f5fd6]/10 px-1.5 text-[#1f5fd6]">{d.profile.name}</span>
      </p>
      <label className={row}>
        <span className="w-16 text-black/45">From:</span>
        <input value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} placeholder="Your name" className="flex-1 outline-none" />
      </label>
      <label className={row}>
        <span className="w-16 text-black/45">Subject:</span>
        <input value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} placeholder="Hello" className="flex-1 outline-none" />
      </label>
      <textarea
        value={f.body}
        onChange={(e) => setF({ ...f, body: e.target.value })}
        aria-label="Message"
        placeholder="Write your message…"
        className="flex-1 resize-none px-4 py-3 text-[14px] outline-none"
      />
      <p className="px-4 py-2 text-[11px] text-black/40 border-t border-black/10">Send opens your own email app with this filled in.</p>
    </form>
  )
}

/* --------------------------------------------------------------- Preview */

export function PreviewApp() {
  const { profile } = useDesk()
  return (
    <div className="h-full flex flex-col bg-[#e9e7e2]">
      <div className="flex items-center justify-between px-3 py-1.5 text-[12px] border-b border-black/10 bg-[#f4f2ee]">
        <span className="text-black/60">Résumé · updated July 2026</span>
        <a href={profile.cv.download} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 hover:bg-black/5">
          Open in a new tab <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
      <iframe title="Résumé PDF" src={`${profile.cv.download}#view=FitH&toolbar=0`} className="flex-1 w-full bg-white" />
    </div>
  )
}

/* -------------------------------------------------------- About This Mac */

export function AboutApp() {
  const { profile } = useDesk()
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#f4f2ee] px-8 text-center">
      <AppIcon id="about" size={96} />
      <p className="mt-2 text-[22px] font-semibold">MacBook Air</p>
      <p className="text-[12px] text-black/50">M1, 2020 · on a stand, next to the HP</p>
      <dl className="mt-4 grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-[12px] text-left">
        <dt className="text-right text-black/50">Chip</dt>
        <dd>Apple M1</dd>
        <dt className="text-right text-black/50">Display</dt>
        <dd>HP M22f, 21.5&Prime; (1920 × 1080)</dd>
        <dt className="text-right text-black/50">Keyboard</dt>
        <dd>Royal Kludge R65</dd>
        <dt className="text-right text-black/50">Mouse</dt>
        <dd>Rapoo MT760L</dd>
        <dt className="text-right text-black/50">Owner</dt>
        <dd>{profile.name}</dd>
        <dt className="text-right text-black/50">Software</dt>
        <dd className="inline-flex items-center gap-1">
          <FMark size={13} /> fahadOS 26
        </dd>
      </dl>
      <p className="mt-5 max-w-[300px] text-[10.5px] leading-snug text-black/40">
        Inspired by{' '}
        <a href="https://henryheffernan.com" target="_blank" rel="noopener noreferrer" className="underline">
          henryheffernan.com
        </a>
        . Emoji from Noto Color Emoji by Google (Apache 2.0).
      </p>
    </div>
  )
}
