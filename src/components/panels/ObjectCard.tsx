import Link from 'next/link'
import { eventById, experienceById, noteById, projectById, researchById, stripPending, type WorldObjectRef } from '@/content'
import { RoleBlock } from '@/components/experience/RoleBlock'
import { ToolDrawer } from '@/components/skills/ToolDrawer'
import { AirfoilDemo } from '@/components/research/AirfoilDemo'
import { ResearchCard } from '@/components/research/ResearchCard'
import { ResearchPipeline } from '@/components/research/ResearchPipeline'
import { isLiveRoute } from '@/lib/routes'
import { ChapterCard } from './ChapterCard'
import { EventCard } from './EventCard'
import { ProjectCard } from './ProjectCard'

/**
 * Resolves what a world object opens to the one shared card component for
 * that content type (§07.3: "one component per content type, reused in both
 * the world and the routes"). Types without a card yet render just their
 * label; each later phase fills in its type as its zones land.
 */
export function ObjectCard({ object: objectRef }: { object: WorldObjectRef }) {
  const opens = objectRef.opens
  switch (opens.type) {
    case 'project': {
      const project = projectById[opens.id]
      return project ? <ProjectCard project={project} /> : null
    }
    case 'note': {
      const note = noteById[opens.id]
      return note ? <ChapterCard note={note} /> : null
    }
    case 'event': {
      const event = eventById[opens.id]
      return event ? <EventCard event={event} fallbackTitle={objectRef.tooltip} /> : null
    }
    case 'experience': {
      const exp = experienceById[opens.id]
      if (!exp) return null
      const roles = opens.highlight ? exp.roles.filter((r) => opens.highlight!.includes(r.id)) : exp.roles
      return (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide opacity-80">
            {exp.org} {'·'} {exp.location}
          </p>
          {roles.map((role) => (
            <RoleBlock key={role.id} role={role} anchors={false} />
          ))}
          {isLiveRoute('/experience') && (
            <p className="text-sm">
              <Link href={`/experience#${roles[0]?.id ?? ''}`} className="pixel-focus underline underline-offset-2">
                Full experience {'→'}
              </Link>
            </p>
          )}
        </div>
      )
    }
    case 'research': {
      const r = researchById[opens.id]
      if (!r) return null
      if (opens.view === 'pipeline' && r.pipeline?.length) return <ResearchPipeline research={stripPending(r)} />
      if (opens.view === 'demo')
        return (
          <div className="space-y-5">
            <ResearchCard research={r} />
            <AirfoilDemo />
          </div>
        )
      return <ResearchCard research={r} />
    }
    case 'skills':
      return (
        <div className="space-y-3">
          <h3 className="font-display text-lg">{objectRef.tooltip}</h3>
          <ToolDrawer groups={opens.groups} headingLevel={4} />
          {isLiveRoute('/skills') && (
            <p className="text-sm">
              <Link href={`/skills#${opens.groups[0]}`} className="pixel-focus underline underline-offset-2">
                All skills {'→'}
              </Link>
            </p>
          )}
        </div>
      )
    default:
      return <p>{objectRef.tooltip}</p>
  }
}
