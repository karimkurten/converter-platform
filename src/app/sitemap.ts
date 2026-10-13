import type { MetadataRoute } from 'next'
import { CATEGORIES, getAllConverterPaths } from '@/lib/converters'
import { blogPosts } from '@/lib/blog'

const SITE_URL = 'https://www.convertnow.ca'

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified on non-blog entries: these pages have no tracked
  // modification dates, and emitting build time as lastmod is dishonest.
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/shop`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/affiliate-disclosure`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/editorial-policy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${SITE_URL}/${cat.slug}`,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const converterPaths = getAllConverterPaths()
  const converterPages: MetadataRoute.Sitemap = converterPaths
    .map(({ category, converter }) => {
      const cat = CATEGORIES.find(c => c.slug === category)
      const conv = cat?.converters.find(c => c.id === converter)
      if (!conv?.popular) return null
      return {
        url: `${SITE_URL}/${category}/${converter}`,
        changeFrequency: 'monthly',
        priority: 0.8,
      }
    })
    .filter(Boolean) as MetadataRoute.Sitemap

  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Dedupe by URL: POPULAR_CURRENCY_PAIRS already contains both directions of
  // each pair, and makeConverters reverses every pair — so converter IDs like
  // USD-to-EUR are generated (and emitted here) twice.
  const seen = new Set<string>()
  return [...staticPages, ...categoryPages, ...converterPages, ...blogPages].filter(entry => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
