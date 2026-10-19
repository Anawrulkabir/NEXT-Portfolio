'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { DeployExperience } from './DeployExperience'

/**
 * Keeps the island alive across routes. It lives in the root layout, so once the island has been
 * deployed, going to /work and back does not build or deploy it again: it sleeps behind the page
 * and wakes as it was left. Nothing loads until the island is first visited; a visitor who only
 * reads /work never downloads three. Links inside the island go through the router, so leaving it
 * is a page change, not a page load.
 */
export function IslandHost() {
  const path = usePathname()
  const router = useRouter()
  const home = path === '/'
  const [seen, setSeen] = useState(home)
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (home) setSeen(true)
  }, [home])

  useEffect(() => {
    const el = host.current
    if (!seen || !el) return
    const pages = ['/work', '/research', '/about']
    pages.forEach((p) => router.prefetch(p))
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element).closest?.('a')
      if (!a || a.target || a.hasAttribute('download')) return
      const href = a.getAttribute('href') || ''
      // the site's own pages only: not files (the CVs), not the island's own #/station links
      if (!href.startsWith('/') || href.startsWith('//') || /\.[a-z0-9]+$/i.test(href)) return
      e.preventDefault()
      router.push(href)
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [seen, router])

  if (!seen) return null
  return (
    <div ref={host}>
      <DeployExperience active={home} />
    </div>
  )
}
