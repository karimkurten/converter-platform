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
    return null; // Hide placeholder during AdSense review
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
  return null; // Hidden during AdSense review
}
