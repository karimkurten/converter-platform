import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES } from '@/lib/converters';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Convertly',
  description: 'The page you were looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="container-md py-16 lg:py-24 text-center">
      <div className="max-w-lg mx-auto">
        <div className="text-8xl font-black text-gray-100 dark:text-gray-800 select-none mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The converter or page you&apos;re looking for doesn&apos;t exist. Try searching or browsing our categories below.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <Link href="/" className="btn-primary">← Back to Home</Link>
          <Link href="/length" className="btn-secondary">Browse converters</Link>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
            Popular categories
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {CATEGORIES.slice(0, 5).map(cat => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="card p-3 text-center hover:scale-[1.03] transition-transform"
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
