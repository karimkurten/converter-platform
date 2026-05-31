import type { ConverterCategory, Converter, ConversionResult } from '@/types';
import { LENGTH_UNITS, LENGTH_POPULAR_PAIRS, convertLength } from './length';
import { WEIGHT_UNITS, WEIGHT_POPULAR_PAIRS, convertWeight } from './weight';
import { TEMPERATURE_UNITS, TEMPERATURE_POPULAR_PAIRS, convertTemperature } from './temperature';
import {
  AREA_UNITS, AREA_POPULAR_PAIRS,
  VOLUME_UNITS, VOLUME_POPULAR_PAIRS,
  SPEED_UNITS, SPEED_POPULAR_PAIRS,
  TIME_UNITS, TIME_POPULAR_PAIRS,
  DIGITAL_UNITS, DIGITAL_POPULAR_PAIRS,
  convertArea, convertVolume, convertSpeed, convertTime, convertDigital,
} from './units';
import { CURRENCIES, POPULAR_CURRENCY_PAIRS } from './currency';

function makeConverters(category: string, pairs: { from: string; to: string }[], units: { id: string; name: string; symbol: string }[]): Converter[] {
  return pairs.map(({ from, to }) => {
    const fromUnit = units.find(u => u.id === from);
    const toUnit = units.find(u => u.id === to);
    if (!fromUnit || !toUnit) return null;
    return {
      id: `${from}-to-${to}`,
      from,
      to,
      category,
      title: `${fromUnit.name} to ${toUnit.name}`,
      description: `Convert ${fromUnit.name} (${fromUnit.symbol}) to ${toUnit.name} (${toUnit.symbol}) instantly with formula and examples.`,
      popular: true,
    } as Converter;
  }).filter(Boolean) as Converter[];
}

// Generate all permutations for a category
function makeAllConverters(category: string, units: { id: string; name: string; symbol: string }[], popularPairs: { from: string; to: string }[]): Converter[] {
  const popular = new Set(popularPairs.map(p => `${p.from}-to-${p.to}`));
  const allPairs: Converter[] = [];

  for (const fromUnit of units) {
    for (const toUnit of units) {
      if (fromUnit.id === toUnit.id) continue;
      const id = `${fromUnit.id}-to-${toUnit.id}`;
      allPairs.push({
        id,
        from: fromUnit.id,
        to: toUnit.id,
        category,
        title: `${fromUnit.name} to ${toUnit.name}`,
        description: `Convert ${fromUnit.name} (${fromUnit.symbol}) to ${toUnit.name} (${toUnit.symbol}) with our free online converter.`,
        popular: popular.has(id),
      });
    }
  }

  return allPairs;
}

// Currency units for the registry
const CURRENCY_UNITS = CURRENCIES.map(c => ({
  id: c.code,
  name: `${c.name} (${c.code})`,
  symbol: c.code,
  aliases: [c.code.toLowerCase()],
}));

export const CATEGORIES: ConverterCategory[] = [
  {
    id: 'length',
    name: 'Length',
    slug: 'length',
    description: 'Convert between meters, feet, miles, kilometers, inches, and more length units.',
    icon: '📏',
    color: 'blue',
    units: LENGTH_UNITS,
    converters: makeAllConverters('length', LENGTH_UNITS, LENGTH_POPULAR_PAIRS),
    popular: true,
  },
  {
    id: 'weight',
    name: 'Weight & Mass',
    slug: 'weight',
    description: 'Convert kilograms to pounds, grams to ounces, and all weight units.',
    icon: '⚖️',
    color: 'green',
    units: WEIGHT_UNITS,
    converters: makeAllConverters('weight', WEIGHT_UNITS, WEIGHT_POPULAR_PAIRS),
    popular: true,
  },
  {
    id: 'temperature',
    name: 'Temperature',
    slug: 'temperature',
    description: 'Convert Celsius to Fahrenheit, Kelvin, and other temperature scales.',
    icon: '🌡️',
    color: 'orange',
    units: TEMPERATURE_UNITS,
    converters: makeAllConverters('temperature', TEMPERATURE_UNITS, TEMPERATURE_POPULAR_PAIRS),
    popular: true,
  },
  {
    id: 'currency',
    name: 'Currency',
    slug: 'currency',
    description: 'Live currency conversion with real-time exchange rates for 40+ currencies.',
    icon: '💱',
    color: 'yellow',
    units: CURRENCY_UNITS,
    converters: makeConverters('currency', POPULAR_CURRENCY_PAIRS.flatMap(p => [p, { from: p.to, to: p.from }]), CURRENCY_UNITS),
    popular: true,
  },
  {
    id: 'area',
    name: 'Area',
    slug: 'area',
    description: 'Convert square meters, acres, hectares, square feet, and more.',
    icon: '📐',
    color: 'purple',
    units: AREA_UNITS,
    converters: makeAllConverters('area', AREA_UNITS, AREA_POPULAR_PAIRS),
  },
  {
    id: 'volume',
    name: 'Volume',
    slug: 'volume',
    description: 'Convert liters, gallons, milliliters, cubic feet, and all volume units.',
    icon: '🧊',
    color: 'cyan',
    units: VOLUME_UNITS,
    converters: makeAllConverters('volume', VOLUME_UNITS, VOLUME_POPULAR_PAIRS),
  },
  {
    id: 'speed',
    name: 'Speed',
    slug: 'speed',
    description: 'Convert km/h to mph, m/s to knots, and all speed units.',
    icon: '💨',
    color: 'teal',
    units: SPEED_UNITS,
    converters: makeAllConverters('speed', SPEED_UNITS, SPEED_POPULAR_PAIRS),
  },
  {
    id: 'time',
    name: 'Time',
    slug: 'time',
    description: 'Convert seconds, minutes, hours, days, weeks, years, and centuries.',
    icon: '⏱️',
    color: 'indigo',
    units: TIME_UNITS,
    converters: makeAllConverters('time', TIME_UNITS, TIME_POPULAR_PAIRS),
  },
  {
    id: 'digital',
    name: 'Digital Storage',
    slug: 'digital',
    description: 'Convert bytes, kilobytes, megabytes, gigabytes, terabytes.',
    icon: '💾',
    color: 'slate',
    units: DIGITAL_UNITS,
    converters: makeAllConverters('digital', DIGITAL_UNITS, DIGITAL_POPULAR_PAIRS),
  },
  {
    id: 'cooking',
    name: 'Cooking',
    slug: 'cooking',
    description: 'Convert cooking measurements: cups, tablespoons, teaspoons, and more.',
    icon: '🍳',
    color: 'amber',
    units: VOLUME_UNITS.filter(u => ['us-cup', 'tablespoon', 'teaspoon', 'us-fluid-oz', 'us-pint', 'liter', 'milliliter'].includes(u.id)),
    converters: makeAllConverters('cooking', VOLUME_UNITS.filter(u => ['us-cup', 'tablespoon', 'teaspoon', 'us-fluid-oz', 'us-pint', 'liter', 'milliliter'].includes(u.id)), []),
  },
];

// ─── Centralized convert dispatch ─────────────────────────────────────────────
export type ConvertFn = (value: number, from: string, to: string) => ConversionResult;

export const CONVERT_FNS: Record<string, ConvertFn> = {
  length: convertLength,
  weight: convertWeight,
  temperature: convertTemperature,
  area: convertArea,
  volume: convertVolume,
  speed: convertSpeed,
  time: convertTime,
  digital: convertDigital,
  cooking: convertVolume,
};

export function runConversion(categoryId: string, value: number, from: string, to: string): ConversionResult | null {
  const fn = CONVERT_FNS[categoryId];
  if (!fn) return null;
  return fn(value, from, to);
}

// Flat lookup maps
export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.slug, c]));

export function getCategoryBySlug(slug: string): ConverterCategory | undefined {
  return CATEGORY_MAP[slug];
}

export function getConverterBySlug(categorySlug: string, converterSlug: string): Converter | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.converters.find(c => c.id === converterSlug);
}

export function getAllConverterPaths(): { category: string; converter: string }[] {
  return CATEGORIES.flatMap(cat =>
    cat.converters.map(conv => ({
      category: cat.slug,
      converter: conv.id,
    }))
  );
}

export function isPopularPath(categorySlug: string, converterSlug: string): boolean {
  const conv = getConverterBySlug(categorySlug, converterSlug);
  return conv?.popular === true;
}

export function getPopularConverters(limit = 12): Array<Converter & { categoryName: string; categoryIcon: string }> {
  return CATEGORIES.flatMap(cat =>
    cat.converters
      .filter(c => c.popular)
      .map(c => ({ ...c, categoryName: cat.name, categoryIcon: cat.icon }))
  ).slice(0, limit);
}

// ─── Pre-computed flat search index ───────────────────────────────────────────
type SearchEntry = {
  type: 'converter' | 'category';
  title: string;
  href: string;
  icon: string;
  category: string;
  // pre-lowercased fields for fast matching
  _title: string;
  _from: string;
  _to: string;
  _categoryName: string;
};

const SEARCH_INDEX: SearchEntry[] = (() => {
  const out: SearchEntry[] = [];
  for (const cat of CATEGORIES) {
    out.push({
      type: 'category',
      title: cat.name,
      href: `/${cat.slug}`,
      icon: cat.icon,
      category: cat.name,
      _title: cat.name.toLowerCase(),
      _from: '',
      _to: '',
      _categoryName: cat.name.toLowerCase(),
    });
    for (const conv of cat.converters) {
      out.push({
        type: 'converter',
        title: conv.title,
        href: `/${cat.slug}/${conv.id}`,
        icon: cat.icon,
        category: cat.name,
        _title: conv.title.toLowerCase(),
        _from: conv.from.toLowerCase(),
        _to: conv.to.toLowerCase(),
        _categoryName: cat.name.toLowerCase(),
      });
    }
  }
  return out;
})();

export function searchConverters(query: string, limit = 10) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();

  const results: Array<{ type: 'converter' | 'category'; title: string; href: string; icon: string; category: string }> = [];

  for (const entry of SEARCH_INDEX) {
    const match = entry.type === 'category'
      ? entry._title.includes(q)
      : (entry._title.includes(q) || entry._from.includes(q) || entry._to.includes(q));

    if (match) {
      results.push({
        type: entry.type,
        title: entry.title,
        href: entry.href,
        icon: entry.icon,
        category: entry.category,
      });
      if (results.length >= limit) break;
    }
  }

  return results;
}

export function getRelatedConverters(categorySlug: string, currentId: string, limit = 6): Converter[] {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return category.converters
    .filter(c => c.id !== currentId && c.popular)
    .slice(0, limit);
}
