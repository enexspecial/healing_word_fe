/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Enable static exports if needed for hosting
  // output: 'export',
}

module.exports = nextConfig
