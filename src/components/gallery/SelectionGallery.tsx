'use client'

import { useState, useCallback } from 'react'
import { Session, ClientData, SelectionItem } from '@/types/database'
import { ImageCard } from './ImageCard'
import { ImageModal } from './ImageModal'
import { LightboxModal } from './LightboxModal'
import { SelectionCounter } from './SelectionCounter'
import { Button } from '@/components/ui'
import { submitSelection } from '@/lib/actions/sessions'

interface ImageData {
  filename: string
  url: string
}

interface SelectionGalleryProps {
  project: Session
  images: ImageData[]
  clientData: ClientData
}

export function SelectionGallery({ project, images, clientData }: SelectionGalleryProps) {
  const [selections, setSelections] = useState<Map<string, SelectionItem>>(
    new Map(clientData.selection_manifest.map(item => [item.filename, item]))
  )
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [modalImage, setModalImage] = useState<ImageData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const isLocked = project.status === 'submitted' || project.status === 'editing'
  const selectedCount = selections.size
  const canSelectMore = selectedCount < (project.package_limit || 0)

  const toggleSelection = useCallback((filename: string) => {
    if (isLocked) return

    setSelections(prev => {
      const newSelections = new Map(prev)
      if (newSelections.has(filename)) {
        newSelections.delete(filename)
      } else if (canSelectMore) {
        newSelections.set(filename, {
          filename,
          face_swap: false,
          note: '',
          selected_at: new Date().toISOString()
        })
      }
      return newSelections
    })
  }, [isLocked, canSelectMore])

  const updateSelectionNote = useCallback((filename: string, note: string, faceSwap: boolean) => {
    setSelections(prev => {
      const newSelections = new Map(prev)
      const existing = newSelections.get(filename)
      if (existing) {
        newSelections.set(filename, {
          ...existing,
          note,
          face_swap: faceSwap
        })
      }
      return newSelections
    })
  }, [])

  const handleSubmit = async () => {
    if (isLocked || selectedCount === 0) return

    setIsSubmitting(true)
    try {
      const result = await submitSelection(
        project.id,
        Array.from(selections.values())
      )

      if (result.success) {
        setSubmitSuccess(true)
      } else {
        console.error('Submit failed:', result.error)
      }
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Lightbox handlers
  const currentLightboxImage = lightboxIndex !== null ? images[lightboxIndex] : null

  const handleLightboxSelect = () => {
    if (currentLightboxImage) {
      toggleSelection(currentLightboxImage.filename)
    }
  }

  const handleLightboxComment = () => {
    if (currentLightboxImage) {
      setLightboxIndex(null)
      setModalImage(currentLightboxImage)
    }
  }

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-sage-800 mb-3">Thank You!</h2>
        <p className="text-sage-500 text-center max-w-md">
          Your selections have been received. We&apos;ll begin working on your photos
          and notify you when they&apos;re ready for review.
        </p>
        <p className="text-sage-600 font-medium mt-4">
          {selectedCount} photos selected
        </p>
      </div>
    )
  }

  return (
    <div className={isLocked ? 'locked-state' : ''}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-serif text-2xl text-sage-800 mb-2">
          Choose Your Favorites
        </h2>
        <p className="text-sage-500">
          Select up to {project.package_limit || 0} images from your session.
          Click on any image to view it full-screen, then use the toolbar to select or add notes.
        </p>
        {isLocked && (
          <div className="mt-4 bg-champagne-400/20 text-sage-700 px-4 py-3 rounded-xl text-sm">
            Your selections have been submitted and are being processed.
          </div>
        )}
      </div>

      {/* Image Grid - Larger images with fewer columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={image.filename}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ImageCard
              src={image.url}
              filename={image.filename}
              isSelected={selections.has(image.filename)}
              onSelect={() => toggleSelection(image.filename)}
              onClick={() => setLightboxIndex(index)}
              disabled={isLocked || (!selections.has(image.filename) && !canSelectMore)}
            />
          </div>
        ))}
      </div>

      {/* Selection Counter */}
      <SelectionCounter
        selected={selectedCount}
        limit={project.package_limit || 0}
      />

      {/* Submit Button */}
      {!isLocked && selectedCount > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
          <Button
            size="lg"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="shadow-lifted"
          >
            Submit Selection ({selectedCount} photos)
          </Button>
        </div>
      )}

      {/* Lightbox Modal - Full-screen viewing */}
      <LightboxModal
        isOpen={lightboxIndex !== null}
        images={images}
        currentIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        onSelect={handleLightboxSelect}
        isSelected={currentLightboxImage ? selections.has(currentLightboxImage.filename) : false}
        onComment={handleLightboxComment}
        disableSelect={isLocked || (!canSelectMore && !(currentLightboxImage && selections.has(currentLightboxImage.filename)))}
      />

      {/* Image Modal - For adding notes/details */}
      {modalImage && (
        <ImageModal
          isOpen={true}
          image={modalImage}
          selection={selections.get(modalImage.filename)}
          isSelected={selections.has(modalImage.filename)}
          onClose={() => setModalImage(null)}
          onToggleSelect={() => toggleSelection(modalImage.filename)}
          onSave={(note, faceSwap) => {
            updateSelectionNote(modalImage.filename, note, faceSwap)
            setModalImage(null)
          }}
          disabled={isLocked}
          canSelect={canSelectMore || selections.has(modalImage.filename)}
        />
      )}
    </div>
  )
}
