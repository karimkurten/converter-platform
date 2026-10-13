import { describe, it, expect } from 'vitest';
import {
  AMAZON_STORES,
  DEFAULT_STORE,
  getStoreForCountry,
} from './amazonGeo';
import { getAmazonDestination } from './amazonRedirect';

describe('amazonGeo display stores', () => {
  it('contains only the two routable stores (CA, US)', () => {
    expect(Object.keys(AMAZON_STORES).sort()).toEqual(['CA', 'US']);
  });

  it('carries no affiliate tags anywhere (display-only)', () => {
    for (const store of Object.values(AMAZON_STORES)) {
      expect(store).not.toHaveProperty('affiliateTag');
    }
  });

  it('maps CA (any case/whitespace) to the amazon.ca store', () => {
    expect(getStoreForCountry('CA').domain).toBe('amazon.ca');
    expect(getStoreForCountry('ca').domain).toBe('amazon.ca');
    expect(getStoreForCountry(' ca ').domain).toBe('amazon.ca');
  });

  it('maps every other country (and empty input) to the amazon.com store', () => {
    for (const code of ['US', 'GB', 'AU', 'DE', 'JP', 'IN', '']) {
      expect(getStoreForCountry(code).domain).toBe('amazon.com');
    }
  });

  it('defaults to the amazon.com store (mirrors the /go/amazon fallback)', () => {
    expect(DEFAULT_STORE.domain).toBe('amazon.com');
  });

  it('stays consistent with the amazonRedirect routing truth', () => {
    // CA visitors are routed to amazon.ca; everyone else to amazon.com
    const cases: Array<[string, string]> = [
      ['CA', 'www.amazon.ca'],
      ['US', 'www.amazon.com'],
      ['GB', 'www.amazon.com'],
      ['', 'www.amazon.com'],
    ];
    for (const [code, host] of cases) {
      const display = getStoreForCountry(code);
      const dest = getAmazonDestination(code || null, 'tape measure');
      expect(dest.url).toContain(`https://${host}/`);
      expect(dest.url).toContain(display.domain);
    }
  });
});
