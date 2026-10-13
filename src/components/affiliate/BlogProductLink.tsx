'use client';

import { useAmazonStore } from '@/hooks/useAmazonStore';

/**
 * Renders a "Product link: <amazon-url>" mention from blog copy as a real,
 * geo-localized clickable affiliate link (target _blank, rel sponsored).
 */
export default function BlogProductLink({ baseUrl }: { baseUrl: string }) {
  const { store, getLocalUrl } = useAmazonStore();

  return (
    <a
      href={getLocalUrl(baseUrl)}
      target="_blank"
      rel="sponsored noopener"
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-bold transition-colors"
    >
      <span className="text-base">{store.flag}</span>
      <span>Check price on {store.domain}</span>
    </a>
  );
}
