'use client';

import { useRef, useState } from 'react';
import { productCategories, type ProductVariant, type ProductCategory } from '@/data/products';
import { trackEvent } from '@/components/GoogleAnalytics';

const imageVersion = '20260529';

function versionedImage(src: string) {
  return `${src}?v=${imageVersion}`;
}

function getCategoryCount(category: ProductCategory) {
  if (category.subCategories) {
    return category.subCategories.reduce((total, sub) => total + sub.variants.length, 0);
  }
  return category.variants?.length ?? 0;
}

function getCategorySummary(category: ProductCategory) {
  if (category.subCategories) {
    return category.subCategories.map((sub) => sub.name.replace(/\s*Energy Meter\s*/i, '').trim()).join(' / ');
  }
  return category.variants?.map((variant) => variant.name.split('(')[0].trim()).join(' / ') ?? '';
}

function getVariantTags(variant: ProductVariant) {
  const text = `${variant.name} ${variant.description}`.toLowerCase();
  const tags: Array<[string, boolean]> = [
    ['STS', text.includes('sts')],
    ['LoRaWAN', text.includes('lorawan') || text.includes('lora wan')],
    ['GPRS', text.includes('gprs')],
    ['DIN Rail', text.includes('din rail')],
    ['Prepaid', text.includes('prepaid')],
    ['AMI', text.includes('ami')],
  ];

  return tags.filter(([, enabled]) => enabled).map(([tag]) => tag).slice(0, 3);
}

function VariantCard({ variant }: { variant: ProductVariant }) {
  const [imgError, setImgError] = useState(false);
  const tags = getVariantTags(variant);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg">
      <div className="h-60 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
        {!imgError ? (
          <img
            src={versionedImage(variant.image)}
            alt={variant.name}
            className="h-full w-full scale-[1.35] object-contain transition duration-300 group-hover:scale-[1.45]"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-slate-400 text-sm text-center">Product Image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              {tag}
            </span>
          ))}
        </div>
        <h5 className="text-base font-semibold leading-snug text-slate-950">{variant.name}</h5>
        <p className="mt-2 min-h-10 text-sm leading-6 text-slate-600">{variant.description}</p>
        {variant.specs.length > 0 && (
          <div className="mt-auto pt-5">
            {variant.specs.map((spec, i) => (
              <a
                key={i}
                href={spec.pdf}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('file_download', {
                    file_name: spec.pdf.split('/').pop(),
                    file_extension: 'pdf',
                    link_url: spec.pdf,
                    product_id: variant.id,
                    product_name: variant.name,
                  })
                }
                className="inline-flex h-10 items-center justify-center rounded-md border border-primary-200 px-3 text-sm font-semibold text-primary-700 transition hover:border-primary-600 hover:bg-primary-50"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {spec.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function CategoryOverviewCard({
  category,
  active,
  onSelect,
}: {
  category: ProductCategory;
  active: boolean;
  onSelect: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const productCount = getCategoryCount(category);
  const summary = getCategorySummary(category);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex h-full flex-col overflow-hidden rounded-md border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
        active ? 'border-primary-500 shadow-md ring-1 ring-primary-100' : 'border-slate-200 hover:border-primary-200'
      }`}
    >
      <div className="flex h-64 items-center justify-center overflow-hidden bg-slate-50 p-2">
        {!imgError ? (
          <img
            src={versionedImage(category.image)}
            alt={category.name}
            className="h-full w-full scale-[1.25] object-contain transition duration-300 group-hover:scale-[1.35]"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-slate-400 text-sm text-center">Product Image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-slate-950">{category.name}</h3>
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {productCount} items
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600">{category.description}</p>
        {summary && <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary-700">{summary}</p>}
        <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary-700">
          View products
          <svg className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </button>
  );
}

function ProductDetailSection({ category }: { category: ProductCategory }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="mt-12 border-t border-slate-200 pt-10">
      <div className="mb-8 grid gap-6 lg:grid-cols-[320px_1fr] lg:items-end">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white p-2">
          {!imgError ? (
            <img
              src={versionedImage(category.image)}
              alt={category.name}
                className="h-full w-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
              <div className="text-xs text-slate-400">Img</div>
          )}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Selected category</p>
            <h3 className="mt-1 text-3xl font-bold text-slate-950">{category.name}</h3>
            <p className="mt-2 text-slate-600">{category.description}</p>
          </div>
        </div>
        <div className="rounded-md bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">
          Browse focused product groups below. Download links are available on products with published specifications.
        </div>
      </div>

      {category.subCategories ? (
        <div className="space-y-10">
          {category.subCategories.map((sub) => (
            <div key={sub.name}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h4 className="text-xl font-bold text-slate-900">{sub.name}</h4>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sub.variants.map((v) => (
                  <VariantCard key={v.id} variant={v} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : category.variants ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {category.variants.map((v) => (
            <VariantCard key={v.id} variant={v} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ProductsSection() {
  const [activeCategoryName, setActiveCategoryName] = useState(productCategories[0]?.name ?? '');
  const detailsRef = useRef<HTMLDivElement>(null);
  const activeCategory = productCategories.find((cat) => cat.name === activeCategoryName) ?? productCategories[0];
  const selectCategory = (categoryName: string) => {
    setActiveCategoryName(categoryName);
    window.setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <section id="products" className="bg-[#f6f8fb] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Product portfolio</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-950">Smart Metering Products</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">
            Explore prepaid energy, water and gas meters, plus AMI devices for data collection and network connectivity.
          </p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {productCategories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => selectCategory(cat.name)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategoryName === cat.name
                  ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((cat) => (
            <CategoryOverviewCard
              key={cat.name}
              category={cat}
              active={activeCategoryName === cat.name}
              onSelect={() => selectCategory(cat.name)}
            />
          ))}
        </div>

        <div ref={detailsRef} className="scroll-mt-24">
          {activeCategory && <ProductDetailSection category={activeCategory} />}
        </div>
      </div>
    </section>
  );
}
