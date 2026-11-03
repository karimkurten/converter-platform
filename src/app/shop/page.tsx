import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { SHOP_CATEGORIES, getProductsByCategory, getProductsBySubCategory } from '@/lib/shopProducts';
import { CATEGORIES } from '@/lib/converters';
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

// CN-17: crawlable copy for the server-rendered category sections below.
// Each lead describes only product types that actually appear in that
// category's listings in shopProducts.ts; product names and counts in the
// rendered text are generated from the same data, never hand-typed.
const SHOP_CATEGORY_COPY: Record<string, string> = {
  'converter-tools':
    'Physical measuring tools matched to the conversions on this site — the instruments you reach for once the on-screen math is done.',
  'luxury-beauty':
    'Skincare, hair styling and makeup, including vitamin C serums, ceramide moisturizers, the Dyson Airwrap multi-styler and Maybelline mascara.',
  kitchen:
    'Kitchen and home workhorses: countertop appliances such as the Instant Pot Duo and Ninja Air Fryer, KitchenAid and Vitamix classics, Le Creuset and Lodge cast iron, and Dyson and Roomba cleaning machines.',
  books:
    'Books on habits, money and influence — including Atomic Habits, Rich Dad Poor Dad and The Psychology of Money.',
  fashion:
    'Everyday apparel and carry: a Carhartt beanie, a Columbia rain jacket, a Nike Dri-FIT training shirt and a Herschel backpack.',
  office:
    'Office and work-from-home gear: a Flexispot electric standing desk, an ergonomic chair, an LG 4K monitor and an Elgato Stream Deck.',
  travel:
    'Travel gear: Samsonite hardside spinner luggage, Bose noise-cancelling headphones, compression packing cubes and a high-capacity power bank.',
  fitness:
    'Fitness and health gear: the Fitbit Charge 6 tracker, a Theragun Prime percussion massager, a Manduka PRO yoga mat, Optimum Nutrition whey protein and Hydro Flask bottles.',
  wellness:
    'Supplement staples: vitamin D3, omega-3 fish oil, magnesium glycinate and Athletic Greens AG1.',
  pets:
    'Pet supplies: the KONG Classic dog toy, a Furbo treat-tossing dog camera, a Catit water fountain, a FURminator deShedding tool and a Petlibro automatic feeder.',
  baby:
    'Baby and nursery picks: the Baby Brezza formula maker, a Hatch Rest sound machine, an Ergobaby Omni 360 carrier and a Nanit Pro smart monitor.',
  tech:
    'Tech and gadgets: AirPods Pro, an iPad, a Samsung QLED TV, a Logitech MX Master mouse, a Ring video doorbell, an Echo Dot and Anker charging gear.',
  gaming:
    'Gaming hardware: a PlayStation 5 DualSense controller, the Nintendo Switch OLED and a Razer DeathAdder gaming mouse.',
  home:
    'Home improvement picks: a LEVOIT air purifier, a Nest Learning Thermostat, Govee smart LED strip lights and a BLACK+DECKER cordless drill.',
  tools:
    'Tools and measurement picks led by the Stanley FatMax tape measure and a Bosch laser distance measure.',
};

const CONVERTER_TOOL_SUB_COPY: Record<string, string> = {
  length: 'Tape measures, laser distance measures, a digital caliper and a measuring wheel for length and distance work.',
  weight: 'Kitchen scales, a bathroom scale, a luggage scale and precision pocket scales for weighing in grams, ounces, kilograms and pounds.',
  temperature: 'Meat thermometers, an oven thermometer, an indoor/outdoor thermometer-hygrometer and an infrared thermometer gun for Celsius and Fahrenheit readings.',
  volume: 'Measuring cups, glass measuring sets and graduated containers for cups, millilitres, fluid ounces and litres.',
  speed: 'A Garmin GPS running watch, a Wahoo bike computer and a Bushnell speed radar gun.',
  area: 'A 360° line laser level and a construction calculator for area and job-site math.',
  digital: 'Storage you can hold: a SanDisk portable SSD, a Samsung microSD card and WD home NAS storage.',
  currency: 'Currency-and-travel accessories: a hardside carry-on, an RFID-blocking passport wallet and a universal travel adapter.',
  time: 'A Casio world-time watch and a 4-in-1 cube timer.',
};

function listNames(titles: string[]): string {
  if (titles.length <= 1) return titles.join('');
  return `${titles.slice(0, -1).join(', ')} and ${titles[titles.length - 1]}`;
}

export default function ShopPage() {
  const schema = buildShopSchema();
  const categorySections = SHOP_CATEGORIES.filter(c => c.id !== 'all')
    .map(cat => ({ ...cat, products: getProductsByCategory(cat.id) }))
    .filter(section => section.products.length > 0);
  const converterToolsCat = SHOP_CATEGORIES.find(c => c.id === 'converter-tools');

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

      {/* CN-17: server-rendered category sections. The interactive shop
          above is a client component that bails out of SSR, so without
          these sections the server HTML carries almost no crawlable
          product content (~80 words at audit time). All product names and
          counts below are generated from shopProducts.ts data. */}
      <section className="container-lg pb-16 pt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          What You Will Find in the ConvertNow Shop
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
          The shop is organized into the categories below. Every product is
          sold and shipped by Amazon — as an Amazon Associate, ConvertNow
          earns a commission on qualifying purchases at no extra cost to
          you, which helps keep the converter free. Use the filters above to
          browse the full range, or read on for what each category covers.
        </p>

        {categorySections.map(section => (
          <div key={section.id} className="mt-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {section.label}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
              {SHOP_CATEGORY_COPY[section.id]}{' '}
              This category currently lists {section.products.length}{' '}
              products, including{' '}
              {listNames(section.products.slice(0, 4).map(p => p.title))}.
            </p>

            {section.id === 'converter-tools' &&
              converterToolsCat?.subCategories?.map(sub => {
                const subProducts = getProductsBySubCategory(sub.id);
                if (subProducts.length === 0) return null;
                const hub = CATEGORIES.find(c => c.slug === sub.id);
                return (
                  <p
                    key={sub.id}
                    className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mt-3"
                  >
                    <strong className="text-gray-800 dark:text-gray-200">
                      {sub.label}:
                    </strong>{' '}
                    {CONVERTER_TOOL_SUB_COPY[sub.id]} In the shop:{' '}
                    {listNames(subProducts.map(p => p.title))}.
                    {hub && (
                      <>
                        {' '}
                        Pair them with our free{' '}
                        <Link
                          href={`/${hub.slug}`}
                          className="text-brand-600 dark:text-brand-400 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-500"
                        >
                          {hub.name} Converter
                        </Link>
                        .
                      </>
                    )}
                  </p>
                );
              })}
          </div>
        ))}
      </section>
    </>
  );
}
