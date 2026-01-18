'use client'

import { useState, useCallback } from 'react'
import { Project, ClientData, SelectionItem } from '@/types/database'
import { ImageCard } from './ImageCard'
import { ImageModal } from './ImageModal'
import { SelectionCounter } from './SelectionCounter'
import { Button } from '@/components/ui'
import { submitSelection } from '@/lib/actions/projects'

interface ImageData {
  filename: string
  url: string
}

interface SelectionGalleryProps {
  project: Project
  images: ImageData[]
  clientData: ClientData
}

export function SelectionGallery({ project, images, clientData }: SelectionGalleryProps) {
  const [selections, setSelections] = useState<Map<string, SelectionItem>>(
    new Map(clientData.selection_manifest.map(item => [item.filename, item]))
  )
  const [modalImage, setModalImage] = useState<ImageData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const isLocked = project.status === 'submitted' || project.status === 'editing'
  const selectedCount = selections.size
  const canSelectMore = selectedCount < project.package_limit

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
          Select up to {project.package_limit} images from your session.
          Click on any image to add special notes or face-swap requests.
        </p>
        {isLocked && (
          <div className="mt-4 bg-champagne-400/20 text-sage-700 px-4 py-3 rounded-xl text-sm">
            Your selections have been submitted and are being processed.
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              onClick={() => setModalImage(image)}
              disabled={isLocked || (!selections.has(image.filename) && !canSelectMore)}
            />
          </div>
        ))}
      </div>

      {/* Selection Counter */}
      <SelectionCounter
        selected={selectedCount}
        limit={project.package_limit}
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

      {/* Image Modal */}
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
