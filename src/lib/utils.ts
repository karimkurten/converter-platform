// ─── Number formatting ─────────────────────────────────────────────────────────

export function formatNumber(value: number, precision: number = 6): string {
  if (!isFinite(value)) return 'Invalid';
  if (value === 0) return '0';

  const absVal = Math.abs(value);

  if (absVal >= 1e15 || (absVal < 1e-6 && absVal > 0)) {
    return value.toExponential(precision);
  }

  if (Number.isInteger(value)) {
    return value.toLocaleString('en-US');
  }

  const str = parseFloat(value.toPrecision(precision)).toString();
  return str;
}

export function roundToPrecision(value: number, precision: number): number {
  if (!isFinite(value)) return 0;
  return parseFloat(value.toFixed(precision));
}

// ─── URL helpers ───────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildConverterUrl(category: string, from: string, to: string): string {
  return `/${category}/${from}-to-${to}`;
}

export function parseConverterSlug(slug: string): { from: string; to: string } | null {
  const match = slug.match(/^(.+)-to-(.+)$/);
  if (!match) return null;
  return { from: match[1], to: match[2] };
}

export function buildShareUrl(
  baseUrl: string,
  value: number,
  from: string,
  to: string
): string {
  return `${baseUrl}?v=${value}&from=${from}&to=${to}`;
}

// ─── Local storage helpers ─────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  RECENT: 'convertnow_recent',
  FAVORITES: 'convertnow_favorites',
  THEME: 'convertnow_theme',
  PRECISION: 'convertnow_precision',
} as const;

export function getRecentConverters(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT) || '[]');
  } catch {
    return [];
  }
}

export function addRecentConverter(path: string): void {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecentConverters().filter(p => p !== path);
    recent.unshift(path);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recent.slice(0, 10)));
  } catch {}
}

export function getFavoriteConverters(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
  } catch {
    return [];
  }
}

export function toggleFavoriteConverter(path: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const favorites = getFavoriteConverters();
    const idx = favorites.indexOf(path);
    if (idx >= 0) {
      favorites.splice(idx, 1);
    } else {
      favorites.unshift(path);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites.slice(0, 50)));
    return idx < 0; // true = was added
  } catch {
    return false;
  }
}

// ─── Clipboard ─────────────────────────────────────────────────────────────────

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

// ─── Category color mappings ───────────────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; light: string }> = {
  blue: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-200',
    light: 'bg-blue-50 dark:bg-blue-950',
  },
  green: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    light: 'bg-emerald-50 dark:bg-emerald-950',
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    border: 'border-orange-200',
    light: 'bg-orange-50 dark:bg-orange-950',
  },
  yellow: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
    light: 'bg-yellow-50 dark:bg-yellow-950',
  },
  purple: {
    bg: 'bg-violet-600',
    text: 'text-violet-600',
    border: 'border-violet-200',
    light: 'bg-violet-50 dark:bg-violet-950',
  },
  cyan: {
    bg: 'bg-cyan-600',
    text: 'text-cyan-600',
    border: 'border-cyan-200',
    light: 'bg-cyan-50 dark:bg-cyan-950',
  },
  teal: {
    bg: 'bg-teal-600',
    text: 'text-teal-600',
    border: 'border-teal-200',
    light: 'bg-teal-50 dark:bg-teal-950',
  },
  indigo: {
    bg: 'bg-indigo-600',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    light: 'bg-indigo-50 dark:bg-indigo-950',
  },
  slate: {
    bg: 'bg-slate-600',
    text: 'text-slate-600',
    border: 'border-slate-200',
    light: 'bg-slate-50 dark:bg-slate-800',
  },
  amber: {
    bg: 'bg-amber-500',
    text: 'text-amber-600',
    border: 'border-amber-200',
    light: 'bg-amber-50 dark:bg-amber-950',
  },
};
