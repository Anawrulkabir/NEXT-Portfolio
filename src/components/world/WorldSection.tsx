'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
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
      <p className="max-w-[1120px] mx-auto px-4 md:px-6 mt-3 text-sm text-right">
        <Link href="/journey" className="pixel-focus text-parchment/80 hover:text-amber underline underline-offset-2">
          Prefer reading? The journey as text {'→'}
        </Link>
      </p>
    </section>
  )
}
