import { describe, expect, it } from 'vitest';
import { validateInquiry } from '../src/validation';

const valid = {
  country: 'Cameroun',
  company: 'Example Metering SARL',
  contactName: 'Jean Test',
  jobRole: 'Intégrateur',
  email: 'jean@example.com',
  whatsapp: '+237600000000',
  buyerType: 'integrator',
  productCategory: 'electricity',
  productId: 'ca168-gprs',
  application: 'Branchements résidentiels monophasés',
  estimatedQuantity: '500',
  technicalRequirements: '230 V, 5(80) A, CIU et GPRS',
  message: '230 V, 5(80) A, CIU et GPRS',
  vendingStatus: 'existing',
  targetPeriod: 'T4 2026',
  notes: 'Projet pilote avant déploiement.',
  sourcePage: '/fr/produits/compteur-electricite-prepaye-sts/',
  language: 'fr',
  turnstileToken: 'token',
  website: '',
};

const validEnglish = {
  contactName: 'John Smith',
  email: 'JOHN@EXAMPLE.COM',
  message: 'Please quote 10,000 prepaid electricity meters.',
  company: 'ABC Energy',
  country: 'Kenya',
  phone: '+254700000000',
  productName: 'CA168 STS Prepaid Energy Meter',
  productUrl: 'https://calinmeters.com/products/ca168-sts-prepaid-electricity-meter/',
  quantity: '10,000 pcs',
  sourcePage: 'https://calinmeters.com/products/ca168-sts-prepaid-electricity-meter/',
  language: 'en',
  turnstileToken: 'token',
  website: '',
};

describe('validateInquiry', () => {
  it('normalizes a valid French inquiry', () => {
    const result = validateInquiry(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe('jean@example.com');
      expect(result.value.buyerType).toBe('integrator');
      expect(result.value.productCategory).toBe('electricity');
    }
  });

  it('normalizes a minimal English inquiry and optional sales fields', () => {
    const result = validateInquiry(validEnglish);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe('john@example.com');
      expect(result.value.company).toBe('ABC Energy');
      expect(result.value.quantity).toBe('10,000 pcs');
      expect(result.value.sourcePage).toBe(validEnglish.sourcePage);
    }
  });

  it('rejects an invalid email', () => {
    const result = validateInquiry({ ...valid, email: 'invalid' });
    expect(result).toEqual({
      ok: false,
      code: 'invalid_payload',
      fields: ['email'],
    });
  });

  it('requires name, email, and message for English inquiries', () => {
    const result = validateInquiry({
      ...validEnglish,
      contactName: '',
      email: '',
      message: '',
    });
    expect(result).toEqual({
      ok: false,
      code: 'invalid_payload',
      fields: ['contactName', 'email', 'message'],
    });
  });

  it('rejects an external source or product URL', () => {
    const result = validateInquiry({
      ...validEnglish,
      sourcePage: 'https://attacker.example/source',
      productUrl: 'https://attacker.example/product',
    });
    expect(result).toEqual({
      ok: false,
      code: 'invalid_payload',
      fields: ['sourcePage', 'productUrl'],
    });
  });

  it('rejects unsupported enum values', () => {
    const result = validateInquiry({
      ...valid,
      buyerType: 'consumer',
      productCategory: 'gas',
      productId: 'ca768-gas',
    });
    expect(result).toEqual({
      ok: false,
      code: 'invalid_payload',
      fields: ['buyerType', 'productCategory', 'productId'],
    });
  });

  it('rejects overlong free text', () => {
    const result = validateInquiry({ ...valid, notes: 'x'.repeat(4001) });
    expect(result).toEqual({
      ok: false,
      code: 'invalid_payload',
      fields: ['notes'],
    });
  });

  it('accepts the optional notes field when omitted', () => {
    const { notes: _notes, ...withoutNotes } = valid;
    const result = validateInquiry(withoutNotes);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.notes).toBe('');
  });

  it('rejects a model that does not belong to the selected category', () => {
    const result = validateInquiry({
      ...valid,
      productCategory: 'water',
      productId: 'ca168-gprs',
    });
    expect(result).toEqual({
      ok: false,
      code: 'invalid_payload',
      fields: ['productId'],
    });
  });
});
