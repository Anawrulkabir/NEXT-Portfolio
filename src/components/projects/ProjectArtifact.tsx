import Image from 'next/image'
import Link from 'next/link'
import { isPending, projectTitle, type Project } from '@/content'
import { LinkRow } from '@/components/content/LinkRow'
import { TechChips } from '@/components/content/TechChips'
import { mediaMeta } from '@/lib/media'

export const projectStatusLabel: Record<string, string> = {
  production: 'In production',
  shipped: 'Shipped',
  prototype: 'Prototype',
  archived: 'Archived',
  'in-progress': 'In progress',
}

/**
 * A project on its shelf (§03.6): cover image if one exists, title, one
 * line, result, status, tech and the way to its page.
 */
export function ProjectArtifact({ project, headingLevel = 3 }: { project: Project; headingLevel?: 3 | 4 }) {
  const title = projectTitle(project)
  if (!title) return null
  const H = `h${headingLevel}` as 'h3' | 'h4'
  const cover = project.images.find((i) => !isPending(i.src))
  const meta = cover && !isPending(cover.src) ? mediaMeta(cover.src, cover.width, cover.height) : null
  const status = typeof project.status === 'string' ? projectStatusLabel[project.status] : null
  const result = project.result && !isPending(project.result) ? project.result.split(' — ')[0] : null

  return (
    <article className="pixel-panel pixel-frame h-full flex flex-col">
      {cover && meta && !isPending(cover.src) && (
        <Image
          src={cover.src}
          alt={cover.alt}
          width={meta.width}
          height={meta.height}
          placeholder={meta.blur ? 'blur' : 'empty'}
          blurDataURL={meta.blur}
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
          className="w-full h-40 object-cover object-top border-b-2 border-loam"
        />
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <H className="font-display text-base">
            <Link href={`/projects/${project.id}`} className="pixel-focus hover:underline underline-offset-2">
              {title}
            </Link>
          </H>
          {result && <span className="text-[11px] border-2 border-moss bg-moss text-parchment px-1.5">{result}</span>}
          {status && <span className="text-[11px] border border-loam px-1.5">{status}</span>}
        </div>
        <p className="text-sm leading-relaxed">{project.oneLine}</p>
        <TechChips ids={project.tech} />
        <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-2">
          <LinkRow links={project.links} />
          <Link href={`/projects/${project.id}`} className="pixel-focus text-sm underline underline-offset-2">
            Details {'→'}
            <span className="sr-only"> about {title}</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
