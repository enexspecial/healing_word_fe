'use client'

import { useState } from 'react'
import EbookCard from '@/components/ui/EbookCard'
import { Search, Filter, BookOpen, Download, Users, TrendingUp } from 'lucide-react'

// Sample E-book data
const sampleEbooks = [
  {
    id: '1',
    title: 'Walking in Faith: A 30-Day Devotional',
    author: 'Pastor Johnson',
    description: 'A powerful 30-day devotional guide to strengthen your faith and deepen your relationship with God. Each day includes scripture, reflection, and practical application.',
    coverImage: '/images/ebooks/devotional-1.jpg',
    category: 'devotional' as const,
    fileSize: '2.4 MB',
    pages: 45,
    publishDate: 'July 2024',
    downloadUrl: '/ebooks/walking-in-faith.pdf',
    previewUrl: '/ebooks/walking-in-faith-preview.pdf',
    isNew: true,
    isPopular: false
  },
  {
    id: '2',
    title: 'The Power of Prayer: Biblical Principles',
    author: 'Pastor Johnson',
    description: 'Discover the transformative power of prayer through biblical examples and practical guidance. Learn how to pray effectively and see God move in your life.',
    coverImage: '/images/ebooks/prayer-guide.jpg',
    category: 'prayer' as const,
    fileSize: '3.1 MB',
    pages: 52,
    publishDate: 'June 2024',
    downloadUrl: '/ebooks/power-of-prayer.pdf',
    previewUrl: '/ebooks/power-of-prayer-preview.pdf',
    isNew: false,
    isPopular: true
  },
  {
    id: '3',
    title: 'Understanding the Book of Romans',
    author: 'Pastor Johnson',
    description: 'A comprehensive Bible study guide through the Book of Romans. Explore Paul\'s teachings on grace, faith, and salvation with detailed commentary and discussion questions.',
    coverImage: '/images/ebooks/romans-study.jpg',
    category: 'bible-study' as const,
    fileSize: '4.2 MB',
    pages: 78,
    publishDate: 'May 2024',
    downloadUrl: '/ebooks/romans-study.pdf',
    previewUrl: '/ebooks/romans-study-preview.pdf',
    isNew: false,
    isPopular: true
  },
  {
    id: '4',
    title: 'Sermon Series: God\'s Grace',
    author: 'Pastor Johnson',
    description: 'Complete sermon series on God\'s grace, including full transcripts, scripture references, and discussion questions for small groups.',
    coverImage: '/images/ebooks/grace-sermons.jpg',
    category: 'sermon' as const,
    fileSize: '5.8 MB',
    pages: 120,
    publishDate: 'April 2024',
    downloadUrl: '/ebooks/grace-sermons.pdf',
    previewUrl: '/ebooks/grace-sermons-preview.pdf',
    isNew: false,
    isPopular: false
  },
  {
    id: '5',
    title: 'Youth Ministry: Building Strong Foundations',
    author: 'Youth Pastor Sarah',
    description: 'A guide for youth leaders and parents on building strong spiritual foundations in young people. Includes activities, discussion topics, and practical advice.',
    coverImage: '/images/ebooks/youth-guide.jpg',
    category: 'youth' as const,
    fileSize: '3.7 MB',
    pages: 65,
    publishDate: 'March 2024',
    downloadUrl: '/ebooks/youth-foundations.pdf',
    previewUrl: '/ebooks/youth-foundations-preview.pdf',
    isNew: false,
    isPopular: false
  },
  {
    id: '6',
    title: 'Family Devotions: Growing Together in Faith',
    author: 'Pastor Johnson',
    description: 'Weekly family devotionals designed to bring families closer to God and each other. Perfect for families with children of all ages.',
    coverImage: '/images/ebooks/family-devotions.jpg',
    category: 'family' as const,
    fileSize: '2.9 MB',
    pages: 48,
    publishDate: 'February 2024',
    downloadUrl: '/ebooks/family-devotions.pdf',
    previewUrl: '/ebooks/family-devotions-preview.pdf',
    isNew: false,
    isPopular: true
  }
]

const categories = [
  { id: 'all', label: 'All Resources', count: sampleEbooks.length },
  { id: 'sermon', label: 'Sermons', count: sampleEbooks.filter(book => book.category === 'sermon').length },
  { id: 'bible-study', label: 'Bible Studies', count: sampleEbooks.filter(book => book.category === 'bible-study').length },
  { id: 'devotional', label: 'Devotionals', count: sampleEbooks.filter(book => book.category === 'devotional').length },
  { id: 'prayer', label: 'Prayer', count: sampleEbooks.filter(book => book.category === 'prayer').length },
  { id: 'youth', label: 'Youth', count: sampleEbooks.filter(book => book.category === 'youth').length },
  { id: 'family', label: 'Family', count: sampleEbooks.filter(book => book.category === 'family').length }
]

export default function EbooksPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Filter and sort ebooks
  const filteredEbooks = sampleEbooks
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Spiritual Resources
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Download free E-books, devotionals, Bible studies, and sermon transcripts. 
            Deepen your faith with our collection of spiritual resources.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{sampleEbooks.length}</div>
              <div className="text-gray-600 text-sm">Total Resources</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">1,247</div>
              <div className="text-gray-600 text-sm">Downloads</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-1">6</div>
              <div className="text-gray-600 text-sm">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">Free</div>
              <div className="text-gray-600 text-sm">All Resources</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white py-6 border-b">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Sort resources by"
              title="Sort resources by"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </section>

      {/* E-books Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredEbooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEbooks.map(ebook => (
                <EbookCard key={ebook.id} {...ebook} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Subscribe to our newsletter to receive notifications when new resources are available. 
            Get the latest devotionals, Bible studies, and sermon transcripts delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-6 py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 