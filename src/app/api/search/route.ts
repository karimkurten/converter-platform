import { NextRequest, NextResponse } from 'next/server';
import { searchConverters } from '@/lib/converters';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20);

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Sanitize input
  const sanitized = query.replace(/[<>'"]/g, '').slice(0, 100);
  const results = searchConverters(sanitized, limit);

  return NextResponse.json(
    { results, query: sanitized },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}
