/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  async rewrites() {
    return []
  },
  async redirects() {
    return []
  },
  async headers() {
    return []
  }
}

module.exports = nextConfig
