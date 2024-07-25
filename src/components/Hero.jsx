import { FaArrowDown } from 'react-icons/fa'
import { IoMdArrowDown } from 'react-icons/io'
import About from './About'
import Projects from './Projects'
import Skills from './Skills'
import GsapAnimate from './animation/GsapAnimate'
import Review from './review/Review'
import Marquee from 'react-fast-marquee'
import { GridBackground } from '@/components/background/GridBackground'
import {
  AnimatedTooltip,
  AnimatedTooltipMain,
} from './animation/AnimatedTooltipMain'
import { HiOutlineDownload } from 'react-icons/hi'
import { TextAnimation } from './animation/TextAnimation'
const Hero = () => {
  return (
    <>
      {/* 1st page view */}
      {/* For mobile */}
      <div className=" md:hidden lg:hidden text-white h-screen">
        <p className="flex gap-1 items-center text-xs my-12 mx-5">
          01/04 - SCROLL <FaArrowDown />
        </p>
        <div className="my-20">
          <Marquee speed={45}>
            <p className="text-7xl font-semibold overflow-hidden relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              MULTI&nbsp;-&nbsp;MULTI&nbsp;-&nbsp;
            </p>
          </Marquee>
          <Marquee speed={40} direction="right">
            <p className="text-7xl font-semibold overflow-hidden relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              DISCLIPLINARY&nbsp;-&nbsp;DISCLIPLINARY&nbsp;-&nbsp;
            </p>
          </Marquee>
          <Marquee speed={35}>
            <p className="text-7xl font-semibold overflow-hidden relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              ENGINEER&nbsp;-&nbsp;ENGINEER&nbsp;-&nbsp;
            </p>
          </Marquee>
        </div>

        <div className="flex justify-center">
          <div className="text-base font-normal  text-white  px-4  space-y-1 ">
            <p className="text-right  relative z-20 bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500 hover:bg-gradient-to-l transition-color duration-900">
              CREATIVE THINKING AND PROBLEM
            </p>

            <p className="text-right  relative z-20 bg-clip-text text-transparent bg-gradient-to-l from-neutral-200 to-neutral-500">
              SOLVING ARE WHERE MY MIND WANDERS,
            </p>

            <p className="text-right  relative z-20 bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
              USING MY KNOWLEDGE AND PASSION FOR
            </p>

            <p className=" relative z-20 bg-clip-text text-transparent bg-gradient-to-l from-neutral-200 to-neutral-500">
              PROGRAMMING AS MY MEDIUM.
            </p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center mt-12">
          <a
            href="/resume/Fahad Kabir's Resume(Updated).pdf"
            download
            className="flex justify-center items-center border-b-2 border-neutral-200 rounded-full"
          >
            <div className="text-center border border-purple-700 hover:border-purple-800 rounded-full px-4 py-1  flex flex-row items-center justify-center gap-2 ">
              <p className=" relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                RESUME
              </p>
              <HiOutlineDownload />
            </div>
          </a>
        </div>

        <div className=" justify-center items-center  relative hidden">
          <GsapAnimate>
            <div className="h-[103.33px] w-[103.33px] border rounded-full flex items-center justify-center text-[36px] text-white font-thin">
              {/* <IoMdArrowDown /> */}
              <GsapAnimate>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[103.33px] w-[103.33px] border rounded-full flex items-center justify-center text-[36px] text-white font-thin">
                  <IoMdArrowDown />
                </div>
              </GsapAnimate>
            </div>
          </GsapAnimate>
        </div>
      </div>

      {/* For Desktop view */}
      <div className="relative hidden md:block">
        <div className="absolute top-[20%] left-[5%] z-[99]">
          <div className="flex items-center justify-center text-white text-xs leading-[26px] gap-1">
            01//04 - SCROLL
            <span>
              <FaArrowDown />
            </span>
          </div>
        </div>
        <GridBackground />
        <div className="flex justify-center items-center  relative mb-24">
          <GsapAnimate>
            <div className=" w-1/4 rounded-full flex items-center justify-center">
              <div className="h-[103.33px] w-[103.33px] border rounded-full flex items-center justify-center text-[36px] text-white font-thin">
                {/* <IoMdArrowDown /> */}
                <GsapAnimate>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[103.33px] w-[103.33px] border rounded-full flex items-center justify-center text-[36px] text-white font-thin">
                    <IoMdArrowDown />
                  </div>
                </GsapAnimate>
              </div>
            </div>
          </GsapAnimate>

          {/* <GsapAnimate>
            <div className="z-[-1] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[103.33px] w-[103.33px] border rounded-full flex items-center justify-center text-[36px] text-white font-thin">
              <IoMdArrowDown />
            </div>
          </GsapAnimate> */}
        </div>
      </div>

      <div className="hidden  w-full      md:py-[100px]">
        {/* min-h-[calc(100vh-98px)] */}
        <div>
          <>
            <div className="flex gap-52">
              <div className="flex items-start ">
                <div className="flex justify-center items-center text-white text-xs leading-[26px] gap-1">
                  01//04 - SCROLL
                  <span>
                    <FaArrowDown />
                  </span>
                </div>
              </div>
              <div className="">
                <p className="text-[107px] font-semibold leading-[80px] text-white">
                  MULTI-
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <p className="text-[107px] font-semibold leading-[80px] text-white ">
                DISCPLINARY
              </p>
            </div>
            <div className="flex justify-center mt-3 ml-60 relative">
              <div className="absolute top-[44px] left-[45px] ">
                <p className="-rotate-90 text-white text-[12px] font-normal leading-4 tracking-[1px]">
                  FUTURE
                </p>
              </div>
              <div>
                <p className="text-[107px] font-semibold leading-[80px] text-white ">
                  ENGINEER
                </p>
              </div>
              <div className="text-[12px] font-normal leading-4 text-white ml-4">
                <div className="text-right">
                  <p>CREATIVE THINKING AND PROBLEM</p>
                </div>
                <div>
                  <p>SOLVING ARE WHERE MY MIND WANDERS,</p>
                </div>
                <div>
                  <p>USING MY KNOWLEDGE AND PASSION FOR</p>
                </div>
                <div>
                  <p>PROGRAMMING AS MY MEDIUM.</p>
                </div>
              </div>
            </div>
          </>

          <div className="w-full flex items-center justify-center mt-12">
            <a
              href="/resume/Fahad Kabir's Resume(Updated).pdf"
              download
              className="flex items-center justify-center"
            >
              <div className="text-center border border-purple-700 hover:border-purple-800 rounded-full px-4 py-1  flex flex-row items-center justify-center gap-2 text-white text-sm">
                RESUME
                <HiOutlineDownload />
              </div>
            </a>
          </div>
          <div className="flex justify-center items-center mt-16 relative  ">
            <GsapAnimate>
              <div className="h-[83.33px] w-[83.33px] border rounded-full flex items-center justify-center text-[36px] text-white font-thin">
                <IoMdArrowDown />
              </div>
            </GsapAnimate>

            <GsapAnimate>
              <div className="z-[-1] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[83.33px] w-[83.33px] border rounded-full flex items-center justify-center text-[36px] text-white font-thin">
                {/* <IoMdArrowDown /> */}
              </div>
            </GsapAnimate>
          </div>
        </div>
      </div>

      {/*  */}
      <About />
      <Projects />
      <Skills />
      {/* <Review /> */}
    </>
  )
}

export default Hero
