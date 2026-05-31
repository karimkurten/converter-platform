import type { CurrencyRate } from '@/types';

// Currency metadata only — exchange rates are fetched live from /api/currency.
export const CURRENCIES: Omit<CurrencyRate, 'rate'>[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: 'us' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: 'eu' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: 'gb' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: 'jp' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: 'ca' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: 'au' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: 'ch' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: 'cn' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: 'in' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: 'mx' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: 'br' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: 'kr' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: 'sg' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: 'hk' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: 'no' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: 'se' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: 'dk' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: 'nz' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: 'za' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: 'ru' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: 'tr' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: 'ae' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: 'sa' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: 'th' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: 'my' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: 'id' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: 'ph' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: 'pl' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: 'cz' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: 'hu' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: 'il' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', flag: 'eg' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: 'vn' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: 'cl' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: 'co' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: 'ar' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: 'pk' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: 'bd' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: 'ng' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: 'ke' },
];

export const POPULAR_CURRENCY_PAIRS = [
  { from: 'USD', to: 'EUR' },
  { from: 'USD', to: 'GBP' },
  { from: 'USD', to: 'CAD' },
  { from: 'USD', to: 'JPY' },
  { from: 'EUR', to: 'USD' },
  { from: 'EUR', to: 'GBP' },
  { from: 'GBP', to: 'EUR' },
  { from: 'USD', to: 'AUD' },
  { from: 'USD', to: 'INR' },
  { from: 'USD', to: 'CNY' },
];

export function getFlagUrl(countryCode: string): string {
  return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
}

export function getCurrencyByCode(code: string) {
  return CURRENCIES.find(c => c.code === code);
}

export type CurrencyConvertResult =
  | { ok: true; value: number }
  | { ok: false; error: 'unknown-currency' | 'no-rates' };

/**
 * Live conversion using rates fetched from /api/currency.
 * Rates are quoted per 1 USD (USD = 1).
 * Returns an error result instead of throwing or falling back to stale data.
 */
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number> | null | undefined
): CurrencyConvertResult {
  if (!rates || Object.keys(rates).length === 0) {
    return { ok: false, error: 'no-rates' };
  }

  const fromRate = rates[fromCode];
  const toRate = rates[toCode];

  if (!fromRate || !toRate) {
    return { ok: false, error: 'unknown-currency' };
  }

  // Rates are X currency per 1 USD: amount_in_USD = amount / fromRate
  const inUSD = amount / fromRate;
  return { ok: true, value: inUSD * toRate };
}
