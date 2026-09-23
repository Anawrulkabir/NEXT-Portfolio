import type { Experience } from '@/content'
import { RoleBlock } from './RoleBlock'

/**
 * A company with its roles stacked newest-first, so a promotion reads as one
 * story rather than two jobs (§03.7).
 */
export function ExperienceBlock({ experience, headingLevel = 2 }: { experience: Experience; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as 'h2' | 'h3'
  return (
    <article className="pixel-panel pixel-frame p-5 md:p-7">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4">
        <H className="font-display text-2xl">{experience.org}</H>
        <p className="text-sm opacity-80">{experience.location}</p>
      </header>
      <ol className="mt-6 space-y-8 border-l-2 border-loam pl-5">
        {experience.roles.map((role) => (
          <li key={role.id} className="relative">
            <span
              className="absolute -left-[27px] top-2 h-3 w-3 border-2 border-loam bg-parchment"
              aria-hidden="true"
            />
            <RoleBlock role={role} headingLevel={headingLevel === 2 ? 3 : 4} />
          </li>
        ))}
      </ol>
    </article>
  )
}
