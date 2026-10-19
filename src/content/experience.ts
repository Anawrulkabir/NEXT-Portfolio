/**
 * Experience content — see docs/PORTFOLIO_REDESIGN.md §06.4, §03.7
 * Bullets are the current SWE CV's own wording (Oct 2026); no new claims added.
 */
import type { Experience } from './types'

export const experience: Experience[] = [
  {
    id: 'poridhi',
    org: 'Poridhi.io',
    location: 'Remote, Bangladesh',
    roles: [
      {
        id: 'junior-software-engineer',
        title: 'Junior Software Engineer',
        dates: { start: '2025-06', end: '2026-07' },
        groups: [
          {
            product: 'AI Studio',
            productUrl: 'https://ai.poridhi.io',
            bullets: [
              'Developed the Next.js frontend where users configure memory, GPU and editor (Jupyter, VS Code or custom) for each session.',
              'Partnered with the team to migrate the platform from AWS to a Kubernetes cluster on the company GPU server.',
              'Cut session launch time by about 70%, from 10–15 minutes to 3–5.',
              'Enabled six users to share 48 GB of VRAM at once by giving each an isolated 8 GB slice through HAMi.',
              'Brought the backend services, database and workflow engine online on the new cluster, each with its own access controls.',
              'Maintained and extended the earlier AWS version, which launched EC2 GPU instances on demand.', // design docs: up to 3 sessions shared each instance,
            ],
          },
          {
            product: 'TensorCode',
            productUrl: 'https://tensorcode.poridhi.io',
            bullets: [
              'Owned the frontend from the first version across coding problems, GPU courses and the browser IDE.',
              'Co-developed TensorRAG, a visual tool for building ML training pipelines from Python steps and running them step by step.',
              'Created the workflow that brings lab and problem content from GitHub into the platform.',
              'Connected the frontend to the service that runs user code on GPUs and managed its Kubernetes deployments.',
            ],
          },
          {
            product: 'Other work',
            bullets: [
              'Contributed to an internal platform that provisions Kubernetes clusters on demand.',
              'Launched and maintained the Puku AI public website and internal admin tools and ran its subscription management.',
              'Onboarded and guided new interns, defining their first tasks and assigning project work.',
            ],
          },
        ],
        tech: ['nextjs', 'react', 'kubernetes', 'hami', 'temporal', 'postgresql', 'docker', 'aws-ec2'],
      },
      {
        id: 'intern-software-engineer',
        title: 'Intern Software Engineer',
        dates: { start: '2025-05', end: '2025-06' },
        // the current CVs list the internship only as dates; its work is being documented separately
        groups: [],
        tech: [],
      },
    ],
  },
]

/** Stable anchor for one CV bullet, e.g. `junior-software-engineer-ai-studio-1`. */
export const bulletAnchor = (roleId: string, product: string | undefined, index: number) =>
  `${roleId}-${(product ?? 'work').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`

/**
 * /hire "Infrastructure highlights" (§10.4): short restatements of CV
 * bullets, each linking to the bullet it comes from. Not metric cards.
 */
export const experienceHighlights = [
  {
    text: 'About 70% faster session launch (10–15 → 3–5 min)',
    anchor: bulletAnchor('junior-software-engineer', 'AI Studio', 2),
  },
  {
    text: '48 GB of VRAM shared as six isolated 8 GB slices (HAMi)',
    anchor: bulletAnchor('junior-software-engineer', 'AI Studio', 3),
  },
  {
    text: 'TensorCode frontend, from the first version',
    anchor: bulletAnchor('junior-software-engineer', 'TensorCode', 0),
  },
]

/** /hire snapshot (§10.2). Education is appended from profile.ts so its tense follows C1. */
export const hireSnapshot =
  'Software engineer at Poridhi.io from May 2025 to July 2026, on AI Studio (GPU workspaces for Jupyter and VS Code) and TensorCode (a browser platform for GPU programming).'
