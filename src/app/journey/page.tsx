import type { Metadata } from 'next'
import Link from 'next/link'
import {
  isPending,
  journeyChapterById,
  profile,
  zoneChapters,
  type JourneyChapter,
  type WorldObjectRef,
} from '@/content'
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs'
import { Field } from '@/components/content/Field'
import { ObjectCard } from '@/components/panels/ObjectCard'
import { placedObjects } from '@/world/layout'
import { isLiveRoute } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Journey',
  description:
    'The journey map as text: from building robots in the Workshop to GPU infrastructure and thermal-systems research.',
}

const onMap = new Set(placedObjects.map((o) => o.ref.objectId))
const carded = new Set(['project', 'note', 'event', 'experience', 'skills'])

function JourneyObject({ object }: { object: WorldObjectRef }) {
  const { opens } = object
  if (opens.type === 'route') {
    return (
      <li className="text-sm">
        {isLiveRoute(opens.href) ? (
          <Link href={opens.href} className="pixel-focus underline underline-offset-2">
            {object.tooltip} {'→'}
          </Link>
        ) : (
          object.tooltip
        )}
      </li>
    )
  }
  if (!carded.has(opens.type)) {
    // Research cards land with the labs (Phase 5).
    return <li className="text-sm">{object.tooltip}</li>
  }
  return (
    <li className="pixel-panel pixel-frame p-5">
      {(opens.type === 'project' || opens.type === 'event') && (
        <p className="text-xs uppercase tracking-wide opacity-80 mb-2">{object.tooltip}</p>
      )}
      <ObjectCard object={object} />
      {onMap.has(object.objectId) && (
        <p className="mt-4 text-sm">
          <Link
            href={`/?open=${object.objectId}#world`}
            className="pixel-focus underline underline-offset-2"
          >
            Find it on the map
          </Link>
        </p>
      )}
    </li>
  )
}

function Chapter({ chapter }: { chapter: JourneyChapter }) {
  const word = chapter.progressWord && !isPending(chapter.progressWord) ? chapter.progressWord : null
  const period = chapter.period && !isPending(chapter.period) ? chapter.period : null
  return (
    <section id={chapter.id} aria-labelledby={`${chapter.id}-h`} className="scroll-mt-20">
      <p className="font-display text-xs tracking-widest text-signal">
        {chapter.order}
        {word && <> {'·'} {word}</>}
      </p>
      <h2 id={`${chapter.id}-h`} className="font-display text-2xl mt-1">
        {chapter.name}
      </h2>
      {period && <p className="text-sm text-parchment/70 mt-1">{period}</p>}
      <p className="mt-3 max-w-[680px] leading-relaxed">{chapter.summary}</p>
      {chapter.objects.length > 0 && (
        <ul className="mt-6 space-y-4 max-w-[760px]">
          {chapter.objects.map((o) => (
            <JourneyObject key={o.objectId} object={o} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default function JourneyPage() {
  const overlook = journeyChapterById.overlook
  const { destination } = profile

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Journey' }]} />
      <h1 className="font-display text-3xl md:text-4xl">The journey</h1>
      <p className="mt-3 max-w-[680px] leading-relaxed">
        The same story as the map on the home page, as text: each chapter in order, with everything you can
        open along the way.
      </p>

      <nav aria-label="Chapters" className="mt-8">
        <ol className="flex flex-wrap gap-2 text-sm">
          {[...zoneChapters, overlook].map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="pixel-focus inline-block border-2 border-loam px-2 py-1 hover:text-amber">
                {c.name}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-16">
        {zoneChapters.map((c) => (
          <Chapter key={c.id} chapter={c} />
        ))}

        <section id="overlook" aria-labelledby="overlook-h" className="scroll-mt-20">
          <p className="font-display text-xs tracking-widest text-signal">{overlook.name}</p>
          <h2 id="overlook-h" className="font-display text-2xl mt-1">
            {destination.heading}
          </h2>
          <Field as="p" value={destination.line} className="mt-3 text-xl" />
          <p className="mt-3 max-w-[680px] leading-relaxed">{destination.sentence}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={profile.cv.viewHref} className="pixel-focus pixel-btn-primary pixel-frame px-3 py-1.5 text-sm">
              View CV
            </Link>
            <Link href="/contact" className="pixel-focus pixel-btn-secondary pixel-frame px-3 py-1.5 text-sm">
              Get in touch
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
