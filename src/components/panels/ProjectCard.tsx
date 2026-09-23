import { events, isPending, skillById, type Project } from '@/content'
import { Field } from '@/components/content/Field'
import { LinkRow } from '@/components/content/LinkRow'
import { MediaSlot } from '@/components/content/MediaSlot'
import { formatDate } from '@/lib/format'

/** Compact project card — world artifacts, and later the /projects shelves. */
export function ProjectCard({ project }: { project: Project }) {
  const event = events.find((e) => e.relatedProjectId === project.id)
  const result = project.result !== undefined && !isPending(project.result) ? project.result : null

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Field as="h3" value={project.name} className="font-display text-lg" />
        {project.verify && process.env.NODE_ENV !== 'production' && (
          <span className="text-[10px] border border-dashed border-amber text-amber px-1.5">VERIFY</span>
        )}
      </div>
      {result && (
        <p className="inline-block text-xs border-2 border-moss bg-moss text-parchment px-2 py-0.5">{result}</p>
      )}
      <p className="leading-relaxed">{project.oneLine}</p>

      <dl className="text-sm space-y-1">
        {!isPending(project.role) && (
          <div>
            <dt className="inline font-semibold">Role: </dt>
            <dd className="inline">{project.role}</dd>
          </div>
        )}
        {isPending(project.role) && <Field as="div" value={project.role} />}
        {event && (
          <div>
            <dt className="inline font-semibold">Built for: </dt>
            <dd className="inline">
              <Field value={event.name} />
              {event.organizer && !isPending(event.organizer) && <>, {event.organizer}</>}
              {!isPending(event.date) && <> ({formatDate(event.date)})</>}
            </dd>
          </div>
        )}
        {project.date !== undefined && <Field as="div" value={project.date} />}
      </dl>

      {project.contribution.length > 0 && (
        <ul className="list-disc list-inside text-sm space-y-1">
          {project.contribution.map((c, i) => (
            <Field key={i} as="li" value={c} />
          ))}
        </ul>
      )}

      {project.tech.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tech.map((id) => (
            <li key={id} className="text-xs border border-loam px-1.5 py-0.5">
              {skillById[id]?.name ?? id}
            </li>
          ))}
        </ul>
      )}

      {project.images.map((img) => (
        <MediaSlot key={img.id} image={img} />
      ))}
      <LinkRow links={project.links} />
    </div>
  )
}
