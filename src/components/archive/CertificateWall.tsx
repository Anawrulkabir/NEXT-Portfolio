'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { isPending, type Certification } from '@/content'
import { mediaMeta } from '@/lib/media'
import { formatDate } from '@/lib/format'
import { CertificateLightbox } from './CertificateLightbox'

/**
 * One framed certificate (§05.2 Room R1). Awards get a brass plate.
 */
export function CertificateFrame({
  cert,
  onOpen,
}: {
  cert: Certification
  onOpen: (invoker: HTMLElement) => void
}) {
  if (isPending(cert.image.src)) return null
  const meta = mediaMeta(cert.image.src, cert.image.width, cert.image.height)
  const name = typeof cert.name === 'string' ? cert.name : ''
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      className="cert-frame group pixel-focus block w-full text-left"
      aria-label={`${name}. Open certificate`}
    >
      <span className="block border-4 border-[#6b5238] bg-[#e7e1d1] p-1.5 shadow-[3px_3px_0_0_rgba(0,0,0,0.35)] transition-transform duration-[120ms] group-hover:-translate-y-0.5 group-hover:shadow-[3px_5px_0_0_rgba(0,0,0,0.45)] group-focus-visible:-translate-y-0.5">
        <Image
          src={cert.image.src}
          alt=""
          width={meta.width}
          height={meta.height}
          sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 50vw"
          placeholder={meta.blur ? 'blur' : 'empty'}
          blurDataURL={meta.blur}
          className="block w-full aspect-[4/3] object-cover"
        />
      </span>
      <span className="mt-2 block text-xs leading-snug">
        {cert.kind === 'award' && (
          <span className="mr-1 inline-block bg-[#cbb26a] text-ink px-1 font-semibold">{name.split(' — ')[0]}</span>
        )}
        {cert.kind === 'award' ? name.split(' — ').slice(1).join(' — ') : name}
        {typeof cert.date === 'string' && (
          <span className="opacity-80">
            {' '}
            {'·'} {formatDate(cert.date)}
          </span>
        )}
      </span>
    </button>
  )
}

/** The certificate wall + its lightbox. Used on /archive, in the Archive room and its panel. */
export function CertificateWall({
  certificates,
  columns = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
}: {
  certificates: Certification[]
  columns?: string
}) {
  const [open, setOpen] = useState<number | null>(null)
  const invoker = useRef<HTMLElement | null>(null)
  if (!certificates.length) return null
  return (
    <>
      <ul className={`grid ${columns} gap-4`}>
        {certificates.map((c, i) => (
          <li key={c.id}>
            <CertificateFrame
              cert={c}
              onOpen={(el) => {
                invoker.current = el
                setOpen(i)
              }}
            />
          </li>
        ))}
      </ul>
      <CertificateLightbox
        certificates={certificates}
        index={open}
        onIndexChange={setOpen}
        onClose={() => setOpen(null)}
        returnFocus={invoker.current}
      />
    </>
  )
}
