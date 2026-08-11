import { sendInquiryEmail } from './email';
import { rateLimitKey, verifyTurnstile } from './security';
import type { InquiryPayload } from './types';
import { validateInquiry } from './validation';

const MAX_BODY_BYTES = 32 * 1024;

type Dependencies = {
  verifyTurnstile: typeof verifyTurnstile;
  sendInquiryEmail: typeof sendInquiryEmail;
};

function allowedOrigin(request: Request, env: Env) {
  const origin = request.headers.get('origin') ?? '';
  const configuredOrigins = typeof env.ALLOWED_ORIGINS === 'string'
    ? env.ALLOWED_ORIGINS
    : '';
  const allowed = configuredOrigins.split(',').map((value) => value.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : null;
}

function json(origin: string | null, status: number, body: unknown) {
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
  });

  if (origin) {
    headers.set('access-control-allow-origin', origin);
    headers.set('access-control-allow-methods', 'POST, OPTIONS');
    headers.set('access-control-allow-headers', 'content-type');
    headers.set('access-control-max-age', '86400');
    headers.set('vary', 'Origin');
  }

  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers });
}

async function readBoundedBody(
  request: Request,
  maximumBytes: number,
): Promise<{ ok: true; text: string } | { ok: false }> {
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    return { ok: false };
  }

  const reader = request.body?.getReader();
  if (!reader) return { ok: true, text: '' };

  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maximumBytes) {
      await reader.cancel();
      return { ok: false };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, text: new TextDecoder().decode(bytes) };
}

export function createHandler(deps: Dependencies) {
  return async function handle(request: Request, env: Env) {
    let origin: string | null = null;
    let requestPath = '';

    try {
      const url = new URL(request.url);
      requestPath = url.pathname;
      origin = allowedOrigin(request, env);

      if (requestPath !== '/v1/inquiries') {
        return json(origin, 404, { ok: false, code: 'not_found' });
      }
      if (!origin) return json(null, 403, { ok: false, code: 'origin_denied' });
      if (request.method === 'OPTIONS') return json(origin, 204, null);
      if (request.method !== 'POST') {
        return json(origin, 405, { ok: false, code: 'method_not_allowed' });
      }

      const contentType = request.headers.get('content-type') ?? '';
      const mediaType = contentType.split(';', 1)[0].trim().toLowerCase();
      if (mediaType !== 'application/json') {
        return json(origin, 415, { ok: false, code: 'invalid_content_type' });
      }

      const body = await readBoundedBody(request, MAX_BODY_BYTES);
      if (!body.ok) {
        return json(origin, 413, { ok: false, code: 'payload_too_large' });
      }

      let value: unknown;
      try {
        value = JSON.parse(body.text);
      } catch {
        return json(origin, 400, { ok: false, code: 'invalid_json' });
      }

      if (
        value
        && typeof value === 'object'
        && String((value as { website?: unknown }).website ?? '').trim()
      ) {
        return json(origin, 200, { ok: true });
      }

      const key = await rateLimitKey(request, env.RATE_LIMIT_KEY_SECRET);
      const rate = await env.INQUIRY_RATE_LIMITER.limit({ key });
      if (!rate.success) {
        return json(origin, 429, { ok: false, code: 'rate_limited' });
      }

      const validation = validateInquiry(value);
      if (!validation.ok) return json(origin, 400, validation);

      const remoteIp = request.headers.get('cf-connecting-ip') ?? '';
      const challenge = await deps.verifyTurnstile(
        validation.value.turnstileToken,
        remoteIp,
        env,
      );
      if (!challenge.ok) {
        return json(origin, challenge.code === 'turnstile_unavailable' ? 503 : 400, {
          ok: false,
          code: challenge.code,
        });
      }

      const deliveryPayload: InquiryPayload = {
        ...validation.value,
        submittedAt: new Date().toISOString(),
        turnstileToken: '',
      };
      const delivery = await deps.sendInquiryEmail(deliveryPayload, env);
      if (!delivery.ok) {
        return json(origin, 503, { ok: false, code: delivery.code });
      }

      return json(origin, 200, { ok: true });
    } catch {
      console.error(JSON.stringify({
        event: 'inquiry_worker_error',
        method: request.method,
        path: requestPath,
      }));
      return json(origin, 500, { ok: false, code: 'server_error' });
    }
  };
}

const handle = createHandler({ verifyTurnstile, sendInquiryEmail });

export default {
  fetch(request: Request, env: Env) {
    return handle(request, env);
  },
} satisfies ExportedHandler<Env>;
