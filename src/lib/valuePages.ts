import type { ConversionResult, Unit } from '@/types';
import { convertLength, LENGTH_UNITS } from './converters/length';
import { convertWeight, WEIGHT_UNITS } from './converters/weight';
import { convertTemperature, TEMPERATURE_UNITS } from './converters/temperature';
import { convertVolume, VOLUME_UNITS } from './converters/units';
import { cmToFeetInches } from './height';
import { formatNumber } from './utils';

/**
 * Specific-value + chart pages (Batch H) — the "70 kg to lbs" layer.
 *
 * Two page types sit on top of the existing head pairs, following the
 * Batch F (height) / Batch G (cooking) pattern: the pages are registered
 * in their pair's category (so the sitemap, hub ItemList and search index
 * pick them up) but are RENDERED by dedicated routes, because a page about
 * one specific value — or a full printable chart — is not a unit-to-unit
 * pair page.
 *
 *  - Specific-value pages answer one searched value per page ("70 kg to
 *    lbs", "37 °C to °F") with the direct answer, the exact working, a
 *    surrounding-values table, and links to the pair converter and chart.
 *  - Chart pages give one head pair a complete, print-friendly table.
 *
 * Value selection (deliberately tight — depth on head pairs, not scale):
 *  - kg→lb at the round body-weight numbers people look up (50–100 kg),
 *    plus the three most natural reverse lookups (100/150/200 lb).
 *  - cm→inch at object sizes (1–30 cm). The 160–190 cm range is NOT
 *    repeated here: those are heights, and Batch F already answers them
 *    as feet+inches pages — a "170 cm in inches" page would collide with
 *    that intent. inch→cm gets the classic ruler sizes (6/10/12 in).
 *  - km→mile at race and road distances (1/5/10/50/100), mile→km at 1/5/10.
 *  - °C→°F at weather, body and oven landmarks (0–200 °C), °F→°C at the
 *    North-American weather band (70–100 °F). No negative-value pages:
 *    slugs stay clean and the chart covers the sub-zero range.
 *
 * Every number is computed with the category's real conversion function —
 * nothing is stored as a pre-baked result.
 */

// ─── Conversion dispatch (direct imports — no registry cycle) ────────────────

const CONVERT_BY_CATEGORY: Record<string, (value: number, from: string, to: string) => ConversionResult> = {
  length: convertLength,
  weight: convertWeight,
  temperature: convertTemperature,
  volume: convertVolume,
};

export function convertSpecial(category: string, value: number, from: string, to: string): ConversionResult {
  const fn = CONVERT_BY_CATEGORY[category];
  if (!fn) throw new Error(`No conversion function for category: ${category}`);
  return fn(value, from, to);
}

/** Result formatted the way the site formats numbers (≤6 significant figures). */
export function specialResultText(category: string, value: number, from: string, to: string): string {
  return formatNumber(convertSpecial(category, value, from, to).value, 6);
}

// ─── Unit lookups for the four categories these pages span ───────────────────

const UNITS_BY_CATEGORY: Record<string, Unit[]> = {
  length: LENGTH_UNITS,
  weight: WEIGHT_UNITS,
  temperature: TEMPERATURE_UNITS,
  volume: VOLUME_UNITS,
};

export function specialUnit(category: string, unitId: string): Unit {
  const unit = UNITS_BY_CATEGORY[category]?.find(u => u.id === unitId);
  if (!unit) throw new Error(`Unknown unit ${unitId} in category ${category}`);
  return unit;
}

// ─── Specific-value pages ────────────────────────────────────────────────────

export interface SpecificValuePairDef {
  category: string;
  from: string;
  to: string;
  /** Slug fragments: the page id is `${value}-${fromSlug}-to-${toSlug}`. */
  fromSlug: string;
  toSlug: string;
  /** Step between rows of the surrounding-values table. */
  step: number;
  values: number[];
}

export const SPECIFIC_VALUE_PAIRS: SpecificValuePairDef[] = [
  { category: 'weight', from: 'kilogram', to: 'pound', fromSlug: 'kg', toSlug: 'lb', step: 1, values: [50, 60, 70, 80, 90, 100] },
  { category: 'weight', from: 'pound', to: 'kilogram', fromSlug: 'lb', toSlug: 'kg', step: 5, values: [100, 150, 200] },
  { category: 'length', from: 'centimeter', to: 'inch', fromSlug: 'cm', toSlug: 'inch', step: 1, values: [1, 2, 3, 5, 10, 15, 20, 30] },
  { category: 'length', from: 'inch', to: 'centimeter', fromSlug: 'inch', toSlug: 'cm', step: 1, values: [6, 10, 12] },
  { category: 'length', from: 'kilometer', to: 'mile', fromSlug: 'km', toSlug: 'mile', step: 1, values: [1, 5, 10, 50, 100] },
  { category: 'length', from: 'mile', to: 'kilometer', fromSlug: 'mile', toSlug: 'km', step: 1, values: [1, 5, 10] },
  { category: 'temperature', from: 'celsius', to: 'fahrenheit', fromSlug: 'celsius', toSlug: 'fahrenheit', step: 1, values: [0, 20, 25, 30, 37, 40, 100, 180, 200] },
  { category: 'temperature', from: 'fahrenheit', to: 'celsius', fromSlug: 'fahrenheit', toSlug: 'celsius', step: 2, values: [70, 80, 90, 100] },
];

export interface ValuePageDef {
  id: string;
  category: string;
  from: string;
  to: string;
  value: number;
  step: number;
  /** The pair converter page this value belongs to, e.g. 'kilogram-to-pound'. */
  pairId: string;
}

export function valuePageId(pair: SpecificValuePairDef, value: number): string {
  return `${value}-${pair.fromSlug}-to-${pair.toSlug}`;
}

export const VALUE_PAGE_DEFS: ValuePageDef[] = SPECIFIC_VALUE_PAIRS.flatMap(pair =>
  pair.values.map(value => ({
    id: valuePageId(pair, value),
    category: pair.category,
    from: pair.from,
    to: pair.to,
    value,
    step: pair.step,
    pairId: `${pair.from}-to-${pair.to}`,
  }))
);

export const VALUE_PAGE_IDS = new Set(VALUE_PAGE_DEFS.map(d => d.id));

export function getValuePageDef(id: string): ValuePageDef | undefined {
  return VALUE_PAGE_DEFS.find(d => d.id === id);
}

/** Sibling value pages for the same ordered pair (link targets). */
export function siblingValueDefs(def: ValuePageDef): ValuePageDef[] {
  return VALUE_PAGE_DEFS.filter(d => d.pairId === def.pairId && d.id !== def.id);
}

/** Rows of the surrounding-values table: value ± 5 steps, centred on the page value. */
export function surroundingRows(def: ValuePageDef): { value: number; result: string }[] {
  const rows: { value: number; result: string }[] = [];
  for (let i = -5; i <= 5; i++) {
    const v = def.value + i * def.step;
    rows.push({ value: v, result: specialResultText(def.category, v, def.from, def.to) });
  }
  return rows;
}

// ─── Chart pages ─────────────────────────────────────────────────────────────

export interface ChartPageDef {
  id: string;
  category: string;
  from: string;
  to: string;
  pairId: string;
  rows: number[];
}

function range(start: number, end: number, step: number): number[] {
  const out: number[] = [];
  for (let v = start; v <= end; v += step) out.push(v);
  return out;
}

export const CHART_PAGE_DEFS: ChartPageDef[] = [
  {
    id: 'kg-to-lb-chart',
    category: 'weight',
    from: 'kilogram',
    to: 'pound',
    pairId: 'kilogram-to-pound',
    rows: range(1, 100, 1),
  },
  {
    id: 'cm-to-inch-chart',
    category: 'length',
    from: 'centimeter',
    to: 'inch',
    pairId: 'centimeter-to-inch',
    rows: range(1, 100, 1),
  },
  {
    id: 'km-to-mile-chart',
    category: 'length',
    from: 'kilometer',
    to: 'mile',
    pairId: 'kilometer-to-mile',
    rows: range(1, 100, 1),
  },
  {
    id: 'celsius-to-fahrenheit-chart',
    category: 'temperature',
    from: 'celsius',
    to: 'fahrenheit',
    pairId: 'celsius-to-fahrenheit',
    // Every 5 degrees across the full weather-to-oven range, plus the
    // landmark rows people actually look up (0, 37 body temperature, 100).
    rows: [...new Set([...range(-40, 250, 5), 0, 37, 100])].sort((a, b) => a - b),
  },
  {
    id: 'm-to-ft-chart',
    category: 'length',
    from: 'meter',
    to: 'foot',
    pairId: 'meter-to-foot',
    rows: range(1, 100, 1),
  },
  {
    id: 'liter-to-gallon-chart',
    category: 'volume',
    from: 'liter',
    to: 'us-gallon',
    pairId: 'liter-to-us-gallon',
    rows: range(1, 100, 1),
  },
];

export const CHART_PAGE_IDS = new Set(CHART_PAGE_DEFS.map(d => d.id));

export function getChartPageDef(id: string): ChartPageDef | undefined {
  return CHART_PAGE_DEFS.find(d => d.id === id);
}

/** The chart page for an ordered pair, in either direction (kg→lb chart serves lb→kg pages too). */
export function chartDefForPair(from: string, to: string): ChartPageDef | undefined {
  return CHART_PAGE_DEFS.find(
    d => (d.from === from && d.to === to) || (d.from === to && d.to === from)
  );
}

/** Computed chart rows: input value → formatted result. */
export function chartRows(def: ChartPageDef): { value: number; result: string }[] {
  return def.rows.map(value => ({
    value,
    result: specialResultText(def.category, value, def.from, def.to),
  }));
}

/**
 * Optional context column for a chart row. Only the metre→foot chart gets
 * one: the same length expressed as feet + inches (how room dimensions and
 * heights are actually stated), computed with the Batch F height helpers.
 */
export function chartContext(def: ChartPageDef, value: number): string | null {
  if (def.id === 'm-to-ft-chart') {
    return cmToFeetInches(value * 100).fractionDisplay;
  }
  return null;
}

// ─── Combined registry helpers ───────────────────────────────────────────────

export const SPECIAL_PAGE_IDS = new Set([...VALUE_PAGE_IDS, ...CHART_PAGE_IDS]);

/**
 * Cross-links from a pair converter page into this layer: the pair's chart
 * page plus its specific-value pages (CN-16 pattern, as Batch F did for the
 * height anchors). Keyed by ordered pair id, e.g. 'kilogram-to-pound'.
 */
export const SPECIAL_LINKS_BY_PAIR: Record<string, { href: string; label: string }[]> = (() => {
  const out: Record<string, { href: string; label: string }[]> = {};
  const push = (pairId: string, link: { href: string; label: string }) => {
    (out[pairId] ??= []).push(link);
  };
  for (const def of VALUE_PAGE_DEFS) {
    const fromU = specialUnit(def.category, def.from);
    const toU = specialUnit(def.category, def.to);
    push(def.pairId, {
      href: `/${def.category}/${def.id}`,
      label: `${def.value} ${fromU.symbol} to ${toU.symbol} — exact conversion`,
    });
  }
  for (const def of CHART_PAGE_DEFS) {
    const fromU = specialUnit(def.category, def.from);
    const toU = specialUnit(def.category, def.to);
    push(def.pairId, {
      href: `/${def.category}/${def.id}`,
      label: `${fromU.name} to ${toU.name} Chart — full printable table`,
    });
  }
  return out;
})();
