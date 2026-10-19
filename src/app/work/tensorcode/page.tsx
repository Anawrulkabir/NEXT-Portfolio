import type { Metadata } from 'next'
import { SitePage } from '@/components/site/SitePage'
import body from '@/components/site/pages/tensorcode.html'

export const metadata: Metadata = {
  title: 'TensorCode',
  description: 'A browser platform for learning GPU programming: labs, graded problems, a GPU IDE and the TensorRAG pipeline board. I built most of its frontend.',
}

export default function Page() {
  return <SitePage body={body} section="work" back={{ href: '/work', label: 'All work' }} />
}
