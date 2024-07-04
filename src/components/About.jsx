import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import '../utils/textInfiniteScroll.css'
import Marquee from 'react-fast-marquee'
import GsapAnimate from './animation/GsapAnimate'
import { TextAnimation } from './animation/TextAnimation'

const About = () => {
  return (
    <div className="text-white mx-4 md:mx-8 relative">
      <div className="border-t border-white md:mx-5"></div>

      {/* for mobile  */}
      <div className="md:hidden">
        <div className="flex  items-center justify-between">
          <div>02/</div>
          <div>ABOUT</div>
          <div>EM/&nbsp;GH/&nbsp;FB/&nbsp;LD</div>
          <div>/04</div>
        </div>
        <div className="  mt-8 flex items-center justify-center">
          {/* bio */}
          <p className=" text-sm ">
            HELLO, MY NAME IS FAHAD. I&apos;M A JUNIOR <br /> FRONT-END
            DEVELOPER SPECIALIZE IN REACT. <br /> I CREATE FULL STACK WEB
            APPLICATION USING{' '}
            <p className="text-right ">MONGODB, EXPRES, REACT, NODEJS.</p>
          </p>
        </div>

        <div className="relative">
          <Image
            src={'/images/fahad.jpg'}
            height={'500'}
            width={'500'}
            alt="Fahad Profile Image"
            className=" rounded-3xl my-4"
          />
          <div className="absolute bottom-0 w-full flex justify-end translate-y-1/2">
            <Marquee speed={200}>
              <p className="text-7xl font-normal overflow-hidden">
                MD ANAWRUL KABIR FAHAD&nbsp;MD ANAWRUL KABIR FAHAD&nbsp;MD
                ANAWRUL KABIR FAHAD&nbsp;
              </p>
            </Marquee>
          </div>
        </div>
      </div>

      {/* for desktop */}
      <div className="hidden md:flex  items-center justify-around py-4">
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

      <div className="hidden md:flex  justify-center gap-12 mt-8">
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
      <div className="hidden absolute bottom-0 w-full md:flex justify-end translate-y-1/2">
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
