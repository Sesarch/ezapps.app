'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('No user data received')
        setLoading(false)
        return
      }

      const ADMIN_EMAILS = ['sesarch@yahoo.com']
      const isAdmin = ADMIN_EMAILS.includes(data.user.email?.toLowerCase() || '')
      window.location.href = isAdmin ? '/superadmin' : '/dashboard'
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f0f3f7]">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-[#e8ecf1]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(98, 122, 144, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(98, 122, 144, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[#3385ff]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#627a90]/5 rounded-full blur-[100px]" />

        <div className="relative text-center px-12">
          <Image src="/logo.png" alt="EZ Apps" width={200} height={52} className="mx-auto mb-8 h-12 w-auto" />
          <h2 className="text-3xl font-extrabold text-[#1a2028] mb-4">Manage Everything.<br/>Everywhere.</h2>
          <p className="text-[#627a90] text-lg">Your multi-platform e-commerce command center.</p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#f8f9fb]">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Image src="/logo.png" alt="EZ Apps" width={140} height={36} className="mx-auto h-9 w-auto" />
          </div>

          <h1 className="text-3xl font-extrabold text-[#1a2028] mb-2">Welcome back</h1>
          <p className="text-[#627a90] mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#384654] mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3.5 bg-white border border-[#dce3ed] rounded-xl text-[#1a2028] placeholder-[#94a7bf] focus:ring-2 focus:ring-[#3385ff] focus:border-transparent outline-none transition-all disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[#384654]">Password</label>
                <Link href="/forgot-password" className="text-sm font-medium text-[#3385ff] hover:text-[#1b64f5]">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3.5 bg-white border border-[#dce3ed] rounded-xl text-[#1a2028] placeholder-[#94a7bf] focus:ring-2 focus:ring-[#3385ff] focus:border-transparent outline-none transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-base font-bold text-white bg-[#3385ff] hover:bg-[#1b64f5] rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#627a90]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-[#3385ff] hover:text-[#1b64f5]">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
