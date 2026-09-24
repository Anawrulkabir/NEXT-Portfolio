'use client'
/**
 * "Launch a session": choose resources and an IDE, watch the bare-metal
 * launch steps, then land in the IDE. An illustration of AI Studio's flow,
 * not its real interface.
 */
import { useEffect, useRef, useState } from 'react'
import { Check, Cpu, HardDrive, MemoryStick, Timer } from 'lucide-react'
import { METAL } from './flows'
import { Jupyter } from './Jupyter'
import { VSCode } from './VSCode'

type Ide = 'jupyter' | 'vscode'
type Opts = { ide: Ide; gpu: boolean; cpu: number; mem: number; hours: number }

function Chips<T extends string | number | boolean>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-black/45">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map(([v, text]) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            className={`rounded-lg border px-3 py-1.5 text-[12.5px] ${value === v ? 'border-[#1f5fd6] bg-[#eaf1fd] font-semibold text-[#1f5fd6]' : 'border-black/10 bg-white hover:border-black/30'}`}
          >
            {text}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function useCountdown(hours: number, running: boolean) {
  const [left, setLeft] = useState(hours * 3600)
  useEffect(() => {
    if (!running) return
    setLeft(hours * 3600)
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [hours, running])
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function Launcher() {
  const [o, setO] = useState<Opts>({ ide: 'jupyter', gpu: true, cpu: 4, mem: 16, hours: 2 })
  const [phase, setPhase] = useState<'form' | 'launching' | 'ready'>('form')
  const [step, setStep] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const left = useCountdown(o.hours, phase === 'ready')
  const set = <K extends keyof Opts>(k: K) => (v: Opts[K]) => setO((x) => ({ ...x, [k]: v }))

  // Launch steps: the bare-metal path, minus the first hop.
  const steps = METAL.steps.slice(1).map((s) => s.text.replace(/ I designed this allocation schema and API\./, ''))
  const visible = o.gpu ? steps : steps.filter((s) => !/HAMi|slice/.test(s))

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const launch = () => {
    setPhase('launching')
    setStep(0)
    visible.forEach((_, i) => timers.current.push(setTimeout(() => setStep(i + 1), 550 * (i + 1))))
    timers.current.push(setTimeout(() => setPhase('ready'), 550 * (visible.length + 1)))
  }
  const end = () => {
    timers.current.forEach(clearTimeout)
    setPhase('form')
  }

  if (phase === 'ready') {
    const spec = { gpu: o.gpu, cpu: o.cpu, mem: o.mem }
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-black/10 bg-[#eef7f0] px-3 py-1.5 text-[12px] text-black/70">
          <span className="font-semibold text-[#2d6b43]">● session running</span>
          <span>{o.gpu ? 'RTX 4090 · 8 GB slice' : 'CPU only'}</span>
          <span>
            {o.cpu} CPU · {o.mem} GB
          </span>
          <span className="tabular-nums">ends in {left}</span>
          <span className="text-black/40">demo, runs in your browser</span>
          <button type="button" onClick={end} className="ml-auto rounded-md border border-black/10 bg-white px-2.5 py-0.5 hover:border-[#b3261e] hover:text-[#b3261e]">
            End session
          </button>
        </div>
        <div className="min-h-0 flex-1">{o.ide === 'jupyter' ? <Jupyter spec={spec} /> : <VSCode spec={spec} />}</div>
      </div>
    )
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[1fr_340px]">
      <form
        className="flex flex-col gap-4 overflow-y-auto p-5 mac-scroll"
        onSubmit={(e) => {
          e.preventDefault()
          if (phase === 'form') launch()
        }}
      >
        <div>
          <p className="text-[20px] font-semibold">New session</p>
          <p className="text-[12.5px] text-black/55">Pick what you need. This mirrors how AI Studio sessions are requested; it isn’t the real interface.</p>
        </div>
        <Chips label="IDE" value={o.ide} onChange={set('ide')} options={[['jupyter', 'JupyterLab'], ['vscode', 'VS Code']]} />
        <Chips label="GPU" value={o.gpu} onChange={set('gpu')} options={[[true, 'RTX 4090 · 8 GB slice'], [false, 'No GPU']]} />
        <Chips label="CPU" value={o.cpu} onChange={set('cpu')} options={[[2, '2 cores'], [4, '4 cores'], [8, '8 cores']]} />
        <Chips label="Memory" value={o.mem} onChange={set('mem')} options={[[8, '8 GB'], [16, '16 GB'], [32, '32 GB']]} />
        <Chips label="Session length" value={o.hours} onChange={set('hours')} options={[[1, '1 hour'], [2, '2 hours'], [4, '4 hours']]} />
        <button type="submit" disabled={phase !== 'form'} className="mt-1 self-start rounded-lg bg-[#1f5fd6] px-6 py-2 font-semibold text-white hover:bg-[#1a52bb] disabled:opacity-60">
          {phase === 'form' ? 'Launch session' : 'Launching…'}
        </button>
      </form>

      <aside className="flex flex-col gap-3 border-t border-black/10 bg-white p-5 md:border-l md:border-t-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-black/45">Your request</p>
        <ul className="space-y-1.5 text-[13px]">
          <li className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-black/45" aria-hidden="true" /> {o.gpu ? 'One 8 GB slice of an RTX 4090' : 'No GPU'}
          </li>
          <li className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-black/45" aria-hidden="true" /> {o.cpu} CPU cores
          </li>
          <li className="flex items-center gap-2">
            <MemoryStick className="h-4 w-4 text-black/45" aria-hidden="true" /> {o.mem} GB memory
          </li>
          <li className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-black/45" aria-hidden="true" /> {o.hours} hour{o.hours > 1 ? 's' : ''}, {o.ide === 'jupyter' ? 'JupyterLab' : 'VS Code'}
          </li>
        </ul>
        {phase === 'launching' && (
          <ol className="mt-2 space-y-2 text-[12.5px] leading-snug" aria-live="polite">
            {visible.map((s, i) => (
              <li key={i} className={`flex gap-2 ${i < step ? 'text-black/50' : i === step ? 'font-medium text-black' : 'text-black/30'}`}>
                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${i < step ? 'bg-[#3d8f5a] text-white' : i === step ? 'bg-[#e8a317] text-white' : 'bg-black/[0.07]'}`}>
                  {i < step ? <Check className="h-3 w-3" aria-hidden="true" /> : i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        )}
        <p className="mt-auto text-[11.5px] text-black/40">In real life this takes 3–5 minutes on the bare-metal cluster. Here it takes a few seconds.</p>
      </aside>
    </div>
  )
}
