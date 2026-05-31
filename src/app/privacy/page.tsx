import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy — ConvertNow',
  description: 'ConvertNow privacy policy. Learn how we handle your data.',
  path: '/privacy',
  noIndex: false,
});

const LAST_UPDATED = 'January 1, 2025';

export default function PrivacyPage() {
  return (
    <div className="container-md py-12 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <Section title="1. Information We Collect">
            <p>
              ConvertNow collects minimal data to operate and improve the service. We use Google Analytics 4 to
              collect anonymous usage data including page views, session duration, and general location
              (country/city level). We do not collect personal identifying information.
            </p>
            <p className="mt-2">
              All unit conversions are performed entirely in your browser. Conversion inputs are never
              transmitted to our servers.
            </p>
          </Section>

          <Section title="2. Cookies and Tracking">
            <p>
              We use cookies for: (1) Analytics via Google Analytics 4 — anonymized usage statistics,
              (2) Advertising via Google AdSense — serves personalized or non-personalized ads,
              (3) Theme preference — stored locally in your browser.
            </p>
            <p className="mt-2">
              You can disable cookies in your browser settings. This may affect some functionality.
            </p>
          </Section>

          <Section title="3. Advertising">
            <p>
              ConvertNow is supported by advertising through Google AdSense. Google may use cookies to serve
              ads based on your browsing history. You can opt out of personalized advertising at{' '}
              <a href="https://adssettings.google.com" className="text-brand-500 hover:underline" target="_blank" rel="noopener noreferrer">
                adssettings.google.com
              </a>.
            </p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We use the following third-party services:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Google Analytics 4 (usage analytics)</li>
              <li>Google AdSense (advertising)</li>
              <li>Microsoft Clarity (UX heatmaps — anonymized)</li>
              <li>ExchangeRate-API (live currency rates)</li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>
              Analytics data is retained for 14 months (Google Analytics default). Local preferences stored in
              your browser (theme, recent converters, favorites) remain until you clear your browser data.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>
              Depending on your location, you may have rights to access, delete, or port your data under
              GDPR, CCPA, or similar laws. Since we collect no personally identifying information, there
              is typically nothing to request. Contact us at the email below for any privacy questions.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              ConvertNow does not knowingly collect data from children under 13. The site is a general-purpose
              utility tool with no registration or age gate.
            </p>
          </Section>

          <Section title="8. Contact">
            <p>
              For privacy questions, contact us via our{' '}
              <Link href="/contact" className="text-brand-500 hover:underline">contact page</Link>.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this policy. Changes will be posted on this page with an updated date.
              Continued use of ConvertNow after changes constitutes acceptance.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      {children}
    </section>
  );
}
