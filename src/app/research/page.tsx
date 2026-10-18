import type { Metadata } from 'next'
import { SitePage } from '@/components/site/SitePage'
import body from '@/components/site/pages/research.html'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Scientific machine learning that stays reliable outside its training conditions: publications, experience and how I work.',
}

export default function Page() {
  return <SitePage body={body} section="research" />
}
