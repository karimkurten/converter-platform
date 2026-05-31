'use client';

import { useEffect, useRef, useState } from 'react';
import type { AdSlot } from '@/types';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdUnitProps {
  slot: AdSlot;
  className?: string;
  label?: boolean;
}

const AD_CONFIGS: Record<AdSlot, { width: string; height: string; format: string }> = {
  'header': { width: '728px', height: '90px', format: 'horizontal' },
  'sidebar-top': { width: '300px', height: '250px', format: 'rectangle' },
  'sidebar-bottom': { width: '300px', height: '250px', format: 'rectangle' },
  'in-content': { width: '336px', height: '280px', format: 'rectangle' },
  'footer': { width: '728px', height: '90px', format: 'horizontal' },
  'mobile-sticky': { width: '320px', height: '50px', format: 'horizontal' },
};

const AD_SLOT_IDS: Record<AdSlot, string> = {
  'header': process.env.NEXT_PUBLIC_AD_SLOT_HEADER || '1234567890',
  'sidebar-top': process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_TOP || '2345678901',
  'sidebar-bottom': process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_BOTTOM || '3456789012',
  'in-content': process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT || '4567890123',
  'footer': process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || '5678901234',
  'mobile-sticky': process.env.NEXT_PUBLIC_AD_SLOT_MOBILE || '6789012345',
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function AdUnit({ slot, className = '', label = true }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!adRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  // Push ad after becoming visible
  useEffect(() => {
    if (!visible || initialized || !ADSENSE_CLIENT) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setInitialized(true);
    } catch (e) {
      console.warn('AdSense initialization failed:', e);
    }
  }, [visible, initialized]);

  const config = AD_CONFIGS[slot];

  // In development or no AdSense ID: show placeholder
  if (!ADSENSE_CLIENT || process.env.NODE_ENV === 'development') {
    return (
      <div ref={adRef} className={`ad-container ${className}`}>
        {label && <p className="ad-label">Advertisement</p>}
        <div
          style={{ width: config.width, height: config.height, maxWidth: '100%' }}
          className="bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center"
        >
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Ad Placeholder ({config.width} × {config.height})
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      {label && <p className="ad-label">Advertisement</p>}
      {visible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: config.width, height: config.height, maxWidth: '100%' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={AD_SLOT_IDS[slot]}
          data-ad-format={config.format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}

// ─── Sticky Mobile Ad ──────────────────────────────────────────────────────────

export function StickyMobileAd() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 no-print">
      <div className="flex items-center justify-between px-3 py-1 max-w-sm mx-auto">
        <AdUnit slot="mobile-sticky" label={false} />
        <button
          onClick={() => setDismissed(true)}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
          aria-label="Close ad"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
