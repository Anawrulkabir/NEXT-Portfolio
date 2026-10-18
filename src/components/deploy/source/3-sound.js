/* ============================================================================
 * 3 · sound: every sound is synthesized, tied to one action, and optional.
 * Nothing plays until the visitor's first key or tap (autoplay rules), and the
 * whole experience works with it off.
 * ========================================================================== */
const SFX = (() => {
  let ctx = null, master = null, noiseBuf = null, unlocked = false, hush = false, on = store.get("sound", true), hum = null;
  // the visitor's level (0–1) and the ambient hum, which is off unless asked for
  let vol = store.get("vol", 0.6), humOn = store.get("hum", false);
  const listeners = new Set();
  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    master = ctx.createGain(); master.gain.value = on ? vol : 0; master.connect(comp); comp.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }
  const ok = () => ctx && unlocked && on && !hush && ctx.state === "running";
  const T = () => ctx.currentTime + 0.005;
  function env(g, t, a, d, peak) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function noise(t, dur, type, freq, q, peak, f1) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q;
    const g = ctx.createGain(); env(g, t, 0.002, dur, peak);
    s.connect(f).connect(g).connect(master); s.start(t, Math.random() * 0.6); s.stop(t + dur + 0.05);
  }
  function tone(t, f0, f1, dur, type, peak, a = 0.004) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain(); env(g, t, a, dur, peak); o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  const notes = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
  const api = {
    get on() { return on; },
    get live() { return !!ctx && unlocked; },
    unlock() { const c = ensure(); if (!c) return; if (c.state === "suspended") c.resume(); unlocked = true; listeners.forEach((f) => f()); },
    get volume() { return vol; },
    get hum() { return humOn; },
    setVolume(v) { vol = Math.max(0, Math.min(1, v)); store.set("vol", vol); if (ctx) master.gain.setTargetAtTime(on ? vol : 0, ctx.currentTime, 0.05); listeners.forEach((f) => f()); },
    setHum(v) { humOn = v; store.set("hum", v); if (v) api.humStart(); else if (hum && ctx) hum.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4); listeners.forEach((f) => f()); },
    set(v) { on = v; store.set("sound", v); if (ctx) master.gain.setTargetAtTime(v ? vol : 0, ctx.currentTime, 0.05); if (v && ctx) api.unlock(); listeners.forEach((f) => f()); },
    onChange(f) { listeners.add(f); },
    hush(v) { hush = v; },
    /** a mechanical key: a bright click and a short thock, never twice the same */
    key() { if (!ok()) return; const t = T(), r = 0.9 + Math.random() * 0.2; noise(t, 0.022, "bandpass", 3400 * r, 1.4, 0.13); tone(t, 170 * r, 85, 0.045, "sine", 0.1); },
    space() { if (!ok()) return; const t = T(); noise(t, 0.03, "bandpass", 1900, 1.1, 0.15); tone(t, 120, 70, 0.06, "sine", 0.12); },
    enter() { if (!ok()) return; const t = T(); noise(t, 0.05, "bandpass", 1500, 0.9, 0.22); tone(t, 110, 55, 0.11, "sine", 0.2); },
    /** a node allocated: a relay closing, pitched by node */
    relay(i = 0) { if (!ok()) return; const t = T(); noise(t, 0.007, "highpass", 5200, 0.7, 0.28); noise(t + 0.032, 0.006, "highpass", 4300, 0.7, 0.16); tone(t, 330 * Math.pow(2, notes[i % 10] / 12), null, 0.05, "triangle", 0.035); },
    /** a block landing */
    thunk() { if (!ok()) return; const t = T(); tone(t, 105, 48, 0.14, "sine", 0.3); noise(t, 0.04, "lowpass", 700, 0.7, 0.12); },
    /** one row of the print head */
    print() { if (!ok()) return; const t = T(); tone(t, 1250 + Math.random() * 400, null, 0.014, "square", 0.018); },
    /** a service comes up */
    blip(i = 0) { if (!ok()) return; const t = T(), f = 523.25 * Math.pow(2, notes[i % 10] / 12); tone(t, f, null, 0.16, "sine", 0.09); tone(t + 0.055, f * 1.5, null, 0.18, "sine", 0.05); },
    sweep() { if (!ok()) return; const t = T(); noise(t, 1.0, "bandpass", 300, 2.5, 0.09, 3200); },
    whoosh() { if (!ok()) return; const t = T(); noise(t, 0.38, "bandpass", 900, 1.2, 0.07, 240); },
    /** a card under the finger */
    flick(i = 0) { if (!ok()) return; const t = T(); noise(t, 0.028, "highpass", 2400 + i * 220, 0.9, 0.16); },
    open() { if (!ok()) return; const t = T(); tone(t, 520, 780, 0.08, "triangle", 0.06); },
    close() { if (!ok()) return; const t = T(); tone(t, 640, 420, 0.08, "triangle", 0.05); },
    error() { if (!ok()) return; const t = T(); tone(t, 150, 110, 0.2, "sawtooth", 0.045); },
    clack() { if (!ok()) return; const t = T(); noise(t, 0.014, "bandpass", 1300, 1.5, 0.1); },
    latch(open) { if (!ok()) return; const t = T(); noise(t, 0.012, "highpass", 3800, 1, 0.22); tone(t, open ? 880 : 620, open ? 1320 : 440, 0.07, "triangle", 0.05); },
    /** the deploy is complete: a soft major chord */
    chord() { if (!ok()) return; const t = T(); [392, 493.88, 587.33, 783.99].forEach((f, i) => tone(t + i * 0.07, f, null, 1.1, "sine", 0.06, 0.02)); },
    /** a server room breathing under everything, very low */
    humStart() {
      if (!ctx || !humOn) return;
      if (hum) { hum.gain.setTargetAtTime(0.5, ctx.currentTime, 1.2); return; }
      const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(master);
      const o1 = ctx.createOscillator(); o1.frequency.value = 55; const g1 = ctx.createGain(); g1.gain.value = 0.05; o1.connect(g1).connect(g);
      const o2 = ctx.createOscillator(); o2.frequency.value = 110.5; const g2 = ctx.createGain(); g2.gain.value = 0.018; o2.connect(g2).connect(g);
      const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 260; const g3 = ctx.createGain(); g3.gain.value = 0.03; s.connect(f).connect(g3).connect(g);
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07; const lg = ctx.createGain(); lg.gain.value = 0.012; lfo.connect(lg).connect(g3.gain);
      [o1, o2, s, lfo].forEach((n) => n.start());
      g.gain.setTargetAtTime(0.5, ctx.currentTime, 2.2);
      hum = g;
    },
  };
  return api;
})();
