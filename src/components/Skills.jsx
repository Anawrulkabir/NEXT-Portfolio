import Link from 'next/link'
import GsapMagnetic from './animation/GsapAnimate'
import { TextAnimation } from './animation/TextAnimation'
import {
  SiKubernetes,
  SiDocker,
  SiAmazonaws,
  SiTerraform,
  SiTemporal,
  SiCloudflare,
  SiGithubactions,
  SiPython,
  SiGo,
  SiTypescript,
  SiNodedotjs,
  SiHono,
  SiFlask,
  SiPostgresql,
  SiRedis,
  SiMongodb,
  SiPytorch,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiFramer,
  SiGit,
} from 'react-icons/si'

const skillTree = [
  {
    category: 'CLOUD & INFRA',
    tagline: 'CORE CLASS',
    skills: [
      { name: 'Kubernetes', Icon: SiKubernetes, level: 90, color: '#326CE5' },
      { name: 'Docker', Icon: SiDocker, level: 88, color: '#2496ED' },
      { name: 'AWS', Icon: SiAmazonaws, level: 85, color: '#FF9900' },
      { name: 'Temporal', Icon: SiTemporal, level: 75, color: '#B180D7' },
      { name: 'Terraform', Icon: SiTerraform, level: 65, color: '#7B42BC' },
      { name: 'Cloudflare', Icon: SiCloudflare, level: 70, color: '#F38020' },
      {
        name: 'GitHub Actions',
        Icon: SiGithubactions,
        level: 65,
        color: '#2088FF',
      },
    ],
  },
  {
    category: 'LANGUAGES & BACKEND',
    tagline: 'MAIN WEAPONS',
    skills: [
      { name: 'Python', Icon: SiPython, level: 90, color: '#3776AB' },
      { name: 'TypeScript', Icon: SiTypescript, level: 80, color: '#3178C6' },
      { name: 'Go', Icon: SiGo, level: 60, color: '#00ADD8' },
      { name: 'Node.js', Icon: SiNodedotjs, level: 85, color: '#339933' },
      { name: 'Hono.js', Icon: SiHono, level: 70, color: '#FF6B00' },
      { name: 'Flask', Icon: SiFlask, level: 65, color: '#A78BFA' },
    ],
  },
  {
    category: 'DATA & ML',
    tagline: 'SIDE SKILLS',
    skills: [
      { name: 'PostgreSQL', Icon: SiPostgresql, level: 85, color: '#4169E1' },
      { name: 'Redis', Icon: SiRedis, level: 72, color: '#DC382D' },
      { name: 'MongoDB', Icon: SiMongodb, level: 75, color: '#47A248' },
      { name: 'PyTorch', Icon: SiPytorch, level: 65, color: '#EE4C2C' },
    ],
  },
  {
    category: 'FRONTEND & PRODUCT',
    tagline: 'CRAFTED THIS SITE',
    skills: [
      { name: 'React', Icon: SiReact, level: 85, color: '#61DAFB' },
      { name: 'Next.js', Icon: SiNextdotjs, level: 85, color: '#FFFFFF' },
      {
        name: 'Tailwind CSS',
        Icon: SiTailwindcss,
        level: 85,
        color: '#38BDF8',
      },
      { name: 'Framer Motion', Icon: SiFramer, level: 75, color: '#0055FF' },
      { name: 'Git', Icon: SiGit, level: 85, color: '#F05032' },
    ],
  },
]

const Skills = () => {
  return (
    <div id="skills" className="mx-4 md:mx-8 text-white my-12 md:my-32 ">
      <div className="border-t border-white md:mx-5"></div>

      <div className="flex items-center justify-between py-4 text-white  md:mx-8 ">
        <div className="flex flex-row justify-around  w-1/2">
          <p>05/</p>

          <div className="flex gap-1">
            {/* mobile */}
            <Link
              href="#"
              className="flex md:hidden items-center text-white hover:text-white"
            >
              <TextAnimation text="SKILLS" size={'normal'} font={'light'} />
            </Link>

            {/* desktop */}
            <Link
              href="#"
              className="hidden md:flex items-center text-white hover:text-white"
            >
              <TextAnimation
                text="SKILL&nbsp;TREE"
                size={'normal'}
                font={'light'}
              />
            </Link>
          </div>
        </div>

        <p className=" flex  w-1/2 justify-end pr-12">/05</p>
      </div>

      <div className="relative border-[0.5px] rounded-3xl border-zinc-500 my-4 md:my-12 mx-0 md:mx-12 p-4 md:p-8 space-y-8">
        <div className="flex flex-col items-center gap-1 pb-2">
          <p className="text-zinc-200 opacity-15 font-bold text-3xl md:text-5xl text-center">
            SKILL TREE
          </p>
          <p className="text-zinc-100 opacity-15 font-bold text-3xl md:text-5xl text-center">
            LEVELED UP FOR THE CLOUD
          </p>
        </div>

        {skillTree.map((group) => (
          <div key={group.category}>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm md:text-base font-semibold tracking-wide">
                {group.category}
              </p>
              <span className="text-[10px] border border-purple-600 rounded-full px-3 py-1 tracking-wider text-purple-300">
                {group.tagline}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              {group.skills.map((skill) => (
                <GsapMagnetic key={skill.name}>
                  <div className="flex flex-col gap-2 border-[0.5px] border-zinc-400 rounded-2xl w-28 md:w-32 p-3 backdrop-blur-sm items-center">
                    <skill.Icon
                      style={{ color: skill.color }}
                      className="text-3xl"
                    />
                    <p className="text-xs text-gray-300 text-center">
                      {skill.name}
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 tracking-wider">
                      LVL {Math.round(skill.level / 10)}
                    </p>
                  </div>
                </GsapMagnetic>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills
