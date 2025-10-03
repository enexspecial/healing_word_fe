'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useState, useEffect } from 'react'

// Only render in development mode - multiple checks for reliability
const isDevelopment = process.env.NODE_ENV === 'development' && 
                     process.env.NEXT_PUBLIC_NODE_ENV !== 'production'

export default function AuthDebug() {
  // Early return for production builds
  if (!isDevelopment) {
    return null
  }

  const authState = useSelector((state: RootState) => state.adminAuth)
  const [isClient, setIsClient] = useState(false)
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null)
  
  useEffect(() => {
    setIsClient(true)
    setLocalStorageToken(localStorage.getItem('adminToken'))
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>isHydrated: {authState.isHydrated ? 'true' : 'false'}</div>
        <div>isLoading: {authState.isLoading ? 'true' : 'false'}</div>
        <div>isAuthenticated: {authState.isAuthenticated ? 'true' : 'false'}</div>
        <div>hasUser: {authState.user ? 'true' : 'false'}</div>
        <div>hasToken: {authState.token ? 'true' : 'false'}</div>
        <div>error: {authState.error || 'none'}</div>
        <div>localStorage token: {isClient ? (localStorageToken ? 'exists' : 'none') : 'loading...'}</div>
      </div>
    </div>
  )
}
