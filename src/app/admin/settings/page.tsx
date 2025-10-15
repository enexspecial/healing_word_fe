'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { 
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Users,
  Lock,
  Trash2,
  Plus,
  Edit,
  X,
  Loader2
} from 'lucide-react'
import { useAdminAuth } from '@/lib/hooks/useAdminAuth'
import { RootState } from '@/lib/store'
import { adminApiService } from '@/lib/services/adminApiService'
import { adminAuthService } from '@/lib/services/adminAuthService'
import UserSearchInput from '@/components/forms/UserSearchInput'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
}

interface Department {
  id: string
  name: string
  departmentNumber: string
  memberCount: number
  headOfDepartment: string
  headOfDepartmentUser?: User // For the selected user object
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function SettingsPage() {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.adminAuth)
  const [activeTab, setActiveTab] = useState('departments')
  
  // Department state
  const [departments, setDepartments] = useState<Department[]>([])
  const [showAddDepartment, setShowAddDepartment] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [newDepartment, setNewDepartment] = useState({ 
    name: '', 
    departmentNumber: '', 
    headOfDepartment: '',
    headOfDepartmentUser: null as User | null,
    memberCount: 0,
    description: '' 
  })
  
  // Loading and error states
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false)
  const [isSavingDepartment, setIsSavingDepartment] = useState(false)
  const [isDeletingDepartment, setIsDeletingDepartment] = useState<string | null>(null)
  const [departmentError, setDepartmentError] = useState<string | null>(null)
  
  // Password change state
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null)

  const tabs = [
    { id: 'departments', name: 'Departments', icon: Users },
    { id: 'account', name: 'Account', icon: Lock }
  ]

  // Fetch departments on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDepartments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const fetchDepartments = async () => {
    setIsLoadingDepartments(true)
    setDepartmentError(null)
    
    try {
      const response = await adminApiService.getAllDepartments()
      
      if (response.success && response.data) {
        // Handle double-wrapped response from backend
        const actualData = (response.data as any).data || response.data
        // Ensure we have an array
        const departmentsArray = Array.isArray(actualData) ? actualData : []
        setDepartments(departmentsArray)
      } else {
        setDepartmentError(response.error || 'Failed to fetch departments')
        setDepartments([]) // Set empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      setDepartmentError('An error occurred while fetching departments')
      setDepartments([]) // Set empty array as fallback
    } finally {
      setIsLoadingDepartments(false)
    }
  }

  // Department handlers
  const handleAddDepartment = async () => {
    if (!newDepartment.name || !newDepartment.departmentNumber || !newDepartment.headOfDepartmentUser) {
      setDepartmentError('Please fill in all required fields and select a department head')
      return
    }

    setIsSavingDepartment(true)
    setDepartmentError(null)

    try {
      const response = await adminApiService.createDepartment({
        name: newDepartment.name,
        departmentNumber: newDepartment.departmentNumber,
        headOfDepartment: `${newDepartment.headOfDepartmentUser.firstName} ${newDepartment.headOfDepartmentUser.lastName}`,
        memberCount: newDepartment.memberCount || 0,
        description: newDepartment.description || undefined,
      })

      if (response.success && response.data) {
        setDepartments([...departments, response.data])
        setNewDepartment({ 
          name: '', 
          departmentNumber: '', 
          headOfDepartment: '',
          headOfDepartmentUser: null,
          memberCount: 0,
          description: '' 
        })
        setShowAddDepartment(false)
      } else {
        setDepartmentError(response.error || 'Failed to create department')
      }
    } catch (error) {
      setDepartmentError('An error occurred while creating department')
    } finally {
      setIsSavingDepartment(false)
    }
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
    setDepartmentError(null)
  }

  const handleUpdateDepartment = async () => {
    if (!editingDepartment) return

    if (!editingDepartment?.name || !editingDepartment?.departmentNumber || !editingDepartment?.headOfDepartment) {
      setDepartmentError('Please fill in all required fields')
      return
    }

    setIsSavingDepartment(true)
    setDepartmentError(null)

    try {
      const response = await adminApiService.updateDepartment(editingDepartment.id, {
        name: editingDepartment.name,
        departmentNumber: editingDepartment.departmentNumber,
        headOfDepartment: editingDepartment.headOfDepartment,
        memberCount: editingDepartment.memberCount,
        description: editingDepartment.description,
        isActive: editingDepartment.isActive,
      })

      if (response.success && response.data) {
        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id ? response.data : dept
        ))
        setEditingDepartment(null)
      } else {
        setDepartmentError(response.error || 'Failed to update department')
      }
    } catch (error) {
      setDepartmentError('An error occurred while updating department')
    } finally {
      setIsSavingDepartment(false)
    }
  }

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) {
      return
    }

    setIsDeletingDepartment(id)
    setDepartmentError(null)

    try {
      const response = await adminApiService.deleteDepartment(id)

      if (response.success) {
        setDepartments(departments.filter(dept => dept.id !== id))
      } else {
        setDepartmentError(response.error || 'Failed to delete department')
      }
    } catch (error) {
      setDepartmentError('An error occurred while deleting department')
    } finally {
      setIsDeletingDepartment(null)
    }
  }

  // Password change handlers
  const handlePasswordChange = async () => {
    setPasswordChangeError(null)
    setPasswordChangeSuccess(false)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordChangeError('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordChangeError('Password must be at least 8 characters long')
      return
    }

    if (!passwordData.currentPassword) {
      setPasswordChangeError('Current password is required')
      return
    }

    setIsChangingPassword(true)

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
      
      if (!token) {
        setPasswordChangeError('Authentication token not found. Please log in again.')
        return
      }

      const response = await adminAuthService.changePassword(token, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      })

      if (response.success) {
        setPasswordChangeSuccess(true)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setPasswordChangeSuccess(false), 5000)
      } else {
        setPasswordChangeError(response.error || 'Failed to change password')
      }
    } catch (error) {
      setPasswordChangeError('An error occurred while changing password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Delete account handlers
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteAccountError('Please type DELETE to confirm')
      return
    }

    if (!user?.id) {
      setDeleteAccountError('User information not found')
      return
    }

    setIsDeletingAccount(true)
    setDeleteAccountError(null)

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
      
      if (!token) {
        setDeleteAccountError('Authentication token not found. Please log in again.')
        return
      }

      const response = await adminAuthService.deleteAccount(token, user.id)

      if (response.success) {
        alert('Account deleted successfully. You will be logged out.')
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
      } else {
        setDeleteAccountError(response.error || 'Failed to delete account')
      }
    } catch (error) {
      setDeleteAccountError('An error occurred while deleting account')
    } finally {
      setIsDeletingAccount(false)
      setShowDeleteConfirm(false)
      setDeleteConfirmText('')
    }
  }

  const renderDepartmentsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Departments</h3>
          <button
            onClick={() => setShowAddDepartment(true)}
            disabled={isSavingDepartment}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </button>
        </div>

        {/* Error message */}
        {departmentError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
            <span className="text-red-700">{departmentError}</span>
          </div>
        )}

        {/* Add Department Modal */}
        {showAddDepartment && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Add New Department</h4>
              <button 
                onClick={() => {
                  setShowAddDepartment(false)
                  setNewDepartment({ 
                    name: '', 
                    departmentNumber: '', 
                    headOfDepartment: '',
                    headOfDepartmentUser: null,
                    memberCount: 0,
                    description: '' 
                  })
                  setDepartmentError(null)
                }}
                disabled={isSavingDepartment}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label="Close add department form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Department Name *"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  disabled={isSavingDepartment}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="Department Number (e.g., DEPT-006) *"
                  value={newDepartment.departmentNumber}
                  onChange={(e) => setNewDepartment({ ...newDepartment, departmentNumber: e.target.value })}
                  disabled={isSavingDepartment}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Head of Department *
                  </label>
                  <UserSearchInput
                    value={newDepartment.headOfDepartmentUser}
                    onChange={(user) => setNewDepartment({ ...newDepartment, headOfDepartmentUser: user })}
                    placeholder="Search for department head..."
                    disabled={isSavingDepartment}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Number of members"
                    value={newDepartment.memberCount}
                    onChange={(e) => setNewDepartment({ ...newDepartment, memberCount: parseInt(e.target.value) || 0 })}
                    disabled={isSavingDepartment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Department description (optional)"
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  disabled={isSavingDepartment}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowAddDepartment(false)
                  setNewDepartment({ 
                    name: '', 
                    departmentNumber: '', 
                    headOfDepartment: '',
                    headOfDepartmentUser: null,
                    memberCount: 0,
                    description: '' 
                  })
                  setDepartmentError(null)
                }}
                disabled={isSavingDepartment}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                disabled={isSavingDepartment}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingDepartment && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isSavingDepartment ? 'Adding...' : 'Add Department'}
              </button>
            </div>
          </div>
        )}

        {/* Departments Table */}
        {isLoadingDepartments ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading departments...</span>
          </div>
        ) : (departments || []).length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No departments found</p>
            <button
              onClick={() => setShowAddDepartment(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first department
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Head of Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(departments || []).map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  {editingDepartment?.id === dept.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editingDepartment?.departmentNumber || ''}
                          onChange={(e) => editingDepartment && setEditingDepartment({ ...editingDepartment, departmentNumber: e.target.value })}
                          disabled={isSavingDepartment}
                          className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                          aria-label="Edit department number"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editingDepartment?.name || ''}
                          onChange={(e) => editingDepartment && setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                          disabled={isSavingDepartment}
                          className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                          aria-label="Edit department name"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editingDepartment?.headOfDepartment || ''}
                          onChange={(e) => editingDepartment && setEditingDepartment({ ...editingDepartment, headOfDepartment: e.target.value })}
                          disabled={isSavingDepartment}
                          className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                          aria-label="Edit head of department"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={editingDepartment?.memberCount || 0}
                          onChange={(e) => editingDepartment && setEditingDepartment({ ...editingDepartment, memberCount: parseInt(e.target.value) || 0 })}
                          disabled={isSavingDepartment}
                          className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 w-20"
                          aria-label="Edit member count"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(dept.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={handleUpdateDepartment}
                          disabled={isSavingDepartment}
                          className="text-green-600 hover:text-green-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Save department changes"
                        >
                          {isSavingDepartment ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingDepartment(null)
                            setDepartmentError(null)
                          }}
                          disabled={isSavingDepartment}
                          className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          aria-label="Cancel editing department"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept.departmentNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.headOfDepartment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.memberCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(dept.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditDepartment(dept)}
                          disabled={!!editingDepartment || !!isDeletingDepartment}
                          className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Edit ${dept.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
                          disabled={!!editingDepartment || isDeletingDepartment === dept.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Delete ${dept.name}`}
                        >
                          {isDeletingDepartment === dept.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  const renderAccountTab = () => (
    <div className="space-y-6">
      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        
        {passwordChangeSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-700">Password changed successfully!</span>
          </div>
        )}

        {passwordChangeError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
            <span className="text-red-700">{passwordChangeError}</span>
          </div>
        )}

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                disabled={isChangingPassword}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isChangingPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                disabled={isChangingPassword}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter new password (min. 8 characters)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isChangingPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                disabled={isChangingPassword}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isChangingPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={isChangingPassword}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </>
            )}
          </button>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white p-6 rounded-lg shadow border-2 border-red-100">
        <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        {deleteAccountError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
            <span className="text-red-700">{deleteAccountError}</span>
          </div>
        )}

        {!showDeleteConfirm ? (
          <button
            onClick={() => {
              setShowDeleteConfirm(true)
              setDeleteAccountError(null)
            }}
            disabled={isDeletingAccount}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </button>
        ) : (
          <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div>
              <p className="text-sm text-red-800 mb-2 font-medium">
                This action cannot be undone. Type <span className="font-bold">DELETE</span> to confirm.
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                disabled={isDeletingAccount}
                className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Type DELETE to confirm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                  setDeleteAccountError(null)
                }}
                disabled={isDeletingAccount}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isDeletingAccount}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting Account...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Confirm Delete Account
                  </>
                )}
              </button>
            </div>
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage departments and account settings.</p>
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
                onClick={() => setActiveTab(tab.id)}
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
          {activeTab === 'departments' && renderDepartmentsTab()}
          {activeTab === 'account' && renderAccountTab()}
        </div>
      </div>
    </div>
  )
}