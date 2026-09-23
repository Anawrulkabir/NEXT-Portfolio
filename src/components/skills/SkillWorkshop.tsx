import Link from 'next/link'
import {
  eventById,
  experienceById,
  isSkillVisible,
  projectById,
  projectTitle,
  researchById,
  skillsByGroup,
  type Skill,
  type SkillGroup,
} from '@/content'
import { isLiveRoute } from '@/lib/routes'

/** An evidence item resolved to a label and the page that proves it. */
export function evidenceLink(e: Skill['evidence'][number]): { label: string; href: string } | null {
  switch (e.type) {
    case 'experience': {
      const x = experienceById[e.id]
      return x ? { label: x.org, href: '/experience' } : null
    }
    case 'project': {
      const p = projectById[e.id]
      const t = p && projectTitle(p)
      return t ? { label: t, href: `/projects/${p.id}` } : null
    }
    case 'research': {
      const r = researchById[e.id]
      return r ? { label: r.shortTitle, href: `/research/${r.id}` } : null
    }
    case 'event': {
      const ev = eventById[e.id]
      return ev && typeof ev.name === 'string' ? { label: ev.name, href: '/archive#events' } : null
    }
  }
}

/**
 * One workshop (§06): its tools, each with where it was used. No levels,
 * no percentages — evidence is the whole point.
 */
export function SkillWorkshop({ group }: { group: SkillGroup }) {
  const skills = skillsByGroup(group.id).filter(isSkillVisible)
  if (!skills.length) return null
  return (
    <section id={group.id} aria-labelledby={`${group.id}-h`} className="pixel-panel pixel-frame scroll-mt-20">
      <div className="bg-loam text-parchment px-4 py-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`${group.id}-h`} className="font-display text-base">
          {group.name}
        </h2>
        <span className="text-xs">{group.workshop}</span>
      </div>
      <p className="px-4 pt-3 text-sm">{group.blurb}</p>
      <ul className="p-4 space-y-2 text-sm">
        {skills.map((skill) => {
          const links = skill.evidence
            .map(evidenceLink)
            .filter((l): l is { label: string; href: string } => !!l)
            .filter((l, i, all) => all.findIndex((x) => x.href === l.href) === i)
          return (
            <li key={skill.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-semibold">{skill.name}</span>
              {links.length > 0 && (
                <span className="text-xs">
                  used in{' '}
                  {links.map((l, i) => (
                    <span key={l.href}>
                      {i > 0 && ', '}
                      {isLiveRoute(l.href) ? (
                        <Link href={l.href} className="pixel-focus underline underline-offset-2">
                          {l.label}
                        </Link>
                      ) : (
                        l.label
                      )}
                    </span>
                  ))}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
