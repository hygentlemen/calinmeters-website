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
  vendingStatus: 'existing',
  targetPeriod: 'T4 2026',
  notes: '<script>alert(1)</script>',
  sourcePage: '/fr/produits/compteur-electricite-prepaye-sts/',
  language: 'fr',
  turnstileToken: 'token',
  website: '',
};

const env = {
  RESEND_API_KEY: 're_test',
  RESEND_FROM: 'CalinMeters Website <website@calinmeters.com>',
  INQUIRY_RECIPIENT: 'scott@szcalinmeter.com',
} satisfies Pick<Env, 'RESEND_API_KEY' | 'RESEND_FROM' | 'INQUIRY_RECIPIENT'>;

describe('renderInquiryEmail', () => {
  it('escapes HTML and omits the Turnstile token', () => {
    const output = renderInquiryEmail(inquiry);
    expect(output.html).toContain('&lt;Example &amp; Co&gt;');
    expect(output.html).not.toContain('<script>');
    expect(output.text).not.toContain('turnstileToken');
  });
});

describe('sendInquiryEmail', () => {
  it('sends through Resend with the visitor as reply-to', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'email_123' }), { status: 200 }),
    );
    await expect(sendInquiryEmail(
      { ...inquiry, company: 'Example\nBcc: attacker@example.com' },
      env,
      fetchImpl,
    )).resolves.toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          authorization: 'Bearer re_test',
          'user-agent': 'calinmeters-inquiry-worker/1.0',
        }),
      }),
    );
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(body.reply_to).toBe('jean@example.com');
    expect(body.subject).not.toContain('\n');
  });

  it('returns a stable failure without upstream details', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response('provider detail', { status: 503 }),
    );
    await expect(sendInquiryEmail(inquiry, env, fetchImpl)).resolves.toEqual({
      ok: false,
      code: 'delivery_failed',
    });
  });
});
