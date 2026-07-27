import type { CategorySeoPage } from '@/data/seoPages';

export interface CommonMessages {
  nav: {
    products: string;
    solutions: string;
    about: string;
    faq: string;
    contact: string;
  };
  actions: {
    requestQuote: string;
    compareModels: string;
    downloadPdf: string;
    pdfEnglish: string;
    backToCategory: string;
    switchLanguage: string;
    emailUs: string;
    whatsappUs: string;
  };
  catalog: {
    verifiedSpecifications: string;
    highlights: string;
    applications: string;
    confirmBeforeQuote: string;
    relatedModels: string;
    model: string;
    home: string;
    products: string;
    quotationChecklist: string;
  };
  footer: {
    summary: string;
    products: string;
    contact: string;
    rights: string;
  };
}

export interface CheckedSpecTranslation {
  sourceLabel: string;
  sourceValue: string;
  label: string;
  value: string;
}

export interface FrenchProductTranslation {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryName: string;
  subCategoryName: string;
  highlights: string[];
  verifiedSpecs: CheckedSpecTranslation[];
  applications: string[];
  confirmBeforeQuote: string[];
}

export interface FrenchCategorySeoPage extends Omit<CategorySeoPage, 'productIds'> {
  productIds: string[];
}
