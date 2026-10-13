'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';

const CONSENT_KEY = 'cn-consent';
type Consent = 'accepted' | 'declined';

/**
 * Lightweight cookie consent banner. Google Analytics loads only after the
 * visitor explicitly accepts. Choice persists in localStorage.
 */
export default function CookieConsent({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    try {
      setConsent(localStorage.getItem(CONSENT_KEY) as Consent | null);
    } catch {
      setConsent('declined');
    }
  }, []);

  const choose = (value: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // storage unavailable — treat as declined in-session only
    }
    setConsent(value);
  };

  return (
    <>
      {gaId && consent === 'accepted' && <GoogleAnalytics gaId={gaId} />}

      {consent === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-sm z-50 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-5"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            We use Google Analytics to understand how the site is used. Accept to
            enable analytics cookies, or decline to browse without them.{' '}
            <Link href="/privacy" className="text-brand-600 dark:text-brand-400 underline hover:no-underline">
              Privacy Policy
            </Link>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => choose('declined')}
              className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => choose('accepted')}
              className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}
