import { Download, BookOpen, Calendar, User, FileText, Eye } from 'lucide-react'
import Image from 'next/image'

interface EbookCardProps {
  id: string
  title: string
  author: string
  description: string
  coverImage: string
  category: 'sermon' | 'bible-study' | 'devotional' | 'prayer' | 'youth' | 'family'
  fileSize: string
  pages: number
  publishDate: string
  downloadUrl: string
  previewUrl?: string
  isNew?: boolean
  isPopular?: boolean
}

export default function EbookCard({
  id,
  title,
  author,
  description,
  coverImage,
  category,
  fileSize,
  pages,
  publishDate,
  downloadUrl,
  previewUrl,
  isNew = false,
  isPopular = false
}: EbookCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'sermon': return 'bg-blue-100 text-blue-800'
      case 'bible-study': return 'bg-green-100 text-green-800'
      case 'devotional': return 'bg-purple-100 text-purple-800'
      case 'prayer': return 'bg-red-100 text-red-800'
      case 'youth': return 'bg-yellow-100 text-yellow-800'
      case 'family': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'sermon': return 'Sermon'
      case 'bible-study': return 'Bible Study'
      case 'devotional': return 'Devotional'
      case 'prayer': return 'Prayer'
      case 'youth': return 'Youth'
      case 'family': return 'Family'
      default: return 'Resource'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Badges */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              NEW
            </span>
          )}
          {isPopular && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              POPULAR
            </span>
          )}
        </div>
        
        {/* Cover Image */}
        <div className="aspect-[3/4] relative bg-gray-100">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={`${title} by ${author} - ${getCategoryLabel(category)} cover image`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={isNew || isPopular}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category)}`}>
            {getCategoryLabel(category)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <User className="w-4 h-4" />
          <span className="text-sm">{author}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{pages} pages</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{fileSize}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{publishDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <a
            href={downloadUrl}
            download
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
          )}
        </div>
      </div>
    </div>
  )
} 