import type { Unit, ConversionResult } from '@/types';

export const TEMPERATURE_UNITS: Unit[] = [
  { id: 'celsius', name: 'Celsius', symbol: '°C', aliases: ['centigrade'] },
  { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F' },
  { id: 'kelvin', name: 'Kelvin', symbol: 'K' },
  { id: 'rankine', name: 'Rankine', symbol: '°R' },
  { id: 'reaumur', name: 'Réaumur', symbol: '°Ré' },
];

// Temperature requires special conversion (not simple multiplication)
export function convertTemperature(value: number, from: string, to: string): ConversionResult {
  if (from === to) {
    const unit = TEMPERATURE_UNITS.find(u => u.id === from)!;
    return { value, formatted: `${value} ${unit.symbol}`, formula: 'No conversion needed' };
  }

  // First convert to Celsius
  let celsius: number;
  switch (from) {
    case 'celsius': celsius = value; break;
    case 'fahrenheit': celsius = (value - 32) * 5 / 9; break;
    case 'kelvin': celsius = value - 273.15; break;
    case 'rankine': celsius = (value - 491.67) * 5 / 9; break;
    case 'reaumur': celsius = value * 5 / 4; break;
    default: throw new Error(`Unknown unit: ${from}`);
  }

  // Then convert from Celsius to target
  let result: number;
  let formula: string;
  const toUnit = TEMPERATURE_UNITS.find(u => u.id === to)!;

  switch (to) {
    case 'celsius':
      result = celsius;
      formula = getFormula(value, from, to, result);
      break;
    case 'fahrenheit':
      result = celsius * 9 / 5 + 32;
      formula = getFormula(value, from, to, result);
      break;
    case 'kelvin':
      result = celsius + 273.15;
      formula = getFormula(value, from, to, result);
      break;
    case 'rankine':
      result = (celsius + 273.15) * 9 / 5;
      formula = getFormula(value, from, to, result);
      break;
    case 'reaumur':
      result = celsius * 4 / 5;
      formula = getFormula(value, from, to, result);
      break;
    default:
      throw new Error(`Unknown unit: ${to}`);
  }

  return {
    value: result,
    formatted: `${parseFloat(result.toFixed(4))} ${toUnit.symbol}`,
    formula,
  };
}

function getFormula(value: number, from: string, to: string, result: number): string {
  const formulas: Record<string, Record<string, string>> = {
    celsius: {
      fahrenheit: `(${value}°C × 9/5) + 32 = ${result.toFixed(2)}°F`,
      kelvin: `${value}°C + 273.15 = ${result.toFixed(2)} K`,
      rankine: `(${value}°C + 273.15) × 9/5 = ${result.toFixed(2)}°R`,
      reaumur: `${value}°C × 4/5 = ${result.toFixed(2)}°Ré`,
    },
    fahrenheit: {
      celsius: `(${value}°F - 32) × 5/9 = ${result.toFixed(2)}°C`,
      kelvin: `(${value}°F - 32) × 5/9 + 273.15 = ${result.toFixed(2)} K`,
      rankine: `${value}°F + 459.67 = ${result.toFixed(2)}°R`,
      reaumur: `(${value}°F - 32) × 4/9 = ${result.toFixed(2)}°Ré`,
    },
    kelvin: {
      celsius: `${value} K - 273.15 = ${result.toFixed(2)}°C`,
      fahrenheit: `(${value} K - 273.15) × 9/5 + 32 = ${result.toFixed(2)}°F`,
      rankine: `${value} K × 9/5 = ${result.toFixed(2)}°R`,
      reaumur: `(${value} K - 273.15) × 4/5 = ${result.toFixed(2)}°Ré`,
    },
    rankine: {
      celsius: `(${value}°R - 491.67) × 5/9 = ${result.toFixed(2)}°C`,
      fahrenheit: `${value}°R - 459.67 = ${result.toFixed(2)}°F`,
      kelvin: `${value}°R × 5/9 = ${result.toFixed(2)} K`,
    },
  };

  return formulas[from]?.[to] ?? `${value} → ${result.toFixed(4)}`;
}

export const TEMPERATURE_POPULAR_PAIRS = [
  { from: 'celsius', to: 'fahrenheit' },
  { from: 'fahrenheit', to: 'celsius' },
  { from: 'celsius', to: 'kelvin' },
  { from: 'kelvin', to: 'celsius' },
  { from: 'fahrenheit', to: 'kelvin' },
];
