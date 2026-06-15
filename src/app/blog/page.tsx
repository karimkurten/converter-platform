import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts, getBlogPostsByCategory, getRelatedBlogPosts, type BlogPost } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Blog — Conversion Tips, Guides & Tools | ConvertNow.ca',
  description: 'Free conversion guides, calculator tips, and measurement tool reviews. Learn how to convert metric to imperial, bake with precision, and choose the best tools.',
  path: '/blog',
  keywords: [
    'unit conversion blog',
    'metric to imperial guide',
    'baking conversions',
    'measurement tool reviews',
    'cooking tips',
    'travel conversions'
  ],
});

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const categories = Array.from(new Set(posts.map(p => p.category)));

  return (
    <div className="container-lg py-12">
      {/* ─── Hero ────────────────────────────────────────────── */}
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Conversion Tips, Guides & Tool Reviews
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Expert guides on unit conversion, measurement accuracy, and the best tools for every job.
        </p>
      </div>

      {/* ─── Category Tabs ───────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide justify-center">
        <Link
          href="/blog"
          className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold bg-brand-500 text-white"
        >
          All
        </Link>
        {categories.map(cat => (
          <Link
            key={cat}
            href={`/blog/category/${cat.toLowerCase()}`}
            className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* ─── Post Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

// ─── Components ──────────────────────────────────────────────────────

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card p-6 flex flex-col h-full hover:shadow-lg transition-all hover:scale-[1.01] group"
    >
      {/* Category tag */}
      <span className="self-start px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-4">
        {post.category}
      </span>

      {/* Title */}
      <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-3 group-hover:text-brand-500 transition-colors line-clamp-2">
        {post.title}
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-3">
        {post.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
        <span>{post.readTime} read</span>
        <span>·</span>
        <span>{new Date(post.publishedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </Link>
  );
}
