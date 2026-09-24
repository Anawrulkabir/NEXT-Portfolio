/**
 * Placeholder system — see docs/PORTFOLIO_REDESIGN.md §06.1
 *
 * A field the author hasn't supplied yet is `pending(label)`, never a
 * fabricated value. `<Field>` renders nothing for a pending value in
 * production, and a dashed amber "content needed" chip in development.
 * `scripts/content-gaps.ts` walks all content and lists every pending
 * label — that script's output is the live version of §14.
 */

export type Pending = { __pending: true; label: string; blocker?: boolean }

export const pending = (label: string, blocker = false): Pending => ({
  __pending: true,
  label,
  blocker,
})

export const isPending = (v: unknown): v is Pending =>
  typeof v === 'object' &&
  v !== null &&
  (v as Pending).__pending === true

export type Maybe<T> = T | Pending

/**
 * Deep copy with every pending value removed — for props handed to client
 * components, so placeholder labels never reach production HTML or the RSC
 * payload. In development values pass through so the gap chips still show.
 */
export function stripPending<T>(value: T): T {
  if (process.env.NODE_ENV !== 'production') return value
  const walk = (v: unknown): unknown => {
    if (isPending(v)) return undefined
    if (Array.isArray(v)) return v.filter((x) => !isPending(x)).map(walk)
    if (v && typeof v === 'object')
      return Object.fromEntries(
        Object.entries(v as Record<string, unknown>)
          .filter(([, x]) => !isPending(x))
          .map(([k, x]) => [k, walk(x)])
      )
    return v
  }
  return walk(value) as T
}
