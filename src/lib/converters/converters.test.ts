import { describe, it, expect } from 'vitest';
import { convertLength } from './length';
import { convertWeight } from './weight';
import { convertTemperature } from './temperature';
import { convertArea, convertVolume, convertSpeed, convertTime, convertDigital } from './units';
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
