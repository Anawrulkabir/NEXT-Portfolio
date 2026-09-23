/**
 * Experience content — see docs/PORTFOLIO_REDESIGN.md §06.4, §03.7
 * Bullets keep the CV's own wording; no new claims added.
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
        dates: { start: '2025-06', end: 'present' },
        groups: [
          {
            product: 'AI Studio',
            productUrl: 'https://ai.poridhi.io',
            bullets: [
              'Cut GPU session launch time by ~70% (10–15 min → 3–5 min) by co-engineering the platform’s migration to a bare-metal Kubernetes cluster with HAMi GPU virtualization, partitioning each RTX 4090 into 6×8GB VRAM slices with hard isolation that Kubernetes time-slicing could not provide.',
              'Architected the initial AWS stack for on-demand GPU sessions: g4dn EC2 instances with custom AMIs, ECR-hosted TensorFlow images, JuiceFS-on-S3 session persistence, and sidecar containers for runtime isolation.',
              'Designed the PostgreSQL schema and REST API governing GPU slice allocation and session lifecycle, guaranteeing safe state transitions across concurrent Temporal workflows.',
              'Operated production cluster services (PostgreSQL, Temporal, Headlamp monitoring) and enforced least-privilege access with per-microservice Kubernetes RBAC.',
            ],
          },
          {
            product: 'TensorCode',
            productUrl: 'https://tensorcode.poridhi.io',
            bullets: [
              'Built the Hono.js backend on Cloudflare’s edge stack (D1 storage, R2 file handling, KV session state) powering in-browser PyTorch and CUDA execution.',
              'Developed React frontend components and authored the team’s architecture and deployment documentation, serving as the onboarding reference for new engineers.',
            ],
          },
        ],
        tech: [
          'kubernetes',
          'hami',
          'docker',
          'aws-ec2',
          'aws-s3',
          'aws-ecr',
          'juicefs',
          'temporal',
          'postgresql',
          'headlamp',
          'k8s-rbac',
          'hono',
          'cloudflare-workers',
          'cloudflare-d1',
          'cloudflare-r2',
          'cloudflare-kv',
          'react',
          'pytorch',
          'cuda',
        ],
      },
      {
        id: 'intern-software-engineer',
        title: 'Intern Software Engineer',
        dates: { start: '2025-05', end: '2025-06' },
        groups: [
          {
            bullets: [
              'Prototyped an authentication service (Flask, PostgreSQL, multi-arch Docker) and a Pulumi IaC workflow provisioning AWS EC2 instances and load balancers.',
            ],
          },
        ],
        tech: ['flask', 'postgresql', 'docker', 'pulumi', 'aws-ec2'],
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
    text: '~70% faster GPU session launch (10–15 → 3–5 min)',
    anchor: bulletAnchor('junior-software-engineer', 'AI Studio', 0),
  },
  {
    text: 'RTX 4090 split into 6 × 8 GB isolated slices with HAMi',
    anchor: bulletAnchor('junior-software-engineer', 'AI Studio', 0),
  },
  {
    text: 'Edge backend for an in-browser PyTorch/CUDA IDE',
    anchor: bulletAnchor('junior-software-engineer', 'TensorCode', 0),
  },
]

/** /hire snapshot (§10.2). Education is appended from profile.ts so its tense follows C1. */
export const hireSnapshot =
  'Software engineer at Poridhi.io since May 2025, working on a multi-tenant GPU platform (bare-metal Kubernetes + AWS): GPU virtualization, session orchestration, backend services.'
