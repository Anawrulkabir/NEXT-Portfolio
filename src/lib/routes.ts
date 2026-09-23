/**
 * Routes that exist right now. Content can point at routes that later phases
 * build (/research, /skills, /experience); anything rendering such a link
 * checks here first so the site never links to a 404. Add a route when its
 * page lands.
 */
export const LIVE_ROUTES = new Set([
  '/',
  '/about',
  '/experience',
  '/hire',
  '/projects',
  '/cv',
  '/contact',
  '/journey',
  '/archive',
])

export const isLiveRoute = (href: string) => LIVE_ROUTES.has(href.split('#')[0].split('?')[0])
