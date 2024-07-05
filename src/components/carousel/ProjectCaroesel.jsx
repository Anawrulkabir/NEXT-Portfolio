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

const ProjectCaroesel = ({ cards }) => {
  return (
    <Carousel className="w-full ">
      <CarouselContent>
        {cards.map((card, index) => (
          <CarouselItem key={index}>
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
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default ProjectCaroesel
