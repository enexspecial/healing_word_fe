'use client'

import { useState, useEffect } from 'react'
import { 
  Save, 
  Settings,
  Bell,
  Shield,
  Database,
  Globe,
  Mail,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  HardDrive,
  Server,
  Monitor
} from 'lucide-react'
import { useSystemConfig, useSystemStatus, useSystemLogs, usePerformanceMetrics } from '@/lib/hooks/useAdminApi'
import { useAdminAuth } from '@/lib/hooks/useAdminAuth'

interface SystemConfigData {
  database: {
    host: string
    port: string
    name: string
    type: string
  }
  jwt: {
    secret: string | undefined
    expiresIn: string
  }
  storage: {
    type: string
    path: string
    aws: {
      region: string
      bucket: string
      accessKey: string | undefined
    }
  }
  server: {
    port: string
    cors: string
    environment: string
  }
  external: {
    youtube: string
    facebook: string
    vimeo: string
  }
}

interface ChurchInfoData {
  key: string
  value: string
  description: string
  group: string
  isActive: boolean
  imageUrl?: string
  metadata?: string
}

export default function SettingsPage() {
  const { isAuthenticated } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('system')
  const [isEditing, setIsEditing] = useState(false)
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  
  // API hooks
  const { data: systemConfig, loading: configLoading, error: configError, fetchConfig, updateConfig } = useSystemConfig()
  const { data: systemStatus, loading: statusLoading, error: statusError, fetchStatus } = useSystemStatus()
  const { data: systemLogs, loading: logsLoading, error: logsError, fetchLogs } = useSystemLogs()
  const { data: performanceMetrics, loading: metricsLoading, error: metricsError, fetchMetrics } = usePerformanceMetrics()

  // Local state for editing
  const [editableConfig, setEditableConfig] = useState<Partial<SystemConfigData>>({})
  const [originalConfig, setOriginalConfig] = useState<Partial<SystemConfigData>>({})

  const tabs = [
    { id: 'system', name: 'System', icon: Server },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'storage', name: 'Storage', icon: HardDrive },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Globe },
    { id: 'performance', name: 'Performance', icon: Monitor },
    { id: 'logs', name: 'System Logs', icon: Bell }
  ]

  // Debug: Log tabs for verification
  console.log('Available tabs:', tabs.map(t => t.id))
  console.log('Active tab:', activeTab)

  useEffect(() => {
    if (isAuthenticated) {
      fetchConfig()
      fetchStatus()
      fetchMetrics()
      fetchLogs()
    }
  }, [isAuthenticated, fetchConfig, fetchStatus, fetchMetrics, fetchLogs])

  useEffect(() => {
    if (systemConfig) {
      setEditableConfig(systemConfig)
      setOriginalConfig(systemConfig)
    }
  }, [systemConfig])

  const handleSave = async () => {
    try {
      await updateConfig(editableConfig)
      setIsEditing(false)
      setOriginalConfig({ ...editableConfig })
      fetchConfig() // Refresh data
    } catch (error) {
      console.error('Failed to update system configuration:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditableConfig({ ...originalConfig })
  }

  const handleEdit = () => {
    setOriginalConfig({ ...editableConfig })
    setIsEditing(true)
  }

  const renderSystemTab = () => {
    console.log('Rendering System Tab')
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Server Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                {systemConfig?.server?.environment || 'Not configured'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                {systemConfig?.server?.port || 'Not configured'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CORS Origin</label>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                {systemConfig?.server?.cors || 'Not configured'}
              </p>
            </div>
          </div>
        </div>

        {systemStatus && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{systemStatus.uptime?.toFixed(0)}s</div>
                <div className="text-sm text-green-600">Uptime</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{systemStatus.version || '1.0.0'}</div>
                <div className="text-sm text-blue-600">Version</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {systemStatus.startTime ? new Date(systemStatus.startTime).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-sm text-purple-600">Start Date</div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderDatabaseTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Database Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Database Type</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {systemConfig?.database?.type || 'Not configured'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Host</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {systemConfig?.database?.host || 'Not configured'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {systemConfig?.database?.port || 'Not configured'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Database Name</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {systemConfig?.database?.name || 'Not configured'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStorageTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Storage Type</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {systemConfig?.storage?.type || 'Not configured'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Storage Path</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {systemConfig?.storage?.path || 'Not configured'}
            </p>
          </div>
          
          {systemConfig?.storage?.type === 's3' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AWS Region</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {systemConfig?.storage?.aws?.region || 'Not configured'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">S3 Bucket</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {systemConfig?.storage?.aws?.bucket || 'Not configured'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">JWT Expiration</label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {systemConfig?.jwt?.expiresIn || 'Not configured'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">JWT Secret</label>
            <div className="flex items-center space-x-2">
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md flex-1">
                {systemConfig?.jwt?.secret ? '••••••••••••••••' : 'Not configured'}
              </p>
              <button
                type="button"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={showSensitiveData ? 'Hide sensitive data' : 'Show sensitive data'}
              >
                {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {showSensitiveData && systemConfig?.jwt?.secret && (
              <p className="text-xs text-gray-500 mt-1 font-mono">
                {systemConfig.jwt.secret}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">External Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg border">
            <div className="text-lg font-medium text-gray-900 mb-2">YouTube</div>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              systemConfig?.external?.youtube === 'configured' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {systemConfig?.external?.youtube === 'configured' ? 'Configured' : 'Not Configured'}
            </div>
          </div>
          
          <div className="text-center p-4 rounded-lg border">
            <div className="text-lg font-medium text-gray-900 mb-2">Facebook</div>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              systemConfig?.external?.facebook === 'configured' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {systemConfig?.external?.facebook === 'configured' ? 'Configured' : 'Not Configured'}
            </div>
          </div>
          
          <div className="text-center p-4 rounded-lg border">
            <div className="text-lg font-medium text-gray-900 mb-2">Vimeo</div>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              systemConfig?.external?.vimeo === 'configured' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {systemConfig?.external?.vimeo === 'configured' ? 'Configured' : 'Not Configured'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {performanceMetrics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {performanceMetrics.responseTime ? `${performanceMetrics.responseTime}ms` : 'N/A'}
              </div>
              <div className="text-sm text-blue-600">Response Time</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {performanceMetrics.throughput || 'N/A'}
              </div>
              <div className="text-sm text-green-600">Throughput</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {performanceMetrics.errorRate ? `${performanceMetrics.errorRate}%` : 'N/A'}
              </div>
              <div className="text-sm text-yellow-600">Error Rate</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {performanceMetrics.activeConnections || 'N/A'}
              </div>
              <div className="text-sm text-purple-600">Active Connections</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderLogsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">System Logs</h3>
          <button
            onClick={() => fetchLogs()}
            disabled={logsLoading}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {logsLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </button>
        </div>
        
        {logsLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Loading logs...</p>
          </div>
        ) : systemLogs && systemLogs.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {systemLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.level === 'error' ? 'bg-red-500' :
                  log.level === 'warn' ? 'bg-yellow-500' :
                  log.level === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{log.message}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Source: {log.source} | Level: {log.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No logs available
          </div>
        )}
      </div>
    </div>
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Authentication required to access settings</p>
        </div>
      </div>
    )
  }

  if (configLoading && statusLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading system configuration...</p>
        </div>
      </div>
    )
  }

  if (configError || statusError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">
            {configError || statusError || 'Failed to load system configuration'}
          </p>
          <button 
            onClick={() => {
              fetchConfig()
              fetchStatus()
            }} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Manage system configuration and monitor performance.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  console.log('Clicking tab:', tab.id)
                  setActiveTab(tab.id)
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Debug info */}
          <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
            Active Tab: {activeTab} | System Config: {systemConfig ? 'Loaded' : 'Not Loaded'} | Status: {systemStatus ? 'Loaded' : 'Not Loaded'}
          </div>
          
          {activeTab === 'system' && renderSystemTab()}
          {activeTab === 'database' && renderDatabaseTab()}
          {activeTab === 'storage' && renderStorageTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'integrations' && renderIntegrationsTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'logs' && renderLogsTab()}
          
          {/* Fallback for unknown tabs */}
          {!['system', 'database', 'storage', 'security', 'integrations', 'performance', 'logs'].includes(activeTab) && (
            <div className="text-center py-8 text-gray-500">
              Tab "{activeTab}" not found
            </div>
          )}
          
          {/* Test tab content */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-medium text-yellow-800 mb-2">Debug Information</h4>
            <p className="text-sm text-yellow-700">
              Current tab: <strong>{activeTab}</strong> | 
              Tabs available: <strong>{tabs.map(t => t.id).join(', ')}</strong> | 
              System config loaded: <strong>{systemConfig ? 'Yes' : 'No'}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}