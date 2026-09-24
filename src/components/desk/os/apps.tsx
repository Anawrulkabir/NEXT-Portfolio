'use client'
/**
 * Small FahadOS programs: an MS-DOS prompt, Minesweeper, and the credits.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDesk } from '../DeskDataContext'
import { Btn } from './Win95'

/* -------------------------------------------------------------- terminal */

export function TerminalApp() {
  const d = useDesk()
  const [lines, setLines] = useState<string[]>([
    'FahadOS [Version 26.0]',
    '(C) Copyright 2026 Md Anawrul Kabir Fahad.',
    '',
    'Type HELP for a list of commands.',
    '',
  ])
  const [cmd, setCmd] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => endRef.current?.scrollIntoView({ block: 'end' }), [lines])

  const run = (raw: string) => {
    const c = raw.trim().toLowerCase()
    const out: string[] = []
    const x = d.experience[0]
    switch (c) {
      case 'help':
        out.push('WHOAMI      Who is this?', 'EXPERIENCE  Where I work', 'RESEARCH    What I study', 'SKILLS      What I use', 'PROJECTS    What I built', 'CONTACT     How to reach me', 'CLS         Clear the screen')
        break
      case 'whoami':
        out.push(`${d.profile.name}`, d.profile.positioning, d.profile.location)
        break
      case 'experience':
        x.roles.forEach((r) => out.push(`${r.title} @ ${x.org}  (${r.start} – ${r.end})`))
        break
      case 'research':
        d.research.forEach((r) => out.push(`[${r.status}] ${r.shortTitle}`))
        break
      case 'skills':
        d.skills.forEach((g) => out.push(`${g.name.toUpperCase()}: ${g.items.join(', ')}`))
        break
      case 'projects':
        d.projects.forEach((p) => out.push(`  ${p.title}`))
        break
      case 'contact':
        out.push(d.profile.email, ...d.profile.links.map((l) => l.href))
        break
      case 'cls':
        setLines([])
        return
      case '':
        break
      default:
        out.push(`Bad command or file name: ${raw.trim()}`)
    }
    setLines((l) => [...l, `C:\\FAHAD>${raw}`, ...out, ''])
  }

  return (
    <div
      className="h-full bg-black text-[#c0c0c0] font-mono text-[14px] leading-[1.35] p-2 overflow-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap min-h-[1.35em]">
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
        <span>C:\FAHAD&gt;</span>
        <input
          ref={inputRef}
          aria-label="Command"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[#c0c0c0] caret-[#c0c0c0]"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      <div ref={endRef} />
    </div>
  )
}

/* ----------------------------------------------------------- minesweeper */

const W = 9
const H = 9
const MINES = 10
type Cell = { mine: boolean; open: boolean; flag: boolean; n: number }
const NUM_COLORS = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080']

function fresh(): Cell[] {
  return Array.from({ length: W * H }, () => ({ mine: false, open: false, flag: false, n: 0 }))
}
const around = (i: number) => {
  const x = i % W
  const y = Math.floor(i / W)
  const r: number[] = []
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && ny >= 0 && nx < W && ny < H) r.push(ny * W + nx)
    }
  return r
}

function Lcd({ value }: { value: number }) {
  const s = String(Math.max(-99, Math.min(999, value))).padStart(3, '0')
  return (
    <span className="w95-sunken bg-black text-[#ff2a1a] font-mono text-[22px] leading-none px-1 py-0.5 tracking-[0.08em] tabular-nums">
      {s}
    </span>
  )
}

export function MinesweeperApp() {
  const [cells, setCells] = useState<Cell[]>(fresh)
  const [state, setState] = useState<'ready' | 'play' | 'won' | 'lost'>('ready')
  const [time, setTime] = useState(0)
  const [pressing, setPressing] = useState(false)

  useEffect(() => {
    if (state !== 'play') return
    const t = setInterval(() => setTime((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [state])

  const reset = () => {
    setCells(fresh())
    setState('ready')
    setTime(0)
  }

  const reveal = useCallback(
    (i: number) => {
      if (state === 'won' || state === 'lost') return
      let board = cells.map((c) => ({ ...c }))
      if (state === 'ready') {
        // First click is always safe.
        const banned = new Set([i, ...around(i)])
        let placed = 0
        while (placed < MINES) {
          const k = Math.floor(Math.random() * W * H)
          if (banned.has(k) || board[k].mine) continue
          board[k].mine = true
          placed++
        }
        board = board.map((c, k) => ({ ...c, n: around(k).filter((a) => board[a].mine).length }))
        setState('play')
      }
      const c = board[i]
      if (c.flag || c.open) return
      if (c.mine) {
        board.forEach((b) => b.mine && (b.open = true))
        c.n = -1 // the one that went off
        setCells(board)
        setState('lost')
        return
      }
      const stack = [i]
      while (stack.length) {
        const k = stack.pop()!
        const b = board[k]
        if (b.open || b.flag) continue
        b.open = true
        if (b.n === 0) stack.push(...around(k))
      }
      setCells(board)
      if (board.filter((b) => !b.open).length === MINES) setState('won')
    },
    [cells, state]
  )

  const flag = (i: number) => {
    if (state === 'won' || state === 'lost' || cells[i].open) return
    setCells((cs) => cs.map((c, k) => (k === i ? { ...c, flag: !c.flag } : c)))
  }

  const face = state === 'lost' ? '😵' : state === 'won' ? '😎' : pressing ? '😮' : '🙂'
  const flags = cells.filter((c) => c.flag).length

  return (
    <div className="p-2 bg-[#c0c0c0] select-none inline-block">
      <div className="w95-sunken p-1.5 flex items-center justify-between mb-2">
        <Lcd value={MINES - flags} />
        <Btn className="w-8 h-8 text-[18px] leading-none" onClick={reset} aria-label="New game">
          {face}
        </Btn>
        <Lcd value={time} />
      </div>
      <div
        className="w95-sunken p-[3px] grid"
        style={{ gridTemplateColumns: `repeat(${W}, 24px)` }}
        onPointerDown={() => setPressing(true)}
        onPointerUp={() => setPressing(false)}
        onPointerLeave={() => setPressing(false)}
      >
        {cells.map((c, i) => (
          <button
            key={i}
            type="button"
            aria-label={c.open ? (c.mine ? 'Mine' : `${c.n}`) : c.flag ? 'Flagged' : 'Hidden'}
            className={`w-6 h-6 flex items-center justify-center text-[15px] font-bold leading-none ${
              c.open ? `border-l border-t border-[#808080] ${c.n === -1 ? 'bg-[#ff0000]' : 'bg-[#c0c0c0]'}` : 'w95-cell'
            }`}
            style={{ color: c.open && c.n > 0 ? NUM_COLORS[c.n] : undefined }}
            onClick={() => reveal(i)}
            onContextMenu={(e) => {
              e.preventDefault()
              flag(i)
            }}
          >
            {c.open ? (c.mine ? '●' : c.n > 0 ? c.n : '') : c.flag ? <span className="text-[#ff0000]">⚑</span> : ''}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px]">
        {state === 'won' ? 'You win! Nice sweeping.' : state === 'lost' ? 'Boom. Click the face to try again.' : 'Right-click to flag a mine.'}
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------- credits */

export function CreditsApp() {
  const { profile } = useDesk()
  return (
    <div className="p-4 text-[13px] leading-relaxed bg-white h-full overflow-auto font-mono">
      <p className="font-bold">CREDITS.TXT</p>
      <p className="mt-3">Design &amp; code ........ {profile.name}</p>
      <p>3D desk ............... modelled in code after my real desk</p>
      <p>Rendering ............. three.js (WebGL + CSS3D)</p>
      <p>Framework ............. Next.js</p>
      <p>Sounds ................ synthesised live with WebAudio</p>
      <p>Type .................. Fraunces, IBM Plex</p>
      <p className="mt-3">
        Inspired by Henry Heffernan&rsquo;s wonderful portfolio,{' '}
        <a href="https://henryheffernan.com" target="_blank" rel="noopener noreferrer" className="underline text-[#0000ee]">
          henryheffernan.com
        </a>
        .
      </p>
      <p className="mt-3">Thanks for visiting!</p>
    </div>
  )
}
