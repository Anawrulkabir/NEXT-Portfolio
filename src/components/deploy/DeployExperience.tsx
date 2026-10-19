'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import './deploy.css'
import { SHELL } from './shell'
import type { DeployApi } from './engine'

const CERTS = [
  'break-the-monolith-champion',
  'api-avengers-finalist',
  'api-avengers-rising-team',
  'ai-engineering-hackathon-2025',
  'nsu-techfest-webxtreme-2025',
  'nextgen-hackathon-2025',
  'asrro-robocoder-2022',
  'cuss-robo-soccer',
]

// one object for good: React compares this prop by identity, and a new one would rewrite the live DOM
const SHELL_HTML = { __html: SHELL }

/** Every image the world shows, by the name the engine asks for. */
const IMG: Record<string, string> = {
  ...Object.fromEntries(CERTS.map((id) => [id, `/media/certificates/${id}.webp`])),
  versions: '/media/robot/versions.webp',
  bench: '/media/robot/bench.webp',
  parts: '/media/robot/parts.webp',
  portrait: '/media/portrait/fahad-2026.webp',
  chart: '/media/projects/snake/success-vs-g.webp',
  pbresults: '/media/projects/propbench/results.webp',
}

/**
 * The home page: a portfolio you deploy. The interface is plain HTML rendered
 * with the page; three, Hairline and the engine load after it, in the browser.
 * It is mounted once, by IslandHost in the root layout: while another route
 * shows, it is hidden and asleep (no frames, keys or sound), and coming back
 * wakes it exactly as it was left, with nothing deployed twice.
 */
export function DeployExperience({ active }: { active: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const engine = useRef<DeployApi | null>(null)
  const awake = useRef(active)

  useEffect(() => {
    const root = host.current?.querySelector<HTMLElement>('[data-x]')
    if (!root || root.dataset.mounted) return
    root.dataset.mounted = '1'
    let alive = true
    const ref = engine
    Promise.all([import('three'), import('@lucasmarkes/hairline'), import('./engine')])
      .then(([THREE, HLIB, engine]) => {
        if (!alive) return
        try {
          const api = engine.mountDeploy(THREE, HLIB, root, IMG)
          ;(window as unknown as { __x?: unknown }).__x = api
          ref.current = api
          if (!awake.current) api.pause()
        } catch (err) {
          console.error(err)
          root.classList.add('no-gl')
        }
      })
      .catch((err) => {
        console.error(err)
        root.classList.add('no-gl')
      })
    return () => {
      alive = false
    }
  }, [])

  // before paint, so the engine is asleep before it can see itself collapse to nothing
  useLayoutEffect(() => {
    awake.current = active
    if (active) engine.current?.resume()
    else engine.current?.pause()
  }, [active])

  return <div ref={host} hidden={!active} dangerouslySetInnerHTML={SHELL_HTML} />
}
