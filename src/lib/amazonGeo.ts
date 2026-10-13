/**
 * Amazon store DISPLAY configuration.
 *
 * This file is display-only (flag, country name, currency, domain label for
 * the CountryBanner). It contains NO affiliate tags.
 *
 * The single source of truth for where product links actually go — including
 * Karim's real Associates Store IDs — is `src/lib/amazonRedirect.ts`:
 * every product click goes through `/go/amazon?k=<keyword>`, which the server
 * 302-redirects to the visitor's store. Only two Amazon stores are ever
 * routed to: amazon.ca (Canadian visitors) and amazon.com (everyone else).
 *
 * Do NOT add per-country affiliate tags here. One tracking tag only earns on
 * its own country's Amazon store, and Karim holds Associates accounts for
 * CA + US only (confirmed 2026-10-13). The old unverified tags
 * (convertnow-22 … convertnow-31) were removed for exactly this reason.
 */
export interface AmazonStore {
  domain: string
  flag: string
  currency: string
  countryName: string
  currencySymbol: string
}

export const AMAZON_STORES: Record<string, AmazonStore> = {
  CA: {
    domain: 'amazon.ca',
    flag: '🇨🇦',
    currency: 'CAD',
    countryName: 'Canada',
    currencySymbol: 'CA$',
  },
  US: {
    domain: 'amazon.com',
    flag: '🇺🇸',
    currency: 'USD',
    countryName: 'United States',
    currencySymbol: '$',
  },
}

// Fallback display store — mirrors the redirect: unknown visitors land on amazon.com
export const DEFAULT_STORE = AMAZON_STORES['US']

/**
 * Map a visitor country code to the DISPLAY store.
 * Mirrors the routing in amazonRedirect.getAmazonDestination: only Canadian
 * visitors are routed to amazon.ca; everyone else lands on amazon.com.
 */
export function getStoreForCountry(
  countryCode: string
): AmazonStore {
  return countryCode.trim().toUpperCase() === 'CA'
    ? AMAZON_STORES['CA']
    : AMAZON_STORES['US']
}

// Detect user country via free IP geolocation API
// Returns country code like 'CA', 'US', 'GB' etc.
export async function detectUserCountry(): Promise<string> {
  // Try multiple free APIs as fallbacks
  const apis = [
    'https://ipapi.co/json/',
    'https://api.country.is/',
    'https://ipwho.is/',
  ]

  for (const api of apis) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(
        () => controller.abort(),
        3000
      )

      const res = await fetch(api, {
        signal: controller.signal,
        cache: 'force-cache'
      })

      clearTimeout(timeout)

      if (!res.ok) continue

      const data = await res.json()

      // Different APIs return different field names
      const country =
        data.country_code ||  // ipapi.co
        data.country ||       // api.country.is
        data.country_code2 || // ipwho.is
        ''

      if (country && country.length === 2) {
        return country.toUpperCase()
      }
    } catch {
      continue
    }
  }

  // Default to US if all APIs fail (matches the /go/amazon redirect fallback)
  return 'US'
}

// Subcategory Amazon search terms by category
// Used when "Shop Now" is clicked on subcategory cards
export const SUBCATEGORY_SEARCH_TERMS: Record<string, string> = {
  length: 'tape measure metric imperial',
  weight: 'digital kitchen scale kg grams',
  temperature: 'thermometer celsius fahrenheit',
  volume: 'measuring cups ml metric imperial',
  speed: 'GPS fitness tracker watch',
  area: 'laser distance measurer meters feet',
  digital: 'portable SSD external storage',
  currency: 'travel wallet RFID passport holder',
  time: 'world time zone watch',
  'luxury-beauty': 'luxury skincare serum',
  kitchen: 'kitchen appliances instant pot',
  books: 'bestselling books 2025',
  fashion: 'fashion accessories',
  office: 'ergonomic office accessories',
  travel: 'travel luggage accessories',
  fitness: 'fitness tracker yoga mat',
  wellness: 'health supplements vitamins',
  pets: 'pet supplies dog cat',
  baby: 'baby essentials nursery',
  tech: 'smart home gadgets',
  gaming: 'gaming accessories controller',
  home: 'home improvement tools',
}
