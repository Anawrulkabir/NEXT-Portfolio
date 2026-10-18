/* eslint-disable */
// @ts-nocheck
/**
 * The site pages' figures and widgets, lifted from the v3 proposal: an isometric hairline engine with the
 * Stack, Lattice, Loupe and Slices figures, the snake trial strip, the PropBench relay, the reading rail
 * and the Work catalogue. mountSite(root) wires everything inside root and returns a cleanup function.
 */
const ICON = {"robot": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2.5\" y=\"4.5\" width=\"11\" height=\"8\" rx=\"2.5\"/><path d=\"M8 4.5V2\"/><circle cx=\"6\" cy=\"8.5\" r=\".6\" fill=\"currentColor\"/><circle cx=\"10\" cy=\"8.5\" r=\".6\" fill=\"currentColor\"/></svg>", "method": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 2h4M6.5 2v4L3 13a1 1 0 0 0 .9 1.5h8.2A1 1 0 0 0 13 13L9.5 6V2\"/></svg>", "result": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 13V8M8 13V3M13 13V6\"/></svg>", "next": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 8h10M9 4l4 4-4 4\"/></svg>", "window": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"3\" width=\"12\" height=\"10\" rx=\"2\"/><path d=\"M2 6.5h12\"/></svg>", "chip": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"4\" y=\"4\" width=\"8\" height=\"8\" rx=\"1.5\"/><path d=\"M6 2v2M10 2v2M6 12v2M10 12v2M2 6h2M2 10h2M12 6h2M12 10h2\"/></svg>", "bag": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3.5 5.5h9l-.8 8h-7.4z\"/><path d=\"M6 5.5V4a2 2 0 0 1 4 0v1.5\"/></svg>", "podium": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 13.5h12M3 13.5V9h3v4.5M6.5 13.5V6h3v7.5M10 13.5V8h3v5.5\"/></svg>", "all": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2.5\" y=\"2.5\" width=\"4.5\" height=\"4.5\" rx=\"1\"/><rect x=\"9\" y=\"2.5\" width=\"4.5\" height=\"4.5\" rx=\"1\"/><rect x=\"2.5\" y=\"9\" width=\"4.5\" height=\"4.5\" rx=\"1\"/><rect x=\"9\" y=\"9\" width=\"4.5\" height=\"4.5\" rx=\"1\"/></svg>", "x": "<svg width=\"14\" height=\"14\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M4 4l8 8M12 4l-8 8\"/></svg>"};
export function mountSite(root) {
  const off = [];
  const on = (t, type, fn, o) => { t.addEventListener(type, fn, o); off.push(() => t.removeEventListener(type, fn, o)); };
  /* ---------- engine: isometric projection, rounded solids, springs, one loop per visible figure ---------- */
  const NS = "http://www.w3.org/2000/svg", CC = Math.cos(Math.PI / 6), SS = 0.5;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let UID = 0;
  const mk = (t, a, p) => { const e = document.createElementNS(NS, t); if (a) for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const r2 = (v) => Math.round(v * 100) / 100;
  const D = (pts, close) => (pts.length ? "M" + pts.map((p) => r2(p[0]) + "," + r2(p[1])).join("L") + (close ? "Z" : "") : "");
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
  const proj = (K) => (x, y, z = 0) => [K * CC * (x - y), K * SS * (x + y) - K * z];
  const spring = (o, target, dt, w) => { const a = w * w * (target - o.x) - 2 * w * o.v; o.v += a * dt; o.x += o.v * dt; return o.x; };
  function ring(x0, y0, x1, y1, r, n = 6) {
    const o = [];
    for (const [cx, cy, a0] of [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]])
      for (let i = 0; i <= n; i++) { const a = ((a0 + (90 * i) / n) * Math.PI) / 180; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return o;
  }
  function circ(cx, cy, r, n = 24) { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return o; }
  /** The half of a rim nearer the viewer: split at its left and right extremes on screen. */
  function frontHalf(pts) {
    let l = 0, r = 0;
    pts.forEach((p, i) => { if (p[0] < pts[l][0]) l = i; if (p[0] > pts[r][0]) r = i; });
    const walk = (a, b) => { const o = []; for (let i = a; ; i = (i + 1) % pts.length) { o.push(pts[i]); if (i === b) break; } return o; };
    const h1 = walk(l, r), h2 = walk(r, l), avg = (h) => h.reduce((s, p) => s + p[1], 0) / h.length;
    return avg(h1) > avg(h2) ? h1 : h2.reverse();
  }
  /** A solid: a filled top and a filled band, so it hides whatever was drawn behind it; one silhouette, one crease. */
  class Solid {
    constructor(parent, cls) {
      this.g = mk("g", cls ? { class: cls } : null, parent);
      this.band = mk("path", { class: "s-band" }, this.g);
      this.side = mk("path", { class: "s-edge" }, this.g);
      this.top = mk("path", { class: "s-top" }, this.g);
    }
    set(P, pts, z, h) {
      const top = pts.map((q) => P(q[0], q[1], z + h));
      this.top.setAttribute("d", D(top, true));
      if (h > 0.005) {
        const bot = pts.map((q) => P(q[0], q[1], z)), ft = frontHalf(top), fb = frontHalf(bot);
        this.band.setAttribute("d", D([...ft, ...fb.slice().reverse()], true));
        this.side.setAttribute("d", D(fb) + D([ft[0], fb[0]]) + D([ft[ft.length - 1], fb[fb.length - 1]]));
        this.band.style.display = this.side.style.display = "";
      } else this.band.style.display = this.side.style.display = "none";
    }
  }
  /** The floor: a dot every half unit and a rule every unit, seen through a soft isometric disc. */
  function floor(svg, P, N, K) {
    const id = "f" + ++UID, defs = mk("defs", null, svg);
    const g = mk("radialGradient", { id: id + "g", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: `matrix(${K * CC * N} ${K * SS * N} ${-K * CC * N} ${K * SS * N} 0 0)` }, defs);
    mk("stop", { offset: 0.3, "stop-color": "#fff" }, g);
    mk("stop", { offset: 1, "stop-color": "#fff", "stop-opacity": 0 }, g);
    const m = mk("mask", { id: id + "m", maskUnits: "userSpaceOnUse", x: -700, y: -700, width: 1400, height: 1400 }, defs);
    mk("rect", { x: -700, y: -700, width: 1400, height: 1400, fill: `url(#${id}g)` }, m);
    const fl = mk("g", { mask: `url(#${id}m)` }, svg);
    let d = "";
    for (let i = -N * 2; i <= N * 2; i++) for (let j = -N * 2; j <= N * 2; j++) { if (i % 2 === 0 && j % 2 === 0) continue; const [x, y] = P(i / 2, j / 2); d += `M${r2(x)},${r2(y)}h.01`; }
    mk("path", { d, class: "floor-dots" }, fl);
    let rl = "";
    for (let i = -N; i <= N; i++) rl += D([P(i, -N), P(i, N)]) + D([P(-N, i), P(N, i)]);
    mk("path", { d: rl, class: "floor-rule" }, fl);
  }
  function airfoil(x0, yc0, c, t = 0.13, m = 0.045, pp = 0.4) {
    const up = [], lo = [];
    for (let i = 0; i <= 24; i++) {
      const b = (i / 24) * Math.PI, xc = (1 - Math.cos(b)) / 2;
      const yt = 5 * t * (0.2969 * Math.sqrt(xc) - 0.126 * xc - 0.3516 * xc * xc + 0.2843 * xc ** 3 - 0.1015 * xc ** 4);
      const yc = xc < pp ? (m / (pp * pp)) * (2 * pp * xc - xc * xc) : (m / (1 - pp) ** 2) * (1 - 2 * pp + 2 * pp * xc - xc * xc);
      up.push([x0 + c * xc, yc0 - (yc + yt) * c]);
      lo.push([x0 + c * xc, yc0 - (yc - yt) * c]);
    }
    return [...up, ...lo.reverse().slice(1, -1)];
  }
  function streamline(y0, yc0, x0 = -3, x1 = 3) {
    const o = [], s = Math.sign(y0 - yc0);
    for (let x = x0; x <= x1 + 1e-6; x += 0.25) o.push([x, y0 + (s * 0.42 * Math.exp(-(((x + 0.2) / 1.5) ** 2))) / (1 + 0.9 * Math.abs(y0 - yc0))]);
    return o;
  }
  const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  const FIGS = {};

  /* ---------- Stack: three plates, mechanics, compute, software ---------- */
  FIGS.stack = {
    vb: "-232 -212 464 371", label: "Three plates stacked: an airfoil in a flow, a GPU cut into six slices, and a notebook with a plot",
    tour: [[0, 70], [0, -10], [0, -95], [0, -10]],
    build(svg, st) {
      const K = 29, P = proj(K), A = 3.4, B = 2.4, R = 0.6, T = 0.2, Z = [0.7, 2.05, 3.4];
      floor(svg, P, 7, K);
      const RIM = ring(-A, -B, A, B, R, 8);
      mk("path", { class: "foot-line", d: D(RIM.map((q) => P(q[0], q[1])), true) }, svg);
      const shade = mk("path", { class: "shade", d: D(ring(-A + 0.15, -B + 0.15, A - 0.15, B - 0.15, R).map((q) => P(q[0], q[1])), true) }, svg);
      const PARTS = [[], [], []];
      const yc0 = 0.15;
      PARTS[0].push({ pts: airfoil(-1.95, yc0, 3.6), closed: true, hot: true, lit: true });
      for (const y0 of [-1.75, -1.05, 1.2, 1.9]) PARTS[0].push({ pts: streamline(y0, yc0), hot: true });
      PARTS[1].push({ pts: ring(-1.35, -1.05, 1.35, 1.05, 0.18), closed: true, hot: true });
      let k = 0;
      for (const y of [-0.88, 0.06]) for (const x of [-1.18, -0.38, 0.42]) PARTS[1].push({ pts: ring(x, y, x + 0.76, y + 0.82, 0.08, 3), closed: true, hot: true, tile: k++ });
      for (let i = 0; i < 5; i++) { const y = -0.8 + i * 0.4; PARTS[1].push({ pts: [[-3, y], [-1.35, y]] }); PARTS[1].push({ pts: [[1.35, y], [3, y]] }); }
      PARTS[2].push({ pts: ring(-3, -2.0, -2.6, -1.74, 0.06, 2), closed: true });
      PARTS[2].push({ pts: [[-2.4, -1.87], [0.7, -1.87]], hot: true }, { pts: [[-2.4, -1.6], [-0.5, -1.6]], hot: true });
      PARTS[2].push({ pts: ring(-3, -1.3, -2.6, -1.04, 0.06, 2), closed: true });
      PARTS[2].push({ pts: [[-2.4, -1.17], [1.5, -1.17]], hot: true }, { pts: [[-2.4, -0.9], [0.1, -0.9]], hot: true });
      PARTS[2].push({ pts: [[-2.4, -0.45], [-2.4, 1.95], [2.95, 1.95]] });
      const curve = []; for (let x = -2.3; x <= 2.85; x += 0.15) curve.push([x, 1.9 - 1.95 * Math.exp(-((x - 0.15) ** 2) / 1.5)]);
      PARTS[2].push({ pts: curve, hot: true, lit: true });
      const plates = Z.map((_, i) => {
        const g = mk("g", null, svg), s = new Solid(g), pg = mk("g", null, g);
        return { g, s, o: { x: i ? Z[i - 1] : -0.4, v: 0 }, parts: PARTS[i].map((w) => ({ ...w, el: mk("path", { class: "ln" }, pg) })) };
      });
      let hover = -1;
      const NAMES = ["layer 1 · flow over an airfoil", "layer 2 · one GPU, six slices", "layer 3 · a notebook and its plot"];
      return {
        frame(dt, p, st) {
          let h = -1;
          if (p && Math.abs(p[0]) < 210) { let best = 1e9; plates.forEach((pl, i) => { const d = Math.abs(p[1] - P(0, 0, pl.o.x + T)[1] - 40); if (d < best) { best = d; h = i; } }); }
          hover = h;
          const gap = 0.55 + 1.25 * st.I, cur = Math.floor(st.t / 1.3) % 6;
          plates.forEach((pl, i) => {
            const born = st.still || st.t > 0.2 + i * 0.42;
            const tgt = born ? Z[i] + (h >= 0 && i > h ? gap : 0) + (h < 0 && !st.still ? Math.sin(st.t * 1.05) * (0.05 + 0.06 * i) : 0) : pl.o.x;
            if (st.still) { pl.o.x = tgt; pl.o.v = 0; } else spring(pl.o, tgt, dt, 8.5);
            pl.g.style.opacity = born ? 1 : 0;
            const z = pl.o.x + T;
            pl.s.set(P, RIM, pl.o.x, T);
            for (const w of pl.parts) {
              w.el.setAttribute("d", D(w.pts.map((q) => P(q[0], q[1], z)), w.closed));
              const lit = (h === i && w.hot && w.tile === undefined) || (w.tile !== undefined && (h === i || h < 0) && w.tile === cur) || (h < 0 && w.lit);
              w.el.classList.toggle("lit", !!lit);
            }
          });
          shade.style.opacity = String(0.55 * clamp(plates[0].o.x / Z[0]));
        },
        read: () => (hover < 0 ? "hover a layer" : NAMES[hover]),
      };
    },
  };

  /* ---------- Lattice: the snake robot among posts ---------- */
  const STEP2 = [5, 4, 1, 2, 5, 0, 0], H1 = { 0: 10, 2: 8, 3: 6, 4: 10 };
  FIGS.snake = {
    vb: "-232 -184 464 371", label: "A seven-segment snake robot weaving through a lattice of posts; the pointer sets its compliance",
    tour: [[-175, 0], [-55, 0], [5, 0], [175, 0], [60, 0]],
    build(svg, st) {
      const K = 27, P = proj(K), A = 4.6, B = 3.3, T = 0.22, L = 0.76, RAD = 0.2, PH = 0.5;
      new Solid(svg).set(P, ring(-A, -B, A, B, 0.55, 8), 0, T);
      const world = mk("g", null, svg);
      const s = 1.3, rowH = s * 0.866, lo = -A + 0.45, hiX = A - 0.45, n = Math.ceil((hiX - lo) / s) + 1, span = n * s;
      const posts = [];
      for (let j = 0; ; j++) { const y = -B + 0.6 + j * rowH; if (y > B - 0.5) break; for (let i = 0; i < n; i++) posts.push({ x0: lo + (j % 2) * (s / 2) + i * s, y, sol: new Solid(world) }); }
      const segs = [];
      for (let i = 0; i < 7; i++) { const g = mk("g", null, world); segs.push({ g, o: mk("path", { class: "cap-o" + (i === 0 ? " lit" : "") }, g), i: mk("path", { class: "cap-i" }, g), j: mk("circle", { class: "joint", r: 1.7 }, g) }); }
      const G = { x: 0.75, v: 0 }, beta = new Array(6).fill(0);
      let u = 0, shown = 0.75;
      return {
        frame(dt, p, st) {
          if (p) spring(G, clamp((p[0] + 190) / 380) * 1.5, dt, 9);
          const g = clamp(G.x, 0, 1.5);
          shown = g;
          if (!st.still) u += dt * 0.34;
          const amp = 0.42 + 0.38 * st.I, om = 2.3, kap = 0.95, stiff = lerp(30, 2.4, g / 1.5), t = st.still ? 0.6 : st.t;
          for (let i = 0; i < 6; i++) { const a = amp * Math.sin(om * t - kap * i) * (1 - (0.35 * g) / 1.5); beta[i] = st.still ? a : beta[i] + (a - beta[i]) * clamp(dt * stiff); }
          const th = [0.5 * amp * Math.sin(om * t + 0.9)];
          for (let i = 0; i < 6; i++) th.push(th[i] + beta[i]);
          const pts = [[0, 0]];
          for (let i = 0; i < 7; i++) pts.push([pts[i][0] - L * Math.cos(th[i]), pts[i][1] - L * Math.sin(th[i])]);
          // keep the body heading along +x, centred on the plate
          const ang = Math.atan2(pts[0][1] - pts[7][1], pts[0][0] - pts[7][0]), ca = Math.cos(-ang), sa = Math.sin(-ang);
          let mx = 0, my = 0;
          for (const q of pts) { const x = q[0] * ca - q[1] * sa, y = q[0] * sa + q[1] * ca; q[0] = x; q[1] = y; mx += x; my += y; }
          mx /= 8; my /= 8;
          for (const q of pts) { q[0] += 0.3 - mx; q[1] -= my; }
          const items = [];
          for (const pt of posts) {
            const x = lo + ((((pt.x0 - u - lo) % span) + span) % span);
            const f = clamp(Math.min(x - lo, hiX - x) / 0.7);
            if (f <= 0.02) { pt.sol.g.style.display = "none"; continue; }
            pt.sol.g.style.display = "";
            pt.sol.set(P, circ(x, pt.y, RAD, 14), T, PH * f);
            items.push([x + pt.y, pt.sol.g]);
          }
          const W = K * 0.37, z = T + 0.22;
          segs.forEach((sg, i) => {
            const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1];
            const pa = P(a[0] + dx * 0.07, a[1] + dy * 0.07, z), pb = P(b[0] - dx * 0.07, b[1] - dy * 0.07, z);
            const d = `M${r2(pa[0])},${r2(pa[1])}L${r2(pb[0])},${r2(pb[1])}`;
            sg.o.setAttribute("d", d); sg.o.setAttribute("stroke-width", W + 2.2);
            sg.i.setAttribute("d", d); sg.i.setAttribute("stroke-width", W);
            const pj = P(a[0], a[1], z);
            sg.j.setAttribute("cx", r2(pj[0])); sg.j.setAttribute("cy", r2(pj[1]));
            sg.j.style.display = i === 0 ? "none" : "";
            items.push([(a[0] + b[0]) / 2 + (a[1] + b[1]) / 2 + 0.05, sg.g]);
          });
          items.sort((a, b) => a[0] - b[0]);
          for (const [, el] of items) world.appendChild(el);
        },
        read() {
          const idx = Math.round(shown / 0.25), gs = idx * 0.25, word = idx === 0 ? "stiff" : idx >= 5 ? "loose" : "partly compliant";
          return `G ${gs.toFixed(2)} · ${word} · calibration ${STEP2[idx]}/5` + (H1[idx] !== undefined ? ` · fresh seeds ${H1[idx]}/10` : "");
        },
      };
    },
  };

  /* ---------- Loupe: three datasets under a stand magnifier ---------- */
  FIGS.loupe = {
    vb: "-232 -184 464 371", label: "A stand loupe over a sheet with a fitted curve and three datasets",
    tour: [[-95, -10], [5, 35], [70, 10], [125, -25], [-25, -55]],
    build(svg, st) {
      const K = 33, P = proj(K), A = 3.8, B = 2.8, T = 0.2, id = "l" + ++UID;
      new Solid(svg).set(P, ring(-A, -B, A, B, 0.45, 8), 0, T);
      const defs = mk("defs", null, svg);
      const sheet = mk("g", { id: id + "s" }, svg);
      mk("path", { class: "ln", d: D([P(-3.2, -2.3, T), P(-3.2, 2.25, T), P(3.3, 2.25, T)]) }, sheet);
      let ticks = "";
      for (let x = -2.2; x <= 3.0; x += 1) ticks += D([P(x, 2.25, T), P(x, 2.42, T)]);
      for (let y = -1.3; y <= 1.8; y += 1) ticks += D([P(-3.2, y, T), P(-3.37, y, T)]);
      mk("path", { class: "ln", d: ticks }, sheet);
      const f = (x) => 1.85 - 3.7 * Math.pow(clamp((x + 3.1) / 6.3), 0.8);
      const cv = []; for (let x = -3.05; x <= 3.2; x += 0.12) cv.push(P(x, f(x), T));
      mk("path", { class: "ln lit", d: D(cv) }, sheet);
      const rnd = mulberry(11);
      const SETS = [
        { name: "tuhin2024_liquid", n: 24, x0: -3.0, x1: 0.9, shape: "o" },
        { name: "tuhin2024_vapor", n: 21, x0: -0.4, x1: 3.1, shape: "s" },
        { name: "duan1999_satliq", n: 18, x0: -2.2, x1: 1.6, shape: "t" },
      ];
      for (const ds of SETS) {
        ds.pts = []; let d = "";
        for (let k = 0; k < ds.n; k++) {
          const x = ds.x0 + ((ds.x1 - ds.x0) * k) / (ds.n - 1) + (rnd() - 0.5) * 0.08;
          const y = f(x) + (rnd() - 0.5) * 0.09 + (ds.shape === "t" && x > 0.15 && x < 1.6 ? -0.24 : 0);
          ds.pts.push([x, y]);
          const sh = ds.shape === "o" ? circ(x, y, 0.075, 10) : ds.shape === "s" ? [[x - 0.07, y - 0.07], [x + 0.07, y - 0.07], [x + 0.07, y + 0.07], [x - 0.07, y + 0.07]] : [[x, y - 0.09], [x + 0.08, y + 0.06], [x - 0.08, y + 0.06]];
          d += D(sh.map((q) => P(q[0], q[1], T)), true);
        }
        mk("path", { class: "ln", d }, sheet);
      }
      const shadow = mk("path", { class: "shade" }, svg);
      shadow.style.opacity = "0.6";
      const foot = new Solid(svg), stem = mk("path", { class: "s-edge" }, svg), lens = new Solid(svg);
      const clip = mk("clipPath", { id: id + "c", clipPathUnits: "userSpaceOnUse" }, defs), clipE = mk("ellipse", null, clip);
      const mag = mk("g", { "clip-path": `url(#${id}c)` }, svg), use = mk("use", { href: "#" + id + "s" }, mag);
      const rim = mk("path", { class: "s-edge" }, svg);
      const c = { x: { x: 0.4, v: 0 }, y: { x: 0.3, v: 0 } };
      let state = "63 points · 3 datasets";
      return {
        frame(dt, p, st) {
          let tx = c.x.x, ty = c.y.x;
          if (p) { const a = p[0] / (K * CC), b = (p[1] + K * (T + 0.9)) / (K * SS); tx = (a + b) / 2; ty = (b - a) / 2; }
          tx = clamp(tx, -3.0, 3.1); ty = clamp(ty, -2.1, 2.1);
          if (st.still) { c.x.x = tx; c.y.x = ty; } else { spring(c.x, tx, dt, 10); spring(c.y, ty, dt, 10); }
          const cx = c.x.x, cy = c.y.x, r = 0.95, H = 1.35, m = 1.3 + 1.2 * st.I;
          shadow.setAttribute("d", D(circ(cx + 0.12, cy + 0.12, r * 0.92, 28).map((q) => P(q[0], q[1], T)), true));
          const fx = cx + 1.25, fy = cy - 1.05;
          foot.set(P, circ(fx, fy, 0.3, 16), T, 0.1);
          stem.setAttribute("d", D([P(fx, fy, T + 0.1), P(fx, fy, T + H * 0.72), P(cx + 0.68, cy - 0.68, T + H)]));
          lens.set(P, circ(cx, cy, r, 32), T + H - 0.08, 0.08);
          const Lc = P(cx, cy, T + H), F = P(cx, cy, T);
          use.setAttribute("transform", `translate(${r2(Lc[0])} ${r2(Lc[1])}) scale(${r2(m)}) translate(${r2(-F[0])} ${r2(-F[1])})`);
          clipE.setAttribute("cx", r2(Lc[0])); clipE.setAttribute("cy", r2(Lc[1]));
          clipE.setAttribute("rx", r2(K * CC * r * Math.SQRT2 * 0.97)); clipE.setAttribute("ry", r2(K * SS * r * Math.SQRT2 * 0.97));
          rim.setAttribute("d", D(circ(cx, cy, r, 32).map((q) => P(q[0], q[1], T + H)), true));
          if (cx > 0.15 && cx < 1.55 && Math.abs(cy - f(cx)) < 0.9) state = "overlap near 333 K · offset +7.4 % (95 %: 3.1–11.8)";
          else {
            let best = 1e9, who = null;
            for (const ds of SETS) for (const q of ds.pts) { const d = (q[0] - cx) ** 2 + (q[1] - cy) ** 2; if (d < best) { best = d; who = ds; } }
            state = best < 0.5 ? `${who.name} · ${who.n} points` : "63 points · 3 datasets";
          }
        },
        read: () => state,
      };
    },
  };

  /* ---------- Slices: one GPU, six 8 GB slices ---------- */
  FIGS.gpu = {
    vb: "-232 -172 464 344", label: "A GPU board with a turning fan and six memory slices; the pointer lifts one",
    build(svg, st) {
      const K = 31, P = proj(K), A = 4.3, B = 2.0, T = 0.16, FX = 2.25;
      new Solid(svg).set(P, ring(-A, -B, A, B, 0.22, 6), 0, T);
      let fing = ""; for (let x = -3.6; x <= -0.55; x += 0.22) fing += D([P(x, B - 0.32, T), P(x, B - 0.08, T)]);
      mk("path", { class: "ln", d: fing }, svg);
      new Solid(svg).set(P, circ(FX, 0, 1.55, 40), T, 0.12);
      mk("path", { class: "ln", d: D(circ(FX, 0, 1.38, 40).map((q) => P(q[0], q[1], T + 0.12)), true) }, svg);
      const blades = mk("path", { class: "ln" }, svg), hub = new Solid(svg);
      hub.set(P, circ(FX, 0, 0.34, 18), T + 0.12, 0.08);
      new Solid(svg).set(P, ring(-3.0, -1.45, 0.35, 1.45, 0.16, 4), T, 0.22);
      const slices = [];
      for (const y of [-1.28, 0.06]) for (const x of [-2.82, -1.72, -0.62]) slices.push({ pts: ring(x, y, x + 0.98, y + 1.2, 0.1, 3), cx: x + 0.49, cy: y + 0.6, o: { x: 0, v: 0 } });
      slices.sort((a, b) => a.cx + a.cy - (b.cx + b.cy));
      const order = [...slices].sort((a, b) => a.cy - b.cy || a.cx - b.cx);
      slices.forEach((s) => { s.sol = new Solid(svg); s.n = order.indexOf(s); });
      const tour = order.map((s) => P(s.cx, s.cy, T + 0.5));
      let pick = -1, ang = 0;
      const fig = {
        tour,
        frame(dt, p, st) {
          if (!st.still) ang += dt * 2.2;
          pick = -1;
          if (p) { let best = 1e9; slices.forEach((s) => { const q = P(s.cx, s.cy, T + 0.5); const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2; if (d < best) { best = d; pick = s.n; } }); if (best > 130 * 130) pick = -1; }
          for (const s of slices) {
            const tgt = s.n === pick ? 0.25 + 1.05 * st.I : 0;
            if (st.still) s.o.x = tgt; else spring(s.o, tgt, dt, 11);
            s.sol.set(P, s.pts, T + 0.22, 0.1 + Math.max(0, s.o.x));
            s.sol.top.classList.toggle("lit", s.n === pick);
          }
          let d = "";
          for (let b = 0; b < 7; b++) { const a0 = ang + (b / 7) * Math.PI * 2, line = []; for (let k = 0; k <= 5; k++) { const q = k / 5, a = a0 + q * 0.75, r = 0.42 + 0.9 * q; line.push(P(FX + r * Math.cos(a), r * Math.sin(a), T + 0.16)); } d += D(line); }
          blades.setAttribute("d", d);
        },
        read: () => (pick < 0 ? "one RTX 4090 · 6 × 8 GB" : `slice ${pick + 1} of 6 · 8 GB · isolated by HAMi`),
      };
      return fig;
    },
  };

  /* ---------- the other eight projects: one object each that answers the pointer and teaches one true thing ---------- */
  const VB8 = "-232 -180 464 371";
  const base = (svg, P) => new Solid(svg).set(P, ring(-3.6, -2.6, 3.6, 2.6, 0.5, 8), 0, 0.18);
  const line = (svg, P, pts, z, closed, cls = "ln") => mk("path", { class: cls, d: D(pts.map((q) => P(q[0], q[1], z)), closed) }, svg);
  const ease = (o, tgt, dt, st, w) => { if (st.still) { o.x = tgt; o.v = 0; } else spring(o, tgt, dt, w); return o.x; };

  /* Thesis: pitch the airfoil; past the surrogate's training range the flow over the top separates */
  FIGS.airfoil = {
    vb: VB8, label: "An airfoil in a flow; moving across the figure changes its angle of attack",
    build(svg, st) {
      const K = 27, P = proj(K), Z = 0.18, Y0 = [-1.9, -1.2, 1.4, 2.0];
      base(svg, P);
      const lines = Y0.map(() => mk("path", { class: "ln" }, svg)), foil = new Solid(svg), F = airfoil(-1.9, 0.15, 3.6);
      const a = { x: 4, v: 0 }; let goal = 4;
      const turn = (pts, deg) => { const r = (-deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r), cx = -0.3, cy = 0.15; return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]); };
      return {
        tour: [[-170, 0], [170, 0]],
        frame(dt, p, st) {
          if (p) goal = clamp(Math.round(lerp(-4, 18, (p[0] + 190) / 380) * 2) / 2, -4, 18);
          ease(a, goal, dt, st, 7);
          const sep = a.x > 12;
          lines.forEach((el, i) => {
            const y0 = Y0[i], up = y0 < 0.15;
            const pts = streamline(y0, 0.15, -3.2, 3.2).map(([x, y]) => {
              let yy = y - 0.035 * a.x * Math.exp(-(((x + 0.2) / 1.7) ** 2)) * (up ? 1 : 0.6);
              if (sep && up && x > -0.2) yy += Math.sin(x * 4.2 - st.t * 6) * 0.16 * ((x + 0.2) / 3.4) * Math.min(1, (a.x - 12) / 4);
              return [x, yy];
            });
            el.setAttribute("d", D(pts.map((q) => P(q[0], q[1], Z))));
            el.classList.toggle("lit", sep && up);
          });
          foil.set(P, turn(F, a.x), Z, 0.9);
          foil.top.classList.toggle("lit", sep);
        },
        read: () => `${Math.round(a.x * 2) / 2}° · ${a.x > 12 ? "outside the training range: adapted with low-rank updates, forgetting measured" : "inside the surrogate's training range"}`,
      };
    },
  };

  /* Refrigerant papers: a plate heat exchanger whose plates lift apart above the pointer */
  FIGS.hx = {
    vb: VB8, label: "A plate heat exchanger; pointing at the stack lifts the plates apart to show the channels",
    build(svg, st) {
      const K = 27, P = proj(K), N = 6, PL = ring(-1.5, -2.3, 1.5, 2.3, 0.3);
      base(svg, P);
      const plates = Array.from({ length: N }, (_, i) => ({ i, s: new Solid(svg), o: { x: 0, v: 0 } }));
      const ports = mk("path", { class: "ln" }, svg);
      let pick = -1;
      return {
        tour: [[0, 60], [0, -10], [0, -80]],
        frame(dt, p, st) {
          // the plate is chosen from the pointer's height over the whole figure, never from the moving plates
          pick = p && Math.abs(p[0]) < 170 ? clamp(N - 1 - Math.floor((p[1] + 130) / (240 / N)), 0, N - 1) : -1;
          let top = 0;
          plates.forEach((pl) => {
            const lift = ease(pl.o, pick >= 0 && pl.i > pick ? 0.45 + 0.9 * st.I : 0, dt, st, 9);
            const z = 0.3 + pl.i * 0.3 + lift;
            pl.s.set(P, PL, z, 0.07); pl.s.top.classList.toggle("lit", pl.i === pick);
            top = z + 0.07;
          });
          let d = ""; for (const [x, y] of [[-0.9, -1.7], [0.9, -1.7], [-0.9, 1.7], [0.9, 1.7]]) d += D(circ(x, y, 0.26, 14).map((q) => P(q[0], q[1], top)), true);
          ports.setAttribute("d", d);
        },
        read: () => (pick < 0 ? "two low-GWP refrigerants · one industrial plate heat exchanger" : `channel ${pick + 1} · ${pick % 2 === 0 ? "refrigerant side (R455A evaporating, R1336mzz(E) condensing)" : "water side"}`),
      };
    },
  };

  /* CF₃I: three published datasets around one updated model, on a chart card standing on the plate; the pointer reads the points near it */
  FIGS.curve = {
    vb: VB8, label: "Viscosity data from three published datasets around a fitted curve; the pointer reads the points near it",
    build(svg, st) {
      const K = 27, P = proj(K), X0 = -2.4, X1 = 2.4, f = (x) => 0.5 + 1.75 * Math.pow((x - X0) / (X1 - X0), 0.75);
      base(svg, P);
      // the card stands on the plate's diagonal, square to the viewer: temperature runs across, viscosity goes up
      const V = (u, z) => P(u / Math.SQRT2, -u / Math.SQRT2, z);
      mk("path", { class: "s-edge", d: D([V(X0 - 0.2, 0.18), V(X0 - 0.2, 2.5), V(X1 + 0.2, 2.5), V(X1 + 0.2, 0.18)]) }, svg);
      mk("path", { class: "ln", d: D([V(X0, 2.35), V(X0, 0.3), V(X1, 0.3)]) }, svg);
      const c = []; for (let x = X0 + 0.1; x <= X1; x += 0.15) c.push(V(x, f(x)));
      mk("path", { class: "ln lit", d: D(c) }, svg);
      const rnd = mulberry(7), marks = [];
      [21, 21, 21].forEach((n, k) => { for (let i = 0; i < n; i++) {
        const x = X0 + 0.25 + ((X1 - X0 - 0.5) * i) / (n - 1) + (rnd() - 0.5) * 0.12, [sx, sy] = V(x, f(x) + (k - 1) * 0.15 + (rnd() - 0.5) * 0.16);
        const el = k === 0 ? mk("circle", { cx: r2(sx), cy: r2(sy), r: 2.6, class: "ln" }, svg) : mk("path", { class: "ln", d: k === 1 ? `M${r2(sx - 2.4)},${r2(sy - 2.4)}h4.8v4.8h-4.8Z` : `M${r2(sx)},${r2(sy - 3.2)}l3,5.2h-6Z` }, svg);
        marks.push({ el, sx, sy, k });
      } });
      const cursor = mk("path", { class: "foot-line" }, svg);
      let near = [];
      return {
        tour: [4, 31, 58].map((k) => [marks[k].sx, marks[k].sy]),
        frame(dt, p) {
          near = [];
          marks.forEach((m) => { const on = !!p && Math.hypot(m.sx - p[0], m.sy - p[1]) < 14; m.el.classList.toggle("lit", on); if (on) near.push(m.k); });
          cursor.setAttribute("d", p ? `M${r2(p[0])},-150V170` : "");
        },
        read: () => (near.length ? `${near.length} point${near.length > 1 ? "s" : ""} here · from dataset${new Set(near).size > 1 ? "s" : ""} ${[...new Set(near)].sort().map((k) => k + 1).join(" and ")} of 3` : "63 published points · 3 datasets · one updated model"),
      };
    },
  };

  /* Robo soccer: the pointer drives the 2022 bot; push the ball far enough and it's a goal */
  FIGS.soccer = {
    vb: VB8, label: "The 2022 soccer robot on a pitch; moving across the figure drives it into the ball",
    build(svg, st) {
      const K = 27, P = proj(K), Z = 0.18;
      base(svg, P);
      mk("path", { class: "ln", d: D(ring(-3.2, -2.2, 3.2, 2.2, 0.05, 1).map((q) => P(q[0], q[1], Z)), true) + D([P(0, -2.2, Z), P(0, 2.2, Z)]) + D(circ(0, 0, 0.7, 28).map((q) => P(q[0], q[1], Z)), true) + D([[3.2, -0.9], [2.6, -0.9], [2.6, 0.9], [3.2, 0.9]].map((q) => P(q[0], q[1], Z))) }, svg);
      const tyreFar = new Solid(svg), body = new Solid(svg), deck = mk("path", { class: "ln" }, svg), tyreNear = new Solid(svg), ball = new Solid(svg);
      const bx = { x: -2, v: 0 }; let goal = -2, bl = 0.8, scored = false;
      return {
        tour: [[-170, 0], [170, 0]],
        frame(dt, p, st) {
          if (p) goal = clamp(lerp(-2.5, 2.2, (p[0] + 170) / 340), -2.5, 2.2);
          ease(bx, goal, dt, st, 6);
          const front = bx.x + 0.72;
          bl = front > bl - 0.26 ? Math.min(3.0, front + 0.26) : Math.max(0.8, bl - (st.still ? 9 : dt * 0.6) * (p ? 0 : 1));
          scored = bl >= 2.75;
          tyreFar.set(P, ring(bx.x - 0.5, -0.66, bx.x + 0.5, -0.5, 0.06, 2), Z, 0.42);
          body.set(P, ring(bx.x - 0.72, -0.5, bx.x + 0.72, 0.5, 0.14, 3), Z + 0.12, 0.42);
          deck.setAttribute("d", D(ring(bx.x - 0.4, -0.28, bx.x + 0.3, 0.28, 0.06, 2).map((q) => P(q[0], q[1], Z + 0.54)), true));
          tyreNear.set(P, ring(bx.x - 0.5, 0.5, bx.x + 0.5, 0.66, 0.06, 2), Z, 0.42);
          ball.set(P, circ(bl, 0, 0.22, 16), Z, 0.4); ball.top.classList.toggle("lit", scored);
        },
        read: () => (scored ? "goal · remote-controlled over HC-05 Bluetooth" : Math.abs(bx.x + 2) > 0.2 ? "Arduino Uno · BTS7960 motor drivers · 3S LiPo" : "2022 · Robo Soccer, Chittagong Science Carnival 2.0"),
      };
    },
  };

  /* TensorCode: a notebook of three cells; pointing at a cell runs it, and the last one draws its output */
  FIGS.notebook = {
    vb: VB8, label: "A notebook of three cells; pointing at a cell runs it",
    build(svg, st) {
      const K = 27, P = proj(K), Z = 0.32;
      base(svg, P);
      new Solid(svg).set(P, ring(-2.8, -2, 2.8, 2, 0.3), 0.18, 0.14);
      line(svg, P, [[-2.8, -1.45], [2.8, -1.45]], Z);
      const cells = [0, 1, 2].map((i) => ({ i, y0: -1.25 + i * 1.05, s: new Solid(svg), o: { x: 0, v: 0 }, code: mk("path", { class: "ln" }, svg) }));
      const out = mk("path", { class: "ln lit" }, svg);
      let pick = -1, ran = 0;
      return {
        tour: [[0, -40], [0, 0], [0, 40]],
        frame(dt, p, st) {
          pick = -1;
          if (p && Math.abs(p[0]) < 180) { let best = 1e9; cells.forEach((c) => { const d = Math.abs(P(0, c.y0 + 0.42, Z)[1] - p[1]); if (d < best) { best = d; pick = c.i; } }); }
          ran = pick === 2 ? Math.min(1, ran + dt * (st.still ? 99 : 0.9)) : Math.max(0, ran - dt * 2);
          cells.forEach((c) => {
            const z = Z + 0.04 + ease(c.o, c.i === pick ? 0.28 : 0, dt, st, 10);
            c.s.set(P, ring(-2.4, c.y0, 2.4, c.y0 + 0.85, 0.12, 3), Z, z - Z); c.s.top.classList.toggle("lit", c.i === pick);
            let d = ""; for (let k = 0; k < 2; k++) { const y = c.y0 + 0.3 + k * 0.26; d += D([[-2.1, y], [-2.1 + 1.2 + ((c.i * 5 + k * 3) % 4) * 0.35, y]].map((q) => P(q[0], q[1], z))); }
            c.code.setAttribute("d", d);
            if (c.i === 2) { const pts = []; for (let x = 0; x <= ran * 1.9 + 1e-6; x += 0.1) pts.push([0.2 + x, c.y0 + 0.2 + 0.5 * (1 - Math.exp(-x * 1.6))]); out.setAttribute("d", D(pts.map((q) => P(q[0], q[1], z)))); }
          });
        },
        read: () => (pick < 0 ? "TensorCode · AI, GPU and kernel programming in the browser" : `cell ${pick + 1} · run${pick === 2 && ran > 0.98 ? " · output ready" : ""}`),
      };
    },
  };

  /* Zeenah Store: the pointer sends products from the shop into the cart */
  FIGS.store = {
    vb: VB8, label: "A small storefront and a cart; pointing at the shop sends products to the cart",
    build(svg, st) {
      const K = 27, P = proj(K), Z = 0.18;
      base(svg, P);
      new Solid(svg).set(P, ring(-2.4, -1.6, 0.6, 1.2, 0.12), Z, 1.2);
      let aw = ""; for (let k = 0; k <= 6; k++) { const y = -1.6 + k * 0.467; aw += D([P(0.6, y, Z + 1.2), P(1.1, y, Z + 0.95)]); }
      mk("path", { class: "ln", d: aw + D([P(0.6, -0.35, Z), P(0.6, -0.35, Z + 0.8), P(0.6, 0.35, Z + 0.8), P(0.6, 0.35, Z)]) }, svg);
      const cart = new Solid(svg); cart.set(P, ring(2.0, 0.5, 3.0, 1.5, 0.08, 2), Z + 0.15, 0.5);
      mk("path", { class: "ln", d: D([P(2.0, 0.5, Z + 0.65), P(1.7, 0.2, Z + 0.95)]) }, svg);
      const box = new Solid(svg); let t = -1, count = 0;
      return {
        tour: [[-40, -20], [-40, 10]],
        frame(dt, p, st) {
          if (t < 0 && p && p[0] < 60) t = 0;
          if (t >= 0) { t += st.still ? 1 : dt * 0.9; if (t >= 1) { t = -1; count = Math.min(99, count + 1); } }
          const u = smooth(Math.max(0, t)), x = lerp(0.9, 2.5, u), y = lerp(0, 1.0, u), zz = Z + 0.15 + 0.6 + Math.sin(u * Math.PI) * 0.6;
          box.set(P, ring(x - 0.2, y - 0.2, x + 0.2, y + 0.2, 0.04, 1), zz, 0.3); box.g.style.display = t >= 0 ? "" : "none";
          cart.top.classList.toggle("lit", count > 0);
        },
        read: () => (count ? `${count} in the cart · guest checkout or Google sign-in · order history` : "handloom sarees and jewellery · a live store"),
      };
    },
  };

  /* Olly Labs: scrub a recorded call; what's behind the playhead turns into notes */
  FIGS.waves = {
    vb: VB8, label: "A recorded call as a waveform; moving across it turns the audio behind the playhead into notes",
    build(svg, st) {
      const K = 27, P = proj(K), Z = 0.32;
      base(svg, P);
      new Solid(svg).set(P, ring(-2.8, -1.9, 2.8, 1.9, 0.3), 0.18, 0.14);
      const bars = []; for (let k = 0; k < 17; k++) { const x = -2.4 + k * 0.3, h = 0.15 + 0.6 * Math.abs(Math.sin(k * 0.9) * Math.cos(k * 0.37)); bars.push({ x, el: mk("path", { class: "ln", d: D([P(x, -1.2 - h, Z), P(x, -1.2 + h, Z)]) }, svg) }); }
      const head = mk("path", { class: "ln lit" }, svg), notes = mk("path", { class: "ln" }, svg);
      const ph = { x: -2.6, v: 0 }; let goal = -2.6;
      return {
        tour: [[-160, 0], [160, 0]],
        frame(dt, p, st) {
          if (p) goal = clamp(lerp(-2.6, 2.6, (p[0] + 170) / 340), -2.6, 2.6);
          ease(ph, goal, dt, st, 8);
          bars.forEach((b) => b.el.classList.toggle("lit", b.x < ph.x));
          head.setAttribute("d", D([P(ph.x, -2.0, Z), P(ph.x, -0.4, Z)]));
          const prog = (ph.x + 2.6) / 5.2; let d = "";
          [4.4, 3.6, 4.0, 2.4].forEach((L, k) => { const len = clamp(prog * 4 - k) * L; if (len > 0.05) d += D([P(-2.4, 0.1 + k * 0.42, Z), P(-2.4 + len, 0.1 + k * 0.42, Z)]); });
          notes.setAttribute("d", d);
        },
        read: () => { const prog = (ph.x + 2.6) / 5.2; return prog < 0.03 ? "a recorded call → notes and an AI summary" : prog > 0.97 ? "notes and AI summary ready" : `${Math.round(prog * 100)}% of the call into notes`; },
      };
    },
  };

  /* Contests: a podium; pointing at a step names the placing */
  FIGS.podium = {
    vb: VB8, label: "A podium of three steps; pointing at a step names the placing",
    build(svg, st) {
      const K = 27, P = proj(K), Z = 0.18;
      base(svg, P);
      const steps = [[-2.4, -0.9, 0.7, "Finalist · API Avengers, Televerse 1.0 · Rising Team Award"], [-0.75, 0.75, 1.15, "Champion · Break The Monolith Hackathon 2025"], [0.9, 2.4, 0.5, "7th · Brain Station 23 AI Engineering · 9th · NSU WebXtreme"]].map(([x0, x1, h, txt], i) => ({ i, x0, x1, h, txt, s: new Solid(svg), o: { x: 0, v: 0 }, cx: P((x0 + x1) / 2, 0, Z + h)[0] }));
      let pick = -1;
      return {
        tour: steps.map((s) => [s.cx, 0]),
        frame(dt, p, st) {
          pick = -1;
          if (p) { let best = 1e9; steps.forEach((s) => { const d = Math.abs(s.cx - p[0]); if (d < best) { best = d; pick = s.i; } }); if (best > 90) pick = -1; }
          steps.forEach((s) => { s.s.set(P, ring(s.x0, -0.8, s.x1, 0.8, 0.1), Z, s.h + ease(s.o, s.i === pick ? 0.35 : 0, dt, st, 10)); s.s.top.classList.toggle("lit", s.i === pick); });
        },
        read: () => (pick < 0 ? "champion · finalist · 7th · 9th, 2022–25" : steps[pick].txt),
      };
    },
  };

  /* ---------- runtime ---------- */
  function mountFig(host) {
    if (host._fig) return;
    const def = FIGS[host.dataset.fig];
    if (!def) return;
    const svg = mk("svg", { viewBox: def.vb, role: "img", "aria-label": def.label }, host);
    if (def.ghost) svg.classList.add("ghost");
    const st = { ptr: null, t: 0, I: parseFloat(host.dataset.intensity || "0.5"), play: host.hasAttribute("data-play"), still: REDUCED };
    const fig = def.build(svg, st);
    host._fig = fig; host._st = st;
    if (!fig.frame) return;
    const wrap = host.closest(".figwrap"), readEl = wrap ? wrap.querySelector("[data-read]") : null;
    const toSvg = (e) => { const m = svg.getScreenCTM(); if (!m) return null; const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()); return [q.x, q.y]; };
    host.addEventListener("pointermove", (e) => { st.ptr = toSvg(e); });
    host.addEventListener("pointerdown", (e) => { st.ptr = toSvg(e); });
    host.addEventListener("pointerleave", () => { st.ptr = null; });
    let raf = 0, prev = 0, last = null;
    const tick = (now) => {
      if (!host.isConnected) return;
      const dt = prev ? Math.min((now - prev) / 1000, 1 / 30) : 1 / 60;
      prev = now; st.t += dt;
      let p = st.ptr;
      const tour = fig.tour || def.tour;
      if (!p && st.play && tour && !REDUCED) { const k = st.t / 2.2, i = Math.floor(k) % tour.length, j = (i + 1) % tour.length, u = smooth((k % 1) * 1.8 - 0.4); p = [lerp(tour[i][0], tour[j][0], u), lerp(tour[i][1], tour[j][1], u)]; }
      fig.frame(dt, p, st);
      if (readEl && fig.read) { const r = fig.read(); if (r !== last) { readEl.textContent = r; last = r; } }
      raf = requestAnimationFrame(tick);
    };
    fig.frame(1 / 60, null, st);
    if (readEl && fig.read) readEl.textContent = fig.read();
    new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); prev = 0; if (e.isIntersecting) raf = requestAnimationFrame(tick); }).observe(host);
  }
  const mountAll = (el) => el.querySelectorAll("[data-fig]").forEach(mountFig);

  /* intensity sliders */
  root.querySelectorAll("[data-int]").forEach((inp) => {
    const out = inp.parentElement.querySelector("output");
    inp.addEventListener("input", () => { const st = inp.closest(".figwrap").querySelector(".stage")._st; if (st) st.I = parseFloat(inp.value); out.textContent = parseFloat(inp.value).toFixed(2); });
  });

  /* ---------- trial strip ---------- */
  const GS = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5];
  const RUNS = [
    { name: "E1 pilot", sub: "n = 20 per G", n: 20, s: [0, 0, 0, 0, 0, 0, 0] },
    { name: "Calibration 2", sub: "n = 5 per G", n: 5, s: [5, 4, 1, 2, 5, 0, 0] },
    { name: "Fresh seeds", sub: "n = 10 per G", n: 10, s: [10, null, 8, 6, 10, null, null] },
  ];
  root.querySelectorAll("[data-trials]").forEach((box) => {
    const grid = document.createElement("div");
    grid.className = "tr-grid";
    grid.style.minWidth = "430px";
    let html = "";
    for (const r of RUNS) {
      html += `<p class="rl">${r.name}<small>${r.sub}</small></p>`;
      r.s.forEach((s, gi) => {
        if (s === null) { html += `<div class="tr-col" data-g="${gi}"><span class="dots none" title="not run"></span></div>`; return; }
        let d = ""; for (let k = 0; k < r.n; k++) d += `<i class="${k < s ? "y" : ""}"></i>`;
        html += `<div class="tr-col" data-g="${gi}"><span class="dots" style="grid-template-columns:repeat(5,6px)">${d}</span></div>`;
      });
    }
    html += `<span></span>` + GS.map((g, gi) => `<p class="tr-x" data-g="${gi}">${g.toFixed(2)}</p>`).join("");
    grid.innerHTML = html;
    const read = document.createElement("p");
    read.className = "tr-read";
    const def = "Hover a column. Each dot is one trial; filled crossed the lattice.";
    read.textContent = def;
    const scroller = document.createElement("div");
    scroller.style.overflowX = "auto";
    scroller.append(grid);
    box.style.gridTemplateColumns = "minmax(0, 1fr)";
    box.append(scroller, read);
    grid.addEventListener("pointerover", (e) => {
      const c = e.target.closest("[data-g]");
      if (!c) return;
      const gi = +c.dataset.g;
      grid.querySelectorAll(".tr-col").forEach((x) => x.toggleAttribute("data-on", +x.dataset.g === gi));
      read.innerHTML = `<b>G ${GS[gi].toFixed(2)}</b> · ` + RUNS.map((r) => `${r.name.toLowerCase()} ${r.s[gi] === null ? "not run" : `<b>${r.s[gi]}/${r.n}</b>`}`).join(" · ");
    });
    grid.addEventListener("pointerleave", () => { grid.querySelectorAll(".tr-col").forEach((x) => x.removeAttribute("data-on")); read.textContent = def; });
  });

  /* ---------- relay ---------- */
  root.querySelectorAll("[data-relay]").forEach((box) => {
    const N = [["Svelte UI", "never computes"], ["Tauri command", "IPC"], ["pb-engine", "Rust · job graph"], ["JSON-RPC 2.0", "over stdio"], ["Python worker", "fit · validate"], ["CoolProp · SciPy", "the science"]];
    const svg = mk("svg", { viewBox: "0 0 640 96", role: "img", "aria-label": "Svelte UI to Tauri command to the Rust engine, over JSON-RPC on stdio to the Python worker, which calls CoolProp and SciPy" }, box);
    const W = 94, gap = (640 - 6 * W) / 5, xs = N.map((_, i) => i * (W + gap));
    mk("path", { class: "wire", d: N.slice(1).map((_, i) => `M${xs[i] + W},48H${xs[i + 1]}`).join("") }, svg);
    const nodes = N.map(([a, b], i) => { const g = mk("g", { class: "node" }, svg); mk("rect", { x: xs[i] + 0.5, y: 24.5, width: W - 1, height: 47, rx: 9 }, g); const t1 = mk("text", { x: xs[i] + W / 2, y: 45, "text-anchor": "middle" }, g); t1.textContent = a; const t2 = mk("text", { x: xs[i] + W / 2, y: 60, "text-anchor": "middle", class: "sub" }, g); t2.textContent = b; return g; });
    const dot = mk("circle", { class: "msg", r: 3.5, cy: 48 }, svg);
    let target = null, pos = 0, v = 0, raf = 0, t = 0, prev = 0;
    svg.addEventListener("pointermove", (e) => { const m = svg.getScreenCTM(); if (!m) return; const x = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()).x; target = clamp(Math.round((x - W / 2) / (W + gap)), 0, 5); });
    svg.addEventListener("pointerleave", () => { target = null; });
    const step = (now) => {
      const dt = prev ? Math.min((now - prev) / 1000, 1 / 30) : 1 / 60; prev = now; t += dt;
      const goal = target !== null ? target : 2.5 - 2.5 * Math.cos(t * 0.9);
      const o = { x: pos, v }; if (REDUCED) o.x = goal; else spring(o, goal, dt, 7); pos = o.x; v = o.v;
      dot.setAttribute("cx", r2(xs[0] + W / 2 + pos * (W + gap)));
      nodes.forEach((g, i) => g.classList.toggle("hot", i <= Math.round(pos)));
      raf = requestAnimationFrame(step);
    };
    new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); prev = 0; if (e.isIntersecting) raf = requestAnimationFrame(step); }).observe(box);
  });

  /* ---------- rails: follow the section being read ---------- */
  root.querySelectorAll(".rail").forEach((rail) => {
    const links = [...rail.querySelectorAll("a")];
    const secs = links.map((a) => root.querySelector(a.getAttribute("href")));
    const update = () => {
      let cur = 0;
      secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 160) cur = i; });
      if (scrollY < 40) cur = -1;
      links.forEach((a, i) => a.toggleAttribute("aria-current", i === cur));
      rail.querySelectorAll("ul").forEach((ul) => {
        const lis = [...ul.children], k = lis.findIndex((li) => li.querySelector("[aria-current]"));
        ul.style.setProperty("--reach", k < 0 ? 0 : String((k + 0.62) / lis.length));
      });
    };
    on(window, "scroll", update, { passive: true });
    links.forEach((a, i) => on(a, "click", (e) => { e.preventDefault(); const s = secs[i]; if (!s) return; history.replaceState(history.state, "", a.getAttribute("href")); scrollTo({ top: scrollY + s.getBoundingClientRect().top - 72, behavior: REDUCED ? "auto" : "smooth" }); }));
    update();
  });

  /* ---------- work catalogue ---------- */
  const SHELVES = [
    { id: "all", title: "All", icon: "all", color: "var(--ink)" },
    { id: "research", title: "Research", icon: "method", color: "var(--c-research)" },
    { id: "robotics", title: "Robotics", icon: "robot", color: "var(--c-robotics)" },
    { id: "software", title: "Research software", icon: "window", color: "var(--c-software)" },
    { id: "infra", title: "Infrastructure", icon: "chip", color: "var(--c-infra)" },
    { id: "products", title: "Products", icon: "bag", color: "var(--c-products)" },
    { id: "contests", title: "Contests", icon: "podium", color: "var(--c-contests)" },
  ];
  const GO = { snake: ["/work/snake-robot", "Read the case study"], propbench: ["/work/propbench", "Read the case study"], research: ["/research", "Read about the research"], about: ["/about#ab-awards", "See every award"], poridhi: ["/about#ab-work", "Read about the work at Poridhi"] };
  const ENTRIES = [
    { id: "snake", svc: "robotics-yard", shelf: "robotics", fig: "snake", name: "Compliant snake robot", tag: "2026", status: "Simulation · ongoing", sum: "A MuJoCo simulation of a 7-segment, cable-driven snake robot, built to test a Science Robotics result on body compliance and to size its servos before buying parts.", facts: ["433 paired, randomized trials", "133 tests, each shown to fail on a planted fault", "Pass/fail rules written before every run"], go: "snake" },
    { id: "propbench", svc: "propbench", shelf: "software", fig: "loupe", name: "PropBench", tag: "2026", status: "Open source · pre-alpha · MIT", sum: "A desktop workbench that takes researchers from lab measurements to a validated thermophysical property model, without writing code.", facts: ["~32,000 lines across Rust, Python, Svelte and TypeScript", "450+ automated tests, CI on Windows, macOS and Linux", "Reproduces a NIST check value to 5 × 10⁻⁶"], go: "propbench" },
    { id: "aistudio", svc: "gpu-datacenter", shelf: "infra", fig: "gpu", name: "AI Studio", tag: "2025–26", status: "Poridhi.io", sum: "On-demand GPU workspaces for Jupyter and VS Code. I helped move it from AWS to a Kubernetes cluster on the company GPU server.", facts: ["Launch time cut by about 70%, from 10–15 to 3–5 minutes", "Six users share 48 GB of VRAM as isolated 8 GB slices (HAMi)", "Built the Next.js frontend for session setup"], go: "poridhi" },
    { id: "thesis", svc: "wind-tunnel", shelf: "research", fig: "airfoil", name: "Localized forgetting in PEFT", tag: "thesis", status: "Under review · BSME ICTFE", sum: "Adapting a released physics-informed airfoil surrogate beyond its training range with low-rank updates, and measuring what it forgets.", facts: ["CFD reference data generated in SU2", "Eight adaptation methods compared on accuracy and forgetting"], go: "research" },
    { id: "refrig", svc: "heat-exchanger", shelf: "research", fig: "hx", name: "Refrigerant heat transfer ML", tag: "2 papers", status: "Under review · Int. J. Refrigeration", sum: "Models that predict evaporation and condensation heat transfer of low-GWP R455A and R1336mzz(E) in an industrial plate heat exchanger, from Saga University experiments.", facts: ["Tested on operating conditions left out of training", "Measurement uncertainty analysis for the R455A study"], go: "research" },
    { id: "cf3i", svc: "propbench", shelf: "research", fig: "curve", name: "CF₃I viscosity model", tag: "in prep", status: "In preparation", sum: "An updated residual-entropy scaling model for the viscosity of CF₃I (R13I1), and PropBench’s first case study.", facts: ["63 published data points from 3 datasets"], go: "research" },
    { id: "soccer", svc: "soccer-pitch", shelf: "robotics", fig: "soccer", name: "Robo soccer bot", tag: "2022", status: "Certificate of Recognition", sum: "A remote-controlled soccer robot for Chittagong Science Carnival 2.0.", facts: ["Arduino Uno, BTS7960 drivers, 3S LiPo, HC-05", "Plywood chassis"] },
    { id: "tensorcode", svc: "gpu-datacenter", shelf: "infra", fig: "notebook", name: "TensorCode and TensorRAG", tag: "2025–26", status: "Poridhi.io", sum: "A browser platform for AI, GPU and kernel programming, and a visual tool for building ML training pipelines from Python steps.", facts: ["Owned the frontend from the first version", "Built the workflow that brings lab content in from GitHub"], go: "poridhi" },
    { id: "zeenah", svc: "market-street", shelf: "products", fig: "store", name: "Zeenah Store", tag: "live", status: "Live site", sum: "A store for handloom sarees and jewellery with cart, guest checkout, Google sign-in and order history.", facts: ["Next.js, Supabase, Google OAuth, Vercel"] },
    { id: "olly", svc: "market-street", shelf: "products", fig: "waves", name: "AI meeting notes", tag: "Olly Labs", status: "Shipped", sum: "A meeting assistant that records calls and turns the audio into notes and AI summaries.", facts: ["React, Supabase, Microsoft Azure"] },
    { id: "contests", svc: "hall-of-fame", shelf: "contests", fig: "podium", name: "Hackathons and contests", tag: "2022–25", status: "Champion · finalist · 7th · 9th", sum: "Champion at Break The Monolith. Finalist and Rising Team Award at API Avengers. 7th at Brain Station 23 AI Engineering, 9th at NSU TechFest WebXtreme.", facts: ["ICPC Dhaka Regional preliminary contestant", "CUET IUPC and ASRRO Robocoder"], go: "about" },
  ];
  const shelfOf = (id) => SHELVES.find((s) => s.id === id);
  const work = root.querySelector(".work");
  if (work) {
  const shelvesEl = work.querySelector("[data-shelves]"), stripEl = work.querySelector("[data-strip]"), body = work.querySelector("[data-workbody]"), drawer = root.querySelector("[data-drawer]");
  let current = "all", picked = null;
  const shelfBtn = (s) => `<button class="shelf" type="button" data-shelf="${s.id}" aria-pressed="${s.id === current}" style="--gc:${s.color}">${ICON[s.icon]}${s.title}<span class="n">${s.id === "all" ? ENTRIES.length : ENTRIES.filter((e) => e.shelf === s.id).length}</span></button>`;
  const renderShelves = () => { shelvesEl.innerHTML = SHELVES.map(shelfBtn).join(""); stripEl.innerHTML = SHELVES.map(shelfBtn).join(""); };
  const tile = (e) => `<button class="tile" type="button" data-entry="${e.id}" ${e.fig.startsWith("ghost") ? "data-ghost" : ""} aria-label="${e.name}"><div class="stage" data-fig="${e.fig}" data-intensity="0.45"></div><div class="tile-foot"><span class="tile-name">${e.name}</span><span class="tile-tag">${e.tag}</span></div></button>`;
  function renderBody() {
    const list = current === "all" ? SHELVES.slice(1) : [shelfOf(current)];
    body.innerHTML = list.map((s) => { const items = ENTRIES.filter((e) => e.shelf === s.id); return `<section class="shelf-sec"><div class="shelf-head"><h2>${s.title}</h2><span>${items.length} of ${items.length}</span></div><div class="grid">${items.map(tile).join("")}</div></section>`; }).join("");
    body.removeAttribute("data-enter"); body.offsetHeight; body.setAttribute("data-enter", "");
    mountAll(body);
  }
  work.addEventListener("click", (e) => {
    const sb = e.target.closest("[data-shelf]");
    if (sb) { current = sb.dataset.shelf; renderShelves(); renderBody(); return; }
    const t = e.target.closest("[data-entry]");
    if (t) { openDrawer(t.dataset.entry); return; }
    if (e.target.closest("[data-close]")) closeDrawer();
  });
  function openDrawer(id) {
    const e = ENTRIES.find((x) => x.id === id), s = shelfOf(e.shelf);
    picked = id;
    work.querySelectorAll(".tile").forEach((t) => t.toggleAttribute("data-picked", t.dataset.entry === id));
    drawer.innerHTML = `<div class="dr" style="--gc:${s.color}"><button class="dr-back" type="button" data-close>← Back to all work</button><div class="dr-h"><div><p class="dr-name">${e.name}</p><p class="dr-meta"><span style="display:inline-flex;align-items:center;gap:6px">${ICON[s.icon]}${s.title}</span><span class="tag">${e.status}</span></p></div><button class="x-close" type="button" data-close aria-label="Close">${ICON.x}</button></div><div class="figwrap"><div class="stage" data-fig="${e.fig}" data-intensity="0.6" data-play></div>${e.fig.startsWith("ghost") ? "" : '<div class="readout"><span data-read></span></div>'}</div><p class="dr-sum">${e.sum}</p><ul class="facts">${e.facts.map((f) => `<li>${f}</li>`).join("")}</ul><p class="dr-ask">${e.go ? `<a class="more" href="${GO[e.go][0]}">${GO[e.go][1]}</a>` : ""}${e.go && e.svc ? " · " : ""}${e.svc ? `<a class="more" href="/#/${e.svc}">See it on the island</a>` : ""}</p></div>`;
    drawer.setAttribute("data-open", "");
    document.documentElement.classList.add("drawer-open");
    // an open drawer is a step in history, so the phone's Back button closes it instead of leaving the page
    if (history.state && history.state.drawer) history.replaceState({ ...history.state, drawer: id }, "");
    else history.pushState({ ...history.state, drawer: id }, "");
    mountAll(drawer);
  }
  function closeDrawer(fromHistory) {
    if (!drawer.hasAttribute("data-open")) return;
    if (!fromHistory && history.state && history.state.drawer) { history.back(); return; }
    drawer.removeAttribute("data-open"); document.documentElement.classList.remove("drawer-open");
    picked = null; work.querySelectorAll(".tile").forEach((t) => t.removeAttribute("data-picked"));
  }
  on(window, "popstate", () => { if (!(history.state && history.state.drawer)) closeDrawer(true); });
  // the drawer sits beside the catalogue, not inside it, so it answers its own close and back buttons
  on(drawer, "click", (e) => { if (e.target.closest("[data-close]")) closeDrawer(); });
  on(document, "keydown", (e) => { if (e.key === "Escape" && drawer.hasAttribute("data-open")) closeDrawer(); });
  off.push(() => document.documentElement.classList.remove("drawer-open"));
  renderShelves();
  renderBody();
  }

  mountAll(root);
  return () => off.forEach((f) => f());
}


