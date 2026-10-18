'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import './site.css'
import { mountSite } from './figures'

const CV = {
  swe: '/cv/Md-Anawrul-Kabir-Fahad-SWE-CV.pdf',
  academic: '/cv/Md-Anawrul-Kabir-Fahad-Academic-CV.pdf',
}

type Section = 'work' | 'research' | 'about'

/**
 * One page of the site: the shared topbar and footer around a page body from ./pages. The body is
 * plain HTML (rendered on the server); figures, the reading rail and the Work catalogue are wired
 * in the browser by mountSite. Links to the island are plain anchors, so it always starts fresh.
 */
export function SitePage({ body, section }: { body: string; section: Section }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = host.current
    if (!root) return
    // a second mount (React's strict mode, or a body change) starts again from the original HTML
    if (root.dataset.mounted) root.innerHTML = body
    root.dataset.mounted = '1'
    // the text is the content; a figure that fails must not take the page down with it
    try {
      return mountSite(root)
    } catch (err) {
      console.error(err)
    }
  }, [body])

  const nav = (href: string, label: string, key: Section) => (
    <Link href={href} aria-current={section === key ? 'page' : undefined}>
      {label}
    </Link>
  )

  return (
    <div className="v3">
      <div className="site">
        <header className="topbar">
          <a className="brand" href="/">
            <b>Fahad Kabir</b>
            <span>Mechanical · CUET</span>
          </a>
          <nav className="nav" aria-label="Site">
            {nav('/work', 'Work', 'work')}
            {nav('/research', 'Research', 'research')}
            {nav('/about', 'About', 'about')}
            <details className="cvmenu">
              <summary>CV</summary>
              <div>
                <a href={CV.swe} download>
                  Software engineering CV <small>PDF</small>
                </a>
                <a href={CV.academic} download>
                  Academic CV <small>PDF</small>
                </a>
              </div>
            </details>
            <a className="island opt" href="/">
              Island
            </a>
          </nav>
        </header>
        <div ref={host} dangerouslySetInnerHTML={{ __html: body }} />
        <footer className="foot">
          <p>Md Anawrul Kabir Fahad · Mechanical Engineering, CUET</p>
          <nav aria-label="Elsewhere">
            <a href="https://github.com/anawrulkabir" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/anawrulkabir" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={CV.swe} download>
              SWE CV
            </a>
            <a href={CV.academic} download>
              Academic CV
            </a>
            <a href="/">The island</a>
          </nav>
        </footer>
      </div>
    </div>
  )
}
