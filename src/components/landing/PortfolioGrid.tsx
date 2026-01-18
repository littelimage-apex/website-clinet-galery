'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Portfolio images with better themed seeds for photography
const portfolioImages = [
  { id: 1, src: 'https://picsum.photos/seed/baby-sleep/600/750', alt: 'Newborn baby sleeping peacefully', height: 750 },
  { id: 2, src: 'https://picsum.photos/seed/tiny-feet/600/500', alt: 'Baby tiny feet close-up', height: 500 },
  { id: 3, src: 'https://picsum.photos/seed/mother-child/600/700', alt: 'Mother holding newborn', height: 700 },
  { id: 4, src: 'https://picsum.photos/seed/soft-blanket/600/550', alt: 'Baby wrapped in soft blanket', height: 550 },
  { id: 5, src: 'https://picsum.photos/seed/sibling-love/600/650', alt: 'Sibling meeting baby brother', height: 650 },
  { id: 6, src: 'https://picsum.photos/seed/cozy-basket/600/720', alt: 'Newborn in basket prop', height: 720 },
  { id: 7, src: 'https://picsum.photos/seed/tiny-hands/600/520', alt: 'Baby hands holding parent finger', height: 520 },
  { id: 8, src: 'https://picsum.photos/seed/peaceful-portrait/600/680', alt: 'Peaceful sleeping baby portrait', height: 680 },
  // Extended images (shown when expanded)
  { id: 9, src: 'https://picsum.photos/seed/family-newborn/600/600', alt: 'Family portrait with newborn', height: 600 },
  { id: 10, src: 'https://picsum.photos/seed/baby-yawn/600/780', alt: 'Baby yawning adorably', height: 780 },
  { id: 11, src: 'https://picsum.photos/seed/milestone-one/600/560', alt: 'Toddler milestone session', height: 560 },
  { id: 12, src: 'https://picsum.photos/seed/first-birthday/600/700', alt: 'First birthday cake smash', height: 700 },
];

export default function PortfolioGrid() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayedImages = isExpanded ? portfolioImages : portfolioImages.slice(0, 8);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goToPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const goToNext = () => {
    const maxIndex = isExpanded ? portfolioImages.length - 1 : 7;
    if (lightboxIndex !== null && lightboxIndex < maxIndex) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
  };

  const currentImage = lightboxIndex !== null ? displayedImages[lightboxIndex] : null;

  return (
    <section id="portfolio" className="py-20 px-6 bg-cream-50" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="font-serif text-xl text-sage-500 mb-2">Our Work</p>
          <h2 className="font-serif text-4xl md:text-5xl text-sage-800 mb-4">
            Portfolio
          </h2>
          <p className="text-sage-500 max-w-2xl mx-auto">
            Every image tells a story of love, wonder, and the magic of new life. Browse our collection of cherished moments.
          </p>
        </div>

        {/* Masonry Grid - Larger with fewer columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {displayedImages.map((image, index) => (
            <div
              key={image.id}
              className="break-inside-avoid animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => openLightbox(index)}
            >
              <div className="relative group overflow-hidden rounded-2xl bg-sage-100">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={image.height}
                  className="w-full h-auto object-cover image-hover"
                  unoptimized
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-sage-900/0 group-hover:bg-sage-900/20 transition-all duration-400 rounded-2xl pointer-events-none" />
                {/* Image caption on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-sage-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 rounded-b-2xl">
                  <p className="text-white text-sm font-medium">{image.alt}</p>
                </div>
                {/* Click to view hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white/90 text-sage-700 px-4 py-2 rounded-full text-sm font-medium shadow-soft">
                    Click to view
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-secondary px-8 py-4 rounded-full text-lg transition-all duration-400 hover:shadow-soft"
          >
            {isExpanded ? (
              <>
                <span>Show Less</span>
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>View Full Portfolio</span>
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && currentImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-sage-900/95 backdrop-blur-sm"
            onClick={closeLightbox}
          />

          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20
                       flex items-center justify-center transition-all duration-300"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
            {lightboxIndex + 1} / {displayedImages.length}
          </div>

          {/* Navigation arrows */}
          {lightboxIndex > 0 && (
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

          {lightboxIndex < displayedImages.length - 1 && (
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

          {/* Main image */}
          <div className="relative max-w-4xl max-h-[85vh] p-4">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              width={800}
              height={1000}
              className="max-h-[80vh] w-auto object-contain rounded-xl"
              unoptimized
            />
            {/* Caption */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <p className="text-white text-center px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                {currentImage.alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
