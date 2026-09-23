import { profile } from '@/content'

/** The narrative spine — four lines, verbatim, once (§02). */
export function Spine() {
  return (
    <section aria-labelledby="spine-heading" className="max-w-[1120px] mx-auto px-4 md:px-6 mt-16">
      <h2 id="spine-heading" className="sr-only">
        The path so far
      </h2>
      <ol className="space-y-2 font-display text-lg md:text-2xl">
        {profile.spine.map((line, i) => (
          <li key={i} style={{ paddingLeft: `${i * 1.5}rem` }} className="text-parchment">
            {line}
          </li>
        ))}
      </ol>
    </section>
  )
}
