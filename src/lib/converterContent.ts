import type { Converter, ConverterCategory } from '@/types';
import { CONVERT_FNS } from './converters';

/**
 * Generates unique, SEO-optimized text for any converter page.
 * All content is produced programatically from converter metadata.
 */

const TABLE_VALUES = [0.1, 0.25, 0.5, 0.75, 1, 2, 3, 5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 250, 300, 500];

export interface ConverterSeoContent {
  title: string;
  metaDescription: string;
  h2s: string[];
  intro: string;
  formulaSection: string;
  explanationSection: string;
  usageSection: string;
  mistakesSection: string;
  tableSection: string;
  table: { v: number; r: string }[];
  faqs: { q: string; a: string }[];
  relatedConverters: Converter[];
  wordCount: number;
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + ' billion';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + ' million';
  if (Math.abs(n) >= 1e3) return Math.round(n).toLocaleString();
  return Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/\.?0+$/, '');
}

function getSystem(id: string): string {
  const metric = ['meter', 'kilometer', 'gram', 'kilogram', 'liter', 'celsius', 'square-meter', 'pascal', 'joule', 'watt'];
  if (metric.some(m => id.includes(m))) return 'Metric';
  return 'Imperial / US Customary';
}

function getIndustries(catId: string): string {
  const map: Record<string, string> = {
    length: 'engineering, construction, surveying, and interior design',
    weight: 'health tracking, shipping logistics, cooking, and fitness',
    temperature: 'cooking, weather forecasting, healthcare, and manufacturing',
    currency: 'finance, travel planning, investing, and e-commerce',
    area: 'real estate, construction, agriculture, and landscaping',
    volume: 'cooking, chemistry, fuel purchases, and fluid delivery',
    speed: 'transportation, aviation, athletics, and navigation',
    time: 'project management, scheduling, astronomy, and payroll',
    digital: 'IT systems, cloud storage, media production, and web hosting',
    cooking: 'baking, recipe development, nutrition planning, and meal prep',
  };
  return map[catId] || 'science, education, and industry';
}

function getMistakeExample(catId: string): string {
  const map: Record<string, string> = {
    length: 'building a shelf that is 2 inches too short',
    weight: 'shipping a package that exceeds a courier weight limit',
    temperature: 'setting an oven 25 degrees too high and burning a dish',
    currency: 'budgeting with the wrong exchange rate and overspending',
    area: 'ordering too little flooring material for a room renovation',
    volume: 'mixing chemicals with mismatched units for a reaction',
    speed: 'misjudging travel time on a road trip with wrong speed units',
    time: 'scheduling a meeting across time zones incorrectly',
    digital: 'choosing a cloud storage plan that is too small for backups',
    cooking: 'failing a recipe because tablespoons and teaspoons were confused',
  };
  return map[catId] || 'producing an incorrect result that affects your project';
}

export function generateConverterContent(
  converter: Converter, category: ConverterCategory
): ConverterSeoContent {
  const fromU = category.units.find(u => u.id === converter.from)!;
  const toU = category.units.find(u => u.id === converter.to)!;
  const fromSys = getSystem(fromU.id);
  const toSys = getSystem(toU.id);

  const fn = CONVERT_FNS[category.id];
  const one = fn ? fn(1, converter.from, converter.to) : null;
  const rate = one ? one.value : 0;
  const rateStr = fmt(rate);

  // Conversion table
  const table = TABLE_VALUES.map(v => ({
    v,
    r: fn ? fmt((fn(v, converter.from, converter.to)?.value) ?? 0) : '—',
  }));

  const relatedConverters = category.converters
    .filter(c => c.id !== converter.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  // ── Title & Meta ─────────────────────────────────────────
  const title = `${fromU.name} to ${toU.name} Converter — Free & Instant | ConvertNow`;
  const metaDescription = `Convert ${fromU.name} (${fromU.symbol}) to ${toU.name} (${toU.symbol}) instantly. Free ${category.name.toLowerCase()} converter with formula, tables, and FAQs. No signup needed.`;

  // ── Content Sections ─────────────────────────────────────
  const intro = `Use our free ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} converter to get accurate results in under one second. This ${category.name.toLowerCase()} conversion tool is essential for anyone working in ${getIndustries(category.id)}. Simply enter your value above, click Convert, and see the result instantly with the exact formula shown. You can also reverse the conversion, copy the result, or adjust decimal precision.`;

  const formulaSection = `The conversion formula is straightforward: 1 ${fromU.name} equals ${rateStr} ${toU.name}. Multiply any ${fromU.name.toLowerCase()} value by ${rateStr} to obtain the equivalent in ${toU.name.toLowerCase()}. All calculations on ConvertNow use verified constants, ensuring your result is accurate to the last displayed decimal place.`;

  const explanationSection = `${fromU.name} (${fromU.symbol}) is part of the ${fromSys} measurement system, while ${toU.name} (${toU.symbol}) belongs to the ${toSys} system. The difference matters because a recipe, blueprint, or technical spec written in ${fromSys.toLowerCase()} will not match measurements in ${toSys.toLowerCase()} unless converted precisely. Mixing systems without conversion can lead to ${getMistakeExample(category.id)}.`;

  const usageSection = `${category.name} conversions are used every day in ${getIndustries(category.id)}. Professionals in these fields rely on fast, accurate tools because even small rounding errors multiply across large datasets or recipes. ConvertNow keeps your workflow moving with instant results, so you never have to open a spreadsheet or do manual math.`;

  const mistakesSection = `Common mistakes when converting ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} include rounding too early in the calculation, forgetting that 1 ${fromU.name} = ${rateStr} ${toU.name}, and using approximate factors from memory instead of verified constants. Another frequent error is mixing absolute and relative scales, particularly for temperature. Always verify the direction of the conversion and use the swap button if you need to reverse it.`;

  const tableSection = `The following table shows twenty common conversion values from ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} for fast reference without calculator use.`;

  // ── FAQs ─────────────────────────────────────────────────
  const faqs = [
    {
      q: `How many ${toU.name.toLowerCase()} are in 1 ${fromU.name.toLowerCase()}?`,
      a: `There are ${rateStr} ${toU.name.toLowerCase()} in 1 ${fromU.name.toLowerCase()}.`
    },
    {
      q: `How do I convert ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} without a calculator?`,
      a: `Multiply your ${fromU.name.toLowerCase()} value by ${rateStr}. For quick mental math, you can round to ${Math.round(rate * 10) / 10} when precision is not critical.`
    },
    {
      q: `Is ${fromU.name} bigger or smaller than ${toU.name}?`,
      a: `${fromU.name} is ${rate > 1 ? 'larger' : 'smaller'} than ${toU.name}: 1 ${fromU.name} equals ${rateStr} ${toU.name}.`
    },
    {
      q: `Which countries use ${fromU.name} and which use ${toU.name}?`,
      a: `${fromU.name} is primarily used in ${fromSys === 'Metric' ? 'most countries globally' : 'the United States and some Commonwealth nations'}.${toU.name} is primarily used in ${toSys === 'Metric' ? 'most countries globally' : 'the United States and historical contexts'}.`
    },
    {
      q: `Can I convert ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} offline?`,
      a: `Yes. Install ConvertNow as a Progressive Web App and perform this conversion offline. If you need currency rates, an internet connection is required because those update live.`
    },
    {
      q: `Why is converting ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} important?`,
      a: `Accurate conversion prevents costly errors in ${getIndustries(category.id)}. Using the wrong unit can lead to ${getMistakeExample(category.id)}.`
    },
  ];

  const wordCount = [
    intro, formulaSection, explanationSection, usageSection, mistakesSection, tableSection,
    ...faqs.map(f => f.q + ' ' + f.a),
  ].join(' ').split(/\s+/).length;

  return {
    title: title.length > 60 ? title.slice(0, 57) + '…' : title,
    metaDescription: metaDescription.length > 155 ? metaDescription.slice(0, 152) + '…' : metaDescription,
    h2s: [
      `How do I convert ${fromU.name} to ${toU.name}?`,
      `What is the formula to convert ${fromU.name} to ${toU.name}?`,
      `What is the difference between ${fromU.name} and ${toU.name}?`,
      `Why is this conversion useful in real life?`,
      `Common mistakes when converting ${fromU.name} to ${toU.name}`,
      `${fromU.name} to ${toU.name} conversion table`,
      `Frequently asked questions`,
    ],
    intro,
    formulaSection,
    explanationSection,
    usageSection,
    mistakesSection,
    tableSection,
    table,
    faqs,
    relatedConverters,
    wordCount,
  };
}
