'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  full_name: string
  company_name: string
  is_admin: boolean
  status: string
  created_at: string
  updated_at: string
}

const defaultUser = {
  email: '',
  full_name: '',
  company_name: '',
  is_admin: false,
  status: 'active'
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState(defaultUser)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching users:', error)
      setMessage({ type: 'error', text: error.message })
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const openAddModal = () => {
    setEditingUser(null)
    setFormData(defaultUser)
    setShowModal(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email || '',
      full_name: user.full_name || '',
      company_name: user.company_name || '',
      is_admin: user.is_admin || false,
      status: user.status || 'active'
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Email is required' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            company_name: formData.company_name,
            is_admin: formData.is_admin,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingUser.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'User updated successfully!' })
      } else {
        // For adding new users, we need to use Supabase Auth Admin API
        // This requires server-side implementation
        setMessage({ type: 'error', text: 'To add new users, they must sign up through the registration page. You can invite them via email.' })
        setSaving(false)
        return
      }

      fetchUsers()
      setShowModal(false)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save user' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete "${user.email}"? This will also delete all their data.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'User deleted successfully!' })
      fetchUsers()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete user' })
    }
  }

  const updateStatus = async (user: User, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      setMessage({ type: 'success', text: `User ${newStatus === 'active' ? 'activated' : newStatus === 'suspended' ? 'suspended' : 'deactivated'}!` })
      fetchUsers()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update status' })
    }
  }

  const toggleAdmin = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !user.is_admin, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      setMessage({ type: 'success', text: user.is_admin ? 'Admin rights removed' : 'Admin rights granted' })
      fetchUsers()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update admin status' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600/20 text-green-400'
      case 'suspended': return 'bg-red-600/20 text-red-400'
      case 'inactive': return 'bg-gray-600/20 text-gray-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400 mt-1">Manage all registered users</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#313c48] text-white rounded-lg font-medium hover:bg-[#1a2028] transition-colors flex items-center gap-2"
        >
          <span>➕</span> Invite User
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
          message.type === 'success' 
            ? 'bg-green-900/30 text-green-400 border border-green-700' 
            : 'bg-red-900/30 text-red-400 border border-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-400">
            {users.filter(u => u.status === 'active' || !u.status).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Suspended</p>
          <p className="text-2xl font-bold text-red-400">
            {users.filter(u => u.status === 'suspended').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Admins</p>
          <p className="text-2xl font-bold text-[#3385ff]">
            {users.filter(u => u.is_admin).length}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by email, name, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#3385ff]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={fetchUsers}
          className="px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Company</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#313c48] rounded-full flex items-center justify-center text-white font-medium">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.full_name || 'No name'}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {user.company_name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_admin ? (
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs font-medium rounded-full">
                          👑 Admin
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs font-medium rounded-full">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status || 'active')}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => toggleAdmin(user)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.is_admin 
                              ? 'text-purple-400 hover:bg-purple-600/20' 
                              : 'text-gray-400 hover:text-purple-400 hover:bg-gray-700'
                          }`}
                          title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                        >
                          👑
                        </button>
                        {user.status === 'suspended' ? (
                          <button
                            onClick={() => updateStatus(user, 'active')}
                            className="p-2 text-green-400 hover:bg-green-600/20 rounded-lg transition-colors"
                            title="Activate"
                          >
                            ✅
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(user, 'suspended')}
                            className="p-2 text-orange-400 hover:bg-orange-600/20 rounded-lg transition-colors"
                            title="Suspend"
                          >
                            🚫
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? 'No users found matching your filters' : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? 'Edit User' : 'Invite New User'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {!editingUser && (
                <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3">
                  <p className="text-amber-400 text-sm">
                    💡 New users must sign up through the registration page. You can share the signup link with them.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!!editingUser}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff]"
                >
                  <option value="active">✅ Active</option>
                  <option value="suspended">🚫 Suspended</option>
                  <option value="inactive">⏸️ Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
                <div>
                  <p className="text-white font-medium">Admin Access</p>
                  <p className="text-gray-400 text-sm">Grant super admin privileges</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, is_admin: !formData.is_admin })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.is_admin ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    formData.is_admin ? 'left-8' : 'left-1'
                  }`}></span>
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              {editingUser && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-[#313c48] text-white rounded-lg font-medium hover:bg-[#1a2028] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Update User'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
