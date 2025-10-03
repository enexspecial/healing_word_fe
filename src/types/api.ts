// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Authentication Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[] | string // Backend returns string, but we want to support array too
  phone?: string
  phoneNumber?: string // Keep both for compatibility
  profileImageUrl?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface LoginResponse {
  tokens: AuthTokens
  user: User
  message: string
}

export interface RegisterResponse {
  tokens: AuthTokens
  user: User
  message: string
}

export interface RefreshTokenResponse {
  tokens: AuthTokens
  message: string
}

// User Management Types
export interface FindAllUsersOptions {
  page?: number
  limit?: number
  search?: string
  role?: string
  isActive?: boolean
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'lastLoginAt'
  sortOrder?: 'ASC' | 'DESC'
  includeRelations?: boolean
}

export interface FindAllUsersResult {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  isActive?: boolean
  roles?: string[]
  profileImageUrl?: string
}

// Legacy types for backward compatibility
export interface AdminLoginCredentials extends LoginCredentials {}
export interface AdminLoginResponse extends LoginResponse {}

// Keep the old User type as UserType for components that might reference it
export type UserType = User

// Streaming Types
export enum StreamingPlatform {
  YOUTUBE = 'youtube',
  FACEBOOK = 'facebook', 
  VIMEO = 'vimeo',
  ZOOM = 'zoom',
  CUSTOM = 'custom'
}

export interface Stream {
  id: string
  title: string
  description?: string
  platform: StreamingPlatform
  streamUrl?: string
  embedCode?: string
  isLive: boolean
  isActive: boolean
  scheduledStartTime?: string
  scheduledEndTime?: string
  actualStartTime?: string
  actualEndTime?: string
  thumbnailUrl?: string
  chatEnabled?: boolean
  viewerCount?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateStreamData {
  title: string
  description?: string
  scheduledStartTime: string
  scheduledEndTime?: string
  platform: StreamingPlatform
  streamUrl?: string
  embedCode?: string
  isLive?: boolean
  isActive?: boolean
  thumbnailUrl?: string
  notes?: string
}

export interface UpdateStreamData {
  title?: string
  description?: string
  scheduledStartTime?: string
  scheduledEndTime?: string
  platform?: StreamingPlatform
  streamUrl?: string
  embedCode?: string
  isLive?: boolean
  isActive?: boolean
  thumbnailUrl?: string
  notes?: string
  actualStartTime?: string
  actualEndTime?: string
}

export interface StreamSchedule {
  streams: Stream[]
  nextStream?: Stream
  upcomingStreams: Stream[]
}

export interface LiveStatus {
  isLive: boolean
  currentStream?: Stream
  viewerCount?: number
  startedAt?: string
}

// Dashboard Types
export interface DashboardOverview {
  totalUsers: number
  totalResources: number
  totalStreams: number
  totalFiles: number
  recentActivity: ActivityItem[]
}

export interface DashboardAnalytics {
  period: string
  groupBy: string
  data: AnalyticsData[]
}

export interface AnalyticsData {
  date: string
  users: number
  resources: number
  streams: number
  downloads: number
}

export interface DashboardStats {
  userGrowth: number
  resourceGrowth: number
  streamViews: number
  fileDownloads: number
}

export interface ActivityItem {
  id: string
  type: 'user' | 'resource' | 'stream' | 'file'
  action: string
  timestamp: string
  details: string
}

// User Management Types (duplicate removed - using the first definition above)

export interface CreateUserDto {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: string
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  phoneNumber?: string
}

export interface UpdateUserStatusDto {
  isActive: boolean
}

export interface AssignUserRolesDto {
  roles: string[]
}

export interface UserActivity {
  id: string
  action: string
  timestamp: string
  details: string
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisWeek: number
  userGrowthRate: number
}

// Resource Management Types
export interface Resource {
  id: string
  title: string
  description?: string
  type: 'devotional' | 'bible_study' | 'sermon_transcript' | 'prayer_guide' | 'youth_ministry' | 'family_resource'
  categoryId: string
  fileId?: string
  coverImageId?: string
  fileSize?: string
  pages?: number
  publishDate?: string
  downloadUrl?: string
  previewUrl?: string
  isNew: boolean
  isPopular: boolean
  downloadCount: number
  isActive: boolean
  tags?: string
  createdAt: string
  updatedAt: string
  // Relations
  author?: User
  category?: Category
  file?: File
  coverImage?: File
}

export interface CreateResourceDto {
  title: string
  description: string
  type: 'devotional' | 'bible_study' | 'sermon_transcript' | 'prayer_guide' | 'youth_ministry' | 'family_resource'
  categoryId: string
  fileId: string
  isNew?: boolean
  isPopular?: boolean
}

export interface UpdateResourceDto {
  title?: string
  description?: string
  categoryId?: string
  fileId?: string
}

export interface UpdateResourceStatusDto {
  isNew?: boolean
  isPopular?: boolean
}

export interface BulkUploadResourceDto {
  title: string
  description: string
  type: 'devotional' | 'bible_study' | 'sermon_transcript' | 'prayer_guide' | 'youth_ministry' | 'family_resource'
  categoryId: string
}

export interface ResourceStats {
  id: string
  downloads: number
  views: number
  shares: number
  rating: number
}

export interface ResourcesOverview {
  totalResources: number
  totalDownloads: number
  totalViews: number
  popularResources: Resource[]
}

// File Management Types
export interface File {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  path: string
  uploadedBy: string
  createdAt: string
}

export interface FileStorageStats {
  totalFiles: number
  totalSize: number
  averageFileSize: number
  storageUsed: number
  storageLimit: number
}

export interface FileAnalytics {
  id: string
  downloads: number
  views: number
  lastAccessed: string
}

// System Management Types
export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error'
  uptime: number
  memoryUsage: number
  cpuUsage: number
  diskUsage: number
}

export interface SystemConfig {
  maxFileSize: number
  allowedFileTypes: string[]
  maintenanceMode: boolean
  maxUploadsPerUser: number
}

export interface SystemLog {
  id: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  source: string
}

export interface PerformanceMetrics {
  responseTime: number
  throughput: number
  errorRate: number
  activeConnections: number
}

// Categories Types
export interface Category {
  id: string
  name: string
  description: string
  icon: string
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  description: string
  icon: string
}

export interface UpdateCategoryDto {
  name?: string
  description?: string
  icon?: string
}

// Legacy streaming types (kept for backward compatibility)
export interface CreateStreamDto extends CreateStreamData {}
export interface UpdateStreamDto extends UpdateStreamData {}

export interface StreamStatus {
  isLive: boolean
  currentViewers: number
  streamHealth: 'good' | 'fair' | 'poor'
}

// Church Information Types
export interface ChurchInfo {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    youtube?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateChurchInfoDto {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    youtube?: string
  }
}

export interface UpdateChurchInfoDto {
  name?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    youtube?: string
  }
}
