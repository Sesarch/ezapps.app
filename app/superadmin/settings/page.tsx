'use client'

export const dynamic = 'force-dynamic'

export default function AdminSettingsPage() {
  
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-gray-400 mt-1">Configure your EZ Apps platform</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* General Settings */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">General Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Platform Name</label>
              <input
                type="text"
                defaultValue="EZ Apps"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
              <input
                type="email"
                defaultValue="support@ezapps.app"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff] focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Trial Settings */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Trial Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Trial Duration (days)</label>
              <input
                type="number"
                defaultValue="14"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#3385ff] focus:border-transparent outline-none"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-[#3385ff] focus:ring-[#3385ff]" />
              <span className="text-gray-300">Require credit card for trial</span>
            </label>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Integrations</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl">💳</div>
                <div>
                  <p className="font-medium text-white">Stripe</p>
                  <p className="text-sm text-gray-400">Payment processing</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-600/20 text-amber-400 text-xs font-medium rounded-full">
                Not Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-xl">🛍️</div>
                <div>
                  <p className="font-medium text-white">Shopify</p>
                  <p className="text-sm text-gray-400">E-commerce platform</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-600/20 text-amber-400 text-xs font-medium rounded-full">
                Not Connected
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-[#313c48] text-white rounded-lg font-medium hover:bg-[#1a2028] transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
