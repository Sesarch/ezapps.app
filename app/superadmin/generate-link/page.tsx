'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'

export default function GenerateLinkPage() {
  const [email, setEmail] = useState('sesarch@yahoo.com')
  const [newPassword, setNewPassword] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'magic' | 'password'>('password')

  const generateLink = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else if (data.action_link) {
        setResult(data.action_link)
      } else {
        setError('No link generated')
      }
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  const resetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          newPassword,
          adminSecret: 'ezapps-admin-2026' 
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(`Password updated for ${email}. You can now login.`)
      }
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Access Tools</h1>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('password'); setResult(null); setError(null) }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            mode === 'password' ? 'bg-[#3385ff] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Reset Password
        </button>
        <button
          onClick={() => { setMode('magic'); setResult(null); setError(null) }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            mode === 'magic' ? 'bg-[#3385ff] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Magic Link
        </button>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">
          {mode === 'password' ? 'Direct Password Reset' : 'Generate Magic Link'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <select
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[#3385ff] focus:border-transparent outline-none"
            >
              <option value="sesarch@yahoo.com">sesarch@yahoo.com (Super Admin)</option>
              <option value="sina@usa.com">sina@usa.com</option>
              <option value="test@test.com">test@test.com</option>
            </select>
          </div>

          {mode === 'password' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[#3385ff] focus:border-transparent outline-none placeholder-gray-600"
              />
            </div>
          )}

          <button
            onClick={mode === 'password' ? resetPassword : generateLink}
            disabled={loading}
            className="w-full py-3 bg-[#3385ff] text-white rounded-xl font-semibold hover:bg-[#1b64f5] transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'password' ? 'Reset Password Now' : 'Generate Magic Link'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            {mode === 'magic' ? (
              <>
                <p className="text-green-400 font-medium mb-2">Link Generated!</p>
                <a href={result} className="text-[#3385ff] hover:text-[#1b64f5] underline break-all text-sm">
                  {result}
                </a>
                <button
                  onClick={() => window.location.href = result}
                  className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
                >
                  Click Here to Login
                </button>
              </>
            ) : (
              <p className="text-green-400 font-medium">{result}</p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 text-center">
        These tools use admin service role key. Handle with care.
      </p>
    </div>
  )
}
