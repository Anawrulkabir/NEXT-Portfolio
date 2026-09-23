import { HeroIdentity } from '@/components/home/HeroIdentity'
import { Spine } from '@/components/home/Spine'
import { CredibilityStrip } from '@/components/home/CredibilityStrip'
import { WorldSection } from '@/components/world/WorldSection'

export default function HomePage() {
  return (
    <>
      <HeroIdentity />
      <div className="max-w-[1120px] mx-auto px-4 md:px-6">
        <a
          href="#after-world"
          className="sr-only focus:not-sr-only focus:inline-block focus:mt-6 pixel-focus bg-parchment text-ink px-3 py-1.5 text-sm"
        >
          Skip the interactive map
        </a>
      </div>
      <WorldSection />
      <div id="after-world" tabIndex={-1} className="outline-none">
        <Spine />
        <CredibilityStrip />
      </div>
    </>
  )
}
