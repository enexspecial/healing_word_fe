import { useState, useCallback } from 'react'
import { streamingService } from '../services/streamingService'
import { 
  Stream, 
  CreateStreamData, 
  UpdateStreamData,
  LiveStatus 
} from '@/types/api'

export const useStreaming = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Get all streams
  const getAllStreams = useCallback(async (): Promise<Stream[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.getAllStreams()
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch streams')
        return []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch streams'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Get live status
  const getLiveStatus = useCallback(async (): Promise<Stream | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.getLiveStatus()
      
      if (result.success) {
        return result.data || null
      } else {
        setError(result.error || 'Failed to fetch live status')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch live status'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Get stream schedule
  const getStreamSchedule = useCallback(async (): Promise<Stream[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.getStreamSchedule()
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch schedule')
        return []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch schedule'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Get single stream
  const getStreamById = useCallback(async (id: string): Promise<Stream | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.getStreamById(id)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch stream')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stream'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Create stream
  const createStream = useCallback(async (data: CreateStreamData): Promise<Stream | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.createStream(data)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to create stream')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create stream'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Update stream
  const updateStream = useCallback(async (id: string, data: UpdateStreamData): Promise<Stream | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.updateStream(id, data)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to update stream')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update stream'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete stream
  const deleteStream = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.deleteStream(id)
      
      if (result.success) {
        return true
      } else {
        setError(result.error || 'Failed to delete stream')
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete stream'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Start stream
  const startStream = useCallback(async (id: string): Promise<Stream | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.startStream(id)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to start stream')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start stream'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Stop stream
  const stopStream = useCallback(async (id: string): Promise<Stream | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.stopStream(id)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to stop stream')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop stream'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Get upcoming streams
  const getUpcomingStreams = useCallback(async (limit = 5): Promise<Stream[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.getUpcomingStreams(limit)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch upcoming streams')
        return []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch upcoming streams'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Get recent streams
  const getRecentStreams = useCallback(async (limit = 5): Promise<Stream[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.getRecentStreams(limit)
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch recent streams')
        return []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recent streams'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Get stream statistics
  const getStreamStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await streamingService.getStreamStats()
      
      if (result.success && result.data) {
        return result.data
      } else {
        setError(result.error || 'Failed to fetch stream statistics')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stream statistics'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    clearError,
    getAllStreams,
    getLiveStatus,
    getStreamSchedule,
    getStreamById,
    createStream,
    updateStream,
    deleteStream,
    startStream,
    stopStream,
    getUpcomingStreams,
    getRecentStreams,
    getStreamStats
  }
}
