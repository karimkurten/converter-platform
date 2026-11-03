import type { MetadataRoute } from 'next'
import { CATEGORIES, getAllConverterPaths, HEIGHT_CONVERTERS, COOKING_CONVERTERS, COOKING_CONVERTER_IDS } from '@/lib/converters'
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
  const heightIds = new Set(HEIGHT_CONVERTERS.map(c => c.id))
  const converterPages: MetadataRoute.Sitemap = converterPaths
    .map(({ category, converter }) => {
      const cat = CATEGORIES.find(c => c.slug === category)
      const conv = cat?.converters.find(c => c.id === converter)
      if (!conv?.popular) return null
      // Height pages (Batch F) are emitted separately below — they are
      // rendered by src/app/length/[heightPage], not the pair route.
      if (heightIds.has(converter)) return null
      // Cooking cluster pages (Batch G) likewise — rendered by
      // src/app/cooking/[cookingPage] and emitted separately below.
      if (COOKING_CONVERTER_IDS.has(converter)) return null
      return {
        url: `${SITE_URL}/${category}/${converter}`,
        changeFrequency: 'monthly',
        priority: 0.8,
      }
    })
    .filter(Boolean) as MetadataRoute.Sitemap

  // Batch F: height cluster pages (2 converters, chart, specific-value
  // pages) — all indexable, registered exactly like the pair pages above.
  const heightPages: MetadataRoute.Sitemap = HEIGHT_CONVERTERS.map(c => ({
    url: `${SITE_URL}/length/${c.id}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Batch G: cooking cluster pages (2 converters, oven chart, ingredient
  // pages) — all indexable, registered exactly like the pair pages above.
  // This is what gives the /cooking hub real children (resolves CN-12).
  const cookingPages: MetadataRoute.Sitemap = COOKING_CONVERTERS.map(c => ({
    url: `${SITE_URL}/cooking/${c.id}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

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
  return [...staticPages, ...categoryPages, ...converterPages, ...heightPages, ...cookingPages, ...blogPages].filter(entry => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
