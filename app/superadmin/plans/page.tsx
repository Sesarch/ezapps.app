'use client'

export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

interface Plan {
  id: string
  name: string
  description: string
  price_monthly: number
  price_yearly: number
  apps_limit: number
  platforms_limit: number
  orders_limit: number
  is_active: boolean
  stripe_price_id_monthly: string | null
  stripe_price_id_yearly: string | null
  features: string[]
}

const defaultPlan: Omit<Plan, 'id'> = {
  name: '',
  description: '',
  price_monthly: 0,
  price_yearly: 0,
  apps_limit: 1,
  platforms_limit: 1,
  orders_limit: 1000,
  is_active: true,
  stripe_price_id_monthly: null,
  stripe_price_id_yearly: null,
  features: []
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState<Omit<Plan, 'id'>>(defaultPlan)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [newFeature, setNewFeature] = useState('')
  const supabase = createClient()

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price_monthly', { ascending: true })
    
    if (error) {
      console.error('Error fetching plans:', error)
      setPlans([])
    } else {
      setPlans(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const openAddModal = () => {
    setEditingPlan(null)
    setFormData(defaultPlan)
    setShowModal(true)
  }

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price_monthly: plan.price_monthly || 0,
      price_yearly: plan.price_yearly || plan.price_monthly * 10 || 0,
      apps_limit: plan.apps_limit || 1,
      platforms_limit: plan.platforms_limit || 1,
      orders_limit: plan.orders_limit || 1000,
      is_active: plan.is_active ?? true,
      stripe_price_id_monthly: plan.stripe_price_id_monthly || null,
      stripe_price_id_yearly: plan.stripe_price_id_yearly || null,
      features: Array.isArray(plan.features) ? plan.features : []
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name) {
      setMessage({ type: 'error', text: 'Plan name is required' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('plans')
          .update(formData)
          .eq('id', editingPlan.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Plan updated successfully!' })
      } else {
        const { error } = await supabase
          .from('plans')
          .insert([formData])

        if (error) throw error
        setMessage({ type: 'success', text: 'Plan created successfully!' })
      }

      fetchPlans()
      setShowModal(false)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save plan' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (plan: Plan) => {
    if (!confirm(`Are you sure you want to delete "${plan.name}" plan? This cannot be undone.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', plan.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Plan deleted successfully!' })
      fetchPlans()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete plan' })
    }
  }

  const togglePlanStatus = async (plan: Plan) => {
    try {
      const { error } = await supabase
        .from('plans')
        .update({ is_active: !plan.is_active })
        .eq('id', plan.id)

      if (error) throw error
      fetchPlans()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update plan' })
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = Array.isArray(formData.features) ? formData.features : []
      setFormData({
        ...formData,
        features: [...currentFeatures, newFeature.trim()]
      })
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-800 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Plans & Pricing</h1>
          <p className="text-gray-400 mt-1">Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#313c48] text-white rounded-lg font-medium hover:bg-[#1a2028] transition-colors flex items-center gap-2"
        >
          <span>➕</span> Add Plan
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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-gray-800 rounded-xl border ${plan.is_active ? 'border-gray-700' : 'border-gray-700/50 opacity-60'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <button
                onClick={() => togglePlanStatus(plan)}
                className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                  plan.is_active 
                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                    : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                }`}
              >
                {plan.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">${plan.price_monthly / 100}</span>
              <span className="text-gray-400">/mo</span>
            </div>

            {plan.description && (
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
            )}

            <div className="space-y-2 mb-4 pb-4 border-b border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Apps</span>
                <span className="text-white">{plan.apps_limit === -1 ? 'Unlimited' : plan.apps_limit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Platforms</span>
                <span className="text-white">{plan.platforms_limit === -1 ? 'Unlimited' : plan.platforms_limit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Orders/mo</span>
                <span className="text-white">{plan.orders_limit === -1 ? 'Unlimited' : plan.orders_limit?.toLocaleString()}</span>
              </div>
            </div>

            {plan.features && Array.isArray(plan.features) && plan.features.length > 0 && (
              <div className="mb-4 space-y-1">
                {plan.features.slice(0, 3).map((feature: string, i: number) => (
                  <div key={i} className="flex items-center text-sm text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <p className="text-xs text-gray-500">+{plan.features.length - 3} more features</p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button 
                onClick={() => openEditModal(plan)}
                className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                ✏️ Edit
              </button>
              <button 
                onClick={() => handleDelete(plan)}
                className="py-2 px-3 bg-red-900/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-900/50 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {/* Add Plan Card */}
        <div 
          onClick={openAddModal}
          className="bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#3385ff] hover:bg-gray-800 transition-colors min-h-[300px]"
        >
          <div className="text-4xl mb-3">➕</div>
          <p className="text-gray-400 font-medium">Add New Plan</p>
        </div>
      </div>

      {/* Stripe Info */}
      <div className="mt-8 bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
        <p className="text-amber-400 text-sm">
          💡 <strong>Stripe Integration:</strong> To enable payments, connect Stripe and add the Price IDs from your Stripe Dashboard to each plan.
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingPlan ? 'Edit Plan' : 'Add New Plan'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Plan Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Starter, Pro, Enterprise"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description of this plan"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">💰 Pricing (in cents)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Monthly Price (cents)</label>
                    <input
                      type="number"
                      value={formData.price_monthly}
                      onChange={(e) => setFormData({ ...formData, price_monthly: parseInt(e.target.value) || 0 })}
                      placeholder="2900 = $29.00"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">= ${(formData.price_monthly / 100).toFixed(2)}/mo</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Yearly Price (cents)</label>
                    <input
                      type="number"
                      value={formData.price_yearly}
                      onChange={(e) => setFormData({ ...formData, price_yearly: parseInt(e.target.value) || 0 })}
                      placeholder="29000 = $290.00"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">= ${(formData.price_yearly / 100).toFixed(2)}/yr</p>
                  </div>
                </div>
              </div>

              {/* Limits */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">📊 Limits (-1 for unlimited)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Apps Limit</label>
                    <input
                      type="number"
                      value={formData.apps_limit}
                      onChange={(e) => setFormData({ ...formData, apps_limit: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Platforms Limit</label>
                    <input
                      type="number"
                      value={formData.platforms_limit}
                      onChange={(e) => setFormData({ ...formData, platforms_limit: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Orders/Month</label>
                    <input
                      type="number"
                      value={formData.orders_limit}
                      onChange={(e) => setFormData({ ...formData, orders_limit: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">✨ Features</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    placeholder="Add a feature..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent"
                  />
                  <button
                    onClick={addFeature}
                    className="px-4 py-2 bg-[#313c48] text-white rounded-lg hover:bg-[#1a2028] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.features && Array.isArray(formData.features) && formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded-lg">
                      <span className="text-gray-300 text-sm">✓ {feature}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stripe IDs */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">💳 Stripe Price IDs (optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Monthly Price ID</label>
                    <input
                      type="text"
                      value={formData.stripe_price_id_monthly || ''}
                      onChange={(e) => setFormData({ ...formData, stripe_price_id_monthly: e.target.value || null })}
                      placeholder="price_xxx..."
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Yearly Price ID</label>
                    <input
                      type="text"
                      value={formData.stripe_price_id_yearly || ''}
                      onChange={(e) => setFormData({ ...formData, stripe_price_id_yearly: e.target.value || null })}
                      placeholder="price_xxx..."
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3385ff] focus:border-transparent font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg">
                <div>
                  <p className="text-white font-medium">Plan Active</p>
                  <p className="text-gray-400 text-sm">Inactive plans won't be shown to users</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.is_active ? 'bg-[#313c48]' : 'bg-gray-600'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    formData.is_active ? 'left-8' : 'left-1'
                  }`}></span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
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
                {saving ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
