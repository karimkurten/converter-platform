import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProductsByCategory } from '@/lib/shopProducts';
import { amazonUrlToGoUrl } from '@/lib/amazonRedirect';
import ShopClientPage from './ShopClientPage';

// Batch C (CTR package, CTR_PROPOSALS.md): product-led title/description.
// The proposal replaces the CN-08 Batch B text in the search snippet (the
// full 106-product list itself is unchanged, in the body and JSON-LD).
const SHOP_TITLE = 'Kitchen Scales, Tape Measures & More — Shop | ConvertNow';
const SHOP_DESCRIPTION = 'Hand-picked kitchen scales, tape measures and thermometers matched to the conversions you run. Shop via Amazon — we earn a small commission.';

export const metadata: Metadata = {
  title: SHOP_TITLE,
  description: SHOP_DESCRIPTION,
  keywords: [
    'measurement tools',
    'kitchen scale metric imperial',
    'meat thermometer celsius fahrenheit',
    'tape measure metric imperial',
    'laser distance measure',
    'digital caliper',
    'converter tools shop',
    'unit conversion tools',
    'amazon measurement tools'
  ],
  openGraph: {
    title: SHOP_TITLE,
    description: SHOP_DESCRIPTION,
    url: 'https://www.convertnow.ca/shop',
    siteName: 'ConvertNow',
    images: [{ url: 'https://www.convertnow.ca/og-image.png', width: 1200, height: 630, alt: 'ConvertNow Shop' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SHOP_TITLE,
    description: SHOP_DESCRIPTION,
    images: ['https://www.convertnow.ca/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.convertnow.ca/shop',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
};

// JSON-LD for CollectionPage + Organization
function buildShopSchema() {
  const products = getProductsByCategory('all');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: SHOP_TITLE,
        description: SHOP_DESCRIPTION,
        url: 'https://www.convertnow.ca/shop',
        brand: {
          '@type': 'Brand',
          name: 'ConvertNow',
        },
        isPartOf: {
          '@type': 'WebSite',
          name: 'ConvertNow',
          url: 'https://www.convertnow.ca',
        },
        mainEntity: {
          '@type': 'ItemList',
          // CN-09: cover every listed product, not a 10-item sample.
          // Deliberately NO ratings/reviews — none exist for these listings.
          itemListElement: products.map((product, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Product',
              name: product.title,
              description: product.description,
              url: `https://www.convertnow.ca${amazonUrlToGoUrl(product.amazonUrl)}`,
            },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What kind of products does ConvertNow.ca shop sell?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'ConvertNow Shop sells hand-picked measurement tools, kitchen gadgets, and conversion accessories matched to the units you convert on our free converter.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does ConvertNow.ca make money?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'As an Amazon Associate, ConvertNow.ca earns from qualifying purchases when you buy through our product links. This helps keep our converter free.',
            },
          },
        ],
      },
    ],
  };
}

export default function ShopPage() {
  const schema = buildShopSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Server-rendered page heading (CN-02): the interactive shop below is
          a client component behind a Suspense boundary, so without this
          block the server HTML has no H1 at all. */}
      <div className="container-lg pt-8 lg:pt-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Shop Measurement &amp; Converter Tools
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mt-3 leading-relaxed">
          Hand-picked measurement tools matched to the conversions you run on
          ConvertNow — kitchen scales for cooking conversions, tape measures
          for length, thermometers for temperature, and more. Every product
          links to Amazon; as an Amazon Associate we earn from qualifying
          purchases at no extra cost to you.
        </p>
      </div>
      <Suspense fallback={<div className="min-h-screen" />}>
        <ShopClientPage />
      </Suspense>
    </>
  );
}
