'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { searchConverters } from '@/lib/converters';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchConverters>>([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      setResults(searchConverters(query, 8));
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navLinks = [
    { href: '/length', label: 'Length' },
    { href: '/weight', label: 'Weight' },
    { href: '/temperature', label: 'Temp' },
    { href: '/currency', label: 'Currency' },
    { href: '/area', label: 'Area' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 shadow-sm'
          : 'bg-white dark:bg-gray-950 border-b border-transparent'
      }`}
    >
      <div className="container-lg">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-black text-sm group-hover:bg-brand-600 transition-colors">
              C
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
              ConvertNow
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              aria-label="View all converter categories"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              All →
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                aria-label="Search converters"
              >
                <SearchIcon className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Search...</span>
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-400">
                  ⌘K
                </kbd>
              </button>

              {/* Search dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-slide-up">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <SearchIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search converters..."
                        className="flex-1 bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                        autoComplete="off"
                      />
                      {query && (
                        <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                          <XIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {results.length > 0 ? (
                      <ul className="p-2">
                        {results.map((result, i) => (
                          <li key={i}>
                            <Link
                              href={result.href}
                              onClick={() => { setSearchOpen(false); setQuery(''); }}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                            >
                              <span className="text-lg flex-shrink-0">{result.icon}</span>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{result.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">{result.category}</div>
                              </div>
                              <ArrowRightIcon className="w-3 h-3 text-gray-400 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : query.length >= 2 ? (
                      <div className="p-6 text-center text-sm text-gray-500">
                        No converters found for &quot;{query}&quot;
                      </div>
                    ) : (
                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-2 px-1 font-medium uppercase tracking-wide">Popular</p>
                        <ul className="space-y-0.5">
                          {[
                            { title: 'km to miles', href: '/length/kilometer-to-mile', icon: '📏' },
                            { title: 'kg to lbs', href: '/weight/kilogram-to-pound', icon: '⚖️' },
                            { title: '°C to °F', href: '/temperature/celsius-to-fahrenheit', icon: '🌡️' },
                            { title: 'USD to EUR', href: '/currency/USD-to-EUR', icon: '💱' },
                          ].map(item => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => { setSearchOpen(false); }}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              >
                                <span>{item.icon}</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              </button>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <XIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-3 border-t border-gray-100 dark:border-gray-800 animate-slide-up">
            <div className="flex flex-wrap gap-2 pb-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
