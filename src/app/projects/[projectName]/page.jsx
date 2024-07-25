'use client'
import Image from 'next/image'
import React from 'react'

const page = ({ params }) => {
  const project = cards.filter((card) => card.name === params.projectName)

  return (
    <div>
      {/* <p className={'text-6xl text-white text-center mt-20'}>
        {params.projectName}
      </p> */}
      <div className="">
        <img
          src={project[0].snapshots[0].src}
          className="w-full m-12 rounded-xl"
        />
      </div>

      {project[0]?.snapshots?.map((snap) => (
        <div className="flex items-center gap-6 m-5">
          <Image width={1920} height={1080} src={snap.src} alt="" />
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
