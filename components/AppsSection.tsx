'use client'
import Image from 'next/image'

const platforms = [
  {
    name: 'Shopify',
    logo: '/Shopify.png',
    status: 'Live',
    type: 'Hosted SaaS',
    stores: '4.8M+',
    share: '~26%',
    gmv: '$350B+',
    desc: 'The world\'s leading hosted e-commerce platform. Shopify powers millions of stores from solo entrepreneurs to enterprise brands like Gymshark and Allbirds. Its all-in-one approach — hosting, payments, checkout, and app ecosystem — makes it the fastest way to launch and scale an online store.',
    strengths: ['Fastest setup & easiest to use', 'Built-in payment processing', 'Massive app ecosystem (8,000+ apps)', 'Shopify Plus for enterprise ($2,300+/mo)'],
    bestFor: 'Businesses of all sizes wanting a fully managed, scalable platform.',
  },
  {
    name: 'WooCommerce',
    logo: '/wooCommerce.png',
    status: 'Coming Soon',
    type: 'Open Source (WordPress)',
    stores: '4.5M+',
    share: '~33%',
    gmv: '$30–35B',
    desc: 'The most widely installed e-commerce platform in the world, built on WordPress. WooCommerce gives store owners complete control over their data, design, and functionality through an ecosystem of 59,000+ plugins. Ideal for businesses already running WordPress sites.',
    strengths: ['Free core software — no monthly platform fee', 'Full data ownership & customization', 'Largest plugin ecosystem in e-commerce', 'Strong in Europe, Asia & emerging markets'],
    bestFor: 'WordPress users, developers, and cost-conscious merchants who want full control.',
  },
  {
    name: 'Etsy',
    logo: '/etsy.png',
    status: 'Coming Soon',
    type: 'Online Marketplace',
    stores: '5.6M+',
    share: 'Top 5 US',
    gmv: '$12.5B',
    desc: 'The go-to marketplace for handmade, vintage, and unique goods. With nearly 90 million active buyers and 450 million monthly visits, Etsy gives independent sellers instant access to a massive audience without building their own storefront.',
    strengths: ['Built-in audience of 90M+ active buyers', 'Low barrier to entry ($0.20 per listing)', '33% of transactions are personalized items', 'Strong in Home & Living, Jewelry, Gifts'],
    bestFor: 'Artisans, crafters, and niche sellers of handmade or vintage products.',
  },
  {
    name: 'Amazon',
    logo: '/amazon.png',
    status: 'Coming Soon',
    type: 'Online Marketplace',
    stores: '1.9M+',
    share: '~40% US',
    gmv: '$846B',
    desc: 'The world\'s largest online marketplace. Amazon captures roughly 40 cents of every e-commerce dollar spent in the US. Third-party sellers account for 61% of all units sold, with Fulfillment by Amazon (FBA) handling storage, shipping, and returns.',
    strengths: ['300M+ active customers worldwide', 'FBA handles logistics end-to-end', '61% of sales from third-party sellers', 'Prime Day drives massive seasonal revenue'],
    bestFor: 'Sellers seeking maximum reach, FBA logistics, and access to Prime customers.',
  },
  {
    name: 'Wix',
    logo: '/Wix.png',
    status: 'Coming Soon',
    type: 'Hosted SaaS',
    stores: '1M+',
    share: '~18%',
    gmv: 'N/A',
    desc: 'A design-first website builder with integrated e-commerce. Wix combines drag-and-drop simplicity with 2,000+ templates and a new AI Website Builder that generates storefronts from text prompts. Growing rapidly with 260 million registered users globally.',
    strengths: ['Most design templates of any builder (2,000+)', 'AI-powered website generation', 'No transaction fees on Wix Payments', 'Built-in marketing & SEO tools'],
    bestFor: 'Small businesses and creatives who prioritize design freedom and ease of use.',
  },
  {
    name: 'BigCommerce',
    logo: '/BigCommerce.png',
    status: 'Coming Soon',
    type: 'Open SaaS',
    stores: '40K+',
    share: '~0.3%',
    gmv: 'N/A',
    desc: 'An enterprise-grade "Open SaaS" platform that bridges hosted convenience with open-source flexibility. BigCommerce is built for high-volume sellers with massive catalogs, complex B2B operations, and multi-channel selling requirements.',
    strengths: ['No transaction fees on any plan', 'Built-in B2B and wholesale features', 'Headless commerce architecture support', 'Multi-channel selling (Amazon, eBay, social)'],
    bestFor: 'Mid-market to enterprise merchants with complex catalogs and B2B needs.',
  },
  {
    name: 'Squarespace',
    logo: '/squarespace.png',
    status: 'Coming Soon',
    type: 'Hosted SaaS',
    stores: '355K+',
    share: '~9%',
    gmv: 'N/A',
    desc: 'The design-forward website platform with integrated commerce. Squarespace is known for award-winning templates and a polished brand experience. Their commerce tools support products, subscriptions, memberships, and digital downloads.',
    strengths: ['Industry-leading design templates', 'Built-in subscriptions & memberships', 'Integrated email campaigns', 'Strong with creative brands & portfolios'],
    bestFor: 'Design-conscious brands, creatives, and businesses selling products + content.',
  },
  {
    name: 'Magento',
    logo: '/MagentoCommerce.png',
    status: 'Coming Soon',
    type: 'Open Source / Enterprise',
    stores: '125K+',
    share: '~7%',
    gmv: 'N/A',
    desc: 'Now Adobe Commerce, Magento is the powerhouse platform for enterprise e-commerce. It leads in Europe with 18% market share and is chosen by global brands like Nike, Coca-Cola, and Land Rover for its unmatched customization and multi-store capabilities.',
    strengths: ['Unmatched enterprise scalability', '#1 in Europe for large e-commerce', 'Multi-store, multi-language, multi-currency', 'Deep B2B and marketplace features'],
    bestFor: 'Enterprise and high-volume retailers with dedicated development teams.',
  },
  {
    name: 'OpenCart',
    logo: '/opencart.png',
    status: 'Coming Soon',
    type: 'Open Source',
    stores: '185K+',
    share: '~4%',
    gmv: 'N/A',
    desc: 'A free, open-source e-commerce platform popular in Eastern Europe and Asia. OpenCart offers a clean admin interface, multi-store support, and a large extension marketplace — all without monthly platform fees. Easy to learn for WordPress-familiar users.',
    strengths: ['Completely free core platform', 'Simple, intuitive admin interface', 'Multi-store management from one dashboard', 'Popular in Eastern Europe & Asia'],
    bestFor: 'Tech-savvy small to mid-sized businesses seeking a free, self-hosted solution.',
  },
]

export default function AppsSection() {
  return (
    <section id="platforms" className="py-28 px-6 bg-[#f5f6f8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#94a7bf] mb-4">Integrations</p>
          <h2 className="font-[family-name:var(--font-display)] text-6xl lg:text-7xl text-[#1a2028] tracking-tight leading-[0.9]">
            CONNECT YOUR<br/>STORES.
          </h2>
          <p className="mt-6 text-lg text-[#627a90] max-w-2xl mx-auto">
            Sell on multiple platforms? EZ Apps keeps your inventory, orders, and stock levels perfectly synced across every channel — so you never oversell or miss a restock.
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {platforms.map((p) => (
            <div
              key={p.name}
              className={`group bg-white border rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#627a90]/5 ${
                p.status === 'Live'
                  ? 'border-[#10b981]/30 ring-1 ring-[#10b981]/10'
                  : 'border-[#e5e8ed] hover:border-[#bcc8d9]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="h-12 w-16 flex items-center justify-start">
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={100}
                    height={48}
                    className={`max-h-10 w-auto object-contain transition-opacity ${
                      p.status === 'Live' ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-[#1a2028]">{p.name}</p>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      p.status === 'Live'
                        ? 'bg-[#10b981]/10 text-[#10b981]'
                        : 'bg-[#627a90]/8 text-[#94a7bf]'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#94a7bf] uppercase tracking-wider">{p.type}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#f0f2f5]">
                <div className="text-center flex-1">
                  <div className="text-sm font-black text-[#1a2028]">{p.stores}</div>
                  <div className="text-[9px] font-semibold text-[#94a7bf] uppercase tracking-wider">Stores</div>
                </div>
                <div className="w-px h-8 bg-[#e5e8ed]" />
                <div className="text-center flex-1">
                  <div className="text-sm font-black text-[#1a2028]">{p.share}</div>
                  <div className="text-[9px] font-semibold text-[#94a7bf] uppercase tracking-wider">Market</div>
                </div>
                <div className="w-px h-8 bg-[#e5e8ed]" />
                <div className="text-center flex-1">
                  <div className="text-sm font-black text-[#1a2028]">{p.gmv}</div>
                  <div className="text-[9px] font-semibold text-[#94a7bf] uppercase tracking-wider">GMV</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#627a90] leading-relaxed mb-5">{p.desc}</p>

              {/* Strengths */}
              <div className="space-y-2 mb-5">
                {p.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#10b981] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-[#627a90]">{s}</span>
                  </div>
                ))}
              </div>

              {/* Best for */}
              <div className="bg-[#f5f6f8] rounded-xl px-4 py-3">
                <span className="text-[10px] font-bold text-[#94a7bf] uppercase tracking-wider">Best for: </span>
                <span className="text-xs text-[#627a90]">{p.bestFor}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-14">
          <p className="text-sm text-[#94a7bf]">
            Selling on a platform not listed here?{' '}
            <a href="/contact" className="text-[#3385ff] font-semibold hover:underline">Let us know</a>
            {' '}— we prioritize based on demand.
          </p>
        </div>
      </div>
    </section>
  )
}
