import type { MetadataRoute } from 'next'

const baseUrl = 'https://fahadkabir.com'

// Grows as later phases add routes (research/[slug], projects/[slug], etc.)
const staticRoutes = ['/', '/about', '/projects', '/cv', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}
