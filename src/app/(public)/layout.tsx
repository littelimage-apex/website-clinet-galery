import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream-50/80 backdrop-blur-soft border-b border-lavender-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group">
            <h1 className="font-script text-2xl text-lavender-700 tracking-wide group-hover:text-lavender-600 transition-colors duration-300">
              Little Image
            </h1>
            <p className="text-[10px] text-charcoal-400 uppercase tracking-[0.2em] -mt-0.5">
              Photography
            </p>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="#portfolio"
              className="text-charcoal-600 hover:text-lavender-600 transition-colors duration-300 text-sm font-medium"
            >
              Portfolio
            </Link>
            <Link
              href="#pricing"
              className="text-charcoal-600 hover:text-lavender-600 transition-colors duration-300 text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-charcoal-600 hover:text-lavender-600 transition-colors duration-300 text-sm font-medium"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="bg-lavender-500 text-white px-5 py-2.5 rounded-full font-medium text-sm
                         hover:bg-lavender-600 hover:-translate-y-0.5 transition-all duration-300
                         shadow-soft hover:shadow-lifted"
            >
              Client Portal
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-lavender-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-script text-3xl text-lavender-200 mb-4">Little Image</h3>
              <p className="text-lavender-300 text-sm leading-relaxed">
                Capturing life&apos;s most precious beginnings with artistry and love.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-4 text-lavender-100">Quick Links</h4>
              <ul className="space-y-2 text-sm text-lavender-300">
                <li><Link href="#portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Client Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-4 text-lavender-100">Contact</h4>
              <p className="text-lavender-300 text-sm">
                hello@littleimage.com<br />
                Available by appointment
              </p>
            </div>
          </div>
          <div className="border-t border-lavender-800 mt-12 pt-8 text-center text-lavender-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Little Image Photography. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
