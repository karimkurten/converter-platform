import { convertLength } from './converters/length';
import { formatNumber } from './utils';

/**
 * Height conversion helpers (Batch F) — centimetres ↔ feet + inches.
 *
 * Height is how people actually ask length questions, but the converter
 * registry's pair model is strictly unit-to-unit, so the compound
 * feet+inches form cannot be an ordinary registry pair (Batch F routes it
 * through dedicated pages under /length/ instead).
 *
 * Every number here is derived from the site's real length engine
 * (convertLength): 1 inch = 2.54 cm exactly, 1 foot = 12 inches exactly.
 * Nothing is hand-computed or stored as a pre-baked result.
 */

/** Registry id of the compound "unit" the height pages convert to/from. */
export const FEET_INCHES_ID = 'feet-inches';

/** Heights that get their own specific-value pages ("175 cm in feet"). */
export const HEIGHT_VALUES = [160, 165, 170, 175, 180, 185, 190];

/** Inclusive range covered by the height chart page. */
export const HEIGHT_CHART_MIN = 140;
export const HEIGHT_CHART_MAX = 210;

export interface FeetInches {
  feet: number;
  /** Inches remainder in [0, 12), rounded to the requested precision. */
  inches: number;
  /** Total inches (cm ÷ 2.54, unrounded). */
  totalInches: number;
  /** Decimal display, e.g. "5 ft 8.9 in". */
  display: string;
  /** Symbol display, e.g. `5'8.9"`. */
  symbolDisplay: string;
  /** Fraction-aware display (nearest ⅛ in), e.g. "5 ft 8⅞ in". */
  fractionDisplay: string;
}

const EIGHTH_GLYPHS = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞'];

/** Format an inches remainder without trailing zeros: 8.9 → "8.9", 3 → "3". */
function fmtInches(n: number): string {
  return String(Number(n.toFixed(2)));
}

/**
 * Convert centimetres to feet + inches using the real length engine.
 * `inchPrecision` is the number of decimals kept on the inches remainder
 * (default 1, matching how heights are conventionally quoted).
 */
export function cmToFeetInches(cm: number, inchPrecision = 1): FeetInches {
  const totalInches = convertLength(cm, 'centimeter', 'inch').value;
  let feet = Math.floor(totalInches / 12);
  let inches = Number((totalInches - feet * 12).toFixed(inchPrecision));
  if (inches >= 12) {
    feet += 1;
    inches = 0;
  }
  if (inches < 0) inches = 0;

  // Nearest-eighth fraction of the inches remainder, with carry handling
  // (e.g. 2.99 in displays as the fraction 3 in, not 2 + a rounded-up glyph).
  let wholeIn = Math.floor(inches);
  let eighths = Math.round((inches - wholeIn) * 8);
  if (eighths === 8) {
    wholeIn += 1;
    eighths = 0;
  }
  let fracFeet = feet;
  if (wholeIn >= 12) {
    fracFeet += 1;
    wholeIn -= 12;
  }
  const glyph = EIGHTH_GLYPHS[eighths];

  return {
    feet,
    inches,
    totalInches,
    display: `${feet} ft ${fmtInches(inches)} in`,
    symbolDisplay: `${feet}'${fmtInches(inches)}"`,
    fractionDisplay: `${fracFeet} ft ${wholeIn}${glyph} in`,
  };
}

/** Convert a feet + inches height back to centimetres (real engine). */
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return convertLength(totalInches, 'inch', 'centimeter').value;
}

/** Total inches for a centimetre height, formatted for prose (≤6 sig figs). */
export function cmToTotalInches(cm: number): string {
  return formatNumber(convertLength(cm, 'centimeter', 'inch').value, 6);
}
