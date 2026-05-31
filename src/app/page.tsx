import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES, getPopularConverters } from '@/lib/converters';
import { buildMetadata, buildWebsiteSchema } from '@/lib/seo';
import { CATEGORY_COLORS } from '@/lib/utils';
import HeroSearch from '@/components/home/HeroSearch';
import AdUnit from '@/components/ads/AdUnit';

export const metadata: Metadata = buildMetadata({
  title: 'Convertly — Free Online Unit Converter | 500+ Conversions',
  description: 'Free, fast online unit converter. Convert length, weight, temperature, currency, area, volume, speed, time, and 500+ units instantly. No signup required.',
  path: '/',
  keywords: [
    'unit converter', 'online converter', 'free converter', 'unit conversion',
    'measurement converter', 'length converter', 'weight converter',
    'temperature converter', 'currency converter', 'area converter',
  ],
});

export default function HomePage() {
  const popularConverters = getPopularConverters(12);
  const websiteSchema = buildWebsiteSchema();

  const faqs = [
    {
      q: 'How do I convert units online?',
      a: 'Simply select a category (length, weight, temperature, etc.), choose your units, enter a value, and get the result instantly. No signup required.',
    },
    {
      q: 'Are the conversions accurate?',
      a: 'Yes. All conversions use standard, internationally-recognized formulas and constants for maximum accuracy.',
    },
    {
      q: 'Does Convertly work offline?',
      a: 'Yes! Convertly is a Progressive Web App (PWA). Once loaded, most converters work offline. Install it from your browser for the best experience.',
    },
    {
      q: 'How many unit conversions are supported?',
      a: 'Convertly supports 500+ unit conversions across 13 categories including length, weight, temperature, currency, area, volume, speed, time, digital storage, and more.',
    },
    {
      q: 'Are live exchange rates used for currency conversion?',
      a: 'Yes, currency conversions use real-time exchange rates updated regularly via a live API. A fallback to cached rates is used if the API is unavailable.',
    },
  ];

  return (
    <>
      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 dark:from-brand-900 dark:via-brand-800 dark:to-gray-900">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" aria-hidden="true" />

        <div className="container-md relative z-10 py-16 lg:py-24 text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold mb-5 border border-white/20">
              ⚡ 500+ unit conversions · Free forever
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight leading-tight">
              The Fastest Free<br />
              <span className="text-yellow-300">Unit Converter</span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              Instantly convert length, weight, temperature, currency, and 500+ units.
              No signup. No ads that break your flow. Just results.
            </p>
          </div>

          {/* Hero search */}
          <HeroSearch />

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-in stagger-3">
            {CATEGORIES.slice(0, 7).map(cat => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-medium border border-white/20 transition-all"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Header ad ─────────────────────────────────────────────────────── */}
      <div className="container-lg py-4 flex justify-center">
        <AdUnit slot="header" label />
      </div>

      <div className="container-lg">
        {/* ─── Popular Converters ──────────────────────────────────────────── */}
        <section className="section">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Converters</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Most-used conversions today</p>
            </div>
            <Link href="/" className="text-brand-500 hover:text-brand-600 text-sm font-semibold">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularConverters.map((conv, i) => (
              <Link
                key={conv.id}
                href={`/${conv.category}/${conv.id}`}
                className="card p-4 hover:scale-[1.02] transition-transform group"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{conv.categoryIcon}</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                    {conv.categoryName}
                  </span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-500 transition-colors">
                  {conv.title}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── In-content ad ───────────────────────────────────────────────── */}
        <div className="flex justify-center mb-12">
          <AdUnit slot="in-content" label />
        </div>

        {/* ─── Categories Grid ─────────────────────────────────────────────── */}
        <section className="section">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Categories</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {CATEGORIES.length} categories · 500+ conversions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => {
              const colors = CATEGORY_COLORS[cat.color] || CATEGORY_COLORS.blue;
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="card p-5 text-center hover:scale-[1.02] transition-transform group"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className={`w-12 h-12 rounded-2xl ${colors.light} flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    {cat.icon}
                  </div>
                  <h3 className={`font-semibold text-sm text-gray-900 dark:text-white group-hover:${colors.text} transition-colors`}>
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {cat.units.length} units
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ─── SEO content block ───────────────────────────────────────────── */}
        <section className="section border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              The Most Accurate Free Unit Converter
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-3 text-gray-600 dark:text-gray-400">
              <p>
                Convertly is a free, fast, and accurate online unit converter supporting 500+ unit conversions
                across 13 categories. Whether you need to convert <Link href="/length/kilometer-to-mile" className="text-brand-500 hover:underline">kilometers to miles</Link>,{' '}
                <Link href="/weight/kilogram-to-pound" className="text-brand-500 hover:underline">kilograms to pounds</Link>, or{' '}
                <Link href="/temperature/celsius-to-fahrenheit" className="text-brand-500 hover:underline">Celsius to Fahrenheit</Link>,
                we provide instant results with the formula shown.
              </p>
              <p>
                Our <Link href="/currency" className="text-brand-500 hover:underline">currency converter</Link> uses
                live exchange rates, while all other converters use precise scientific constants for maximum accuracy.
                Every converter includes bidirectional conversion, a swap button, and a reference table.
              </p>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="section border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map(faq => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
              }),
            }}
          />
          <div className="max-w-3xl space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="card p-5 group" open={i === 0}>
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 dark:text-white list-none">
                  <span>{faq.q}</span>
                  <ChevronIcon className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
