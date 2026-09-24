/**
 * AI Studio's two launch paths, as the author described them (CV, Jul 2026,
 * plus his walkthrough): the first AWS stack and the bare-metal cluster.
 * Step lengths are illustrative; only the totals (10–15 min, 3–5 min) are real.
 */

export type Logo = 'you' | 'api' | 'postgresql' | 'temporal' | 'aws-ec2' | 'aws-ecr' | 'aws-s3' | 'kubernetes' | 'nvidia' | 'hami' | 'jupyter'
export type Node = { id: string; x: number; y: number; title: string; sub: string; logo: Logo; kind?: 'you' | 'svc' | 'data' | 'infra' | 'gpu' }
export type Group = { label: string; x: number; y: number; w: number; h: number; tone: 'aws' | 'k8s' | 'metal' }
export type Step = { from: string; to: string; text: string; weight: number }
export type Flow = {
  id: 'aws' | 'metal'
  label: string
  when: string
  total: string
  seconds: number
  nodes: Node[]
  groups: Group[]
  steps: Step[]
  notes: string[]
}

const shared: Node[] = [
  { id: 'you', x: 70, y: 215, title: 'You', sub: 'press Launch', logo: 'you', kind: 'you' },
  { id: 'api', x: 205, y: 215, title: 'AI Studio API', sub: 'REST', logo: 'api', kind: 'svc' },
  { id: 'pg', x: 345, y: 95, title: 'PostgreSQL', sub: 'sessions + slices', logo: 'postgresql', kind: 'data' },
  { id: 'temporal', x: 345, y: 215, title: 'Temporal', sub: 'launch workflow', logo: 'temporal', kind: 'svc' },
]

export const AWS: Flow = {
  id: 'aws',
  label: 'Before · AWS',
  when: '2025, first version',
  total: '10–15 min',
  seconds: 12,
  nodes: [
    ...shared,
    { id: 'ec2', x: 510, y: 215, title: 'EC2 g4dn', sub: 'custom AMI · T4', logo: 'aws-ec2', kind: 'infra' },
    { id: 'k8s', x: 665, y: 150, title: 'Kubernetes', sub: 'GPU node joins', logo: 'kubernetes', kind: 'infra' },
    { id: 'ecr', x: 510, y: 345, title: 'ECR', sub: 'TensorFlow image', logo: 'aws-ecr', kind: 'data' },
    { id: 's3', x: 665, y: 345, title: 'JuiceFS on S3', sub: 'your files', logo: 'aws-s3', kind: 'data' },
    { id: 'pod', x: 815, y: 215, title: 'IDE pod', sub: '+ sidecar', logo: 'jupyter', kind: 'gpu' },
  ],
  groups: [
    { label: 'AWS', x: 430, y: 60, w: 460, h: 340, tone: 'aws' },
    { label: 'Kubernetes cluster', x: 595, y: 95, w: 285, h: 175, tone: 'k8s' },
  ],
  steps: [
    { from: 'you', to: 'api', text: 'You press Launch. The API receives the request.', weight: 0.3 },
    { from: 'api', to: 'pg', text: 'A session row is written to PostgreSQL. Its state will move from pending to running.', weight: 0.3 },
    { from: 'api', to: 'temporal', text: 'Temporal runs the launch as a workflow, so a failure halfway is retried instead of leaving a half-made session.', weight: 0.4 },
    { from: 'temporal', to: 'ec2', text: 'A fresh g4dn instance boots from our custom AMI. This is the slow part: waiting for a whole new machine.', weight: 5 },
    { from: 'ec2', to: 'k8s', text: 'The instance joins the Kubernetes cluster as a GPU node.', weight: 1.6 },
    { from: 'ecr', to: 'k8s', text: 'The TensorFlow image is pulled from ECR onto the new node.', weight: 2 },
    { from: 's3', to: 'k8s', text: 'JuiceFS mounts your files from S3, so work survives after the session ends.', weight: 1 },
    { from: 'k8s', to: 'pod', text: 'The IDE container starts, with a sidecar container for runtime isolation.', weight: 0.8 },
    { from: 'pod', to: 'you', text: 'Your notebook link comes back. Total: 10–15 minutes.', weight: 0.3 },
  ],
  notes: ['One GPU instance per session', 'I set up this first stack'],
}

export const METAL: Flow = {
  id: 'metal',
  label: 'Now · bare metal',
  when: 'after the migration',
  total: '3–5 min',
  seconds: 4,
  nodes: [
    ...shared,
    { id: 'k8s', x: 520, y: 215, title: 'Kubernetes', sub: 'our own servers', logo: 'kubernetes', kind: 'infra' },
    { id: 'hami', x: 670, y: 110, title: 'HAMi', sub: 'GPU slicing', logo: 'hami', kind: 'svc' },
    { id: 'gpu', x: 670, y: 330, title: 'RTX 4090', sub: '6 slices × 8 GB', logo: 'nvidia', kind: 'gpu' },
    { id: 'pod', x: 815, y: 215, title: 'IDE pod', sub: 'hard 8 GB limit', logo: 'jupyter', kind: 'gpu' },
  ],
  groups: [{ label: 'Bare-metal server · Kubernetes', x: 440, y: 60, w: 450, h: 340, tone: 'metal' }],
  steps: [
    { from: 'you', to: 'api', text: 'You press Launch. The API receives the request.', weight: 0.3 },
    { from: 'api', to: 'pg', text: 'PostgreSQL finds a free GPU slice and reserves it. I designed this allocation schema and API.', weight: 0.5 },
    { from: 'api', to: 'temporal', text: 'Temporal runs the launch workflow and keeps session states consistent when many launch at once.', weight: 0.4 },
    { from: 'temporal', to: 'k8s', text: 'A pod is created on our own cluster. No new machine to wait for.', weight: 0.8 },
    { from: 'k8s', to: 'hami', text: 'HAMi picks a GPU that has a free 8 GB slice.', weight: 0.5 },
    { from: 'hami', to: 'gpu', text: 'The pod gets its own slice of an RTX 4090 with a hard 8 GB VRAM limit. Time-slicing alone couldn’t enforce that.', weight: 0.7 },
    { from: 'gpu', to: 'pod', text: 'The IDE container starts on the slice.', weight: 0.5 },
    { from: 'pod', to: 'you', text: 'Your notebook link comes back. Total: 3–5 minutes.', weight: 0.3 },
  ],
  notes: ['Headlamp for monitoring', 'Per-service Kubernetes RBAC'],
}

export const FLOWS = { aws: AWS, metal: METAL }
