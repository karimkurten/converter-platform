import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SHOP_CATEGORIES, getProductCount, getConverterTools, getProductsByCategory, getProductsBySubCategory } from '@/lib/shopProducts';
import ShopClientPage from './ShopClientPage';

export const metadata: Metadata = {
  title: 'Shop Measurement & Converter Tools | ConvertNow.ca',
  description: 'Shop 200+ hand-picked products matched to your conversions. Measurement tools, kitchen scales, thermometers, laser measures and more — all on Amazon with fast shipping.',
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
    title: 'Shop Measurement & Converter Tools | ConvertNow.ca',
    description: 'Hand-picked measurement tools matched to your conversions. Ships worldwide.',
    url: 'https://www.convertnow.ca/shop',
    siteName: 'ConvertNow',
    images: [{ url: 'https://www.convertnow.ca/og-shop.png', width: 1200, height: 630, alt: 'ConvertNow Shop' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Measurement & Converter Tools | ConvertNow.ca',
    description: 'Hand-picked measurement tools matched to your conversions.',
    images: ['https://www.convertnow.ca/og-shop.png'],
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
        name: 'Shop Measurement & Converter Tools | ConvertNow.ca',
        description: 'Hand-picked measurement tools matched to your conversions.',
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
          itemListElement: products.slice(0, 10).map((product, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Product',
              name: product.title,
              description: product.description,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount.replace(/[^0-9]/g, ''),
              },
              offers: {
                '@type': 'Offer',
                priceCurrency: 'CAD',
                availability: 'https://schema.org/InStock',
                url: product.amazonUrl,
              },
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
      <Suspense fallback={<div className="min-h-screen" />}>
        <ShopClientPage />
      </Suspense>
    </>
  );
}
