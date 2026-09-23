import Link from 'next/link'
import { profile } from '@/content'
import { ExploreButton } from './ExploreButton'

/**
 * Above-the-fold identity block (§04.1-04.2). Plain server-rendered HTML —
 * it's the LCP element and must never wait on the world.
 *
 */
export function HeroIdentity() {
  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 pt-12 md:pt-16">
      <h1 className="font-display text-[32px] leading-tight md:text-[48px]">{profile.name}</h1>
      <p className="mt-3 text-lg md:text-xl text-signal">{profile.positioning}</p>
      <p className="mt-2 max-w-[680px] text-base md:text-[17px] leading-relaxed text-parchment/85">
        {profile.sentence}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ExploreButton />
        <Link href={profile.cv.viewHref} className="pixel-btn-secondary pixel-frame pixel-focus px-4 py-2 text-sm">
          View CV
        </Link>
      </div>
      <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/hire" className="pixel-focus text-parchment/85 underline underline-offset-2 hover:text-amber">
          Hiring? Read the 1-minute brief {'→'}
        </Link>
        <Link href="/academic" className="pixel-focus text-parchment/85 underline underline-offset-2 hover:text-amber">
          Academic? See research {'→'}
        </Link>
      </p>
    </div>
  )
}
