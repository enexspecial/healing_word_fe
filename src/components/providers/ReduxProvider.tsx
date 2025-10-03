'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import AuthProvider from '@/components/auth/AuthProvider'
import { useState, useEffect } from 'react'

interface ReduxProviderProps {
  children: React.ReactNode
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Prevent hydration mismatch by only rendering after client-side hydration
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  )
}
