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
