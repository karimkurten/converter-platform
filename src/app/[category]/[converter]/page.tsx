import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CATEGORIES,
  getCategoryBySlug,
  getConverterBySlug,
  getRelatedConverters,
  runConversion,
} from '@/lib/converters';
import {
  buildConverterMetadata,
  buildConverterSchema,
  generateConverterFAQs,
} from '@/lib/seo';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ConverterEngine from '@/components/converter/ConverterEngine';
import { RelatedConverters, ConversionTable, FormulaBlock } from '@/components/converter/ConverterWidgets';
import AdUnit, { StickyMobileAd } from '@/components/ads/AdUnit';
import ContextualProductWidget from '@/components/affiliate/ContextualProductWidget';

interface Props {
  params: Promise<{ category: string; converter: string }>;
}

// ─── Static generation ────────────────────────────────────────────────────────
// Pre-render only converters explicitly flagged as `popular`; the rest are ISR.
export async function generateStaticParams() {
  return CATEGORIES.flatMap(cat =>
    cat.converters
      .filter(c => c.popular === true)
      .map(c => ({ category: cat.slug, converter: c.id }))
  );
}

export const dynamicParams = true; // Allow ISR for all remaining paths
export const revalidate = 86400; // Revalidate daily

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, converter: converterSlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const converter = getConverterBySlug(categorySlug, converterSlug);
  if (!category || !converter) return {};
  return buildConverterMetadata(converter, category);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ConverterPage({ params }: Props) {
  const { category: categorySlug, converter: converterSlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const converter = getConverterBySlug(categorySlug, converterSlug);

  if (!category || !converter) notFound();

  const fromUnit = category.units.find(u => u.id === converter.from)!;
  const toUnit = category.units.find(u => u.id === converter.to)!;
  const relatedConverters = getRelatedConverters(categorySlug, converterSlug, 8);

  // Calculate 1-unit example for FAQs / schema (skip for currency – needs live rates)
  let exampleResult = 1;
  let exampleFormula = '';
  let formulaDescription = '';

  try {
    if (category.id !== 'currency') {
      const result = runConversion(category.id, 1, converter.from, converter.to);
      if (result) {
        exampleResult = parseFloat(result.value.toPrecision(6));
        exampleFormula = result.formula;
        formulaDescription = `To convert ${fromUnit.name} to ${toUnit.name}: multiply by ${exampleResult}. ${result.formula}`;
      }
    }
  } catch {}

  const faqs = generateConverterFAQs(converter, category, exampleResult);
  const schemas = buildConverterSchema(converter, category, faqs);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category.name, href: `/${category.slug}` },
    { label: converter.title, href: `/${category.slug}/${converter.id}` },
  ];

  return (
    <>
      {/* Structured data */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <StickyMobileAd />

      {/* Breadcrumb header */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container-lg py-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      <div className="container-lg py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">

          {/* Main column */}
          <div className="lg:col-span-3 space-y-6">

            {/* ─── Converter Engine ─────────────────────────────── */}
            <Suspense fallback={<div className="converter-card h-64 animate-pulse" />}>
              <ConverterEngine converter={converter} category={category} />
            </Suspense>

            {/* ─── Contextual Product Widget ────────────────────── */}
            <ContextualProductWidget categorySlug={categorySlug} />

            {/* ─── In-content ad ───────────────────────────────── */}
            <div className="flex justify-center py-2">
              <AdUnit slot="in-content" label />
            </div>

            {/* ─── Formula explanation ──────────────────────────── */}
            {exampleFormula && (
              <FormulaBlock
                formula={exampleFormula}
                description={formulaDescription}
              />
            )}

            {/* ─── Conversion Table ─────────────────────────────── */}
            {category.id !== 'currency' && (
              <div className="card p-5">
                <ConversionTable converter={converter} category={category} />
              </div>
            )}

            {/* ─── Second in-content ad ─────────────────────────── */}
            <div className="flex justify-center py-2">
              <AdUnit slot="in-content" label />
            </div>

            {/* ─── FAQ Section ──────────────────────────────────── */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                {fromUnit.name} to {toUnit.name} — FAQ
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details key={i} className="group border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                    <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-800 dark:text-gray-200 text-sm list-none">
                      <span>{faq.question}</span>
                      <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* ─── SEO content block ────────────────────────────── */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                About {fromUnit.name} and {toUnit.name}
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
                <p>
                  The <strong>{fromUnit.name}</strong> ({fromUnit.symbol}) and <strong>{toUnit.name}</strong> ({toUnit.symbol}) are
                  both units of {category.name.toLowerCase()}. Our converter uses the precise conversion
                  factor to give you accurate results instantly.
                </p>
                <p>
                  1 {fromUnit.name} = {exampleResult} {toUnit.name}
                </p>
                <p>
                  This {category.name.toLowerCase()} converter supports bidirectional conversion — use the swap button
                  to convert {toUnit.name} back to {fromUnit.name}. You can also adjust the decimal precision using the controls below the result.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────── */}
          <aside className="hidden lg:block mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-5">

              {/* Sidebar ad */}
              <AdUnit slot="sidebar-top" label />

              {/* Related converters */}
              {relatedConverters.length > 0 && (
                <div className="card p-5">
                  <RelatedConverters converters={relatedConverters} category={category} />
                </div>
              )}

              {/* Sidebar ad #2 */}
              <AdUnit slot="sidebar-bottom" label />

              {/* Quick navigation */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  All Categories
                </h3>
                <ul className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <li key={cat.slug}>
                      <Link
                        href={`/${cat.slug}`}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                          cat.slug === categorySlug
                            ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-500'
                        }`}
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
