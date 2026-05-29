'use client';

import { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    image: '/images/banners/banner-product.jpg',
    alt: 'Smart Prepaid Metering Solutions',
    headline: 'Smart Prepaid Metering Solutions',
    subline: 'Electricity · Water · Gas',
  },
  {
    image: '/images/banners/banner-field.jpg',
    alt: 'Field Applications',
  },
  {
    image: '/images/banners/banner-factory.jpg',
    alt: 'Manufacturing Facility',
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
  }, []);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden bg-gray-100">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          {slide.headline && (
            <div className="absolute inset-x-0 top-0 z-10 h-32 md:h-44 bg-gradient-to-b from-[#f8fafc] via-[#f8fafc]/95 to-[#f8fafc]/0">
              <div className="mx-auto mt-5 md:mt-9 w-[min(92vw,760px)] text-center">
                <h1 className="text-2xl md:text-4xl font-semibold leading-tight text-slate-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]">
                  {slide.headline}
                </h1>
                <p className="mt-1 md:mt-2 text-sm md:text-base font-medium text-slate-600">
                  {slide.subline}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Arrow buttons */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
