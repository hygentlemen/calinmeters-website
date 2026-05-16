'use client';

import { useState } from 'react';
import { companyCertificates, productCertificates, shippingCertificates } from '@/data/certificates';

function CertGrid({ items, label }: { items: { name: string; file: string; type: string }[]; label: string }) {
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {items.map((cert) => (
        <a
          key={cert.name}
          href={cert.file}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition text-center group"
        >
          {cert.type === 'image' && !imgErrors.has(cert.name) ? (
            <div className="h-20 flex items-center justify-center mb-2">
              <img
                src={cert.file}
                alt={cert.name}
                className="max-h-full max-w-full object-contain"
                onError={() => setImgErrors((prev) => new Set(prev).add(cert.name))}
              />
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center mb-2">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          <div className="text-xs text-gray-600 group-hover:text-primary-600 font-medium leading-tight line-clamp-2">
            {cert.name}
          </div>
        </a>
      ))}
      {items.length === 0 && (
        <p className="text-gray-400 text-sm col-span-full">No certificates available</p>
      )}
    </div>
  );
}

export default function CertificatesSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="certificates" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Certifications</h2>
          <p className="text-xl text-gray-600">International standards and quality certifications</p>
        </div>

        {/* Company-level certs */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Company Certifications</h3>
          <CertGrid items={companyCertificates} label="Company" />
        </div>

        {/* Product certs with tabs */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Product Certifications</h3>
          <div className="flex gap-2 mb-6 flex-wrap">
            {productCertificates.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === i
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <CertGrid items={productCertificates[activeTab]?.items || []} label={productCertificates[activeTab]?.name || ''} />
        </div>

        {/* Shipping certs */}
        {shippingCertificates.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Shipping Certificates</h3>
            <CertGrid items={shippingCertificates} label="Shipping" />
          </div>
        )}
      </div>
    </section>
  );
}
