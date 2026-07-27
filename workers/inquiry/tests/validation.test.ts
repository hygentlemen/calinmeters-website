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
  vendingStatus: 'existing',
  targetPeriod: 'T4 2026',
  notes: 'Projet pilote avant déploiement.',
  sourcePage: '/fr/produits/compteur-electricite-prepaye-sts/',
  language: 'fr',
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

  it('rejects an invalid email', () => {
    const result = validateInquiry({ ...valid, email: 'invalid' });
    expect(result).toEqual({
      ok: false,
      code: 'invalid_payload',
      fields: ['email'],
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
