'use client';

import { useState } from 'react';
import { productCategories, type ProductVariant, type ProductCategory } from '@/data/products';

function VariantCard({ variant }: { variant: ProductVariant }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="h-40 bg-gray-50 flex items-center justify-center p-4">
        {!imgError ? (
          <img
            src={variant.image}
            alt={variant.name}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-gray-400 text-sm text-center">Product Image</div>
        )}
      </div>
      <div className="p-4">
        <h5 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">{variant.name}</h5>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{variant.description}</p>
        {variant.specs.length > 0 && (
          <div className="space-y-1">
            {variant.specs.map((spec, i) => (
              <a
                key={i}
                href={spec.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {spec.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySection({ category }: { category: ProductCategory }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="mb-12 last:mb-0">
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
          {!imgError ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-contain p-1"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Img</div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
          <p className="text-gray-600">{category.description}</p>
        </div>
      </div>

      {/* Sub-categories or Direct Variants */}
      {category.subCategories ? (
        <div className="space-y-8">
          {category.subCategories.map((sub) => (
            <div key={sub.name}>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-primary-500 pl-3">{sub.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sub.variants.map((v) => (
                  <VariantCard key={v.id} variant={v} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : category.variants ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.variants.map((v) => (
            <VariantCard key={v.id} variant={v} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-xl text-gray-600">Comprehensive range of smart metering solutions</p>
        </div>
        {productCategories.map((cat) => (
          <CategorySection key={cat.name} category={cat} />
        ))}
      </div>
    </section>
  );
}
