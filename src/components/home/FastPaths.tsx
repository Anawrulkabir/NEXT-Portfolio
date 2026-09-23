import Link from 'next/link'
import { isLiveRoute } from '@/lib/routes'

/** Fast paths for visitors who won't play (§03.2 item 6, §10, §11). */
const paths = [
  { href: '/hire', lead: 'Hiring?', label: 'Read the 1-minute brief' },
  { href: '/academic', lead: 'Academic?', label: 'Research overview' },
]

export function FastPaths() {
  const live = paths.filter((p) => isLiveRoute(p.href))
  return (
    <nav aria-label="Fast paths" className="max-w-[1120px] mx-auto px-4 md:px-6 mt-10">
      <ul className="flex flex-wrap gap-3">
        {live.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="pixel-focus pixel-btn-secondary pixel-frame inline-block px-4 py-2 text-sm">
              <span className="font-semibold">{p.lead}</span> {p.label} {'→'}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
