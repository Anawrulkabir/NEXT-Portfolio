const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** '2025-06' → 'Jun 2025'; '2025' and free-form strings pass through unchanged. */
export function formatDate(value: string): string {
  const m = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(value)
  if (!m) return value
  return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`
}

/** 'Chittagong University of Engineering & Technology (CUET)' → 'CUET'. */
export function shortInstitution(name: string): string {
  return /\(([^)]+)\)\s*$/.exec(name)?.[1] ?? name
}
