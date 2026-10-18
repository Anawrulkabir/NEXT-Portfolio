import type { MetadataRoute } from 'next'

const PAGES = ['/', '/work', '/work/snake-robot', '/work/propbench', '/research', '/about', '/desk']

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({ url: `https://fahadkabir.com${p}`, lastModified: new Date() }))
}
