import { NextRequest, NextResponse } from 'next/server';
import { getAmazonDestination } from '@/lib/amazonRedirect';

/**
 * GET /go/amazon?k=<product keyword>
 *
 * Single canonical affiliate link for every product on the site.
 * Detects the visitor's country server-side via Vercel's
 * `x-vercel-ip-country` header (free, no external IP API) and 302-redirects
 * to that country's Amazon store with Karim's correct Associates tag.
 */
export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get('k')?.trim();

  // No keyword → back to the shop instead of a broken Amazon URL.
  if (!keyword) {
    return NextResponse.redirect(new URL('/shop', request.url), 302);
  }

  const country = request.headers.get('x-vercel-ip-country');
  const { url } = getAmazonDestination(country, keyword);
  return NextResponse.redirect(url, 302);
}
