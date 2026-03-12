'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalStores: 0,
    activeSubscriptions: 0,
    trialUsers: 0,
    revenue: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentStores, setRecentStores] = useState<any[]>([])
  const [planDistribution, setPlanDistribution] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    async function fetchData() {
      // Fetch users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch stores count
      const { count: totalStores } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })

      // Fetch active subscriptions
      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Calculate trial users (users without active subscription)
      const trialUsers = (totalUsers || 0) - (activeSubscriptions || 0)

      // Get users from this week
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const { count: newUsersThisWeek } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString())

      // Get users from this month
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString())

      // Fetch recent users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent stores
      const { data: storesData } = await supabase
        .from('stores')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch plan distribution
      const { data: plansData } = await supabase
        .from('plans')
        .select('id, name')
      
      const { data: subsData } = await supabase
        .from('subscriptions')
        .select('plan_id')
        .eq('status', 'active')

      const distribution = plansData?.map(plan => ({
        name: plan.name,
        count: subsData?.filter(s => s.plan_id === plan.id).length || 0
      })) || []

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: totalUsers || 0,
        totalStores: totalStores || 0,
        activeSubscriptions: activeSubscriptions || 0,
        trialUsers: trialUsers,
        revenue: (activeSubscriptions || 0) * 29,
        newUsersThisWeek: newUsersThisWeek || 0,
        newUsersThisMonth: newUsersThisMonth || 0
      })
      setRecentUsers(usersData || [])
      setRecentStores(storesData || [])
      setPlanDistribution(distribution)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-64"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome to the EZ Apps admin panel</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
              <Link href="/admin/users" className="text-[#3385ff] text-xs hover:text-teal-300 mt-2 inline-block">
                ↗ All registered users
              </Link>
            </div>
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Connected Stores</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalStores}</p>
              <Link href="/admin/stores" className="text-[#3385ff] text-xs hover:text-teal-300 mt-2 inline-block">
                ↗ Active store connections
              </Link>
            </div>
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Subscriptions</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.activeSubscriptions}</p>
              <Link href="/admin/subscriptions" className="text-[#3385ff] text-xs hover:text-teal-300 mt-2 inline-block">
                ↗ Paid subscriptions
              </Link>
            </div>
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Trial Users</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.trialUsers}</p>
              <p className="text-orange-400 text-xs mt-2">🕐 On free trial</p>
            </div>
            <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1a2028]/20 to-teal-800/20 rounded-xl border border-teal-700/50 p-5">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📈</div>
            <div>
              <p className="text-xs text-teal-300">New This Week</p>
              <p className="text-2xl font-bold text-white">{stats.newUsersThisWeek}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl border border-blue-700/50 p-5">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📊</div>
            <div>
              <p className="text-xs text-blue-300">New This Month</p>
              <p className="text-2xl font-bold text-white">{stats.newUsersThisMonth}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl border border-green-700/50 p-5">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💰</div>
            <div>
              <p className="text-xs text-green-300">Est. MRR</p>
              <p className="text-2xl font-bold text-white">${stats.revenue}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl border border-purple-700/50 p-5">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <p className="text-xs text-purple-300">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalUsers > 0 ? ((stats.activeSubscriptions / stats.totalUsers) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Users */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Users</h2>
            <Link href="/admin/users" className="text-[#3385ff] text-sm hover:text-teal-300">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users yet</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#313c48] rounded-full flex items-center justify-center text-white font-semibold">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.full_name || 'No name'}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.is_admin ? 'bg-purple-600/20 text-purple-400' : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/users" className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="text-white font-medium">Manage Users</p>
                <p className="text-gray-400 text-sm">View and edit user accounts</p>
              </div>
            </Link>
            <Link href="/admin/subscriptions" className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <div>
                <p className="text-white font-medium">View Subscriptions</p>
                <p className="text-gray-400 text-sm">Monitor revenue and plans</p>
              </div>
            </Link>
            <Link href="/admin/plans" className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <p className="text-white font-medium">Edit Plans</p>
                <p className="text-gray-400 text-sm">Update pricing and features</p>
              </div>
            </Link>
            <Link href="/admin/stores" className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏪</span>
              </div>
              <div>
                <p className="text-white font-medium">All Stores</p>
                <p className="text-gray-400 text-sm">View all connected stores</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Stores & Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Stores */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Store Connections</h2>
            <Link href="/admin/stores" className="text-[#3385ff] text-sm hover:text-teal-300">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentStores.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No stores connected yet</p>
            ) : (
              recentStores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🛍️</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{store.store_url}</p>
                      <p className="text-gray-400 text-xs">{store.profiles?.email || 'Unknown user'}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded-full">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Plan Distribution</h2>
          {planDistribution.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No plans configured</p>
          ) : (
            <div className="space-y-4">
              {planDistribution.map((plan, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{plan.name}</span>
                    <span className="text-white font-medium">{plan.count} users</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#1a2028] h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${stats.totalUsers > 0 ? (plan.count / stats.totalUsers) * 100 : 0}%`,
                        minWidth: plan.count > 0 ? '10%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              
              {/* Trial Users Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Free Trial</span>
                  <span className="text-white font-medium">{stats.trialUsers} users</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats.totalUsers > 0 ? (stats.trialUsers / stats.totalUsers) * 100 : 0}%`,
                      minWidth: stats.trialUsers > 0 ? '10%' : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <div>
              <p className="text-white text-sm font-medium">API</p>
              <p className="text-green-400 text-xs">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <div>
              <p className="text-white text-sm font-medium">Database</p>
              <p className="text-green-400 text-xs">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <div>
              <p className="text-white text-sm font-medium">Shopify Sync</p>
              <p className="text-green-400 text-xs">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <div>
              <p className="text-white text-sm font-medium">Payments</p>
              <p className="text-yellow-400 text-xs">Setup Required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
