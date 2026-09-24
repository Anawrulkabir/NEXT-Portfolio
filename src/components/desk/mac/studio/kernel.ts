/**
 * A tiny pretend Python kernel for the demo session. It knows the few GPU
 * cells the notebook ships with, plus arithmetic, variables and print().
 * Everything runs in the browser; nothing is sent anywhere.
 */

export type Spec = { gpu: boolean; cpu: number; mem: number }
type Env = Map<string, number | string>

const NVIDIA_SMI = (spec: Spec) =>
  spec.gpu
    ? `+-----------------------------------------------------------------------------+
| NVIDIA-SMI                          Driver Version: (demo)                   |
|-------------------------------+----------------------+----------------------+
| GPU  Name                     | Memory-Usage         | GPU-Util             |
|===============================+======================+======================|
|   0  NVIDIA GeForce RTX 4090  |      0MiB /  8192MiB |      0%              |
+-------------------------------+----------------------+----------------------+
  8192MiB: your HAMi slice. The card is shared; your limit is enforced.`
    : 'bash: nvidia-smi: command not found  (this session has no GPU)'

/* ---- a very small expression evaluator: numbers, strings, + - * / ** % ( ), names ---- */
function tokenize(src: string) {
  const re = /\s*(\d+\.?\d*(?:e[+-]?\d+)?|"[^"]*"|'[^']*'|\*\*|[A-Za-z_]\w*|[-+*/%()])/gy
  const out: string[] = []
  let m: RegExpExecArray | null
  let last = 0
  while ((m = re.exec(src))) {
    out.push(m[1])
    last = re.lastIndex
  }
  if (src.slice(last).trim()) throw new Error(`SyntaxError: invalid syntax`)
  return out
}

function evaluate(src: string, env: Env): number | string {
  const t = tokenize(src)
  let i = 0
  const peek = () => t[i]
  const eat = (x?: string) => {
    const v = t[i++]
    if (x && v !== x) throw new Error('SyntaxError: invalid syntax')
    return v
  }
  const num = (v: number | string) => {
    if (typeof v !== 'number') throw new Error("TypeError: unsupported operand type(s)")
    return v
  }
  const atom = (): number | string => {
    const v = eat()
    if (v === undefined) throw new Error('SyntaxError: unexpected end of input')
    if (v === '(') {
      const r = add()
      eat(')')
      return r
    }
    if (v === '-') return -num(unary())
    if (/^\d/.test(v)) return Number(v)
    if (/^["']/.test(v)) return v.slice(1, -1)
    if (env.has(v)) return env.get(v)!
    throw new Error(`NameError: name '${v}' is not defined`)
  }
  const unary = (): number | string => atom()
  const power = (): number | string => {
    const b = unary()
    if (peek() === '**') {
      eat()
      return num(b) ** num(power())
    }
    return b
  }
  const mul = (): number | string => {
    let v = power()
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = eat()
      const r = power()
      if (op === '*') v = typeof v === 'string' ? v.repeat(num(r)) : num(v) * num(r)
      else if (op === '/') {
        if (num(r) === 0) throw new Error('ZeroDivisionError: division by zero')
        v = num(v) / num(r)
      } else v = num(v) % num(r)
    }
    return v
  }
  const add = (): number | string => {
    let v = mul()
    while (peek() === '+' || peek() === '-') {
      const op = eat()
      const r = mul()
      v = op === '+' ? (typeof v === 'string' || typeof r === 'string' ? `${v}${r}` : v + r) : num(v) - num(r)
    }
    return v
  }
  const v = add()
  if (i < t.length) throw new Error('SyntaxError: invalid syntax')
  return v
}

const repr = (v: number | string) =>
  typeof v === 'string' && v.startsWith('__tensor:')
    ? `tensor(shape=(${v.slice(9)}), device='cuda:0')`
    : (typeof v === 'string' ? `'${v}'` : Number.isInteger(v) ? String(v) : String(+v.toFixed(10)))

/** Run one cell. Returns its text output ('' for none). */
export function runCell(code: string, env: Env, spec: Spec): { out: string; error?: boolean } {
  const lines = code.split('\n').map((l) => l.replace(/#.*$/, '').trimEnd())
  const out: string[] = []
  let last: string | null = null
  try {
    for (const raw of lines) {
      const line = raw.trim()
      last = null
      if (!line) continue
      if (/^!?nvidia-smi/.test(line)) {
        out.push(line.includes('--query') ? (spec.gpu ? 'name, memory.total [MiB]\nNVIDIA GeForce RTX 4090, 8192 MiB' : NVIDIA_SMI(spec)) : NVIDIA_SMI(spec))
        continue
      }
      if (/^import\s+\w+/.test(line) || /^from\s+\w+/.test(line)) continue
      const pr = /^print\((.*)\)$/.exec(line)
      if (pr) {
        // Known GPU calls inside print() become plain values.
        if (/get_device_name/.test(pr[1]) && !spec.gpu) throw new Error('RuntimeError: No CUDA GPUs are available')
        const arg = pr[1]
          .replace(/torch\.cuda\.is_available\(\)/g, spec.gpu ? '"True"' : '"False"')
          .replace(/torch\.cuda\.get_device_name\(\s*\d*\s*\)/g, '"NVIDIA GeForce RTX 4090"')
        const parts = arg.trim() ? arg.split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/).map((p) => evaluate(p, env)) : []
        out.push(parts.map((p) => (typeof p === 'string' ? p : repr(p))).join(' '))
        continue
      }
      if (/torch\.cuda\.is_available\(\)/.test(line) && /get_device_name/.test(line)) {
        last = spec.gpu ? "(True, 'NVIDIA GeForce RTX 4090')" : '(False, None)'
        continue
      }
      if (/torch\.cuda\.is_available\(\)/.test(line)) {
        last = spec.gpu ? 'True' : 'False'
        continue
      }
      if (/get_device_name/.test(line)) {
        if (!spec.gpu) throw new Error('RuntimeError: No CUDA GPUs are available')
        last = "'NVIDIA GeForce RTX 4090'"
        continue
      }
      if (/torch\.randn\(([^)]*)\)/.test(line) && /^\w+\s*=/.test(line)) {
        if (/cuda/.test(line) && !spec.gpu) throw new Error('RuntimeError: No CUDA GPUs are available')
        const dims = /randn\(([\d\s,]+)/.exec(line)?.[1].split(',').map((s) => s.trim()).filter(Boolean) ?? ['4096', '4096']
        env.set(line.split('=')[0].trim(), `__tensor:${dims.join(',')}`)
        continue
      }
      const mm = /^\((\w+)\s*@\s*(\w+)\)\.shape$/.exec(line)
      if (mm) {
        const a = env.get(mm[1])
        if (typeof a !== 'string' || !a.startsWith('__tensor:')) throw new Error(`NameError: name '${mm[1]}' is not defined`)
        const d = a.slice(9).split(',')
        last = `torch.Size([${d[0]}, ${d[d.length - 1]}])`
        continue
      }
      if (/torch\.cuda\.mem_get_info\(\)/.test(line)) {
        if (!spec.gpu) throw new Error('RuntimeError: No CUDA GPUs are available')
        last = '(8522825728, 8589934592)'
        continue
      }
      if (/^os\.cpu_count\(\)$/.test(line)) {
        last = String(spec.cpu)
        continue
      }
      const asg = /^([A-Za-z_]\w*)\s*=\s*(.+)$/.exec(line)
      if (asg && !asg[2].startsWith('=')) {
        env.set(asg[1], evaluate(asg[2], env))
        continue
      }
      last = repr(evaluate(line, env))
    }
    if (last !== null) out.push(last)
    return { out: out.join('\n') }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return {
      out: `${out.length ? out.join('\n') + '\n' : ''}${msg}\n\n(This demo kernel only knows a few tricks: arithmetic, variables, print(), and the GPU cells above.)`,
      error: true,
    }
  }
}

export const newEnv = (): Env => new Map()
