import { ApiResponse, PaginatedResponse, Resource, Category } from '@/types/api'

// Add Stream type interface
export interface Stream {
  id: string
  title: string
  platform: 'youtube' | 'facebook' | 'vimeo' | 'custom'
  streamUrl?: string
  embedCode?: string
  isLive: boolean
  scheduledStartTime?: string
  scheduledEndTime?: string
  actualStartTime?: string
  actualEndTime?: string
  description?: string
  isActive: boolean
  thumbnailUrl?: string
  chatEnabled?: boolean
  viewerCount?: number
  createdAt: string
  updatedAt: string
}

class PublicApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `HTTP error! status: ${response.status}`,
        message: errorData.message || `HTTP error! status: ${response.status}`
      }
    }

    try {
      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse response',
        message: 'Failed to parse response'
      }
    }
  }

  // Public Resources API
  async getResources(query: {
    page?: number
    limit?: number
    search?: string
    type?: string
    categoryId?: string
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
  } = {}): Promise<ApiResponse<PaginatedResponse<Resource>>> {
    const params = new URLSearchParams()
    
    if (query.page) params.append('page', query.page.toString())
    if (query.limit) params.append('limit', query.limit.toString())
    if (query.search) params.append('search', query.search)
    if (query.type) params.append('type', query.type)
    if (query.categoryId) params.append('categoryId', query.categoryId)
    if (query.sortBy) params.append('sortBy', query.sortBy)
    if (query.sortOrder) params.append('sortOrder', query.sortOrder)

    const response = await fetch(`${this.baseUrl}/api/resources?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<PaginatedResponse<Resource>>(response)
  }

  async getPopularResources(limit: number = 10): Promise<ApiResponse<Resource[]>> {
    const response = await fetch(`${this.baseUrl}/api/resources/popular?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<Resource[]>(response)
  }

  async getNewResources(limit: number = 10): Promise<ApiResponse<Resource[]>> {
    const response = await fetch(`${this.baseUrl}/api/resources/new?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<Resource[]>(response)
  }

  async getResourceById(id: string): Promise<ApiResponse<Resource>> {
    const response = await fetch(`${this.baseUrl}/api/resources/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<Resource>(response)
  }

  // Public Categories API
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${this.baseUrl}/api/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<Category[]>(response)
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await fetch(`${this.baseUrl}/api/categories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<Category>(response)
  }

  // Public Streaming API
  async getLiveStatus(): Promise<ApiResponse<Stream | null>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<Stream | null>(response)
  }

  async getStreamSchedule(): Promise<ApiResponse<Stream[]>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/schedule`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<Stream[]>(response)
  }

  async getAllStreams(): Promise<ApiResponse<Stream[]>> {
    const response = await fetch(`${this.baseUrl}/api/streaming`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<Stream[]>(response)
  }

  async getStreamById(id: string): Promise<ApiResponse<Stream>> {
    const response = await fetch(`${this.baseUrl}/api/streaming/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<Stream>(response)
  }
}

export const publicApiService = new PublicApiService()
