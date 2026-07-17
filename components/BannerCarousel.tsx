'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const slides = [
  {
    image: '/images/banners/banner-product.jpg',
    alt: 'CalinMeters prepaid electricity, water and gas meter products',
    headline: 'STS Prepaid Electricity, Water and Gas Meter Solutions',
    subline: 'Product selection for utility and metering projects',
  },
  {
    image: '/images/banners/banner-field.jpg',
    alt: 'Metering products installed for field applications',
  },
  {
    image: '/images/banners/banner-factory.jpg',
    alt: 'CalinMeters manufacturing facility',
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
    <section id="home" aria-label="CalinMeters product overview" className="relative h-[400px] w-full overflow-hidden bg-gray-100 md:h-[600px]">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
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
        type="button"
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
        aria-label="Previous slide"
      >
        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
        aria-label="Next slide"
      >
        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className="group flex h-11 w-11 items-center justify-center rounded-full"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
          >
            <span
              aria-hidden="true"
              className={`h-3 w-3 rounded-full transition-all ${
                i === current ? 'scale-110 bg-white' : 'bg-white/40 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
