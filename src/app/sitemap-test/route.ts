import { NextResponse } from 'next/server'
import { CATEGORIES, getAllConverterPaths } from '@/lib/converters'

export async function GET() {
  const paths = getAllConverterPaths()
  return NextResponse.json({
    status: 'ok',
    totalCategories: CATEGORIES.length,
    totalConverters: paths.length,
    totalPages: paths.length + CATEGORIES.length + 5,
    sampleUrls: [
      'https://www.convertnow.ca',
      'https://www.convertnow.ca/length',
      'https://www.convertnow.ca/length/kilometer-to-mile',
    ]
  })
}
