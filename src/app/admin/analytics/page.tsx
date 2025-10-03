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
} from "lucide-react";
import { analyticsService, VisitorAnalytics, RealTimeStats } from "@/lib/services/analyticsService";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<VisitorAnalytics | null>(null);
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
      const data = await analyticsService.getVisitorAnalytics(selectedPeriod);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
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
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Visitor insights and live streaming metrics</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Stats */}
        {realTimeStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Overview Stats */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

            {/* Top Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {analytics.topPages.slice(0, 5).map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{page.pageTitle || page.pageUrl}</p>
                        <p className="text-xs text-gray-500 truncate">{page.pageUrl}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatNumber(page.pageViews)}</p>
                        <p className="text-xs text-gray-500">{formatNumber(page.uniqueVisitors)} unique</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Device & Browser</h3>
                <div className="space-y-3">
                  {analytics.deviceStats.slice(0, 5).map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {device.device === 'mobile' && <Smartphone className="w-4 h-4 text-gray-500" />}
                        {device.device === 'tablet' && <Tablet className="w-4 h-4 text-gray-500" />}
                        {device.device === 'desktop' && <Monitor className="w-4 h-4 text-gray-500" />}
                        <span className="text-sm text-gray-900 capitalize">{device.device}</span>
                        <span className="text-xs text-gray-500">({device.browser})</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatNumber(device.count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.geoDistribution.slice(0, 9).map((location, index) => (
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
