import { STAGE_LABELS } from '@/types/database'

interface StageBadgeProps {
  stage: number
  size?: 'sm' | 'md'
}

export function StageBadge({ stage, size = 'md' }: StageBadgeProps) {
  const label = STAGE_LABELS[stage as keyof typeof STAGE_LABELS] || 'Unknown'

  const baseClasses = 'inline-flex items-center gap-1.5 font-medium transition-all duration-[400ms]'

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs rounded-lg',
    md: 'px-3 py-1.5 text-sm rounded-xl'
  }

  const stageClasses = {
    1: 'bg-sage-100 text-sage-700 border border-sage-200',
    2: 'bg-[var(--champagne-400)] text-sage-800 border border-[var(--champagne-500)]',
    3: 'bg-[var(--sage-400)] text-white border border-[var(--sage-500)]'
  }

  const iconClasses = {
    1: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    2: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.39m3.421 3.415l2.12-2.121m3.415 3.421l2.121-2.12" />
      </svg>
    ),
    3: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${stageClasses[stage as keyof typeof stageClasses] || stageClasses[1]}`}>
      {iconClasses[stage as keyof typeof iconClasses]}
      <span>{label}</span>
    </span>
  )
}
