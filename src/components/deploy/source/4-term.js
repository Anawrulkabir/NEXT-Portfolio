/* ============================================================================
 * 4 · terminal and identity.
 * One terminal model drawn twice: onto the monitor in the world, and into the
 * HUD as real text. The identity card shows the real photo, framed.
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

/* ---------- the identity card: the photo, framed like a print, with the facts beside it ---------- */
function identityCard(el, compact) {
  el.innerHTML = html`<figure class="id-portrait"><img class="id-photo" alt="Md Anawrul Kabir Fahad" src="${IMG.portrait}"></figure>
    <div class="id-meta"><p class="id-k"><i></i>pod/fahad-kabir · Running</p><h3>Md Anawrul Kabir Fahad</h3><p class="id-role">Mechanical Engineering, CUET · research software · GPU platforms</p>
    ${compact ? "" : html`<dl class="id-dl"><dt>labels</dt><dd>focus=scientific-ml · build=research-software · infra=gpu</dd><dt>node</dt><dd>cuet / mechanical (2022 →)</dd><dt>region</dt><dd>Dhaka, Bangladesh</dd></dl>`}
    <div class="id-links">${cvLinks()}<a href="${LINKS.github}" target="_blank" rel="noopener">GitHub</a><a href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a><button type="button" data-copy="${LINKS.email}">Copy email</button></div></div>`;
  return { destroy() {} };
}
