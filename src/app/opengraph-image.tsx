import { ImageResponse } from 'next/og'
import { profile } from '@/content'

export const alt = `${profile.name} — ${profile.positioning}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The R65's keycap colours, as on the desk.
const KEYS = ['#4d8059', '#f4efe2', '#f4efe2', '#f4efe2', '#a9444c', '#f4efe2', '#f4efe2', '#4d8059']

/** Link preview: the desk's studio grey, the fahadOS "f", name and one line. Rendered at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 72px',
          background: 'radial-gradient(ellipse at 50% 40%, #eceae6 0%, #d3d0cb 55%, #a9a6a1 100%)',
          color: '#1d1d1f',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 92,
            height: 92,
            borderRadius: 22,
            background: '#23392a',
            color: '#efe6d6',
            fontSize: 66,
            fontWeight: 700,
            fontFamily: 'serif',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          f
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1.5, marginTop: 36 }}>{profile.name}</div>
        <div style={{ fontSize: 32, marginTop: 10, color: '#2f5d4a' }}>{profile.positioning}</div>
        <div style={{ fontSize: 24, marginTop: 18, maxWidth: 900, color: 'rgba(0,0,0,0.62)' }}>{profile.sentence}</div>
        <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {KEYS.map((c, i) => (
              <div key={i} style={{ display: 'flex', width: 38, height: 38, borderRadius: 8, background: c, boxShadow: 'inset 0 -5px 0 rgba(0,0,0,0.15)' }} />
            ))}
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: 'rgba(0,0,0,0.55)' }}>fahadkabir.com · sit at my desk</div>
        </div>
      </div>
    ),
    size
  )
}
