/**
 * The Soccer Bot's real parts (from the author's parts photo), drawn top-down
 * as SVG. Each drawing is centred on (0, 0) in board units.
 */
import type { ReactNode } from 'react'

export type PartId = 'motor' | 'wheel' | 'driver' | 'battery' | 'buck' | 'arduino' | 'bluetooth'

export const PARTS: Record<PartId, { name: string; spec: string; qty: number; w: number; h: number }> = {
  motor: { name: 'DC motor + bracket', spec: 'Brushed motor on an L-bracket', qty: 4, w: 120, h: 44 },
  wheel: { name: 'Wheel', spec: 'Rubber tyre, chrome-blue rim', qty: 4, w: 36, h: 86 },
  driver: { name: 'BTS7960 motor driver', spec: 'H-bridge, high current', qty: 2, w: 110, h: 110 },
  battery: { name: 'LiPo battery', spec: '3S · 11.1 V · 3300 mAh', qty: 1, w: 170, h: 70 },
  buck: { name: 'LM2596 buck converter', spec: 'Steps 11.1 V down to 5 V', qty: 1, w: 100, h: 50 },
  arduino: { name: 'Arduino Uno', spec: 'ATmega328P, the brain', qty: 1, w: 150, h: 110 },
  bluetooth: { name: 'HC-05 Bluetooth', spec: 'Talks to the phone', qty: 1, w: 90, h: 36 },
}

function Motor() {
  return (
    <g>
      <rect x={-44} y={-30} width={8} height={60} rx={2} fill="#1d1e20" />
      <rect x={-50} y={-19} width={100} height={38} rx={6} fill="url(#metal)" stroke="#6b7076" />
      {[-20, 0, 20].map((x) => (
        <rect key={x} x={x - 1} y={-19} width={2} height={38} fill="#8a8f95" opacity={0.6} />
      ))}
      <rect x={-58} y={-12} width={8} height={24} rx={2} fill="#8c9197" />
      <rect x={-66} y={-3} width={8} height={6} fill="#c9ccd0" />
      <rect x={50} y={-12} width={8} height={24} rx={2} fill="#5d6166" />
      <rect x={56} y={-9} width={6} height={5} fill="#c9a24a" />
      <rect x={56} y={4} width={6} height={5} fill="#c9a24a" />
    </g>
  )
}

function Wheel() {
  return (
    <g>
      <rect x={-18} y={-43} width={36} height={86} rx={9} fill="#1b1b1d" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={-18} y={-38 + i * 8} width={36} height={2} fill="#2f3033" />
      ))}
      <rect x={-7} y={-26} width={14} height={52} rx={4} fill="#3a86c8" />
      <rect x={-3} y={-26} width={6} height={52} fill="#bfe3ff" opacity={0.6} />
    </g>
  )
}

function Driver() {
  return (
    <g>
      <rect x={-55} y={-55} width={110} height={110} rx={6} fill="#1e6fa8" stroke="#154e77" />
      <rect x={-38} y={-54} width={76} height={14} rx={2} fill="#2e9e5a" />
      {[-26, -9, 9, 26].map((x) => (
        <circle key={x} cx={x} cy={-47} r={3.5} fill="#c9ccd0" />
      ))}
      <rect x={-42} y={-32} width={84} height={52} rx={3} fill="#15171a" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={-38 + i * 10.5} y={-30} width={4} height={48} fill="#2a2d31" />
      ))}
      <circle cx={-30} cy={38} r={9} fill="#2a2d31" stroke="#9aa0a6" />
      <text x={12} y={42} fontSize={11} fill="#dbe9f6" fontFamily="monospace">
        BTS7960
      </text>
    </g>
  )
}

function Battery() {
  return (
    <g>
      <rect x={-85} y={-35} width={170} height={70} rx={8} fill="#f3f1ea" stroke="#cfcac0" />
      <rect x={-60} y={-24} width={120} height={48} rx={3} fill="#d7812f" />
      <text x={0} y={-4} textAnchor="middle" fontSize={17} fontWeight={700} fill="#fff" fontFamily="Arial, sans-serif">
        3300
      </text>
      <text x={0} y={14} textAnchor="middle" fontSize={10} fill="#fff" fontFamily="Arial, sans-serif">
        mAh · 3S LiPo
      </text>
      <rect x={-10} y={-44} width={8} height={10} fill="#c0282d" />
      <rect x={2} y={-44} width={8} height={10} fill="#1d1e20" />
      <rect x={-12} y={-50} width={24} height={8} rx={2} fill="#e5b93a" />
    </g>
  )
}

function Buck() {
  return (
    <g>
      <rect x={-50} y={-25} width={100} height={50} rx={4} fill="#1f5fa6" stroke="#15477c" />
      <rect x={-12} y={-13} width={26} height={26} rx={3} fill="#222" />
      <text x={1} y={5} textAnchor="middle" fontSize={9} fill="#bbb" fontFamily="monospace">
        470
      </text>
      <circle cx={-32} cy={0} r={9} fill="#c7c9cc" />
      <circle cx={32} cy={0} r={9} fill="#c7c9cc" />
      <rect x={18} y={-22} width={10} height={9} fill="#3a7fd0" />
    </g>
  )
}

function Arduino() {
  return (
    <g>
      <rect x={-75} y={-55} width={150} height={110} rx={6} fill="#0f7c9a" stroke="#0a5a70" />
      <rect x={-50} y={-52} width={115} height={8} fill="#161616" />
      <rect x={-40} y={44} width={105} height={8} fill="#161616" />
      <rect x={-86} y={-40} width={30} height={26} rx={2} fill="#c9ccd0" />
      <rect x={-84} y={14} width={22} height={20} rx={2} fill="#1b1b1b" />
      <rect x={-5} y={-8} width={60} height={16} rx={2} fill="#1b1b1b" />
      <text x={-30} y={30} fontSize={15} fontWeight={700} fill="#fff" fontFamily="Arial, sans-serif">
        UNO
      </text>
    </g>
  )
}

function Bluetooth() {
  return (
    <g>
      <rect x={-45} y={-18} width={90} height={36} rx={3} fill="#1f5fa6" stroke="#15477c" />
      <path d="M-40 -10h8v20h8v-20h8v20h8" fill="none" stroke="#e0b64a" strokeWidth={2} />
      <rect x={8} y={-12} width={20} height={24} rx={2} fill="#dfe3e8" />
      {[-14, -8, -2, 4, 10, 16].map((y) => (
        <rect key={y} x={34} y={y - 2} width={8} height={4} fill="#161616" />
      ))}
    </g>
  )
}

const ART: Record<PartId, () => ReactNode> = {
  motor: Motor,
  wheel: Wheel,
  driver: Driver,
  battery: Battery,
  buck: Buck,
  arduino: Arduino,
  bluetooth: Bluetooth,
}

export function PartArt({ id }: { id: PartId }) {
  const A = ART[id]
  return <A />
}

/** Shared SVG defs (gradients) used by the drawings. */
export function PartDefs() {
  return (
    <defs>
      <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#dfe2e5" />
        <stop offset="0.5" stopColor="#aeb3b8" />
        <stop offset="1" stopColor="#7d8287" />
      </linearGradient>
      <pattern id="ply" width="40" height="12" patternUnits="userSpaceOnUse">
        <rect width="40" height="12" fill="#c49a66" />
        <path d="M0 4 Q10 2 20 4 T40 4 M0 9 Q12 11 24 9 T40 9" stroke="#b0844f" strokeWidth="1" fill="none" />
      </pattern>
    </defs>
  )
}

/** A small tray thumbnail for a part. */
export function PartThumb({ id, size = 64 }: { id: PartId; size?: number }) {
  const p = PARTS[id]
  const pad = 14
  const w = p.w + pad * 2 + (id === 'motor' ? 20 : 0)
  const h = p.h + pad * 2 + (id === 'battery' ? 20 : 0)
  const s = Math.max(w, h)
  return (
    <svg width={size} height={size} viewBox={`${-s / 2} ${-s / 2} ${s} ${s}`} aria-hidden="true">
      <PartDefs />
      <PartArt id={id} />
    </svg>
  )
}
