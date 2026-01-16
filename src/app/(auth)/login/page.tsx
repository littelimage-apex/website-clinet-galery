import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-soft p-8 sm:p-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-script text-2xl text-lavender-600">
              Little Image
            </span>
            <span className="block text-xs tracking-widest uppercase text-charcoal-500 mt-1">
              Photography
            </span>
          </Link>
        </div>

        {/* Welcome Heading */}
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-800 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-charcoal-500 text-center text-sm mb-8">
          Enter your credentials to access your gallery
        </p>

        {/* Login Form */}
        <LoginForm />

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-charcoal-500 hover:text-lavender-600 transition-colors duration-300"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
