import type { Metadata } from 'next'
import { SitePage } from '@/components/site/SitePage'
import body from '@/components/site/pages/snake.html'

export const metadata: Metadata = {
  title: 'Compliant snake robot',
  description: 'A 7-segment, cable-driven snake robot simulated in MuJoCo before it is built: 433 paired trials testing whether a partly compliant body crosses a post lattice better.',
}

export default function Page() {
  return <SitePage body={body} section="work" />
}
