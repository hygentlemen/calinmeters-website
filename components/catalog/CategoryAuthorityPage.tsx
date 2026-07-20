import Image from 'next/image';
import Link from 'next/link';
import type { FaqItem } from '@/data/faq';
import { categorySeoPages, type CategorySeoPage } from '@/data/seoPages';
import type { CatalogProduct } from '@/lib/catalog';
import { productPath } from '@/lib/site';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { InquiryCta } from '@/components/catalog/InquiryCta';
import { ProductPdfLink } from '@/components/catalog/ProductPdfLink';

interface CategoryAuthorityPageProps {
  seo: CategorySeoPage;
  products: CatalogProduct[];
  faqs: FaqItem[];
}

function ProductCard({ entry }: { entry: CatalogProduct }) {
  const { product, subCategoryName } = entry;

  if (!product.slug) return null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg">
      <Link href={productPath(product.slug)} className="flex aspect-[4/3] items-center justify-center bg-slate-50 p-5">
        <Image
          src={product.image}
          alt={`${product.name} product view`}
          width={640}
          height={480}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="h-full w-full object-contain"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
          {subCategoryName ?? entry.category.name}
        </p>
        <h2 className="mt-2 text-xl font-bold leading-snug text-slate-950">
          <Link href={productPath(product.slug)} className="hover:text-primary-700">
            {product.name}
          </Link>
        </h2>
        {product.model && <p className="mt-2 font-mono text-sm text-slate-500">Model {product.model}</p>}
        <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{product.description}</p>
        <Link
          href={productPath(product.slug)}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          View product details
        </Link>
      </div>
    </article>
  );
}

export function CategoryAuthorityPage({ seo, products, faqs }: CategoryAuthorityPageProps) {
  const heroImage = products[0]?.product.image;
  const relatedCategories = Object.values(categorySeoPages).filter((page) => page.slug !== seo.slug);

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-primary-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/#products' }, { label: seo.primaryKeyword }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">{seo.eyebrow}</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{seo.h1}</h1>
              <div className="mt-6 rounded-xl border-l-4 border-primary-600 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary-700">Direct answer</p>
                <p className="mt-2 text-base leading-8 text-slate-700">{seo.directAnswer}</p>
              </div>
              <p className="mt-6 max-w-4xl text-base leading-8 text-slate-600">{seo.intro}</p>
            </div>
            {heroImage && (
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <Image
                  src={heroImage}
                  alt={`${seo.primaryKeyword} from CalinMeters`}
                  width={720}
                  height={540}
                  priority
                  sizes="(min-width: 1024px) 36vw, 90vw"
                  className="h-auto max-h-[360px] w-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="models-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">Published models</p>
          <h2 id="models-heading" className="mt-2 text-3xl font-bold text-slate-950">Compare available configurations</h2>
          <p className="mt-4 leading-7 text-slate-600">Open a model page for published specifications, application guidance, the current PDF and the project details that still need confirmation.</p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((entry) => <ProductCard key={entry.product.id} entry={entry} />)}
        </div>
      </section>

      {seo.comparisonTitle && seo.comparisonAnswer && (
        <section aria-labelledby="comparison-heading" className="border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">Model comparison</p>
            <h2 id="comparison-heading" className="mt-2 max-w-4xl text-3xl font-bold text-slate-950">{seo.comparisonTitle}</h2>
            <p className="mt-4 max-w-4xl leading-8 text-slate-600">{seo.comparisonAnswer}</p>
            <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-[900px] w-full border-collapse text-left">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th scope="col" className="px-5 py-4 text-sm font-semibold">Model and configuration</th>
                    <th scope="col" className="px-5 py-4 text-sm font-semibold">Published parameters</th>
                    <th scope="col" className="px-5 py-4 text-sm font-semibold">Buyer fit</th>
                    <th scope="col" className="px-5 py-4 text-sm font-semibold">Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map(({ product, subCategoryName }) => {
                    const specification = product.specs[0];

                    return (
                      <tr key={product.id} className="align-top">
                        <th scope="row" className="px-5 py-5 font-normal">
                          {product.slug ? (
                            <Link href={productPath(product.slug)} className="font-bold text-slate-950 hover:text-primary-700">
                              {product.model ?? product.name}
                            </Link>
                          ) : (
                            <span className="font-bold text-slate-950">{product.model ?? product.name}</span>
                          )}
                          <span className="mt-1 block text-sm leading-6 text-slate-600">{subCategoryName ?? product.name}</span>
                        </th>
                        <td className="px-5 py-5">
                          <ul className="space-y-2 text-sm leading-6 text-slate-600">
                            {product.verifiedSpecs?.slice(0, 3).map((spec) => (
                              <li key={spec.label}>
                                <span className="font-semibold text-slate-800">{spec.label}:</span> {spec.value}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-5 py-5 text-sm leading-6 text-slate-600">{product.applications?.[0] ?? product.description}</td>
                        <td className="px-5 py-5">
                          {specification ? (
                            <ProductPdfLink
                              productId={product.id}
                              productName={product.name}
                              href={specification.pdf}
                              label="Download PDF"
                            />
                          ) : (
                            <span className="text-sm text-slate-500">Request current specification</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Published values are transcribed from the current model datasheets. Confirm the final size, flow range, communication frequency, installation conditions and destination requirements in the quotation and pilot.
            </p>
          </div>
        </section>
      )}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">Buyer selection guide</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">{seo.selectionTitle}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {seo.selectionSteps.map((step, index) => (
              <article key={step.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800">{index + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">STS workflow</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">{seo.workflowTitle}</h2>
          <p className="mt-4 leading-7 text-slate-600">{seo.workflowIntro}</p>
          <ol className="mt-7 space-y-4">
            {seo.workflowSteps.map((step) => (
              <li key={step.title} className="rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <aside className="rounded-2xl bg-slate-950 p-7 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-300">Quotation checklist</p>
          <h2 className="mt-2 text-2xl font-bold">Information to send with your inquiry</h2>
          <ul className="mt-6 space-y-4">
            {seo.quotationChecklist.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-200">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">Buyer questions</p>
          <h2 className="mt-2 text-center text-3xl font-bold text-slate-950">Frequently asked questions</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer list-none pr-8 font-semibold text-slate-950 marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-4 border-t border-slate-100 pt-4 leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <InquiryCta
            topic={seo.primaryKeyword}
            description="Send the service conditions, communication plan, quantity, destination requirements and pilot criteria. CalinMeters can then review the published models against your project."
          />
        </div>
        <div className="rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-950">Related prepaid meter categories</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {relatedCategories.map((page) => (
              <Link key={page.slug} href={productPath(page.slug)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-primary-100 hover:text-primary-800">
                {page.primaryKeyword}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
