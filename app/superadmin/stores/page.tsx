'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

export default function AdminStoresPage() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('stores')
        .select('*, profiles(email, full_name), platforms(name, logo_url)')
        .order('created_at', { ascending: false })
      
      setStores(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

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
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Connected Stores</h1>
        <p className="text-gray-400 mt-1">View all customer store connections</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Total Stores</p>
          <p className="text-2xl font-bold text-white">{stores.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-400">
            {stores.filter(s => s.is_active).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Inactive</p>
          <p className="text-2xl font-bold text-gray-400">
            {stores.filter(s => !s.is_active).length}
          </p>
        </div>
      </div>

      {/* Stores */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {stores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Store</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Platform</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Owner</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Connected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">{store.store_name}</p>
                      <p className="text-xs text-gray-400">{store.store_url}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white">{store.platforms?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{store.profiles?.full_name || 'No name'}</p>
                      <p className="text-xs text-gray-400">{store.profiles?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        store.is_active ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {store.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(store.connected_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <div className="text-4xl mb-3">🏪</div>
            <p>No stores connected yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
