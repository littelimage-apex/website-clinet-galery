'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'

interface ImageCardProps {
  src: string
  filename: string
  isSelected: boolean
  onSelect: () => void
  onClick: () => void
  disabled?: boolean
}

export function ImageCard({
  src,
  filename,
  isSelected,
  onSelect,
  onClick,
  disabled = false
}: ImageCardProps) {
  return (
    <div
      className={`
        relative group rounded-xl overflow-hidden cursor-pointer
        transition-all duration-[400ms] ease-out
        ${isSelected ? 'selection-glow' : ''}
        ${disabled && !isSelected ? 'opacity-50' : ''}
      `}
    >
      {/* Image */}
      <div
        onClick={onClick}
        className="relative aspect-[4/5] image-hover"
      >
        <Image
          src={src}
          alt={filename}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Watermark overlay (simulated) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white/20 font-serif text-4xl rotate-[-30deg] select-none">
            Little Image
          </span>
        </div>

        {/* Hover overlay */}
        <div className={`
          absolute inset-0 bg-sage-900/0 group-hover:bg-sage-900/20
          transition-all duration-[400ms]
        `} />

        {/* Click hint */}
        <div className={`
          absolute inset-0 flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]
        `}>
          <span className="bg-white/90 text-sage-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-soft">
            Click to view
          </span>
        </div>
      </div>

      {/* Selection button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled || isSelected) {
            onSelect()
          }
        }}
        disabled={disabled && !isSelected}
        className={`
          absolute top-3 right-3 w-10 h-10 rounded-full
          flex items-center justify-center
          transition-all duration-[400ms]
          ${isSelected
            ? 'bg-sage-500 text-white scale-100'
            : 'bg-white/80 text-sage-400 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'
          }
          ${disabled && !isSelected ? 'cursor-not-allowed' : 'hover:scale-110'}
          shadow-soft
        `}
        aria-label={isSelected ? 'Deselect image' : 'Select image'}
      >
        <Heart
          className={`w-5 h-5 ${isSelected ? 'fill-current' : ''}`}
        />
      </button>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-sage-500 text-white text-xs font-medium px-3 py-1.5 rounded-full text-center">
            Selected
          </div>
        </div>
      )}

      {/* Filename (on hover) */}
      <div className={`
        absolute bottom-3 left-3 right-3
        opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]
        ${isSelected ? 'hidden' : ''}
      `}>
        <div className="bg-sage-900/70 text-white text-xs px-2 py-1 rounded truncate">
          {filename}
        </div>
      </div>
    </div>
  )
}
