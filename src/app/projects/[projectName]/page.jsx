import React from 'react'

const page = ({ params }) => {
  console.log(params.projectName)
  return (
    <div>
      <p>{params.projectName}</p>
    </div>
  )
}

export default page
