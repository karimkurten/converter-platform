import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // Vercel automatically provides country in request headers
  const country = 
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    'CA'

  const storeMap: Record<string, string> = {
    CA: 'amazon.ca',
    US: 'amazon.com',
    GB: 'amazon.co.uk',
    AU: 'amazon.com.au',
    DE: 'amazon.de',
    FR: 'amazon.fr',
    IT: 'amazon.it',
    ES: 'amazon.es',
    JP: 'amazon.co.jp',
    IN: 'amazon.in',
    MX: 'amazon.com.mx',
    BR: 'amazon.com.br',
  }

  const tagMap: Record<string, string> = {
    CA: 'convertnow-20',
    US: 'convertnowus-20',
    GB: 'convertnow-22',
    AU: 'convertnow-23',
    DE: 'convertnow-24',
    FR: 'convertnow-25',
    IT: 'convertnow-26',
    ES: 'convertnow-27',
    JP: 'convertnow-28',
    IN: 'convertnow-29',
    MX: 'convertnow-30',
    BR: 'convertnow-31',
  }

  return NextResponse.json({
    country: country.toUpperCase(),
    domain: storeMap[country] || 'amazon.ca',
    tag: tagMap[country] || 'convertnow-20',
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    }
  })
}
