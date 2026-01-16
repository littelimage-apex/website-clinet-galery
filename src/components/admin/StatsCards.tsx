'use client'

import { Heart, Palette, CheckCircle, FolderOpen } from 'lucide-react'

interface StatsCardsProps {
  totalActive: number
  inSelection: number
  inEditing: number
  readyToDeliver: number
  completedThisMonth: number
}

export function StatsCards({
  totalActive,
  inSelection,
  inEditing,
  readyToDeliver,
  completedThisMonth
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Active Projects',
      value: totalActive,
      icon: FolderOpen,
      color: 'bg-lavender-100 text-lavender-600',
      borderColor: 'border-lavender-200',
    },
    {
      label: 'Choosing Favorites',
      value: inSelection,
      icon: Heart,
      color: 'bg-lavender-50 text-lavender-500',
      borderColor: 'border-lavender-100',
      subtitle: 'Stage 1',
    },
    {
      label: 'In the Darkroom',
      value: inEditing,
      icon: Palette,
      color: 'bg-[var(--champagne-400)]/20 text-[var(--champagne-500)]',
      borderColor: 'border-[var(--champagne-400)]/30',
      subtitle: 'Stage 2',
    },
    {
      label: 'Ready to Cherish',
      value: readyToDeliver,
      icon: CheckCircle,
      color: 'bg-[var(--sage-400)]/20 text-[var(--sage-500)]',
      borderColor: 'border-[var(--sage-400)]/30',
      subtitle: 'Stage 3',
    },
    {
      label: 'Completed This Month',
      value: completedThisMonth,
      icon: CheckCircle,
      color: 'bg-charcoal-50 text-charcoal-600',
      borderColor: 'border-charcoal-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white rounded-2xl p-4 border ${stat.borderColor} shadow-soft hover:shadow-lifted transition-shadow duration-300`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-xl ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            {stat.subtitle && (
              <span className="text-[10px] font-medium text-charcoal-400 uppercase tracking-wider">
                {stat.subtitle}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-charcoal-800">{stat.value}</p>
            <p className="text-xs text-charcoal-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
