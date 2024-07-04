import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import '../utils/textInfiniteScroll.css'
import Marquee from 'react-fast-marquee'
import GsapAnimate from './animation/GsapAnimate'
import { TextAnimation } from './animation/TextAnimation'

const About = () => {
  return (
    <div className="text-white mx-8 relative">
      <div className="border-t border-white mx-5"></div>
      <div className="flex items-center justify-around py-4">
        <p>02/</p>
        <p className="flex items-center text-white hover:text-white">
          <TextAnimation text="ABOUT" size={'normal'} font={'light'} />
        </p>
        <div className="flex gap-1">
          <Link
            href="#"
            className="flex items-center text-white hover:text-white"
          >
            <TextAnimation text="EMAIL" size={'normal'} font={'light'} />
          </Link>
          <p>/</p>
          <Link
            href="#"
            className="flex items-center text-white hover:text-white"
          >
            <TextAnimation text="GITHUB" size={'normal'} font={'light'} />
          </Link>
          <p>/</p>
          <Link
            href="#"
            className="flex items-center text-white hover:text-white"
          >
            <TextAnimation text="FACEBOOK" size={'normal'} font={'light'} />
          </Link>
          <p>/</p>
          <Link
            href="#"
            className="flex items-center text-white hover:text-white"
          >
            <TextAnimation text="LINKEDIN" size={'normal'} font={'light'} />
          </Link>
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
          <GsapAnimate>
            <button className="border h-24 w-24 rounded-full text-xs">
              LEARN <br /> MORE
            </button>
          </GsapAnimate>
        </div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-end translate-y-1/2">
        <Marquee speed={200}>
          <p className="text-8xl font-normal overflow-hidden">
            MD ANAWRUL KABIR FAHAD&nbsp;MD ANAWRUL KABIR FAHAD&nbsp;MD ANAWRUL
            KABIR FAHAD&nbsp;
          </p>
        </Marquee>
      </div>
    </div>
  )
}

export default About
