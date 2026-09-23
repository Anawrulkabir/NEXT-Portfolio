import { isPending, projectById, type EventItem } from '@/content'
import { Field } from '@/components/content/Field'
import { LinkRow } from '@/components/content/LinkRow'
import { MediaSlot } from '@/components/content/MediaSlot'
import { formatDate } from '@/lib/format'

const typeLabel: Record<EventItem['type'], string> = {
  conference: 'Conference',
  hackathon: 'Hackathon',
  competition: 'Competition',
  'research-event': 'Research event',
  'business-competition': 'Business competition',
}

/**
 * Event card — world objects of type "event", /journey and /archive. Only
 * supplied fields render; a pending field is a dev-only chip (§06.1).
 */
export function EventCard({
  event,
  fallbackTitle,
  headingLevel = 3,
  compact = false,
}: {
  event: EventItem
  fallbackTitle?: string
  headingLevel?: 3 | 4
  compact?: boolean
}) {
  const H = `h${headingLevel}` as 'h3' | 'h4'
  const hClass = compact ? 'font-display text-sm' : 'font-display text-lg'
  const filled = (v: EventItem['date'] | undefined): v is string => v !== undefined && !isPending(v)
  const related = event.relatedProjectId ? projectById[event.relatedProjectId] : undefined

  const title = isPending(event.name) ? fallbackTitle : event.name
  const showType = title?.toLowerCase() !== typeLabel[event.type].toLowerCase()

  return (
    <div className={compact ? 'space-y-1.5' : 'space-y-3'}>
      {showType && <p className="text-xs uppercase tracking-wide opacity-80">{typeLabel[event.type]}</p>}
      {isPending(event.name) ? (
        <>
          {fallbackTitle && <H className={hClass}>{fallbackTitle}</H>}
          <Field as="p" value={event.name} />
        </>
      ) : (
        <H className={hClass}>{event.name}</H>
      )}
      {filled(event.result) && (
        <p className="inline-block text-xs border-2 border-moss bg-moss text-parchment px-2 py-0.5">
          {event.result}
        </p>
      )}
      {event.summary !== undefined && <Field as="p" value={event.summary} className="leading-relaxed" />}

      <dl className="text-sm space-y-1">
        {[
          ['Organizer', event.organizer],
          ['Date', event.date],
          ['Role', event.role],
        ].map(([label, value]) =>
          value === undefined ? null : isPending(value) ? (
            <Field key={label as string} as="div" value={value} />
          ) : (
            <div key={label as string}>
              <dt className="inline font-semibold">{label as string}: </dt>
              <dd className="inline">{label === 'Date' ? formatDate(value as string) : (value as string)}</dd>
            </div>
          )
        )}
        {event.result !== undefined && isPending(event.result) && <Field as="div" value={event.result} />}
      </dl>

      {related && !isPending(related.name) && (
        <p className="text-sm">
          Built there: <span className="font-semibold">{related.name}</span>
        </p>
      )}
      {event.images.map((img) => (
        <MediaSlot
          key={img.id}
          image={img}
          className={compact ? 'max-w-[160px]' : 'max-w-[280px]'}
          sizes={compact ? '160px' : '280px'}
        />
      ))}
      <LinkRow links={event.links} />
    </div>
  )
}
