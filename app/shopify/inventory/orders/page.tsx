'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'unfulfilled' | 'all'>('unfulfilled')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: store } = await supabase
        .from('stores').select('id').eq('user_id', user.id).eq('is_active', true).single()
      if (!store) { setLoading(false); return }

      let query = supabase
        .from('orders')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })
        .limit(200)

      if (filter === 'unfulfilled') {
        query = query.in('fulfillment_status', ['unfulfilled', 'partial'])
      }

      const { data } = await query
      setOrders(data || [])
      setLoading(false)
    }
    load()
  }, [filter])

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#3385ff] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2028]">Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} orders</p>
        </div>
        <div className="flex gap-2">
          {(['unfulfilled', 'all'] as const).map(f => (
            <button key={f} onClick={() => { setLoading(true); setFilter(f) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f ? 'bg-[#3385ff] text-white' : 'bg-gray-100 text-gray-600'}`}>
              {f === 'unfulfilled' ? 'Unfulfilled' : 'All Orders'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Order</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Total</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No orders found</td></tr>
            ) : orders.map(o => (
              <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#3385ff]">#{o.order_number || o.shopify_order_id}</td>
                <td className="px-4 py-3 text-gray-600">{o.customer_name || o.customer_email || '—'}</td>
                <td className="px-4 py-3 font-medium">${parseFloat(o.total_price || 0).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    o.fulfillment_status === 'unfulfilled' ? 'bg-orange-100 text-orange-700' :
                    o.fulfillment_status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                    o.fulfillment_status === 'fulfilled' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {o.fulfillment_status || 'unknown'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
