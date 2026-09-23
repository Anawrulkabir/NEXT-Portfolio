'use client'
import dynamic from 'next/dynamic'

const Scene3DInner = dynamic(() => import('./Scene3DInner'), {
  ssr: false,
  loading: () => null,
})

export default function Hero3D({ className }) {
  return (
    <div className={className}>
      <Scene3DInner />
    </div>
  )
}
