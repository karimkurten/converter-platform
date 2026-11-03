import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import type { Converter, ConverterCategory } from '@/types';
import {
  getCategoryBySlug,
  getConverterBySlug,
  getRelatedConverters,
  HEIGHT_CONVERTER_IDS,
  COOKING_CONVERTER_IDS,
  SPECIAL_PAGE_IDS,
} from '@/lib/converters';
import {
  getValuePageDef,
  getChartPageDef,
  VALUE_PAGE_DEFS,
  CHART_PAGE_DEFS,
  convertSpecial,
  specialResultText,
  specialUnit,
  surroundingRows,
  chartRows,
  chartContext,
  chartDefForPair,
  type ValuePageDef,
  type ChartPageDef,
} from '@/lib/valuePages';
import { blogPosts } from '@/lib/blog';
import { formatNumber } from '@/lib/utils';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ConverterEngine from '@/components/converter/ConverterEngine';
import {
  RelatedConverters,
  RelatedConversions,
  FormulaBlock,
} from '@/components/converter/ConverterWidgets';
import ContextualProductWidget from '@/components/affiliate/ContextualProductWidget';
import PrintButton from '@/components/converter/PrintButton';

/**
 * Specific-value + chart page views (Batch H), following the Batch F
 * height-page layout. The pages are registered in their pair's category
 * (VALUE_PAGE_CONVERTERS / CHART_PAGE_CONVERTERS in src/lib/converters) so
 * the sitemap, hub ItemList and search index include them, but they are
 * rendered by dedicated routes because a single-value answer page — or a
 * full printable chart — is not a unit-to-unit pair page. Every figure is
 * computed at render time via src/lib/valuePages from the real conversion
 * functions.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.convertnow.ca';

interface Faq {
  q: string;
  a: string;
}

function plural(name: string): string {
  if (name === 'Inch') return 'Inches';
  if (name === 'Foot') return 'Feet';
  return `${name}s`;
}

function excludedFromRelated(id: string): boolean {
  return SPECIAL_PAGE_IDS.has(id) || HEIGHT_CONVERTER_IDS.has(id) || COOKING_CONVERTER_IDS.has(id);
}

function pairConverter(category: ConverterCategory, from: string, to: string): Converter | null {
  return category.converters.find(c => c.id === `${from}-to-${to}`) ?? null;
}

function relatedSiblings(category: ConverterCategory, pair: Converter | null, reverse: Converter | null): Converter[] {
  return category.converters
    .filter(c => c.popular && !excludedFromRelated(c.id) && c.id !== pair?.id && c.id !== reverse?.id)
    .slice(0, 6);
}

function guidePostsFor(pairId: string) {
  return blogPosts
    .filter(p => p.relatedConverters?.includes(pairId))
    .slice(0, 3)
    .map(p => ({ slug: p.slug, title: p.title }));
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

function schemasFor(
  converter: Converter,
  category: ConverterCategory,
  faqs: Faq[],
  howTo: { name: string; steps: string[] } | null
): object[] {
  const url = `${SITE_URL}/${category.slug}/${converter.id}`;
  const out: object[] = [
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
          { '@type': 'ListItem', position: 2, name: category.name, item: `${SITE_URL}/${category.slug}` },
          { '@type': 'ListItem', position: 3, name: converter.title, item: url },
        ],
      },
    },
  ];
  if (howTo) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howTo.name,
      description: converter.description,
      totalTime: 'PT0M',
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
      step: howTo.steps.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: `Step ${i + 1}`,
        text,
      })),
    });
  }
  out.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });
  return out;
}

function SchemaScripts({ schemas }: { schemas: object[] }) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

// ─── Shared UI pieces ─────────────────────────────────────────────────────────

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

const LINK_CLS =
  'px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950 border border-transparent hover:border-brand-100 dark:hover:border-brand-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all';

function ClusterCard({ category, currentId }: { category: ConverterCategory; currentId: string }) {
  const items = [
    ...VALUE_PAGE_DEFS.filter(d => d.category === category.slug),
    ...CHART_PAGE_DEFS.filter(d => d.category === category.slug),
  ];
  if (items.length === 0) return null;
  const titleOf = (id: string) => getConverterBySlug(category.slug, id)?.title ?? id;
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
        {category.name} Values &amp; Charts
      </h3>
      <ul className="space-y-1">
        {items.map(d => (
          <li key={d.id}>
            <Link
              href={`/${category.slug}/${d.id}`}
              className={`block px-2 py-1.5 rounded-lg text-sm transition-colors ${
                d.id === currentId
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-500'
              }`}
            >
              {titleOf(d.id)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Sidebar({ category, currentId }: { category: ConverterCategory; currentId: string }) {
  const sidebarRelated = getRelatedConverters(category.slug, currentId, 8).filter(
    c => !excludedFromRelated(c.id)
  );
  return (
    <aside className="hidden lg:block mt-8 lg:mt-0 print:hidden">
      <div className="sticky top-24 space-y-5">
        {sidebarRelated.length > 0 && (
          <div className="card p-5">
            <RelatedConverters converters={sidebarRelated} category={category} />
          </div>
        )}
        <ClusterCard category={category} currentId={currentId} />
      </div>
    </aside>
  );
}

function BreadcrumbBand({ category, converter }: { category: ConverterCategory; converter: Converter }) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category.name, href: `/${category.slug}` },
    { label: converter.title, href: `/${category.slug}/${converter.id}` },
  ];
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 print:hidden">
      <div className="container-lg py-4">
        <Breadcrumb items={breadcrumbs} />
      </div>
    </div>
  );
}

// ─── Formula + FAQ builders (value pages) ─────────────────────────────────────

function formulaFor(def: ValuePageDef): string {
  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  if (def.pairId === 'celsius-to-fahrenheit') {
    return def.from === 'celsius' ? '°F = °C × 9/5 + 32' : '°C = (°F − 32) × 5/9';
  }
  const factor = convertSpecial(def.category, 1, def.from, def.to).value;
  return `${toU.name} = ${fromU.name} × ${formatNumber(factor, 6)}`;
}

function workedExample(def: ValuePageDef): string {
  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  const result = specialResultText(def.category, def.value, def.from, def.to);
  if (def.pairId === 'celsius-to-fahrenheit') {
    return def.from === 'celsius'
      ? `${def.value} × 9/5 + 32 = ${result} — so ${def.value} ${fromU.symbol} is ${result} ${toU.symbol}.`
      : `(${def.value} − 32) × 5/9 = ${result} — so ${def.value} ${fromU.symbol} is ${result} ${toU.symbol}.`;
  }
  const factor = convertSpecial(def.category, 1, def.from, def.to).value;
  return `${def.value} × ${formatNumber(factor, 6)} = ${result} — so ${def.value} ${fromU.symbol} is ${result} ${toU.symbol}.`;
}

function howToSteps(def: ValuePageDef): string[] {
  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  const result = specialResultText(def.category, def.value, def.from, def.to);
  if (def.pairId === 'celsius-to-fahrenheit') {
    return def.from === 'celsius'
      ? [
          `Start with the temperature in Celsius: ${def.value} °C.`,
          'Multiply by 9/5 (equivalently, multiply by 1.8).',
          'Add 32.',
          `The result is ${result} °F.`,
        ]
      : [
          `Start with the temperature in Fahrenheit: ${def.value} °F.`,
          'Subtract 32.',
          'Multiply by 5/9.',
          `The result is ${result} °C.`,
        ];
  }
  const factor = convertSpecial(def.category, 1, def.from, def.to).value;
  return [
    `Start with the amount in ${plural(fromU.name).toLowerCase()}: ${def.value} ${fromU.symbol}.`,
    `Multiply by ${formatNumber(factor, 6)} — one ${fromU.name.toLowerCase()} is ${formatNumber(factor, 6)} ${plural(toU.name).toLowerCase()}.`,
    `The result is ${result} ${toU.symbol}.`,
  ];
}

function thirdFaq(def: ValuePageDef, result: string): Faq {
  const v = def.value;
  switch (def.pairId) {
    case 'kilogram-to-pound':
      return {
        q: 'How can I estimate kilograms to pounds in my head?',
        a: `Multiply by 2.2 — about 0.2% under the exact factor of 2.20462. For ${v} kg that gives ${formatNumber(v * 2.2, 6)} lb against the exact ${result} lb: fine for luggage and body weight, not for freight or dosing.`,
      };
    case 'pound-to-kilogram':
      return {
        q: 'How can I estimate pounds to kilograms in my head?',
        a: `Divide by 2.2 — about 0.2% over the exact result. For ${v} lb that gives ${formatNumber(v / 2.2, 6)} kg against the exact ${result} kg.`,
      };
    case 'centimeter-to-inch':
      return {
        q: 'How can I estimate centimetres to inches in my head?',
        a: `Divide by 2.5 — about 1.6% over the exact result (one inch is exactly 2.54 cm). For ${v} cm that gives ${formatNumber(v / 2.5, 6)} in against the exact ${result} in.`,
      };
    case 'inch-to-centimeter':
      return {
        q: 'How can I estimate inches to centimetres in my head?',
        a: `Multiply by 2.5 — about 1.6% under the exact 2.54. For ${v} in that gives ${formatNumber(v * 2.5, 6)} cm against the exact ${result} cm.`,
      };
    case 'kilometer-to-mile':
      return {
        q: 'How can I estimate kilometres to miles in my head?',
        a: `Multiply by 0.6 — about 3.4% under the exact factor of 0.621371. For ${v} km that gives ${formatNumber(v * 0.6, 6)} mi against the exact ${result} mi: close enough for road signs and race distances.`,
      };
    case 'mile-to-kilometer':
      return {
        q: 'How can I estimate miles to kilometres in my head?',
        a: `Multiply by 1.6 — about 0.6% under the exact factor of 1.60934. For ${v} mi that gives ${formatNumber(v * 1.6, 6)} km against the exact ${result} km.`,
      };
    case 'celsius-to-fahrenheit':
      return {
        q: `What is ${v} °C in Kelvin?`,
        a: `${v} °C is ${formatNumber(v + 273.15, 6)} K — add 273.15 to any Celsius temperature to get Kelvin, the SI base unit of temperature used in science and engineering.`,
      };
    case 'fahrenheit-to-celsius':
      return {
        q: `What is ${v} °F in Kelvin?`,
        a: `${v} °F is ${formatNumber((v - 32) * (5 / 9) + 273.15, 6)} K. Convert to Celsius first — (${v} − 32) × 5/9 = ${result} °C — then add 273.15.`,
      };
    default:
      return {
        q: `Is ${result} the exact answer?`,
        a: `Yes — it is computed from the exact conversion factor and shown to six significant figures; nothing on this page is copied from a rounded chart.`,
      };
  }
}

function valueFaqs(def: ValuePageDef): Faq[] {
  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  const result = specialResultText(def.category, def.value, def.from, def.to);
  const isTemp = def.category === 'temperature';
  const faqs: Faq[] = [
    {
      q: isTemp
        ? `How much is ${def.value} ${fromU.symbol} in ${toU.name}?`
        : `How much is ${def.value} ${plural(fromU.name).toLowerCase()} in ${plural(toU.name).toLowerCase()}?`,
      a: `${def.value} ${fromU.symbol} is exactly ${result} ${toU.symbol}. The figure is computed with the exact conversion formula, not rounded from a chart: ${workedExample(def)}`,
    },
    {
      q: isTemp
        ? `What is the formula to convert ${fromU.name} to ${toU.name}?`
        : `What is the formula to convert ${plural(fromU.name).toLowerCase()} to ${plural(toU.name).toLowerCase()}?`,
      a: isTemp
        ? `${formulaFor(def)}. The two scales meet at −40, the one temperature that reads the same number in both Celsius and Fahrenheit.`
        : `${formulaFor(def)} — so multiply any ${fromU.symbol} figure by ${formatNumber(convertSpecial(def.category, 1, def.from, def.to).value, 6)}. To go the other way, divide by the same factor.`,
    },
    thirdFaq(def, result),
    {
      q: isTemp
        ? `Where can I convert a different temperature?`
        : `Where can I convert a different amount of ${plural(fromU.name).toLowerCase()}?`,
      a: `Use the ${fromU.name} to ${toU.name} converter on this page for any value, or open the printable ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} chart to look up the whole range at a glance.`,
    },
  ];
  return faqs;
}

// ─── Specific-value page view ─────────────────────────────────────────────────

export function SpecificValuePageView({
  categorySlug,
  pageId,
}: {
  categorySlug: string;
  pageId: string;
}) {
  const def = getValuePageDef(pageId);
  const category = getCategoryBySlug(categorySlug);
  const converter = category ? getConverterBySlug(categorySlug, pageId) : undefined;
  if (!def || !category || !converter || def.category !== categorySlug) notFound();

  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  const result = specialResultText(def.category, def.value, def.from, def.to);
  const pair = pairConverter(category, def.from, def.to);
  const reversePair = pairConverter(category, def.to, def.from);
  const chart = chartDefForPair(def.from, def.to);
  const chartConverter = chart ? getConverterBySlug(categorySlug, chart.id) : undefined;
  const faqs = valueFaqs(def);
  const schemas = schemasFor(converter, category, faqs, {
    name:
      def.category === 'temperature'
        ? `How to convert ${def.value} ${fromU.symbol} to ${toU.symbol}`
        : `How to convert ${def.value} ${plural(fromU.name).toLowerCase()} to ${plural(toU.name).toLowerCase()}`,
    steps: howToSteps(def),
  });
  const table = surroundingRows(def);
  const siblingDefs = VALUE_PAGE_DEFS.filter(d => d.pairId === def.pairId && d.id !== def.id);
  const defByValue = new Map(
    VALUE_PAGE_DEFS.filter(d => d.pairId === def.pairId).map(d => [d.value, d])
  );
  const crossLinks: { href: string; label: string }[] = [];
  if (pair) {
    crossLinks.push({
      href: `/${categorySlug}/${pair.id}`,
      label: `${fromU.name} to ${toU.name} Converter — any value`,
    });
  }
  if (chartConverter && chart) {
    crossLinks.push({
      href: `/${categorySlug}/${chart.id}`,
      label: `${fromU.name} to ${toU.name} Chart — printable table`,
    });
  }
  if (reversePair) {
    crossLinks.push({
      href: `/${categorySlug}/${reversePair.id}`,
      label: `${toU.name} to ${fromU.name} Converter — reverse`,
    });
  }
  for (const d of siblingDefs) {
    crossLinks.push({
      href: `/${categorySlug}/${d.id}`,
      label: `${d.value} ${fromU.symbol} to ${toU.symbol} — exact conversion`,
    });
  }
  const extraLinks = crossLinks.slice(0, 5);

  return (
    <>
      <SchemaScripts schemas={schemas} />
      <BreadcrumbBand category={category} converter={converter} />

      <div className="container-lg py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {converter.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span aria-hidden="true">{category.icon}</span> {category.name} conversion · The exact
                answer, the formula, nearby values, and the full chart
              </p>
            </div>

            {/* Answer card */}
            <section className="card p-6">
              <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                {def.value} {fromU.symbol} = {result} {toU.symbol}
              </p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {def.category === 'temperature' ? (
                  <>
                    {def.value} {fromU.symbol} is exactly {result} {toU.symbol}. The working is
                    shown below — every figure on this page is computed with the exact conversion
                    formula, not copied from a rounded chart.
                  </>
                ) : (
                  <>
                    {def.value} {plural(fromU.name).toLowerCase()} is exactly {result}{' '}
                    {plural(toU.name).toLowerCase()}. The working is shown below — every figure on
                    this page is computed with the exact conversion factor, not copied from a
                    rounded chart.
                  </>
                )}
              </p>
            </section>

            <FormulaBlock formula={formulaFor(def)} description={workedExample(def)} />

            {pair && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Convert a different amount
                </h2>
                <Suspense fallback={<div className="converter-card h-64 animate-pulse" />}>
                  <ConverterEngine converter={pair} category={category} />
                </Suspense>
              </section>
            )}

            <ContextualProductWidget categorySlug={categorySlug} />

            {/* Nearby values */}
            <section className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {fromU.name} to {toU.name} near {def.value} {fromU.symbol}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400">
                      <th className="py-2 pr-4 font-semibold">
                        {fromU.name} ({fromU.symbol})
                      </th>
                      <th className="py-2 font-semibold">
                        {toU.name} ({toU.symbol})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map(row => {
                      const rowDef = defByValue.get(row.value);
                      const isCurrent = row.value === def.value;
                      return (
                        <tr
                          key={row.value}
                          className={`border-t border-gray-100 dark:border-gray-800 ${
                            isCurrent ? 'bg-brand-50 dark:bg-brand-950 font-semibold' : ''
                          }`}
                        >
                          <td className="py-2 pr-4 text-gray-900 dark:text-white">
                            {rowDef && !isCurrent ? (
                              <Link
                                href={`/${categorySlug}/${rowDef.id}`}
                                className="text-brand-600 dark:text-brand-400 hover:underline"
                              >
                                {row.value} {fromU.symbol}
                              </Link>
                            ) : (
                              <>
                                {row.value} {fromU.symbol}
                                {isCurrent && (
                                  <span className="ml-2 text-xs text-brand-600 dark:text-brand-400">
                                    this page
                                  </span>
                                )}
                              </>
                            )}
                          </td>
                          <td className="py-2 text-gray-600 dark:text-gray-400">
                            {row.result} {toU.symbol}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Cross-links */}
            <section className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                More {fromU.name} to {toU.name} conversions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {crossLinks.map(l => (
                  <Link key={l.href} href={l.href} className={LINK_CLS}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </section>

            <FaqSection faqs={faqs} />

            {pair && (
              <RelatedConversions
                converter={pair}
                category={category}
                reverse={reversePair}
                siblings={relatedSiblings(category, pair, reversePair)}
                guides={guidePostsFor(def.pairId)}
                extraLinks={extraLinks}
              />
            )}
          </div>

          <Sidebar category={category} currentId={converter.id} />
        </div>
      </div>
    </>
  );
}

// ─── Chart page view ──────────────────────────────────────────────────────────

function chartFaqs(def: ChartPageDef, rowCount: number): Faq[] {
  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  const isTemp = def.pairId === 'celsius-to-fahrenheit';
  const factor = isTemp ? null : convertSpecial(def.category, 1, def.from, def.to).value;
  const sampleDefs = VALUE_PAGE_DEFS.filter(d => d.pairId === def.pairId && d.from === def.from);
  const sample = sampleDefs.length >= 3 ? sampleDefs[Math.floor(sampleDefs.length / 2)] : null;
  const faqs: Faq[] = [
    {
      q: `How is this ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} chart calculated?`,
      a: isTemp
        ? `Every row uses the exact formula °F = °C × 9/5 + 32 — the same formula the converter uses — so chart values and converter values always agree. The chart has ${rowCount} rows.`
        : `Every row multiplies by the exact factor: 1 ${fromU.name.toLowerCase()} = ${formatNumber(factor as number, 6)} ${plural(toU.name).toLowerCase()} — the same factor the converter uses — so chart values and converter values always agree. The chart has ${rowCount} rows.`,
    },
    {
      q: 'Can I print this chart?',
      a: 'Yes. Use the print button at the top of the page: the site navigation and the extra sections are hidden automatically, leaving the title and the table on the printed page.',
    },
  ];
  if (sample) {
    faqs.push({
      q: `What is ${sample.value} ${fromU.symbol} in ${plural(toU.name).toLowerCase()}?`,
      a: `${sample.value} ${fromU.symbol} is ${specialResultText(sample.category, sample.value, sample.from, sample.to)} ${toU.symbol} — find it in the table above, or open the dedicated ${sample.value} ${fromU.symbol} page for the formula and nearby values.`,
    });
  } else {
    faqs.push({
      q: `How do I convert a value that is not on this chart?`,
      a: `Use the ${fromU.name} to ${toU.name} converter linked on this page — it accepts any value, including decimals and amounts beyond the chart range.`,
    });
  }
  return faqs;
}

export function ChartPageView({
  categorySlug,
  pageId,
}: {
  categorySlug: string;
  pageId: string;
}) {
  const def = getChartPageDef(pageId);
  const category = getCategoryBySlug(categorySlug);
  const converter = category ? getConverterBySlug(categorySlug, pageId) : undefined;
  if (!def || !category || !converter || def.category !== categorySlug) notFound();

  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  const rows = chartRows(def);
  const ctxHeader = rows.length > 0 && chartContext(def, rows[0].value) !== null ? 'Feet + Inches' : null;
  const pair = pairConverter(category, def.from, def.to);
  const reversePair = pairConverter(category, def.to, def.from);
  const faqs = chartFaqs(def, rows.length);
  const schemas = schemasFor(converter, category, faqs, null);
  const valueDefs = VALUE_PAGE_DEFS.filter(d => d.pairId === def.pairId && d.from === def.from);
  const defByValue = new Map(valueDefs.map(d => [d.value, d]));
  const highlight = new Set<number>(def.id === 'celsius-to-fahrenheit-chart' ? [0, 37, 100] : []);
  const chunkSize = Math.ceil(rows.length / 3);
  const chunks = [rows.slice(0, chunkSize), rows.slice(chunkSize, chunkSize * 2), rows.slice(chunkSize * 2)];

  const crossLinks: { href: string; label: string }[] = [];
  if (pair) {
    crossLinks.push({
      href: `/${categorySlug}/${pair.id}`,
      label: `${fromU.name} to ${toU.name} Converter — any value`,
    });
  }
  if (reversePair) {
    crossLinks.push({
      href: `/${categorySlug}/${reversePair.id}`,
      label: `${toU.name} to ${fromU.name} Converter — reverse`,
    });
  }
  for (const d of valueDefs) {
    crossLinks.push({
      href: `/${categorySlug}/${d.id}`,
      label: `${d.value} ${fromU.symbol} to ${toU.symbol} — exact conversion`,
    });
  }
  // Other charts in other categories, for cross-cluster discovery.
  for (const other of CHART_PAGE_DEFS) {
    if (other.id === def.id) continue;
    const oc = getConverterBySlug(other.category, other.id);
    if (oc) {
      crossLinks.push({ href: `/${other.category}/${other.id}`, label: `${oc.title} — printable table` });
    }
  }

  return (
    <>
      <style>{`@media print { body:has(.cn-chart-print) header, body:has(.cn-chart-print) footer { display: none !important; } }`}</style>
      <SchemaScripts schemas={schemas} />
      <BreadcrumbBand category={category} converter={converter} />

      <div className="cn-chart-print container-lg py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {converter.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 print:hidden">
                <span aria-hidden="true">{category.icon}</span> {category.name} conversion chart ·{' '}
                {rows.length} values, computed with the exact formula — print it, pin it, keep it
              </p>
              <div className="mt-4 print:hidden">
                <PrintButton />
              </div>
            </div>

            {/* The chart itself — the only block that prints besides the H1. */}
            <section className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {fromU.name} to {toU.name} conversion table
              </h2>
              <div className="grid gap-x-8 md:grid-cols-3">
                {chunks.map((chunk, ci) => (
                  <table key={ci} className="w-full text-sm self-start">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400">
                        <th className="py-1.5 pr-3 font-semibold">
                          {fromU.symbol}
                        </th>
                        <th className="py-1.5 font-semibold">{toU.symbol}</th>
                        {ctxHeader && <th className="py-1.5 pl-3 font-semibold">{ctxHeader}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {chunk.map(row => {
                        const rowDef = defByValue.get(row.value);
                        const isHighlight = highlight.has(row.value);
                        return (
                          <tr key={row.value} className="border-t border-gray-100 dark:border-gray-800">
                            <td className="py-1.5 pr-3 font-medium text-gray-900 dark:text-white">
                              {rowDef ? (
                                <Link
                                  href={`/${categorySlug}/${rowDef.id}`}
                                  className="text-brand-600 dark:text-brand-400 hover:underline print:text-gray-900"
                                >
                                  {row.value}
                                </Link>
                              ) : (
                                row.value
                              )}
                            </td>
                            <td
                              className={`py-1.5 text-gray-600 dark:text-gray-400 ${
                                isHighlight ? 'font-semibold text-gray-900 dark:text-white' : ''
                              }`}
                            >
                              {row.result}
                            </td>
                            {ctxHeader && (
                              <td className="py-1.5 pl-3 text-gray-500 dark:text-gray-400">{chartContext(def, row.value)}</td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                {def.pairId === 'celsius-to-fahrenheit'
                  ? 'Formula: °F = °C × 9/5 + 32. Values computed exactly; the scales meet at −40.'
                  : `Formula: ${toU.name} = ${fromU.name} × ${formatNumber(convertSpecial(def.category, 1, def.from, def.to).value, 6)}. Values computed exactly, shown to six significant figures.`}{' '}
                Chart from ConvertNow.ca — free online unit converters.
              </p>
            </section>

            <section className="card p-6 print:hidden">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                How to use this chart
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Find your value in the {fromU.name} ({fromU.symbol}) column and read across to the{' '}
                {toU.name} ({toU.symbol}) result. Every row is computed with the exact conversion
                formula — the same one the {fromU.name.toLowerCase()} to {toU.name.toLowerCase()}{' '}
                converter uses — so the chart and the converter never disagree. For a value between
                rows, or beyond the chart range, use the converter for the exact figure.
              </p>
            </section>

            <div className="print:hidden">
              <ContextualProductWidget categorySlug={categorySlug} />
            </div>

            <section className="card p-6 print:hidden">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Converters and popular values
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {crossLinks.map(l => (
                  <Link key={l.href} href={l.href} className={LINK_CLS}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </section>

            <div className="print:hidden">
              <FaqSection faqs={faqs} />
            </div>

            {pair && (
              <div className="print:hidden">
                <RelatedConversions
                  converter={pair}
                  category={category}
                  reverse={reversePair}
                  siblings={relatedSiblings(category, pair, reversePair)}
                  guides={guidePostsFor(def.pairId)}
                  extraLinks={crossLinks.slice(0, 5)}
                />
              </div>
            )}
          </div>

          <Sidebar category={category} currentId={converter.id} />
        </div>
      </div>
    </>
  );
}
