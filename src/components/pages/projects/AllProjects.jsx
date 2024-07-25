'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import styles from '../../../utils/Home.module.css'
import GsapAnimate from '../../../components/animation/GsapAnimate'
import { TextAnimation } from '../../../components/animation/TextAnimation'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const AllProjects = () => {
  const [hoveredCard, setHoveredCard] = useState(null)

  const cards = [
    {
      id: 1,
      name: 'Luca',
      image: '/images/projects/project-1.png',
      snapshots: [
        {
          serial: 1,
          src: '/images/projects/project_1/1.png',
        },
        {
          serial: 2,
          src: '/images/projects/project_1/2.png',
        },
        {
          serial: 3,
          src: '/images/projects/project_1/3.png',
        },
        {
          serial: 4,
          src: '/images/projects/project_1/4.png',
        },
        {
          serial: 5,
          src: '/images/projects/project_1/5.png',
        },
        {
          serial: 6,
          src: '/images/projects/project_1/6.png',
        },
        {
          serial: 7,
          src: '/images/projects/project_1/7.png',
        },
      ],
      tech: [
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
          name: 'ShadCN UI',
          icon: 'https://avatars.githubusercontent.com/u/139895814?s=200&v=4',
        },
        {
          name: 'Stripe',
          icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQGluJhW7I1NYU7jF77E-9K9I46_ib_DUNHw&s',
        },
      ],
    },
    {
      id: 2,
      name: 'Sitemark',
      image: '/images/projects/project-2.png',
      tech: [
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
          name: 'MUI',
          icon: 'https://v4.mui.com/static/logo.png',
        },
        {
          name: 'Firebase',
          icon: 'https://www.svgrepo.com/show/303670/firebase-1-logo.svg',
        },
      ],
    },
    {
      id: 3,
      name: 'Craftpaper',
      image: '/images/projects/project-3.png',
      tech: [
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
          name: 'DaisyUI',
          icon: 'https://img.daisyui.com/images/daisyui-logo/daisyui-logomark.svg',
        },
        {
          name: 'Firebase',
          icon: 'https://www.svgrepo.com/show/303670/firebase-1-logo.svg',
        },
      ],
    },
  ]

  return (
    <div className="mx-4 md:mx-8 text-white my-12 md:my-20 ">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-4  md:mt-12 md:mx-8 mx-4">
        <div className="hidden md:block">
          <GsapAnimate>
            <div className=" border rounded-full h-24 md:h-32 w-24  md:w-32  flex flex-col items-center justify-center text-xs md:text-base relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              <p className="mr-6  leading-none">SEE ALL</p>
              <p className="ml-6  leading-none">PROJECTS</p>
            </div>
          </GsapAnimate>
        </div>

        {/* for desktop view */}
        <div className="hidden md:block text-sm md:text-4xl font-normal relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
          <p className="text-right">These are my best projects that </p>
          <p className="">showcase my passion in the field of programming </p>
          <p>& urge to learn new tech every morning.</p>
        </div>

        {/* for mobile device */}
        <div className=" md:hidden  md:text-4xl mb-4 text-center relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
          <p className="font-extrabold text-2xl ">
            These are my best projects that showcase my passion in the field of
            programming & urge to learn new tech every morning.
          </p>
        </div>
      </div>

      <div className={`${styles.container} relative mt-12 hidden md:block`}>
        {hoveredCard && (
          <div
            className={`${styles.hoveredText} absolute  text-7xl text-green-600 font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10`}
          >
            <p className="text-sm font-light">Featured Project</p>
            {/* <TextAnimation text={hoveredCard.name} size={'5xl'} font={'bold'} /> */}
            {hoveredCard.name}
            <div className="flex items-center gap-2  justify-center mt-3 ">
              {hoveredCard?.tech?.map((icon) => (
                <Image
                  key={icon?.name}
                  src={icon?.icon}
                  alt=""
                  className="rounded-full"
                  width={25}
                  height={25}
                />
              ))}
            </div>
          </div>
        )}
        <div className={`${styles.cards} hidden md:flex`}>
          {cards.map((card) => (
            <Link href={`/projects/${card.name}`} key={card.id}>
              <div
                className={`${styles.card} ${
                  hoveredCard?.id === card.id ? styles.glow : styles.shadow
                } hover:scale-[99%]  hover:bg-opacity-90 duration-300`}
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Image
                  src={card.image}
                  alt={card.name}
                  className={`${
                    styles.cardImage
                  } hover:scale-[99%]  hover:bg-opacity-90 duration-300 ${
                    hoveredCard && hoveredCard?.id !== card?.id ? 'blur-sm' : ''
                  }`}
                  width={900}
                  height={900}
                />
                {/* {hoveredCard && (
                <div className={styles.cardName}>{card.name}</div>
              )} */}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className={`${styles.container} relative mt-12 hidden md:block`}>
        {hoveredCard && (
          <div
            className={`${styles.hoveredText} absolute  text-7xl text-green-600 font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10`}
          >
            <p className="text-sm font-light">Featured Project</p>
            {/* <TextAnimation text={hoveredCard.name} size={'5xl'} font={'bold'} /> */}
            {hoveredCard.name}
            <div className="flex items-center gap-2  justify-center mt-3 ">
              {hoveredCard?.tech?.map((icon) => (
                <Image
                  key={icon?.name}
                  src={icon?.icon}
                  alt=""
                  className="rounded-full"
                  width={25}
                  height={25}
                />
              ))}
            </div>
          </div>
        )}
        <div className={`${styles.cards} hidden md:flex`}>
          {cards.map((card) => (
            <Link href={`/projects/${card.name}`} key={card.id}>
              <div
                className={`${styles.card} ${
                  hoveredCard?.id === card.id ? styles.glow : styles.shadow
                } hover:scale-[99%]  hover:bg-opacity-90 duration-300`}
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Image
                  src={card.image}
                  alt={card.name}
                  className={`${
                    styles.cardImage
                  } hover:scale-[99%]  hover:bg-opacity-90 duration-300 ${
                    hoveredCard && hoveredCard?.id !== card?.id ? 'blur-sm' : ''
                  }`}
                  width={900}
                  height={900}
                />
                {/* {hoveredCard && (
                <div className={styles.cardName}>{card.name}</div>
              )} */}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Carousel className="w-full md:hidden mt-12">
        <CarouselContent>
          {cards.map((card, index) => (
            <CarouselItem key={index}>
              <div className="rounded-xl  w-[85%]">
                <Card className="border-0 ">
                  <Link href={`/projects/${card.name}`}>
                    <Image
                      src={card.image}
                      alt="Image 1"
                      width={900}
                      height={1320}
                      className="w-full object-cover  rounded-xl h-[30rem] "
                    />
                  </Link>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* <div className="flex items-center justify-center my-12 md:hidden ">
        <GsapAnimate>
          <div className=" border rounded-full h-24 md:h-32 w-24  md:w-32  flex flex-col items-center justify-center text-xs md:text-base relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
            <p className="mr-6  leading-none">VIEW ALL</p>
            <p className="ml-6  leading-none">PROJECTS</p>
          </div>
        </GsapAnimate>
      </div> */}
    </div>
  )
}

export default AllProjects
