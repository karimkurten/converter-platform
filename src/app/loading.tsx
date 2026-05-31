export default function Loading() {
  return (
    <div className="container-md py-16 lg:py-24" aria-busy="true" aria-live="polite">
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
        <div className="h-32 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-4" />
        <div className="h-32 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
      </div>
    </div>
  );
}
