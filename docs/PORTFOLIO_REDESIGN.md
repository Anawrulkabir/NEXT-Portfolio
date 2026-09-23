# PORTFOLIO_REDESIGN.md

**Project:** Personal portfolio of Md Anawrul Kabir Fahad
**Repository:** `github.com/Anawrulkabir/NEXT-Portfolio` (branch `main`, audited at commit `01d043d`)
**Live domain:** `fahadkabir.com` (per current CV) — previous: `fahadkabir.vercel.app`
**Document role:** Primary implementation instruction for Claude Code. Supersedes nothing in the two source documents; it translates them into buildable decisions.
**Source documents:** `01_DESIGN_INSTRUCTION.md` (the brief), `02_PORTFOLIO_MASTER_SOP.md` (the content SOP)

---

## 00. How to use this document

### 00.1 Rules for the implementing session

1. Follow the phases in §16 in order. Do not start a phase until the previous phase's deliverables pass its checks.
2. Every piece of user-facing factual content comes from `src/content/*`. No component may hardcode a fact (name, date, title, metric, link).
3. Never invent content. If a field is not in the **Verified Facts Ledger** (§00.3), it is a placeholder. Placeholders use the `pending()` helper (§06.1) and never render in production.
4. Markers used in this document:
   - `[NEEDS CONFIRMATION]` — the author has a conflicting or uncertain source. Ask before shipping.
   - `[ADD …]` — content the author must supply.
   - `[VERIFY]` — a fact from an older source that may be stale.
5. When a design decision here conflicts with the brief's literal words, the brief wins; flag the conflict in the PR description.
6. Keep this file in the repo at `/docs/PORTFOLIO_REDESIGN.md` and update §14 as content arrives.

### 00.2 Source-of-truth priority

When sources disagree, prefer in this order and flag the conflict:

1. The author's newest direct statement (chat / updated SOP)
2. `Fahad Kabir's Resume(Updated).pdf` (PDF created 2026-07-22) — "**CV-2026**"
3. `02_PORTFOLIO_MASTER_SOP.md` — "**SOP**"
4. `01_DESIGN_INSTRUCTION.md` — "**Brief**"
5. `Fahad Kabir's Resume.pdf` (older MERN-era resume) — "**CV-old**", treat as `[VERIFY]`
6. Existing site copy (`src/components/Journey.jsx` etc.) — "**Site**"

### 00.3 Verified Facts Ledger

Only these facts may render without a confirmation marker. Everything else is a gap (§14).

| # | Fact | Source |
|---|------|--------|
| F1 | Full name: Md Anawrul Kabir Fahad | CV-2026, Brief |
| F2 | Location: Chattogram, Bangladesh | CV-2026 |
| F3 | Email: mdanawrulkabirfahad123@gmail.com | CV-2026 |
| F4 | LinkedIn: linkedin.com/in/anawrulkabir | CV-2026 |
| F5 | GitHub: github.com/anawrulkabir | CV-2026 |
| F6 | B.Sc. Mechanical Engineering, CUET, Apr 2022 – Jul 2026 (expected) | CV-2026 |
| F7 | Poridhi.io — Intern Software Engineer, May 2025 – Jun 2025, Remote | CV-2026 |
| F8 | Poridhi.io — Junior Software Engineer, Jun 2025 – Present | CV-2026 |
| F9 | Intern work: prototyped an auth service (Flask, PostgreSQL, multi-arch Docker) and a Pulumi IaC workflow provisioning AWS EC2 instances and load balancers | CV-2026 |
| F10 | AI Studio (ai.poridhi.io): on-demand multi-tenant GPU platform | CV-2026 |
| F11 | Cut GPU session launch time by ~70% (10–15 min → 3–5 min) by co-engineering migration to bare-metal Kubernetes with HAMi GPU virtualization | CV-2026 |
| F12 | Partitioned each RTX 4090 into 6 × 8 GB VRAM slices with hard isolation that Kubernetes time-slicing could not provide | CV-2026 |
| F13 | Architected the initial AWS stack for GPU sessions: g4dn EC2 with custom AMIs, ECR-hosted TensorFlow images, JuiceFS-on-S3 persistence, sidecar containers for runtime isolation | CV-2026 |
| F14 | Designed PostgreSQL schema + REST API for GPU slice allocation and session lifecycle, safe state transitions across concurrent Temporal workflows | CV-2026 |
| F15 | Operated production cluster services (PostgreSQL, Temporal, Headlamp monitoring); per-microservice Kubernetes RBAC | CV-2026 |
| F16 | TensorCode (tensorcode.poridhi.io): in-browser GPU IDE; built the Hono.js backend on Cloudflare (D1, R2, KV) powering in-browser PyTorch and CUDA execution | CV-2026 |
| F17 | Developed React frontend components for TensorCode; authored the team's architecture and deployment documentation used for onboarding | CV-2026 |
| F18 | Thesis: "Parameter-Efficient Adaptation of a PINN Solver for High-Incidence Airfoil Flow" — PINN solver for flow over NACA 0012, LoRA-style fine-tuning for out-of-distribution high-incidence conditions; PyTorch; Supervisor: Prof. Dr. Md. Abu Mowazzem Hossain, CUET; status "Ongoing" | CV-2026 |
| F19 | Champion, Break The Monolith Hackathon (2025): microservices ride-sharing platform (Node.js, PostgreSQL, Redis, RabbitMQ) | CV-2026 |
| F20 | Rising Team, API Avenger Microservice Hackathon, CUET (2025): donation backend, idempotent webhooks, async event handling | CV-2026 |
| F21 | AI Engineering Hackathon, Brain Station 23: intent-based product search with a quantized mini-LLM, BERT, full observability stack (no placement stated) | CV-2026 |
| F22 | Competitive programming: ICPC Preliminaries (2022, 2023); CUET IUPC (2022–2023); 300+ problems across 50+ contests | CV-2026 |
| F23 | Competitive programming under CUET Computer Club, Apr 2022 – Dec 2023 | CV-old `[VERIFY]` |
| F24 | Robosoccer Competition, Chittagong University Scientific Society (CUSS), May–Jun 2022: built a remote-controlled Soccer Bot; Arduino programming | CV-old `[VERIFY]` |
| F25 | Codeforces / CodeChef handle: `fahadkabir123` | CV-old `[VERIFY]` |
| F26 | Early web projects: Luca (tourist guide, role-based dashboards, Stripe), Sitemark (blog, REST API, Stripe), Craftpaper (craft e-commerce, Firebase Auth, Stripe) — with repo/live links listed in §06.4 | CV-old `[VERIFY]` |
| F27 | R455A research: ML prediction of evaporation heat transfer of low-GWP refrigerant R455A in an industrial plate heat exchanger; small experimental dataset; dimensionless + interaction features; cross-condition validation; Gradient Boosting; SHAP; regime analysis. **Status: Manuscript under review.** | SOP, Brief |
| F28 | R1336mzz(E) research: condensation heat transfer of low-GWP refrigerant R1336mzz(E) in an industrial plate heat exchanger. **Status: Research in progress.** | SOP, Brief |
| F29 | Participated in multiple hackathons/technical competitions and one business competition | SOP |
| F30 | Participated in conferences/events, including a recent BETIC-related event | SOP |
| F31 | ~8–10 certificates exist (images pending) | SOP |
| F32 | Technologies stated in Brief/SOP beyond CV-2026: k3s, NVIDIA GPUs, CUDA, Triton, Jupyter, code-server, TensorBoard, S3-compatible storage, C/C++ | Brief, SOP |
| F33 | Languages on CV-2026: Python, JavaScript/TypeScript, Go. Frameworks: React, Next.js, Node.js, Hono.js, Flask, PyTorch. Infra: Kubernetes, Docker, AWS (EC2, S3, ECR), Temporal, Terraform, Pulumi, Cloudflare, GitHub Actions. DBs: PostgreSQL, Redis, MongoDB, Cloudflare D1 | CV-2026 |

**Known conflicts (must be resolved before launch, see §14):**

- **C1 — Graduation status.** CV-2026 says "Jul 2026 (expected)". Today is past July 2026. Is the degree complete? Copy tense ("final-year student" vs "graduate") depends on this. `[NEEDS CONFIRMATION]`
- **C2 — Chronology vs narrative order.** The Brief orders the story Robotics → CP → Hackathons → Software. Verified hackathon dates (F19–F21) are 2025, the same year as the Poridhi job (F7). The world keeps the narrative order but must show real dates. `[NEEDS CONFIRMATION]` that this is acceptable.
- **C3 — "Thesis" vs "research".** The thesis (F18) is PINN/airfoil aerodynamics. The refrigeration work (F27, F28) is separate research. The Brief's §6 phrase "physics-centric thesis" matches F18. The site must not describe R455A as the thesis. `[NEEDS CONFIRMATION]` whether R455A/R1336mzz(E) are with the same supervisor/lab.
- **C4 — Destination statement.** The Brief sets the destination as "AI × Mechanical Engineering × Computational Research". The author's separate PhD planning also covers efficient systems infrastructure for AI workloads. Confirm whether the destination panel mentions only AI × ME, or AI × ME plus AI systems. `[NEEDS CONFIRMATION]`
- **C5 — Existing photo.** `public/images/fahad.jpg` (480×520) exists. Reuse it in About/Contact, or wait for a new professional portrait? `[NEEDS CONFIRMATION]`

---

## 01. Current Website Audit

### 01.1 What exists now

**Stack**

| Item | Current | Notes |
|---|---|---|
| Framework | Next.js 14.2.4, App Router, React 18 | `src/app`. Patch version is old; upgrade within 14.2.x at minimum |
| Language | JavaScript (`.jsx`/`.js`) with `jsconfig.json` alias `@/* → src/*` | `peerDependencies.typescript` declared but no TS in use |
| Styling | Tailwind 3.4 + shadcn/ui (new-york, slate) + `tailwindcss-animate` | shadcn CSS variables in `globals.css` are the stock slate palette; the site actually forces `bg-black` and hardcodes `text-white`, purple, fuchsia |
| Fonts | `PPTelegraf-Regular.otf` via `next/font/local` (`--font-pp-telegraf`); `PPTelegraf-Ultralight.otf` unused; `Inter` imported but never applied | Pangram Pangram fonts need a license for non-trial use `[NEEDS CONFIRMATION]` |
| Animation | GSAP (magnetic hover), Framer Motion (letter flip), `react-fast-marquee`, `react-animated-cursor` | All decorative |
| 3D | three 0.180 + @react-three/fiber 8 + drei 9: distorted purple icosahedron + orbit spheres + sparkles (`components/three/*`) | Large bundle; no narrative purpose |
| Carousel | embla via shadcn `carousel` | Used for mobile projects |
| Icons | lucide-react, react-icons, @radix-ui/react-icons | Three icon libraries |
| Stray | `index.ts` (Bun hello-world), `@types/bun`, npm package `button` (unrelated), `src/utils/test.md` (someone else's GitHub README template), `/animate` demo page, `/review` kanban demo | Remove |

**Routes**

| Route | Current behaviour |
|---|---|
| `/` | Header → Hero (mobile marquee "MULTI-DISCIPLINARY ENGINEER", desktop scroll marker + 3D blob) → About → Journey → Projects → Skills → Footer(contact) |
| `/about` | `redirect('/#about')` |
| `/contact` | `redirect('/#contact')` |
| `/projects` | `AllProjects` — 3 MERN projects (Luca, Sitemark, Craftpaper) |
| `/projects/[projectName]` | Client component; project data duplicated inline; case-sensitive name match |
| `/review` | Drag-and-drop kanban demo (template code) |
| `/animate` | Mask-cursor demo with copied template copy containing profanity — **must be deleted before anything else ships** |

**Components**

| File | Content | Verdict |
|---|---|---|
| `Header.jsx` | Wordmark "FAHAD K.", links Projects/About, pill "AVAILABLE TO HIRED" (typo), mobile sheet with GH/LD/FB/EM | Rebuild as Quick View bar |
| `Hero.jsx` | Two duplicated hero variants (one `hidden`), "01//05 SCROLL", 3D scene, tagline "CLOUD-NATIVE · GPU-ACCELERATED · ENGINEERED FOR SCALE", resume download | Rebuild |
| `About.jsx` | Bio (SE building GPU cloud platforms on Kubernetes; PINN research; final-year ME at CUET), photo, name marquee, dead "LEARN MORE" button | Rewrite copy, reuse facts |
| `Journey.jsx` | Data-driven timeline (9 milestones) with type styles, photo slots, "LVL 01 · QUEST CLEARED" tags | **Best existing asset.** Its data is accurate to CV-2026; migrate to `src/content` |
| `Projects.jsx`, `AllProjects.jsx`, `[projectName]/page.jsx` | Same `cards` array copied three times; tech icons hotlinked from Wikipedia/gstatic/iconscout | Replace with single data source; drop hotlinks |
| `Skills.jsx` | "Skill tree" with **fake 0–100 level bars and LVL numbers** | Violates Brief §17. Remove the numbers; keep the category idea |
| `Footer.jsx` | "HAVE PROJECT IN MIND? LET'S CONNECT", Gmail compose link, `target="_blanck"` typo | Rebuild as Contact room |
| `animation/TextAnimation.jsx` | Renders `<motion.a href="#">` **inside** `next/link` anchors → nested `<a>` (invalid HTML, broken keyboard/screen-reader behaviour) | Delete |
| `animation/GsapAnimate.jsx` | Magnetic hover; adds listeners without cleanup | Delete |
| `background/GridBackground.jsx`, `ButtonGradiant/*`, `ui/animated-tooltip`, `ui/hover-border-gradient`, `carousel/ProjectCaroesel.jsx`, `review/*` | Aceternity-style decorations / unused | Delete |
| `ui/button, card, sheet, dropdown-menu, input, checkbox` | shadcn primitives | Keep `sheet` (Radix Dialog) pattern only; restyle; delete unused |

**Assets**

| Asset | Size | Verdict |
|---|---|---|
| `public/images/fahad.jpg` | 52 KB, 480×520 | Candidate portrait (C5) |
| `public/images/projects/project-{1,2,3}.png` | 2.4 MB / 192 KB / 224 KB | Convert to WebP/AVIF via `next/image`; move to archive projects |
| `public/images/projects/project_1/1–7.png` | ~6.5 MB total | Same |
| `public/resume/Fahad Kabir's Resume(Updated).pdf` | 64 KB | Current CV. Rename (apostrophe + spaces break URLs) |
| `public/resume/Fahad Kabir's Resume.pdf` | 108 KB | Outdated MERN-era CV. Remove from public |
| `public/fonts/PPTelegraf-*.otf` | 84 KB | Drop (see §08.2) |
| `public/next.svg`, `vercel.svg`, `mask.svg` | — | Delete |

**Global behaviour problems**

- `* { user-select: none }` in `globals.css` plus `.prevent-select` wrapper: visitors cannot copy the email, paper title, or any text. Remove entirely.
- Custom animated cursor replaces the system cursor on every page.
- No `<main>`, no heading hierarchy (section titles are animated `<a>` tags), no skip link, no focus styles.
- Metadata: title "Anawrul Kabir", description mentions GSAP. No Open Graph image, no structured data.
- `next.config.mjs` allows remote images from `**` (any host).
- Email links go to a Gmail web-compose URL instead of `mailto:`.
- Facebook is a primary contact link; phone number appears only in the PDF.
- Desktop and mobile each render duplicated DOM (`md:hidden` / `hidden md:block`) — double content for crawlers and screen readers.
- Roughly 9 MB of unoptimized PNGs served through the projects routes.

### 01.2 What can be reused

- Next.js App Router project, Tailwind, `clsx`/`tailwind-merge` `cn()` helper (`src/lib/utils.js`), Framer Motion, Radix Dialog (via shadcn `sheet`).
- `Journey.jsx` **milestone data** (after moving to content files) and its concept of `hasPhotoSlot` placeholders.
- `About.jsx` factual statements (they match CV-2026).
- Project screenshots (after conversion) for the archive of early web projects.
- `fahad.jpg` (pending C5).
- Current CV PDF.
- Social URLs (normalised to CV-2026 forms).

### 01.3 What should be modified

- `tailwind.config.js` → `tailwind.config.ts` with the new token set (§08); keep `tailwindcss-animate` only if Radix sheet transitions need it.
- `layout.js` → `layout.tsx`: new fonts, metadata, skip link, `<QuickViewBar>` mounted globally.
- `next.config.mjs`: remove wildcard remote images; add `images.formats: ['image/avif','image/webp']`; add redirects (§03.1).
- `/projects/[projectName]` → `/projects/[slug]` with `generateStaticParams` and slug-based lookup.
- Upgrade `next` to the latest `14.2.x` patch and `eslint-config-next` to match. (Next 15 upgrade is optional and out of scope.)

### 01.4 What should be removed

`/animate`, `/review`, `index.ts`, `src/utils/test.md`, `src/utils/useMousePosition.js`, `src/utils/Home.module.css`, `src/utils/preventSelect.css`, `src/utils/textInfiniteScroll.css`, `src/utils/cn.js` (duplicate of `lib/utils`), `components/three/*`, `components/animation/*`, `components/background/*`, `components/ButtonGradiant/*`, `components/carousel/*`, `components/review/*`, `components/ui/{animated-tooltip,hover-border-gradient,checkbox,dropdown-menu,input,card,carousel}.jsx`, old resume PDF, `public/{next,vercel,mask}.svg`, unused fonts.

Dependencies to uninstall: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `react-animated-cursor`, `react-fast-marquee`, `embla-carousel-react`, `button`, `@types/bun`, `@radix-ui/react-checkbox`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-icons`, `react-icons`.

### 01.5 What must be completely rebuilt

Homepage, header/navigation, world/journey system, projects presentation, skills presentation, contact, CV access, visual design system, mobile experience, accessibility layer, content architecture.

---

## 02. New Product Vision

**Concept — "The Build Path."** A single side-scrolling pixel-art world that the visitor can walk, click, or skip. The terrain itself changes as you move right: grass and timber workbenches → stone and terminals → a cluttered garage → a clean software workshop → a humming GPU data center → a physics lab → a thermal-systems lab → an overlook facing the horizon. The change of materials *is* the story: machines → software → infrastructure → engineering research.

**Core experience.** Readable profile in the first two seconds; a living world directly under it that invites a few seconds of play; every object in the world opens a short, factual card; every card has a "full page" link for the deep dive.

**Target audience.** (1) PhD professors and research collaborators in mechanical/thermal engineering and ML-for-engineering; (2) software, platform and AI-infrastructure recruiters; (3) engineering professionals and peers. Groups 1 and 2 get dedicated fast paths (§10, §11).

**Narrative spine** (appears once, verbatim, on the homepage below the world):

> I started by building machines. Then I learned to build software. Then I learned to build the infrastructure behind AI. Now I apply computational intelligence to engineering problems.

**Visual identity.** Original 16-px pixel art in muted earth-and-forest tones, a charcoal night sky, warm off-white UI panels with hard pixel shadows, cyan used only where computation happens (terminals, GPU LEDs, data), amber used only for "you can interact with this". Sophisticated, dim, calm — a well-made indie game, not an arcade.

**Primary interaction model.** Two layers, always both available:

- **Explore** — walk with ←/→ (or A/D), or click any object/zone; the avatar walks there and the card opens.
- **Quick View** — a persistent bar with About, Experience, Research, Projects, Skills, CV, Contact. Every Quick View destination is a real route with plain semantic content. The game is never a gate.

---

## 03. Information Architecture

### 03.1 Routes

| Route | Type | Purpose |
|---|---|---|
| `/` | Static | Hero + world + narrative spine + credibility strip + fast-path buttons |
| `/?at=<zone>&open=<objectId>` | Query state on `/` | Deep-link to a zone and an open card (shareable) |
| `/experience` | Static | Poridhi.io roles in full; responsibilities grouped by product (AI Studio, TensorCode, Internship) |
| `/research` | Static | Research interests, thesis, manuscripts, in-progress work |
| `/research/[slug]` | Static (SSG) | `pinn-naca0012-thesis`, `r455a-evaporation-ml`, `r1336mzze-condensation-ml` |
| `/projects` | Static | Artifact shelf: professional systems, hackathon builds, early web projects |
| `/projects/[slug]` | Static (SSG) | Project detail |
| `/journey` | Static | Accessible, text-first version of the whole world: all chapters as sections in order |
| `/archive` | Static | Achievement room: certificates + events/conference map |
| `/skills` | Static | Tools grouped into six workshops (§06) |
| `/about` | Static | Short narrative + education + portrait (C5) |
| `/cv` | Static | Inline PDF viewer + View / Download buttons |
| `/contact` | Static | Email, LinkedIn, GitHub, Scholar (if any), CV |
| `/hire` | Static | Recruiter brief (§10) |
| `/academic` | Static | Researcher/professor brief (§11) |

Redirects (`next.config`): `/resume → /cv`, `/projects/Luca → /projects/luca` (and the other two), `/review → /`, `/animate → /`. Remove the `/about` and `/contact` redirect pages (they become real pages).

Static assets: `/cv/Md-Anawrul-Kabir-Fahad-CV.pdf` (renamed). Optional `/cv/Md-Anawrul-Kabir-Fahad-Academic-CV.pdf` `[ADD ACADEMIC CV — optional]`.

### 03.2 Sections on the homepage (top to bottom)

1. Quick View bar (sticky)
2. Hero identity block
3. World viewport + route strip (the signature moment)
4. Narrative spine (four lines)
5. Credibility strip — three verified facts with links (§04)
6. Fast paths — "Hiring? Read the 1-minute brief" → `/hire`; "Academic? Research overview" → `/academic`
7. Footer: email, LinkedIn, GitHub, CV, last-updated date

Nothing else. Projects, skills and certificates live in the world and on their own routes — never as homepage grids.

### 03.3 Navigation

- **Quick View bar** (all pages, sticky top, 56 px): wordmark "Fahad Kabir" (link `/`) · About · Experience · Research · Projects · Skills · **View CV** (filled button) · Contact. On `<lg` it collapses to wordmark + "View CV" + "Menu" (Radix Dialog sheet).
- **Route strip** (homepage only, under the world): seven waypoints. Clicking one moves the camera. It doubles as the progression indicator.
- **In-card links:** each card ends with "Open full page" (route) and, where relevant, "Next stop" (moves camera to next zone).
- **Breadcrumbs** on detail pages: `Research / R455A evaporation study`.
- **Keyboard:** `Tab` order = Quick View → hero CTAs → world objects in path order → route strip → rest. Shortcut `M` toggles the full map overlay; `Esc` closes any card. Shortcuts are listed in a "Controls" popover (`?`).

### 03.4 Journey structure

Seven zones + destination + two rooms, in path order:

| # | Zone id | Name (pixel label) | Progression word | Content domain |
|---|---|---|---|---|
| 1 | `workshop` | The Workshop | ENGINEERING | Robotics, Soccer Bot, CUET start |
| 2 | `dungeon` | Algorithm Dungeon | LOGIC | Competitive programming |
| 3 | `garage` | The Garage | BUILDING | Hackathons, business competition |
| 4 | `software` | Software Workshop | SOFTWARE | Poridhi internship, TensorCode backend, backend/API work |
| 5 | `datacenter` | GPU Data Center | INFRASTRUCTURE | AI Studio, HAMi, Kubernetes, AWS stack, TensorCode reactor |
| 6 | `physics-lab` | Physics-Informed Lab | MODELING `[NEEDS CONFIRMATION of word]` | Thesis: PINN + LoRA, NACA 0012 |
| 7 | `thermal-lab` | Thermal Systems Lab | RESEARCH | R455A (under review), R1336mzz(E) (in progress) |
| — | `overlook` | The Overlook | — | Destination statement |
| R1 | `archive` | Archive Room (door beside the overlook) | — | Certificates, events map |
| R2 | `contact` | Field Office (door beside the archive) | — | Contact, CV |

Rationale for splitting the SOP's "AI/ML Lab" and "ME Research Lab": the thesis (fluid dynamics, PINN) and the refrigeration work (heat transfer, gradient boosting on experimental data) are different research lines with different evidence; merging them would blur what a professor is looking for.

### 03.5 Research structure

```
Research
├── Interests (six short statements from SOP §10, no equations)
├── Thesis
│   └── PINN solver adaptation — NACA 0012, high incidence (Ongoing)
├── Manuscripts
│   └── R455A evaporation HTC prediction (Manuscript under review)
├── Research in progress
│   └── R1336mzz(E) condensation (Research in progress)
├── Publications            (empty state until one exists — section hidden)
├── Conference papers       (empty state — hidden)
└── Events & talks          (links to /archive#events)
```

Each research item page uses one fixed outline: *Question → Engineering system → Data → Method → What I'm investigating / findings → Status → Links*. Findings are only shown when the author supplies them.

### 03.6 Project structure

Three shelves in `/projects` (and three shelf objects in the world):

1. **Systems** (professional; link to Experience): AI Studio, TensorCode — described only with F10–F17.
2. **Hackathon builds**: ride-sharing microservices (F19), donation backend (F20), intent-based product search (F21).
3. **Early web builds (2023–24)** `[VERIFY dates]`: Luca, Sitemark, Craftpaper.
4. Optional **Personal**: Puku AI — `[NEEDS CONFIRMATION: include? public link?]`.

### 03.7 Experience structure

```
Poridhi.io  (Remote, Bangladesh)
├── Junior Software Engineer — Jun 2025 – Present
│   ├── AI Studio (ai.poridhi.io) — F11, F12, F13, F14, F15
│   └── TensorCode (tensorcode.poridhi.io) — F16, F17
└── Intern Software Engineer — May 2025 – Jun 2025 — F9
```

Rendered as a single company block with two stacked roles (promotion is visible), not two separate jobs.

---

## 04. Homepage Specification

### 04.1 Above the fold — desktop (1440×900 reference, must also hold at 1280×720)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ Fahad Kabir   About  Experience  Research  Projects  Skills   [View CV] Contact│  56px sticky
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Md Anawrul Kabir Fahad                                    (pixel H1, 40–56px)│
│  Mechanical Engineering × AI × Software Infrastructure        (body, 20px)    │
│  I build systems at the intersection of engineering, software,                │
│  AI infrastructure, and computational research.                (body 17px)    │
│                                                                               │
│  [ Explore the world ▸ ]   [ View CV ]   Hiring? 1-min brief · Academic? Research │
│                                                                               │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │  WORLD VIEWPORT  (height clamp(320px, 52vh, 560px))                       │ │
│ │   sky / far parallax / mid layer / ground + objects / avatar              │ │
│ │   [pixel tooltip near nearest object]                                     │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│  ○ENGINEERING ─ ○LOGIC ─ ○BUILDING ─ ●SOFTWARE ─ ○INFRA ─ ○MODELING ─ ○RESEARCH │ route strip
└───────────────────────────────────────────────────────────────────────────────┘
```

### 04.2 Exact copy

- **H1:** `Md Anawrul Kabir Fahad`
- **Positioning line:** `Mechanical Engineering × AI × Software Infrastructure`
- **Sentence:** `I build systems at the intersection of engineering, software, AI infrastructure, and computational research.`
- **Primary CTA:** `Explore the world` — focuses the world viewport and shows the controls hint for 4 s.
- **Secondary CTA:** `View CV` → `/cv`
- **Text links:** `Hiring? Read the 1-minute brief` → `/hire`; `Academic? See research` → `/academic`
- **World controls hint** (first visit, dismissible, inside viewport bottom-left): `← → to walk · click anything glowing · M for map`
- **Credibility strip** (below spine, three items, each a link):
  1. `Software Engineer at Poridhi.io — GPU platform for AI Studio` → `/experience`
  2. `Manuscript under review — ML for R455A evaporation heat transfer` → `/research/r455a-evaporation-ml`
  3. `B.Sc. Mechanical Engineering, CUET` → `/about` — suffix `(expected Jul 2026)` or `(2026)` depending on C1

### 04.3 Visual hierarchy (maps to Brief §34)

| Level | Time | Element |
|---|---|---|
| 1 | 2 s | H1 name |
| 2 | 5 s | Positioning line + sentence |
| 3 | 10 s | The world itself (terrain evolution visible across the route strip labels) + credibility strip |
| 4 | 30 s | Opening any object card |
| 5 | Deep | Routes `/research/*`, `/projects/*`, `/experience`, `/archive` |

### 04.4 Avatar at load

Avatar stands in The Workshop next to the Soccer Bot, wearing Workshop outfit (§05). The signature "rewind" moment (§09, I-01) plays once.

### 04.5 Hero rules

- The hero text block is plain HTML, server-rendered, visible before any JS or world asset loads (it is the LCP element).
- World viewport reserves its height from first paint (no CLS); shows a flat two-tone ground-and-sky placeholder until tiles load.
- No background video, no 3D, no marquee, no cursor effects.

---

## 05. Journey / World Map

### 05.1 World geometry

- **Tile:** 16×16 source px. **Rendering scale:** integer only — `scale = clamp(2, floor(viewportHeight / (12 × 16)), 4)`. Never fractional (keeps pixels crisp).
- **World height:** 12 tiles (sky 5, mid 3, ground line at row 9, ground 3).
- **Walk line:** avatar feet on row 9. Movement is 1-D along x. No jumping, no collisions, no enemies.
- **Zone width:** 40 tiles each (zones 1–7), overlook 24 tiles, rooms 16 tiles each → total **336 tiles** (5376 source px).
- **Transitions:** the 4 tiles at each zone boundary blend both tilesets (e.g. grass tiles with the first stone slabs), so the change is gradual.
- **Camera:** follows avatar with dead-zone of 30% viewport width; clamps at world ends; smooth via `transform: translate3d()`; one camera per page.
- **Layers:** (1) sky gradient (CSS), (2) far silhouettes (one image per zone, parallax 0.3), (3) ground + props canvas (parallax 1), (4) interactive objects (DOM buttons, parallax 1), (5) avatar (DOM), (6) tooltips/cards (DOM, fixed to viewport).
- **Time of day** progresses with x: dawn light in the Workshop, day through Software, dusk in the Data Center (cyan LEDs read best), night in the labs, first light at the Overlook. Implemented as sky-gradient stops interpolated by camera x — one CSS variable update per frame.

### 05.2 Zone specifications

Each object line: **`objectId` — sprite — tooltip text → card content**.
Card content uses only ledger facts; bracketed items are placeholders.

---

#### Zone 1 — `workshop` · The Workshop · ENGINEERING

- **Purpose:** establish "I started by building machines."
- **Environment:** grass, packed dirt, timber workbench under a lean-to roof, pegboard with tools, a small walled robo-soccer pitch (green felt, white lines, two goals), a sign post with the CUET-green pennant (no university logo).
- **Palette emphasis:** grass greens, timber browns, dawn light.
- **Objects:**
  - `soccer-bot` — small wheeled bot with a pusher front; idle: wheels tick every 3 s → tooltip `Soccer Bot, 2022` → card: *Robosoccer Competition, Chittagong University Scientific Society (CUSS), May–Jun 2022 [VERIFY]. Built a remote-controlled soccer bot; programmed it on Arduino.* Photos: `[ADD SOCCER BOT PHOTOS]`. Result: `[ADD COMPETITION RESULT — optional]`.
  - `workbench` — bench with motor, battery, controller board → tooltip `The workbench` → card: *Hands-on hardware: motors, drivers, controllers, wiring.* `[ADD components actually used]` — until supplied, card shows only the Arduino fact.
  - `cuet-signpost` → tooltip `CUET, 2022` → card: *B.Sc. Mechanical Engineering, CUET, from Apr 2022.* Link `/about`.
- **Transition to Zone 2:** dirt path turns to stone slabs; the workshop's lean-to gives way to a stone archway lit by a terminal glow. Tooltip at the arch: `Next: Algorithm Dungeon`.

#### Zone 2 — `dungeon` · Algorithm Dungeon · LOGIC

- **Purpose:** "I learned to think algorithmically, under constraints."
- **Environment:** stone interior, wall-mounted terminals with cyan text rows (abstract glyphs, not real code), a floor maze drawn as grid tiles, three gated doors.
- **Objects:**
  - `terminal` — CRT terminal → tooltip `Competitive programming` → card: *ICPC Preliminaries (2022, 2023). CUET IUPC (2022–2023). 300+ problems solved across 50+ contests. CUET Computer Club [VERIFY].* Links: Codeforces, CodeChef `fahadkabir123` `[VERIFY still active]`.
  - `maze` — floor grid; hovering/focusing lights the shortest path in amber (BFS, computed once, 20×6 grid) → tooltip `Why this mattered` → card: *Algorithmic thinking I still use in systems work: state machines, scheduling, resource allocation.* (This is framing, not a claim of results.) `[NEEDS CONFIRMATION of this sentence]`
  - `team-door` → tooltip `Team contests` → card: team contests existed per SOP; team name/members `[ADD TEAM CONTEST DETAILS — optional]`.
- **No** leaderboard numbers, ranks, ratings or medals unless supplied.
- **Transition to Zone 3:** stone floor ends at a roll-up garage door; light changes from cool to warm.

#### Zone 3 — `garage` · The Garage · BUILDING

- **Purpose:** "I build and experiment."
- **Environment:** concrete floor, roll-up door, whiteboard with sticky notes, folding tables with laptops, a small trophy shelf, extension cords.
- **Objects (one per verified event):**
  - `trophy-monolith` — pixel trophy → `Break The Monolith — Champion, 2025` → card F19; images `[ADD]`; repo `[ADD]`.
  - `laptop-api-avenger` → `API Avenger, CUET — Rising Team, 2025` → card F20.
  - `laptop-bs23` → `AI Engineering Hackathon, Brain Station 23` → card F21 (no placement shown).
  - `pitch-board` — easel with a blank chart → `Business competition` → card: *Took part in a business competition.* `[ADD EVENT NAME, TEAM, IDEA, RESULT]`. Until supplied, card shows the single sentence.
  - `sticky-wall` → `More events` → link `/archive#events`.
- **Transition to Zone 4:** the garage's back wall opens into a tidy office bay; concrete becomes light wood flooring; cables get organised into a tray.

#### Zone 4 — `software` · Software Workshop · SOFTWARE

- **Purpose:** "Builder → Engineer." Professional software work begins.
- **Environment:** desks with dual monitors, a whiteboard with a service diagram (boxes/arrows only), a server closet door in the back glowing cyan (foreshadows Zone 5), a coffee machine (static).
- **Objects:**
  - `desk-internship` → `Intern Software Engineer, Poridhi.io` → card F7 + F9. Tech chips: Flask, PostgreSQL, Docker (multi-arch), Pulumi, AWS EC2.
  - `whiteboard-api` → `Backends & APIs` → card: TensorCode backend F16 (Hono.js on Cloudflare: D1, R2, KV). Chip: Cloudflare Workers.
  - `monitor-frontend` → `Frontend & docs` → card F17.
  - `toolbox` — opens the **Software** and **Programming** tool drawers (§06.8) → link `/skills#software`.
- **Transition to Zone 5:** avatar walks through the server-closet door; the scene widens into a hall of racks. Floor becomes perforated steel tiles.

#### Zone 5 — `datacenter` · GPU Data Center · INFRASTRUCTURE (strongest technical zone)

- **Purpose:** "I understand AI from the infrastructure that makes it possible."
- **Environment:** rows of racks with blinking cyan/amber LEDs, overhead cable trays, cold-aisle floor, a central "control desk". Dusk lighting.
- **Guided pipeline** — six machines in a row the avatar walks past, connected by a pixel cable that pulses once when a machine is opened (shows data flow direction):

| Order | `objectId` | Sprite | Tooltip | Card content |
|---|---|---|---|---|
| 1 | `gpu-rack` | GPU card with fans | `The GPU` | RTX 4090 partitioned into 6 × 8 GB VRAM slices with hard isolation via HAMi (F12). Why: time-slicing could not provide isolation. |
| 2 | `container-crate` | shipping crate | `Container` | Session images and sidecar containers for runtime isolation (F13); multi-arch Docker (F9). |
| 3 | `k8s-console` | control console with a cluster grid display (no Kubernetes logo) | `Orchestration` | Migration to bare-metal Kubernetes with HAMi; launch time 10–15 min → 3–5 min, ~70% faster (F11). k3s `[NEEDS CONFIRMATION: which cluster used k3s]`. RBAC per microservice (F15). |
| 4 | `workflow-conveyor` | conveyor with parcels | `Session lifecycle` | PostgreSQL schema + REST API for slice allocation and session state; safe transitions across concurrent Temporal workflows (F14). |
| 5 | `workspace-pod` | desk pod with a notebook screen | `AI workspace` | AI Studio: on-demand multi-tenant GPU environments (F10) with Jupyter, code-server, TensorBoard (F32). Link `ai.poridhi.io`. Screenshot `[ADD AI STUDIO SCREENSHOTS]`. |
| 6 | `cloud-gate` | loading bay to "sky" | `Cloud` | Initial AWS stack: g4dn EC2, custom AMIs, ECR-hosted TensorFlow images, JuiceFS-on-S3 persistence (F13). Pulumi/Terraform (F33). |

- **Side object:** `tensor-reactor` — a glowing core in a glass cylinder behind the control desk → `TensorCode` → card: in-browser GPU IDE for PyTorch and CUDA (F16); CUDA/Triton learning & problem-solving context (SOP §09); author's exact role beyond F16–F17 `[NEEDS CONFIRMATION: involvement with Triton problems/content]`. Link `tensorcode.poridhi.io`.
- **Side object:** `ops-desk` → `Operations` → F15 (PostgreSQL, Temporal, Headlamp in production).
- **Tool drawers:** `rack-toolbox` → Infrastructure + GPU/AI Systems drawers (§06.8).
- **Transition to Zone 6:** the last rack aisle ends at a glass airlock; beyond it the lighting turns to a clean lab white-blue; a wind tunnel is visible.

#### Zone 6 — `physics-lab` · Physics-Informed Lab · MODELING

- **Purpose:** research begins — physics + learning.
- **Environment:** lab tiles, a small open-circuit wind tunnel with a pixel airfoil inside, a chalkboard with *one* symbolic sketch (streamlines around an airfoil — no equations on first view), a workstation.
- **Objects:**
  - `wind-tunnel` → `Thesis: PINN for airfoil flow` → card F18. Title, one-sentence summary, supervisor, status `Ongoing` (or updated per C1). Button "Read more" → `/research/pinn-naca0012-thesis`.
    - **Interaction:** a slider "Angle of attack" (0° → high) tilts the pixel airfoil and bends the drawn streamlines; the label switches from "Training range" to "Out of distribution" past a threshold, then a small "LoRA patch" chip appears. This explains the research idea (adapting to OOD high-incidence conditions without full retraining) visually. The threshold value is illustrative only and labelled "Illustration" — do not imply real results. `[ADD actual training AoA range to make it exact — optional]`
  - `chalkboard` → `Physics-informed ML, in one line` → card: *The network is trained to fit data and to satisfy the governing flow equations at the same time.* `[NEEDS CONFIRMATION wording]`
  - `workstation` → figures `[ADD THESIS FIGURES]`, repo `[ADD THESIS REPO — if public]`.
- **Transition to Zone 7:** a corridor with pipe runs (copper colour) leads into the thermal lab.

#### Zone 7 — `thermal-lab` · Thermal Systems Lab · RESEARCH

- **Purpose:** AI × Mechanical Engineering applied to real thermal systems.
- **Environment:** a plate heat exchanger rig (stacked plates, four ports, copper piping), refrigerant cylinders (generic, unlabelled brands), data logger, a desk with printed plots.
- **Objects:**
  - `phe-rig-r455a` → `R455A evaporation study — manuscript under review` → opens the **Research Pipeline** panel (§09, I-09) with six stages: **Experimental system → Measurements → Physics-based features → Machine learning → Validation → Interpretation**. Each stage shows 1–2 sentences from F27:
    1. Experimental system: evaporation of low-GWP R455A in an industrial plate heat exchanger.
    2. Measurements: a relatively small experimental dataset. `[ADD dataset size & operating ranges]`
    3. Physics-based features: dimensionless parameters and interaction features.
    4. Machine learning: gradient-boosting models (among others `[ADD model list]`).
    5. Validation: cross-condition validation to test generalisation beyond seen operating conditions.
    6. Interpretation: SHAP-based interpretability and regime analysis.
    Status badge: **Manuscript under review**. Journal name: not shown unless supplied `[ADD — optional, only if author wants it public]`. Co-authors `[ADD]`. Findings `[ADD — do not invent]`.
  - `phe-rig-r1336` → `R1336mzz(E) condensation — research in progress` → card with fixed outline: Research question `[ADD]` · Engineering problem: condensation heat transfer of R1336mzz(E) in an industrial PHE · Dataset `[ADD]` · ML approach `[ADD]` · What I'm investigating `[ADD]` · Status **Research in progress**.
  - `data-logger` → `Why small data is the hard part` → card: *With few experimental points, how features are built and how models are validated matters as much as the model itself.* (Restates F27's stated focus.)
  - `interests-board` → `Research interests` → six interests from SOP §10 → link `/research`.
- **Transition to Overlook:** the lab's back door opens to a rooftop.

#### Destination — `overlook` · The Overlook

- **Purpose:** emotional conclusion — "This is where I am going."
- **Environment:** rooftop edge at first light; the whole world visible behind as a dim silhouette strip (a scaled-down render of zones 1–7); the horizon ahead.
- **Content (not a card; rendered in-scene as a large panel when the avatar arrives or when the zone is selected):**
  - Heading (pixel font): `This is where I'm going.`
  - Line (body, 24 px): `AI × Mechanical Engineering × Computational Research` (C4)
  - Sentence: `Using computational and AI methods to understand and model real engineering systems.` (SOP §14)
  - Buttons: `See research` → `/research`, `View CV` → `/cv`, `Get in touch` → `/contact`
- **Two doors** at the right edge: `Archive` and `Field Office`.

#### Room R1 — `archive` · Archive Room

- **Environment:** a quiet interior; wooden wall with a 5×2 grid of frames; a map table in the centre.
- **Objects:**
  - `frame-{n}` for each certificate in `certifications.ts`. Empty frames show a dashed outline and "Certificate pending" in dev; in production, only filled frames render. Click → lightbox with the actual image, name, issuer, date, credential link.
  - `map-table` → events map (§09, I-12): pins by type (Conference, Hackathon, Competition, Research event). BETIC-related event pin exists only once details are supplied `[ADD BETIC EVENT NAME, DATE, ROLE, PHOTOS]`.
- **Page twin:** `/archive`.

#### Room R2 — `contact` · Field Office

- **Environment:** small drafting table, a mailbox, a pinned CV on the wall.
- **Objects:** `mailbox` → email (copy button + mailto); `cv-pin` → `/cv`; `link-board` → LinkedIn, GitHub, Google Scholar `[ADD IF EXISTS]`, ORCID `[ADD IF EXISTS]`.
- **Page twin:** `/contact`.

### 05.3 Avatar progression (visual, no numbers)

The avatar is an original, non-photographic pixel character (18×24 px source). Its outfit changes when it crosses a zone boundary — the progression system made visible:

| Zones | Outfit / held item |
|---|---|
| Workshop | work apron, safety goggles on forehead |
| Dungeon, Garage | hoodie, laptop under arm |
| Software, Data Center | lanyard badge, headset around neck |
| Physics & Thermal labs, Overlook | lab coat over hoodie, clipboard |

Physical traits (hair, skin tone, glasses) `[NEEDS CONFIRMATION — author chooses; default: neutral dark hair, no glasses]`. The avatar must not be a likeness derived from the photo unless the author asks.

### 05.4 Route strip / progression indicator

Seven waypoints with the progression words (ENGINEERING, LOGIC, BUILDING, SOFTWARE, INFRASTRUCTURE, MODELING, RESEARCH). States: *unvisited* (outline), *visited* (filled with the zone's key colour), *current* (filled + amber marker). Visited state is stored in `sessionStorage` (try/catch; empty storage = all unvisited). No percentages, no XP, no levels.

---

## 06. Content Architecture

### 06.1 Principles

- All content in `src/content/*.ts`, typed by `src/content/types.ts`, exported as plain arrays/objects. No CMS.
- A single `pending(label)` helper marks missing content:

```ts
// src/content/pending.ts
export type Pending = { __pending: true; label: string };
export const pending = (label: string): Pending => ({ __pending: true, label });
export const isPending = (v: unknown): v is Pending =>
  typeof v === 'object' && v !== null && (v as Pending).__pending === true;
export type Maybe<T> = T | Pending;
```

- Rendering rule: `<Field value={x} />` renders nothing in production when `isPending(x)`; in development it renders a dashed amber chip showing the label.
- `scripts/content-gaps.ts` (run via `npm run gaps`) walks all content and prints every pending label with its file and id. The output is the live version of §14.
- Every entity has a stable `id` (kebab-case) used for routes, world objects and deep links.
- Status strings are enums, never free text, so "published" can never be typed by accident.

### 06.2 Types

```ts
// src/content/types.ts
import type { Maybe } from './pending';

export type ISODateish = string;           // '2025-06' or '2025' or '2025-06-01'
export type DateRange = { start: ISODateish; end: ISODateish | 'present' | 'expected'; endLabel?: string };

export type LinkKind = 'email' | 'linkedin' | 'github' | 'scholar' | 'orcid' | 'codeforces'
  | 'codechef' | 'website' | 'repo' | 'demo' | 'paper' | 'doi' | 'credential' | 'product';
export type Link = { kind: LinkKind; label: string; href: string; verify?: boolean };

export type ImageAsset = {
  id: string;
  src: Maybe<string>;          // path under /public/media/... ; pending until supplied
  alt: string;                 // required even for placeholders
  width?: number; height?: number;
  caption?: string;
  kind: 'photo' | 'screenshot' | 'figure' | 'certificate' | 'portrait';
};

export type Profile = {
  name: string;                // 'Md Anawrul Kabir Fahad'
  shortName: string;           // 'Fahad Kabir'
  positioning: string;         // 'Mechanical Engineering × AI × Software Infrastructure'
  sentence: string;
  spine: [string, string, string, string];
  location: string;            // 'Chattogram, Bangladesh'
  about: string[];             // 2 short paragraphs
  portrait: Maybe<ImageAsset>;
  education: Education[];
  destination: { heading: string; line: string; sentence: string };
  cv: { viewHref: string; downloadHref: string; updated: ISODateish; academic?: Maybe<string> };
  links: Link[];
};

export type Education = {
  id: string; institution: string; degree: string; location: string;
  dates: DateRange; status: 'in-progress' | 'completed'; details?: Maybe<string>[];
};

export type ZoneId = 'workshop' | 'dungeon' | 'garage' | 'software' | 'datacenter'
  | 'physics-lab' | 'thermal-lab' | 'overlook' | 'archive' | 'contact';

export type JourneyChapter = {
  id: ZoneId;
  order: number;
  name: string;                // 'The Workshop'
  progressWord?: string;       // 'ENGINEERING'
  period?: Maybe<string>;      // '2022'
  summary: string;             // one line, shown in route strip tooltip and /journey
  objects: WorldObjectRef[];   // world placement (see world/layout.ts) references content ids
};

export type WorldObjectRef = {
  objectId: string;
  tooltip: string;
  opens:
    | { type: 'experience'; id: string; highlight?: string[] }
    | { type: 'research'; id: string; view?: 'pipeline' | 'card' }
    | { type: 'project'; id: string }
    | { type: 'event'; id: string }
    | { type: 'note'; id: string }           // short-form notes in journey.ts
    | { type: 'skills'; groups: SkillGroupId[] }
    | { type: 'certificates' } | { type: 'events-map' } | { type: 'contact' } | { type: 'route'; href: string };
};

export type Note = { id: string; title: string; body: Maybe<string>[]; images?: ImageAsset[]; links?: Link[]; sources: string[] };

export type Experience = {
  id: string;
  org: string; orgUrl?: string; location: string;
  roles: {
    id: string; title: string; dates: DateRange;
    groups: { product?: string; productUrl?: string; bullets: string[] }[];
    tech: string[];            // skill ids
  }[];
  images?: ImageAsset[];
};

export type ResearchStatus = 'published' | 'accepted' | 'under-review' | 'in-preparation'
  | 'in-progress' | 'ongoing-thesis' | 'completed-thesis';

export const researchStatusLabel: Record<ResearchStatus, string> = {
  'published': 'Published', 'accepted': 'Accepted', 'under-review': 'Manuscript under review',
  'in-preparation': 'Manuscript in preparation', 'in-progress': 'Research in progress',
  'ongoing-thesis': 'Ongoing thesis', 'completed-thesis': 'Thesis',
};

export type Research = {
  id: string;
  kind: 'thesis' | 'manuscript' | 'publication' | 'conference-paper' | 'project';
  title: string;
  shortTitle: string;
  status: ResearchStatus;
  oneLine: string;
  question: Maybe<string>;
  system: Maybe<string>;       // engineering system
  data: Maybe<string>;
  method: Maybe<string>[];
  investigating: Maybe<string>[];
  findings: Maybe<string>[];   // only author-supplied
  pipeline?: { stage: string; text: Maybe<string> }[];
  supervisor?: Maybe<string>;
  authors?: Maybe<string>;
  venue?: Maybe<string>;       // journal/conference; hidden while under review unless author opts in
  showVenue?: boolean;
  doi?: Maybe<string>;
  links: Link[];
  figures: ImageAsset[];
  tags: string[];              // skill ids
  updated: ISODateish;
};

export type Project = {
  id: string;
  shelf: 'systems' | 'hackathon' | 'hardware' | 'early-web' | 'personal';
  name: string;
  oneLine: string;
  problem: Maybe<string>;
  role: Maybe<string>;
  contribution: Maybe<string>[];
  tech: string[];              // skill ids
  status: 'production' | 'shipped' | 'prototype' | 'archived' | 'in-progress' | Maybe<string>;
  result?: Maybe<string>;      // e.g. 'Champion' — only if verified
  date?: Maybe<string>;
  links: Link[];
  images: ImageAsset[];        // 0–3 shown on card, all on detail page
  experienceId?: string;       // cross-link for Systems shelf
  verify?: boolean;
};

export type Certification = {
  id: string;
  name: Maybe<string>; issuer: Maybe<string>; date: Maybe<ISODateish>;
  credentialUrl?: Maybe<string>;
  image: ImageAsset;           // image.src pending until uploaded
  category?: 'cloud' | 'ml' | 'engineering' | 'programming' | 'other';
};

export type EventItem = {
  id: string;
  type: 'conference' | 'hackathon' | 'competition' | 'research-event' | 'business-competition';
  name: Maybe<string>; organizer?: Maybe<string>; date: Maybe<ISODateish>;
  place?: Maybe<string>;       // city / venue; used for map pin placement
  role: Maybe<string>;         // participant / presenter / team member
  result?: Maybe<string>;
  summary?: Maybe<string>;
  images: ImageAsset[];
  links: Link[];
  relatedProjectId?: string;
};

export type SkillGroupId = 'programming' | 'software' | 'infrastructure' | 'gpu-ai' | 'ml-research' | 'engineering';
export type Skill = {
  id: string; name: string; group: SkillGroupId;
  evidence: { type: 'experience' | 'project' | 'research' | 'event'; id: string }[]; // where it was used
  verify?: boolean;            // true = author must confirm before render
};
export type SkillGroup = { id: SkillGroupId; name: string; workshop: string; blurb: string };
```

### 06.3 Content files

```
src/content/
  pending.ts
  types.ts
  profile.ts          Profile, education, links, CV, destination
  journey.ts          JourneyChapter[] + Note[]
  experience.ts       Experience[]
  research.ts         Research[]
  projects.ts         Project[]
  certifications.ts   Certification[] (10 pending slots)
  events.ts           EventItem[]
  skills.ts           SkillGroup[] + Skill[]
  assets.ts           ImageAsset registry (optional; ids referenced elsewhere)
  index.ts            re-exports + derived lookups (byId maps, skill→evidence reverse index)
```

### 06.4 Seed content (verified only)

**profile.ts (seed)**

```ts
export const profile: Profile = {
  name: 'Md Anawrul Kabir Fahad',
  shortName: 'Fahad Kabir',
  positioning: 'Mechanical Engineering × AI × Software Infrastructure',
  sentence: 'I build systems at the intersection of engineering, software, AI infrastructure, and computational research.',
  spine: [
    'I started by building machines.',
    'Then I learned to build software.',
    'Then I learned to build the infrastructure behind AI.',
    'Now I apply computational intelligence to engineering problems.',
  ],
  location: 'Chattogram, Bangladesh',
  about: [
    // Draft — author to approve. Tense depends on C1.
    'I study Mechanical Engineering at CUET and work as a software engineer at Poridhi.io, where I build the GPU platform behind AI Studio. I started with robots — a remote-controlled soccer bot in 2022 — then spent two years on competitive programming before moving into backend and infrastructure work.',
    'My research brings that computing background back to engineering: a physics-informed neural network solver for airfoil flow in my thesis, and machine-learning models for heat transfer in low-GWP refrigerants. I am most interested in problems where physical understanding and learned models have to work together.',
  ],
  portrait: pending('ADD PROFESSIONAL PORTRAIT or confirm reuse of fahad.jpg'),
  education: [{
    id: 'cuet-bsc-me', institution: 'Chittagong University of Engineering & Technology (CUET)',
    degree: 'B.Sc. in Mechanical Engineering', location: 'Chattogram, Bangladesh',
    dates: { start: '2022-04', end: 'expected', endLabel: 'Jul 2026 (expected)' }, // C1
    status: 'in-progress',
    details: [pending('ADD CGPA — optional'), pending('ADD relevant coursework — optional')],
  }],
  destination: {
    heading: "This is where I'm going.",
    line: 'AI × Mechanical Engineering × Computational Research', // C4
    sentence: 'Using computational and AI methods to understand and model real engineering systems.',
  },
  cv: { viewHref: '/cv', downloadHref: '/cv/Md-Anawrul-Kabir-Fahad-CV.pdf', updated: '2026-07',
        academic: pending('ADD ACADEMIC CV — optional') },
  links: [
    { kind: 'email', label: 'Email', href: 'mailto:mdanawrulkabirfahad123@gmail.com' },
    { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/anawrulkabir' },
    { kind: 'github', label: 'GitHub', href: 'https://github.com/anawrulkabir' },
    { kind: 'codeforces', label: 'Codeforces', href: 'https://codeforces.com/profile/fahadkabir123', verify: true },
    { kind: 'codechef', label: 'CodeChef', href: 'https://www.codechef.com/users/fahadkabir123', verify: true },
    // scholar / orcid: add only when they exist
  ],
};
```

About-copy notes: "two years on competitive programming" derives from F23 (Apr 2022 – Dec 2023) `[VERIFY]`. The second sentence of paragraph 2 is interpretive framing — author must approve.

**experience.ts (seed)** — the entire `poridhi` entry is F7–F17 verbatim-in-meaning. Tech ids: `kubernetes, hami, docker, aws-ec2, aws-s3, aws-ecr, juicefs, temporal, postgresql, headlamp, k8s-rbac, hono, cloudflare-workers, cloudflare-d1, cloudflare-r2, cloudflare-kv, react, flask, pulumi, pytorch-runtime, cuda-runtime`. Bullets keep CV wording; do not add new claims.

**research.ts (seed)**

| id | kind | status | fields filled | pending |
|---|---|---|---|---|
| `pinn-naca0012-thesis` | thesis | `ongoing-thesis` (C1) | title (F18), oneLine, system (NACA 0012 airfoil, high-incidence flow), method (PINN solver; LoRA-style parameter-efficient fine-tuning; PyTorch), supervisor | question wording, data, findings, figures, repo, thesis PDF |
| `r455a-evaporation-ml` | manuscript | `under-review` | title (working: "Machine-learning prediction of evaporation heat transfer of low-GWP refrigerant R455A in an industrial plate heat exchanger" — `[ADD EXACT MANUSCRIPT TITLE]`), pipeline (6 stages per §05 Zone 7), method list, system | authors, venue (hidden), dataset size, operating ranges, model list, findings, figures, preprint link |
| `r1336mzze-condensation-ml` | project | `in-progress` | system (condensation of R1336mzz(E) in an industrial PHE) | question, dataset, ML approach, investigating, timeline |

**projects.ts (seed)**

| id | shelf | name | fields from | links |
|---|---|---|---|---|
| `ai-studio` | systems | AI Studio | F10–F15 (cross-link `experienceId: 'poridhi'`) | product `https://ai.poridhi.io` |
| `tensorcode` | systems | TensorCode | F16, F17 | product `https://tensorcode.poridhi.io` |
| `ride-sharing-microservices` | hackathon | `[ADD PROJECT NAME]` (event: Break The Monolith) | F19, result "Champion" | repo `[ADD]` |
| `donation-backend` | hackathon | `[ADD PROJECT NAME]` (event: API Avenger) | F20, result "Rising Team" | repo `[ADD]` |
| `intent-product-search` | hackathon | `[ADD PROJECT NAME]` (event: BS23 AI Engineering Hackathon) | F21 | repo `[ADD]` |
| `soccer-bot` | hardware | Soccer Bot | F24 | photos `[ADD]` |
| `luca` | early-web | Luca | F26: tourist guide site, guest/host/admin dashboards with role-based authorization, TanStack Query, JWT, Stripe | live `https://user-email-password-auth-8dfb6.web.app` `[VERIFY live]`, repo `https://github.com/Anawrulkabir/Luca` |
| `sitemark` | early-web | Sitemark | F26: blog, Node REST API, filters, live comments, Stripe | live `https://aspirant-blog.web.app/` `[VERIFY]`, repos `…/Sitemark-client`, `…/Sitemark-server` |
| `craftpaper` | early-web | Craftpaper | F26: craft-item e-commerce, Firebase Auth, Stripe | live `https://craft-house-ad549.web.app/` `[VERIFY]`, repos `…/Craftpaper-client`, `…/Craftpaper-server` |
| `puku-ai` | personal | Puku AI | `[NEEDS CONFIRMATION: include, and approved one-line description]` | `[ADD]` |


**certifications.ts (seed):** 10 entries `cert-01` … `cert-10`, all fields `pending('ADD CERTIFICATE n: name, issuer, date, image, credential link')`. Production renders only entries whose `image.src` and `name` are set.

**events.ts (seed):**

| id | type | filled | pending |
|---|---|---|---|
| `break-the-monolith-2025` | hackathon | name, year, result Champion, relatedProjectId | organizer, place, photos |
| `api-avenger-cuet-2025` | hackathon | name, organizer CUET, year, result Rising Team | photos |
| `bs23-ai-engineering-hackathon` | hackathon | name, organizer Brain Station 23 | date, result, photos |
| `icpc-preliminaries` | competition | years 2022, 2023 | team, result |
| `cuet-iupc` | competition | 2022–2023 | result |
| `robosoccer-cuss-2022` | competition | organizer CUSS, May–Jun 2022 `[VERIFY]` | result, photos |
| `business-competition` | business-competition | — | everything |
| `betic-event` | research-event | "BETIC-related" | exact name, date, role, place, photos |
| `conference-n` | conference | — | everything (count unknown) |

**skills.ts (seed)** — groups and skills. `verify: true` items render only after confirmation.

| Group (workshop name) | Skills (verified) | Skills needing confirmation |
|---|---|---|
| `programming` (The Terminal) | Python, JavaScript/TypeScript, Go (F33) | C/C++ (F32, CV-old), MATLAB (CV-old) |
| `software` (Software Workshop) | Node.js, Hono.js, Flask, React, Next.js, PostgreSQL, Redis, MongoDB, REST APIs, RabbitMQ (F19), Git | Express (CV-old) |
| `infrastructure` (The Racks) | Linux `[VERIFY — implied, not listed]`, Docker, Kubernetes, AWS (EC2, S3, ECR), Temporal, Terraform, Pulumi, GitHub Actions, Cloudflare Workers/D1/R2/KV, JuiceFS, Headlamp, Kubernetes RBAC | k3s |
| `gpu-ai` (GPU Floor) | HAMi GPU virtualization, NVIDIA GPU partitioning, PyTorch | CUDA (level of hands-on use), Triton, Jupyter, code-server, TensorBoard (all F32 — Brief lists them; confirm hands-on vs. platform-provided) |
| `ml-research` (Research Bench) | Physics-informed neural networks, LoRA-style fine-tuning, gradient boosting, SHAP, cross-condition validation, feature engineering with dimensionless groups | scikit-learn / XGBoost / LightGBM (which library?) |
| `engineering` (Thermal & Fluids Bench) | Heat transfer, refrigeration, plate heat exchangers, low-GWP refrigerants, airfoil aerodynamics, Arduino (F24) | CAD / simulation tools `[ADD e.g. SolidWorks/ANSYS if any]` |

Each skill renders with its **evidence** (e.g. "HAMi → used in AI Studio"). No logos wall, no proficiency levels.

---

## 07. Component Architecture

### 07.1 Directory layout

```
src/
  app/
    layout.tsx                 fonts, metadata, SkipLink, QuickViewBar, <main id="main">
    page.tsx                   Home (server) → HeroIdentity + <WorldSection/> (client, lazy) + Spine + CredibilityStrip + FastPaths
    journey/page.tsx
    experience/page.tsx
    research/page.tsx
    research/[slug]/page.tsx
    projects/page.tsx
    projects/[slug]/page.tsx
    archive/page.tsx
    skills/page.tsx
    about/page.tsx
    cv/page.tsx
    contact/page.tsx
    hire/page.tsx
    academic/page.tsx
    not-found.tsx
    opengraph-image.tsx        pixel-art OG card (static render)
    sitemap.ts, robots.ts
  components/
    chrome/        QuickViewBar, MobileMenu, SkipLink, Footer, Breadcrumbs
    home/          HeroIdentity, Spine, CredibilityStrip, FastPaths
    world/         (client-only; see 07.2)
    panels/        Panel, ChapterCard, ResearchPipeline, AirfoilDemo, EventsMap, CertificateLightbox, ToolDrawer
    content/       ExperienceBlock, RoleBlock, ResearchCard, ResearchDetail, ProjectArtifact, ProjectDetail,
                   CertificateFrame, EventPin, SkillWorkshop, SkillChip, StatusBadge, LinkRow, Field, MediaSlot
    pixel/         PixelSprite, PixelIcon, PixelFrame, PixelButton
    ui/            sheet.tsx (Radix Dialog, restyled), visually-hidden.tsx
  world/
    layout.ts      zone extents + object placements (tile coordinates) — geometry only, no facts
    tilesets/      per-zone tile palettes + tile maps (text grids)
    sprites/       sprite definitions (palette-indexed text grids) — avatar frames, objects
    engine/        camera.ts, input.ts, loop.ts, proximity.ts, bake.ts (tile → canvas)
    state.ts       world store (useReducer + context)
  content/         (see §06)
  lib/             utils.ts (cn), format.ts (dates), content-render.ts
  styles/          globals.css, tokens.css, pixel.css
scripts/
  content-gaps.ts
  optimize-images.ts   (sharp; build-time WebP/AVIF + blur placeholders for /public/media)
```

### 07.2 World components (client)

| Component | Responsibility | Key props / notes |
|---|---|---|
| `WorldSection` | Wrapper loaded with `next/dynamic({ ssr:false })`; reserves height; renders `WorldFallback` until ready | Height from CSS `clamp()`; exposes `aria-label="Interactive journey map. Use the list below or the Journey page for the same content."` |
| `WorldFallback` | Server-rendered static strip: sky + ground bands + 7 zone labels as links to `/journey#zone` | Also the no-JS experience |
| `WorldViewport` | Owns camera, input listeners, rAF loop; `role="region"`, `tabIndex=0` for keyboard walking | Pauses loop when offscreen (IntersectionObserver) or `document.hidden` |
| `ParallaxLayer` | Far silhouettes per zone; `transform` only | Lazy per zone |
| `TerrainCanvas` | One `<canvas>` per zone, baked once from tile maps (`bake.ts`), `aria-hidden` | Offscreen zones' canvases are created when camera is within 1 zone |
| `PixelAvatar` | DOM element with sprite-sheet background; `steps()` animation; outfit by zone | Facing direction, walking/idle state |
| `InteractiveObject` | **`<button>`** absolutely positioned over the object sprite; accessible name = tooltip text; shows focus ring; triggers walk-to + open | Props: `WorldObjectRef`, tile rect |
| `ProximityTooltip` | Pixel speech-bubble above nearest object within 3 tiles | `aria-live="polite"` announces only on keyboard walking, throttled |
| `ZoneSign` | Wooden/metal sign at each zone start with name + period | Plain text in DOM |
| `RouteStrip` | Seven waypoint buttons (`nav` with `aria-label="Journey"`) | Visited state from `sessionStorage` |
| `MapOverlay` | `M` / button: full world as a scaled static image with zone links and object list | Radix Dialog |
| `ControlsHint`, `ControlsPopover` | First-visit hint; `?` popover | — |
| `OverlookPanel` | In-scene destination panel | — |

### 07.3 Panels & content components (shared by world and routes)

| Component | Used in world as | Used on routes as |
|---|---|---|
| `Panel` (Radix Dialog; desktop: right-side panel 440 px, mobile: bottom sheet 88vh) | container for every object card | — |
| `ChapterCard` | Note-type objects | `/journey` section body |
| `ExperienceBlock` / `RoleBlock` | Software & Data Center objects (with `highlight` bullets) | `/experience`, `/hire` |
| `ResearchCard` | lab objects (card view) | `/research` list, `/academic` |
| `ResearchPipeline` | R455A rig | `/research/r455a-evaporation-ml` top section |
| `AirfoilDemo` | wind tunnel | `/research/pinn-naca0012-thesis` top section |
| `ProjectArtifact` (compact) → `ProjectDetail` | shelves, trophies, laptops | `/projects`, `/projects/[slug]` |
| `CertificateFrame` + `CertificateLightbox` | archive frames | `/archive#certificates` |
| `EventsMap` + `EventPin` | map table | `/archive#events` |
| `SkillWorkshop` + `ToolDrawer` + `SkillChip` | toolboxes | `/skills`, `/hire` |
| `StatusBadge` | everywhere research/project status appears | — |
| `MediaSlot` | image or dev placeholder; never a fake photo | — |
| `Field` | renders `Maybe<T>` per §06.1 | — |

**Rule:** one component per content type, reused in both the world and the routes. The world never has its own copy of content markup.

### 07.4 State

```ts
// world/state.ts
type WorldState = {
  avatarX: number;            // in source px
  facing: 1 | -1;
  moving: boolean;
  target: { x: number; objectId?: string } | null;
  zone: ZoneId;
  openObjectId: string | null;
  visited: Set<ZoneId>;
  introPlayed: boolean;
  reducedMotion: boolean;
};
```

- `useReducer` + one React context inside `WorldSection` only. No global store library.
- Per-frame values (camera x, avatar x) live in refs and are written to the DOM via `transform`; React state updates only on zone change, open/close, arrival. (Keeps renders to a handful per interaction.)
- URL sync: `at` and `open` query params updated with `history.replaceState` on zone change / card open; read once on mount.

---

## 08. Visual Design System

### 08.1 Color tokens

Base palette (names are the token names):

| Token | Hex | Role |
|---|---|---|
| `--night` | `#161A17` | Page background (green-tinted charcoal) |
| `--slate` | `#232A25` | Raised surfaces on dark (Quick View bar, footer) |
| `--moss` | `#2F4A34` | Deep green — primary brand surface, world ground shadow |
| `--fern` | `#4F7A4A` | Forest green — grass, primary buttons on light |
| `--loam` | `#6B5238` | Earth — timber, dirt, borders on light panels |
| `--parchment` | `#E7E1D1` | Warm off-white — UI panels, light text on dark |
| `--ink` | `#1E211D` | Text on parchment |
| `--signal` | `#6FB7B9` | Muted cyan — computation only (terminals, LEDs, data, links inside research) |
| `--amber` | `#E0A23C` | Interaction highlight only (hover/focus glow on objects, current waypoint) |
| `--ember` | `#C9663A` | Rare: under-review/in-progress status accents, copper pipes |

Zone key colours (route strip + zone tints): Workshop `--fern`, Dungeon `#7C8A8F` (stone), Garage `#9A7B4F`, Software `#8FA3A8`, Data Center `--signal`, Physics Lab `#A9C4D9`, Thermal Lab `--ember`.

Rules: `--signal` never on large areas; `--amber` never decorative; body text contrast ≥ 7:1 (`--parchment` on `--night` ≈ 13:1; `--ink` on `--parchment` ≈ 13:1). Status badge colours: Under review = `--ember` outline, In progress = `--amber` outline, Published = `--fern` solid, Ongoing thesis = `--signal` outline.

Light mode: not provided. The site is one dark theme (the world reads best at dusk). Content pages use parchment "document panels" on the night background, which gives long-form reading a light surface. `[NEEDS CONFIRMATION]` if a light mode is wanted.

### 08.2 Typography

| Role | Family | Use |
|---|---|---|
| Display / pixel | **Pixelify Sans** (Google Fonts, OFL, variable 400–700) | H1 name, zone names, object tooltips, route strip words, buttons in the world |
| Text | **IBM Plex Sans** (Google Fonts, OFL) 400/500/600 | Everything readable: positioning line, cards, research, experience |
| Code (rare) | IBM Plex Mono 400 | Only for actual code/commands in project details |

Load via `next/font/google` with `display: 'swap'` and subsetting. Drop PP Telegraf (license + third face).

Scale (rem, 16 px base, ratio ~1.25): 0.8125 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 2 / 2.5 / 3.25. Pixel font only at sizes that are multiples of its pixel grid (16, 24, 32, 40, 48, 56) to stay crisp. Body line-height 1.6; max line length 68ch. Sentence case everywhere; the only uppercase is the seven progression words on the route strip (they are labels in a game UI).

### 08.3 Spacing, layout

- 4 px base unit; tokens `1…16` = 4…64 px; section rhythm 96 px desktop / 64 px mobile.
- Content width 1120 px max; reading column 680 px.
- Left-aligned text everywhere except the Overlook panel (centred).

### 08.4 Borders, corners, shadows (the pixel treatment for UI)

- **Pixel frame:** 2 px solid border + stepped corners made with `clip-path: polygon(...)` cutting a 2×2 px notch at each corner (`.pixel-frame` utility). No `border-radius` on framed elements.
- **Shadow:** hard offset only — `box-shadow: 4px 4px 0 0 rgb(0 0 0 / .45)`. No blur shadows anywhere.
- **Panels:** parchment background, `--loam` 2 px frame, ink text, 24 px padding; header strip in `--moss` with pixel-font title.
- **Buttons:** primary = `--fern` bg, parchment text, pixel frame, hard shadow; pressed = shadow 0 + translate(2px,2px). Secondary = transparent, parchment 2 px frame.
- **Focus ring:** 3 px `--amber` outline, 2 px offset, on everything focusable; never removed.

### 08.5 Pixel-art rules

- Source resolution 16-px tiles; objects 16–48 px; avatar 18×24.
- Max 5 colours per sprite + outline; outlines are a darker shade of the fill (not pure black).
- Light direction: top-left, consistent across all zones.
- `image-rendering: pixelated` on all raster art; SVG sprites use `shape-rendering: crispEdges`.
- Integer scaling only (§05.1). Never CSS-scale pixel art by non-integer factors.
- No copied assets, no Minecraft-derived blocks, textures, fonts, or UI; no third-party logos inside the world (tech names appear as text on panels).
- Legibility check: every object must be recognisable at 2× scale on a 390 px phone.

### 08.6 Animation principles

1. **Motion answers the visitor.** Idle ambient motion is limited to: LED blinks in the Data Center (1–2 Hz, 3% of pixels), avatar idle breathing (2 frames, 1 s), soccer-bot wheel tick. Nothing else moves on its own.
2. **One orchestrated moment:** the intro rewind (I-01).
3. **Durations:** micro 120 ms, panel 180–220 ms, camera travel 300 ms per zone (max 900 ms), walk speed 96 source px/s.
4. **Easing:** `cubic-bezier(.2,.8,.2,1)` for UI; linear stepped for sprites.
5. **Properties:** `transform` and `opacity` only. No layout-animated properties, no filters on large areas.
6. **Reduced motion** (`prefers-reduced-motion: reduce` or in-page toggle): no intro, no parallax, avatar teleports, camera jumps, LEDs static, panels fade only (80 ms).
7. **Sound:** none by default. Optional footstep/UI clicks behind an off-by-default toggle — `[NEEDS CONFIRMATION — recommended: skip]`.

### 08.7 Iconography

- UI icons: `lucide-react` (menu, close, download, external link, copy, mail), 20 px, 2 px stroke — the one icon library.
- In-world and badge icons: custom 16×16 pixel icons in `components/pixel/PixelIcon` (CV, mail, GitHub-like "repo" glyph, paper, certificate, pin). No brand logos in pixel form.
- Brand marks for LinkedIn/GitHub in the Contact room: text labels, not logos.

### 08.8 Responsive behaviour

| Breakpoint | Layout |
|---|---|
| ≥1280 (`xl`) | Full layout; world viewport 52vh; panel docks right |
| 1024–1279 (`lg`) | Same; hero text slightly smaller; panel 400 px |
| 768–1023 (`md`, tablet) | World viewport full-width, 45vh; panel becomes bottom sheet; walking via tap on ground (avatar walks to tap x) + route strip; keyboard still works |
| <768 (mobile) | World replaced by Scene Deck (§12) |

---

## 09. Interaction Specification

Format: **Trigger → Animation → Content → Exit**. Every interaction states what it communicates.

| ID | Interaction | Trigger | Animation | Content | Exit | Communicates |
|---|---|---|---|---|---|---|
| I-01 | Intro rewind (signature moment) | First visit, world ready, no reduced motion, no user input yet | Camera starts at the Overlook, pans right→left across all zones in 2.2 s (ease-in-out), terrain visibly changes; route strip waypoints light in reverse; lands on the Workshop; avatar does one idle blink | None besides the scene | Ends automatically; any key/click/scroll/touch skips instantly to the end state | "This is a whole journey, and it ends somewhere deliberate" |
| I-02 | Walk | ←/→ or A/D with world focused; tap on ground (tablet) | Avatar 4-frame walk cycle; camera follows with dead-zone; outfit swaps at zone boundary with a 2-frame shimmer | Zone sign enters view; route strip current waypoint updates | Key up / arrival | Progression through the career |
| I-03 | Proximity tooltip | Avatar within 3 tiles of an object, or pointer hover, or keyboard focus on the object button | Bubble pops (scale 0.9→1, 120 ms); object gets 1 px `--amber` outline glow | Tooltip text (from content) + hint "Enter to open" | Moving away / blur / hover end | What this object is, before committing |
| I-04 | Open object card | Click / Enter / Space on object, or `E` when near | If far: avatar walks to object (max 900 ms; else teleports), then panel slides in (220 ms) | The object's card (Experience/Research/Project/Note) with "Open full page" and "Next stop" | `Esc`, close button, click scrim, or "Next stop" | Short story first, detail on demand |
| I-05 | Route strip jump | Click/Enter on waypoint | Camera travels (≤900 ms) or cuts (reduced motion); avatar placed at zone entrance | Zone sign + first object tooltip | — | Non-gamers can navigate by chapter |
| I-06 | Map overlay | `M` key or "Map" button | Dialog fades in (180 ms) showing the full world render with zones and a text list of all objects | Clickable zone and object list | `Esc` / close; selecting an item closes and jumps | Whole structure at a glance |
| I-07 | Enter a building / room | Walk into Archive or Field Office door, or click door | Screen iris-closes to black (pixel stepped, 200 ms) and opens on the room interior | Room scene (Archive / Field Office) | "Back outside" button or walking left through the door | Separate places for records and contact |
| I-08 | Data Center pipeline pulse | Opening any of the six pipeline machines | A 1-tile light packet travels along the cable from GPU toward Cloud, stops at the opened machine (400 ms) | That machine's card | Card close | Where this piece sits in the AI infrastructure stack |
| I-09 | Research pipeline (R455A) | Open `phe-rig-r455a` | Panel opens in wide mode; six stage chips in a row; the active stage chip fills; stepping with ←/→ or clicking chips; the rig sprite behind the panel highlights the matching part (pipes → sensors → desk plots) | Stage text (§05 Zone 7) + status badge "Manuscript under review" + "Read the full summary" | `Esc` / close | Data → Physics → Features → ML → Validation → Insight, understandable to non-specialists |
| I-10 | Airfoil demo | Open wind tunnel; drag slider or ←/→ on slider | Airfoil rotates in 2° steps; streamline pixels re-route (precomputed 8 frames, no simulation); past the marked threshold the label changes and a "LoRA patch" chip snaps onto the model icon | Thesis summary beside the demo; "Illustration, not results" caption | Close panel | The thesis idea: adapting a trained physics-informed solver to unseen conditions |
| I-11 | Certificate lightbox | Click/Enter on a filled frame | Frame lifts (translate -2 px + stronger shadow), lightbox fades in with the full image | Image, name, issuer, date, credential link | `Esc`/close/←→ to next | Real, checkable credentials |
| I-12 | Events map | Open map table / `/archive#events` | Pins drop in sequence (40 ms stagger, once); filter chips by type | Pin card: name, date, role, result (only if supplied), photo | Close / select another pin | Where he has been and taken part |
| I-13 | Tool drawer | Open a toolbox object | Drawer slides open (pixel-stepped, 3 frames) revealing tool items | Skill chips with evidence ("used in AI Studio") | Close | Skills tied to real work, no levels |
| I-14 | Copy email | Click "Copy" beside email (Field Office, /contact, footer) | Button label → "Copied" for 1.5 s | Email on clipboard | Auto revert | Frictionless contact |
| I-15 | Overlook arrival | Avatar reaches overlook zone or waypoint | Sky shifts to first light (CSS var tween 600 ms); Overlook panel fades in | Destination heading, line, sentence, three buttons | Walking left | The conclusion: where he is going |
| I-16 | Quick View navigation | Any Quick View link | Standard page navigation; no page transition animation | Target route | — | Usability over spectacle |
| I-17 | Reduced-motion toggle | Button in Controls popover; also honours OS setting | None | Setting stored in `localStorage` (try/catch) | Toggle again | Respect for visitor preferences |

Removed from scope on purpose: custom cursor, magnetic buttons, marquee text, scroll-jacking, particle fields, 3D objects, page transitions.

---

## 10. Recruiter Mode

**Goal:** Experience → Skills → Projects → CV → Contact in under 60 seconds, zero game interaction.

**Entry points:** hero link "Hiring? Read the 1-minute brief" · Quick View "Experience" · direct URL `/hire` (put this URL in job applications).

**`/hire` page structure (single scroll, document panels, no world):**

1. **Header block** — name, positioning line, location, and three buttons: `View CV`, `Download CV`, `Email me` (mailto) + `Copy email`.
2. **Snapshot** (4 lines max): *Software engineer at Poridhi.io since May 2025, working on a multi-tenant GPU platform (bare-metal Kubernetes + AWS): GPU virtualization, session orchestration, backend services. Final-year Mechanical Engineering student at CUET* (C1).
3. **Experience** — `ExperienceBlock` for Poridhi, full bullets (F9–F17), product links.
4. **Infrastructure highlights** — three evidence tiles (not metrics cards): *~70% faster GPU session launch (10–15 → 3–5 min)* · *RTX 4090 split into 6 × 8 GB isolated slices with HAMi* · *Edge backend for an in-browser PyTorch/CUDA IDE*. Each links to its source bullet.
5. **Skills** — the six workshops as compact rows; each skill with a one-word evidence link.
6. **Projects** — Systems shelf + Hackathon shelf, 5 `ProjectArtifact` compact cards (name, one-line, role, tech, status, links).
7. **Also** — one line: *Research in ML for engineering systems* → `/research`; *Competitive programming background* → `/journey#dungeon`.
8. **Contact** — email, LinkedIn, GitHub, CV again.

Target: all of sections 1–3 visible within two scrolls on a laptop. Printable (`@media print` stylesheet hides nav, keeps links as text).

**Recruiter shortcuts on the homepage:** the Quick View bar's `Experience` and `View CV` are always one click. The Data Center zone is the second-most prominent world area and its route-strip waypoint label is "INFRASTRUCTURE".

---

## 11. Researcher / Professor Mode

**Goal:** Research → Thesis → Papers → Engineering background → CV → Contact in under 60 seconds.

**Entry points:** hero link "Academic? See research" · Quick View "Research" · `/academic` (put this URL in emails to prospective supervisors).

**`/academic` page structure:**

1. **Header block** — name; line: *Mechanical engineering researcher working on machine learning for engineering systems* `[NEEDS CONFIRMATION wording]`; buttons `View CV`, `Academic CV` (only if supplied), `Email`.
2. **Research interests** — the SOP §10 list condensed to six plain statements.
3. **Thesis** — `ResearchCard` for `pinn-naca0012-thesis` (title, supervisor, status, 3-sentence summary, link).
4. **Manuscripts & ongoing work** — R455A (**Manuscript under review**), R1336mzz(E) (**Research in progress**). Status badges are the first thing on each card.
5. **Publications** — rendered only when `research.ts` has an item with status `published` or `accepted`.
6. **Engineering background** — CUET B.Sc. ME (dates per C1), thermal/fluids skills, hands-on robotics (one line).
7. **Computing background** (why it matters for research) — two lines: professional GPU-infrastructure experience (link `/experience`), competitive programming (one line).
8. **Conferences & events** — list from `events.ts` filtered to conference / research-event (hidden if empty).
9. **Contact** — email, Google Scholar `[ADD IF EXISTS]`, ORCID `[ADD IF EXISTS]`, LinkedIn, CV.

Each `/research/[slug]` page follows the fixed outline (§03.5) and ends with "Discuss this work → email".

---

## 12. Mobile Specification (<768 px)

The world is **not** shrunk. It becomes a **Scene Deck**: the same world, cut into eight illustrated scenes the visitor swipes through.

### 12.1 Home on mobile

```
┌───────────────────────────┐
│ Fahad Kabir    [CV] [Menu]│  sticky 52px
├───────────────────────────┤
│ Md Anawrul Kabir Fahad    │  pixel H1 32px
│ Mechanical Engineering ×  │
│ AI × Software Infra…      │
│ I build systems at the …  │
│ [Explore ▸]   [View CV]   │
│ Hiring? · Academic?       │
├───────────────────────────┤
│ ┌───────────────────────┐ │
│ │  SCENE 1: WORKSHOP    │ │  16:11 pixel diorama, 2× scale
│ │   (avatar + 2–4 glow  │ │  tap targets ≥ 44px
│ │    tap targets)       │ │
│ └───────────────────────┘ │
│ ● ○ ○ ○ ○ ○ ○ ○   1/8     │  deck pager (buttons)
│ The Workshop · 2022       │
│ Robotics and hands-on…    │  one-line summary
├───────────────────────────┤
│ Spine · Credibility · …   │
└───────────────────────────┘
```

### 12.2 Scene Deck mechanics

- Horizontal CSS `scroll-snap-type: x mandatory` container; each scene `scroll-snap-align: center`, width 100%. Native swipe — no gesture library.
- Each scene is a pre-composed static image (baked from the same tile maps at build time or runtime once) sized 360×248 source → 2× on screen; objects are DOM buttons positioned in percentages.
- The avatar stands in each scene wearing that zone's outfit (the progression is still visible as you swipe).
- Pager dots are real buttons (`aria-label="Scene 3 of 8: The Garage"`); also "Previous / Next" buttons for users who don't swipe.
- Tapping an object opens the same `Panel` as a **bottom sheet** (88vh, drag handle, `Esc`/close/scrim/swipe-down to close).
- Data Center scene: the six-machine pipeline doesn't fit one frame — the scene shows GPU → Container → Orchestration; a "Continue pipeline ▸" button pans to a second frame (Session → Workspace → Cloud). Two frames, same scene index.
- R455A research pipeline in the sheet becomes a vertical stepper (six stages stacked, each expandable).
- Airfoil demo: slider full-width in the sheet; streamline frames at 2×.
- Archive and Field Office are scenes 9 and 10 reached via buttons on the Overlook scene, not swipe (keeps the main deck 8 long).
- No intro rewind on mobile. Instead, the deck starts at scene 1 and the pager shows all 8 labels on first view.

### 12.3 Other mobile rules

- Quick View collapses to `CV` + `Menu`; Menu sheet lists all routes plus Email/LinkedIn/GitHub.
- A sticky bottom action bar appears on `/hire`, `/academic`, `/research/*`: `View CV · Email`.
- Minimum tap target 44×44 px; body text 16 px minimum; no hover-dependent content.
- Images served at 1× and 2× widths via `next/image` `sizes`.
- Tablet (768–1023) keeps the walkable world with tap-to-walk; below 768 always the Scene Deck (decided by CSS container width + `matchMedia`, not user agent).

---

## 13. Asset Strategy

### 13.1 Existing assets

| Asset | Plan |
|---|---|
| `fahad.jpg` | Hold for C5. If approved: `/public/media/portrait/fahad.jpg` → AVIF/WebP via `next/image`; used on `/about` and `/contact` only, never in the world |
| Luca/Sitemark/Craftpaper screenshots | Move to `/public/media/projects/{luca,sitemark,craftpaper}/`, rename `01.png…`, optimise (target <200 KB each at 1600 w) |
| Current CV PDF | Rename to `/public/cv/Md-Anawrul-Kabir-Fahad-CV.pdf` |
| Old CV PDF | Remove from `public/` |
| PP Telegraf fonts | Remove |

### 13.2 Assets to create (in code — no external artist required)

All pixel art is authored as **palette-indexed text grids** in TypeScript (`world/sprites/*.ts`, `world/tilesets/*.ts`) and rendered to canvas/SVG. This keeps art original, versionable, tiny, and editable by Claude Code.

| Group | Items |
|---|---|
| Tilesets (16×16) | grass, dirt, timber floor, stone slab, stone wall, concrete, wood floor, perforated steel, lab tile, rooftop; 4 blend tiles per boundary |
| Far silhouettes | treeline + hills (Workshop), dungeon arches, garage roofline, office windows, rack hall depth, wind-tunnel hall, pipe corridor, city/horizon at overlook |
| Workshop props | soccer bot (3 frames), workbench, pegboard, robo-soccer pitch, signpost |
| Dungeon props | CRT terminal (2-frame glow), maze floor grid, 3 doors, torches replaced by cable lamps |
| Garage props | roll-up door, trophy, 2 laptops, easel/pitch board, sticky wall, folding tables |
| Software props | dual-monitor desk, whiteboard, server-closet door, toolbox |
| Data Center | rack (LED map), GPU card, crate, control console, conveyor, desk pod, loading bay, reactor cylinder, ops desk, cable run with packet sprite |
| Labs | wind tunnel + airfoil (8 rotation frames) + streamline frames, chalkboard, workstation, PHE rig, refrigerant cylinder (unbranded), data logger, interests board, copper pipe runs |
| Overlook & rooms | rooftop edge, horizon, 2 doors, frame (empty/filled states), map table, mailbox, pinned CV, link board |
| Avatar | 18×24; idle 2 frames, walk 4 frames, × 4 outfits, facing via `scaleX(-1)` |
| UI pixel icons | CV, mail, repo, paper, certificate, pin, link, copy, map, controls |
| OG image | 1200×630 pixel composition of the route across all zones + name |
| Favicon | 32×32 pixel mark (e.g. the avatar's head or a gear-chip glyph) `[NEEDS CONFIRMATION]` |

### 13.3 Placeholder policy

- `MediaSlot` renders, in development only, a dashed parchment frame with a pixel camera glyph and the pending label. In production a pending image renders **nothing** (cards collapse gracefully).
- Never use stock photos, AI-generated photos of the author, fake screenshots, or fake certificate art.
- Pixel illustrations are allowed as *illustrations* (e.g. the soccer bot sprite) but must never be captioned as a photo.

### 13.4 User-provided future assets (drop-in paths)

| Asset | Path | Formats | Notes |
|---|---|---|---|
| Soccer Bot / robotics competition photos | `/public/media/journey/workshop/` | jpg/png → auto WebP/AVIF | 1–3 |
| CP / team contest photos | `/public/media/journey/dungeon/` | | optional |
| Hackathon / business competition photos | `/public/media/events/<event-id>/` | | 1–3 per event |
| AI Studio, TensorCode screenshots | `/public/media/projects/ai-studio/`, `.../tensorcode/` | png | confirm permission to publish (company product) `[NEEDS CONFIRMATION]` |
| Research figures | `/public/media/research/<research-id>/` | png/svg | R455A figures only if allowed before publication `[NEEDS CONFIRMATION]` |
| Certificates | `/public/media/certificates/cert-XX.jpg` | jpg/png | redact personal IDs/serials if any |
| Conference / BETIC photos | `/public/media/events/<event-id>/` | | |
| Portrait | `/public/media/portrait/` | | |

`npm run optimize-images` (sharp) generates `*.avif`, `*.webp`, and blur data URLs into `src/content/.generated/media.json`, which `MediaSlot` reads for width/height (no CLS).

---

## 14. Content Gaps

Checklist for the author. Items marked **(blocker)** must be resolved before launch; others hide gracefully.

### Conflicts to resolve

- [ ] **(blocker)** C1 — Have you graduated? Final degree date/status. `[NEEDS CONFIRMATION]`
- [ ] **(blocker)** C2 — OK to keep narrative order (hackathons before software) while showing true 2025 dates? `[NEEDS CONFIRMATION]`
- [ ] C3 — Are the R455A and R1336mzz(E) projects with your thesis supervisor or a different lab/group? `[NEEDS CONFIRMATION]`
- [ ] **(blocker)** C4 — Destination line: only "AI × Mechanical Engineering × Computational Research", or also mention AI systems / infrastructure research? `[NEEDS CONFIRMATION]`
- [ ] C5 — Reuse `fahad.jpg` or wait for a new portrait? `[NEEDS CONFIRMATION]`
- [ ] **(blocker)** Approve the About copy (§06.4) and the `/academic` header line (§11).

### Profile & links

- [ ] [ADD GOOGLE SCHOLAR LINK — if exists]
- [ ] [ADD ORCID — if exists]
- [ ] [VERIFY CODEFORCES / CODECHEF HANDLE `fahadkabir123` — still want them shown?]
- [ ] Keep Facebook link? (Recommended: remove) `[NEEDS CONFIRMATION]`
- [ ] Phone number on site? (Recommended: no; CV only) `[NEEDS CONFIRMATION]`
- [ ] [ADD ACADEMIC CV PDF — optional]
- [ ] [ADD CGPA / coursework — optional]

### Robotics

- [ ] [VERIFY Robosoccer Competition, CUSS, May–Jun 2022]
- [ ] [ADD SOCCER BOT PHOTOS]
- [ ] [ADD COMPETITION RESULT — optional]
- [ ] [ADD COMPONENTS / your role in the bot build — optional]
- [ ] [ADD OTHER ROBOTICS COMPETITIONS — SOP says "competitions", plural]

### Competitive programming

- [ ] [VERIFY CUET Computer Club, Apr 2022 – Dec 2023]
- [ ] [ADD EXACT CONTEST NAMES / TEAM NAMES / RESULTS — optional]
- [ ] Approve framing sentence for the maze object (§05 Zone 2)

### Hackathons & business competition

- [ ] [ADD PROJECT NAMES for the three hackathon builds]
- [ ] [ADD REPO / DEMO LINKS for hackathon builds]
- [ ] [ADD ORGANIZER & DATE for Break The Monolith]
- [ ] [ADD DATE / RESULT for Brain Station 23 AI Engineering Hackathon]
- [ ] [ADD BUSINESS COMPETITION: name, date, team, idea, result]
- [ ] [ADD any other hackathons — SOP says "multiple"]
- [ ] [ADD HACKATHON PHOTOS]

### Experience

- [ ] Confirm permission to publish AI Studio / TensorCode screenshots `[NEEDS CONFIRMATION]`
- [ ] [ADD AI STUDIO SCREENSHOTS] [ADD TENSORCODE SCREENSHOTS]
- [ ] Which cluster used **k3s**? `[NEEDS CONFIRMATION]`
- [ ] Hands-on level with **CUDA, Triton, Jupyter, code-server, TensorBoard** (built with them vs. provided them on the platform)? `[NEEDS CONFIRMATION]`
- [ ] Your role in TensorCode's CUDA/Triton problem content, if any `[NEEDS CONFIRMATION]`

### Research

- [ ] [ADD EXACT R455A MANUSCRIPT TITLE]
- [ ] [ADD R455A CO-AUTHORS]
- [ ] Show journal name while under review? (Recommended: no) `[NEEDS CONFIRMATION]`
- [ ] [ADD R455A DATASET SIZE, OPERATING RANGES, MODEL LIST]
- [ ] [ADD R455A FINDINGS you are comfortable publishing — or leave hidden until accepted]
- [ ] [ADD R455A FIGURES — only if allowed pre-publication]
- [ ] [ADD PAPER DOI — once published]
- [ ] [ADD R1336mzz(E): research question, dataset, ML approach, what you're investigating]
- [ ] [ADD THESIS: final title if changed, research question wording, figures, repo, PDF, defense date]
- [ ] [ADD THESIS AoA training range — optional, for the airfoil demo]
- [ ] Approve the one-line explanation of physics-informed ML (§05 Zone 6)
- [ ] Which gradient boosting library (scikit-learn / XGBoost / LightGBM)? `[NEEDS CONFIRMATION]`

### Certificates

- [ ] [ADD CERTIFICATE IMAGES] (8–10)
- [ ] [ADD for each: name, issuer, date, credential link]

### Conferences / events

- [ ] [ADD BETIC EVENT: exact name, date, place, your role, photos]
- [ ] [ADD OTHER CONFERENCES/EVENTS: name, date, place, role, presentation title if any]

### Projects

- [ ] [VERIFY live links for Luca, Sitemark, Craftpaper — hide dead ones]
- [ ] [ADD dates for early web projects]
- [ ] Include Puku AI? If yes: [ADD one-line description, status, link] `[NEEDS CONFIRMATION]`
- [ ] [ADD any other projects to include]

### Skills

- [ ] Confirm: C/C++, MATLAB, Express, Linux, k3s, CUDA, Triton, Jupyter, code-server, TensorBoard `[NEEDS CONFIRMATION]`
- [ ] [ADD CAD / simulation tools, if any]

### Design

- [ ] Avatar traits (hair, glasses, etc.) `[NEEDS CONFIRMATION]`
- [ ] Progression word for Physics Lab: "MODELING"? `[NEEDS CONFIRMATION]`
- [ ] Light mode wanted? Sound effects wanted? `[NEEDS CONFIRMATION]`
- [ ] PP Telegraf license — moot if dropped as proposed

---

## 15. Technical Architecture

### 15.1 Framework

- **Keep Next.js App Router** (existing). Upgrade to latest `14.2.x` patch. React 18. Deploy target unchanged (Vercel `[NEEDS CONFIRMATION of current host for fahadkabir.com]`).
- **Migrate to TypeScript** in Phase 1: add `tsconfig.json` (`strict: true`, `allowJs: true` during transition, `paths: { "@/*": ["./src/*"] }`), delete `jsconfig.json`, convert touched files to `.tsx`. By Phase 11 no `.jsx` remains.
- **Static output:** every route is statically generated. No server runtime needed. `export const dynamic = 'error'` on content routes to catch accidental dynamic usage.
- **Tailwind 3.4** kept; tokens in `styles/tokens.css` as CSS variables, mapped in `tailwind.config.ts`. Remove shadcn slate variables.

### 15.2 Component architecture

- Server Components by default for all content pages and home sections.
- Client islands only: `WorldSection` (dynamic, `ssr:false`), `SceneDeck`, `Panel`, `MobileMenu`, `AirfoilDemo`, `ResearchPipeline` (interactive part), `EventsMap`, `CertificateLightbox`, copy-email button.
- `WorldSection` and `SceneDeck` are mutually exclusive by viewport; both are code-split; the non-matching one is never downloaded (render decision in a tiny client component using `matchMedia`, with CSS hiding the server fallback).

### 15.3 State management

- World: `useReducer` + context scoped to the world island; hot values in refs (§07.4).
- URL: `?at=&open=` for shareable state.
- Persistence: `sessionStorage` (visited zones, intro played), `localStorage` (reduced-motion override). Both wrapped in try/catch; absence is normal.
- No Redux/Zustand.

### 15.4 Animation approach

- **World:** single `requestAnimationFrame` loop in `engine/loop.ts`; updates avatar and camera via `style.transform`; sprite frames via CSS `steps()` on `background-position`. Loop stops when idle (no input, no movement) — zero CPU at rest except LED blink (CSS keyframes on a tiny sprite layer).
- **UI:** Framer Motion (existing dep) only for Panel/sheet enter-exit and the route-strip marker. Use `LazyMotion` + `domAnimation` to keep it ~15 KB.
- **No GSAP.**

### 15.5 Canvas / WebGL

- **No WebGL.** Remove three/r3f/drei.
- **Canvas 2D** only for baking terrain tiles into one bitmap per zone (`bake.ts`): draw tile grids once → keep the canvas element (or `createImageBitmap`) → never redraw unless resized. Canvases are `aria-hidden`.
- **DOM** for everything interactive (objects are `<button>`s), so accessibility and focus work natively.
- **SVG** for UI pixel icons and small static sprites.

### 15.6 Data architecture

- `src/content/*.ts` typed data (§06). Derived indexes in `content/index.ts`.
- `generateStaticParams` for `/research/[slug]` and `/projects/[slug]` from the content arrays.
- `scripts/content-gaps.ts` prints pending labels; CI step fails the production build if a **blocker** label (list in the script) is still pending. Non-blocker pendings only warn.
- JSON-LD `Person` schema generated from `profile.ts` (name, url, sameAs = LinkedIn/GitHub/Scholar, alumniOf CUET, worksFor Poridhi.io).

### 15.7 Image handling

- All photos/screenshots through `next/image` with explicit `sizes`; `images.formats = ['image/avif','image/webp']`; remove wildcard `remotePatterns` (no remote images needed).
- Build script produces dimensions + blur placeholders.
- Pixel art: rendered at integer scale, never through `next/image` optimisation (would blur); served as PNG ≤ 20 KB per sheet or generated at runtime.
- Certificates: max 1600 px long edge; lightbox loads full image only on open.

### 15.8 Performance strategy & budgets

| Metric | Budget (home, mid-range Android on 4G, Lighthouse mobile) |
|---|---|
| LCP | ≤ 2.0 s (LCP element = hero H1 text) |
| CLS | ≤ 0.02 |
| INP | ≤ 150 ms |
| First-load JS (home) | ≤ 130 KB gzip excluding world island; world island ≤ 45 KB gzip |
| World assets initial | ≤ 150 KB (zones 1–2 + avatar); others lazy within one zone of camera |
| Fonts | 2 families, subset latin, ≤ 90 KB total |
| Total home transfer (first view) | ≤ 500 KB |
| Lighthouse | Performance ≥ 90 mobile / ≥ 95 desktop; Accessibility 100; Best Practices ≥ 95; SEO 100 |

Techniques: server-render text; defer world island until after hydration idle (`requestIdleCallback` fallback to `setTimeout`); lazy-bake zones; pause loop offscreen; `content-visibility: auto` on long content sections; preload only the two font files; no third-party scripts (analytics optional: Vercel Analytics or none `[NEEDS CONFIRMATION]`).

### 15.9 Accessibility architecture

- Semantic landmarks: `header` (Quick View), `nav`, `main`, `footer`; one `h1` per page; ordered headings.
- Skip link: "Skip to content" and, on home, "Skip the interactive map".
- World: region with label + instructions; every object is a real button reachable by Tab in path order; walking keys only active when the world region has focus (never hijack page arrow-key scrolling otherwise).
- Every world card's content also exists on a plain route (`/journey` mirrors the whole world in order).
- Panels: Radix Dialog → focus trap, `Esc`, return focus to the invoking object.
- `prefers-reduced-motion` + manual toggle. `prefers-contrast: more` increases panel borders to 3 px and disables parallax.
- Alt text required by type (`ImageAsset.alt` is non-optional). Decorative art `alt=""`/`aria-hidden`.
- Text selectable everywhere (remove `user-select: none`).
- Testing: axe (via `@axe-core/playwright`) on all routes; manual keyboard pass; VoiceOver + NVDA smoke test on home and `/research/r455a-evaporation-ml`.

---

## 16. Implementation Roadmap

Each phase ends with a commit/PR. "Check" = must pass before moving on.

### Phase 0 — Cleanup (half a day)
- Delete `/animate`, `/review`, `index.ts`, `utils/test.md`, and all files in §01.4. Uninstall listed deps.
- Remove global `user-select: none`, `AnimatedCursor`, nested-anchor `TextAnimation`.
- Rename CV to `/public/cv/Md-Anawrul-Kabir-Fahad-CV.pdf`; remove old CV.
- **Check:** `npm run build` passes; no profanity/template copy remains (`grep -ri "paycheck\|alwinw" src` returns nothing).

### Phase 1 — Foundation
- Upgrade Next to latest 14.2.x; add TypeScript config; convert `layout`, `page`, `lib/utils`.
- Tokens (`tokens.css`), `tailwind.config.ts`, fonts (Pixelify Sans, IBM Plex Sans/Mono), `pixel.css` utilities (`.pixel-frame`, hard shadow, focus ring).
- `src/content/` with types, `pending`, and seeded verified content (§06.4). `scripts/content-gaps.ts` + `npm run gaps`.
- Chrome: `SkipLink`, `QuickViewBar`, `MobileMenu`, `Footer`, `Breadcrumbs`. Metadata, JSON-LD, sitemap, robots, redirects.
- `/cv` page (embedded PDF via `<object>` with fallback link, View + Download buttons) and `/contact`.
- **Deliverables:** new shell on all routes; CV and contact reachable in one click from every page.
- **Check:** Lighthouse a11y 100 on `/cv`, `/contact`; `npm run gaps` lists expected pendings.

### Phase 2 — Hero + world engine (desktop)
- `HeroIdentity`, `Spine`, `CredibilityStrip`, `FastPaths` (server).
- World engine: `layout.ts`, `camera`, `input`, `loop`, `bake`, `PixelAvatar` (one outfit), `TerrainCanvas`, `InteractiveObject`, `ProximityTooltip`, `RouteStrip`, `WorldFallback`.
- Zone 1 tileset + props complete; zones 2–7 as flat colour-block placeholders with correct widths and signs.
- `Panel` with `ChapterCard`.
- **Deliverables:** walkable world, Soccer Bot card opens with verified content.
- **Check:** keyboard-only user can open the Soccer Bot card; LCP still text; world island ≤ 45 KB gzip.

### Phase 3 — Journey zones 1–3 + `/journey`
- Full art + objects for Workshop, Dungeon (incl. maze BFS highlight), Garage.
- Boundary blend tiles; avatar outfits 1–2; time-of-day sky gradient.
- `/journey` text-first page generated from `journey.ts` + linked entities.
- **Check:** every object in zones 1–3 exists on `/journey`; no unverified facts render in production build.

### Phase 4 — Experience (zones 4–5)
- Software Workshop + GPU Data Center art; six-machine pipeline + packet pulse (I-08); TensorCode reactor; ops desk; tool drawers (I-13).
- `ExperienceBlock`, `RoleBlock`, `/experience`, `/hire`.
- **Check:** recruiter path test (§17) passes; bullets on `/experience` match CV-2026 wording.

### Phase 5 — Research (zones 6–7 + overlook)
- Physics Lab with `AirfoilDemo` (I-10); Thermal Lab with `ResearchPipeline` (I-09) and R1336mzz(E) card; Overlook (I-15).
- `ResearchCard`, `ResearchDetail`, `StatusBadge`, `/research`, `/research/[slug]`, `/academic`.
- **Check:** grep production HTML for "Published" next to R455A → none; status text exactly "Manuscript under review" and "Research in progress"; professor path test passes.

### Phase 6 — Projects & skills
- `ProjectArtifact`, `ProjectDetail`, shelves; `/projects`, `/projects/[slug]` (slugs lowercase, redirects from old names).
- `SkillWorkshop`, `/skills` with evidence links; no numeric levels anywhere (`grep -r "level" src/content` → none).
- **Check:** each skill links to ≥1 evidence item or is `verify` hidden.

### Phase 7 — Archive, events, rooms, assets
- Archive room + `/archive`: `CertificateFrame`, `CertificateLightbox` (I-11), `EventsMap` (I-12) (map = stylised pixel map of Bangladesh-scale region + "Elsewhere" tray; no external map tiles).
- Field Office room; door transition (I-07); intro rewind (I-01); `MapOverlay` (I-06); OG image; favicon.
- `scripts/optimize-images.ts`; migrate early-web screenshots; `MediaSlot` everywhere.
- **Check:** adding a certificate = adding one object + one image file, no component edits (verify by doing it with a test image, then removing it).

### Phase 8 — Responsive / Scene Deck
- `SceneDeck` for <768 px (§12), bottom-sheet panels, Data Center two-frame scene, vertical research stepper, tap-to-walk on tablet.
- **Check:** tested at 360, 390, 414, 768, 1024, 1280, 1440, 1920 widths; no horizontal page scroll; all objects reachable on touch.

### Phase 9 — Accessibility
- axe on every route; keyboard walkthrough of full world; screen reader pass; reduced-motion and high-contrast behaviour; focus return from panels; `aria-live` throttling.
- **Check:** axe 0 violations; Lighthouse a11y 100 on all routes.

### Phase 10 — Performance
- Bundle analysis (`@next/bundle-analyzer`), lazy-bake verification, loop idle stop, font subsetting, image sizes.
- **Check:** budgets in §15.8 met on home, `/research/r455a-evaporation-ml`, `/projects`.

### Phase 11 — Final polish & content pass
- Remove all `.jsx`; `allowJs: false`.
- Copy review against §27 of the SOP (no "passionate", "results-driven", etc.).
- Resolve blocker content gaps with the author; run `npm run gaps` → zero blockers.
- 15-second tests (§17) with at least 3 people (ideally one engineer, one non-technical).
- Update `/docs/PORTFOLIO_REDESIGN.md` §14 with remaining gaps.

---

## 17. Definition of Done

The redesign is complete when **all** of the following are true:

### Content accuracy
- [ ] Every rendered fact traces to the Verified Facts Ledger (§00.3) or to a later author-confirmed update.
- [ ] `npm run gaps` reports zero **blocker** items; production build contains no visible placeholder text (`grep -r "ADD \|NEEDS CONFIRMATION\|VERIFY" .next/server/app` → none).
- [ ] R455A appears only as "Manuscript under review"; R1336mzz(E) only as "Research in progress"; no research item says "Published" unless a DOI exists in content.
- [ ] No numeric skill levels, fake stats, invented ranks, or invented dates anywhere.

### The 15-second tests (SOP §34 / Brief §40)
- [ ] 5 s: a first-time viewer can state the name and the four-part profile (ME, software, AI infra, research).
- [ ] 10 s: a professor reaches the R455A/thesis summary from `/` in ≤ 2 clicks.
- [ ] 10 s: a recruiter reaches Poridhi experience from `/` in 1 click.
- [ ] CV opens from any page in 1 click; downloads in ≤ 2.
- [ ] Contact email visible and copyable from any page in ≤ 1 click.

### Experience
- [ ] All 7 zones, Overlook, Archive and Field Office implemented with every object in §05.
- [ ] Intro rewind plays once, is skippable, and is absent under reduced motion and on mobile.
- [ ] Every world object opens content that also exists on a plain route.
- [ ] Mobile uses the Scene Deck, not a shrunken world.

### Engineering
- [ ] TypeScript strict, no `.jsx`, `npm run lint` and `tsc --noEmit` clean.
- [ ] All routes statically generated; old URLs redirect (`/projects/Luca` etc.).
- [ ] Dependencies removed per §01.4; no three.js, GSAP, cursor or marquee libs in `package.json`.
- [ ] Adding a project, paper, certificate, job, or event requires editing only `src/content/*` (+ dropping images), verified by a dry run for each type.

### Quality gates
- [ ] Performance budgets in §15.8 met.
- [ ] Lighthouse Accessibility 100 and axe 0 violations on every route.
- [ ] Full keyboard-only walkthrough possible; focus always visible.
- [ ] Works in latest Chrome, Firefox, Safari (macOS + iOS), and Android Chrome.
- [ ] No console errors or hydration warnings.
- [ ] Open Graph preview renders correctly on LinkedIn and Slack.

### Visual
- [ ] Palette, type, and pixel rules in §08 applied; no blurred shadows, no neon, no third-party logos in the world, no copied game assets.
- [ ] Every pixel sprite recognisable at 2× on a 390 px screen.
- [ ] The site passes the author's own review: "This feels like my world, not a template."
