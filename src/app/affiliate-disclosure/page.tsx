import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — ConvertNow.ca',
  description: 'ConvertNow.ca participates in the Amazon Associates Program. Learn how affiliate links support our free unit converter.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="container-md py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Affiliate Disclosure
      </h1>
      <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-gray-600 dark:text-gray-400">
        <p>
          ConvertNow.ca participates in the Amazon Associates Program, an affiliate advertising program that allows us to earn fees by linking to Amazon.ca.
        </p>
        <p>
          When you click a product link on our Shop page and make a purchase on Amazon, we earn a small commission at no extra cost to you.
        </p>
        <p>
          We only recommend products that are genuinely relevant and useful for unit conversion tasks — kitchen scales for cooking conversions, fitness trackers for speed and distance, tape measures for length conversions, and so on.
        </p>
        <p>
          This revenue helps us keep ConvertNow.ca completely free for everyone.
        </p>
      </div>
    </div>
  );
}
