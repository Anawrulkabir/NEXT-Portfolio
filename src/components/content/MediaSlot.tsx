import Image from 'next/image'
import { Camera } from 'lucide-react'
import { isPending, type ImageAsset } from '@/content'
import { mediaMeta } from '@/lib/media'

/**
 * An image, or — while the author hasn't supplied it — a dev-only dashed
 * placeholder. Never a fake photo; renders nothing in production (§13.3).
 */
export function MediaSlot({
  image,
  className,
  sizes = '(min-width: 768px) 760px, 100vw',
}: {
  image: ImageAsset
  className?: string
  sizes?: string
}) {
  if (isPending(image.src)) {
    if (process.env.NODE_ENV === 'production') return null
    return (
      <div
        className={`border-2 border-dashed border-amber/70 text-amber text-xs flex flex-col items-center justify-center gap-1 h-28 px-3 text-center ${className ?? ''}`}
        title={image.src.label}
      >
        <Camera className="h-4 w-4" aria-hidden="true" />
        <span>{image.src.label}</span>
      </div>
    )
  }
  const meta = mediaMeta(image.src, image.width, image.height)
  return (
    <figure className={className}>
      <Image
        src={image.src}
        alt={image.alt}
        width={meta.width}
        height={meta.height}
        placeholder={meta.blur ? 'blur' : 'empty'}
        blurDataURL={meta.blur}
        sizes={sizes}
        className="w-full h-auto pixel-frame"
      />
      {image.caption && <figcaption className="text-xs mt-1 opacity-70">{image.caption}</figcaption>}
    </figure>
  )
}
