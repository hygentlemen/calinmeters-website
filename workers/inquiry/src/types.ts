export const BUYER_TYPES = [
  'distributor',
  'integrator',
  'engineering_company',
  'utility',
  'property_operator',
  'industrial',
  'other',
] as const;

export const PRODUCT_CATEGORIES = ['electricity', 'water'] as const;

export const PRODUCT_IDS = [
  'ca168-lorawan',
  'ca168-gprs',
  'ca168-sts',
  'ca368-gprs',
  'ca368-sts',
  'water-multi-jet-plastic',
  'water-multi-jet-brass',
  'water-ultrasonic',
  'ct-meter',
  'ca768-lorawan',
] as const;

export const VENDING_STATUSES = ['existing', 'needed', 'unknown'] as const;

export type BuyerType = (typeof BUYER_TYPES)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductId = (typeof PRODUCT_IDS)[number];
export type VendingStatus = (typeof VENDING_STATUSES)[number];

export interface InquiryPayload {
  country: string;
  company: string;
  contactName: string;
  jobRole: string;
  email: string;
  phone: string;
  whatsapp: string;
  buyerType: BuyerType | '';
  productCategory: ProductCategory | '';
  productId: ProductId | '';
  productName: string;
  productUrl: string;
  subject: string;
  message: string;
  application: string;
  estimatedQuantity: string;
  quantity: string;
  technicalRequirements: string;
  vendingStatus: VendingStatus | '';
  targetPeriod: string;
  notes: string;
  sourcePage: string;
  submittedAt: string;
  language: 'en' | 'fr';
  turnstileToken: string;
  website: string;
}

export type ValidatedInquiryPayload = Omit<InquiryPayload, 'submittedAt'>;

export type ValidationResult =
  | { ok: true; value: ValidatedInquiryPayload }
  | { ok: false; code: 'invalid_payload'; fields: string[] };
