'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'

interface ProtectedAdminRouteProps {
  children: React.ReactNode
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, isLoading, isHydrated } = useSelector((state: RootState) => state.adminAuth)
  const router = useRouter()

  useEffect(() => {
    // Only redirect after hydration is complete and we're not loading
    if (isHydrated && !isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, isHydrated, router])

  // Show loading state while hydrating or checking authentication
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!isHydrated ? 'Loading...' : 'Checking authentication...'}
          </p>
        </div>
      </div>
    )
  }

  // If not authenticated after hydration, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // If authenticated, render the protected content
  return <>{children}</>
}
