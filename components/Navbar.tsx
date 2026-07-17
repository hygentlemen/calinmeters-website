'use client';

import { useState } from 'react';
import Link from 'next/link';
import { targetProductCategories } from '@/lib/catalog';
import { productPath } from '@/lib/site';

const sectionLinks = [
  { label: 'Solutions', href: '/#solutions' },
  { label: 'About Us', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav aria-label="Primary navigation" className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-6">
          <Link href="/" className="max-w-[240px] text-base font-bold leading-tight text-primary-800 sm:max-w-none sm:text-xl">
            Shenzhen Calinmeter Co., Ltd.
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-sm font-medium text-slate-700 hover:text-primary-700">Home</Link>
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 py-5 text-sm font-medium text-slate-700 marker:content-none hover:text-primary-700">
                Products
                <svg aria-hidden="true" className="h-4 w-4 transition group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                {targetProductCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={productPath(category.slug)}
                    className="block rounded-lg px-4 py-3 hover:bg-primary-50"
                  >
                    <span className="block text-sm font-semibold text-slate-950">{category.description}</span>
                    <span className="mt-1 block text-xs text-primary-700">View category and models</span>
                  </Link>
                ))}
                <Link href="/#products" className="mt-1 block rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary-700">
                  View all products and AMI devices
                </Link>
              </div>
            </details>
            {sectionLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-700 hover:text-primary-700">
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-navigation" className="space-y-1 border-t border-slate-100 pb-5 pt-3 md:hidden">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-2.5 font-medium text-slate-800 hover:bg-slate-100">Home</Link>
            <p className="px-4 pb-1 pt-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Product guides</p>
            {targetProductCategories.map((category) => (
              <Link
                key={category.slug}
                href={productPath(category.slug)}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-800"
              >
                {category.description}
              </Link>
            ))}
            <Link href="/#products" onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">All products and AMI devices</Link>
            <div className="my-2 border-t border-slate-100" />
            {sectionLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-2.5 font-medium text-slate-800 hover:bg-slate-100">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
