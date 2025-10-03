import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types/api'

// Keep legacy interface for backward compatibility
export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  phoneNumber: string | null
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface AdminAuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isHydrated: boolean
}

// Don't access localStorage during SSR - always return null initially
const getStoredToken = (): string | null => {
  return null
}

const initialState: AdminAuthState = {
  user: null,
  token: getStoredToken(),
  refreshToken: null,
  isAuthenticated: false, // Always false initially to prevent hydration mismatch
  isLoading: false,
  error: null,
  isHydrated: false
}

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken || null
      state.error = null
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', action.payload.token)
        if (action.payload.refreshToken) {
          localStorage.setItem('adminRefreshToken', action.payload.refreshToken)
        }
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.user = null
      state.token = null
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      // Remove tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminRefreshToken')
      }
    },
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    updateToken: (state, action: PayloadAction<{ token: string; refreshToken?: string }>) => {
      state.token = action.payload.token
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
      // Update stored tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', action.payload.token)
        if (action.payload.refreshToken) {
          localStorage.setItem('adminRefreshToken', action.payload.refreshToken)
        }
      }
    },
    hydrateFromStorage: (state) => {
      // This will be called after hydration to load stored data
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('adminToken')
        const storedRefreshToken = localStorage.getItem('adminRefreshToken')
        if (storedToken) {
          state.token = storedToken
          state.refreshToken = storedRefreshToken
          state.isAuthenticated = true
        }
      }
      state.isHydrated = true
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  }
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setUser,
  updateToken,
  hydrateFromStorage,
  setLoading
} = adminAuthSlice.actions

export default adminAuthSlice.reducer
