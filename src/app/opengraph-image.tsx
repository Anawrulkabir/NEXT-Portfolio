import { ImageResponse } from 'next/og'
import { isPending, profile, zoneChapters } from '@/content'

export const alt = `${profile.name} — ${profile.positioning}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Zone key colours, in path order (tokens.css --zone-*).
const ZONE_COLORS = ['#4f7a4a', '#7c8a8f', '#9a7b4f', '#8fa3a8', '#6fb7b9', '#a9c4d9', '#c9663a']

/**
 * Open Graph card (§13.2): the route across all seven zones as a pixel strip,
 * with the name and positioning above it. Static — rendered at build time.
 */
export default function OpengraphImage() {
  const words = zoneChapters.map((c) =>
    c.progressWord && !isPending(c.progressWord) ? c.progressWord : c.name.toUpperCase()
  )
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(to bottom, #27304a 0%, #5f5a70 60%, #b98a6c 100%)',
          color: '#e7e1d1',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', padding: '64px 72px 0' }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -1 }}>{profile.name}</div>
          <div style={{ fontSize: 34, marginTop: 14, color: '#a9d6d8' }}>{profile.positioning}</div>
          <div style={{ fontSize: 24, marginTop: 18, maxWidth: 920, opacity: 0.9 }}>{profile.sentence}</div>
        </div>
        <div style={{ display: 'flex', marginTop: 'auto', height: 190, alignItems: 'flex-end' }}>
          {ZONE_COLORS.map((c, i) => (
            <div key={c} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 15,
                  letterSpacing: 1,
                  paddingBottom: 10,
                  color: '#e7e1d1',
                }}
              >
                {words[i]}
              </div>
              <div style={{ display: 'flex', height: 70 + (i % 3) * 18, background: c, opacity: 0.55 }} />
              <div style={{ display: 'flex', height: 16, background: c }} />
              <div style={{ display: 'flex', height: 48, background: '#3b2f22' }} />
            </div>
          ))}
        </div>
      </div>
    ),
    size
  )
}
