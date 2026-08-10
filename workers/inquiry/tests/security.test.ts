import { describe, expect, it, vi } from 'vitest';
import { rateLimitKey, verifyTurnstile } from '../src/security';

const env = {
  TURNSTILE_SECRET_KEY: 'secret',
  TURNSTILE_EXPECTED_ACTION: 'fr_inquiry,en_inquiry',
  TURNSTILE_EXPECTED_HOSTNAME: 'calinmeters.com,www.calinmeters.com',
  LOCAL_TURNSTILE_TEST_MODE: 'false',
};

describe('verifyTurnstile', () => {
  it('accepts a matching successful response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      hostname: 'calinmeters.com',
      action: 'fr_inquiry',
      'error-codes': [],
    }), { status: 200 }));
    await expect(verifyTurnstile('token', '203.0.113.10', env, fetchImpl))
      .resolves.toEqual({ ok: true });
  });

  it('accepts each configured action and hostname', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      hostname: 'www.calinmeters.com',
      action: 'en_inquiry',
      'error-codes': [],
    }), { status: 200 }));
    await expect(verifyTurnstile('token', '203.0.113.10', env, fetchImpl))
      .resolves.toEqual({ ok: true });
  });

  it('rejects a hostname mismatch', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      hostname: 'example.com',
      action: 'fr_inquiry',
    }), { status: 200 }));
    await expect(verifyTurnstile('token', '203.0.113.10', env, fetchImpl))
      .resolves.toEqual({
        ok: false,
        code: 'turnstile_failed',
      });
  });

  it('treats a malformed provider response as unavailable', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: 'yes' }), { status: 200 }),
    );
    await expect(verifyTurnstile('token', '203.0.113.10', env, fetchImpl))
      .resolves.toEqual({
        ok: false,
        code: 'turnstile_unavailable',
      });
  });

  it('accepts an official dummy-key success response only in explicit local test mode', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      hostname: 'localhost',
      action: 'test',
      'error-codes': [],
    }), { status: 200 }));
    await expect(verifyTurnstile('token', '', {
      ...env,
      LOCAL_TURNSTILE_TEST_MODE: 'true',
    }, fetchImpl)).resolves.toEqual({ ok: true });
  });

  it('still rejects an official dummy-key failure response in local test mode', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      'error-codes': ['invalid-input-response'],
    }), { status: 200 }));
    await expect(verifyTurnstile('token', '', {
      ...env,
      LOCAL_TURNSTILE_TEST_MODE: 'true',
    }, fetchImpl)).resolves.toEqual({
      ok: false,
      code: 'turnstile_failed',
    });
  });
});

describe('rateLimitKey', () => {
  it('does not expose the raw IP address', async () => {
    const request = new Request('https://worker.example/v1/inquiries', {
      headers: {
        'cf-connecting-ip': '203.0.113.10',
        'user-agent': 'test-browser',
      },
    });
    const key = await rateLimitKey(request, 'rate-key-secret');
    expect(key).toMatch(/^inquiry:[a-f0-9]{64}$/);
    expect(key).not.toContain('203.0.113.10');
  });

  it('uses the same rate bucket when a client rotates its user agent', async () => {
    const first = new Request('https://worker.example/v1/inquiries', {
      headers: {
        'cf-connecting-ip': '203.0.113.10',
        'user-agent': 'first-browser',
      },
    });
    const second = new Request('https://worker.example/v1/inquiries', {
      headers: {
        'cf-connecting-ip': '203.0.113.10',
        'user-agent': 'rotated-browser',
      },
    });
    await expect(rateLimitKey(first, 'rate-key-secret'))
      .resolves.toBe(await rateLimitKey(second, 'rate-key-secret'));
  });
});
