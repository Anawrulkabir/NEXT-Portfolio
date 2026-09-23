import { isPending, type Maybe } from '@/content'

/**
 * Renders a Maybe<T> value — see docs/PORTFOLIO_REDESIGN.md §06.1.
 * A pending value renders nothing in production, and a dashed amber
 * "content needed" chip in development so gaps are visible while building.
 */
export function Field({
  value,
  as: As = 'span',
  className,
}: {
  value: Maybe<string>
  as?: React.ElementType
  className?: string
}) {
  if (isPending(value)) {
    if (process.env.NODE_ENV === 'production') return null
    return (
      <As
        className={`inline-block border border-dashed border-amber text-amber text-xs px-2 py-0.5 align-middle ${className ?? ''}`}
        title={value.label}
      >
        {value.label}
      </As>
    )
  }
  return <As className={className}>{value}</As>
}
