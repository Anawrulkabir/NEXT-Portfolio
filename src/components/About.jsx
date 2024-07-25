import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import '../utils/textInfiniteScroll.css'
import Marquee from 'react-fast-marquee'
import GsapAnimate from './animation/GsapAnimate'
import { TextAnimation } from './animation/TextAnimation'

const About = () => {
  return (
    <div className="text-white mx-4 md:mx-8 relative ">
      <div className="border-t border-white md:mx-5"></div>

      {/* for mobile  */}
      <div className="md:hidden">
        <div className="flex  items-center justify-between ">
          <div>02/</div>
          <div>ABOUT</div>
          <div>EM/&nbsp;GH/&nbsp;FB/&nbsp;LD</div>
          <div>/04</div>
        </div>
        <div className=" text-sm  flex items-center justify-center my-12">
          {/* bio */}
          <p className="   relative z-20 bg-clip-text text-transparent bg-gradient-to-tr from-neutral-200 to-neutral-500">
            HELLO, MY NAME IS FAHAD. I&apos;M A JUNIOR <br />
            <span className="   relative z-20 bg-clip-text text-transparent bg-gradient-to-tl from-neutral-200 to-neutral-500">
              FRONT-END DEVELOPER SPECIALIZE IN&nbsp;REACT.
            </span>
            <p className="  relative z-20 bg-clip-text text-transparent bg-gradient-to-br from-neutral-200 to-neutral-500">
              I CREATE FULL STACK WEB APPLICATION USING
            </p>
            <p className=" text-right  relative z-20 bg-clip-text text-transparent bg-gradient-to-bl from-neutral-200 to-neutral-500">
              MONGODB, EXPRES, REACT, NODEJS.
            </p>
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
              <p className="text-7xl font-extrabold overflow-hidden relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-purple-200 to-neutral-500">
                MD ANAWRUL KABIR FAHAD&nbsp;MD ANAWRUL KABIR FAHAD&nbsp;MD
                ANAWRUL KABIR FAHAD&nbsp;
              </p>
            </Marquee>
          </div>
        </div>
        <div className="flex items-center justify-center mt-20 ">
          {/* learn more btn */}
          <GsapAnimate>
            <button className="border-b  h-24 w-24 rounded-full text-xs">
              LEARN <br /> MORE
            </button>
          </GsapAnimate>
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

      <div className="hidden md:flex  justify-center gap-10 mt-8">
        {/* bio text */}
        <div className=" flex flex-col items-start  2xl:text-2xl">
          {/* bio */}
          <p className="text-right w-full mt-16 relative z-20 bg-clip-text text-transparent bg-gradient-to-tr from-neutral-200 to-neutral-500">
            HELLO, MY NAME IS FAHAD. I&apos;M A JUNIOR
          </p>

          <p className="relative z-20 bg-clip-text text-transparent bg-gradient-to-tl from-neutral-200 to-neutral-500">
            FRONTEND DEVELOPER SPECIALIZE IN REACTJS.
          </p>
          <p className="relative z-20 bg-clip-text text-transparent bg-gradient-to-br from-neutral-200 to-neutral-500">
            I CREATE FULL STACK WEB APPLICATION USING
          </p>
          <p className="relative z-20 bg-clip-text text-transparent bg-gradient-to-bl from-neutral-200 to-neutral-500">
            MONGODB, EXPRES, REACT, NODEJS.
          </p>
          {/* <p>PASSIONATE IN SOFTWARE ENGINEERING & IoT.</p> */}
        </div>

        {/* Image */}
        <div className="flex">
          {/* Image */}

          {/* md , xl device */}
          <Image
            src={'/images/fahad.jpg'}
            height={'500'}
            width={'500'}
            alt="Fahad Profile Image"
            className="2xl:hidden rounded-3xl"
          />

          {/* 2xl device  */}
          <Image
            src={'/images/fahad.jpg'}
            height={'650'}
            width={'650'}
            alt="Fahad Profile Image"
            className="md:hidden xl:hidden 2xl:block rounded-3xl"
          />
        </div>

        {/* learn more button */}
        <div className="flex items-center mr-32">
          {/* learn more btn */}
          <GsapAnimate>
            <div className="relative w-32 h-32 2xl:w-64 2xl:h-64 rounded-full flex items-center justify-center">
              <div className="relative border h-24 w-24 2xl:h-32 2xl:w-32 rounded-full text-xs flex items-center justify-center">
                <GsapAnimate>
                  <div className="absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  border h-24 w-24 2xl:h-32 2xl:w-32  rounded-full text-xs flex items-center justify-center  z-20 bg-clip-text text-transparent bg-gradient-to-bl from-neutral-200 to-neutral-500">
                    <p className="relative z-20 bg-clip-text text-transparent bg-gradient-to-t from-neutral-200 to-neutral-500 font-bold 2xl:text-lg leading-none 2xl:leading-tight">
                      LEARN <br /> MORE
                    </p>
                  </div>
                </GsapAnimate>
              </div>
            </div>
          </GsapAnimate>
        </div>
      </div>

      <div className="hidden absolute bottom-0 w-full md:flex justify-end translate-y-1/2">
        <Marquee speed={200}>
          <p className="text-8xl 2xl:text-9xl font-extrabold overflow-hidden relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-purple-200 to-neutral-500">
            MD ANAWRUL KABIR FAHAD&nbsp;MD ANAWRUL KABIR FAHAD&nbsp;MD ANAWRUL
            KABIR FAHAD&nbsp;
          </p>
        </Marquee>
      </div>
    </div>
  )
}

export default About
