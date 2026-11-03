'use client';

/**
 * Print button for the Batch H chart pages. The chart views pair this with
 * print CSS that hides the site header/footer and every non-chart section,
 * so what reaches paper is the table itself.
 */
export default function PrintButton({ label = 'Print this chart' }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 print:hidden"
    >
      <span aria-hidden="true">🖨️</span> {label}
    </button>
  );
}
