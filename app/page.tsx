import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import AppsSection from '@/components/AppsSection'
import Pricing from '@/components/Pricing'
import EnterpriseCTA from '@/components/EnterpriseCTA'
export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <AppsSection />
        <Pricing />
        <EnterpriseCTA />
      </main>
      <Footer />
    </>
  )
}
