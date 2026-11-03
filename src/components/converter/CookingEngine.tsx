'use client';

import { useState } from 'react';
import {
  INGREDIENTS,
  getIngredient,
  cupsToGrams,
  gramsToCups,
  fmtGrams,
  fmtCups,
} from '@/lib/cooking';

/**
 * Interactive ingredient converter (Batch G). Two modes in one card:
 *  - 'cups' mode:  a cup amount → grams for the chosen ingredient.
 *  - 'grams' mode: a gram amount → cups for the chosen ingredient.
 * All math goes through src/lib/cooking (cups × the ingredient's
 * grams-per-cup weight from the King Arthur Baking chart) — nothing is
 * computed or stored in this component beyond the live result.
 * Server-rendered answer content lives in the pages themselves; this
 * component is the interactive tool.
 */

interface CookingEngineProps {
  mode: 'cups' | 'grams';
  /** Lock the engine to one ingredient (per-ingredient pages). */
  fixedIngredient?: string;
  /** Initial ingredient when not fixed. */
  defaultIngredient?: string;
  defaultAmount?: number;
}

export default function CookingEngine({
  mode,
  fixedIngredient,
  defaultIngredient = 'flour',
  defaultAmount,
}: CookingEngineProps) {
  const [ingredientId, setIngredientId] = useState(fixedIngredient ?? defaultIngredient);
  const [amount, setAmount] = useState(String(defaultAmount ?? (mode === 'cups' ? 1 : 120)));

  const ingredient = getIngredient(fixedIngredient ?? ingredientId);
  const value = parseFloat(amount);
  const valid = amount.trim() !== '' && !isNaN(value) && value >= 0 && ingredient !== undefined;

  const grams = valid && mode === 'cups' ? cupsToGrams(ingredient.id, value) : null;
  const cups = valid && mode === 'grams' ? gramsToCups(ingredient.id, value) : null;

  return (
    <div className="converter-card animate-pop">
      <div className="mb-6">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'cups' ? 'Cups to Grams' : 'Grams to Cups'}
          {ingredient ? ` — ${ingredient.name}` : ''}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span aria-hidden="true">🍳</span> Cooking Converter · weights from the King Arthur Baking
          ingredient chart (approximate — see the note below the converter)
        </p>
      </div>

      <div className="space-y-3">
        {!fixedIngredient && (
          <div>
            <label
              htmlFor="cooking-ingredient"
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block"
            >
              Ingredient
            </label>
            <select
              id="cooking-ingredient"
              value={ingredientId}
              onChange={e => setIngredientId(e.target.value)}
              className="input-field text-lg font-semibold"
              aria-label="Ingredient"
            >
              {INGREDIENTS.map(ing => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} — {ing.gramsPerCup} g per cup
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label
            htmlFor="cooking-amount"
            className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block"
          >
            {mode === 'cups' ? 'Amount in cups (US)' : 'Amount in grams'}
          </label>
          <div className="flex gap-3">
            <input
              id="cooking-amount"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input-field text-xl font-bold"
              placeholder={mode === 'cups' ? 'e.g. 2.5' : 'e.g. 250'}
              aria-label={mode === 'cups' ? 'Amount in cups' : 'Amount in grams'}
              step="any"
              min="0"
              inputMode="decimal"
            />
            <span className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold flex items-center">
              {mode === 'cups' ? 'cups' : 'g'}
            </span>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {valid && ingredient ? (
            <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 animate-fade-in">
              {mode === 'cups' && grams !== null ? (
                <>
                  <p className="text-sm text-brand-700 dark:text-brand-300 font-medium">
                    <span className="font-bold">{amount} cups</span> of {ingredient.name.toLowerCase()}{' '}
                    {' = '}
                    <span className="font-bold text-lg">{fmtGrams(grams)} g</span>
                  </p>
                  <p className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-1 font-mono">
                    {amount} cups × {ingredient.gramsPerCup} g per cup = {fmtGrams(grams)} g
                  </p>
                </>
              ) : mode === 'grams' && cups !== null ? (
                <>
                  <p className="text-sm text-brand-700 dark:text-brand-300 font-medium">
                    <span className="font-bold">{amount} g</span> of {ingredient.name.toLowerCase()}{' '}
                    {' = '}
                    <span className="font-bold text-lg">{fmtCups(cups)} cups</span>
                  </p>
                  <p className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-1 font-mono">
                    {amount} g ÷ {ingredient.gramsPerCup} g per cup = {fmtCups(cups)} cups
                  </p>
                </>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {mode === 'cups'
                ? 'Enter an amount in cups to see its weight in grams.'
                : 'Enter a weight in grams to see it in cups.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
