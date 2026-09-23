import Link from 'next/link'
import { TextAnimation } from './animation/TextAnimation'
import {
  FaTrophy,
  FaMedal,
  FaFlask,
  FaGraduationCap,
  FaCamera,
} from 'react-icons/fa'
import { GiDiamondTrophy } from 'react-icons/gi'
import { SiKubernetes } from 'react-icons/si'

const typeStyles = {
  milestone: { dot: 'bg-sky-400', badge: 'border-sky-500 text-sky-300' },
  achievement: {
    dot: 'bg-yellow-400',
    badge: 'border-yellow-500 text-yellow-300',
  },
  work: { dot: 'bg-purple-400', badge: 'border-purple-500 text-purple-300' },
  research: {
    dot: 'bg-fuchsia-400',
    badge: 'border-fuchsia-500 text-fuchsia-300',
  },
  future: { dot: 'bg-zinc-500', badge: 'border-zinc-600 text-zinc-400' },
}

const milestones = [
  {
    year: '2022',
    type: 'milestone',
    icon: FaGraduationCap,
    title: 'Started B.Sc. in Mechanical Engineering',
    org: 'CUET, Chattogram',
    tag: 'THE ORIGIN STORY',
    desc: 'Where it all began — before the cloud infrastructure and the GPU platforms, an engineering foundation.',
    hasPhotoSlot: true,
  },
  {
    year: '2022 — 2023',
    type: 'achievement',
    icon: GiDiamondTrophy,
    title: 'ICPC Preliminaries & CUET IUPC',
    org: 'Competitive Programming',
    tag: '300+ PROBLEMS · 50+ CONTESTS',
    desc: 'The problem-solving habit that started here still shapes how systems get designed today.',
    hasPhotoSlot: true,
  },
  {
    year: 'May 2025',
    type: 'work',
    icon: FaMedal,
    title: 'Intern Software Engineer',
    org: 'Poridhi.io',
    tag: 'LVL 01 · QUEST CLEARED',
    desc: 'Prototyped an authentication service (Flask, PostgreSQL, multi-arch Docker) and a Pulumi IaC workflow provisioning AWS EC2 instances and load balancers.',
  },
  {
    year: 'Jun 2025 — Present',
    type: 'work',
    icon: SiKubernetes,
    title: 'Junior Software Engineer',
    org: 'Poridhi.io',
    tag: 'LVL 02 · ACTIVE QUEST',
    desc: 'Co-engineered the migration to bare-metal Kubernetes with HAMi GPU virtualization, cutting GPU session launch time by ~70% (10–15 min → 3–5 min). Architected the AWS session stack, designed the PostgreSQL schema and REST API governing GPU slice allocation across concurrent Temporal workflows, and built the Hono.js/Cloudflare backend powering TensorCode, an in-browser PyTorch/CUDA IDE.',
    highlights: ['−70% LAUNCH TIME', 'AWS + KUBERNETES', 'TEMPORAL WORKFLOWS', 'EDGE BACKEND'],
  },
  {
    year: '2025',
    type: 'achievement',
    icon: FaTrophy,
    title: 'Champion — Break The Monolith Hackathon',
    org: 'Microservices ride-sharing platform',
    tag: 'NODE.JS · POSTGRESQL · REDIS · RABBITMQ',
    desc: 'Took first place building a microservices ride-sharing platform under contest pressure.',
    hasPhotoSlot: true,
  },
  {
    year: '2025',
    type: 'achievement',
    icon: FaMedal,
    title: 'Rising Team — API Avenger Microservice Hackathon',
    org: 'CUET',
    tag: 'IDEMPOTENT WEBHOOKS · ASYNC EVENTS',
    desc: 'Built a donation backend handling idempotent webhooks and asynchronous event processing.',
    hasPhotoSlot: true,
  },
  {
    year: '2025',
    type: 'achievement',
    icon: FaMedal,
    title: 'AI Engineering Hackathon',
    org: 'Brain Station 23',
    tag: 'QUANTIZED MINI-LLM · BERT',
    desc: 'Built intent-based product search with a quantized mini-LLM, BERT, and a full observability stack.',
    hasPhotoSlot: true,
  },
  {
    year: 'Ongoing',
    type: 'research',
    icon: FaFlask,
    title: 'Parameter-Efficient Adaptation of a PINN Solver',
    org: 'Thesis · Supervisor: Prof. Dr. Md. Abu Mowazzem Hossain, CUET',
    tag: 'PYTORCH · RESEARCH INTEREST',
    desc: 'Building a physics-informed neural network solver for flow over the NACA 0012 airfoil, using LoRA-style parameter-efficient fine-tuning to adapt it to out-of-distribution, high-incidence conditions without full retraining.',
  },
  {
    year: '2026 (expected)',
    type: 'future',
    icon: FaGraduationCap,
    title: 'B.Sc. Graduation',
    org: 'CUET',
    tag: 'NEXT UP',
    desc: 'Wrapping up the mechanical engineering degree alongside the software engineering career already underway.',
  },
]

const Journey = () => {
  return (
    <div id="journey" className="mx-4 md:mx-8 text-white my-12 md:my-32">
      <div className="border-t border-white md:mx-5"></div>

      <div className="flex items-center justify-between py-4 text-white  md:mx-8 ">
        <div className="flex flex-row justify-around  w-1/2">
          <p>03/</p>
          <div className="flex gap-1">
            <Link
              href="#"
              className="flex items-center text-white hover:text-white"
            >
              <TextAnimation text="JOURNEY" size={'normal'} font={'light'} />
            </Link>
          </div>
        </div>
        <p className=" flex  w-1/2 justify-end pr-12">/05</p>
      </div>

      <p className="text-center text-[10px] md:text-xs text-zinc-400 tracking-widest mt-2 mb-10">
        FROM MECHANICAL ENGINEERING STUDENT TO CLOUD &amp; GPU PLATFORM ENGINEER
      </p>

      <div className="relative">
        {/* mobile timeline: single left rail */}
        <div className="md:hidden relative pl-8">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-zinc-700" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <TimelineCard key={i} milestone={m} />
            ))}
          </div>
        </div>

        {/* desktop timeline: centered rail, alternating sides */}
        <div className="hidden md:block relative">
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-zinc-700 -translate-x-1/2" />
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="grid items-start"
                style={{ gridTemplateColumns: '1fr 2.5rem 1fr' }}
              >
                <div className={i % 2 === 0 ? '' : 'invisible'}>
                  {i % 2 === 0 && (
                    <TimelineCard milestone={m} align="right" />
                  )}
                </div>
                <div className="flex justify-center pt-6">
                  <span
                    className={`h-3 w-3 rounded-full ${typeStyles[m.type].dot} ring-4 ring-black`}
                  />
                </div>
                <div className={i % 2 === 1 ? '' : 'invisible'}>
                  {i % 2 === 1 && <TimelineCard milestone={m} align="left" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const TimelineCard = ({ milestone, align }) => {
  const style = typeStyles[milestone.type]
  return (
    <div
      className={`border border-zinc-700 rounded-3xl p-5 md:p-6 backdrop-blur-sm hover:border-purple-500 transition-colors duration-300 ${
        milestone.type === 'future' ? 'border-dashed opacity-80' : ''
      }`}
    >
      <div
        className={`flex items-center gap-3 flex-wrap ${
          align === 'right' ? 'md:justify-end' : ''
        }`}
      >
        <milestone.icon className="text-lg text-zinc-300 shrink-0" />
        <span className="text-xs text-zinc-400 tracking-wide">
          {milestone.year}
        </span>
        <span
          className={`text-[10px] border rounded-full px-2.5 py-0.5 tracking-wider ${style.badge}`}
        >
          {milestone.tag}
        </span>
      </div>

      <p
        className={`text-base md:text-lg font-semibold mt-2 ${
          align === 'right' ? 'md:text-right' : ''
        }`}
      >
        {milestone.title}
      </p>
      <p
        className={`text-xs text-zinc-400 mt-0.5 ${
          align === 'right' ? 'md:text-right' : ''
        }`}
      >
        {milestone.org}
      </p>
      <p
        className={`text-sm text-zinc-300 mt-3 ${
          align === 'right' ? 'md:text-right' : ''
        }`}
      >
        {milestone.desc}
      </p>

      {milestone.highlights && (
        <div
          className={`flex flex-wrap gap-2 mt-3 ${
            align === 'right' ? 'md:justify-end' : ''
          }`}
        >
          {milestone.highlights.map((h) => (
            <span
              key={h}
              className="text-[10px] border border-zinc-700 rounded-full px-2.5 py-1 text-purple-300 tracking-wider"
            >
              {h}
            </span>
          ))}
        </div>
      )}

      {milestone.hasPhotoSlot && (
        <div
          className={`mt-4 border border-dashed border-zinc-700 rounded-2xl h-24 flex flex-col items-center justify-center gap-1 text-zinc-600 ${
            align === 'right' ? 'md:ml-auto' : ''
          }`}
        >
          <FaCamera className="text-lg" />
          <p className="text-[10px] tracking-widest">PHOTO COMING SOON</p>
        </div>
      )}
    </div>
  )
}

export default Journey
