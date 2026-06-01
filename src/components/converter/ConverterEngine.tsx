'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ConverterCategory, Converter, ConversionResult } from '@/types';
import { runConversion, isPopularPath, getConverterBySlug } from '@/lib/converters';
import { convertCurrency } from '@/lib/converters/currency';
import { copyToClipboard, addRecentConverter, toggleFavoriteConverter, getFavoriteConverters, formatNumber } from '@/lib/utils';
import { Analytics } from '@/lib/analytics';

interface ConverterEngineProps {
  converter: Converter;
  category: ConverterCategory;
}

export default function ConverterEngine({ converter, category }: ConverterEngineProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fromValue, setFromValue] = useState(searchParams.get('v') || '1');
  const [toValue, setToValue] = useState('');
  const [formula, setFormula] = useState('');
  const [precision, setPrecision] = useState(6);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [fromUnit, setFromUnit] = useState(converter.from);
  const [toUnit, setToUnit] = useState(converter.to);
  const [error, setError] = useState('');
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const fromUnitData = category.units.find(u => u.id === fromUnit)!;
  const toUnitData = category.units.find(u => u.id === toUnit)!;
  const converterPath = `/${category.slug}/${converter.id}`;

  // Sync URL when dropdown changes if the resulting pair has a registered route
  const syncUrlForPair = useCallback((nextFrom: string, nextTo: string) => {
    if (nextFrom === nextTo) return;
    const targetId = `${nextFrom}-to-${nextTo}`;
    if (targetId === converter.id) return;
    const exists = !!getConverterBySlug(category.slug, targetId);
    if (exists) {
      router.replace(`/${category.slug}/${targetId}`, { scroll: false });
    }
  }, [category.slug, converter.id, router]);

  // Track recent & favorites
  useEffect(() => {
    addRecentConverter(converterPath);
    setIsFavorite(getFavoriteConverters().includes(converterPath));
  }, [converterPath]);

  // Fetch live rates for currency
  useEffect(() => {
    if (category.id !== 'currency') return;
    let cancelled = false;
    setRatesLoading(true);
    fetch('/api/currency')
      .then(r => r.json())
      .then(data => { if (!cancelled && data?.rates) setLiveRates(data.rates); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setRatesLoading(false); });
    return () => { cancelled = true; };
  }, [category.id]);

  const convert = useCallback((val: string) => {
    const num = parseFloat(val);
    if (val === '' || val === '-') { setToValue(''); setFormula(''); setError(''); return; }
    if (isNaN(num)) { setError('Please enter a valid number'); setToValue(''); return; }
    setError('');

    try {
      let result: ConversionResult;

      if (category.id === 'currency') {
        const res = convertCurrency(num, fromUnit, toUnit, liveRates);
        if (!res.ok) {
          if (res.error === 'no-rates') {
            setError(ratesLoading ? '' : 'Live exchange rates unavailable. Try again later.');
          } else {
            setError('Unknown currency.');
          }
          setToValue('');
          setFormula('');
          return;
        }
        result = {
          value: res.value,
          formatted: formatNumber(res.value, precision),
          formula: `${num} ${fromUnit} × live rate = ${formatNumber(res.value, precision)} ${toUnit}`,
        };
      } else {
        const r = runConversion(category.id, num, fromUnit, toUnit);
        if (!r) return;
        result = { ...r, formatted: formatNumber(r.value, precision) };
      }

      setToValue(result.formatted);
      setFormula(result.formula);
      Analytics.trackConversion(fromUnit, toUnit, category.id);

      // Flash animation
      if (resultRef.current) {
        resultRef.current.classList.remove('result-glow');
        void resultRef.current.offsetWidth;
        resultRef.current.classList.add('result-glow');
      }
    } catch {
      setError('Conversion error. Please check your input.');
    }
  }, [category.id, fromUnit, toUnit, precision, liveRates, ratesLoading]);

  // Re-convert when value/units/precision change
  useEffect(() => { convert(fromValue); }, [fromValue, fromUnit, toUnit, precision, convert]);

  const handleSwap = () => {
    Analytics.trackSwap(category.id);
    const oldFrom = fromUnit;
    const oldTo = toUnit;
    const oldToValue = toValue;

    setFromUnit(oldTo);
    setToUnit(oldFrom);
    setFromValue(oldToValue || '1');

    // Only push a new URL if the swapped pair has a registered route.
    // Currency only generates popular pairs, so swapping to an unregistered pair
    // would 404 — keep state-only in that case.
    const newId = `${oldTo}-to-${oldFrom}`;
    if (isPopularPath(category.slug, newId) || !!getConverterBySlug(category.slug, newId)) {
      router.replace(`/${category.slug}/${newId}`, { scroll: false });
    }
  };

  const handleFromUnitChange = (next: string) => {
    setFromUnit(next);
    syncUrlForPair(next, toUnit);
  };

  const handleToUnitChange = (next: string) => {
    setToUnit(next);
    syncUrlForPair(fromUnit, next);
  };

  const handleCopy = async () => {
    const text = `${fromValue} ${fromUnitData?.symbol} = ${toValue} ${toUnitData?.symbol}`;
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      Analytics.trackCopy(converter.id);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFavorite = () => {
    const added = toggleFavoriteConverter(converterPath);
    setIsFavorite(added);
    if (added) Analytics.trackFavorite(converter.id);
  };

  return (
    <div className="converter-card animate-pop">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {fromUnitData?.name} to {toUnitData?.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span aria-hidden="true">{category.icon}</span> {category.name} Converter
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950'
                : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <StarIcon className="w-5 h-5" filled={isFavorite} />
          </button>

          {/* Share button */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
            aria-label="Copy result"
            title="Copy result"
          >
            {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ShareIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Conversion inputs */}
      <div className="space-y-3">
        {/* From */}
        <div className="relative">
          <label htmlFor="from-value" className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
            From
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                id="from-value"
                type="number"
                value={fromValue}
                onChange={e => setFromValue(e.target.value)}
                className={`input-field text-xl font-bold ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Enter value..."
                aria-label={`Value in ${fromUnitData?.name}`}
                aria-invalid={!!error}
                aria-describedby={error ? 'from-value-error' : undefined}
                step="any"
                inputMode="decimal"
              />
            </div>
            <select
              value={fromUnit}
              onChange={e => handleFromUnitChange(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-0 cursor-pointer transition-colors"
              aria-label="From unit"
            >
              {category.units.map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol} — {unit.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p id="from-value-error" role="alert" className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Swap button */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleSwap}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950 border border-gray-200 dark:border-gray-700 hover:border-brand-200 transition-all duration-200"
            aria-label="Swap units"
          >
            <SwapIcon className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors group-hover:rotate-180 duration-300" />
            <span className="text-xs font-medium text-gray-500 group-hover:text-brand-500 transition-colors">Swap</span>
          </button>
        </div>

        {/* To */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
            To
          </label>
          <div className="flex gap-3">
            <div ref={resultRef} className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors" aria-live="polite" aria-atomic="true">
              <span className={`text-xl font-bold ${toValue ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}>
                {toValue || '—'}
              </span>
            </div>
            <select
              value={toUnit}
              onChange={e => handleToUnitChange(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-0 cursor-pointer transition-colors"
              aria-label="To unit"
            >
              {category.units.map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol} — {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result display */}
      {toValue && fromValue && (
        <div className="mt-5 p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-brand-700 dark:text-brand-300 font-medium">
                <span className="font-bold">{fromValue} {fromUnitData?.symbol}</span>
                {' = '}
                <span className="font-bold text-lg">{toValue} {toUnitData?.symbol}</span>
              </p>
              {formula && (
                <p className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-1 font-mono">
                  {formula}
                </p>
              )}
            </div>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-800'
              }`}
              aria-label={copied ? 'Copied to clipboard' : 'Copy result to clipboard'}
            >
              {copied ? <><CheckIcon className="w-3 h-3" /> Copied!</> : <><CopyIcon className="w-3 h-3" /> Copy</>}
            </button>
          </div>
        </div>
      )}

      {/* Precision control */}
      <div className="mt-4 flex items-center gap-3">
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">
          Decimal places:
        </label>
        <div className="flex gap-1" role="group" aria-label="Decimal places">
          {[2, 4, 6, 8, 10].map(p => (
            <button
              key={p}
              onClick={() => setPrecision(p)}
              className={`w-8 h-7 rounded-lg text-xs font-semibold transition-colors ${
                precision === p
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-pressed={precision === p}
              aria-label={`${p} decimal places`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Currency live rate note */}
      {category.id === 'currency' && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500" aria-live="polite">
          {ratesLoading ? 'Loading exchange rates…' : liveRates ? '✓ Live exchange rates' : '⚠ Live rates unavailable. Please try again later.'}
        </p>
      )}
    </div>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function SwapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function StarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
