'use client';

import { useCallback, useEffect, useState } from 'react';
import { cmToFeetInches, feetInchesToCm } from '@/lib/height';
import { formatNumber, sanitizeDecimalInput } from '@/lib/utils';

/**
 * Interactive height converter (Batch F). Two modes in one card:
 *  - cm mode:  one centimetre input → feet + inches (decimal + fraction).
 *  - ftin mode: feet and inches inputs → centimetres.
 * All math goes through src/lib/height (the real length engine:
 * 1 inch = 2.54 cm exactly). Server-rendered answer content lives in the
 * page itself; this component is the interactive tool.
 */

interface HeightEngineProps {
  mode: 'cm' | 'ftin';
  /** Initial cm value (cm mode only). */
  defaultCm?: number;
}

export default function HeightEngine({ mode, defaultCm = 175 }: HeightEngineProps) {
  const [cm, setCm] = useState(String(defaultCm));
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('9');

  useEffect(() => {
    if (mode === 'cm') setCm(String(defaultCm));
  }, [mode, defaultCm]);

  const convertCm = useCallback(() => {
    const v = parseFloat(cm);
    if (cm.trim() === '' || isNaN(v) || v < 0) return null;
    return cmToFeetInches(v);
  }, [cm]);

  const convertFtin = useCallback(() => {
    const f = parseFloat(feet);
    const i = parseFloat(inches);
    if (isNaN(f) || isNaN(i) || f < 0 || i < 0 || i >= 12) return null;
    return feetInchesToCm(f, i);
  }, [feet, inches]);

  const result = mode === 'cm' ? convertCm() : null;
  const cmResult = mode === 'ftin' ? convertFtin() : null;
  const invalidFtin = mode === 'ftin' && (feet.trim() === '' || inches.trim() === '' || cmResult === null);

  return (
    <div className="converter-card animate-pop">
      <div className="mb-6">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'cm' ? 'Centimeters to Feet & Inches' : 'Feet & Inches to Centimeters'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span aria-hidden="true">📏</span> Height Converter
        </p>
      </div>

      {mode === 'cm' ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="height-cm" className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
              Height in centimeters
            </label>
            <div className="flex gap-3">
              <input
                id="height-cm"
                type="text"
                value={cm}
                onChange={e => setCm(sanitizeDecimalInput(e.target.value))}
                className="input-field text-xl font-bold"
                placeholder="e.g. 175"
                aria-label="Height in centimeters"
                inputMode="decimal"
              />
              <span className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold flex items-center">
                cm
              </span>
            </div>
          </div>
          <div aria-live="polite" aria-atomic="true">
            {result ? (
              <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 animate-fade-in">
                <p className="text-sm text-brand-700 dark:text-brand-300 font-medium">
                  <span className="font-bold">{cm} cm</span>
                  {' = '}
                  <span className="font-bold text-lg">{result.display}</span>
                </p>
                <p className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-1 font-mono">
                  {result.symbolDisplay} · {result.fractionDisplay} (nearest ⅛ in) · {formatNumber(result.totalInches, 6)} in total
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">Enter a height in centimetres to see it in feet and inches.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="height-feet" className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                Feet
              </label>
              <input
                id="height-feet"
                type="text"
                value={feet}
                onChange={e => setFeet(sanitizeDecimalInput(e.target.value))}
                className="input-field text-xl font-bold"
                placeholder="5"
                aria-label="Feet"
                inputMode="numeric"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="height-inches" className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                Inches (0–11.99)
              </label>
              <input
                id="height-inches"
                type="text"
                value={inches}
                onChange={e => setInches(sanitizeDecimalInput(e.target.value))}
                className="input-field text-xl font-bold"
                placeholder="9"
                aria-label="Inches"
                inputMode="decimal"
              />
            </div>
          </div>
          <div aria-live="polite" aria-atomic="true">
            {cmResult !== null ? (
              <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 animate-fade-in">
                <p className="text-sm text-brand-700 dark:text-brand-300 font-medium">
                  <span className="font-bold">{feet} ft {inches} in</span>
                  {' = '}
                  <span className="font-bold text-lg">{formatNumber(cmResult, 6)} cm</span>
                </p>
                <p className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-1 font-mono">
                  ({feet} × 12 + {inches}) in × 2.54 = {formatNumber(cmResult, 6)} cm
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500" role={invalidFtin ? 'alert' : undefined}>
                {invalidFtin
                  ? 'Enter feet (0 or more) and inches below 12 — for example 5 ft 9 in.'
                  : 'Enter a height in feet and inches to see it in centimetres.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
