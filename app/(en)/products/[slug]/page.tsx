import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryAuthorityPage } from '@/components/catalog/CategoryAuthorityPage';
import { ProductDetailPage } from '@/components/catalog/ProductDetailPage';
import { JsonLd } from '@/components/JsonLd';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import SocialSidebar from '@/components/SocialSidebar';
import { getFaqItemsByQuestions } from '@/data/faq';
import { getCategorySeoPage } from '@/data/seoPages';
import {
  getAllCatalogSlugs,
  getCategoryBySlug,
  getProductById,
  getProductBySlug,
  getRelatedProducts,
  type CatalogProduct,
} from '@/lib/catalog';
import { alternateLanguages } from '@/lib/i18n';
import { absoluteUrl, productPath, site } from '@/lib/site';

interface CatalogRouteProps {
  params: { slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCatalogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: CatalogRouteProps): Metadata {
  const seo = getCategorySeoPage(params.slug);
  const category = getCategoryBySlug(params.slug);

  if (seo && category) {
    const path = productPath(seo.slug);

    return {
      title: seo.title,
      description: seo.description,
      alternates: {
        canonical: path,
        languages: alternateLanguages(path),
      },
      robots: { index: true, follow: true },
      openGraph: {
        title: seo.title,
        description: seo.description,
        url: absoluteUrl(path),
        siteName: site.name,
        type: 'website',
        images: [{
          url: absoluteUrl(category.image),
          alt: `${seo.primaryKeyword} product range`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title,
        description: seo.description,
        images: [absoluteUrl(category.image)],
      },
    };
  }

  const entry = getProductBySlug(params.slug);
  const productSlug = entry?.product.slug;
  if (!entry || !productSlug) return {};

  const { product, category: productCategory } = entry;
  const path = productPath(productSlug);
  const title = product.model ? `${product.model} ${product.name.replace(product.model, '').trim()}` : product.name;

  return {
    title,
    description: product.description,
    alternates: {
      canonical: path,
      languages: alternateLanguages(path),
    },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: product.description,
      url: absoluteUrl(path),
      siteName: site.name,
      type: 'website',
      images: [{
        url: absoluteUrl(product.image),
        alt: `${product.name} product view`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: product.description,
      images: [absoluteUrl(product.image)],
    },
    category: productCategory.name,
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
  const seo = getCategorySeoPage(slug);
  const category = getCategoryBySlug(slug);
  if (!seo || !category) return null;

  const entries = seo.productIds
    .map((id) => getProductById(id))
    .filter((entry): entry is CatalogProduct => Boolean(entry?.product.slug));
  const faqs = getFaqItemsByQuestions(seo.faqQuestions);
  const pageUrl = absoluteUrl(productPath(slug));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.h1,
        description: seo.description,
        isPartOf: { '@id': `${site.url}/#website` },
        about: seo.primaryKeyword,
      },
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: seo.primaryKeyword, path: productPath(slug) },
      ]),
      {
        '@type': 'ItemList',
        name: `${seo.primaryKeyword} models`,
        itemListElement: entries.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(productPath(entry.product.slug!)),
          name: entry.product.name,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}

function productStructuredData(entry: CatalogProduct) {
  const { product, category } = entry;
  if (!product.slug || !category.slug) return null;

  const pageUrl = absoluteUrl(productPath(product.slug));

  return {
    '@context': 'https://schema.org',
    '@graph': [
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
        { name: 'Home', path: '/' },
        { name: category.name, path: productPath(category.slug) },
        { name: product.model ?? product.name, path: productPath(product.slug) },
      ]),
    ],
  };
}

export default function CatalogRoute({ params }: CatalogRouteProps) {
  const seo = getCategorySeoPage(params.slug);
  const category = getCategoryBySlug(params.slug);

  if (seo && category) {
    const products = seo.productIds
      .map((id) => getProductById(id))
      .filter((entry): entry is CatalogProduct => Boolean(entry?.product.slug));
    const faqs = getFaqItemsByQuestions(seo.faqQuestions);
    const structuredData = categoryStructuredData(params.slug);

    return (
      <div className="min-h-screen bg-white">
        {structuredData && <JsonLd data={structuredData} />}
        <Navbar languageHref={alternateLanguages(productPath(params.slug))?.fr} />
        <CategoryAuthorityPage seo={seo} products={products} faqs={faqs} />
        <Footer />
        <SocialSidebar />
      </div>
    );
  }

  const entry = getProductBySlug(params.slug);
  if (!entry) notFound();

  const structuredData = productStructuredData(entry);

  return (
    <div className="min-h-screen bg-white">
      {structuredData && <JsonLd data={structuredData} />}
      <Navbar languageHref={alternateLanguages(productPath(params.slug))?.fr} />
      <ProductDetailPage entry={entry} relatedProducts={getRelatedProducts(entry)} />
      <Footer />
      <SocialSidebar />
    </div>
  );
}
