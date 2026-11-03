import { convertTemperature } from './converters/temperature';

/**
 * Cooking cluster helpers (Batch G) — ingredient cups ↔ grams and the
 * oven-temperature chart.
 *
 * Cups-to-grams has no universal factor: it depends on the ingredient's
 * density, so the converter registry's unit-to-unit pair model cannot
 * express it (Batch G routes these pages through dedicated pages under
 * /cooking/ instead, mirroring Batch F's height cluster).
 *
 * Every weight below is the grams in 1 US cup from one published source —
 * the King Arthur Baking Ingredient Weight Chart
 * (https://www.kingarthurbaking.com/learn/ingredient-weight-chart) —
 * verified against that chart on 2026-11-03. All results on the pages are
 * COMPUTED from these per-cup weights (cups × grams-per-cup, or the
 * inverse); no converted result is stored or hand-typed. Cup weights are
 * approximations by nature — how an ingredient is scooped, sifted or
 * packed changes them — and the pages say so wherever the values appear.
 */

export const INGREDIENT_SOURCE = {
  name: 'King Arthur Baking — Ingredient Weight Chart',
  url: 'https://www.kingarthurbaking.com/learn/ingredient-weight-chart',
} as const;

export interface Ingredient {
  /** URL/id slug, e.g. 'flour' → /cooking/flour-cups-to-grams */
  id: string;
  /** Display name, e.g. 'All-Purpose Flour' */
  name: string;
  /** Grams in 1 US cup, per the King Arthur chart (see header note). */
  gramsPerCup: number;
  /** Short measuring note shown on the ingredient's page. */
  note: string;
}

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'flour',
    name: 'All-Purpose Flour',
    gramsPerCup: 120,
    note: 'King Arthur weighs flour spooned into the cup and levelled. Scooping straight from the bag packs in more — often 140 g or beyond — which is why flour is the ingredient where cups mislead most.',
  },
  {
    id: 'sugar',
    name: 'Granulated Sugar',
    gramsPerCup: 198,
    note: 'Granulated sugar pours and levels consistently, so its cup weight is one of the most stable on this page.',
  },
  {
    id: 'brown-sugar',
    name: 'Brown Sugar (packed)',
    gramsPerCup: 213,
    note: 'The chart value is for brown sugar packed firmly into the cup, the way recipes intend. Loosely filled, the same cup weighs noticeably less.',
  },
  {
    id: 'powdered-sugar',
    name: 'Powdered Sugar (confectioners’)',
    gramsPerCup: 113,
    note: 'The chart value is for unsifted powdered sugar. Sifting before measuring makes the cup lighter still, so weigh after sifting only if the recipe says to.',
  },
  {
    id: 'butter',
    name: 'Butter',
    gramsPerCup: 227,
    note: 'One cup of butter is two standard sticks (1 stick = ½ cup = 113 g), so butter is the easiest ingredient to check against a scale.',
  },
  {
    id: 'cocoa',
    name: 'Cocoa Powder (unsweetened)',
    gramsPerCup: 84,
    note: 'The chart lists ½ cup of unsweetened cocoa at 42 g, so a full cup is 84 g. Dutch-processed and natural cocoa weigh the same per cup on the chart.',
  },
  {
    id: 'honey',
    name: 'Honey',
    gramsPerCup: 340,
    note: 'The chart lists honey at 21 g per tablespoon; a cup is 16 tablespoons, which works out to the 340 g (12 oz) a cup of honey weighs. Grease the cup first and it pours out cleanly.',
  },
  {
    id: 'rolled-oats',
    name: 'Rolled Oats (old-fashioned)',
    gramsPerCup: 89,
    note: 'The chart value is for generic old-fashioned or quick-cooking oats. Flakes vary by brand and how settled they are in the cup, so treat this one as a closer-than-usual approximation.',
  },
];

export function getIngredient(id: string): Ingredient | undefined {
  return INGREDIENTS.find(i => i.id === id);
}

/** Cups → grams for an ingredient: cups × its grams-per-cup weight. */
export function cupsToGrams(ingredientId: string, cups: number): number | null {
  const ing = getIngredient(ingredientId);
  if (!ing) return null;
  return cups * ing.gramsPerCup;
}

/** Grams → cups for an ingredient: grams ÷ its grams-per-cup weight. */
export function gramsToCups(ingredientId: string, grams: number): number | null {
  const ing = getIngredient(ingredientId);
  if (!ing) return null;
  return grams / ing.gramsPerCup;
}

/** Grams in one tablespoon of an ingredient (1 cup = 16 tablespoons). */
export function gramsPerTablespoon(ingredientId: string): number | null {
  const ing = getIngredient(ingredientId);
  if (!ing) return null;
  return ing.gramsPerCup / 16;
}

/** Format a gram result the way recipes quote it: whole grams at ≥ 10 g. */
export function fmtGrams(v: number): string {
  if (v >= 10) return String(Math.round(v));
  return String(Number(v.toFixed(1)));
}

/** Format a cup result to at most 2 decimals, trailing zeros trimmed. */
export function fmtCups(v: number): string {
  return String(Number(v.toFixed(2)));
}

/** Cup amounts shown in the conversion tables, with display labels. */
export const CUP_TABLE_AMOUNTS: { cups: number; label: string }[] = [
  { cups: 0.25, label: '¼ cup' },
  { cups: 1 / 3, label: '⅓ cup' },
  { cups: 0.5, label: '½ cup' },
  { cups: 2 / 3, label: '⅔ cup' },
  { cups: 0.75, label: '¾ cup' },
  { cups: 1, label: '1 cup' },
  { cups: 1.5, label: '1½ cups' },
  { cups: 2, label: '2 cups' },
  { cups: 3, label: '3 cups' },
  { cups: 4, label: '4 cups' },
];

/** Gram amounts shown in the grams → cups tables. */
export const GRAM_TABLE_AMOUNTS = [50, 100, 125, 150, 200, 250, 300, 400, 500];

/** Registry id of the oven chart page. */
export const OVEN_CHART_ID = 'oven-temperature-chart';

export interface OvenRow {
  celsius: number;
  /** Exact Fahrenheit, computed with the site's temperature engine. */
  fahrenheit: number;
  gasMark: string;
  description: string;
}

// Gas-mark ↔ Celsius pairings are the standard published oven-chart values
// (gas mark 4 = 180 °C, etc.). The Fahrenheit column is NOT the rounded
// figure printed on most charts — it is computed exactly with the site's
// temperature engine (180 °C = 356 °F exactly), and the chart page notes
// where US recipes round it (350 °F).
const OVEN_ROWS: { celsius: number; gasMark: string; description: string }[] = [
  { celsius: 110, gasMark: '¼', description: 'Very slow — drying, meringues' },
  { celsius: 120, gasMark: '½', description: 'Very slow — slow roasting' },
  { celsius: 140, gasMark: '1', description: 'Slow — rich fruit cakes' },
  { celsius: 150, gasMark: '2', description: 'Slow — braises, cheesecakes' },
  { celsius: 160, gasMark: '3', description: 'Moderately slow — sponge cakes' },
  { celsius: 180, gasMark: '4', description: 'Moderate — cookies, most cakes' },
  { celsius: 190, gasMark: '5', description: 'Moderately hot — pies, puff pastry' },
  { celsius: 200, gasMark: '6', description: 'Hot — breads, roast vegetables' },
  { celsius: 220, gasMark: '7', description: 'Hot — pizza, flatbreads' },
  { celsius: 230, gasMark: '8', description: 'Very hot — searing, pizza' },
  { celsius: 240, gasMark: '9', description: 'Very hot — maximum for most home ovens' },
];

export const OVEN_CHART: OvenRow[] = OVEN_ROWS.map(r => ({
  ...r,
  fahrenheit: convertTemperature(r.celsius, 'celsius', 'fahrenheit').value,
}));

/** Look up the oven row for an exact Celsius value, if it is a chart row. */
export function ovenRowFor(celsius: number): OvenRow | undefined {
  return OVEN_CHART.find(r => r.celsius === celsius);
}
