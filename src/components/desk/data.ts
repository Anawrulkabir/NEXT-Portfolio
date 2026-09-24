/**
 * Server-only: flattens the content layer into the plain data the desk needs
 * (titles resolved, skill ids turned into names, hidden links dropped), then
 * strips pending fields so placeholder labels never reach the client bundle.
 */
import {
  experience,
  filledCertifications,
  isPending,
  isSkillVisible,
  profile,
  projects,
  projectTitle,
  research,
  researchInterests,
  researchStatusLabel,
  skillById,
  skillGroups,
  skillsByGroup,
  stripPending,
  visibleLinks,
  type Link,
} from '@/content'
import { formatDate } from '@/lib/format'

const names = (ids: string[]) =>
  ids
    .map((id) => skillById[id])
    .filter((s) => s && isSkillVisible(s))
    .map((s) => s.name)

const str = (v: unknown) => (typeof v === 'string' && !isPending(v) ? v : undefined)
const strs = (v: unknown[]) => v.filter((x): x is string => typeof x === 'string')
const links = (l: Link[]) => visibleLinks(l).map(({ kind, label, href }) => ({ kind, label, href }))
const range = (start: string, end: string) =>
  `${formatDate(start)} – ${end === 'present' ? 'Present' : end === 'expected' ? 'Expected' : formatDate(end)}`

export function buildDeskData() {
  const edu = profile.education[0]
  const portrait = !isPending(profile.portrait) && str(profile.portrait.src) ? profile.portrait : null
  const data = {
    profile: {
      name: profile.name,
      shortName: profile.shortName,
      positioning: profile.positioning,
      sentence: profile.sentence,
      spine: [...profile.spine],
      location: profile.location,
      about: profile.about,
      portrait: portrait ? { src: portrait.src as string, alt: portrait.alt } : null,
      education: {
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        dates: `${formatDate(edu.dates.start)} – ${edu.dates.endLabel ?? edu.dates.end}`,
      },
      destination: profile.destination.sentence,
      cv: { view: profile.cv.downloadHref, download: profile.cv.downloadHref },
      email: profile.links.find((l) => l.kind === 'email')!.href.replace('mailto:', ''),
      links: links(profile.links).filter((l) => l.kind !== 'email'),
    },
    experience: experience.map((x) => ({
      id: x.id,
      org: x.org,
      location: x.location,
      roles: x.roles.map((r) => ({
        id: r.id,
        title: r.title,
        dates: range(r.dates.start, r.dates.end),
        start: formatDate(r.dates.start),
        end: r.dates.end === 'present' ? 'now' : formatDate(r.dates.end),
        groups: r.groups.map((g) => ({ product: g.product, productUrl: g.productUrl, bullets: g.bullets })),
        stack: names(r.tech),
      })),
    })),
    projects: projects
      .filter((p) => projectTitle(p))
      .map((p) => ({
        id: p.id,
        shelf: p.shelf,
        title: projectTitle(p)!,
        oneLine: p.oneLine,
        problem: str(p.problem),
        role: str(p.role),
        result: str(p.result),
        date: str(p.date),
        contribution: strs(p.contribution),
        stack: names(p.tech),
        links: links(p.links),
        images: p.images
          .filter((i) => str(i.src))
          .map((i) => ({ id: i.id, src: i.src as string, alt: i.alt, caption: i.caption ?? i.alt })),
      })),
    research: research.map((r) => ({
      id: r.id,
      status: researchStatusLabel[r.status],
      shortTitle: r.shortTitle,
      title: str(r.title),
      oneLine: r.oneLine,
      question: str(r.question),
      system: str(r.system),
      data: str(r.data),
      method: strs(r.method),
      supervisor: str(r.supervisor),
    })),
    researchInterests,
    certificates: filledCertifications.map((c) => ({
      id: c.id,
      name: str(c.name) ?? c.image.alt,
      issuer: str(c.issuer),
      date: str(c.date) ? formatDate(c.date as string) : undefined,
      src: c.image.src as string,
      alt: c.image.alt,
    })),
    skills: skillGroups.map((g) => ({ name: g.name, items: skillsByGroup(g.id).filter(isSkillVisible).map((s) => s.name) })),
  }
  return stripPending(data)
}

export type DeskData = ReturnType<typeof buildDeskData>
