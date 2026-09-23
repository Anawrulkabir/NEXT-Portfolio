import Link from 'next/link'
import { isPending, type Research } from '@/content'
import { isLiveRoute } from '@/lib/routes'
import { StatusBadge } from './StatusBadge'

// `title` may be stripped (undefined) when props were passed through stripPending.
export const researchTitle = (r: Research) => (!r.title || isPending(r.title) ? r.shortTitle : r.title)

/**
 * Research card — the status badge comes first (§11.4), then title, one line,
 * supervisor, and the way to the full page.
 */
export function ResearchCard({
  research: r,
  headingLevel = 3,
  showLink = true,
}: {
  research: Research
  headingLevel?: 2 | 3 | 4
  showLink?: boolean
}) {
  const H = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  const href = `/research/${r.id}`
  return (
    <div className="space-y-3">
      <StatusBadge status={r.status} />
      <H className="font-display text-lg leading-snug">{researchTitle(r)}</H>
      <p className="leading-relaxed">{r.oneLine}</p>
      {r.supervisor && !isPending(r.supervisor) && (
        <p className="text-sm">
          <span className="font-semibold">Supervisor:</span> {r.supervisor}
        </p>
      )}
      {showLink && isLiveRoute(href) && (
        <p className="text-sm">
          <Link href={href} className="pixel-focus underline underline-offset-2">
            Read more {'→'}
          </Link>
        </p>
      )}
    </div>
  )
}
