import type { Metadata } from 'next'
import { events, filledCertifications, isPending, stripPending, type EventItem } from '@/content'
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs'
import { CertificateWall } from '@/components/archive/CertificateWall'
import { EventsMap } from '@/components/archive/EventsMap'
import { EventCard } from '@/components/panels/EventCard'

export const metadata: Metadata = {
  title: 'Archive',
  description:
    'Certificates, hackathons, competitions and events: Break The Monolith (Champion), API Avengers (Finalist, CUET Rising Team), AI Engineering Hackathon and more.',
}

const order: EventItem['type'][] = ['hackathon', 'competition', 'business-competition', 'conference', 'research-event']
const dev = process.env.NODE_ENV !== 'production'
const byDateDesc = (a: EventItem, b: EventItem) =>
  String(isPending(b.date) ? '' : b.date).localeCompare(String(isPending(a.date) ? '' : a.date))

/** Archive (§05.2 Room R1 page twin): certificate wall + events map + full event list. */
export default function ArchivePage() {
  // Unnamed events are gaps, not records: only named events render in production.
  const shown = events
    .filter((e) => dev || !isPending(e.name))
    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type) || byDateDesc(a, b))

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Archive' }]} />
      <h1 className="font-display text-3xl md:text-4xl">Archive</h1>
      <p className="mt-3 max-w-[680px] leading-relaxed">Certificates and the events behind them.</p>

      {filledCertifications.length > 0 && (
        <section id="certificates" aria-labelledby="certs-h" className="mt-12 scroll-mt-20">
          <h2 id="certs-h" className="font-display text-2xl">
            Certificates
          </h2>
          <div className="mt-6">
            <CertificateWall certificates={stripPending(filledCertifications)} />
          </div>
        </section>
      )}

      <section id="events" aria-labelledby="events-h" className="mt-16 scroll-mt-20">
        <h2 id="events-h" className="font-display text-2xl">
          Events
        </h2>
        <div className="mt-6 pixel-panel pixel-frame p-5">
          <EventsMap events={stripPending(events)} />
        </div>

        <h3 className="mt-12 font-display text-xl">All events</h3>
        <ul className="mt-5 grid md:grid-cols-2 gap-4">
          {shown.map((e) => (
            <li key={e.id} className="pixel-panel pixel-frame p-5">
              <EventCard event={e} headingLevel={4} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
