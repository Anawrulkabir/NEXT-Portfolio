'use client'
/**
 * VS Code in the browser (as AI Studio serves it), Light Modern theme. Edit
 * the file, press ▷ or type in the terminal. Runs on the demo kernel.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Bell,
  Blocks,
  ChevronDown,
  ChevronRight,
  CircleUser,
  Files,
  GitBranch,
  Play,
  Plus,
  Search,
  Settings,
  SquareTerminal,
  Trash2,
  X,
  Bug,
} from 'lucide-react'
import { newEnv, runCell, type Spec } from './kernel'

type FileName = 'check_gpu.py' | 'requirements.txt'
const FILES: Record<FileName, string> = {
  'check_gpu.py': `import torch

# Which GPU did the scheduler give me?
print("cuda available:", torch.cuda.is_available())
print("device:", torch.cuda.get_device_name(0))

free, total = torch.cuda.mem_get_info()
print("memory (GB):", total / 1024 ** 3)
`,
  'requirements.txt': `torch==2.3.1
jupyterlab==4.2.3
numpy==1.26.4
`,
}

/* ---------- Python syntax colours (Light Modern) ---------- */
const KW = new Set(['import', 'from', 'as', 'def', 'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'with', 'class', 'not', 'and', 'or', 'True', 'False', 'None', 'pass', 'lambda'])
function highlight(line: string, py: boolean): ReactNode[] {
  if (!py) return [line]
  const out: ReactNode[] = []
  const re = /(#.*$)|("[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)(\s*\()?|(\s+|.)/g
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(line))) {
    if (m[1]) out.push(<span key={k++} className="text-[#008000]">{m[1]}</span>)
    else if (m[2]) out.push(<span key={k++} className="text-[#a31515]">{m[2]}</span>)
    else if (m[3]) out.push(<span key={k++} className="text-[#098658]">{m[3]}</span>)
    else if (m[4]) {
      const word = m[4]
      const cls = KW.has(word) ? 'text-[#0000ff]' : m[5] ? 'text-[#795e26]' : word === 'torch' ? 'text-[#267f99]' : 'text-[#001080]'
      out.push(
        <span key={k++} className={cls}>
          {word}
        </span>
      )
      if (m[5]) out.push(m[5])
    } else out.push(m[6])
  }
  return out
}

function FileIcon({ name }: { name: FileName }) {
  return name.endsWith('.py') ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/media/logos/python.svg" alt="" className="h-3.5 w-3.5" />
  ) : (
    <span className="text-[10px] font-bold text-[#6e7681]">≡</span>
  )
}

export function VSCode({ spec }: { spec: Spec }) {
  const [files, setFiles] = useState(FILES)
  const [open, setOpen] = useState<FileName[]>(['check_gpu.py', 'requirements.txt'])
  const [active, setActive] = useState<FileName>('check_gpu.py')
  const [pos, setPos] = useState({ ln: 1, col: 1 })
  const [lines, setLines] = useState<string[]>([])
  const [cmd, setCmd] = useState('')
  const [explorerOpen, setExplorerOpen] = useState(true)
  const editor = useRef<HTMLTextAreaElement>(null)
  const code = useRef<HTMLPreElement>(null)
  const gutter = useRef<HTMLPreElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const prompt = 'fahad@ai-studio:~/work$'

  useEffect(() => {
    // Scroll only the terminal box. (Braces: scrollIntoView would return a Promise in new browsers.)
    const box = endRef.current?.parentElement
    if (box) box.scrollTop = box.scrollHeight
  }, [lines])

  const src = files[active]
  const py = active.endsWith('.py')

  const runFile = () => {
    // Scripts don't echo bare expressions, so only print() output appears.
    const body = files['check_gpu.py'].split('\n').filter((l) => /^\s*(import|from|print|#|$)|=/.test(l))
    return runCell(body.join('\n'), newEnv(), spec).out.replace(/\n\n\(This demo kernel[\s\S]*$/, '')
  }

  const exec = (raw: string) => {
    const c = raw.trim()
    let out = ''
    if (c === 'help') out = 'ls · cat <file> · python check_gpu.py · nvidia-smi · nproc · free -h · clear'
    else if (c === 'ls') out = 'check_gpu.py  data  requirements.txt'
    else if (c.startsWith('cat ')) {
      const f = c.slice(4).trim() as FileName
      out = files[f] ? files[f].trimEnd() : `cat: ${f}: No such file or directory`
    } else if (c === 'nproc') out = String(spec.cpu)
    else if (c === 'free -h') out = `               total        used        free\nMem:            ${spec.mem}Gi       1.2Gi        ${spec.mem - 1.2}Gi`
    else if (c === 'nvidia-smi') out = runCell('!nvidia-smi', newEnv(), spec).out
    else if (/^python3? check_gpu\.py$/.test(c)) out = runFile()
    else if (c === 'clear') {
      setLines([])
      return
    } else if (c) out = `bash: ${c.split(' ')[0]}: command not found`
    setLines((l) => [...l, `${prompt} ${raw}`, ...(out ? out.split('\n') : [])])
  }

  const updatePos = () => {
    const el = editor.current
    if (!el) return
    const before = el.value.slice(0, el.selectionStart).split('\n')
    setPos({ ln: before.length, col: before[before.length - 1].length + 1 })
  }

  const syncScroll = () => {
    const el = editor.current
    if (!el) return
    if (code.current) {
      code.current.scrollTop = el.scrollTop
      code.current.scrollLeft = el.scrollLeft
    }
    if (gutter.current) gutter.current.scrollTop = el.scrollTop
  }

  const openFile = (f: FileName) => {
    if (!open.includes(f)) setOpen((o) => [...o, f])
    setActive(f)
  }
  const closeFile = (f: FileName) => {
    const rest = open.filter((x) => x !== f)
    setOpen(rest)
    if (active === f && rest[0]) setActive(rest[0])
  }

  const codeLines = src.split('\n')
  const mono = 'font-mono text-[12.5px] leading-[19px]'

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[13px] text-[#3b3b3b]">
      {/* Title / command center */}
      <div className="flex h-[34px] shrink-0 items-center gap-2 border-b border-[#e5e5e5] bg-[#f8f8f8] px-2 text-[12.5px]">
        <span className="px-1 text-[#616161]">☰</span>
        {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map((m) => (
          <span key={m} className="hidden px-1 text-[#3b3b3b] lg:inline">
            {m}
          </span>
        ))}
        <div className="mx-auto flex w-[38%] min-w-[180px] items-center justify-center gap-1.5 rounded-md border border-[#e5e5e5] bg-white py-0.5 text-[#616161]">
          <Search className="h-3.5 w-3.5" aria-hidden="true" /> work [SSH: ai-studio]
        </div>
        <span className="w-[120px]" />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Activity bar */}
        <nav aria-label="Activity bar" className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-[#e5e5e5] bg-[#f8f8f8] py-2 text-[#616161]">
          {[
            [Files, 'Explorer'],
            [Search, 'Search'],
            [GitBranch, 'Source Control'],
            [Bug, 'Run and Debug'],
            [Blocks, 'Extensions'],
          ].map(([Icon, label], i) => {
            const I = Icon as typeof Files
            return (
              <button
                key={label as string}
                type="button"
                aria-label={label as string}
                onClick={() => i === 0 && setExplorerOpen((o) => !o)}
                className={`relative flex h-11 w-12 items-center justify-center ${i === 0 && explorerOpen ? 'text-[#1f1f1f] before:absolute before:left-0 before:top-2 before:h-7 before:w-[2px] before:bg-[#005fb8]' : 'hover:text-[#1f1f1f]'}`}
              >
                <I className="h-[22px] w-[22px]" strokeWidth={1.5} aria-hidden="true" />
              </button>
            )
          })}
          <span className="flex-1" />
          <CircleUser className="my-2 h-[22px] w-[22px]" strokeWidth={1.5} aria-hidden="true" />
          <Settings className="my-2 h-[22px] w-[22px]" strokeWidth={1.5} aria-hidden="true" />
        </nav>

        {/* Explorer */}
        {explorerOpen && (
          <aside className="hidden w-[200px] shrink-0 flex-col border-r border-[#e5e5e5] bg-[#f8f8f8] sm:flex">
            <p className="px-5 py-2 text-[11px] tracking-wide text-[#616161]">EXPLORER</p>
            <p className="flex items-center gap-0.5 px-1 text-[11px] font-bold text-[#3b3b3b]">
              <ChevronDown className="h-4 w-4" aria-hidden="true" /> WORK [SSH: AI-STUDIO]
            </p>
            <ul className="mt-0.5 text-[13px]">
              <li className="flex items-center gap-1 py-[2px] pl-5">
                <ChevronRight className="h-4 w-4 text-[#616161]" aria-hidden="true" /> data
              </li>
              {(Object.keys(FILES) as FileName[]).map((f) => (
                <li key={f}>
                  <button
                    type="button"
                    onClick={() => openFile(f)}
                    className={`flex w-full items-center gap-1.5 py-[2px] pl-9 text-left ${active === f ? 'bg-[#e4e6f1] outline outline-1 -outline-offset-1 outline-[#005fb8]' : 'hover:bg-[#f2f2f2]'}`}
                  >
                    <FileIcon name={f} /> {f}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Editor + panel */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-[35px] shrink-0 items-stretch border-b border-[#e5e5e5] bg-[#f8f8f8]">
            {open.map((f) => (
              <div
                key={f}
                className={`group flex items-center gap-1.5 border-r border-[#e5e5e5] pl-3 pr-1.5 text-[13px] ${active === f ? 'border-t-2 border-t-[#005fb8] bg-white text-[#1f1f1f]' : 'border-t-2 border-t-transparent text-[#868686]'}`}
              >
                <button type="button" onClick={() => setActive(f)} className="flex items-center gap-1.5">
                  <FileIcon name={f} /> {f}
                </button>
                <button type="button" onClick={() => closeFile(f)} aria-label={`Close ${f}`} className={`rounded p-0.5 hover:bg-black/10 ${active === f ? '' : 'opacity-0 group-hover:opacity-100'}`}>
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
            <span className="flex-1" />
            {py && (
              <button
                type="button"
                onClick={() => {
                  exec('python check_gpu.py')
                  input.current?.focus()
                }}
                aria-label="Run Python file"
                title="Run Python File"
                className="mx-2 my-1 rounded px-1.5 text-[#616161] hover:bg-black/10"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {open.length > 0 ? (
            <>
              <p className="flex h-[22px] shrink-0 items-center gap-1 px-4 text-[12.5px] text-[#616161]">
                work <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /> <FileIcon name={active} /> {active}
              </p>
              <div className="relative flex min-h-0 flex-1">
                <pre ref={gutter} aria-hidden="true" className={`${mono} w-[52px] shrink-0 select-none overflow-hidden pr-4 text-right text-[#6e7681]`}>
                  {codeLines.map((_, i) => (
                    <div key={i} className={i + 1 === pos.ln ? 'text-[#171184]' : ''}>
                      {i + 1}
                    </div>
                  ))}
                </pre>
                <div className="relative min-w-0 flex-1">
                  <pre ref={code} aria-hidden="true" className={`${mono} absolute inset-0 overflow-hidden whitespace-pre pr-4`}>
                    {codeLines.map((l, i) => (
                      <div key={i} className={i + 1 === pos.ln ? 'bg-[#f5f5f5] outline outline-1 outline-[#eeeeee]' : ''}>
                        {highlight(l, py)}
                        {'​'}
                      </div>
                    ))}
                  </pre>
                  <textarea
                    ref={editor}
                    value={src}
                    wrap="off"
                    spellCheck={false}
                    aria-label={active}
                    onChange={(e) => {
                      setFiles((fs) => ({ ...fs, [active]: e.target.value }))
                      updatePos()
                    }}
                    onSelect={updatePos}
                    onKeyUp={updatePos}
                    onClick={updatePos}
                    onScroll={syncScroll}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault()
                        const el = e.currentTarget
                        const s = el.selectionStart
                        const v = el.value.slice(0, s) + '    ' + el.value.slice(el.selectionEnd)
                        setFiles((fs) => ({ ...fs, [active]: v }))
                        requestAnimationFrame(() => el.setSelectionRange(s + 4, s + 4))
                      }
                    }}
                    className={`${mono} absolute inset-0 h-full w-full resize-none overflow-auto whitespace-pre bg-transparent pr-4 text-transparent caret-black outline-none selection:bg-[#add6ff] mac-scroll`}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-[13px] text-[#8b8b8b]">Open a file from the Explorer</div>
          )}

          {/* Panel */}
          <div className="flex h-[40%] min-h-[130px] shrink-0 flex-col border-t border-[#e5e5e5]">
            <div className="flex h-[35px] shrink-0 items-center gap-5 px-4 text-[11px] tracking-wide text-[#616161]">
              {['PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE', 'TERMINAL', 'PORTS'].map((t) => (
                <span key={t} className={t === 'TERMINAL' ? 'border-b border-[#005fb8] pb-1 pt-1.5 text-[#3b3b3b]' : 'hidden pb-1 pt-1.5 md:inline'}>
                  {t}
                </span>
              ))}
              <span className="ml-auto flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <SquareTerminal className="h-3.5 w-3.5" aria-hidden="true" /> bash
                </span>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <button type="button" aria-label="Clear terminal" onClick={() => setLines([])} className="hover:text-black">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2 font-mono text-[12.5px] leading-[18px] text-[#1f1f1f] mac-scroll" onClick={() => input.current?.focus()}>
              {lines.map((l, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {l}
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  exec(cmd)
                  setCmd('')
                }}
                className="flex"
              >
                <span className="whitespace-pre">
                  <span className="font-semibold text-[#0e7c3a]">fahad@ai-studio</span>:<span className="font-semibold text-[#005fb8]">~/work</span>${' '}
                </span>
                <input
                  ref={input}
                  value={cmd}
                  onChange={(e) => setCmd(e.target.value)}
                  aria-label="Terminal command"
                  placeholder={lines.length ? '' : "try: python check_gpu.py   (or 'help')"}
                  spellCheck={false}
                  autoComplete="off"
                  className="flex-1 bg-transparent outline-none placeholder:text-[#a0a0a0]"
                />
              </form>
              <div ref={endRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <footer className="flex h-[22px] shrink-0 items-center border-t border-[#e5e5e5] bg-[#f8f8f8] text-[12px] text-[#3b3b3b]">
        <span className="flex h-full items-center bg-[#005fb8] px-2.5 text-white">&gt;&lt;&nbsp; SSH: ai-studio</span>
        <span className="flex items-center gap-1 px-2.5">
          <GitBranch className="h-3.5 w-3.5" aria-hidden="true" /> main
        </span>
        <span className="px-2">⊗ 0 ⚠ 0</span>
        <span className="flex-1" />
        <span className="px-2">
          Ln {pos.ln}, Col {pos.col}
        </span>
        <span className="hidden px-2 md:inline">Spaces: 4</span>
        <span className="hidden px-2 md:inline">UTF-8</span>
        <span className="hidden px-2 md:inline">LF</span>
        <span className="px-2">{py ? '{} Python' : 'Plain Text'}</span>
        {py && <span className="hidden px-2 md:inline">3.11.9 (&apos;venv&apos;)</span>}
        <Bell className="mx-2 h-3.5 w-3.5" aria-hidden="true" />
      </footer>
    </div>
  )
}
