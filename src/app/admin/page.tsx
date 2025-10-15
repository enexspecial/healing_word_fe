'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  FileText, 
  Download, 
  Video,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react'
import { adminApiService } from '@/lib/services/adminApiService'

interface DashboardOverview {
  summary: {
    totalUsers: number
    totalResources: number
    totalFiles: number
    totalDownloads: number
    activeStreams: number
    churchInfoCount: number
  }
  recentActivity: {
    users: any[]
    resources: any[]
    downloads: any[]
    files: any[]
  }
  systemHealth: {
    status: string
    database: string
    lastCheck: string
  }
}

interface DashboardStats {
  users: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
    roleDistribution: Record<string, number>
  }
  resources: {
    total: number
    new: number
    popular: number
    thisMonth: number
    byCategory: any[]
  }
  files: {
    total: number
    totalSize: number
    byType: any[]
  }
  downloads: {
    total: number
    thisMonth: number
    topResources: any[]
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [overviewResult, statsResult] = await Promise.all([
        adminApiService.getDashboardOverview(),
        adminApiService.getDashboardStats()
      ])

      if (overviewResult.success && overviewResult.data) {
        setOverview(overviewResult.data as unknown as DashboardOverview)
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data as unknown as DashboardStats)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the Healing Word administration panel</p>
      </div>

      {/* System Health */}
      {overview?.systemHealth && (
        <div className={`rounded-lg p-4 ${
          overview.systemHealth.status === 'healthy' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {overview.systemHealth.status === 'healthy' ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className={`font-medium ${
                overview.systemHealth.status === 'healthy' ? 'text-green-800' : 'text-red-800'
              }`}>
                System Status: {overview.systemHealth.status.toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              Database: {overview.systemHealth.database}
            </span>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={overview?.summary.totalUsers || 0}
          subtitle={`${stats?.users.active || 0} active`}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Resources"
          value={overview?.summary.totalResources || 0}
          subtitle={`${stats?.resources.new || 0} new`}
          icon={FileText}
          color="bg-green-500"
        />
        <StatCard
          title="Total Files"
          value={overview?.summary.totalFiles || 0}
          subtitle={formatBytes(stats?.files.totalSize || 0)}
          icon={FileText}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Downloads"
          value={overview?.summary.totalDownloads || 0}
          subtitle={`${stats?.downloads.thisMonth || 0} this month`}
          icon={Download}
          color="bg-orange-500"
        />
        <StatCard
          title="Active Streams"
          value={overview?.summary.activeStreams || 0}
          icon={Video}
          color="bg-red-500"
        />
        <StatCard
          title="Church Info"
          value={overview?.summary.churchInfoCount || 0}
          icon={Users}
          color="bg-indigo-500"
        />
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Statistics</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="font-semibold">{stats?.users.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="font-semibold text-green-600">{stats?.users.active || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Inactive Users</span>
              <span className="font-semibold text-gray-400">{stats?.users.inactive || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New This Month</span>
              <span className="font-semibold text-blue-600">{stats?.users.newThisMonth || 0}</span>
            </div>
            {stats?.users.roleDistribution && Object.keys(stats.users.roleDistribution).length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">By Role</p>
                <div className="space-y-2">
                  {Object.entries(stats.users.roleDistribution).map(([role, count]) => (
                    <div key={role} className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 capitalize">{role.replace('_', ' ')}</span>
                      <span className="text-xs font-semibold">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resource Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Resource Statistics</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Resources</span>
              <span className="font-semibold">{stats?.resources.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Resources</span>
              <span className="font-semibold text-blue-600">{stats?.resources.new || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Popular Resources</span>
              <span className="font-semibold text-green-600">{stats?.resources.popular || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Added This Month</span>
              <span className="font-semibold text-purple-600">{stats?.resources.thisMonth || 0}</span>
            </div>
          </div>
        </div>

        {/* Download Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Download Statistics</h3>
            <Download className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Downloads</span>
              <span className="font-semibold">{stats?.downloads.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="font-semibold text-blue-600">{stats?.downloads.thisMonth || 0}</span>
            </div>
            {stats?.downloads.topResources && stats.downloads.topResources.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Top Resources</p>
                <div className="space-y-2">
                  {stats.downloads.topResources.slice(0, 5).map((resource: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 truncate flex-1">{resource.title}</span>
                      <span className="text-xs font-semibold ml-2">{resource.downloadCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* File Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">File Statistics</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Files</span>
              <span className="font-semibold">{stats?.files.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Size</span>
              <span className="font-semibold">{formatBytes(stats?.files.totalSize || 0)}</span>
            </div>
            {stats?.files.byType && stats.files.byType.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">By Type</p>
                <div className="space-y-2">
                  {stats.files.byType.slice(0, 5).map((type: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">{type.mime_type || 'Unknown'}</span>
                      <span className="text-xs font-semibold">{type.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recent Users */}
            <div>
              <div className="flex items-center mb-3">
                <Users className="h-4 w-4 text-gray-400 mr-2" />
                <h4 className="text-sm font-semibold text-gray-700">Recent Users</h4>
              </div>
              <div className="space-y-2">
                {overview?.recentActivity.users && overview.recentActivity.users.length > 0 ? (
                  overview.recentActivity.users.slice(0, 3).map((user: any) => (
                    <div key={user.id} className="text-sm">
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent users</p>
                )}
              </div>
            </div>

            {/* Recent Resources */}
            <div>
              <div className="flex items-center mb-3">
                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                <h4 className="text-sm font-semibold text-gray-700">Recent Resources</h4>
              </div>
              <div className="space-y-2">
                {overview?.recentActivity.resources && overview.recentActivity.resources.length > 0 ? (
                  overview.recentActivity.resources.slice(0, 3).map((resource: any) => (
                    <div key={resource.id} className="text-sm">
                      <p className="font-medium text-gray-900 truncate">{resource.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent resources</p>
                )}
              </div>
            </div>

            {/* Recent Downloads */}
            <div>
              <div className="flex items-center mb-3">
                <Download className="h-4 w-4 text-gray-400 mr-2" />
                <h4 className="text-sm font-semibold text-gray-700">Recent Downloads</h4>
              </div>
              <div className="space-y-2">
                {overview?.recentActivity.downloads && overview.recentActivity.downloads.length > 0 ? (
                  overview.recentActivity.downloads.slice(0, 3).map((download: any, index: number) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900">
                        {download.user?.firstName} {download.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(download.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent downloads</p>
                )}
              </div>
            </div>

            {/* Recent Files */}
            <div>
              <div className="flex items-center mb-3">
                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                <h4 className="text-sm font-semibold text-gray-700">Recent Files</h4>
              </div>
              <div className="space-y-2">
                {overview?.recentActivity.files && overview.recentActivity.files.length > 0 ? (
                  overview.recentActivity.files.slice(0, 3).map((file: any) => (
                    <div key={file.id} className="text-sm">
                      <p className="font-medium text-gray-900 truncate">{file.originalName}</p>
                      <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent files</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/admin/users')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-500">View and manage users</p>
          </button>
          <button
            onClick={() => router.push('/admin/resources')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FileText className="h-6 w-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Manage Resources</p>
            <p className="text-sm text-gray-500">View and manage resources</p>
          </button>
          <button
            onClick={() => router.push('/admin/analytics')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <BarChart3 className="h-6 w-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">View Analytics</p>
            <p className="text-sm text-gray-500">Detailed analytics</p>
          </button>
        </div>
      </div>
    </div>
  )
}
