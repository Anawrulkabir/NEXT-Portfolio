import Link from 'next/link'
import { profile } from '@/content'

/**
 * Sticky bottom action bar on phones (§12.3) for /hire, /academic and
 * /research/*: the two things those readers came for, always one tap away.
 * Pages using it add bottom padding so the bar never covers content.
 */
export function MobileActionBar() {
  const email = profile.links.find((l) => l.kind === 'email')!.href
  return (
    <div className="md:hidden print:hidden fixed inset-x-0 bottom-0 z-40 border-t-2 border-loam bg-slate/95 backdrop-blur-sm px-4 py-2 flex gap-3">
      <Link
        href={profile.cv.viewHref}
        className="flex-1 pixel-btn-primary pixel-frame pixel-focus min-h-[44px] inline-flex items-center justify-center text-sm"
      >
        View CV
      </Link>
      <a
        href={email}
        className="flex-1 pixel-btn-secondary pixel-frame pixel-focus min-h-[44px] inline-flex items-center justify-center text-sm"
      >
        Email
      </a>
    </div>
  )
}
