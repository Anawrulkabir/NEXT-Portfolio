/**
 * GPU Academy: short, game-like lessons about how AI Studio launches a GPU
 * session. Every fact comes from the author's CV (Jul 2026) and his own
 * description of the system.
 */

export type Choice = { kind: 'choice'; prompt: string; options: { text: string; logo?: string }[]; answer: number; why: string }
export type Order = { kind: 'order'; prompt: string; steps: string[]; why: string }
export type Match = { kind: 'match'; prompt: string; pairs: { job: string; tool: string; logo?: string }[]; why: string }
export type Sandbox = { kind: 'gpu'; prompt: string; why: string }
export type Race = { kind: 'race'; prompt: string; why: string }
export type Launch = { kind: 'launch'; prompt: string; why: string }
export type Exercise = Choice | Order | Match | Sandbox | Race | Launch

export type Lesson = { id: string; title: string; blurb: string; icon: string; color: string; exercises: Exercise[] }

export const LESSONS: Lesson[] = [
  {
    id: 'aws',
    title: 'The slow way',
    blurb: 'AI Studio’s first stack, on AWS',
    icon: '/media/logos/aws-ec2.svg',
    color: '#ff9600',
    exercises: [
      {
        kind: 'choice',
        prompt: 'In the first version, what did every new session get?',
        options: [{ text: 'Its own g4dn GPU instance', logo: '/media/logos/aws-ec2.svg' }, { text: 'A slice of a shared GPU', logo: '/media/logos/nvidia.svg' }, { text: 'A CPU-only container' }],
        answer: 0,
        why: 'Each session booted a fresh g4dn EC2 instance from a custom AMI. Simple, but a whole new machine every time.',
      },
      {
        kind: 'order',
        prompt: 'Put the AWS launch in order',
        steps: ['Temporal starts the launch workflow', 'A g4dn instance boots from the custom AMI', 'The instance joins the Kubernetes cluster', 'The TensorFlow image is pulled from ECR', 'The IDE starts, with its sidecar'],
        why: 'That’s the path a request took, from the workflow to a working notebook.',
      },
      {
        kind: 'choice',
        prompt: 'Which step made a launch take 10–15 minutes?',
        options: [{ text: 'Waiting for a brand-new GPU machine to boot' }, { text: 'Writing the session to PostgreSQL', logo: '/media/logos/postgresql.svg' }, { text: 'Opening the notebook link' }],
        answer: 0,
        why: 'Booting and preparing a new instance is slow. Everything else took seconds.',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Pick the tool',
    blurb: 'Which piece does which job?',
    icon: '/media/logos/temporal.svg',
    color: '#1cb0f6',
    exercises: [
      {
        kind: 'match',
        prompt: 'Match each job to the tool that does it',
        pairs: [
          { job: 'Retry a launch that failed halfway', tool: 'Temporal', logo: '/media/logos/temporal.svg' },
          { job: 'Remember which GPU slice is free', tool: 'PostgreSQL', logo: '/media/logos/postgresql.svg' },
          { job: 'Keep your files after the session', tool: 'JuiceFS on S3', logo: '/media/logos/aws-s3.svg' },
          { job: 'Store the TensorFlow image', tool: 'ECR', logo: '/media/logos/aws-ecr.svg' },
        ],
        why: 'Temporal runs launches as durable workflows. PostgreSQL holds sessions and slice allocation (I designed that schema and API). JuiceFS keeps work on S3. ECR hosts the images.',
      },
      {
        kind: 'choice',
        prompt: 'Many people press Launch at the same moment. What keeps two of them from getting the same slice?',
        options: [{ text: 'Safe state transitions in PostgreSQL, driven by Temporal workflows', logo: '/media/logos/postgresql.svg' }, { text: 'Luck' }, { text: 'A bigger GPU', logo: '/media/logos/nvidia.svg' }],
        answer: 0,
        why: 'Each session moves through well-defined states, so concurrent workflows can’t hand out the same slice twice.',
      },
    ],
  },
  {
    id: 'slices',
    title: 'Share one GPU',
    blurb: 'Six people, one RTX 4090',
    icon: '/media/logos/nvidia.svg',
    color: '#58cc02',
    exercises: [
      {
        kind: 'gpu',
        prompt: 'Run a greedy job under both setups. What happens to the neighbours?',
        why: 'Kubernetes time-slicing shares the GPU’s time, not its memory: one greedy job can crash everyone. HAMi gives each slice a hard 8 GB limit, so only the greedy job hits its wall.',
      },
      {
        kind: 'choice',
        prompt: 'So why did we use HAMi?',
        options: [{ text: 'Hard memory isolation between sessions', logo: '/media/logos/nvidia.svg' }, { text: 'It makes the GPU faster' }, { text: 'It replaces Kubernetes', logo: '/media/logos/kubernetes.svg' }],
        answer: 0,
        why: 'HAMi partitions each RTX 4090 into 6 × 8 GB slices with hard isolation, which time-slicing couldn’t provide.',
      },
    ],
  },
  {
    id: 'race',
    title: 'The race',
    blurb: 'AWS vs bare metal',
    icon: '/media/logos/kubernetes.svg',
    color: '#ce82ff',
    exercises: [
      { kind: 'race', prompt: 'Launch both at once', why: 'On our own cluster there’s no machine to wait for: a pod lands on a free slice.' },
      {
        kind: 'choice',
        prompt: '10–15 minutes down to 3–5. Roughly how much faster is that?',
        options: [{ text: 'About 70%' }, { text: 'About 10%' }, { text: 'About 5 times slower' }],
        answer: 0,
        why: 'Session launch time dropped by about 70% after the migration to bare-metal Kubernetes with HAMi.',
      },
    ],
  },
  {
    id: 'launch',
    title: 'Your turn',
    blurb: 'Launch a real-looking session',
    icon: '/media/logos/jupyter.svg',
    color: '#ff4b4b',
    exercises: [{ kind: 'launch', prompt: 'You know how it works. Now launch one.', why: 'Pick a GPU slice, CPU, memory and an IDE, and get a notebook.' }],
  },
]
