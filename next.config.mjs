/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // All images are local (public/media); no remote hosts (§15.7).
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/resume', destination: '/cv', permanent: true },
      { source: '/animate', destination: '/', permanent: true },
      { source: '/review', destination: '/', permanent: true },
      // Old capitalised project URLs (/projects/Luca etc.) are lowercased in
      // src/middleware.ts — config redirects match case-insensitively and
      // would loop.
    ]
  },
}

export default nextConfig
