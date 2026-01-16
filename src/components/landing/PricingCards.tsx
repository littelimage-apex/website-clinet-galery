'use client';

const pricingPackages = [
  {
    name: 'Mini Session',
    price: '$299',
    photos: 5,
    description: 'Perfect for capturing a few special moments',
    features: [
      '30 minute session',
      '5 professionally edited digital images',
      'Online gallery for viewing',
      'Print release included',
      'Basic props provided',
    ],
    popular: false,
  },
  {
    name: 'Classic',
    price: '$499',
    photos: 10,
    description: 'Our most popular package for growing families',
    features: [
      '1 hour session',
      '10 professionally edited digital images',
      'Online gallery with selection tools',
      'Print release included',
      'Full prop collection access',
      '2 outfit changes',
      'Family poses included',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$799',
    photos: 20,
    description: 'The complete experience for every milestone',
    features: [
      '2 hour session',
      '20 professionally edited digital images',
      'Priority online gallery access',
      'Print release included',
      'Full prop & backdrop collection',
      'Unlimited outfit changes',
      'Extended family welcome',
      'Same-week turnaround',
      'Complimentary print credit ($100)',
    ],
    popular: false,
  },
];

export default function PricingCards() {
  return (
    <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-cream-50 to-lavender-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="font-script text-xl text-lavender-500 mb-2">Investment</p>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal-800 mb-4">
            Session Packages
          </h2>
          <p className="text-charcoal-500 max-w-2xl mx-auto">
            Choose the perfect package to capture your family&apos;s precious moments. Each session is tailored to create timeless memories.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPackages.map((pkg, index) => (
            <div
              key={pkg.name}
              className={`relative card flex flex-col transition-all duration-400 hover:shadow-lifted hover:-translate-y-1 ${
                pkg.popular
                  ? 'border-2 border-lavender-400 shadow-soft'
                  : 'border border-lavender-100'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-lavender-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-soft">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="p-8 flex flex-col flex-grow">
                {/* Package Name */}
                <h3 className="font-serif text-2xl text-charcoal-800 mb-2">{pkg.name}</h3>
                <p className="text-charcoal-500 text-sm mb-6">{pkg.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="font-serif text-5xl text-lavender-600">{pkg.price}</span>
                </div>

                {/* Photo Count Highlight */}
                <div className="bg-lavender-100 rounded-2xl p-4 mb-6 text-center">
                  <p className="font-serif text-3xl text-lavender-700">{pkg.photos}</p>
                  <p className="text-lavender-600 text-sm font-medium">Digital Photos</p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-charcoal-600">
                      <svg
                        className="w-5 h-5 text-sage flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a
                  href="#contact"
                  className={`btn w-full text-center rounded-full py-3 transition-all duration-400 ${
                    pkg.popular
                      ? 'btn-primary shadow-soft hover:shadow-lifted'
                      : 'btn-secondary'
                  }`}
                >
                  Book {pkg.name}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Note */}
        <p className="text-center text-charcoal-400 text-sm mt-12">
          Custom packages available upon request. Contact us for milestone packages and extended family sessions.
        </p>
      </div>
    </section>
  );
}
