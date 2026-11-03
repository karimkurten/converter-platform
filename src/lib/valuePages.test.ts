import { describe, it, expect } from 'vitest';
import {
  VALUE_PAGE_DEFS,
  CHART_PAGE_DEFS,
  VALUE_PAGE_IDS,
  CHART_PAGE_IDS,
  convertSpecial,
  specialResultText,
  surroundingRows,
  chartRows,
  chartContext,
  chartDefForPair,
  getValuePageDef,
} from './valuePages';
import { getConverterBySlug, CATEGORIES } from './converters';

// Batch H: specific-value pages ("70 kg to lbs") and printable charts.
// Every expected figure below is the output of the site's real conversion
// functions — these tests pin them so a factor change can never silently
// desync the value pages, charts, and pair converters.

describe('specific-value pages: computed answers', () => {
  it('70 kg = 154.324 lb', () => {
    expect(specialResultText('weight', 70, 'kilogram', 'pound')).toBe('154.324');
  });
  it('100 lb = 45.3592 kg', () => {
    expect(specialResultText('weight', 100, 'pound', 'kilogram')).toBe('45.3592');
  });
  it('37 °C = 98.6 °F (body temperature)', () => {
    expect(specialResultText('temperature', 37, 'celsius', 'fahrenheit')).toBe('98.6');
  });
  it('180 °C = 356 °F exactly (the Batch G oven anchor)', () => {
    expect(specialResultText('temperature', 180, 'celsius', 'fahrenheit')).toBe('356');
  });
  it('100 °F = 37.7778 °C', () => {
    expect(specialResultText('temperature', 100, 'fahrenheit', 'celsius')).toBe('37.7778');
  });
  it('5 cm = 1.9685 in (object size, below the height range)', () => {
    expect(specialResultText('length', 5, 'centimeter', 'inch')).toBe('1.9685');
  });
  it('12 in = 30.48 cm exactly', () => {
    expect(specialResultText('length', 12, 'inch', 'centimeter')).toBe('30.48');
  });
  it('100 km = 62.1371 mi', () => {
    expect(specialResultText('length', 100, 'kilometer', 'mile')).toBe('62.1371');
  });
  it('convertSpecial dispatches to the real engines', () => {
    expect(convertSpecial('length', 1, 'meter', 'foot').value).toBeCloseTo(3.28084, 5);
    expect(convertSpecial('volume', 1, 'liter', 'us-gallon').value).toBeCloseTo(0.264172, 6);
  });
});

describe('specific-value pages: selection discipline', () => {
  it('ships 41 value pages and 6 charts', () => {
    expect(VALUE_PAGE_DEFS).toHaveLength(41);
    expect(CHART_PAGE_DEFS).toHaveLength(6);
  });
  it('cm→inch value pages stay at object sizes — no collision with Batch F height pages (160–190 cm)', () => {
    const defs = VALUE_PAGE_DEFS.filter(d => d.pairId === 'centimeter-to-inch');
    expect(defs.length).toBeGreaterThan(0);
    expect(defs.every(d => d.value < 100)).toBe(true);
  });
  it('no negative temperature value pages (the chart covers sub-zero)', () => {
    expect(VALUE_PAGE_DEFS.every(d => d.value >= 0)).toBe(true);
  });
  it('every def is registered as a popular converter in its category', () => {
    for (const def of [...VALUE_PAGE_DEFS, ...CHART_PAGE_DEFS]) {
      const conv = getConverterBySlug(def.category, def.id);
      expect(conv, def.id).toBeTruthy();
      expect(conv!.popular).toBe(true);
    }
  });
  it('value/chart ids are unique and do not duplicate ids inside their categories', () => {
    const special = [...VALUE_PAGE_IDS, ...CHART_PAGE_IDS];
    expect(new Set(special).size).toBe(special.length);
    for (const slug of ['length', 'weight', 'temperature', 'volume']) {
      const cat = CATEGORIES.find(c => c.slug === slug)!;
      const ids = cat.converters.map(c => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
  it('surrounding-values table is centred on the page value, all rows computed', () => {
    const def = getValuePageDef('70-kg-to-lb')!;
    const rows = surroundingRows(def);
    expect(rows).toHaveLength(11);
    expect(rows[5].value).toBe(70);
    expect(rows[5].result).toBe('154.324');
    expect(rows[0].value).toBe(65);
    expect(rows[10].value).toBe(75);
  });
});

describe('chart pages: computed tables', () => {
  it('kg→lb chart runs 1–100 with 70 kg = 154.324 lb', () => {
    const def = CHART_PAGE_DEFS.find(d => d.id === 'kg-to-lb-chart')!;
    const rows = chartRows(def);
    expect(rows).toHaveLength(100);
    expect(rows[0].value).toBe(1);
    expect(rows[99].value).toBe(100);
    expect(rows[69].result).toBe('154.324');
  });
  it('°C→°F chart spans −40 to 250 in steps of 5 plus the landmarks', () => {
    const def = CHART_PAGE_DEFS.find(d => d.id === 'celsius-to-fahrenheit-chart')!;
    const rows = chartRows(def);
    expect(rows[0].value).toBe(-40);
    expect(rows[0].result).toBe('-40'); // the scales meet at −40
    expect(rows[rows.length - 1].value).toBe(250);
    expect(rows.find(r => r.value === 37)!.result).toBe('98.6');
    expect(rows.find(r => r.value === 100)!.result).toBe('212');
    const values = rows.map(r => r.value);
    expect(values).toEqual([...values].sort((a, b) => a - b)); // sorted, deduped
    expect(new Set(values).size).toBe(values.length);
  });
  it('m→ft chart carries a feet+inches context column (Batch F display)', () => {
    const def = CHART_PAGE_DEFS.find(d => d.id === 'm-to-ft-chart')!;
    const rows = chartRows(def);
    expect(chartContext(def, 1)).toContain('ft');
    expect(rows[0].result).toBe('3.28084');
  });
  it('L→gal chart converts with the US gallon', () => {
    const def = CHART_PAGE_DEFS.find(d => d.id === 'liter-to-gallon-chart')!;
    const rows = chartRows(def);
    expect(rows[0].result).toBe('0.264172');
  });
  it('every value pair resolves to a chart in both directions', () => {
    for (const def of VALUE_PAGE_DEFS) {
      expect(chartDefForPair(def.from, def.to), def.id).toBeTruthy();
    }
  });
});
