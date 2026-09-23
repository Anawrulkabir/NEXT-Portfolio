import { evidenceLabel, isSkillVisible, skillGroups, skillsByGroup, type SkillGroupId } from '@/content'

/**
 * Tool drawer (§09 I-13): the skills of one or more workshops, each tied to
 * where it was used — no levels, no percentages. The drawer slides open in
 * three pixel steps (CSS, off under reduced motion).
 */
export function ToolDrawer({ groups, headingLevel = 3 }: { groups: SkillGroupId[]; headingLevel?: 3 | 4 }) {
  const H = `h${headingLevel}` as 'h3' | 'h4'
  return (
    <div className="space-y-5">
      {groups.map((id) => {
        const group = skillGroups.find((g) => g.id === id)
        if (!group) return null
        const skills = skillsByGroup(id).filter(isSkillVisible)
        return (
          <section key={id} className="tool-drawer border-2 border-loam">
            <div className="bg-loam text-parchment px-3 py-1.5 flex items-baseline justify-between gap-3">
              <H className="font-display text-sm">{group.name}</H>
              <span className="text-[11px]">{group.workshop}</span>
            </div>
            <ul className="tool-drawer-items p-3 space-y-1.5 text-sm">
              {skills.map((skill) => {
                const used = skill.evidence.map(evidenceLabel).filter((l): l is string => !!l)
                const unique = Array.from(new Set(used))
                return (
                  <li key={skill.id} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-semibold">{skill.name}</span>
                    {unique.length > 0 && <span className="text-xs opacity-80">used in {unique.join(', ')}</span>}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
