import type { Metadata } from 'next'
import Link from 'next/link'
import { projectsByShelf, projectTitle, type Project } from '@/content'
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs'
import { ProjectArtifact } from '@/components/projects/ProjectArtifact'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Professional systems (AI Studio, TensorCode), hackathon builds, and early web projects by Md Anawrul Kabir Fahad.',
}

const shelves: { id: Project['shelf']; title: string; blurb: string }[] = [
  { id: 'systems', title: 'Systems', blurb: 'Professional work at Poridhi.io.' },
  { id: 'hackathon', title: 'Hackathon builds', blurb: 'Built against the clock, 2025.' },
  { id: 'hardware', title: 'Hardware', blurb: 'Where it started.' },
  { id: 'early-web', title: 'Early web builds', blurb: 'Full-stack web projects from before the professional work.' },
  { id: 'personal', title: 'Personal', blurb: '' },
]

export default function ProjectsPage() {
  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects' }]} />
      <h1 className="font-display text-3xl md:text-4xl">Projects</h1>
      {shelves.map((shelf) => {
        const items = projectsByShelf(shelf.id).filter((p) => projectTitle(p))
        if (!items.length) return null
        return (
          <section key={shelf.id} id={shelf.id} aria-labelledby={`${shelf.id}-h`} className="mt-12 scroll-mt-20">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-loam pb-2">
              <h2 id={`${shelf.id}-h`} className="font-display text-xl">
                {shelf.title}
              </h2>
              {shelf.id === 'systems' ? (
                <Link href="/experience" className="pixel-focus text-sm underline underline-offset-2">
                  {shelf.blurb} See the role {'→'}
                </Link>
              ) : (
                shelf.blurb && <p className="text-sm text-parchment/80">{shelf.blurb}</p>
              )}
            </div>
            <ul className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((p) => (
                <li key={p.id}>
                  <ProjectArtifact project={p} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
