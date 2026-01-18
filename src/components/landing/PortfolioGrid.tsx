'use client';

import { useState } from 'react';
import Image from 'next/image';

// Placeholder images with varying heights for masonry effect
const portfolioImages = [
  { id: 1, src: 'https://picsum.photos/seed/newborn1/400/500', alt: 'Newborn baby sleeping peacefully', height: 500 },
  { id: 2, src: 'https://picsum.photos/seed/newborn2/400/350', alt: 'Baby tiny feet close-up', height: 350 },
  { id: 3, src: 'https://picsum.photos/seed/newborn3/400/450', alt: 'Mother holding newborn', height: 450 },
  { id: 4, src: 'https://picsum.photos/seed/newborn4/400/380', alt: 'Baby wrapped in soft blanket', height: 380 },
  { id: 5, src: 'https://picsum.photos/seed/newborn5/400/420', alt: 'Sibling meeting baby brother', height: 420 },
  { id: 6, src: 'https://picsum.photos/seed/newborn6/400/480', alt: 'Newborn in basket prop', height: 480 },
  { id: 7, src: 'https://picsum.photos/seed/newborn7/400/360', alt: 'Baby hands holding parent finger', height: 360 },
  { id: 8, src: 'https://picsum.photos/seed/newborn8/400/440', alt: 'Peaceful sleeping baby portrait', height: 440 },
  // Extended images (shown when expanded)
  { id: 9, src: 'https://picsum.photos/seed/newborn9/400/400', alt: 'Family portrait with newborn', height: 400 },
  { id: 10, src: 'https://picsum.photos/seed/newborn10/400/520', alt: 'Baby yawning adorably', height: 520 },
  { id: 11, src: 'https://picsum.photos/seed/newborn11/400/380', alt: 'Toddler milestone session', height: 380 },
  { id: 12, src: 'https://picsum.photos/seed/newborn12/400/460', alt: 'First birthday cake smash', height: 460 },
];

export default function PortfolioGrid() {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedImages = isExpanded ? portfolioImages : portfolioImages.slice(0, 8);

  return (
    <section id="portfolio" className="py-20 px-6 bg-cream-50">
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

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {displayedImages.map((image, index) => (
            <div
              key={image.id}
              className="masonry-item animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative group overflow-hidden rounded-2xl bg-sage-100">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={image.height}
                  className="w-full h-auto object-cover image-hover cursor-pointer"
                  unoptimized
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-sage-900/0 group-hover:bg-sage-900/20 transition-all duration-400 rounded-2xl pointer-events-none" />
                {/* Image caption on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-sage-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 rounded-b-2xl">
                  <p className="text-white text-sm font-medium">{image.alt}</p>
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
    </section>
  );
}
