import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
  },

  // Security & Caching headers
  async headers() {
    const csp = [
      "default-src 'self'",
      // 'unsafe-eval' removed; Next.js production build doesn't need it.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.clarity.ms https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.exchangerate-api.com https://open.er-api.com https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/converter/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
