'use client'

interface ProgressBarProps {
  current: number
  total: number
  showText?: boolean
  size?: 'sm' | 'md'
}

export function ProgressBar({
  current,
  total,
  showText = true,
  size = 'md'
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0
  const isComplete = current >= total

  const heightClass = size === 'sm' ? 'h-4' : 'h-5'
  const textClass = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <div className="flex items-center gap-2">
      <div
        className={`relative flex-1 min-w-[80px] ${heightClass} bg-lavender-100 rounded-full overflow-hidden`}
      >
        {/* Progress fill */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
            isComplete
              ? 'bg-[var(--sage-400)]'
              : 'bg-lavender-400'
          }`}
          style={{ width: `${percentage}%` }}
        />

        {/* Text overlay */}
        {showText && (
          <div className={`absolute inset-0 flex items-center justify-center ${textClass} font-medium`}>
            <span className={percentage > 50 ? 'text-white' : 'text-charcoal-700'}>
              {current} of {total}
            </span>
          </div>
        )}
      </div>

      {/* Completion indicator */}
      {isComplete && (
        <svg
          className="w-4 h-4 text-[var(--sage-500)] flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  )
}
