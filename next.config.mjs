/** @type {import('next').NextConfig} */

const CV = '/cv/Md-Anawrul-Kabir-Fahad-SWE-CV.pdf'
const ACADEMIC_CV = '/cv/Md-Anawrul-Kabir-Fahad-Academic-CV.pdf'

// The island is the home page; /work, /research and /about hold the full write-ups, the desk is at /desk.
// Old URLs land on the page that now holds their content.
const OLD_PAGES = {
  academic: '/research',
  projects: '/work',
  experience: '/about',
  skills: '/about',
  contact: '/about',
  hire: '/about',
  archive: '/',
  journey: '/',
  animate: '/',
  review: '/',
}

const nextConfig = {
  async redirects() {
    return [
      { source: '/cv', destination: CV, permanent: false },
      { source: '/resume', destination: CV, permanent: false },
      { source: '/cv/academic', destination: ACADEMIC_CV, permanent: false },
      // the single CV this replaced: old links get the software engineering CV
      { source: '/cv/Md-Anawrul-Kabir-Fahad-CV.pdf', destination: CV, permanent: true },
      ...Object.entries(OLD_PAGES).flatMap(([p, to]) => [
        { source: `/${p}`, destination: to, permanent: true },
        { source: `/${p}/:path*`, destination: to, permanent: true },
      ]),
    ]
  },
  webpack(config) {
    // the site pages' bodies are plain HTML files, imported as strings
    config.module.rules.push({ test: /\.html$/, type: 'asset/source' })
    return config
  },
}

export default nextConfig
