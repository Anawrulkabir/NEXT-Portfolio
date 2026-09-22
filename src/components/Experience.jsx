import Link from 'next/link'
import GsapAnimate from './animation/GsapAnimate'
import { TextAnimation } from './animation/TextAnimation'
import { FaTrophy, FaMedal, FaFlask, FaCogs, FaBrain } from 'react-icons/fa'
import { GiDiamondTrophy } from 'react-icons/gi'
import { SiKubernetes } from 'react-icons/si'

const questLog = [
  {
    role: 'Junior Software Engineer',
    org: 'Poridhi.io',
    period: 'Jun 2025 — Present',
    level: 'LVL 02',
    status: 'ACTIVE QUEST',
    highlights: [
      {
        stat: '−70% LAUNCH TIME',
        detail:
          'Co-engineered the migration to a bare-metal Kubernetes cluster with HAMi GPU virtualization — partitioning each RTX 4090 into 6×8GB VRAM slices, cutting GPU session launch from 10–15 min to 3–5 min.',
      },
      {
        stat: 'AWS STACK',
        detail:
          'Architected the on-demand GPU session stack: g4dn EC2 instances, custom AMIs, ECR-hosted TensorFlow images, and JuiceFS-on-S3 session persistence.',
      },
      {
        stat: 'SCHEMA + API',
        detail:
          'Designed the PostgreSQL schema and REST API governing GPU slice allocation and session lifecycle, guaranteeing safe state transitions across concurrent Temporal workflows.',
      },
      {
        stat: 'EDGE BACKEND',
        detail:
          'Built the Hono.js backend on Cloudflare (D1, R2, KV) powering TensorCode, an in-browser IDE running live PyTorch/CUDA execution.',
      },
    ],
  },
  {
    role: 'Intern Software Engineer',
    org: 'Poridhi.io',
    period: 'May 2025 — Jun 2025',
    level: 'LVL 01',
    status: 'QUEST CLEARED',
    highlights: [
      {
        stat: 'AUTH SERVICE',
        detail:
          'Prototyped an authentication service with Flask, PostgreSQL, and multi-arch Docker.',
      },
      {
        stat: 'IaC',
        detail:
          'Built a Pulumi infrastructure-as-code workflow provisioning AWS EC2 instances and load balancers.',
      },
    ],
  },
]

const achievements = [
  {
    icon: FaTrophy,
    title: 'Champion',
    desc: 'Break The Monolith Hackathon (2025) — microservices ride-sharing platform',
  },
  {
    icon: FaMedal,
    title: 'Rising Team',
    desc: 'API Avenger Microservice Hackathon, CUET (2025) — idempotent webhook backend',
  },
  {
    icon: FaMedal,
    title: 'Finalist',
    desc: 'AI Engineering Hackathon, Brain Station 23 — intent search with a quantized mini-LLM',
  },
  {
    icon: GiDiamondTrophy,
    title: '300+ Problems',
    desc: 'ICPC Preliminaries (2022, 2023) · CUET IUPC · 50+ contests',
  },
]

const Experience = () => {
  return (
    <div id="experience" className="mx-4 md:mx-8 text-white my-12 md:my-32">
      <div className="border-t border-white md:mx-5"></div>

      <div className="flex items-center justify-between py-4 text-white  md:mx-8 ">
        <div className="flex flex-row justify-around  w-1/2">
          <p>03/</p>
          <div className="flex gap-1">
            <Link
              href="#"
              className="flex md:hidden items-center text-white hover:text-white"
            >
              <TextAnimation text="XP" size={'normal'} font={'light'} />
            </Link>
            <Link
              href="#"
              className="hidden md:flex items-center text-white hover:text-white"
            >
              <TextAnimation text="EXPERIENCE" size={'normal'} font={'light'} />
            </Link>
          </div>
        </div>
        <p className=" flex  w-1/2 justify-end pr-12">/05</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] md:text-xs text-zinc-300 tracking-widest mt-2 mb-8">
        <span className="flex items-center gap-1.5 border border-zinc-700 rounded-full px-3 py-1.5">
          <SiKubernetes className="text-sky-400" /> CLOUD &amp; KUBERNETES
        </span>
        <span className="flex items-center gap-1.5 border border-zinc-700 rounded-full px-3 py-1.5">
          <FaBrain className="text-fuchsia-400" /> ML RESEARCH
        </span>
        <span className="flex items-center gap-1.5 border border-zinc-700 rounded-full px-3 py-1.5">
          <FaCogs className="text-orange-400" /> MECHANICAL ENGINEER
        </span>
        <span className="border border-purple-600 rounded-full px-3 py-1.5">
          GUILD: PORIDHI.IO
        </span>
      </div>

      {/* quest timeline */}
      <div className="space-y-6 md:mx-8">
        {questLog.map((quest) => (
          <div
            key={quest.role}
            className="border border-zinc-700 rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:border-purple-500 transition-colors duration-300"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xl md:text-2xl font-semibold relative z-20 bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
                  {quest.role} — {quest.org}
                </p>
                <p className="text-xs text-zinc-400 mt-1 tracking-wide">
                  {quest.period}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] border border-purple-600 rounded-full px-3 py-1 tracking-wider">
                  {quest.level}
                </span>
                <span className="text-[10px] border border-zinc-600 rounded-full px-3 py-1 tracking-wider text-zinc-300">
                  {quest.status}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {quest.highlights.map((h) => (
                <div
                  key={h.stat}
                  className="border border-zinc-800 rounded-2xl p-4 bg-white/5"
                >
                  <p className="text-xs font-bold text-purple-300 tracking-wider mb-1">
                    {h.stat}
                  </p>
                  <p className="text-sm text-zinc-300">{h.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* research side quest */}
      <div className="mt-6 md:mx-8">
        <div className="border border-zinc-700 rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:border-fuchsia-500 transition-colors duration-300">
          <div className="flex flex-wrap items-center gap-3">
            <FaFlask className="text-2xl text-fuchsia-400" />
            <p className="text-lg md:text-xl font-semibold">
              SIDE QUEST — RESEARCH
            </p>
            <span className="text-[10px] border border-fuchsia-500 rounded-full px-3 py-1 md:ml-auto tracking-wider">
              ONGOING THESIS
            </span>
          </div>
          <p className="mt-4 text-sm md:text-base text-zinc-300">
            <span className="text-white font-medium">
              Parameter-Efficient Adaptation of a PINN Solver for
              High-Incidence Airfoil Flow
            </span>{' '}
            — building a physics-informed neural network solver (PyTorch) for
            flow over the NACA 0012 airfoil, using LoRA-style
            parameter-efficient fine-tuning to adapt it to out-of-distribution,
            high-incidence conditions without full retraining.
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Supervisor: Prof. Dr. Md. Abu Mowazzem Hossain, CUET
          </p>
        </div>
      </div>

      {/* achievements unlocked */}
      <div className="mt-10 md:mx-8">
        <p className="text-sm tracking-widest text-zinc-400 mb-4 text-center md:text-left">
          ACHIEVEMENTS UNLOCKED
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((a) => (
            <GsapAnimate key={a.title}>
              <div className="border border-zinc-700 rounded-2xl p-4 flex flex-col items-center text-center gap-2 backdrop-blur-sm h-full">
                <a.icon className="text-3xl text-yellow-400" />
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-[11px] text-zinc-400">{a.desc}</p>
              </div>
            </GsapAnimate>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Experience
