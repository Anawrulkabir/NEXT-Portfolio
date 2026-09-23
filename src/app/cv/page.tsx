import type { Metadata } from 'next'
import { profile, isPending } from '@/content'

export const metadata: Metadata = { title: 'CV' }

export default function CvPage() {
  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">CV</h1>
        <div className="flex flex-wrap gap-3">
          <a
            href={profile.cv.downloadHref}
            download
            className="pixel-btn-primary pixel-frame pixel-focus px-4 py-2 text-sm"
          >
            Download CV
          </a>
          {!isPending(profile.cv.academic) && (
            <a
              href={profile.cv.academic as string}
              download
              className="pixel-btn-secondary pixel-frame pixel-focus px-4 py-2 text-sm"
            >
              Download Academic CV
            </a>
          )}
        </div>
      </div>

      <div className="mt-8 pixel-panel pixel-frame overflow-hidden" style={{ height: '85vh' }}>
        <object
          data={profile.cv.downloadHref}
          type="application/pdf"
          width="100%"
          height="100%"
          aria-label={`${profile.name} — CV`}
        >
          <div className="p-6 text-ink">
            <p>Your browser can{'’'}t display the PDF inline.</p>
            <a href={profile.cv.downloadHref} download className="underline">
              Download the CV instead
            </a>
          </div>
        </object>
      </div>
    </div>
  )
}
