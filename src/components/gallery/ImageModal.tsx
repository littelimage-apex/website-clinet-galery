'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Heart } from 'lucide-react'
import { SelectionItem } from '@/types/database'
import { Button } from '@/components/ui'
import { Textarea } from '@/components/ui'

interface ImageData {
  filename: string
  url: string
}

interface ImageModalProps {
  isOpen: boolean
  image: ImageData
  selection?: SelectionItem
  isSelected: boolean
  onClose: () => void
  onToggleSelect: () => void
  onSave: (note: string, faceSwap: boolean) => void
  disabled?: boolean
  canSelect: boolean
}

export function ImageModal({
  isOpen,
  image,
  selection,
  isSelected,
  onClose,
  onToggleSelect,
  onSave,
  disabled = false,
  canSelect
}: ImageModalProps) {
  const [note, setNote] = useState(selection?.note || '')
  const [faceSwap, setFaceSwap] = useState(selection?.face_swap || false)

  // Reset form when image changes
  useEffect(() => {
    setNote(selection?.note || '')
    setFaceSwap(selection?.face_swap || false)
  }, [selection, image.filename])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!isOpen) return null

  const handleSave = () => {
    onSave(note, faceSwap)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-soft"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-lifted max-w-5xl w-full max-h-[90vh] overflow-hidden animate-fade-in flex">
        {/* Image side */}
        <div className="relative w-3/5 bg-charcoal-100">
          <div className="relative aspect-[4/5] h-full">
            <Image
              src={image.url}
              alt={image.filename}
              fill
              className="object-contain"
              sizes="60vw"
            />
          </div>

          {/* Filename */}
          <div className="absolute bottom-4 left-4 bg-charcoal-900/70 text-white text-sm px-3 py-1.5 rounded-lg">
            {image.filename}
          </div>
        </div>

        {/* Details side */}
        <div className="w-2/5 p-6 flex flex-col">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream-100 hover:bg-cream-200
                       flex items-center justify-center transition-colors duration-300"
          >
            <X className="w-5 h-5 text-charcoal-600" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h3 className="font-serif text-xl text-charcoal-800 mb-1">
              Image Details
            </h3>
            <p className="text-charcoal-500 text-sm">
              Add notes or special requests for this image
            </p>
          </div>

          {/* Selection toggle */}
          <div className="mb-6">
            <button
              onClick={onToggleSelect}
              disabled={disabled || (!isSelected && !canSelect)}
              className={`
                w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2
                transition-all duration-300 font-medium
                ${isSelected
                  ? 'bg-lavender-500 text-white'
                  : 'bg-lavender-100 text-lavender-700 hover:bg-lavender-200'
                }
                ${(disabled || (!isSelected && !canSelect)) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Heart className={`w-5 h-5 ${isSelected ? 'fill-current' : ''}`} />
              {isSelected ? 'Selected' : 'Add to Selection'}
            </button>
          </div>

          {/* Face swap toggle */}
          {isSelected && (
            <div className="mb-6 animate-fade-in">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={faceSwap}
                    onChange={(e) => setFaceSwap(e.target.checked)}
                    disabled={disabled}
                    className="sr-only peer"
                  />
                  <div className={`
                    w-12 h-7 bg-cream-200 rounded-full
                    peer-checked:bg-lavender-500 transition-colors duration-300
                    peer-disabled:opacity-50
                  `} />
                  <div className={`
                    absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow
                    transition-transform duration-300
                    peer-checked:translate-x-5
                  `} />
                </div>
                <span className="text-charcoal-700 font-medium">
                  Request Face Swap
                </span>
              </label>
              <p className="text-charcoal-400 text-xs mt-2 ml-15">
                Enable if you&apos;d like us to swap a face from another photo
              </p>
            </div>
          )}

          {/* Notes textarea */}
          {isSelected && (
            <div className="flex-1 animate-fade-in">
              <Textarea
                label="Notes for the Editor"
                placeholder="Any special requests? E.g., 'Use face from IMG_0005' or 'Please brighten this one'"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={disabled}
                rows={5}
                className="resize-none"
              />
            </div>
          )}

          {/* Save button */}
          {isSelected && (
            <div className="mt-6 animate-fade-in">
              <Button
                onClick={handleSave}
                disabled={disabled}
                className="w-full"
              >
                Save Notes
              </Button>
            </div>
          )}

          {/* Not selected message */}
          {!isSelected && (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <p className="text-charcoal-400 mb-2">
                  Select this image to add notes
                </p>
                {!canSelect && (
                  <p className="text-champagne-500 text-sm">
                    You&apos;ve reached your selection limit
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
