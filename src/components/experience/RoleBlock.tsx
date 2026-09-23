import { bulletAnchor, type Experience } from '@/content'
import { TechChips } from '@/components/content/TechChips'
import { formatDate } from '@/lib/format'

type Role = Experience['roles'][number]

export function roleDates(role: Role) {
  const end = role.dates.end === 'present' ? 'Present' : role.dates.endLabel ?? formatDate(role.dates.end)
  return `${formatDate(role.dates.start)} – ${end}`
}

/**
 * One role: title, dates, bullets grouped by product (§03.7). Bullets keep
 * the CV's wording and carry stable anchors so /hire can link to them.
 */
export function RoleBlock({
  role,
  headingLevel = 3,
  anchors = true,
}: {
  role: Role
  headingLevel?: 3 | 4
  anchors?: boolean
}) {
  const H = `h${headingLevel}` as 'h3' | 'h4'
  const P = `h${headingLevel + 1}` as 'h4' | 'h5'
  return (
    <div id={anchors ? role.id : undefined} className="scroll-mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <H className="font-display text-lg">{role.title}</H>
        <p className="text-sm opacity-80">{roleDates(role)}</p>
      </div>
      <div className="mt-3 space-y-4">
        {role.groups.map((group, g) => (
          <div key={group.product ?? g}>
            {group.product && (
              <P className="font-semibold text-sm">
                {group.product}
                {group.productUrl && (
                  <>
                    {' '}
                    <a
                      href={group.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pixel-focus font-normal underline underline-offset-2"
                    >
                      {group.productUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </>
                )}
              </P>
            )}
            <ul className="mt-2 list-disc pl-5 space-y-1.5 text-sm leading-relaxed">
              {group.bullets.map((b, i) => (
                <li
                  key={i}
                  id={anchors ? bulletAnchor(role.id, group.product, i) : undefined}
                  className="scroll-mt-24 target:bg-amber/20"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <TechChips ids={role.tech} className="mt-4" />
    </div>
  )
}
