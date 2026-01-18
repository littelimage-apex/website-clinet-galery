import Hero from '@/components/landing/Hero'
import PortfolioGrid from '@/components/landing/PortfolioGrid'
import PricingCards from '@/components/landing/PricingCards'
import AboutSection from '@/components/landing/AboutSection'
import ContactForm from '@/components/landing/ContactForm'

export default function LandingPage() {
  return (
    <>
      <Hero />

      <section id="portfolio" className="py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-sage-800 mb-4">
              Our Portfolio
            </h2>
            <p className="text-sage-500 max-w-2xl mx-auto">
              A glimpse into the precious moments we&apos;ve had the honor of capturing
            </p>
          </div>
          <PortfolioGrid />
        </div>
      </section>

      <AboutSection />

      <section id="pricing" className="py-20 bg-cream-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-sage-800 mb-4">
              Session Packages
            </h2>
            <p className="text-sage-500 max-w-2xl mx-auto">
              Choose the perfect package to preserve your family&apos;s precious moments
            </p>
          </div>
          <PricingCards />
        </div>
      </section>

      <section id="contact" className="py-20 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-sage-800 mb-4">
              Let&apos;s Connect
            </h2>
            <p className="text-sage-500">
              Ready to capture your little one&apos;s precious moments? We&apos;d love to hear from you.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
