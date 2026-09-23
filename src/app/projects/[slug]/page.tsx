import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { events, experienceById, isPending, projectById, projects, projectTitle, type Maybe } from '@/content'
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs'
import { Field } from '@/components/content/Field'
import { LinkRow } from '@/components/content/LinkRow'
import { MediaSlot } from '@/components/content/MediaSlot'
import { TechChips } from '@/components/content/TechChips'
import { projectStatusLabel } from '@/components/projects/ProjectArtifact'
import { formatDate } from '@/lib/format'

export const dynamicParams = false

export function generateStaticParams() {
  return projects.filter((p) => projectTitle(p)).map((p) => ({ slug: p.id }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = projectById[params.slug]
  if (!p) return {}
  return { title: projectTitle(p) ?? undefined, description: p.oneLine }
}

const filled = (v: Maybe<string> | undefined): v is string => v !== undefined && !isPending(v)

/** Project detail (§03.6): what it is, the problem, my role, what I did, tech, images, links. */
export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const p = projectById[params.slug]
  const title = p && projectTitle(p)
  if (!p || !title) notFound()
  const event = events.find((e) => e.relatedProjectId === p.id)
  const exp = p.experienceId ? experienceById[p.experienceId] : undefined
  const status = typeof p.status === 'string' ? projectStatusLabel[p.status] : null
  const dev = process.env.NODE_ENV !== 'production'

  return (
    <article className="max-w-[860px] mx-auto px-4 md:px-6 py-16">
      <Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: title }]} />
      <div className="flex flex-wrap items-center gap-2">
        {filled(p.result) && (
          <span className="text-xs font-semibold border-2 border-moss bg-moss text-parchment px-2 py-0.5">
            {p.result}
          </span>
        )}
        {status && <span className="text-xs border border-loam px-2 py-0.5">{status}</span>}
        {p.verify && dev && (
          <span className="text-[10px] border border-dashed border-amber text-amber px-1.5">VERIFY</span>
        )}
      </div>
      <h1 className="mt-3 font-display text-2xl md:text-3xl">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed">{p.oneLine}</p>

      <dl className="mt-6 space-y-2">
        {event && !isPending(event.name) && (
          <div>
            <dt className="inline font-semibold">Built for: </dt>
            <dd className="inline">
              {event.name}
              {filled(event.organizer) && <>, {event.organizer}</>}
              {filled(event.date) && <> ({formatDate(event.date)})</>}
            </dd>
          </div>
        )}
        {filled(p.role) ? (
          <div>
            <dt className="inline font-semibold">Role: </dt>
            <dd className="inline">{p.role}</dd>
          </div>
        ) : (
          <Field as="div" value={p.role} />
        )}
        {p.date !== undefined &&
          (filled(p.date) ? (
            <div>
              <dt className="inline font-semibold">When: </dt>
              <dd className="inline">{p.date}</dd>
            </div>
          ) : (
            <Field as="div" value={p.date} />
          ))}
      </dl>

      {(filled(p.problem) || dev) && (
        <section className="mt-8">
          <h2 className="font-display text-lg">The problem</h2>
          <Field as="p" value={p.problem} className="mt-2 leading-relaxed" />
        </section>
      )}

      {p.contribution.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg">What I did</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1.5 leading-relaxed">
            {p.contribution.map((c, i) => (
              <Field key={i} as="li" value={c} />
            ))}
          </ul>
        </section>
      )}

      {p.tech.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg">Built with</h2>
          <TechChips ids={p.tech} className="mt-3" />
        </section>
      )}

      {p.images.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="font-display text-lg">Screens & photos</h2>
          {p.images.map((img) => (
            <MediaSlot key={img.id} image={img} />
          ))}
        </section>
      )}

      <section className="mt-8 space-y-3">
        <LinkRow links={p.links} />
        {exp && (
          <p>
            <Link href="/experience" className="pixel-focus underline underline-offset-2">
              Part of my work at {exp.org} {'→'}
            </Link>
          </p>
        )}
      </section>
    </article>
  )
}
