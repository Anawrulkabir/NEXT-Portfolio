import type { Metadata } from 'next'
import { DeskLoader } from '@/components/desk/DeskLoader'

export const metadata: Metadata = {
  title: 'Desk (prototype)',
  description: 'A 3D model of Fahad’s real desk. Click the monitor to boot FahadOS.',
  robots: { index: false, follow: false }, // mockup — not indexed yet
}

export default function DeskPage() {
  return (
    <>
      <h1 className="sr-only">Fahad&rsquo;s desk — interactive 3D portfolio (prototype)</h1>
      <DeskLoader />
    </>
  )
}
