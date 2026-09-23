/**
 * Journey / world content — see docs/PORTFOLIO_REDESIGN.md §03.4, §05.2
 *
 * This is the data layer only: which zones exist, in what order, and which
 * objects live in each one, and what each object opens. Geometry (tile
 * coordinates, sprite placement) lives in world/layout.ts (Phase 2), not
 * here — this file is pure content.
 */
import { pending } from './pending'
import type { JourneyChapter, Note } from './types'

export const journeyChapters: JourneyChapter[] = [
  {
    id: 'workshop',
    order: 1,
    name: 'The Workshop',
    progressWord: 'ENGINEERING',
    period: '2022',
    summary: 'Robotics, the Soccer Bot, and the start of a Mechanical Engineering degree at CUET.',
    objects: [
      {
        objectId: 'soccer-bot',
        tooltip: 'Soccer Bot, 2022',
        opens: { type: 'project', id: 'soccer-bot' },
      },
      {
        objectId: 'workbench',
        tooltip: 'The workbench',
        opens: { type: 'note', id: 'workbench' },
      },
      {
        objectId: 'cuet-signpost',
        tooltip: 'CUET, 2022',
        opens: { type: 'route', href: '/about' },
      },
    ],
  },
  {
    id: 'dungeon',
    order: 2,
    name: 'Algorithm Dungeon',
    progressWord: 'LOGIC',
    period: '2022–2023',
    summary: 'Competitive programming: ICPC Preliminaries, CUET IUPC, 300+ problems across 50+ contests.',
    objects: [
      {
        objectId: 'terminal',
        tooltip: 'Competitive programming',
        opens: { type: 'note', id: 'competitive-programming' },
      },
      {
        objectId: 'maze',
        tooltip: 'Why this mattered',
        opens: { type: 'note', id: 'algorithmic-thinking' },
      },
      {
        objectId: 'team-door',
        tooltip: 'Team contests',
        opens: { type: 'note', id: 'team-contests' },
      },
    ],
  },
  {
    id: 'garage',
    order: 3,
    name: 'The Garage',
    progressWord: 'BUILDING',
    period: '2025',
    summary: 'Hackathons and a business competition — rapid prototyping under constraints.',
    objects: [
      {
        objectId: 'trophy-monolith',
        tooltip: 'Break The Monolith — Champion, 2025',
        opens: { type: 'project', id: 'ride-sharing-microservices' },
      },
      {
        objectId: 'laptop-api-avenger',
        tooltip: 'API Avenger, CUET — Rising Team, 2025',
        opens: { type: 'project', id: 'donation-backend' },
      },
      {
        objectId: 'laptop-bs23',
        tooltip: 'AI Engineering Hackathon, Brain Station 23',
        opens: { type: 'project', id: 'intent-product-search' },
      },
      {
        objectId: 'pitch-board',
        tooltip: 'Business competition',
        opens: { type: 'event', id: 'business-competition' },
      },
      {
        objectId: 'sticky-wall',
        tooltip: 'More events',
        opens: { type: 'route', href: '/archive#events' },
      },
    ],
  },
  {
    id: 'software',
    order: 4,
    name: 'Software Workshop',
    progressWord: 'SOFTWARE',
    period: 'May 2025',
    summary: 'Intern Software Engineer at Poridhi.io — backend, APIs, and the TensorCode frontend.',
    objects: [
      {
        objectId: 'desk-internship',
        tooltip: 'Intern Software Engineer, Poridhi.io',
        opens: {
          type: 'experience',
          id: 'poridhi',
          highlight: ['intern-software-engineer'],
        },
      },
      {
        objectId: 'whiteboard-api',
        tooltip: 'Backends & APIs',
        opens: { type: 'note', id: 'backends-apis' },
      },
      {
        objectId: 'monitor-frontend',
        tooltip: 'Frontend & docs',
        opens: { type: 'note', id: 'frontend-docs' },
      },
      {
        objectId: 'toolbox-software',
        tooltip: 'Tools',
        opens: { type: 'skills', groups: ['software', 'programming'] },
      },
    ],
  },
  {
    id: 'datacenter',
    order: 5,
    name: 'GPU Data Center',
    progressWord: 'INFRASTRUCTURE',
    period: 'Jun 2025 — Present',
    summary: 'AI Studio: bare-metal Kubernetes, HAMi GPU virtualization, and the AWS session stack.',
    objects: [
      {
        objectId: 'gpu-rack',
        tooltip: 'The GPU',
        opens: { type: 'note', id: 'dc-gpu' },
      },
      {
        objectId: 'container-crate',
        tooltip: 'Container',
        opens: { type: 'note', id: 'dc-container' },
      },
      {
        objectId: 'k8s-console',
        tooltip: 'Orchestration',
        opens: { type: 'note', id: 'dc-orchestration' },
      },
      {
        objectId: 'workflow-conveyor',
        tooltip: 'Session lifecycle',
        opens: { type: 'note', id: 'dc-session' },
      },
      {
        objectId: 'workspace-pod',
        tooltip: 'AI workspace',
        opens: { type: 'project', id: 'ai-studio' },
      },
      {
        objectId: 'cloud-gate',
        tooltip: 'Cloud',
        opens: { type: 'note', id: 'dc-cloud' },
      },
      {
        objectId: 'tensor-reactor',
        tooltip: 'TensorCode',
        opens: { type: 'project', id: 'tensorcode' },
      },
      {
        objectId: 'ops-desk',
        tooltip: 'Operations',
        opens: { type: 'note', id: 'dc-operations' },
      },
      {
        objectId: 'toolbox-infra',
        tooltip: 'Tools',
        opens: { type: 'skills', groups: ['infrastructure', 'gpu-ai'] },
      },
    ],
  },
  {
    id: 'physics-lab',
    order: 6,
    name: 'Physics-Informed Lab',
    progressWord: pending('CONFIRM progression word for Physics Lab (draft: "MODELING")'),
    period: 'Ongoing',
    summary: 'Thesis: a PINN solver adapted to high-incidence airfoil flow with LoRA-style fine-tuning.',
    objects: [
      {
        objectId: 'wind-tunnel',
        tooltip: 'Thesis: PINN for airfoil flow',
        opens: { type: 'research', id: 'pinn-naca0012-thesis', view: 'demo' },
      },
      {
        objectId: 'chalkboard',
        tooltip: 'Physics-informed ML, in one line',
        opens: { type: 'note', id: 'physics-informed-ml' },
      },
      {
        objectId: 'workstation-physics',
        tooltip: 'Figures & repo',
        opens: { type: 'research', id: 'pinn-naca0012-thesis', view: 'card' },
      },
    ],
  },
  {
    id: 'thermal-lab',
    order: 7,
    name: 'Thermal Systems Lab',
    progressWord: 'RESEARCH',
    period: 'Ongoing',
    summary: 'Machine learning for heat transfer in low-GWP refrigerants: R455A and R1336mzz(E).',
    objects: [
      {
        objectId: 'phe-rig-r455a',
        tooltip: 'R455A evaporation study — manuscript under review',
        opens: { type: 'research', id: 'r455a-evaporation-ml', view: 'pipeline' },
      },
      {
        objectId: 'phe-rig-r1336',
        tooltip: 'R1336mzz(E) condensation — research in progress',
        opens: { type: 'research', id: 'r1336mzze-condensation-ml' },
      },
      {
        objectId: 'data-logger',
        tooltip: 'Why small data is the hard part',
        opens: { type: 'note', id: 'small-data' },
      },
      {
        objectId: 'interests-board',
        tooltip: 'Research interests',
        opens: { type: 'route', href: '/research' },
      },
    ],
  },
  {
    id: 'overlook',
    order: 8,
    name: 'The Overlook',
    summary: "This is where I'm going: AI × Mechanical Engineering × Computational Research.",
    // Doors to the two rooms. Until the rooms land (Phase 7, I-07) they open
    // the rooms' page twins.
    objects: [
      { objectId: 'door-archive', tooltip: 'Archive', opens: { type: 'route', href: '/archive' } },
      { objectId: 'door-contact', tooltip: 'Field Office', opens: { type: 'route', href: '/contact' } },
    ],
  },
  {
    id: 'archive',
    order: 9,
    name: 'Archive Room',
    summary: 'Certificates and events, on request.',
    objects: [
      { objectId: 'certificate-wall', tooltip: 'Certificates', opens: { type: 'certificates' } },
      { objectId: 'map-table', tooltip: 'Events map', opens: { type: 'events-map' } },
    ],
  },
  {
    id: 'contact',
    order: 10,
    name: 'Field Office',
    summary: 'Get in touch.',
    objects: [
      { objectId: 'mailbox', tooltip: 'Email', opens: { type: 'contact' } },
      { objectId: 'cv-pin', tooltip: 'CV', opens: { type: 'route', href: '/cv' } },
      { objectId: 'link-board', tooltip: 'Links', opens: { type: 'contact' } },
    ],
  },
]

export const journeyNotes: Note[] = [
  {
    id: 'workbench',
    title: 'The workbench',
    body: ['Hands-on hardware: motors, drivers, controllers, wiring.'],
    sources: ['SOP §04', 'Brief §1'],
  },
  {
    id: 'competitive-programming',
    title: 'Competitive programming',
    body: [
      'ICPC Preliminaries (2022, 2023). CUET IUPC (2022–2023). 300+ problems solved across 50+ contests.',
      pending('VERIFY CUET Computer Club, Apr 2022 – Dec 2023'),
    ],
    links: [
      { kind: 'codeforces', label: 'Codeforces', href: 'https://codeforces.com/profile/fahadkabir123', verify: true },
      { kind: 'codechef', label: 'CodeChef', href: 'https://www.codechef.com/users/fahadkabir123', verify: true },
    ],
    sources: ['CV-2026 (F22)', 'CV-old (F23, F25)'],
  },
  {
    id: 'algorithmic-thinking',
    title: 'Why this mattered',
    body: [
      // Describes the maze itself, so it's true without confirmation; the
      // framing sentence below waits on the author.
      'The maze on the floor lights its shortest path, found with breadth-first search.',
      pending(
        'CONFIRM framing sentence: "Algorithmic thinking I still use in systems work: state machines, scheduling, resource allocation."'
      ),
    ],
    sources: ['Interpretive framing — not a claim of specific results'],
  },
  {
    id: 'team-contests',
    title: 'Team contests',
    body: [
      'ICPC Preliminaries and CUET IUPC are team contests, played in teams of three.',
      pending('ADD team contest details — team name, members, results (optional)'),
    ],
    sources: ['SOP §05', 'CV-2026 (F22) — ICPC-format contests are team events'],
  },
  {
    id: 'physics-informed-ml',
    title: 'Physics-informed ML, in one line',
    body: [
      pending(
        'CONFIRM wording: "The network is trained to fit data and to satisfy the governing flow equations at the same time."'
      ),
    ],
    sources: ['Interpretive framing'],
  },
  {
    id: 'small-data',
    title: 'Why small data is the hard part',
    body: [
      'With few experimental points, how features are built and how models are validated matters as much as the model itself.',
    ],
    sources: ['Restates F27’s stated focus'],
  },

  // ---- Software Workshop (§05.2 Zone 4) ----
  {
    id: 'backends-apis',
    title: 'Backends & APIs',
    body: [
      'Built the Hono.js backend for TensorCode on Cloudflare’s edge stack — D1 storage, R2 file handling, KV session state — powering in-browser PyTorch and CUDA execution.',
    ],
    tech: ['hono', 'cloudflare-workers', 'cloudflare-d1', 'cloudflare-r2', 'cloudflare-kv'],
    links: [{ kind: 'product', label: 'tensorcode.poridhi.io', href: 'https://tensorcode.poridhi.io' }],
    more: { href: '/experience#junior-software-engineer', label: 'Full role on the Experience page' },
    sources: ['CV-2026 (F16)'],
  },
  {
    id: 'frontend-docs',
    title: 'Frontend & docs',
    body: [
      'Developed React frontend components for TensorCode and authored the team’s architecture and deployment documentation, the onboarding reference for new engineers.',
    ],
    tech: ['react', 'typescript'],
    more: { href: '/experience#junior-software-engineer', label: 'Full role on the Experience page' },
    sources: ['CV-2026 (F17)'],
  },

  // ---- GPU Data Center pipeline (§05.2 Zone 5), in data-flow order ----
  {
    id: 'dc-gpu',
    title: 'The GPU',
    body: [
      'Each RTX 4090 is partitioned into 6 × 8 GB VRAM slices with hard isolation, using HAMi GPU virtualization.',
      'Why: Kubernetes time-slicing could not provide that isolation.',
    ],
    tech: ['hami', 'gpu-partitioning', 'kubernetes'],
    more: { href: '/experience#junior-software-engineer', label: 'Full role on the Experience page' },
    sources: ['CV-2026 (F12)'],
  },
  {
    id: 'dc-container',
    title: 'Container',
    body: [
      'GPU sessions run from ECR-hosted TensorFlow images, with sidecar containers for runtime isolation.',
      'Multi-arch Docker builds go back to the internship’s authentication service.',
    ],
    tech: ['docker', 'aws-ecr'],
    more: { href: '/experience#junior-software-engineer', label: 'Full role on the Experience page' },
    sources: ['CV-2026 (F13, F9)'],
  },
  {
    id: 'dc-orchestration',
    title: 'Orchestration',
    body: [
      'Co-engineered the platform’s migration to a bare-metal Kubernetes cluster with HAMi GPU virtualization: GPU session launch time went from 10–15 min to 3–5 min, about 70% faster.',
      'Least-privilege access with per-microservice Kubernetes RBAC.',
      pending('CONFIRM which cluster used k3s — optional'),
    ],
    tech: ['kubernetes', 'hami', 'k8s-rbac'],
    more: { href: '/experience#junior-software-engineer', label: 'Full role on the Experience page' },
    sources: ['CV-2026 (F11, F15)'],
  },
  {
    id: 'dc-session',
    title: 'Session lifecycle',
    body: [
      'Designed the PostgreSQL schema and REST API governing GPU slice allocation and session lifecycle, with safe state transitions across concurrent Temporal workflows.',
    ],
    tech: ['postgresql', 'rest-apis', 'temporal'],
    more: { href: '/experience#junior-software-engineer', label: 'Full role on the Experience page' },
    sources: ['CV-2026 (F14)'],
  },
  {
    id: 'dc-cloud',
    title: 'Cloud',
    body: [
      'Architected the initial AWS stack for on-demand GPU sessions: g4dn EC2 instances with custom AMIs, ECR-hosted TensorFlow images, and JuiceFS-on-S3 session persistence.',
      'Infrastructure as code with Pulumi and Terraform.',
    ],
    tech: ['aws-ec2', 'aws-s3', 'aws-ecr', 'juicefs', 'pulumi', 'terraform'],
    more: { href: '/experience#junior-software-engineer', label: 'Full role on the Experience page' },
    sources: ['CV-2026 (F13, F33)'],
  },
  {
    id: 'dc-operations',
    title: 'Operations',
    body: ['Operated production cluster services: PostgreSQL, Temporal, and Headlamp monitoring.'],
    tech: ['postgresql', 'temporal', 'headlamp'],
    more: { href: '/experience#junior-software-engineer', label: 'Full role on the Experience page' },
    sources: ['CV-2026 (F15)'],
  },
]
