import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { RootState, AppDispatch } from '../store'
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError,
  setLoading
} from '../slices/adminAuthSlice'
import { adminAuthService } from '../services/adminAuthService'
import { setApiToken, clearApiToken } from '../utils/apiUtils'

export const useAdminAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.adminAuth
  )

  const login = async (email: string, password: string) => {
    dispatch(loginStart())

    try {
      const result = await adminAuthService.login({ email, password })
      
      if (result.success && result.data) {
        dispatch(loginSuccess({ 
          user: result.data.user, 
          token: result.data.tokens.accessToken,
          refreshToken: result.data.tokens.refreshToken
        }))
        setApiToken(result.data.tokens.accessToken)
        return { success: true }
      } else {
        throw new Error(result.error || 'Login failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch(loginFailure(errorMessage))
      return { success: false, error: errorMessage }
    }
  }

  const logoutUser = async () => {
    if (token) {
      try {
        await adminAuthService.logout(token)
      } catch (error) {
        console.error('Logout API call failed:', error)
      }
    }
    clearApiToken()
    dispatch(logout())
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  const validateCurrentToken = useCallback(async () => {
    if (!token) return false
    
    // Check if token is expired before making API call
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      // If token is expired, logout immediately
      if (payload.exp && payload.exp < currentTime) {
        dispatch(logout())
        return false
      }
    } catch (error) {
      // If token is malformed, logout
      dispatch(logout())
      return false
    }
    
    // Set loading state for validation
    dispatch(setLoading(true))
    
    try {
      const result = await adminAuthService.validateToken(token)
      
      if (result.success && result.data) {
        dispatch(loginSuccess({ user: result.data.user, token }))
        return true
      } else {
        dispatch(logout())
        return false
      }
    } catch (error) {
      dispatch(logout())
      return false
    } finally {
      dispatch(setLoading(false))
    }
  }, [token, dispatch])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
    clearError: clearAuthError,
    validateCurrentToken
  }
}
