'use client';

import { usePathname } from 'next/navigation';
import { trackEvent } from '@/components/GoogleAnalytics';

export function BuyerInquiryLink({ buyer, label, topic, category, locale = 'en' }: { buyer: string; label: string; topic: string; category: string; locale?: 'en' | 'fr' }) {
  const pathname = usePathname();
  const query = new URLSearchParams({ productName: `${category}: ${topic}`, source: pathname });
  return <a href={`${locale === 'fr' ? '/fr/' : '/'}?${query}#contact`}
    onClick={() => trackEvent('inquiry_cta_click', {
      interface_language: locale, buyer_type: buyer, source_context: 'buyer_path', source_page: pathname,
    })}
    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-primary-800">
    {label}
  </a>;
}
