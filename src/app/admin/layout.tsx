import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export const metadata = {
  title: 'Studio Admin - Little Image Photography',
  description: 'Admin dashboard for Little Image Photography studio',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Admin Header */}
      <header className="border-b border-sage-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <Logo className="w-24" />
              <span className="text-stone-400 font-normal text-sm border-l border-stone-200 pl-4 py-1">
                Studio Admin
              </span>
            </div>

            {/* Back to Site Link */}
            <Link
              href="/"
              className="flex items-center gap-2 text-sage-500 hover:text-sage-600 transition-colors duration-300 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to main site</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
