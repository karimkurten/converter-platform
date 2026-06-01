// Track custom events to Google Analytics
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Pre-built tracking functions for ConvertNow
export const Analytics = {
  trackConversion: (from: string, to: string, category: string) => {
    trackEvent('conversion_performed', category, `${from}_to_${to}`);
  },
  trackCopy: (converter: string) => {
    trackEvent('result_copied', 'engagement', converter);
  },
  trackSwap: (category: string) => {
    trackEvent('units_swapped', 'engagement', category);
  },
  trackFavorite: (converter: string) => {
    trackEvent('converter_favorited', 'engagement', converter);
  },
  trackSearch: (query: string) => {
    trackEvent('search_performed', 'engagement', query);
  },
  trackCategoryView: (category: string) => {
    trackEvent('category_viewed', 'navigation', category);
  },
};

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export {};
