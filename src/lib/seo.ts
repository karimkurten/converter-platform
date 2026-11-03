import type { Metadata } from 'next';
import type { BreadcrumbItem, FAQItem, Converter, ConverterCategory } from '@/types';
import { HEIGHT_VALUES } from './height';
import { INGREDIENTS, OVEN_CHART_ID } from './cooking';
import { getValuePageDef, getChartPageDef, specialUnit } from './valuePages';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.convertnow.ca';
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

// Batch C (CTR package, CTR_PROPOSALS.md): hand-written title/description for
// the five highest-traffic hubs, replacing the generic template below.
// Titles are the pre-suffix text — buildMetadata appends " | ConvertNow".
// Factual adjustments vs the proposals, verified against the live catalog:
//  - currency: the site lists 40 currencies (not "100+"); rates are the
//    mid-market snapshot refreshed hourly (Batch A), so it says so.
//  - cooking (Batch G): the Batch C copy promised only volumes, because
//    the hub had no cups-to-grams or oven-temperature pages yet. Batch G
//    built them, so the original CTR_PROPOSALS.md cooking copy now goes in
//    — every claim in it is true of the hub as of Batch G: cups to grams
//    (ingredient pages), tablespoons to ml (popular pairs), oven
//    temperatures in °F/°C/gas mark (the oven chart) and ingredient tables.
const CATEGORY_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  length: {
    title: 'Length Converter: Meters to Feet, Miles to Km',
    description: 'Convert meters to feet, kilometers to miles, inches to cm and more — instant results with formulas and full conversion tables. Free, no signup.',
  },
  weight: {
    title: 'Weight Converter: Kg to Lbs, Grams to Ounces',
    description: 'Convert kilograms to pounds, grams to ounces, stones to kg and more with instant results, formulas and reference tables. Free and accurate.',
  },
  temperature: {
    title: 'Celsius to Fahrenheit Converter — °C, °F, Kelvin',
    description: 'Convert Celsius to Fahrenheit, Fahrenheit to Celsius and Kelvin instantly — with the exact formula, worked examples and a full temperature table.',
  },
  currency: {
    title: 'Live Currency Converter — USD to CAD, EUR, GBP',
    description: 'Convert USD to CAD, EUR to USD, GBP and more — 40 currencies with mid-market exchange rates updated hourly. Instant, free, no signup.',
  },
  cooking: {
    title: 'Cooking Converter: Cups to Grams, Tbsp & Oven Temps',
    description: 'Convert cups to grams, tablespoons to ml and oven temperatures (°F, °C, gas mark) for any recipe. Ingredient tables included. Free.',
  },
};

export function buildCategoryMetadata(category: ConverterCategory): Metadata {
  const override = CATEGORY_SEO_OVERRIDES[category.slug];
  return buildMetadata({
    title: override?.title ?? `${category.name} Converter`,
    description: override?.description ?? `Free online ${category.name.toLowerCase()} converter. Convert between ${category.units.slice(0, 5).map(u => u.name).join(', ')}, and more. Instant results with formulas.`,
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

// ─── Height Page Metadata (Batch F) ────────────────────────────────────────
// Hand-written metadata for the height cluster pages rendered by
// src/app/length/[heightPage]. Titles/descriptions promise only what those
// pages actually do (converter both directions, fractions, 140–210 cm chart).

const HEIGHT_META: Record<string, { title: string; description: string }> = {
  'centimeter-to-feet-inches': {
    title: 'CM to Feet and Inches Converter — Height Converter',
    description:
      'Convert centimeters to feet and inches instantly — the height converter with fraction results, worked examples and a full 140–210 cm height chart. Free.',
  },
  'feet-inches-to-centimeter': {
    title: 'Feet and Inches to CM Converter — Height Converter',
    description:
      'Convert feet and inches to centimeters instantly — enter a height like 5 ft 9 in and get the exact centimetre equivalent, plus formula and chart. Free.',
  },
  'height-chart': {
    title: 'Height Chart — CM to Feet and Inches (140–210 cm)',
    description:
      'Full height conversion chart: every centimetre from 140 to 210 cm in feet and inches, with feet-and-inch fractions and common heights highlighted.',
  },
};

for (const cm of HEIGHT_VALUES) {
  HEIGHT_META[`${cm}-cm-to-feet-inches`] = {
    title: `${cm} cm in Feet and Inches — Height Converter`,
    description: `${cm} cm in feet and inches: the exact conversion with the formula, the inches total, and a ${cm - 5}–${cm + 5} cm height chart around it. Free and instant.`,
  };
}

export function buildHeightMetadata(converter: Converter): Metadata {
  const meta = HEIGHT_META[converter.id];
  return buildMetadata({
    title: meta?.title ?? converter.title,
    description: meta?.description ?? converter.description,
    path: `/length/${converter.id}`,
    keywords: [
      'cm to feet and inches',
      'centimeters to feet inches',
      'height converter',
      'cm in feet',
      'height chart cm to feet',
      'feet and inches to cm',
      converter.title.toLowerCase(),
      'unit converter',
      'online converter',
    ],
  });
}

// ─── Cooking Page Metadata (Batch G) ─────────────────────────────────────
// Hand-written metadata for the cooking cluster pages rendered by
// src/app/cooking/[cookingPage]. Titles/descriptions promise only what
// those pages actually do (ingredient cups↔grams with King Arthur Baking
// chart weights, the oven chart with exact °F). Ingredient figures in the
// descriptions come from INGREDIENTS — the same data the pages compute
// from — never hand-typed results.

const COOKING_META: Record<string, { title: string; description: string }> = {
  'cups-to-grams': {
    title: 'Cups to Grams Converter — Baking Ingredients',
    description:
      'Convert cups to grams for flour, sugar, butter, cocoa and more baking ingredients — weights from the King Arthur Baking chart, with a full table for every ingredient. Free.',
  },
  'grams-to-cups': {
    title: 'Grams to Cups Converter — Baking Ingredients',
    description:
      'Convert grams to cups for flour, sugar, butter, cocoa and more baking ingredients — weights from the King Arthur Baking chart, with a full table for every ingredient. Free.',
  },
  [OVEN_CHART_ID]: {
    title: 'Oven Temperature Chart — °C to °F & Gas Mark',
    description:
      'Oven temperature conversion chart: Celsius, Fahrenheit and gas mark side by side from 110 °C to 240 °C, with exact Fahrenheit conversions (180 °C = 356 °F, gas mark 4).',
  },
};

for (const ing of INGREDIENTS) {
  COOKING_META[`${ing.id}-cups-to-grams`] = {
    title: `${ing.name}: Cups to Grams & Grams to Cups`,
    description: `1 cup of ${ing.name.toLowerCase()} = ${ing.gramsPerCup} g. Convert cups to grams and grams to cups for ${ing.name.toLowerCase()} with full tables — King Arthur Baking chart weights, approximate as all cup weights are.`,
  };
}

export function buildCookingMetadata(converter: Converter): Metadata {
  const meta = COOKING_META[converter.id];
  return buildMetadata({
    title: meta?.title ?? converter.title,
    description: meta?.description ?? converter.description,
    path: `/cooking/${converter.id}`,
    keywords: [
      'cups to grams',
      'grams to cups',
      'baking conversion',
      'how many grams in a cup',
      'oven temperature chart',
      'gas mark to celsius',
      converter.title.toLowerCase(),
      'unit converter',
      'online converter',
    ],
  });
}

// ─── Specific-Value + Chart Page Metadata (Batch H) ─────────────────────
// Metadata for the "70 kg to lbs" value pages and the printable chart
// pages rendered by the dedicated routes. Descriptions reuse the registry
// descriptions, whose figures are computed with the real conversion
// functions in src/lib/valuePages — never hand-typed results.

export function buildValuePageMetadata(converter: Converter): Metadata {
  const def = getValuePageDef(converter.id);
  if (!def) return buildMetadata({ title: converter.title, description: converter.description, path: `/${converter.category}/${converter.id}` });
  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  return buildMetadata({
    title: `${converter.title} — ${fromU.name} to ${toU.name} Conversion`,
    description: converter.description,
    path: `/${def.category}/${converter.id}`,
    keywords: [
      `${def.value} ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()}`,
      `${def.value} ${fromU.symbol} to ${toU.symbol}`,
      `how much is ${def.value} ${fromU.symbol} in ${toU.symbol}`,
      `${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()}`,
      `${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} chart`,
      'unit converter',
      'online converter',
    ],
  });
}

export function buildChartPageMetadata(converter: Converter): Metadata {
  const def = getChartPageDef(converter.id);
  if (!def) return buildMetadata({ title: converter.title, description: converter.description, path: `/${converter.category}/${converter.id}` });
  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  return buildMetadata({
    title: `${fromU.name} to ${toU.name} Chart — Printable Conversion Table`,
    description: converter.description,
    path: `/${def.category}/${converter.id}`,
    keywords: [
      `${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} chart`,
      `${fromU.symbol} to ${toU.symbol} chart`,
      `${fromU.name.toLowerCase()} ${toU.name.toLowerCase()} conversion table`,
      'printable conversion chart',
      `${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()}`,
      'unit converter',
      'online converter',
    ],
  });
}

// ─── JSON-LD Schema ────────────────────────────────────────────────────────────

export function buildWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (web-based)',
    browserRequirements: 'Requires JavaScript.',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Free online unit converter supporting 500+ conversions across 15 categories: length, weight, temperature, currency, area, volume, speed, time, digital storage, pressure, energy, power, torque, fuel economy, and cooking measurements.',
    featureList: [
      'Length converter', 'Weight & mass converter', 'Temperature converter',
      'Live currency converter', 'Area converter', 'Volume converter',
      'Speed converter', 'Time converter', 'Digital storage converter',
      'Pressure converter', 'Energy converter', 'Power converter',
      'Torque converter', 'Fuel economy converter',
      'Cooking measurement converter', 'Works offline as a PWA',
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

/** ItemList schema for hub / index pages (CN-06, CN-11b). */
export function buildItemListSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  };
}

// ─── FAQ Generation ────────────────────────────────────────────────────────────
// (generateConverterFAQs removed 2026-10-13: superseded by seoContent.faqs used by
// converter pages for both visible FAQs and FAQPage schema; zero callers remained.)
