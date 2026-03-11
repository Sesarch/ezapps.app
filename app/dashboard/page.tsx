'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="w-8 h-8 border-4 border-[#3385ff] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const apps = [
    { icon: '📦', name: 'Inventory Manager', desc: 'Track products, parts, BOMs & orders', href: '/shopify/inventory', ready: true },
    { icon: '⭐', name: 'Review Manager', desc: 'Collect & display product reviews', href: '#', ready: false },
    { icon: '🎁', name: 'Loyalty Program', desc: 'Reward customers with points', href: '#', ready: false },
    { icon: '📈', name: 'Upsell Engine', desc: 'Boost revenue with smart upsells', href: '#', ready: false },
    { icon: '📣', name: 'Email/SMS Marketing', desc: 'Send targeted campaigns', href: '#', ready: false },
    { icon: '📋', name: 'Form Builder', desc: 'Build custom store forms', href: '#', ready: false },
  ]

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#1a2028]">EZ Apps</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button onClick={handleSignOut} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-[#1a2028] mb-2">Your Apps</h2>
        <p className="text-gray-500 mb-8">Select an app to get started</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map(app => (
            <div key={app.name} className={`bg-white rounded-2xl border border-gray-200 p-6 ${app.ready ? 'hover:border-[#3385ff] hover:shadow-md cursor-pointer transition-all' : 'opacity-60'}`}>
              {app.ready ? (
                <Link href={app.href} className="block">
                  <div className="text-4xl mb-3">{app.icon}</div>
                  <h3 className="font-bold text-[#1a2028] mb-1">{app.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{app.desc}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Active</span>
                </Link>
              ) : (
                <div>
                  <div className="text-4xl mb-3">{app.icon}</div>
                  <h3 className="font-bold text-[#1a2028] mb-1">{app.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{app.desc}</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">Coming Soon</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
