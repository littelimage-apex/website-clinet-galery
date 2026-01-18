'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-cream-50 to-sage-100" />

      {/* Decorative soft circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-sage-200 rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sage-300 rounded-full opacity-20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream-200 rounded-full opacity-40 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Script accent text */}
        <p className="font-serif text-2xl md:text-3xl text-sage-600 mb-4 animate-fade-in">
          Little Image Photography
        </p>

        {/* Main headline */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-sage-800 mb-6 leading-tight animate-fade-in">
          Capturing life&apos;s most precious beginnings
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-sage-500 mb-10 max-w-2xl mx-auto animate-fade-in">
          Timeless newborn and childhood photography for families who cherish every fleeting moment
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <Link
            href="/portal"
            className="btn btn-primary text-lg px-8 py-4 rounded-full shadow-soft hover:shadow-lifted transition-all duration-400"
          >
            Client Portal
          </Link>
          <a
            href="#portfolio"
            className="btn btn-secondary text-lg px-8 py-4 rounded-full transition-all duration-400"
          >
            View Our Work
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-sage-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
