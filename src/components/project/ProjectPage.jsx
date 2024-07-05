'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TextAnimation } from '../animation/TextAnimation'

const ProjectPage = ({ title, project }) => {
  return (
    <div>
      <p>{project.name}</p>
      <div className="border-t border-white mx-5"></div>
      <div className="flex items-center justify-between py-4 text-white  mx-8">
        <div className="flex flex-row justify-around  w-1/2">
          <p>0{project.id}/</p>

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

        <p className=" flex  w-1/2 justify-end pr-12">/0{project.length}</p>
      </div>

      <Image src={project.imageList[0]} alt={project.name} />
      <p>{title}</p>
    </div>
  )
}

export default ProjectPage
