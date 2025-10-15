"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Eye,
  Globe,
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  BarChart3,
  RefreshCw,
  Download,
  MessageSquare,
  Video,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Activity,
  FileText,
  Target,
  LogOut,
} from "lucide-react";
import { 
  analyticsService, 
  ComprehensiveAnalytics,
  RealTimeStats 
} from "@/lib/services/analyticsService";


// this analytic

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<ComprehensiveAnalytics | null>(null);
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchAnalytics();
    fetchRealTimeStats();

    // Set up real-time updates
    const interval = setInterval(() => {
      fetchRealTimeStats();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getComprehensiveAnalytics(selectedPeriod);
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      const data = await analyticsService.getRealTimeStats();
      setRealTimeStats(data);
    } catch (err) {
      console.error('Error fetching real-time stats:', err);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const GrowthIndicator = ({ value, trend }: { value: number; trend: 'up' | 'down' }) => {
    const isPositive = trend === 'up';
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        <span>{Math.abs(value)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading comprehensive analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comprehensive Analytics</h1>
              <p className="text-gray-600 mt-1">Complete insights across all metrics</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Select time period for analytics"
                title="Select time period for analytics"
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Real-time Stats */}
        {realTimeStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Live Viewers</p>
                  <p className="text-3xl font-bold text-green-600">{realTimeStats.liveViewers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Currently watching live streams</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hourly Visitors</p>
                  <p className="text-3xl font-bold text-blue-600">{realTimeStats.hourlyVisitors}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Visitors in the last hour</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Views (5min)</p>
                  <p className="text-3xl font-bold text-purple-600">{realTimeStats.currentPageViews}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Page views in last 5 minutes</p>
            </div>
          </div>
        )}

        {analytics && (
          <>
            {/* Growth Metrics Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Growth Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Visitors</h3>
                    <GrowthIndicator value={analytics.growthMetrics.visitors.growthRate} trend={analytics.growthMetrics.visitors.trend} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.growthMetrics.visitors.current)}</p>
                  <p className="text-xs text-gray-500 mt-1">vs {formatNumber(analytics.growthMetrics.visitors.previous)} previous period</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Page Views</h3>
                    <GrowthIndicator value={analytics.growthMetrics.pageViews.growthRate} trend={analytics.growthMetrics.pageViews.trend} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.growthMetrics.pageViews.current)}</p>
                  <p className="text-xs text-gray-500 mt-1">vs {formatNumber(analytics.growthMetrics.pageViews.previous)} previous period</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Downloads</h3>
                    <GrowthIndicator value={analytics.growthMetrics.downloads.growthRate} trend={analytics.growthMetrics.downloads.trend} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.growthMetrics.downloads.current)}</p>
                  <p className="text-xs text-gray-500 mt-1">vs {formatNumber(analytics.growthMetrics.downloads.previous)} previous period</p>
                </div>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.overview.totalVisitors)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">All time visitors</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Visitors</p>
                    <p className="text-3xl font-bold text-green-600">{formatNumber(analytics.overview.newVisitors)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">In selected period</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Page Views</p>
                    <p className="text-3xl font-bold text-blue-600">{formatNumber(analytics.overview.totalPageViews)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">In selected period</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Live Viewers</p>
                    <p className="text-3xl font-bold text-red-600">{analytics.overview.liveViewers}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Currently watching</p>
              </div>
            </div>

            {/* User Behavior Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-600" />
                User Behavior
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Returning vs New</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-purple-600">{analytics.userBehavior.returningVsNewPercentage.returning.toFixed(1)}%</p>
                    <span className="text-sm text-gray-500">returning</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatNumber(analytics.userBehavior.returningVisitors)} returning, {formatNumber(analytics.userBehavior.newVisitors)} new</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Session Duration</h3>
                  <p className="text-2xl font-bold text-blue-600">{formatTime(analytics.userBehavior.avgSessionDuration)}</p>
                  <p className="text-xs text-gray-500 mt-1">Time spent per session</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Pages Per Session</h3>
                  <p className="text-2xl font-bold text-indigo-600">{analytics.userBehavior.pagesPerSession.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">Avg pages visited</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Bounce Rate</h3>
                  <p className="text-2xl font-bold text-orange-600">{analytics.userBehavior.bounceRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Single page sessions</p>
                </div>
              </div>
            </div>

            {/* Content Engagement Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Download className="w-6 h-6 text-green-600" />
                Content Engagement
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Downloads</span>
                      <span className="text-lg font-bold text-green-600">{formatNumber(analytics.contentEngagement.totalDownloads)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Avg Downloads/Resource</span>
                      <span className="text-lg font-bold text-blue-600">{analytics.contentEngagement.avgDownloadsPerResource.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Downloads</h3>
                  <div className="space-y-2">
                    {analytics.contentEngagement.topDownloadedResources.slice(0, 5).map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm text-gray-700 truncate flex-1">{resource.title}</span>
                        <span className="text-sm font-semibold text-gray-900 ml-2">{formatNumber(resource.downloadCount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {analytics.contentEngagement.downloadsByCategory.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Downloads by Category</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {analytics.contentEngagement.downloadsByCategory.map((category, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1">{category.categoryName}</p>
                        <p className="text-xl font-bold text-gray-900">{formatNumber(category.count)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Metrics Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
                Contact Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Submissions</h3>
                  <p className="text-3xl font-bold text-indigo-600">{formatNumber(analytics.contactMetrics.totalSubmissions)}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Response Time</h3>
                  <p className="text-3xl font-bold text-blue-600">{analytics.contactMetrics.avgResponseTimeHours.toFixed(1)}h</p>
                </div>

                {analytics.contactMetrics.statusBreakdown.map((status, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2 capitalize">{status.status}</h3>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(status.count)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Streaming Analytics Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Video className="w-6 h-6 text-red-600" />
                Streaming Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Streams</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.streamingAnalytics.totalStreams)}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Live Streams</h3>
                  <p className="text-3xl font-bold text-red-600">{analytics.streamingAnalytics.liveStreams}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Stream Hours</h3>
                  <p className="text-3xl font-bold text-purple-600">{analytics.streamingAnalytics.totalStreamHours.toFixed(1)}h</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Peak Viewers</h3>
                  <p className="text-3xl font-bold text-blue-600">{formatNumber(analytics.streamingAnalytics.peakViewers)}</p>
                </div>
              </div>

              {analytics.streamingAnalytics.topStreams.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Streams</h3>
                  <div className="space-y-2">
                    {analytics.streamingAnalytics.topStreams.slice(0, 5).map((stream, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{stream.title}</p>
                          <p className="text-xs text-gray-500">{stream.platform}</p>
                        </div>
                        <span className="text-sm font-bold text-red-600">{formatNumber(stream.viewerCount)} viewers</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Time-Based Analysis Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                Peak Traffic Times
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Peak Hour</h3>
                  <p className="text-4xl font-bold text-orange-600">{analytics.timeBasedAnalysis.peakHour.hour}:00</p>
                  <p className="text-sm text-gray-500 mt-2">{formatNumber(analytics.timeBasedAnalysis.peakHour.pageViews)} page views</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Peak Day</h3>
                  <p className="text-4xl font-bold text-blue-600">{analytics.timeBasedAnalysis.peakDay.dayName}</p>
                  <p className="text-sm text-gray-500 mt-2">{formatNumber(analytics.timeBasedAnalysis.peakDay.pageViews)} page views</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic by Day of Week</h3>
                <div className="space-y-2">
                  {analytics.timeBasedAnalysis.trafficByDayOfWeek.map((day, index) => {
                    const maxViews = Math.max(...analytics.timeBasedAnalysis.trafficByDayOfWeek.map(d => d.pageViews));
                    const percentage = (day.pageViews / maxViews) * 100;
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{day.dayName}</span>
                          <span className="text-sm text-gray-600">{formatNumber(day.pageViews)} views</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Page Performance Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-teal-600" />
                Page Performance
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Engaging Pages</h3>
                  <div className="space-y-2">
                    {analytics.pagePerformance.engagingPages.slice(0, 5).map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{page.pageTitle || page.pageUrl}</p>
                          <p className="text-xs text-gray-500 truncate">{page.pageUrl}</p>
                        </div>
                        <span className="text-sm font-bold text-green-600 ml-2">{formatTime(page.avgTimeOnPage)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Exit Pages</h3>
                  <div className="space-y-2">
                    {analytics.pagePerformance.quickExitPages.slice(0, 5).map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{page.pageTitle || page.pageUrl}</p>
                          <p className="text-xs text-gray-500 truncate">{page.pageUrl}</p>
                        </div>
                        <span className="text-sm font-bold text-red-600 ml-2">{formatTime(page.avgTimeOnPage)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {analytics.userBehavior.exitPages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Exit Pages</h3>
                  <div className="space-y-2">
                    {analytics.userBehavior.exitPages.slice(0, 5).map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{page.pageTitle || page.pageUrl}</p>
                          <p className="text-xs text-gray-500 truncate">{page.pageUrl}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-bold text-gray-900">{formatNumber(page.exitCount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Device & OS Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Monitor className="w-6 h-6 text-cyan-600" />
                Device & Platform Statistics
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices</h3>
                  <div className="space-y-2">
                    {analytics.enhancedDeviceStats.deviceStats.map((device, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {device.device === 'mobile' && <Smartphone className="w-4 h-4 text-gray-500" />}
                          {device.device === 'tablet' && <Tablet className="w-4 h-4 text-gray-500" />}
                          {device.device === 'desktop' && <Monitor className="w-4 h-4 text-gray-500" />}
                          <span className="text-sm font-medium text-gray-700 capitalize">{device.device}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{formatNumber(device.count)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
                  <div className="space-y-2">
                    {analytics.enhancedDeviceStats.osStats.map((os, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 capitalize">{os.os}</span>
                        <span className="text-sm font-bold text-gray-900">{formatNumber(os.count)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
                  <div className="space-y-2">
                    {analytics.enhancedDeviceStats.browserStats.map((browser, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 capitalize">{browser.browser}</span>
                        <span className="text-sm font-bold text-gray-900">{formatNumber(browser.count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
              <div className="space-y-3">
                {analytics.topPages.slice(0, 10).map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{page.pageTitle || page.pageUrl}</p>
                      <p className="text-xs text-gray-500 truncate">{page.pageUrl}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-gray-900">{formatNumber(page.pageViews)}</p>
                      <p className="text-xs text-gray-500">{formatNumber(page.uniqueVisitors)} unique</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.geoDistribution.slice(0, 12).map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {location.city}, {location.region}
                        </p>
                        <p className="text-xs text-gray-500">{location.country}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatNumber(location.visitors)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
