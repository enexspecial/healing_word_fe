import {
  ApiResponse,
  PaginatedResponse,
  DashboardOverview,
  DashboardAnalytics,
  DashboardStats,
  ActivityItem,
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserStatusDto,
  AssignUserRoleDto,
  UserActivity,
  UserStats,
  Resource,
  CreateResourceDto,
  UpdateResourceDto,
  UpdateResourceStatusDto,
  BulkUploadResourceDto,
  ResourceStats,
  ResourcesOverview,
  File,
  FileStorageStats,
  FileAnalytics,
  SystemStatus,
  SystemConfig,
  SystemLog,
  PerformanceMetrics,
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  Stream,
  CreateStreamDto,
  UpdateStreamDto,
  StreamStatus,
  StreamSchedule,
  ChurchInfo,
  CreateChurchInfoDto,
  UpdateChurchInfoDto,
  ContactSubmission,
  ContactStats
} from '@/types/api'

class AdminApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001'
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  checkAuthStatus(): { isAuthenticated: boolean; message?: string } {
    if (!this.token) {
      return { 
        isAuthenticated: false, 
        message: 'No authentication token found. Please log in.' 
      }
    }
    return { isAuthenticated: true }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (!this.token) {
      throw new Error('Authentication token not found. Please log in again.')
    }
    
    // Validate token format (basic check)
    if (typeof this.token !== 'string' || this.token.trim().length === 0) {
      throw new Error('Invalid authentication token format.')
    }
    
    headers['Authorization'] = `Bearer ${this.token}`
    return headers
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Provide more specific error messages based on status codes
      let errorMessage = errorData.message
      if (!errorMessage) {
        switch (response.status) {
          case 401:
            errorMessage = 'Authentication required. Please log in again.'
            // Clear the invalid token
            this.token = null
            if (typeof window !== 'undefined') {
              localStorage.removeItem('adminToken')
              // Dispatch a custom event to notify the app about auth failure
              window.dispatchEvent(new CustomEvent('adminAuthFailed'))
            }
            break
          case 403:
            errorMessage = 'Access denied. You do not have permission to perform this action.'
            break
          case 404:
            errorMessage = 'Resource not found.'
            break
          case 500:
            errorMessage = 'Internal server error. Please try again later.'
            break
          default:
            errorMessage = `Request failed with status ${response.status}`
        }
      }
      
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    return data
  }

  // Dashboard API
  async getDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
    const response = await fetch(`${this.baseUrl}/api/admin/dashboard/overview`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<DashboardOverview>(response)
  }

  async getDashboardAnalytics(period: string = '7d', groupBy: string = 'day'): Promise<ApiResponse<DashboardAnalytics>> {
    const response = await fetch(`${this.baseUrl}/api/admin/dashboard/analytics?period=${period}&groupBy=${groupBy}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<DashboardAnalytics>(response)
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await fetch(`${this.baseUrl}/api/admin/dashboard/stats`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<DashboardStats>(response)
  }

  async getRecentActivity(limit: number = 10): Promise<ApiResponse<ActivityItem[]>> {
    const response = await fetch(`${this.baseUrl}/api/admin/dashboard/recent-activity?limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<ActivityItem[]>(response)
  }

  // User Management API
  async getUsers(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<User>>> {
    const response = await fetch(`${this.baseUrl}/api/admin/users?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<PaginatedResponse<User>>(response)
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<User>(response)
  }

  async createUser(userData: CreateUserDto): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/api/admin/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    })
    return this.handleResponse<User>(response)
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    })
    return this.handleResponse<User>(response)
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  async updateUserStatus(id: string, statusData: UpdateUserStatusDto): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(statusData),
    })
    return this.handleResponse<User>(response)
  }

  async assignUserRole(id: string, roleData: AssignUserRoleDto): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}/role`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(roleData),
    })
    return this.handleResponse<User>(response)
  }

  async getUserActivity(id: string): Promise<ApiResponse<UserActivity[]>> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/${id}/activity`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<UserActivity[]>(response)
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    const response = await fetch(`${this.baseUrl}/api/admin/users/stats/overview`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<UserStats>(response)
  }

  // Resource Management API
  async getResources(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Resource>>> {
    const response = await fetch(`${this.baseUrl}/api/admin/resources?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<PaginatedResponse<Resource>>(response)
  }

  async getResourceById(id: string): Promise<ApiResponse<Resource>> {
    const response = await fetch(`${this.baseUrl}/api/admin/resources/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<Resource>(response)
  }

  async createResource(resourceData: CreateResourceDto): Promise<ApiResponse<Resource>> {
    const response = await fetch(`${this.baseUrl}/api/admin/resources`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(resourceData),
    })
    return this.handleResponse<Resource>(response)
  }

  async updateResource(id: string, resourceData: UpdateResourceDto): Promise<ApiResponse<Resource>> {
    const response = await fetch(`${this.baseUrl}/api/admin/resources/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(resourceData),
    })
    return this.handleResponse<Resource>(response)
  }

  async deleteResource(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/admin/resources/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  async updateResourceStatus(id: string, statusData: UpdateResourceStatusDto): Promise<ApiResponse<Resource>> {
    const response = await fetch(`${this.baseUrl}/api/admin/resources/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(statusData),
    })
    return this.handleResponse<Resource>(response)
  }

  async bulkUploadResources(resourcesData: BulkUploadResourceDto[]): Promise<ApiResponse<Resource[]>> {
    const response = await fetch(`${this.baseUrl}/api/admin/resources/bulk-upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(resourcesData),
    })
    return this.handleResponse<Resource[]>(response)
  }

  async getResourceStats(id: string): Promise<ApiResponse<ResourceStats>> {
    const response = await fetch(`${this.baseUrl}/api/admin/resources/${id}/stats`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<ResourceStats>(response)
  }

  async getResourcesOverview(): Promise<ApiResponse<ResourcesOverview>> {
    const response = await fetch(`${this.baseUrl}/api/admin/resources/stats/overview`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<ResourcesOverview>(response)
  }

  // File Management API
  async getFiles(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<File>>> {
    const response = await fetch(`${this.baseUrl}/api/admin/files?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<PaginatedResponse<File>>(response)
  }

  async getFileById(id: string): Promise<ApiResponse<File>> {
    const response = await fetch(`${this.baseUrl}/api/admin/files/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<File>(response)
  }

  async deleteFile(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/admin/files/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  async getFileStorageStats(): Promise<ApiResponse<FileStorageStats>> {
    const response = await fetch(`${this.baseUrl}/api/admin/files/storage-stats`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<FileStorageStats>(response)
  }

  async optimizeFiles(): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/admin/files/optimize`, {
      method: 'POST',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  async backupFiles(): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/admin/files/backup`, {
      method: 'POST',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  async getFileAnalytics(id: string): Promise<ApiResponse<FileAnalytics>> {
    const response = await fetch(`${this.baseUrl}/api/admin/files/${id}/analytics`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<FileAnalytics>(response)
  }

  // System Management API
  async getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    const response = await fetch(`${this.baseUrl}/api/admin/system/status`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<SystemStatus>(response)
  }

  async getSystemConfig(): Promise<ApiResponse<SystemConfig>> {
    const response = await fetch(`${this.baseUrl}/api/admin/system/config`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<SystemConfig>(response)
  }

  async updateSystemConfig(configData: Partial<SystemConfig>): Promise<ApiResponse<SystemConfig>> {
    const response = await fetch(`${this.baseUrl}/api/admin/system/config`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(configData),
    })
    return this.handleResponse<SystemConfig>(response)
  }

  async getSystemLogs(level?: string, limit: number = 50): Promise<ApiResponse<SystemLog[]>> {
    const params = new URLSearchParams()
    if (level) params.append('level', level)
    params.append('limit', limit.toString())
    
    const response = await fetch(`${this.baseUrl}/api/admin/system/logs?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<SystemLog[]>(response)
  }

  async createSystemBackup(): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/admin/system/backup`, {
      method: 'POST',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  async restoreSystemBackup(backupPath: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/admin/system/restore`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ backupPath }),
    })
    return this.handleResponse<void>(response)
  }

  async getPerformanceMetrics(): Promise<ApiResponse<PerformanceMetrics>> {
    const response = await fetch(`${this.baseUrl}/api/admin/system/performance`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<PerformanceMetrics>(response)
  }

  // Categories Management API
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${this.baseUrl}/api/categories`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<Category[]>(response)
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await fetch(`${this.baseUrl}/api/categories/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<Category>(response)
  }

  async createCategory(categoryData: CreateCategoryDto): Promise<ApiResponse<Category>> {
    const response = await fetch(`${this.baseUrl}/api/categories`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(categoryData),
    })
    return this.handleResponse<Category>(response)
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<ApiResponse<Category>> {
    const response = await fetch(`${this.baseUrl}/api/categories/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(categoryData),
    })
    return this.handleResponse<Category>(response)
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  // Streaming Management API
  async getLiveStatus(): Promise<ApiResponse<StreamStatus>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/status`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<StreamStatus>(response)
  }

  async getStreamSchedule(): Promise<ApiResponse<StreamSchedule>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/schedule`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<StreamSchedule>(response)
  }

  async getStreams(): Promise<ApiResponse<Stream[]>> {
    const response = await fetch(`${this.baseUrl}/api/streaming`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<Stream[]>(response)
  }

  async getStreamById(id: string): Promise<ApiResponse<Stream>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<Stream>(response)
  }

  async createStream(streamData: CreateStreamDto): Promise<ApiResponse<Stream>> {
    const response = await fetch(`${this.baseUrl}/api/streaming`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(streamData),
    })
    return this.handleResponse<Stream>(response)
  }

  async updateStream(id: string, streamData: UpdateStreamDto): Promise<ApiResponse<Stream>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(streamData),
    })
    return this.handleResponse<Stream>(response)
  }

  async deleteStream(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  async startStream(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/${id}/start`, {
      method: 'POST',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  async stopStream(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/${id}/stop`, {
      method: 'POST',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  // Church Information API
  async getAboutInfo(): Promise<ApiResponse<ChurchInfo>> {
    const response = await fetch(`${this.baseUrl}/api/church/about`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<ChurchInfo>(response)
  }

  async getContactInfo(): Promise<ApiResponse<ChurchInfo>> {
    const response = await fetch(`${this.baseUrl}/api/church/contact`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<ChurchInfo>(response)
  }

  async getAllChurchInfo(): Promise<ApiResponse<ChurchInfo[]>> {
    const response = await fetch(`${this.baseUrl}/api/church`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<ChurchInfo[]>(response)
  }

  async getChurchInfoById(id: string): Promise<ApiResponse<ChurchInfo>> {
    const response = await fetch(`${this.baseUrl}/api/church/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<ChurchInfo>(response)
  }

  async createChurchInfo(churchData: CreateChurchInfoDto): Promise<ApiResponse<ChurchInfo>> {
    const response = await fetch(`${this.baseUrl}/api/church`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(churchData),
    })
    return this.handleResponse<ChurchInfo>(response)
  }

  async updateChurchInfo(id: string, churchData: UpdateChurchInfoDto): Promise<ApiResponse<ChurchInfo>> {
    const response = await fetch(`${this.baseUrl}/api/church/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(churchData),
    })
    return this.handleResponse<ChurchInfo>(response)
  }

  async deleteChurchInfo(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/church/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    return this.handleResponse<void>(response)
  }

  // Departments API
  async getAllDepartments(): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${this.baseUrl}/api/departments`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<any[]>(response)
  }

  async getDepartmentById(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/api/departments/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<any>(response)
  }

  async createDepartment(data: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/api/departments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    
    return this.handleResponse<any>(response)
  }

  async updateDepartment(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/api/departments/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    
    return this.handleResponse<any>(response)
  }

  async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/departments/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<void>(response)
  }

  // Reports API
  async getAllReports(): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${this.baseUrl}/api/reports?t=${Date.now()}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<any[]>(response)
  }

  async getReportById(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/api/reports/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<any>(response)
  }

  async getReportStats(): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/api/reports/stats`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<any>(response)
  }

  async createReport(data: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/api/reports`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    
    return this.handleResponse<any>(response)
  }

  async updateReport(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/api/reports/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    
    return this.handleResponse<any>(response)
  }

  async deleteReport(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/api/reports/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<void>(response)
  }

  // User Search API for Department Head Selection
  async searchUsers(query: string, limit: number = 10): Promise<ApiResponse<any[]>> {
    const url = `${this.baseUrl}/api/admin/users?search=${encodeURIComponent(query)}&limit=${limit}&isActive=true`
    console.log('Searching users with URL:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    
    console.log('User search response status:', response.status)
    
    const result = await this.handleResponse<any>(response)
    console.log('User search result:', result)
    
    // Handle the paginated response structure
    if (result.success && result.data) {
      const actualData = result.data.users || result.data
      console.log('Actual user data:', actualData)
      return {
        success: true,
        data: Array.isArray(actualData) ? actualData : [],
        message: result.message
      }
    }
    
    return result
  }

  async approveReport(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/api/reports/${id}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<any>(response)
  }

  async rejectReport(id: string, rejectionReason: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/api/reports/${id}/reject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ rejectionReason }),
    })
    
    return this.handleResponse<any>(response)
  }

  // ==================== Contact Submissions API ====================

  /**
   * Get all contact submissions with optional filters
   */
  async getAllContactSubmissions(query?: {
    status?: 'new' | 'read' | 'in_progress' | 'resolved' | 'archived'
    search?: string
  }): Promise<ApiResponse<ContactSubmission[]>> {
    const params = new URLSearchParams()
    if (query?.status) params.append('status', query.status)
    if (query?.search) params.append('search', query.search)

    const response = await fetch(
      `${this.baseUrl}/api/contact?${params.toString()}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    )

    return this.handleResponse<ContactSubmission[]>(response)
  }

  /**
   * Get contact submission statistics
   */
  async getContactStatistics(): Promise<ApiResponse<ContactStats>> {
    const response = await fetch(`${this.baseUrl}/api/contact/statistics`, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    return this.handleResponse<ContactStats>(response)
  }

  /**
   * Get single contact submission by ID
   */
  async getContactSubmission(id: string): Promise<ApiResponse<ContactSubmission>> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })

    return this.handleResponse<ContactSubmission>(response)
  }

  /**
   * Update contact submission
   */
  async updateContactSubmission(
    id: string,
    data: {
      status?: 'new' | 'read' | 'in_progress' | 'resolved' | 'archived'
      notes?: string
      respondedBy?: string
    }
  ): Promise<ApiResponse<ContactSubmission>> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })

    return this.handleResponse<ContactSubmission>(response)
  }

  /**
   * Delete contact submission
   */
  async deleteContactSubmission(id: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${this.baseUrl}/api/contact/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    return this.handleResponse<null>(response)
  }
}

export const adminApiService = new AdminApiService()
