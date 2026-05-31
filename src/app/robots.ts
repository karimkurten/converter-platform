import type { MetadataRoute } from 'next';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://convertnow.ca';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      { userAgent: 'Googlebot', allow: '/', crawlDelay: 0 },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
