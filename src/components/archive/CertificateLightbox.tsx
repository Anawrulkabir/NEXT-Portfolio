'use client'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react'
import { eventById, isPending, type Certification } from '@/content'
import { mediaMeta } from '@/lib/media'
import { formatDate } from '@/lib/format'

/**
 * Certificate lightbox (§09 I-11): the actual certificate image with its
 * name, issuer, date and credential link. ←/→ step through the wall.
 */
export function CertificateLightbox({
  certificates,
  index,
  onIndexChange,
  onClose,
  returnFocus,
}: {
  certificates: Certification[]
  index: number | null
  onIndexChange: (i: number) => void
  onClose: () => void
  /** The frame that opened the lightbox — focus goes back to it on close (§15.9). */
  returnFocus?: HTMLElement | null
}) {
  const cert = index === null ? null : certificates[index]
  const n = certificates.length
  const step = (d: number) => index !== null && onIndexChange((index + d + n) % n)
  const src = cert && !isPending(cert.image.src) ? cert.image.src : null
  const meta = src ? mediaMeta(src, cert!.image.width, cert!.image.height) : null
  const event = cert?.eventId ? eventById[cert.eventId] : undefined

  return (
    <Dialog.Root open={!!cert} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/80 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            if (returnFocus) {
              e.preventDefault()
              returnFocus.focus()
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') step(1)
            if (e.key === 'ArrowLeft') step(-1)
          }}
          className="fixed z-[60] inset-2 md:inset-8 flex flex-col bg-parchment text-ink border-2 border-loam pixel-shadow data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          {cert && (
            <>
              <div className="pixel-panel-header flex items-center justify-between gap-3 px-4 py-2.5 shrink-0">
                <Dialog.Title className="font-display text-sm md:text-base">
                  {typeof cert.name === 'string' ? cert.name : 'Certificate'}
                </Dialog.Title>
                <Dialog.Close className="pixel-focus p-1" aria-label="Close">
                  <X className="h-5 w-5" aria-hidden="true" />
                </Dialog.Close>
              </div>
              <div className="relative flex-1 min-h-0 bg-night">
                {src && meta && (
                  <Image
                    src={src}
                    alt={cert.image.alt}
                    fill
                    sizes="100vw"
                    placeholder={meta.blur ? 'blur' : 'empty'}
                    blurDataURL={meta.blur}
                    className="object-contain"
                  />
                )}
              </div>
              <div className="shrink-0 border-t-2 border-loam px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="pixel-focus inline-flex items-center gap-1"
                  aria-label="Previous certificate"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Prev
                </button>
                <p className="flex-1 min-w-[200px]">
                  {typeof cert.issuer === 'string' && <span className="font-semibold">{cert.issuer}</span>}
                  {typeof cert.date === 'string' && (
                    <>
                      {' '}
                      {'·'} {formatDate(cert.date)}
                    </>
                  )}
                  {event && typeof event.name === 'string' && (
                    <>
                      {' · '}
                      <a href="/archive#events" className="pixel-focus underline underline-offset-2">
                        {event.name}
                      </a>
                    </>
                  )}
                  {cert.credentialUrl && !isPending(cert.credentialUrl) && (
                    <>
                      {' · '}
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pixel-focus inline-flex items-center gap-1 underline"
                      >
                        Credential <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </>
                  )}
                </p>
                <span className="text-xs tabular-nums" aria-live="polite">
                  {index! + 1} / {n}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="pixel-focus inline-flex items-center gap-1"
                  aria-label="Next certificate"
                >
                  Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
