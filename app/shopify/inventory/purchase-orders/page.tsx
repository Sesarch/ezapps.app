'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PurchaseOrdersPage() {
  const [pos, setPos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: store } = await supabase
        .from('stores').select('id').eq('user_id', user.id).eq('is_active', true).single()
      if (!store) { setLoading(false); return }

      const { data } = await supabase
        .from('purchase_orders')
        .select(`*, suppliers(name)`)
        .eq('store_id', store.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false })

      setPos(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#3385ff] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2028]">Purchase Orders</h1>
          <p className="text-gray-500 text-sm">{pos.length} total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">PO Number</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Supplier</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Total</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {pos.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No purchase orders found</td></tr>
            ) : pos.map(po => (
              <tr key={po.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#3385ff]">{po.po_number || po.id?.slice(0, 8)}</td>
                <td className="px-4 py-3 text-gray-600">{po.suppliers?.name || '—'}</td>
                <td className="px-4 py-3 font-medium">{po.total ? `$${parseFloat(po.total).toFixed(2)}` : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    po.status === 'received' ? 'bg-green-100 text-green-700' :
                    po.status === 'ordered' ? 'bg-blue-100 text-blue-700' :
                    po.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {po.status || 'draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {po.created_at ? new Date(po.created_at).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
