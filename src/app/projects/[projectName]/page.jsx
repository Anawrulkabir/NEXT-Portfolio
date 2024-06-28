import React from 'react'

const page = ({ params }) => {
  console.log(params.projectName)
  return (
    <div>
      <p className={'text-6xl text-white text-center mt-20'}>
        {params.projectName}
      </p>
    </div>
  )
}

export default page
