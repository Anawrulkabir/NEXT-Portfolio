import type { MetadataRoute } from 'next'

const PAGES = ['/', '/work', '/work/snake-robot', '/work/propbench', '/work/ai-studio', '/work/tensorcode', '/research', '/about']

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({ url: `https://fahadkabir.com${p}`, lastModified: new Date() }))
}
