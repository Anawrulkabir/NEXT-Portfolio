import type { Metadata } from 'next'
import { Caveat, Fraunces } from 'next/font/google'
import { DeskLoader } from '@/components/desk/DeskLoader'
import { buildDeskData } from '@/components/desk/data'

// The Showcase site's display face (soft, chunky serif), only loaded on /desk.
const showcaseFont = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-showcase',
  display: 'swap',
})

// Handwriting for the sticky note on the desktop.
const handFont = Caveat({ subsets: ['latin'], weight: ['600'], variable: '--font-hand', display: 'swap' })

export const metadata: Metadata = {
  title: 'Desk (prototype)',
  description: 'A 3D model of Fahad’s real desk. Click the monitor to use it.',
  robots: { index: false, follow: false }, // mockup — not indexed yet
}

export default function DeskPage() {
  return (
    <div className={`${showcaseFont.variable} ${handFont.variable}`}>
      <h1 className="sr-only">Fahad&rsquo;s desk — interactive 3D portfolio (prototype)</h1>
      <DeskLoader data={buildDeskData()} />
    </div>
  )
}
