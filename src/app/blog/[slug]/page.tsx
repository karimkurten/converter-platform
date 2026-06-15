import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPostBySlug, getRelatedBlogPosts, getAllBlogPosts } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogPosts().map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: `${post.title} | ConvertNow Blog`,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.tags,
    ogImage: post.ogImage,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedBlogPosts(slug);

  // JSON-LD Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.ogImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://www.convertnow.ca',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ConvertNow',
      logo: { '@type': 'ImageObject', url: 'https://www.convertnow.ca/og-image.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonicalUrl,
    },
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.convertnow.ca' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.convertnow.ca/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: post.canonicalUrl },
    ],
  };

  return (
    <div className="container-lg py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ─── Breadcrumb ──────────────────────────────────────── */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand-500">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-brand-500">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium">{post.title}</span>
      </nav>

      {/* ─── Header ──────────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto">
        {/* Category */}
        <span className="inline-flex px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-4">
          {post.category}
        </span>

        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <span>{post.author}</span>
          <span>·</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
          <span>·</span>
          <span>{post.readTime} read</span>
        </div>

        {/* ─── Content ─────────────────────────────────────────── */}
        <div className="prose prose-lg prose-gray dark:prose-invert max-w-none mb-12">
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* ─── Related Converters ──────────────────────────────── */}
        {post.relatedConverters && post.relatedConverters.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Try These Converters
            </h2>
            <div className="flex flex-wrap gap-2">
              {post.relatedConverters.map(slug => (
                <Link
                  key={slug}
                  href={`/${slug.split('-')[0] === 'kilogram' ? 'weight' : slug.split('-')[0] === 'kilometer' ? 'length' : slug.split('-')[0] === 'celsius' ? 'temperature' : 'length'}/${slug}`}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
                >
                  {slug.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ─── Related Products ────────────────────────────────── */}
        {post.relatedShopProducts && post.relatedShopProducts.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Recommended Tools
            </h2>
            <div className="flex flex-wrap gap-2">
              {post.relatedShopProducts.map(product => (
                <Link
                  key={product}
                  href="/shop"
                  className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                >
                  {product.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ─── Related Posts ───────────────────────────────────── */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="card p-5 hover:shadow-md transition-all"
                >
                  <span className="text-xs font-semibold text-brand-500">{r.category}</span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-1 line-clamp-2">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
