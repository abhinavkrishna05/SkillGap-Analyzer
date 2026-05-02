import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import skillsReducer from './slices/skillsSlice'
import jobsReducer from './slices/jobsSlice'
import goalsReducer from './slices/goalsSlice'
import projectsReducer from './slices/projectsSlice'
import uiReducer from './slices/uiSlice'

/**
 * Central Redux store
 * Uses Redux Toolkit for simplified setup and immutable state management
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,       // User authentication state
    skills: skillsReducer,   // User skills CRUD
    jobs: jobsReducer,       // Job listings and analysis
    goals: goalsReducer,     // Learning goals CRUD
    projects: projectsReducer, // User projects CRUD
    ui: uiReducer,           // UI state (dark mode, sidebar, toasts)
  },
  // Middleware is auto-configured by RTK (includes redux-thunk)
})
