import { describe, it, expect } from 'vitest';
import { convertLength } from './length';
import { convertWeight } from './weight';
import { convertTemperature } from './temperature';
import { convertArea, convertVolume, convertSpeed, convertTime, convertDigital, convertPressure, convertEnergy, convertFuel } from './units';
import { convertCurrency } from './currency';
import { runConversion, isPopularPath, getCategoryBySlug, getConverterBySlug, searchConverters } from './index';

describe('length conversion (exact constants)', () => {
  it('1 mile = 1609.344 m exactly', () => {
    const r = convertLength(1, 'mile', 'meter');
    expect(r.value).toBe(1609.344);
  });
  it('1 inch = 2.54 cm exactly', () => {
    const r = convertLength(1, 'inch', 'centimeter');
    expect(r.value).toBeCloseTo(2.54, 10);
  });
  it('1 foot = 0.3048 m exactly', () => {
    const r = convertLength(1, 'foot', 'meter');
    expect(r.value).toBe(0.3048);
  });
  it('round-trip mile→meter→mile', () => {
    const m = convertLength(5, 'mile', 'meter').value;
    const back = convertLength(m, 'meter', 'mile').value;
    expect(back).toBeCloseTo(5, 10);
  });
});

describe('weight conversion', () => {
  it('1 kg ≈ 2.2046 lb', () => {
    const r = convertWeight(1, 'kilogram', 'pound');
    expect(r.value).toBeCloseTo(2.20462262, 6);
  });
});

describe('temperature conversion', () => {
  it('0°C = 32°F', () => {
    const r = convertTemperature(0, 'celsius', 'fahrenheit');
    expect(r.value).toBe(32);
  });
  it('100°C = 212°F', () => {
    const r = convertTemperature(100, 'celsius', 'fahrenheit');
    expect(r.value).toBe(212);
  });
  it('0K = -273.15°C', () => {
    const r = convertTemperature(0, 'kelvin', 'celsius');
    expect(r.value).toBeCloseTo(-273.15, 10);
  });
});

describe('area / volume / speed / time / digital', () => {
  it('1 sq-mile = 2589988.110336 m² exactly', () => {
    const r = convertArea(1, 'sq-mile', 'sq-meter');
    expect(r.value).toBeCloseTo(2589988.110336, 6);
  });
  it('1 US gallon = 3.785411784 liters exactly', () => {
    const r = convertVolume(1, 'us-gallon', 'liter');
    expect(r.value).toBeCloseTo(3.785411784, 9);
  });
  it('1 mph = 1.609344 km/h exactly', () => {
    const r = convertSpeed(1, 'mph', 'kph');
    expect(r.value).toBeCloseTo(1.609344, 9);
  });
  it('1 hour = 3600 seconds', () => {
    const r = convertTime(1, 'hour', 'second');
    expect(r.value).toBe(3600);
  });
  it('1 GiB = 1024 MiB', () => {
    const r = convertDigital(1, 'gibibyte', 'mebibyte');
    expect(r.value).toBe(1024);
  });
  it('1 GB = 1000 MB (decimal)', () => {
    const r = convertDigital(1, 'gigabyte', 'megabyte');
    expect(r.value).toBe(1000);
  });
});

describe('currency conversion', () => {
  it('returns no-rates error when rates missing', () => {
    const r = convertCurrency(1, 'USD', 'EUR', null);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('no-rates');
  });
  it('returns unknown-currency for missing code', () => {
    const r = convertCurrency(1, 'USD', 'XYZ', { USD: 1, EUR: 0.9 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('unknown-currency');
  });
  it('converts USD to EUR via per-USD rates', () => {
    const r = convertCurrency(100, 'USD', 'EUR', { USD: 1, EUR: 0.9 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(90, 6);
  });
  it('converts cross-pair (EUR to GBP) via USD basis', () => {
    const r = convertCurrency(100, 'EUR', 'GBP', { USD: 1, EUR: 0.9, GBP: 0.8 });
    expect(r.ok).toBe(true);
    // 100 EUR / 0.9 = 111.111 USD * 0.8 = 88.888 GBP
    if (r.ok) expect(r.value).toBeCloseTo(88.8888888, 5);
  });
});

describe('registry helpers', () => {
  it('runConversion dispatches to category', () => {
    const r = runConversion('length', 1, 'meter', 'foot');
    expect(r).not.toBeNull();
    expect(r!.value).toBeCloseTo(3.28083989, 6);
  });
  it('runConversion returns null for unknown category', () => {
    expect(runConversion('nope', 1, 'a', 'b')).toBeNull();
  });
  it('isPopularPath true for known popular pair', () => {
    expect(isPopularPath('length', 'kilometer-to-mile')).toBe(true);
  });
  it('isPopularPath false for unknown pair', () => {
    expect(isPopularPath('length', 'foo-to-bar')).toBe(false);
  });
  it('getCategoryBySlug + getConverterBySlug', () => {
    expect(getCategoryBySlug('length')?.id).toBe('length');
    expect(getConverterBySlug('length', 'meter-to-foot')?.from).toBe('meter');
  });
});

describe('search index', () => {
  it('returns empty for empty query', () => {
    expect(searchConverters('').length).toBe(0);
  });
  it('finds converters by unit name', () => {
    const r = searchConverters('mile');
    expect(r.length).toBeGreaterThan(0);
  });
  it('finds category', () => {
    const r = searchConverters('length');
    expect(r.some(x => x.type === 'category')).toBe(true);
  });
  it('caps results to limit', () => {
    const r = searchConverters('meter', 3);
    expect(r.length).toBeLessThanOrEqual(3);
  });
});

describe('pressure conversion (pascals basis)', () => {
  it('1 bar = 100000 Pa exactly', () => {
    const r = convertPressure(1, 'bar', 'pascal');
    expect(r.value).toBe(100000);
  });
  it('1 psi ≈ 6894.757 Pa (exact lbf/in²)', () => {
    const r = convertPressure(1, 'psi', 'pascal');
    expect(r.value).toBeCloseTo(6894.757293168361, 6);
  });
  it('1 atm = 760 torr exactly', () => {
    const r = convertPressure(1, 'atm', 'torr');
    expect(r.value).toBeCloseTo(760, 10);
  });
  it('round-trip psi→bar→psi', () => {
    const bar = convertPressure(35, 'psi', 'bar').value;
    const back = convertPressure(bar, 'bar', 'psi').value;
    expect(back).toBeCloseTo(35, 10);
  });
});

describe('energy conversion (joules basis)', () => {
  it('1 kWh = 3600000 J exactly', () => {
    const r = convertEnergy(1, 'kilowatt-hour', 'joule');
    expect(r.value).toBe(3600000);
  });
  it('1 kcal = 4.184 kJ exactly', () => {
    const r = convertEnergy(1, 'kilocalorie', 'kilojoule');
    expect(r.value).toBe(4.184);
  });
  it('1 BTU ≈ 1055.05585 J', () => {
    const r = convertEnergy(1, 'btu', 'joule');
    expect(r.value).toBeCloseTo(1055.05585262, 6);
  });
  it('round-trip kcal→kJ→kcal', () => {
    const kj = convertEnergy(250, 'kilocalorie', 'kilojoule').value;
    const back = convertEnergy(kj, 'kilojoule', 'kilocalorie').value;
    expect(back).toBeCloseTo(250, 10);
  });
});

describe('fuel economy conversion (L/100km intermediate)', () => {
  it('1 mpg (UK) = 282.480936 L/100km', () => {
    const r = convertFuel(1, 'mpg-uk', 'l-100km');
    expect(r.value).toBeCloseTo(282.480936, 4);
  });
  it('1 mpg (US) = 235.214583 L/100km', () => {
    const r = convertFuel(1, 'mpg-us', 'l-100km');
    expect(r.value).toBeCloseTo(235.214583, 4);
  });
  it('10 km/L = 10 L/100km', () => {
    const r = convertFuel(10, 'km-per-liter', 'l-100km');
    expect(r.value).toBeCloseTo(10, 10);
  });
  it('round-trip mpg-us→l-100km→mpg-us', () => {
    const l100 = convertFuel(30, 'mpg-us', 'l-100km').value;
    expect(l100).toBeCloseTo(7.8404861, 6);
    const back = convertFuel(l100, 'l-100km', 'mpg-us').value;
    expect(back).toBeCloseTo(30, 8);
  });
  it('round-trip km-per-liter→l-100km→km-per-liter', () => {
    const l100 = convertFuel(12, 'km-per-liter', 'l-100km').value;
    const back = convertFuel(l100, 'l-100km', 'km-per-liter').value;
    expect(back).toBeCloseTo(12, 10);
  });
  it('zero input yields a non-finite result (engine shows the fuel-economy error)', () => {
    const r = convertFuel(0, 'mpg-us', 'l-100km');
    expect(Number.isFinite(r.value)).toBe(false);
  });
});

describe('temperature: absolute zero guard', () => {
  it('throws below absolute zero (celsius input)', () => {
    expect(() => convertTemperature(-300, 'celsius', 'kelvin')).toThrow('Temperature below absolute zero');
  });
  it('throws below absolute zero (fahrenheit input)', () => {
    expect(() => convertTemperature(-500, 'fahrenheit', 'kelvin')).toThrow('Temperature below absolute zero');
  });
  it('throws below absolute zero even when target is not kelvin', () => {
    expect(() => convertTemperature(-300, 'celsius', 'fahrenheit')).toThrow('Temperature below absolute zero');
  });
  it('allows exactly 0 K (boundary is valid)', () => {
    const r = convertTemperature(0, 'kelvin', 'celsius');
    expect(r.value).toBeCloseTo(-273.15, 10);
  });
  it('allows exactly -273.15°C (boundary is valid)', () => {
    const r = convertTemperature(-273.15, 'celsius', 'kelvin');
    expect(r.value).toBeCloseTo(0, 10);
  });
});

describe('temperature: reaumur formulas', () => {
  it('reaumur→celsius shows the multiplication formula, not the fallback', () => {
    const r = convertTemperature(80, 'reaumur', 'celsius');
    expect(r.value).toBeCloseTo(100, 10);
    expect(r.formula).toContain('× 5/4');
  });
  it('reaumur→fahrenheit shows the full formula', () => {
    const r = convertTemperature(80, 'reaumur', 'fahrenheit');
    expect(r.value).toBe(212);
    expect(r.formula).toContain('× 9/4');
  });
  it('rankine→reaumur shows the full formula', () => {
    const r = convertTemperature(491.67, 'rankine', 'reaumur');
    expect(r.value).toBeCloseTo(0, 6);
    expect(r.formula).toContain('× 4/9');
  });
});
