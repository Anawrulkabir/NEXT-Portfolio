/* ============================================================================
 * 5 · the running system: camera, boot, HUD, terminal commands, panels,
 * pointer and keys, and the one frame loop that drives it all.
 * ========================================================================== */
/* ---------- theme ---------- */
function applyTheme() {
  const r = document.documentElement.getAttribute("data-theme");
  dark = r ? r === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  ROOT.classList.toggle("is-night", dark);
  scene.background = new THREE.Color(dark ? "#0e1620" : "#e8f0f5");
  water.material.color.set(dark ? "#0e1620" : "#e8f0f5");
  const ln = dark ? "#e4e4e7" : "#18181b";
  lineMat.t.color.set(ln); lineMat.t.opacity = dark ? 0.07 : 0.1;
  lineMat.s.color.set(ln); lineMat.s.opacity = dark ? 0.32 : 0.42;
  REG.forEach((r) => { r.mats.line.color.set(ln); r.mats.line.opacity = dark ? 0.32 : 0.42; });
  lineMat.d.color.set(dark ? "#9fb4c7" : "#7d93a5"); lineMat.d.opacity = 0.45;
  coastMat.color.set(dark ? "#9fb4c7" : "#52525b");
  pMat.color.set(dark ? "#e9e3ff" : "#3f3f46");
  beamPivot.visible = dark;
  buildRegions(); recolor();
}
/** show a theme and remember it: the site's pages restore it before they paint (src/lib/theme.ts) */
function setTheme(t) { document.documentElement.setAttribute("data-theme", t); store.set("theme", t); }
new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
applyTheme();

/* ---------- camera ---------- */
const EL = Math.atan(1 / Math.SQRT2), VIEW = 58;
const ctl = { t: new V3(), tg: new V3(), az: Math.PI / 4, azg: Math.PI / 4, z: 1, zg: 1, ox: 0, oy: 0, oxg: 0, oyg: 0, tween: null };
let W = 1, Hh = 1, mobile = false;
const overviewZoom = () => (mobile ? 0.5 : clamp(W / 1150, 0.72, 1.05));
const OVER = new V3(37, 2, 31);
const bootZoom = () => overviewZoom() * 1.35;
function size() {
  const r = ROOT.getBoundingClientRect(); W = Math.max(1, r.width); Hh = Math.max(1, r.height);
  const was = mobile; mobile = W < 640; ROOT.classList.toggle("is-mobile", mobile);
  termDirty = true;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2)); renderer.setSize(W, Hh, false);
  if (BOOT.phase === "idle" || BOOT.phase === "typed") { ctl.tg.copy(OVER); ctl.zg = bootZoom(); }
  requestAnimationFrame(() => DEV.fitScreen());
  layoutOffsets(); placeSheet();
  return was !== mobile;
}
function placeCam() {
  const a = W / Hh, h = VIEW / 2;
  cam.left = -h * a + ctl.ox * h * a; cam.right = h * a + ctl.ox * h * a; cam.top = h + ctl.oy * h; cam.bottom = -h + ctl.oy * h; cam.zoom = ctl.z;
  const d = 200, wt = ctl.t.clone().add(world.position);
  cam.position.set(wt.x + d * Math.cos(EL) * Math.sin(ctl.az), wt.y + d * Math.sin(EL), wt.z + d * Math.cos(EL) * Math.cos(ctl.az));
  cam.lookAt(wt); cam.updateProjectionMatrix();
}
const tweenCam = (to, zoom, dur, now) => { ctl.tween = { a: ctl.t.clone(), za: ctl.z, b: to.clone(), zb: zoom, t0: now, dur }; };

/* ---------- state ---------- */
const ui = { mode: "explore", cur: -1, hover: -1, sheet: "half", term: "compact" };
const BOOT = { phase: "idle", typed: "", idleT: 0, ghost: false, bt: 0, speed: 1, events: [], rows: [], last: 0, ghostWait: 0 };
const CMD = "kubectl apply -f fahad-kabir.yaml";
const labels = $("[data-labels]"), panel = $("[data-panel]"), tourbar = $("[data-tourbar]"), svcList = $("[data-svc]");
const labelEls = STATIONS.map((s, i) => { const b = document.createElement("button"); b.type = "button"; b.className = "w-label"; b.style.setProperty("--a", ACC[s.ns]); b.innerHTML = `<i></i>${s.name}`; b.addEventListener("click", () => go(i)); labels.appendChild(b); return b; });
svcList.innerHTML = `<button type="button" class="svc-h" data-svc-fold aria-expanded="true" aria-label="Show or hide the services"><span>svc</span><span class="svc-ns">ns</span><span class="svc-n">${STATIONS.length} running</span><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 3.75 5 6.25l2.5-2.5"/></svg></button>` + STATIONS.map((s, i) => `<button type="button" class="svc-row" data-goto="${i}" style="--a:${ACC[s.ns]}"><i></i><span>${s.svc}</span><em>${s.ns}</em></button>`).join("");
const svcRows = [...svcList.querySelectorAll(".svc-row")];
svcRows.forEach((b, i) => { b.addEventListener("pointerenter", () => (ui.hover = i)); b.addEventListener("pointerleave", () => (ui.hover = -1)); });

function layoutOffsets() {
  if (ui.cur < 0 || BOOT.phase !== "live") { ctl.oxg = 0; ctl.oyg = 0; return; }
  if (mobile) { ctl.oxg = 0; ctl.oyg = ui.sheet === "peek" ? -0.08 : -0.24; }
  else { const frac = Math.min(380, W * 0.42) / W; ctl.oxg = frac * 0.9; ctl.oyg = 0; }
}

/* ---------- panels ---------- */
let panelField = null, panelRiffle = null;
function controlHTML(s) {
  switch (s.control) {
    case "identity": return html`<div class="w-id" data-id-here></div>`;
    case "aoa": return html`<div class="w-ctl"><label for="w-aoa">Angle of attack <output data-out="aoa">4°</output></label><input id="w-aoa" type="range" min="-4" max="18" step="0.5" value="4" data-in="aoa"><p class="w-read" data-read="aoa"></p></div>`;
    case "G": return html`<div class="w-ctl"><label for="w-g">Compliance G <output data-out="G">0.75</output></label><input id="w-g" type="range" min="0" max="1.5" step="0.25" value="0.75" data-in="G"><p class="w-read" data-read="G"></p><p class="w-note">Drag across the yard, or use the slider. The numbers are logged results; the motion is an illustration.</p></div>`;
    case "stack": return html`<div class="w-ctl"><button class="w-btn" type="button" data-act="stack">${hxGoal ? "Close the stack" : "Open the stack"}</button><p class="w-note">Warm plates carry the refrigerant, cool plates the water. They alternate.</p></div>`;
    case "loupe": return html`<div class="w-ctl"><p class="w-read" data-read="loupe"></p><p class="w-read" data-read="lock"></p><p class="w-note">Move the loupe over the sheet. The laptop lid follows your pointer’s height; the padlock opens when you reach for it.</p></div>`;
    case "race": return html`<div class="w-ctl"><button class="w-btn" type="button" data-act="race">Launch a session both ways</button><div class="w-race"><div><span>AWS · new EC2 machine</span><b data-race="aws">—</b></div><i><s data-bar="aws"></s></i><div><span>Bare metal · HAMi slice</span><b data-race="bm">—</b></div><i><s data-bar="bm"></s></i></div><p class="w-note">One launch drawn from each stated range (10–15 and 3–5 minutes), a second of animation per 2.5 minutes.</p></div>`;
    case "kick": return html`<div class="w-ctl"><button class="w-btn" type="button" data-act="kick">Kick off</button><div class="w-thumbs">${PHOTOS.map(([id, alt], k) => `<button type="button" data-photo="${k}"><img alt="${alt}" src="${IMG[id]}"></button>`).join("")}</div></div>`;
    case "certs": return html`<div class="w-ctl w-riffle"><div class="w-riffle-fig" data-riffle></div><p class="w-read" data-riffle-read>Point at the tray to pull a card · click it to read</p></div>
      <ol class="w-certs">${CERTS.map(([, t, iss, d], k) => `<li><button type="button" data-card="${k}"><span>${String(k + 1).padStart(2, "0")}</span><b>${t}</b><em>${iss} · ${d}</em></button></li>`).join("")}</ol>`;
    case "contact": return html`<div class="w-ctl w-contact"><p class="w-read"><b>${LINKS.email}</b></p><div class="id-links"><button type="button" data-copy="${LINKS.email}">Copy email</button>${cvLinks()}<a href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a href="${LINKS.github}" target="_blank" rel="noopener">GitHub</a></div></div>`;
    default: return "";
  }
}
function renderPanel() {
  if (panelField) { panelField.destroy(); panelField = null; }
  if (panelRiffle) { panelRiffle.destroy(); panelRiffle = null; }
  if (ui.cur < 0) { panel.removeAttribute("data-open"); return; }
  const s = STATIONS[ui.cur], last = STATIONS.length - 1;
  panel.style.setProperty("--a", ACC[s.ns]);
  panel.innerHTML = html`<div class="w-grab" data-act="sheet" aria-hidden="true"></div>
    <div class="w-ph"><div><p class="w-tag"><i></i>svc/${s.svc} · ns/${s.ns} · <b>Running</b></p><h3 class="w-title">${s.name}</h3><p class="w-sub">${s.tag}</p></div><div><button class="w-full" type="button" data-act="sheetfull" aria-label="${ui.sheet === "full" ? "Make the sheet smaller" : "Full screen"}">${ui.sheet === "full" ? "⤡" : "⤢"}</button><button class="w-x" type="button" data-act="close" aria-label="Back to the island">×</button></div></div>
    <div class="w-body"><p class="w-sum">${s.sum}</p>${controlHTML(s)}<ul class="w-facts">${s.facts.map((f) => `<li>${f}</li>`).join("")}</ul>
    <p class="w-more"><a class="w-page" href="${s.page[0]}">${s.page[1]} →</a><a href="#" data-act="read">Everything as text</a></p></div>
    <div class="w-nav"><button type="button" data-act="prev" ${ui.cur === 0 ? "disabled" : ""}>← ${ui.cur > 0 ? STATIONS[ui.cur - 1].name : ""}</button><span>${ui.cur + 1} / ${STATIONS.length}</span><button type="button" data-act="next" ${ui.cur === last ? "disabled" : ""}>${ui.cur < last ? STATIONS[ui.cur + 1].name : ""} →</button></div>`;
  panel.setAttribute("data-open", ""); panel.dataset.sheet = ui.sheet; placeSheet();
  const idHere = panel.querySelector("[data-id-here]"); if (idHere) panelField = identityCard(idHere, true);
  // the Hall's tray is Hairline's own Riffle: eight cards for eight certificates; the pulled one opens on click
  const rf = panel.querySelector("[data-riffle]");
  if (rf && HLIB && HLIB.riffle) {
    let cur = -1; const rd = panel.querySelector("[data-riffle-read]");
    panelRiffle = HLIB.riffle(rf, { intensity: 0.5, label: "A tray of eight certificates. Point at a card to pull it, click to read it; the arrow keys walk the tray and Enter opens the pulled card.", onRead: (t) => {
      cur = t === "rest" ? -1 : +t - 1;
      rd.innerHTML = cur < 0 ? "Point at the tray to pull a card · click it to read" : `<b>${String(cur + 1).padStart(2, "0")}</b> · ${CERTS[cur][1]}`;
      if (cur >= 0) SFX.flick(cur);
    } });
    const open = () => { if (cur >= 0) openCert(cur, rf.getBoundingClientRect(), "tray"); };
    rf.addEventListener("click", open);
    rf.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  } else if (rf) rf.closest(".w-riffle").remove();
  const ain = panel.querySelector('[data-in="aoa"]'); if (ain) { ain.value = aoaGoal; ain.addEventListener("input", () => { aoaGoal = +ain.value; }); }
  const gin = panel.querySelector('[data-in="G"]'); if (gin) { gin.value = Ggoal; gin.addEventListener("input", () => { Ggoal = +gin.value; SFX.flick(Math.round(Ggoal * 4)); }); }
}
function updateReads() {
  const o = (k, v) => { const e = panel.querySelector(`[data-out="${k}"]`); if (e && e.textContent !== v) e.textContent = v; };
  const r = (k, v) => { const e = panel.querySelector(`[data-read="${k}"]`); if (e && e.innerHTML !== v) e.innerHTML = v; };
  o("aoa", `${Math.round(aoaGoal * 2) / 2}°`);
  r("aoa", aoaGoal > 12 ? "Past the conditions the surrogate was trained on: this is where low-rank adaptation comes in, and where forgetting is measured." : "Inside the conditions the surrogate was trained on.");
  const gi = Math.round(Ggoal / 0.25); o("G", (gi * 0.25).toFixed(2));
  r("G", `<b>G ${(gi * 0.25).toFixed(2)}</b> · ${gi === 0 ? "stiff" : gi >= 5 ? "loose" : "partly compliant"}<br>calibration step 2: <b>${STEP2[gi]}/5</b> crossed${H1[gi] !== undefined ? ` · fresh seeds: <b>${H1[gi]}/10</b>` : ""}<br><span class="mono">runs 20261017T111457Z_cc9bd78${H1[gi] !== undefined ? ", 20261018T071302Z_d73fb14" : ""}</span>`);
  r("loupe", lp.read);
  r("lock", lockGoal ? "<b>Selection rule locked</b> before fitting · <span class=\"mono\">74a0a4fae106…</span>" : "");
}

/* ---------- navigation ---------- */
function go(i, opts = {}) {
  if (BOOT.phase !== "live") return;
  if (lbOpen) closeLightbox();
  if (certK >= 0 && i !== 2) closeCert();
  const from = ui.cur;
  ui.cur = i; if (mobile) ui.sheet = "half";
  ROOT.dataset.view = "station";
  if (ui.mode === "tour" && from >= 0 && from !== i && !REDUCED && !opts.jump) startTravel(from, i);
  else { const p = PATH[stopAt[i]]; cart.position.set(p.x + 0.5, S(p.x, p.z), p.z + 0.5); focus(i); }
  renderPanel(); layoutOffsets(); syncNav(); SFX.open();
  store.set("last", i);
  if (!opts.fromHistory) setRoute(STATIONS[i].svc, opts.replace);
  if (!opts.quiet) logLine([seg("→ ", "dim"), seg("svc/" + STATIONS[i].svc, "acc"), seg("  200 OK", "ok")]);
}
function focus(i) { const s = STATIONS[i]; ctl.tween = null; ctl.tg.set(s.c[0] + 0.5, S(s.c[0], s.c[1]) + 1, s.c[1] + 0.5); ctl.zg = s.zoom * (mobile ? 0.62 : 1); SFX.whoosh(); }
function overview(opts = {}) { if (!opts.fromHistory) setRoute(""); closeCert(); ui.cur = -1; ROOT.dataset.view = "overview"; ctl.tween = null; ctl.tg.copy(OVER); ctl.zg = overviewZoom(); renderPanel(); layoutOffsets(); syncNav(); }
function startTravel(from, to) {
  const n = PATH.length, a = stopAt[from], b = stopAt[to], fwd = (b - a + n) % n, back = (a - b + n) % n, seq = [];
  if (fwd <= back) for (let k = 0; k <= fwd; k++) seq.push((a + k) % n); else for (let k = 0; k <= back; k++) seq.push((a - k + n) % n);
  travel = { seq, k: 0, to }; cart.visible = true; ctl.zg = Math.min(ctl.zg, mobile ? 1.5 : 1.7);
}
function syncNav() {
  tourbar.querySelector("[data-tname]").textContent = ui.cur >= 0 ? STATIONS[ui.cur].name : "The island";
  tourbar.querySelector("[data-tidx]").textContent = ui.cur >= 0 ? `${ui.cur + 1} / ${STATIONS.length}` : `${STATIONS.length} services`;
  ROOT.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === ui.mode)));
  labelEls.forEach((l, i) => l.toggleAttribute("data-on", i === ui.cur));
  svcRows.forEach((b, i) => b.toggleAttribute("aria-current", i === ui.cur));
}
function setMode(m, opts = {}) {
  const was = ui.mode;
  ui.mode = m; ROOT.dataset.mode = m;
  if (m === "read") { renderRead(); if (!opts.fromHistory) setRoute("read"); }
  else if (was === "read" && !opts.fromHistory) setRoute(ui.cur >= 0 ? STATIONS[ui.cur].svc : "", true);
  if (m === "tour") { if (ui.cur < 0) go(0, { jump: true, replace: true }); }
  else if (m === "explore" && mobile) overview(opts);
  syncNav();
}

/* ---------- the address bar: every station is a link (#/propbench), and Back steps back ---------- */
function routeOf() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
  if (h === "read") return { read: true };
  const i = STATIONS.findIndex((s) => s.svc === h);
  return i >= 0 ? { i } : null;
}
function setRoute(path, replace) {
  if (paused) return;
  const base = location.pathname + location.search, url = base + (path ? "#/" + path : "");
  if (url === base + location.hash) return;
  history[replace ? "replaceState" : "pushState"](history.state, "", url);
}
window.addEventListener("popstate", () => {
  if (paused || BOOT.phase !== "live") return;
  const r = routeOf(), o = { fromHistory: true };
  if (r && r.read) return setMode("read", o);
  if (ui.mode === "read") setMode(mobile ? "tour" : "explore", o);
  if (r) go(r.i, { jump: true, quiet: true, fromHistory: true }); else if (ui.cur >= 0) overview(o);
});

/* ---------- one way to dismiss: Esc, ×, or a click outside always closes the top layer ---------- */
function dismissTop() {
  if (mMenu.hasAttribute("data-open")) return toggleMenu(false);
  if (sndPop.hasAttribute("data-open")) return toggleSnd(false);
  if (certK >= 0) return closeCert();
  if (lbOpen) return closeLightbox();
  if (idPop.hasAttribute("data-open")) return toggleId(false);
  if (ui.mode === "read") return setMode(mobile ? "tour" : "explore");
  if (ui.cur >= 0) { SFX.close(); return overview(); }
  if (ui.term === "open") return setTerm("compact");
}

/* ---------- the HUD terminal: open, compact or closed, and it stays as the visitor left it ---------- */
/** a phone has no room for the compact strip, so there only "open" shows */
const termShown = () => ui.term === "open" || (ui.term === "compact" && !mobile);
function setTerm(st, remember = true) {
  ui.term = st; ROOT.dataset.term = st; termDirty = true;
  ROOT.querySelectorAll("[data-termtoggle]").forEach((b) => b.setAttribute("aria-pressed", String(termShown())));
  if (remember) store.set("term", st);
  if (st === "open" && !mobile) hudIn.focus();
  else if (st === "closed" && document.activeElement === hudIn) hudIn.blur();
}
function foldSvc(folded, remember = true) {
  svcList.toggleAttribute("data-folded", folded);
  svcList.querySelector("[data-svc-fold]").setAttribute("aria-expanded", String(!folded));
  if (remember) store.set("svc", folded ? "folded" : "open");
}
function renderRead() {
  $("[data-read-cv]").innerHTML = cvLinks();
  $("[data-read-list]").innerHTML = STATIONS.map((s, i) => html`<li style="--a:${ACC[s.ns]}"><p class="w-tag"><i></i>svc/${s.svc} · ${s.tag}</p><h4>${s.name}</h4><p>${s.sum}</p><ul>${s.facts.map((f) => `<li>${f}</li>`).join("")}</ul><p class="w-rlinks"><a href="${s.page[0]}">${s.page[1]} →</a><button type="button" data-goto="${i}">Visit in the world →</button></p></li>`).join("");
}

/* ---------- lightbox, synced with the card tray ---------- */
let lbOpen = false, lbList = [], lbK = 0;
const lb = $("[data-lightbox]");
function openLightbox(list, k) { lbList = list; lbK = k; lbOpen = true; lb.setAttribute("data-open", ""); drawLightbox(); }
function drawLightbox() {
  const it = lbList[lbK];
  lb.querySelector("img").src = it.src; lb.querySelector("img").alt = it.alt;
  lb.querySelector("[data-lbt]").textContent = it.title; lb.querySelector("[data-lbs]").textContent = it.sub;
  lb.querySelector("[data-lbn]").textContent = lbList.length > 1 ? `${lbK + 1} / ${lbList.length}` : "";
}
function closeLightbox() { lbOpen = false; lb.removeAttribute("data-open"); SFX.close(); }
const photoItems = PHOTOS.map(([id, alt]) => ({ src: IMG[id], alt, title: alt, sub: "Robo Soccer, 2022" }));
/* ---------- certificates: the pulled card keeps rising, into a framed reading card with the tray's punched tab ---------- */
const cv = $("[data-cert]"), cvCard = cv.querySelector(".cert-card");
let certK = -1, certSrc = null, certFrom = null;
/** where a frame sits on screen, so the card can rise from (and return to) its wall */
function frameRect(k) { const v = new V3(); frames[k].getWorldPosition(v); v.project(cam); const R = ROOT.getBoundingClientRect(), x = R.left + (v.x * 0.5 + 0.5) * W, y = R.top + (-v.y * 0.5 + 0.5) * Hh; return { left: x - 34, top: y - 24, width: 68, height: 48 }; }
const flip = (f) => { const to = cvCard.getBoundingClientRect(); return `translate(${f.left - to.left}px, ${f.top - to.top}px) scale(${f.width / to.width}, ${f.height / to.height})`; };
function drawCert() {
  const [id, t, iss, d] = CERTS[certK], img = cv.querySelector("img");
  img.src = IMG[id]; img.alt = t;
  cv.querySelector("[data-cert-t]").textContent = t; cv.querySelector("[data-cert-s]").textContent = `${iss} · ${d}`;
  cv.querySelector("[data-cert-n]").textContent = `No. ${String(certK + 1).padStart(2, "0")} of ${CERTS.length}`;
  cv.querySelectorAll(".cert-punch i").forEach((p, k) => p.classList.toggle("on", k === certK));
  certOpen.k = certK;
}
function openCert(k, from, src = "wall") {
  if (ui.cur !== 2) go(2, { jump: true, quiet: true });
  certK = k; certSrc = src; certFrom = from || frameRect(k); drawCert();
  cv.setAttribute("data-open", "");
  cvCard.style.transition = "none"; cvCard.style.transform = flip(certFrom); cvCard.offsetWidth;
  cvCard.style.transition = ""; cvCard.style.transform = "";
  SFX.whoosh(); cv.querySelector("[data-act='certclose']").focus({ preventScroll: true });
}
function stepCert(d) { certK = (certK + d + CERTS.length) % CERTS.length; if (certSrc === "wall") certFrom = frameRect(certK); drawCert(); SFX.flick(certK); }
function closeCert() {
  if (certK < 0) return;
  cvCard.style.transform = flip(certSrc === "wall" ? frameRect(certK) : certFrom);
  cv.removeAttribute("data-open"); certK = -1; certOpen.k = -1; SFX.close();
  setTimeout(() => { if (certK >= 0) return; cvCard.style.transition = "none"; cvCard.style.transform = ""; cvCard.offsetWidth; cvCard.style.transition = ""; }, 420);
}

/* ---------- terminal: log lines and commands ---------- */
function logLine(segs) { TERM.push(segs); }
const CMDS = ["help", "ls", "whoami", "open", "logs", "tour", "contact", "certs", "cv", "clear", "home", "sound", "theme", "ping", "reboot", "sudo"];
const findSvc = (q) => { q = (q || "").toLowerCase().replace(/^svc\//, ""); if (!q) return -1; return STATIONS.findIndex((s) => s.svc.startsWith(q) || s.id.startsWith(q) || s.name.toLowerCase().startsWith(q)); };
const hist = []; let histK = 0;
function exec(raw) {
  const line = raw.trim(); if (!line) return;
  hist.push(line); histK = hist.length;
  TERM.push([seg(TERM.prompt, "mute"), seg(line, "hi")]);
  let [cmd, ...args] = line.split(/\s+/);
  if (cmd === "kubectl") { cmd = args.shift() || "help"; if (cmd === "get" && /^(svc|services?|pods?)$/.test(args[0] || "")) cmd = "ls"; }
  const a = args.join(" ");
  const out = (t, c) => TERM.push([seg(t, c)]);
  switch (cmd) {
    case "help": [["ls", "list the services"], ["open <svc>", "go there   (or just type its name)"], ["logs <svc>", "what it did"], ["whoami", "who runs this cluster"], ["tour", "ride the cart through every service"], ["certs", "the card tray in the hall"], ["contact", "how to reach me"], ["cv swe|academic", "download a CV"], ["sound on|off|0-100|hum", "mute, volume, ambient hum"], ["theme dark|light", "day or night"], ["home", "back to the whole island"], ["clear", "clear this window"]].forEach(([c, d]) => TERM.push([seg("  " + pad(c, 18), "acc"), seg(d, "mute")])); break;
    case "ls": TERM.push([seg(pad("NAME", 18) + pad("NAMESPACE", 12) + "STATUS", "dim")]); STATIONS.forEach((s) => TERM.push([seg(pad(s.svc, 18), "fg"), seg(pad(s.ns, 12), "mute"), seg("Running", "ok")])); break;
    case "open": case "cd": case "go": case "describe": {
      if (cmd === "cd" && (!a || a === "~" || a === ".." || a === "/")) { overview(); out("~", "mute"); break; }
      const i = findSvc(args[0] === "svc" ? args[1] : args[0]); if (i < 0) { out(`service not found: ${a}`, "err"); SFX.error(); } else go(i); break; }
    case "logs": { const i = findSvc(args[0]); if (i < 0) { out("usage: logs <svc>", "err"); SFX.error(); break; } STATIONS[i].facts.forEach((f, k) => TERM.push([seg(`2026-10-${String(10 + k).padStart(2, "0")} `, "dim"), seg(`[${STATIONS[i].svc}] `, "acc"), seg(f, "fg")])); break; }
    case "whoami": ["Md Anawrul Kabir Fahad", "B.Sc. Mechanical Engineering, CUET (2022 →)", "Research software · scientific ML · GPU platforms"].forEach((t, k) => out(t, k ? "fg" : "hi")); toggleId(true); break;
    case "tour": setMode("tour"); out("riding the mesh, stop 1 of 10", "mute"); break;
    case "contact": go(9); out(LINKS.email, "hi"); break;
    case "certs": case "certificates": go(2); out("8 certificates on the walls · click a frame, or pull a card from the tray in the panel", "mute"); break;
    case "cv": {
      const kind = /^a/.test(a) ? "academic" : /^(s|e)/.test(a) ? "swe" : "";
      if (!kind) { TERM.push([seg("  cv swe      ", "acc"), seg("software engineering CV · " + LINKS.cv.swe, "mute")]); TERM.push([seg("  cv academic ", "acc"), seg("academic CV · " + LINKS.cv.academic, "mute")]); break; }
      const l = document.createElement("a"); l.href = LINKS.cv[kind]; l.download = LINKS.cv[kind].split("/").pop(); l.click();
      out(`downloading ${l.download}`, "ok"); SFX.latch(true); break; }
    case "clear": TERM.clear(); break;
    case "home": case "exit": overview(); break;
    case "sound": {
      if (/^\d+$/.test(a)) SFX.setVolume(+a / 100); else if (a === "hum") SFX.setHum(!SFX.hum); else SFX.set(a ? a === "on" : !SFX.on);
      out(`sound ${SFX.on ? "on" : "off"} · volume ${Math.round(SFX.volume * 100)} · hum ${SFX.hum ? "on" : "off"}`, "mute"); break; }
    case "theme": setTheme(a === "light" || a === "dark" ? a : dark ? "light" : "dark"); break;
    case "ping": [3, 2, 4].forEach((ms, k) => setTimeout(() => out(`64 bytes from fahad-kabir: icmp_seq=${k + 1} ttl=64 time=${ms} ms`, "fg"), 260 * (k + 1))); break;
    case "reboot": store.set("booted", false); out("rebooting…", "warn"); setTimeout(() => location.reload(), 500); break;
    case "sudo": if (/hire/.test(a)) { out("[sudo] permission granted. Opening the lighthouse…", "ok"); setTimeout(() => go(9), 500); } else { out("fahad is not in the sudoers file. This incident will be reported.", "warn"); SFX.error(); } break;
    case "rm": out("rm: refusing to remove the island", "warn"); SFX.error(); break;
    case "echo": out(a, "fg"); break;
    case "date": out(new Date().toString(), "fg"); break;
    case "uname": out("fahad-os 2026.10 mechanical x86_64", "fg"); break;
    default: { const i = findSvc(cmd); if (i >= 0) { go(i); break; } out(`command not found: ${cmd} · try help`, "err"); SFX.error(); }
  }
}
function complete(v) {
  const parts = v.split(" ");
  if (parts.length === 1) { const m = CMDS.concat(STATIONS.map((s) => s.svc)).filter((c) => c.startsWith(parts[0])); return m.length === 1 ? m[0] + " " : v; }
  const m = STATIONS.map((s) => s.svc).filter((c) => c.startsWith(parts[parts.length - 1])); if (m.length === 1) parts[parts.length - 1] = m[0]; return parts.join(" ");
}

/* ---------- identity chip and card ---------- */
const chip = $("[data-chip]"), idPop = $("[data-idpop]");
let popField = null;
function toggleId(force) {
  const open = force !== undefined ? force : !idPop.hasAttribute("data-open");
  if (open && !popField) popField = identityCard(idPop.querySelector("[data-idcard]"), false);
  idPop.toggleAttribute("data-open", open); chip.setAttribute("aria-expanded", String(open));
  if (!open && popField) { popField.destroy(); popField = null; }
  open ? SFX.open() : SFX.close();
}

/* ---------- the boot sequence: the visitor's keystrokes deploy the portfolio ---------- */
const hint = $("[data-hint]");
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0).toString(16).slice(0, 5); };
function bootIntro() {
  TERM.clear();
  TERM.push([seg("fahad-kabir · control plane", "hi")]);
  TERM.push([seg(`Last login: ${new Date().toDateString()} on ttys001`, "mute")]);
  TERM.push("");
  TERM.push([seg("The island is not deployed yet.", "fg")]);
  TERM.push([seg(mobile ? "Tap the keyboard. Your taps write the command." : "Type anything. Your keystrokes write the command.", "mute")]);
  TERM.push("");
  TERM.prompt = "fahad@cuet:~$ "; TERM.input = ""; TERM.showInput = true;
}
function typeNext(real) {
  if (BOOT.phase !== "idle") return;
  const ch = CMD[BOOT.typed.length]; BOOT.typed += ch; TERM.input = BOOT.typed; TERM.bump();
  DEV.press(ch); ch === " " ? SFX.space() : SFX.key();
  if (real) { BOOT.idleT = 0; BOOT.ghost = false; }
  if (BOOT.typed.length === CMD.length) { BOOT.phase = "typed"; BOOT.ghostWait = 0; hint.dataset.state = "enter"; DEV.ready(true); }
  else hint.dataset.state = "typing";
}
function backspace() { if (BOOT.phase === "typed") BOOT.phase = "idle"; if (BOOT.phase !== "idle" || !BOOT.typed) return; BOOT.typed = BOOT.typed.slice(0, -1); TERM.input = BOOT.typed; TERM.bump(); DEV.press("Backspace"); SFX.key(); }
function deploy(fast) {
  if (BOOT.phase === "deploy" || BOOT.phase === "live") return;
  if (BOOT.typed !== CMD) { BOOT.typed = CMD; TERM.input = CMD; }
  BOOT.phase = "deploy"; BOOT.bt = 0; BOOT.speed = fast ? 5 : 1;
  ROOT.dataset.phase = "deploy"; hint.dataset.state = "deploy";
  if (fast) SFX.hush(true);
  const E = [], at = (t, fn) => E.push({ t, fn });
  const typeAt = (t0, text, cps = 30) => { at(t0, () => { TERM.showInput = true; TERM.input = ""; TERM.bump(); }); [...text].forEach((ch, k) => at(t0 + 0.1 + k / cps, () => { TERM.input += ch; TERM.bump(); DEV.press(ch); ch === " " ? SFX.space() : SFX.key(); })); at(t0 + 0.15 + text.length / cps, () => { DEV.press("Enter"); SFX.enter(); TERM.push([seg(TERM.prompt, "mute"), seg(text, "hi")]); TERM.input = ""; TERM.showInput = false; TERM.bump(); }); return t0 + 0.2 + text.length / cps; };
  at(0, () => { TERM.push([seg(TERM.prompt, "mute"), seg(CMD, "hi")]); TERM.input = ""; TERM.showInput = false; DEV.press("Enter"); SFX.enter(); });
  at(0.18, () => TERM.push([seg("namespace/fahad-kabir ", "fg"), seg("created", "ok")]));
  at(0.34, () => TERM.push([seg("configmap/identity ", "fg"), seg("created", "ok")]));
  STATIONS.forEach((s, i) => at(0.48 + i * 0.07, () => { TERM.push([seg(`deployment.apps/${s.svc} `, "fg"), seg("created", "ok")]); SFX.print(); }));
  at(1.25, () => TERM.push([seg("service/fahad-kabir-mesh ", "fg"), seg("created", "ok")]));
  let t = typeAt(1.5, "kubectl describe configmap/identity", 34);
  const who = [["Name:     ", "Md Anawrul Kabir Fahad", "hi"], ["Studies:  ", "Mechanical Engineering · CUET (2022 →)", "fg"], ["Builds:   ", "research software · scientific ML", "fg"], ["Ran:      ", "GPU platforms at Poridhi.io (2025–26)", "fg"], ["Status:   ", "Running", "ok"]];
  who.forEach(([k, v, c], j) => at(t + 0.08 + j * 0.11, () => TERM.push([seg(k, "mute"), seg(v, c)])));
  // the identity: a print slides out of the screen, exposes, develops into colour, holds with the name, then docks
  const e0 = t + 0.3;
  at(e0, () => DEV.emerge());
  for (let r = 0; r <= 14; r++) at(e0 + 0.8 + (r / 14) * 1.4, () => { DEV.reveal(r / 14); if (r % 2 === 0) SFX.print(); });
  for (let k = 1; k <= 20; k++) at(e0 + 1.6 + (k / 20) * 1.6, () => DEV.develop(k / 20));
  at(e0 + 2.2, () => DEV.hold());
  [..."Md Anawrul Kabir Fahad"].forEach((ch, k) => at(e0 + 2.4 + k * 0.035, () => DEV.name("Md Anawrul Kabir Fahad".slice(0, k + 1))));
  at(e0 + 3.3, () => DEV.role("Mechanical · research software · GPU"));
  at(e0 + 5.0, () => DEV.dock());
  t = e0 + 5.6;
  // the island: each area rises, builds and comes up in turn, while the camera settles slowly over it
  at(t, () => { ROOT.dataset.phase = "assemble"; DEV.leave(); tweenCam(OVER, overviewZoom(), 5.2, BOOT.bt); });
  t = typeAt(t + 0.5, "kubectl get pods -w", 40);
  at(t + 0.05, () => TERM.push([seg(pad("NAME", 22) + pad("READY", 7) + pad("STATUS", 19) + "AGE", "dim")]));
  const T0 = t + 0.3, RISE = 0.6, BUILD = 1.4, UP = 3.2, STEP = 0.5;
  STATIONS.forEach((s, i) => {
    const name = `${s.svc}-${hash(s.svc)}`, t1 = T0 + i * RISE, t2 = T0 + BUILD + i * 0.55, t3 = T0 + UP + i * STEP;
    const row = (st, c, ready, age) => [seg(pad(name, 22), "fg"), seg(pad(ready, 7), "mute"), seg(pad(st, 19), c), seg(age, "mute")];
    at(t1, () => { BOOT.rows[i] = TERM.push(row("Pending", "warn", "0/1", "0s")); REG[i].riseT = BOOT.bt; SFX.relay(i); });
    at(t2, () => { TERM.set(BOOT.rows[i], row("ContainerCreating", "info", "0/1", `${Math.max(1, Math.round(t2 - t1))}s`)); REG[i].printT = BOOT.bt; SFX.thunk(); });
    at(t3, () => { TERM.set(BOOT.rows[i], row("Running", "ok", "1/1", `${Math.round(t3 - t1)}s`)); REG[i].svcT = BOOT.bt; SFX.blip(i); });
  });
  const TN = T0 + UP + 9 * STEP + 0.8;
  at(TN, () => { TERM.push(""); TERM.push([seg("Connecting the service mesh ", "fg"), seg("···", "mute")]); BOOT.netT = BOOT.bt; SFX.sweep(); });
  at(TN + 1.6, () => { TERM.push([seg("✓ ", "ok"), seg("Connected to ", "fg"), seg("fahad-kabir", "hi"), seg(" · 10/10 services Running", "ok")]); SFX.hush(false); SFX.chord(); goLive(); });
  BOOT.events = E.sort((a, b) => a.t - b.t);
}
function goLive() {
  const returning = store.get("booted", false);
  BOOT.phase = "live"; ROOT.dataset.phase = "live"; store.set("booted", true); BOOT.speed = 1;
  TERM.push([seg("Type ", "mute"), seg("help", "acc"), seg(", a service name, or click any building. ", "mute"), seg("Esc", "acc"), seg(" closes this window.", "mute")]);
  TERM.prompt = "fahad@cluster:~$ "; TERM.input = ""; TERM.showInput = true; TERM.bump();
  ctl.tween = null; ctl.tg.copy(OVER); ctl.zg = overviewZoom();
  SFX.humStart();
  chip.removeAttribute("hidden");
  setTerm(store.get("term", "compact"), false);
  foldSvc(store.get("svc", W < 1100 ? "folded" : "open") === "folded", false);
  const r = routeOf();
  if (mobile && !(r && r.i !== undefined)) setMode("tour"); else { ui.mode = mobile ? "tour" : "explore"; ROOT.dataset.mode = ui.mode; ROOT.dataset.view = "overview"; syncNav(); }
  if (r && r.read) setMode("read", { fromHistory: true });
  else if (r) go(r.i, { jump: true, quiet: true, fromHistory: true });
  const last = store.get("last", -1);
  if (!r && !mobile && last > 0 && returning) { const t = $("[data-toast]"); t.querySelector("[data-resume-name]").textContent = STATIONS[last].name; t.querySelector("[data-act='resume']").dataset.at = last; t.setAttribute("data-open", ""); setTimeout(() => t.removeAttribute("data-open"), 9000); }
}
function skipBoot() { if (BOOT.phase === "live") return; if (BOOT.phase !== "deploy") deploy(false); SFX.hush(true); BOOT.speed = 400; }
/* ---------- clicks ---------- */
ROOT.addEventListener("click", (e) => {
  if (lbOpen && e.target === lb) return closeLightbox();
  if (certK >= 0 && e.target === cv) return closeCert();
  if (idPop.hasAttribute("data-open") && !e.target.closest("[data-idpop],[data-chip]")) toggleId(false);
  if (sndPop.hasAttribute("data-open") && !e.target.closest(".sndwrap")) toggleSnd(false);
  // the phone menu closes on a tap outside it, or on any choice in it except the switches
  if (mMenu.hasAttribute("data-open") && (!e.target.closest("[data-mmenu],[data-menu]") || (e.target.closest("[data-mmenu] a, [data-mmenu] button") && !e.target.closest("[data-keep]")))) toggleMenu(false);
  const t = e.target.closest("[data-act],[data-mode],[data-card],[data-photo],[data-goto],[data-rot],[data-zoom],[data-theme-toggle],[data-copy],[data-sound],[data-chip],[data-skip],[data-termtoggle],[data-term-size],[data-term-close],[data-svc-fold],[data-sound-menu],[data-menu]");
  // the root carries data-mode itself, so closest() can land on it: that is not a control, and plain links must work
  if (!t || t === ROOT) return;
  if (t.tagName === "A" && !t.dataset.act) return;
  e.preventDefault(); SFX.unlock();
  if (t.hasAttribute("data-skip")) return skipBoot();
  if (t.hasAttribute("data-sound")) return SFX.set(!SFX.on);
  if (t.hasAttribute("data-sound-menu")) return toggleSnd();
  if (t.hasAttribute("data-menu")) return toggleMenu();
  if (t.hasAttribute("data-chip")) return toggleId();
  if (t.hasAttribute("data-termtoggle")) return setTerm(termShown() ? "closed" : "open");
  if (t.hasAttribute("data-term-size")) return setTerm(ui.term === "open" ? "compact" : "open");
  if (t.hasAttribute("data-term-close")) return setTerm("closed");
  if (t.hasAttribute("data-svc-fold")) return foldSvc(!svcList.hasAttribute("data-folded"));
  if (t.dataset.copy) { const done = () => { t.textContent = "Copied"; setTimeout(() => (t.textContent = "Copy email"), 1400); }; navigator.clipboard?.writeText(t.dataset.copy).then(done, done); SFX.latch(true); return; }
  if (t.dataset.mode) return setMode(t.dataset.mode);
  if (t.dataset.card) return openCert(+t.dataset.card, t.getBoundingClientRect(), "list");
  if (t.dataset.photo) return openLightbox(photoItems, +t.dataset.photo);
  if (t.dataset.goto) { if (ui.mode === "read") setMode(mobile ? "tour" : "explore"); return go(+t.dataset.goto, { jump: true }); }
  if (t.dataset.rot) { ctl.azg += (+t.dataset.rot * Math.PI) / 2; SFX.whoosh(); return; }
  if (t.dataset.zoom) { ctl.zg = clamp(ctl.zg * (+t.dataset.zoom > 0 ? 1.3 : 1 / 1.3), 0.5, 6); return; }
  if (t.hasAttribute("data-theme-toggle")) return setTheme(dark ? "light" : "dark");
  const a = t.dataset.act;
  if (a === "deploy") return BOOT.phase === "live" ? null : deploy(false);
  // the essentials: skip the opening and land on the text version, with both CVs at the top
  if (a === "essentials") { setRoute("read", true); return skipBoot(); }
  if (a === "close") { SFX.close(); return overview(); }
  if (a === "sheet") { if (sheetSwiped) { sheetSwiped = false; return; } return setSheet(ui.sheet === "peek" ? "half" : ui.sheet === "half" ? "full" : "half"); }
  if (a === "sheetfull") return setSheet(ui.sheet === "full" ? "half" : "full");
  if (a === "next") return go(Math.min(STATIONS.length - 1, ui.cur + 1));
  if (a === "prev") return go(Math.max(0, ui.cur - 1));
  if (a === "tour") return setMode("tour");
  if (a === "stack") { hxGoal = hxGoal ? 0 : 1; t.textContent = hxGoal ? "Close the stack" : "Open the stack"; SFX.latch(!!hxGoal); return; }
  if (a === "kick") { if (kickT < 0) kickT = 0; return; }
  if (a === "race") { race.on = true; race.t = 0; race.aws = 10 + Math.round(rnd() * 5); race.bm = 3 + Math.round(rnd() * 2); slices.forEach((s) => (s.userData.on = 0)); ec2.forEach((e2) => setMat(e2, "white")); SFX.enter(); return; }
  if (a === "read") return setMode("read");
  if (a === "readclose") return setMode(mobile ? "tour" : "explore");
  if (a === "lbclose") return closeLightbox();
  if (a === "certclose") return closeCert();
  if (a === "certprev") return stepCert(-1);
  if (a === "certnext") return stepCert(1);
  if (a === "lbprev") { lbK = (lbK - 1 + lbList.length) % lbList.length; SFX.flick(lbK); return drawLightbox(); }
  if (a === "lbnext") { lbK = (lbK + 1) % lbList.length; SFX.flick(lbK); return drawLightbox(); }
  if (a === "resume") { $("[data-toast]").removeAttribute("data-open"); return go(+t.dataset.at); }
  if (a === "toast-x") return $("[data-toast]").removeAttribute("data-open");
  if (a === "idclose") return toggleId(false);
});
function setSheet(s) {
  ui.sheet = s; panel.dataset.sheet = s; placeSheet(); layoutOffsets();
  const b = panel.querySelector(".w-full"); if (b) { b.textContent = s === "full" ? "⤡" : "⤢"; b.setAttribute("aria-label", s === "full" ? "Make the sheet smaller" : "Full screen"); }
}
/* ---------- the phone sheet, the way iOS does it: always full height and slid down to a detent (peek, half,
   full); it follows the finger from anywhere on it, a flick carries it on to the nearest detent, it stretches
   past the top, and at full the content scrolls first, then pulls the sheet down from its top edge ---------- */
const DETENTS = ["peek", "half", "full"];
function detentY(s) { const H = panel.offsetHeight || Hh; return s === "full" ? 0 : Math.max(0, H - (s === "half" ? Math.round(Hh * 0.52) : 132)); }
function placeSheet() { if (mobile) panel.style.setProperty("--sy", detentY(ui.sheet) + "px"); else panel.style.removeProperty("--sy"); }
const stretch = (x) => (1 - 1 / ((x * 0.55) / Hh + 1)) * Hh * 0.3;
let sheetSwiped = false, drag = null;
// figures that answer the pointer themselves (the Riffle) and the sliders keep their gestures
const ownGesture = (el) => !!el.closest("input, select, textarea, [data-riffle]");
function dragStart(y, fromBody) { const s0 = detentY(ui.sheet); drag = { y0: y, s0, y: s0, moved: false, fromBody, pts: [[performance.now(), y]] }; }
function dragMove(y) {
  const d = drag; if (!d) return false;
  if (!d.moved) { if (Math.abs(y - d.y0) < 6) return false; d.moved = true; panel.setAttribute("data-dragging", ""); }
  const ny = d.s0 + (y - d.y0);
  d.y = ny < 0 ? -stretch(-ny) : ny;
  panel.style.transform = `translateY(${d.y.toFixed(1)}px)`;
  d.pts.push([performance.now(), y]); if (d.pts.length > 6) d.pts.shift();
  return true;
}
function dragEnd() {
  const d = drag; drag = null; if (!d || !d.moved) return;
  panel.removeAttribute("data-dragging"); panel.style.transform = "";
  sheetSwiped = true; setTimeout(() => (sheetSwiped = false), 350);
  const [t0, y0] = d.pts[0], [t1, y1] = d.pts[d.pts.length - 1];
  const v = t1 - t0 > 0 ? (y1 - y0) / (t1 - t0) : 0; // px per ms; a flick carries the sheet about 0.25 s further
  const at = d.y + v * 250;
  if (at > detentY("peek") + 56) { SFX.close(); return overview(); }
  let best = ui.sheet, gap = Infinity;
  for (const s of DETENTS) { const g = Math.abs(detentY(s) - at); if (g < gap) { gap = g; best = s; } }
  setSheet(best);
}
panel.addEventListener("touchstart", (e) => {
  if (!mobile || e.touches.length !== 1 || ownGesture(e.target)) { drag = null; return; }
  const b = e.target.closest(".w-body");
  if (b && ui.sheet === "full" && b.scrollTop > 0) return; // the content scrolls before the sheet moves
  dragStart(e.touches[0].clientY, !!b);
}, { passive: true });
panel.addEventListener("touchmove", (e) => {
  if (!drag) return;
  const y = e.touches[0].clientY;
  // at full, content pushed upward is a scroll, not a drag
  if (drag.fromBody && ui.sheet === "full" && !drag.moved && y < drag.y0) { drag = null; return; }
  if (dragMove(y) && e.cancelable) e.preventDefault();
}, { passive: false });
panel.addEventListener("touchend", dragEnd);
panel.addEventListener("touchcancel", dragEnd);
// a mouse (a narrow desktop window) drags by the top of the sheet
panel.addEventListener("pointerdown", (e) => { if (!mobile || e.pointerType !== "mouse" || !e.target.closest(".w-grab, .w-nav span, .w-ph > div:first-child")) return; panel.setPointerCapture(e.pointerId); dragStart(e.clientY, false); });
panel.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" && drag) dragMove(e.clientY); });
panel.addEventListener("pointerup", (e) => { if (e.pointerType === "mouse") dragEnd(); });
/* ---------- the phone menu: pages, text, tour, terminal, theme, sound and both CVs ---------- */
const mMenu = $("[data-mmenu]");
// a touch anywhere outside the menu closes it: on the canvas the pointer is captured, so a click may never come
ROOT.addEventListener("pointerdown", (e) => { if (mMenu.hasAttribute("data-open") && !e.target.closest("[data-mmenu],[data-menu]")) toggleMenu(false); }, true);
function toggleMenu(force) { const open = force !== undefined ? force : !mMenu.hasAttribute("data-open"); mMenu.toggleAttribute("data-open", open); $("[data-menu]").setAttribute("aria-expanded", String(open)); if (open) SFX.open(); }
/* ---------- sound settings: a level and the optional hum, beside the one-click mute ---------- */
const sndPop = $("[data-sndpop]"), volIn = $("[data-vol]"), humIn = $("[data-hum]");
function toggleSnd(force) { const open = force !== undefined ? force : !sndPop.hasAttribute("data-open"); sndPop.toggleAttribute("data-open", open); $("[data-sound-menu]").setAttribute("aria-expanded", String(open)); }
volIn.addEventListener("input", () => { const v = +volIn.value / 100; SFX.unlock(); SFX.setVolume(v); if (v > 0 && !SFX.on) SFX.set(true); SFX.blip(4); });
// read the control before unlocking: unlocking notifies listeners, which re-sync the controls from the stored values
humIn.addEventListener("change", () => { const v = humIn.checked; SFX.unlock(); SFX.setHum(v); });
SFX.onChange(() => { volIn.value = String(Math.round(SFX.volume * 100)); $("[data-vol-out]").textContent = volIn.value; humIn.checked = SFX.hum; });
SFX.onChange(() => ROOT.querySelectorAll("[data-sound]").forEach((b) => { b.setAttribute("aria-pressed", String(SFX.on)); b.querySelector("span:not(.bars)").textContent = SFX.on ? "Sound on" : "Sound off"; }));

/* ---------- keys: during boot they write the command; afterwards they reach the terminal ---------- */
window.addEventListener("keydown", (e) => {
  if (paused) return;
  // a figure that claimed the key (the Riffle walking its cards, or putting one back) keeps it
  if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
  SFX.unlock();
  const inInput = e.target === hudIn;
  if (BOOT.phase === "idle" || BOOT.phase === "typed") {
    if (e.target.closest && e.target.closest("button, a, input:not([data-term-in])") && e.key === "Enter") return;
    if (e.key === "Enter") { e.preventDefault(); return deploy(false); }
    if (e.key === "Backspace") { e.preventDefault(); return backspace(); }
    if (e.key === "Escape") return skipBoot();
    if (e.key.length === 1) { e.preventDefault(); if (BOOT.phase === "idle") typeNext(true); else { DEV.press(e.key); SFX.key(); } }
    return;
  }
  if (BOOT.phase === "deploy") { if (e.key === "Escape" || e.key === "Enter") skipBoot(); return; }
  if (inInput) {
    if (e.key === "Enter") { e.preventDefault(); const v = hudIn.value; hudIn.value = ""; DEV.press("Enter"); SFX.enter(); exec(v); return; }
    if (e.key === "Tab") { e.preventDefault(); hudIn.value = complete(hudIn.value); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); histK = Math.max(0, histK - 1); hudIn.value = hist[histK] || ""; return; }
    if (e.key === "ArrowDown") { e.preventDefault(); histK = Math.min(hist.length, histK + 1); hudIn.value = hist[histK] || ""; return; }
    if (e.key === "Escape") { setTerm("closed"); return; }
    if (e.key.length === 1 || e.key === "Backspace") { DEV.press(e.key === "Backspace" ? "Backspace" : e.key); e.key === " " ? SFX.space() : SFX.key(); }
    return;
  }
  // Esc dismisses from anywhere, including a slider or checkbox inside a panel or the sound settings
  if (e.key === "Escape") { const inSnd = sndPop.hasAttribute("data-open"); dismissTop(); if (inSnd) $("[data-sound-menu]").focus(); return; }
  if (e.target.matches && e.target.matches("input, textarea")) return;
  if (certK >= 0 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) return stepCert(e.key === "ArrowRight" ? 1 : -1);
  if (e.target.closest && e.target.closest("[data-riffle]")) return;
  if (lbOpen && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { lbK = (lbK + (e.key === "ArrowRight" ? 1 : -1) + lbList.length) % lbList.length; SFX.flick(lbK); drawLightbox(); return; }
  if (e.key === "ArrowRight") return go(Math.min(STATIONS.length - 1, ui.cur + 1));
  if (e.key === "ArrowLeft") return go(Math.max(0, ui.cur - 1));
  // ` or / opens the terminal; while it is showing, any printable key starts a command in it
  if (e.key === "`" || e.key === "/") { e.preventDefault(); return setTerm("open"); }
  if (e.key.length === 1 && termShown()) setTerm("open");
});

/* ---------- pointer: pan, pinch, click, machines ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function pick(cx, cy) {
  const r = canvas.getBoundingClientRect(); ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, cam);
  const hits = ray.intersectObjects(PICK, false).filter((h) => { const self = h.object; if (!self.visible && self.userData.station === undefined && !self.userData.drag && self.userData.card === undefined) return false; let o = self.parent; while (o) { if (!o.visible) return false; o = o.parent; } return true; });
  if (!hits.length) return null;
  if (hits[0].object.userData.station === undefined) return hits[0];
  const ns = hits.find((h) => h.object.userData.station === undefined);
  return ns && ns.distance - hits[0].distance < 14 ? ns : hits[0];
}
const ptrs = new Map();
let down = null, pinch0 = 0, zoom0 = 1, pointerY = null;
function machineDrag(kind, hit) {
  const p = hit.point.clone().sub(world.position);
  if (kind === "aoa") aoaGoal = clamp(Math.round((4 + (p.y - 6.5) * -6 + (p.x - 38) * 0.6) * 2) / 2, -4, 18);
  if (kind === "G") { const g = clamp(Math.round((((p.x - 47) / 14) * 1.5) / 0.25) * 0.25, 0, 1.5); if (g !== Ggoal) SFX.flick(g * 4); Ggoal = g; }
  if (kind === "loupe") { lp.gu = clamp((p.x - (62.5 - 2.8)) / 5.6, 0.04, 0.96); lp.gv = clamp((p.z - (25.5 - 1.97)) / 3.94, 0.05, 0.95); }
}
canvas.addEventListener("pointerdown", (e) => {
  SFX.unlock();
  ptrs.set(e.pointerId, [e.clientX, e.clientY]); canvas.setPointerCapture(e.pointerId);
  if (BOOT.phase === "idle" || BOOT.phase === "typed") { down = { boot: true, x: e.clientX, y: e.clientY }; return; }
  if (BOOT.phase !== "live") return;
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); zoom0 = ctl.zg; down = null; return; }
  const h = pick(e.clientX, e.clientY), d = h && h.object.userData.drag, owner = { aoa: 5, G: 8, loupe: 7 }[d];
  down = { x: e.clientX, y: e.clientY, moved: false, hit: h, drag: d && ui.cur === owner ? d : null, t: ctl.tg.clone() };
  if (down.drag) machineDrag(down.drag, h);
});
canvas.addEventListener("pointermove", (e) => {
  pointerY = e.clientY - canvas.getBoundingClientRect().top;
  if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (BOOT.phase !== "live") return;
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; ctl.zg = clamp((zoom0 * Math.hypot(a[0] - b[0], a[1] - b[1])) / (pinch0 || 1), 0.5, 4); return; }
  if (down && !down.boot) {
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.hypot(dx, dy) > 5) down.moved = true;
    if (down.drag) { const h = pick(e.clientX, e.clientY); if (h && h.object.userData.drag === down.drag) machineDrag(down.drag, h); return; }
    if (down.moved) {
      const s = VIEW / Hh / ctl.z, az = ctl.az, rx = Math.cos(az), rz = -Math.sin(az), fx = -Math.sin(az), fz = -Math.cos(az);
      ctl.tween = null; travel = null;
      ctl.tg.set(clamp(down.t.x - rx * dx * s + (fx * dy * s) / Math.sin(EL), -4, 76), ctl.tg.y, clamp(down.t.z - rz * dx * s + (fz * dy * s) / Math.sin(EL), -4, 66));
    }
    return;
  }
  if (e.pointerType !== "mouse") return;
  const h = pick(e.clientX, e.clientY), u = h ? h.object.userData : {};
  const hv = u.station !== undefined ? u.station : -1;
  if (hv !== ui.hover) ui.hover = hv;
  canvas.style.cursor = h && (u.station !== undefined || u.go !== undefined || u.card !== undefined || u.photo !== undefined || u.kick || u.slice !== undefined || u.stack || u.drag || u.laptop || u.lock) ? "pointer" : "grab";
  if (u.drag === "loupe" && ui.cur === 7) machineDrag("loupe", h);
  const lk = !!u.lock; if (lk !== !!lockGoal) { lockGoal = lk ? 1 : 0; SFX.latch(lk); }
});
const endPtr = (e) => {
  ptrs.delete(e.pointerId);
  if (!down) return;
  const d = down; down = null;
  if (d.boot) { if (BOOT.phase === "typed") deploy(false); else for (let k = 0; k < (mobile ? 4 : 3); k++) typeNext(true); return; }
  if (d.moved || d.drag) return;
  const h = d.hit; if (!h) return;
  const u = h.object.userData;
  if (u.card !== undefined) return openCert(u.card, null, "wall");
  if (u.photo !== undefined) { if (u.photo === "chart") return openLightbox([{ src: IMG.chart, alt: "Success rate against compliance G", title: "Success rate vs compliance", sub: "Three runs, 95% Wilson intervals · simulation, not hardware" }], 0); return openLightbox(photoItems, u.photo); }
  if (u.laptop) { if (ui.cur !== 7) go(7); return openLightbox([{ src: IMG.pbresults, alt: "PropBench results", title: "PropBench · results view", sub: "Cross-validated AARD, physics checks and the locked selection rule" }], 0); }
  if (u.lock) { if (ui.cur !== 7) go(7); lockGoal = lockGoal ? 0 : 1; SFX.latch(!!lockGoal); return; }
  if (u.go !== undefined) return go(u.go);
  if (u.kick) { if (ui.cur !== 1) go(1); if (kickT < 0) kickT = 0; return; }
  if (u.slice !== undefined) { if (ui.cur !== 3) go(3); slices[u.slice].userData.on = slices[u.slice].userData.on ? 0 : 1; SFX.blip(u.slice); return; }
  if (u.stack) { if (ui.cur !== 6) go(6); hxGoal = hxGoal ? 0 : 1; SFX.latch(!!hxGoal); return; }
  const st = u.station !== undefined ? u.station : u.drag ? { aoa: 5, G: 8, loupe: 7 }[u.drag] : undefined;
  if (st !== undefined && st !== ui.cur) go(st);
};
canvas.addEventListener("pointerup", endPtr);
DEV.el.addEventListener("pointerup", (e) => { if (e.target.closest("button")) return; SFX.unlock(); if (BOOT.phase === "typed") deploy(false); else if (BOOT.phase === "idle") for (let k = 0; k < (mobile ? 4 : 3); k++) typeNext(true); });
canvas.addEventListener("pointercancel", (e) => { ptrs.delete(e.pointerId); down = null; });
canvas.addEventListener("pointerleave", () => { ui.hover = -1; pointerY = null; if (lockGoal) lockGoal = 0; });
canvas.addEventListener("wheel", (e) => { if (BOOT.phase !== "live") return; e.preventDefault(); ctl.zg = clamp(ctl.zg * Math.exp(-e.deltaY * 0.0022), 0.5, 4); }, { passive: false });

/* ---------- the frame loop ---------- */
let prev = 0, t = 0, running = false, raf = 0, printTick = 0;
const tmp = new V3();
function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = prev ? Math.min((now - prev) / 1000, 1 / 20) : 1 / 60; prev = now; t += dt;
  const k = REDUCED ? 60 : 6;

  // boot: the ghost types if nobody does; the timeline runs on its own clock
  if (BOOT.phase === "idle") {
    BOOT.idleT += dt;
    if (BOOT.idleT > 4.5) { BOOT.ghost = true; BOOT.last += dt; if (BOOT.last > 0.065) { BOOT.last = 0; typeNext(false); } }
  } else if (BOOT.phase === "typed") { BOOT.ghostWait += dt; if (BOOT.ghost && BOOT.ghostWait > 1.8) deploy(false); }
  if (BOOT.phase === "deploy" || BOOT.phase === "live") BOOT.bt += dt * BOOT.speed;
  if (BOOT.phase === "deploy") {
    while (BOOT.events.length && BOOT.events[0].t <= BOOT.bt) BOOT.events.shift().fn();
  }
  const bt = BOOT.bt;
  // nodes rise, buildings print, services come up
  let printing = false, risen = 0;
  REG.forEach((r) => {
    const rise = r.riseT < 0 ? 0 : REDUCED ? 1 : ease((bt - r.riseT) / 0.9);
    const y = -7 * (1 - rise); r.ground.position.y = y; r.build.position.y = y; r.ground.visible = rise > 0; risen += rise;
    const pr = r.printT < 0 ? 0 : REDUCED ? 1 : clamp((bt - r.printT) / 1.25);
    if (pr > 0 && pr < 1) printing = true;
    r.plane.constant = r.printT < 0 ? -50 : y + lerp(0.95, r.top, pr * pr * (3 - 2 * pr));
    r.build.visible = pr > 0;
    const sv = r.svcT < 0 ? 0 : REDUCED ? 1 : clamp((bt - r.svcT) / 0.5);
    const sc = sv <= 0 ? 0 : 1 + 0.25 * Math.sin(sv * Math.PI) * (1 - sv);
    for (const o of r.dyn) { o.visible = sv > 0; o.scale.setScalar(Math.max(0.001, o.userData.__s * sc)); }
  });
  coastMat.opacity = 0.5 * (1 - risen / REG.length);
  if (printing) { printTick += dt; if (printTick > 0.075) { printTick = 0; SFX.print(); } }
  const net = BOOT.netT === undefined ? 0 : REDUCED ? 1 : clamp((bt - BOOT.netT) / 1.2);
  railGeo.setDrawRange(0, Math.floor((railPts.length / 3) * net / 2) * 2);
  if (net > 0 && net < 1) { const p = PATH[Math.min(PATH.length - 1, Math.floor(net * PATH.length))]; cart.visible = true; cart.position.set(p.x + 0.5, S(p.x, p.z), p.z + 0.5); }

  // camera
  if (ctl.tween) { const w = ctl.tween, u = clamp((bt - w.t0) / w.dur), e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; ctl.tg.lerpVectors(w.a, w.b, e); ctl.zg = lerp(w.za, w.zb, e); ctl.t.copy(ctl.tg); ctl.z = ctl.zg; if (u >= 1) ctl.tween = null; }
  if (travel) {
    travel.k += dt * Math.max(11, travel.seq.length / 2.4);
    const i = Math.floor(travel.k);
    clackT += dt; if (clackT > 0.12) { clackT = 0; SFX.clack(); }
    if (i >= travel.seq.length - 1) { const p = PATH[travel.seq[travel.seq.length - 1]]; cart.position.set(p.x + 0.5, S(p.x, p.z), p.z + 0.5); focus(travel.to); travel = null; }
    else { const a = PATH[travel.seq[i]], b = PATH[travel.seq[i + 1]], f = travel.k - i; cart.position.set(lerp(a.x, b.x, f) + 0.5, damp(cart.position.y, S(b.x, b.z), 10, dt), lerp(a.z, b.z, f) + 0.5); cart.rotation.y = Math.atan2(-(b.z - a.z), b.x - a.x); ctl.tg.copy(cart.position).setY(cart.position.y + 1); }
  }
  if (!ctl.tween) { ctl.t.x = damp(ctl.t.x, ctl.tg.x, travel ? 14 : k * 0.8, dt); ctl.t.y = damp(ctl.t.y, ctl.tg.y, k, dt); ctl.t.z = damp(ctl.t.z, ctl.tg.z, travel ? 14 : k * 0.8, dt); ctl.z = damp(ctl.z, ctl.zg, k * 0.8, dt); }
  if (BOOT.phase === "idle" || BOOT.phase === "typed") ctl.azg = Math.PI / 4 + (REDUCED ? 0 : Math.sin(t * 0.25) * 0.05);
  ctl.az = damp(ctl.az, ctl.azg, k, dt);
  ctl.ox = damp(ctl.ox, ctl.oxg, k, dt); ctl.oy = damp(ctl.oy, ctl.oyg, k, dt);
  placeCam();

  if (termDirty) { termDirty = false; DEV.render(); }
  if (hudDrawn !== TERM.ver && (BOOT.phase !== "idle")) drawHud();

  // lanterns
  markers.forEach((m, i) => { const on = i === ui.cur || i === ui.hover; m.lamp.position.y = 2.7 + (on && !REDUCED ? 0.18 * Math.sin(t * 4) : 0); m.lamp.scale.setScalar(damp(m.lamp.scale.x, on ? 1.25 : 1, 8, dt)); });
  // sea
  const wp = waveGeo.attributes.position.array;
  waves.forEach((w, i) => { const x = w[0] + (REDUCED ? 0 : Math.sin(t * 0.4 + w[3]) * 0.6); wp.set([x, 0.36, w[1], x + w[2], 0.36, w[1]], i * 6); });
  waveGeo.attributes.position.needsUpdate = true;
  // wind tunnel
  particles.visible = REG[5].svcT >= 0;
  aoa = damp(aoa, aoaGoal, 5, dt); foilG.rotation.z = (-aoa * Math.PI) / 180;
  if (particles.visible) {
    const ar = (aoa * Math.PI) / 180;
    for (let i = 0; i < NP; i++) {
      const s = pSeed[i]; s[0] = (s[0] + dt * 5.5 * s[3]) % 16;
      const x = 30 + s[0], y0 = s[1], dx = x - 38, side = y0 > 6.5 ? 1 : -1, dist = Math.abs(y0 - 6.5);
      let y = y0 + (side * 0.9 * Math.exp(-(dx * dx) / 5)) / (1 + dist * 1.4) - Math.max(0, Math.tanh(dx / 2)) * ar * 2.2 * Math.exp(-dist * 0.35);
      if (aoa > 12 && dx > 0 && side > 0 && dist < 1.4) y += (Math.sin(t * 9 + i) * 0.25 * (aoa - 12)) / 6;
      pPos[i * 3] = x; pPos[i * 3 + 1] = clamp(y, 5.1, 7.9); pPos[i * 3 + 2] = s[2];
    }
    pGeo.attributes.position.needsUpdate = true;
  }
  // heat exchanger
  hxOpen = damp(hxOpen, hxGoal, 5, dt);
  const gap = 0.02 + 0.42 * hxOpen; plates.forEach((p, i) => (p.position.y = 0.15 + i * (0.2 + gap)));
  const top = 0.15 + 8 * (0.2 + gap); capT.position.y = top + 0.3; ports.forEach((c) => { c.scale.y = top + 0.6; c.position.y = (top + 0.6) / 2; });
  // GPU
  blades.rotation.y -= dt * (race.on ? 9 : 3);
  if (REG[3].svcT >= 0) leds.forEach((l) => { l.visible = REDUCED || Math.sin(t * 2.4 + l.userData.ph * 3) > -0.6; });
  if (race.on) {
    race.t += dt; const minutes = race.t * 2.5, b = $('[data-bar="bm"]'), a = $('[data-bar="aws"]');
    if (b) { b.style.width = `${clamp(minutes / race.bm) * 100}%`; $('[data-race="bm"]').textContent = minutes >= race.bm ? `ready in ${race.bm} min` : `${Math.floor(minutes)} min…`; }
    if (a) { a.style.width = `${clamp(minutes / race.aws) * 100}%`; $('[data-race="aws"]').textContent = minutes >= race.aws ? `ready in ${race.aws} min` : `${Math.floor(minutes)} min…`; }
    if (minutes >= race.bm && !slices[0].userData.on) { slices[0].userData.on = 1; SFX.blip(0); }
    ec2.forEach((e2, i) => setMat(e2, minutes >= race.aws * ((i + 1) / 6) ? "infra" : "white"));
    if (minutes >= race.aws && !race.done) { race.done = true; SFX.blip(4); }
    if (minutes >= race.aws + 3) { race.on = false; race.done = false; }
  }
  slices.forEach((s) => { s.userData.lift = damp(s.userData.lift, s.userData.on ? 0.55 : 0, 8, dt); s.position.y = 1.56 + s.userData.lift; setMat(s, s.userData.on ? "infra" : "white"); });
  cloud.position.y = 15 + Math.sin(t * 0.6) * 0.25;
  // the snake in the lattice
  G = damp(G, Ggoal, 6, dt);
  if (!REDUCED) snakeX = (snakeX + dt * 0.9) % 17;
  {
    const amp = 0.55, om = 3.2, kap = 0.95, stiff = lerp(30, 2.4, G / 1.5), th = [0.5 * amp * Math.sin(om * t + 0.9)];
    for (let i = 0; i < 6; i++) { const a = amp * Math.sin(om * t - kap * i) * (1 - (0.35 * G) / 1.5); beta[i] += (a - beta[i]) * clamp(dt * stiff); }
    for (let i = 0; i < 6; i++) th.push(th[i] + beta[i]);
    const sp2 = [[0, 0]]; for (let i = 0; i < 7; i++) sp2.push([sp2[i][0] - 0.9 * Math.cos(th[i]), sp2[i][1] - 0.9 * Math.sin(th[i])]);
    const ang = Math.atan2(sp2[0][1] - sp2[7][1], sp2[0][0] - sp2[7][0]), ca = Math.cos(-ang), sa = Math.sin(-ang);
    let my = 0; sp2.forEach((q) => { const x = q[0] * ca - q[1] * sa, y = q[0] * sa + q[1] * ca; q[0] = x; q[1] = y; my += y; }); my /= 8;
    const fade = clamp(Math.min(snakeX, 17 - snakeX) / 1.2), on = REG[8].svcT >= 0;
    snake.forEach((s, i) => { const a = sp2[i], b = sp2[i + 1]; s.position.set(47.5 + snakeX + (a[0] + b[0]) / 2, 1.25, 39.5 + (a[1] + b[1]) / 2 - my); s.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]); s.visible = on && s.position.x > 47 && s.position.x < 61.6; s.scale.setScalar(0.35 + 0.65 * fade); });
  }
  // the bot kicks
  if (kickT >= 0) {
    kickT += dt; const u = clamp(kickT / 0.7), v = clamp((kickT - 0.6) / 1.4);
    if (kickT - dt < 0.62 && kickT >= 0.62) SFX.thunk();
    bot.position.x = BOT0.x + u * 1.2 - clamp((kickT - 2.2) / 1) * 1.2;
    ball.position.x = BALL0.x + v * 7.4; ball.position.z = BALL0.z + Math.sin(v * Math.PI) * 0.4; ball.rotation.z = -v * 12;
    if (kickT > 3.6) { kickT = -1; ball.position.copy(BALL0); bot.position.copy(BOT0); }
  }
  // the certificate being read comes off its wall, the way the island prototype did it
  frames.forEach((f, k) => { const u = f.userData; u.pop = damp(u.pop, certOpen.k === k ? 1 : 0, 7, dt); f.position.copy(u.home).addScaledVector(u.dir, u.pop * 1.3); f.position.y = u.home.y + u.pop * 0.3; f.scale.setScalar(1 + u.pop * 0.15); });
  // PropBench: loupe, laptop lid, padlock
  lp.u = damp(lp.u, lp.gu, 9, dt); lp.v = damp(lp.v, lp.gv, 9, dt);
  loupe.position.set(62.5 - 2.8 + lp.u * 5.6, 3.02, 25.5 - 1.97 + lp.v * 3.94);
  if (REG[7].svcT >= 0) drawLens();
  { let best = 1, who = null; for (const ds of SETS) for (const q of ds.pts) { const dd = (q[0] - lp.u) ** 2 + ((q[1] - lp.v) * 0.7) ** 2; if (dd < best) { best = dd; who = ds; } }
    lp.read = lp.u > 0.46 && lp.u < 0.74 && Math.abs(lp.v - (1 - curveY(lp.u))) < 0.22 ? "<b>Overlap near 333 K</b>: offset between two labs <b>+7.4 %</b> (95 %: 3.1–11.8 %)" : best < 0.012 ? `<b>${who.name}</b> · ${who.n} points` : "<b>63 points</b> · 3 datasets"; }
  if (ui.cur === 7 && pointerY !== null) { tmp.set(0, 1.2, 0); laptop.localToWorld(tmp); tmp.project(cam); const ly = (-tmp.y * 0.5 + 0.5) * Hh; lidGoal = clamp(lerp(1.45, -0.4, (ly - pointerY) / 220 + 0.5), -0.4, 1.45); } else lidGoal = -0.15;
  lidA = damp(lidA, lidGoal, 8, dt); lid.rotation.x = lidA;
  lockOpen = damp(lockOpen, lockGoal, 9, dt); shackle.position.y = 0.5 + lockOpen * 0.22; shackle.rotation.y = lockOpen * 1.1;
  beamPivot.rotation.y += dt * (REDUCED ? 0 : 0.8);
  // labels follow their lanterns
  STATIONS.forEach((s, i) => {
    tmp.copy(markers[i].anchor).add(world.position).project(cam);
    const x = (tmp.x * 0.5 + 0.5) * W, y = (-tmp.y * 0.5 + 0.5) * Hh, el = labelEls[i];
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    el.style.visibility = REG[i].svcT < 0 || x < -40 || x > W + 40 || y < 0 || y > Hh ? "hidden" : "";
    el.toggleAttribute("data-hover", i === ui.hover);
  });
  svcRows.forEach((b, i) => b.dataset.st = REG[i].svcT >= 0 ? "ok" : REG[i].riseT >= 0 ? "pend" : "off");
  if (panel.hasAttribute("data-open")) updateReads();
  renderer.render(scene, cam);
}
/* ---------- asleep: the site's pages are showing, and the island waits behind them exactly as it was ---------- */
let paused = false;
const start = () => { if (!running && !paused) { running = true; prev = 0; raf = requestAnimationFrame(frame); } };
const stop = () => { running = false; cancelAnimationFrame(raf); };
new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop())).observe(ROOT);
document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
new ResizeObserver(() => { if (paused || !ROOT.offsetWidth) return; if (size() && BOOT.phase === "live") { setTerm(ui.term, false); if (mobile && ui.mode === "explore" && ui.cur < 0) setMode("tour"); else layoutOffsets(); } }).observe(ROOT);

function pause() { if (paused) return; paused = true; stop(); SFX.sleep(true); }
function resume() {
  if (!paused) return;
  paused = false;
  if (size() && BOOT.phase === "live") setTerm(ui.term, false);
  if (BOOT.phase === "live") {
    // Back lands on the address it left; a plain link to "/" keeps what was open, and the address bar says so
    const r = routeOf(), o = { fromHistory: true };
    if (r && r.read) { if (ui.mode !== "read") setMode("read", o); }
    else if (r) { if (r.i !== ui.cur) go(r.i, { jump: true, quiet: true, fromHistory: true }); }
    else if (ui.mode === "read") setRoute("read", true);
    else if (ui.cur >= 0) setRoute(STATIONS[ui.cur].svc, true);
  }
  SFX.sleep(false);
  if (!document.hidden) start();
}

/* ---------- start ---------- */
size();
bootIntro();
ctl.t.copy(OVER); ctl.tg.copy(OVER); ctl.z = ctl.zg = bootZoom(); DEV.fitScreen();
ROOT.dataset.phase = "idle"; hint.dataset.state = "start";
SFX.onChange(() => {}); SFX.set(SFX.on);
if (store.get("booted", false) || routeOf()) { BOOT.typed = CMD; TERM.input = CMD; deploy(true); }
if (REDUCED) skipBoot();
start();
const API = { pause, resume, cert: (k) => openCert(k), state: () => ({ phase: BOOT.phase, cert: certK, lb: lbOpen }), exec, go, overview, setMode, skip: skipBoot, deploy, reboot: () => { store.set("booted", false); location.reload(); } };
