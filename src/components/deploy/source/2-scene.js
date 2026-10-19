/* ============================================================================
 * 2 · scene: renderer, region meshes, every machine.
 * ========================================================================== */
const canvas = $("canvas.x-gl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.localClippingEnabled = true;
const scene = new THREE.Scene(), world = new THREE.Group();
world.position.set(-36, 0, -28);
scene.add(world);
const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -400, 800);

const lineMat = { t: new THREE.LineBasicMaterial({ transparent: true }), s: new THREE.LineBasicMaterial({ transparent: true }), d: new THREE.LineBasicMaterial({ transparent: true }) };
const solidMat = new THREE.MeshBasicMaterial({ vertexColors: true });
const glassMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.32, depthWrite: false });

/* mesher: exposed faces only, flat-shaded by a fixed sun; `occ` decides what hides a face */
const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const FACES = DIRS.map((d) => {
  const a = d.findIndex((v) => v !== 0), [u, v] = [0, 1, 2].filter((i) => i !== a), s = d[a] > 0 ? 1 : 0;
  let c = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([p, q]) => { const o = [0, 0, 0]; o[a] = s; o[u] = p; o[v] = q; return o; });
  const e1 = new V3(...c[1]).sub(new V3(...c[0])), e2 = new V3(...c[2]).sub(new V3(...c[0]));
  if (e1.cross(e2).dot(new V3(...d)) < 0) c = c.reverse();
  return { d, c, shade: shadeOf(new V3(...d)) };
});
const isGlass = (m) => m === "glass";
function mesh(map, occ) {
  const B = { s: { p: [], c: [], i: [] }, g: { p: [], c: [], i: [] } }, seen = new Set(), E = [];
  for (const [k, m] of map) {
    const [x, y, z] = k.split(",").map(Number), g = isGlass(m), b = g ? B.g : B.s, base = col(m);
    for (const F of FACES) {
      if (occ(x + F.d[0], y + F.d[1], z + F.d[2], g)) continue;
      if (F.d[1] === -1 && y <= -2) continue;
      const o = b.p.length / 3, cc = base.clone().multiplyScalar(F.shade);
      for (const q of F.c) { b.p.push(x + q[0], y + q[1], z + q[2]); b.c.push(cc.r, cc.g, cc.b); }
      b.i.push(o, o + 1, o + 2, o, o + 2, o + 3);
      if (g) continue;
      for (let j = 0; j < 4; j++) {
        const a = F.c[j], c2 = F.c[(j + 1) % 4], A = [x + a[0], y + a[1], z + a[2]], Bp = [x + c2[0], y + c2[1], z + c2[2]];
        const key = A < Bp ? A + "|" + Bp : Bp + "|" + A;
        if (!seen.has(key)) { seen.add(key); E.push(...A, ...Bp); }
      }
    }
  }
  const geo = (b) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(b.p, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(b.c, 3)); g.setIndex(b.i); return g; };
  const lines = new THREE.BufferGeometry(); lines.setAttribute("position", new THREE.Float32BufferAttribute(E, 3));
  return { solid: geo(B.s), glass: geo(B.g), lines };
}

/* one node per station: terrain that rises out of the sea, a building that prints upward */
const REG = STATIONS.map((s, i) => {
  const plane = new THREE.Plane(new V3(0, -1, 0), -50);
  const r = {
    i, plane, ground: new THREE.Group(), build: new THREE.Group(), dyn: [],
    mats: { solid: new THREE.MeshBasicMaterial({ vertexColors: true, clippingPlanes: [plane] }), glass: new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.32, depthWrite: false, clippingPlanes: [plane] }), line: new THREE.LineBasicMaterial({ transparent: true, clippingPlanes: [plane] }) },
    rise: 0, print: 0, svc: 0, riseT: -1, printT: -1, svcT: -1, top: RV[i].top + 1,
  };
  world.add(r.ground, r.build);
  return r;
});
function buildRegions() {
  REG.forEach((r, i) => {
    [r.ground, r.build].forEach((g) => { g.children.forEach((o) => o.geometry.dispose()); g.clear(); });
    const T = RV[i].terrain, St = RV[i].struct;
    const t = mesh(T, (x, y, z) => T.has(K(x, y, z)));
    r.ground.add(new THREE.Mesh(t.solid, solidMat), new THREE.LineSegments(t.lines, lineMat.t));
    const s = mesh(St, (x, y, z, g) => { const k = K(x, y, z), n = St.get(k); if (n !== undefined) return !isGlass(n) || g; return T.has(k); });
    const gl = new THREE.Mesh(s.glass, r.mats.glass); gl.renderOrder = 2;
    r.build.add(new THREE.Mesh(s.solid, r.mats.solid), new THREE.LineSegments(s.lines, r.mats.line), gl);
  });
}

/* the sea, its drifting marks, and the dashed outline of the island still to come */
const water = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), new THREE.MeshBasicMaterial());
water.rotation.x = -Math.PI / 2; water.position.set(36, 0.35, 28); world.add(water);
const waves = [];
for (let i = 0; i < 110; i++) { let x, z; do { x = -30 + rnd() * 130; z = -24 + rnd() * 110; } while (inMain(Math.floor(x), Math.floor(z)) || inMain(Math.floor(x) + 3, Math.floor(z)) || inMain(Math.floor(x) - 3, Math.floor(z))); waves.push([x, z, 0.8 + rnd() * 1.6, rnd() * 6]); }
const waveGeo = new THREE.BufferGeometry(); waveGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Array(waves.length * 6).fill(0), 3));
world.add(new THREE.LineSegments(waveGeo, lineMat.d));
const coastPts = [];
for (let x = -2; x < 74; x++) for (let z = -2; z < 58; z++) {
  if (!inside(x, z)) continue;
  if (!inside(x + 1, z)) coastPts.push(x + 1, 0.37, z, x + 1, 0.37, z + 1);
  if (!inside(x - 1, z)) coastPts.push(x, 0.37, z, x, 0.37, z + 1);
  if (!inside(x, z + 1)) coastPts.push(x, 0.37, z + 1, x + 1, 0.37, z + 1);
  if (!inside(x, z - 1)) coastPts.push(x, 0.37, z, x + 1, 0.37, z);
}
const coastGeo = new THREE.BufferGeometry(); coastGeo.setAttribute("position", new THREE.Float32BufferAttribute(coastPts, 3));
const coastMat = new THREE.LineDashedMaterial({ dashSize: 0.35, gapSize: 0.45, transparent: true, opacity: 0.5 });
const coast = new THREE.LineSegments(coastGeo, coastMat); coast.computeLineDistances(); world.add(coast);

/* dynamic parts: shaded by face normal to match the blocks, with hairline edges */
const DYN = [];
function shadeGeo(geo, m) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  const pos = g.attributes.position, n = new V3(), a = new V3(), b = new V3(), c = new V3(), out = [];
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); c.fromBufferAttribute(pos, i + 2);
    n.subVectors(c, b).cross(new V3().subVectors(a, b)).normalize();
    const cc = col(m).multiplyScalar(shadeOf(n));
    for (let k = 0; k < 3; k++) out.push(cc.r, cc.g, cc.b);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(out, 3));
  return g;
}
function part(geo, m, o = {}) {
  const mesh = new THREE.Mesh(shadeGeo(geo, m), o.mat || solidMat);
  if (o.edges !== false) mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, o.th || 25), lineMat.s));
  mesh.__m = m; mesh.__src = geo; DYN.push(mesh);
  return mesh;
}
const box = (w, h, d, m, o) => part(new THREE.BoxGeometry(w, h, d), m, o);
const recolor = () => DYN.forEach((mesh) => { const g = shadeGeo(mesh.__src, mesh.__m); mesh.geometry.dispose(); mesh.geometry = g; });
const setMat = (mesh, m) => { if (mesh.__m === m) return; mesh.__m = m; const g = shadeGeo(mesh.__src, m); mesh.geometry.dispose(); mesh.geometry = g; };
const loader = new THREE.TextureLoader();
const tex = (src) => { const t = loader.load(src); t.anisotropy = 4; return t; };
const PICK = [];
/** puts an object in a station's node: it appears when that node's service comes up */
const own = (i, obj, s = 1) => { obj.userData.__s = s; obj.scale.setScalar(0.001); obj.visible = false; REG[i].dyn.push(obj); return obj; };

/* lanterns: a post with a light in the station's colour */
const markers = STATIONS.map((s, i) => {
  const g = new THREE.Group(), y = S(s.marker[0], s.marker[1]);
  const post = box(0.22, 2.4, 0.22, "ink"); post.position.y = 1.2;
  const lamp = box(0.62, 0.62, 0.62, s.ns === "core" ? "white" : s.ns); lamp.position.y = 2.7;
  g.add(post, lamp); g.position.set(s.marker[0] + 0.5, y, s.marker[1] + 0.5); world.add(g); own(i, g);
  return { g, lamp, anchor: new V3(s.marker[0] + 0.5, y + 3.4, s.marker[1] + 0.5) };
});
STATIONS.forEach((s, i) => {
  const [x0, z0, x1, z1, h] = s.hit, y = S((x0 + x1) / 2, (z0 + z1) / 2);
  const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, h, z1 - z0), new THREE.MeshBasicMaterial());
  m.position.set((x0 + x1) / 2, y + h / 2 - 0.5, (z0 + z1) / 2); m.visible = false; m.userData = { station: i };
  world.add(m); PICK.push(m);
});

/* ---------- 0 workshop: signpost and mailbox ---------- */
const sign = new THREE.Group(); sign.position.set(40.5, 1, 30.5); world.add(sign); own(0, sign);
const sp = box(0.25, 3.2, 0.25, "plank"); sp.position.y = 1.6; sign.add(sp);
[5, 3, 7, 9].forEach((si, k) => {
  const s = STATIONS[si], arm = box(1.5, 0.34, 0.12, s.ns === "core" ? "white" : s.ns);
  const g = new THREE.Group(); g.position.y = 2.9 - k * 0.48; g.rotation.y = Math.atan2(-(s.c[1] + 0.5 - 30.5), s.c[0] + 0.5 - 40.5);
  arm.position.x = 0.75; g.add(arm); sign.add(g); arm.userData = { go: si }; PICK.push(arm);
});
const mailbox = new THREE.Group(); mailbox.position.set(43.5, 1, 32.5); world.add(mailbox); own(0, mailbox);
{ const p = box(0.2, 1.1, 0.2, "ink"); p.position.y = 0.55; const b = box(0.7, 0.5, 0.45, "ink"); b.position.y = 1.3; const f = box(0.06, 0.4, 0.08, "products"); f.position.set(0.38, 1.5, 0); mailbox.add(p, b, f); b.userData = { go: 9 }; PICK.push(b); }

/* ---------- 1 pitch: the bot, the ball, the real photos ---------- */
const bot = new THREE.Group(); world.add(bot); own(1, bot);
{ const ch = box(1.3, 0.62, 0.9, "plank"); ch.position.y = 0.55; bot.add(ch); ch.userData = { kick: true }; PICK.push(ch);
  const lid = box(1.2, 0.06, 0.82, "glass", { mat: glassMat }); lid.position.y = 0.9; bot.add(lid);
  for (const [wx, wz] of [[-0.42, -0.5], [0.42, -0.5], [-0.42, 0.5], [0.42, 0.5]]) { const w = part(new THREE.CylinderGeometry(0.3, 0.3, 0.18, 14), "ink", { th: 40 }); w.rotation.x = Math.PI / 2; w.position.set(wx, 0.3, wz); bot.add(w); }
  const fork = box(0.5, 0.06, 0.7, "plank"); fork.position.set(0.85, 0.12, 0); bot.add(fork); }
const ball = part(new THREE.IcosahedronGeometry(0.32, 0), "white", { th: 1 }); world.add(ball); own(1, ball);
const BOT0 = new V3(31, 1, 47.5), BALL0 = new V3(33.2, 1.32, 47.5);
bot.position.copy(BOT0); ball.position.copy(BALL0);
let kickT = -1;
PHOTOS.forEach(([id, alt], k) => {
  const portrait = id !== "versions", w = portrait ? 1.35 : 2.1, h = portrait ? 1.8 : 1.4;
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex(IMG[id]) }));
  p.position.set([30.2, 31.95, 33.45][k], 2.6, 43.06); p.scale.setScalar(k ? 0.95 : 0.78); p.userData = { photo: k };
  world.add(p); PICK.push(p); own(1, p, k ? 0.95 : 0.78);
});

/* ---------- 2 hall: eight certificates framed on two walls; the one being read comes off its wall ---------- */
const frames = CERTS.map(([id], k) => {
  const g = new THREE.Group(), w = 2.3, h = 1.62;
  const back = box(w + 0.24, h + 0.24, 0.12, "plank");
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex(IMG[id]) })); pic.position.z = 0.07;
  g.add(back, pic);
  if (k < 5) g.position.set(10.4 + k * 2.6, 4.6, 35.1); else { g.position.set(9.1, 4.6, 37 + (k - 5) * 2.6); g.rotation.y = Math.PI / 2; }
  g.userData.home = g.position.clone(); g.userData.dir = k < 5 ? new V3(0, 0, 1) : new V3(1, 0, 0); g.userData.pop = 0;
  pic.userData = { card: k }; back.userData = { card: k }; PICK.push(pic, back);
  world.add(g); own(2, g); return g;
});
const trophy = new THREE.Group(); trophy.position.set(10.5, 3, 42.5); world.add(trophy); own(2, trophy);
{ const cup = part(new THREE.CylinderGeometry(0.4, 0.2, 0.62, 12), "gold", { th: 40 }); cup.position.y = 0.7; const st = part(new THREE.CylinderGeometry(0.08, 0.12, 0.38, 8), "gold", { th: 40 }); st.position.y = 0.2; trophy.add(cup, st); cup.userData = { card: 0 }; PICK.push(cup); }
const certOpen = { k: -1 };

/* ---------- 3 GPU datacenter ---------- */
const leds = [];
for (const rx of [6, 8, 10]) for (let z = 22; z < 31; z += 1) for (const y of [2.6, 3.4, 4.2]) { if (rnd() < 0.45) continue; const l = box(0.06, 0.16, 0.36, "infra", { edges: false }); l.position.set(rx + 1.03, y, z + 0.5); l.userData.ph = rnd() * 6; world.add(l); leds.push(l); own(3, l); }
const gpu = new THREE.Group(); gpu.position.set(14.2, 2, 26.5); gpu.rotation.y = Math.PI / 2; world.add(gpu); own(3, gpu);
{ const b = box(5.4, 0.18, 2.4, "ink"); b.position.y = 1.2; gpu.add(b); const pl = box(4.2, 1.1, 1.6, "stone"); pl.position.y = 0.55; gpu.add(pl); const pk = box(2.6, 0.2, 2.0, "stone"); pk.position.set(-1.1, 1.39, 0); gpu.add(pk); }
const slices = [];
for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) { const s = box(0.74, 0.14, 0.86, "white"); s.position.set(-1.95 + c * 0.84, 1.56, -0.46 + r * 0.92); s.userData = { slice: slices.length, lift: 0, on: 0 }; gpu.add(s); slices.push(s); PICK.push(s); }
const fan = part(new THREE.CylinderGeometry(0.95, 0.95, 0.14, 28), "white", { th: 40 }); fan.position.set(1.5, 1.37, 0); gpu.add(fan);
const blades = new THREE.Group(); blades.position.set(1.5, 1.47, 0); gpu.add(blades);
for (let b = 0; b < 7; b++) { const bl = box(0.78, 0.03, 0.2, "ink", { edges: false }); bl.position.x = 0.42; const h = new THREE.Group(); h.rotation.y = (b / 7) * Math.PI * 2; bl.rotation.x = 0.4; h.add(bl); blades.add(h); }
const cloud = new THREE.Group(); cloud.position.set(4, 15, 8); world.add(cloud); own(3, cloud);
[[0, 0, 0, 7, 1.2, 4], [1, 1.1, 0.5, 4.5, 1, 3], [-1.2, 0.4, 0.6, 2, 1, 2.6], [5.4, 0.3, 0.8, 2.4, 1, 2.4]].forEach(([x, y, z, w, h, d]) => { const c = box(w, h, d, "cloud"); c.position.set(x + w / 2, y, z + d / 2); cloud.add(c); });
const ec2 = []; for (let k = 0; k < 6; k++) { const e = box(0.6, 0.6, 0.6, "white"); e.position.set(0.8 + k * 1.05, 1.95, 2); cloud.add(e); ec2.push(e); }
const race = { on: false, t: 0, aws: 0, bm: 0 };

/* ---------- 4 market: shop signs ---------- */
const signTex = (text) => { const c = document.createElement("canvas"); c.width = 512; c.height = 128; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, 512, 128); x.fillStyle = "#0a0a0a"; x.font = "600 64px Geist, system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, 256, 68); return new THREE.CanvasTexture(c); };
[["Zeenah", 13.5], ["Olly Labs", 20.5]].forEach(([t, x]) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.8), new THREE.MeshBasicMaterial({ map: signTex(t) })); p.position.set(x, 5.55, 16.06); world.add(p); own(4, p); });

/* ---------- 5 wind tunnel ---------- */
const foilShape = new THREE.Shape();
{ const c = 5, t = 0.13, m = 0.045, pp = 0.4, up = [], lo = []; for (let i = 0; i <= 30; i++) { const b = (i / 30) * Math.PI, xc = (1 - Math.cos(b)) / 2, yt = 5 * t * (0.2969 * Math.sqrt(xc) - 0.126 * xc - 0.3516 * xc * xc + 0.2843 * xc ** 3 - 0.1015 * xc ** 4), yc = xc < pp ? (m / (pp * pp)) * (2 * pp * xc - xc * xc) : (m / (1 - pp) ** 2) * (1 - 2 * pp + 2 * pp * xc - xc * xc); up.push([c * (xc - 0.3), (yc + yt) * c]); lo.push([c * (xc - 0.3), (yc - yt) * c]); } const pts = [...up, ...lo.reverse()]; foilShape.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach((p) => foilShape.lineTo(p[0], p[1])); }
const foilG = new THREE.Group(); foilG.position.set(38, 6.5, 7.15); world.add(foilG); own(5, foilG);
{ const foil = part(new THREE.ExtrudeGeometry(foilShape, { depth: 2.7, bevelEnabled: false, curveSegments: 4 }), "research", { th: 30 }); foilG.add(foil); foil.userData = { drag: "aoa" }; PICK.push(foil); }
{ const hit = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 5), new THREE.MeshBasicMaterial()); hit.position.set(38, 6.5, 8.5); hit.visible = false; hit.userData = { drag: "aoa" }; world.add(hit); PICK.push(hit); }
let aoa = 4, aoaGoal = 4;
const NP = 220, pPos = new Float32Array(NP * 3), pSeed = [];
for (let i = 0; i < NP; i++) pSeed.push([rnd() * 16, 5.2 + rnd() * 2.6, 7.1 + rnd() * 2.8, 0.6 + rnd() * 0.5]);
const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.85 });
const particles = new THREE.Points(pGeo, pMat); particles.renderOrder = 3; particles.visible = false; world.add(particles);

/* ---------- 6 heat exchanger ---------- */
const hx = new THREE.Group(); hx.position.set(55.5, 5, 9.5); world.add(hx); own(6, hx);
const plates = []; for (let k = 0; k < 9; k++) { const p = box(4.2, 0.2, 4.8, k % 2 ? "cool" : "warm"); hx.add(p); plates.push(p); p.userData = { stack: true }; PICK.push(p); }
const ports = [[-1.5, -1.8], [1.5, -1.8], [-1.5, 1.8], [1.5, 1.8]].map(([x, z], k) => { const c = part(new THREE.CylinderGeometry(0.28, 0.28, 1, 12), k % 3 ? "cool" : "warm", { th: 40 }); c.position.set(x, 0, z); hx.add(c); return c; });
const capT = box(4.5, 0.3, 5.1, "ink"); hx.add(capT);
let hxOpen = 0, hxGoal = 0;

/* ---------- 7 PropBench: the sheet, the loupe, the laptop, the padlock ---------- */
const SW = 1024, SH = 720, sheetC = document.createElement("canvas"); sheetC.width = SW; sheetC.height = SH;
const SETS = [{ name: "tuhin2024_liquid", n: 24, x0: 0.06, x1: 0.62, sh: "o" }, { name: "tuhin2024_vapor", n: 21, x0: 0.42, x1: 0.95, sh: "s" }, { name: "duan1999_satliq", n: 18, x0: 0.2, x1: 0.78, sh: "t" }];
const curveY = (u) => 0.18 + 0.66 * Math.pow(u, 0.75);
{
  const x = sheetC.getContext("2d"), ink = "#18181b", mid = "#a1a1aa";
  x.fillStyle = "#fff"; x.fillRect(0, 0, SW, SH);
  x.strokeStyle = mid; x.lineWidth = 2; x.beginPath(); x.moveTo(80, 40); x.lineTo(80, SH - 70); x.lineTo(SW - 40, SH - 70); x.stroke();
  const X = (u) => 80 + u * (SW - 140), Y = (v) => SH - 70 - (1 - v) * (SH - 130);
  x.strokeStyle = ink; x.lineWidth = 3; x.beginPath(); for (let u = 0; u <= 1.001; u += 0.01) { const px = X(u), py = Y(1 - curveY(u)); u ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke();
  const r = ((a) => () => { a = (a * 16807) % 2147483647; return a / 2147483647; })(91);
  for (const ds of SETS) { ds.pts = []; for (let k = 0; k < ds.n; k++) { const u = ds.x0 + ((ds.x1 - ds.x0) * k) / (ds.n - 1) + (r() - 0.5) * 0.01, off = ds.sh === "t" && u > 0.48 && u < 0.72 ? 0.07 : 0, v = 1 - curveY(u) - off + (r() - 0.5) * 0.02; ds.pts.push([u, v]); const px = X(u), py = Y(v); x.strokeStyle = ink; x.lineWidth = 2.2; x.beginPath(); if (ds.sh === "o") x.arc(px, py, 7, 0, 7); else if (ds.sh === "s") x.rect(px - 6, py - 6, 12, 12); else { x.moveTo(px, py - 8); x.lineTo(px + 7, py + 5); x.lineTo(px - 7, py + 5); x.closePath(); } x.stroke(); } }
  x.fillStyle = mid; x.font = "22px ui-monospace, monospace"; x.fillText("T / K", SW - 120, SH - 26); x.save(); x.translate(36, 150); x.rotate(-Math.PI / 2); x.fillText("η / µPa·s", -60, 0); x.restore();
}
const sheet = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 3.94), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sheetC) }));
sheet.rotation.x = -Math.PI / 2; sheet.position.set(62.5, 3.02, 25.5); sheet.userData = { drag: "loupe" }; world.add(sheet); PICK.push(sheet); own(7, sheet);
const lensC = document.createElement("canvas"); lensC.width = lensC.height = 256; const lensTex = new THREE.CanvasTexture(lensC);
const loupe = new THREE.Group(); world.add(loupe); own(7, loupe);
{ const lf = part(new THREE.CylinderGeometry(0.42, 0.48, 0.12, 18), "ink", { th: 40 }); lf.position.set(0.95, 0.06, -0.95); const la = box(0.08, 1.7, 0.08, "ink"); la.position.set(0.95, 0.9, -0.95);
  const lr = part(new THREE.CylinderGeometry(0.98, 0.98, 0.09, 36, 1, true), "ink", { th: 40 }); lr.position.y = 1.7;
  const ln = new THREE.Mesh(new THREE.CircleGeometry(0.95, 40), new THREE.MeshBasicMaterial({ map: lensTex })); ln.rotation.x = -Math.PI / 2; ln.position.y = 1.72; loupe.add(lf, la, lr, ln); }
const lp = { u: 0.55, v: 0.5, gu: 0.55, gv: 0.5, read: "" };
function drawLens() {
  const x = lensC.getContext("2d"), cw = (SW / 5.6) * 0.95 * 2 / 2.1, cx = lp.u * SW, cy = lp.v * SH;
  x.clearRect(0, 0, 256, 256); x.save(); x.beginPath(); x.arc(128, 128, 128, 0, 7); x.clip(); x.fillStyle = "#fff"; x.fillRect(0, 0, 256, 256);
  x.drawImage(sheetC, cx - cw / 2, cy - cw / 2, cw, cw, 0, 0, 256, 256); x.restore(); lensTex.needsUpdate = true;
}
// a laptop whose lid follows the pointer's height (Hairline's Laptop, in the world)
// square to the back wall and clear of it: turned 45° its wide lid swung a corner into the wall
const laptop = new THREE.Group(); laptop.position.set(61.2, 3.0, 20.25); world.add(laptop); own(7, laptop, 0.8);
const lid = new THREE.Group(); lid.position.set(0, 0.1, -1.05); laptop.add(lid);
{ const base = box(3.2, 0.12, 2.1, "stone"); base.position.y = 0.06; laptop.add(base); const pad = box(1.0, 0.01, 0.6, "white", { edges: true }); pad.position.set(0, 0.125, 0.55); laptop.add(pad);
  const lb = box(3.2, 2.05, 0.08, "stone"); lb.position.set(0, 1.02, 0); lid.add(lb);
  const ls = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.85), new THREE.MeshBasicMaterial({ map: tex(IMG.pbresults) })); ls.position.set(0, 1.02, 0.045); lid.add(ls);
  lb.userData = { laptop: true }; ls.userData = { laptop: true }; base.userData = { laptop: true }; PICK.push(lb, ls, base); }
let lidA = 1.45, lidGoal = 1.45; // starts closed; it never reclines far enough to reach the wall
// a padlock: the selection rule is locked before fitting
const lock = new THREE.Group(); lock.position.set(64.6, 3.0, 20.0); lock.rotation.y = Math.PI / 4; world.add(lock); own(7, lock);
const shackle = new THREE.Group(); shackle.position.set(-0.17, 0.5, 0); lock.add(shackle);
{ const body = box(0.62, 0.5, 0.3, "gold"); body.position.y = 0.25; lock.add(body); const arc = part(new THREE.TorusGeometry(0.17, 0.05, 8, 18, Math.PI), "ink", { th: 40 }); arc.position.x = 0.17; arc.position.y = 0.18; shackle.add(arc);
  const legL = box(0.1, 0.2, 0.1, "ink"); legL.position.set(0, 0.08, 0); const legR = box(0.1, 0.2, 0.1, "ink"); legR.position.set(0.34, 0.08, 0); shackle.add(legL, legR);
  body.userData = { lock: true }; PICK.push(body); }
let lockOpen = 0, lockGoal = 0;

/* ---------- 8 robotics yard ---------- */
[[38, [49, 52, 55, 58, 61]], [41, [50.5, 53.5, 56.5, 59.5]], [44, [49, 52, 55]]].forEach(([z, xs]) => xs.forEach((x) => { const p = part(new THREE.CylinderGeometry(0.34, 0.34, 1.5, 14), "ink", { th: 40 }); p.position.set(x, 1.75, z); world.add(p); own(8, p); }));
const snake = []; for (let i = 0; i < 7; i++) { const s = box(i === 0 ? 0.95 : 0.85, 0.46, 0.46, i === 0 ? "robotics" : "white"); world.add(s); snake.push(s); s.userData = { drag: "G" }; PICK.push(s); s.visible = false; }
{ const hit = new THREE.Mesh(new THREE.BoxGeometry(15, 2, 12), new THREE.MeshBasicMaterial()); hit.position.set(54, 2, 40.5); hit.visible = false; hit.userData = { drag: "G" }; world.add(hit); PICK.push(hit); }
{ const st = box(4.9, 3.15, 0.1, "plank"); st.position.set(59.5, 6.65, 47.02); world.add(st); own(8, st);
  const bd = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.87), new THREE.MeshBasicMaterial({ map: tex(IMG.chart) })); bd.position.set(59.5, 6.65, 47.1); world.add(bd); bd.userData = { photo: "chart" }; PICK.push(bd); own(8, bd); }
let G = 0.75, Ggoal = 0.75, snakeX = 0;
const beta = new Array(6).fill(0);

/* ---------- 9 lighthouse ---------- */
const beamG = new THREE.Group(); beamG.position.set(65, 12.6, 52); world.add(beamG); own(9, beamG);
const beamMat = new THREE.MeshBasicMaterial({ color: 0xfff4c2, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide });
const beamPivot = new THREE.Group();
{ const lb = box(1.4, 1.1, 1.4, "glass", { mat: glassMat }); beamG.add(lb); lb.userData = { go: 9 }; PICK.push(lb);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(1.6, 14, 20, 1, true), beamMat); beam.rotation.z = Math.PI / 2; beam.position.x = 7; beamPivot.add(beam); beamG.add(beamPivot);
  const roof = part(new THREE.ConeGeometry(1.5, 1.2, 4), "ink", { th: 1 }); roof.position.y = 1.15; roof.rotation.y = Math.PI / 4; beamG.add(roof); }

/* ---------- the mesh network: rails drawn along the route, a cart that carries the tour ---------- */
const railPts = [];
for (let i = 0; i < PATH.length; i++) {
  const a = PATH[i], b = PATH[(i + 1) % PATH.length], nx = -(b.z - a.z), nz = b.x - a.x;
  for (const o of [-0.28, 0.28]) railPts.push(a.x + 0.5 + nx * o, S(a.x, a.z) + 0.03, a.z + 0.5 + nz * o, b.x + 0.5 + nx * o, S(b.x, b.z) + 0.03, b.z + 0.5 + nz * o);
}
const railGeo = new THREE.BufferGeometry(); railGeo.setAttribute("position", new THREE.Float32BufferAttribute(railPts, 3)); railGeo.setDrawRange(0, 0);
world.add(new THREE.LineSegments(railGeo, lineMat.s));
const cart = new THREE.Group(); world.add(cart); cart.visible = false;
{ const cb = box(0.95, 0.5, 0.75, "plank"); cb.position.y = 0.42; const cr = box(1.0, 0.08, 0.8, "ink"); cr.position.y = 0.7; cart.add(cb, cr); }
const p0 = PATH[stopAt[0]]; cart.position.set(p0.x + 0.5, S(p0.x, p0.z), p0.z + 0.5);
let travel = null, clackT = 0;
