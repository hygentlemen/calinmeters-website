'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { productCategories, type ProductVariant, type ProductCategory } from '@/data/products';
import { trackEvent } from '@/components/GoogleAnalytics';
import { productPath } from '@/lib/site';

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

const projectSelectionGuides = [
  {
    title: 'Prepaid meter for Africa',
    bestFit: 'STS prepaid electricity meters, keypad water meters, CIU, and AMI devices',
    answer:
      'For African utility and sub-metering projects, CalinMeters usually recommends STS prepaid meters because 20-digit token recharge can work even where network coverage is inconsistent.',
    details: [
      'Use keypad STS electricity meters for basic prepaid rollout and token-based credit control.',
      'Use split keypad or CIU configurations when meters are locked outdoors, mounted on poles, or installed in anti-tamper boxes.',
      'Add GPRS, DCU, or LoRaWAN devices when the project also needs remote reading and AMI management.',
    ],
  },
  {
    title: 'Prepaid meter for Southeast Asia',
    bestFit: 'LoRaWAN smart water meters, prepaid electricity meters, and prepaid gas meters',
    answer:
      'For Southeast Asia, CalinMeters usually matches the meter to building density, network availability, and utility operations: LoRaWAN is useful for clustered water meter reading, while STS prepaid electricity meters remain practical for token sales.',
    details: [
      'Use LoRaWAN smart water meters where many meters are installed in communities, compounds, or municipal service areas.',
      'Use ultrasonic water meters when no moving parts and long-term measurement stability are more important than lowest upfront cost.',
      'Use prepaid gas meters with LoRaWAN when operators need valve control, credit management, and remote reading.',
    ],
  },
  {
    title: 'Smart metering solution for utilities',
    bestFit: 'AMI solution with meters, CIUs, DCUs, LoRaWAN gateways, and vending software',
    answer:
      'A smart metering solution for utilities should be planned as a system, not only as individual meters. Shenzhen Calinmeter Co., Ltd. combines STS prepaid meters, CIUs, DCUs, LoRaWAN gateways, and API-ready vending support for utility projects.',
    details: [
      'Use CIUs when customers need indoor token entry and balance checking.',
      'Use DCUs or LoRaWAN gateways when many meters should report through shared network equipment.',
      'Use API integration when the utility or partner already has payment, vending, or meter management software.',
    ],
  },
];

const tokenWorkflowSteps = [
  {
    label: '1. Register meter',
    text: 'The utility or operator registers the STS prepaid meter number in a vending or meter management system.',
  },
  {
    label: '2. Sell credit',
    text: 'The customer buys electricity, water or gas credit through a sales point, mobile money channel or integrated payment system.',
  },
  {
    label: '3. Generate token',
    text: 'The vending system encrypts the credit into a secure 20-digit STS token linked to that meter.',
  },
  {
    label: '4. Recharge meter',
    text: 'The customer enters the token on the meter keypad or CIU. Remote recharge can be added when the project uses GPRS, LoRaWAN or AMI integration.',
  },
];

const threePhaseComparison = [
  {
    model: 'CA368 Smart STS Prepaid Three Phase Energy Meter (GPRS)',
    communication: 'GPRS',
    bestFor: 'Utilities and commercial projects that need direct remote reading, monitoring, and meter management.',
    tokenOperation: 'STS 20-digit token entry remains available while GPRS adds remote data and management functions.',
  },
  {
    model: 'CA368 STS Prepaid Three Phase Energy Meter',
    communication: 'Standalone STS',
    bestFor: 'Commercial or utility connections that need secure token prepayment without always-on remote communication.',
    tokenOperation: 'Customers enter 20-digit STS tokens directly on the meter keypad.',
  },
];

function getCategoryBuyerGuide(category: ProductCategory) {
  const guides: Record<string, { title: string; text: string; points: string[] }> = {
    'Energy Meter': {
      title: 'How to choose an STS prepaid electricity meter',
      text: 'For utility and property projects, choose the meter by installation type, phase requirement and remote management needs. A keypad STS prepaid meter can work with 20-digit tokens without a network connection, while GPRS or LoRaWAN models support remote reading and AMI management.',
      points: ['Single phase meters fit residential users and small commercial loads.', 'Three phase and CT meters fit higher-current commercial or industrial sites.', 'DIN rail meters are often paired with a CIU when the meter is locked outdoors or mounted on a pole.'],
    },
    'Water Meter': {
      title: 'How to choose a LoRaWAN smart water meter',
      text: 'For prepaid water projects, choose between multi-jet and ultrasonic meters according to budget, measurement requirements and field conditions. LoRaWAN communication is suitable for wide-area reading where utilities want fewer SIM cards and lower network operating costs.',
      points: ['Plastic multi-jet meters are cost-effective for standard residential projects.', 'Brass multi-jet meters provide stronger body durability for tougher environments.', 'Ultrasonic meters have no moving parts and are useful when long-term measurement stability is important.'],
    },
    'Gas Meter': {
      title: 'How to choose a prepaid gas meter',
      text: 'A prepaid gas meter should combine STS token security, reliable valve control and a communication option that matches the project network. LoRaWAN gas meters are a practical choice when remote reading is needed without adding a SIM card to every meter.',
      points: ['Use STS prepayment for token-based credit control.', 'Use LoRaWAN when remote reading and lower network operating cost matter.', 'Match meter size and installation requirements to the local gas application.'],
    },
    'CIU (Customer Interface Unit)': {
      title: 'When a CIU is needed',
      text: 'A CIU gives the customer a convenient keypad and display when the meter is installed outside, locked in a cabinet or mounted on a pole. It improves token entry and balance checking without exposing the main meter.',
      points: ['Useful for DIN rail meters without a built-in keypad.', 'Helps anti-tamper outdoor installations stay accessible to users.', 'Supports daily credit and consumption checking from inside the home.'],
    },
    'DCU (Data Concentrator Unit)': {
      title: 'When a DCU is needed in an AMI system',
      text: 'A DCU collects meter data from a local area and forwards it to the back-end system. It is useful when many meters are deployed in a cluster and the project needs a lower-cost alternative to putting cellular communication in each meter.',
      points: ['Suitable for villages, compounds and dense utility deployments.', 'Reduces the number of direct cellular connections needed.', 'Supports AMI data aggregation for prepaid meter management.'],
    },
    Gateway: {
      title: 'When a LoRaWAN gateway is needed',
      text: 'A LoRaWAN gateway connects smart meters to the network so utilities can collect readings and manage devices remotely. It is normally selected according to coverage area, meter density, installation height and backhaul availability.',
      points: ['One gateway can support many meters in suitable field conditions.', 'Gateway placement strongly affects communication stability.', 'Use gateways for AMI projects that need remote metering without SIM cards in every meter.'],
    },
  };

  return guides[category.name];
}

function ProjectSelectionGuide() {
  return (
    <div className="mb-12 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Utility buyer guide</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">How to select prepaid meters by project market</h3>
        </div>
        <p className="text-sm leading-7 text-slate-600">
          These answers help utility buyers compare STS prepaid electricity meters, LoRaWAN smart water meters, prepaid gas meters, and AMI components before requesting specifications.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {projectSelectionGuides.map((guide) => (
          <article key={guide.title} className="rounded-md bg-slate-50 p-5">
            <h4 className="text-lg font-bold text-slate-950">{guide.title}</h4>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary-700">{guide.bestFit}</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{guide.answer}</p>
            <ul className="mt-4 space-y-2">
              {guide.details.map((detail) => (
                <li key={detail} className="flex gap-2 text-sm leading-6 text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function TokenWorkflowGuide() {
  return (
    <div className="mb-12 rounded-md border border-primary-100 bg-white p-6 shadow-sm">
      <div className="mb-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">STS token workflow</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">How a token based prepaid meter works</h3>
        </div>
        <p className="text-sm leading-7 text-slate-600">
          A token based prepaid meter uses STS security to load credit before consumption. The same workflow can support standalone keypad meters, split keypad prepaid meters with a CIU, and AMI projects with remote management.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tokenWorkflowSteps.map((step) => (
          <article key={step.label} className="rounded-md bg-slate-50 p-4">
            <h4 className="text-sm font-bold text-slate-950">{step.label}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-md bg-primary-50 p-4 text-sm leading-6 text-slate-700">
          Choose a built-in keypad meter when the customer can access the meter directly.
        </div>
        <div className="rounded-md bg-primary-50 p-4 text-sm leading-6 text-slate-700">
          Choose a split keypad prepaid meter or CIU when the meter is locked outdoors or mounted on a pole.
        </div>
        <div className="rounded-md bg-primary-50 p-4 text-sm leading-6 text-slate-700">
          Choose API-ready vending support when the utility already has payment or customer management software.
        </div>
      </div>
    </div>
  );
}

function ThreePhaseEnergyGuide() {
  return (
    <div className="mb-10 border-y border-slate-200 py-8">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Three phase buyer guide</p>
          <h4 className="mt-2 text-2xl font-bold text-slate-950">CA368 GPRS or standalone STS: which model fits the project?</h4>
        </div>
        <p className="text-sm leading-7 text-slate-600">
          Both CA368 models support STS prepaid electricity metering for three-phase service connections. The main selection decision is whether the project needs direct GPRS communication or only secure keypad token operation.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-slate-950">
              <th className="px-4 py-3 font-semibold">Model</th>
              <th className="px-4 py-3 font-semibold">Communication</th>
              <th className="px-4 py-3 font-semibold">Best fit</th>
              <th className="px-4 py-3 font-semibold">Token operation</th>
            </tr>
          </thead>
          <tbody>
            {threePhaseComparison.map((item) => (
              <tr key={item.model} className="border-b border-slate-200 align-top">
                <td className="px-4 py-4 font-semibold text-slate-950">{item.model}</td>
                <td className="px-4 py-4 text-slate-700">{item.communication}</td>
                <td className="px-4 py-4 leading-6 text-slate-600">{item.bestFor}</td>
                <td className="px-4 py-4 leading-6 text-slate-600">{item.tokenOperation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-600">
        Before requesting a quotation, provide the nominal voltage, maximum current or CT ratio, installation method, communication coverage, vending or API requirement, estimated quantity, and destination-market standards or utility specifications.
      </p>
    </div>
  );
}

function VariantCard({ variant }: { variant: ProductVariant }) {
  const [imgError, setImgError] = useState(false);
  const tags = getVariantTags(variant);

  return (
    <article id={`product-${variant.id}`} className="group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg">
      <div className="h-60 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
        {!imgError ? (
          <Image
            src={versionedImage(variant.image)}
            alt={variant.name}
            width={640}
            height={480}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
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
        <h5 className="text-base font-semibold leading-snug text-slate-950">
          {variant.slug ? (
            <Link href={productPath(variant.slug)} className="hover:text-primary-700">{variant.name}</Link>
          ) : variant.name}
        </h5>
        <p className="mt-2 min-h-10 text-sm leading-6 text-slate-600">{variant.description}</p>
        {(variant.slug || variant.specs.length > 0) && (
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {variant.slug && (
              <Link
                href={productPath(variant.slug)}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary-700 px-3 text-sm font-semibold text-white transition hover:bg-primary-800"
              >
                Product details
              </Link>
            )}
            {variant.specs.map((spec, i) => (
              <a
                key={i}
                href={spec.pdf}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('specification_download', {
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
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-md border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
        active ? 'border-primary-500 shadow-md ring-1 ring-primary-100' : 'border-slate-200 hover:border-primary-200'
      }`}
    >
      <button type="button" onClick={onSelect} className="flex flex-1 flex-col text-left">
        <div className="flex h-64 w-full items-center justify-center overflow-hidden bg-slate-50 p-2">
          {!imgError ? (
            <Image
              src={versionedImage(category.image)}
              alt={category.name}
              width={640}
              height={480}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="h-full w-full scale-[1.25] object-contain transition duration-300 group-hover:scale-[1.35]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-center text-sm text-slate-400">Product Image</div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 pb-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-950">{category.name}</h3>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{productCount} items</span>
          </div>
          <p className="text-sm leading-6 text-slate-600">{category.description}</p>
          {summary && <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary-700">{summary}</p>}
        </div>
      </button>
      <div className="px-5 pb-5">
        {category.slug ? (
          <Link href={productPath(category.slug)} className="inline-flex min-h-10 items-center font-semibold text-primary-700 hover:text-primary-900">
            Explore the category guide
            <span aria-hidden="true" className="ml-1.5">→</span>
          </Link>
        ) : (
          <button type="button" onClick={onSelect} className="inline-flex min-h-10 items-center font-semibold text-primary-700 hover:text-primary-900">View products</button>
        )}
      </div>
    </article>
  );
}

function ProductDetailSection({ category }: { category: ProductCategory }) {
  const [imgError, setImgError] = useState(false);
  const buyerGuide = getCategoryBuyerGuide(category);

  return (
    <div className="mt-12 border-t border-slate-200 pt-10">
      <div className="mb-8 grid gap-6 lg:grid-cols-[320px_1fr] lg:items-end">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white p-2">
          {!imgError ? (
            <Image
              src={versionedImage(category.image)}
              alt={category.name}
              width={160}
              height={160}
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

      {buyerGuide && (
        <div className="mb-10 rounded-md border border-primary-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Selection guide</p>
          <h4 className="mt-2 text-2xl font-bold text-slate-950">{buyerGuide.title}</h4>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">{buyerGuide.text}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {buyerGuide.points.map((point) => (
              <div key={point} className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {point}
              </div>
            ))}
          </div>
        </div>
      )}

      {category.name === 'Energy Meter' && <ThreePhaseEnergyGuide />}

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

        <ProjectSelectionGuide />

        <TokenWorkflowGuide />

        <div ref={detailsRef} className="scroll-mt-24">
          {activeCategory && <ProductDetailSection category={activeCategory} />}
        </div>
      </div>
    </section>
  );
}
