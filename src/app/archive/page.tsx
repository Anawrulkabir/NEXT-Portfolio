import type { Metadata } from 'next'
import { events, filledCertifications, isPending, pending, type EventItem } from '@/content'
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs'
import { Field } from '@/components/content/Field'
import { EventCard } from '@/components/panels/EventCard'

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Hackathons, competitions and events Md Anawrul Kabir Fahad has taken part in.',
}

/**
 * Archive — Phase 3 version: the events list the Garage's "More events" wall
 * links to. The certificate wall, lightbox and events map arrive in Phase 7
 * (§05.2 Room R1, §09 I-11/I-12).
 */
const order: EventItem['type'][] = ['hackathon', 'competition', 'business-competition', 'conference', 'research-event']
const dev = process.env.NODE_ENV !== 'production'

export default function ArchivePage() {
  // Unnamed events are gaps, not records: only named events render in production.
  const shown = events
    .filter((e) => dev || !isPending(e.name))
    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Archive' }]} />
      <h1 className="font-display text-3xl md:text-4xl">Archive</h1>

      <section id="events" aria-labelledby="events-h" className="mt-10 scroll-mt-20">
        <h2 id="events-h" className="font-display text-2xl">
          Events
        </h2>
        <ul className="mt-6 grid md:grid-cols-2 gap-4">
          {shown.map((e) => (
            <li key={e.id} className="pixel-panel pixel-frame p-5">
              <EventCard event={e} />
            </li>
          ))}
        </ul>
      </section>

      {(filledCertifications.length > 0 || dev) && (
        <section id="certificates" aria-labelledby="certs-h" className="mt-16 scroll-mt-20">
          <h2 id="certs-h" className="font-display text-2xl">
            Certificates
          </h2>
          {filledCertifications.length === 0 ? (
            <Field as="p" value={pending('ADD certificate images + details (certifications.ts)')} className="mt-4" />
          ) : (
            <ul className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filledCertifications.map((c) => (
                <li key={c.id} className="pixel-panel pixel-frame p-4 text-sm">
                  <p className="font-semibold">{c.name as string}</p>
                  <Field as="p" value={c.issuer} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
