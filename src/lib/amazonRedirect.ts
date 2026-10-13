/**
 * Amazon Associates geo-redirect — single canonical on-site link per product.
 *
 * Karim's real Associates Store IDs (confirmed 2026-10-13):
 *  - Canada → tag `convertnow-20`  (amazon.ca)
 *  - US     → tag `convertnowus-20` (amazon.com)
 *
 * He holds NO Associates accounts for any other country, so every other
 * visitor (including unknown/missing geo) falls back to amazon.com + US tag.
 * One tracking tag only earns on its own country's store — never invent tags.
 *
 * Flow: /go/amazon?k=<keyword> → server reads `x-vercel-ip-country`
 * (injected by Vercel, no external IP API) → 302 to the right store.
 */

/** Real Associates Store IDs — do not change without Karim's confirmation. */
export const AMAZON_AFFILIATE_TAGS = {
  CA: 'convertnow-20',
  US: 'convertnowus-20',
} as const;

const AMAZON_DOMAINS = {
  CA: 'https://www.amazon.ca',
  US: 'https://www.amazon.com',
} as const;

export interface AmazonDestination {
  /** 'CA' or 'US' — the store the visitor is routed to. */
  store: 'CA' | 'US';
  /** Fully-qualified Amazon search URL with the correct affiliate tag. */
  url: string;
}

/**
 * Map a visitor country code to the Amazon store + affiliate tag.
 * Only CA gets the Canadian store; everything else (incl. missing header)
 * goes to amazon.com with the US tag.
 */
export function getAmazonDestination(
  countryCode: string | null | undefined,
  keyword: string,
): AmazonDestination {
  const cc = (countryCode ?? '').trim().toUpperCase();
  if (cc === 'CA') {
    return {
      store: 'CA',
      url: `${AMAZON_DOMAINS.CA}/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_AFFILIATE_TAGS.CA}`,
    };
  }
  return {
    store: 'US',
    url: `${AMAZON_DOMAINS.US}/s?k=${encodeURIComponent(keyword)}&tag=${AMAZON_AFFILIATE_TAGS.US}`,
  };
}

/**
 * Extract the raw search keyword from a legacy direct Amazon product URL
 * (its `?k=` query param). Returns '' when unparseable.
 */
export function keywordFromAmazonUrl(amazonUrl: string): string {
  try {
    return new URL(amazonUrl).searchParams.get('k')?.trim() ?? '';
  } catch {
    return '';
  }
}

/** The one canonical on-site link per product — the server geo-redirects it. */
export function buildAmazonGoUrl(keyword: string): string {
  return `/go/amazon?k=${encodeURIComponent(keyword)}`;
}

/** Convert a legacy direct Amazon product URL to the internal geo-redirect link. */
export function amazonUrlToGoUrl(amazonUrl: string): string {
  return buildAmazonGoUrl(keywordFromAmazonUrl(amazonUrl));
}
