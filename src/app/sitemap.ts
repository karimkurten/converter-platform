import type { MetadataRoute } from 'next';
import { CATEGORIES, getAllConverterPaths } from '@/lib/converters';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://convertnow.ca';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const converterPaths = getAllConverterPaths();
  const converterPages: MetadataRoute.Sitemap = converterPaths.map(({ category, converter }) => {
    const cat = CATEGORIES.find(c => c.slug === category);
    const conv = cat?.converters.find(c => c.id === converter);
    return {
      url: `${SITE_URL}/${category}/${converter}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: conv?.popular ? 0.8 : 0.6,
    };
  });

  return [...staticPages, ...categoryPages, ...converterPages];
}
