import manifest from '@/content/.generated/media.json'

type MediaMeta = { width: number; height: number; blur?: string }
const media = manifest as Record<string, MediaMeta>

/**
 * Dimensions + blur placeholder for a /public image, from the manifest that
 * `npm run optimize-images` writes. Explicit width/height on the content
 * object win; otherwise the manifest; otherwise a 4:3 fallback.
 */
export function mediaMeta(src: string, width?: number, height?: number): MediaMeta {
  const m = media[src]
  return {
    width: width ?? m?.width ?? 800,
    height: height ?? m?.height ?? 600,
    blur: m?.blur,
  }
}
