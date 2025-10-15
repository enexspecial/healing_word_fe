import { ApiResponse } from '@/types/api';

// ============================================
// BASE ANALYTICS INTERFACES
// ============================================

export interface VisitorAnalytics {
  overview: {
    totalVisitors: number;
    newVisitors: number;
    totalPageViews: number;
    liveViewers: number;
    period: string;
  };
  dailyTrends: Array<{
    date: string;
    uniqueVisitors: number;
    pageViews: number;
  }>;
  topPages: Array<{
    pageUrl: string;
    pageTitle: string;
    uniqueVisitors: number;
    pageViews: number;
  }>;
  geoDistribution: Array<{
    country: string;
    region: string;
    city: string;
    visitors: number;
  }>;
  deviceStats: Array<{
    device: string;
    browser: string;
    os: string;
    count: number;
  }>;
}

export interface RealTimeStats {
  liveViewers: number;
  hourlyVisitors: number;
  currentPageViews: number;
  timestamp: string;
}

export interface LiveStreamAnalytics {
  totalViews: number;
  uniqueViewers: number;
  recentViews: Array<{
    id: string;
    visitorId: string;
    pageUrl: string;
    viewTimestamp: string;
  }>;
}

// ============================================
// PHASE 1 & 2: ENHANCED ANALYTICS INTERFACES
// ============================================

/**
 * PHASE 1.1: Content Engagement Metrics
 */
export interface ContentEngagementMetrics {
  totalDownloads: number;
  downloadTrends: Array<{
    date: string;
    count: number;
  }>;
  topDownloadedResources: Array<{
    resourceId: string;
    title: string;
    downloadCount: number;
  }>;
  downloadsByCategory: Array<{
    categoryName: string;
    count: number;
  }>;
  avgDownloadsPerResource: number;
}

/**
 * PHASE 1.2: User Behavior Metrics
 */
export interface UserBehaviorMetrics {
  returningVisitors: number;
  newVisitors: number;
  returningVsNewPercentage: {
    returning: number;
    new: number;
  };
  avgSessionDuration: number;
  pagesPerSession: number;
  bounceRate: number;
  exitPages: Array<{
    pageUrl: string;
    pageTitle: string;
    exitCount: number;
  }>;
}

/**
 * PHASE 1.3: Growth Metrics
 */
export interface GrowthMetrics {
  visitors: {
    current: number;
    previous: number;
    growthRate: number;
    trend: 'up' | 'down';
  };
  pageViews: {
    current: number;
    previous: number;
    growthRate: number;
    trend: 'up' | 'down';
  };
  downloads: {
    current: number;
    previous: number;
    growthRate: number;
    trend: 'up' | 'down';
  };
}

/**
 * PHASE 1.4: Contact Metrics
 */
export interface ContactMetrics {
  totalSubmissions: number;
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
  submissionTrends: Array<{
    date: string;
    count: number;
  }>;
  avgResponseTimeHours: number;
}

/**
 * PHASE 2.1: Streaming Analytics
 */
export interface StreamingAnalytics {
  totalStreams: number;
  liveStreams: number;
  avgStreamDurationHours: number;
  totalStreamHours: number;
  avgViewersPerStream: string;
  peakViewers: number;
  platformDistribution: Array<{
    platform: string;
    count: number;
  }>;
  streamsByHour: Array<{
    hour: number;
    count: number;
    avgViewers: string;
  }>;
  topStreams: Array<{
    title: string;
    viewerCount: number;
    platform: string;
    startTime: string;
  }>;
}

/**
 * PHASE 2.2: Time-Based Analysis
 */
export interface TimeBasedAnalysis {
  trafficByHour: Array<{
    hour: number;
    pageViews: number;
    uniqueVisitors: number;
  }>;
  trafficByDayOfWeek: Array<{
    dayOfWeek: number;
    dayName: string;
    pageViews: number;
    uniqueVisitors: number;
  }>;
  peakHour: {
    hour: number;
    pageViews: number;
  };
  peakDay: {
    dayOfWeek: number;
    dayName: string;
    pageViews: number;
  };
}

/**
 * PHASE 2.3: Page Performance Metrics
 */
export interface PagePerformanceMetrics {
  avgTimeOnPage: Array<{
    pageUrl: string;
    pageTitle: string;
    avgTimeOnPage: number;
    views: number;
  }>;
  engagingPages: Array<{
    pageUrl: string;
    pageTitle: string;
    avgTimeOnPage: number;
    views: number;
  }>;
  quickExitPages: Array<{
    pageUrl: string;
    pageTitle: string;
    avgTimeOnPage: number;
    views: number;
  }>;
}

/**
 * PHASE 2.4: Enhanced Device Stats
 */
export interface EnhancedDeviceStats {
  deviceStats: Array<{
    device: string;
    count: number;
  }>;
  osStats: Array<{
    os: string;
    count: number;
  }>;
  browserStats: Array<{
    browser: string;
    count: number;
  }>;
  deviceOsStats: Array<{
    device: string;
    os: string;
    browser: string;
    count: number;
  }>;
}

/**
 * Comprehensive Analytics (combines all Phase 1 & 2 metrics)
 */
export interface ComprehensiveAnalytics extends VisitorAnalytics {
  contentEngagement: ContentEngagementMetrics;
  userBehavior: UserBehaviorMetrics;
  growthMetrics: GrowthMetrics;
  contactMetrics: ContactMetrics;
  streamingAnalytics: StreamingAnalytics;
  timeBasedAnalysis: TimeBasedAnalysis;
  pagePerformance: PagePerformanceMetrics;
  enhancedDeviceStats: EnhancedDeviceStats;
}

class AnalyticsService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      // Backend returns ApiResponseDto.success(data, message) format
      if (result.success !== undefined) {
        return { 
          success: result.success, 
          data: result.data,
          message: result.message 
        };
      }
      
      // If not in expected format, return as is
      return { 
        success: true, 
        data: result 
      };
    } catch (error) {
      console.error('Analytics API request failed:', error);
      return { 
        success: false, 
        data: null as T, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ============================================
  // BASE ANALYTICS METHODS
  // ============================================

  async getVisitorAnalytics(period: string = '7d', groupBy: string = 'day'): Promise<VisitorAnalytics> {
    const response = await this.makeRequest<VisitorAnalytics>(`/analytics/visitors?period=${period}&groupBy=${groupBy}`);
    return response.data!;
  }

  async getLiveViewers(): Promise<number> {
    const response = await this.makeRequest<{ liveViewers: number }>('/analytics/live-viewers');
    return response.data!.liveViewers;
  }

  async getLiveStreamAnalytics(streamId?: string): Promise<LiveStreamAnalytics> {
    const endpoint = streamId ? `/api/analytics/live-stream/${streamId}` : '/analytics/live-stream';
    const response = await this.makeRequest<LiveStreamAnalytics>(endpoint);
    return response.data!;
  }

  async getRealTimeStats(): Promise<RealTimeStats> {
    const response = await this.makeRequest<RealTimeStats>('/analytics/real-time');
    return response.data!;
  }

  // ============================================
  // PHASE 1 & 2: ENHANCED ANALYTICS METHODS
  // ============================================

  /**
   * Get comprehensive analytics (all Phase 1 & 2 metrics combined)
   */
  async getComprehensiveAnalytics(period: string = '7d'): Promise<ComprehensiveAnalytics> {
    const response = await this.makeRequest<ComprehensiveAnalytics>(`/analytics/comprehensive?period=${period}`);
    return response.data!;
  }

  /**
   * PHASE 1.1: Content Engagement Metrics
   */
  async getContentEngagementMetrics(period: string = '7d'): Promise<ContentEngagementMetrics> {
    const response = await this.makeRequest<ContentEngagementMetrics>(`/analytics/content-engagement?period=${period}`);
    return response.data!;
  }

  /**
   * PHASE 1.2: User Behavior Metrics
   */
  async getUserBehaviorMetrics(period: string = '7d'): Promise<UserBehaviorMetrics> {
    const response = await this.makeRequest<UserBehaviorMetrics>(`/analytics/user-behavior?period=${period}`);
    return response.data!;
  }

  /**
   * PHASE 1.3: Growth Metrics
   */
  async getGrowthMetrics(period: string = '7d'): Promise<GrowthMetrics> {
    const response = await this.makeRequest<GrowthMetrics>(`/analytics/growth-metrics?period=${period}`);
    return response.data!;
  }

  /**
   * PHASE 1.4: Contact Metrics
   */
  async getContactMetrics(period: string = '7d'): Promise<ContactMetrics> {
    const response = await this.makeRequest<ContactMetrics>(`/analytics/contact-metrics?period=${period}`);
    return response.data!;
  }

  /**
   * PHASE 2.1: Detailed Streaming Analytics
   */
  async getDetailedStreamingAnalytics(period: string = '7d'): Promise<StreamingAnalytics> {
    const response = await this.makeRequest<StreamingAnalytics>(`/analytics/streaming-analytics?period=${period}`);
    return response.data!;
  }

  /**
   * PHASE 2.2: Time-Based Analysis
   */
  async getTimeBasedAnalysis(period: string = '7d'): Promise<TimeBasedAnalysis> {
    const response = await this.makeRequest<TimeBasedAnalysis>(`/analytics/time-based-analysis?period=${period}`);
    return response.data!;
  }

  /**
   * PHASE 2.3: Page Performance Metrics
   */
  async getPagePerformanceMetrics(period: string = '7d'): Promise<PagePerformanceMetrics> {
    const response = await this.makeRequest<PagePerformanceMetrics>(`/analytics/page-performance?period=${period}`);
    return response.data!;
  }

  /**
   * PHASE 2.4: Enhanced Device Stats
   */
  async getEnhancedDeviceStats(period: string = '7d'): Promise<EnhancedDeviceStats> {
    const response = await this.makeRequest<EnhancedDeviceStats>(`/analytics/enhanced-device-stats?period=${period}`);
    return response.data!;
  }
}

export const analyticsService = new AnalyticsService();
