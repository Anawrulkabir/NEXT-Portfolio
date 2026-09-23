import { researchStatusLabel, type ResearchStatus } from '@/content'

const tone: Record<ResearchStatus, string> = {
  published: 'bg-moss text-parchment border-moss',
  accepted: 'bg-moss text-parchment border-moss',
  'under-review': 'bg-[#7a3d22] text-parchment border-[#7a3d22]',
  'in-preparation': 'bg-transparent border-ember',
  'in-progress': 'bg-transparent border-ember',
  'ongoing-thesis': 'bg-transparent border-signal',
  'completed-thesis': 'bg-moss text-parchment border-moss',
}

/**
 * Research status — always the exact label from content (§17: R455A only ever
 * reads "Manuscript under review", R1336mzz(E) only "Research in progress").
 */
export function StatusBadge({ status }: { status: ResearchStatus }) {
  return (
    <span className={`inline-block border-2 px-2 py-0.5 text-xs font-semibold ${tone[status]}`}>
      {researchStatusLabel[status]}
    </span>
  )
}
