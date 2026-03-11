'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: store } = await supabase
        .from('stores').select('id').eq('user_id', user.id).eq('is_active', true).single()
      if (!store) { setLoading(false); return }

      const { data } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('store_id', store.id)
        .neq('status', 'deleted')
        .order('name', { ascending: true })

      setItems(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.sku?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#3385ff] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2028]">Items / Parts</h1>
          <p className="text-gray-500 text-sm">{items.length} total</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2 border border-gray-200 rounded-lg mb-6 focus:ring-2 focus:ring-[#3385ff] outline-none"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">SKU</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Quantity</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Unit</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No items found</td></tr>
            ) : filtered.map(item => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#1a2028]">{item.name}</td>
                <td className="px-4 py-3 text-gray-500">{item.sku || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    (item.quantity || 0) > 10 ? 'bg-green-100 text-green-700' :
                    (item.quantity || 0) > 0 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {item.quantity || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{item.unit || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{item.cost ? `$${item.cost}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
