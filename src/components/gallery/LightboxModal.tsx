'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Download } from 'lucide-react'

interface LightboxImage {
    filename: string
    url: string
}

interface LightboxModalProps {
    isOpen: boolean
    images: LightboxImage[]
    currentIndex: number
    onClose: () => void
    onNavigate: (index: number) => void
    // Action handlers
    onSelect?: () => void
    isSelected?: boolean
    onComment?: () => void
    onDownload?: () => void
    // Customization
    showActions?: boolean
    disableSelect?: boolean
}

export function LightboxModal({
    isOpen,
    images,
    currentIndex,
    onClose,
    onNavigate,
    onSelect,
    isSelected = false,
    onComment,
    onDownload,
    showActions = true,
    disableSelect = false
}: LightboxModalProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [touchStart, setTouchStart] = useState<number | null>(null)

    const currentImage = images[currentIndex]
    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < images.length - 1

    const goToPrev = useCallback(() => {
        if (hasPrev) {
            setIsLoading(true)
            onNavigate(currentIndex - 1)
        }
    }, [hasPrev, currentIndex, onNavigate])

    const goToNext = useCallback(() => {
        if (hasNext) {
            setIsLoading(true)
            onNavigate(currentIndex + 1)
        }
    }, [hasNext, currentIndex, onNavigate])

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose()
                    break
                case 'ArrowLeft':
                    goToPrev()
                    break
                case 'ArrowRight':
                    goToNext()
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose, goToPrev, goToNext])

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Touch handlers for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX)
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return

        const touchEnd = e.changedTouches[0].clientX
        const diff = touchStart - touchEnd

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToNext()
            } else {
                goToPrev()
            }
        }
        setTouchStart(null)
    }

    if (!isOpen || !currentImage) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-sage-900/95 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                   flex items-center justify-center transition-all duration-300"
                aria-label="Close lightbox"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Navigation arrows */}
            {hasPrev && (
                <button
                    onClick={goToPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                     w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                     flex items-center justify-center transition-all duration-300"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
            )}

            {hasNext && (
                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                     w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                     flex items-center justify-center transition-all duration-300"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            )}

            {/* Main image container */}
            <div
                className="relative w-full h-full flex items-center justify-center p-16 pb-24"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="relative max-w-full max-h-full">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                    <Image
                        src={currentImage.url}
                        alt={currentImage.filename}
                        width={1200}
                        height={900}
                        className={`max-h-[80vh] w-auto object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setIsLoading(false)}
                        priority
                    />
                </div>
            </div>

            {/* Bottom toolbar */}
            {showActions && (
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                    <div className="max-w-md mx-auto flex items-center justify-center gap-4 bg-sage-800 rounded-full px-6 py-3 shadow-lg">
                        {/* Filename */}
                        <span className="text-white/80 text-sm truncate max-w-[200px]">
                            {currentImage.filename}
                        </span>

                        <div className="w-px h-6 bg-white/20" />

                        {/* Select/Like button */}
                        {onSelect && (
                            <button
                                onClick={onSelect}
                                disabled={disableSelect && !isSelected}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                  ${isSelected
                                        ? 'bg-rose-400 text-white'
                                        : 'bg-white/10 text-white hover:bg-white/20'}
                  ${disableSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                                aria-label={isSelected ? 'Remove from selection' : 'Add to selection'}
                            >
                                <Heart className={`w-4 h-4 ${isSelected ? 'fill-current' : ''}`} />
                                <span className="text-sm font-medium">
                                    {isSelected ? 'Selected' : 'Select'}
                                </span>
                            </button>
                        )}

                        {/* Comment button */}
                        {onComment && (
                            <button
                                onClick={onComment}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                                aria-label="Add comment"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Notes</span>
                            </button>
                        )}

                        {/* Download button */}
                        {onDownload && (
                            <button
                                onClick={onDownload}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                                aria-label="Download image"
                            >
                                <Download className="w-4 h-4" />
                                <span className="text-sm font-medium">Download</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
