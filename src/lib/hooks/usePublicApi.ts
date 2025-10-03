import { useState, useEffect, useCallback } from 'react'
import { publicApiService } from '@/lib/services/publicApiService'
import { ApiResponse, PaginatedResponse, Resource, Category } from '@/types/api'

// Custom hook for managing API call state
function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall()
      if (response.success && response.data) {
        setData(response.data)
        return response
      } else {
        setError(response.error || 'An error occurred')
        return response
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, execute }
}

// Hook for fetching resources with pagination and filtering
export function useResources() {
  const { data, loading, error, execute } = useApiCall<PaginatedResponse<Resource>>()

  const fetchResources = useCallback((query: {
    page?: number
    limit?: number
    search?: string
    type?: string
    categoryId?: string
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
  } = {}) => {
    return execute(() => publicApiService.getResources(query))
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchResources
  }
}

// Hook for fetching popular resources
export function usePopularResources() {
  const { data, loading, error, execute } = useApiCall<Resource[]>()

  const fetchPopularResources = useCallback((limit: number = 10) => {
    return execute(() => publicApiService.getPopularResources(limit))
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchPopularResources
  }
}

// Hook for fetching new resources
export function useNewResources() {
  const { data, loading, error, execute } = useApiCall<Resource[]>()

  const fetchNewResources = useCallback((limit: number = 10) => {
    return execute(() => publicApiService.getNewResources(limit))
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchNewResources
  }
}

// Hook for fetching a single resource
export function useResource() {
  const { data, loading, error, execute } = useApiCall<Resource>()

  const fetchResource = useCallback((id: string) => {
    return execute(() => publicApiService.getResourceById(id))
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchResource
  }
}

// Hook for fetching categories
export function useCategories() {
  const { data, loading, error, execute } = useApiCall<Category[]>()

  const fetchCategories = useCallback(() => {
    return execute(() => publicApiService.getCategories())
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchCategories
  }
}

// Hook for fetching a single category
export function useCategory() {
  const { data, loading, error, execute } = useApiCall<Category>()

  const fetchCategory = useCallback((id: string) => {
    return execute(() => publicApiService.getCategoryById(id))
  }, [execute])

  return {
    data,
    loading,
    error,
    fetchCategory
  }
}
