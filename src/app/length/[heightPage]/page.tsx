import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Converter } from '@/types';
import {
  getCategoryBySlug,
  getConverterBySlug,
  getRelatedConverters,
  HEIGHT_CONVERTERS,
  HEIGHT_CONVERTER_IDS,
} from '@/lib/converters';
import { convertLength } from '@/lib/converters/length';
import {
  cmToFeetInches,
  feetInchesToCm,
  cmToTotalInches,
  HEIGHT_VALUES,
  HEIGHT_CHART_MIN,
  HEIGHT_CHART_MAX,
} from '@/lib/height';
import { buildHeightMetadata } from '@/lib/seo';
import { formatNumber } from '@/lib/utils';
import { blogPosts } from '@/lib/blog';
import Breadcrumb from '@/components/layout/Breadcrumb';
import HeightEngine from '@/components/converter/HeightEngine';
import { RelatedConverters, RelatedConversions } from '@/components/converter/ConverterWidgets';
import ContextualProductWidget from '@/components/affiliate/ContextualProductWidget';

/**
 * Height cluster pages (Batch F) — rendered by this dedicated route instead
 * of the unit-to-unit pair template, because feet+inches is a compound
 * result the pair architecture cannot express. The pages are registered in
 * the length category (HEIGHT_CONVERTERS) so the sitemap, hub ItemList and
 * search index include them; the overlapping pair route
 * (src/app/[category]/[converter]) defers these ids to this route.
 *
 * Every figure on these pages is computed at render time from the real
 * length engine (1 inch = 2.54 cm exactly) via src/lib/height.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.convertnow.ca';

type HeightKind = 'cm-to-feet-inches' | 'feet-inches-to-centimeter' | 'chart' | 'value';

function kindOf(id: string): HeightKind | null {
  if (id === 'centimeter-to-feet-inches') return 'cm-to-feet-inches';
  if (id === 'feet-inches-to-centimeter') return 'feet-inches-to-centimeter';
  if (id === 'height-chart') return 'chart';
  if (/^\d+-cm-to-feet-inches$/.test(id)) return 'value';
  return null;
}

function valueCmOf(id: string): number | null {
  const m = id.match(/^(\d+)-cm-to-feet-inches$/);
  return m ? parseInt(m[1], 10) : null;
}

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return HEIGHT_CONVERTERS.map(c => ({ heightPage: c.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ heightPage: string }>;
}): Promise<Metadata> {
  const { heightPage } = await params;
  const converter = getConverterBySlug('length', heightPage);
  if (!converter || !HEIGHT_CONVERTER_IDS.has(heightPage)) return {};
  return buildHeightMetadata(converter);
}

// ─── Shared content builders ──────────────────────────────────────────────────

interface Faq {
  q: string;
  a: string;
}

const fi = cmToFeetInches;

function faqsFor(kind: HeightKind, cm: number | null): Faq[] {
  if (kind === 'cm-to-feet-inches') {
    const ex = fi(175);
    const back = formatNumber(feetInchesToCm(5, 9), 6);
    return [
      {
        q: 'How do I convert cm to feet and inches?',
        a: `Divide the centimetres by 2.54 to get the total inches (1 inch is exactly 2.54 cm), then divide the inches by 12 — the whole number is the feet and the remainder is the inches. For example, 175 cm ÷ 2.54 = ${cmToTotalInches(175)} inches, which is ${ex.display}.`,
      },
      {
        q: 'How tall is 175 cm in feet and inches?',
        a: `175 cm is ${ex.display} (written ${ex.symbolDisplay}), or ${ex.fractionDisplay} to the nearest eighth of an inch.`,
      },
      {
        q: 'How many inches are in a foot?',
        a: 'There are exactly 12 inches in a foot. That is why the conversion splits total inches into groups of 12, with the leftover inches shown after the feet.',
      },
      {
        q: 'How many centimetres are in an inch?',
        a: 'One inch is exactly 2.54 centimetres — this is the exact international definition of the inch, so height conversions built on it carry no approximation error.',
      },
      {
        q: 'What is 5 ft 9 in in cm?',
        a: `5 ft 9 in is ${back} cm: (5 × 12 + 9) = 69 inches, and 69 × 2.54 = ${back} cm. Use the Feet & Inches to Centimeter converter to run the reverse direction for any height.`,
      },
      {
        q: 'Why do heights use feet and inches instead of decimal feet?',
        a: 'Feet and inches are the conventional way heights are stated in the United States and often in the UK and Canada. Beware the common mix-up: 5.9 decimal feet is 5 ft 10.8 in, not 5 ft 9 in — the two notations are not interchangeable.',
      },
    ];
  }
  if (kind === 'feet-inches-to-centimeter') {
    const ex = formatNumber(feetInchesToCm(5, 9), 6);
    const sixFt = formatNumber(feetInchesToCm(6, 0), 6);
    return [
      {
        q: 'How do I convert feet and inches to cm?',
        a: `First turn the height into total inches: feet × 12 + inches. Then multiply by 2.54, because 1 inch is exactly 2.54 cm. For example, 5 ft 9 in is (5 × 12 + 9) = 69 inches, and 69 × 2.54 = ${ex} cm.`,
      },
      {
        q: 'How many cm is 5 ft 9 in?',
        a: `5 ft 9 in is ${ex} cm.`,
      },
      {
        q: 'How many cm is 6 feet?',
        a: `Six feet is ${sixFt} cm: 6 × 12 = 72 inches, and 72 × 2.54 = ${sixFt} cm.`,
      },
      {
        q: 'How many inches are in a foot?',
        a: 'There are exactly 12 inches in a foot, so a height of 5 ft 11 in is 71 inches in total before it is converted.',
      },
      {
        q: 'How do I convert cm back to feet and inches?',
        a: 'Divide the centimetres by 2.54 to get total inches, then split the inches into feet (groups of 12) and the remaining inches. The Centimeter to Feet & Inches converter does it instantly, with fraction results.',
      },
    ];
  }
  if (kind === 'chart') {
    const a180 = fi(180);
    const fiveSeven = formatNumber(feetInchesToCm(5, 7), 6);
    return [
      {
        q: 'How many centimetres are in a foot?',
        a: 'One foot is exactly 30.48 centimetres: 12 inches × 2.54 cm per inch. Every row of the chart is built from that exact relationship.',
      },
      {
        q: 'How tall is 180 cm in feet and inches?',
        a: `180 cm is ${a180.display} (${a180.symbolDisplay}). Find the 180 row in the chart — highlighted rows mark the heights with their own pages.`,
      },
      {
        q: 'How do I read the height chart?',
        a: 'Find your height in centimetres in the first column. The same row gives the height in feet and inches (decimal), in the 5\'9" symbol form, and rounded to the nearest eighth of an inch as a fraction.',
      },
      {
        q: 'What is 5 ft 7 in in cm?',
        a: `5 ft 7 in is ${fiveSeven} cm: (5 × 12 + 7) = 67 inches, and 67 × 2.54 = ${fiveSeven} cm.`,
      },
    ];
  }
  // value pages
  const v = cm!;
  const r = fi(v);
  const prev = fi(v - 5);
  const next = fi(v + 5);
  return [
    {
      q: `How tall is ${v} cm in feet and inches?`,
      a: `${v} cm is ${r.display} — written ${r.symbolDisplay}, or ${r.fractionDisplay} to the nearest eighth of an inch.`,
    },
    {
      q: `How many inches is ${v} cm?`,
      a: `${v} cm is ${cmToTotalInches(v)} inches in total: ${v} ÷ 2.54 = ${cmToTotalInches(v)}. Split into feet and inches, that is ${r.display}.`,
    },
    {
      q: `How do you convert ${v} cm to feet and inches by hand?`,
      a: `Divide by 2.54 to get total inches (${cmToTotalInches(v)} in), then divide by 12: the whole number is the feet (${r.feet}) and the remainder is the inches (${formatNumber(r.inches, 6)}), giving ${r.display}.`,
    },
    {
      q: `What are ${v - 5} cm and ${v + 5} cm in feet and inches?`,
      a: `${v - 5} cm is ${prev.display} and ${v + 5} cm is ${next.display}. The mini chart on this page covers every centimetre from ${v - 5} to ${v + 5}.`,
    },
    {
      q: 'How many centimetres are in a foot?',
      a: 'One foot is exactly 30.48 centimetres (12 inches × 2.54 cm), which is the relationship every height conversion on this page is built from.',
    },
  ];
}

function schemasFor(converter: Converter, faqs: Faq[], kind: HeightKind) {
  const url = `${SITE_URL}/length/${converter.id}`;
  const howToSteps =
    kind === 'feet-inches-to-centimeter'
      ? [
          'Add up the total inches: feet × 12 + inches.',
          'Multiply the total inches by 2.54 (1 inch is exactly 2.54 cm).',
          'The result is the height in centimetres.',
        ]
      : [
          'Divide the centimetres by 2.54 to get total inches (1 inch is exactly 2.54 cm).',
          'Divide the total inches by 12 — the whole number is the feet.',
          'The remaining inches complete the height in feet and inches.',
        ];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: converter.title,
      description: converter.description,
      url,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Length', item: `${SITE_URL}/length` },
          { '@type': 'ListItem', position: 3, name: converter.title, item: url },
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to convert ${kind === 'feet-inches-to-centimeter' ? 'feet and inches to centimetres' : 'centimetres to feet and inches'}`,
      description: converter.description,
      totalTime: 'PT0M',
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
      step: howToSteps.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: `Step ${i + 1}`,
        text,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];
}

// ─── Small shared UI pieces ───────────────────────────────────────────────────

function HeightCrossLinks({ currentId }: { currentId: string }) {
  const linkCls =
    'px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950 border border-transparent hover:border-brand-100 dark:hover:border-brand-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all';
  return (
    <section className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Height Conversions</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        The full height cluster: both converter directions, the complete chart, and the individual
        height pages.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {HEIGHT_CONVERTERS.filter(c => c.id !== currentId).map(c => (
          <Link key={c.id} href={`/length/${c.id}`} className={linkCls}>
            {c.id.endsWith('-cm-to-feet-inches') && /^\d/.test(c.id)
              ? `${c.title.replace(' in Feet and Inches', '')} = ${fi(parseInt(c.id, 10)).display}`
              : c.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Frequently asked questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group border border-gray-100 dark:border-gray-800 rounded-xl p-4">
            <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-800 dark:text-gray-200 text-sm list-none">
              <span>{faq.q}</span>
              <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

const MISTAKES_TEXT =
  'Three mistakes account for most wrong height conversions. First, treating decimal feet as feet-and-inches: 5.9 ft is 5 ft 10.8 in, not 5 ft 9 in. Second, using 2.5 cm per inch as if it were exact — the true figure is exactly 2.54 cm, and the shortcut drifts by about 1.6%, roughly a centimetre on an adult height. Third, rounding the total inches before splitting them into feet and inches, which can push a borderline result across a whole-inch boundary; round only the final inches figure.';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HeightPage({ params }: { params: Promise<{ heightPage: string }> }) {
  const { heightPage } = await params;
  const category = getCategoryBySlug('length');
  const converter = getConverterBySlug('length', heightPage);
  const kind = kindOf(heightPage);
  if (!category || !converter || !kind || !HEIGHT_CONVERTER_IDS.has(heightPage)) notFound();

  const cm = kind === 'value' ? valueCmOf(heightPage) : null;
  const faqs = faqsFor(kind, cm);
  const schemas = schemasFor(converter, faqs, kind);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Length', href: '/length' },
    { label: converter.title, href: `/length/${converter.id}` },
  ];

  // Related-conversions block (CN-16 pattern): reverse direction + popular
  // unit-pair siblings + blog guides that discuss the neighbouring pairs.
  const reverseId =
    kind === 'feet-inches-to-centimeter' ? 'centimeter-to-feet-inches' : 'feet-inches-to-centimeter';
  const reverseConverter = category.converters.find(c => c.id === reverseId) ?? null;
  const siblingConverters = category.converters
    .filter(c => c.popular && !HEIGHT_CONVERTER_IDS.has(c.id) && c.id !== converter.id)
    .slice(0, 8);
  const guidePosts = blogPosts
    .filter(p =>
      p.relatedConverters?.some(id =>
        ['centimeter-to-inch', 'inch-to-centimeter', 'centimeter-to-foot', 'foot-to-centimeter', 'foot-to-meter', 'meter-to-foot'].includes(id)
      )
    )
    .slice(0, 3)
    .map(p => ({ slug: p.slug, title: p.title }));
  const sidebarRelated = getRelatedConverters('length', heightPage, 8).filter(
    c => !HEIGHT_CONVERTER_IDS.has(c.id)
  );

  const h1 =
    kind === 'value'
      ? `${cm} cm in Feet and Inches`
      : kind === 'chart'
        ? 'Height Chart — CM to Feet & Inches'
        : `${converter.title} Converter`;
  const subtitle =
    kind === 'cm-to-feet-inches'
      ? 'Height converter · Enter centimetres, get feet and inches with fractions — free and instant'
      : kind === 'feet-inches-to-centimeter'
        ? 'Height converter · Enter feet and inches, get the exact centimetres — free and instant'
        : kind === 'chart'
          ? 'Height reference chart · Every centimetre from 140 to 210 cm in feet and inches'
          : `Height conversion · ${cm} cm converted to feet and inches, with formula and chart`;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container-lg py-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      <div className="container-lg py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{h1}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span aria-hidden="true">📏</span> {subtitle}
              </p>
            </div>

            {(kind === 'cm-to-feet-inches' || kind === 'value') && (
              <Suspense fallback={<div className="converter-card h-64 animate-pulse" />}>
                <HeightEngine mode="cm" defaultCm={cm ?? 175} />
              </Suspense>
            )}
            {kind === 'feet-inches-to-centimeter' && (
              <Suspense fallback={<div className="converter-card h-64 animate-pulse" />}>
                <HeightEngine mode="ftin" />
              </Suspense>
            )}

            <ContextualProductWidget categorySlug="length" />

            {/* ─── Answer / formula / detail per page kind ─────────── */}
            {kind === 'cm-to-feet-inches' && <CmToFeetInchesBody />}
            {kind === 'feet-inches-to-centimeter' && <FeetInchesToCmBody />}
            {kind === 'chart' && <ChartBody />}
            {kind === 'value' && cm !== null && <ValueBody cm={cm} />}

            <FaqSection faqs={faqs} />

            <HeightCrossLinks currentId={converter.id} />

            <RelatedConversions
              converter={converter}
              category={category}
              reverse={reverseConverter}
              siblings={siblingConverters}
              guides={guidePosts}
            />
          </div>

          <aside className="hidden lg:block mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-5">
              {sidebarRelated.length > 0 && (
                <div className="card p-5">
                  <RelatedConverters converters={sidebarRelated} category={category} />
                </div>
              )}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Height Pages</h3>
                <ul className="space-y-1">
                  {HEIGHT_CONVERTERS.map(c => (
                    <li key={c.id}>
                      <Link
                        href={`/length/${c.id}`}
                        className={`block px-2 py-1.5 rounded-lg text-sm transition-colors ${
                          c.id === converter.id
                            ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-500'
                        }`}
                      >
                        {c.title}
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

// ─── Per-kind bodies ──────────────────────────────────────────────────────────

function CmToFeetInchesBody() {
  const ex = fi(175);
  const rows = [140, 150, 160, 165, 170, 175, 180, 185, 190, 200, 210];
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Example: 175 cm in feet and inches
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">175 cm = {ex.display}</strong> — written{' '}
          {ex.symbolDisplay}, or {ex.fractionDisplay} to the nearest eighth of an inch. The converter
          above runs the same calculation for any height you enter.
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          How to convert cm to feet and inches
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Height needs two steps, because the answer is a compound measure. First divide the
          centimetres by 2.54 to get the total inches — 1 inch is exactly 2.54 cm by international
          definition. Then divide the inches by 12: the whole number is the feet, and the remainder
          is the inches. Worked in full: 175 ÷ 2.54 = {cmToTotalInches(175)} inches in total, and{' '}
          {cmToTotalInches(175)} ÷ 12 = 5 with {formatNumber(ex.inches, 6)} left over, so 175 cm ={' '}
          {ex.display}. Results here are rounded to one decimal place on the inches (the{' '}
          {ex.fractionDisplay} figure is the same height rounded to the nearest eighth), which is
          how heights are conventionally quoted.
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Common heights in feet and inches
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          A quick reference for the heights people look up most. The{' '}
          <Link href="/length/height-chart" className="text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500">
            full height chart
          </Link>{' '}
          covers every centimetre from 140 to 210 cm.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Centimeters (cm)</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Feet &amp; inches</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">As a fraction</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(cm => {
                const r = fi(cm);
                return (
                  <tr key={cm} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      {HEIGHT_VALUES.includes(cm) ? (
                        <Link href={`/length/${cm}-cm-to-feet-inches`} className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-500">
                          {cm} cm
                        </Link>
                      ) : (
                        `${cm} cm`
                      )}
                    </td>
                    <td className="px-4 py-2 font-semibold text-brand-600 dark:text-brand-400">{r.display}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{r.fractionDisplay}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Common mistakes when converting height
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{MISTAKES_TEXT}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
          If you only need decimal feet rather than feet-and-inches, the{' '}
          <Link href="/length/centimeter-to-foot" className="text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500">
            Centimeter to Foot converter
          </Link>{' '}
          gives that form directly.
        </p>
      </section>
    </div>
  );
}

function FeetInchesToCmBody() {
  const rows: [number, number][] = [
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11],
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6],
  ];
  const ex = formatNumber(feetInchesToCm(5, 9), 6);
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Example: 5 ft 9 in in cm</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">5 ft 9 in = {ex} cm.</strong> The
          converter above runs the same calculation for any height — enter the feet and the inches
          separately.
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          How to convert feet and inches to cm
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Convert the whole height to inches first: feet × 12 + inches. Then multiply by 2.54,
          because 1 inch is exactly 2.54 cm by international definition. Worked in full: 5 ft 9 in
          is (5 × 12 + 9) = 69 inches, and 69 × 2.54 = {ex} cm. One thing to watch: the inches part
          of a height is always below 12 — a figure like 5 ft 12 in is really 6 ft 0 in (
          {formatNumber(feetInchesToCm(6, 0), 6)} cm).
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Feet and inches to cm — quick table
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Feet &amp; inches</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Centimeters (cm)</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Centimetres page</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([f, i]) => {
                const cmVal = feetInchesToCm(f, i);
                const nearest = Math.round(cmVal);
                return (
                  <tr key={`${f}-${i}`} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{f} ft {i} in</td>
                    <td className="px-4 py-2 font-semibold text-brand-600 dark:text-brand-400">
                      {formatNumber(cmVal, 6)} cm
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      {HEIGHT_VALUES.includes(nearest) ? (
                        <Link href={`/length/${nearest}-cm-to-feet-inches`} className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-500">
                          {nearest} cm in feet and inches
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Common mistakes when converting height
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{MISTAKES_TEXT}</p>
      </section>
    </div>
  );
}

function ChartBody() {
  const cms: number[] = [];
  for (let cm = HEIGHT_CHART_MIN; cm <= HEIGHT_CHART_MAX; cm++) cms.push(cm);
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Height chart: 140–210 cm in feet and inches
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          Every centimetre from 140 to 210 cm, converted with the exact definition of the inch
          (1 in = 2.54 cm). Inches are shown to one decimal place and rounded to the nearest eighth
          as a fraction. Highlighted rows are the heights with their own conversion pages. Need a
          value between rows or a decimal input? Use the{' '}
          <Link href="/length/centimeter-to-feet-inches" className="text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500">
            CM to Feet and Inches converter
          </Link>
          .
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Centimeters (cm)</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Feet &amp; inches</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Symbol form</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Nearest ⅛ in</th>
              </tr>
            </thead>
            <tbody>
              {cms.map(cm => {
                const r = fi(cm);
                const highlighted = HEIGHT_VALUES.includes(cm);
                return (
                  <tr
                    key={cm}
                    className={`border-t border-gray-100 dark:border-gray-800 ${highlighted ? 'bg-brand-50/60 dark:bg-brand-950/30 font-medium' : ''}`}
                  >
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      {highlighted ? (
                        <Link href={`/length/${cm}-cm-to-feet-inches`} className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-500">
                          {cm} cm
                        </Link>
                      ) : (
                        `${cm} cm`
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{r.display}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{r.symbolDisplay}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{r.fractionDisplay}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How this chart is calculated</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Each row divides the centimetres by 2.54 to get total inches, then splits the inches into
          feet (groups of 12) and the remaining inches — the same calculation the converter runs,
          with 1 inch defined as exactly 2.54 cm and 1 foot as exactly 12 inches (30.48 cm). The
          fraction column rounds the inches remainder to the nearest eighth of an inch, the
          precision used on tape measures and in woodworking.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
          Converting the other way? The{' '}
          <Link href="/length/feet-inches-to-centimeter" className="text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500">
            Feet &amp; Inches to Centimeter converter
          </Link>{' '}
          turns a stated height like 5 ft 9 in into centimetres. For decimal feet instead of
          feet-and-inches, see the{' '}
          <Link href="/length/centimeter-to-foot" className="text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500">
            Centimeter to Foot converter
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

function ValueBody({ cm }: { cm: number }) {
  const r = fi(cm);
  const rows: number[] = [];
  for (let v = cm - 5; v <= cm + 5; v++) rows.push(v);
  const decFeet = formatNumber(convertLength(cm, 'centimeter', 'foot').value, 6);
  const otherValues = HEIGHT_VALUES.filter(v => v !== cm);
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {cm} cm in feet and inches — the answer
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">
            {cm} cm = {r.display}
          </strong>{' '}
          — also written {r.symbolDisplay}. Rounded to the nearest eighth of an inch it is{' '}
          {r.fractionDisplay}. In total that is {cmToTotalInches(cm)} inches, and in decimal feet it
          is {decFeet} ft (note that decimal feet are not the same notation as feet-and-inches).
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          How {cm} cm converts, step by step
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Divide by 2.54 to get total inches, because 1 inch is exactly 2.54 cm: {cm} ÷ 2.54 ={' '}
          {cmToTotalInches(cm)} inches. Then split the inches into feet and inches by dividing by
          12: the whole number is the feet ({r.feet}) and the remainder is the inches (
          {formatNumber(r.inches, 6)}). So {cm} cm = {r.display}. The converter at the top of this
          page is preset to {cm} cm — change the value to convert any other height.
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Heights around {cm} cm ({cm - 5}–{cm + 5} cm)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Centimeters (cm)</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Feet &amp; inches</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Nearest ⅛ in</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(v => {
                const row = fi(v);
                const isCurrent = v === cm;
                return (
                  <tr
                    key={v}
                    className={`border-t border-gray-100 dark:border-gray-800 ${isCurrent ? 'bg-brand-50/60 dark:bg-brand-950/30 font-semibold' : ''}`}
                  >
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{v} cm</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{row.display}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{row.fractionDisplay}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
          For the full range, see the{' '}
          <Link href="/length/height-chart" className="text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500">
            height chart (140–210 cm)
          </Link>
          . Other height pages:{' '}
          {otherValues.map((v, i) => (
            <span key={v}>
              {i > 0 && ', '}
              <Link href={`/length/${v}-cm-to-feet-inches`} className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-500">
                {v} cm
              </Link>
            </span>
          ))}
          .
        </p>
      </section>
    </div>
  );
}
