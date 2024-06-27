import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Projects = () => {
  return (
    <div className="mx-8 text-white my-32 ">
      <div className="border-t border-white mx-5"></div>
      <div className="flex items-center justify-around py-4">
        <p>03/</p>
        <p>ABOUT</p>
        <div className="flex gap-1">
          <Link href="#">PROJECTS</Link>
        </div>
        <p>/04</p>
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
      <div className="flex items-center mt-12 justify-around">
        <Image
          src="/images/projects/project-1.png"
          alt="Project LUCA"
          width={390}
          height={900}
          className="h-[500px] object-cover rounded-3xl hover:scale-[99%]  hover:bg-opacity-90 duration-700"
        />
        <Image
          src="/images/projects/project-2.png"
          alt="Project Sitemark"
          width={390}
          height={900}
          className="h-[500px] object-cover rounded-3xl"
        />
        <Image
          src="/images/projects/project-3.png"
          alt="Project Craftpaper"
          width={390}
          height={900}
          className="h-[500px] object-cover rounded-3xl"
        />
      </div>
    </div>
  )
}

export default Projects
