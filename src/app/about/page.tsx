import type { Metadata } from 'next'
import { SitePage } from '@/components/site/SitePage'
import body from '@/components/site/pages/about.html'

export const metadata: Metadata = {
  title: 'About',
  description: 'Mechanical engineering student at CUET who built GPU platforms at Poridhi.io: experience, education, awards, skills and contact.',
}

export default function Page() {
  return <SitePage body={body} section="about" />
}
