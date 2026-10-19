import type { Metadata } from 'next'
import { SitePage } from '@/components/site/SitePage'
import body from '@/components/site/pages/ai-studio.html'

export const metadata: Metadata = {
  title: 'AI Studio',
  description: 'How AI Studio’s GPU workspaces moved from a machine per demand on AWS to a shared GPU server with six isolated 8 GB slices, and what I built.',
}

export default function Page() {
  return <SitePage body={body} section="work" back={{ href: '/work', label: 'All work' }} />
}
