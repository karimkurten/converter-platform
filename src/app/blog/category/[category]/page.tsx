import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostsByCategory, getAllBlogPosts, type BlogPost } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  const categories = Array.from(new Set(posts.map(p => p.category.toLowerCase())));
  return categories.map(category => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const posts = getBlogPostsByCategory(category);
  if (posts.length === 0) return {};
  return buildMetadata({
    title: `${posts[0].category} Articles — ConvertNow Blog`,
    description: `Browse ${posts.length} ${posts[0].category.toLowerCase()} articles on ConvertNow. Expert guides, tips, and reviews.`,
    path: `/blog/category/${category}`,
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = getBlogPostsByCategory(category);

  if (posts.length === 0) notFound();

  const allPosts = getAllBlogPosts();
  const categories = Array.from(new Set(allPosts.map(p => p.category)));
  const displayName = posts[0].category;

  return (
    <div className="container-lg py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand-500">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-brand-500">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white font-medium">{displayName}</span>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {displayName} Articles
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {posts.length} article{posts.length > 1 ? 's' : ''} in {displayName.toLowerCase()}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide justify-center">
        <Link
          href="/blog"
          className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          All
        </Link>
        {categories.map(cat => (
          <Link
            key={cat}
            href={`/blog/category/${cat.toLowerCase()}`}
            className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold ${
              cat.toLowerCase() === category.toLowerCase()
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card p-6 flex flex-col h-full hover:shadow-lg transition-all hover:scale-[1.01] group"
    >
      <span className="self-start px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-4">
        {post.category}
      </span>
      <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-3 group-hover:text-brand-500 transition-colors line-clamp-2">
        {post.title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-3">
        {post.description}
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
        <span>{post.readTime} read</span>
        <span>·</span>
        <span>{new Date(post.publishedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </Link>
  );
}
