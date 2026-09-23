import type { Metadata } from 'next'
import Link from 'next/link'
import { experience } from '@/content'
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs'
import { ExperienceBlock } from '@/components/experience/ExperienceBlock'

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Poridhi.io: Junior Software Engineer on AI Studio (bare-metal Kubernetes, HAMi GPU virtualization, AWS) and TensorCode; previously Intern Software Engineer.',
}

export default function ExperiencePage() {
  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Experience' }]} />
      <h1 className="font-display text-3xl md:text-4xl">Experience</h1>
      <p className="mt-3 max-w-[680px] leading-relaxed">
        Software engineering on a multi-tenant GPU platform: infrastructure, orchestration and backend services.
      </p>
      <div className="mt-10 max-w-[860px] space-y-8">
        {experience.map((e) => (
          <ExperienceBlock key={e.id} experience={e} />
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/hire" className="pixel-focus underline underline-offset-2">
          Hiring? The one-minute brief {'→'}
        </Link>
      </p>
    </div>
  )
}
