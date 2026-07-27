import { frenchProducts } from '@/data/locales/fr/products';
import { getProductById, type CatalogProduct } from '@/lib/catalog';

export interface FrenchCatalogProduct extends CatalogProduct {
  sourceSlug?: string;
}

function assertSourceSpec(
  productId: string,
  sourceLabel: string,
  sourceValue: string,
  source: CatalogProduct,
) {
  const matched = source.product.verifiedSpecs?.some(
    (spec) => spec.label === sourceLabel && spec.value === sourceValue,
  );

  if (!matched) {
    throw new Error(
      `French translation for ${productId} is stale: ${sourceLabel} = ${sourceValue}`,
    );
  }
}

function localizeFrenchProduct(
  translation: (typeof frenchProducts)[number],
): FrenchCatalogProduct {
  const source = getProductById(translation.id);
  if (!source) {
    throw new Error(`Missing source product ${translation.id}`);
  }

  for (const spec of translation.verifiedSpecs) {
    assertSourceSpec(translation.id, spec.sourceLabel, spec.sourceValue, source);
  }

  return {
    ...source,
    sourceSlug: source.product.slug,
    product: {
      ...source.product,
      slug: translation.slug,
      name: translation.name,
      description: translation.description,
      highlights: translation.highlights,
      verifiedSpecs: translation.verifiedSpecs.map(({ label, value }) => ({ label, value })),
      applications: translation.applications,
      confirmBeforeQuote: translation.confirmBeforeQuote,
      specs: source.product.specs.map((spec) => ({
        ...spec,
        label: 'Fiche technique en anglais (PDF)',
      })),
    },
    category: {
      ...source.category,
      name: translation.categoryName,
    },
    subCategoryName: translation.subCategoryName,
  };
}

export const frenchCatalogProducts = frenchProducts.map(localizeFrenchProduct);

export function getFrenchProductBySlug(slug: string) {
  return frenchCatalogProducts.find((entry) => entry.product.slug === slug);
}

export function getFrenchProductById(id: string) {
  return frenchCatalogProducts.find((entry) => entry.product.id === id);
}

export function getAllFrenchProductSlugs() {
  return frenchCatalogProducts.flatMap((entry) =>
    entry.product.slug ? [entry.product.slug] : [],
  );
}

export function getFrenchRelatedProducts(entry: FrenchCatalogProduct, limit = 3) {
  return frenchCatalogProducts
    .filter(
      (candidate) =>
        candidate.category.name === entry.category.name &&
        candidate.product.id !== entry.product.id,
    )
    .slice(0, limit);
}
