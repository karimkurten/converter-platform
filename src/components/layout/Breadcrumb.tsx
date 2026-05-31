import Link from 'next/link';
import type { BreadcrumbItem } from '@/types';
import { buildBreadcrumbSchema } from '@/lib/seo';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const schema = buildBreadcrumbSchema(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        {items.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
            {i === items.length - 1 ? (
              <span className="text-gray-700 dark:text-gray-300 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
