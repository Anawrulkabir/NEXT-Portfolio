'use client'
import dynamic from 'next/dynamic'
import { WorldFallback } from './WorldFallback'

// Client-only, code-split world island (§15.2): the text above it is the LCP
// element and never waits on this.
const WorldViewport = dynamic(() => import('./WorldViewport'), {
  ssr: false,
  loading: () => <WorldFallback />,
})

export function WorldSection() {
  return (
    <section id="world" aria-label="Journey map" className="mt-10 md:mt-12">
      <WorldViewport />
    </section>
  )
}
