'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  profiles?: { email: string; full_name: string }
  plans?: { name: string; price_monthly: number }
}

interface Plan {
  id: string
  name: string
  price_monthly: number
}

interface User {
  id: string
  email: string
  full_name: string
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSub, setEditingSub] = useState<Subscription | null>(null)
  const [formData, setFormData] = useState({
    user_id: '',
    plan_id: '',
    status: 'active',
    current_period_end: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch subscriptions
    const { data: subsData, error: subsError } = await supabase
      .from('subscriptions')
      .select('*, profiles(email, full_name), plans(name, price_monthly)')
      .order('created_at', { ascending: false })
    
    if (subsError) {
      console.error('Error fetching subscriptions:', subsError)
    } else {
      setSubscriptions(subsData || [])
    }

    // Fetch plans
    const { data: plansData } = await supabase
      .from('plans')
      .select('id, name, price_monthly')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true })
    
    setPlans(plansData || [])

    // Fetch users
    const { data: usersData } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .order('email', { ascending: true })
    
    setUsers(usersData || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plans?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const openAddModal = () => {
    setEditingSub(null)
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setFormData({
      user_id: '',
      plan_id: plans[0]?.id || '',
      status: 'active',
      current_period_end: nextMonth.toISOString().split('T')[0]
    })
    setShowModal(true)
  }

  const openEditModal = (sub: Subscription) => {
    setEditingSub(sub)
    setFormData({
      user_id: sub.user_id,
      plan_id: sub.plan_id,
      status: sub.status,
      current_period_end: sub.current_period_end ? sub.current_period_end.split('T')[0] : ''
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.user_id || !formData.plan_id) {
      setMessage({ type: 'error', text: 'Please select a user and plan' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      if (editingSub) {
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan_id: formData.plan_id,
            status: formData.status,
            current_period_end: formData.current_period_end || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSub.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Subscription updated successfully!' })
      } else {
        // Check if user already has a subscription
        const existing = subscriptions.find(s => s.user_id === formData.user_id)
        if (existing) {
          setMessage({ type: 'error', text: 'This user already has a subscription. Edit their existing one instead.' })
          setSaving(false)
          return
        }

        // Create new subscription
        const { error } = await supabase
          .from('subscriptions')
          .insert([{
            user_id: formData.user_id,
            plan_id: formData.plan_id,
            status: formData.status,
            current_period_start: new Date().toISOString(),
            current_period_end: formData.current_period_end || null,
            cancel_at_period_end: false
          }])

        if (error) throw error
        setMessage({ type: 'success', text: 'Subscription created successfully!' })
      }

      fetchData()
      setShowModal(false)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save subscription' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (sub: Subscription) => {
    if (!confirm(`Are you sure you want to delete this subscription for ${sub.profiles?.email}?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', sub.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Subscription deleted!' })
      fetchData()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete subscription' })
    }
  }

  const updateStatus = async (sub: Subscription, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', sub.id)

      if (error) throw error
      setMessage({ type: 'success', text: `Subscription ${newStatus}!` })
      fetchData()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update status' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600/20 text-green-400'
      case 'trialing': return 'bg-blue-600/20 text-blue-400'
      case 'suspended': return 'bg-orange-600/20 text-orange-400'
      case 'canceled': return 'bg-red-600/20 text-red-400'
      case 'past_due': return 'bg-amber-600/20 text-amber-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅'
      case 'trialing': return '🕐'
      case 'suspended': return '⏸️'
      case 'canceled': return '❌'
      case 'past_due': return '⚠️'
      default: return '❓'
    }
  }

  // Calculate revenue
  const monthlyRevenue = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.plans?.price_monthly || 0), 0) / 100

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
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Subscriptions</h1>
          <p className="text-gray-400 mt-1">Manage all customer subscriptions</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#313c48] text-white rounded-lg font-medium hover:bg-[#1a2028] transition-colors flex items-center gap-2"
        >
          <span>➕</span> Add Subscription
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-bold text-white">{subscriptions.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-400">
            {subscriptions.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Trialing</p>
          <p className="text-2xl font-bold text-blue-400">
            {subscriptions.filter(s => s.status === 'trialing').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Suspended</p>
          <p className="text-2xl font-bold text-orange-400">
            {subscriptions.filter(s => s.status === 'suspended').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl border border-green-700/50 p-4">
          <p className="text-sm text-green-300">MRR</p>
          <p className="text-2xl font-bold text-white">${monthlyRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by email, name, or plan..."
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
          <option value="active">✅ Active</option>
          <option value="trialing">🕐 Trialing</option>
          <option value="suspended">⏸️ Suspended</option>
          <option value="canceled">❌ Canceled</option>
          <option value="past_due">⚠️ Past Due</option>
        </select>
        <button
          onClick={fetchData}
          className="px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Period End</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Created</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#313c48] rounded-full flex items-center justify-center text-white font-medium">
                          {sub.profiles?.full_name?.charAt(0) || sub.profiles?.email?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{sub.profiles?.full_name || 'No name'}</p>
                          <p className="text-xs text-gray-400">{sub.profiles?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{sub.plans?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">${(sub.plans?.price_monthly || 0) / 100}/mo</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sub.status)}`}>
                        {getStatusIcon(sub.status)} {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        
                        {/* Status Quick Actions */}
                        {sub.status !== 'active' && (
                          <button
                            onClick={() => updateStatus(sub, 'active')}
                            className="p-2 text-green-400 hover:bg-green-600/20 rounded-lg transition-colors"
                            title="Activate"
                          >
                            ✅
                          </button>
                        )}
                        {sub.status === 'active' && (
                          <button
                            onClick={() => updateStatus(sub, 'suspended')}
                            className="p-2 text-orange-400 hover:bg-orange-600/20 rounded-lg transition-colors"
                            title="Suspend"
                          >
                            ⏸️
                          </button>
                        )}
                        {sub.status !== 'canceled' && (
                          <button
                            onClick={() => updateStatus(sub, 'canceled')}
                            className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            ❌
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(sub)}
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
                    {searchTerm || statusFilter !== 'all' ? 'No subscriptions found matching your filters' : 'No subscriptions yet'}
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
                {editingSub ? 'Edit Subscription' : 'Create Subscription'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User *</label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  disabled={!!editingSub}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff] disabled:opacity-50"
                >
                  <option value="">Select a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.email} {user.full_name ? `(${user.full_name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Plan *</label>
                <select
                  value={formData.plan_id}
                  onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff]"
                >
                  <option value="">Select a plan...</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price_monthly / 100}/mo
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff]"
                >
                  <option value="active">✅ Active</option>
                  <option value="trialing">🕐 Trialing</option>
                  <option value="suspended">⏸️ Suspended</option>
                  <option value="canceled">❌ Canceled</option>
                  <option value="past_due">⚠️ Past Due</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Period End Date</label>
                <input
                  type="date"
                  value={formData.current_period_end}
                  onChange={(e) => setFormData({ ...formData, current_period_end: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff]"
                />
                <p className="text-xs text-gray-500 mt-1">When this subscription period ends</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-[#313c48] text-white rounded-lg font-medium hover:bg-[#1a2028] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editingSub ? 'Update' : 'Create Subscription')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
