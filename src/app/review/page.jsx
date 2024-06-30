import Review from '@/components/review/Review'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className="border-t border-white mx-5"></div>
      <div className="flex items-center justify-around py-4">
        <p>03/</p>
        <p>ABOUT</p>
        <div className="flex gap-1">
          <Link href="#">PROJECTS</Link>
        </div>
        <p>/04</p>
      </div>

      <Review />
    </div>
  )
}

export default page
