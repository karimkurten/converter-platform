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

describe('Batch E: worked examples are computed, not typed', () => {
  it('kg → lb works the searched values with the exact factor', () => {
    const c = content('weight', 'kilogram-to-pound');
    const ex70 = c.examples.find(e => e.input === '70 kg');
    expect(ex70).toBeDefined();
    expect(ex70!.working).toBe('70 kg × 2.20462');
    expect(ex70!.result).toBe('154.324 lb'); // 70 × 2.2046226… = 154.32356…
    expect(c.examples.map(e => e.input)).toEqual(['50 kg', '60 kg', '70 kg', '80 kg', '90 kg', '100 kg']);
  });

  it('°C → °F examples apply the affine formula (× 1.8 + 32)', () => {
    const c = content('temperature', 'celsius-to-fahrenheit');
    const oven = c.examples.find(e => e.input === '180 °C');
    expect(oven!.working).toBe('180 °C × 1.8 + 32');
    expect(oven!.result).toBe('356 °F');
    expect(oven!.note).toBe('A moderate oven');
    const same = c.examples.find(e => e.input === '-40 °C');
    expect(same!.result).toBe('-40 °F');
  });

  it('km → mi examples carry the standard race distances', () => {
    const c = content('length', 'kilometer-to-mile');
    const marathon = c.examples.find(e => e.input === '42.195 km');
    expect(marathon!.note).toBe('Marathon distance');
    expect(marathon!.result).toBe('26.219 mi'); // 42.195 × 0.621371… = 26.2188…
  });

  it('fuel examples divide the constant (inverse pair)', () => {
    const c = content('fuel', 'mpg-us-to-l-100km');
    const ex = c.examples.find(e => e.input === '10 mpg (US)');
    expect(ex!.working).toBe('235.215 ÷ 10 mpg (US)');
    expect(ex!.result).toBe('23.521 L/100km');
  });

  it('long-tail pairs get ladder examples with correct math', () => {
    const c = content('length', 'meter-to-yard');
    expect(c.examples.length).toBeGreaterThanOrEqual(2);
    const ex = c.examples.find(e => e.input === '100 m');
    expect(ex!.working).toBe('100 m × 1.09361');
    expect(ex!.result).toBe('109.361 yd');
  });

  it('extreme pairs still produce non-zero examples', () => {
    const c = content('length', 'millimeter-to-mile');
    expect(c.examples.length).toBeGreaterThanOrEqual(2);
    for (const e of c.examples) expect(e.result).not.toBe('0 mi');
  });

  it('currency examples exist only with a dated snapshot, computed from it', () => {
    const noRate = content('currency', 'USD-to-CAD');
    expect(noRate.examples).toHaveLength(0);
    const withRate = content('currency', 'USD-to-CAD', {
      currencyRate: { rate: 1.36, asOf: '2026-11-02' },
    });
    const ex = withRate.examples.find(e => e.input === '100 USD');
    expect(ex!.working).toBe('100 USD × 1.36');
    expect(ex!.result).toBe('136 CAD');
    expect(withRate.examplesSection).toContain('as of 2026-11-02');
  });

  it('kelvin examples include absolute zero', () => {
    const c = content('temperature', 'kelvin-to-celsius');
    const zero = c.examples.find(e => e.input === '0 K');
    expect(zero!.note).toBe('Absolute zero');
    expect(zero!.result).toBe('-273.15 °C');
  });
});

describe('Batch E: table depth + context columns', () => {
  it('head pairs get 50-row tables; table prose states the real count', () => {
    for (const [cat, id] of [
      ['weight', 'kilogram-to-pound'],
      ['weight', 'pound-to-kilogram'],
      ['length', 'centimeter-to-inch'],
      ['length', 'kilometer-to-mile'],
      ['temperature', 'celsius-to-fahrenheit'],
      ['temperature', 'fahrenheit-to-celsius'],
      ['volume', 'us-gallon-to-liter'],
    ] as const) {
      const c = content(cat, id);
      expect(c.table, `${cat}/${id}`).toHaveLength(50);
      expect(c.tableSection).toContain('50 common conversion values');
    }
    const tail = content('length', 'meter-to-yard');
    expect(tail.table).toHaveLength(20);
  });

  it('kg → lb table breaks results into stones & pounds', () => {
    const c = content('weight', 'kilogram-to-pound');
    expect(c.tableContextHeader).toBe('Also in stones & pounds');
    expect(c.table.find(r => r.v === 70)?.c).toBe('11 st 0.3 lb'); // 154.324 lb = 11 st + 0.324 lb
    expect(c.table.find(r => r.v === 100)?.c).toBe('15 st 10.5 lb'); // 220.462 lb = 15 st + 10.462 lb
  });

  it('lb → kg table breaks the pounds inputs into stones & pounds', () => {
    const c = content('weight', 'pound-to-kilogram');
    expect(c.tableContextHeader).toBe('Pounds in stones & pounds');
    expect(c.table.find(r => r.v === 150)?.c).toBe('10 st 10 lb');
    expect(c.table.find(r => r.v === 1)?.c).toBeUndefined();
  });

  it('°C → °F table annotates standard reference points', () => {
    const c = content('temperature', 'celsius-to-fahrenheit');
    expect(c.tableContextHeader).toBe('Good to know');
    expect(c.table.find(r => r.v === 100)?.c).toBe('Water boils at sea level');
    expect(c.table.find(r => r.v === 180)?.c).toBe('Moderate oven (Gas Mark 4)');
    expect(c.table.find(r => r.v === 3)?.c).toBeUndefined();
  });

  it('km → mi table flags race distances', () => {
    const c = content('length', 'kilometer-to-mile');
    expect(c.tableContextHeader).toBe('Race distances');
    expect(c.table.find(r => r.v === 42.195)?.c).toBe('Marathon');
    expect(c.table.find(r => r.v === 21.0975)?.c).toBe('Half marathon');
  });

  it('small-result weight pairs get no stones column', () => {
    const c = content('weight', 'gram-to-pound');
    expect(c.tableContextHeader).toBeNull();
  });
});

describe('Batch E: mental-math shortcuts are honest', () => {
  it('head pairs use their checked shortcuts', () => {
    expect(content('weight', 'kilogram-to-pound').quickEstimate).toContain('multiply kilograms by 2.2');
    expect(content('weight', 'pound-to-kilogram').quickEstimate).toContain('divide pounds by 2.2');
    expect(content('temperature', 'celsius-to-fahrenheit').quickEstimate).toContain('double the Celsius value and add 30');
    expect(content('temperature', 'celsius-to-kelvin').quickEstimate).toContain('add 273.15');
  });

  it('generated shortcuts state the rounding error of the rounded factor', () => {
    // meter → yard: exact factor 1.09361, rounded 1.1 → error ≈ 0.58%
    const c = content('length', 'meter-to-yard');
    expect(c.quickEstimate).toContain('multiply meter by 1.1');
    expect(c.quickEstimate).toContain('within about 0.6%');
  });

  it('inverse pairs estimate with the rounded constant and its error', () => {
    const c = content('fuel', 'mpg-us-to-l-100km');
    expect(c.quickEstimate).toContain('divide 235 by');
    expect(c.quickEstimate).toContain('within about 0.1%');
  });

  it('currency shortcut never invents a rate', () => {
    const c = content('currency', 'USD-to-CAD');
    expect(c.quickEstimate).toContain("round today's rate");
    expect(c.quickEstimate).not.toMatch(/\d+\.\d+/);
  });
});
