import type { Metadata } from 'next';
import {
  getConverterBySlug,
  VALUE_PAGE_CONVERTERS,
  CHART_PAGE_CONVERTERS,
} from '@/lib/converters';
import { getValuePageDef, getChartPageDef } from '@/lib/valuePages';
import { buildValuePageMetadata, buildChartPageMetadata } from '@/lib/seo';
import { SpecificValuePageView, ChartPageView } from '@/components/converter/SpecialPages';

// ─── Specific-value + chart pages (Batch H) ──────────────────────────────────
// Dedicated route for the weight cluster's "70 kg to lbs" value pages and
// the printable kg↔lb chart, following the Batch F/G pattern: the pages
// are registered in the weight category (so the sitemap, hub ItemList and
// search index include them) but are rendered here, because a page about
// one specific value — or a full chart — is not a unit-to-unit pair page.
// `dynamicParams = false` + generateStaticParams means ONLY these ids are
// served here; other /weight/* URLs fall through to the pair route as
// before. All figures are computed in src/lib/valuePages from the real
// weight conversion functions.
export const dynamicParams = false;

const CATEGORY = 'weight';

export function generateStaticParams() {
  return [...VALUE_PAGE_CONVERTERS, ...CHART_PAGE_CONVERTERS]
    .filter(c => c.category === CATEGORY)
    .map(c => ({ valuePage: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ valuePage: string }>;
}): Promise<Metadata> {
  const { valuePage } = await params;
  const converter = getConverterBySlug(CATEGORY, valuePage);
  if (!converter) return {};
  if (getValuePageDef(valuePage)) return buildValuePageMetadata(converter);
  if (getChartPageDef(valuePage)) return buildChartPageMetadata(converter);
  return {};
}

export default async function WeightSpecialPage({
  params,
}: {
  params: Promise<{ valuePage: string }>;
}) {
  const { valuePage } = await params;
  if (getChartPageDef(valuePage)) {
    return <ChartPageView categorySlug={CATEGORY} pageId={valuePage} />;
  }
  return <SpecificValuePageView categorySlug={CATEGORY} pageId={valuePage} />;
}
