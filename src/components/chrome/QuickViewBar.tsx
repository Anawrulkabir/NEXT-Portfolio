import Link from 'next/link'
import { profile, visibleLinks } from '@/content'
import { MobileMenu } from './MobileMenu'

/**
 * Quick View bar — see docs/PORTFOLIO_REDESIGN.md §03.3.
 *
 * The full nav is Home/About/Experience/Research/Projects/Skills/View CV/
 * Contact, but Experience, Research and Skills only get added here once
 * their routes land (Phases 4-6) — a nav item that 404s is worse than a
 * short nav. Never remove an item below without confirming its route
 * exists.
 */
const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
]

export function QuickViewBar() {
  return (
    <header className="print:hidden sticky top-0 z-50 h-14 flex items-center gap-4 px-4 md:px-6 bg-slate/95 backdrop-blur-sm border-b-2 border-loam">
      <Link href="/" className="pixel-focus font-display text-lg text-parchment shrink-0">
        {profile.shortName}
      </Link>

      <nav className="hidden md:flex items-center gap-5 text-sm flex-1" aria-label="Site">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="pixel-focus text-parchment hover:text-amber">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3 ml-auto">
        <Link
          href={profile.cv.viewHref}
          className="pixel-focus pixel-btn-primary pixel-frame px-3 py-1.5 text-sm"
        >
          View CV
        </Link>
        <Link href="/contact" className="pixel-focus text-parchment text-sm hover:text-amber">
          Contact
        </Link>
      </div>

      <div className="ml-auto md:hidden flex items-center gap-2">
        <Link
          href={profile.cv.viewHref}
          className="pixel-focus pixel-btn-primary pixel-frame px-3 py-1.5 text-xs"
        >
          CV
        </Link>
        <MobileMenu
          navItems={[{ label: 'Home', href: '/' }, ...navItems, { label: 'Contact', href: '/contact' }]}
          links={visibleLinks(profile.links)}
        />
      </div>
    </header>
  )
}
