/* ============================================================================
 * 6 · the opening: Hairline's own Laptop and Keyboard (@lucasmarkes/hairline,
 * MIT), driven by the visitor. Each typed letter sinks the real key cap,
 * because a figure hears the pointer from its stage, and we aim a pointer
 * event at that key's rest top using the figure's own projection. The live
 * terminal is mounted on the laptop's display, sheared to its exact
 * parallelogram. Inputs: HLIB (the hairline package).
 * ========================================================================== */
const DEV = (() => {
  const dev = $("[data-dev]"), lapEl = $("[data-lap]"), kbEl = $("[data-kb]"), scr = $("[data-scr]"), scrOut = $("[data-scr-out]");
  const hasLib = !!(HLIB && HLIB.keyboard && HLIB.laptop);
  const figs = [];
  if (hasLib) {
    figs.push(HLIB.laptop(lapEl, { intensity: 0.5, label: "A laptop, open; its screen runs the terminal" }));
    figs.push(HLIB.keyboard(kbEl, { intensity: 0.35, label: "A sixty-key keyboard; each key you type sinks" }));
  }
  // the figures' cameras, rebuilt from their sources so a world point maps to the same viewBox point they draw
  const cam = (azDeg, k, S, pts) => { const az = (azDeg * Math.PI) / 180, c = Math.cos(az), s = Math.sin(az), zf = Math.sqrt(1 - k * k); const P0 = (x, y, z) => [S * (x * c - y * s), S * ((x * s + y * c) * k - z * zf)]; let a = 1e9, b = -1e9, cc = 1e9, d = -1e9; for (const p of pts) { const q = P0(...p); a = Math.min(a, q[0]); b = Math.max(b, q[0]); cc = Math.min(cc, q[1]); d = Math.max(d, q[1]); } const ox = 200 - (a + b) / 2, oy = 166 - (cc + d) / 2; return (x, y, z) => { const q = P0(x, y, z); return [q[0] + ox, q[1] + oy]; }; };
  // keyboard (keyboard.ts): U 14, BZ 6, CASE 8, fifteen keys wide, five rows
  const U = 14, BZ = 6, CASE = 8, WK = 15, ROW_H = [12.6, 11.3, 10.4, 11, 11.8];
  const PK = cam(45, 0.5, 1.42, [[-BZ, -BZ, -CASE], [WK * U + BZ, 5 * U + BZ, -CASE], [WK * U + BZ, -BZ, -CASE], [-BZ, 5 * U + BZ, -CASE], [0, 0, ROW_H[0]]]);
  const L = (s) => s.split(" ").map((c) => [1, c]);
  const ROWS = [[[1, "Escape"], ...L("1 2 3 4 5 6 7 8 9 0 - ="), [2, "Backspace"]], [[1.5, "Tab"], ...L("q w e r t y u i o p [ ]"), [1.5, "\\"]], [[1.75, "CapsLock"], ...L("a s d f g h j k l ; '"), [2.25, "Enter"]], [[2.25, "Shift"], ...L("z x c v b n m , . /"), [2.75, "ShiftR"]], [[1.5, "Control"], [1, "Meta"], [1.5, "Alt"], [7, " "], [1.5, "AltR"], [1, "Fn"], [1.5, "ControlR"]]];
  const KEYPOS = {};
  ROWS.forEach((row, r) => { let x = 0; for (const [w, n] of row) { KEYPOS[n] = PK((x + w / 2) * U, (r + 0.5) * U, ROW_H[r]); x += w; } });
  const keyFor = (ch) => KEYPOS[ch] || KEYPOS[ch.toLowerCase()] || KEYPOS[{ ":": ";", '"': "'", _: "-", "+": "=", "?": "/", ">": ".", "<": ",", "~": "1" }[ch]] || null;
  // laptop (laptop.ts): W 150, D 106, lid at 100° at rest, the display inset by BZ 4.2 and a chin of 7.5
  const W = 150, D = 106, HB = 4, T = 2.4, HZ = HB + T / 2, LBZ = 4.2, CHIN = 7.5, VT = D - LBZ;
  const lidAt = (th) => { const c = Math.cos((th * Math.PI) / 180), s = Math.sin((th * Math.PI) / 180); return (u, v, w) => [u, v * c - w * s, HZ + v * s + w * c]; };
  const lpts = [[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, 0]];
  for (const th of [15, 90, 100, 125]) for (const u of [0, W]) for (const v of [0, D]) for (const w of [-T / 2, T / 2]) lpts.push(lidAt(th)(u, v, w));
  const PL = cam(45, 0.5, 1.3, lpts), on = (u, v) => PL(...lidAt(100)(u, v, -T / 2));
  const SW = 640, SH = Math.round((640 * (VT - CHIN)) / (W - 2 * LBZ));

  function fitScreen() {
    if (mobile) { scr.style.transform = ""; return; }
    const r = lapEl.getBoundingClientRect(), k = r.width / 400;
    const tl = on(LBZ + 1, VT - 1), tr = on(W - LBZ - 1, VT - 1), bl = on(LBZ + 1, CHIN + 1);
    const a = ((tr[0] - tl[0]) * k) / SW, b = ((tr[1] - tl[1]) * k) / SW, c = ((bl[0] - tl[0]) * k) / SH, d = ((bl[1] - tl[1]) * k) / SH;
    scr.style.width = SW + "px"; scr.style.height = SH + "px";
    scr.style.transform = `matrix(${a},${b},${c},${d},${tl[0] * k},${tl[1] * k})`;
  }
  let releaseT = 0;
  /** aim a pointer at the key for ch, on the keyboard's own stage, so Hairline sinks that cap */
  function press(ch) {
    if (!hasLib) return;
    const p = keyFor(ch); if (!p) return;
    const r = kbEl.getBoundingClientRect();
    const ev = (type) => kbEl.dispatchEvent(new PointerEvent(type, { clientX: r.left + (p[0] / 400) * r.width, clientY: r.top + (p[1] / 320) * r.height, pointerType: "mouse", bubbles: false }));
    ev("pointermove");
    clearTimeout(releaseT); releaseT = setTimeout(() => ev("pointerleave"), 150);
  }
  let readyT = 0;
  /** at the end of the command, Enter waits half-down and bright: Hairline's own rest pose */
  function ready(on) { clearTimeout(readyT); if (on) { const r = kbEl.getBoundingClientRect(); kbEl.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" })); } }
  /** the lid follows the pointer's height: aim low and it shuts */
  function closeLid() {
    if (!hasLib) return;
    const r = lapEl.getBoundingClientRect(), y = r.top + r.height * 0.92, x = r.left + r.width / 2;
    lapEl.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, pointerType: "mouse" }));
  }
  function render() {
    const last = TERM.lines.slice(mobile ? -9 : -11);
    let h = last.map((l) => `<div>${l.map(([t, c]) => `<span class="t-${c}">${t.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`).join("") || "&nbsp;"}</div>`).join("");
    if (TERM.showInput) h += `<div><span class="t-mute">${TERM.prompt}</span><span class="t-hi">${TERM.input.replace(/</g, "&lt;")}</span><span class="t-cur">█</span></div>`;
    scrOut.innerHTML = h;
  }
  /* the identity: a card rises out of the screen, prints as glyphs, develops into the photo, then docks */
  const card = $("[data-emerge]"), cardP = card.querySelector("[data-em-p]"), cardName = card.querySelector("[data-em-name]");
  let field = null;
  function screenRect() { const b = scr.getBoundingClientRect(), R = ROOT.getBoundingClientRect(); return { x: b.left - R.left, y: b.top - R.top, w: b.width, h: b.height }; }
  function emerge() {
    const s = screenRect(), R = ROOT.getBoundingClientRect();
    const w = Math.min(300, R.width * 0.62), h = w * 1.25, x = (R.width - w) / 2, y = Math.max(70, (R.height - h) / 2 - 30);
    card.style.cssText = `left:${s.x + s.w / 2 - 30}px;top:${s.y + s.h / 2 - 38}px;width:60px;height:76px`;
    card.setAttribute("data-on", ""); cardName.textContent = "";
    if (!field) field = asciiField(cardP.querySelector("canvas"), { cell: 8, reveal: true });
    field.reveal(0); develop(0);
    requestAnimationFrame(() => requestAnimationFrame(() => { card.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`; }));
    SFX.whoosh();
  }
  const reveal = (v) => field && field.reveal(v);
  const develop = (v) => card.style.setProperty("--dev", String(v));
  const name = (t) => { cardName.textContent = t; };
  function dock() {
    const R = ROOT.getBoundingClientRect(); chip.removeAttribute("hidden");
    const c = chip.querySelector("img").getBoundingClientRect();
    card.setAttribute("data-dock", "");
    card.style.cssText = `left:${c.left - R.left}px;top:${c.top - R.top}px;width:${c.width}px;height:${c.height}px`;
    SFX.whoosh();
    setTimeout(() => { card.removeAttribute("data-on"); card.removeAttribute("data-dock"); chip.setAttribute("data-docked", ""); SFX.latch(true); }, 820);
  }
  function leave() { dev.setAttribute("data-leaving", ""); setTimeout(closeLid, 250); setTimeout(() => dev.setAttribute("data-gone", ""), 1300); }
  return { press, ready, render, fitScreen, emerge, reveal, develop, name, dock, leave, hasLib, el: dev };
})();
