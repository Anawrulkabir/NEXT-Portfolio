/**
 * Routes that exist right now. Content can point at routes that later phases
 * build (/skills, /projects/[slug]); anything rendering such a link checks
 * here first so the site never links to a 404. Add a route when its page
 * lands.
 */
import { research } from '@/content'

export const LIVE_ROUTES = new Set([
  '/',
  '/about',
  '/experience',
  '/hire',
  '/research',
  '/academic',
  '/projects',
  '/cv',
  '/contact',
  '/journey',
  '/archive',
  ...research.map((r) => `/research/${r.id}`),
])

export const isLiveRoute = (href: string) => LIVE_ROUTES.has(href.split('#')[0].split('?')[0])
