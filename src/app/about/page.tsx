import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CATEGORIES } from '@/lib/converters';

export const metadata: Metadata = buildMetadata({
  title: 'About ConvertNow — Free Online Unit Converter',
  description: 'Learn about ConvertNow, the fast and free online unit converter supporting 500+ conversions across 13 categories.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="container-md py-12 lg:py-16">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
            <span>⚡</span> About
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Built for speed.<br />Designed for accuracy.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            ConvertNow is a free, fast, and accurate online unit converter. We built it because existing converters
            were slow, cluttered, or required sign-up. ConvertNow is none of those things.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { value: '500+', label: 'Conversions' },
            { value: `${CATEGORIES.length}`, label: 'Categories' },
            { value: '100%', label: 'Free forever' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <div className="text-2xl font-extrabold text-brand-500">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">What We Offer</h2>
            <p>
              ConvertNow supports over 500 unit conversions across 13 categories including length, weight,
              temperature, currency, area, volume, speed, time, and digital storage. Every converter shows
              the formula used, so you always know exactly how the calculation works.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Accuracy</h2>
            <p>
              All conversions use internationally standardized constants (SI units, NIST standards). Currency
              conversions use live exchange rates updated hourly via external APIs, with a cached fallback
              to ensure the converter always works even when offline.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Privacy</h2>
            <p>
              We use standard analytics (Google Analytics 4) to understand how people use the site — no
              personal data is collected. All conversions happen in your browser. We never sell data.
              Read our full <Link href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">PWA & Offline Support</h2>
            <p>
              ConvertNow is a Progressive Web App (PWA). You can install it on your device from your browser
              and use it offline. Most unit converters work without an internet connection — only live
              currency rates require connectivity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Open to Feedback</h2>
            <p>
              Found an error? Missing a unit? Want to suggest a feature?{' '}
              <Link href="/contact" className="text-brand-500 hover:underline">Contact us</Link> — we read every message.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
