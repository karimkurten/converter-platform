import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service — ConvertNow',
  description: 'ConvertNow terms of service. Rules governing use of the ConvertNow unit converter.',
  path: '/terms',
});

const LAST_UPDATED = 'January 1, 2025';

export default function TermsPage() {
  return (
    <div className="container-md py-12 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <Section title="1. Acceptance">
            <p>
              By using ConvertNow (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree,
              please do not use the Service.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              ConvertNow provides free online unit conversion tools for personal and commercial use. The Service
              is provided &quot;as is&quot; without warranties of any kind, express or implied.
            </p>
          </Section>

          <Section title="3. Accuracy Disclaimer">
            <p>
              While we strive for accuracy in all conversions, ConvertNow is provided for informational purposes
              only. Do not rely on ConvertNow for critical applications such as medical dosing, engineering
              specifications, or financial transactions without independent verification.
            </p>
          </Section>

          <Section title="4. Permitted Use">
            <p>You may use ConvertNow for any lawful purpose, including:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Personal unit conversions</li>
              <li>Educational purposes</li>
              <li>Commercial use (e.g., embedding conversions into your workflow)</li>
            </ul>
          </Section>

          <Section title="5. Prohibited Use">
            <p>You may not:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Scrape or systematically download content for commercial redistribution</li>
              <li>Attempt to circumvent security measures or overload our servers</li>
              <li>Use the Service in a manner that violates applicable laws</li>
            </ul>
          </Section>

          <Section title="6. Advertising">
            <p>
              ConvertNow displays advertisements via Google AdSense. These ads support the free operation of
              the Service. By using the Service, you acknowledge and accept the presence of advertising.
            </p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              The ConvertNow name, logo, and code are proprietary. Conversion formulas and scientific
              constants are in the public domain. Our implementation and design are protected.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, ConvertNow shall not be liable for any indirect,
              incidental, or consequential damages arising from use of the Service.
            </p>
          </Section>

          <Section title="9. Changes">
            <p>
              We reserve the right to modify these terms at any time. Continued use after changes
              constitutes acceptance. Check this page periodically.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions about these terms? Use our{' '}
              <Link href="/contact" className="text-brand-500 hover:underline">contact page</Link>.
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
