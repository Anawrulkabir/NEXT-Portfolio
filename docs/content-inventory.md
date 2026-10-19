# fahadkabir.com: content inventory

Every piece of text a visitor can see on the site today, gathered in one place for the next content plan. Quoted text is exactly what the site shows. Notes in *italics* describe what the visitor sees or does around that text.

- **Source:** branch `claude/modest-hamilton-6p1pb3`, commit `ea7a052`, 19 Oct 2026. Text was pulled from the source code and from the pages as rendered in a browser.
- **Where the facts came from:** the SWE CV, the Academic CV and the project kits you supplied. Nothing in this file is new content.
- **Inconsistencies:** the places where the site disagrees with itself are listed in section 7, so the new plan can settle them.

---

## 0. Site map

| Route | What it is |
|---|---|
| `/` | **The island.** A 3D world you "deploy" by typing a command. Ten buildings, one per area of work. |
| `/work` | The Work catalogue: 11 projects on 6 shelves. Each one opens a drawer. |
| `/work/snake-robot` | Case study: the compliant snake robot. |
| `/work/propbench` | Case study: PropBench. |
| `/research` | Research interests, publications, research experience, how you work. |
| `/about` | Bio, experience, education, awards, skills, contact. |
| `/cv`, `/resume` | Redirect to the SWE CV PDF. |
| `/cv/academic` | Redirects to the Academic CV PDF. |
| `/cv/Md-Anawrul-Kabir-Fahad-SWE-CV.pdf` | Software engineering CV, the original file. |
| `/cv/Md-Anawrul-Kabir-Fahad-Academic-CV.pdf` | Academic CV, the original file. |

The island stays alive once it has been deployed. Going to /work and back doesn't rebuild or redeploy it.

---

## 1. The island (`/`)

### 1.1 Boot screen: before anything is deployed

*A 3D laptop and keyboard (Hairline line drawings) sit on a pale sea. The laptop screen is a live terminal. On a phone the laptop is drawn as a dark card with the keyboard below it.*

Laptop screen:

```
fahad-kabir · control plane
Last login: <today's date> on ttys001

The island is not deployed yet.
Type anything. Your keystrokes write the command.      (phone: "Tap the keyboard. Your taps write the command.")

fahad@cuet:~$
```

Hint bar at the bottom. It changes as you type:

- Start: "Type anything to write the command" (phone: "Tap the keyboard to write the command")
- Typing: "Keep typing — every key is a letter of the command" (phone: "Keep tapping")
- Done: "Ready to deploy" ↵ "Deploy"
- Always present: "Skip to the island" · "Just the essentials"

Each key you press types the next letter of `kubectl apply -f fahad-kabir.yaml`, and the real key sinks on the drawn keyboard. If nobody types for 4.5 s, a ghost types it.

Top right: "Skip ⏭" and a sound button (bars icon). The sound settings popover contains:

- "Sound on"
- "Volume"
- "Ambient hum"
- "Every sound is one action you took. Nothing plays until you click or type."

### 1.2 The deploy: what the terminal prints

```
fahad@cuet:~$ kubectl apply -f fahad-kabir.yaml
namespace/fahad-kabir created
configmap/identity created
deployment.apps/workshop created
deployment.apps/soccer-pitch created
deployment.apps/hall-of-fame created
deployment.apps/gpu-datacenter created
deployment.apps/market-street created
deployment.apps/wind-tunnel created
deployment.apps/heat-exchanger created
deployment.apps/propbench created
deployment.apps/robotics-yard created
deployment.apps/contact created
service/fahad-kabir-mesh created
fahad@cuet:~$ kubectl describe configmap/identity
Name:     Md Anawrul Kabir Fahad
Studies:  Mechanical Engineering · CUET (2022 →)
Builds:   research software · scientific ML
Ran:      GPU platforms at Poridhi.io (2025–26)
Status:   Running
```

**The identity Polaroid.** *A print slides out of the laptop screen. It shows your portrait, which develops from pale grey to full colour. The name types itself underneath: "Md Anawrul Kabir Fahad" / "Mechanical · research software · GPU". The print then shrinks into the round avatar in the top-left corner.*

**The island assembles.** *Each district rises from the sea and its buildings print block by block. Meanwhile the terminal shows:*

```
fahad@cuet:~$ kubectl get pods -w
NAME                  READY  STATUS             AGE
workshop-xxxxx        0/1    Pending            0s
…                     0/1    ContainerCreating  1s
…                     1/1    Running            3s
                                  (one row per building, 10 in all)

Connecting the service mesh ···
✓ Connected to fahad-kabir · 10/10 services Running
Type help, a service name, or click any building. Esc closes this window.
fahad@cluster:~$
```

A returning visitor gets the same sequence at 5× speed. On a new visit, a link to a building such as `/#/propbench` skips the typing.

### 1.3 The live island: interface around the world

- **Top left:** the identity chip (round portrait, "fahad-kabir", "● Running"). Tapping it opens the identity card:
  - "pod/fahad-kabir · Running"
  - **Md Anawrul Kabir Fahad**
  - "Mechanical Engineering, CUET · research software · GPU platforms"
  - Labels, node and region (desktop only):
    - labels: "focus=scientific-ml · build=research-software · infra=gpu"
    - node: "cuet / mechanical (2022 →)"
    - region: "Dhaka, Bangladesh"
  - Buttons: "Software engineering CV", "Academic CV", "GitHub", "LinkedIn", "Copy email"
- **Services list (desktop, left):** "SVC", then the ten services, each with its namespace: workshop (core), soccer-pitch (robotics), hall-of-fame (contests), gpu-datacenter (infra), market-street (products), wind-tunnel (research), heat-exchanger (research), propbench (software), robotics-yard (robotics), contact (core).
- **Top centre (desktop):** page links "Work", "Research", "About".
- **Top right (desktop):**
  - sound
  - view modes "Explore", "Tour", "Read"
  - "⟲" and "⟳" (turn the island left or right)
  - ">_" (terminal)
  - "◐" (day or night)
- **Top right (phone):** "Map", "Tour", "Read", ☰ menu. The menu contains:
  - Work, then "Compliant snake robot" and "PropBench" under it
  - Research, About
  - "Everything as text", "Ride the tour", "Terminal", "Day or night", "Sound on"
  - "Software engineering CV PDF", "Academic CV PDF"
- **Labels in the world:** a floating name tag over each building (Workshop, Soccer pitch, Hall of fame …).
- **Text drawn into the world:**
  - the name **FAHAD** in blocks in the plaza
  - shop signs "Zeenah" and "Olly Labs" on Market street
  - your real photos on the soccer billboard, the snake-robot result chart on the hut, and the eight certificates framed on the hall walls
- **Tour bar:** "←", "The island · 10 services", "→", "Ride the tour"
- **Welcome-back toast (returning desktop visitor):** "Welcome back. Pick up at <station>?" · "Continue"
- **No-WebGL fallback:** "This device can't draw the 3D island. The portfolio opens as text instead."

### 1.4 The ten buildings (station panels)

Clicking a building opens its panel. On desktop it opens on the right. On a phone it's an iOS-style sheet: drag it between peek, half and full, or flick it closed. Every panel has the same parts:

- tag line `svc/<name> · ns/<namespace> · Running`
- title and subtitle
- summary
- an interactive control
- facts
- a link to the matching page

The panel ends with "Everything as text" and a "← previous / n / 10 / next →" bar.

#### 1. Workshop: "Start here · whoami" (`svc/workshop · ns/core`)

> Md Anawrul Kabir Fahad. Final-year Mechanical Engineering student at CUET who builds research software, after a year running GPU platforms at Poridhi.io. Every building on this island is one deployment of my work.

- **Control:** the identity card, the same one described in 1.3 (portrait, role, CV, GitHub and LinkedIn buttons, Copy email).
- **Facts:**
  - Research: models that stay reliable outside their training conditions
  - Two papers under review in the International Journal of Refrigeration, one at BSME ICTFE
  - The name in the plaza is set in the same blocks as everything else
- **Link:** "About Fahad →" (/about)

#### 2. Soccer pitch: "2022 · Robo Soccer" (`svc/soccer-pitch · ns/robotics`)

> Where it started: a remote-controlled soccer robot for Robo Soccer at Chittagong Science Carnival 2.0, which earned a Certificate of Recognition. The billboard holds the real photos of both versions and the parts.

- **Control:** a "Kick off" button (the robot kicks the ball in 3D) and three photo thumbnails that open a lightbox. Each photo is subtitled "Robo Soccer, 2022":
  - "The soccer robot, first and second version"
  - "Arduino Uno, breadboard and buck converters"
  - "The parts laid out before assembly"
- **Facts:**
  - Arduino Uno, BTS7960 motor drivers, 3S LiPo, HC-05 Bluetooth
  - Plywood chassis, rebuilt into a second version
- **Link:** "The robotics shelf in Work →"

#### 3. Hall of fame: "8 certificates" (`svc/hall-of-fame · ns/contests`)

> Every certificate hangs here in a frame. Click one to take it off the wall and read it, or pull it from the tray below: point at a card, click it, and it rises into your hands. The trophy is for Break The Monolith, the one we won.

- **Control:** Hairline's Riffle card tray, labelled "Point at the tray to pull a card · click it to read". Below it is a numbered list. Each certificate opens as a full reading card with "Put it back".
  1. Champion — Break The Monolith Microservice Hackathon · IEEE Computer Society, CUET Student Branch Chapter · 2025
  2. Finalist — API Avengers, Televerse 1.0 · Dept. of ETE, CUET · 2025
  3. CUET Rising Team — API Avengers, Televerse 1.0 · Dept. of ETE, CUET · 2025
  4. AI Engineering Hackathon 2025 · Poridhi.io, powered by Brain Station 23 · 26 Apr 2025
  5. WebXtreme 25 Hackathon, NSU Tech Fest 2025 · North South University (NSUCEC) · 2025
  6. NextGen Hackathon 2025, IIUC Tech Fest · Programming Hero and IIUC · Nov 2025
  7. ASRRO Robocoder Programming Contest · ASRRO, CUET · 30 Nov 2022
  8. Recognition — Robo Soccer, Chittagong Science Carnival 2.0 · Chittagong University Scientific Society · 2022
- **Facts:**
  - Champion, Break The Monolith Hackathon 2025 (Team_Deadlock)
  - Finalist and CUET Rising Team, API Avengers, Televerse 1.0
  - 7th, Brain Station 23 AI Engineering · 9th, NSU TechFest WebXtreme
  - ICPC Dhaka Regional preliminary, CUET IUPC, ASRRO Robocoder
- **Link:** "Every award →" (/about#ab-awards)

#### 4. GPU datacenter: "Poridhi.io · 2025–26" (`svc/gpu-datacenter · ns/infra`)

> AI Studio gives each user a GPU workspace with Jupyter or VS Code. It used to boot a fresh EC2 GPU machine for every session (the cloud floating offshore). We moved it to a Kubernetes cluster on the company's own GPU server, where one RTX 4090 is cut into isolated slices.

- **Control:** "Launch a session both ways". Two bars race: "AWS · new EC2 machine" against "Bare metal · HAMi slice". Note under it: "One launch drawn from each stated range (10–15 and 3–5 minutes), a second of animation per 2.5 minutes."
- **Facts:**
  - Launch time cut by about 70%, from 10–15 to 3–5 minutes
  - Six users share 48 GB of VRAM as isolated 8 GB slices (HAMi)
  - Built the Next.js frontend; brought the services up on the new cluster
  - Also: owned the TensorCode frontend, co-developed TensorRAG
- **Link:** "The work at Poridhi.io →" (/about#ab-work)

#### 5. Market street: "Products" (`svc/market-street · ns/products`)

> Things shipped to real users. Zeenah Store sells handloom sarees and jewellery. The Olly Labs assistant records meetings and turns them into notes. The kiosk is Puku AI's public site.

- **Control:** none.
- **Facts:**
  - Zeenah Store: Next.js, Supabase, Google sign-in, Vercel
  - Olly Labs meeting notes: React, Supabase, Microsoft Azure
  - Puku AI: public website, admin tools and subscriptions
- **Link:** "The products shelf in Work →"

#### 6. Wind tunnel: "Thesis · under review" (`svc/wind-tunnel · ns/research`)

> My thesis: what a physics-informed airfoil surrogate forgets when you adapt it, with low-rank updates, to flow conditions outside its training range. CFD reference data from SU2; eight adaptation methods compared on accuracy and forgetting.

- **Control:** an "Angle of attack" slider (−4° to 18°) that pitches the 3D airfoil.
  - Up to 12°: "Inside the conditions the surrogate was trained on."
  - Above 12°: "Past the conditions the surrogate was trained on: this is where low-rank adaptation comes in, and where forgetting is measured."
- **Facts:**
  - Localized forgetting in parameter-efficient adaptation of a frozen physics-informed airfoil surrogate
  - 10th BSME International Conference on Thermo-Fluid Engineering, under review
  - Advisor: Prof. Dr. Md. Abu Mowazzem Hossain
- **Link:** "The thesis and publications →" (/research)

#### 7. Heat-exchanger tower: "2 journal papers" (`svc/heat-exchanger · ns/research`)

> Machine learning that predicts evaporation and condensation heat transfer of two low-GWP refrigerants, R455A and R1336mzz(E), in an industrial plate heat exchanger, from Saga University experiments.

- **Control:** "Open the stack" / "Close the stack" (the plate stack explodes apart). Note: "Warm plates carry the refrigerant, cool plates the water. They alternate."
- **Facts:**
  - Tested on operating conditions left out of training: standard validation overstates generalization
  - Measurement uncertainty analysis for the R455A study
  - International Journal of Refrigeration, both under review
- **Link:** "The two papers →" (/research#rs-pub)

#### 8. PropBench lab: "Open source · pre-alpha" (`svc/propbench · ns/software`)

> A desktop workbench that takes researchers from lab measurements to a validated thermophysical property model. Move the loupe over the sheet; open the laptop; try the padlock: the model-selection rule is locked by hash before any fit.

- **Control:** a magnifying loupe over a data sheet. The readout changes with the loupe:
  - default: "**63 points** · 3 datasets"
  - over one dataset: "tuhin2024_liquid · 24 points", "tuhin2024_vapor · 21 points" or "duan1999_satliq · 18 points"
  - over the overlap: "**Overlap near 333 K**: offset between two labs **+7.4 %** (95 %: 3.1–11.8 %)"
  - reaching for the padlock: "**Selection rule locked** before fitting · 74a0a4fae106…"
  - note: "Move the loupe over the sheet. The laptop lid follows your pointer's height; the padlock opens when you reach for it."
- **Facts:**
  - Flags a +7.4 % offset between two labs at 333 K (95 %: 3.1–11.8 %)
  - Rust and Tauri shell, Python science worker, JSON-RPC between them
  - 450+ tests; CI on Windows, macOS and Linux
- **Link:** "Read the case study →" (/work/propbench)

#### 9. Robotics yard: "Simulation · 2026" (`svc/robotics-yard · ns/robotics`)

> A seven-segment, cable-driven snake robot, simulated in MuJoCo before any part is bought, to test whether a partly compliant body crosses a post lattice better than a stiff or a loose one.

- **Control:** a "Compliance G" slider (0–1.5, steps of 0.25). The snake moves through the posts in 3D. Readout example: "**G 0.75** · partly compliant / calibration step 2: **2/5** crossed · fresh seeds: **6/10** / runs 20261017T111457Z_cc9bd78, 20261018T071302Z_d73fb14". The labels are stiff (0), partly compliant, and loose (1.25 and up). Note: "Drag across the yard, or use the slider. The numbers are logged results; the motion is an illustration."
- **Facts:**
  - 433 paired, randomized trials; 133 tests
  - Pass/fail rules written before each run
  - The board on the hut shows the real result chart
- **Link:** "Read the case study →" (/work/snake-robot)

#### 10. Lighthouse: "Contact" (`svc/contact · ns/core`)

> Get in touch. The beam keeps turning while you read.

- **Control:** your email in bold, then "Copy email", "Software engineering CV", "Academic CV", "LinkedIn", "GitHub".
- **Facts:**
  - Email, LinkedIn and GitHub, as on the CV
  - CV as a PDF
  - fahadkabir.com
- **Link:** "Contact and both CVs →" (/about#ab-contact)

### 1.5 Read mode ("Read" / "Everything as text")

- Heading: "fahad-kabir, as text"
- Intro: "Every service on the island, in order. This is also what screen readers and devices without WebGL get."
- Both CV links, then all ten stations in order. Each shows its tag, name, summary and facts, its page link and "Visit in the world →".
- Footer links: Work, Snake robot, PropBench, Research, About, "Back to the island".

### 1.6 Terminal commands (`help` output and answers)

The terminal opens with ">_" or the backtick key.

| Command | What it prints or does |
|---|---|
| `help` | Lists the commands below. |
| `ls` / `kubectl get svc` | A NAME / NAMESPACE / STATUS table with all 10 services "Running". |
| `open <svc>` (or just the name) | Flies to that building. |
| `logs <svc>` | That building's facts as dated log lines, e.g. `2026-10-10 [propbench] …` |
| `whoami` | "Md Anawrul Kabir Fahad" / "B.Sc. Mechanical Engineering, CUET (2022 →)" / "Research software · scientific ML · GPU platforms", and opens the identity card. |
| `tour` | "riding the mesh, stop 1 of 10" |
| `certs` | "8 certificates on the walls · click a frame, or pull a card from the tray in the panel" |
| `contact` | Flies to the lighthouse and prints the email. |
| `cv swe` / `cv academic` | Downloads that PDF: "downloading …" |
| `sound on/off/0-100/hum` | "sound on · volume 70 · hum off" |
| `theme dark/light` | Switches day or night. |
| `ping` | "64 bytes from fahad-kabir: icmp_seq=1 ttl=64 time=3 ms" ×3 |
| `reboot` | "rebooting…" and replays the deploy. |
| `sudo hire` | "[sudo] permission granted. Opening the lighthouse…" |
| `sudo <anything else>` | "fahad is not in the sudoers file. This incident will be reported." |
| `rm …` | "rm: refusing to remove the island" |
| `uname` | "fahad-os 2026.10 mechanical x86_64" |
| `date`, `echo`, `clear`, `home` | As you'd expect. |
| anything else | "command not found: … · try help" |

---

## 2. Shared site chrome (/work, /research, /about, case studies)

- **Top bar:**
  - brand "**Fahad Kabir**" with "Mechanical · CUET" under it
  - Work · Research · About
  - a "CV" menu with "Software engineering CV PDF" and "Academic CV PDF"
  - "Island", and a day/night button
  - on a phone: brand, day/night and ☰
- **Phone menu:**
  - Work, then "Compliant snake robot" and "PropBench" under it
  - Research, About, "The island"
  - both CV buttons
- **Case-study back link:** "← All work"
- **Footer:** "Md Anawrul Kabir Fahad · Mechanical Engineering, CUET", then GitHub · LinkedIn · SWE CV · Academic CV · The island.
- **Figures:** every page figure is an animated Hairline line drawing. Some have a live readout line and an "intensity" slider (line weight).

---

## 3. `/work`: the catalogue

- **Heading:** "Work, grouped by what it *does*."
- **Intro:** "Eleven projects on six shelves. Each has its own figure. Pick one to see what it was, what it showed, and where to read more."
- **Filter chips:** All 11 · Research 3 · Robotics 2 · Research software 1 · Infrastructure 2 · Products 2 · Contests 1

Each shelf shows tiles (a figure plus name plus badge):

| Shelf | Tile | Badge |
|---|---|---|
| Research | Localized forgetting in PEFT | THESIS |
| Research | Refrigerant heat transfer ML | 2 PAPERS |
| Research | CF₃I viscosity model | IN PREP |
| Robotics | Compliant snake robot | 2026 |
| Robotics | Robo soccer bot | 2022 |
| Research software | PropBench | 2026 |
| Infrastructure | AI Studio | 2025–26 |
| Infrastructure | TensorCode and TensorRAG | 2025–26 |
| Products | Zeenah Store | LIVE |
| Products | AI meeting notes | OLLY LABS |
| Contests | Hackathons and contests | 2022–25 |

### Drawers

A tile opens a drawer: a side panel on desktop, full screen with "← Back to all work" on a phone. Each drawer has:

- title, shelf and status
- a figure with a live readout
- a one-line description
- facts
- links

**Localized forgetting in PEFT.** Research · UNDER REVIEW · BSME ICTFE. Readout: "-2° · inside the surrogate's training range".
> Adapting a released physics-informed airfoil surrogate beyond its training range with low-rank updates, and measuring what it forgets.
- CFD reference data generated in SU2
- Eight adaptation methods compared on accuracy and forgetting
- Links: "Read about the research" · "See it on the island"

**Refrigerant heat transfer ML.** Research · UNDER REVIEW · INT. J. REFRIGERATION. Readout: "channel 2 · water side".
> Models that predict evaporation and condensation heat transfer of low-GWP R455A and R1336mzz(E) in an industrial plate heat exchanger, from Saga University experiments.
- Tested on operating conditions left out of training
- Measurement uncertainty analysis for the R455A study

**CF₃I viscosity model.** Research · IN PREPARATION. Readout: "9 points here · from datasets 1 and 2 and 3 of 3".
> An updated residual-entropy scaling model for the viscosity of CF₃I (R13I1), and PropBench's first case study.
- 63 published data points from 3 datasets

**Compliant snake robot.** Robotics · SIMULATION · ONGOING. Readout: "G 0.00 · stiff · calibration 5/5 · fresh seeds 10/10".
> A MuJoCo simulation of a 7-segment, cable-driven snake robot, built to test a Science Robotics result on body compliance and to size its servos before buying parts.
- 433 paired, randomized trials
- 133 tests, each shown to fail on a planted fault
- Pass/fail rules written before every run
- Links: "Read the case study" · "See it on the island"

**Robo soccer bot.** Robotics · CERTIFICATE OF RECOGNITION. Readout: "Arduino Uno · BTS7960 motor drivers · 3S LiPo".
> A remote-controlled soccer robot for Chittagong Science Carnival 2.0.
- Arduino Uno, BTS7960 drivers, 3S LiPo, HC-05
- Plywood chassis

**PropBench.** Research software · OPEN SOURCE · PRE-ALPHA · MIT. Readout: "63 points · 3 datasets".
> A desktop workbench that takes researchers from lab measurements to a validated thermophysical property model, without writing code.
- ~32,000 lines across Rust, Python, Svelte and TypeScript
- 450+ automated tests, CI on Windows, macOS and Linux
- Reproduces a NIST check value to 5 × 10⁻⁶

**AI Studio.** Infrastructure · PORIDHI.IO. Readout: "slice 1 of 6 · 8 GB · isolated by HAMi".
> On-demand GPU workspaces for Jupyter and VS Code. I helped move it from AWS to a Kubernetes cluster on the company GPU server.
- Launch time cut by about 70%, from 10–15 to 3–5 minutes
- Six users share 48 GB of VRAM as isolated 8 GB slices (HAMi)
- Built the Next.js frontend for session setup
- Links: "Read about the work at Poridhi" · "See it on the island"

**TensorCode and TensorRAG.** Infrastructure · PORIDHI.IO. Readout: "cell 1 · run".
> A browser platform for AI, GPU and kernel programming, and a visual tool for building ML training pipelines from Python steps.
- Owned the frontend from the first version
- Built the workflow that brings lab content in from GitHub

**Zeenah Store.** Products · LIVE SITE. Readout: "handloom sarees and jewellery · a live store".
> A store for handloom sarees and jewellery with cart, guest checkout, Google sign-in and order history.
- Next.js, Supabase, Google OAuth, Vercel

**AI meeting notes.** Products · SHIPPED. Readout: "a recorded call → notes and an AI summary".
> A meeting assistant that records calls and turns the audio into notes and AI summaries.
- React, Supabase, Microsoft Azure

**Hackathons and contests.** Contests · CHAMPION · FINALIST · 7TH · 9TH. Readout: "Finalist · API Avengers, Televerse 1.0 · Rising Team Award".
> Champion at Break The Monolith. Finalist and Rising Team Award at API Avengers. 7th at Brain Station 23 AI Engineering, 9th at NSU TechFest WebXtreme.
- ICPC Dhaka Regional preliminary contestant
- CUET IUPC and ASRRO Robocoder
- Links: "See every award" · "See it on the island"

---

## 4. `/work/snake-robot`: case study

- **Rail (section index):** Overview (The question, The robot, The arena) · Method (How I worked, Pipeline) · Results (Every trial, What I found, Hardware decision) · Reflection (What it taught me, Next)
- **Eyebrow:** "CASE STUDY · SIMULATION, NOT HARDWARE"
- **Title:** "A compliant snake robot, simulated before it is built."
- **Lede:** "A 7-segment, cable-driven snake robot that I will build with micro servos and 3D-printed parts. Before buying anything, I built a MuJoCo simulation to test one idea from the literature: a partly compliant body gets through cluttered terrain better than a stiff or a loose one (Wang et al., Science Robotics 2023)."
- **Tags:** PYTHON · MUJOCO · 2026 · ONGOING · 433 TRIALS · 133 TESTS. Link: "Drive the robot on the island →"
- **Hero figure:** the snake in the post lattice, with readout "G 0.00 · stiff · calibration 5/5 · fresh seeds 10/10". Caption: "Move across the figure to set the body's compliance G, from stiff (0) to loose (1.5). The read-out gives the real results at that G from the two runs below. The drawing is an illustration; the numbers are from the logs."

**The question**
- Does intermediate cable compliance beat stiff and loose bodies in a post lattice, under the same open-loop wave?
- What does the real robot need: joint torque, cable tension, servo class, segment length?
- Is adaptive slack worth building: loosen when jammed, tighten to push?

**The robot** (table)

| Part | Spec |
|---|---|
| Body | 7 rigid segments, 6 yaw joints, 0.10 m pitch, planar |
| Actuation | One MG90S micro servo per joint driving a bilateral cable spool (0.2027 N·m stall at 6 V) |
| Ground | A passive wheel under each segment: 1.6 : 1 sideways-to-forward drag, the paper's ratio |
| Mass | 0.038 kg per segment, 0.075 kg head (ESP32 and battery). Placeholders until weighed |
| Compliance | The paper's generalized compliance G, from 0 (stiff) to 1.5 (loose) |

- Image caption: "MuJoCo render, run 20261017T112843Z_29c5654."
- **The arena:** "A hexagonal lattice of 0.103 m posts at the paper's densities. The robot must cross 1.95 m within 40 gait cycles. Every condition runs from the same randomized starts, so comparisons are paired."

**How I worked** (four cards)
- **Decision gates:** "Eight points where I chose between written options with trade-offs. Every choice and its reason is logged."
- **Pre-registration:** "Pass/fail rules were written down before each run, then applied by code. When the rule says 'inconclusive', the project stops there."
- **Tests that can fail:** "133 tests, each shown to fail on a planted fault: a flipped sign, a dropped row, a mistyped config value."
- **Disclosure:** "The code was written with Claude Code under my direction. My decisions are logged in docs/decisions.md."

**Pipeline:** "Tagged YAML configs are the one source of truth. Python generates the MuJoCo model, and a parallel, resumable sweep runner writes each run's config, git commit, JSONL log and Parquet copy. Dependencies are locked with uv, and logged trials replay bit-for-bit in a fresh environment."

**Every trial:** an interactive dot chart: "One dot per simulated trial. A filled dot crossed the lattice. Hover a column." Three groups: E1 pilot (n = 20 per G), Calibration 2 (n = 5 per G), Fresh seeds (n = 10 per G), at G = 0.00 to 1.50.

**What I found** (three result cards, each with its run ID)
- **E1 pilot: a floor effect.** 0 SUCCESSES. "160 trials, no success at any compliance. A diagnostic re-run showed every overload came from a post holding a joint near the head. All 84 overloaded trials reproduced exactly." (run 20261017T062232Z_b5aac2a)
- **Calibration step 2.** INCONCLUSIVE. "Successes out of 5 for G = 0 to 1.5: 5, 4, 1, 2, 5, 0, 0. The pre-registered outcome was inconclusive, so no setup was adopted." (run 20261017T111457Z_cc9bd78)
- **Is the mid-G stall a propulsion failure?** REJECTED. "On open floor all 40 trials succeeded and mid-G speed matched the ends. In the lattice mid-G again did worst: 8/10 and 6/10, against 10/10 at both ends. The stall needs the posts." (run 20261018T071302Z_d73fb14)
- Image caption: "Same start, seed 1002: stuck at G = 0.75, passing at G = 1.0."

**Hardware decision:** "The MG90S became the baseline servo and the MG996R was dropped: it still overloaded at G = 0, is 4× heavier, barely fits the segment, and may turn only 120°."

**What it taught me**
- An inconclusive result reported honestly is worth more than a tuned success.
- Writing a criterion down before the data exists exposes bad criteria. One of mine was true by construction at G = 0.
- Most of the work was ruling out artefacts: start-pose bugs, friction priority, metric artefacts, solver resets.

**Next:** "A cable-level model, checked against the current joint-level one, to test whether the mid-compliance stall comes from the simplification. Then the full sweep, servo sizing, adaptive slack and sensitivity."

Repository link: github.com/Anawrulkabir/snakeRobot

---

## 5. `/work/propbench`: case study

- **Rail (section index):** The workflow (The problem, Spot disagreements, Fit and validate, A rule you can't bend) · Engineering (Architecture, Isolation, Correctness) · Status (Screens, Next)
- **Eyebrow:** "CASE STUDY · OPEN SOURCE, PRE-ALPHA"
- **Title:** "From new measurements to a validated property model."
- **Lede:** "An open-source desktop workbench for thermophysical property research. Import lab data, check it against published measurements, fit and cross-validate models with stated uncertainty, and export journal-ready figures and CoolProp-compatible models, without writing code."
- **Tags:** RUST · TAURI 2 · PYTHON · SVELTE · COOLPROP · MIT. Link: "Move the loupe on the island →"
- **Hero figure:** the loupe over the data sheet, with readout "63 points · 3 datasets". Caption: "Drag the loupe over the sheet. Three published CF₃I viscosity datasets, 63 points in all. Where two of them overlap near 333 K, PropBench flags a +7.4 % offset. Point positions are drawn, not plotted."
- **Stats:** ~32k lines of code · 7 Rust crates · 450+ automated tests · 4 CI platforms

**The problem:** "When a new working fluid is measured for the first time, the path from raw data to a usable model runs through spreadsheets, one-off scripts and closed tools. Disagreements between labs go unnoticed, models are judged on the data they were fitted to, and the uncertainty is rarely stated. PropBench puts the whole study in one reproducible project file."

**Spot disagreements before they reach the model:** "Model-free comparisons within combined expanded uncertainty, Bayesian constant offsets with 95 % intervals, and z-scores against NIST reference models. On published CF₃I viscosity data it flags a +7.4 % offset between two laboratories at 333 K (95 % interval 3.1–11.8 %)."

**Fit and validate**
- ECS, residual-entropy scaling and dilute-gas models, each with a published check value as a test.
- Weighted least squares in relative deviation, multistart, per-dataset scale factors, GUM uncertainty propagation.
- Leave-one-dataset-out, leave-one-state-out, k-fold and bootstrap cross-validation, ranked beside the NIST reference model.

**A rule you can't bend:** "Before any model is fitted, you state how the best one will be chosen: metric, validation scheme, physics checks. PropBench stores a SHA-256 of that rule and records it in the report, so nobody can pick the winner afterwards."

**Architecture:** an interactive diagram: "The UI never computes. Hover a station."

**Isolation:** "Third-party plug-ins run in a Wasmtime sandbox, or in the project's Python environment, with only the permissions declared in their plugin.toml. Packages are signed with minisign. Projects are one SQLite file, saved atomically, with a migration for every schema change."

**Correctness** (table)

| Check | Published value | Reproduced |
|---|---|---|
| R134a, 300 K, 1 MPa | 1201.53 kg/m³ | reference EoS density |
| CF₃I viscosity, 356.8 K | 168.5169 µPa·s | to 5 × 10⁻⁶ (NISTIR 8209) |
| JCGM 100, example H.1 | 50.000838 mm | k = 2.92 |

**Screens** (two screenshots)
- "Results: a candidate model ranked by leave-one-state-out AARD, with physics checks and the locked selection rule in the log."
- "Graph studio with journal size presets."

**Next:** "Signed installers, a package on PyPI, a documentation site, and a software paper with the CF₃I viscosity study as its first case study."

Repository link: github.com/Anawrulkabir/PropBench

---

## 6a. `/research`

- **Rail (section index):** Interests · Publications · Experience · How I work
- **Eyebrow:** "RESEARCH"
- **Title:** "Models that stay reliable outside their training conditions."
- **Lede:** "Scientific machine learning that holds up on unseen operating regimes: detecting when a model is out of its depth, and correcting trained models cheaply. I also bring hands-on experience running GPU infrastructure and building research software."

**Interests**
- Machine learning for engineering systems.
- Physics-informed and physics-guided machine learning.
- Computational modeling of fluid and thermal systems.
- Data-driven prediction of how engineering systems behave.
- AI-assisted engineering analysis, including low-cost intelligent systems.
- Heat transfer and refrigeration, especially low-GWP refrigerants.
- Island links: "On the island: pitch the thesis airfoil → · open the heat-exchanger stack →"

**Publications**
1. *Localized forgetting in parameter-efficient adaptation of a frozen physics-informed airfoil surrogate.* UNDER REVIEW. M. A. K. Fahad and M. A. M. Hossain. 10th BSME International Conference on Thermo-Fluid Engineering, 2026.
2. *Optimizing evaporation heat transfer predictions of low GWP R455A in an industrial plate heat exchanger via machine learning.* UNDER REVIEW. International Journal of Refrigeration, 2026.
3. *Machine learning based prediction of the condensation heat transfer of low GWP refrigerant R1336mzz(E) in an industrial plate heat exchanger.* UNDER REVIEW. International Journal of Refrigeration, 2026.
4. *An updated residual entropy scaling model for the viscosity of CF₃I (R13I1).* IN PREPARATION. Built with PropBench.

**Experience**
- **Ongoing: Machine learning for refrigerant heat transfer.** Advisor: Monowar Wadud Hridoy, Mechatronics and Industrial Engineering, CUET.
  - Models of heat transfer for two low-GWP refrigerants, from Saga University experiments.
  - Tested on operating conditions left out of training, showing that standard validation overstates generalization.
  - Measurement uncertainty analysis and data quality checks for the R455A study.
- **Thesis: Localized forgetting in PEFT of a physics-informed surrogate.** Advisor: Prof. Dr. Md. Abu Mowazzem Hossain, Mechanical Engineering, CUET.
  - Adapted a released physics-informed airfoil surrogate beyond its training range with low-rank updates.
  - Generated CFD reference data in SU2 and compared eight adaptation methods on accuracy and forgetting.

**How I work**
- **Rules before results:** "Pass/fail criteria are written before the data exists, and applied by code."
- **Every number traceable:** "Each figure in a write-up is copied from a saved run, with its ID."
- **Honest scope:** "Simulation is labelled as simulation, and missing physics is listed."

## 6b. `/about`

- **Rail (section index):** Experience · Education · Awards · Skills · Contact
- **Eyebrow:** "ABOUT"
- **Title:** "Mechanical engineer by training, builder by habit."
- **Lede:** "I'm Md Anawrul Kabir Fahad, from Dhaka. I study Mechanical Engineering at CUET, and for a year I built GPU platforms at Poridhi.io. I like problems where physics, data and software meet."
- **Figure:** a GPU sliced into six, with readout "slice 1 of 6 · 8 GB · isolated by HAMi". Link: "Race a launch on the island →"

**Experience: May 2025 – Jul 2026. Junior Software Engineer, Poridhi.io**
"Intern May – Jun 2025. GPU computing platforms, remote."
- AI Studio: moved on-demand GPU workspaces from AWS to Kubernetes on the company GPU server, cutting launch time by about 70%, from 10–15 to 3–5 minutes.
- Six users share 48 GB of VRAM as isolated 8 GB slices through HAMi.
- TensorCode: owned the frontend from the first version; co-developed TensorRAG.
- Onboarded new interns and set their first tasks.

**Education: Apr 2022 – now.** B.Sc. in Mechanical Engineering, Chittagong University of Engineering & Technology (CUET), Chattogram.

**Awards and competitions**

| Result | Event |
|---|---|
| Champion | Break The Monolith Hackathon, 2025 |
| Finalist | API Avengers, Televerse 1.0, CUET, 2025 · Rising Team Award |
| 7th place | Brain Station 23 AI Engineering Hackathon |
| 9th place | NSU TechFest WebXtreme, 2025 |
| Participant | NextGen Hackathon, IIUC, 2025 |
| Contestant | ICPC Dhaka Regional Preliminary, CUET IUPC, ASRRO Robocoder, 2022–2023 |
| Recognition | Robo Soccer, Chittagong Science Carnival 2.0, 2022 |

**Skills (chips):** Python · TypeScript · Go · Rust · SQL · PyTorch · scikit-learn · XGBoost · MuJoCo · SU2 · CoolProp · REFPROP · Kubernetes · Docker · AWS · Temporal · React · Next.js · PostgreSQL

**Contact**
- Email: mdanawrulkabirfahad123@gmail.com
- LinkedIn: linkedin.com/in/anawrulkabir
- GitHub: github.com/anawrulkabir
- Buttons: "Software engineering CV PDF", "Academic CV PDF"

---

## 7. What search engines and link previews see

| Page | Title | Description |
|---|---|---|
| `/` | Md Anawrul Kabir Fahad — Mechanical engineering student who builds GPU infrastructure | Deploy Fahad's portfolio: type kubectl apply and watch an island of his research, robots and software assemble. |
| `/work` | Work — Fahad Kabir | Eleven projects on six shelves: research, robotics, research software, GPU infrastructure, products and contests. |
| `/work/snake-robot` | Compliant snake robot — Fahad Kabir | A 7-segment, cable-driven snake robot simulated in MuJoCo before it is built: 433 paired trials testing whether a partly compliant body crosses a post lattice better. |
| `/work/propbench` | PropBench — Fahad Kabir | An open-source desktop workbench that takes researchers from lab measurements to a validated thermophysical property model. |
| `/research` | Research — Fahad Kabir | Scientific machine learning that stays reliable outside its training conditions: publications, experience and how I work. |
| `/about` | About — Fahad Kabir | Mechanical engineering student at CUET who built GPU platforms at Poridhi.io: experience, education, awards, skills and contact. |

**Hidden text version of `/`.** Search engines and screen readers get a plain-text version of the home page. It comes from an older content module (`src/content`), not the island's data, and parts of it no longer match the visible site:

- **Positioning:** "Mechanical engineering student who builds GPU infrastructure". The island and pages say "builds research software … after a year running GPU platforms".
- **Poridhi dates:** "Junior Software Engineer, Poridhi.io (Jun 2025 – Present)" and "Intern (May 2025 – Jun 2025)". /about says "May 2025 – Jul 2026", with the internship May–Jun 2025.
- **TensorCode:** "built the backend of TensorCode … on Cloudflare's edge" (Hono.js, D1, R2, KV). The visible site says "owned the TensorCode frontend".
- **Extra Poridhi bullets** that appear nowhere visible:
  - the initial AWS stack (g4dn, custom AMIs, ECR, JuiceFS-on-S3)
  - the PostgreSQL schema and REST API for slice allocation
  - Temporal workflows
  - Kubernetes RBAC
  - architecture docs
  - the Flask auth service
  - the Pulumi IaC workflow
- **Thesis wording:** "trains a PINN … NACA 0012 … LoRA-style fine-tuning". The visible site says "adapting a released physics-informed airfoil surrogate … localized forgetting".
- **Paper status:** R1336mzz(E) is "Research in progress". The visible site says "under review".
- **Old projects** listed only here: Luca (tourist guide platform), Sitemark (blog platform), Craftpaper (craft e-commerce). Hackathon entries carry project descriptions (ride-sharing microservices, donation backend, intent-based product search) that the visible site doesn't show.
- **Education:** "Apr 2022 – Jul 2026 (expected)". /about says "Apr 2022 – now".

---

## 8. Other inconsistencies to settle in the new plan

1. **Puku AI.** It's on the island (Market street: "The kiosk is Puku AI's public site", plus a fact line) but has no tile on /work, whose Products shelf holds only Zeenah Store and AI meeting notes.
2. **Lighthouse fact "CV as a PDF".** It's singular, but there are now two CVs (SWE and Academic).
3. **Certificates vs awards.** The Hall says "8 certificates" and lists NextGen 2025 as a certificate. /about lists 7 award rows, with NextGen as "Participant". The AI Engineering Hackathon is "7th, Brain Station 23 AI Engineering" in the facts but "AI Engineering Hackathon 2025 · Poridhi.io, powered by Brain Station 23" on the certificate.
4. **Poridhi role in the Workshop text.** It says "after a year running GPU platforms". /about's dates (May 2025 – Jul 2026) are about 14 months.
5. **Heat-transfer advisor.** /research names "Monowar Wadud Hridoy" for the refrigerant work. The island's heat-exchanger panel names no advisor. That's fine, just noting it.
6. **The "Research software" shelf** has only PropBench. The CF₃I model is filed under Research but described as "PropBench's first case study".
7. **Year labels.** "2025–26" for AI Studio and TensorCode, "2022–25" for contests, "2022–2023" for ICPC/IUPC/ASRRO on /about.
