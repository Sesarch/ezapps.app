'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BOMPage() {
  const [boms, setBoms] = useState<any[]>([])
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
        .from('bom')
        .select(`*, products(title), inventory_items(name)`)
        .eq('store_id', store.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false })

      setBoms(data || [])
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
          <h1 className="text-2xl font-bold text-[#1a2028]">Bill of Materials</h1>
          <p className="text-gray-500 text-sm">{boms.length} records</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Product</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Item / Part</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {boms.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No BOM records found</td></tr>
            ) : boms.map(b => (
              <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#1a2028]">{b.products?.title || b.product_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{b.inventory_items?.name || b.item_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{b.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
