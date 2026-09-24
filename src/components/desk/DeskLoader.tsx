'use client'
import dynamic from 'next/dynamic'
import type { DeskData } from './data'

// three.js only loads on /desk, never on the rest of the site.
const DeskExperience = dynamic(() => import('./DeskExperience'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-[70] bg-black" />,
})

export function DeskLoader({ data }: { data: DeskData }) {
  return <DeskExperience data={data} />
}
