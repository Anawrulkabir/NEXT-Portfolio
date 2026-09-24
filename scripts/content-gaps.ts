#!/usr/bin/env tsx
/**
 * Walks all content and prints every pending() label — the live version of
 * docs/PORTFOLIO_REDESIGN.md §14. See §15.6: a CI step should fail the
 * production build if any BLOCKER item is still pending.
 *
 * Usage: npm run gaps
 */
import { isPending } from '../src/content/pending'
import {
  profile,
  journeyChapters,
  journeyNotes,
  experience,
  research,
  academicLine,
  projects,
  certifications,
  events,
  skills,
} from '../src/content'

type Gap = { collection: string; id: string; path: string; label: string; blocker: boolean }

function walk(collection: string, id: string, value: unknown, path: string, out: Gap[]) {
  if (value === null || value === undefined) return
  if (isPending(value)) {
    out.push({ collection, id, path, label: value.label, blocker: Boolean(value.blocker) })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(collection, id, v, `${path}[${i}]`, out))
    return
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      walk(collection, id, v, path ? `${path}.${k}` : k, out)
    }
  }
}

function scanCollection(name: string, items: Record<string, unknown> | unknown[]): Gap[] {
  const out: Gap[] = []
  if (Array.isArray(items)) {
    items.forEach((item) => {
      const id = (item as { id?: string })?.id ?? '(no id)'
      walk(name, id, item, '', out)
    })
  } else {
    walk(name, '(singleton)', items, '', out)
  }
  return out
}

const gaps: Gap[] = [
  ...scanCollection('profile', profile),
  ...scanCollection('journeyChapters', journeyChapters),
  ...scanCollection('journeyNotes', journeyNotes),
  ...scanCollection('experience', experience),
  ...scanCollection('research', research),
  ...scanCollection('academic', { line: academicLine }),
  ...scanCollection('projects', projects),
  ...scanCollection('certifications', certifications),
  ...scanCollection('events', events),
  ...scanCollection('skills', skills),
]

const blockers = gaps.filter((g) => g.blocker)
const nonBlockers = gaps.filter((g) => !g.blocker)

function printGroup(title: string, list: Gap[]) {
  console.log(`\n${title} (${list.length})`)
  console.log('-'.repeat(title.length + 5))
  for (const g of list) {
    console.log(`  [${g.collection}:${g.id}] ${g.path || '(root)'} — ${g.label}`)
  }
}

console.log(`Content gap report — ${gaps.length} pending item(s) total`)
if (blockers.length) printGroup('BLOCKERS (must resolve before launch)', blockers)
if (nonBlockers.length) printGroup('Non-blocking (render as nothing until supplied)', nonBlockers)
if (gaps.length === 0) console.log('\nNo pending content. \\o/')

// Non-zero exit only for --check-blockers, so this script stays a normal
// reporting tool in day-to-day use (see §15.6 for the intended CI usage).
if (process.argv.includes('--check-blockers') && blockers.length > 0) {
  console.error(`\n${blockers.length} blocker(s) still pending — failing.`)
  process.exit(1)
}
