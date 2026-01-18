'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Lock, ImageIcon } from 'lucide-react'
import { Celebration } from '@/components/ui/Celebration'
import { DownloadButton, DownloadAllButton } from '@/components/gallery/DownloadButton'

interface FinalImage {
  id: string
  url: string
  filename: string
  width?: number
  height?: number
}

interface DeliveryViewProps {
  currentStage: number
  finalUrl?: string
  images: FinalImage[]
  childName?: string
  projectTitle?: string
  className?: string
}

export function DeliveryView({
  currentStage,
  finalUrl,
  images,
  childName,
  projectTitle,
  className = ''
}: DeliveryViewProps) {
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set())
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    // Check if stage 3 is accessible
    setIsUnlocked(currentStage >= 3)
  }, [currentStage])

  // Stagger image animations
  useEffect(() => {
    if (!isUnlocked) return

    images.forEach((image, index) => {
      setTimeout(() => {
        setVisibleImages(prev => new Set(prev).add(image.id))
      }, 150 * index)
    })
  }, [images, isUnlocked])

  // Locked state - show message if accessed before stage 3
  if (!isUnlocked) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${className}`}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center">
            <Lock className="w-10 h-10 text-sage-400" />
          </div>
          <h2
            className="font-serif text-2xl text-sage-800 mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Your Photos Are Almost Ready
          </h2>
          <p className="text-sage-500 leading-relaxed">
            Your final edited photos will appear here once they&apos;re ready for download.
            We&apos;re still perfecting every detail to make your memories shine.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100 text-sage-700 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500"></span>
            </span>
            Currently in Stage {currentStage}
          </div>
        </div>
      </div>
    )
  }

  // No images available
  if (images.length === 0) {
    return (
      <div className={`min-h-[60vh] flex items-center justify-center ${className}`}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--sage-400)]/20 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-[var(--sage-500)]" />
          </div>
          <h2
            className="font-serif text-2xl text-sage-800 mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Photos Are Being Prepared
          </h2>
          <p className="text-sage-500 leading-relaxed">
            Your final photos are being uploaded and will appear here shortly.
            Please check back soon!
          </p>
        </div>
      </div>
    )
  }

  // Get all image URLs for bulk download
  const allImageUrls = images.map(img => img.url)
  const archiveName = projectTitle
    ? `${projectTitle.replace(/\s+/g, '-').toLowerCase()}-photos.zip`
    : childName
    ? `${childName.replace(/\s+/g, '-').toLowerCase()}-photos.zip`
    : 'little-image-photos.zip'

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Celebration Header */}
      <Celebration childName={childName} className="py-8" />

      {/* Download All Button - Prominent placement */}
      <div className="flex justify-center">
        <DownloadAllButton
          urls={allImageUrls}
          archiveName={archiveName}
        />
      </div>

      {/* Image Count */}
      <p className="text-center text-sage-500">
        {images.length} beautiful {images.length === 1 ? 'photo' : 'photos'} ready for you
      </p>

      {/* Image Grid - Larger images for finals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {images.map((image) => (
          <div
            key={image.id}
            className={`
              group relative overflow-hidden rounded-3xl bg-cream-100
              transition-all duration-500 ease-out
              ${visibleImages.has(image.id)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
              }
            `}
          >
            {/* Image Container with aspect ratio */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={image.url}
                alt={image.filename}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="
                absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
              " />

              {/* Download Button - Appears on hover */}
              <div className="
                absolute bottom-4 right-4
                opacity-0 group-hover:opacity-100
                translate-y-2 group-hover:translate-y-0
                transition-all duration-300
              ">
                <DownloadButton
                  url={image.url}
                  filename={image.filename}
                  variant="icon"
                />
              </div>

              {/* Filename on hover */}
              <div className="
                absolute bottom-4 left-4 right-16
                opacity-0 group-hover:opacity-100
                translate-y-2 group-hover:translate-y-0
                transition-all duration-300
              ">
                <p className="text-white text-sm font-medium truncate drop-shadow-lg">
                  {image.filename}
                </p>
              </div>
            </div>

            {/* Soft border glow effect */}
            <div className="
              absolute inset-0 rounded-3xl pointer-events-none
              ring-1 ring-inset ring-black/5
              group-hover:ring-[var(--sage-400)]/30
              transition-all duration-300
            " />
          </div>
        ))}
      </div>

      {/* Thank You Footer */}
      <div className="text-center pt-8 pb-4 border-t border-sage-100">
        <p
          className="font-serif text-xl text-[var(--sage-500)] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Thank you for choosing
        </p>
        <p
          className="font-serif text-2xl text-sage-800"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Little Image Photography
        </p>
        <p className="text-sage-500 text-sm mt-2">
          We hope these images bring you joy for years to come.
        </p>
      </div>
    </div>
  )
}
