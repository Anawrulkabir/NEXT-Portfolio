/**
 * Content types — see docs/PORTFOLIO_REDESIGN.md §06.2
 */
import type { Maybe } from './pending'

export type ISODateish = string // '2025-06' or '2025' or '2025-06-01'
export type DateRange = {
  start: ISODateish
  end: ISODateish | 'present' | 'expected'
  endLabel?: string
}

export type LinkKind =
  | 'email'
  | 'linkedin'
  | 'github'
  | 'scholar'
  | 'orcid'
  | 'codeforces'
  | 'codechef'
  | 'website'
  | 'repo'
  | 'demo'
  | 'paper'
  | 'doi'
  | 'credential'
  | 'product'

export type Link = { kind: LinkKind; label: string; href: string; verify?: boolean }

export type ImageAsset = {
  id: string
  src: Maybe<string> // path under /public/media/... ; pending until supplied
  alt: string // required even for placeholders
  width?: number
  height?: number
  caption?: string
  kind: 'photo' | 'screenshot' | 'figure' | 'certificate' | 'portrait'
}

export type Education = {
  id: string
  institution: string
  degree: string
  location: string
  dates: DateRange
  status: 'in-progress' | 'completed'
  details?: Maybe<string>[]
}

export type Profile = {
  name: string // 'Md Anawrul Kabir Fahad'
  shortName: string // 'Fahad Kabir'
  positioning: string // 'Mechanical Engineering × AI × Software Infrastructure'
  sentence: string
  spine: [string, string, string, string]
  location: string // 'Chattogram, Bangladesh'
  about: string[] // 2 short paragraphs
  portrait: Maybe<ImageAsset>
  education: Education[]
  destination: { heading: string; line: Maybe<string>; sentence: string }
  cv: {
    viewHref: string
    downloadHref: string
    updated: ISODateish
    academic?: Maybe<string>
  }
  links: Link[]
}

export type ZoneId =
  | 'workshop'
  | 'dungeon'
  | 'garage'
  | 'software'
  | 'datacenter'
  | 'physics-lab'
  | 'thermal-lab'
  | 'overlook'
  | 'archive'
  | 'contact'

export type WorldObjectRef = {
  objectId: string
  tooltip: string
  opens:
    | { type: 'experience'; id: string; highlight?: string[] }
    | { type: 'research'; id: string; view?: 'pipeline' | 'card' | 'demo' }
    | { type: 'project'; id: string }
    | { type: 'event'; id: string }
    | { type: 'note'; id: string } // short-form notes in journey.ts
    | { type: 'skills'; groups: SkillGroupId[] }
    | { type: 'certificates' }
    | { type: 'events-map' }
    | { type: 'contact' }
    | { type: 'route'; href: string }
}

export type JourneyChapter = {
  id: ZoneId
  order: number
  name: string // 'The Workshop'
  progressWord?: Maybe<string> // 'ENGINEERING'
  period?: Maybe<string> // '2022'
  summary: string // one line, shown in route strip tooltip and /journey
  objects: WorldObjectRef[] // world placement references content ids
}

export type Note = {
  id: string
  title: string
  body: Maybe<string>[]
  tech?: string[] // skill ids, shown as chips
  images?: ImageAsset[]
  links?: Link[]
  more?: { href: string; label: string } // internal "open full page" link
  sources: string[]
}

export type Experience = {
  id: string
  org: string
  orgUrl?: string
  location: string
  roles: {
    id: string
    title: string
    dates: DateRange
    groups: { product?: string; productUrl?: string; bullets: string[] }[]
    tech: string[] // skill ids
  }[]
  images?: ImageAsset[]
}

export type ResearchStatus =
  | 'published'
  | 'accepted'
  | 'under-review'
  | 'in-preparation'
  | 'in-progress'
  | 'ongoing-thesis'
  | 'completed-thesis'

export const researchStatusLabel: Record<ResearchStatus, string> = {
  published: 'Published',
  accepted: 'Accepted',
  'under-review': 'Manuscript under review',
  'in-preparation': 'Manuscript in preparation',
  'in-progress': 'Research in progress',
  'ongoing-thesis': 'Ongoing thesis',
  'completed-thesis': 'Thesis',
}

export type Research = {
  id: string
  kind: 'thesis' | 'manuscript' | 'publication' | 'conference-paper' | 'project'
  title: Maybe<string>
  shortTitle: string
  status: ResearchStatus
  oneLine: string
  question: Maybe<string>
  system: Maybe<string> // engineering system
  data: Maybe<string>
  method: Maybe<string>[]
  investigating: Maybe<string>[]
  findings: Maybe<string>[] // only author-supplied
  pipeline?: { stage: string; text: Maybe<string>; detail?: Maybe<string> }[]
  supervisor?: Maybe<string>
  authors?: Maybe<string>
  venue?: Maybe<string> // journal/conference; hidden while under review unless author opts in
  showVenue?: boolean
  doi?: Maybe<string>
  links: Link[]
  figures: ImageAsset[]
  tags: string[] // skill ids
  updated: ISODateish
}

export type Project = {
  id: string
  shelf: 'systems' | 'hackathon' | 'hardware' | 'early-web' | 'personal'
  name: Maybe<string>
  oneLine: string
  problem: Maybe<string>
  role: Maybe<string>
  contribution: Maybe<string>[]
  tech: string[] // skill ids
  status: 'production' | 'shipped' | 'prototype' | 'archived' | 'in-progress' | Maybe<string>
  result?: Maybe<string> // e.g. 'Champion' — only if verified
  date?: Maybe<string>
  links: Link[]
  images: ImageAsset[] // 0-3 shown on card, all on detail page
  experienceId?: string // cross-link for Systems shelf
  verify?: boolean
}

export type Certification = {
  id: string
  name: Maybe<string>
  issuer: Maybe<string>
  date: Maybe<ISODateish>
  credentialUrl?: Maybe<string>
  image: ImageAsset // image.src pending until uploaded
  category?: 'cloud' | 'ml' | 'engineering' | 'programming' | 'other'
}

export type EventItem = {
  id: string
  type: 'conference' | 'hackathon' | 'competition' | 'research-event' | 'business-competition'
  name: Maybe<string>
  organizer?: Maybe<string>
  date: Maybe<ISODateish>
  place?: Maybe<string> // city / venue; used for map pin placement
  role: Maybe<string> // participant / presenter / team member
  result?: Maybe<string>
  summary?: Maybe<string>
  images: ImageAsset[]
  links: Link[]
  relatedProjectId?: string
}

export type SkillGroupId =
  | 'programming'
  | 'software'
  | 'infrastructure'
  | 'gpu-ai'
  | 'ml-research'
  | 'engineering'

export type Skill = {
  id: string
  name: string
  group: SkillGroupId
  evidence: { type: 'experience' | 'project' | 'research' | 'event'; id: string }[]
  verify?: boolean // true = author must confirm before render
}

export type SkillGroup = { id: SkillGroupId; name: string; workshop: string; blurb: string }
