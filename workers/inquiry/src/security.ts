type TurnstileResult =
  | { ok: true }
  | { ok: false; code: 'turnstile_failed' | 'turnstile_unavailable' };

type TurnstileEnv = {
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_EXPECTED_ACTION: string;
  TURNSTILE_EXPECTED_HOSTNAME: string;
  LOCAL_TURNSTILE_TEST_MODE: string;
};

function configuredValues(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function isTurnstileResponse(value: unknown): value is {
  success: boolean;
  hostname?: string;
  action?: string;
} {
  return typeof value === 'object'
    && value !== null
    && 'success' in value
    && typeof value.success === 'boolean'
    && (!('hostname' in value) || typeof value.hostname === 'string')
    && (!('action' in value) || typeof value.action === 'string');
}

export async function verifyTurnstile(
  token: string,
  remoteIp: string,
  env: TurnstileEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<TurnstileResult> {
  if (!token || token.length > 2048) return { ok: false, code: 'turnstile_failed' };

  try {
    const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      signal: AbortSignal.timeout(8_000),
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: remoteIp || undefined,
        idempotency_key: crypto.randomUUID(),
      }),
    });
    if (!response.ok) return { ok: false, code: 'turnstile_unavailable' };

    const result: unknown = await response.json();
    if (!isTurnstileResponse(result)) {
      return { ok: false, code: 'turnstile_unavailable' };
    }

    const localTestMode = env.LOCAL_TURNSTILE_TEST_MODE === 'true';
    if (localTestMode) {
      return result.success
        ? { ok: true }
        : { ok: false, code: 'turnstile_failed' };
    }

    return result.success
      && configuredValues(env.TURNSTILE_EXPECTED_HOSTNAME).includes(result.hostname ?? '')
      && configuredValues(env.TURNSTILE_EXPECTED_ACTION).includes(result.action ?? '')
      ? { ok: true }
      : { ok: false, code: 'turnstile_failed' };
  } catch {
    return { ok: false, code: 'turnstile_unavailable' };
  }
}

export async function rateLimitKey(request: Request, secret: string) {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(ip),
  );
  const hex = [...new Uint8Array(signature)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
  return `inquiry:${hex}`;
}
