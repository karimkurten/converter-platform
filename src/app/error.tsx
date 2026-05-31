'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-md py-16 lg:py-24 text-center">
      <div className="max-w-lg mx-auto">
        <div className="text-7xl mb-4" aria-hidden="true">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={reset} className="btn-primary">Try again</button>
          <Link href="/" className="btn-secondary">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
