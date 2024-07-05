'use client'
import React from 'react'
import { HoverBorderGradient } from '../ui/hover-border-gradient'

export function HoverBorderGradientDemo() {
  return (
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="white text-white dark:text-white flex items-center space-x-2"
      >
        <AceternityLogo />
        <span>Download Resume</span>
      </HoverBorderGradient>
    </div>
  )
}

const AceternityLogo = () => {
  return (
    <svg
      width="646"
      height="645"
      viewBox="0 0 666 645"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-20 w-40 text-white dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  )
}
