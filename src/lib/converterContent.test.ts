import { describe, it, expect } from 'vitest';
import { generateConverterContent } from './converterContent';
import { getCategoryBySlug, getConverterBySlug } from './converters';

function content(catSlug: string, convId: string, opts?: Parameters<typeof generateConverterContent>[2]) {
  const category = getCategoryBySlug(catSlug)!;
  const converter = getConverterBySlug(catSlug, convId)!;
  return generateConverterContent(converter, category, opts);
}

function allText(c: ReturnType<typeof generateConverterContent>): string {
  return [
    c.formulaSection, c.explanationSection, c.usageSection, c.mistakesSection,
    c.tableSection, ...c.faqs.map(f => `${f.q} ${f.a}`),
  ].join('\n');
}

describe('CN-13: currency pages never publish a placeholder factor', () => {
  it('without a rate snapshot, publishes no numeric factor and no table', () => {
    const c = content('currency', 'USD-to-CAD');
    const text = allText(c);
    expect(text).not.toMatch(/equals 0\b/);
    expect(text).not.toMatch(/by 0\b/);
    expect(text).not.toContain('There are 0');
    expect(c.table).toHaveLength(0);
    expect(c.formulaSection).toContain('no fixed conversion factor');
  });

  it('with a dated snapshot, uses the real rate and labels its date', () => {
    const c = content('currency', 'USD-to-CAD', {
      currencyRate: { rate: 1.36, asOf: '2026-11-02' },
    });
    expect(c.formulaSection).toContain('as of 2026-11-02');
    expect(c.formulaSection).toContain('1.36');
    expect(c.table).toHaveLength(20);
    expect(c.table.find(r => r.v === 1)?.r).toBe('1.36');
    expect(c.tableSection).toContain('2026-11-02');
  });
});

describe('CN-14: formula prose matches the tables’ math', () => {
  it('celsius → fahrenheit is affine (°F = °C × 1.8 + 32), not “multiply by 33.8”', () => {
    const c = content('temperature', 'celsius-to-fahrenheit');
    expect(c.formulaSection).toContain('°F = °C × 1.8 + 32');
    expect(allText(c)).not.toMatch(/multiply (any|your) celsius value by 33\.8/i);
    // 1 °C appears only as a worked example (33.8 °F), with the offset explained
    expect(c.faqs[0].a).toContain('different zero points');
    expect(c.faqs[0].a).toContain('33.8');
  });

  it('fahrenheit → kelvin carries slope and offset', () => {
    const c = content('temperature', 'fahrenheit-to-kelvin');
    expect(c.formulaSection).toContain('K = °F × 0.555556 + 255.372');
  });

  it('mpg (US) → L/100km is an inverse (divide), not a multiplication', () => {
    const c = content('fuel', 'mpg-us-to-l-100km');
    expect(c.formulaSection).toContain('L/100km = 235.215 ÷ mpg (US)');
    expect(allText(c)).not.toMatch(/multiply any miles per gallon/i);
    expect(c.faqs[1].a).toContain('Divide');
  });

  it('L/100km → mpg (US) is also inverse', () => {
    const c = content('fuel', 'l-100km-to-mpg-us');
    expect(c.formulaSection).toContain('235.215 ÷');
  });

  it('linear pairs still state a constant factor', () => {
    const c = content('weight', 'kilogram-to-pound');
    expect(c.formulaSection).toContain('1 Kilogram equals 2.20462 Pound');
  });
});

describe('CN-15: filler facts come from per-unit data', () => {
  it('hectare is metric, not imperial', () => {
    const c = content('area', 'hectare-to-acre');
    expect(c.explanationSection).toContain('part of the Metric measurement system');
    expect(c.explanationSection).not.toContain('Hectare (ha) is part of the Imperial');
  });

  it('bar is metric', () => {
    const c = content('pressure', 'bar-to-psi');
    expect(c.explanationSection).toContain('Bar (bar) is part of the Metric measurement system');
  });

  it('gigabyte and gibibyte share the digital system label', () => {
    const c = content('digital', 'gigabyte-to-gibibyte');
    expect(c.explanationSection).toContain('both International (digital) units');
  });

  it('L/100km is used in Canada and Europe, not “primarily the United States”', () => {
    const c = content('fuel', 'mpg-us-to-l-100km');
    expect(c.faqs[3].a).toContain('Canada and Europe');
  });

  it('common mistakes are category-specific (no temperature copy on length pages)', () => {
    const len = content('length', 'meter-to-foot');
    expect(len.mistakesSection).not.toContain('temperature');
    const temp = content('temperature', 'celsius-to-fahrenheit');
    expect(temp.mistakesSection).toContain('temperature differences');
  });

  it('tiny factors are not rounded down to “equals 0”', () => {
    const c = content('length', 'millimeter-to-mile');
    expect(c.formulaSection).not.toMatch(/equals 0(\s|\.)/);
    expect(c.table.find(r => r.v === 500)?.r).not.toBe('0');
  });
});
