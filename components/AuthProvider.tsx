'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createClient, clearClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'super_admin'
  is_admin: boolean
  status: string
  company_name: string | null
}

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  isSuperAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  isSuperAdmin: false,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

function getSessionFromStorage(): { user: User | null; session: Session | null } {
  try {
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!
      .replace('https://', '')
      .split('.')[0]
    const key = `sb-${projectRef}-auth-token`
    const raw = localStorage.getItem(key)
    if (!raw) return { user: null, session: null }
    const parsed = JSON.parse(raw)
    const session = parsed as Session
    if (!session?.access_token || !session?.user) return { user: null, session: null }
    const exp = session.expires_at
    if (exp && exp * 1000 < Date.now()) return { user: null, session: null }
    return { user: session.user, session }
  } catch {
    return { user: null, session: null }
  }
}

async function fetchProfile(supabase: any, userId: string) {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data ?? null
  } catch {
    return null
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const isAuthPage = typeof window !== 'undefined' && (
    window.location.pathname === '/login' ||
    window.location.pathname === '/signup' ||
    window.location.pathname === '/forgot-password' ||
    window.location.pathname.startsWith('/reset-password')
  )

  const initial = typeof window !== 'undefined' && !isAuthPage
    ? getSessionFromStorage()
    : { user: null, session: null }

  const [user, setUser] = useState<User | null>(initial.user)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(initial.session)
  const [loading, setLoading] = useState(!isAuthPage && initial.user === null)
  const [signingOut, setSigningOut] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    if (isAuthPage) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    // If we already have a user from localStorage, load profile immediately
    if (initial.user) {
      setLoading(false)
      fetchProfile(supabase, initial.user.id).then(data => {
        if (mounted.current) setProfile(data)
      })
    }

    const timeout = setTimeout(() => {
      if (mounted.current) setLoading(false)
    }, 3000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted.current) return
        clearTimeout(timeout)

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          setSession(newSession)
          setUser(newSession?.user ?? null)
          if (newSession?.user) {
            const data = await fetchProfile(supabase, newSession.user.id)
            if (mounted.current) setProfile(data)
          }
          if (mounted.current) setLoading(false)
        }

        if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setProfile(null)
          if (mounted.current) setLoading(false)
        }
      }
    )

    return () => {
      mounted.current = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      clearClient()
      setUser(null)
      setProfile(null)
      setSession(null)
      window.location.replace('/login')
    } catch {
      window.location.replace('/login')
    } finally {
      setSigningOut(false)
    }
  }

  const isSuperAdmin = profile?.role === 'super_admin' || profile?.is_admin === true

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, isSuperAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
