import type { Metadata } from 'next';
import type { BreadcrumbItem, FAQItem, Converter, ConverterCategory } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://convertnow.ca';
const SITE_NAME = 'ConvertNow';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// ─── Base Metadata ─────────────────────────────────────────────────────────────

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  ogImage,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImage?: string;
}): Metadata {
  const canonical = `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    openGraph: {
      type: 'website',
      url: canonical,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImage || DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage || DEFAULT_OG_IMAGE],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    },
  };
}

// ─── Converter Page Metadata ───────────────────────────────────────────────────

export function buildConverterMetadata(
  converter: Converter,
  category: ConverterCategory,
  noIndex = false,
): Metadata {
  const fromUnit = category.units.find(u => u.id === converter.from)!;
  const toUnit = category.units.find(u => u.id === converter.to)!;

  const title = `${fromUnit.name} to ${toUnit.name} Converter`;
  const description = `Free online ${fromUnit.name} to ${toUnit.name} converter. Instantly convert ${fromUnit.symbol} to ${toUnit.symbol} with formula, examples, and decimal precision. Fast and accurate.`;

  return buildMetadata({
    title,
    description,
    path: `/${category.slug}/${converter.id}`,
    noIndex,
    keywords: [
      `${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()}`,
      `${fromUnit.symbol} to ${toUnit.symbol}`,
      `convert ${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()}`,
      `${fromUnit.name.toLowerCase()} ${toUnit.name.toLowerCase()} converter`,
      `${category.name.toLowerCase()} converter`,
      'unit converter',
      'online converter',
    ],
  });
}

// ─── Category Page Metadata ────────────────────────────────────────────────────

export function buildCategoryMetadata(category: ConverterCategory): Metadata {
  return buildMetadata({
    title: `${category.name} Converter`,
    description: `Free online ${category.name.toLowerCase()} converter. Convert between ${category.units.slice(0, 5).map(u => u.name).join(', ')}, and more. Instant results with formulas.`,
    path: `/${category.slug}`,
    keywords: [
      `${category.name.toLowerCase()} converter`,
      `${category.name.toLowerCase()} conversion`,
      `convert ${category.name.toLowerCase()}`,
      ...category.units.slice(0, 6).map(u => u.name.toLowerCase()),
      'unit converter',
      'online converter',
    ],
  });
}

// ─── JSON-LD Schema ────────────────────────────────────────────────────────────

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        description: 'Free online unit converter at ConvertNow.ca. Convert length, weight, temperature, currency, area, volume, speed, and more.',
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/og-image.png`,
        sameAs: [
          'https://www.facebook.com/ConvertNow.ca',
          'https://www.instagram.com/ConvertNow.ca',
          'https://ca.pinterest.com/ConvertNow',
        ],
        description: 'Free, fast online unit converter supporting 500+ conversions with no signup required.',
      },
    ],
  };
}

export function buildConverterSchema(
  converter: Converter,
  category: ConverterCategory,
  faqs: FAQItem[]
) {
  const fromUnit = category.units.find(u => u.id === converter.from)!;
  const toUnit = category.units.find(u => u.id === converter.to)!;
  const url = `${SITE_URL}/${category.slug}/${converter.id}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${fromUnit.name} to ${toUnit.name} Converter`,
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
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to convert ${fromUnit.name} to ${toUnit.name}`,
      description: `Step-by-step guide to convert ${fromUnit.name} (${fromUnit.symbol}) to ${toUnit.name} (${toUnit.symbol}) using ConvertNow.`,
      totalTime: 'PT0M',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: '0',
      },
      supply: [
        { '@type': 'HowToSupply', name: 'Internet connection (optional)' },
      ],
      tool: [
        { '@type': 'HowToTool', name: 'ConvertNow online converter' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Open the converter',
          text: `Go to ConvertNow.ca and navigate to the ${fromUnit.name} to ${toUnit.name} converter.`,
          url: `${SITE_URL}/${category.slug}/${converter.id}`,
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Enter your value',
          text: `Type the number of ${fromUnit.name} you want to convert into the input field.`,
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Get instant result',
          text: `The converter instantly shows the equivalent in ${toUnit.name} (${toUnit.symbol}), along with the formula used.`,
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Swap or adjust (optional)',
          text: `Use the swap button to convert ${toUnit.name} back to ${fromUnit.name}, or adjust decimal precision as needed.`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ];
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

// ─── FAQ Generation ────────────────────────────────────────────────────────────

export function generateConverterFAQs(
  converter: Converter,
  category: ConverterCategory,
  exampleResult: number
): FAQItem[] {
  const fromUnit = category.units.find(u => u.id === converter.from)!;
  const toUnit = category.units.find(u => u.id === converter.to)!;

  return [
    {
      question: `How do I convert ${fromUnit.name} to ${toUnit.name}?`,
      answer: `To convert ${fromUnit.name} to ${toUnit.name}, use our free online converter above. Simply enter the value in ${fromUnit.name} and instantly get the result in ${toUnit.name}.`,
    },
    {
      question: `How many ${toUnit.name} are in one ${fromUnit.name}?`,
      answer: `1 ${fromUnit.name} equals ${exampleResult} ${toUnit.name}. You can use the converter above to calculate any value.`,
    },
    {
      question: `What is the formula to convert ${fromUnit.symbol} to ${toUnit.symbol}?`,
      answer: `Use our converter for the exact formula. The result is displayed with the full conversion formula for reference.`,
    },
    {
      question: `Is this ${fromUnit.name} to ${toUnit.name} converter free?`,
      answer: `Yes! Our converter is completely free to use. No sign-up, no download required. Just enter your value and get an instant result.`,
    },
  ];
}
