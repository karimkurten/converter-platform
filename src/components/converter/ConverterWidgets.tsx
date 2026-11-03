import Link from 'next/link';
import type { Converter, ConverterCategory } from '@/types';
import { runConversion, CONVERT_FNS } from '@/lib/converters';
import { formatNumber } from '@/lib/utils';

interface RelatedConvertersProps {
  converters: Converter[];
  category: ConverterCategory;
}

export function RelatedConverters({ converters, category }: RelatedConvertersProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related {category.name} Converters
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {converters.map(conv => {
          const fromUnit = category.units.find(u => u.id === conv.from);
          const toUnit = category.units.find(u => u.id === conv.to);
          if (!fromUnit || !toUnit) return null;
          return (
            <Link
              key={conv.id}
              href={`/${category.slug}/${conv.id}`}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950 border border-transparent hover:border-brand-100 dark:hover:border-brand-900 transition-all group"
            >
              <span className="text-base">{category.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                {fromUnit.symbol} → {toUnit.symbol}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Conversion reference table ────────────────────────────────────────────────

interface ConversionTableProps {
  converter: Converter;
  category: ConverterCategory;
}

const COMMON_VALUES = [0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100, 250, 500, 1000];

export function ConversionTable({ converter, category }: ConversionTableProps) {
  if (!CONVERT_FNS[category.id]) return null;

  const fromUnit = category.units.find(u => u.id === converter.from)!;
  const toUnit = category.units.find(u => u.id === converter.to)!;

  const rows = COMMON_VALUES.map(val => {
    try {
      const result = runConversion(category.id, val, converter.from, converter.to);
      return result ? { from: val, to: result.value } : null;
    } catch {
      return null;
    }
  }).filter(Boolean) as { from: number; to: number }[];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {fromUnit.name} to {toUnit.name} Conversion Table
      </h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                {fromUnit.name} ({fromUnit.symbol})
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                {toUnit.name} ({toUnit.symbol})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 font-medium">
                  {formatNumber(row.from, 6)} {fromUnit.symbol}
                </td>
                <td className="px-4 py-2.5 text-brand-600 dark:text-brand-400 font-semibold">
                  {formatNumber(row.to, 6)} {toUnit.symbol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Formula Explanation ───────────────────────────────────────────────────────

interface FormulaBlockProps {
  formula: string;
  description: string;
}

export function FormulaBlock({ formula, description }: FormulaBlockProps) {
  return (
    <div className="card p-5">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span className="text-lg">🧮</span> Conversion Formula
      </h2>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-mono text-sm text-brand-600 dark:text-brand-400 mb-3 overflow-x-auto">
        {formula}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

// ─── In-content related conversions block (CN-16) ────────────────────────────
// Server-rendered block in the converter page's main column: reverse pair,
// same-category siblings, the parent category hub, and blog guides that
// discuss this converter. Before this block, converter pages carried no
// in-content internal links in their crawlable body at all.

interface RelatedConversionsProps {
  converter: Converter;
  category: ConverterCategory;
  reverse: Converter | null;
  siblings: Converter[];
  guides: { slug: string; title: string }[];
  /** Extra in-content links rendered in the grid (label + href). */
  extraLinks?: { href: string; label: string }[];
}

export function RelatedConversions({ converter, category, reverse, siblings, guides, extraLinks }: RelatedConversionsProps) {
  const unitName = (id: string) => category.units.find(u => u.id === id)?.name ?? id;
  const fromName = unitName(converter.from);
  const toName = unitName(converter.to);

  return (
    <section className="card p-6" data-related-conversions>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        Related Conversions
      </h2>

      {reverse && (
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          Need the opposite direction? Use the{' '}
          <Link
            href={`/${category.slug}/${reverse.id}`}
            className="text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500"
          >
            {toName} to {fromName} Converter
          </Link>{' '}
          to convert {toName.toLowerCase()} back to {fromName.toLowerCase()}.
        </p>
      )}

      {(siblings.length > 0 || (extraLinks && extraLinks.length > 0)) && (
        <>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            More {category.name} Conversions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {siblings.map(conv => (
              <Link
                key={conv.id}
                href={`/${category.slug}/${conv.id}`}
                className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950 border border-transparent hover:border-brand-100 dark:hover:border-brand-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all"
              >
                {unitName(conv.from)} to {unitName(conv.to)}
              </Link>
            ))}
            {extraLinks?.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950 border border-transparent hover:border-brand-100 dark:hover:border-brand-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        Browse every tool in this category on the{' '}
        <Link
          href={`/${category.slug}`}
          className="text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500"
        >
          {category.name} Converter
        </Link>{' '}
        hub page.
      </p>

      {guides.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-5 mb-2">
            Guides &amp; Articles
          </h3>
          <ul className="space-y-1.5">
            {guides.map(guide => (
              <li key={guide.slug}>
                <Link
                  href={`/blog/${guide.slug}`}
                  className="text-sm text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
