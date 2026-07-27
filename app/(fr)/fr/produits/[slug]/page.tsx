import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryAuthorityPage } from '@/components/catalog/CategoryAuthorityPage';
import { ProductDetailPage } from '@/components/catalog/ProductDetailPage';
import Footer from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import Navbar from '@/components/Navbar';
import SocialSidebar from '@/components/SocialSidebar';
import { getFrenchFaqItemsByQuestions } from '@/data/locales/fr/faq';
import { frenchCategorySeoPages } from '@/data/locales/fr/seoPages';
import { alternateLanguages } from '@/lib/i18n';
import {
  getAllFrenchProductSlugs,
  getFrenchProductById,
  getFrenchProductBySlug,
  getFrenchRelatedProducts,
  type FrenchCatalogProduct,
} from '@/lib/localizedCatalog';
import {
  absoluteUrl,
  frenchProductPath,
  site,
} from '@/lib/site';

interface FrenchCatalogRouteProps {
  params: { slug: string };
}

const frenchCategories = [
  {
    label: "Compteurs d'électricité",
    description: 'Compteurs électriques prépayés STS',
    href: frenchProductPath('compteur-electricite-prepaye-sts'),
  },
  {
    label: "Compteurs d'eau",
    description: "Compteurs d'eau prépayés STS",
    href: frenchProductPath('compteur-eau-prepaye-sts'),
  },
];

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...Object.keys(frenchCategorySeoPages),
    ...getAllFrenchProductSlugs(),
  ].map((slug) => ({ slug }));
}

function getFrenchCategory(slug: string) {
  return frenchCategorySeoPages[slug];
}

function productCategoryPath(productId: string) {
  return frenchProductPath(
    productId.startsWith('water-')
      ? 'compteur-eau-prepaye-sts'
      : 'compteur-electricite-prepaye-sts',
  );
}

export function generateMetadata({
  params,
}: FrenchCatalogRouteProps): Metadata {
  const seo = getFrenchCategory(params.slug);
  const path = frenchProductPath(params.slug);
  const languages = alternateLanguages(path);

  if (seo) {
    const firstProduct = getFrenchProductById(seo.productIds[0]);

    return {
      title: seo.title,
      description: seo.description,
      alternates: { canonical: path, languages },
      robots: { index: false, follow: true },
      openGraph: {
        title: seo.title,
        description: seo.description,
        url: absoluteUrl(path),
        siteName: site.name,
        type: 'website',
        locale: 'fr_FR',
        images: firstProduct ? [{
          url: absoluteUrl(firstProduct.product.image),
          alt: `Gamme ${seo.primaryKeyword}`,
        }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title,
        description: seo.description,
        images: firstProduct ? [absoluteUrl(firstProduct.product.image)] : undefined,
      },
    };
  }

  const entry = getFrenchProductBySlug(params.slug);
  if (!entry) return {};

  return {
    title: entry.product.name,
    description: entry.product.description,
    alternates: { canonical: path, languages },
    robots: { index: false, follow: true },
    openGraph: {
      title: entry.product.name,
      description: entry.product.description,
      url: absoluteUrl(path),
      siteName: site.name,
      type: 'website',
      locale: 'fr_FR',
      images: [{
        url: absoluteUrl(entry.product.image),
        alt: `Vue du produit ${entry.product.name}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.product.name,
      description: entry.product.description,
      images: [absoluteUrl(entry.product.image)],
    },
    category: entry.category.name,
  };
}

function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function categoryStructuredData(slug: string) {
  const seo = getFrenchCategory(slug);
  if (!seo) return null;

  const products = seo.productIds
    .map((id) => getFrenchProductById(id))
    .filter((entry): entry is FrenchCatalogProduct => Boolean(entry));
  const faqs = getFrenchFaqItemsByQuestions(seo.faqQuestions);
  const path = frenchProductPath(slug);
  const pageUrl = absoluteUrl(path);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.h1,
        description: seo.description,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': `${site.url}/fr/#website` },
        about: seo.primaryKeyword,
      },
      breadcrumbSchema([
        { name: 'Accueil', path: '/fr/' },
        { name: seo.primaryKeyword, path },
      ]),
      {
        '@type': 'ItemList',
        name: `Modèles de ${seo.primaryKeyword}`,
        itemListElement: products.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(frenchProductPath(entry.product.slug!)),
          name: entry.product.name,
        })),
      },
      {
        '@type': 'FAQPage',
        inLanguage: 'fr-FR',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}

function productStructuredData(entry: FrenchCatalogProduct) {
  const { product, category } = entry;
  if (!product.slug) return null;

  const path = frenchProductPath(product.slug);
  const pageUrl = absoluteUrl(path);
  const categoryPath = productCategoryPath(product.id);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: product.name,
        description: product.description,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': `${site.url}/fr/#website` },
        mainEntity: { '@id': `${pageUrl}#product` },
      },
      {
        '@type': 'Product',
        '@id': `${pageUrl}#product`,
        url: pageUrl,
        name: product.name,
        model: product.model,
        description: product.description,
        image: [absoluteUrl(product.image)],
        category: category.name,
        brand: { '@type': 'Brand', name: site.name },
        manufacturer: { '@id': `${site.url}/#organization` },
        additionalProperty: product.verifiedSpecs?.map((spec) => ({
          '@type': 'PropertyValue',
          name: spec.label,
          value: spec.value,
        })),
      },
      breadcrumbSchema([
        { name: 'Accueil', path: '/fr/' },
        { name: category.name, path: categoryPath },
        { name: product.model ?? product.name, path },
      ]),
    ],
  };
}

export default function FrenchCatalogRoute({
  params,
}: FrenchCatalogRouteProps) {
  const seo = getFrenchCategory(params.slug);
  const path = frenchProductPath(params.slug);
  const englishHref = alternateLanguages(path)?.en ?? '/';

  if (seo) {
    const products = seo.productIds
      .map((id) => getFrenchProductById(id))
      .filter((entry): entry is FrenchCatalogProduct => Boolean(entry));
    const faqs = getFrenchFaqItemsByQuestions(seo.faqQuestions);
    const structuredData = categoryStructuredData(params.slug);
    const relatedCategories = Object.values(frenchCategorySeoPages)
      .filter((page) => page.slug !== seo.slug)
      .map((page) => ({
        slug: page.slug,
        primaryKeyword: page.primaryKeyword,
      }));

    return (
      <div className="min-h-screen bg-white">
        {structuredData && <JsonLd data={structuredData} />}
        <Navbar
          locale="fr"
          languageHref={englishHref}
          categories={frenchCategories}
        />
        <CategoryAuthorityPage
          seo={seo}
          products={products}
          faqs={faqs}
          locale="fr"
          productHref={frenchProductPath}
          relatedCategories={relatedCategories}
        />
        <Footer
          locale="fr"
          categories={frenchCategories.map((category) => ({
            label: category.description,
            href: category.href,
          }))}
        />
        <SocialSidebar locale="fr" />
      </div>
    );
  }

  const entry = getFrenchProductBySlug(params.slug);
  if (!entry) notFound();

  const structuredData = productStructuredData(entry);

  return (
    <div className="min-h-screen bg-white">
      {structuredData && <JsonLd data={structuredData} />}
      <Navbar
        locale="fr"
        languageHref={englishHref}
        categories={frenchCategories}
      />
      <ProductDetailPage
        entry={entry}
        relatedProducts={getFrenchRelatedProducts(entry)}
        locale="fr"
        categoryHref={productCategoryPath(entry.product.id)}
        productHref={frenchProductPath}
      />
      <Footer
        locale="fr"
        categories={frenchCategories.map((category) => ({
          label: category.description,
          href: category.href,
        }))}
      />
      <SocialSidebar locale="fr" />
    </div>
  );
}
