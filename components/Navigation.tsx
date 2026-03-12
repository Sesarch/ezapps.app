'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-xl border-b border-[#e5e8ed] ${
      scrolled ? 'shadow-sm' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="EZ Apps" width={120} height={32} className="h-9 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/how-it-works" className="text-sm font-medium text-[#627a90] hover:text-[#1a2028] transition-colors">How It Works</Link>
            <Link href="/apps" className="text-sm font-medium text-[#627a90] hover:text-[#1a2028] transition-colors">Apps</Link>
            <Link href="/#platforms" className="text-sm font-medium text-[#627a90] hover:text-[#1a2028] transition-colors">Platforms</Link>
            <Link href="/#pricing" className="text-sm font-medium text-[#627a90] hover:text-[#1a2028] transition-colors">Pricing</Link>
            <Link href="/contact" className="text-sm font-medium text-[#627a90] hover:text-[#1a2028] transition-colors">Contact</Link>
            <Link href="/demo" className="text-sm font-semibold text-[#3385ff] hover:text-[#1b64f5] transition-colors">Demo</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-[#627a90] hover:text-[#1a2028] transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#3385ff] hover:bg-[#1b64f5] rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/15">
              Get Started
            </Link>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#627a90]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden pb-6 space-y-3 bg-white rounded-2xl border border-[#e5e8ed] p-4 mt-2 shadow-lg">
            <Link href="/how-it-works" className="block px-4 py-2 text-sm text-[#627a90] hover:text-[#1a2028]">How It Works</Link>
            <Link href="/apps" className="block px-4 py-2 text-sm text-[#627a90] hover:text-[#1a2028]">Apps</Link>
            <Link href="/#platforms" className="block px-4 py-2 text-sm text-[#627a90] hover:text-[#1a2028]">Platforms</Link>
            <Link href="/#pricing" className="block px-4 py-2 text-sm text-[#627a90] hover:text-[#1a2028]">Pricing</Link>
            <Link href="/contact" className="block px-4 py-2 text-sm text-[#627a90] hover:text-[#1a2028]">Contact</Link>
            <Link href="/demo" className="block px-4 py-2 text-sm font-semibold text-[#3385ff]">Demo</Link>
            <div className="pt-3 space-y-2">
              <Link href="/login" className="block px-4 py-2.5 text-sm font-medium text-center text-[#627a90] border border-[#dce3ed] rounded-xl">Sign In</Link>
              <Link href="/signup" className="block px-4 py-2.5 text-sm font-medium text-center text-white bg-[#3385ff] rounded-xl">Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}