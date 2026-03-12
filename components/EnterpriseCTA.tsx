'use client'
import Link from 'next/link'
export default function EnterpriseCTA() {
  return (
    <section className="py-28 px-6 bg-[#f5f6f8]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#94a7bf] mb-4">For High-Volume Sellers</p>
        
        <div className="flex items-center justify-center gap-4 mb-14">
          {['📦', '🎁', '⭐', '📈', '📧', '📝'].map((e, i) => (
            <div key={i} className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-[#e5e8ed] flex items-center justify-center text-2xl">
              {e}
            </div>
          ))}
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-6xl sm:text-7xl lg:text-[9rem] leading-[0.9] tracking-tight mb-8">
          <span className="text-[#1a2028] block">UNIFIED COMMERCE.</span>
          <span className="text-gradient block">GLOBAL SCALE.</span>
        </h2>
        <p className="text-lg sm:text-xl text-[#627a90] max-w-2xl mx-auto mb-6 leading-relaxed">
          Selling across multiple stores, managing thousands of SKUs, or coordinating with warehouses worldwide? 
          Our enterprise plan gives you multi-store connections, priority support, and custom integrations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-12">
          {[
            'Multi-store connections',
            'Dedicated account manager',
            'Custom API integrations',
            'Priority support SLA',
            'Volume-based pricing',
            'Onboarding assistance',
          ].map((item) => (
            <span key={item} className="text-sm text-[#627a90] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3385ff]" />
              {item}
            </span>
          ))}
        </div>
        <Link
          href="/contact"
          className="inline-block px-14 py-6 text-base font-black uppercase tracking-[0.2em] text-white bg-[#1a2028] hover:bg-[#313c48] rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
        >
          Book Enterprise Demo
        </Link>
        <p className="text-sm text-[#94a7bf] mt-4">
          We&apos;ll walk you through a personalized demo based on your business needs.
        </p>
      </div>
    </section>
  )
}
