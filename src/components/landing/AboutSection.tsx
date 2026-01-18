'use client';

import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lifted">
              <Image
                src="https://picsum.photos/seed/photographer/600/800"
                alt="Little Image Photography Studio"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                unoptimized
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sage-200 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-cream-200 rounded-full -z-10" />
          </div>

          {/* Content Side */}
          <div className="lg:pl-8">
            <p className="font-serif text-xl text-sage-500 mb-2">About Us</p>
            <h2 className="font-serif text-4xl md:text-5xl text-sage-800 mb-6">
              The Heart Behind the Lens
            </h2>

            <div className="space-y-4 text-sage-600 leading-relaxed">
              <p>
                Welcome to Little Image Photography, where we believe that every tiny yawn,
                every curious gaze, and every peaceful slumber tells a story worth preserving forever.
              </p>
              <p>
                Founded with a passion for capturing the fleeting moments of early childhood,
                our studio specializes in creating timeless portraits that families will treasure
                for generations. We understand that these precious days pass quickly, which is
                why we&apos;re dedicated to freezing these moments in time.
              </p>
              <p>
                Our studio is designed to be a calm, nurturing space where little ones feel
                comfortable and parents can relax. With years of experience in newborn and
                childhood photography, we&apos;ve mastered the art of patience and gentle
                guidance to capture authentic, heartwarming images.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-sage-100">
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl text-sage-600">500+</p>
                <p className="text-sage-500 text-sm mt-1">Happy Families</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl text-sage-600">8+</p>
                <p className="text-sage-500 text-sm mt-1">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl text-sage-600">100%</p>
                <p className="text-sage-500 text-sm mt-1">Love & Care</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <a
                href="#contact"
                className="btn btn-primary px-8 py-4 rounded-full shadow-soft hover:shadow-lifted transition-all duration-400 inline-flex items-center gap-2"
              >
                <span>Get to Know Us</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
