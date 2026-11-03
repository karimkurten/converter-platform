import { describe, it, expect } from 'vitest';
import {
  INGREDIENTS,
  INGREDIENT_SOURCE,
  cupsToGrams,
  gramsToCups,
  gramsPerTablespoon,
  OVEN_CHART,
  ovenRowFor,
} from './cooking';
import { getConverterBySlug, getAllConverterPaths } from './converters/index';

describe('ingredient density math (King Arthur Baking chart weights)', () => {
  it('the cited values are the chart values verified 2026-11-03', () => {
    const byId = Object.fromEntries(INGREDIENTS.map(i => [i.id, i.gramsPerCup]));
    expect(byId['flour']).toBe(120);
    expect(byId['sugar']).toBe(198);
    expect(byId['brown-sugar']).toBe(213);
    expect(byId['powdered-sugar']).toBe(113);
    expect(byId['butter']).toBe(227);
    expect(byId['cocoa']).toBe(84);
    expect(byId['honey']).toBe(340);
    expect(byId['rolled-oats']).toBe(89);
    expect(INGREDIENT_SOURCE.url).toContain('kingarthurbaking.com');
  });

  it('1 cup of flour = 120 g; 1 cup of butter = 227 g', () => {
    expect(cupsToGrams('flour', 1)).toBe(120);
    expect(cupsToGrams('butter', 1)).toBe(227);
  });

  it('results are computed by multiplication, never stored', () => {
    expect(cupsToGrams('flour', 2.5)).toBe(300);
    expect(cupsToGrams('cocoa', 0.5)).toBe(42);
    expect(cupsToGrams('sugar', 1 / 3)).toBeCloseTo(66, 10);
    expect(cupsToGrams('butter', 0.5)).toBe(113.5);
  });

  it('grams → cups is the exact inverse', () => {
    expect(gramsToCups('flour', 120)).toBe(1);
    expect(gramsToCups('flour', 250)).toBeCloseTo(250 / 120, 10);
    expect(gramsToCups('butter', 227)).toBe(1);
    for (const ing of INGREDIENTS) {
      const back = gramsToCups(ing.id, cupsToGrams(ing.id, 1.75)!);
      expect(back).toBeCloseTo(1.75, 10);
    }
  });

  it('tablespoons divide the cup weight by 16', () => {
    expect(gramsPerTablespoon('flour')).toBe(7.5);
    expect(gramsPerTablespoon('honey')).toBe(21.25);
    expect(gramsPerTablespoon('butter')).toBeCloseTo(227 / 16, 10);
  });

  it('unknown ingredients return null instead of a fabricated weight', () => {
    expect(cupsToGrams('unobtainium', 1)).toBeNull();
    expect(gramsToCups('unobtainium', 100)).toBeNull();
  });
});

describe('oven temperature chart', () => {
  it('180 °C = 356 °F exactly, gas mark 4 (Batch A standard)', () => {
    const row = ovenRowFor(180);
    expect(row).toBeDefined();
    expect(row!.fahrenheit).toBe(356);
    expect(row!.gasMark).toBe('4');
  });

  it('every Fahrenheit value is the exact engine conversion of its Celsius', () => {
    for (const row of OVEN_CHART) {
      expect(row.fahrenheit).toBe((row.celsius * 9) / 5 + 32);
    }
  });

  it('gas marks ascend with temperature across the whole chart', () => {
    const marks = OVEN_CHART.map(r => parseFloat(r.gasMark.replace('¼', '0.25').replace('½', '0.5')));
    for (let i = 1; i < marks.length; i++) {
      expect(marks[i]).toBeGreaterThan(marks[i - 1]);
      expect(OVEN_CHART[i].celsius).toBeGreaterThan(OVEN_CHART[i - 1].celsius);
    }
  });
});

describe('cooking pages in the registry', () => {
  it('both converter directions and the oven chart are registered and popular', () => {
    expect(getConverterBySlug('cooking', 'cups-to-grams')?.popular).toBe(true);
    expect(getConverterBySlug('cooking', 'grams-to-cups')?.popular).toBe(true);
    expect(getConverterBySlug('cooking', 'oven-temperature-chart')?.popular).toBe(true);
  });

  it('every ingredient has a registered page', () => {
    for (const ing of INGREDIENTS) {
      expect(getConverterBySlug('cooking', `${ing.id}-cups-to-grams`)?.popular).toBe(true);
    }
  });

  it('spoon and cup pairs are popular in the cooking category (the cluster anchors)', () => {
    for (const id of [
      'tablespoon-to-milliliter',
      'milliliter-to-tablespoon',
      'teaspoon-to-milliliter',
      'milliliter-to-teaspoon',
      'us-cup-to-milliliter',
      'milliliter-to-us-cup',
    ]) {
      expect(getConverterBySlug('cooking', id)?.popular).toBe(true);
    }
  });

  it('all cooking cluster paths flow into getAllConverterPaths (sitemap source)', () => {
    const paths = getAllConverterPaths().map(p => `${p.category}/${p.converter}`);
    expect(paths).toContain('cooking/cups-to-grams');
    expect(paths).toContain('cooking/grams-to-cups');
    expect(paths).toContain('cooking/oven-temperature-chart');
    expect(paths).toContain('cooking/flour-cups-to-grams');
    expect(paths).toContain('cooking/tablespoon-to-milliliter');
  });
});
