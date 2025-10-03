import { useState, useCallback } from 'react'
import { adminApiService } from '@/lib/services/adminApiService'
import { ApiResponse, PaginatedResponse } from '@/types/api'

// Generic hook for API calls
export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall()
      if (response.success && response.data) {
        setData(response.data)
        return response
      } else {
        throw new Error(response.error || 'API call failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Reset function to clear data and error states
  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

// Dashboard hooks
export function useDashboardOverview() {
  const { data, loading, error, execute, reset } = useApiCall<any>()

  const fetchOverview = useCallback(() => {
    return execute(() => adminApiService.getDashboardOverview())
  }, [execute])

  return { data, loading, error, fetchOverview, reset }
}

export function useDashboardAnalytics() {
  const { data, loading, error, execute, reset } = useApiCall<any>()

  const fetchAnalytics = useCallback((period: string = '7d', groupBy: string = 'day') => {
    return execute(() => adminApiService.getDashboardAnalytics(period, groupBy))
  }, [execute])

  return { data, loading, error, fetchAnalytics, reset }
}

export function useDashboardStats() {
  const { data, loading, error, execute, reset } = useApiCall<any>()

  const fetchStats = useCallback(() => {
    return execute(() => adminApiService.getDashboardStats())
  }, [execute])

  return { data, loading, error, fetchStats, reset }
}

export function useRecentActivity() {
  const { data, loading, error, execute, reset } = useApiCall<any[]>()

  const fetchActivity = useCallback((limit: number = 10) => {
    return execute(() => adminApiService.getRecentActivity(limit))
  }, [execute])

  return { data, loading, error, fetchActivity, reset }
}

// User Management hooks
export function useUsers() {
  const { data, loading, error, execute } = useApiCall<PaginatedResponse<any>>()

  const fetchUsers = useCallback((page: number = 1, limit: number = 10) => {
    return execute(() => adminApiService.getUsers(page, limit))
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchUsers
  }
}

export function useUserOperations() {
  const { data, loading, error, execute } = useApiCall<any>()

  const createUser = useCallback(async (userData: any) => {
    return execute(() => adminApiService.createUser(userData))
  }, [execute])

  const updateUser = useCallback(async (id: string, userData: any) => {
    return execute(() => adminApiService.updateUser(id, userData))
  }, [execute])

  const deleteUser = useCallback(async (id: string) => {
    return execute(() => adminApiService.deleteUser(id))
  }, [execute])

  const updateUserStatus = useCallback(async (id: string, statusData: any) => {
    return execute(() => adminApiService.updateUserStatus(id, statusData))
  }, [execute])

  const assignUserRoles = useCallback(async (id: string, rolesData: any) => {
    return execute(() => adminApiService.assignUserRoles(id, rolesData))
  }, [execute])

  return {
    data,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    assignUserRoles
  }
}

export function useUserById() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchUser = useCallback((id: string) => {
    return execute(() => adminApiService.getUserById(id))
  }, [execute])

  return { data, loading, error, fetchUser }
}

export function useUserActivity() {
  const { data, loading, error, execute } = useApiCall<any[]>()

  const fetchActivity = useCallback((id: string) => {
    return execute(() => adminApiService.getUserActivity(id))
  }, [execute])

  return { data, loading, error, fetchActivity }
}

export function useUserStats() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchStats = useCallback(() => {
    return execute(() => adminApiService.getUserStats())
  }, [execute])

  return { data, loading, error, fetchStats }
}

// Resource Management hooks
export function useResources() {
  const { data, loading, error, execute } = useApiCall<PaginatedResponse<any>>()

  const fetchResources = useCallback((page: number = 1, limit: number = 10) => {
    return execute(() => adminApiService.getResources(page, limit))
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchResources
  }
}

export function useResourceOperations() {
  const { data, loading, error, execute } = useApiCall<any>()

  const createResource = useCallback(async (resourceData: any) => {
    return execute(() => adminApiService.createResource(resourceData))
  }, [execute])

  const updateResource = useCallback(async (id: string, resourceData: any) => {
    return execute(() => adminApiService.updateResource(id, resourceData))
  }, [execute])

  const deleteResource = useCallback(async (id: string) => {
    return execute(() => adminApiService.deleteResource(id))
  }, [execute])

  const updateResourceStatus = useCallback(async (id: string, statusData: any) => {
    return execute(() => adminApiService.updateResourceStatus(id, statusData))
  }, [execute])

  const bulkUploadResources = useCallback(async (resourcesData: any[]) => {
    return execute(() => adminApiService.bulkUploadResources(resourcesData))
  }, [execute])

  return {
    data,
    loading,
    error,
    createResource,
    updateResource,
    deleteResource,
    updateResourceStatus,
    bulkUploadResources
  }
}

export function useResourceById() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchResource = useCallback((id: string) => {
    return execute(() => adminApiService.getResourceById(id))
  }, [execute])

  return { data, loading, error, fetchResource }
}

export function useResourceStats() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchStats = useCallback((id: string) => {
    return execute(() => adminApiService.getResourceStats(id))
  }, [execute])

  return { data, loading, error, fetchStats }
}

export function useResourcesOverview() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchOverview = useCallback(() => {
    return execute(() => adminApiService.getResourcesOverview())
  }, [execute])

  return { data, loading, error, fetchOverview }
}

// File Management hooks
export function useFiles() {
  const { data, loading, error, execute } = useApiCall<PaginatedResponse<any>>()

  const fetchFiles = useCallback((page: number = 1, limit: number = 10) => {
    return execute(() => adminApiService.getFiles(page, limit))
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchFiles
  }
}

export function useFileOperations() {
  const { data, loading, error, execute } = useApiCall<any>()

  const deleteFile = useCallback(async (id: string) => {
    return execute(() => adminApiService.deleteFile(id))
  }, [execute])

  const optimizeFiles = useCallback(async () => {
    return execute(() => adminApiService.optimizeFiles())
  }, [execute])

  const backupFiles = useCallback(async () => {
    return execute(() => adminApiService.backupFiles())
  }, [execute])

  return {
    data,
    loading,
    error,
    deleteFile,
    optimizeFiles,
    backupFiles
  }
}

export function useFileById() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchFile = useCallback((id: string) => {
    return execute(() => adminApiService.getFileById(id))
  }, [execute])

  return { data, loading, error, fetchFile }
}

export function useFileStorageStats() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchStats = useCallback(() => {
    return execute(() => adminApiService.getFileStorageStats())
  }, [execute])

  return { data, loading, error, fetchStats }
}

export function useFileAnalytics() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchAnalytics = useCallback((id: string) => {
    return execute(() => adminApiService.getFileAnalytics(id))
  }, [execute])

  return { data, loading, error, fetchAnalytics }
}

// System Management hooks
export function useSystemStatus() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchStatus = useCallback(() => {
    return execute(() => adminApiService.getSystemStatus())
  }, [execute])

  return { data, loading, error, fetchStatus }
}

export function useSystemConfig() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchConfig = useCallback(() => {
    return execute(() => adminApiService.getSystemConfig())
  }, [execute])

  const updateConfig = useCallback(async (configData: any) => {
    return execute(() => adminApiService.updateSystemConfig(configData))
  }, [execute])

  return { data, loading, error, fetchConfig, updateConfig }
}

export function useSystemLogs() {
  const { data, loading, error, execute } = useApiCall<any[]>()

  const fetchLogs = useCallback((level?: string, limit: number = 50) => {
    return execute(() => adminApiService.getSystemLogs(level, limit))
  }, [execute])

  return { data, loading, error, fetchLogs }
}

export function useSystemBackup() {
  const { data, loading, error, execute } = useApiCall<void>()

  const createBackup = useCallback(async () => {
    return execute(() => adminApiService.createSystemBackup())
  }, [execute])

  const restoreBackup = useCallback(async (backupPath: string) => {
    return execute(() => adminApiService.restoreSystemBackup(backupPath))
  }, [execute])

  return { data, loading, error, createBackup, restoreBackup }
}

export function usePerformanceMetrics() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchMetrics = useCallback(() => {
    return execute(() => adminApiService.getPerformanceMetrics())
  }, [execute])

  return { data, loading, error, fetchMetrics }
}

// Categories hooks
export function useCategories() {
  const { data, loading, error, execute } = useApiCall<any[]>()

  const fetchCategories = useCallback(() => {
    return execute(() => adminApiService.getCategories())
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchCategories
  }
}

export function useCategoryOperations() {
  const { data, loading, error, execute } = useApiCall<any>()

  const createCategory = useCallback(async (categoryData: any) => {
    return execute(() => adminApiService.createCategory(categoryData))
  }, [execute])

  const updateCategory = useCallback(async (id: string, categoryData: any) => {
    return execute(() => adminApiService.updateCategory(id, categoryData))
  }, [execute])

  const deleteCategory = useCallback(async (id: string) => {
    return execute(() => adminApiService.deleteCategory(id))
  }, [execute])

  return {
    data,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  }
}

export function useCategoryById() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchCategory = useCallback((id: string) => {
    return execute(() => adminApiService.getCategoryById(id))
  }, [execute])

  return { data, loading, error, fetchCategory }
}

// Streaming hooks
export function useStreaming() {
  const { data, loading, error, execute } = useApiCall<any[]>()

  const fetchStreams = useCallback(() => {
    return execute(() => adminApiService.getStreams())
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchStreams
  }
}

export function useStreamingOperations() {
  const { data, loading, error, execute } = useApiCall<any>()

  const createStream = useCallback(async (streamData: any) => {
    return execute(() => adminApiService.createStream(streamData))
  }, [execute])

  const updateStream = useCallback(async (id: string, streamData: any) => {
    return execute(() => adminApiService.updateStream(id, streamData))
  }, [execute])

  const deleteStream = useCallback(async (id: string) => {
    return execute(() => adminApiService.deleteStream(id))
  }, [execute])

  const startStream = useCallback(async (id: string) => {
    return execute(() => adminApiService.startStream(id))
  }, [execute])

  const stopStream = useCallback(async (id: string) => {
    return execute(() => adminApiService.stopStream(id))
  }, [execute])

  return {
    data,
    loading,
    error,
    createStream,
    updateStream,
    deleteStream,
    startStream,
    stopStream
  }
}

export function useStreamById() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchStream = useCallback((id: string) => {
    return execute(() => adminApiService.getStreamById(id))
  }, [execute])

  return { data, loading, error, fetchStream }
}

export function useLiveStatus() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchStatus = useCallback(() => {
    return execute(() => adminApiService.getLiveStatus())
  }, [execute])

  return { data, loading, error, fetchStatus }
}

export function useStreamSchedule() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchSchedule = useCallback(() => {
    return execute(() => adminApiService.getStreamSchedule())
  }, [execute])

  return { data, loading, error, fetchSchedule }
}

// Church Information hooks
export function useChurchInfo() {
  const { data, loading, error, execute } = useApiCall<any[]>()

  const fetchAllInfo = useCallback(() => {
    return execute(() => adminApiService.getAllChurchInfo())
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchAllInfo
  }
}

export function useChurchInfoOperations() {
  const { data, loading, error, execute } = useApiCall<any>()

  const createInfo = useCallback(async (churchData: any) => {
    return execute(() => adminApiService.createChurchInfo(churchData))
  }, [execute])

  const updateInfo = useCallback(async (id: string, churchData: any) => {
    return execute(() => adminApiService.updateChurchInfo(id, churchData))
  }, [execute])

  const deleteInfo = useCallback(async (id: string) => {
    return execute(() => adminApiService.deleteChurchInfo(id))
  }, [execute])

  return {
    data,
    loading,
    error,
    createInfo,
    updateInfo,
    deleteInfo
  }
}

export function useChurchInfoById() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchInfo = useCallback((id: string) => {
    return execute(() => adminApiService.getChurchInfoById(id))
  }, [execute])

  return { data, loading, error, fetchInfo }
}

export function useAboutInfo() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchAbout = useCallback(() => {
    return execute(() => adminApiService.getAboutInfo())
  }, [execute])

  return { data, loading, error, fetchAbout }
}

export function useContactInfo() {
  const { data, loading, error, execute } = useApiCall<any>()

  const fetchContact = useCallback(() => {
    return execute(() => adminApiService.getContactInfo())
  }, [execute])

  return { data, loading, error, fetchContact }
}
