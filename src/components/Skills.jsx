'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const technologies = [
  {
    name: 'HTML',
    icon: 'https://www.w3.org/html/logo/downloads/HTML5_Logo_256.png',
  },
  {
    name: 'CSS',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg',
  },
  {
    name: 'JavaScript',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
  },
  {
    name: 'React',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  },
  {
    name: 'Node.js',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg',
  },
  {
    name: 'Express',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png',
  },
  {
    name: 'MongoDB',
    icon: 'https://www.mongodb.com/assets/images/global/favicon.ico',
  },
  {
    name: 'Next.js',
    icon: 'https://nextjs.org/static/favicon/favicon.ico',
  },
  {
    name: 'Git',
    icon: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png',
  },
  {
    name: 'GitHub',
    icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  },
  {
    name: 'Bootstrap',
    icon: 'https://getbootstrap.com/docs/5.1/assets/img/bootstrap-icons.png',
  },
  {
    name: 'Tailwind CSS',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
  },
  {
    name: 'TypeScript',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg',
  },
  {
    name: 'Swiper.js',
    icon: 'https://swiperjs.com/images/shared/swiper-logo.svg',
  },
  {
    name: 'Chart.js',
    icon: 'https://www.chartjs.org/img/chartjs-logo.svg',
  },
  {
    name: 'Google Charts',
    icon: 'https://www.gstatic.com/images/branding/product/2x/google_96dp.png',
  },
  {
    name: 'Framer Motion',
    icon: 'https://raw.githubusercontent.com/framer/motion/main/.github/assets/logo.svg',
  },
  {
    name: 'TanStack Query',
    icon: 'https://raw.githubusercontent.com/TanStack/query/main/.github/assets/logo.svg',
  },
  {
    name: 'Hook Form',
    icon: 'https://react-hook-form.com/images/logo.svg',
  },
  {
    name: 'ShadCN UI',
    icon: 'https://raw.githubusercontent.com/shadcn/ui/main/public/icon.png',
  },
  {
    name: 'DaisyUI',
    icon: 'https://raw.githubusercontent.com/saadeghi/daisyui/main/static/media/logo.svg',
  },
  {
    name: 'MUI',
    icon: 'https://v4.mui.com/static/logo.png',
  },
]

const Skills = () => {
  const ref = useRef(null)
  return (
    <div className="mx-8">
      <div className="border-t border-white mx-5"></div>
      <div className="flex items-center justify-between py-4 text-white  mx-8">
        <div className="flex flex-row justify-around  w-1/2">
          <p>04/</p>

          <div className="flex gap-1">
            <Link href="#">CAPABILITIES</Link>
          </div>
        </div>

        <p className=" flex  w-1/2 justify-end pr-12">/04</p>
      </div>

      <div
        className=" h-[65vh] border-[0.5px] rounded-3xl mx-12 border-zinc-500 my-12 text-white grid grid-rows-5  grid-cols-12 gap-4 p-3"
        ref={ref}
      >
        {technologies.map((tech) => (
          <motion.div
            drag
            dragConstraints={ref}
            whileDrag={{
              scale: 2,
              backgroundColor: 'whitesmoke',
            }}
            onMouseOver={{ scale: 1.1 }}
            key={tech.name}
            className="flex flex-col items-center justify-center border-[0.5px] border-zinc-400 rounded-full p-10"
          >
            <Image src={tech.icon} alt="" className="" width={20} height={20} />
            <p className="text-xs text-gray-300">{tech.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Skills
