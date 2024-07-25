export function GridBackground() {
  return (
    <div className="h-[calc(100vh-12rem)] w-full  dark:bg-black bg-black  dark:bg-grid-white/[0.2] bg-grid-white/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="flex flex-col items-center">
        <p className="text-4xl sm:text-8xl 2xl:text-9xl  font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 ">
          MULTI-
        </p>
        <p className="text-4xl sm:text-8xl 2xl:text-9xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 ">
          DISCPLINARY
        </p>
        <div className=" text-4xl sm:text-8xl 2xl:text-9xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 ">
          <span className="absolute top-1/2 left-0 -translate-y-[15%]  -translate-x-[60%] -rotate-90  text-xs sm:text-sm 2xl:text-lg font-bold  z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 ">
            FUTURE
          </span>
          ENGINEER
          <div className="absolute  bottom-0 right-0 -translate-y-1/4 translate-x-[102%] text-xs sm:text-xs leading-0 2xl:text-lg  font-bold  z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-100 ">
            {/* <div className="text-right">
              <p className="leading-2  tracking-tight  ">
                CREATIVE THINKING AND PROBLEM
              </p>
            </div>

            <div>
              <p className="leading-0  tracking-tight">
                SOLVING ARE WHERE MY MIND WANDERS,
              </p>
            </div>

            <div>
              <p className="leading-0  tracking-tight">
                USING MY KNOWLEDGE AND PASSION FOR
              </p>
            </div>

            <div>
              <p className="leading-0  tracking-tight">
                PROGRAMMING AS MY MEDIUM.
              </p>
            </div> */}
            <p className="text-right  relative z-20 bg-clip-text text-transparent bg-gradient-to-l from-neutral-200 to-neutral-500 hover:bg-gradient-r">
              CREATIVE THINKING AND PROBLEM
            </p>

            <p className="text-right  relative z-20 bg-clip-text text-transparent bg-gradient-to-l from-neutral-200 to-neutral-500">
              SOLVING ARE WHERE MY MIND WANDERS,
            </p>

            <p className="text-right  relative z-20 bg-clip-text text-transparent bg-gradient-to-l from-neutral-200 to-neutral-500">
              USING MY KNOWLEDGE AND PASSION FOR
            </p>

            <p className=" relative z-20 bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
              PROGRAMMING AS MY MEDIUM.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
