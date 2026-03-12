'use client'
import Link from 'next/link'
import Image from 'next/image'

const icons = [
  { emoji: '📦', label: 'Inventory' },
  { emoji: '🎁', label: 'Loyalty' },
  { emoji: '⭐', label: 'Reviews' },
  { emoji: '📈', label: 'Upsell' },
  { emoji: '📧', label: 'Marketing' },
  { emoji: '📝', label: 'Forms' },
]

const platformsLeft = [
  { src: '/Wix.png', alt: 'Wix' },
  { src: '/wooCommerce.png', alt: 'WooCommerce' },
  { src: '/BigCommerce.png', alt: 'BigCommerce' },
  { src: '/etsy.png', alt: 'Etsy' },
]

const platformsRight = [
  { src: '/amazon.png', alt: 'Amazon' },
  { src: '/squarespace.png', alt: 'Squarespace' },
  { src: '/MagentoCommerce.png', alt: 'Magento' },
  { src: '/opencart.png', alt: 'OpenCart' },
]

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 bg-[#f5f6f8] overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#1a2028] mb-10">
          Multi-Platform E-commerce Partner
        </p>

        {/* Platform logos row */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-5 mb-8">
          {platformsLeft.map((p) => (
            <div
              key={p.alt}
              className="group relative w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl shadow-sm border border-[#e5e8ed] flex items-center justify-center p-1 sm:p-1.5 opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-200 cursor-default"
            >
              <Image src={p.src} alt={p.alt} width={40} height={40} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-200" />
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1a2028] text-white text-[10px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                Coming soon!
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a2028] rotate-45" />
              </span>
            </div>
          ))}

          {/* Shopify — center, bigger, circular */}
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full shadow-md flex items-center justify-center p-2.5 sm:p-4 hover:scale-110 transition-all duration-200">
            <Image src="/Shopify.png" alt="Shopify" width={64} height={64} className="w-full h-full object-contain" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#96bf48] text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
              Live
            </span>
          </div>

          {platformsRight.map((p) => (
            <div
              key={p.alt}
              className="group relative w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl shadow-sm border border-[#e5e8ed] flex items-center justify-center p-1 sm:p-1.5 opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-200 cursor-default"
            >
              <Image src={p.src} alt={p.alt} width={40} height={40} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-200" />
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1a2028] text-white text-[10px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                Coming soon!
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a2028] rotate-45" />
              </span>
            </div>
          ))}
        </div>

        {/* Icon strip with app names */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-14">
          {icons.map((icon) => (
            <div key={icon.label} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#e5e8ed] flex items-center justify-center text-lg sm:text-2xl hover:scale-110 transition-transform duration-200">
                {icon.emoji}
              </div>
              <span className="text-[8px] sm:text-xs font-semibold text-[#627a90] uppercase tracking-wider">
                {icon.label}
              </span>
            </div>
          ))}
        </div>

        {/* Main headline */}
        <h1 className="font-[family-name:var(--font-display)] text-7xl sm:text-8xl lg:text-[10rem] leading-[0.9] tracking-tight mb-8">
          <span className="text-[#1a2028] block">ONE DASHBOARD.</span>
          <span className="text-gradient block">EVERY PLATFORM.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#627a90] max-w-2xl mx-auto mb-12 leading-relaxed">
          EZ Apps provides the mission-critical infrastructure for multi-channel sellers. 
          Manage inventory, orders, BOMs, and analytics from a single command center.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-10 py-5 text-base font-black uppercase tracking-wider text-white bg-[#1a2028] hover:bg-[#313c48] rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Start Free Trial
          </Link>
          <Link
            href="/how-it-works"
            className="px-10 py-5 text-base font-bold uppercase tracking-wider text-[#627a90] hover:text-[#1a2028] bg-white border border-[#dce3ed] hover:border-[#bcc8d9] rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
          >
            See How It Works
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-md mx-auto">
          {[
            { num: '9+', label: 'Platforms' },
            { num: '∞', label: 'Products' },
            { num: '99.9%', label: 'Uptime' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-[#1a2028]">{s.num}</div>
              <div className="text-sm font-medium text-[#94a7bf] mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
