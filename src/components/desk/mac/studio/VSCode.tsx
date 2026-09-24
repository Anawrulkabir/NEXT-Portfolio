'use client'
/** A VS Code–style editor for the demo session: edit check_gpu.py, run it in the terminal. */
import { useEffect, useRef, useState } from 'react'
import { newEnv, runCell, type Spec } from './kernel'

const FILE = `import torch

# which GPU did the scheduler give me?
print("cuda available:", torch.cuda.is_available())
torch.cuda.get_device_name(0)
`

export function VSCode({ spec }: { spec: Spec }) {
  const [src, setSrc] = useState(FILE)
  const [lines, setLines] = useState<string[]>(["Type 'help'. Try: python check_gpu.py"])
  const [cmd, setCmd] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const prompt = 'fahad@ai-studio:~/work$'
  useEffect(() => endRef.current?.scrollIntoView({ block: 'end' }), [lines])

  const exec = (raw: string) => {
    const c = raw.trim()
    let out = ''
    if (c === 'help') out = 'ls · nvidia-smi · python check_gpu.py · nproc · clear'
    else if (c === 'ls') out = 'check_gpu.py  data/'
    else if (c === 'nproc') out = String(spec.cpu)
    else if (c === 'nvidia-smi') out = runCell('!nvidia-smi', newEnv(), spec).out
    else if (c === 'python check_gpu.py' || c === 'python3 check_gpu.py') {
      // Scripts don't echo bare expressions; wrap the last one in print().
      const body = src.trimEnd().split('\n')
      const lastIdx = body.length - 1
      if (body[lastIdx] && !/^(print|import|from|#)|=/.test(body[lastIdx].trim())) body[lastIdx] = `print(${body[lastIdx].trim()})`
      out = runCell(body.join('\n'), newEnv(), spec).out.replace(/^'|'$/gm, '')
    } else if (c === 'clear') {
      setLines([])
      return
    } else if (c) out = `bash: ${c.split(' ')[0]}: command not found`
    setLines((l) => [...l, `${prompt} ${raw}`, ...(out ? out.split('\n') : [])])
  }

  const nLines = src.split('\n').length

  return (
    <div className="flex h-full min-h-0 bg-[#1e1e1e] text-[#d4d4d4] text-[12.5px]">
      <nav aria-hidden="true" className="flex w-10 shrink-0 flex-col items-center gap-3 bg-[#333333] pt-3 text-[16px] text-white/40">
        <span className="text-white/80">⎘</span>
        <span>⌕</span>
        <span>⑂</span>
      </nav>
      <aside className="hidden w-[170px] shrink-0 bg-[#252526] p-2 sm:block">
        <p className="px-1 pb-1 text-[11px] uppercase tracking-wider text-white/40">Explorer · work</p>
        <p className="rounded bg-[#37373d] px-1.5 py-0.5">
          <span className="text-[#e5c07b]">py</span> check_gpu.py
        </p>
        <p className="px-1.5 py-0.5 text-white/50">▸ data</p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-8 items-end bg-[#252526]">
          <span className="border-t border-[#0078d4] bg-[#1e1e1e] px-3 py-1.5 text-white/90">check_gpu.py</span>
        </div>
        <div className="flex min-h-0 flex-1 overflow-auto font-mono leading-[1.5] mac-scroll">
          <pre aria-hidden="true" className="select-none px-3 py-2 text-right text-[#858585]">
            {Array.from({ length: nLines }, (_, i) => i + 1).join('\n')}
          </pre>
          <textarea
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            spellCheck={false}
            aria-label="check_gpu.py"
            className="min-h-full flex-1 resize-none bg-transparent py-2 pr-3 font-mono leading-[1.5] text-[#d4d4d4] outline-none"
          />
        </div>
        <div className="h-[42%] min-h-[120px] border-t border-white/10 bg-[#1e1e1e]">
          <p className="border-b border-white/10 px-3 py-1 text-[11px] uppercase tracking-wider text-white/50">Terminal</p>
          <div className="h-[calc(100%-26px)] overflow-y-auto px-3 py-1.5 font-mono leading-[1.45] mac-scroll">
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
              <span className="text-[#89d185]">{prompt}&nbsp;</span>
              <input value={cmd} onChange={(e) => setCmd(e.target.value)} aria-label="Terminal command" spellCheck={false} autoComplete="off" className="flex-1 bg-transparent outline-none" />
            </form>
            <div ref={endRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
