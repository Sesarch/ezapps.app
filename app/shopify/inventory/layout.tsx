'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/shopify/inventory', label: 'Overview', icon: '🏠' },
  { href: '/shopify/inventory/products', label: 'Products', icon: '📦' },
  { href: '/shopify/inventory/items', label: 'Items', icon: '🔩' },
  { href: '/shopify/inventory/bom', label: 'BOM', icon: '📋' },
  { href: '/shopify/inventory/orders', label: 'Orders', icon: '🛒' },
  { href: '/shopify/inventory/purchase-orders', label: 'Purchase Orders', icon: '📄' },
  { href: '/shopify/inventory/suppliers', label: 'Suppliers', icon: '🏭' },
  { href: '/shopify/inventory/builds', label: 'Builds', icon: '🔨' },
]

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setChecking(false)
    }
    checkAuth()
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="w-8 h-8 border-4 border-[#3385ff] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#f8f9fb]">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">← Dashboard</Link>
          <h2 className="text-base font-bold text-[#1a2028] mt-1">📦 Inventory</h2>
          <p className="text-xs text-gray-400">Shopify</p>
        </div>
        <nav className="flex-1 py-3">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-[#3385ff]/10 text-[#3385ff] border-r-2 border-[#3385ff]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
