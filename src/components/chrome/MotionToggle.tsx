'use client'
import { useEffect, useState } from 'react'
import { onMotionChange, osReducesMotion, setSiteReducedMotion, siteReduced } from '@/lib/motion'

/**
 * Reduce-motion switch (§09 I-17). When the OS already asks for reduced
 * motion the switch shows as on and can't be turned off here.
 */
export function MotionToggle({ className = '' }: { className?: string }) {
  const [state, setState] = useState<{ on: boolean; os: boolean } | null>(null)

  useEffect(() => {
    const read = () => setState({ on: osReducesMotion() || siteReduced(), os: osReducesMotion() })
    read()
    return onMotionChange(read)
  }, [])

  if (!state) return null
  return (
    <button
      type="button"
      role="switch"
      aria-checked={state.on}
      disabled={state.os}
      onClick={() => setSiteReducedMotion(!state.on)}
      className={`pixel-focus inline-flex items-center gap-2 min-h-[44px] text-sm disabled:opacity-80 ${className}`}
      title={state.os ? 'Your system setting already reduces motion' : undefined}
    >
      <span
        className={`relative inline-block h-5 w-9 border-2 ${state.on ? 'bg-moss border-moss' : 'border-current'}`}
        aria-hidden="true"
      >
        <span className={`absolute top-0.5 h-3 w-3 ${state.on ? 'right-0.5 bg-parchment' : 'left-0.5 bg-current'}`} />
      </span>
      Reduce motion{state.os ? ' (system)' : ''}
    </button>
  )
}
