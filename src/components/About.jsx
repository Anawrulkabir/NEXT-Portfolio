import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import '../utils/textInfiniteScroll.css'
import Marquee from 'react-fast-marquee'

const About = () => {
  return (
    <div className="text-white mx-8 relative">
      <div className="border-t border-white mx-5"></div>
      <div className="flex items-center justify-around py-4">
        <p>02/</p>
        <p>ABOUT</p>
        <div className="flex gap-1">
          <Link href="#">EMAIL</Link>
          <p>/</p>
          <Link href="#">GITHUB/</Link>
          <p>/</p>
          <Link href="#">FACEBOOK</Link>
          <p>/</p>
          <Link href="#">LINKEDIN</Link>
        </div>
        <p>/04</p>
      </div>
      <div className="flex  justify-center gap-12 mt-8">
        <div className=" flex flex-col items-start mt-16 ">
          {/* bio */}
          <p className="text-right w-full">
            HELLO, MY NAME IS FAHAD. I&apos;M A JUNIOR
          </p>
          <p>FRONT-END DEVELOPER SPECIALIZE IN REACT</p>
          <p>I CREATE FULL STACK WEB APPLICATION USING</p>
          <p> MONGODB, EXPRES, REACT, NODEJS.</p>
          {/* <p>PASSIONATE IN SOFTWARE ENGINEERING & IoT.</p>  */}
        </div>
        <div className="flex-1">
          {/* Image */}

          <Image
            src={'/images/fahad.jpg'}
            height={'500'}
            width={'500'}
            alt="Fahad Profile Image"
            className=" rounded-3xl"
          />
        </div>
        <div className="flex items-center mr-32">
          {/* learn more btn */}

          <button className="border p-6 rounded-full text-xs hover:scale-125 transition duration-700">
            LEARN <br /> MORE
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-end translate-y-1/2">
        <Marquee speed={200}>
          <p className="text-8xl font-normal">MD ANAWRUL KABIR FAHAD&nbsp;</p>
        </Marquee>
      </div>
    </div>
  )
}

export default About
