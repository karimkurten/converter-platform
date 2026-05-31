import type { Unit, ConversionResult } from '@/types';
import { formatNumber } from '@/lib/utils';

// All values are in meters (base unit)
export const LENGTH_UNITS: Unit[] = [
  { id: 'meter', name: 'Meter', symbol: 'm', aliases: ['meters', 'metre'] },
  { id: 'kilometer', name: 'Kilometer', symbol: 'km', aliases: ['kilometres', 'kilometers'] },
  { id: 'centimeter', name: 'Centimeter', symbol: 'cm', aliases: ['centimeters', 'centimetre'] },
  { id: 'millimeter', name: 'Millimeter', symbol: 'mm', aliases: ['millimeters', 'millimetre'] },
  { id: 'micrometer', name: 'Micrometer', symbol: 'μm', aliases: ['micron'] },
  { id: 'nanometer', name: 'Nanometer', symbol: 'nm' },
  { id: 'mile', name: 'Mile', symbol: 'mi', aliases: ['miles'] },
  { id: 'yard', name: 'Yard', symbol: 'yd', aliases: ['yards'] },
  { id: 'foot', name: 'Foot', symbol: 'ft', aliases: ['feet'] },
  { id: 'inch', name: 'Inch', symbol: 'in', aliases: ['inches'] },
  { id: 'nautical-mile', name: 'Nautical Mile', symbol: 'nmi' },
  { id: 'light-year', name: 'Light Year', symbol: 'ly' },
  { id: 'astronomical-unit', name: 'Astronomical Unit', symbol: 'AU' },
  { id: 'parsec', name: 'Parsec', symbol: 'pc' },
];

// Conversion factors to meters (exact constants where defined)
const TO_METERS: Record<string, number> = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  micrometer: 1e-6,
  nanometer: 1e-9,
  mile: 1609.344,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254,
  'nautical-mile': 1852,
  'light-year': 9.4607304725808e15,
  'astronomical-unit': 1.495978707e11,
  parsec: 3.0856775814913673e16,
};

export function convertLength(value: number, from: string, to: string): ConversionResult {
  const fromFactor = TO_METERS[from];
  const toFactor = TO_METERS[to];

  if (!fromFactor || !toFactor) throw new Error(`Unknown unit: ${from} or ${to}`);

  const inMeters = value * fromFactor;
  const result = inMeters / toFactor;

  const fromUnit = LENGTH_UNITS.find(u => u.id === from)!;
  const toUnit = LENGTH_UNITS.find(u => u.id === to)!;
  const factor = fromFactor / toFactor;

  return {
    value: result,
    formatted: formatNumber(result),
    formula: generateFormula(value, fromUnit, toUnit, factor, result),
  };
}

function generateFormula(value: number, from: Unit, to: Unit, factor: number, result: number): string {
  if (Math.abs(factor - Math.round(factor)) < 0.0001) {
    return `${value} ${from.symbol} × ${Math.round(factor)} = ${formatNumber(result)} ${to.symbol}`;
  }
  return `${value} ${from.symbol} × ${factor.toPrecision(6)} = ${formatNumber(result)} ${to.symbol}`;
}

export const LENGTH_POPULAR_PAIRS = [
  { from: 'kilometer', to: 'mile' },
  { from: 'meter', to: 'foot' },
  { from: 'centimeter', to: 'inch' },
  { from: 'mile', to: 'kilometer' },
  { from: 'foot', to: 'meter' },
  { from: 'inch', to: 'centimeter' },
  { from: 'yard', to: 'meter' },
  { from: 'nautical-mile', to: 'kilometer' },
];
