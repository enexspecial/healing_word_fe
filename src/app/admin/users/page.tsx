'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Trash2, 
  User,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react'
import { useUsers } from '@/lib/hooks/useUsers'
import { usePermissions } from '@/lib/hooks/usePermissions'
import { User as UserType } from '@/types/api'

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Utility function to normalize roles (handle both string and array)
  const normalizeRoles = (roles: string | string[]): string[] => {
    return Array.isArray(roles) ? roles : [roles]
  }

  const { getAllUsers, createUser, deleteUser, updateUserStatus, searchUsers, loading, error } = useUsers()
  const { can, isSuperAdmin } = usePermissions()
  
  // State for users data
  const [users, setUsers] = useState<UserType[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Form state for new user
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: ''
  })

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [currentPage, pageSize, searchTerm, selectedRole, selectedStatus])

  const loadUsers = async () => {
    try {
      const result = await getAllUsers({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        role: selectedRole === 'All' ? undefined : selectedRole,
        isActive: selectedStatus === 'All' ? undefined : selectedStatus === 'Active',
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      })
      
      if (result) {
        setUsers(result.users)
        setTotalUsers(result.total)
        setTotalPages(result.totalPages)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        ...(formData.role && { role: formData.role }),
        // No password needed - AuthService will generate temporary password
      })

      if (result) {
        // Check if temporary password is included in response
        const responseData = result as any;
        if (responseData.temporaryPassword) {
          alert(`User created successfully!\n\nTemporary password: ${responseData.temporaryPassword}\n\nPlease share this password with the user securely. An email may also be sent if the email service is working.`)
        } else {
          alert('User created successfully! A temporary password has been sent to their email.')
        }
        setShowAddModal(false)
        resetForm()
        loadUsers() // Refresh the user list
      } else {
        alert('Failed to create user')
      }
    } catch (error: any) {
      console.error('Error creating user:', error)
      alert(error.message || 'An error occurred while creating the user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const result = await deleteUser(userId)
      if (result) {
        alert('User deleted successfully!')
        loadUsers() // Refresh the user list
      } else {
        alert('Failed to delete user')
      }
    } catch (error: any) {
      console.error('Error deleting user:', error)
      alert(error.message || 'An error occurred while deleting the user')
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    const action = currentStatus ? 'suspend' : 'activate'
    if (!confirm(`Are you sure you want to ${action} user "${userName}"?`)) {
      return
    }

    try {
      const result = await updateUserStatus(userId, !currentStatus)
      if (result) {
        alert(`User ${action}d successfully!`)
        loadUsers() // Refresh the user list
      } else {
        alert(`Failed to ${action} user`)
      }
    } catch (error: any) {
      console.error(`Error ${action}ing user:`, error)
      alert(error.message || `An error occurred while ${action}ing the user`)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: ''
    })
  }

  const closeModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  // Users data is managed by state from our custom hook

  // Get available roles and statuses from the data
  const availableRoles = ['All', 'super_admin', 'content_admin', 'ministry_leader', 'technical_admin', 'regular_user']
  const availableStatuses = ['All', 'Active', 'Inactive']

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user?.email?.toLowerCase().includes(searchTerm.toLowerCase())) || false
    const matchesRole = selectedRole === 'All' || user?.role === selectedRole
    const matchesStatus = selectedStatus === 'All' || user?.isActive === (selectedStatus === 'Active')
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => { 
    const roleStyles = {
      'super_admin': 'bg-red-100 text-red-800',
      'content_admin': 'bg-blue-100 text-blue-800',
      'ministry_leader': 'bg-green-100 text-green-800',
      'technical_admin': 'bg-purple-100 text-purple-800',
      'regular_user': 'bg-gray-100 text-gray-800'
    }
    
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyles[role as keyof typeof roleStyles] || 'bg-gray-100 text-gray-800'}`
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive':
        return <XCircle className="h-4 w-4 text-yellow-500" />
      case 'suspended':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button 
            onClick={loadUsers}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
          >
            <div className={`h-4 w-4 mr-2 ${loading ? 'animate-spin rounded-full border-b-2 border-white' : ''}`}></div>
            Refresh
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by role"
              title="Filter by role"
              disabled={loading}
            >
              {availableRoles.map((role: string) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
              title="Filter by status"
              disabled={loading}
            >
              {availableStatuses.map((status: string) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Users loading/error state */}
        {loading && (
          <div className="mt-3 text-sm text-blue-600">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
              Loading users...
            </div>
          </div>
        )}
        {!loading && error && (
          <div className="mt-3 text-sm text-red-600">
            Error loading users: {error}
          </div>
        )}
        {!loading && !error && users.length === 0 && (
          <div className="mt-3 text-sm text-yellow-600">
            No users found. The system may be empty or there was an issue loading data.
          </div>
        )}
      </div>

      {/* Users table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Users ({filteredUsers.length})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Active Users: {filteredUsers.filter(u => u?.isActive).length}</span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading users: {error}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: UserType) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user?.firstName || 'Unknown'} {user?.lastName || 'User'}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        <span className={getRoleBadge(user?.role || 'unknown')}>
                          {(user?.role || 'unknown').replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(user?.isActive ? 'active' : 'inactive')}
                        <span className="ml-2">{getStatusBadge(user?.isActive ? 'active' : 'inactive')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user?.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleToggleStatus(user?.id || '', user?.isActive || false, `${user?.firstName || 'Unknown'} ${user?.lastName || 'User'}`)}
                          className={`${user?.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                          title={user?.isActive ? 'Suspend User' : 'Activate User'}
                        >
                          {user?.isActive ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        {isSuperAdmin && (
                          <button 
                            onClick={() => handleDeleteUser(user?.id || '', `${user?.firstName || 'Unknown'} ${user?.lastName || 'User'}`)}
                            className="text-red-600 hover:text-red-900" 
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
                title="Close Modal"
                aria-label="Close Modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Phone Number and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a role (optional)</option>
                    <option value="ministry_leader">Ministry Leader</option>
                    <option value="media">Media</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create User
                    </>
                    )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
