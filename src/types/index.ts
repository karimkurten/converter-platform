// ─── Converter Types ──────────────────────────────────────────────────────────

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  aliases?: string[];
}

export interface ConversionResult {
  value: number;
  formatted: string;
  formula: string;
}

export interface Converter {
  id: string;           // e.g. "km-to-miles"
  from: string;         // unit id
  to: string;           // unit id
  category: string;     // category id
  title: string;        // "Kilometers to Miles"
  description: string;
  popular?: boolean;
  trending?: boolean;
}

export interface ConverterCategory {
  id: string;           // e.g. "length"
  name: string;         // "Length"
  slug: string;         // "length"
  description: string;
  icon: string;         // emoji or icon name
  color: string;        // tailwind color class
  units: Unit[];
  converters: Converter[];
  popular?: boolean;
}

export interface ConversionPair {
  fromValue: number;
  fromUnit: string;
  toUnit: string;
  result: number;
  formula: string;
}

// ─── SEO Types ────────────────────────────────────────────────────────────────

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── Ad Types ─────────────────────────────────────────────────────────────────

export type AdSlot = 'header' | 'sidebar-top' | 'sidebar-bottom' | 'in-content' | 'footer' | 'mobile-sticky';

export interface AdConfig {
  slot: AdSlot;
  adUnitId: string;
  width: number;
  height: number;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
}

// ─── Search Types ─────────────────────────────────────────────────────────────

export interface SearchResult {
  type: 'converter' | 'category';
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  icon?: string;
}

// ─── Currency Types ───────────────────────────────────────────────────────────

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate?: number; // optional live rate vs USD; populated from /api/currency
}

export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
  timestamp: number;
}

// ─── User Preferences ─────────────────────────────────────────────────────────

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  precision: number;
  recentConverters: string[];
  favoriteConverters: string[];
}
