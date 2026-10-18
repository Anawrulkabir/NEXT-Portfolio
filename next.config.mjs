/** @type {import('next').NextConfig} */

const CV = '/cv/Md-Anawrul-Kabir-Fahad-CV.pdf'

// The site is one page (the deploy experience, with the desk at /desk). Old URLs land somewhere useful.
const OLD_PAGES = ['about', 'academic', 'archive', 'contact', 'experience', 'hire', 'journey', 'projects', 'research', 'skills', 'animate', 'review']

const nextConfig = {
  async redirects() {
    return [
      { source: '/cv', destination: CV, permanent: false },
      { source: '/resume', destination: CV, permanent: false },
      ...OLD_PAGES.flatMap((p) => [
        { source: `/${p}`, destination: '/', permanent: true },
        { source: `/${p}/:path*`, destination: '/', permanent: true },
      ]),
    ]
  },
}

export default nextConfig
