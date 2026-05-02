import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '../../redux/slices/uiSlice'

// ─── Individual Toast ──────────────────────────────────────────────────────
function Toast({ toast }) {
  const dispatch = useDispatch()

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, dispatch])

  const styles = {
    success: {
      container: 'bg-green-50 dark:bg-green-900/90 border-green-200 dark:border-green-700',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-800 dark:text-green-200',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-700',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-200',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-200',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/90 border-yellow-200 dark:border-yellow-700',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-800 dark:text-yellow-200',
    },
  }

  const icons = {
    success: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  }

  const s = styles[toast.type] || styles.info

  return (
    <div className={`toast-enter flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-72 max-w-sm ${s.container}`}>
      <span className={`mt-0.5 flex-shrink-0 ${s.icon}`}>{icons[toast.type]}</span>
      <p className={`text-sm font-medium flex-1 ${s.text}`}>{toast.message}</p>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className={`flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ${s.icon}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ─── Toast Container ───────────────────────────────────────────────────────
export default function ToastContainer() {
  const toasts = useSelector(state => state.ui.toasts)

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  )
}
