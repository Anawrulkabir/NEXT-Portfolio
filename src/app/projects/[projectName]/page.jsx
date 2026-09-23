'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack } from 'react-icons/io'

const page = ({ params }) => {
  const project = cards.find((card) => card.name === params.projectName)

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-6">
        <p className="text-3xl font-semibold">Project not found</p>
        <Link
          href="/projects"
          className="border border-purple-700 hover:border-purple-800 rounded-full px-4 py-2 text-sm"
        >
          BACK TO PROJECTS
        </Link>
      </div>
    )
  }

  const snapshots =
    project.snapshots && project.snapshots.length > 0
      ? project.snapshots
      : [{ serial: 1, src: project.image }]

  return (
    <div>
      <div className="mx-4 md:mx-8 mt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-white text-sm hover:opacity-70"
        >
          <IoMdArrowBack /> BACK TO PROJECTS
        </Link>
        <h1 className="text-white text-4xl md:text-6xl font-semibold mt-4">
          {project.name}
        </h1>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          {project?.tech?.map((icon) => (
            <div
              key={icon.name}
              className="flex items-center gap-2 border border-zinc-700 rounded-full px-3 py-1"
            >
              <Image
                src={icon.icon}
                alt={icon.name}
                width={16}
                height={16}
                className="rounded-full"
              />
              <p className="text-white text-xs">{icon.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Image
          alt={project.name}
          height={1080}
          width={1920}
          src={snapshots[0].src}
          className="w-full m-4 md:m-12 rounded-xl"
        />
      </div>

      {snapshots.slice(1).map((snap) => (
        <div key={snap.serial} className="flex items-center gap-6 m-5">
          <Image width={1920} height={1080} src={snap.src} alt={project.name} />
        </div>
      ))}
    </div>
  )
}

export default page

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
    snapshots: [
      {
        serial: 1,
        src: '/images/projects/project-2.png',
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
    snapshots: [
      {
        serial: 1,
        src: '/images/projects/project-3.png',
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
