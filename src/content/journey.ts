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
        opens: { type: 'project', id: 'tensorcode' },
      },
      {
        objectId: 'monitor-frontend',
        tooltip: 'Frontend & docs',
        opens: { type: 'project', id: 'tensorcode' },
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
        opens: { type: 'experience', id: 'poridhi', highlight: ['junior-software-engineer'] },
      },
      {
        objectId: 'container-crate',
        tooltip: 'Container',
        opens: { type: 'experience', id: 'poridhi', highlight: ['junior-software-engineer'] },
      },
      {
        objectId: 'k8s-console',
        tooltip: 'Orchestration',
        opens: { type: 'experience', id: 'poridhi', highlight: ['junior-software-engineer'] },
      },
      {
        objectId: 'workflow-conveyor',
        tooltip: 'Session lifecycle',
        opens: { type: 'experience', id: 'poridhi', highlight: ['junior-software-engineer'] },
      },
      {
        objectId: 'workspace-pod',
        tooltip: 'AI workspace',
        opens: { type: 'project', id: 'ai-studio' },
      },
      {
        objectId: 'cloud-gate',
        tooltip: 'Cloud',
        opens: { type: 'experience', id: 'poridhi', highlight: ['junior-software-engineer'] },
      },
      {
        objectId: 'tensor-reactor',
        tooltip: 'TensorCode',
        opens: { type: 'project', id: 'tensorcode' },
      },
      {
        objectId: 'ops-desk',
        tooltip: 'Operations',
        opens: { type: 'experience', id: 'poridhi', highlight: ['junior-software-engineer'] },
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
        opens: { type: 'research', id: 'pinn-naca0012-thesis' },
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
    objects: [],
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
      pending(
        'CONFIRM framing sentence: "Algorithmic thinking I still use in systems work: state machines, scheduling, resource allocation."'
      ),
    ],
    sources: ['Interpretive framing — not a claim of specific results'],
  },
  {
    id: 'team-contests',
    title: 'Team contests',
    body: [pending('ADD team contest details — optional')],
    sources: ['SOP §05'],
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
]
