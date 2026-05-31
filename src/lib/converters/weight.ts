import type { Unit, ConversionResult } from '@/types';
import { formatNumber } from '@/lib/utils';

// All values in kilograms (base unit)
export const WEIGHT_UNITS: Unit[] = [
  { id: 'kilogram', name: 'Kilogram', symbol: 'kg', aliases: ['kilograms', 'kilo'] },
  { id: 'gram', name: 'Gram', symbol: 'g', aliases: ['grams'] },
  { id: 'milligram', name: 'Milligram', symbol: 'mg', aliases: ['milligrams'] },
  { id: 'microgram', name: 'Microgram', symbol: 'μg', aliases: ['micrograms'] },
  { id: 'metric-ton', name: 'Metric Ton', symbol: 't', aliases: ['tonne', 'tonnes'] },
  { id: 'pound', name: 'Pound', symbol: 'lb', aliases: ['pounds', 'lbs'] },
  { id: 'ounce', name: 'Ounce', symbol: 'oz', aliases: ['ounces'] },
  { id: 'stone', name: 'Stone', symbol: 'st', aliases: ['stones'] },
  { id: 'short-ton', name: 'Short Ton (US)', symbol: 'ton' },
  { id: 'long-ton', name: 'Long Ton (UK)', symbol: 'long ton' },
  { id: 'carat', name: 'Carat', symbol: 'ct', aliases: ['carats'] },
  { id: 'troy-ounce', name: 'Troy Ounce', symbol: 'troy oz' },
  { id: 'grain', name: 'Grain', symbol: 'gr', aliases: ['grains'] },
];

const TO_KG: Record<string, number> = {
  kilogram: 1,
  gram: 0.001,
  milligram: 1e-6,
  microgram: 1e-9,
  'metric-ton': 1000,
  pound: 0.45359237,
  ounce: 0.028349523125,
  stone: 6.35029318,
  'short-ton': 907.18474,
  'long-ton': 1016.0469088,
  carat: 0.0002,
  'troy-ounce': 0.0311034768,
  grain: 0.00006479891,
};

export function convertWeight(value: number, from: string, to: string): ConversionResult {
  const fromFactor = TO_KG[from];
  const toFactor = TO_KG[to];

  if (!fromFactor || !toFactor) throw new Error(`Unknown unit: ${from} or ${to}`);

  const inKg = value * fromFactor;
  const result = inKg / toFactor;
  const factor = fromFactor / toFactor;

  const fromUnit = WEIGHT_UNITS.find(u => u.id === from)!;
  const toUnit = WEIGHT_UNITS.find(u => u.id === to)!;

  return {
    value: result,
    formatted: formatNumber(result),
    formula: `${value} ${fromUnit.symbol} × ${factor.toPrecision(6)} = ${formatNumber(result)} ${toUnit.symbol}`,
  };
}

export const WEIGHT_POPULAR_PAIRS = [
  { from: 'kilogram', to: 'pound' },
  { from: 'pound', to: 'kilogram' },
  { from: 'gram', to: 'ounce' },
  { from: 'ounce', to: 'gram' },
  { from: 'kilogram', to: 'gram' },
  { from: 'stone', to: 'kilogram' },
  { from: 'metric-ton', to: 'kilogram' },
  { from: 'pound', to: 'ounce' },
];
