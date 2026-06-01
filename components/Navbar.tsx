'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { productCategories } from '@/data/products';

function useDelayClose(ms = 150) {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const onEnter = useCallback((setOpen: (v: boolean) => void) => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }, []);

  const onLeave = useCallback((setOpen: (v: boolean) => void) => {
    timer.current = setTimeout(() => setOpen(false), ms);
  }, [ms]);

  return { onEnter, onLeave };
}

function SubCategoryFlyout({
  name,
  subCategories,
  parentClose,
}: {
  name: string;
  subCategories: { name: string; variants: { id: string; name: string }[] }[];
  parentClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { onEnter, onLeave } = useDelayClose(200);
  const anchorId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

  return (
    <div
      className="relative"
      onMouseEnter={() => onEnter(setOpen)}
      onMouseLeave={() => onLeave(setOpen)}
    >
      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer whitespace-nowrap">
        <span>{name}</span>
        <svg className="w-3.5 h-3.5 ml-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      {open && (
        <div
          className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-[240px] z-50"
          onMouseEnter={() => onEnter(setOpen)}
          onMouseLeave={() => onLeave(setOpen)}
        >
          {subCategories.map((sub) => (
            <div key={sub.name}>
              <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {sub.name}
              </div>
              {sub.variants.map((v) => (
                <a
                  key={v.id}
                  href={`#${anchorId}`}
                  onClick={() => { setOpen(false); parentClose(); }}
                  className="block px-4 py-1.5 pl-6 text-xs text-gray-600 hover:bg-primary-50 hover:text-primary-700 whitespace-nowrap"
                >
                  {v.name}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleOpen = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleClose = () => {
    timerRef.current = setTimeout(() => setOpen(false), 150);
  };

  // Click outside closes immediately
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <button className="text-gray-700 hover:text-primary-600 flex items-center gap-1 py-2">
        Products
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-[220px]">
            {productCategories.map((cat) =>
              cat.subCategories && cat.subCategories.length > 0 ? (
                <SubCategoryFlyout
                  key={cat.name}
                  name={cat.name}
                  subCategories={cat.subCategories}
                  parentClose={() => setOpen(false)}
                />
              ) : (
                <a
                  key={cat.name}
                  href={`#${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 whitespace-nowrap"
                >
                  {cat.name}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg md:text-2xl font-bold text-primary-700">Shenzhen Calinmeter Co., Ltd.</h1>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600">Home</a>
            <ProductsDropdown />
            <a href="#solutions" className="text-gray-700 hover:text-primary-600">Solutions</a>
            <a href="#about" className="text-gray-700 hover:text-primary-600">About Us</a>
            <a href="#faq" className="text-gray-700 hover:text-primary-600">FAQ</a>
            <a href="#news" className="text-gray-700 hover:text-primary-600">News</a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600">Contact</a>
          </div>
          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-700 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#home" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Home</a>
            <a href="#products" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Products</a>
            {productCategories.map((cat) => (
              <a
                key={cat.name}
                href={`#${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                {cat.name}
              </a>
            ))}
            <a href="#solutions" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Solutions</a>
            <a href="#about" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">About Us</a>
            <a href="#faq" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">FAQ</a>
            <a href="#news" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">News</a>
            <a href="#contact" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Contact</a>
          </div>
        )}
      </div>
    </nav>
  );
}
