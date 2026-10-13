import { describe, it, expect } from 'vitest';
import {
  getAmazonDestination,
  keywordFromAmazonUrl,
  buildAmazonGoUrl,
  amazonUrlToGoUrl,
} from './amazonRedirect';

describe('getAmazonDestination', () => {
  it('routes CA visitors to amazon.ca with the Canadian tag', () => {
    const d = getAmazonDestination('CA', 'tape measure');
    expect(d.store).toBe('CA');
    expect(d.url).toBe('https://www.amazon.ca/s?k=tape%20measure&tag=convertnow-20');
  });

  it('routes US visitors to amazon.com with the US tag', () => {
    const d = getAmazonDestination('US', 'tape measure');
    expect(d.store).toBe('US');
    expect(d.url).toBe('https://www.amazon.com/s?k=tape%20measure&tag=convertnowus-20');
  });

  it('falls back to amazon.com + US tag for other countries (GB)', () => {
    const d = getAmazonDestination('GB', 'tape measure');
    expect(d.store).toBe('US');
    expect(d.url).toBe('https://www.amazon.com/s?k=tape%20measure&tag=convertnowus-20');
  });

  it('falls back to amazon.com + US tag when the geo header is missing', () => {
    for (const missing of [null, undefined, '']) {
      const d = getAmazonDestination(missing, 'tape measure');
      expect(d.store).toBe('US');
      expect(d.url).toContain('tag=convertnowus-20');
    }
  });

  it('handles lowercase country codes', () => {
    expect(getAmazonDestination('ca', 'x').store).toBe('CA');
    expect(getAmazonDestination('us', 'x').store).toBe('US');
  });

  it('URL-encodes the keyword', () => {
    const d = getAmazonDestination('US', 'café scale 2-in-1');
    expect(d.url).toContain('k=caf%C3%A9%20scale%202-in-1');
  });
});

describe('keyword helpers', () => {
  it('extracts the keyword from a legacy direct Amazon URL', () => {
    expect(
      keywordFromAmazonUrl('https://www.amazon.ca/s?k=Stanley+FatMax+25ft+tape+measure&tag=convertnow-20'),
    ).toBe('Stanley FatMax 25ft tape measure');
  });

  it('returns empty string for unparseable URLs', () => {
    expect(keywordFromAmazonUrl('not a url')).toBe('');
  });

  it('builds the canonical on-site go link', () => {
    expect(buildAmazonGoUrl('tape measure')).toBe('/go/amazon?k=tape%20measure');
  });

  it('converts a legacy Amazon URL to the go link end-to-end', () => {
    expect(
      amazonUrlToGoUrl('https://www.amazon.ca/s?k=Bosch+laser+distance+measure&tag=convertnow-20'),
    ).toBe('/go/amazon?k=Bosch%20laser%20distance%20measure');
  });
});
