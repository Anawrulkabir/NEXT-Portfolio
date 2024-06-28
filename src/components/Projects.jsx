'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import styles from '../utils/Home.module.css'

const Projects = () => {
  const [hoveredCard, setHoveredCard] = useState(null)

  const cards = [
    {
      id: 1,
      name: 'Luca',
      image: '/images/projects/project-1.png',
    },
    { id: 2, name: 'Sitemark', image: '/images/projects/project-2.png' },
    { id: 3, name: 'Craftpaper', image: '/images/projects/project-3.png' },
  ]

  return (
    <div className="mx-8 text-white my-32 ">
      <div className="border-t border-white mx-5"></div>
      <div className="flex items-center justify-between py-4 text-white  mx-8">
        <div className="flex flex-row justify-around  w-1/2">
          <p>03/</p>

          <div className="flex gap-1">
            <Link href="#">PROJECTS</Link>
          </div>
        </div>

        <p className=" flex  w-1/2 justify-end pr-12">/04</p>
      </div>
      <div className="flex items-center justify-between mt-12 mx-8">
        <div className=" border rounded-full h-32 w-32  flex flex-col items-center justify-center">
          <p className="mr-6  leading-none">VIEW ALL</p>
          <p className="ml-6  leading-none">PROJECTS</p>
        </div>
        <div className="text-4xl font-normal">
          <p className="text-right">Here are some projects that </p>
          <p>showcase my passion in the field of programming </p>
          <p>& urge to learn new tech every morning.</p>
        </div>
      </div>
      {/* <div className="flex items-center mt-12 justify-around">
        <Image
          src="/images/projects/project-1.png"
          alt="Project LUCA"
          width={390}
          height={900}
          className={`h-[500px] object-cover rounded-3xl hover:scale-[99%]  hover:bg-opacity-90 duration-300 `}
        />
        <Image
          src="/images/projects/project-2.png"
          alt="Project Sitemark"
          width={390}
          height={900}
          className="h-[500px] object-cover rounded-3xl hover:scale-[99%]  hover:bg-opacity-90 duration-300"
        />
        <Image
          src="/images/projects/project-3.png"
          alt="Project Craftpaper"
          width={390}
          height={900}
          className="h-[500px] object-cover rounded-3xl hover:scale-[99%]  hover:bg-opacity-90 duration-300"
        />
      </div> */}

      <div className={`${styles.container} relative mt-12`}>
        {hoveredCard && (
          <div
            className={`${styles.hoveredText} absolute  text-5xl text-green-600 font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10`}
          >
            <p className="text-sm font-light">Featured Project</p>
            {hoveredCard.name}
          </div>
        )}
        <div className={styles.cards}>
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
                  className={`${styles.cardImage} hover:scale-[99%]  hover:bg-opacity-90 duration-300`}
                  width={390}
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
    </div>
  )
}

export default Projects
