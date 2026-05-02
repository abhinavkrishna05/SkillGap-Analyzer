import React from 'react'

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in child component tree
 * Displays a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // In production, log to an error tracking service (e.g., Sentry)
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    // Optionally navigate to home or reload
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-md w-full card p-8 text-center">
            {/* Error icon */}
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              An unexpected error occurred. Don't worry — your data is safe.
            </p>

            {/* Show error details in dev mode */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mb-6">
                <summary className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer mb-2">
                  Error details (dev only)
                </summary>
                <pre className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg overflow-auto max-h-40">
                  {this.state.error?.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button onClick={this.handleReset} className="btn-primary w-full">
              Back to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
