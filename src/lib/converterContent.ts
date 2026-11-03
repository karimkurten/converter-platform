import type { Converter, ConverterCategory } from '@/types';
import { CONVERT_FNS } from './converters';
import { getUnitFact, getCurrencyRegion } from './unitFacts';
import { getPairDepth } from './converterDepth';

/**
 * Generates unique, SEO-optimized text for any converter page.
 * All content is produced programatically from converter metadata.
 *
 * CN-13/14/15 (2026-11-02): the prose is now generated from the SAME math
 * that computes the conversion tables, per conversion type:
 *  - linear   — a constant factor (most categories)
 *  - affine   — temperature: slope + offset, no single "equals" factor
 *  - inverse  — fuel economy pairs involving L/100km: result = C / value
 *  - currency — no static factor exists. Content either uses a dated
 *               mid-market snapshot passed in by the page, or omits every
 *               numeric rate claim. A placeholder factor of 0 is never
 *               published.
 * Unit systems / regions come from per-unit data in unitFacts.ts.
 */

const TABLE_VALUES = [0.1, 0.25, 0.5, 0.75, 1, 2, 3, 5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 250, 300, 500];

/** One worked example: an input, the exact working, and the computed result. */
export interface WorkedExample {
  /** Input with unit, e.g. "70 kg". */
  input: string;
  /** Optional factual note about the value (race distance, oven point…). */
  note?: string;
  /** The exact working, e.g. "70 kg × 2.20462". */
  working: string;
  /** Computed result with unit, e.g. "154.324 lb". */
  result: string;
}

export interface ConverterSeoContent {
  title: string;
  metaDescription: string;
  h2s: string[];
  intro: string;
  formulaSection: string;
  /** Mental-math shortcut line (honest approximation, error stated). */
  quickEstimate: string | null;
  /** Intro line for the worked-examples section. */
  examplesSection: string;
  examples: WorkedExample[];
  explanationSection: string;
  usageSection: string;
  mistakesSection: string;
  tableSection: string;
  /** Header for the optional context column (stones, race distances…). */
  tableContextHeader: string | null;
  table: { v: number; r: string; c?: string }[];
  faqs: { q: string; a: string }[];
  relatedConverters: Converter[];
  wordCount: number;
}

/** A dated mid-market currency rate snapshot (see currency.ts). */
export interface CurrencyRateInfo {
  /** Units of `to` per 1 unit of `from`. */
  rate: number;
  /** ISO date (YYYY-MM-DD) the rate was published for. */
  asOf: string;
}

/** Display formatting for table cells — handles very small values honestly. */
function fmt(n: number): string {
  if (n === 0) return '0';
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(2) + ' billion';
  if (a >= 1e6) return (n / 1e6).toFixed(2) + ' million';
  if (a >= 1e3) return Math.round(n).toLocaleString('en-US');
  if (a >= 0.001) return String(Number(n.toFixed(3)));
  return String(Number(n.toPrecision(2)));
}

/** Factor formatting at engine precision (matches ConversionResult.formula). */
function fmtFactor(n: number): string {
  if (n === 0) return '0';
  return String(Number(n.toPrecision(6)));
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

/** Category-appropriate "common mistakes" content (CN-15: replaces the old
 *  one-size text that warned about temperature scales on every page). */
function getCategoryMistakes(catId: string): string {
  const map: Record<string, string> = {
    length: 'dividing when you should multiply (using the factor in the wrong direction), and confusing inches with centimetres in a specification',
    weight: 'confusing pounds with kilograms when a scale, recipe or shipping form uses the other, and forgetting that a pound is 16 ounces when splitting a result into pounds and ounces',
    temperature: 'mixing up absolute temperatures with temperature differences — a difference of 1 °C is a difference of 1.8 °F with no offset — and forgetting the +32 offset when converting absolute values between Celsius and Fahrenheit',
    currency: 'converting with a stale exchange rate, and expecting to receive the mid-market rate at a bank or exchange bureau, which adds fees and a margin',
    area: 'converting area with a length factor — areas scale with the square of the factor, so 1 ft = 0.3048 m but 1 ft² = 0.0929 m²',
    volume: 'mixing US and Imperial gallons, which differ by about 20%, and confusing fluid ounces (volume) with ounces (weight)',
    speed: 'reading a speed limit or forecast in the wrong unit on a road trip, and confusing knots with miles per hour in aviation or at sea',
    time: 'assuming every month has exactly 30 days or every year exactly 52 weeks when converting longer spans',
    digital: 'confusing bits with bytes — there are 8 bits in a byte — and mixing decimal gigabytes (10⁹ bytes) with gibibytes (2³⁰ bytes)',
    pressure: 'mixing gauge pressure with absolute pressure, and confusing PSI with bar when inflating tyres or setting equipment',
    energy: 'confusing calories with kilocalories — the "Calories" on food labels are kilocalories — and using the wrong factor for BTU in heating calculations',
    cooking: 'assuming a cup of every ingredient weighs the same — a cup of flour weighs far less than a cup of sugar — and confusing tablespoons with teaspoons',
    fuel: 'treating MPG and L/100km as if a bigger number always means the same thing — they move in opposite directions — and mixing US and UK gallons when comparing MPG figures',
  };
  return map[catId] || 'using an approximate factor from memory instead of a verified constant';
}

type ConvKind = 'linear' | 'affine' | 'inverse' | 'other' | 'currency';

// ── Table context notes (Batch E) ─────────────────────────────────────────
// Factual reference points only: freezing/boiling, body temperature, standard
// oven points (Gas Mark equivalents are the standard published ones), and
// standard race distances. Keyed by the input value as a string.
const TEMP_CONTEXT: Record<string, Record<string, string>> = {
  celsius: {
    '-40': 'Where the °C and °F scales meet',
    '0': 'Water freezes',
    '37': 'Average body temperature',
    '100': 'Water boils at sea level',
    '180': 'Moderate oven (Gas Mark 4)',
    '200': 'Moderately hot oven (Gas Mark 6)',
    '220': 'Hot oven (Gas Mark 7)',
  },
  fahrenheit: {
    '-40': 'Where the °F and °C scales meet',
    '32': 'Water freezes',
    '98.6': 'Average body temperature',
    '212': 'Water boils at sea level',
    '350': 'Moderate oven',
    '400': 'Hot oven',
    '450': 'Very hot oven',
  },
  kelvin: {
    '273.15': 'Water freezes',
    '373.15': 'Water boils at sea level',
  },
};

const RACE_CONTEXT: Record<string, Record<string, string>> = {
  'kilometer-to-mile': { '5': '5K race', '10': '10K race', '21.0975': 'Half marathon', '42.195': 'Marathon' },
  'mile-to-kilometer': { '3.1': '5K race', '6.2': '10K race', '13.1': 'Half marathon', '26.2': 'Marathon' },
};

/** Stones & pounds breakdown of a pounds value (1 stone = 14 lb exactly). */
function stonesText(lb: number): string | undefined {
  const stones = Math.floor(lb / 14);
  if (stones < 1) return undefined;
  const rem = Math.round((lb - stones * 14) * 10) / 10;
  return `${stones} st ${String(Number(rem.toFixed(1)))} lb`;
}

/** Pick up to n values spread across a sorted candidate list. */
function pickSpread(values: number[], n: number): number[] {
  if (values.length <= n) return values;
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(values[Math.round((i * (values.length - 1)) / (n - 1))]);
  return [...new Set(out)];
}

/** Display formatting for an example's input value (keeps 21.0975, 98.6…). */
function fmtInput(v: number): string {
  return String(Number(v.toPrecision(8)));
}

export function generateConverterContent(
  converter: Converter,
  category: ConverterCategory,
  opts?: { currencyRate?: CurrencyRateInfo }
): ConverterSeoContent {
  const fromU = category.units.find(u => u.id === converter.from)!;
  const toU = category.units.find(u => u.id === converter.to)!;
  const fromFact = getUnitFact(fromU.id);
  const toFact = getUnitFact(toU.id);
  const isCurrency = category.id === 'currency';
  const depth = getPairDepth(category.id, converter.id);

  const fn = CONVERT_FNS[category.id];
  const probe = (v: number): number | null => {
    if (!fn) return null;
    try {
      const r = fn(v, converter.from, converter.to);
      return r && Number.isFinite(r.value) ? r.value : null;
    } catch {
      return null;
    }
  };

  // ── Classify the conversion and extract its true parameters ────────────
  let kind: ConvKind = 'other';
  let rate: number | null = null; // linear factor, or currency snapshot rate
  let slope = 0;
  let intercept = 0;
  let inverseConst = 0;
  const at = (v: number): number | null => probe(v);

  if (isCurrency) {
    kind = 'currency';
    rate = opts?.currencyRate && opts.currencyRate.rate > 0 ? opts.currencyRate.rate : null;
  } else if (category.id === 'temperature') {
    const r0 = at(0);
    const r1 = at(1);
    if (r0 !== null && r1 !== null) {
      kind = 'affine';
      intercept = r0;
      slope = r1 - r0;
    }
  } else {
    const r1 = at(1);
    const r2 = at(2);
    if (r1 !== null && r2 !== null) {
      const tol = Math.max(1e-9, Math.abs(r1) * 1e-9);
      if (Math.abs(r2 - 2 * r1) <= tol) {
        kind = 'linear';
        rate = r1;
      } else if (Math.abs(r2 - r1 / 2) <= Math.max(1e-9, Math.abs(r1) * 1e-9)) {
        kind = 'inverse';
        inverseConst = r1;
      }
    }
  }

  const rateStr = rate !== null ? fmtFactor(rate) : '';
  const slopeStr = fmtFactor(slope);
  const inverseConstStr = fmtFactor(inverseConst);
  const affineExpr = (() => {
    const base = slope === 1 ? `${toU.symbol} = ${fromU.symbol}` : `${toU.symbol} = ${fromU.symbol} × ${slopeStr}`;
    if (intercept > 0) return `${base} + ${fmtFactor(intercept)}`;
    if (intercept < 0) return `${base} - ${fmtFactor(-intercept)}`;
    return base;
  })();
  const inverseExpr = `${toU.symbol} = ${inverseConstStr} ÷ ${fromU.symbol}`;

  // ── Conversion table ─────────────────────────────────────────────────────
  // Head pairs (Batch E depth data) get ~50-row tables; everyone else keeps
  // the standard 20 values. Currency keeps the standard amount ladder and is
  // always computed from the dated snapshot — never a stored factor.
  const tableValues = !isCurrency && depth?.tableValues ? depth.tableValues : TABLE_VALUES;
  let table: { v: number; r: string; c?: string }[] = [];
  const rawResults: (number | null)[] = [];
  if (kind === 'currency') {
    if (rate !== null) {
      table = TABLE_VALUES.map(v => {
        const r = v * rate;
        rawResults.push(r);
        return { v, r: fmt(r) };
      });
    }
  } else {
    table = tableValues.map(v => {
      const r = at(v);
      rawResults.push(r);
      return { v, r: r === null ? '—' : fmt(r) };
    });
  }

  // ── Table context column (Batch E) ───────────────────────────────────────
  // Stones & pounds for weight results in pounds (or pounds inputs to kg),
  // standard reference points for temperature, race distances for km ↔ mi.
  let tableContextHeader: string | null = null;
  const attachContext = (header: string, contexts: (string | undefined)[], minShare = 0) => {
    if (contexts.filter(Boolean).length > minShare) {
      tableContextHeader = header;
      table = table.map((row, i) => ({ ...row, c: contexts[i] }));
    }
  };
  if (category.id === 'weight' && toU.id === 'pound') {
    const contexts = rawResults.map(r => (r !== null && r > 0 ? stonesText(r) : undefined));
    if (contexts.filter(Boolean).length >= Math.ceil(contexts.length / 2)) {
      attachContext('Also in stones & pounds', contexts);
    }
  } else if (category.id === 'weight' && fromU.id === 'pound' && toU.id === 'kilogram') {
    const contexts = table.map(row => stonesText(row.v));
    if (contexts.filter(Boolean).length >= Math.ceil(contexts.length / 2)) {
      attachContext('Pounds in stones & pounds', contexts);
    }
  } else if (category.id === 'temperature' && TEMP_CONTEXT[converter.from]) {
    attachContext('Good to know', table.map(row => TEMP_CONTEXT[converter.from][String(row.v)]));
  } else if (category.id === 'length' && RACE_CONTEXT[converter.id]) {
    attachContext('Race distances', table.map(row => RACE_CONTEXT[converter.id][String(row.v)]));
  }

  const relatedConverters = category.converters
    .filter(c => c.id !== converter.id)
    .slice(0, 10);

  // ── Title & Meta ─────────────────────────────────────────
  const title = `${fromU.name} to ${toU.name} Converter — Free & Instant | ConvertNow`;
  const metaDescription = `Convert ${fromU.name} (${fromU.symbol}) to ${toU.name} (${toU.symbol}) instantly. Free ${category.name.toLowerCase()} converter with formula, tables, and FAQs. No signup needed.`;

  // ── Content Sections ─────────────────────────────────────
  const intro = `Use our free ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} converter to get accurate results in under one second. This ${category.name.toLowerCase()} conversion tool is essential for anyone working in ${getIndustries(category.id)}. Simply enter your value above, click Convert, and see the result instantly with the exact formula shown. You can also reverse the conversion, copy the result, or adjust decimal precision.`;

  let formulaSection: string;
  if (kind === 'linear') {
    formulaSection = `The conversion formula is a single constant factor: 1 ${fromU.name} equals ${rateStr} ${toU.name}. Multiply any ${fromU.name.toLowerCase()} value by ${rateStr} to obtain the equivalent in ${toU.name.toLowerCase()}. All calculations on ConvertNow use verified constants, and the table below is computed with the same factor.`;
  } else if (kind === 'affine') {
    const at0 = at(0);
    const at1 = at(1);
    formulaSection = `Temperature conversion is not a simple multiplication, because the ${fromU.name} and ${toU.name} scales start at different zero points. The formula is ${affineExpr}. That is why there is no single "1 ${fromU.name} equals X ${toU.name}" factor: for reference, 0 ${fromU.name} equals ${at0 !== null ? fmt(at0) : '—'} ${toU.name}, and 1 ${fromU.name} equals ${at1 !== null ? fmt(at1) : '—'} ${toU.name}. The table below is computed with this exact formula.`;
  } else if (kind === 'inverse') {
    const at10 = at(10);
    formulaSection = `${fromU.name} and ${toU.name} are inversely related: as one goes up, the other goes down. The formula is ${inverseExpr}. So there is no constant "1 ${fromU.name} equals X ${toU.name}" factor — for example, 10 ${fromU.name} equals ${at10 !== null ? fmt(at10) : '—'} ${toU.name}. The table below is computed with this exact formula.`;
  } else if (kind === 'currency' && rate !== null) {
    formulaSection = `Exchange rates move constantly, so this pair has no permanent factor. At the mid-market rate as of ${opts!.currencyRate!.asOf}, 1 ${fromU.name} equals ${rateStr} ${toU.name}: multiply any ${fromU.name.toLowerCase()} amount by ${rateStr} to convert at that rate. The converter at the top of this page fetches current rates, so use it for today's figure — and note that banks and exchange services add their own margins, so the rate you actually receive will differ slightly.`;
  } else if (kind === 'currency') {
    formulaSection = `There is no fixed conversion factor between ${fromU.name} and ${toU.name}: the exchange rate is set by global currency markets and changes throughout the day. Rather than print a factor that would be out of date, this page deliberately publishes none — use the converter at the top of this page, which fetches current mid-market rates, to convert at today's rate. Banks and exchange services add their own fees and margins, so the rate you actually receive will differ slightly from the mid-market rate.`;
  } else {
    const one = fn ? fn(1, converter.from, converter.to) : null;
    formulaSection = one
      ? `This conversion does not reduce to a single multiplication factor. As a worked example, ${one.formula}. Use the converter above for exact results at any value.`
      : `Use the converter above for exact results at any value.`;
  }

  let explanationSection: string;
  if (isCurrency) {
    explanationSection = `${fromU.name} is the currency of ${getCurrencyRegion(converter.from)}, and ${toU.name} is the currency of ${getCurrencyRegion(converter.to)}. Unlike physical units, two currencies are not locked to a fixed ratio — their relative value floats on global foreign-exchange markets. Converting at the wrong rate, or with a rate that is days old, can lead to ${getMistakeExample(category.id)}.`;
  } else if (fromFact.system === toFact.system) {
    const scaleNote =
      kind === 'linear'
        ? `They measure the same quantity at different scales: 1 ${fromU.name} equals ${rateStr} ${toU.name}.`
        : kind === 'affine'
          ? 'They measure the same quantity on scales with different zero points, which is why the conversion needs an offset as well as a multiplier.'
          : kind === 'inverse'
            ? 'They express the same quantity in opposite ways, so a higher value in one means a lower value in the other.'
            : 'They measure the same quantity, so converting between them is a matter of applying the correct formula.';
    explanationSection = `${fromU.name} (${fromU.symbol}) and ${toU.name} (${toU.symbol}) are both ${fromFact.system} units. ${scaleNote} Even within one system, mixing the two units up without converting can lead to ${getMistakeExample(category.id)}.`;
  } else {
    explanationSection = `${fromU.name} (${fromU.symbol}) is part of the ${fromFact.system} measurement system, while ${toU.name} (${toU.symbol}) belongs to the ${toFact.system} system. The difference matters because a recipe, blueprint, or technical spec written in one system will not match measurements in the other unless converted precisely. Mixing systems without conversion can lead to ${getMistakeExample(category.id)}.`;
  }

  const usageSection = `${category.name} conversions are used every day in ${getIndustries(category.id)}. Professionals in these fields rely on fast, accurate tools because even small rounding errors multiply across large datasets or recipes. ConvertNow keeps your workflow moving with instant results, so you never have to open a spreadsheet or do manual math.`;

  const mistakesSection = `Common mistakes when converting ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} include ${getCategoryMistakes(category.id)}, and rounding too early in the calculation. Always verify the direction of the conversion and use the swap button if you need to reverse it.`;

  let tableSection: string;
  if (kind === 'currency' && rate !== null) {
    tableSection = `The following table converts common amounts from ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} at the mid-market rate as of ${opts!.currencyRate!.asOf} (1 ${fromU.name} = ${rateStr} ${toU.name}). Rates change daily — use the converter above for today's figures.`;
  } else if (kind === 'currency') {
    tableSection = `We do not publish a static table for ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()}: the exchange rate changes daily, so printed values would mislead. Use the converter at the top of this page, which fetches current mid-market rates, to convert any amount.`;
  } else {
    tableSection = `The following table shows ${table.length} common conversion values from ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} for fast reference without calculator use.`;
  }

  // ── FAQs ─────────────────────────────────────────────────
  const faqHowMany = (() => {
    if (kind === 'linear') {
      return {
        q: `How many ${toU.name.toLowerCase()} are in 1 ${fromU.name.toLowerCase()}?`,
        a: `There are ${rateStr} ${toU.name.toLowerCase()} in 1 ${fromU.name.toLowerCase()}.`,
      };
    }
    if (kind === 'affine') {
      const at0 = at(0);
      const at1 = at(1);
      return {
        q: `How many ${toU.name.toLowerCase()} are in 1 ${fromU.name.toLowerCase()}?`,
        a: `Temperature does not convert by a fixed ratio, because the scales have different zero points. A temperature of 1 ${fromU.name} equals ${at1 !== null ? fmt(at1) : '—'} ${toU.name}, and 0 ${fromU.name} equals ${at0 !== null ? fmt(at0) : '—'} ${toU.name}. The full formula is ${affineExpr}.`,
      };
    }
    if (kind === 'inverse') {
      const at10 = at(10);
      return {
        q: `How many ${toU.name.toLowerCase()} are in 1 ${fromU.name.toLowerCase()}?`,
        a: `There is no fixed ratio, because the relationship is inverse (${inverseExpr}). At exactly 1 ${fromU.name} the equivalent is ${inverseConstStr} ${toU.name}, but at 10 ${fromU.name} it is ${at10 !== null ? fmt(at10) : '—'} ${toU.name} — as the ${fromU.name.toLowerCase()} value rises, the ${toU.name.toLowerCase()} value falls.`,
      };
    }
    if (kind === 'currency' && rate !== null) {
      return {
        q: `How many ${toU.name.toLowerCase()} are in 1 ${fromU.name.toLowerCase()}?`,
        a: `At the mid-market rate as of ${opts!.currencyRate!.asOf}, there are ${rateStr} ${toU.name.toLowerCase()} in 1 ${fromU.name.toLowerCase()}. The rate changes daily, so check the converter above for today's figure.`,
      };
    }
    if (kind === 'currency') {
      return {
        q: `How many ${toU.name.toLowerCase()} are in 1 ${fromU.name.toLowerCase()}?`,
        a: `There is no fixed number: the ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} exchange rate changes throughout the day. Use the converter at the top of this page for today's mid-market rate.`,
      };
    }
    const one = fn ? fn(1, converter.from, converter.to) : null;
    return {
      q: `How many ${toU.name.toLowerCase()} are in 1 ${fromU.name.toLowerCase()}?`,
      a: one
        ? `This conversion does not follow a single fixed ratio. As a reference point, ${one.formula}.`
        : `Use the converter above for an exact result.`,
    };
  })();

  const faqManual = (() => {
    const q = `How do I convert ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} without a calculator?`;
    if (kind === 'linear' && rate !== null) {
      const rounded = rate >= 0.1 ? Math.round(rate * 10) / 10 : Math.round(rate * 100) / 100;
      if (rounded > 0) {
        return { q, a: `Multiply your ${fromU.name.toLowerCase()} value by ${rateStr}. For quick mental math, you can round the factor to ${rounded} when precision is not critical.` };
      }
      return { q, a: `Multiply your ${fromU.name.toLowerCase()} value by ${rateStr}. The factor is very small, so mental math is impractical for this pair — the converter above gives an exact result instantly.` };
    }
    if (kind === 'affine') {
      const at20 = at(20);
      return { q, a: `Apply the formula step by step: ${affineExpr}. For example, converting 20 ${fromU.name} gives ${at20 !== null ? fmt(at20) : '—'} ${toU.name}.` };
    }
    if (kind === 'inverse') {
      const at10 = at(10);
      return { q, a: `Divide the constant by your value: ${inverseExpr}. For example, 10 ${fromU.name} converts to ${at10 !== null ? fmt(at10) : '—'} ${toU.name}.` };
    }
    if (kind === 'currency') {
      return { q, a: `There is no fixed factor to memorise, because the rate moves daily. For a rough estimate while travelling, check today's rate in the converter above and round it to a convenient number for mental math; for anything exact, use the converter itself.` };
    }
    const one = fn ? fn(1, converter.from, converter.to) : null;
    return { q, a: one ? `This pair does not reduce to one multiplication. As a worked example, ${one.formula}.` : `Use the converter above for an exact result.` };
  })();

  const faqBigger = (() => {
    const q = `Is ${fromU.name} bigger or smaller than ${toU.name}?`;
    if (kind === 'linear' && rate !== null) {
      return { q, a: `The ${fromU.name} is the ${rate > 1 ? 'larger' : 'smaller'} unit of the two: 1 ${fromU.name} equals ${rateStr} ${toU.name}.` };
    }
    if (kind === 'affine') {
      const at0 = at(0);
      return { q, a: `Neither is simply bigger or smaller — the two scales are offset rather than just scaled. 0 ${fromU.name} equals ${at0 !== null ? fmt(at0) : '—'} ${toU.name}, and each step of 1 ${fromU.name} is a step of ${slopeStr} ${toU.name}.` };
    }
    if (kind === 'inverse') {
      return { q, a: `The two units move in opposite directions, so neither is "bigger": a higher ${fromU.name.toLowerCase()} value means a lower ${toU.name.toLowerCase()} value, following ${inverseExpr}.` };
    }
    if (kind === 'currency' && rate !== null) {
      return { q, a: `It changes with the market. At the mid-market rate as of ${opts!.currencyRate!.asOf}, 1 ${fromU.name} equals ${rateStr} ${toU.name}, so the ${rate! >= 1 ? fromU.name : toU.name} is currently the higher-value unit of the two.` };
    }
    if (kind === 'currency') {
      return { q, a: `Neither is permanently bigger — the relative value of the two currencies floats with the market. Check the converter above for today's rate.` };
    }
    return { q, a: `The two units are not related by a simple size ratio. Use the converter above to compare specific values.` };
  })();

  const faqCountries = isCurrency
    ? {
        q: `Which countries use ${fromU.name} and which use ${toU.name}?`,
        a: `${fromU.name} is the currency of ${getCurrencyRegion(converter.from)}. ${toU.name} is the currency of ${getCurrencyRegion(converter.to)}.`,
      }
    : {
        q: `Which countries use ${fromU.name} and which use ${toU.name}?`,
        a: `${fromU.name} is primarily used in ${fromFact.regions}. ${toU.name} is primarily used in ${toFact.regions}.`,
      };

  const faqs = [
    faqHowMany,
    faqManual,
    faqBigger,
    faqCountries,
    {
      q: `Can I convert ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} offline?`,
      a: `Yes. Install ConvertNow as a Progressive Web App and perform this conversion offline. If you need currency rates, an internet connection is required because those update live.`,
    },
    {
      q: `Why is converting ${fromU.name.toLowerCase()} to ${toU.name.toLowerCase()} important?`,
      a: `Accurate conversion prevents costly errors in ${getIndustries(category.id)}. Using the wrong unit can lead to ${getMistakeExample(category.id)}.`,
    },
  ];

  // ── Worked examples (Batch E) ────────────────────────────────────────────
  // Head pairs use their curated value lists; the long tail gets examples
  // from a magnitude ladder (values whose computed results stay readable),
  // temperature/fuel fallbacks use the standard reference values. Every
  // result is computed from the real conversion function — never typed.
  let exampleValues: number[];
  if (depth?.exampleValues) {
    exampleValues = depth.exampleValues;
  } else if (kind === 'affine') {
    exampleValues =
      converter.from === 'celsius' ? [0, 37, 100]
      : converter.from === 'fahrenheit' ? [32, 98.6, 212]
      : converter.from === 'kelvin' ? [273.15, 373.15]
      : [0, 100];
  } else if (kind === 'inverse') {
    exampleValues = [5, 10, 20, 40];
  } else if (kind === 'currency') {
    exampleValues = [100, 500, 1000];
  } else {
    const ladder = [0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000, 100000, 1000000];
    const readable = ladder.filter(v => {
      const r = at(v);
      return r !== null && Number.isFinite(r) && r !== 0 && fmt(r) !== '0' && Math.abs(r) >= 0.001;
    });
    const humanScale = readable.filter(v => v <= 10000);
    exampleValues = humanScale.length >= 2 ? pickSpread(humanScale, 4) : pickSpread(readable, 4);
  }

  const examples: WorkedExample[] = [];
  for (const v of exampleValues) {
    const r = kind === 'currency' ? (rate !== null ? v * rate : null) : at(v);
    if (r === null || !Number.isFinite(r)) continue;
    let working: string;
    if (kind === 'linear' || kind === 'currency') {
      working = `${fmtInput(v)} ${fromU.symbol} × ${rateStr}`;
    } else if (kind === 'affine') {
      const mult = slope === 1 ? `${fmtInput(v)} ${fromU.symbol}` : `${fmtInput(v)} ${fromU.symbol} × ${slopeStr}`;
      working = intercept > 0 ? `${mult} + ${fmtFactor(intercept)}` : intercept < 0 ? `${mult} - ${fmtFactor(-intercept)}` : mult;
    } else if (kind === 'inverse') {
      working = `${inverseConstStr} ÷ ${fmtInput(v)} ${fromU.symbol}`;
    } else {
      working = `${fmtInput(v)} ${fromU.symbol}`;
    }
    examples.push({
      input: `${fmtInput(v)} ${fromU.symbol}`,
      note: depth?.exampleNotes?.[String(v)],
      working,
      result: `${fmt(r)} ${toU.symbol}`,
    });
  }

  const examplesSection =
    kind === 'currency' && rate !== null
      ? `Worked at the mid-market rate as of ${opts!.currencyRate!.asOf} (1 ${fromU.name} = ${rateStr} ${toU.name}), each example below uses the exact formula — so you can check the math or adapt it to your own amount.`
      : 'Each example below is worked with the exact formula, step by step — so you can check the math or adapt it to your own numbers.';

  // ── Mental-math shortcut (Batch E) ───────────────────────────────────────
  // Overrides in the depth data are hand-checked; the generated fallback
  // rounds the true factor to 2 significant figures and states the actual
  // error of that rounding. Nothing here claims more accuracy than it has.
  const pctStr = (err: number): string => `${err < 10 ? err.toFixed(1) : Math.round(err)}%`;
  let quickEstimate: string | null = null;
  if (depth?.estimate) {
    quickEstimate = depth.estimate;
  } else if (kind === 'linear' && rate !== null && rate > 0) {
    if (rate === 1) {
      quickEstimate = `Quick estimate: the two units are the same size, so the number carries straight across — no math needed.`;
    } else if (rate > 1) {
      const est = Number(rate.toPrecision(2));
      const err = (Math.abs(est - rate) / rate) * 100;
      quickEstimate =
        err === 0
          ? `Quick estimate: multiply ${fromU.name.toLowerCase()} by ${est} — for this pair, the rounded factor is the exact one.`
          : `Quick estimate: multiply ${fromU.name.toLowerCase()} by ${est} instead of ${rateStr} — within about ${pctStr(err)} of the exact result.`;
    } else {
      const estRecip = Number((1 / rate).toPrecision(2));
      const implied = 1 / estRecip;
      const err = (Math.abs(implied - rate) / rate) * 100;
      quickEstimate =
        err === 0
          ? `Quick estimate: divide ${fromU.name.toLowerCase()} by ${estRecip} — for this pair, that division is exact.`
          : `Quick estimate: divide ${fromU.name.toLowerCase()} by ${estRecip} instead of multiplying by ${rateStr} — within about ${pctStr(err)} of the exact result.`;
    }
  } else if (kind === 'affine') {
    quickEstimate = 'Quick estimate: there is no honest shortcut for this pair — the offset between the scales makes rounded mental math misleading, so use the exact formula above.';
  } else if (kind === 'inverse') {
    const est = Math.round(inverseConst);
    const err = (Math.abs(est - inverseConst) / inverseConst) * 100;
    quickEstimate = `Quick estimate: divide ${est} by your ${fromU.name.toLowerCase()} value instead of ${inverseConstStr} — within about ${pctStr(err)} of the exact result.`;
  } else if (kind === 'currency') {
    quickEstimate = `Quick estimate: round today's rate from the converter above to a convenient number and multiply — fine for a rough budget, but use the converter itself for exact amounts.`;
  }

  const wordCount = [
    intro, formulaSection, examplesSection, quickEstimate ?? '', explanationSection,
    usageSection, mistakesSection, tableSection,
    ...examples.map(e => `${e.input} ${e.working} ${e.result} ${e.note ?? ''}`),
    ...faqs.map(f => f.q + ' ' + f.a),
  ].join(' ').split(/\s+/).length;

  return {
    title: title.length > 60 ? title.slice(0, 57) + '…' : title,
    metaDescription: metaDescription.length > 155 ? metaDescription.slice(0, 152) + '…' : metaDescription,
    h2s: [
      `How do I convert ${fromU.name} to ${toU.name}?`,
      `What is the formula to convert ${fromU.name} to ${toU.name}?`,
      `${fromU.name} to ${toU.name} worked examples`,
      `What is the difference between ${fromU.name} and ${toU.name}?`,
      `Why is this conversion useful in real life?`,
      `Common mistakes when converting ${fromU.name} to ${toU.name}`,
      kind === 'currency' && rate === null
        ? `Why there is no static ${fromU.name} to ${toU.name} table`
        : `${fromU.name} to ${toU.name} conversion table`,
      `Frequently asked questions`,
    ],
    intro,
    formulaSection,
    quickEstimate,
    examplesSection,
    examples,
    explanationSection,
    usageSection,
    mistakesSection,
    tableSection,
    tableContextHeader,
    table,
    faqs,
    relatedConverters,
    wordCount,
  };
}
