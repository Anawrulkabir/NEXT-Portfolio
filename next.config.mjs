/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // TODO(Phase 6): remove this wildcard once Projects/AllProjects stop
    // hotlinking external tech-icon images (see docs/PORTFOLIO_REDESIGN.md §15.7).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/resume', destination: '/cv', permanent: true },
      { source: '/animate', destination: '/', permanent: true },
      { source: '/review', destination: '/', permanent: true },
      // TODO(Phase 6): /projects/Luca -> /projects/luca (and Sitemark,
      // Craftpaper) once /projects/[slug] replaces /projects/[projectName].
    ]
  },
}

export default nextConfig
