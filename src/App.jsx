import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initDarkMode } from './redux/slices/uiSlice'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'
import ToastContainer from './components/common/ToastContainer'
import LoadingSpinner from './components/common/LoadingSpinner'

// ─── Lazy-loaded pages (code splitting for performance) ────────────────────
// React.lazy + Suspense means these JS chunks are only loaded when needed
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Skills = lazy(() => import('./pages/Skills'))
const Jobs = lazy(() => import('./pages/Jobs'))
const Profile = lazy(() => import('./pages/Profile'))

// ─── Route protection HOC ─────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

// ─── Public route (redirect if logged in) ─────────────────────────────────
function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

// ─── Page loading fallback ─────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <LoadingSpinner message="Loading..." />
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()

  // Initialize dark mode from localStorage on app mount
  useEffect(() => {
    dispatch(initDarkMode())
  }, [dispatch])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Suspense wraps all lazy routes - shows PageLoader while chunk loads */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public routes ── */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* ── Protected routes (inside layout) ── */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>

        {/* Global toast notifications */}
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
