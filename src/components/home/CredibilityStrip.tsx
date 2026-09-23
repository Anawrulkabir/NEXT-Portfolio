import Link from 'next/link'
import { experience, profile, researchById, researchStatusLabel } from '@/content'
import { shortInstitution } from '@/lib/format'

/**
 * Three verified facts (§04.2), built from content — no hard-coded claims.
 * Each item links to its full page.
 */
export function CredibilityStrip() {
  const role = experience[0].roles[0]
  const product = role.groups[0]?.product
  const r455a = researchById['r455a-evaporation-ml']
  const edu = profile.education[0]

  const items: { text: string; href?: string }[] = [
    {
      text: `${role.title} at ${experience[0].org}${product ? ` — GPU platform for ${product}` : ''}`,
      href: '/experience',
    },
    {
      text: `${researchStatusLabel[r455a.status]} — ${r455a.oneLine.replace(/\.$/, '')}`,
      href: `/research/${r455a.id}`,
    },
    {
      text: `${edu.degree}, ${shortInstitution(edu.institution)} (${edu.dates.endLabel ?? edu.dates.end})`,
      href: '/about',
    },
  ]

  return (
    <section aria-label="Highlights" className="max-w-[1120px] mx-auto px-4 md:px-6 mt-12">
      <ul className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <li key={item.text} className="pixel-panel pixel-frame p-4 text-sm leading-relaxed">
            {item.href ? (
              <Link href={item.href} className="pixel-focus underline underline-offset-2">
                {item.text}
              </Link>
            ) : (
              item.text
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
