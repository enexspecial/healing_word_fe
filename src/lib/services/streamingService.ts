import { 
  Stream, 
  CreateStreamData, 
  UpdateStreamData, 
  LiveStatus,
  ApiResponse 
} from '@/types/api'

class StreamingService {
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

      const result = await response.json()
      
      // Backend returns ApiResponseDto.success(data, message) format
      if (result.success !== undefined) {
        return { 
          success: result.success, 
          data: result.data,
          message: result.message 
        }
      }
      
      // Fallback for direct data responses
      return { success: true, data: result }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed'
      }
    }
  }

  // Public endpoints (no auth required)
  async getLiveStatus(): Promise<ApiResponse<Stream | null>> {
    return this.makeRequest<Stream | null>('/api/streaming/status')
  }

  async getStreamSchedule(): Promise<ApiResponse<Stream[]>> {
    return this.makeRequest<Stream[]>('/api/streaming/schedule')
  }

  async getAllStreams(): Promise<ApiResponse<Stream[]>> {
    return this.makeRequest<Stream[]>('/api/streaming')
  }

  async getStreamById(id: string): Promise<ApiResponse<Stream>> {
    return this.makeRequest<Stream>(`/api/streaming/${id}`)
  }

  // Admin endpoints (auth required)
  async createStream(data: CreateStreamData): Promise<ApiResponse<Stream>> {
    return this.makeRequest<Stream>('/api/streaming', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateStream(id: string, data: UpdateStreamData): Promise<ApiResponse<Stream>> {
    return this.makeRequest<Stream>(`/api/streaming/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteStream(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/streaming/${id}`, {
      method: 'DELETE',
    })
  }

  async startStream(id: string): Promise<ApiResponse<Stream>> {
    return this.makeRequest<Stream>(`/api/streaming/${id}/start`, {
      method: 'POST',
    })
  }

  async stopStream(id: string): Promise<ApiResponse<Stream>> {
    return this.makeRequest<Stream>(`/api/streaming/${id}/stop`, {
      method: 'POST',
    })
  }

  // Utility methods
  async getUpcomingStreams(limit = 5): Promise<ApiResponse<Stream[]>> {
    const result = await this.getStreamSchedule()
    
    if (result.success && result.data) {
      const now = new Date()
      const upcoming = result.data
        .filter(stream => stream.isActive && new Date(stream.scheduledStartTime || '') > now)
        .slice(0, limit)
      
      return {
        success: true,
        data: upcoming
      }
    }
    
    return result
  }

  async getRecentStreams(limit = 5): Promise<ApiResponse<Stream[]>> {
    const result = await this.getAllStreams()
    
    if (result.success && result.data) {
      const recent = result.data
        .filter(stream => !stream.isLive)
        .sort((a, b) => new Date(b.actualStartTime || b.createdAt).getTime() - 
                       new Date(a.actualStartTime || a.createdAt).getTime())
        .slice(0, limit)
      
      return {
        success: true,
        data: recent
      }
    }
    
    return result
  }

  async getStreamStats(): Promise<ApiResponse<{
    total: number
    live: number
    scheduled: number
    completed: number
    platforms: Record<string, number>
  }>> {
    const result = await this.getAllStreams()
    
    if (!result.success || !result.data) {
      return result as any
    }

    const streams = result.data
    const live = streams.filter(s => s.isLive).length
    const scheduled = streams.filter(s => s.isActive && !s.isLive).length
    const completed = streams.filter(s => !s.isActive).length
    
    const platforms: Record<string, number> = {}
    streams.forEach(stream => {
      platforms[stream.platform] = (platforms[stream.platform] || 0) + 1
    })

    return {
      success: true,
      data: {
        total: streams.length,
        live,
        scheduled,
        completed,
        platforms
      }
    }
  }
}

export const streamingService = new StreamingService()
