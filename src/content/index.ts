/**
 * Content index — re-exports + derived lookups.
 * See docs/PORTFOLIO_REDESIGN.md §06.3.
 */
export { pending, isPending } from './pending'
export type { Maybe, Pending } from './pending'
export * from './types'

export { profile } from './profile'
export { journeyChapters, journeyNotes } from './journey'
export { experience, experienceHighlights, hireSnapshot, bulletAnchor } from './experience'
export { research } from './research'
export { projects } from './projects'
export { certifications } from './certifications'
export { events } from './events'
export { skillGroups, skills } from './skills'

import { isPending } from './pending'
import { journeyChapters, journeyNotes } from './journey'
import { experience } from './experience'
import { research } from './research'
import { projects } from './projects'
import { certifications } from './certifications'
import { events } from './events'
import { skillGroups, skills } from './skills'
import type {
  Certification,
  EventItem,
  Experience,
  JourneyChapter,
  Link,
  Project,
  Research,
  Skill,
} from './types'

const byId = <T extends { id: string }>(items: T[]): Record<string, T> =>
  Object.fromEntries(items.map((item) => [item.id, item]))

export const experienceById: Record<string, Experience> = byId(experience)
export const researchById: Record<string, Research> = byId(research)
export const projectById: Record<string, Project> = byId(projects)
export const certificationById: Record<string, Certification> = byId(certifications)
export const eventById: Record<string, EventItem> = byId(events)
export const journeyChapterById: Record<string, JourneyChapter> = byId(journeyChapters)
export const noteById: Record<string, (typeof journeyNotes)[number]> = byId(journeyNotes)
export const skillById: Record<string, Skill> = byId(skills)

/** Skills that belong to a given group, in declared order. */
export const skillsByGroup = (groupId: Skill['group']): Skill[] =>
  skills.filter((s) => s.group === groupId)

/** A skill's evidence items resolved to their real content objects. */
export const resolveEvidence = (skill: Skill) =>
  skill.evidence
    .map((e) => {
      switch (e.type) {
        case 'experience':
          return experienceById[e.id]
        case 'project':
          return projectById[e.id]
        case 'research':
          return researchById[e.id]
        case 'event':
          return eventById[e.id]
        default:
          return undefined
      }
    })
    .filter(Boolean)

/** A certificate is only ready to render once it has a name and an image. */
export const isCertificationFilled = (cert: Certification): boolean =>
  !isPending(cert.name) && !isPending(cert.image.src)

/** Filled certificates only — what the Archive room/page should render. */
export const filledCertifications: Certification[] = certifications.filter(isCertificationFilled)

/** Projects grouped by shelf, in declared order — see §03.6. */
export const projectsByShelf = (shelf: Project['shelf']): Project[] =>
  projects.filter((p) => p.shelf === shelf)

/**
 * Links marked `verify` (e.g. Codeforces/CodeChef handles from the old CV)
 * are shown while developing but hidden in production until confirmed (§14).
 */
export const visibleLinks = (links: Link[]): Link[] =>
  process.env.NODE_ENV === 'production' ? links.filter((l) => !l.verify) : links

/**
 * A project's display title: its own name once supplied, otherwise the
 * (verified) event it was built for — e.g. "Break The Monolith Hackathon".
 */
export const projectTitle = (project: Project): string | null => {
  if (!isPending(project.name)) return project.name
  const event = events.find((e) => e.relatedProjectId === project.id)
  return event && !isPending(event.name) ? event.name : null
}

/** A skill is shown in production only once confirmed (no `verify` flag). */
export const isSkillVisible = (skill: Skill): boolean =>
  process.env.NODE_ENV !== 'production' || !skill.verify

/** Short label for where a skill was used: "AI Studio", "Poridhi.io", "R455A study"… */
export const evidenceLabel = (e: Skill['evidence'][number]): string | null => {
  switch (e.type) {
    case 'experience':
      return experienceById[e.id]?.org ?? null
    case 'project': {
      const project = projectById[e.id]
      return project ? projectTitle(project) : null
    }
    case 'research':
      return researchById[e.id]?.shortTitle ?? null
    case 'event': {
      const name = eventById[e.id]?.name
      return name && !isPending(name) ? name : null
    }
  }
}

/** Journey chapters in path order (zones only, excludes overlook/rooms). */
export const zoneChapters: JourneyChapter[] = journeyChapters
  .filter((c) => c.id !== 'overlook' && c.id !== 'archive' && c.id !== 'contact')
  .sort((a, b) => a.order - b.order)
