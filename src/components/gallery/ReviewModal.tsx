'use client'

import { useState, useEffect, useTransition } from 'react'
import Image from 'next/image'
import { RevisionItem } from '@/types/database'
import { RevisionThread, StatusBadge } from './RevisionThread'
import { approveImage, requestRevision } from '@/lib/actions/reviews'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  filename: string
  projectId: string
  revisions: RevisionItem[]
  currentVersion: number
  currentStatus: 'pending' | 'approved' | 'rejected'
  onStatusChange?: () => void
}

export function ReviewModal({
  isOpen,
  onClose,
  imageUrl,
  filename,
  projectId,
  revisions,
  currentVersion,
  currentStatus,
  onStatusChange
}: ReviewModalProps) {
  const [feedback, setFeedback] = useState('')
  const [isPending, startTransition] = useTransition()
  const [localStatus, setLocalStatus] = useState(currentStatus)

  // Update local status when props change
  useEffect(() => {
    setLocalStatus(currentStatus)
  }, [currentStatus])

  // Reset feedback when modal opens
  useEffect(() => {
    if (isOpen) {
      setFeedback('')
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveImage(projectId, filename)
      if (result.success) {
        setLocalStatus('approved')
        onStatusChange?.()
      }
    })
  }

  const handleRequestRevision = () => {
    if (!feedback.trim()) return

    startTransition(async () => {
      const result = await requestRevision(projectId, filename, feedback.trim())
      if (result.success) {
        setLocalStatus('rejected')
        setFeedback('')
        onStatusChange?.()
      }
    })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-sage-900/60 backdrop-blur-soft transition-opacity duration-[400ms]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className="
          relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-lifted
          flex flex-col lg:flex-row overflow-hidden
          animate-fade-in
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            w-10 h-10 rounded-full bg-white/90 hover:bg-white
            flex items-center justify-center
            text-sage-500 hover:text-sage-700
            shadow-soft transition-all duration-[400ms]
          "
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left side - Image */}
        <div className="flex-1 bg-sage-50 flex items-center justify-center p-6 min-h-[300px] lg:min-h-[500px]">
          <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={`Review: ${filename}`}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
        </div>

        {/* Right side - Review panel */}
        <div className="w-full lg:w-[400px] flex flex-col bg-cream-50 border-l border-sage-100">
          {/* Header */}
          <div className="px-6 py-4 border-b border-sage-100 bg-white">
            <h2 id="review-modal-title" className="font-serif text-xl text-sage-800">
              Review Image
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-sage-500 truncate flex-1">
                {filename}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-sage-100 text-sage-700">
                v{currentVersion}
              </span>
            </div>
            <div className="mt-3">
              <StatusBadge status={localStatus} />
            </div>
          </div>

          {/* Version history */}
          <div className="px-6 py-3 border-b border-sage-100 bg-sage-50/50">
            <h3 className="text-xs font-medium text-sage-500 uppercase tracking-wider">
              Version History
            </h3>
            <div className="flex gap-2 mt-2 overflow-x-auto py-1">
              {Array.from({ length: currentVersion }, (_, i) => i + 1).map((version) => (
                <button
                  key={version}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-[400ms]
                    ${version === currentVersion
                      ? 'bg-sage-500 text-white'
                      : 'bg-white text-sage-600 hover:bg-sage-100'}
                  `}
                >
                  v{version}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation thread */}
          <div className="flex-1 overflow-y-auto px-6 py-4 min-h-[200px]">
            <h3 className="text-xs font-medium text-sage-500 uppercase tracking-wider mb-3">
              Conversation
            </h3>
            <RevisionThread revisions={revisions} filename={filename} />
          </div>

          {/* Feedback input */}
          {localStatus !== 'approved' && (
            <div className="px-6 py-4 border-t border-sage-100 bg-white">
              <label htmlFor="feedback" className="block text-sm font-medium text-sage-700 mb-2">
                Add Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe any changes you'd like..."
                className="
                  w-full h-24 px-4 py-3 rounded-xl resize-none
                  bg-cream-50 border border-sage-200
                  text-sage-700 placeholder:text-sage-400
                  focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent
                  transition-all duration-[400ms]
                "
                disabled={isPending}
              />

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleRequestRevision}
                  disabled={isPending || !feedback.trim()}
                  className="
                    flex-1 px-4 py-3 rounded-full font-medium text-sm
                    bg-[var(--champagne-400)] text-sage-800
                    hover:bg-[var(--champagne-500)]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-[400ms]
                    flex items-center justify-center gap-2
                  "
                >
                  {isPending ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Request Revision
                    </>
                  )}
                </button>

                <button
                  onClick={handleApprove}
                  disabled={isPending}
                  className="
                    flex-1 px-4 py-3 rounded-full font-medium text-sm
                    bg-[var(--sage-400)] text-white
                    hover:bg-[var(--sage-500)]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-[400ms]
                    flex items-center justify-center gap-2
                  "
                >
                  {isPending ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Image
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Approved state */}
          {localStatus === 'approved' && (
            <div className="px-6 py-4 border-t border-sage-100 bg-[var(--sage-400)]/10">
              <div className="flex items-center gap-3 text-[var(--sage-500)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">This image has been approved</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
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
