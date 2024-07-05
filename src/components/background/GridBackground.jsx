import React from 'react'

export function GridBackground() {
  return (
    <div className="h-[50rem] w-full dark:bg-black bg-black  dark:bg-grid-white/[0.2] bg-grid-white/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="flex flex-col items-center">
        <p className="text-4xl sm:text-8xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          MULTI-
        </p>
        <p className="text-4xl sm:text-8xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          DISCPLINARY
        </p>
        <p className="text-4xl sm:text-8xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          ENGINEER
        </p>
      </div>
    </div>
  )
}
