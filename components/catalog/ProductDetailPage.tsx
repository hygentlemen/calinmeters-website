import Image from 'next/image';
import Link from 'next/link';
import type { CatalogProduct } from '@/lib/catalog';
import { productPath } from '@/lib/site';
import { Breadcrumbs } from '@/components/catalog/Breadcrumbs';
import { InquiryCta } from '@/components/catalog/InquiryCta';
import { ProductPdfLink } from '@/components/catalog/ProductPdfLink';

interface ProductDetailPageProps {
  entry: CatalogProduct;
  relatedProducts: CatalogProduct[];
  locale?: 'en' | 'fr';
  categoryHref?: string;
  productHref?: (slug: string) => string;
}

export function ProductDetailPage({
  entry,
  relatedProducts,
  locale = 'en',
  categoryHref,
  productHref = productPath,
}: ProductDetailPageProps) {
  const { product, category, subCategoryName } = entry;
  const isFrench = locale === 'fr';

  if (!product.slug || !category.slug) return null;
  const resolvedCategoryHref = categoryHref ?? productPath(category.slug);

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-primary-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: isFrench ? 'Accueil' : 'Home', href: isFrench ? '/fr/' : '/' },
              { label: category.name, href: resolvedCategoryHref },
              { label: product.model ?? product.name },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex min-h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
              <Image
                src={product.image}
                alt={isFrench ? `Vue du produit ${product.name}` : `${product.name} product view`}
                width={800}
                height={640}
                priority
                sizes="(min-width: 1024px) 44vw, 90vw"
                className="h-auto max-h-[500px] w-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">{subCategoryName ?? category.name}</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{product.name}</h1>
              {product.model && <p className="mt-4 font-mono text-base font-semibold text-slate-500">{isFrench ? 'Modèle' : 'Model'} {product.model}</p>}
              <div className="mt-6 rounded-xl border-l-4 border-primary-600 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary-700">{isFrench ? 'Résumé du produit' : 'Product summary'}</p>
                <p className="mt-2 text-base leading-8 text-slate-700">{product.description}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {product.specs.map((spec) => (
                  <ProductPdfLink key={spec.pdf} productId={product.id} productName={product.name} href={spec.pdf} label={spec.label} locale={locale} />
                ))}
                <Link href={resolvedCategoryHref} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
                  {isFrench ? 'Comparer les modèles de la catégorie' : 'Compare category models'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">{isFrench ? 'Configuration du produit' : 'Product configuration'}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">{isFrench ? 'Points clés publiés' : 'Published highlights'}</h2>
          {product.highlights?.length ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-600" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 leading-7 text-slate-600">{isFrench ? 'Utilisez le résumé du produit et la liste du projet pour demander la configuration applicable.' : 'Use the product summary and project checklist to request the applicable configuration.'}</p>
          )}

          {product.applications?.length ? (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-slate-950">{isFrench ? 'Applications courantes' : 'Typical buyer fit'}</h2>
              <ul className="mt-5 space-y-3">
                {product.applications.map((application) => (
                  <li key={application} className="flex gap-3 text-sm leading-7 text-slate-600">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{application}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          {product.verifiedSpecs?.length ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="bg-slate-950 px-5 py-4 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary-300">{isFrench ? 'Valeurs de la fiche technique' : 'Datasheet values'}</p>
                <h2 className="mt-1 text-2xl font-bold">{isFrench ? 'Caractéristiques publiées' : 'Published specifications'}</h2>
              </div>
              <dl>
                {product.verifiedSpecs.map((spec, index) => (
                  <div key={spec.label} className={`grid gap-1 px-5 py-4 sm:grid-cols-[0.42fr_0.58fr] ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <dt className="font-semibold text-slate-900">{spec.label}</dt>
                    <dd className="text-slate-600">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">{isFrench ? 'Configuration à confirmer' : 'Configuration requires confirmation'}</h2>
              <p className="mt-3 leading-7 text-slate-700">{isFrench ? "Aucune fiche technique publique n'est actuellement liée à ce modèle. Envoyez les paramètres du projet afin de confirmer la configuration et les documents applicables." : 'A public specification sheet is not currently linked for this model. Send the project parameters below so the applicable configuration and documents can be confirmed.'}</p>
            </div>
          )}

          {product.confirmBeforeQuote?.length ? (
            <aside className="mt-6 rounded-xl border border-primary-100 bg-primary-50 p-6">
              <h2 className="text-2xl font-bold text-slate-950">{isFrench ? 'À confirmer avant le devis' : 'Confirm before quotation'}</h2>
              <ul className="mt-5 space-y-3">
                {product.confirmBeforeQuote.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-slate-700">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-y border-slate-200 bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">{isFrench ? 'Même catégorie de produits' : 'Same product category'}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{isFrench ? 'Modèles associés' : 'Related models'}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {relatedProducts.map((related) => related.product.slug ? (
                <article key={related.product.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">{related.product.model ?? related.product.id}</p>
                  <h3 className="mt-2 text-lg font-bold text-slate-950">{related.product.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{related.product.description}</p>
                  <Link href={productHref(related.product.slug)} className="mt-5 inline-flex font-semibold text-primary-700 hover:text-primary-900">{isFrench ? 'Voir le modèle' : 'View model details'} →</Link>
                </article>
              ) : null)}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <InquiryCta
          topic={isFrench ? `${product.model ?? product.name} pour votre projet de comptage` : `${product.model ?? product.name} for your metering project`}
          locale={locale}
          productId={product.id}
          productName={product.model ?? product.name}
          description={isFrench
            ? "Envoyez les conditions de fonctionnement, l'installation, la communication, la quantité et les exigences de destination. Les caractéristiques publiées pourront être comparées à la configuration proposée."
            : 'Send the operating conditions, installation, communication, quantity and destination requirements. The published specifications can then be checked against the proposed project configuration.'}
        />
      </section>
    </main>
  );
}
