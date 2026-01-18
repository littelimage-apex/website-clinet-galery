'use client'

interface SelectionCounterProps {
  selected: number
  limit: number
}

export function SelectionCounter({ selected, limit }: SelectionCounterProps) {
  const percentage = Math.min((selected / limit) * 100, 100)
  const isComplete = selected >= limit

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-slide-in">
      <div className={`
        bg-white rounded-2xl shadow-lifted p-4 min-w-[180px]
        border-2 transition-colors duration-300
        ${isComplete ? 'border-sage' : 'border-sage-200'}
      `}>
        {/* Counter text */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-serif text-2xl text-sage-800">
            {selected}
          </span>
          <span className="text-sage-400 text-sm">
            of {limit} selected
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all duration-500 ease-out
              ${isComplete ? 'bg-sage' : 'bg-sage-500'}
            `}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Status text */}
        <p className={`
          text-xs mt-2 text-center font-medium
          ${isComplete ? 'text-sage' : 'text-sage-400'}
        `}>
          {isComplete ? 'Selection complete!' : `${limit - selected} more to go`}
        </p>
      </div>
    </div>
  )
}
