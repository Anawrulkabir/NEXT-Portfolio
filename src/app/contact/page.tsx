import type { Metadata } from 'next'
import Link from 'next/link'
import { profile } from '@/content'
import { CopyEmailButton } from '@/components/content/CopyEmailButton'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  const email = profile.links.find((l) => l.kind === 'email')

  return (
    <div className="max-w-[680px] mx-auto px-4 md:px-6 py-16">
      <h1 className="font-display text-3xl">Get in touch</h1>
      <p className="mt-3 text-parchment/80">{profile.sentence}</p>

      {email && (
        <div className="mt-8 pixel-panel pixel-frame p-6 flex flex-wrap items-center gap-3">
          <a href={email.href} className="pixel-focus underline">
            {email.href.replace('mailto:', '')}
          </a>
          <CopyEmailButton email={email.href.replace('mailto:', '')} />
        </div>
      )}

      <nav className="mt-8 flex flex-col gap-3" aria-label="Other links">
        {profile.links
          .filter((l) => l.kind !== 'email')
          .map((link) => (
            <a
              key={link.kind}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-focus text-parchment hover:text-amber"
            >
              {link.label}
            </a>
          ))}
      </nav>

      <div className="mt-8">
        <Link href={profile.cv.viewHref} className="pixel-btn-primary pixel-frame pixel-focus px-4 py-2 text-sm">
          View CV
        </Link>
      </div>
    </div>
  )
}
