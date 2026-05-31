import type { Unit, ConversionResult } from '@/types';
import { formatNumber } from '@/lib/utils';

// ─── AREA ─────────────────────────────────────────────────────────────────────
// All in square meters (exact: derived from inch = 0.0254 m)
export const AREA_UNITS: Unit[] = [
  { id: 'sq-meter', name: 'Square Meter', symbol: 'm²' },
  { id: 'sq-kilometer', name: 'Square Kilometer', symbol: 'km²' },
  { id: 'sq-centimeter', name: 'Square Centimeter', symbol: 'cm²' },
  { id: 'sq-millimeter', name: 'Square Millimeter', symbol: 'mm²' },
  { id: 'sq-mile', name: 'Square Mile', symbol: 'mi²' },
  { id: 'sq-yard', name: 'Square Yard', symbol: 'yd²' },
  { id: 'sq-foot', name: 'Square Foot', symbol: 'ft²' },
  { id: 'sq-inch', name: 'Square Inch', symbol: 'in²' },
  { id: 'hectare', name: 'Hectare', symbol: 'ha' },
  { id: 'acre', name: 'Acre', symbol: 'ac' },
];

const AREA_TO_SQ_METERS: Record<string, number> = {
  'sq-meter': 1,
  'sq-kilometer': 1e6,
  'sq-centimeter': 1e-4,
  'sq-millimeter': 1e-6,
  'sq-mile': 2589988.110336,        // 1609.344^2
  'sq-yard': 0.83612736,             // 0.9144^2
  'sq-foot': 0.09290304,             // 0.3048^2
  'sq-inch': 0.00064516,             // 0.0254^2
  hectare: 10000,
  acre: 4046.8564224,                // 4840 * sq-yard
};

export function convertArea(value: number, from: string, to: string): ConversionResult {
  return convertSimple(value, from, to, AREA_TO_SQ_METERS, AREA_UNITS);
}

export const AREA_POPULAR_PAIRS = [
  { from: 'sq-foot', to: 'sq-meter' },
  { from: 'sq-meter', to: 'sq-foot' },
  { from: 'hectare', to: 'acre' },
  { from: 'acre', to: 'hectare' },
  { from: 'sq-kilometer', to: 'sq-mile' },
];

// ─── VOLUME ───────────────────────────────────────────────────────────────────
// All in liters
export const VOLUME_UNITS: Unit[] = [
  { id: 'liter', name: 'Liter', symbol: 'L', aliases: ['litre'] },
  { id: 'milliliter', name: 'Milliliter', symbol: 'mL', aliases: ['millilitre'] },
  { id: 'cubic-meter', name: 'Cubic Meter', symbol: 'm³' },
  { id: 'cubic-centimeter', name: 'Cubic Centimeter', symbol: 'cm³' },
  { id: 'cubic-foot', name: 'Cubic Foot', symbol: 'ft³' },
  { id: 'cubic-inch', name: 'Cubic Inch', symbol: 'in³' },
  { id: 'us-gallon', name: 'US Gallon', symbol: 'gal (US)' },
  { id: 'uk-gallon', name: 'UK Gallon', symbol: 'gal (UK)' },
  { id: 'us-quart', name: 'US Quart', symbol: 'qt' },
  { id: 'us-pint', name: 'US Pint', symbol: 'pt' },
  { id: 'us-cup', name: 'US Cup', symbol: 'cup' },
  { id: 'us-fluid-oz', name: 'US Fluid Ounce', symbol: 'fl oz' },
  { id: 'tablespoon', name: 'Tablespoon', symbol: 'tbsp' },
  { id: 'teaspoon', name: 'Teaspoon', symbol: 'tsp' },
];

const VOLUME_TO_LITERS: Record<string, number> = {
  liter: 1,
  milliliter: 0.001,
  'cubic-meter': 1000,
  'cubic-centimeter': 0.001,
  'cubic-foot': 28.316846592,        // 0.3048^3 * 1000
  'cubic-inch': 0.016387064,         // 0.0254^3 * 1000
  'us-gallon': 3.785411784,          // exact
  'uk-gallon': 4.54609,              // exact
  'us-quart': 0.946352946,           // 1/4 gallon
  'us-pint': 0.473176473,            // 1/8 gallon
  'us-cup': 0.2365882365,            // 1/16 gallon
  'us-fluid-oz': 0.0295735295625,    // 1/128 gallon
  tablespoon: 0.01478676478125,      // 1/2 fl oz
  teaspoon: 0.00492892159375,        // 1/6 fl oz
};

export function convertVolume(value: number, from: string, to: string): ConversionResult {
  return convertSimple(value, from, to, VOLUME_TO_LITERS, VOLUME_UNITS);
}

export const VOLUME_POPULAR_PAIRS = [
  { from: 'liter', to: 'us-gallon' },
  { from: 'us-gallon', to: 'liter' },
  { from: 'milliliter', to: 'us-fluid-oz' },
  { from: 'cubic-foot', to: 'liter' },
  { from: 'us-cup', to: 'milliliter' },
];

// ─── SPEED ────────────────────────────────────────────────────────────────────
// All in meters per second
export const SPEED_UNITS: Unit[] = [
  { id: 'mps', name: 'Meters per Second', symbol: 'm/s' },
  { id: 'kph', name: 'Kilometers per Hour', symbol: 'km/h' },
  { id: 'mph', name: 'Miles per Hour', symbol: 'mph' },
  { id: 'fps', name: 'Feet per Second', symbol: 'ft/s' },
  { id: 'knot', name: 'Knot', symbol: 'kn', aliases: ['knots'] },
  { id: 'mach', name: 'Mach', symbol: 'Ma' },
  { id: 'light-speed', name: 'Speed of Light', symbol: 'c' },
];

const SPEED_TO_MPS: Record<string, number> = {
  mps: 1,
  kph: 1000 / 3600,                  // 0.277777... exact
  mph: 1609.344 / 3600,              // 0.44704 exact
  fps: 0.3048,                       // exact
  knot: 1852 / 3600,                 // 0.5144444... exact
  mach: 343,                         // approx (sea level, 20°C)
  'light-speed': 299792458,          // exact
};

export function convertSpeed(value: number, from: string, to: string): ConversionResult {
  return convertSimple(value, from, to, SPEED_TO_MPS, SPEED_UNITS);
}

export const SPEED_POPULAR_PAIRS = [
  { from: 'kph', to: 'mph' },
  { from: 'mph', to: 'kph' },
  { from: 'mps', to: 'kph' },
  { from: 'knot', to: 'kph' },
  { from: 'mach', to: 'mph' },
];

// ─── TIME ─────────────────────────────────────────────────────────────────────
// All in seconds
export const TIME_UNITS: Unit[] = [
  { id: 'second', name: 'Second', symbol: 's', aliases: ['seconds'] },
  { id: 'millisecond', name: 'Millisecond', symbol: 'ms' },
  { id: 'microsecond', name: 'Microsecond', symbol: 'μs' },
  { id: 'nanosecond', name: 'Nanosecond', symbol: 'ns' },
  { id: 'minute', name: 'Minute', symbol: 'min', aliases: ['minutes'] },
  { id: 'hour', name: 'Hour', symbol: 'hr', aliases: ['hours'] },
  { id: 'day', name: 'Day', symbol: 'd', aliases: ['days'] },
  { id: 'week', name: 'Week', symbol: 'wk', aliases: ['weeks'] },
  { id: 'month', name: 'Month', symbol: 'mo', aliases: ['months'] },
  { id: 'year', name: 'Year', symbol: 'yr', aliases: ['years'] },
  { id: 'decade', name: 'Decade', symbol: 'dec' },
  { id: 'century', name: 'Century', symbol: 'cent' },
];

const TIME_TO_SECONDS: Record<string, number> = {
  second: 1,
  millisecond: 0.001,
  microsecond: 1e-6,
  nanosecond: 1e-9,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2629746,                    // average (Gregorian year / 12)
  year: 31556952,                    // average (Gregorian)
  decade: 315569520,
  century: 3155695200,
};

export function convertTime(value: number, from: string, to: string): ConversionResult {
  return convertSimple(value, from, to, TIME_TO_SECONDS, TIME_UNITS);
}

export const TIME_POPULAR_PAIRS = [
  { from: 'hour', to: 'minute' },
  { from: 'day', to: 'hour' },
  { from: 'year', to: 'day' },
  { from: 'minute', to: 'second' },
  { from: 'week', to: 'day' },
];

// ─── DIGITAL STORAGE ──────────────────────────────────────────────────────────
// All in bytes
export const DIGITAL_UNITS: Unit[] = [
  { id: 'bit', name: 'Bit', symbol: 'b' },
  { id: 'byte', name: 'Byte', symbol: 'B' },
  { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB' },
  { id: 'megabyte', name: 'Megabyte', symbol: 'MB' },
  { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB' },
  { id: 'terabyte', name: 'Terabyte', symbol: 'TB' },
  { id: 'petabyte', name: 'Petabyte', symbol: 'PB' },
  { id: 'exabyte', name: 'Exabyte', symbol: 'EB' },
  { id: 'kibibyte', name: 'Kibibyte', symbol: 'KiB' },
  { id: 'mebibyte', name: 'Mebibyte', symbol: 'MiB' },
  { id: 'gibibyte', name: 'Gibibyte', symbol: 'GiB' },
  { id: 'tebibyte', name: 'Tebibyte', symbol: 'TiB' },
];

const DIGITAL_TO_BYTES: Record<string, number> = {
  bit: 0.125,
  byte: 1,
  kilobyte: 1000,
  megabyte: 1e6,
  gigabyte: 1e9,
  terabyte: 1e12,
  petabyte: 1e15,
  exabyte: 1e18,
  kibibyte: 1024,
  mebibyte: 1048576,
  gibibyte: 1073741824,
  tebibyte: 1099511627776,
};

export function convertDigital(value: number, from: string, to: string): ConversionResult {
  return convertSimple(value, from, to, DIGITAL_TO_BYTES, DIGITAL_UNITS);
}

export const DIGITAL_POPULAR_PAIRS = [
  { from: 'gigabyte', to: 'megabyte' },
  { from: 'terabyte', to: 'gigabyte' },
  { from: 'megabyte', to: 'kilobyte' },
  { from: 'gigabyte', to: 'gibibyte' },
  { from: 'bit', to: 'byte' },
];

// ─── Shared converter helper ──────────────────────────────────────────────────

function convertSimple(
  value: number,
  from: string,
  to: string,
  factors: Record<string, number>,
  units: Unit[]
): ConversionResult {
  const fromFactor = factors[from];
  const toFactor = factors[to];

  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error(`Unknown unit: ${from} or ${to}`);
  }

  const result = (value * fromFactor) / toFactor;
  const factor = fromFactor / toFactor;
  const fromUnit = units.find(u => u.id === from)!;
  const toUnit = units.find(u => u.id === to)!;

  return {
    value: result,
    formatted: formatNumber(result),
    formula: `${value} ${fromUnit.symbol} × ${factor.toPrecision(6)} = ${formatNumber(result)} ${toUnit.symbol}`,
  };
}
