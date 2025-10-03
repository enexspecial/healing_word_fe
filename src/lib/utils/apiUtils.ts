import { adminApiService } from '@/lib/services/adminApiService'

// Set the API token for authenticated requests
export const setApiToken = (token: string) => {
  adminApiService.setToken(token)
  
  // Also store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token)
  }
}

// Get the stored API token
export const getApiToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken')
  }
  return null
}

// Clear the API token
export const clearApiToken = () => {
  adminApiService.setToken('')
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken')
  }
}

// Initialize API token from storage
export const initializeApiToken = () => {
  const token = getApiToken()
  if (token) {
    adminApiService.setToken(token)
  }
}

// Handle API errors globally
export const handleApiError = (error: Error, router?: any) => {
  console.error('API Error:', error)
  
  if (error.message.includes('Authentication required') || error.message.includes('Authentication token not found')) {
    // Clear the token and redirect to login
    clearApiToken()
    if (router && typeof window !== 'undefined') {
      router.push('/admin/login')
    }
  }
}

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(dateString)
}

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number format
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Debounce function for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for API calls
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Pagination helper
export const getPaginationInfo = (
  currentPage: number,
  totalPages: number,
  totalItems: number,
  itemsPerPage: number
) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  return {
    startItem,
    endItem,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    pageNumbers: Array.from({ length: totalPages }, (_, i) => i + 1)
  }
}

// Error message formatter
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error) return error.error
  return 'An unexpected error occurred'
}

// Success message formatter
export const formatSuccessMessage = (message: string): string => {
  return message || 'Operation completed successfully'
}

// Confirm dialog helper
export const confirmAction = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.confirm) {
      resolve(window.confirm(message))
    } else {
      resolve(true) // Fallback for SSR
    }
  })
}

// File upload validation
export const validateFileUpload = (
  file: File,
  maxSize: number,
  allowedTypes: string[]
): { valid: boolean; error?: string } => {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${formatFileSize(maxSize)}`
    }
  }
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  if (fileExtension && !allowedTypes.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
  }
  
  return { valid: true }
}
