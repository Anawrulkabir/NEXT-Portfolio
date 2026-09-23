import { NextResponse, type NextRequest } from 'next/server'

/**
 * Project slugs are lowercase (§03.1). Old links like /projects/Luca get a
 * permanent redirect to /projects/luca. Done here rather than in
 * next.config redirects, which match case-insensitively and would loop.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const lower = pathname.toLowerCase()
  if (lower === pathname) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = lower
  return NextResponse.redirect(url, 308)
}

export const config = { matcher: '/projects/:path+' }
