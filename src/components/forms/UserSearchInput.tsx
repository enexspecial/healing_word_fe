'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, User, X } from 'lucide-react'
import { adminApiService } from '@/lib/services/adminApiService'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
}

interface UserSearchInputProps {
  value: User | null
  onChange: (user: User | null) => void
  placeholder?: string
  disabled?: boolean
  error?: string
}

export default function UserSearchInput({ 
  value, 
  onChange, 
  placeholder = "Search for a user...", 
  disabled = false,
  error 
}: UserSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize search query from selected user
  useEffect(() => {
    if (value && !searchQuery) {
      setSearchQuery(`${value.firstName} ${value.lastName}`)
    }
  }, [value, searchQuery])

  // Search users when query changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true)
        try {
          console.log('Searching for users with query:', searchQuery.trim())
          const response = await adminApiService.searchUsers(searchQuery.trim(), 10)
          console.log('User search response:', response)
          
          if (response.success && response.data) {
            // Response data should already be an array from the fixed adminApiService
            const results = Array.isArray(response.data) ? response.data : []
            console.log('User search results:', results)
            setSearchResults(results)
            setShowDropdown(true)
            setSelectedIndex(-1)
          } else {
            console.log('User search failed:', response.error)
            setSearchResults([])
          }
        } catch (error) {
          console.error('Error searching users:', error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }, 300) // Debounce for 300ms
    } else {
      setSearchResults([])
      setShowDropdown(false)
      setIsSearching(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Clear selection if user is typing
    if (value && query !== `${value.firstName} ${value.lastName}`) {
      onChange(null)
    }
  }

  const handleUserSelect = (user: User) => {
    onChange(user)
    setSearchQuery(`${user.firstName} ${user.lastName}`)
    setShowDropdown(false)
    setSearchResults([])
  }

  const handleClear = () => {
    onChange(null)
    setSearchQuery('')
    setShowDropdown(false)
    setSearchResults([])
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleUserSelect(searchResults[selectedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': 'Super Admin',
      'ADMIN': 'Admin',
      'MEDIA': 'Media',
      'MINISTRY_LEADER': 'Ministry Leader',
      'TECHNICAL_ADMIN': 'Technical Admin',
      'REGULAR_USER': 'Regular User'
    }
    return roleMap[role] || role
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            title="Clear selection"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isSearching ? (
            <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Searching users...
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user, index) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleUserSelect(user)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center ${
                  index === selectedIndex ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">{getRoleDisplay(user.role)}</p>
                </div>
              </button>
            ))
          ) : searchQuery.trim().length >= 2 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No users found matching "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}

      {value && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <User className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Selected: {value.firstName} {value.lastName} ({value.email})
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
