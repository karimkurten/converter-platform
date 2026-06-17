import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Editorial Policy — ConvertNow',
  description: 'How ConvertNow creates, sources, and maintains its educational content and conversion tools.',
  path: '/editorial-policy',
});

export default function EditorialPage() {
  return (
    <div className="container-md py-12 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Editorial Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">How we create, verify, and maintain our content</p>

        <div className="space-y-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">1. Mission</h2>
            <p>
              ConvertNow's mission is to provide fast, accurate, and free unit conversions backed by clear
              educational content. Every page is designed to teach the user why a conversion matters, not just to
              spit out a number.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">2. Research & Verification</h2>
            <p>
              All conversion formulas are derived from internationally recognized standards: the International System
              of Units (SI), NIST SP 330 / SP 811, and the International Organization for Standardization (ISO).
              Currency rates are sourced from live exchange APIs (OpenExchangeRates/ExchangeRate-API) and refreshed
              automatically.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">3. Content Creation</h2>
            <p>
              Articles and guides are written by experienced editors and fact-checked against multiple sources.
              We do not publish content that is copied verbatim from another site. All blog posts include editorial
              attribution and publication dates.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">4. Corrections</h2>
            <p>
              Users can report errors through our <Link href="/contact" className="text-brand-500 hover:underline">contact page</Link>.
              Verified errors are corrected within 48 hours and noted at the bottom of the affected page. Older articles
              are reviewed quarterly for accuracy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">5. Independence</h2>
            <p>
              ConvertNow does not accept paid placement for individual converters or rankings. Product recommendations
              in the shop are curated independently; affiliate relationships are always disclosed. Our editorial
              direction is driven by user need and search demand, not advertiser influence.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
