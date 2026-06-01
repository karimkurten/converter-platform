'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchConverters } from '@/lib/converters';
import { Analytics } from '@/lib/analytics';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchConverters>>([]);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      setResults(searchConverters(query, 8));
      Analytics.trackSearch(query);
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(results[0].href);
    }
  };

  const showDropdown = focused && (query.length >= 2 ? results.length > 0 : true);

  const quickPicks = [
    { label: 'km → miles', href: '/length/kilometer-to-mile', icon: '📏' },
    { label: 'kg → lbs', href: '/weight/kilogram-to-pound', icon: '⚖️' },
    { label: '°C → °F', href: '/temperature/celsius-to-fahrenheit', icon: '🌡️' },
    { label: 'USD → EUR', href: '/currency/USD-to-EUR', icon: '💱' },
    { label: 'GB → MB', href: '/digital/gigabyte-to-megabyte', icon: '💾' },
  ];

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto animate-slide-up stagger-2">
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 shadow-xl transition-all duration-200 ${
          focused ? 'ring-2 ring-white/30 shadow-2xl' : ''
        }`}>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder='Try "km to miles" or "celsius to fahrenheit"...'
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 text-base outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
          >
            Convert
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-slide-up">
          {query.length >= 2 && results.length > 0 ? (
            <ul className="p-2">
              {results.map((result, i) => (
                <li key={i}>
                  <Link
                    href={result.href}
                    onClick={() => setFocused(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span className="text-xl">{result.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{result.title}</div>
                      <div className="text-xs text-gray-500">{result.category}</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-3 mb-2">Quick picks</p>
              <div className="flex flex-wrap gap-2 px-3 pb-2">
                {quickPicks.map(pick => (
                  <Link
                    key={pick.href}
                    href={pick.href}
                    onClick={() => setFocused(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors border border-transparent hover:border-brand-100"
                  >
                    <span>{pick.icon}</span>
                    <span>{pick.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
