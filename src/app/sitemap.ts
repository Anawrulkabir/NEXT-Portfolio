import type { MetadataRoute } from 'next'
import { projects, projectTitle, research } from '@/content'

const baseUrl = 'https://fahadkabir.com'

const staticRoutes = ['/', '/about', '/experience', '/hire', '/research', '/academic', '/journey', '/projects', '/skills', '/archive', '/cv', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes,
    ...research.map((r) => `/research/${r.id}`),
    ...projects.filter((p) => projectTitle(p)).map((p) => `/projects/${p.id}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))
}
