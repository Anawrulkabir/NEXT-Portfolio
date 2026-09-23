import Link from 'next/link'
import { profile, visibleLinks } from '@/content'
import { CopyEmailButton } from '@/components/content/CopyEmailButton'

/** Field Office card (§05.2 Room R2): email with copy, links as text labels, CV. */
export function ContactCard() {
  const email = profile.links.find((l) => l.kind === 'email')!.href.replace('mailto:', '')
  const links = visibleLinks(profile.links).filter((l) => l.kind !== 'email')
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg">Get in touch</h3>
      <div className="flex flex-wrap items-center gap-3">
        <a href={`mailto:${email}`} className="pixel-focus underline underline-offset-2 break-all">
          {email}
        </a>
        <CopyEmailButton email={email} />
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {links.map((l) => (
          <li key={l.kind}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="pixel-focus underline underline-offset-2">
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <Link href={profile.cv.viewHref} className="pixel-focus underline underline-offset-2">
            CV
          </Link>
        </li>
      </ul>
    </div>
  )
}
