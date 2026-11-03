import { describe, it, expect } from 'vitest';
import { cmToFeetInches, feetInchesToCm, HEIGHT_VALUES } from './height';
import { getConverterBySlug, getAllConverterPaths } from './converters/index';

describe('height conversion (cm ↔ feet + inches)', () => {
  it('175 cm = 5 ft 8.9 in (1 inch = 2.54 cm exactly)', () => {
    const r = cmToFeetInches(175);
    expect(r.feet).toBe(5);
    expect(r.inches).toBeCloseTo(8.9, 10);
    expect(r.display).toBe('5 ft 8.9 in');
    expect(r.symbolDisplay).toBe(`5'8.9"`);
    expect(r.totalInches).toBeCloseTo(68.8976378, 6);
  });

  it('175 cm fraction display rounds to the nearest eighth: 5 ft 8⅞ in', () => {
    expect(cmToFeetInches(175).fractionDisplay).toBe('5 ft 8⅞ in');
  });

  it('160 cm = 5 ft 3 in — fraction carry never shows 2 + a full inch glyph', () => {
    const r = cmToFeetInches(160);
    expect(r.display).toBe('5 ft 3 in');
    expect(r.fractionDisplay).toBe('5 ft 3 in');
  });

  it('190 cm = 6 ft 2.8 in, fraction 6 ft 2¾ in', () => {
    const r = cmToFeetInches(190);
    expect(r.display).toBe('6 ft 2.8 in');
    expect(r.fractionDisplay).toBe('6 ft 2¾ in');
  });

  it('chart endpoints: 140 cm = 4 ft 7.1 in, 210 cm = 6 ft 10.7 in', () => {
    expect(cmToFeetInches(140).display).toBe('4 ft 7.1 in');
    expect(cmToFeetInches(210).display).toBe('6 ft 10.7 in');
  });

  it('inches remainder always stays in [0, 12) across the chart range', () => {
    for (let cm = 140; cm <= 210; cm += 0.5) {
      const r = cmToFeetInches(cm);
      expect(r.inches).toBeGreaterThanOrEqual(0);
      expect(r.inches).toBeLessThan(12);
    }
  });

  it('feet + inches back to cm uses the exact constants', () => {
    expect(feetInchesToCm(5, 9)).toBeCloseTo(175.26, 10);
    expect(feetInchesToCm(6, 0)).toBeCloseTo(182.88, 10);
    expect(feetInchesToCm(0, 1)).toBeCloseTo(2.54, 10);
  });

  it('round trip cm → feet/inches → cm stays within the 0.1 in display rounding', () => {
    for (const cm of [140, 155, 160, 167.5, 175, 183, 190, 200, 210]) {
      const r = cmToFeetInches(cm);
      const back = feetInchesToCm(r.feet, r.inches);
      expect(Math.abs(back - cm)).toBeLessThan(0.13);
    }
  });
});

describe('height pages in the registry', () => {
  it('both height converter directions are registered and popular (indexable)', () => {
    expect(getConverterBySlug('length', 'centimeter-to-feet-inches')?.popular).toBe(true);
    expect(getConverterBySlug('length', 'feet-inches-to-centimeter')?.popular).toBe(true);
  });

  it('the height chart and every specific-value page are registered', () => {
    expect(getConverterBySlug('length', 'height-chart')?.popular).toBe(true);
    for (const cm of HEIGHT_VALUES) {
      expect(getConverterBySlug('length', `${cm}-cm-to-feet-inches`)?.popular).toBe(true);
    }
  });

  it('cm ↔ foot pairs now exist as popular pairs (the cluster anchor)', () => {
    expect(getConverterBySlug('length', 'centimeter-to-foot')?.popular).toBe(true);
    expect(getConverterBySlug('length', 'foot-to-centimeter')?.popular).toBe(true);
  });

  it('all height paths flow into getAllConverterPaths (sitemap source)', () => {
    const paths = getAllConverterPaths().map(p => `${p.category}/${p.converter}`);
    expect(paths).toContain('length/centimeter-to-feet-inches');
    expect(paths).toContain('length/height-chart');
    expect(paths).toContain('length/175-cm-to-feet-inches');
  });
});
