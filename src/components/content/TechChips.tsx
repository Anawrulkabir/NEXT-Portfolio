import { isSkillVisible, skillById } from '@/content'

/** Skill chips by id; unconfirmed (`verify`) skills are hidden in production. */
export function TechChips({ ids, className }: { ids: string[]; className?: string }) {
  const shown = ids.filter((id) => !skillById[id] || isSkillVisible(skillById[id]))
  if (!shown.length) return null
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className ?? ''}`} aria-label="Technologies">
      {shown.map((id) => (
        <li key={id} className="text-xs border border-loam px-1.5 py-0.5">
          {skillById[id]?.name ?? id}
        </li>
      ))}
    </ul>
  )
}
