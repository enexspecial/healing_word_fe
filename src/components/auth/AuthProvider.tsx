'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/lib/hooks/useAdminAuth'
import { useDispatch, useSelector } from 'react-redux'
import { hydrateFromStorage } from '@/lib/slices/adminAuthSlice'
import { RootState } from '@/lib/store'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { validateCurrentToken, token } = useAdminAuth()
  const dispatch = useDispatch()
  const { isHydrated } = useSelector((state: RootState) => state.adminAuth)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Hydrate the store from localStorage after client-side hydration
    dispatch(hydrateFromStorage())
  }, [dispatch])

  useEffect(() => {
    // Only validate token after hydration is complete and we have a token
    if (isClient && isHydrated && token) {
      // Add a small delay to prevent race conditions during navigation
      const timeoutId = setTimeout(() => {
        validateCurrentToken()
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [isClient, isHydrated, token, validateCurrentToken])

  return <>{children}</>
}
