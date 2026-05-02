import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Dark mode - persist to localStorage
    darkMode: localStorage.getItem('darkMode') === 'true',
    // Mobile sidebar open state
    sidebarOpen: false,
    // Toast notifications queue
    toasts: [],
    // Global loading state
    isRefreshing: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', String(state.darkMode))
      // Apply/remove dark class on document
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    initDarkMode: (state) => {
      // Apply persisted dark mode on app load
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false
    },
    /**
     * Add a toast notification
     * @param {string} action.payload.message - Toast message
     * @param {string} action.payload.type - 'success' | 'error' | 'info' | 'warning'
     */
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || 'info',
      })
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload
    },
  },
})

export const { toggleDarkMode, initDarkMode, toggleSidebar, closeSidebar, addToast, removeToast, setRefreshing } = uiSlice.actions
export default uiSlice.reducer
