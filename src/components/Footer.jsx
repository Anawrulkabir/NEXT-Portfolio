import React from 'react'
import GsapAnimate from './animation/GsapAnimate'
import { IoMdArrowDown } from 'react-icons/io'

const Footer = () => {
  return (
    <div id="contact" className="mx-4">
      {/* mobile device  */}
      <div className="md:hidden">
        <div className="border-[0.5px] border-gray-600 rounded-3xl px-12 py-8 md:p-24 flex flex-col items-center  text-white space-y-1 gap-6 ">
          <p className="text-xs md:text-lg font-light ">
            HAVE PROJECT IN MIND?
          </p>
          <h1 className="text-3xl md:text-5xl font-bold pb-8 ">
            LET&apos;S CONNECT
          </h1>
          <GsapAnimate>
            <>
              <a
                href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=mdanawrulkabirfahad123@gmail.com"
                target="_blanck"
              >
                <button className="border h-24 w-24 rounded-full text-xs ">
                  WRITE A <br /> MESSAGE
                </button>
              </a>
            </>
          </GsapAnimate>
        </div>

        <div className="text-zinc-100 flex items-center justify-center md:justify-between m-2 md:mx-8 md:mt-8 md:mb-12 ">
          <div className="hidden md:flex ">
            <p className="">FEEL FREE TO CONNECT ME ON SOCIAL</p>
          </div>
          <div className="text-sm md:text-base flex items-center justify-between gap-12 md:gap-6  ">
            <a href="https://github.com/Anawrulkabir">GITHUB</a>
            <a href="https://www.linkedin.com/in/anawrulkabir/">LINKEDIN</a>
            <a href="https://www.facebook.com/profile.php?id=100073283195770">
              FACEBOOK
            </a>
          </div>
        </div>
      </div>

      {/* desktop device */}
      <div className="hidden md:block">
        <div className="border-[0.5px] border-gray-600 rounded-3xl px-12 py-8 md:p-24 flex flex-col items-center  text-white space-y-1 gap-6 relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
          <p className="text-xs md:text-lg font-light relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
            HAVE PROJECT IN MIND?
          </p>
          <h1 className="text-3xl md:text-5xl font-bold pb-8 relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
            LET&apos;S CONNECT
          </h1>
          <GsapAnimate>
            <>
              <a
                href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=mdanawrulkabirfahad123@gmail.com"
                target="_blanck"
              >
                <button className="border h-24 w-24 rounded-full text-xs relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                  WRITE A <br /> MESSAGE
                </button>
              </a>
            </>
          </GsapAnimate>
        </div>

        <div className="text-zinc-100 flex items-center justify-center md:justify-between m-2 md:mx-8 md:mt-8 md:mb-12 ">
          <div className="hidden md:flex ">
            <p className="relative z-20 bg-clip-text text-transparent bg-gradient-to-br from-neutral-200 to-neutral-500">
              FEEL FREE TO CONNECT ME ON SOCIAL
            </p>
          </div>
          <div className="text-sm md:text-base flex items-center justify-between gap-12 md:gap-6 relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 ">
            <a href="https://github.com/Anawrulkabir">GITHUB</a>
            <a href="https://www.linkedin.com/in/anawrulkabir/">LINKEDIN</a>
            <a href="https://www.facebook.com/profile.php?id=100073283195770">
              FACEBOOK
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
