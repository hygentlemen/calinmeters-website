'use client';

import { trackEvent } from '@/components/GoogleAnalytics';

interface ProductPdfLinkProps {
  productId: string;
  productName: string;
  href: string;
  label: string;
}

export function ProductPdfLink({
  productId,
  productName,
  href,
  label,
}: ProductPdfLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent('specification_download', {
          file_name: href.split('/').pop(),
          file_extension: 'pdf',
          link_url: href,
          product_id: productId,
          product_name: productName,
          source_page: window.location.pathname,
        })
      }
      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:border-primary-600 hover:bg-primary-50"
    >
      <svg aria-hidden="true" className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {label}
    </a>
  );
}
