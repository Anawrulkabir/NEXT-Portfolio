import type { Metadata } from 'next'
import { skillGroups } from '@/content'
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs'
import { SkillWorkshop } from '@/components/skills/SkillWorkshop'

export const metadata: Metadata = {
  title: 'Skills',
  description:
    'Tools grouped into six workshops — programming, software, infrastructure, GPU/AI systems, ML research, mechanical engineering — each linked to where it was used.',
}

export default function SkillsPage() {
  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Skills' }]} />
      <h1 className="font-display text-3xl md:text-4xl">Skills</h1>
      <p className="mt-3 max-w-[680px] leading-relaxed">
        Six workshops. Every tool links to the work where it was used — no levels, no percentages.
      </p>
      <div className="mt-10 grid md:grid-cols-2 gap-5 items-start">
        {skillGroups.map((g) => (
          <SkillWorkshop key={g.id} group={g} />
        ))}
      </div>
    </div>
  )
}
