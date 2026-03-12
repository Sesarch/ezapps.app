'use client'

import { useState } from 'react'
import Link from 'next/link'

const apps = [
  { name: 'Inventory Manager', icon: '📦', desc: 'Parts, BOMs, stock tracking' },
  { name: 'Review Manager', icon: '⭐', desc: 'Collect & display reviews' },
  { name: 'Loyalty Manager', icon: '🎁', desc: 'Points, rewards, VIP tiers' },
  { name: 'Upsell Manager', icon: '🚀', desc: 'Bundles & cross-sells' },
  { name: 'Email / SMS Marketing', icon: '📧', desc: 'Campaigns & automations' },
  { name: 'EZ Form Maker', icon: '📝', desc: 'Custom forms & surveys' },
]

const features = [
  'Connect 1 Shopify store (more platforms coming soon)',
  'All 6 apps included — nothing extra to buy',
  'Unlimited products, parts, and orders',
  'Bill of Materials with auto-build calculations',
  'QR / Barcode scanner for warehouse operations',
  'Purchase Orders with partial receiving & stock updates',
  'Supplier management & low stock alerts',
  'Manual orders for wholesale & phone sales',
  'Real-time dashboard & analytics',
  'Email & chat support — real humans, not bots',
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)

  const monthlyPrice = 57
  const yearlyPrice = 499
  const yearlyMonthly = Math.round(yearlyPrice / 12)
  const savingsPercent = 30

  return (
    <section id="pricing" className="py-28 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#94a7bf] mb-4">Pricing</p>
          <h2 className="font-[family-name:var(--font-display)] text-6xl lg:text-7xl text-[#1a2028] tracking-tight leading-[0.9]">
            6 APPS.<br/>ONE ACCOUNT.
          </h2>
          <p className="mt-6 text-lg text-[#627a90] max-w-2xl mx-auto">
            No per-app fees. No feature gates. No surprises. One plan gives you 
            the complete toolkit — inventory, marketing, reviews, loyalty, upsells, and forms.
          </p>

          {/* Free trial badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#10b981]/8 border border-[#10b981]/20 rounded-full">
            <span className="text-[#10b981] text-sm font-bold">🎉 14-day free trial</span>
            <span className="text-[#627a90] text-sm">• No credit card needed</span>
          </div>
        </div>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-semibold transition-colors ${!yearly ? 'text-[#1a2028]' : 'text-[#94a7bf]'}`}>
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
              yearly ? 'bg-[#3385ff]' : 'bg-[#dce3ed]'
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
              yearly ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
          <span className={`text-sm font-semibold transition-colors ${yearly ? 'text-[#1a2028]' : 'text-[#94a7bf]'}`}>
            Yearly
          </span>
          {yearly && (
            <span className="px-3 py-1 text-xs font-bold text-[#10b981] bg-[#10b981]/10 rounded-full">
              Save {savingsPercent}%
            </span>
          )}
        </div>

        {/* Pricing Card */}
        <div className="bg-[#f5f6f8] border-2 border-[#1a2028] rounded-2xl p-10 shadow-xl max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-[#1a2028] mb-2">EZ Apps — All-in-One</h3>
            <p className="text-sm text-[#627a90]">Everything you need to run and grow your store</p>
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            {yearly ? (
              <>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-black text-[#1a2028]">${yearlyMonthly}</span>
                  <span className="text-sm font-medium text-[#94a7bf]">/mo</span>
                </div>
                <p className="mt-2 text-sm text-[#627a90]">
                  Billed <span className="font-semibold text-[#1a2028]">${yearlyPrice}/year</span>
                  <span className="ml-2 text-[#10b981] font-semibold">(Save {savingsPercent}%)</span>
                </p>
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-black text-[#1a2028]">${monthlyPrice}</span>
                  <span className="text-sm font-medium text-[#94a7bf]">/mo</span>
                </div>
                <p className="mt-2 text-sm text-[#627a90]">Billed monthly • Cancel anytime</p>
              </>
            )}
          </div>

          {/* Apps Included */}
          <div className="mb-8 bg-white rounded-xl p-5 border border-[#e5e8ed]">
            <p className="text-xs font-bold text-[#94a7bf] uppercase tracking-wider mb-3">6 Apps Included</p>
            <div className="grid grid-cols-2 gap-3">
              {apps.map((app) => (
                <div key={app.name} className="flex items-center gap-2.5">
                  <span className="text-lg">{app.icon}</span>
                  <div>
                    <span className="text-sm font-medium text-[#384654] block leading-tight">{app.name}</span>
                    <span className="text-[10px] text-[#94a7bf] leading-tight">{app.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 text-[#10b981] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-[#627a90]">{f}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/signup"
            className="block w-full py-4 text-sm font-black uppercase tracking-wider text-center rounded-xl bg-[#1a2028] hover:bg-[#313c48] text-white shadow-lg transition-all duration-200"
          >
            Start 14-Day Free Trial
          </Link>
          <p className="text-center text-xs text-[#94a7bf] mt-3">No credit card required • Full access to everything</p>
        </div>

        {/* FAQ-style reassurance */}
        <div className="mt-16 grid sm:grid-cols-3 gap-8 text-center max-w-2xl mx-auto">
          <div>
            <p className="text-2xl mb-2">🔒</p>
            <p className="text-sm font-bold text-[#1a2028] mb-1">No Lock-in</p>
            <p className="text-xs text-[#94a7bf]">Cancel anytime. Your data is always yours.</p>
          </div>
          <div>
            <p className="text-2xl mb-2">💳</p>
            <p className="text-sm font-bold text-[#1a2028] mb-1">No Card Upfront</p>
            <p className="text-xs text-[#94a7bf]">Try free for 14 days. Only pay if you love it.</p>
          </div>
          <div>
            <p className="text-2xl mb-2">🤝</p>
            <p className="text-sm font-bold text-[#1a2028] mb-1">Real Support</p>
            <p className="text-xs text-[#94a7bf]">Email & chat with humans who actually help.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
