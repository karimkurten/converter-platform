/**
 * Per-unit factual metadata used by the SEO content generator (CN-15).
 *
 * `system` is the measurement system a unit belongs to; `regions` is where
 * the unit is primarily used. These replace the old substring heuristic in
 * converterContent.ts, which labelled metric units (hectare, bar, gigabyte)
 * as "Imperial / US Customary" and L/100km as a US unit.
 *
 * Facts are standard reference data (NIST SP 811 / BIPM conventions):
 * SI and metric units are used worldwide; US Customary units in the US;
 * Imperial units historically in the UK/Commonwealth.
 */

export interface UnitFact {
  system: string;
  regions: string;
}

const METRIC: UnitFact = { system: 'Metric', regions: 'most countries worldwide' };
const US_CUSTOMARY: UnitFact = { system: 'US Customary', regions: 'the United States' };
const IMPERIAL_US: UnitFact = {
  system: 'Imperial / US Customary',
  regions: 'the United States, with some use in the United Kingdom and Canada',
};
const IMPERIAL_UK: UnitFact = {
  system: 'Imperial (UK)',
  regions: 'the United Kingdom (largely historical use today)',
};
const WORLDWIDE_SCIENCE: UnitFact = {
  system: 'International (scientific)',
  regions: 'science and engineering worldwide',
};

const UNIT_FACTS: Record<string, UnitFact> = {
  // ── Length ──────────────────────────────────────────────────────────────
  meter: METRIC,
  kilometer: METRIC,
  centimeter: METRIC,
  millimeter: METRIC,
  micrometer: METRIC,
  nanometer: METRIC,
  mile: IMPERIAL_US,
  yard: IMPERIAL_US,
  foot: IMPERIAL_US,
  inch: IMPERIAL_US,
  'nautical-mile': {
    system: 'International (nautical)',
    regions: 'aviation and maritime navigation worldwide',
  },
  'light-year': { system: 'Astronomical', regions: 'astronomy worldwide' },
  'astronomical-unit': { system: 'Astronomical', regions: 'astronomy worldwide' },
  parsec: { system: 'Astronomical', regions: 'astronomy worldwide' },

  // ── Weight & mass ───────────────────────────────────────────────────────
  kilogram: METRIC,
  gram: METRIC,
  milligram: METRIC,
  microgram: METRIC,
  'metric-ton': METRIC,
  carat: { system: 'Metric', regions: 'the gem and jewellery trade worldwide' },
  pound: US_CUSTOMARY,
  ounce: US_CUSTOMARY,
  'short-ton': US_CUSTOMARY,
  stone: {
    system: 'Imperial (UK)',
    regions: 'the United Kingdom and Ireland, especially for body weight',
  },
  'long-ton': IMPERIAL_UK,
  'troy-ounce': {
    system: 'Troy (precious metals)',
    regions: 'the precious-metals trade worldwide',
  },
  grain: {
    system: 'Imperial / US Customary',
    regions: 'ammunition, archery and pharmacy, mainly in the United States',
  },

  // ── Temperature ─────────────────────────────────────────────────────────
  celsius: { system: 'Metric', regions: 'most countries worldwide' },
  kelvin: { system: 'SI (metric)', regions: 'science and engineering worldwide' },
  fahrenheit: {
    system: 'Imperial / US Customary',
    regions: 'the United States and a few other countries and territories',
  },
  rankine: {
    system: 'Imperial / US Customary',
    regions: 'some engineering fields in the United States',
  },
  reaumur: {
    system: 'Metric (historical European)',
    regions: 'historical use in parts of Europe',
  },

  // ── Area ────────────────────────────────────────────────────────────────
  'sq-meter': METRIC,
  'sq-kilometer': METRIC,
  'sq-centimeter': METRIC,
  'sq-millimeter': METRIC,
  hectare: { system: 'Metric', regions: 'most countries worldwide, for land measurement' },
  'sq-mile': IMPERIAL_US,
  'sq-yard': IMPERIAL_US,
  'sq-foot': IMPERIAL_US,
  'sq-inch': IMPERIAL_US,
  acre: {
    system: 'Imperial / US Customary',
    regions: 'the United States, the United Kingdom and Canada, for land and real estate',
  },

  // ── Volume ──────────────────────────────────────────────────────────────
  liter: METRIC,
  milliliter: METRIC,
  'cubic-meter': METRIC,
  'cubic-centimeter': METRIC,
  'cubic-foot': IMPERIAL_US,
  'cubic-inch': IMPERIAL_US,
  'us-gallon': US_CUSTOMARY,
  'us-quart': US_CUSTOMARY,
  'us-pint': US_CUSTOMARY,
  'us-cup': US_CUSTOMARY,
  'us-fluid-oz': US_CUSTOMARY,
  tablespoon: US_CUSTOMARY,
  teaspoon: US_CUSTOMARY,
  'uk-gallon': IMPERIAL_UK,

  // ── Speed ───────────────────────────────────────────────────────────────
  mps: METRIC,
  kph: METRIC,
  mph: IMPERIAL_US,
  fps: IMPERIAL_US,
  knot: {
    system: 'International (nautical)',
    regions: 'aviation and maritime navigation worldwide',
  },
  mach: { system: 'Aviation / scientific', regions: 'aviation worldwide' },
  'light-speed': WORLDWIDE_SCIENCE,

  // ── Time (universal — not owned by any measurement system) ─────────────
  second: { system: 'International (universal)', regions: 'worldwide' },
  millisecond: { system: 'International (universal)', regions: 'worldwide' },
  microsecond: { system: 'International (universal)', regions: 'worldwide' },
  nanosecond: { system: 'International (universal)', regions: 'worldwide' },
  minute: { system: 'International (universal)', regions: 'worldwide' },
  hour: { system: 'International (universal)', regions: 'worldwide' },
  day: { system: 'International (universal)', regions: 'worldwide' },
  week: { system: 'International (universal)', regions: 'worldwide' },
  month: { system: 'International (universal)', regions: 'worldwide' },
  year: { system: 'International (universal)', regions: 'worldwide' },
  decade: { system: 'International (universal)', regions: 'worldwide' },
  century: { system: 'International (universal)', regions: 'worldwide' },

  // ── Digital storage (SI decimal + IEC binary prefixes, used globally) ──
  bit: { system: 'International (digital)', regions: 'worldwide' },
  byte: { system: 'International (digital)', regions: 'worldwide' },
  kilobyte: { system: 'International (digital)', regions: 'worldwide' },
  megabyte: { system: 'International (digital)', regions: 'worldwide' },
  gigabyte: { system: 'International (digital)', regions: 'worldwide' },
  terabyte: { system: 'International (digital)', regions: 'worldwide' },
  petabyte: { system: 'International (digital)', regions: 'worldwide' },
  exabyte: { system: 'International (digital)', regions: 'worldwide' },
  kibibyte: { system: 'International (digital)', regions: 'worldwide' },
  mebibyte: { system: 'International (digital)', regions: 'worldwide' },
  gibibyte: { system: 'International (digital)', regions: 'worldwide' },
  tebibyte: { system: 'International (digital)', regions: 'worldwide' },

  // ── Pressure ────────────────────────────────────────────────────────────
  pascal: { system: 'SI (metric)', regions: 'science, engineering and weather reports worldwide' },
  kilopascal: { system: 'SI (metric)', regions: 'Canada and most countries worldwide — tire pressure, weather and engineering' },
  bar: { system: 'Metric', regions: 'Europe and industry worldwide (weather, diving, machinery)' },
  psi: US_CUSTOMARY,
  atm: WORLDWIDE_SCIENCE,
  torr: { system: 'Scientific', regions: 'medicine, vacuum technology and laboratories worldwide' },

  // ── Power (Batch H) ─────────────────────────────────────────────────────
  watt: { system: 'SI (metric)', regions: 'science, engineering and electrical ratings worldwide' },
  kilowatt: { system: 'SI (metric)', regions: 'electricity, engines and EV motor ratings worldwide' },
  horsepower: {
    system: 'Imperial / US Customary',
    regions: 'the United States and car markets worldwide, for engine and motor ratings',
  },
  'metric-horsepower': {
    system: 'Metric (continental European)',
    regions: 'continental Europe, for car engine ratings (PS/CV)',
  },

  // ── Torque (Batch H) ────────────────────────────────────────────────────
  'newton-meter': { system: 'SI (metric)', regions: 'engineering, automotive and science worldwide' },
  'foot-pound': {
    system: 'Imperial / US Customary',
    regions: 'the United States and Canada, for engine torque and fastener specs',
  },
  'inch-pound': {
    system: 'Imperial / US Customary',
    regions: 'the United States, for small fasteners, bicycles and precision assemblies',
  },
  'kilogram-force-meter': {
    system: 'Metric (gravitational, legacy)',
    regions: 'older European and Japanese manuals and machinery specs',
  },

  // ── Energy ──────────────────────────────────────────────────────────────
  joule: { system: 'SI (metric)', regions: 'science and engineering worldwide' },
  kilojoule: { system: 'SI (metric)', regions: 'science and nutrition labelling in many countries' },
  calorie: { system: 'Metric', regions: 'science and nutrition worldwide' },
  kilocalorie: { system: 'Metric', regions: 'nutrition labelling worldwide' },
  'kilowatt-hour': {
    system: 'International (utility billing)',
    regions: 'electricity billing worldwide',
  },
  btu: {
    system: 'Imperial / US Customary',
    regions: 'the United States, especially for heating and air conditioning',
  },

  // ── Fuel economy ────────────────────────────────────────────────────────
  'mpg-us': US_CUSTOMARY,
  'mpg-uk': { system: 'Imperial (UK)', regions: 'the United Kingdom' },
  'l-100km': { system: 'Metric', regions: 'Canada and Europe' },
  'km-per-liter': {
    system: 'Metric',
    regions: 'Japan, Brazil and parts of Asia and Latin America',
  },
};

/** Facts for a non-currency unit id; falls back to a neutral statement. */
export function getUnitFact(unitId: string): UnitFact {
  return UNIT_FACTS[unitId] ?? { system: 'International', regions: 'many countries' };
}

/** Where each currency is the official (or primary) currency. */
const CURRENCY_REGIONS: Record<string, string> = {
  USD: 'the United States',
  EUR: 'the euro area of the European Union',
  GBP: 'the United Kingdom',
  JPY: 'Japan',
  CAD: 'Canada',
  AUD: 'Australia',
  CHF: 'Switzerland and Liechtenstein',
  CNY: 'China',
  INR: 'India',
  MXN: 'Mexico',
  BRL: 'Brazil',
  KRW: 'South Korea',
  SGD: 'Singapore',
  HKD: 'Hong Kong',
  NOK: 'Norway',
  SEK: 'Sweden',
  DKK: 'Denmark',
  NZD: 'New Zealand',
  ZAR: 'South Africa',
  RUB: 'Russia',
  TRY: 'Turkey',
  AED: 'the United Arab Emirates',
  SAR: 'Saudi Arabia',
  THB: 'Thailand',
  MYR: 'Malaysia',
  IDR: 'Indonesia',
  PHP: 'the Philippines',
  PLN: 'Poland',
  CZK: 'Czechia',
  HUF: 'Hungary',
  ILS: 'Israel',
  EGP: 'Egypt',
  VND: 'Vietnam',
  CLP: 'Chile',
  COP: 'Colombia',
  ARS: 'Argentina',
  PKR: 'Pakistan',
  BDT: 'Bangladesh',
  NGN: 'Nigeria',
  KES: 'Kenya',
};

export function getCurrencyRegion(code: string): string {
  return CURRENCY_REGIONS[code] ?? 'its home country';
}
