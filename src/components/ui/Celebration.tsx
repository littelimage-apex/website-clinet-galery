'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Heart } from 'lucide-react'

interface CelebrationProps {
  childName?: string
  className?: string
}

export function Celebration({ childName, className = '' }: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`text-center transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {/* Decorative sparkles */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <Sparkles
          className="w-5 h-5 text-[var(--champagne-500)] animate-pulse"
          style={{ animationDelay: '0ms' }}
        />
        <Heart
          className="w-6 h-6 text-[var(--sage-500)] fill-[var(--sage-400)]"
        />
        <Sparkles
          className="w-5 h-5 text-[var(--champagne-500)] animate-pulse"
          style={{ animationDelay: '200ms' }}
        />
      </div>

      {/* Main heading */}
      <h1
        className="font-serif text-4xl md:text-5xl lg:text-6xl text-sage-800 mb-3 tracking-tight"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Ready to Cherish
      </h1>

      {/* Personalized subtitle */}
      {childName && (
        <p
          className="font-serif text-2xl md:text-3xl text-[var(--sage-500)] mb-6"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {childName}&apos;s precious moments
        </p>
      )}

      {/* Thank you message */}
      <div
        className={`max-w-xl mx-auto transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-sage-600 text-lg leading-relaxed mb-2">
          Your beautiful memories are ready to download and treasure forever.
        </p>
        <p className="text-sage-500 text-base">
          Thank you for trusting us to capture these special moments.
        </p>
      </div>

      {/* Decorative line */}
      <div
        className={`mt-8 flex items-center justify-center gap-4 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--sage-300)]" />
        <Heart className="w-4 h-4 text-[var(--sage-400)] fill-[var(--sage-400)]" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--sage-300)]" />
      </div>
    </div>
  )
}
