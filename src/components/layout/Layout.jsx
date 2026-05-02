import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

// Page titles mapping
const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/skills': 'My Skills',
  '/jobs': 'Job Roles',
  '/profile': 'Profile & Goals',
}

export default function Layout() {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'SkillGap Analyzer'

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content area - offset for sidebar on large screens */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Navbar title={title} />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 page-fade">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
