import { Resend } from 'resend';
import { describe, expect, it, vi } from 'vitest';
import { renderInquiryEmail, sendInquiryEmail } from '../src/email';
import type { InquiryPayload } from '../src/types';

const inquiry: InquiryPayload = {
  country: 'Cameroun',
  company: '<Example & Co>',
  contactName: 'Jean Test',
  jobRole: 'Intégrateur',
  email: 'jean@example.com',
  whatsapp: '+237600000000',
  buyerType: 'integrator',
  productCategory: 'electricity',
  productId: 'ca168-gprs',
  application: 'Résidentiel',
  estimatedQuantity: '500',
  technicalRequirements: '230 V & CIU',
  message: '230 V & CIU',
  vendingStatus: 'existing',
  targetPeriod: 'T4 2026',
  notes: '<script>alert(1)</script>',
  sourcePage: 'https://calinmeters.com/fr/produits/compteur-electricite-prepaye-sts/',
  productName: 'CA168 Smart STS Prepaid Energy Meter',
  productUrl: 'https://calinmeters.com/fr/produits/ca168-compteur-electricite-prepaye-sts-gprs/',
  phone: '',
  quantity: '',
  subject: '',
  language: 'fr',
  turnstileToken: 'token',
  website: '',
  submittedAt: '2026-08-10T10:30:00.000Z',
};

const env = {
  RESEND_API_KEY: 're_test',
  RESEND_FROM: 'Calin Meter Website <info@calinmeters.com>',
  INQUIRY_RECIPIENT: 'tom.qi@qq.com',
} satisfies Pick<Env, 'RESEND_API_KEY' | 'RESEND_FROM' | 'INQUIRY_RECIPIENT'>;

describe('renderInquiryEmail', () => {
  it('escapes HTML and omits the Turnstile token', () => {
    const output = renderInquiryEmail(inquiry);
    expect(output.html).toContain('&lt;Example &amp; Co&gt;');
    expect(output.html).not.toContain('<script>');
    expect(output.text).not.toContain('turnstileToken');
    expect(output.text).toContain('Source Page: https://calinmeters.com/fr/produits/compteur-electricite-prepaye-sts/');
    expect(output.text).toContain('Submitted At: 2026-08-10T10:30:00.000Z');
  });
});

describe('sendInquiryEmail', () => {
  it('sends through Resend with the visitor as reply-to', async () => {
    const resend = new Resend('re_test');
    const send = vi.spyOn(resend.emails, 'send').mockResolvedValue({
      data: { id: 'email_123' },
      error: null,
      headers: null,
    });
    await expect(sendInquiryEmail(
      { ...inquiry, company: 'Example\nBcc: attacker@example.com' },
      env,
      resend,
    )).resolves.toEqual({ ok: true });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      from: 'Calin Meter Website <info@calinmeters.com>',
      to: ['tom.qi@qq.com'],
      replyTo: 'jean@example.com',
      subject: 'New Website Inquiry | Example Bcc: attacker@example.com | Cameroun',
    }));
    expect(send.mock.calls[0][0].subject).not.toContain('\n');
  });

  it('returns a stable failure without upstream details', async () => {
    const resend = new Resend('re_test');
    vi.spyOn(resend.emails, 'send').mockResolvedValue({
      data: null,
      error: {
        message: 'provider detail',
        name: 'internal_server_error',
        statusCode: 503,
      },
      headers: null,
    });
    await expect(sendInquiryEmail(inquiry, env, resend)).resolves.toEqual({
      ok: false,
      code: 'delivery_failed',
    });
  });
});
