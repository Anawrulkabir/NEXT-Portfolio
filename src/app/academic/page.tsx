import type { Metadata } from 'next'
import Link from 'next/link'
import { MobileActionBar } from '@/components/chrome/MobileActionBar'
import {
  academicLine,
  events,
  isPending,
  profile,
  research,
  researchById,
  researchInterests,
} from '@/content'
import { CopyEmailButton } from '@/components/content/CopyEmailButton'
import { Field } from '@/components/content/Field'
import { EventCard } from '@/components/panels/EventCard'
import { ResearchCard } from '@/components/research/ResearchCard'
import { shortInstitution } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Academic overview',
  description:
    'Research overview for prospective supervisors: PINN thesis on high-incidence airfoil flow, ML for low-GWP refrigerant heat transfer, engineering and computing background.',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-h`} className="mt-12">
      <h2 id={`${id}-h`} className="font-display text-xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

/** Researcher / professor brief (§11). Single scroll, no world. */
export default function AcademicPage() {
  const email = profile.links.find((l) => l.kind === 'email')!.href.replace('mailto:', '')
  const edu = profile.education[0]
  const thesis = researchById['pinn-naca0012-thesis']
  const ongoing = research.filter((r) => r.kind === 'manuscript' || r.kind === 'project')
  const publications = research.filter((r) => r.status === 'published' || r.status === 'accepted')
  const talks = events.filter(
    (e) => (e.type === 'conference' || e.type === 'research-event') && !isPending(e.name)
  )
  const academicCv = profile.cv.academic && !isPending(profile.cv.academic) ? profile.cv.academic : null
  const scholarly = profile.links.filter((l) => ['scholar', 'orcid', 'linkedin'].includes(l.kind))

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 pt-12 pb-28 md:py-16">
      <MobileActionBar />
      {/* 1. Header */}
      <header>
        <h1 className="font-display text-3xl md:text-4xl">{profile.name}</h1>
        {isPending(academicLine) ? (
          <>
            <p className="mt-2 text-lg text-signal">{profile.positioning}</p>
            <Field as="p" value={academicLine} className="mt-2" />
          </>
        ) : (
          <p className="mt-2 text-lg text-signal">{academicLine}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href={profile.cv.viewHref} className="pixel-btn-primary pixel-frame pixel-focus px-4 py-2 text-sm">
            View CV
          </Link>
          {academicCv && (
            <a href={academicCv} className="pixel-btn-secondary pixel-frame pixel-focus px-4 py-2 text-sm">
              Academic CV
            </a>
          )}
          <a href={`mailto:${email}`} className="pixel-btn-secondary pixel-frame pixel-focus px-4 py-2 text-sm">
            Email
          </a>
          <CopyEmailButton email={email} />
        </div>
      </header>

      {/* 2. Interests */}
      <Section id="interests" title="Research interests">
        <ul className="list-disc pl-5 space-y-1.5 leading-relaxed max-w-[760px]">
          {researchInterests.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Section>

      {/* 3. Thesis */}
      <Section id="thesis" title="Thesis">
        <div className="pixel-panel pixel-frame p-5">
          <ResearchCard research={thesis} />
        </div>
      </Section>

      {/* 4. Manuscripts & ongoing work */}
      <Section id="ongoing" title="Manuscripts & ongoing work">
        <ul className="grid md:grid-cols-2 gap-4">
          {ongoing.map((r) => (
            <li key={r.id} className="pixel-panel pixel-frame p-5">
              <ResearchCard research={r} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Publications — only once one exists */}
      {publications.length > 0 && (
        <Section id="publications" title="Publications">
          <ul className="grid gap-4">
            {publications.map((r) => (
              <li key={r.id} className="pixel-panel pixel-frame p-5">
                <ResearchCard research={r} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 6. Engineering background */}
      <Section id="engineering" title="Engineering background">
        <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
          <li>
            {edu.degree}, {shortInstitution(edu.institution)} ({edu.dates.endLabel ?? edu.dates.end}).
          </li>
          <li>Thermal and fluid systems: heat transfer, refrigeration, plate heat exchangers, airfoil aerodynamics.</li>
          <li>
            Hands-on robotics: built and programmed a remote-controlled soccer bot (Arduino) for a 2022 robosoccer
            competition.
          </li>
        </ul>
      </Section>

      {/* 7. Computing background */}
      <Section id="computing" title="Computing background">
        <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
          <li>
            Professional GPU-infrastructure work at Poridhi.io: bare-metal Kubernetes, GPU virtualization, AWS.{' '}
            <Link href="/experience" className="pixel-focus underline underline-offset-2">
              Experience
            </Link>
          </li>
          <li>
            Competitive programming: ICPC Preliminaries (2022, 2023), CUET IUPC, 300+ problems solved.{' '}
            <Link href="/journey#dungeon" className="pixel-focus underline underline-offset-2">
              More
            </Link>
          </li>
        </ul>
      </Section>

      {/* 8. Conferences & events — hidden while empty */}
      {talks.length > 0 && (
        <Section id="events" title="Conferences & events">
          <ul className="grid md:grid-cols-2 gap-4">
            {talks.map((e) => (
              <li key={e.id} className="pixel-panel pixel-frame p-5">
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 9. Contact */}
      <Section id="contact" title="Contact">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <a href={`mailto:${email}`} className="pixel-focus underline underline-offset-2">
              {email}
            </a>
          </li>
          {scholarly.map((l) => (
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
      </Section>
    </div>
  )
}
