import type { Metadata } from 'next'
import { buildDeskData, type DeskData } from '@/components/desk/data'

export const metadata: Metadata = {
  description: 'Deploy Fahad’s portfolio: type kubectl apply and watch an island of his research, robots and software assemble.',
}

/**
 * The home page is a deployment you start by typing. The island itself is mounted by
 * IslandHost in the root layout, so it survives route changes. Search engines and screen
 * readers get this plain text version of the same content, rendered on the server.
 */
function TextVersion({ d }: { d: DeskData }) {
  return (
    <article id="text-version" className="sr-only">
      <h1>{d.profile.name}</h1>
      <p>{d.profile.positioning}</p>
      <p>{d.profile.sentence}</p>
      <p>
        <a href={d.profile.cv.download}>Software engineering CV (PDF)</a>
        {d.profile.cv.academic && (
          <>
            {' · '}
            <a href={d.profile.cv.academic}>Academic CV (PDF)</a>
          </>
        )}
        {' · '}
        <a href={`mailto:${d.profile.email}`}>{d.profile.email}</a>
      </p>
      <h2>About</h2>
      {d.profile.about.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <h2>Experience</h2>
      {d.experience.map((x) =>
        x.roles.map((r) => (
          <section key={r.id}>
            <h3>
              {r.title}, {x.org} ({r.dates})
            </h3>
            <ul>
              {r.groups.flatMap((g) => g.bullets).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))
      )}
      <h2>Research</h2>
      <ul>
        {d.research.map((r) => (
          <li key={r.id}>
            {r.shortTitle} ({r.status}): {r.oneLine}
          </li>
        ))}
      </ul>
      <h2>Projects</h2>
      <ul>
        {d.projects.map((p) => (
          <li key={p.id}>
            {p.title}
            {p.result ? ` (${p.result})` : ''}: {p.oneLine}
          </li>
        ))}
      </ul>
      <h2>Education</h2>
      <p>
        {d.profile.education.degree}, {d.profile.education.institution} ({d.profile.education.dates})
      </p>
      <h2>Contact</h2>
      <ul>
        <li>
          <a href={`mailto:${d.profile.email}`}>{d.profile.email}</a>
        </li>
        {d.profile.links.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function Home() {
  const data = buildDeskData()
  return (
    <>
      <TextVersion d={data} />
    </>
  )
}
