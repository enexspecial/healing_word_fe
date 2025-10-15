import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'

export enum Permission {
  // User Management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  
  // Resource Management
  CREATE_RESOURCE = 'create_resource',
  READ_RESOURCE = 'read_resource',
  UPDATE_RESOURCE = 'update_resource',
  DELETE_RESOURCE = 'delete_resource',
  
  // Reports Management
  CREATE_REPORT = 'create_report',
  READ_REPORT = 'read_report',
  UPDATE_REPORT = 'update_report',
  DELETE_REPORT = 'delete_report',
  APPROVE_REPORT = 'approve_report',
  REJECT_REPORT = 'reject_report',
  
  // Live Streaming
  CREATE_STREAM = 'create_stream',
  READ_STREAM = 'read_stream',
  UPDATE_STREAM = 'update_stream',
  DELETE_STREAM = 'delete_stream',
  START_STREAM = 'start_stream',
  STOP_STREAM = 'stop_stream',
  
  // Church Information
  READ_CHURCH_INFO = 'read_church_info',
  UPDATE_CHURCH_INFO = 'update_church_info',
  
  // Analytics & Dashboard
  READ_ANALYTICS = 'read_analytics',
  READ_DASHBOARD = 'read_dashboard',
  
  // System
  READ_SYSTEM_STATUS = 'read_system_status',
  UPDATE_SYSTEM_CONFIG = 'update_system_config',
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MEDIA = 'media',
  MINISTRY_LEADER = 'ministry_leader',
}

const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // User Management - Full Access
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    
    // Resource Management - Full Access
    Permission.CREATE_RESOURCE,
    Permission.READ_RESOURCE,
    Permission.UPDATE_RESOURCE,
    Permission.DELETE_RESOURCE,
    
    // Reports - Full Access
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,
    Permission.UPDATE_REPORT,
    Permission.DELETE_REPORT,
    Permission.APPROVE_REPORT,
    Permission.REJECT_REPORT,
    
    // Live Streaming - Full Access
    Permission.CREATE_STREAM,
    Permission.READ_STREAM,
    Permission.UPDATE_STREAM,
    Permission.DELETE_STREAM,
    Permission.START_STREAM,
    Permission.STOP_STREAM,
    
    // Church Info - Full Access
    Permission.READ_CHURCH_INFO,
    Permission.UPDATE_CHURCH_INFO,
    
    // Analytics & Dashboard - Full Access
    Permission.READ_ANALYTICS,
    Permission.READ_DASHBOARD,
    
    // System - Full Access
    Permission.READ_SYSTEM_STATUS,
    Permission.UPDATE_SYSTEM_CONFIG,
  ],
  
  [UserRole.ADMIN]: [
    // User Management - All except Delete and Update Role
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    // Note: DELETE_USER is intentionally excluded
    
    // Resource Management - Full Access
    Permission.CREATE_RESOURCE,
    Permission.READ_RESOURCE,
    Permission.UPDATE_RESOURCE,
    Permission.DELETE_RESOURCE,
    
    // Reports - Full Access
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,
    Permission.UPDATE_REPORT,
    Permission.DELETE_REPORT,
    Permission.APPROVE_REPORT,
    Permission.REJECT_REPORT,
    
    // Live Streaming - Full Access
    Permission.CREATE_STREAM,
    Permission.READ_STREAM,
    Permission.UPDATE_STREAM,
    Permission.DELETE_STREAM,
    Permission.START_STREAM,
    Permission.STOP_STREAM,
    
    // Church Info - Full Access
    Permission.READ_CHURCH_INFO,
    Permission.UPDATE_CHURCH_INFO,
    
    // Analytics & Dashboard - Full Access
    Permission.READ_ANALYTICS,
    Permission.READ_DASHBOARD,
    
    // System - Read Only
    Permission.READ_SYSTEM_STATUS,
  ],
  
  [UserRole.MEDIA]: [
    // User Management - Read Only
    Permission.READ_USER,
    
    // Resource Management - Full Access
    Permission.CREATE_RESOURCE,
    Permission.READ_RESOURCE,
    Permission.UPDATE_RESOURCE,
    Permission.DELETE_RESOURCE,
    
    // Reports - Create, Read Own, Edit Own (DELETE_REPORT for own reports)
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,
    Permission.UPDATE_REPORT,
    Permission.DELETE_REPORT,
    
    // Live Streaming - Full Access
    Permission.CREATE_STREAM,
    Permission.READ_STREAM,
    Permission.UPDATE_STREAM,
    Permission.DELETE_STREAM,
    Permission.START_STREAM,
    Permission.STOP_STREAM,
    
    // Church Info - Read Only
    Permission.READ_CHURCH_INFO,
    
    // Analytics & Dashboard - Read Only
    Permission.READ_ANALYTICS,
    Permission.READ_DASHBOARD,
  ],
  
  [UserRole.MINISTRY_LEADER]: [
    // User Management - Read Only
    Permission.READ_USER,
    
    // Resource Management - Read Only
    Permission.READ_RESOURCE,
    
    // Reports - Create, Read, Edit Own
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,
    Permission.UPDATE_REPORT,
    
    // Live Streaming - Read Only
    Permission.READ_STREAM,
    
    // Church Info - Read Only
    Permission.READ_CHURCH_INFO,
    
    // Analytics & Dashboard - Read Only
    Permission.READ_ANALYTICS,
    Permission.READ_DASHBOARD,
  ],
  
}

function hasPermission(userRoles: UserRole[], permission: Permission): boolean {
  return userRoles.some(role => RolePermissions[role]?.includes(permission))
}

export function usePermissions() {
  const user = useSelector((state: RootState) => state.adminAuth.user)
  
  const userRoles: UserRole[] = (user?.roles || []) as UserRole[]
  const userPermissions: Permission[] = (user?.permissions || []) as Permission[]
  
  // Use permissions from backend if available, otherwise calculate from roles
  const can = (permission: Permission): boolean => {
    if (userPermissions.length > 0) {
      return userPermissions.includes(permission)
    }
    return hasPermission(userRoles, permission)
  }
  
  const canAny = (permissions: Permission[]): boolean => {
    return permissions.some(permission => can(permission))
  }
  
  const canAll = (permissions: Permission[]): boolean => {
    return permissions.every(permission => can(permission))
  }
  
  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role)
  }
  
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => userRoles.includes(role))
  }
  
  return {
    can,
    canAny,
    canAll,
    hasRole,
    hasAnyRole,
    userRoles,
    userPermissions,
    isSuperAdmin: hasRole(UserRole.SUPER_ADMIN),
    isAdmin: hasRole(UserRole.ADMIN),
    isMedia: hasRole(UserRole.MEDIA),
    isMinistryLeader: hasRole(UserRole.MINISTRY_LEADER),
  }
}

