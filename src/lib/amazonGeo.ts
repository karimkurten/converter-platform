// Amazon store configuration by country code
export interface AmazonStore {
  domain: string
  flag: string
  currency: string
  countryName: string
  affiliateTag: string
  currencySymbol: string
}

export const AMAZON_STORES: Record<string, AmazonStore> = {
  CA: {
    domain: 'amazon.ca',
    flag: '🇨🇦',
    currency: 'CAD',
    countryName: 'Canada',
    affiliateTag: 'convertnow-20',
    currencySymbol: 'CA$',
  },
  US: {
    domain: 'amazon.com',
    flag: '🇺🇸',
    currency: 'USD',
    countryName: 'United States',
    affiliateTag: 'convertnowus-20',
    currencySymbol: '$',
  },
  GB: {
    domain: 'amazon.co.uk',
    flag: '🇬🇧',
    currency: 'GBP',
    countryName: 'United Kingdom',
    affiliateTag: 'convertnow-22',
    currencySymbol: '£',
  },
  AU: {
    domain: 'amazon.com.au',
    flag: '🇦🇺',
    currency: 'AUD',
    countryName: 'Australia',
    affiliateTag: 'convertnow-23',
    currencySymbol: 'A$',
  },
  DE: {
    domain: 'amazon.de',
    flag: '🇩🇪',
    currency: 'EUR',
    countryName: 'Germany',
    affiliateTag: 'convertnow-24',
    currencySymbol: '€',
  },
  FR: {
    domain: 'amazon.fr',
    flag: '🇫🇷',
    currency: 'EUR',
    countryName: 'France',
    affiliateTag: 'convertnow-25',
    currencySymbol: '€',
  },
  IT: {
    domain: 'amazon.it',
    flag: '🇮🇹',
    currency: 'EUR',
    countryName: 'Italy',
    affiliateTag: 'convertnow-26',
    currencySymbol: '€',
  },
  ES: {
    domain: 'amazon.es',
    flag: '🇪🇸',
    currency: 'EUR',
    countryName: 'Spain',
    affiliateTag: 'convertnow-27',
    currencySymbol: '€',
  },
  JP: {
    domain: 'amazon.co.jp',
    flag: '🇯🇵',
    currency: 'JPY',
    countryName: 'Japan',
    affiliateTag: 'convertnow-28',
    currencySymbol: '¥',
  },
  IN: {
    domain: 'amazon.in',
    flag: '🇮🇳',
    currency: 'INR',
    countryName: 'India',
    affiliateTag: 'convertnow-29',
    currencySymbol: '₹',
  },
  MX: {
    domain: 'amazon.com.mx',
    flag: '🇲🇽',
    currency: 'MXN',
    countryName: 'Mexico',
    affiliateTag: 'convertnow-30',
    currencySymbol: '$',
  },
  BR: {
    domain: 'amazon.com.br',
    flag: '🇧🇷',
    currency: 'BRL',
    countryName: 'Brazil',
    affiliateTag: 'convertnow-31',
    currencySymbol: 'R$',
  },
}

// Default store (Canada) used as fallback
export const DEFAULT_STORE = AMAZON_STORES['CA']

// Get store config for a country code
export function getStoreForCountry(
  countryCode: string
): AmazonStore {
  return AMAZON_STORES[countryCode.toUpperCase()] || DEFAULT_STORE
}

// Build a localized Amazon URL with affiliate tag
// Takes the search keyword and builds the right URL
export function buildAmazonUrl(
  searchKeyword: string,
  countryCode: string
): string {
  const store = getStoreForCountry(countryCode)
  const encodedKeyword = encodeURIComponent(searchKeyword)
  return `https://www.${store.domain}/s?k=${encodedKeyword}&tag=${store.affiliateTag}`
}

// Build Amazon URL from a base CA URL by 
// replacing the domain and tag
export function localizeAmazonUrl(
  baseUrl: string,
  countryCode: string
): string {
  const store = getStoreForCountry(countryCode)
  
  // Extract search keyword from existing URL
  try {
    const url = new URL(baseUrl)
    const keyword = url.searchParams.get('k') || ''
    
    if (keyword) {
      return `https://www.${store.domain}/s?k=${keyword}&tag=${store.affiliateTag}`
    }
    
    // For direct product links (ASIN based)
    // Replace domain and tag
    return baseUrl
      .replace(/amazon\.(ca|com|co\.uk|com\.au|de|fr|it|es|co\.jp|in|com\.mx|com\.br)/g, store.domain)
      .replace(/tag=[^&]+/g, `tag=${store.affiliateTag}`)
  } catch {
    return baseUrl
  }
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
  
  // Default to Canada if all APIs fail
  return 'CA'
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
