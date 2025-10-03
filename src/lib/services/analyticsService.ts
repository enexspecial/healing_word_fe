import { ApiResponse } from '@/types/api';

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
}

export const analyticsService = new AnalyticsService();
