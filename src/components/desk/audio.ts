/**
 * Desk sounds, synthesised with WebAudio (no audio files): mouse clicks,
 * mechanical-key clacks, a camera whoosh, and a quiet room + computer hum.
 * The context is only created after the visitor presses START (autoplay rules).
 */
export class DeskAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  muted = false

  start() {
    if (this.ctx) return
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.9
    this.master.connect(ctx.destination)
    const len = ctx.sampleRate * 2
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = this.noise.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    this.ambience()
  }

  setMuted(m: boolean) {
    this.muted = m
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.05)
  }

  private burst(opts: { freq: number; q: number; gain: number; dur: number; type?: BiquadFilterType; delay?: number }) {
    const { ctx, master, noise } = this
    if (!ctx || !master || !noise) return
    const t = ctx.currentTime + (opts.delay ?? 0)
    const src = ctx.createBufferSource()
    src.buffer = noise
    const f = ctx.createBiquadFilter()
    f.type = opts.type ?? 'bandpass'
    f.frequency.value = opts.freq
    f.Q.value = opts.q
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(opts.gain, t + 0.002)
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur)
    src.connect(f).connect(g).connect(master)
    src.start(t, Math.random())
    src.stop(t + opts.dur + 0.02)
  }

  mouseDown() {
    this.burst({ freq: 2600, q: 3, gain: 0.35, dur: 0.03 })
  }

  mouseUp() {
    this.burst({ freq: 3400, q: 4, gain: 0.2, dur: 0.025 })
  }

  key() {
    const v = 0.8 + Math.random() * 0.4
    this.burst({ freq: 1800 * v, q: 1.6, gain: 0.32, dur: 0.045 })
    this.burst({ freq: 380 * v, q: 1.2, gain: 0.22, dur: 0.06, type: 'lowpass', delay: 0.004 })
  }

  whoosh() {
    const { ctx, master, noise } = this
    if (!ctx || !master || !noise) return
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = noise
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.Q.value = 0.8
    f.frequency.setValueAtTime(250, t)
    f.frequency.exponentialRampToValueAtTime(1100, t + 0.7)
    f.frequency.exponentialRampToValueAtTime(300, t + 1.5)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.07, t + 0.5)
    g.gain.linearRampToValueAtTime(0, t + 1.5)
    src.connect(f).connect(g).connect(master)
    src.start(t)
    src.stop(t + 1.6)
  }

  /** A soft F-major boot chord (F for Fahad). */
  chime() {
    const { ctx, master } = this
    if (!ctx || !master) return
    const t = ctx.currentTime + 0.05
    for (const f of [174.61, 220, 261.63, 349.23, 440]) {
      const o = ctx.createOscillator()
      o.type = f > 300 ? 'sine' : 'triangle'
      o.frequency.value = f
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.05, t + 0.04)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6)
      o.connect(g).connect(master)
      o.start(t)
      o.stop(t + 2.7)
    }
  }

  /** Low room tone plus a faint computer fan. */
  private ambience() {
    const { ctx, master, noise } = this
    if (!ctx || !master || !noise) return
    const src = ctx.createBufferSource()
    src.buffer = noise
    src.loop = true
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 320
    const g = ctx.createGain()
    g.gain.value = 0.035
    src.connect(lp).connect(g).connect(master)
    src.start()
    const fan = ctx.createBufferSource()
    fan.buffer = noise
    fan.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 900
    bp.Q.value = 0.7
    const fg = ctx.createGain()
    fg.gain.value = 0.012
    fan.connect(bp).connect(fg).connect(master)
    fan.start(0, 0.7)
  }

  dispose() {
    this.ctx?.close()
    this.ctx = null
  }
}
