'use client'

import { useState, useCallback, useTransition } from 'react'
import Image from 'next/image'
import { RevisionItem, ProjectAssets, ClientData } from '@/types/database'
import { ReviewModal } from './ReviewModal'
import { StatusBadge } from './RevisionThread'
import { approveAllImages } from '@/lib/actions/reviews'

interface ReviewImage {
  filename: string
  url: string
  version: number
  status: 'pending' | 'approved' | 'rejected'
  revisions: RevisionItem[]
}

interface ReviewGalleryProps {
  projectId: string
  assets: ProjectAssets
  clientData: ClientData
  onStageComplete?: () => void
}

function getImagesFromRevisions(
  revisions: RevisionItem[],
  reviewUrl: string
): ReviewImage[] {
  // Group revisions by filename and get the latest version for each
  const latestByFilename = new Map<string, RevisionItem>()

  revisions.forEach((revision) => {
    const existing = latestByFilename.get(revision.filename)
    if (!existing || revision.version > existing.version) {
      latestByFilename.set(revision.filename, revision)
    }
  })

  // Convert to ReviewImage array
  return Array.from(latestByFilename.entries()).map(([filename, latest]) => ({
    filename,
    url: `${reviewUrl}/${filename}`,
    version: latest.version,
    status: latest.status,
    revisions: revisions.filter((r) => r.filename === filename)
  }))
}

export function ReviewGallery({
  projectId,
  assets,
  clientData,
  onStageComplete
}: ReviewGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ReviewImage | null>(null)
  const [isPending, startTransition] = useTransition()
  const [refreshKey, setRefreshKey] = useState(0)

  const reviewUrl = assets.review_url || ''
  const revisions = clientData.revision_history || []

  const images = getImagesFromRevisions(revisions, reviewUrl)

  // Count approved images
  const approvedCount = images.filter((img) => img.status === 'approved').length
  const totalCount = images.length
  const allApproved = approvedCount === totalCount && totalCount > 0

  const handleStatusChange = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const handleApproveAll = () => {
    startTransition(async () => {
      const result = await approveAllImages(projectId)
      if (result.success) {
        onStageComplete?.()
      }
    })
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-charcoal-400">
        <svg
          className="w-20 h-20 mb-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-charcoal-600 mb-2">
          No edited images yet
        </h3>
        <p className="text-sm text-charcoal-400 max-w-md text-center">
          Your photographer is working on your selected images. Check back soon to
          review the edited versions.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Header with progress and approve all */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-lavender-100">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-800">Review Your Edits</h2>
          <p className="text-sm text-charcoal-500 mt-1">
            Click on any image to review and provide feedback
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-charcoal-500">Progress:</span>
            <span className="font-medium text-[var(--sage-500)]">
              {approvedCount} / {totalCount}
            </span>
            <span className="text-charcoal-400">approved</span>
          </div>

          {/* Approve all button */}
          <button
            onClick={handleApproveAll}
            disabled={isPending || !allApproved}
            className={`
              px-6 py-2.5 rounded-full font-medium text-sm
              transition-all duration-[400ms]
              flex items-center gap-2
              ${allApproved
                ? 'bg-[var(--sage-400)] text-white hover:bg-[var(--sage-500)] shadow-soft'
                : 'bg-charcoal-100 text-charcoal-400 cursor-not-allowed'}
            `}
          >
            {isPending ? (
              <LoadingSpinner />
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Approve All & Continue
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-lavender-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--sage-400)] rounded-full transition-all duration-[400ms]"
          style={{ width: `${(approvedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <ImageCard
            key={image.filename}
            image={image}
            onClick={() => setSelectedImage(image)}
            index={index}
          />
        ))}
      </div>

      {/* Review modal */}
      {selectedImage && (
        <ReviewModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          filename={selectedImage.filename}
          projectId={projectId}
          revisions={revisions}
          currentVersion={selectedImage.version}
          currentStatus={selectedImage.status}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}

interface ImageCardProps {
  image: ReviewImage
  onClick: () => void
  index: number
}

function ImageCard({ image, onClick, index }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        group relative aspect-[4/5] rounded-xl overflow-hidden
        bg-cream-100 border border-lavender-100
        transition-all duration-[400ms]
        hover:shadow-lifted hover:scale-[1.02]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400
      "
      style={{
        animation: `fadeIn 400ms ease-out ${index * 50}ms forwards`,
        opacity: 0
      }}
    >
      <Image
        src={image.url}
        alt={`Review: ${image.filename}`}
        fill
        className="object-cover transition-transform duration-[400ms] group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Overlay gradient */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent
          transition-opacity duration-[400ms]
          ${isHovered ? 'opacity-100' : 'opacity-70'}
        `}
      />

      {/* Status badge */}
      <div className="absolute top-3 right-3">
        <StatusBadge status={image.status} />
      </div>

      {/* Version indicator */}
      <div className="absolute top-3 left-3">
        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-white/90 text-charcoal-700">
          v{image.version}
        </span>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-sm font-medium truncate">{image.filename}</p>
        <div className="flex items-center gap-2 mt-1 text-white/80 text-xs">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{image.revisions.length} revision{image.revisions.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Hover overlay - click to review */}
      <div
        className={`
          absolute inset-0 bg-lavender-500/20 flex items-center justify-center
          transition-opacity duration-[400ms]
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <span className="px-4 py-2 rounded-full bg-white text-lavender-700 font-medium text-sm shadow-soft">
          Click to Review
        </span>
      </div>

      {/* Approved checkmark overlay */}
      {image.status === 'approved' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-3 right-3">
            <div className="w-8 h-8 rounded-full bg-[var(--sage-400)] flex items-center justify-center shadow-soft">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </button>
  )
}

function LoadingSpinner() {
  return (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
