'use client'

import { useState, useEffect } from 'react'
import LiveStream from '@/components/ui/LiveStream'
import { Calendar, Clock, Users, Video, Play, Loader2, Eye, Globe } from 'lucide-react'
import { streamingService } from '@/lib/services/streamingService'
import { analyticsService, RealTimeStats } from '@/lib/services/analyticsService'
import { Stream } from '@/types/api'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { generateBreadcrumbStructuredData } from '@/lib/breadcrumb-utils'

export default function LiveClient() {
  const breadcrumbItems = [{ label: 'Live Services' }]
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbItems)
  
  const [liveStream, setLiveStream] = useState<Stream | null>(null)
  const [schedule, setSchedule] = useState<Stream[]>([])
  const [recentStreams, setRecentStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [liveData, scheduleData, recentData, realTimeData] = await Promise.all([
          streamingService.getLiveStatus(),
          streamingService.getStreamSchedule(),
          streamingService.getAllStreams(),
          analyticsService.getRealTimeStats().catch(() => null) // Don't fail if analytics fails
        ])
        
        if (liveData.success && liveData.data) {
          setLiveStream(liveData.data)
        }
        
        if (scheduleData.success && scheduleData.data) {
          setSchedule(scheduleData.data)
        }
        
        if (recentData.success && recentData.data) {
          // Filter for recent completed streams
          const recent = recentData.data
            .filter(stream => !stream.isLive)
            .sort((a, b) => new Date(b.actualStartTime || b.createdAt).getTime() - 
                           new Date(a.actualStartTime || a.createdAt).getTime())
            .slice(0, 5)
          setRecentStreams(recent)
        }

        if (realTimeData) {
          setRealTimeStats(realTimeData)
        }
      } catch (err) {
        console.error('Error fetching streaming data:', err)
        setError('Failed to load streaming information. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time updates for live stats
    const interval = setInterval(async () => {
      try {
        const stats = await analyticsService.getRealTimeStats()
        setRealTimeStats(stats)
      } catch (error) {
        console.error('Failed to update real-time stats:', error)
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const isLive = (stream: Stream) => {
    if (!stream.scheduledStartTime || !stream.scheduledEndTime) return false
    const now = new Date()
    const startTime = new Date(stream.scheduledStartTime)
    const endTime = new Date(stream.scheduledEndTime)
    return now >= startTime && now <= endTime
  }

  const isUpcoming = (stream: Stream) => {
    if (!stream.scheduledStartTime) return false
    const now = new Date()
    const startTime = new Date(stream.scheduledStartTime)
    return startTime > now
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Live Services
          </h1>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            Join us for live church services, worship, and Bible study online. Experience the power of community and faith from anywhere.
          </p>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              <span className="ml-2 text-gray-600">Loading live services...</span>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Live Stream */}
      {!loading && !error && liveStream && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  LIVE NOW
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {liveStream.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {liveStream.description}
                </p>
                
                {/* Real-time Stats */}
                {realTimeStats && (
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                      <Eye className="w-4 h-4" />
                      <span className="font-semibold">{realTimeStats.liveViewers}</span>
                      <span className="text-sm">watching now</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold">{realTimeStats.hourlyVisitors}</span>
                      <span className="text-sm">visitors this hour</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg">
                      <Globe className="w-4 h-4" />
                      <span className="font-semibold">{realTimeStats.currentPageViews}</span>
                      <span className="text-sm">page views (5min)</span>
                    </div>
                  </div>
                )}
              </div>
              
              <LiveStream 
                streamUrl={liveStream.streamUrl}
                platform={liveStream.platform as 'youtube' | 'facebook' | 'vimeo' | 'custom'}
                isLive={liveStream.isLive}
                title={liveStream.title}
                description={liveStream.description}
                chatEnabled={liveStream.chatEnabled}
                viewerCount={realTimeStats?.liveViewers || 0}
              />
            </div>
          </div>
        </section>
      )}

      {/* No Live Stream */}
      {!loading && !error && !liveStream && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Live Stream Currently
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're not currently live, but check out our upcoming services and recent recordings below.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Services */}
      {!loading && !error && schedule.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Upcoming Services
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {schedule.map((stream) => (
                  <div key={stream.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {stream.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {stream.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(stream.scheduledStartTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Play className="w-4 h-4" />
                            {formatTime(stream.scheduledStartTime)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Streams */}
      {!loading && !error && recentStreams.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Recent Services
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentStreams.map((stream) => (
                  <div key={stream.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {stream.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {stream.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDate(stream.scheduledStartTime)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Service Times */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Regular Service Times
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sunday Services</h3>
                <p className="text-gray-600">9:00 AM & 11:00 AM</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bible Study</h3>
                <p className="text-gray-600">Wednesday 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
