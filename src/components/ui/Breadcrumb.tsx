'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import type { BreadcrumbItem } from '@/lib/breadcrumb-utils'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const allItems = [
    { label: 'Home', href: '/' },
    ...items
  ]

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}
    >
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center hover:text-blue-600 transition-colors"
              >
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center text-gray-900 font-medium">
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

