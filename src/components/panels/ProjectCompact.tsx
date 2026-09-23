import { isPending, projectTitle, visibleLinks, type Project } from '@/content'
import { LinkRow } from '@/components/content/LinkRow'
import { TechChips } from '@/components/content/TechChips'

const statusLabel: Record<string, string> = {
  production: 'In production',
  shipped: 'Shipped',
  prototype: 'Prototype',
  archived: 'Archived',
  'in-progress': 'In progress',
}

/** Compact project card for /hire (§10.6): name, one line, role, tech, status, links. */
export function ProjectCompact({ project, headingLevel = 3 }: { project: Project; headingLevel?: 3 | 4 }) {
  const title = projectTitle(project)
  if (!title) return null
  const H = `h${headingLevel}` as 'h3' | 'h4'
  const status = typeof project.status === 'string' ? statusLabel[project.status] : null
  // Short form ("Champion"): the title already names the event.
  const result = project.result && !isPending(project.result) ? project.result.split(' — ')[0] : null
  return (
    <article className="pixel-panel pixel-frame p-4 space-y-2 h-full">
      <div className="flex flex-wrap items-center gap-2">
        <H className="font-display text-base">{title}</H>
        {result && <span className="text-[11px] border-2 border-moss bg-moss text-parchment px-1.5">{result}</span>}
        {status && <span className="text-[11px] border border-loam px-1.5">{status}</span>}
      </div>
      <p className="text-sm leading-relaxed">{project.oneLine}</p>
      {!isPending(project.role) && <p className="text-xs">Role: {project.role}</p>}
      <TechChips ids={project.tech} />
      {visibleLinks(project.links).length > 0 && <LinkRow links={project.links} />}
    </article>
  )
}
