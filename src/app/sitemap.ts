import type { MetadataRoute } from 'next'
import { research } from '@/content'

const baseUrl = 'https://fahadkabir.com'

// Grows as later phases add routes (research/[slug], projects/[slug], etc.)
const staticRoutes = ['/', '/about', '/experience', '/hire', '/research', '/academic', '/journey', '/projects', '/archive', '/cv', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...research.map((r) => `/research/${r.id}`)].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}
