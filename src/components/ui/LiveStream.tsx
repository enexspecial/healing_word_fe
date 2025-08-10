'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Users, Calendar } from 'lucide-react'

interface LiveStreamProps {
  streamUrl?: string
  platform?: 'youtube' | 'facebook' | 'vimeo' | 'custom'
  isLive?: boolean
  title?: string
  description?: string
  chatEnabled?: boolean
}

export default function LiveStream({
  streamUrl = '',
  platform = 'youtube',
  isLive = false,
  title = 'Sunday Service',
  description = 'Join us for our live Sunday worship service',
  chatEnabled = true
}: LiveStreamProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)

  useEffect(() => {
    // Simulate viewer count updates
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isLive])

  const getEmbedUrl = () => {
    if (!streamUrl) return ''
    
    switch (platform) {
      case 'youtube':
        // Convert YouTube URL to embed format
        const youtubeId = streamUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : streamUrl
      
      case 'facebook':
        // Convert Facebook Live URL to embed format
        return streamUrl.replace('/videos/', '/embed/')
      
      case 'vimeo':
        // Convert Vimeo URL to embed format
        const vimeoId = streamUrl.match(/vimeo\.com\/(\d+)/)?.[1]
        return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : streamUrl
      
      default:
        return streamUrl
    }
  }

  const toggleMute = () => setIsMuted(!isMuted)
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Live Status Banner */}
      {isLive && (
        <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold">LIVE NOW</span>
            <span className="text-sm">• {title}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{Math.max(0, viewerCount)} watching</span>
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      <div className="relative bg-black rounded-b-lg overflow-hidden">
        {streamUrl ? (
          <div className="relative aspect-video">
            <iframe
              src={getEmbedUrl()}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Stream not available</p>
              <p className="text-sm text-gray-400">Check back during service times</p>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Fullscreen"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stream Info */}
      <div className="bg-white p-6 rounded-lg mt-4 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Sundays at 9:00 AM & 11:00 AM</span>
          </div>
          {isLive && (
            <div className="flex items-center gap-1 text-red-600 font-semibold">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span>Live Now</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Section */}
      {chatEnabled && isLive && (
        <div className="bg-white p-6 rounded-lg mt-4 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Live Chat</h4>
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  J
                </div>
                <div>
                  <div className="font-semibold text-sm">John D.</div>
                  <div className="text-sm text-gray-600">Praise God! Great message today!</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  S
                </div>
                <div>
                  <div className="font-semibold text-sm">Sarah M.</div>
                  <div className="text-sm text-gray-600">Amen! The worship was beautiful</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 