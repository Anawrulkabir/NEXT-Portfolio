import Image from 'next/image'
import { Camera } from 'lucide-react'
import { isPending, type ImageAsset } from '@/content'

/**
 * An image, or — while the author hasn't supplied it — a dev-only dashed
 * placeholder. Never a fake photo; renders nothing in production (§13.3).
 */
export function MediaSlot({ image, className }: { image: ImageAsset; className?: string }) {
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
  return (
    <figure className={className}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width ?? 800}
        height={image.height ?? 600}
        className="w-full h-auto pixel-frame"
      />
      {image.caption && <figcaption className="text-xs mt-1 opacity-70">{image.caption}</figcaption>}
    </figure>
  )
}
