'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

interface GrowthData {
  week: string
  users: number
}

interface PlatformData {
  name: string
  count: number
}

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newUsers: 0,
    newStores: 0,
    churnedUsers: 0,
    avgRevenuePerUser: 0
  })
  const [userGrowth, setUserGrowth] = useState<GrowthData[]>([])
  const [topPlatforms, setTopPlatforms] = useState<PlatformData[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchReports() {
      setLoading(true)
      
      const days = parseInt(dateRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Fetch new users in date range
      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())

      // Fetch new stores in date range
      const { count: newStores } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())

      // Fetch active subscriptions for revenue
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*, plans(price_monthly)')
        .eq('status', 'active')

      const totalRevenue = subs?.reduce((sum, sub) => sum + (sub.plans?.price_monthly || 0), 0) || 0

      // Calculate user growth by week
      const growth: GrowthData[] = []
      for (let i = days; i >= 0; i -= 7) {
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - i)
        const weekEnd = new Date()
        weekEnd.setDate(weekEnd.getDate() - (i - 7))
        
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekStart.toISOString())
          .lt('created_at', weekEnd.toISOString())

        growth.push({
          week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: count || 0
        })
      }

      // Fetch stores by platform
      const { data: stores } = await supabase
        .from('stores')
        .select('platform_id')

      const platformCounts: Record<string, number> = {}
      stores?.forEach(store => {
        const platform = store.platform_id || 'shopify'
        platformCounts[platform] = (platformCounts[platform] || 0) + 1
      })

      const platforms = Object.entries(platformCounts).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count
      })).sort((a, b) => b.count - a.count)

      setStats({
        totalRevenue: totalRevenue / 100,
        newUsers: newUsers || 0,
        newStores: newStores || 0,
        churnedUsers: 0,
        avgRevenuePerUser: subs?.length ? (totalRevenue / 100) / subs.length : 0
      })
      setUserGrowth(growth.filter(g => g.users > 0 || growth.indexOf(g) === growth.length - 1))
      setTopPlatforms(platforms)
      setLoading(false)
    }

    fetchReports()
  }, [dateRange])

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 mt-1">Detailed insights into your business</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff]"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>)}
          </div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl border border-green-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-white mt-1">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-green-400 text-xs mt-2">💰 MRR</p>
                </div>
                <div className="text-4xl">💵</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl border border-blue-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm">New Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.newUsers}</p>
                  <p className="text-blue-400 text-xs mt-2">📈 In selected period</p>
                </div>
                <div className="text-4xl">👤</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl border border-purple-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">New Stores</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.newStores}</p>
                  <p className="text-purple-400 text-xs mt-2">🏪 Connected</p>
                </div>
                <div className="text-4xl">🛒</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a2028]/20 to-teal-800/20 rounded-xl border border-teal-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300 text-sm">Avg Revenue/User</p>
                  <p className="text-3xl font-bold text-white mt-1">${stats.avgRevenuePerUser.toFixed(2)}</p>
                  <p className="text-[#3385ff] text-xs mt-2">📊 ARPU</p>
                </div>
                <div className="text-4xl">📈</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">User Growth</h2>
              {userGrowth.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No data available for selected period</p>
              ) : (
                <div className="space-y-3">
                  {userGrowth.map((week, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm w-20">{week.week}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#1a2028] to-teal-400 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                          style={{ 
                            width: `${Math.max((week.users / Math.max(...userGrowth.map(w => w.users), 1)) * 100, 15)}%` 
                          }}
                        >
                          <span className="text-xs font-medium text-white">{week.users}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Distribution */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Stores by Platform</h2>
              {topPlatforms.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No stores connected yet</p>
              ) : (
                <div className="space-y-4">
                  {topPlatforms.map((platform, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-medium flex items-center gap-2">
                          {platform.name === 'Shopify' && '🛍️'}
                          {platform.name === 'Woocommerce' && '🔌'}
                          {platform.name === 'Etsy' && '🎨'}
                          {platform.name === 'Amazon' && '📦'}
                          {platform.name}
                        </span>
                        <span className="text-gray-400">{platform.count} stores</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-[#1a2028]' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-purple-500' :
                            'bg-gray-500'
                          }`}
                          style={{ 
                            width: `${(platform.count / Math.max(...topPlatforms.map(p => p.count), 1)) * 100}%`,
                            minWidth: '10%'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-6">Revenue Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-700/30 rounded-xl">
                <p className="text-4xl font-bold text-green-400">${stats.totalRevenue.toFixed(2)}</p>
                <p className="text-gray-400 mt-2">Monthly Recurring Revenue</p>
              </div>
              <div className="text-center p-6 bg-gray-700/30 rounded-xl">
                <p className="text-4xl font-bold text-blue-400">${(stats.totalRevenue * 12).toFixed(2)}</p>
                <p className="text-gray-400 mt-2">Annual Run Rate</p>
              </div>
              <div className="text-center p-6 bg-gray-700/30 rounded-xl">
                <p className="text-4xl font-bold text-purple-400">${stats.avgRevenuePerUser.toFixed(2)}</p>
                <p className="text-gray-400 mt-2">Avg Revenue Per User</p>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Export Data</h2>
            <p className="text-gray-400 text-sm mb-4">Download reports for external analysis</p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <span>📄</span> Export Users (CSV)
              </button>
              <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <span>🏪</span> Export Stores (CSV)
              </button>
              <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <span>💳</span> Export Subscriptions (CSV)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
 
