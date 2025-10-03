'use client'

import { useEffect, useState } from 'react'
import { 
  BookOpen, 
  Users, 
  Download, 
  Video, 
  TrendingUp, 
  Calendar,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react'
import { 
  useDashboardOverview, 
  useDashboardAnalytics, 
  useDashboardStats, 
  useRecentActivity 
} from '@/lib/hooks/useAdminApi'
import { formatRelativeTime } from '@/lib/utils/apiUtils'


const recentActivity = [
  {
    id: 1,
    type: 'resource',
    action: 'New resource uploaded',
    description: 'Walking in Faith: A 30-Day Devotional',
    time: '2 hours ago',
    user: 'Pastor Johnson',
  },
  {
    id: 2,
    type: 'user',
    action: 'New user registered',
    description: 'Sarah M. joined the community',
    time: '4 hours ago',
    user: 'System',
  },
  {
    id: 3,
    type: 'download',
    action: 'Resource downloaded',
    description: 'The Power of Prayer: Biblical Principles',
    time: '6 hours ago',
    user: 'John D.',
  },
  {
    id: 4,
    type: 'stream',
    action: 'Live stream started',
    description: 'Sunday Morning Service',
    time: '1 day ago',
    user: 'Technical Team',
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: 'Sunday Worship Service',
    date: 'Tomorrow, 9:00 AM',
    type: 'service',
  },
  {
    id: 2,
    title: 'Wednesday Bible Study',
    date: 'Wednesday, 7:00 PM',
    type: 'study',
  },
  {
    id: 3,
    title: 'Youth Group Meeting',
    date: 'Friday, 6:30 PM',
    type: 'youth',
  },
]

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false)
  const { data: overview, loading: overviewLoading, error: overviewError, fetchOverview } = useDashboardOverview()
  const { data: analytics, loading: analyticsLoading, error: analyticsError, fetchAnalytics } = useDashboardAnalytics()
  const { data: stats, loading: statsLoading, error: statsError, fetchStats } = useDashboardStats()
  const { data: activity, loading: activityLoading, error: activityError, fetchActivity } = useRecentActivity()

  // Debug logging to help identify data issues
  console.log('AdminDashboard render:', { overview, stats, activity, overviewLoading, statsLoading, activityLoading })

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only fetch data once on component mount
    const fetchAllData = async () => {
      try {
        // Add a small delay to prevent hydration issues
        await new Promise(resolve => setTimeout(resolve, 100))
        
        await Promise.all([
          fetchOverview(),
          fetchAnalytics('7d', 'day'),
          fetchStats(),
          fetchActivity(10)
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Don't throw the error to prevent component crashes
      }
    }

    // Only fetch on client side to prevent hydration mismatches
    if (isClient) {
      fetchAllData()
    }
  }, []) // Empty dependency array to run only once

  // Transform API data to match your existing UI structure with additional safety checks
  const statsData = [
    {
      name: 'Total Resources',
      value: (overview?.totalResources ?? 0).toString(),
      change: stats?.resourceGrowth !== undefined ? 
        (stats.resourceGrowth >= 0 ? `+${stats.resourceGrowth}%` : `${stats.resourceGrowth}%`) : '0%',
      changeType: (stats?.resourceGrowth ?? 0) >= 0 ? 'increase' : 'decrease',
      icon: BookOpen,
    },
    {
      name: 'Total Users',
      value: (overview?.totalUsers ?? 0).toString(),
      change: stats?.userGrowth !== undefined ? 
        (stats.userGrowth >= 0 ? `+${stats.userGrowth}%` : `${stats.userGrowth}%`) : '0%',
      changeType: (stats?.userGrowth ?? 0) >= 0 ? 'increase' : 'decrease',
      icon: Users,
    },
    {
      name: 'Downloads',
      value: (stats?.fileDownloads ?? 0).toLocaleString(),
      change: '+23%', // You can add this to your API
      changeType: 'increase',
      icon: Download,
    },
    {
      name: 'Live Streams',
      value: (overview?.totalStreams ?? 0).toString(),
      change: '-2%', // You can add this to your API
      changeType: 'decrease',
      icon: Video,
    },
  ]

  const recentActivityData = activity && Array.isArray(activity) ? activity.map((item: any) => ({
    id: item?.id || 'unknown',
    type: item?.type || 'unknown',
    action: item?.action || 'Unknown action',
    description: item?.details || 'No details available',
    time: item?.timestamp ? formatRelativeTime(item.timestamp) : 'Unknown time',
    user: 'System', // You can add user info to your API
  })) : recentActivity || []

  // Show loading state if not on client side or if any data is still loading and no data has been loaded yet
  const isLoading = !isClient || ((overviewLoading || analyticsLoading || statsLoading || activityLoading) && 
                   !overview && !stats && !activity)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Handle API errors gracefully
  if (overviewError || analyticsError || statsError || activityError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">API Connection Error</div>
          <div className="text-gray-600 mb-4">
            Unable to connect to the backend API. Please check:
          </div>
          <ul className="text-left text-gray-600 mb-6 space-y-2">
            <li>• Backend server is running</li>
            <li>• API endpoints are implemented</li>
            <li>• Correct base URL configuration</li>
          </ul>
          <div className="text-sm text-gray-500">
            Current base URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your church website.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((item: any) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {overviewLoading || statsLoading ? (
                          <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                        ) : (
                          item.value
                        )}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {overviewLoading || statsLoading ? (
                          <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
                        ) : (
                          <>
                            {item.changeType === 'increase' ? (
                              <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                            )}
                            <span className="sr-only">{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                            {item.change}
                          </>
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Activity</h3>
            <div className="flow-root">
              {activityLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="animate-pulse bg-gray-200 rounded-full h-8 w-8"></div>
                      <div className="flex-1 space-y-2">
                        <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                        <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivityData && recentActivityData.length > 0 ? (
                <ul className="-mb-8">
                  {recentActivityData.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivity.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              activity.type === 'resource' ? 'bg-blue-500' :
                              activity.type === 'user' ? 'bg-green-500' :
                              activity.type === 'download' ? 'bg-purple-500' :
                              'bg-yellow-500'
                            }`}>
                              {activity.type === 'resource' && <BookOpen className="h-4 w-4 text-white" />}
                              {activity.type === 'user' && <Users className="h-4 w-4 text-white" />}
                              {activity.type === 'download' && <Download className="h-4 w-4 text-white" />}
                              {activity.type === 'stream' && <Video className="h-4 w-4 text-white" />}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {activity.action} <span className="font-medium text-gray-900">{activity.description}</span>
                              </p>
                              <p className="text-sm text-gray-400">by {activity.user}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time>{activity.time}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    event.type === 'service' ? 'bg-blue-100' :
                    event.type === 'study' ? 'bg-green-100' :
                    'bg-yellow-100'
                  }`}>
                    <Calendar className={`h-4 w-4 ${
                      event.type === 'service' ? 'text-blue-600' :
                      event.type === 'study' ? 'text-green-600' :
                      'text-yellow-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors">
                View All Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <BookOpen className="h-6 w-6 mb-2" />
              <div className="font-medium">Add Resource</div>
              <div className="text-sm">Upload new content</div>
            </button>
            <button className="bg-green-50 text-green-700 px-4 py-3 rounded-lg hover:bg-green-100 transition-colors text-left">
              <Users className="h-6 w-6 mb-2" />
              <div className="font-medium">Manage Users</div>
              <div className="text-sm">User administration</div>
            </button>
            <button className="bg-purple-50 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <Video className="h-6 w-6 mb-2" />
              <div className="font-medium">Start Stream</div>
              <div className="text-sm">Go live now</div>
            </button>
            <button className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg hover:bg-yellow-100 transition-colors text-left">
              <TrendingUp className="h-6 w-6 mb-2" />
              <div className="font-medium">View Reports</div>
              <div className="text-sm">Analytics & insights</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
