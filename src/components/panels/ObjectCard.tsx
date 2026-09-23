import { eventById, noteById, projectById, type WorldObjectRef } from '@/content'
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
    default:
      return <p>{objectRef.tooltip}</p>
  }
}
