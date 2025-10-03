import { 
  FindAllUsersOptions, 
  FindAllUsersResult, 
  User, 
  UpdateUserData, 
  ApiResponse 
} from '@/types/api'

class UserService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Request failed with status ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed'
      }
    }
  }

  async getAllUsers(options: FindAllUsersOptions = {}): Promise<ApiResponse<FindAllUsersResult>> {
    const queryParams = new URLSearchParams()
    
    if (options.page) queryParams.append('page', options.page.toString())
    if (options.limit) queryParams.append('limit', options.limit.toString())
    if (options.search) queryParams.append('search', options.search)
    if (options.role) queryParams.append('role', options.role)
    if (options.isActive !== undefined) queryParams.append('isActive', options.isActive.toString())
    if (options.sortBy) queryParams.append('sortBy', options.sortBy)
    if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder)
    if (options.includeRelations !== undefined) queryParams.append('includeRelations', options.includeRelations.toString())

    const queryString = queryParams.toString()
    const endpoint = `/auth/users${queryString ? `?${queryString}` : ''}`

    return this.makeRequest<FindAllUsersResult>(endpoint)
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/auth/users/${id}`)
  }

  async updateUser(id: string, updateData: UpdateUserData): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/auth/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  }

  async deactivateUser(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>(`/auth/users/${id}/deactivate`, {
      method: 'PUT',
    })
  }

  async searchUsers(searchTerm: string, limit = 10): Promise<ApiResponse<User[]>> {
    const result = await this.getAllUsers({
      search: searchTerm,
      limit,
      isActive: true,
    })

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.users
      }
    }

    return {
      success: false,
      error: result.error || 'Failed to search users'
    }
  }

  async getUsersByRole(role: string): Promise<ApiResponse<User[]>> {
    const result = await this.getAllUsers({
      role,
      isActive: true,
      limit: 1000, // Get all users with this role
    })

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.users
      }
    }

    return {
      success: false,
      error: result.error || 'Failed to fetch users by role'
    }
  }

  async getUserStats(): Promise<ApiResponse<{
    total: number
    active: number
    inactive: number
    byRole: Record<string, number>
    recentRegistrations: number
  }>> {
    // This would need to be implemented in the backend
    // For now, we'll calculate from getAllUsers
    const allUsersResult = await this.getAllUsers({ limit: 1000 })
    
    if (!allUsersResult.success || !allUsersResult.data) {
      return allUsersResult as any
    }

    const users = allUsersResult.data.users
    const active = users.filter(u => u.isActive).length
    const inactive = users.length - active
    
    const byRole: Record<string, number> = {}
    users.forEach(user => {
      const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles]
      userRoles.forEach(role => {
        byRole[role] = (byRole[role] || 0) + 1
      })
    })

    // Calculate recent registrations (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentRegistrations = users.filter(user => 
      new Date(user.createdAt) > thirtyDaysAgo
    ).length

    return {
      success: true,
      data: {
        total: users.length,
        active,
        inactive,
        byRole,
        recentRegistrations
      }
    }
  }
}

export const userService = new UserService()
