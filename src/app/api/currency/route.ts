import { NextResponse } from 'next/server';

const CACHE_TTL = 3600; // 1 hour

// Free exchange-rate APIs (no key required for basic usage)
const API_URLS = [
  'https://api.exchangerate-api.com/v4/latest/USD',
  'https://open.er-api.com/v6/latest/USD',
];

export const runtime = 'edge';

/**
 * Fetch current USD-base exchange rates.
 * Caching strategy:
 * - Use Next.js fetch revalidation (`next: { revalidate: CACHE_TTL }`) so the platform
 *   handles caching across edge isolates.
 * - Set `Cache-Control` so CDNs and clients can share the response.
 * - No module-scoped variables (unreliable on edge / serverless cold starts).
 */
export async function GET() {
  for (const url of API_URLS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(url, {
        next: { revalidate: CACHE_TTL },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) continue;

      const data = await res.json();
      const rates: Record<string, number> | undefined = data.rates || data.conversion_rates;

      if (!rates || typeof rates !== 'object') continue;

      return NextResponse.json(
        { rates, timestamp: Date.now() },
        {
          headers: {
            'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL * 2}`,
            'CDN-Cache-Control': `public, max-age=${CACHE_TTL}`,
          },
        }
      );
    } catch {
      continue;
    }
  }

  return NextResponse.json(
    { error: 'Exchange rates unavailable', rates: null },
    { status: 503 }
  );
}
