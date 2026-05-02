import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ─── Mock user database ────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 'u1',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Arjun Sharma',
    role: 'user',
    avatar: null,
    college: 'IIT Delhi',
    branch: 'Computer Science',
    graduationYear: 2025,
    targetRoles: ['Full Stack Developer', 'Backend Engineer'],
  },
  {
    id: 'u2',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Priya Patel',
    role: 'admin',
    avatar: null,
    college: 'NIT Trichy',
    branch: 'Information Technology',
    graduationYear: 2024,
    targetRoles: ['Data Scientist', 'ML Engineer'],
  },
]

// ─── Async Thunks ──────────────────────────────────────────────────────────

/**
 * Mock login - simulates an API call with a delay
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password
    )

    if (!user) {
      return rejectWithValue('Invalid email or password')
    }

    // Don't store password in state
    const { password: _, ...safeUser } = user

    // Persist to localStorage (mock session)
    localStorage.setItem('skillgap_user', JSON.stringify(safeUser))
    return safeUser
  }
)

/**
 * Mock signup - simulates user registration
 */
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if email already exists
    const exists = MOCK_USERS.find(u => u.email === userData.email)
    if (exists) {
      return rejectWithValue('Email already registered')
    }

    const newUser = {
      id: `u${Date.now()}`,
      ...userData,
      role: 'user',
      avatar: null,
    }

    // In a real app, this would save to backend
    const { password: _, ...safeUser } = newUser
    localStorage.setItem('skillgap_user', JSON.stringify(safeUser))
    return safeUser
  }
)

// ─── Slice ─────────────────────────────────────────────────────────────────

// Try to restore session from localStorage
const savedUser = localStorage.getItem('skillgap_user')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    isLoading: false,
    error: null,
    isAuthenticated: !!savedUser,
  },
  reducers: {
    // Logout clears all auth state
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('skillgap_user')
    },
    clearError: (state) => {
      state.error = null
    },
    // Update user profile
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('skillgap_user', JSON.stringify(state.user))
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // ── Signup ──
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError, updateProfile } = authSlice.actions
export default authSlice.reducer
