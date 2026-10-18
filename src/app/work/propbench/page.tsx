import type { Metadata } from 'next'
import { SitePage } from '@/components/site/SitePage'
import body from '@/components/site/pages/propbench.html'

export const metadata: Metadata = {
  title: 'PropBench',
  description: 'An open-source desktop workbench that takes researchers from lab measurements to a validated thermophysical property model.',
}

export default function Page() {
  return <SitePage body={body} section="work" />
}
