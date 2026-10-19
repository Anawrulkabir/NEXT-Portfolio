'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import './site.css'
import { mountSite } from './figures'
import { currentTheme, setTheme } from '@/lib/theme'

const CV = {
  swe: '/cv/Md-Anawrul-Kabir-Fahad-SWE-CV.pdf',
  academic: '/cv/Md-Anawrul-Kabir-Fahad-Academic-CV.pdf',
}

type Section = 'work' | 'research' | 'about'

/**
 * One page of the site: the shared topbar and footer around a page body from ./pages. The body is
 * plain HTML (rendered on the server); figures, the reading rail and the Work catalogue are wired
 * in the browser by mountSite. The island stays alive behind these pages, so its links are router
 * links too: going back to it wakes it as it was left.
 * On a phone the topbar folds into a menu, and a case study gets a way back to its list.
 */
export function SitePage({
  body,
  section,
  back,
}: {
  body: string
  section: Section
  back?: { href: string; label: string }
}) {
  const host = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState(false)
  // React compares this prop by identity: a new object on every render (opening the menu) would rewrite the body
  const html = useMemo(() => ({ __html: body }), [body])

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

  // the phone menu: Esc closes it, and the page behind it doesn't scroll
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('menu-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('menu-open')
    }
  }, [menu])

  const nav = (href: string, label: string, key: Section) => (
    <Link href={href} aria-current={section === key ? 'page' : undefined}>
      {label}
    </Link>
  )
  const close = () => setMenu(false)

  return (
    <div className="v3">
      <div className="site">
        <header className="topbar">
          <Link className="brand" href="/">
            <b>Fahad Kabir</b>
            <span>Mechanical · CUET</span>
          </Link>
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
            <Link className="island opt" href="/">
              Island
            </Link>
            <button
              className="themebtn"
              type="button"
              aria-label="Day or night"
              title="Day or night"
              onClick={() => setTheme(currentTheme() === 'dark' ? 'light' : 'dark')}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" />
              </svg>
            </button>
            <button
              className="menubtn"
              type="button"
              aria-label={menu ? 'Close the menu' : 'Open the menu'}
              aria-expanded={menu}
              aria-controls="site-menu"
              onClick={() => setMenu((m) => !m)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                {menu ? <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" /> : <path d="M3 5.5h12M3 9h12M3 12.5h12" />}
              </svg>
            </button>
          </nav>
        </header>
        <div id="site-menu" className="sitemenu" data-open={menu || undefined} hidden={!menu}>
          <nav aria-label="Pages">
            <Link href="/work" onClick={close} aria-current={section === 'work' ? 'page' : undefined}>
              Work
            </Link>
            <Link className="sub" href="/work/snake-robot" onClick={close}>
              Compliant snake robot
            </Link>
            <Link className="sub" href="/work/propbench" onClick={close}>
              PropBench
            </Link>
            <Link href="/research" onClick={close} aria-current={section === 'research' ? 'page' : undefined}>
              Research
            </Link>
            <Link href="/about" onClick={close} aria-current={section === 'about' ? 'page' : undefined}>
              About
            </Link>
            <Link href="/" onClick={close}>
              The island
            </Link>
          </nav>
          <div className="sitemenu-cv">
            <a className="btn" href={CV.swe} download>
              Software engineering CV <small>PDF</small>
            </a>
            <a className="btn" href={CV.academic} download>
              Academic CV <small>PDF</small>
            </a>
          </div>
        </div>
        {back && (
          <nav className="crumb" aria-label="Back">
            <Link href={back.href}>← {back.label}</Link>
          </nav>
        )}
        <div ref={host} dangerouslySetInnerHTML={html} />
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
            <Link href="/">The island</Link>
          </nav>
        </footer>
      </div>
    </div>
  )
}
