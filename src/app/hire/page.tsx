import type { Metadata } from 'next'
import Link from 'next/link'
import {
  evidenceLabel,
  experience,
  experienceHighlights,
  hireSnapshot,
  isSkillVisible,
  profile,
  projectsByShelf,
  skillGroups,
  skillsByGroup,
  visibleLinks,
  type Skill,
} from '@/content'
import { CopyEmailButton } from '@/components/content/CopyEmailButton'
import { ExperienceBlock } from '@/components/experience/ExperienceBlock'
import { ProjectCompact } from '@/components/panels/ProjectCompact'
import { isLiveRoute } from '@/lib/routes'
import { shortInstitution } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Hiring brief',
  description:
    'One-minute recruiter brief: experience at Poridhi.io on GPU infrastructure (Kubernetes, HAMi, AWS), skills, projects and CV.',
}

/** Where a skill's first piece of evidence lives, if that page exists yet. */
function evidenceHref(e: Skill['evidence'][number]): string | null {
  if (e.type === 'experience') return '/experience'
  if (e.type === 'research') return `/research/${e.id}`
  if (e.type === 'project') return '/projects'
  return null
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-h`} className="mt-12 break-inside-avoid-page">
      <h2 id={`${id}-h`} className="font-display text-xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function HirePage() {
  const email = profile.links.find((l) => l.kind === 'email')!.href.replace('mailto:', '')
  const edu = profile.education[0]
  const projects = [...projectsByShelf('systems'), ...projectsByShelf('hackathon')].slice(0, 5)

  return (
    <div className="hire max-w-[960px] mx-auto px-4 md:px-6 py-12 md:py-16">
      {/* 1. Header */}
      <header>
        <h1 className="font-display text-3xl md:text-4xl">{profile.name}</h1>
        <p className="mt-2 text-lg text-signal">{profile.positioning}</p>
        <p className="mt-1 text-parchment/80">{profile.location}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 print:hidden">
          <Link href={profile.cv.viewHref} className="pixel-btn-primary pixel-frame pixel-focus px-4 py-2 text-sm">
            View CV
          </Link>
          <a
            href={profile.cv.downloadHref}
            download
            className="pixel-btn-secondary pixel-frame pixel-focus px-4 py-2 text-sm"
          >
            Download CV
          </a>
          <a href={`mailto:${email}`} className="pixel-btn-secondary pixel-frame pixel-focus px-4 py-2 text-sm">
            Email me
          </a>
          <CopyEmailButton email={email} />
        </div>
      </header>

      {/* 2. Snapshot */}
      <section aria-label="Snapshot" className="mt-8 pixel-panel pixel-frame p-5 max-w-[760px]">
        <p className="leading-relaxed">
          {hireSnapshot} {edu.degree}, {shortInstitution(edu.institution)} ({edu.dates.endLabel ?? edu.dates.end}).
        </p>
      </section>

      {/* 3. Experience */}
      <Section id="experience" title="Experience">
        {experience.map((e) => (
          <ExperienceBlock key={e.id} experience={e} headingLevel={3} />
        ))}
      </Section>

      {/* 4. Infrastructure highlights */}
      <Section id="highlights" title="Infrastructure highlights">
        <ul className="grid md:grid-cols-3 gap-3">
          {experienceHighlights.map((h) => (
            <li key={h.text} className="border-2 border-signal/60 p-4 text-sm leading-relaxed">
              <p>{h.text}</p>
              <Link href={`/experience#${h.anchor}`} className="pixel-focus mt-2 inline-block text-xs underline">
                Source bullet {'→'}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Skills */}
      <Section id="skills" title="Skills">
        <dl className="space-y-3 text-sm">
          {skillGroups.map((group) => {
            const skills = skillsByGroup(group.id).filter(isSkillVisible)
            return (
              <div key={group.id} className="md:grid md:grid-cols-[200px_1fr] gap-4">
                <dt className="font-semibold">{group.name}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {skills.map((skill, i) => {
                      const ev = skill.evidence[0]
                      const label = ev ? evidenceLabel(ev) : null
                      const href = ev ? evidenceHref(ev) : null
                      return (
                        <li key={skill.id}>
                          {skill.name}
                          {label && (
                            <span className="text-parchment/70">
                              {' ('}
                              {href && isLiveRoute(href) ? (
                                <Link href={href} className="pixel-focus underline underline-offset-2">
                                  {label}
                                </Link>
                              ) : (
                                label
                              )}
                              {')'}
                            </span>
                          )}
                          {i < skills.length - 1 && <span aria-hidden="true">,</span>}
                        </li>
                      )
                    })}
                  </ul>
                </dd>
              </div>
            )
          })}
        </dl>
      </Section>

      {/* 6. Projects */}
      <Section id="projects" title="Projects">
        <ul className="grid md:grid-cols-2 gap-3">
          {projects.map((p) => (
            <li key={p.id}>
              <ProjectCompact project={p} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 7. Also */}
      <Section id="also" title="Also">
        <ul className="space-y-1.5 text-sm">
          <li>
            {isLiveRoute('/research') ? (
              <Link href="/research" className="pixel-focus underline underline-offset-2">
                Research in machine learning for engineering systems
              </Link>
            ) : (
              'Research in machine learning for engineering systems'
            )}
          </li>
          <li>
            <Link href="/journey#dungeon" className="pixel-focus underline underline-offset-2">
              Competitive programming background
            </Link>
          </li>
        </ul>
      </Section>

      {/* 8. Contact */}
      <Section id="contact" title="Contact">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {visibleLinks(profile.links)
            .filter((l) => ['email', 'linkedin', 'github', 'scholar', 'orcid'].includes(l.kind))
            .map((l) => (
              <li key={l.kind}>
                <a href={l.href} className="pixel-focus underline underline-offset-2">
                  {l.kind === 'email' ? email : l.label}
                </a>
              </li>
            ))}
          <li>
            <Link href={profile.cv.viewHref} className="pixel-focus underline underline-offset-2">
              CV
            </Link>
          </li>
        </ul>
      </Section>
    </div>
  )
}
