import type { Metadata } from 'next'
import { Pixelify_Sans, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { profile } from '@/content'
import { SkipLink } from '@/components/chrome/SkipLink'
import { QuickViewBar } from '@/components/chrome/QuickViewBar'
import { Footer } from '@/components/chrome/Footer'
import { motionBootScript } from '@/lib/motion'

const pixelFont = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-pixel',
  display: 'swap',
})

const bodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const monoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.positioning}`,
    template: `%s — ${profile.shortName}`,
  },
  description: profile.sentence,
  metadataBase: new URL('https://fahadkabir.com'),
  openGraph: {
    type: 'website',
    siteName: profile.name,
    locale: 'en_US',
    title: `${profile.name} — ${profile.positioning}`,
    description: profile.sentence,
  },
  twitter: { card: 'summary_large_image' },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.positioning,
  description: profile.sentence,
  url: 'https://fahadkabir.com',
  image: typeof profile.portrait === 'object' && 'src' in profile.portrait
    ? `https://fahadkabir.com${String(profile.portrait.src).replace(/\.webp$/, '.jpg')}`
    : undefined,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Chittagong University of Engineering & Technology',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Poridhi.io',
  },
  sameAs: profile.links
    .filter((l) => l.kind === 'linkedin' || l.kind === 'github')
    .map((l) => l.href),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${pixelFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <head>
        {/* Restores the reduce-motion toggle before first paint (I-17). */}
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body className="font-sans bg-night text-parchment">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SkipLink />
        <QuickViewBar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
