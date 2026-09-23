/**
 * Motion preference (§08.6, §09 I-17): reduced when the OS asks for it OR the
 * visitor flips the site toggle. The toggle is stored in localStorage and
 * mirrored onto <html data-motion="reduce"> (set before paint by the inline
 * script in layout.tsx), so CSS and JS read the same answer.
 */
export const MOTION_KEY = 'motion'
const EVENT = 'motion:change'

const osReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const siteReduced = () => document.documentElement.dataset.motion === 'reduce'
export const osReducesMotion = osReduced

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return osReduced() || siteReduced()
}

export function setSiteReducedMotion(reduce: boolean) {
  if (reduce) document.documentElement.dataset.motion = 'reduce'
  else delete document.documentElement.dataset.motion
  try {
    if (reduce) localStorage.setItem(MOTION_KEY, 'reduce')
    else localStorage.removeItem(MOTION_KEY)
  } catch {
    // storage blocked — the setting still applies for this page view
  }
  window.dispatchEvent(new Event(EVENT))
}

/** Calls back whenever either source changes. Returns an unsubscribe. */
export function onMotionChange(cb: () => void): () => void {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    mq.removeEventListener('change', cb)
    window.removeEventListener(EVENT, cb)
  }
}

/** Inline, pre-paint: restore the saved toggle so there is no flash of motion. */
export const motionBootScript = `try{if(localStorage.getItem('${MOTION_KEY}')==='reduce')document.documentElement.dataset.motion='reduce'}catch(e){}`

/** prefers-contrast: more — also disables parallax (§15.9). */
export const prefersMoreContrast = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-contrast: more)').matches
