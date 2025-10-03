import { useState, useCallback } from 'react'
import { userService } from '../services/userService'
import { 
  FindAllUsersOptions, 
  FindAllUsersResult, 
  User, 
  UpdateUserData 
} from '@/types/api'

export const useUsers = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAllUsers = useCallback(async (options?: FindAllUsersOptions): Promise<FindAllUsersResult | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await userService.getAllUsers(options)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch users')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserById = useCallback(async (id: string): Promise<User | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await userService.getUserById(id)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch user')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (id: string, updateData: UpdateUserData): Promise<User | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await userService.updateUser(id, updateData)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to update user')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deactivateUser = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await userService.deactivateUser(id)
      
      if (result.success) {
        return true
      } else {
        setError(result.error || 'Failed to deactivate user')
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deactivate user'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const searchUsers = useCallback(async (searchTerm: string, limit = 10): Promise<User[]> => {
    if (!searchTerm.trim()) return []
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await userService.searchUsers(searchTerm, limit)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to search users')
        return []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search users'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getUsersByRole = useCallback(async (role: string): Promise<User[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await userService.getUsersByRole(role)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch users by role')
        return []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users by role'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await userService.getUserStats()
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch user statistics')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user statistics'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    getAllUsers,
    getUserById,
    updateUser,
    deactivateUser,
    searchUsers,
    getUsersByRole,
    getUserStats,
    clearError
  }
}
