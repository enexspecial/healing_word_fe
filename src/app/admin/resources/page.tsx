'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  BookOpen,
  FileText,
  Image as ImageIcon,
  X,
  Upload,
} from 'lucide-react'
import { useCategories, useResourceOperations, useResourcesOverview } from '@/lib/hooks/useAdminApi'
import { Resource, CreateResourceDto, Category } from '@/types/api'



export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError, fetchCategories } = useCategories()
  const { data: createResourceData, loading: createResourceLoading, error: createResourceError, createResource } = useResourceOperations()
  const { data: resourcesData, loading: resourcesLoading, error: resourcesError, fetchOverview } = useResourcesOverview()

  // Form state
  const [formData, setFormData] = useState<CreateResourceDto>({
    title: '',
    description: '',
    type: 'devotional', // Use valid enum value
    categoryId: '',
    fileId: ''
  })
  const [fileUpload, setFileUpload] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Load categories and resources on component mount
  useEffect(() => {
    loadCategories()
    loadResources()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetchCategories()
      if (response.success && response.data) {
        // Ensure we always set an array, even if empty
        setCategories(Array.isArray(response.data) ? response.data : [])
      } else {
        console.warn('Categories API returned no data or failed')
        setCategories([])
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
      setCategories([])
    }
  }

  const loadResources = async () => {
    try {
      const response = await fetchOverview()
      if (response.success && response.data?.popularResources) {
        setResources(response.data.popularResources)
      }
    } catch (error) {
      console.error('Failed to load resources:', error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileUpload(file)
    }
  }

  const handleInputChange = (field: keyof CreateResourceDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const uploadFile = async (file: File): Promise<string> => {
    // Simulate file upload - in real implementation, this would call the file upload API
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          // Return a mock file ID - in real implementation, this would be the actual file ID
          resolve('mock-file-id-' + Date.now())
        }
      }, 100)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!fileUpload) {
        alert('Please select a file to upload')
        return
      }

      // Upload file first
      const fileId = await uploadFile(fileUpload)
      
      // Create resource with file ID
      const resourceData: CreateResourceDto = {
        ...formData,
        fileId
      }

      const response = await createResource(resourceData)
      
      if (response.success) {
        alert('Resource created successfully!')
        setShowAddModal(false)
        resetForm()
        // Refresh the resources list (you might want to implement this)
      } else {
        alert('Failed to create resource: ' + response.error)
      }
    } catch (error) {
      console.error('Error creating resource:', error)
      alert('An error occurred while creating the resource')
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'devotional', // Use valid enum value
      categoryId: '',
      fileId: ''
    })
    setFileUpload(null)
    setUploadProgress(0)
  }

  const closeModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  const filteredResources = resources.filter((resource: Resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || resource.categoryId === selectedCategory
    const matchesStatus = selectedStatus === 'All' || 
                         (selectedStatus === 'published' && resource.isNew) ||
                         (selectedStatus === 'draft' && !resource.isNew)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'devotional':
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case 'bible_study':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'sermon_transcript':
        return <FileText className="h-4 w-4 text-green-500" />
      case 'prayer_guide':
        return <FileText className="h-4 w-4 text-purple-500" />
      case 'youth_ministry':
        return <FileText className="h-4 w-4 text-yellow-500" />
      case 'family_resource':
        return <FileText className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources Management</h1>
          <p className="text-gray-600">Manage all church resources, devotionals, and study materials.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Resource
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by category"
              disabled={categoriesLoading}
            >
              <option value="All">All Categories</option>
              {categoriesLoading ? (
                <option value="" disabled>Loading categories...</option>
              ) : Array.isArray(categories) && categories.length > 0 ? (
                categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))
              ) : (
                <option value="" disabled>No categories available</option>
              )}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="All">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        
        {/* Categories loading/error state */}
        {categoriesLoading && (
          <div className="mt-3 text-sm text-blue-600">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
              Loading categories...
            </div>
          </div>
        )}
        {!categoriesLoading && categoriesError && (
          <div className="mt-3 text-sm text-red-600">
            Error loading categories: {categoriesError}
          </div>
        )}
        {!categoriesLoading && !categoriesError && Array.isArray(categories) && categories.length === 0 && (
          <div className="mt-3 text-sm text-yellow-600">
            No categories available. Please create some categories first.
          </div>
        )}
      </div>

      {/* Resources table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Resources ({filteredResources.length})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Download className="h-4 w-4" />
              <span>Total Resources: {resources.length}</span>
            </div>
          </div>
          
          {resourcesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading resources...</p>
            </div>
          ) : resourcesError ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading resources: {resourcesError}</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No resources found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResources.map((resource: Resource) => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              {getFileTypeIcon(resource.type)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                            <div className="text-sm text-gray-500">
                              {(resource.description?.length || 0) > 50 ? (resource.description?.substring(0, 50) || '') + '...' : (resource.description || 'No description')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {categories.find(cat => cat.id === resource.categoryId)?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {resource.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          resource.isNew ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {resource.isNew ? 'New' : 'Standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            title="View resource"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit resource"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            title="Delete resource"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-gray-600"
                            title="More options"
                          >
                            <MoreHorizontal className="h-4 w-4" />
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

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Resource</h3>
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
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter resource title"
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
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter resource description"
                />
              </div>

              {/* Type and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    id="type"
                    required
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="devotional">Devotional</option>
                    <option value="bible_study">Bible Study</option>
                    <option value="sermon_transcript">Sermon Transcript</option>
                    <option value="prayer_guide">Prayer Guide</option>
                    <option value="youth_ministry">Youth Ministry</option>
                    <option value="family_resource">Family Resource</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No categories available</option>
                    )}
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                  File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {fileUpload ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{fileUpload.name}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Size: {(fileUpload.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setFileUpload(null)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-500 font-medium">
                            Click to upload
                          </span>
                          <span className="text-gray-500"> or drag and drop</span>
                        </label>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.mp4,.mp3,.txt"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, MP4, MP3, TXT up to 50MB
                      </p>
                    </div>
                  )}
                </div>
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
                  disabled={isLoading || !fileUpload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Resource
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
