'use client';

import { useAmazonStore } from '@/hooks/useAmazonStore';
import { amazonUrlToGoUrl } from '@/lib/amazonRedirect';

/**
 * Renders a "Product link: <amazon-url>" mention from blog copy as a real,
 * clickable affiliate link (target _blank, rel sponsored). The href is the
 * single canonical on-site link — the server geo-redirects it to the
 * visitor's Amazon store with the correct Associates tag.
 */
export default function BlogProductLink({ baseUrl }: { baseUrl: string }) {
  const { store } = useAmazonStore();

  return (
    <a
      href={amazonUrlToGoUrl(baseUrl)}
      target="_blank"
      rel="sponsored noopener"
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-bold transition-colors"
    >
      <span className="text-base">{store.flag}</span>
      <span>Check price on {store.domain}</span>
    </a>
  );
}
