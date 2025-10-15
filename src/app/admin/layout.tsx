'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Video, 
  Settings, 
  Church, 
  LogOut,
  Menu,
  X,
  Bell,
  User,
  BarChart3,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import ProtectedAdminRoute from '@/components/auth/ProtectedAdminRoute'
import { logout } from '@/lib/slices/adminAuthSlice'
import { RootState, AppDispatch } from '@/lib/store'
import { initializeApiToken } from '@/lib/utils/apiUtils'
import dynamic from 'next/dynamic'

// Only load AuthDebug in development
const AuthDebug = dynamic(() => import('@/components/debug/AuthDebug'), {
  ssr: false,
  loading: () => null
})

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Resources', href: '/admin/resources', icon: BookOpen },
  { name: 'Users', href: '/admin/users', icon: Users },
  // { name: 'Files', href: '/admin/files', icon: FileText },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
  { name: 'Contact', href: '/admin/contact', icon: MessageSquare },
  { name: 'Live Streaming', href: '/admin/streaming', icon: Video },
  { name: 'Church Info', href: '/admin/church', icon: Church },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { user, isHydrated, isLoading } = useSelector((state: RootState) => state.adminAuth)

  // Initialize API token from localStorage when component mounts
  useEffect(() => {
    initializeApiToken()
  }, [])

  // Check if user is authenticated and redirect if not
  // Only check after hydration is complete to prevent false redirects
  useEffect(() => {
    if (isHydrated && !isLoading && !user && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isHydrated, isLoading, user, pathname, router])

  // Listen for authentication failures from API calls
  useEffect(() => {
    const handleAuthFailed = () => {
      console.log('Authentication failed, redirecting to login...')
      router.push('/admin/login')
    }

    window.addEventListener('adminAuthFailed', handleAuthFailed)
    
    return () => {
      window.removeEventListener('adminAuthFailed', handleAuthFailed)
    }
  }, [router])

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login'

  const handleLogout = () => {
    dispatch(logout())
    router.push('/admin/login')
  }

  // If it's the login page, render without protection
  if (isLoginPage) {
    return <>{children}</>
  }

  // For all other admin pages, apply protection
  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50">
        <AuthDebug />
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close sidebar"
                title="Close sidebar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex h-16 items-center px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top header */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1" />
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button className="text-gray-400 hover:text-gray-500" aria-label="Notifications" title="Notifications">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="h-6 w-px bg-gray-200" />
                <div className="flex items-center gap-x-2">
                  <User className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {user?.email || 'Admin User'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-500" 
                  aria-label="Logout" 
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedAdminRoute>
  )
}
