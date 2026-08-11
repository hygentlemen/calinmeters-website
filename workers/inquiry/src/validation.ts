import {
  BUYER_TYPES,
  PRODUCT_CATEGORIES,
  PRODUCT_IDS,
  VENDING_STATUSES,
  type ValidatedInquiryPayload,
  type ValidationResult,
} from './types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE_ORIGIN = 'https://calinmeters.com';
const SITE_HOSTNAMES = new Set(['calinmeters.com', 'www.calinmeters.com']);
const WATER_PRODUCT_IDS = new Set([
  'water-multi-jet-plastic',
  'water-multi-jet-brass',
  'water-ultrasonic',
]);

function requiredText(value: unknown, max: number) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace(/\r\n?/g, '\n');
  return normalized.length > 0 && normalized.length <= max ? normalized : null;
}

function optionalText(value: unknown, max: number) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace(/\r\n?/g, '\n');
  return normalized.length <= max ? normalized : null;
}

function siteUrl(value: unknown, max: number, required: boolean) {
  const parsed = required ? requiredText(value, max) : optionalText(value, max);
  if (parsed === null || parsed === '') return parsed;
  if (parsed.startsWith('//')) return null;

  try {
    const url = new URL(parsed, SITE_ORIGIN);
    if (
      url.protocol !== 'https:'
      || !SITE_HOSTNAMES.has(url.hostname)
      || url.port
      || url.username
      || url.password
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function validateInquiry(value: unknown): ValidationResult {
  const input = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : {};
  const fields: string[] = [];

  const language = input.language === 'en' || input.language === 'fr'
    ? input.language
    : null;
  const isFrench = language === 'fr';
  const country = isFrench ? requiredText(input.country, 80) : optionalText(input.country, 80);
  const company = isFrench ? requiredText(input.company, 160) : optionalText(input.company, 160);
  const contactName = requiredText(input.contactName, 120);
  const jobRole = isFrench ? requiredText(input.jobRole, 120) : optionalText(input.jobRole, 120);
  const rawEmail = requiredText(input.email, 254);
  const email = rawEmail?.toLowerCase() ?? null;
  const phone = optionalText(input.phone, 40);
  const whatsapp = isFrench ? requiredText(input.whatsapp, 40) : optionalText(input.whatsapp, 40);
  const application = isFrench ? requiredText(input.application, 1000) : optionalText(input.application, 1000);
  const estimatedQuantity = isFrench
    ? requiredText(input.estimatedQuantity, 80)
    : optionalText(input.estimatedQuantity, 80);
  const quantity = optionalText(input.quantity, 80);
  const technicalRequirements = isFrench
    ? requiredText(input.technicalRequirements, 2000)
    : optionalText(input.technicalRequirements, 2000);
  const fallbackMessage = isFrench && input.message === undefined
    ? technicalRequirements
    : input.message;
  const message = requiredText(fallbackMessage, 4000);
  const targetPeriod = isFrench
    ? requiredText(input.targetPeriod, 120)
    : optionalText(input.targetPeriod, 120);
  const notes = optionalText(input.notes, 4000);
  const productName = optionalText(input.productName, 200);
  const productUrl = siteUrl(input.productUrl, 500, false);
  const subject = optionalText(input.subject, 200);
  const sourcePage = siteUrl(input.sourcePage, 500, true);
  const turnstileToken = requiredText(input.turnstileToken, 2048);
  const website = typeof input.website === 'string' ? input.website.trim() : '';
  const productId = typeof input.productId === 'string' ? input.productId.trim() : '';

  const commonFields: Array<[string, unknown]> = [
    ['contactName', contactName],
    ['email', email && EMAIL.test(email) ? email : null],
    ['message', message],
  ];

  for (const [name, parsed] of commonFields) {
    if (parsed === null) fields.push(name);
  }

  const additionalTextFields: Array<[string, unknown]> = [
    ['country', country],
    ['company', company],
    ['jobRole', jobRole],
    ['phone', phone],
    ['whatsapp', whatsapp],
    ['application', application],
    ['estimatedQuantity', estimatedQuantity],
    ['quantity', quantity],
    ['technicalRequirements', technicalRequirements],
    ['targetPeriod', targetPeriod],
    ['notes', notes],
    ['productName', productName],
    ['subject', subject],
  ];
  for (const [name, parsed] of additionalTextFields) {
    if (parsed === null) fields.push(name);
  }

  if (sourcePage === null) fields.push('sourcePage');
  if (productUrl === null) fields.push('productUrl');
  if (turnstileToken === null) fields.push('turnstileToken');

  const buyerType = typeof input.buyerType === 'string' ? input.buyerType : '';
  const productCategory = typeof input.productCategory === 'string'
    ? input.productCategory
    : '';
  const vendingStatus = typeof input.vendingStatus === 'string'
    ? input.vendingStatus
    : '';

  if (isFrench && !BUYER_TYPES.includes(buyerType as never)) fields.push('buyerType');
  if (isFrench && !PRODUCT_CATEGORIES.includes(productCategory as never)) {
    fields.push('productCategory');
  } else if (!isFrench && productCategory && !PRODUCT_CATEGORIES.includes(productCategory as never)) {
    fields.push('productCategory');
  }
  if (productId && !PRODUCT_IDS.includes(productId as never)) {
    fields.push('productId');
  } else if (productId && PRODUCT_CATEGORIES.includes(productCategory as never)) {
    const productIsWater = WATER_PRODUCT_IDS.has(productId);
    if (
      (productCategory === 'water' && !productIsWater)
      || (productCategory === 'electricity' && productIsWater)
    ) {
      fields.push('productId');
    }
  }
  if (isFrench && !VENDING_STATUSES.includes(vendingStatus as never)) {
    fields.push('vendingStatus');
  } else if (!isFrench && vendingStatus && !VENDING_STATUSES.includes(vendingStatus as never)) {
    fields.push('vendingStatus');
  }
  if (!language) fields.push('language');

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
      phone: phone!,
      whatsapp: whatsapp!,
      buyerType: buyerType as ValidatedInquiryPayload['buyerType'],
      productCategory: productCategory as ValidatedInquiryPayload['productCategory'],
      productId: productId as ValidatedInquiryPayload['productId'],
      productName: productName!,
      productUrl: productUrl!,
      subject: subject!,
      message: message!,
      application: application!,
      estimatedQuantity: estimatedQuantity!,
      quantity: quantity!,
      technicalRequirements: technicalRequirements!,
      vendingStatus: vendingStatus as ValidatedInquiryPayload['vendingStatus'],
      targetPeriod: targetPeriod!,
      notes: notes!,
      sourcePage: sourcePage!,
      language: language!,
      turnstileToken: turnstileToken!,
      website,
    },
  };
}
