import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1a2028]">EZ Apps</h1>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Login</Link>
            <Link href="/login" className="px-4 py-2 bg-[#3385ff] text-white rounded-lg font-medium hover:bg-[#2b6fcc]">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-[#1a2028] mb-6">All Your E-Commerce Apps,<br />One Platform</h2>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">Manage inventory, reviews, loyalty, upsells, marketing and forms — all in one place for $67/month.</p>
        <Link href="/login" className="inline-block px-8 py-4 bg-[#3385ff] text-white rounded-xl text-lg font-semibold hover:bg-[#2b6fcc]">
          Start Free Trial
        </Link>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-20">
          {[
            { icon: '📦', name: 'Inventory Manager', desc: 'Track products, parts, BOMs & orders' },
            { icon: '⭐', name: 'Review Manager', desc: 'Collect & display product reviews' },
            { icon: '🎁', name: 'Loyalty Program', desc: 'Reward customers with points' },
            { icon: '📈', name: 'Upsell Engine', desc: 'Boost revenue with smart upsells' },
            { icon: '📣', name: 'Email/SMS Marketing', desc: 'Send targeted campaigns' },
            { icon: '📋', name: 'Form Builder', desc: 'Build custom store forms' },
          ].map(app => (
            <div key={app.name} className="bg-white rounded-2xl border border-gray-200 p-6 text-left">
              <div className="text-4xl mb-3">{app.icon}</div>
              <h3 className="font-bold text-[#1a2028] mb-1">{app.name}</h3>
              <p className="text-gray-500 text-sm">{app.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
