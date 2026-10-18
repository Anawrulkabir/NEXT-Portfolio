/* ============================================================================
 * fahad-kabir.yaml — a portfolio you deploy.
 * 1 · core: helpers, content, palette, the voxel island and its regions.
 * Inputs from the host: THREE, ROOT (the experience element), IMG (image URLs).
 * ========================================================================== */
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const V3 = THREE.Vector3;
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
const ease = (t) => 1 - Math.pow(1 - clamp(t), 3);
const $ = (s, r = ROOT) => r.querySelector(s);
const html = String.raw;
const store = {
  get(k, d) { try { const v = localStorage.getItem("fk." + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("fk." + k, JSON.stringify(v)); } catch {} },
};
const rnd = ((a) => () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; })(7);

/* ---------- content: every fact comes from the CVs and the project kits ---------- */
const ACC = { core: "#3f3f46", research: "#7c5cff", robotics: "#f59e0b", software: "#0d9488", infra: "#0ea5e9", products: "#e11d48", contests: "#65a30d" };
const STATIONS = [
  { id: "workshop", svc: "workshop", ns: "core", name: "Workshop", tag: "Start here · whoami", c: [36, 28], hit: [26, 22, 46, 34, 3], zoom: 1.9, marker: [38, 35], control: "identity",
    sum: "Md Anawrul Kabir Fahad. Final-year Mechanical Engineering student at CUET who builds research software, after a year running GPU platforms at Poridhi.io. Every building on this island is one deployment of my work.",
    facts: ["Research: models that stay reliable outside their training conditions", "Two papers under review in the International Journal of Refrigeration, one at BSME ICTFE", "The name in the plaza is set in the same blocks as everything else"] },
  { id: "pitch", svc: "soccer-pitch", ns: "robotics", name: "Soccer pitch", tag: "2022 · Robo Soccer", c: [34, 47], hit: [26, 42, 42, 52, 3], zoom: 2.3, marker: [37, 41], control: "kick",
    sum: "Where it started: a remote-controlled soccer robot for Robo Soccer at Chittagong Science Carnival 2.0, which earned a Certificate of Recognition. The billboard holds the real photos of both versions and the parts.",
    facts: ["Arduino Uno, BTS7960 motor drivers, 3S LiPo, HC-05 Bluetooth", "Plywood chassis, rebuilt into a second version"] },
  { id: "hall", svc: "hall-of-fame", ns: "contests", name: "Hall of fame", tag: "8 certificates", c: [15, 39], hit: [8, 34, 22, 44, 6], zoom: 2.4, marker: [25, 41], control: "certs",
    sum: "Eight certificates stand in a card tray. Point at one and it rises above the others; click to pull it out and read it. Arrow keys walk the tray.",
    facts: ["Champion, Break The Monolith Hackathon 2025 (Team_Deadlock)", "Finalist and CUET Rising Team, API Avengers, Televerse 1.0", "7th, Brain Station 23 AI Engineering · 9th, NSU TechFest WebXtreme", "ICPC Dhaka Regional preliminary, CUET IUPC, ASRRO Robocoder"] },
  { id: "gpu", svc: "gpu-datacenter", ns: "infra", name: "GPU datacenter", tag: "Poridhi.io · 2025–26", c: [10, 26], hit: [4, 20, 17, 32, 6], zoom: 2.1, marker: [17, 27], control: "race",
    sum: "AI Studio gives each user a GPU workspace with Jupyter or VS Code. It used to boot a fresh EC2 GPU machine for every session (the cloud floating offshore). We moved it to a Kubernetes cluster on the company’s own GPU server, where one RTX 4090 is cut into isolated slices.",
    facts: ["Launch time cut by about 70%, from 10–15 to 3–5 minutes", "Six users share 48 GB of VRAM as isolated 8 GB slices (HAMi)", "Built the Next.js frontend; brought the services up on the new cluster", "Also: owned the TensorCode frontend, co-developed TensorRAG"] },
  { id: "market", svc: "market-street", ns: "products", name: "Market street", tag: "Products", c: [17, 14], hit: [10, 9, 25, 19, 5], zoom: 2.3, marker: [21, 22],
    sum: "Things shipped to real users. Zeenah Store sells handloom sarees and jewellery. The Olly Labs assistant records meetings and turns them into notes. The kiosk is Puku AI’s public site.",
    facts: ["Zeenah Store: Next.js, Supabase, Google sign-in, Vercel", "Olly Labs meeting notes: React, Supabase, Microsoft Azure", "Puku AI: public website, admin tools and subscriptions"] },
  { id: "tunnel", svc: "wind-tunnel", ns: "research", name: "Wind tunnel", tag: "Thesis · under review", c: [38, 8], hit: [28, 5, 48, 12, 9], zoom: 2.2, marker: [37, 14], control: "aoa",
    sum: "My thesis: what a physics-informed airfoil surrogate forgets when you adapt it, with low-rank updates, to flow conditions outside its training range. CFD reference data from SU2; eight adaptation methods compared on accuracy and forgetting.",
    facts: ["Localized forgetting in parameter-efficient adaptation of a frozen physics-informed airfoil surrogate", "10th BSME International Conference on Thermo-Fluid Engineering, under review", "Advisor: Prof. Dr. Md. Abu Mowazzem Hossain"] },
  { id: "hx", svc: "heat-exchanger", ns: "research", name: "Heat-exchanger tower", tag: "2 journal papers", c: [55, 9], hit: [52, 6, 59, 12, 9], zoom: 2.5, marker: [56, 14], control: "stack",
    sum: "Machine learning that predicts evaporation and condensation heat transfer of two low-GWP refrigerants, R455A and R1336mzz(E), in an industrial plate heat exchanger, from Saga University experiments.",
    facts: ["Tested on operating conditions left out of training: standard validation overstates generalization", "Measurement uncertainty analysis for the R455A study", "International Journal of Refrigeration, both under review"] },
  { id: "propbench", svc: "propbench", ns: "software", name: "PropBench lab", tag: "Open source · pre-alpha", c: [62, 24], hit: [56, 18, 68, 30, 5], zoom: 2.3, marker: [54, 25], control: "loupe",
    sum: "A desktop workbench that takes researchers from lab measurements to a validated thermophysical property model. Move the loupe over the sheet; open the laptop; try the padlock: the model-selection rule is locked by hash before any fit.",
    facts: ["Flags a +7.4 % offset between two labs at 333 K (95 %: 3.1–11.8 %)", "Rust and Tauri shell, Python science worker, JSON-RPC between them", "450+ tests; CI on Windows, macOS and Linux"] },
  { id: "yard", svc: "robotics-yard", ns: "robotics", name: "Robotics yard", tag: "Simulation · 2026", c: [54, 40], hit: [46, 34, 62, 47, 4], zoom: 2.3, marker: [56, 33], control: "G",
    sum: "A seven-segment, cable-driven snake robot, simulated in MuJoCo before any part is bought, to test whether a partly compliant body crosses a post lattice better than a stiff or a loose one.",
    facts: ["433 paired, randomized trials; 133 tests", "Pass/fail rules written before each run", "The board on the hut shows the real result chart"] },
  { id: "lighthouse", svc: "contact", ns: "core", name: "Lighthouse", tag: "Contact", c: [65, 52], hit: [61, 48, 69, 56, 14], zoom: 2.2, marker: [65, 45], control: "contact",
    sum: "Get in touch. The beam keeps turning while you read.",
    facts: ["Email, LinkedIn and GitHub, as on the CV", "CV as a PDF", "fahadkabir.com"] },
];
const CERTS = [
  ["break-the-monolith-champion", "Champion — Break The Monolith Microservice Hackathon", "IEEE Computer Society, CUET Student Branch Chapter", "2025"],
  ["api-avengers-finalist", "Finalist — API Avengers, Televerse 1.0", "Dept. of ETE, CUET", "2025"],
  ["api-avengers-rising-team", "CUET Rising Team — API Avengers, Televerse 1.0", "Dept. of ETE, CUET", "2025"],
  ["ai-engineering-hackathon-2025", "AI Engineering Hackathon 2025", "Poridhi.io, powered by Brain Station 23", "26 Apr 2025"],
  ["nsu-techfest-webxtreme-2025", "WebXtreme 25 Hackathon, NSU Tech Fest 2025", "North South University (NSUCEC)", "2025"],
  ["nextgen-hackathon-2025", "NextGen Hackathon 2025, IIUC Tech Fest", "Programming Hero and IIUC", "Nov 2025"],
  ["asrro-robocoder-2022", "ASRRO Robocoder Programming Contest", "ASRRO, CUET", "30 Nov 2022"],
  ["cuss-robo-soccer", "Recognition — Robo Soccer, Chittagong Science Carnival 2.0", "Chittagong University Scientific Society", "2022"],
];
const PHOTOS = [["versions", "The soccer robot, first and second version"], ["bench", "Arduino Uno, breadboard and buck converters"], ["parts", "The parts laid out before assembly"]];
const STEP2 = [5, 4, 1, 2, 5, 0, 0], H1 = { 0: 10, 2: 8, 3: 6, 4: 10 };
const LINKS = { github: "https://github.com/anawrulkabir", linkedin: "https://linkedin.com/in/anawrulkabir", site: "https://fahadkabir.com", cv: { swe: "/cv/Md-Anawrul-Kabir-Fahad-SWE-CV.pdf", academic: "/cv/Md-Anawrul-Kabir-Fahad-Academic-CV.pdf" }, email: "mdanawrulkabirfahad123@gmail.com" };
/** Both CVs, always side by side and always labelled by kind. */
const cvLinks = () => `<a href="${LINKS.cv.swe}" download="Md-Anawrul-Kabir-Fahad-SWE-CV.pdf">Software engineering CV</a><a href="${LINKS.cv.academic}" download="Md-Anawrul-Kabir-Fahad-Academic-CV.pdf">Academic CV</a>`;

/* ---------- palette: paper blocks, hairline edges; one accent per district ---------- */
const MATS = {
  grass: ["#f4f4f2", "#232327"], dirt: ["#e4e2dd", "#18181b"], sand: ["#efe7d4", "#2d2a24"], path: ["#e2e2e6", "#38383f"], stone: ["#d8d8dc", "#3f3f46"],
  plank: ["#e8d9c2", "#4a4036"], ink: ["#45454d", "#9a9aa3"], leaf: ["#d6e7cd", "#2b3a2c"], field: ["#e3efdc", "#24302a"], chalk: ["#ffffff", "#7b8a7f"],
  white: ["#fbfbfa", "#4b4b53"], glass: ["#dcecf8", "#264257"], cloud: ["#ffffff", "#454b57"], gold: ["#e8c766", "#b8953a"], screen: ["#0b0b0c", "#0b0b0c"],
  research: [ACC.research, "#9b85ff"], robotics: [ACC.robotics, "#f7b23b"], software: [ACC.software, "#2dd4bf"], infra: [ACC.infra, "#38bdf8"], products: [ACC.products, "#fb7185"], contests: [ACC.contests, "#84cc16"],
  warm: ["#fde2e2", "#5b2b31"], cool: ["#dbeafe", "#1f3a5c"],
};
let dark = false;
const col = (m) => new THREE.Color(MATS[m] ? MATS[m][dark ? 1 : 0] : m);
const LDIR = new V3(0.4, 1, 0.6).normalize();
const shadeOf = (n) => 0.68 + 0.32 * Math.max(0, n.dot(LDIR));

/* ---------- the voxel island ---------- */
const VX = new Map();
const K = (x, y, z) => x + "," + y + "," + z;
const put = (x, y, z, m) => VX.set(K(x, y, z), m);
const fill = (x0, y0, z0, x1, y1, z1, m) => { for (let x = x0; x < x1; x++) for (let y = y0; y < y1; y++) for (let z = z0; z < z1; z++) put(x, y, z, m); };
const shell = (x0, y0, z0, x1, y1, z1, m, sides) => { for (let x = x0; x < x1; x++) for (let y = y0; y < y1; y++) for (let z = z0; z < z1; z++) { const e = (sides.includes("x0") && x === x0) || (sides.includes("x1") && x === x1 - 1) || (sides.includes("z0") && z === z0) || (sides.includes("z1") && z === z1 - 1) || (sides.includes("y0") && y === y0) || (sides.includes("y1") && y === y1 - 1); if (e) put(x, y, z, m); } };
const inMain = (x, z) => { const nx = (x + 0.5 - 36) / 38, nz = (z + 0.5 - 28) / 30, n = 0.05 * Math.sin(x * 0.7) * Math.cos(z * 0.5) + 0.04 * Math.sin((x + z) * 0.33); return nx * nx + nz * nz < 1 + n; };
const inIslet = (x, z) => (x + 0.5 - 65.5) ** 2 + (z + 0.5 - 52.5) ** 2 < 2.6 ** 2;
const inside = (x, z) => inMain(x, z) || inIslet(x, z);
const H = (x, z) => {
  if (!inMain(x, z)) return 0;
  const hz = z < 14 ? 3 : z < 16 ? 2 : z < 18 ? 1 : 0;
  const hx = Math.min(x < 26 ? 0 : x < 27 ? 1 : x < 28 ? 2 : 3, x >= 66 ? 0 : x >= 65 ? 1 : x >= 64 ? 2 : 3);
  return Math.min(hz, hx);
};
const S = (x, z) => H(Math.floor(x), Math.floor(z)) + 1;
for (let x = -2; x < 74; x++) for (let z = -2; z < 58; z++) {
  if (!inside(x, z)) continue;
  const h = H(x, z), coast = !inside(x + 1, z) || !inside(x - 1, z) || !inside(x, z + 1) || !inside(x, z - 1);
  for (let y = -2; y <= h; y++) put(x, y, z, y === h ? (coast ? "sand" : "grass") : "dirt");
}
const setTop = (x, z, m) => put(x, H(x, z), z, m);

// the service mesh: a closed loop through every stop, in tour order
const ROUTE = [[36, 35, 0], [36, 40, 1], [24, 40, 2], [24, 26], [18, 26, 3], [18, 21], [20, 21, 4], [36, 21], [36, 15, 5], [55, 15, 6], [55, 24, 7], [55, 32, 8], [64, 32], [64, 44, 9], [64, 48], [45, 48], [45, 35]];
const PATH = [];
for (let i = 0; i < ROUTE.length; i++) {
  const a = ROUTE[i], b = ROUTE[(i + 1) % ROUTE.length], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
  for (let k = 0; k < n; k++) PATH.push({ x: a[0] + Math.sign(b[0] - a[0]) * k, z: a[1] + Math.sign(b[1] - a[1]) * k, stop: k === 0 && a[2] !== undefined ? a[2] : undefined });
}
const stopAt = []; PATH.forEach((p, i) => { if (p.stop !== undefined) stopAt[p.stop] = i; });
for (const p of PATH) { if (inside(p.x, p.z)) setTop(p.x, p.z, "path"); else put(p.x, 0, p.z, "plank"); }
for (let z = 48; z < 51; z++) if (!inside(64, z)) put(64, 0, z, "plank");

// workshop plaza with the name set into the floor
for (let x = 26; x < 46; x++) for (let z = 22; z < 34; z++) setTop(x, z, "stone");
const FONT = { F: ["111", "100", "110", "100", "100"], A: ["010", "101", "111", "101", "101"], H: ["101", "101", "111", "101", "101"], D: ["110", "101", "101", "101", "110"] };
[..."FAHAD"].forEach((ch, i) => FONT[ch].forEach((row, r) => [...row].forEach((b, c) => { if (b === "1") setTop(27 + i * 4 + c, 25 + r, "ink"); })));
fill(29, 1, 31, 31, 2, 32, "plank"); put(29, 2, 31, "ink");
// pitch
for (let x = 26; x < 43; x++) for (let z = 42; z < 53; z++) if (inside(x, z)) setTop(x, z, "field");
for (let x = 27; x < 42; x++) { setTop(x, 43, "chalk"); setTop(x, 51, "chalk"); }
for (let z = 43; z < 52; z++) { setTop(27, z, "chalk"); setTop(41, z, "chalk"); setTop(34, z, "chalk"); }
for (const gx of [26, 42]) { fill(gx, 1, 45, gx + 1, 3, 46, "ink"); fill(gx, 1, 49, gx + 1, 3, 50, "ink"); fill(gx, 3, 45, gx + 1, 4, 50, "ink"); }
fill(28, 1, 42, 29, 4, 43, "ink"); fill(33, 1, 42, 34, 4, 43, "ink"); fill(28, 4, 42, 34, 5, 43, "plank");
// hall of fame: two walls open to the viewer, a long table for the card tray
fill(8, 1, 34, 23, 2, 45, "stone");
fill(8, 2, 34, 23, 8, 35, "white"); fill(8, 2, 35, 9, 8, 45, "white");
fill(8, 8, 34, 23, 9, 35, "contests"); fill(8, 8, 35, 9, 9, 45, "contests");
fill(12, 2, 37, 20, 3, 42, "plank");
fill(10, 2, 42, 11, 3, 43, "stone");
// GPU datacenter
fill(4, 1, 20, 17, 2, 33, "stone");
fill(4, 2, 20, 17, 7, 21, "white"); fill(4, 2, 21, 5, 7, 33, "white");
fill(4, 7, 20, 17, 8, 21, "infra"); fill(4, 7, 21, 5, 8, 33, "infra");
for (const rx of [6, 8, 10]) fill(rx, 2, 22, rx + 1, 5, 31, "ink");
// market street
const shop = (x0, z0, roof) => { fill(x0, 1, z0, x0 + 5, 5, z0 + 5, "plank"); fill(x0 + 1, 1, z0 + 4, x0 + 4, 4, z0 + 5, "white"); fill(x0, 5, z0, x0 + 5, 6, z0 + 5, roof); for (let x = x0; x < x0 + 5; x++) put(x, 4, z0 + 5, x % 2 ? roof : "white"); };
shop(11, 11, "products"); shop(18, 11, "products");
fill(12, 1, 18, 14, 3, 19, "white"); put(12, 3, 18, "products"); put(13, 3, 18, "products");
// wind tunnel
shell(30, 4, 6, 46, 9, 11, "glass", ["z0", "z1", "y0", "y1"]);
shell(28, 4, 5, 30, 10, 12, "ink", ["z0", "z1", "y0", "y1"]); fill(28, 4, 5, 30, 10, 6, "ink");
// heat-exchanger plinth
fill(52, 4, 6, 59, 5, 13, "stone");
// PropBench lab: back walls, glass sill, bench, a desk for the laptop
fill(56, 1, 18, 69, 2, 31, "stone");
fill(56, 2, 18, 69, 6, 19, "white"); fill(56, 2, 19, 57, 6, 31, "white");
fill(56, 6, 18, 69, 7, 19, "software"); fill(56, 6, 19, 57, 7, 31, "software");
for (let x = 57; x < 69; x++) put(x, 2, 30, "glass"); for (let z = 19; z < 31; z++) put(68, 2, z, "glass");
fill(59, 2, 23, 66, 3, 28, "plank");
fill(58, 2, 19, 66, 3, 21, "plank");
// robotics yard
for (let x = 46; x < 63; x++) { if (x < 53 || x > 56) put(x, 1, 34, "ink"); put(x, 1, 47, "ink"); }
for (let z = 34; z < 48; z++) { put(46, 1, z, "ink"); put(62, 1, z, "ink"); }
fill(57, 1, 44, 62, 4, 47, "plank"); fill(57, 4, 44, 62, 5, 47, "robotics");
// lighthouse
for (let y = 1; y < 11; y++) fill(64, y, 51, 66, y + 1, 53, Math.floor((y - 1) / 2) % 2 ? "ink" : "white");
fill(63, 11, 50, 67, 12, 54, "ink");
// trees, only where nothing else stands
const busy = (x, z) => STATIONS.some((s) => x >= s.hit[0] - 1 && x <= s.hit[2] && z >= s.hit[1] - 1 && z <= s.hit[3]) || PATH.some((p) => Math.abs(p.x - x) <= 1 && Math.abs(p.z - z) <= 1);
const trees = [];
for (let n = 0; n < 400 && trees.length < 34; n++) {
  const x = 3 + Math.floor(rnd() * 66), z = 3 + Math.floor(rnd() * 50);
  if (!inMain(x - 2, z) || !inMain(x + 2, z) || !inMain(x, z - 2) || !inMain(x, z + 2) || busy(x, z) || trees.some((t) => Math.abs(t[0] - x) < 3 && Math.abs(t[1] - z) < 3)) continue;
  if (H(x - 1, z) !== H(x + 1, z) || H(x, z - 1) !== H(x, z + 1)) continue;
  trees.push([x, z]);
  const y = H(x, z) + 1, tall = 2 + (rnd() > 0.6 ? 1 : 0);
  fill(x, y, z, x + 1, y + tall, z + 1, "plank");
  fill(x - 1, y + tall, z - 1, x + 2, y + tall + 2, z + 2, "leaf"); put(x, y + tall + 2, z, "leaf");
}

/* ---------- regions: each station is a node; its ground rises, its building prints ---------- */
const regionOf = (x, z) => { let b = 0, bd = 1e9; STATIONS.forEach((s, i) => { const d = (x - s.c[0]) ** 2 + (z - s.c[1]) ** 2; if (d < bd) { bd = d; b = i; } }); return b; };
const RV = STATIONS.map(() => ({ terrain: new Map(), struct: new Map(), top: 1 }));
for (const [k, m] of VX) {
  const [x, y, z] = k.split(",").map(Number), r = RV[regionOf(x, z)];
  if (y <= H(x, z)) r.terrain.set(k, m); else { r.struct.set(k, m); r.top = Math.max(r.top, y + 1); }
}
