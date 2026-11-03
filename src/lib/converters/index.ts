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
  PRESSURE_UNITS, PRESSURE_POPULAR_PAIRS,
  ENERGY_UNITS, ENERGY_POPULAR_PAIRS,
  POWER_UNITS, POWER_POPULAR_PAIRS,
  TORQUE_UNITS, TORQUE_POPULAR_PAIRS,
  FUEL_UNITS, FUEL_POPULAR_PAIRS,
  convertArea, convertVolume, convertSpeed, convertTime, convertDigital,
  convertPressure, convertEnergy, convertPower, convertTorque, convertFuel,
} from './units';
import { CURRENCIES, POPULAR_CURRENCY_PAIRS } from './currency';
import { FEET_INCHES_ID, HEIGHT_VALUES, cmToFeetInches } from '../height';
import { INGREDIENTS, cupsToGrams, gramsToCups, ovenRowFor, OVEN_CHART_ID } from '../cooking';
import {
  VALUE_PAGE_DEFS, CHART_PAGE_DEFS,
  specialUnit, specialResultText,
} from '../valuePages';

export { VALUE_PAGE_IDS, CHART_PAGE_IDS, SPECIAL_PAGE_IDS } from '../valuePages';

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

// ─── Height cluster (Batch F) ─────────────────────────────────────────────
// Height pages (cm ↔ feet+inches converters, a 140–210 cm chart, and
// specific-value pages) are registered here so the sitemap, hub ItemList
// and search index pick them up like any other popular converter — but
// they are RENDERED by the dedicated route src/app/length/[heightPage],
// because feet+inches is a compound result the unit-to-unit pair template
// cannot express. Example figures in the descriptions are computed with
// the real conversion helpers from ../height, never hand-typed.
export const HEIGHT_CONVERTERS: Converter[] = [
  {
    id: 'centimeter-to-feet-inches',
    from: 'centimeter',
    to: FEET_INCHES_ID,
    category: 'length',
    title: 'Centimeter to Feet & Inches',
    description: `Convert centimeters to feet and inches instantly — for example, 175 cm is ${cmToFeetInches(175).display}. With fractions, formula and a full height chart.`,
    popular: true,
  },
  {
    id: 'feet-inches-to-centimeter',
    from: FEET_INCHES_ID,
    to: 'centimeter',
    category: 'length',
    title: 'Feet & Inches to Centimeter',
    description: 'Convert feet and inches to centimeters instantly — enter a height like 5 ft 9 in and get the exact centimetre equivalent, with formula and chart.',
    popular: true,
  },
  {
    id: 'height-chart',
    from: 'centimeter',
    to: FEET_INCHES_ID,
    category: 'length',
    title: 'Height Chart (CM to Feet & Inches)',
    description: 'Full height conversion chart: every centimetre from 140 to 210 cm converted to feet and inches, with common heights highlighted.',
    popular: true,
  },
  ...HEIGHT_VALUES.map(cm => ({
    id: `${cm}-cm-to-feet-inches`,
    from: 'centimeter',
    to: FEET_INCHES_ID,
    category: 'length',
    title: `${cm} cm in Feet and Inches`,
    description: `${cm} cm in feet and inches is ${cmToFeetInches(cm).display} (${cmToFeetInches(cm).symbolDisplay}). Exact conversion, formula and a ${cm - 5}–${cm + 5} cm mini chart.`,
    popular: true,
  })),
];

export const HEIGHT_CONVERTER_IDS = new Set(HEIGHT_CONVERTERS.map(c => c.id));

// ─── Cooking cluster (Batch G) ────────────────────────────────────────────
// Ingredient cups↔grams pages, the reverse converter and the oven chart
// are registered here so the sitemap, hub ItemList and search index pick
// them up like any other popular converter — but they are RENDERED by the
// dedicated route src/app/cooking/[cookingPage], because a cup of flour
// and a cup of sugar weigh different amounts: grams-per-cup depends on the
// ingredient (King Arthur Baking chart weights, src/lib/cooking), which
// the unit-to-unit pair template cannot express. Example figures in the
// descriptions are computed with the real helpers from ../cooking.
export const COOKING_CONVERTERS: Converter[] = [
  {
    id: 'cups-to-grams',
    from: 'cup',
    to: 'gram',
    category: 'cooking',
    title: 'Cups to Grams Converter',
    description: `Convert cups to grams for ${INGREDIENTS.length} baking ingredients — for example, 1 cup of all-purpose flour is ${cupsToGrams('flour', 1)} g. King Arthur Baking chart weights, full tables for every ingredient.`,
    popular: true,
  },
  {
    id: 'grams-to-cups',
    from: 'gram',
    to: 'cup',
    category: 'cooking',
    title: 'Grams to Cups Converter',
    description: `Convert grams to cups for ${INGREDIENTS.length} baking ingredients — for example, ${cupsToGrams('flour', 1)} g of all-purpose flour is ${gramsToCups('flour', 120)} cup. King Arthur Baking chart weights, full tables for every ingredient.`,
    popular: true,
  },
  {
    id: OVEN_CHART_ID,
    from: 'celsius',
    to: 'fahrenheit',
    category: 'cooking',
    title: 'Oven Temperature Chart (°C, °F, Gas Mark)',
    description: `Oven temperatures in Celsius, Fahrenheit and gas mark side by side — for example, 180 °C is ${ovenRowFor(180)?.fahrenheit} °F, gas mark ${ovenRowFor(180)?.gasMark}. Fahrenheit figures are exact conversions, not rounded chart values.`,
    popular: true,
  },
  ...INGREDIENTS.map(ing => ({
    id: `${ing.id}-cups-to-grams`,
    from: 'cup',
    to: 'gram',
    category: 'cooking',
    title: `${ing.name} — Cups to Grams`,
    description: `${ing.name}: 1 cup = ${ing.gramsPerCup} g. Convert cups to grams and grams to cups for ${ing.name.toLowerCase()} with full tables — King Arthur Baking chart weights.`,
    popular: true,
  })),
];

export const COOKING_CONVERTER_IDS = new Set(COOKING_CONVERTERS.map(c => c.id));

// Existing cooking pair pages promoted to popular (indexable, in the
// sitemap) as the cooking cluster's volume anchors — Batch F did the same
// for centimeter↔foot. The pages already exist; only their status changes.
export const COOKING_POPULAR_PAIRS = [
  { from: 'us-cup', to: 'milliliter' },
  { from: 'milliliter', to: 'us-cup' },
  { from: 'tablespoon', to: 'milliliter' },
  { from: 'milliliter', to: 'tablespoon' },
  { from: 'teaspoon', to: 'milliliter' },
  { from: 'milliliter', to: 'teaspoon' },
];

// ─── Specific-value + chart pages (Batch H) ──────────────────────────────
// "70 kg to lbs" value pages and printable chart pages for the head pairs,
// defined in src/lib/valuePages. Registered here so the sitemap, hub
// ItemList and search index pick them up like any other popular converter
// — but RENDERED by dedicated routes (src/app/weight|temperature|volume/
// [valuePage] and the length special-pages route), because a page about a
// single value, or a full chart, is not a unit-to-unit pair page. Example
// figures in the descriptions are computed with the real conversion
// functions via ../valuePages, never hand-typed.
function pluralUnitName(name: string): string {
  return name === 'Inch' ? 'Inches' : `${name}s`;
}

export const VALUE_PAGE_CONVERTERS: Converter[] = VALUE_PAGE_DEFS.map(def => {
  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  const result = specialResultText(def.category, def.value, def.from, def.to);
  return {
    id: def.id,
    from: def.from,
    to: def.to,
    category: def.category,
    title:
      def.category === 'temperature'
        ? `${def.value} ${fromU.symbol} in ${toU.name}`
        : `${def.value} ${fromU.symbol} in ${pluralUnitName(toU.name)}`,
    description:
      def.category === 'temperature'
        ? `${def.value} ${fromU.symbol} in ${toU.name} is ${result} ${toU.symbol}. Exact conversion with the formula, a table of nearby values, and the full ${fromU.name} to ${toU.name} converter and chart.`
        : `${def.value} ${fromU.symbol} in ${pluralUnitName(toU.name).toLowerCase()} is ${result} ${toU.symbol}. Exact conversion with the formula, a table of nearby values, and the full ${fromU.name} to ${toU.name} converter and chart.`,
    popular: true,
  };
});

export const CHART_PAGE_CONVERTERS: Converter[] = CHART_PAGE_DEFS.map(def => {
  const fromU = specialUnit(def.category, def.from);
  const toU = specialUnit(def.category, def.to);
  const first = def.rows[0];
  const last = def.rows[def.rows.length - 1];
  return {
    id: def.id,
    from: def.from,
    to: def.to,
    category: def.category,
    title: `${fromU.name} to ${toU.name} Chart`,
    description: `Full ${fromU.name} to ${toU.name} conversion chart: ${first} to ${last} ${fromU.symbol} in one printable table — every value computed with the exact conversion formula.`,
    popular: true,
  };
});

function specialConvertersFor(category: string): Converter[] {
  return [...VALUE_PAGE_CONVERTERS, ...CHART_PAGE_CONVERTERS].filter(c => c.category === category);
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
    converters: [...makeAllConverters('length', LENGTH_UNITS, LENGTH_POPULAR_PAIRS), ...HEIGHT_CONVERTERS, ...specialConvertersFor('length')],
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
    converters: [...makeAllConverters('weight', WEIGHT_UNITS, WEIGHT_POPULAR_PAIRS), ...specialConvertersFor('weight')],
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
    converters: [...makeAllConverters('temperature', TEMPERATURE_UNITS, TEMPERATURE_POPULAR_PAIRS), ...specialConvertersFor('temperature')],
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
    converters: [...makeAllConverters('volume', VOLUME_UNITS, VOLUME_POPULAR_PAIRS), ...specialConvertersFor('volume')],
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
    id: 'pressure',
    name: 'Pressure',
    slug: 'pressure',
    description: 'Convert pascals, bar, PSI, atmospheres, and torr for tires, weather, and engineering.',
    icon: '🎛️',
    color: 'rose',
    units: PRESSURE_UNITS,
    converters: makeAllConverters('pressure', PRESSURE_UNITS, PRESSURE_POPULAR_PAIRS),
  },
  {
    id: 'energy',
    name: 'Energy',
    slug: 'energy',
    description: 'Convert joules, calories, kilowatt-hours, and BTU for food, fitness, and utility bills.',
    icon: '⚡',
    color: 'lime',
    units: ENERGY_UNITS,
    converters: makeAllConverters('energy', ENERGY_UNITS, ENERGY_POPULAR_PAIRS),
  },
  {
    id: 'cooking',
    name: 'Cooking',
    slug: 'cooking',
    description: 'Convert cooking measurements: cups to grams by ingredient, cups, tablespoons, teaspoons, oven temperatures, and more.',
    icon: '🍳',
    color: 'amber',
    units: VOLUME_UNITS.filter(u => ['us-cup', 'tablespoon', 'teaspoon', 'us-fluid-oz', 'us-pint', 'liter', 'milliliter'].includes(u.id)),
    converters: [...makeAllConverters('cooking', VOLUME_UNITS.filter(u => ['us-cup', 'tablespoon', 'teaspoon', 'us-fluid-oz', 'us-pint', 'liter', 'milliliter'].includes(u.id)), COOKING_POPULAR_PAIRS), ...COOKING_CONVERTERS],
  },
  {
    id: 'fuel',
    name: 'Fuel Economy',
    slug: 'fuel',
    description: 'Convert MPG (US/UK), litres per 100km, and km per litre for cars and road trips.',
    icon: '⛽',
    color: 'sky',
    units: FUEL_UNITS,
    converters: makeAllConverters('fuel', FUEL_UNITS, FUEL_POPULAR_PAIRS),
  },
  {
    id: 'power',
    name: 'Power',
    slug: 'power',
    description: 'Convert horsepower to kilowatts, watts to horsepower, and metric horsepower (PS) for engines, motors, and EVs.',
    icon: '🔌',
    color: 'violet',
    units: POWER_UNITS,
    converters: makeAllConverters('power', POWER_UNITS, POWER_POPULAR_PAIRS),
  },
  {
    id: 'torque',
    name: 'Torque',
    slug: 'torque',
    description: 'Convert newton meters to foot-pounds and inch-pounds for engines, fasteners, wrenches, and tools.',
    icon: '🔧',
    color: 'red',
    units: TORQUE_UNITS,
    converters: makeAllConverters('torque', TORQUE_UNITS, TORQUE_POPULAR_PAIRS),
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
  pressure: convertPressure,
  energy: convertEnergy,
  power: convertPower,
  torque: convertTorque,
  fuel: convertFuel,
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

// Looks up which category a converter id belongs to, regardless of caller context.
// Useful for building links (e.g. blog "related converters") without hardcoding categories.
export function getCategoryForConverterId(converterId: string): ConverterCategory | undefined {
  return CATEGORIES.find(cat => cat.converters.some(c => c.id === converterId));
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
