/* ============================================================================
 * 4 · terminal and identity.
 * One terminal model drawn twice: onto the monitor in the world, and into the
 * HUD as real text. The portrait is ASCII first (a nod to motes: glyphs that
 * answer the pointer) and the photo develops wherever the pointer shines.
 * ========================================================================== */
const TC = { fg: "#e4e4e7", mute: "#8b8b93", dim: "#52525b", ok: "#4ade80", warn: "#fbbf24", info: "#38bdf8", acc: "#c4b5fd", err: "#f87171", hi: "#ffffff" };
const TERM = {
  lines: [], input: "", prompt: "fahad@cuet:~$ ", showInput: true, portrait: null, ver: 0, listeners: new Set(),
  push(segs) { this.lines.push(typeof segs === "string" ? [[segs, "fg"]] : segs); if (this.lines.length > 400) this.lines.shift(); this.bump(); return this.lines.length - 1; },
  set(i, segs) { this.lines[i] = segs; this.bump(); },
  clear() { this.lines.length = 0; this.bump(); },
  bump() { this.ver++; this.listeners.forEach((f) => f()); },
};
const seg = (t, c = "fg") => [t, c];
const pad = (s, n) => (s + " ".repeat(n)).slice(0, n);

/* ---------- the portrait as glyphs ---------- */
const RAMP = " .:-=+*#%@";
const PORTRAIT = { ready: false, cols: 44, rows: 30, lum: null, img: null, mask: null };
(() => {
  const im = new Image();
  im.onload = () => {
    PORTRAIT.img = im;
    const C = PORTRAIT.cols, R = PORTRAIT.rows, c = document.createElement("canvas"); c.width = C; c.height = R;
    const x = c.getContext("2d"); x.drawImage(im, 0, 0, C, R);
    const px = x.getImageData(0, 0, C, R).data, lum = new Float32Array(C * R), bg = new Uint8Array(C * R), seen = new Uint8Array(C * R), q = [];
    for (let i = 0; i < C * R; i++) lum[i] = (0.3 * px[i * 4] + 0.59 * px[i * 4 + 1] + 0.11 * px[i * 4 + 2]) / 255;
    const sat = (i) => (Math.max(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]) - Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])) / 255;
    const isBg = (i) => lum[i] > 0.66 && sat(i) < 0.1;
    for (let i = 0; i < C; i++) q.push(i, (R - 1) * C + i);
    for (let r = 0; r < R; r++) q.push(r * C, r * C + C - 1);
    while (q.length) { const i = q.pop(); if (seen[i]) continue; seen[i] = 1; if (!isBg(i)) continue; bg[i] = 1; const cx = i % C, cy = (i / C) | 0; if (cx > 0) q.push(i - 1); if (cx < C - 1) q.push(i + 1); if (cy > 0) q.push(i - C); if (cy < R - 1) q.push(i + C); }
    // stretch the contrast of what is left, so the face reads in ten glyphs
    let lo = 1, hi = 0; for (let i = 0; i < C * R; i++) if (!bg[i]) { lo = Math.min(lo, lum[i]); hi = Math.max(hi, lum[i]); }
    for (let i = 0; i < C * R; i++) lum[i] = bg[i] ? 0 : 0.12 + 0.88 * Math.pow(clamp((lum[i] - lo) / (hi - lo || 1)), 0.9);
    PORTRAIT.lum = lum; PORTRAIT.mask = bg; PORTRAIT.ready = true; TERM.bump();
  };
  im.src = IMG.portrait;
})();
const glyphAt = (v) => RAMP[Math.min(RAMP.length - 1, Math.max(0, Math.floor(v * (RAMP.length - 0.01))))];

let termDirty = true;
TERM.listeners.add(() => { termDirty = true; });

/* ---------- the HUD terminal: the same lines as text you can select ---------- */
const hudOut = $("[data-term-out]"), hudIn = $("[data-term-in]");
let hudDrawn = 0;
function drawHud() {
  if (!hudOut) return;
  const last = TERM.lines.slice(-120);
  hudOut.innerHTML = last.map((l) => `<div>${l.map(([t, c]) => `<span class="t-${c}">${t.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`).join("") || "&nbsp;"}</div>`).join("");
  hudOut.scrollTop = hudOut.scrollHeight;
  hudDrawn = TERM.ver;
}

/* ---------- the identity card: glyphs that answer the pointer; the photo develops under it ---------- */
function asciiField(cv, opts = {}) {
  const x = cv.getContext("2d");
  let revealP = opts.reveal ? 0 : 1, W = 0, Hh = 0, cell = opts.cell || 9, cols = 0, rows = 0, energy = null, pointer = null, raf = 0, t = 0, prev = 0, alive = true, visible = true;
  const dpr = Math.min(2, devicePixelRatio || 1);
  function size() {
    const r = cv.getBoundingClientRect(); W = Math.max(1, r.width); Hh = Math.max(1, r.height);
    cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / cell); rows = Math.ceil(Hh / (cell * 1.45)); energy = new Float32Array(cols * rows);
  }
  const sample = (u, v) => { if (!PORTRAIT.ready) return 0; const c = Math.floor(u * PORTRAIT.cols), r = Math.floor(v * PORTRAIT.rows); if (c < 0 || r < 0 || c >= PORTRAIT.cols || r >= PORTRAIT.rows) return 0; return PORTRAIT.lum[r * PORTRAIT.cols + c]; };
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0.016; prev = now; t += REDUCED ? 0 : dt;
    const darkUI = getComputedStyle(cv).getPropertyValue("--ascii-dark").trim() === "1";
    x.clearRect(0, 0, W, Hh);
    x.font = `${cell * 1.25}px "Geist Mono", ui-monospace, monospace`; x.textAlign = "center"; x.textBaseline = "middle";
    const ch = cell * 1.45;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const u = (c + 0.5) / cols, v = (r + 0.5) / rows, i = r * cols + c;
      const face = v <= revealP + 0.001 ? sample(u, v) : 0;
      const head = opts.reveal && revealP < 1 && Math.abs(v - revealP) < 1.2 / rows && sample(u, v) > 0;
      // the procedural field: slow interfering waves, the "motes" under the face
      const amb = 0.5 + 0.5 * Math.sin(c * 0.33 + t * 0.9 + Math.sin(r * 0.21 + t * 0.4) * 2.2) * Math.cos(r * 0.27 - t * 0.6);
      let e = energy[i] * 0.92;
      if (pointer) { const dx = (c + 0.5) * cell - pointer[0], dy = (r + 0.5) * ch - pointer[1], d = Math.hypot(dx, dy); if (d < 90) e = Math.max(e, 1 - d / 90); }
      energy[i] = e;
      const val = clamp(face ? face * 0.92 + e * 0.25 : amb * 0.16 + e * 0.75);
      if (val < 0.05) continue;
      const g = glyphAt(val);
      const a = face ? 0.42 + 0.58 * face : 0.18 + 0.6 * e;
      x.fillStyle = head ? (darkUI ? '#ffffff' : '#0a0a0a') : e > 0.35 ? `rgba(124,92,255,${0.5 + 0.5 * e})` : darkUI ? `rgba(228,228,231,${a})` : `rgba(39,39,42,${a})`;
      x.fillText(g, (c + 0.5) * cell, (r + 0.5) * ch);
    }
  }
  size();
  const ro = new ResizeObserver(size); ro.observe(cv);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv);
  raf = requestAnimationFrame(frame);
  return {
    point(p) { pointer = p; },
    reveal(v) { revealP = v; },
    destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); },
  };
}
function identityCard(el, compact) {
  el.innerHTML = html`<div class="id-portrait" data-id-p><canvas class="id-ascii"></canvas><img class="id-photo" alt="Md Anawrul Kabir Fahad" src="${IMG.portrait}"><span class="id-hint">${matchMedia("(hover: hover)").matches ? "point to develop" : "tap to develop"}</span></div>
    <div class="id-meta"><p class="id-k"><i></i>pod/fahad-kabir · Running</p><h3>Md Anawrul Kabir Fahad</h3><p class="id-role">Mechanical Engineering, CUET · research software · GPU platforms</p>
    ${compact ? "" : html`<dl class="id-dl"><dt>labels</dt><dd>focus=scientific-ml · build=research-software · infra=gpu</dd><dt>node</dt><dd>cuet / mechanical (2022 →)</dd><dt>region</dt><dd>Dhaka, Bangladesh</dd></dl>`}
    <div class="id-links">${cvLinks()}<a href="${LINKS.github}" target="_blank" rel="noopener">GitHub</a><a href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a><button type="button" data-copy="${LINKS.email}">Copy email</button></div></div>`;
  const P = el.querySelector("[data-id-p]"), field = asciiField(P.querySelector("canvas"), { cell: compact ? 8 : 9 });
  const move = (e) => { const r = P.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top; field.point([mx, my]); P.style.setProperty("--mx", mx + "px"); P.style.setProperty("--my", my + "px"); P.setAttribute("data-lit", ""); };
  P.addEventListener("pointermove", move);
  P.addEventListener("pointerleave", () => { field.point(null); P.removeAttribute("data-lit"); });
  P.addEventListener("click", () => { P.toggleAttribute("data-full"); SFX.latch(P.hasAttribute("data-full")); });
  return field;
}
