import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isPending, profile, research, researchById, stripPending, visibleLinks, type Maybe } from '@/content'
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs'
import { Field } from '@/components/content/Field'
import { LinkRow } from '@/components/content/LinkRow'
import { MediaSlot } from '@/components/content/MediaSlot'
import { TechChips } from '@/components/content/TechChips'
import { AirfoilDemo } from '@/components/research/AirfoilDemo'
import { ResearchPipeline } from '@/components/research/ResearchPipeline'
import { StatusBadge } from '@/components/research/StatusBadge'
import { researchTitle } from '@/components/research/ResearchCard'

export const dynamicParams = false

export function generateStaticParams() {
  return research.map((r) => ({ slug: r.id }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = researchById[params.slug]
  if (!r) return {}
  return { title: r.shortTitle, description: r.oneLine }
}

const filled = (v: Maybe<string> | undefined): v is string => v !== undefined && !isPending(v)
const anyFilled = (vs: Maybe<string>[]) => vs.some(filled)

/** One outline section; hidden in production when nothing in it is supplied. */
function Part({ title, values }: { title: string; values: Maybe<string>[] }) {
  const dev = process.env.NODE_ENV !== 'production'
  if (!values.length || (!dev && !anyFilled(values))) return null
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg">{title}</h2>
      {values.length === 1 ? (
        <Field as="p" value={values[0]} className="mt-2 leading-relaxed" />
      ) : (
        <ul className="mt-2 list-disc pl-5 space-y-1.5 leading-relaxed">
          {values.map((v, i) => (
            <Field key={i} as="li" value={v} />
          ))}
        </ul>
      )}
    </section>
  )
}

/**
 * Research detail (§03.5): Question → Engineering system → Data → Method →
 * What I'm investigating / findings → Status → Links, then "Discuss this work".
 * Findings render only when the author supplies them.
 */
export default function ResearchDetailPage({ params }: { params: { slug: string } }) {
  const r = researchById[params.slug]
  if (!r) notFound()
  const email = profile.links.find((l) => l.kind === 'email')!.href

  return (
    <article className="max-w-[860px] mx-auto px-4 md:px-6 py-16">
      <Breadcrumbs items={[{ label: 'Research', href: '/research' }, { label: r.shortTitle }]} />
      <StatusBadge status={r.status} />
      <h1 className="mt-3 font-display text-2xl md:text-3xl leading-snug">{researchTitle(r)}</h1>
      <p className="mt-4 text-lg leading-relaxed">{r.oneLine}</p>
      {filled(r.supervisor) && (
        <p className="mt-3">
          <span className="font-semibold">Supervisor:</span> {r.supervisor}
        </p>
      )}
      {filled(r.authors) ? (
        <p className="mt-1">
          <span className="font-semibold">Authors:</span> {r.authors}
        </p>
      ) : (
        r.authors && <Field as="p" value={r.authors} className="mt-2" />
      )}
      {r.showVenue && filled(r.venue) && <p className="mt-1">{r.venue}</p>}

      <Part title="Question" values={[r.question]} />
      <Part title="Engineering system" values={[r.system]} />
      <Part title="Data" values={[r.data]} />
      <Part title="Method" values={r.method} />

      {r.pipeline?.length ? (
        <section className="mt-8 pixel-panel pixel-frame p-5">
          <h2 className="font-display text-lg mb-3">From experiment to insight</h2>
          <ResearchPipeline research={stripPending(r)} showHeader={false} />
        </section>
      ) : null}

      {r.kind === 'thesis' && (
        <section className="mt-8 pixel-panel pixel-frame p-5">
          <h2 className="font-display text-lg mb-3">The idea, illustrated</h2>
          <AirfoilDemo />
        </section>
      )}

      <Part title="What I’m investigating" values={r.investigating} />
      {r.findings.some(filled) && <Part title="Findings" values={r.findings.filter(filled)} />}

      {r.figures.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="font-display text-lg">Figures</h2>
          {r.figures.map((f) => (
            <MediaSlot key={f.id} image={f} />
          ))}
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-display text-lg">Status</h2>
        <p className="mt-2">
          <StatusBadge status={r.status} />
        </p>
      </section>

      {(r.tags.length > 0 || visibleLinks(r.links).length > 0 || filled(r.doi)) && (
        <section className="mt-8 space-y-3">
          <h2 className="font-display text-lg">Links & methods</h2>
          {filled(r.doi) && (
            <p>
              <a href={`https://doi.org/${r.doi}`} className="pixel-focus underline underline-offset-2">
                doi:{r.doi}
              </a>
            </p>
          )}
          <LinkRow links={r.links} />
          <TechChips ids={r.tags} />
        </section>
      )}

      <p className="mt-12">
        <a
          href={`${email}?subject=${encodeURIComponent(r.shortTitle)}`}
          className="pixel-focus pixel-btn-primary pixel-frame inline-block px-4 py-2 text-sm"
        >
          Discuss this work {'→'} email
        </a>
      </p>
    </article>
  )
}
