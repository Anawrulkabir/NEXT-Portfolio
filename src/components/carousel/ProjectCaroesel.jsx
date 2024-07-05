'use client'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import Link from 'next/link'

const cards = [
  {
    id: 1,
    name: 'Luca',
    image: '/images/projects/project-1.png',
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

const ProjectCaroesel = () => {
  return (
    <Carousel className="w-full ">
      <CarouselContent>
        {cards.map((card, index) => (
          <Link href={`/projects/${card.name}`} key={index}>
            <CarouselItem>
              <div className="rounded-xl border-0">
                <Card>
                  <Image
                    src={card.image}
                    alt="Image 1"
                    width={900}
                    height={1320}
                    className="w-full object-cover  rounded-xl"
                  />
                </Card>
              </div>
            </CarouselItem>
          </Link>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default ProjectCaroesel
