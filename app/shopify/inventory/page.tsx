'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function InventoryOverviewPage() {
  const [stats, setStats] = useState({ products: 0, items: 0, orders: 0, pos: 0 })
  const [storeId, setStoreId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (!store) return
      setStoreId(store.id)

      const [p, i, o, po] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('store_id', store.id).neq('status', 'deleted'),
        supabase.from('inventory_items').select('id', { count: 'exact', head: true }).eq('store_id', store.id).neq('status', 'deleted'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('store_id', store.id).in('fulfillment_status', ['unfulfilled', 'partial']),
        supabase.from('purchase_orders').select('id', { count: 'exact', head: true }).eq('store_id', store.id).neq('status', 'deleted'),
      ])

      setStats({
        products: p.count || 0,
        items: i.count || 0,
        orders: o.count || 0,
        pos: po.count || 0,
      })
    }
    load()
  }, [])

  const cards = [
    { label: 'Products', value: stats.products, icon: '📦', href: '/shopify/inventory/products', color: 'bg-blue-50 text-blue-600' },
    { label: 'Items / Parts', value: stats.items, icon: '🔩', href: '/shopify/inventory/items', color: 'bg-purple-50 text-purple-600' },
    { label: 'Unfulfilled Orders', value: stats.orders, icon: '🛒', href: '/shopify/inventory/orders', color: 'bg-orange-50 text-orange-600' },
    { label: 'Purchase Orders', value: stats.pos, icon: '📄', href: '/shopify/inventory/purchase-orders', color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1a2028] mb-2">Inventory Overview</h1>
      <p className="text-gray-500 mb-8">Shopify store summary</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(card => (
          <a key={card.label} href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-[#1a2028]">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </a>
        ))}
      </div>

      {!storeId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-yellow-800">
          <strong>No store connected.</strong> Please connect your Shopify store to see data.
        </div>
      )}
    </div>
  )
}
