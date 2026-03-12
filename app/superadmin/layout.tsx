'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// ADMIN EMAILS - Add your admin email here
const ADMIN_EMAILS = ['sesarch@yahoo.com', 'sina@usa.com']

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!user?.email) {
      if (!loading) {
        router.push('/login?redirect=/superadmin')
      }
      return
    }

    // Check if user email is in admin list
    const adminCheck = ADMIN_EMAILS.includes(user.email.toLowerCase())
    
    console.log('Admin check:', { 
      userEmail: user.email, 
      isAdmin: adminCheck,
      adminEmails: ADMIN_EMAILS 
    })

    if (adminCheck) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
      alert('Access Denied: You do not have admin privileges')
      router.push('/dashboard/stores')
    }
  }, [user?.email, loading, router])

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#3385ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You do not have admin privileges</p>
          <Link href="/dashboard/stores" className="px-6 py-3 bg-[#313c48] text-white rounded-lg hover:bg-[#1a2028]">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const navigation = [
    { name: 'Overview', href: '/superadmin', icon: '📊' },
    { name: 'Users', href: '/superadmin/users', icon: '👥' },
    { name: 'Subscriptions', href: '/superadmin/subscriptions', icon: '💳' },
    { name: 'Stores', href: '/superadmin/stores', icon: '🏪' },
    { name: 'Plans', href: '/superadmin/plans', icon: '📋' },
    { name: 'Reports', href: '/superadmin/reports', icon: '📈' },
    { name: 'Settings', href: '/superadmin/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">👑</span>
          <span className="font-bold text-white">Super Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 h-16 px-6 border-b border-gray-700/50">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">👑</span>
              </div>
              <div>
                <p className="font-bold text-white text-lg">EZ Apps</p>
                <p className="text-xs text-yellow-400">Super Admin</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-5 overflow-y-auto">
              <div>
                <div className="px-3 mb-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Administration
                  </p>
                </div>
                
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-2 space-y-1 border border-gray-600/20 shadow-lg">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/20 scale-[1.02]'
                            : 'text-gray-300 hover:bg-gray-600/40 hover:text-white hover:scale-[1.01]'
                        }`}
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-700/50 bg-gray-800/50">
              <div className="flex items-center mb-3 bg-gray-700/30 rounded-xl p-3 border border-gray-600/20">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 overflow-hidden flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                  <p className="text-xs text-yellow-400">Super Admin</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white bg-gray-700/30 hover:bg-red-600/20 border border-gray-600/20 hover:border-red-500/30 rounded-xl transition-all duration-200"
              >
                <span className="mr-2">🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
