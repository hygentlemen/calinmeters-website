import {
  productCategories,
  type ProductCategory,
  type ProductVariant,
} from '@/data/products';

export interface CatalogProduct {
  product: ProductVariant;
  category: ProductCategory;
  subCategoryName?: string;
}

export const targetProductCategories = productCategories.filter(
  (category): category is ProductCategory & { slug: string } => Boolean(category.slug),
);

export const catalogProducts: CatalogProduct[] = targetProductCategories.flatMap((category) => {
  if (category.subCategories) {
    return category.subCategories.flatMap((subCategory) =>
      subCategory.variants.map((product) => ({
        product,
        category,
        subCategoryName: subCategory.name,
      })),
    );
  }

  return (category.variants ?? []).map((product) => ({ product, category }));
});

export function getCategoryBySlug(slug: string) {
  return targetProductCategories.find((category) => category.slug === slug);
}

export function getCategoryProducts(category: ProductCategory) {
  return catalogProducts.filter((entry) => entry.category.name === category.name);
}

export function getProductBySlug(slug: string) {
  return catalogProducts.find((entry) => entry.product.slug === slug);
}

export function getProductById(id: string) {
  return catalogProducts.find((entry) => entry.product.id === id);
}

export function getRelatedProducts(entry: CatalogProduct, limit = 3) {
  return catalogProducts
    .filter(
      (candidate) =>
        candidate.category.name === entry.category.name &&
        candidate.product.id !== entry.product.id,
    )
    .slice(0, limit);
}

export function getAllCatalogSlugs() {
  return [
    ...targetProductCategories.map((category) => category.slug),
    ...catalogProducts.flatMap((entry) => (entry.product.slug ? [entry.product.slug] : [])),
  ];
}
