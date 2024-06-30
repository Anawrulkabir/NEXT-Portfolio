'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GsapMagnetic from './animation/GsapAnimate'
import { TextAnimation } from './animation/TextAnimation'

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
    name: 'Tailwind CSS',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
  },
  {
    name: 'React',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  },
  {
    name: 'Node.js',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/free-node-js-1174925.png',
  },
  {
    name: 'Express',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI3nGP9w-Ol7H0GYUnDUdCwqnoLwRzoe_cmA&s',
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
    name: 'Firebase',
    icon: 'https://www.svgrepo.com/show/303670/firebase-1-logo.svg',
  },

  {
    name: 'Git',
    icon: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png',
  },
  {
    name: 'GitHub',
    icon: 'https://cdn.worldvectorlogo.com/logos/github-icon-2.svg',
  },
  {
    name: 'Bootstrap',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/2560px-Bootstrap_logo.svg.png',
  },

  {
    name: 'Swiper.js',
    icon: 'https://swiperjs.com/images/swiper-logo.svg',
  },
  {
    name: 'Chart.js',
    icon: 'https://www.chartjs.org/img/chartjs-logo.svg',
  },

  {
    name: 'Framer Motion',
    icon: 'https://cdn.worldvectorlogo.com/logos/framer-motion.svg',
  },
  {
    name: 'TanStack Query',
    icon: 'https://tanstack.com/_build/assets/logo-color-100w-lPbOTx1K.png',
  },
  {
    name: 'Hook Form',
    icon: 'https://react-hook-form.com/images/logo/react-hook-form-logo-only.svg',
  },
  {
    name: 'ShadCN UI',
    icon: 'https://avatars.githubusercontent.com/u/139895814?s=200&v=4',
  },
  {
    name: 'DaisyUI',
    icon: 'https://img.daisyui.com/images/daisyui-logo/daisyui-logomark.svg',
  },
  {
    name: 'MUI',
    icon: 'https://v4.mui.com/static/logo.png',
  },
  {
    name: 'Stripe',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQGluJhW7I1NYU7jF77E-9K9I46_ib_DUNHw&s',
  },
  {
    name: 'GSAP',
    icon: 'https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg',
  },
  {
    name: 'NPM',
    icon: 'https://static-00.iconduck.com/assets.00/npm-icon-2048x2048-wm0mnkz6.png',
  },
]

const Skills = () => {
  const ref = useRef(null)

  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e) => {
    const { clientX, clientY } = e

    const { height, width, left, top } = ref.current.getBoundingClientRect()

    const middleX = clientX - (left + width / 2)

    const middleY = clientY - (top + height / 2)

    setPosition({ x: middleX, y: middleY })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const { x, y } = position

  // return (
  //   <div className="mx-8">
  //     <div className="border-t border-white mx-5"></div>
  //     <div className="flex items-center justify-between py-4 text-white  mx-8">
  //       <div className="flex flex-row justify-around  w-1/2">
  //         <p>04/</p>

  //         <div className="flex gap-1">
  //           <Link href="#">CAPABILITIES</Link>
  //         </div>
  //       </div>

  //       <p className=" flex  w-1/2 justify-end pr-12">/04</p>
  //     </div>

  //     <div
  //       className=" h-[75vh] border-[0.5px] rounded-3xl mx-12 border-zinc-500 my-12 text-white grid grid-rows-4  grid-cols-7 gap-4 p-3"
  //       ref={ref}
  //     >
  //       {technologies.map((tech) => (
  //         <motion.div
  //           drag
  //           dragConstraints={ref}
  //           whileDrag={{
  //             scale: 2,
  //             backgroundColor: 'whitesmoke',
  //           }}
  //           dragElastic={0.5}
  //           dragMomentum={true}
  //           key={tech?.name}
  //           className={`flex flex-col  border-[0.5px] border-zinc-400 rounded-full h-28 w-28 items-center justify-center gap-2`}
  //         >
  //           <Image
  //             src={tech?.icon}
  //             alt=""
  //             className=""
  //             width={20}
  //             height={20}
  //           />
  //           <p className="text-xs text-gray-300">{tech?.name}</p>
  //         </motion.div>
  //       ))}
  //     </div>
  //   </div>
  // )
  return (
    <div className="mx-8">
      <div className="border-t border-white mx-5"></div>
      <div className="flex items-center justify-between py-4 text-white  mx-8">
        <div className="flex flex-row justify-around  w-1/2">
          <p>04/</p>

          <div className="flex gap-1">
            {/* <Link href="#">TECHNICAL SKILL</Link> */}
            <Link
              href="#"
              className="flex items-center text-white hover:text-white"
            >
              <TextAnimation
                text="TECHNICAL&nbsp;SKILL"
                size={'normal'}
                font={'light'}
              />
            </Link>
          </div>
        </div>

        <p className=" flex  w-1/2 justify-end pr-12">/04</p>
      </div>

      <div className="relative">
        <div
          className=" h-[75vh] border-[0.5px] rounded-3xl mx-12 border-zinc-500 my-12 text-white grid grid-rows-4  grid-cols-7 gap-4 p-3 grid-flow-row"
          ref={ref}
        >
          {technologies.map((tech) => (
            <GsapMagnetic key={tech?.name}>
              <div
                className={`flex flex-col  border-[0.5px] border-zinc-400 rounded-3xl h-28 w-28 items-center justify-center gap-2`}
              >
                <Image
                  src={tech?.icon}
                  alt=""
                  className=""
                  width={20}
                  height={20}
                />
                <p className="text-xs text-gray-300">{tech?.name}</p>
              </div>
            </GsapMagnetic>
          ))}
        </div>
        <div className="flex flex-col   font-bold text-5xl text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]">
          <p className="text-zinc-200 opacity-15">TECHNICAL SKILL I</p>
          <p className="text-zinc-100 opacity-15">SPECILIZE IN</p>
        </div>
      </div>
    </div>
  )
}

export default Skills
