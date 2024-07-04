import { FaArrowDown } from 'react-icons/fa'
import { IoMdArrowDown } from 'react-icons/io'
import About from './About'
import Projects from './Projects'
import Skills from './Skills'
import GsapAnimate from './animation/GsapAnimate'
import Review from './review/Review'
import Marquee from 'react-fast-marquee'
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
            <p className="text-7xl font-semibold overflow-hidden">
              MULTI&nbsp;-&nbsp;MULTI&nbsp;-&nbsp;
            </p>
          </Marquee>
          <Marquee speed={40} direction="right">
            <p className="text-7xl font-semibold overflow-hidden">
              DISCLIPLINARY&nbsp;-&nbsp;DISCLIPLINARY&nbsp;-&nbsp;
            </p>
          </Marquee>
          <Marquee speed={35}>
            <p className="text-7xl font-semibold overflow-hidden">
              ENGINEER&nbsp;-&nbsp;ENGINEER&nbsp;-&nbsp;
            </p>
          </Marquee>
        </div>

        <div className="flex justify-center">
          <div className="text-base font-normal  text-white  px-4  space-y-1  ">
            <p className="text-right">CREATIVE THINKING AND PROBLEM</p>

            <p className="text-right">SOLVING ARE WHERE MY MIND WANDERS,</p>

            <p className="text-right">USING MY KNOWLEDGE AND PASSION FOR</p>

            <p className="">PROGRAMMING AS MY MEDIUM.</p>
          </div>
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

      {/* For Desktop view */}
      <div className="hidden md:flex w-full  h-screen   px-[44px] py-[100px]">
        {/* min-h-[calc(100vh-98px)] */}
        <div>
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
      {/* <About />
      <Projects />
      <Skills />
      <Review /> */}
    </>
  )
}

export default Hero
