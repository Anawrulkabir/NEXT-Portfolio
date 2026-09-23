'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { WorldFallback } from './WorldFallback'

// Client-only, code-split world islands (§15.2): the text above is the LCP
// element and never waits on these. Phones load only the Scene Deck; the
// walkable world's engine never downloads there.
const WorldViewport = dynamic(() => import('./WorldViewport'), {
  ssr: false,
  loading: () => <WorldFallback />,
})
const SceneDeck = dynamic(() => import('./SceneDeck'), {
  ssr: false,
  loading: () => <WorldFallback />,
})

/** ≥768 px: walkable world (tap-to-walk on tablets). <768 px: Scene Deck (§08.8, §12). */
export function WorldSection() {
  const [mode, setMode] = useState<'world' | 'deck' | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const apply = () => setMode(mq.matches ? 'world' : 'deck')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <section id="world" aria-label="Journey map" className="mt-10 md:mt-12">
      {mode === 'world' ? <WorldViewport /> : mode === 'deck' ? <SceneDeck /> : <WorldFallback />}
      <p className="max-w-[1120px] mx-auto px-4 md:px-6 mt-3 text-sm text-right">
        <Link href="/journey" className="pixel-focus text-parchment/80 hover:text-amber underline underline-offset-2">
          Prefer reading? The journey as text {'→'}
        </Link>
      </p>
    </section>
  )
}
