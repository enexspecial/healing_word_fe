'use client'

import React, { useEffect, useState } from 'react'
import { 
  useDashboardOverview, 
  useDashboardAnalytics, 
  useDashboardStats, 
  useRecentActivity 
} from '@/lib/hooks/useAdminApi'
import { formatDate, formatRelativeTime } from '@/lib/utils/apiUtils'

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [selectedGroupBy, setSelectedGroupBy] = useState('day')
  
  const { data: overview, loading: overviewLoading, error: overviewError, fetchOverview } = useDashboardOverview()
  const { data: analytics, loading: analyticsLoading, error: analyticsError, fetchAnalytics } = useDashboardAnalytics()
  const { data: stats, loading: statsLoading, error: statsError, fetchStats } = useDashboardStats()
  const { data: activity, loading: activityLoading, error: activityError, fetchActivity } = useRecentActivity()

  useEffect(() => {
    fetchOverview()
    fetchAnalytics(selectedPeriod, selectedGroupBy)
    fetchStats()
    fetchActivity(10)
  }, [fetchOverview, fetchAnalytics, fetchStats, fetchActivity, selectedPeriod, selectedGroupBy])

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    fetchAnalytics(period, selectedGroupBy)
  }

  const handleGroupByChange = (groupBy: string) => {
    setSelectedGroupBy(groupBy)
    fetchAnalytics(selectedPeriod, groupBy)
  }

  if (overviewLoading || analyticsLoading || statsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select time period"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            value={selectedGroupBy}
            onChange={(e) => handleGroupByChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select grouping"
          >
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{overview.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-semibold text-gray-900">{overview.totalResources}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Streams</p>
                <p className="text-2xl font-semibold text-gray-900">{overview.totalStreams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-semibold text-gray-900">{overview.totalFiles}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Chart */}
      {analytics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
          <div className="h-64 flex items-end space-x-2">
            {analytics.data.map((item: any, index: number) => (
              <div key={index} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${(item.users / 100) * 100}%` }}>
                <div className="text-xs text-white text-center mt-1">{item.users}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {analytics.data.map((item: any, index: number) => (
              <span key={index}>{formatDate(item.date)}</span>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">User Growth</p>
            <p className={`text-2xl font-semibold ${stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.userGrowth >= 0 ? '+' : ''}{stats.userGrowth}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Resource Growth</p>
            <p className={`text-2xl font-semibold ${stats.resourceGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.resourceGrowth >= 0 ? '+' : ''}{stats.resourceGrowth}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Stream Views</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.streamViews.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">File Downloads</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.fileDownloads.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {activity && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === 'user' ? 'bg-blue-500' :
                  item.type === 'resource' ? 'bg-green-500' :
                  item.type === 'stream' ? 'bg-purple-500' : 'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.details}</p>
                </div>
                <span className="text-xs text-gray-400">{formatRelativeTime(item.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {(overviewError || analyticsError || statsError || activityError) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
              <div className="mt-2 text-sm text-red-700">
                {overviewError && <p>Overview: {overviewError}</p>}
                {analyticsError && <p>Analytics: {analyticsError}</p>}
                {statsError && <p>Stats: {statsError}</p>}
                {activityError && <p>Activity: {activityError}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
