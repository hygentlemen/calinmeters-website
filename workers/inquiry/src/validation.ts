import {
  BUYER_TYPES,
  PRODUCT_CATEGORIES,
  PRODUCT_IDS,
  VENDING_STATUSES,
  type InquiryPayload,
  type ValidationResult,
} from './types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCE_PAGE = /^\/fr\/(?:$|produits\/[a-z0-9-]+\/$)/;
const WATER_PRODUCT_IDS = new Set([
  'water-multi-jet-plastic',
  'water-multi-jet-brass',
  'water-ultrasonic',
]);

function text(value: unknown, max: number) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace(/\r\n?/g, '\n');
  return normalized.length > 0 && normalized.length <= max ? normalized : null;
}

export function validateInquiry(value: unknown): ValidationResult {
  const input = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : {};
  const fields: string[] = [];

  const country = text(input.country, 80);
  const company = text(input.company, 160);
  const contactName = text(input.contactName, 120);
  const jobRole = text(input.jobRole, 120);
  const email = text(input.email, 254)?.toLowerCase() ?? null;
  const whatsapp = text(input.whatsapp, 40);
  const application = text(input.application, 1000);
  const estimatedQuantity = text(input.estimatedQuantity, 80);
  const technicalRequirements = text(input.technicalRequirements, 2000);
  const targetPeriod = text(input.targetPeriod, 120);
  const notes = input.notes === undefined || input.notes === null
    ? ''
    : typeof input.notes === 'string' && input.notes.trim().length <= 4000
      ? input.notes.trim().replace(/\r\n?/g, '\n')
      : null;
  const sourcePage = text(input.sourcePage, 240);
  const turnstileToken = text(input.turnstileToken, 2048);
  const website = typeof input.website === 'string' ? input.website.trim() : '';
  const productId = typeof input.productId === 'string' ? input.productId.trim() : '';

  const required: Array<[string, unknown]> = [
    ['country', country],
    ['company', company],
    ['contactName', contactName],
    ['jobRole', jobRole],
    ['email', email && EMAIL.test(email) ? email : null],
    ['whatsapp', whatsapp],
    ['application', application],
    ['estimatedQuantity', estimatedQuantity],
    ['technicalRequirements', technicalRequirements],
    ['targetPeriod', targetPeriod],
    ['notes', notes],
    ['sourcePage', sourcePage && SOURCE_PAGE.test(sourcePage) ? sourcePage : null],
    ['turnstileToken', turnstileToken],
  ];

  for (const [name, parsed] of required) {
    if (parsed === null) fields.push(name);
  }

  if (!BUYER_TYPES.includes(input.buyerType as never)) fields.push('buyerType');
  if (!PRODUCT_CATEGORIES.includes(input.productCategory as never)) fields.push('productCategory');
  if (productId && !PRODUCT_IDS.includes(productId as never)) {
    fields.push('productId');
  } else if (productId && PRODUCT_CATEGORIES.includes(input.productCategory as never)) {
    const productIsWater = WATER_PRODUCT_IDS.has(productId);
    if (
      (input.productCategory === 'water' && !productIsWater)
      || (input.productCategory === 'electricity' && productIsWater)
    ) {
      fields.push('productId');
    }
  }
  if (!VENDING_STATUSES.includes(input.vendingStatus as never)) fields.push('vendingStatus');
  if (input.language !== 'fr') fields.push('language');

  if (fields.length > 0) {
    return { ok: false, code: 'invalid_payload', fields: [...new Set(fields)] };
  }

  return {
    ok: true,
    value: {
      country: country!,
      company: company!,
      contactName: contactName!,
      jobRole: jobRole!,
      email: email!,
      whatsapp: whatsapp!,
      buyerType: input.buyerType as InquiryPayload['buyerType'],
      productCategory: input.productCategory as InquiryPayload['productCategory'],
      productId: productId as InquiryPayload['productId'],
      application: application!,
      estimatedQuantity: estimatedQuantity!,
      technicalRequirements: technicalRequirements!,
      vendingStatus: input.vendingStatus as InquiryPayload['vendingStatus'],
      targetPeriod: targetPeriod!,
      notes: notes!,
      sourcePage: sourcePage!,
      language: 'fr',
      turnstileToken: turnstileToken!,
      website,
    },
  };
}
