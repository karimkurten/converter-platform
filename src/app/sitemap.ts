import type { MetadataRoute } from 'next'
import { CATEGORIES, getAllConverterPaths } from '@/lib/converters'
import { blogPosts } from '@/lib/blog'

const SITE_URL = 'https://www.convertnow.ca'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().split('T')[0]

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/affiliate-disclosure`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/editorial-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: now,
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
        lastModified: now,
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

  return [...staticPages, ...categoryPages, ...converterPages, ...blogPages]
}
