'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from '@/components/StaticImage';

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
  const [visited, setVisited] = useState([0]);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setPaused(true);
    setVisited((previous) => previous.includes(i) ? previous : [...previous, i]);
    setCurrent(i);
  }, []);

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Keep the chosen photograph still after a visitor uses the controls.
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      const next = (current + 1) % slides.length;
      setVisited((previous) => previous.includes(next) ? previous : [...previous, next]);
      setCurrent(next);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, paused]);

  return (
    <section id="home" aria-label="CalinMeters product overview" className="relative h-[520px] w-full overflow-hidden bg-white md:h-auto md:aspect-[7/3]">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {visited.includes(i) && (
            <div className={i === 0 ? 'absolute inset-x-4 bottom-14 top-40 md:inset-0' : 'absolute inset-0'}>
              <Image
                src={slide.image}
                mobileSrc={i === 0 ? '/images/banners/banner-product-mobile.webp' : undefined}
                alt={slide.alt}
                fill
                priority={i === 0}
                loading="eager"
                sizes="100vw"
                className={i === 0 ? 'object-contain md:object-cover' : 'object-cover'}
              />
            </div>
          )}
          {slide.headline && (
            <div className="absolute inset-x-0 top-0 z-10">
              <div className="mx-auto mt-5 md:mt-[3vw] w-[min(92vw,760px)] text-center">
                <h1 className="text-2xl md:text-[clamp(1.5rem,2.5vw,2.5rem)] font-semibold leading-tight text-slate-950">
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
        className="absolute bottom-5 left-4 z-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
        aria-label="Previous slide"
      >
        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute bottom-5 right-4 z-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition"
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
                i === current ? 'scale-110 bg-primary-700 ring-2 ring-white' : 'bg-slate-500/60 ring-1 ring-white group-hover:bg-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
