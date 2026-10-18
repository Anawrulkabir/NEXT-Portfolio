import type { Metadata } from 'next'
import { SitePage } from '@/components/site/SitePage'
import body from '@/components/site/pages/work.html'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Eleven projects on six shelves: research, robotics, research software, GPU infrastructure, products and contests.',
}

export default function Page() {
  return <SitePage body={body} section="work" />
}
