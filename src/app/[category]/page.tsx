import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, getCategoryBySlug } from '@/lib/converters';
import { buildCategoryMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { CATEGORY_COLORS } from '@/lib/utils';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AdUnit from '@/components/ads/AdUnit';

interface Props {
  params: Promise<{ category: string }>;
}

// Generate static paths for all categories
export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};
  return buildCategoryMetadata(category);
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const colors = CATEGORY_COLORS[category.color] || CATEGORY_COLORS.blue;
  const popularConverters = category.converters.filter(c => c.popular);
  const allConverters = category.converters;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category.name, href: `/${category.slug}` },
  ];

  // Group converters by "from" unit for better organization
  const grouped = category.units.reduce((acc, unit) => {
    const convs = allConverters.filter(c => c.from === unit.id);
    if (convs.length > 0) acc[unit.id] = { unit, converters: convs };
    return acc;
  }, {} as Record<string, { unit: typeof category.units[0]; converters: typeof allConverters }>);

  return (
    <>
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(breadcrumbs)) }}
      />

      {/* Hero */}
      <div className={`${colors.light} border-b border-gray-100 dark:border-gray-800`}>
        <div className="container-lg py-8 lg:py-12">
          <Breadcrumb items={breadcrumbs} />
          <div className="mt-4 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center text-2xl text-white shadow-lg`}>
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category.name} Converter
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {allConverters.length} conversions · {category.units.length} units
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>

      <div className="container-lg py-10">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">

            {/* Popular converters */}
            {popularConverters.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">⭐</span> Popular {category.name} Conversions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {popularConverters.map(conv => {
                    const fromUnit = category.units.find(u => u.id === conv.from)!;
                    const toUnit = category.units.find(u => u.id === conv.to)!;
                    return (
                      <Link
                        key={conv.id}
                        href={`/${category.slug}/${conv.id}`}
                        className="card p-4 hover:scale-[1.02] transition-transform group"
                      >
                        <div className={`text-xs font-semibold ${colors.text} mb-2`}>
                          {fromUnit?.symbol} → {toUnit?.symbol}
                        </div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-brand-500 transition-colors">
                          {conv.title}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Ad */}
            <div className="flex justify-center mb-10">
              <AdUnit slot="in-content" label />
            </div>

            {/* All converters grouped by unit */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                All {category.name} Conversions
              </h2>
              <div className="space-y-8">
                {Object.values(grouped).map(({ unit, converters }) => (
                  <div key={unit.id}>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${colors.bg} text-white`}>
                        {unit.symbol}
                      </span>
                      {unit.name} conversions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {converters.map(conv => {
                        const toUnit = category.units.find(u => u.id === conv.to)!;
                        return (
                          <Link
                            key={conv.id}
                            href={`/${category.slug}/${conv.id}`}
                            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950 border border-transparent hover:border-brand-100 dark:hover:border-brand-900 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all font-medium"
                          >
                            {unit.symbol} to {toUnit?.symbol}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Units reference */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{category.name} Units</h3>
                <ul className="space-y-2">
                  {category.units.map(unit => (
                    <li key={unit.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{unit.name}</span>
                      <span className={`font-mono font-bold ${colors.text}`}>{unit.symbol}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sidebar ad */}
              <AdUnit slot="sidebar-top" label />

              {/* Other categories */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Other Categories</h3>
                <ul className="space-y-1">
                  {CATEGORIES.filter(c => c.slug !== category.slug).slice(0, 8).map(cat => (
                    <li key={cat.slug}>
                      <Link
                        href={`/${cat.slug}`}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500"
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
