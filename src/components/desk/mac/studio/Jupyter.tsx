'use client'
/** A JupyterLab-style notebook for the demo session. Edit a cell, Shift+Enter to run. */
import { useRef, useState } from 'react'
import { FileText, Play, Plus } from 'lucide-react'
import { newEnv, runCell, type Spec } from './kernel'

type Cell = { id: number; kind: 'md' | 'code'; src: string; out?: string; err?: boolean; n?: number; busy?: boolean }

const START = (spec: Spec): Omit<Cell, 'id'>[] => [
  {
    kind: 'md',
    src: `# Your AI Studio session\nA demo notebook that runs in your browser. Edit any cell and press Shift+Enter.\n${spec.gpu ? 'You have one 8 GB slice of an RTX 4090.' : 'This session has no GPU.'}`,
  },
  { kind: 'code', src: 'import torch\ntorch.cuda.is_available(), torch.cuda.get_device_name(0)' },
  { kind: 'code', src: '!nvidia-smi' },
  { kind: 'code', src: 'x = torch.randn(4096, 4096, device="cuda")\n(x @ x).shape' },
  { kind: 'code', src: '# your turn: try some maths\nslices = 6\nprint("8 GB slices per card:", slices)' },
]

function Markdown({ src }: { src: string }) {
  return (
    <div className="space-y-1.5 py-1">
      {src.split('\n').map((l, i) =>
        l.startsWith('# ') ? (
          <h2 key={i} className="text-[20px] font-bold">
            {l.slice(2)}
          </h2>
        ) : (
          <p key={i}>{l}</p>
        )
      )}
    </div>
  )
}

export function Jupyter({ spec }: { spec: Spec }) {
  const nextId = useRef(0)
  const [cells, setCells] = useState<Cell[]>(() => START(spec).map((c) => ({ ...c, id: nextId.current++ })))
  const [active, setActive] = useState(1)
  const env = useRef(newEnv())
  const count = useRef(0)
  const refs = useRef(new Map<number, HTMLTextAreaElement>())

  const run = (id: number, advance = true) => {
    const idx = cells.findIndex((c) => c.id === id)
    const cell = cells[idx]
    if (!cell) return
    if (cell.kind === 'md') {
      if (advance) setActive(cells[idx + 1]?.id ?? id)
      return
    }
    setCells((cs) => cs.map((c) => (c.id === id ? { ...c, busy: true } : c)))
    setTimeout(() => {
      const r = runCell(cell.src, env.current, spec)
      const n = ++count.current
      setCells((cs) => cs.map((c) => (c.id === id ? { ...c, busy: false, out: r.out, err: r.error, n } : c)))
    }, 350)
    if (advance) {
      const next = cells[idx + 1]
      if (next) {
        setActive(next.id)
        setTimeout(() => refs.current.get(next.id)?.focus(), 0)
      } else addCell()
    }
  }

  const addCell = () => {
    const id = nextId.current++
    setCells((cs) => [...cs, { id, kind: 'code', src: '' }])
    setActive(id)
    setTimeout(() => refs.current.get(id)?.focus(), 0)
  }

  const runAll = async () => {
    for (const c of cells) {
      if (c.kind !== 'code') continue
      run(c.id, false)
      await new Promise((r) => setTimeout(r, 380))
    }
  }

  return (
    <div className="flex h-full min-h-0 bg-white text-[#1f1f1f]">
      <aside className="hidden w-[170px] shrink-0 border-r border-black/10 bg-[#f7f7f7] p-2 text-[12px] sm:block">
        <p className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-black/40">Files</p>
        <p className="flex items-center gap-1.5 rounded bg-[#e3eefb] px-1.5 py-1">
          <FileText className="h-3.5 w-3.5 text-[#f37626]" aria-hidden="true" /> welcome.ipynb
        </p>
        <p className="flex items-center gap-1.5 px-1.5 py-1 text-black/50">📁 data</p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1 border-b border-black/10 px-2 py-1 text-[12px]">
          <span className="mr-2 font-medium">welcome.ipynb</span>
          <button type="button" onClick={() => run(active)} className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-black/5" aria-label="Run the selected cell">
            <Play className="h-3.5 w-3.5" aria-hidden="true" /> Run
          </button>
          <button type="button" onClick={runAll} className="rounded px-1.5 py-0.5 hover:bg-black/5">
            Run all
          </button>
          <button type="button" onClick={addCell} className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-black/5" aria-label="Add a cell">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Cell
          </button>
          <span className="ml-auto flex items-center gap-1.5 text-black/50">
            Python 3 (demo)
            <span className={`h-2.5 w-2.5 rounded-full ${cells.some((c) => c.busy) ? 'bg-[#f2a33a]' : 'border border-black/40'}`} />
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3 mac-scroll">
          {cells.map((c) => (
            <div
              key={c.id}
              onMouseDown={() => setActive(c.id)}
              className={`mb-2 flex gap-2 border-l-[3px] py-1 pl-1 ${active === c.id ? 'border-[#1976d2]' : 'border-transparent'}`}
            >
              <span className="w-12 shrink-0 pt-1.5 text-right font-mono text-[11px] text-[#303f9f]">
                {c.kind === 'code' ? `[${c.busy ? '*' : c.n ?? ' '}]:` : ''}
              </span>
              <div className="min-w-0 flex-1">
                {c.kind === 'md' ? (
                  <div className="text-[14px]">
                    <Markdown src={c.src} />
                  </div>
                ) : (
                  <textarea
                    ref={(el) => {
                      if (el) refs.current.set(c.id, el)
                    }}
                    value={c.src}
                    spellCheck={false}
                    wrap="off"
                    aria-label="Code cell"
                    rows={Math.max(1, c.src.split('\n').length)}
                    onFocus={() => setActive(c.id)}
                    onChange={(e) => setCells((cs) => cs.map((x) => (x.id === c.id ? { ...x, src: e.target.value } : x)))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.shiftKey || e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        run(c.id, e.shiftKey)
                      }
                    }}
                    className="block w-full resize-none overflow-x-auto overflow-y-hidden rounded border border-black/10 bg-[#f7f7f7] px-2 py-1.5 pb-2 font-mono text-[12.5px] leading-[1.45] outline-none focus:border-[#1976d2]/60"
                  />
                )}
                {c.out !== undefined && c.out !== '' && (
                  <pre className={`mt-1 overflow-x-auto whitespace-pre-wrap px-2 font-mono text-[12px] leading-[1.45] ${c.err ? 'rounded bg-[#fdecea] text-[#b3261e]' : ''}`}>{c.out}</pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
