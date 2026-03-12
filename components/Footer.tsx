'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e5e8ed] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Image src="/logo.png" alt="EZ Apps" width={120} height={32} className="h-7 w-auto mb-4" />
            <p className="text-sm text-[#627a90] leading-relaxed">
              The all-in-one e-commerce management platform for multi-channel sellers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#1a2028] uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-[#627a90] hover:text-[#1a2028] transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-[#627a90] hover:text-[#1a2028] transition-colors">Pricing</a></li>
              <li><a href="#platforms" className="text-sm text-[#627a90] hover:text-[#1a2028] transition-colors">Platforms</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#1a2028] uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-[#627a90] hover:text-[#1a2028] transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-[#627a90] hover:text-[#1a2028] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#1a2028] uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-[#627a90] hover:text-[#1a2028] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-[#627a90] hover:text-[#1a2028] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e5e8ed] pt-8 text-center">
          <p className="text-sm text-[#94a7bf]">
            © {new Date().getFullYear()} EZ Apps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
