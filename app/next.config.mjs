/** @type {import('next').NextConfig} */
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'hikersdepot.*',
      },
    ],
  },
  webpack: (config => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  }),
}

export default nextConfig
