import type { Metadata } from 'next'
import Link from 'next/link'
import { research, researchInterests, type Research } from '@/content'
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs'
import { ResearchCard } from '@/components/research/ResearchCard'

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Machine learning for engineering systems: a PINN solver for high-incidence airfoil flow (thesis), and ML for heat transfer of low-GWP refrigerants R455A and R1336mzz(E).',
}

const groups: { id: string; title: string; match: (r: Research) => boolean }[] = [
  { id: 'thesis', title: 'Thesis', match: (r) => r.kind === 'thesis' },
  { id: 'manuscripts', title: 'Manuscripts', match: (r) => r.kind === 'manuscript' && r.status !== 'published' },
  { id: 'in-progress', title: 'Research in progress', match: (r) => r.kind === 'project' },
  { id: 'publications', title: 'Publications', match: (r) => r.status === 'published' || r.status === 'accepted' },
  { id: 'conference-papers', title: 'Conference papers', match: (r) => r.kind === 'conference-paper' },
]

export default function ResearchPage() {
  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Research' }]} />
      <h1 className="font-display text-3xl md:text-4xl">Research</h1>

      <section aria-labelledby="interests-h" className="mt-10">
        <h2 id="interests-h" className="font-display text-xl">
          Interests
        </h2>
        <ul className="mt-4 grid md:grid-cols-2 gap-x-8 gap-y-2 max-w-[860px] list-disc pl-5">
          {researchInterests.map((i) => (
            <li key={i} className="leading-relaxed">
              {i}
            </li>
          ))}
        </ul>
      </section>

      {groups.map((g) => {
        const items = research.filter(g.match)
        // Empty groups (publications, conference papers) stay hidden (§03.5).
        if (!items.length) return null
        return (
          <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="mt-12 scroll-mt-20">
            <h2 id={`${g.id}-h`} className="font-display text-xl">
              {g.title}
            </h2>
            <ul className="mt-4 grid gap-4 max-w-[860px]">
              {items.map((r) => (
                <li key={r.id} className="pixel-panel pixel-frame p-5">
                  <ResearchCard research={r} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      <section aria-labelledby="events-h" className="mt-12">
        <h2 id="events-h" className="font-display text-xl">
          Events & talks
        </h2>
        <p className="mt-3">
          <Link href="/archive#events" className="pixel-focus underline underline-offset-2">
            Conferences and events in the archive {'→'}
          </Link>
        </p>
      </section>
    </div>
  )
}
