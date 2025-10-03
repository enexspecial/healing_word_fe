'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  Users,
  BarChart3,
  Video,
  Youtube,
  Facebook,
  Instagram,
  Monitor,
  RefreshCw,
  X
} from 'lucide-react'
import { useStreaming } from '@/lib/hooks/useStreaming'
import { Stream, CreateStreamData, StreamingPlatform } from '@/types/api'

const platforms = Object.values(StreamingPlatform)
const platformLabels = {
  [StreamingPlatform.YOUTUBE]: 'YouTube',
  [StreamingPlatform.FACEBOOK]: 'Facebook', 
  [StreamingPlatform.VIMEO]: 'Vimeo',
  [StreamingPlatform.ZOOM]: 'Zoom',
  [StreamingPlatform.CUSTOM]: 'Custom'
}

export default function StreamingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // API hook
  const { 
    loading, 
    error, 
    getAllStreams, 
    getLiveStatus, 
    createStream, 
    updateStream, 
    deleteStream, 
    startStream, 
    stopStream,
    clearError 
  } = useStreaming()

  // State for streams data
  const [streams, setStreams] = useState<Stream[]>([])
  const [currentLiveStream, setCurrentLiveStream] = useState<Stream | null>(null)

  // Filter streams based on search and filters
  const filteredStreams = streams.filter((stream: Stream) => {
    const matchesSearch = stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (stream.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'All' || stream.platform === selectedPlatform
    const matchesStatus = selectedStatus === 'All' || 
                         (selectedStatus === 'live' && stream.isLive) ||
                         (selectedStatus === 'scheduled' && !stream.isLive && stream.isActive) ||
                         (selectedStatus === 'ended' && !stream.isLive && !stream.isActive)
    
    return matchesSearch && matchesPlatform && matchesStatus
  })

  // Form state for new stream
  const [formData, setFormData] = useState<CreateStreamData>({
    title: '',
    description: '',
    platform: StreamingPlatform.YOUTUBE,
    streamUrl: '',
    scheduledStartTime: '',
    isActive: true,
    isLive: false
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [streamsData, liveStatusData] = await Promise.all([
        getAllStreams(),
        getLiveStatus()
      ])
      
      setStreams(streamsData)
      setCurrentLiveStream(liveStatusData)
    } catch (error) {
      console.error('Failed to load streaming data:', error)
    }
  }

  const handleInputChange = (field: keyof CreateStreamData, value: string | boolean | StreamingPlatform) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createStream(formData)
      if (result) {
        alert('Stream created successfully!')
        setShowAddModal(false)
        resetForm()
        loadData() // Refresh the streams list
      } else {
        alert('Failed to create stream: ' + error)
      }
    } catch (error) {
      console.error('Error creating stream:', error)
      alert('An error occurred while creating the stream')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      platform: StreamingPlatform.YOUTUBE,
      streamUrl: '',
      scheduledStartTime: '',
      isActive: true,
      isLive: false
    })
  }

  const closeModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  const handleStartStream = async (id: string) => {
    try {
      const result = await startStream(id)
      if (result) {
        alert('Stream started successfully!')
        loadData()
      } else {
        alert('Failed to start stream: ' + error)
      }
    } catch (error) {
      console.error('Error starting stream:', error)
      alert('An error occurred while starting the stream')
    }
  }

  const handleStopStream = async (id: string) => {
    try {
      const result = await stopStream(id)
      if (result) {
        alert('Stream stopped successfully!')
        loadData()
      } else {
        alert('Failed to stop stream: ' + error)
      }
    } catch (error) {
      console.error('Error stopping stream:', error)
      alert('An error occurred while stopping the stream')
    }
  }

  const handleDeleteStream = async (id: string) => {
    if (confirm('Are you sure you want to delete this stream?')) {
      try {
        const result = await deleteStream(id)
        if (result) {
          alert('Stream deleted successfully!')
          loadData()
        } else {
          alert('Failed to delete stream: ' + error)
        }
      } catch (error) {
        console.error('Error deleting stream:', error)
        alert('An error occurred while deleting the stream')
      }
    }
  }

  const getPlatformIcon = (platform: StreamingPlatform) => {
    switch (platform) {
      case StreamingPlatform.YOUTUBE:
        return <Youtube className="h-5 w-5 text-red-500" />
      case StreamingPlatform.FACEBOOK:
        return <Facebook className="h-5 w-5 text-blue-600" />
      case StreamingPlatform.VIMEO:
        return <Video className="h-5 w-5 text-blue-500" />
      case StreamingPlatform.ZOOM:
        return <Video className="h-5 w-5 text-blue-700" />
      case StreamingPlatform.CUSTOM:
        return <Monitor className="h-5 w-5 text-gray-500" />
      default:
        return <Video className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (stream: Stream) => {
    if (stream.isLive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Live
        </span>
      )
    } else if (stream.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Scheduled
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Ended
        </span>
      )
    }
  }

  const getStatusIcon = (stream: Stream) => {
    if (stream.isLive) {
      return <Play className="h-4 w-4 text-red-500" />
    } else if (stream.isActive) {
      return <Clock className="h-4 w-4 text-blue-500" />
    } else {
      return <Square className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Streaming Management</h1>
          <p className="text-gray-600">Manage live streams, schedules, and platform integrations.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button 
            onClick={loadData}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Stream
          </button>
        </div>
      </div>

      {/* Current Live Stream */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Live Stream</h3>
        {currentLiveStream ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-red-900">{currentLiveStream?.title}</h4>
                  <p className="text-red-700">Live on {currentLiveStream ? platformLabels[currentLiveStream.platform as keyof typeof platformLabels] : ''} • 0 viewers</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => currentLiveStream && handleStopStream(currentLiveStream.id)}
                  disabled={loading}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  <Square className="h-4 w-4 mr-1 inline" />
                  End
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Video className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No live streams currently running</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Start a stream
            </button>
          </div>
        )}
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search streams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by platform"
              title="Filter by platform"
            >
              <option value="All">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platformLabels[platform as keyof typeof platformLabels]}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
              title="Filter by status"
            >
              <option value="All">All Status</option>
              <option value="live">Live</option>
              <option value="scheduled">Scheduled</option>
              <option value="ended">Ended</option>
            </select>
          </div>
        </div>
        
        {/* Loading/error state */}
        {loading && (
          <div className="mt-3 text-sm text-blue-600">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
              Loading streams...
            </div>
          </div>
        )}
        {!loading && error && (
          <div className="mt-3 text-sm text-red-600">
            Error loading streams: {error}
          </div>
        )}
        {!loading && !error && streams.length === 0 && (
          <div className="mt-3 text-sm text-yellow-600">
            No streams found. Create your first stream to get started.
          </div>
        )}
      </div>

      {/* Streams table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              All Streams ({filteredStreams.length})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>Total Streams: {streams.length}</span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading streams...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading streams: {error}</p>
            </div>
          ) : filteredStreams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No streams found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stream
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStreams.map((stream: Stream) => (
                    <tr key={stream.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              {getPlatformIcon(stream.platform)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{stream.title}</div>
                            <div className="text-sm text-gray-500">{stream.description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPlatformIcon(stream.platform)}
                          <span className="ml-2 text-sm text-gray-900">{platformLabels[stream.platform as keyof typeof platformLabels]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(stream)}
                          <span className="ml-2">{getStatusBadge(stream)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {stream.scheduledStartTime ? formatDateTime(stream.scheduledStartTime) : 'Not scheduled'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900" title="View Stream">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900" title="Edit Stream">
                            <Edit className="h-4 w-4" />
                          </button>
                          {stream.isLive ? (
                            <button 
                              onClick={() => handleStopStream(stream.id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50" 
                              title="Stop Stream"
                            >
                              <Square className="h-4 w-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStartStream(stream.id)}
                              disabled={loading}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50" 
                              title="Start Stream"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteStream(stream.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50" 
                            title="Delete Stream"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600" title="Settings">
                            <Settings className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Stream Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Schedule New Stream</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Stream Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter stream title"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter stream description"
                  rows={3}
                />
              </div>

              {/* Platform and URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                    Platform *
                  </label>
                  <select
                    id="platform"
                    required
                    value={formData.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>
                        {platformLabels[platform as keyof typeof platformLabels]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="streamUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Stream URL *
                  </label>
                  <input
                    type="url"
                    id="streamUrl"
                    required
                    value={formData.streamUrl}
                    onChange={(e) => handleInputChange('streamUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter stream URL"
                  />
                </div>
              </div>

              {/* Scheduled Start Time */}
              <div>
                <label htmlFor="scheduledStartTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Start Time *
                </label>
                <input
                  type="datetime-local"
                  id="scheduledStartTime"
                  required
                  value={formData.scheduledStartTime}
                  onChange={(e) => handleInputChange('scheduledStartTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active Stream</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Stream
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
