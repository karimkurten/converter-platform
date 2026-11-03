/**
 * Batch E (Phase 3 template depth): per-pair depth data for the head
 * converter pairs — the values people actually look up, extended table
 * value lists, and hand-checked mental-math shortcuts.
 *
 * Values here are INPUT values and honest shortcut strings only. Every
 * result shown on a page is computed live from the site's real conversion
 * functions in converterContent.ts — nothing is hand-typed.
 *
 * Pairs without an entry get generated depth instead: examples picked from
 * a magnitude ladder, ~50-row tables only where listed here, and a
 * shortcut computed from the pair's true factor with its error stated.
 */

export interface PairDepth {
  /** Input values worked step-by-step in the "worked examples" section. */
  exampleValues: number[];
  /** Factual note for a specific example value, keyed by String(value). */
  exampleNotes?: Record<string, string>;
  /** Extended table input values (~50 rows) replacing the default 20. */
  tableValues?: number[];
  /** Mental-math shortcut line (must be an honest approximation). */
  estimate?: string;
}

/** Inclusive numeric sequence: seq(1, 20, 1) → [1, 2, …, 20]. */
function seq(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  for (let v = from; v <= to + 1e-9; v += step) out.push(Math.round(v * 1e6) / 1e6);
  return out;
}

/** Sort ascending and de-duplicate a table value list. */
function tv(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

const CURRENCY_AMOUNTS = [50, 100, 250, 500, 1000];

export const PAIR_DEPTH: Record<string, PairDepth> = {
  // ─── Weight ──────────────────────────────────────────────────────────────
  'weight/kilogram-to-pound': {
    exampleValues: [50, 60, 70, 80, 90, 100],
    tableValues: tv([...seq(1, 20, 1), ...seq(25, 100, 5), ...seq(110, 200, 10), 250, 300, 400, 500]),
    estimate:
      'Quick estimate: multiply kilograms by 2.2 — that lands within about 0.2% of the exact figure in pounds.',
  },
  'weight/pound-to-kilogram': {
    exampleValues: [100, 120, 150, 180, 200, 250],
    tableValues: tv([...seq(1, 20, 1), ...seq(25, 100, 5), ...seq(110, 200, 10), 250, 300, 400, 500]),
    estimate:
      'Quick estimate: divide pounds by 2.2 — that lands within about 0.2% of the exact figure in kilograms.',
  },

  // ─── Length ──────────────────────────────────────────────────────────────
  'length/centimeter-to-inch': {
    exampleValues: [160, 165, 170, 175, 180, 185, 190],
    tableValues: tv([...seq(1, 30, 1), ...seq(35, 100, 5), 110, 120, 130, 150, 180, 200]),
    estimate:
      'Quick estimate: divide centimetres by 2.5 instead of the exact 2.54 — within about 1.6% of the exact figure in inches.',
  },
  'length/inch-to-centimeter': {
    exampleValues: [12, 24, 36, 60, 66, 72],
    exampleNotes: { '60': '5 feet', '66': '5 feet 6 inches', '72': '6 feet' },
    tableValues: tv([0.25, 0.5, ...seq(1, 24, 1), ...seq(26, 48, 2), 50, 55, 60, 65, 70, 72, 75, 80, 85, 90, 95, 100]),
    estimate:
      'Quick estimate: multiply inches by 2.5 instead of the exact 2.54 — within about 1.6% of the exact figure in centimetres.',
  },
  'length/kilometer-to-mile': {
    exampleValues: [5, 10, 21.0975, 42.195, 100],
    exampleNotes: {
      '5': '5K race distance',
      '10': '10K race distance',
      '21.0975': 'Half marathon distance',
      '42.195': 'Marathon distance',
    },
    tableValues: tv([
      ...seq(1, 20, 1), 21.0975, 25, ...seq(30, 100, 5), 42.195, 105, 110, 120, 130, 140, 150, 175, 200, 250, 300, 400, 500,
    ]),
    estimate:
      'Quick estimate: divide kilometres by 1.6 — within about 0.6% of the exact figure in miles.',
  },
  'length/mile-to-kilometer': {
    exampleValues: [3.1, 6.2, 13.1, 26.2, 100],
    exampleNotes: {
      '3.1': '5K race distance',
      '6.2': '10K race distance',
      '13.1': 'Half marathon distance',
      '26.2': 'Marathon distance',
    },
    tableValues: tv([
      ...seq(1, 20, 1), 3.1, 6.2, 13.1, 26.2, ...seq(25, 100, 5), 110, 120, 130, 125, 150, 200, 250, 300, 400, 500,
    ]),
    estimate:
      'Quick estimate: multiply miles by 1.6 — within about 0.6% of the exact figure in kilometres.',
  },
  'length/meter-to-foot': {
    exampleValues: [1.7, 1.8, 2, 3, 10, 100],
    tableValues: tv([0.25, 0.5, ...seq(1, 24, 1), ...seq(25, 60, 5), 70, 80, 90, 100, 125, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000]),
    estimate:
      'Quick estimate: multiply metres by 3.3 — within about 0.6% of the exact figure in feet.',
  },
  'length/foot-to-meter': {
    exampleValues: [5, 5.5, 6, 10, 100],
    exampleNotes: { '5.5': '5 feet 6 inches' },
    tableValues: tv([...seq(1, 20, 1), ...seq(25, 100, 5), 110, 120, 125, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000]),
    estimate:
      'Quick estimate: divide feet by 3.3 — within about 0.6% of the exact figure in metres.',
  },

  // ─── Temperature ─────────────────────────────────────────────────────────
  'temperature/celsius-to-fahrenheit': {
    exampleValues: [-40, 0, 20, 37, 100, 180, 200],
    exampleNotes: {
      '-40': 'The point where the °C and °F scales read the same',
      '0': 'Water freezes',
      '37': 'Average body temperature',
      '100': 'Water boils at sea level',
      '180': 'A moderate oven',
    },
    tableValues: tv([
      ...seq(-40, 50, 5), 37, ...seq(60, 300, 10), 325, 350, 375, 400, 450,
    ]),
    estimate:
      'Quick estimate: double the Celsius value and add 30. It is a rough shortcut — use the exact formula above when the number matters.',
  },
  'temperature/fahrenheit-to-celsius': {
    exampleValues: [32, 68, 98.6, 212, 350, 400, 450],
    exampleNotes: {
      '32': 'Water freezes',
      '98.6': 'Average body temperature',
      '212': 'Water boils at sea level',
      '350': 'A moderate oven',
      '450': 'A very hot oven',
    },
    tableValues: tv([
      -40, -30, -20, -10, ...seq(0, 100, 10), 32, 68, 98.6, ...seq(110, 200, 10),
      212, ...seq(250, 500, 25), ...seq(550, 1000, 50),
    ]),
    estimate:
      'Quick estimate: subtract 30 from the Fahrenheit value, then halve the result. It is a rough shortcut — use the exact formula above when the number matters.',
  },
  'temperature/celsius-to-kelvin': {
    exampleValues: [-273.15, 0, 100],
    exampleNotes: {
      '-273.15': 'Absolute zero',
      '0': 'Water freezes',
      '100': 'Water boils at sea level',
    },
    estimate:
      'Quick estimate: just add 273.15. The two scales step at exactly the same size, so this shortcut is exact.',
  },
  'temperature/kelvin-to-celsius': {
    exampleValues: [0, 273.15, 373.15],
    exampleNotes: {
      '0': 'Absolute zero',
      '273.15': 'Water freezes',
      '373.15': 'Water boils at sea level',
    },
    estimate:
      'Quick estimate: just subtract 273.15. The two scales step at exactly the same size, so this shortcut is exact.',
  },
  'temperature/fahrenheit-to-kelvin': {
    exampleValues: [32, 212],
    exampleNotes: { '32': 'Water freezes', '212': 'Water boils at sea level' },
    estimate:
      'Quick estimate: there is no reliable mental shortcut for this pair — work through the formula above (subtract 32, multiply by 5⁄9, then add 273.15).',
  },

  // ─── Volume ──────────────────────────────────────────────────────────────
  'volume/liter-to-us-gallon': {
    exampleValues: [5, 10, 20, 50, 100],
    tableValues: tv([0.5, ...seq(1, 20, 1), ...seq(25, 100, 5), 110, 120, 130, 140, 150, 200, 250, 300, 400, 500, 600, 750, 1000]),
    estimate:
      'Quick estimate: divide litres by 3.8 — within about 0.4% of the exact figure in US gallons.',
  },
  'volume/us-gallon-to-liter': {
    exampleValues: [1, 5, 10, 15, 20],
    tableValues: tv([...seq(1, 20, 1), ...seq(25, 100, 5), ...seq(110, 200, 10), 250, 300, 400, 500]),
    estimate:
      'Quick estimate: multiply US gallons by 3.8 — within about 0.4% of the exact figure in litres.',
  },

  // ─── Currency heads (examples only — computed from the dated snapshot) ──
  'currency/USD-to-CAD': { exampleValues: CURRENCY_AMOUNTS },
  'currency/CAD-to-USD': { exampleValues: CURRENCY_AMOUNTS },
  'currency/USD-to-EUR': { exampleValues: CURRENCY_AMOUNTS },
  'currency/EUR-to-USD': { exampleValues: CURRENCY_AMOUNTS },
  'currency/USD-to-GBP': { exampleValues: CURRENCY_AMOUNTS },
  'currency/GBP-to-USD': { exampleValues: CURRENCY_AMOUNTS },
  'currency/EUR-to-GBP': { exampleValues: CURRENCY_AMOUNTS },
  'currency/GBP-to-EUR': { exampleValues: CURRENCY_AMOUNTS },
  'currency/USD-to-AUD': { exampleValues: CURRENCY_AMOUNTS },
  'currency/AUD-to-USD': { exampleValues: CURRENCY_AMOUNTS },
  'currency/USD-to-CNY': { exampleValues: CURRENCY_AMOUNTS },
  'currency/CNY-to-USD': { exampleValues: [500, 1000, 5000] },
  'currency/USD-to-INR': { exampleValues: [50, 100, 500, 1000] },
  'currency/INR-to-USD': { exampleValues: [1000, 5000, 10000] },
  'currency/USD-to-JPY': { exampleValues: [100, 500, 1000] },
  'currency/JPY-to-USD': { exampleValues: [10000, 50000, 100000] },
};

export function getPairDepth(categoryId: string, converterId: string): PairDepth | undefined {
  return PAIR_DEPTH[`${categoryId}/${converterId}`];
}
