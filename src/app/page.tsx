'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, Calendar, MapPin, Phone, Mail, Cross, BookOpen, Music, Loader2 } from 'lucide-react'
import { publicApiService, Stream } from '@/lib/services/publicApiService'
import { generateStructuredData } from '@/lib/seo'

interface ChurchInfo {
  id: string
  name: string
  address: string
  phone: string
  email: string
  serviceTimes: string
  description: string
}

interface ResourceCounts {
  devotionals: number
  bibleStudies: number
  sermonTranscripts: number
}

export default function HomePage() {
  const [liveStream, setLiveStream] = useState<Stream | null>(null)
  const [churchInfo, setChurchInfo] = useState<ChurchInfo | null>(null)
  const [resourceCounts, setResourceCounts] = useState<ResourceCounts>({
    devotionals: 0,
    bibleStudies: 0,
    sermonTranscripts: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch live status, church info, and resources in parallel
        const [liveResponse, resourcesResponse] = await Promise.all([
          publicApiService.getLiveStatus(),
          publicApiService.getResources({ limit: 100 }) // Remove type filter to get all resources
        ])

        if (liveResponse.success && liveResponse.data) {
          setLiveStream(liveResponse.data)
        }

        if (resourcesResponse.success && resourcesResponse.data) {
          const resources = resourcesResponse.data.data || []
          
          // Count resources by type using the correct enum values
          const counts = {
            devotionals: resources.filter(r => r.type === 'devotional').length,
            bibleStudies: resources.filter(r => r.type === 'bible_study').length,
            sermonTranscripts: resources.filter(r => r.type === 'sermon_transcript').length
          }
          
          setResourceCounts(counts)
        }

        // Set default church info (you can later fetch this from a church info API)
        setChurchInfo(        {
          id: '1',
          name: 'Healing Word Christian Church Inc.',
          address: '6 Bella Crescent Behind Peridot Filling Station After Oba\'s Palace Iyana Ejigbo Lagos, Nigeria',
          phone: '+2348144093507',
          email: 'info@healing-word-church.org',
          serviceTimes: '9:00 AM & 11:00 AM',
          description: 'A place of hope, healing, and community where everyone belongs.'
        })

      } catch (err) {
        setError('Failed to load page data')
        console.error('Error fetching page data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Generate structured data for events
  const eventStructuredData = liveStream ? generateStructuredData('event', {
    title: liveStream.title || 'Sunday Service',
    description: liveStream.description || 'Join us for our weekly worship service',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  }) : null

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      {eventStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventStructuredData)
          }}
        />
      )}
      
      {/* Hero Section with Logo */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container-custom section-padding">
          <div className="text-center max-w-6xl mx-auto">
            {/* Church Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <Image
                  src="/images/logo.png"
                  alt="Healing Word Christian Church Inc. - A Place of Hope, Healing and Community"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to{' '}
              <span className="text-yellow-300">Healing Word</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100 animate-slide-up">
              Christian Church Inc.
            </p>
            <p className="text-lg md:text-xl mb-8 text-blue-200 animate-slide-up max-w-3xl mx-auto">
              {churchInfo?.description || 'A place of hope, healing, and community where everyone belongs. Join us as we grow in faith, love, and service to God and our community.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/live" className="btn-secondary text-lg px-8 py-3">
                {liveStream?.isLive ? 'Watch Live Now' : 'Watch Live'}
              </Link>
              <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-blue-700 text-lg px-8 py-3">
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times Banner */}
      <section className="bg-yellow-500 text-blue-900 py-8">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us This Sunday</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3">
                <Calendar className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Sunday Worship</div>
                  <div className="text-sm">{churchInfo?.serviceTimes || '9:00 AM & 12:00 PM'}</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Location</div>
                  <div className="text-sm">{churchInfo?.address || '6 Bella Crescent Behind Peridot Filling Station After Oba\'s Palace Iyana Ejigbo Lagos, Nigeria'}</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Phone className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Contact</div>
                  <div className="text-sm">{churchInfo?.phone || '+2348144093507'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the ministries and services that make our church a vibrant community of faith
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-600">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Cross className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Worship Services
              </h3>
              <p className="text-gray-600 text-center">
                Join us every Sunday for inspiring worship, powerful messages from God's Word, and meaningful fellowship with our church family.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-yellow-500">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Bible Study
              </h3>
              <p className="text-gray-600 text-center">
                Deepen your faith through our various Bible studies, small groups, and discipleship programs for all ages.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Music className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Music Ministry
              </h3>
              <p className="text-gray-600 text-center">
                Experience the power of worship through our choir, praise team, and special music programs that glorify God.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Ministries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get involved in our various ministries and discover how you can serve and grow in our church family
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Youth Ministry</h3>
              <p className="text-gray-600 text-sm">Engaging programs for teens and young adults</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
              <Heart className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Children's Church</h3>
              <p className="text-gray-600 text-sm">Nurturing faith in our youngest members</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Benevolence</h3>
              <p className="text-gray-600 text-sm">Serving our community with love and compassion</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prayer Team</h3>
              <p className="text-gray-600 text-sm">Dedicated prayer warriors for our church</p>
            </div>
          </div>
        </div>
      </section>

      {/* E-books Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Free Spiritual Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Download free E-books, devotionals, Bible studies, and sermon transcripts to deepen your faith journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Devotionals</h3>
              <p className="text-gray-600 mb-4">
                Daily devotionals to strengthen your faith and deepen your relationship with God
              </p>
              <div className="text-sm text-blue-600 font-semibold">
                {resourceCounts.devotionals} Resources Available
              </div>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <BookOpen className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Bible Studies</h3>
              <p className="text-gray-600 mb-4">
                In-depth Bible study guides with commentary and discussion questions
              </p>
              <div className="text-sm text-green-600 font-semibold">
                {resourceCounts.bibleStudies} Resources Available
              </div>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Sermon Transcripts</h3>
              <p className="text-gray-600 mb-4">
                Complete sermon transcripts with scripture references and study notes
              </p>
              <div className="text-sm text-purple-600 font-semibold">
                {resourceCounts.sermonTranscripts} Resources Available
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/ebooks" className="btn-primary text-lg px-8 py-3">
              Browse All Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience God's Love?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            We'd love to welcome you to our church family. Come visit us this Sunday and experience the warmth of our community!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-secondary text-lg px-8 py-3">
              Contact Us
            </Link>
            <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-blue-700 text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-gray-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions? Want to learn more about our church? We'd love to hear from you and help you get connected.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{churchInfo?.phone || '+2348144093507'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{churchInfo?.email || 'info@healing-word-church.org'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{churchInfo?.address || '6 Bella Crescent Behind Peridot Filling Station After Oba\'s Palace Iyana Ejigbo Lagos, Nigeria'}</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Service Schedule
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">Sunday Worship</span>
                  <span className="text-blue-600 font-semibold">{churchInfo?.serviceTimes || '9:00 AM & 11:00 AM'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">Wednesday Bible Study</span>
                  <span className="text-blue-600 font-semibold">7:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">Youth Group</span>
                  <span className="text-blue-600 font-semibold">Friday 6:30 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium">Prayer Meeting</span>
                  <span className="text-blue-600 font-semibold">Tuesday 7:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Children's Sunday School</span>
                  <span className="text-blue-600 font-semibold">10:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
