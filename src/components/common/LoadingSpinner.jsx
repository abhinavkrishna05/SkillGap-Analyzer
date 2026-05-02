/**
 * Loading spinner with optional message
 */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-brand-100 dark:border-brand-900/30 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-brand-600 rounded-full animate-spin" />
      </div>
      {message && (
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * Skeleton card placeholder for loading states
 */
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg mb-2"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  )
}
