'use client'

/** "Explore the world" — scrolls to the world and focuses it so arrow keys walk (§04.2). */
export function ExploreButton() {
  return (
    <button
      type="button"
      className="pixel-btn-primary pixel-frame pixel-shadow pixel-focus px-4 py-2 text-sm"
      onClick={() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        document.getElementById('world')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
        window.dispatchEvent(new Event('world:focus'))
      }}
    >
      Explore the world {'▸'}
    </button>
  )
}
