'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sessionType: '',
    dueDate: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        sessionType: '',
        dueDate: '',
        message: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 px-6 bg-cream-50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="font-script text-xl text-lavender-500 mb-2">Get in Touch</p>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal-800 mb-4">
            Book Your Session
          </h2>
          <p className="text-charcoal-500 max-w-2xl mx-auto">
            Ready to capture your family&apos;s precious moments? Fill out the form below and we&apos;ll be in touch within 24 hours.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="card shadow-soft p-8 md:p-12">
          {isSubmitted ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-sage rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-charcoal-800 mb-2">Thank You!</h3>
              <p className="text-charcoal-500">
                Your message has been sent. We&apos;ll be in touch soon to discuss your session.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-charcoal-700 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 transition-all duration-400 outline-none"
                    placeholder="Jane Smith"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-charcoal-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 transition-all duration-400 outline-none"
                    placeholder="jane@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-charcoal-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 transition-all duration-400 outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Session Type */}
                <div>
                  <label htmlFor="sessionType" className="block text-charcoal-700 font-medium mb-2">
                    Session Type
                  </label>
                  <select
                    id="sessionType"
                    name="sessionType"
                    value={formData.sessionType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 transition-all duration-400 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select a session type</option>
                    <option value="newborn">Newborn Session</option>
                    <option value="milestone">Milestone Session</option>
                    <option value="family">Family Portrait</option>
                    <option value="maternity">Maternity Session</option>
                    <option value="cake-smash">Cake Smash / Birthday</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Due Date / Session Date */}
              <div>
                <label htmlFor="dueDate" className="block text-charcoal-700 font-medium mb-2">
                  Expected Due Date or Preferred Session Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 transition-all duration-400 outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-charcoal-700 font-medium mb-2">
                  Tell Us About Your Vision
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-2xl border border-lavender-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 transition-all duration-400 outline-none resize-none"
                  placeholder="Share any details about your session preferences, special requests, or questions..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary px-12 py-4 text-lg rounded-full shadow-soft hover:shadow-lifted transition-all duration-400 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-lavender-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-serif text-lg text-charcoal-800 mb-1">Email</h4>
            <p className="text-charcoal-500">hello@littleimagephoto.com</p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-lavender-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="font-serif text-lg text-charcoal-800 mb-1">Phone</h4>
            <p className="text-charcoal-500">(555) 123-4567</p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-lavender-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-serif text-lg text-charcoal-800 mb-1">Studio</h4>
            <p className="text-charcoal-500">Portland, Oregon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
