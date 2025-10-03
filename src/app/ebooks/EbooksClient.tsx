'use client'

import { useState, useEffect } from 'react'
import EbookCard from '@/components/ui/EbookCard'
import { Search, Filter, BookOpen, Download, Users, TrendingUp, Loader2 } from 'lucide-react'
import { useResources, useCategories } from '@/lib/hooks/usePublicApi'
import { Resource, Category } from '@/types/api'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { generateBreadcrumbStructuredData } from '@/lib/breadcrumb-utils'

export default function EbooksClient() {
  const breadcrumbItems = [{ label: 'Resources' }]
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbItems)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500)
    return () => clearTimeout(timer)
  }, [searchTerm])
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'alphabetical'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { data: resources, loading: resourcesLoading, error: resourcesError, fetchResources } = useResources()
  const { data: categories, loading: categoriesLoading, fetchCategories } = useCategories()
  
  // Fetch data on component mount
  useEffect(() => {
    fetchResources()
    fetchCategories()
  }, [fetchResources, fetchCategories])
  
  // Filter and sort resources
  const resourcesArray = resources?.data || []
  const filteredResources = resourcesArray.filter((resource: Resource) => {
    const matchesSearch = debouncedSearchTerm === '' || 
      resource.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
      resource.category?.id === selectedCategory
    
    return matchesSearch && matchesCategory
  })
  
  const sortedResources = [...filteredResources].sort((a: Resource, b: Resource) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return (b.downloadCount || 0) - (a.downloadCount || 0)
      case 'alphabetical':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
  
  const stats = {
    totalResources: resourcesArray.length,
    totalDownloads: resourcesArray.reduce((sum: number, resource: Resource) => sum + (resource.downloadCount || 0), 0),
    totalCategories: categories?.length || 0
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
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Christian Resources
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover our collection of Bible studies, devotionals, sermon transcripts, and spiritual growth materials to deepen your faith journey.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalResources}</h3>
              <p className="text-gray-600">Resources Available</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalDownloads.toLocaleString()}</h3>
              <p className="text-gray-600">Total Downloads</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalCategories}</h3>
              <p className="text-gray-600">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  {categories?.map((category: Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'alphabetical')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Sort resources"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="alphabetical">A-Z</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  aria-label="Switch to grid view"
                  title="Grid view"
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                  aria-label="Switch to list view"
                  title="List view"
                >
                  <div className="w-4 h-4 flex flex-col gap-0.5">
                    <div className="bg-current rounded-sm h-1"></div>
                    <div className="bg-current rounded-sm h-1"></div>
                    <div className="bg-current rounded-sm h-1"></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="mb-8">
              <p className="text-gray-600 text-center">
                Showing {sortedResources.length} of {stats.totalResources} resources
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </p>
            </div>

            {/* Loading State */}
            {resourcesLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading resources...</span>
              </div>
            )}

            {/* Error State */}
            {resourcesError && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load resources. Please try again.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Resources Grid/List */}
            {!resourcesLoading && !resourcesError && (
              <div className={
                viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : 'space-y-6'
              }>
                {sortedResources.map((resource: Resource) => (
                  <EbookCard
                    key={resource.id}
                    id={resource.id}
                    title={resource.title}
                    author={resource.author?.firstName && resource.author?.lastName 
                      ? `${resource.author.firstName} ${resource.author.lastName}` 
                      : 'Healing Word Church'}
                    description={resource.description || ''}
                    coverImage={resource.coverImage?.path || '/images/default-ebook-cover.jpg'}
                    category={resource.type as any}
                    fileSize={resource.fileSize || 'Unknown'}
                    pages={resource.pages || 0}
                    publishDate={resource.publishDate || resource.createdAt}
                    downloadUrl={resource.downloadUrl || '#'}
                    previewUrl={resource.previewUrl}
                    isNew={resource.isNew}
                    isPopular={resource.isPopular}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!resourcesLoading && !resourcesError && sortedResources.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600 mb-6">
                  {debouncedSearchTerm 
                    ? `No resources match your search for "${debouncedSearchTerm}"`
                    : 'No resources available at the moment'
                  }
                </p>
                {debouncedSearchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn-outline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
