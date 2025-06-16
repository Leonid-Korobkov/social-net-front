import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://social-net-back.onrender.com/api/:path*',
  //     },
  //   ]
  // },
  serverExternalPackages: ['autoprefixer'],
  experimental: {
    optimizePackageImports: [
      '@heroui/react',
      'react-icons',
      'framer-motion',
      '@tanstack/react-query',
    ],
    webpackMemoryOptimizations: true,
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 15 * 60 * 1000, // 15 minutes
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
