import Link from 'next/link'
import { profile, visibleLinks } from '@/content'
import { MotionToggle } from './MotionToggle'

export function Footer() {
  return (
    <footer className="print:hidden mt-24 border-t-2 border-loam bg-slate">
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 pt-10 pb-24 md:pb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-parchment/70">
            {profile.name} {'·'} last updated {profile.cv.updated}
          </p>
          <MotionToggle className="text-parchment/80 self-start" />
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
          {visibleLinks(profile.links).map((link) => (
            <a
              key={link.kind}
              href={link.href}
              target={link.kind === 'email' ? undefined : '_blank'}
              rel={link.kind === 'email' ? undefined : 'noopener noreferrer'}
              className="pixel-focus text-parchment hover:text-amber"
            >
              {link.label}
            </a>
          ))}
          <Link href={profile.cv.viewHref} className="pixel-focus text-parchment hover:text-amber">
            CV
          </Link>
        </nav>
      </div>
    </footer>
  )
}
