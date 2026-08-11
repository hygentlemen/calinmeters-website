import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHandler } from '../src/index';

const valid = {
  country: 'Togo',
  company: 'Example SARL',
  contactName: 'Jean Test',
  jobRole: 'Distributeur',
  email: 'jean@example.com',
  whatsapp: '+22890000000',
  buyerType: 'distributor',
  productCategory: 'water',
  productId: 'water-multi-jet-plastic',
  application: 'Comptage communautaire',
  estimatedQuantity: '300',
  technicalRequirements: 'DN20, vanne, CIU',
  message: 'DN20, vanne, CIU',
  vendingStatus: 'needed',
  targetPeriod: 'T4 2026',
  notes: '',
  sourcePage: '/fr/produits/compteur-eau-prepaye-sts/',
  language: 'fr',
  turnstileToken: 'token',
  website: '',
};

function env(rateAllowed = true): Env {
  return {
    ALLOWED_ORIGINS: 'https://calinmeters.com,https://www.calinmeters.com',
    INQUIRY_RECIPIENT: 'tom.qi@qq.com',
    RESEND_FROM: 'Calin Meter Website <info@calinmeters.com>',
    LOCAL_TURNSTILE_TEST_MODE: 'false',
    TURNSTILE_EXPECTED_ACTION: 'fr_inquiry,en_inquiry',
    TURNSTILE_EXPECTED_HOSTNAME: 'calinmeters.com,www.calinmeters.com',
    TURNSTILE_SECRET_KEY: 'turnstile-test-secret',
    RESEND_API_KEY: 'resend-test-secret',
    RATE_LIMIT_KEY_SECRET: 'rate-key-test-secret',
    INQUIRY_RATE_LIMITER: {
      limit: vi.fn().mockResolvedValue({ success: rateAllowed }),
    },
  };
}

const deps = {
  verifyTurnstile: vi.fn().mockResolvedValue({ ok: true }),
  sendInquiryEmail: vi.fn().mockResolvedValue({ ok: true }),
};

function request(body: unknown = valid, origin = 'https://calinmeters.com') {
  return new Request('https://worker.example/v1/inquiries', {
    method: 'POST',
    headers: {
      origin,
      'content-type': 'application/json',
      'cf-connecting-ip': '203.0.113.10',
      'user-agent': 'test-browser',
    },
    body: JSON.stringify(body),
  });
}

describe('inquiry handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts a valid request', async () => {
    const response = await createHandler(deps)(request(), env());
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(deps.sendInquiryEmail).toHaveBeenCalledWith(expect.objectContaining({
      sourcePage: 'https://calinmeters.com/fr/produits/compteur-eau-prepaye-sts/',
      submittedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      turnstileToken: '',
    }), expect.anything());
  });

  it('accepts an English contact inquiry', async () => {
    const response = await createHandler(deps)(request({
      contactName: 'John Smith',
      email: 'john@example.com',
      message: 'Please send a quotation.',
      sourcePage: 'https://calinmeters.com/products/ca168-sts-prepaid-electricity-meter/',
      language: 'en',
      turnstileToken: 'token',
      website: '',
    }), env());
    expect(response.status).toBe(200);
    expect(deps.sendInquiryEmail).toHaveBeenCalledWith(expect.objectContaining({
      language: 'en',
      contactName: 'John Smith',
    }), expect.anything());
  });

  it('rejects an unapproved origin', async () => {
    const response = await createHandler(deps)(
      request(valid, 'https://example.com'),
      env(),
    );
    expect(response.status).toBe(403);
  });

  it('returns an empty successful CORS preflight', async () => {
    const response = await createHandler(deps)(
      new Request('https://worker.example/v1/inquiries', {
        method: 'OPTIONS',
        headers: { origin: 'https://calinmeters.com' },
      }),
      env(),
    );
    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');
    expect(response.headers.get('access-control-allow-origin'))
      .toBe('https://calinmeters.com');
  });

  it('silently rejects the honeypot', async () => {
    const response = await createHandler(deps)(
      request({ ...valid, website: 'spam' }),
      env(),
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(deps.sendInquiryEmail).not.toHaveBeenCalled();
  });

  it('returns 429 when rate limited', async () => {
    const response = await createHandler(deps)(request(), env(false));
    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      code: 'rate_limited',
    });
  });

  it('rejects a JSON-like but unsupported media type', async () => {
    const unsupported = request();
    unsupported.headers.set('content-type', 'application/jsonp');
    const response = await createHandler(deps)(unsupported, env());
    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      code: 'invalid_content_type',
    });
  });

  it('returns safe validation fields for an invalid payload', async () => {
    const response = await createHandler(deps)(
      request({ ...valid, email: 'invalid' }),
      env(),
    );
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      code: 'invalid_payload',
      fields: ['email'],
    });
  });

  it('returns a stable challenge error', async () => {
    deps.verifyTurnstile.mockResolvedValueOnce({
      ok: false,
      code: 'turnstile_failed',
    });
    const response = await createHandler(deps)(request(), env());
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      code: 'turnstile_failed',
    });
  });

  it('returns a stable delivery error', async () => {
    deps.sendInquiryEmail.mockResolvedValueOnce({
      ok: false,
      code: 'delivery_failed',
    });
    const response = await createHandler(deps)(request(), env());
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      code: 'delivery_failed',
    });
  });

  it('catches an unexpected dependency failure', async () => {
    deps.verifyTurnstile.mockRejectedValueOnce(new Error('upstream detail'));
    const response = await createHandler(deps)(request(), env());
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      code: 'server_error',
    });
  });

  it('stops reading a body that exceeds 32 KiB without relying on content-length', async () => {
    const response = await createHandler(deps)(
      request({ ...valid, notes: 'x'.repeat(40 * 1024) }),
      env(),
    );
    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      code: 'payload_too_large',
    });
  });
});
