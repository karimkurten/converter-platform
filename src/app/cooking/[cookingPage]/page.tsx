import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { getCategoryBySlug, COOKING_CONVERTERS, COOKING_CONVERTER_IDS, getRelatedConverters } from '@/lib/converters';
import type { Converter } from '@/types';
import { buildCookingMetadata } from '@/lib/seo';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { RelatedConversions, RelatedConverters } from '@/components/converter/ConverterWidgets';
import ContextualProductWidget from '@/components/affiliate/ContextualProductWidget';
import CookingEngine from '@/components/converter/CookingEngine';
import { blogPosts } from '@/lib/blog';
import {
  INGREDIENTS,
  INGREDIENT_SOURCE,
  OVEN_CHART,
  OVEN_CHART_ID,
  getIngredient,
  cupsToGrams,
  gramsToCups,
  gramsPerTablespoon,
  fmtGrams,
  fmtCups,
  ovenRowFor,
  CUP_TABLE_AMOUNTS,
  GRAM_TABLE_AMOUNTS,
  type Ingredient,
} from '@/lib/cooking';
import { convertTemperature } from '@/lib/converters/temperature';

// ─── Cooking cluster pages (Batch G) ─────────────────────────────────────
// The /cooking hub existed with ZERO converter pages (CN-12): every cooking
// pair page converted volumes only, so the site had no answer for "cups to
// grams" — the most-searched cooking conversion — and no oven chart.
// These pages are dedicated routes for the same reason as Batch F's height
// pages: a cup's weight in grams depends on the ingredient, which the
// unit-pair architecture cannot express. All weights come from the King
// Arthur Baking Ingredient Weight Chart (see src/lib/cooking.ts) and every
// number on these pages is computed from those densities — results are
// labelled approximate because cup weights vary with scooping, sifting and
// packing. `dynamicParams = false` + generateStaticParams means ONLY the
// ids in COOKING_CONVERTERS are served here; other /cooking/* URLs fall
// through to the pair route as before.
export const dynamicParams = false;

export function generateStaticParams() {
  return COOKING_CONVERTERS.map(c => ({ cookingPage: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cookingPage: string }>;
}): Promise<Metadata> {
  const { cookingPage } = await params;
  const converter = COOKING_CONVERTERS.find(c => c.id === cookingPage);
  if (!converter) return {};
  return buildCookingMetadata(converter);
}

const SITE_URL = 'https://www.convertnow.ca';

interface Faq {
  q: string;
  a: string;
}

/** Ingredient id for a `${id}-cups-to-grams` page, or undefined. */
function ingredientFor(converterId: string): Ingredient | undefined {
  if (!converterId.endsWith('-cups-to-grams')) return undefined;
  return getIngredient(converterId.replace(/-cups-to-grams$/, ''));
}

/** Computed anchor values used across the cluster copy. */
function anchors() {
  return {
    flour: cupsToGrams('flour', 1) ?? 0,
    sugar: cupsToGrams('sugar', 1) ?? 0,
    butter: cupsToGrams('butter', 1) ?? 0,
  };
}

/** The approximation + source note every cooking page carries. */
function SourceNote() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-5 border border-amber-200 dark:border-amber-900">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Weights are approximate — and sourced</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        Cup weights come from the{' '}
        <a
          href={INGREDIENT_SOURCE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-500 hover:underline font-medium"
        >
          {INGREDIENT_SOURCE.name}
        </a>
        , the standard reference US bakers use. A cup is a volume, so the weight you actually
        get depends on how you fill it — scooping flour straight from the bag packs in more
        than spooning it in and levelling it off, and sifted flour weighs less still. Treat
        these figures as the chart standard, and weigh with a scale when a recipe is fussy.
      </p>
    </div>
  );
}

/** Cross-links to the volume pair pages (cups↔ml etc.). */
function VolumeLinks() {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        Measuring by volume instead?
      </h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
        If your recipe stays in volumes, these converters handle the metric side — a US cup
        is about 237 ml, a tablespoon about 15 ml:
      </p>
      <ul className="space-y-1.5 text-[15px]">
        <li>
          <Link href="/cooking/us-cup-to-milliliter" className="text-brand-500 hover:underline font-medium">
            Cups to Milliliters
          </Link>{' '}
          — US cups to ml for liquids and volumes.
        </li>
        <li>
          <Link href="/cooking/tablespoon-to-milliliter" className="text-brand-500 hover:underline font-medium">
            Tablespoons to Milliliters
          </Link>{' '}
          — tbsp to ml for small measures.
        </li>
        <li>
          <Link href="/cooking/teaspoon-to-milliliter" className="text-brand-500 hover:underline font-medium">
            Teaspoons to Milliliters
          </Link>{' '}
          — tsp to ml for spices and extracts.
        </li>
      </ul>
    </section>
  );
}

// ─── Ingredient page ──────────────────────────────────────────────────────

function IngredientContent({ ingredient }: { ingredient: Ingredient }) {
  const gpc = ingredient.gramsPerCup;
  const halfCup = cupsToGrams(ingredient.id, 0.5) ?? 0;
  const tbsp = gramsPerTablespoon(ingredient.id) ?? 0;
  const faqs: Faq[] = [
    {
      q: `How many grams is 1 cup of ${ingredient.name.toLowerCase()}?`,
      a: `1 cup of ${ingredient.name.toLowerCase()} weighs ${fmtGrams(gpc)} grams on the King Arthur Baking Ingredient Weight Chart. Cup weights are approximate — how you fill the cup (scooped, spooned, sifted, packed) moves the real weight, which is why weighing is more reliable than measuring by volume.`,
    },
    {
      q: `How many grams is ½ cup of ${ingredient.name.toLowerCase()}?`,
      a: `½ cup of ${ingredient.name.toLowerCase()} weighs ${fmtGrams(halfCup)} grams — exactly half the ${fmtGrams(gpc)} g chart weight for a full cup.`,
    },
    {
      q: `How many cups is 250 grams of ${ingredient.name.toLowerCase()}?`,
      a: `250 grams of ${ingredient.name.toLowerCase()} is about ${fmtCups(gramsToCups(ingredient.id, 250) ?? 0)} cups (250 g ÷ ${fmtGrams(gpc)} g per cup). Use the converter above for any other amount.`,
    },
    {
      q: `Why do other charts list a different weight for a cup of ${ingredient.name.toLowerCase()}?`,
      a: `Because a cup measures volume, not weight, every chart has to assume a filling method. ${ingredient.note} This page uses the King Arthur Baking chart throughout, so its tables and converter always agree with each other.`,
    },
  ];

  const others = INGREDIENTS.filter(i => i.id !== ingredient.id);
  const extraLinks = [
    { label: 'Cups to Grams — all ingredients', href: '/cooking/cups-to-grams' },
    { label: 'Grams to Cups — all ingredients', href: '/cooking/grams-to-cups' },
    { label: 'Oven Temperature Chart', href: `/cooking/${OVEN_CHART_ID}` },
    ...others.slice(0, 4).map(i => ({
      label: `${i.name} Cups to Grams`,
      href: `/cooking/${i.id}-cups-to-grams`,
    })),
  ];

  const jsx = (
    <>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        <strong className="text-gray-900 dark:text-white">
          1 cup of {ingredient.name.toLowerCase()} = {fmtGrams(gpc)} grams
        </strong>{' '}
        (about {fmtGrams(tbsp)} g per tablespoon). That is the {INGREDIENT_SOURCE.name} weight —
        the standard US baking reference. Enter cups below for grams, or use the grams-to-cups
        table further down the page to go the other way.
      </p>

      <CookingEngine mode="cups" fixedIngredient={ingredient.id} />

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {ingredient.name}: cups to grams
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {ingredient.note} Every row below is the same calculation — cups × {fmtGrams(gpc)} g
          per cup — so the table and the converter can never disagree.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">Cups</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">Grams</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">Same volume in tbsp</th>
              </tr>
            </thead>
            <tbody>
              {CUP_TABLE_AMOUNTS.map(({ cups, label }) => (
                <tr key={label} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{label}</td>
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {fmtGrams(cupsToGrams(ingredient.id, cups) ?? 0)} g
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    {fmtCups(cups * 16)} tbsp
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {ingredient.name}: grams to cups
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          Going the other way — a metric recipe weighed out, an American one to fill — divide
          grams by {fmtGrams(gpc)} g per cup:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">Grams</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">Cups</th>
              </tr>
            </thead>
            <tbody>
              {GRAM_TABLE_AMOUNTS.map(g => (
                <tr key={g} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{g} g</td>
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {fmtCups(gramsToCups(ingredient.id, g) ?? 0)} cups
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SourceNote />
      <VolumeLinks />
    </>
  );

  return { jsx, faqs, extraLinks };
}

// ─── Generic cups↔grams pages ─────────────────────────────────────────────

function GenericContent({ converter }: { converter: Converter }) {
  const toGrams = converter.id === 'cups-to-grams';
  const a = anchors();
  const faqs: Faq[] = toGrams
    ? [
        {
          q: 'Why is there no single cups-to-grams conversion?',
          a: `A cup measures volume and a gram measures weight, so the answer depends on what is in the cup: 1 cup of all-purpose flour weighs ${fmtGrams(a.flour)} g, granulated sugar ${fmtGrams(a.sugar)} g and butter ${fmtGrams(a.butter)} g. Any chart that gives one number for "a cup" without naming the ingredient is guessing. Pick the ingredient and the conversion is exact arithmetic: cups × that ingredient's grams per cup.`,
        },
        {
          q: 'How many grams are in a cup of flour?',
          a: `${fmtGrams(a.flour)} grams for all-purpose flour, on the King Arthur Baking Ingredient Weight Chart. Spooned-and-levelled, scooped and sifted cups all weigh slightly different amounts — the chart value is the standard reference, and results here are labelled approximate for that reason.`,
        },
        {
          q: 'Where do these ingredient weights come from?',
          a: `Every weight on this page is from the ${INGREDIENT_SOURCE.name} — the chart King Arthur Baking publishes from weighing ingredients in its own test kitchen. The converter and tables compute from those grams-per-cup figures, so they always agree.`,
        },
        {
          q: 'How do I convert grams back to cups?',
          a: `Divide the grams by the ingredient's grams per cup — or use the grams-to-cups converter, which does it for all eight ingredients with a full table.`,
        },
      ]
    : [
        {
          q: 'How do I convert grams to cups?',
          a: `Divide the grams by the ingredient's weight per cup: cups = grams ÷ grams per cup. For all-purpose flour that is grams ÷ ${fmtGrams(a.flour)}; for granulated sugar, grams ÷ ${fmtGrams(a.sugar)}. The ingredient matters — 250 g of flour is about ${fmtCups(gramsToCups('flour', 250) ?? 0)} cups, but 250 g of sugar is only about ${fmtCups(gramsToCups('sugar', 250) ?? 0)} cups.`,
        },
        {
          q: 'How many cups is 250 grams of flour?',
          a: `About ${fmtCups(gramsToCups('flour', 250) ?? 0)} cups (250 g ÷ ${fmtGrams(a.flour)} g per cup, King Arthur Baking chart). For a different amount or ingredient, the converter above does the same division.`,
        },
        {
          q: 'Why do grams-to-cups results look imprecise?',
          a: `Because cups are imprecise: the same cup of flour can weigh noticeably more scooped than spooned. The gram figure is exact; the cup figure is the chart-standard equivalent, labelled approximate. When a recipe gives grams, weighing is the most faithful way to follow it.`,
        },
        {
          q: 'Where do these ingredient weights come from?',
          a: `Every weight on this page is from the ${INGREDIENT_SOURCE.name}. The converter divides by those grams-per-cup figures, so the converter and tables always agree.`,
        },
      ];

  const extraLinks = [
    {
      label: toGrams ? 'Grams to Cups Converter' : 'Cups to Grams Converter',
      href: toGrams ? '/cooking/grams-to-cups' : '/cooking/cups-to-grams',
    },
    { label: 'Oven Temperature Chart', href: `/cooking/${OVEN_CHART_ID}` },
    ...INGREDIENTS.slice(0, 5).map(i => ({
      label: `${i.name} Cups to Grams`,
      href: `/cooking/${i.id}-cups-to-grams`,
    })),
  ];

  const jsx = (
    <>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {toGrams ? (
          <>
            <strong className="text-gray-900 dark:text-white">
              There is no single cups-to-grams number — it depends on the ingredient.
            </strong>{' '}
            1 cup of all-purpose flour weighs {fmtGrams(a.flour)} g, granulated sugar{' '}
            {fmtGrams(a.sugar)} g and butter {fmtGrams(a.butter)} g. Pick your ingredient below
            and the converter multiplies cups by that ingredient&apos;s chart weight.
          </>
        ) : (
          <>
            <strong className="text-gray-900 dark:text-white">
              Grams become cups only once you name the ingredient.
            </strong>{' '}
            250 g of all-purpose flour is about {fmtCups(gramsToCups('flour', 250) ?? 0)}{' '}
            cups, while 250 g of granulated sugar is about{' '}
            {fmtCups(gramsToCups('sugar', 250) ?? 0)} cups. Pick the ingredient below
            and the converter divides by its chart weight per cup.
          </>
        )}
      </p>

      <CookingEngine mode={toGrams ? 'cups' : 'grams'} />

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {toGrams ? 'Cups to grams by ingredient' : 'Grams to cups by ingredient'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {toGrams
            ? 'The full chart — every ingredient on this site at the amounts recipes actually use. Each cell is cups × the ingredient\u2019s grams per cup from the King Arthur Baking chart.'
            : 'The full chart in reverse — common gram amounts converted to cups for each ingredient. Each cell is grams ÷ the ingredient\u2019s grams per cup from the King Arthur Baking chart.'}
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">Ingredient</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">1 cup</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">½ cup</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">1 tbsp</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">
                  {toGrams ? '250 g in cups' : '2 cups in grams'}
                </th>
              </tr>
            </thead>
            <tbody>
              {INGREDIENTS.map(ing => (
                <tr key={ing.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-2">
                    <Link
                      href={`/cooking/${ing.id}-cups-to-grams`}
                      className="text-brand-500 hover:underline font-medium"
                    >
                      {ing.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {fmtGrams(ing.gramsPerCup)} g
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                    {fmtGrams(cupsToGrams(ing.id, 0.5) ?? 0)} g
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    {fmtGrams(gramsPerTablespoon(ing.id) ?? 0)} g
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {toGrams
                      ? `${fmtCups(gramsToCups(ing.id, 250) ?? 0)} cups`
                      : `${fmtGrams(cupsToGrams(ing.id, 2) ?? 0)} g`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Why grams beat cups for baking
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          A scale does not care how you filled the cup. Two bakers measuring &ldquo;1 cup of
          flour&rdquo; can easily be 20 grams apart — scooping packs flour down, spooning keeps
          it loose — and 20 grams is the difference between a tender cake and a dense one.
          That is why professional and metric recipes give weights, and why converting a
          volume recipe to grams (once, with a chart like this one) makes it repeatable.
        </p>
      </section>

      <SourceNote />
      <VolumeLinks />
    </>
  );

  return { jsx, faqs, extraLinks };
}

// ─── Oven temperature chart ───────────────────────────────────────────────

function OvenContent() {
  const row180 = ovenRowFor(180);
  const row200 = ovenRowFor(200);
  const f350c = convertTemperature(350, 'fahrenheit', 'celsius').value;
  const nearestTo350 = OVEN_CHART.reduce((best, r) =>
    Math.abs(r.celsius - f350c) < Math.abs(best.celsius - f350c) ? r : best
  );
  const faqs: Faq[] = [
    {
      q: 'What is 180 °C in Fahrenheit and gas mark?',
      a: `180 °C is exactly ${row180?.fahrenheit} °F and gas mark ${row180?.gasMark} — the standard moderate oven for cakes and cookies. US recipes usually print 350 °F for the same setting; that is a rounding convention, not the exact conversion.`,
    },
    {
      q: 'What gas mark is 200 °C?',
      a: `200 °C is gas mark ${row200?.gasMark} and exactly ${row200?.fahrenheit} °F — a fairly hot oven, typical for roasting vegetables and baking bread.`,
    },
    {
      q: 'What is 350 °F in Celsius?',
      a: `350 °F is ${f350c.toFixed(1)} °C — closest to the ${nearestTo350.celsius} °C / gas mark ${nearestTo350.gasMark} chart row, which is why US recipes pair 350 °F with 180 °C even though 180 °C converts to exactly ${row180?.fahrenheit} °F.`,
    },
    {
      q: 'Do fan ovens use the same temperatures?',
      a: `No — as a general rule of thumb, set a fan (convection) oven about 20 °C lower than the conventional temperature in a recipe, because the fan circulates heat more efficiently. Check your oven manual for its exact guidance, and prefer an oven thermometer if yours runs hot or cold.`,
    },
  ];

  const a = anchors();
  const extraLinks = [
    { label: 'Cups to Grams Converter', href: '/cooking/cups-to-grams' },
    { label: 'Grams to Cups Converter', href: '/cooking/grams-to-cups' },
    { label: 'Celsius to Fahrenheit Converter', href: '/temperature/celsius-to-fahrenheit' },
    { label: 'Fahrenheit to Celsius Converter', href: '/temperature/fahrenheit-to-celsius' },
    {
      label: 'Flour Cups to Grams',
      href: '/cooking/flour-cups-to-grams',
    },
  ];

  const jsx = (
    <>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        <strong className="text-gray-900 dark:text-white">
          180 °C = {row180?.fahrenheit} °F = gas mark {row180?.gasMark}
        </strong>{' '}
        — the row most recipes live on. The full chart below pairs every common oven setting in
        Celsius, Fahrenheit and gas mark. Fahrenheit figures are exact conversions
        (°F = °C × 9/5 + 32), not rounded recipe conventions.
      </p>

      <section id={OVEN_CHART_ID}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Oven temperature conversion chart
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">Gas Mark</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">Celsius (°C)</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300">Fahrenheit (°F)</th>
                <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">Oven</th>
              </tr>
            </thead>
            <tbody>
              {OVEN_CHART.map(row => (
                <tr
                  key={row.celsius}
                  className={`border-t border-gray-100 dark:border-gray-800 ${
                    row.celsius === 180 ? 'bg-brand-50 dark:bg-brand-950/40 font-medium' : ''
                  }`}
                >
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.gasMark}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.celsius} °C</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">{row.fahrenheit} °F</td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Reading the chart: two conventions worth knowing
        </h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            <strong className="text-gray-900 dark:text-white">US recipes round.</strong> A US
            recipe that says 350 °F almost always means the 180 °C setting — even though
            180 °C converts to exactly {row180?.fahrenheit} °F and 350 °F converts back to{' '}
            {f350c.toFixed(1)} °C. Oven dials step in round numbers in both systems, so the
            pairing 350 °F ↔ 180 °C ↔ gas mark {row180?.gasMark} is the one to remember.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Fan ovens run lower.</strong> As
            a general rule of thumb, a fan (convection) oven should be set about 20 °C below
            the conventional temperature in the chart — so a 180 °C recipe becomes roughly
            160 °C fan. Treat that as guidance, not a conversion: oven manuals differ.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Gas marks are a British scale.</strong>{' '}
            Gas mark 1 is 140 °C and each whole mark adds roughly 14 °C (25 °F). The scale
            survives in UK recipes and on older gas ovens; the chart above covers the marks
            recipes actually use, from ¼ to 9.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Baking by weight as well?
      </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          British and metric recipes pair these oven temperatures with gram weights — 1 cup of
          all-purpose flour is {fmtGrams(a.flour)} g, granulated sugar {fmtGrams(a.sugar)} g,
          butter {fmtGrams(a.butter)} g. The{' '}
          <Link href="/cooking/cups-to-grams" className="text-brand-500 hover:underline font-medium">
            cups to grams converter
          </Link>{' '}
          covers eight staple ingredients in both directions.
        </p>
      </section>

      <VolumeLinks />
    </>
  );

  return { jsx, faqs, extraLinks };
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function CookingPage({
  params,
}: {
  params: Promise<{ cookingPage: string }>;
}) {
  const { cookingPage } = await params;
  const category = getCategoryBySlug('cooking')!;
  const converter = COOKING_CONVERTERS.find(c => c.id === cookingPage);
  if (!converter) notFound();

  const ingredient = ingredientFor(converter.id);
  const isOven = converter.id === OVEN_CHART_ID;
  const { jsx, faqs, extraLinks } = ingredient
    ? IngredientContent({ ingredient })
    : isOven
      ? OvenContent()
      : GenericContent({ converter });

  // Related-conversions block (CN-16 pattern): reverse direction + popular
  // unit-pair siblings + the baking guides (selected by their
  // relatedConverters, which Batch G pointed at this cluster).
  const reverseId =
    converter.id === 'cups-to-grams'
      ? 'grams-to-cups'
      : converter.id === 'grams-to-cups'
        ? 'cups-to-grams'
        : ingredient
          ? 'grams-to-cups'
          : null;
  const reverseConverter = reverseId
    ? (COOKING_CONVERTERS.find(c => c.id === reverseId) ?? null)
    : null;
  const siblingConverters = category.converters
    .filter(c => c.popular && !COOKING_CONVERTER_IDS.has(c.id) && c.id !== converter.id)
    .slice(0, 4);
  const guidePosts = blogPosts
    .filter(p =>
      p.relatedConverters?.some(id => COOKING_CONVERTER_IDS.has(id))
    )
    .slice(0, 3)
    .map(p => ({ slug: p.slug, title: p.title }));
  const sidebarRelated = getRelatedConverters('cooking', converter.id, 8).filter(
    c => !COOKING_CONVERTER_IDS.has(c.id)
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Script
        id={`webpage-schema-${converter.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: converter.title,
            description: converter.description,
            url: `${SITE_URL}/cooking/${converter.id}`,
            isPartOf: { '@type': 'WebSite', name: 'ConvertNow', url: SITE_URL },
          }),
        }}
      />
      <Script
        id={`faq-schema-${converter.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cooking', href: '/cooking' },
          { label: converter.title, href: `/cooking/${converter.id}` },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🍳</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {converter.title}
              </h1>
            </div>
          </div>

          {jsx}

          {/* FAQs */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map(f => (
                <details
                  key={f.q}
                  className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <summary className="px-5 py-4 cursor-pointer font-medium text-gray-900 dark:text-white list-none flex items-center justify-between gap-3">
                    {f.q}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">▾</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedConversions
            converter={converter}
            category={category}
            reverse={reverseConverter}
            siblings={siblingConverters}
            guides={guidePosts}
            extraLinks={extraLinks}
          />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {sidebarRelated.length > 0 && (
            <div className="card p-5">
              <RelatedConverters converters={sidebarRelated} category={category} />
            </div>
          )}
          <ContextualProductWidget categorySlug="cooking" />
        </aside>
      </div>
    </div>
  );
}
