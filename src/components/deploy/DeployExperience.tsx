'use client'

import { useEffect, useRef } from 'react'
import './deploy.css'
import { SHELL } from './shell'

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
 */
export function DeployExperience() {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = host.current?.querySelector<HTMLElement>('[data-x]')
    if (!root || root.dataset.mounted) return
    root.dataset.mounted = '1'
    let alive = true
    Promise.all([import('three'), import('@lucasmarkes/hairline'), import('./engine')])
      .then(([THREE, HLIB, engine]) => {
        if (!alive) return
        try {
          ;(window as unknown as { __x?: unknown }).__x = engine.mountDeploy(THREE, HLIB, root, IMG)
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

  return <div ref={host} dangerouslySetInnerHTML={{ __html: SHELL }} />
}
