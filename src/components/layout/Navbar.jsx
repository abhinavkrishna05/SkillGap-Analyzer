import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../redux/slices/uiSlice'
import { fetchJobs } from '../../redux/slices/jobsSlice'
import { setRefreshing } from '../../redux/slices/uiSlice'
import { useToast } from '../../hooks/useCustomHooks'

export default function Navbar({ title }) {
  const dispatch = useDispatch()
  const toast = useToast()
  const { isRefreshing } = useSelector(state => state.ui)

  const handleRefresh = async () => {
    dispatch(setRefreshing(true))
    try {
      await dispatch(fetchJobs()).unwrap()
      toast.success('Data refreshed successfully!')
    } catch (err) {
      toast.error('Failed to refresh data')
    } finally {
      dispatch(setRefreshing(false))
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 flex items-center gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <h1 className="font-display font-bold text-slate-900 dark:text-white text-xl flex-1">
        {title}
      </h1>

      {/* Refresh button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Refresh data"
        className={`p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg
          className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </header>
  )
}
