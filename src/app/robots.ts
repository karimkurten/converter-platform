import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // CN-07: /go/ is the affiliate redirect gateway — never indexable.
        disallow: ['/api/', '/go/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://www.convertnow.ca/sitemap.xml',
  };
}
