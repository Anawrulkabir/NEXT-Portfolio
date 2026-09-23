import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { profile, isPending } from '@/content'
import { mediaMeta } from '@/lib/media'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  const education = profile.education[0]
  const hasPortrait = !isPending(profile.portrait)

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
      <h1 className="font-display text-3xl md:text-4xl">{profile.name}</h1>
      <p className="mt-2 text-signal">{profile.positioning}</p>
      <p className="mt-1 text-parchment/70">{profile.location}</p>

      <div className="mt-10 grid md:grid-cols-[1fr_auto] gap-10 items-start">
        <div className="max-w-[680px] space-y-4">
          {profile.about.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {hasPortrait && !isPending(profile.portrait) && (
          <Image
            src={profile.portrait.src as string}
            alt={profile.portrait.alt}
            width={mediaMeta(profile.portrait.src as string).width}
            height={mediaMeta(profile.portrait.src as string).height}
            sizes="280px"
            priority
            className="pixel-frame w-[240px] md:w-[280px] h-auto"
          />
        )}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl">Education</h2>
        <div className="mt-4 pixel-panel pixel-frame p-6 max-w-[680px]">
          <p className="font-semibold">{education.degree}</p>
          <p className="text-sm mt-1">{education.institution}</p>
          <p className="text-sm text-ink/70">
            {education.location} {'·'} {education.dates.start.replace('-04', '')}{' '}
            {'—'} {education.dates.endLabel ?? education.dates.end}
          </p>
          {education.details && education.details.some((d) => !isPending(d)) && (
            <ul className="mt-3 text-sm list-disc list-inside space-y-1">
              {education.details.map((detail, i) =>
                isPending(detail) ? null : <li key={i}>{detail}</li>
              )}
            </ul>
          )}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href={profile.cv.viewHref} className="pixel-btn-primary pixel-frame pixel-focus px-4 py-2 text-sm">
          View CV
        </Link>
        <Link href="/contact" className="pixel-btn-secondary pixel-frame pixel-focus px-4 py-2 text-sm">
          Contact
        </Link>
      </div>
    </div>
  )
}
