# French Inquiry Worker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver French website inquiries from the static GitHub Pages site to `scott@szcalinmeter.com` through a validated, rate-limited Cloudflare Worker without storing inquiry data.

**Architecture:** A standalone Worker accepts JSON at `/v1/inquiries`, enforces an origin allowlist, payload limits, a honeypot, Cloudflare rate limiting, and mandatory Turnstile Siteverify validation, then sends a text-and-HTML email through Resend. The Worker has its own tests, lockfile, deployment workflow, and secrets; the website consumes only the public endpoint and Turnstile sitekey.

**Tech Stack:** Cloudflare Workers, Wrangler 4.114, TypeScript 5.9, Vitest 4.1 with the Cloudflare Workers test pool, Cloudflare Turnstile, Resend REST API, GitHub Actions.

## Global Constraints

- Keep the website deployed through GitHub Pages; this Worker is a separate form-delivery service.
- Do not store inquiry payloads in a database, KV, Durable Objects, analytics, or application logs.
- Send successful inquiries only to `scott@szcalinmeter.com`.
- Never commit `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `RATE_LIMIT_KEY_SECRET`, Cloudflare API credentials, or test-user inquiry data.
- Accept production browser requests only from `https://calinmeters.com`.
- Validate Turnstile on every accepted inquiry; a client-side widget alone is insufficient.
- Limit request bodies to 32 KiB and Turnstile tokens to 2,048 characters.
- Return stable French user-facing errors without exposing upstream API responses or secrets.
- Keep WhatsApp and direct email as website fallbacks when the Worker is unavailable.
- Use the Resend sender `CalinMeters Website <website@calinmeters.com>` only after `calinmeters.com` is verified in Resend.
- Use Cloudflare's production Turnstile widget restricted to `calinmeters.com`; use official dummy keys only in local and automated tests.
- Use Wrangler `4.114.0` for the implementation baseline; the Rate Limiting binding requires at least `4.36.0`.
- Generate and commit `worker-configuration.d.ts` with `wrangler types`; never hand-write the Worker `Env` binding interface.
- Run tests inside the Cloudflare Workers Vitest integration rather than Node's generic test environment.
- Keep the request body bounded while reading the stream; do not buffer an untrusted, unbounded body.
- Enable Workers observability, but never write inquiry fields, raw IP addresses, email-provider responses, or secret values to custom logs.

---

## File Structure

Create an isolated Worker package:

```text
workers/inquiry/
├── package.json
├── package-lock.json
├── tsconfig.json
├── vitest.config.ts
├── worker-configuration.d.ts
├── wrangler.jsonc
├── src/
│   ├── email.ts
│   ├── index.ts
│   ├── security.ts
│   ├── types.ts
│   └── validation.ts
└── tests/
    ├── email.test.ts
    ├── handler.test.ts
    ├── security.test.ts
    └── validation.test.ts
```

Modify:

```text
.gitignore
.github/workflows/deploy-inquiry-worker.yml
docs/ANALYTICS-AUTOMATION.md
docs/HANDOFF.md
```

The website-side `FrenchInquiryForm` and GitHub Pages environment variables are implemented by the companion plan `2026-07-26-french-site-localization.md`.

---

### Task 1: Scaffold the Worker and validate inquiry payloads

**Files:**

- Create: `workers/inquiry/package.json`
- Create: `workers/inquiry/tsconfig.json`
- Create: `workers/inquiry/vitest.config.ts`
- Create via Wrangler: `workers/inquiry/worker-configuration.d.ts`
- Create: `workers/inquiry/wrangler.jsonc`
- Create: `workers/inquiry/src/types.ts`
- Create: `workers/inquiry/src/validation.ts`
- Create: `workers/inquiry/tests/validation.test.ts`
- Modify: `.gitignore`

**Interfaces:**

- Produces: `InquiryPayload`, `Env`, `ValidationResult`, `validateInquiry(value: unknown): ValidationResult`.
- Later tasks consume the normalized `InquiryPayload` and Worker bindings from this task.

- [ ] **Step 1: Add isolated dependency and secret ignores**

Append:

```gitignore

# Cloudflare inquiry Worker
/workers/inquiry/node_modules/
/workers/inquiry/.wrangler/
/workers/inquiry/.dev.vars
/workers/inquiry/coverage/
```

- [ ] **Step 2: Add the Worker package and TypeScript configuration**

Create `workers/inquiry/package.json`:

```json
{
  "name": "calinmeters-inquiry-worker",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "check": "npm run typecheck && npm test && npm run deploy:dry",
    "cf-typegen": "wrangler types",
    "deploy:dry": "wrangler deploy --dry-run --outdir .wrangler/dry-run",
    "deploy": "wrangler deploy",
    "dev": "wrangler dev",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "wrangler types --check && tsc --noEmit"
  },
  "devDependencies": {
    "@cloudflare/vitest-pool-workers": "0.18.8",
    "typescript": "5.9.3",
    "vitest": "4.1.10",
    "wrangler": "4.114.0"
  }
}
```

Create `workers/inquiry/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["./worker-configuration.d.ts"]
  },
  "include": [
    "worker-configuration.d.ts",
    "src/**/*.ts",
    "tests/**/*.ts",
    "vitest.config.ts"
  ]
}
```

Create `workers/inquiry/vitest.config.ts`:

```ts
import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
    }),
  ],
});
```

Create `workers/inquiry/wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "calinmeters-inquiry",
  "main": "src/index.ts",
  "compatibility_date": "2026-07-27",
  "compatibility_flags": ["nodejs_compat"],
  "workers_dev": true,
  "preview_urls": true,
  "vars": {
    "ALLOWED_ORIGINS": "https://calinmeters.com",
    "INQUIRY_RECIPIENT": "scott@szcalinmeter.com",
    "RESEND_FROM": "CalinMeters Website <website@calinmeters.com>",
    "TURNSTILE_EXPECTED_ACTION": "fr_inquiry",
    "TURNSTILE_EXPECTED_HOSTNAME": "calinmeters.com"
  },
  "secrets": {
    "required": [
      "TURNSTILE_SECRET_KEY",
      "RESEND_API_KEY",
      "RATE_LIMIT_KEY_SECRET"
    ]
  },
  "ratelimits": [
    {
      "name": "INQUIRY_RATE_LIMITER",
      "namespace_id": "42601",
      "simple": {
        "limit": 10,
        "period": 60
      }
    }
  ],
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  }
}
```

- [ ] **Step 3: Write the failing validation tests**

Create `workers/inquiry/tests/validation.test.ts`:

```ts
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
  website: ''
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
      fields: ['email']
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
      fields: ['buyerType', 'productCategory', 'productId']
    });
  });

  it('rejects overlong free text', () => {
    const result = validateInquiry({ ...valid, notes: 'x'.repeat(4001) });
    expect(result).toEqual({
      ok: false,
      code: 'invalid_payload',
      fields: ['notes']
    });
  });
});
```

- [ ] **Step 4: Run the validation test and verify failure**

Run:

```bash
npm --prefix workers/inquiry install
npm --prefix workers/inquiry run cf-typegen
npm --prefix workers/inquiry test -- validation.test.ts
```

Expected: type generation creates `workers/inquiry/worker-configuration.d.ts`, then the test fails because `src/validation.ts` does not exist.

- [ ] **Step 5: Define the Worker contracts**

Create `workers/inquiry/src/types.ts`:

```ts
export const BUYER_TYPES = [
  'distributor',
  'integrator',
  'engineering_company',
  'utility',
  'property_operator',
  'industrial',
  'other',
] as const;

export const PRODUCT_CATEGORIES = ['electricity', 'water'] as const;
export const PRODUCT_IDS = [
  'ca168-lorawan',
  'ca168-gprs',
  'ca168-sts',
  'ca368-gprs',
  'ca368-sts',
  'water-multi-jet-plastic',
  'water-multi-jet-brass',
  'water-ultrasonic',
] as const;
export const VENDING_STATUSES = ['existing', 'needed', 'unknown'] as const;

export type BuyerType = (typeof BUYER_TYPES)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductId = (typeof PRODUCT_IDS)[number];
export type VendingStatus = (typeof VENDING_STATUSES)[number];

export interface InquiryPayload {
  country: string;
  company: string;
  contactName: string;
  jobRole: string;
  email: string;
  whatsapp: string;
  buyerType: BuyerType;
  productCategory: ProductCategory;
  productId: ProductId | '';
  application: string;
  estimatedQuantity: string;
  technicalRequirements: string;
  vendingStatus: VendingStatus;
  targetPeriod: string;
  notes: string;
  sourcePage: string;
  language: 'fr';
  turnstileToken: string;
  website: string;
}

export type ValidationResult =
  | { ok: true; value: InquiryPayload }
  | { ok: false; code: 'invalid_payload'; fields: string[] };
```

`Env`, `RateLimit`, `ExportedHandler`, and the runtime APIs come from the generated `worker-configuration.d.ts`. Do not duplicate any of those declarations in source.

- [ ] **Step 6: Implement strict payload validation**

Create `workers/inquiry/src/validation.ts`:

```ts
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
  const notes = typeof input.notes === 'string' && input.notes.trim().length <= 4000
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
  if (productId && !PRODUCT_IDS.includes(productId as never)) fields.push('productId');
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
```

- [ ] **Step 7: Run validation tests and type checking**

Run:

```bash
npm --prefix workers/inquiry run typecheck
npm --prefix workers/inquiry test -- validation.test.ts
```

Expected: type checking passes and four validation tests pass.

- [ ] **Step 8: Commit**

```bash
git add .gitignore workers/inquiry
git commit -m "feat: scaffold inquiry Worker validation"
```

---

### Task 2: Add Turnstile verification and privacy-safe rate keys

**Files:**

- Create: `workers/inquiry/src/security.ts`
- Create: `workers/inquiry/tests/security.test.ts`

**Interfaces:**

- Consumes: `Env` from Task 1.
- Produces: `verifyTurnstile(token, remoteIp, env, fetchImpl)` and `rateLimitKey(request, secret)`.

- [ ] **Step 1: Write failing security tests**

Create `workers/inquiry/tests/security.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { rateLimitKey, verifyTurnstile } from '../src/security';

const env = {
  TURNSTILE_SECRET_KEY: 'secret',
  TURNSTILE_EXPECTED_ACTION: 'fr_inquiry',
  TURNSTILE_EXPECTED_HOSTNAME: 'calinmeters.com',
} satisfies Pick<
  Env,
  'TURNSTILE_SECRET_KEY' | 'TURNSTILE_EXPECTED_ACTION' | 'TURNSTILE_EXPECTED_HOSTNAME'
>;

describe('verifyTurnstile', () => {
  it('accepts a matching successful response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      hostname: 'calinmeters.com',
      action: 'fr_inquiry',
      'error-codes': [],
    }), { status: 200 }));
    await expect(verifyTurnstile('token', '203.0.113.10', env, fetchImpl)).resolves.toEqual({ ok: true });
  });

  it('rejects a hostname mismatch', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      hostname: 'example.com',
      action: 'fr_inquiry',
    }), { status: 200 }));
    await expect(verifyTurnstile('token', '203.0.113.10', env, fetchImpl)).resolves.toEqual({
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
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run:

```bash
npm --prefix workers/inquiry test -- security.test.ts
```

Expected: FAIL because `src/security.ts` does not exist.

- [ ] **Step 3: Implement Turnstile Siteverify and hashed rate keys**

Create `workers/inquiry/src/security.ts`:

```ts
type TurnstileResult =
  | { ok: true }
  | { ok: false; code: 'turnstile_failed' | 'turnstile_unavailable' };

type TurnstileEnv = Pick<
  Env,
  'TURNSTILE_SECRET_KEY' | 'TURNSTILE_EXPECTED_ACTION' | 'TURNSTILE_EXPECTED_HOSTNAME'
>;

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
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: remoteIp || undefined,
        idempotency_key: crypto.randomUUID(),
      }),
    });
    if (!response.ok) return { ok: false, code: 'turnstile_unavailable' };

    const result = await response.json() as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };

    return result.success
      && result.hostname === env.TURNSTILE_EXPECTED_HOSTNAME
      && result.action === env.TURNSTILE_EXPECTED_ACTION
      ? { ok: true }
      : { ok: false, code: 'turnstile_failed' };
  } catch {
    return { ok: false, code: 'turnstile_unavailable' };
  }
}

export async function rateLimitKey(request: Request, secret: string) {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const agent = request.headers.get('user-agent') ?? 'unknown';
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
    encoder.encode(`${ip}\n${agent}`),
  );
  const hex = [...new Uint8Array(signature)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
  return `inquiry:${hex}`;
}
```

- [ ] **Step 4: Run security tests**

Run:

```bash
npm --prefix workers/inquiry run typecheck
npm --prefix workers/inquiry test -- security.test.ts
```

Expected: three tests pass.

- [ ] **Step 5: Commit**

```bash
git add workers/inquiry/src/security.ts workers/inquiry/tests/security.test.ts
git commit -m "feat: secure inquiry requests with Turnstile"
```

---

### Task 3: Render and deliver inquiry emails through Resend

**Files:**

- Create: `workers/inquiry/src/email.ts`
- Create: `workers/inquiry/tests/email.test.ts`

**Interfaces:**

- Consumes: normalized `InquiryPayload` and Resend bindings.
- Produces: `renderInquiryEmail(payload)` and `sendInquiryEmail(payload, env, fetchImpl)`.

- [ ] **Step 1: Write failing email tests**

Create `workers/inquiry/tests/email.test.ts`:

```ts
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
    const fetchImpl = vi.fn().mockResolvedValue(new Response('provider detail', { status: 503 }));
    await expect(sendInquiryEmail(inquiry, env, fetchImpl)).resolves.toEqual({
      ok: false,
      code: 'delivery_failed',
    });
  });
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run:

```bash
npm --prefix workers/inquiry test -- email.test.ts
```

Expected: FAIL because `src/email.ts` does not exist.

- [ ] **Step 3: Implement safe text and HTML email rendering**

Create `workers/inquiry/src/email.ts`:

```ts
import type { InquiryPayload } from './types';

type EmailEnv = Pick<Env, 'RESEND_API_KEY' | 'RESEND_FROM' | 'INQUIRY_RECIPIENT'>;

const LABELS: Array<[keyof InquiryPayload, string]> = [
  ['country', 'Pays'],
  ['company', 'Entreprise'],
  ['contactName', 'Contact'],
  ['jobRole', 'Fonction'],
  ['email', 'E-mail'],
  ['whatsapp', 'WhatsApp'],
  ['buyerType', 'Type de client'],
  ['productCategory', 'Produit'],
  ['productId', 'Modèle source'],
  ['application', 'Application'],
  ['estimatedQuantity', 'Quantité estimée'],
  ['technicalRequirements', 'Exigences techniques'],
  ['vendingStatus', 'Système de vente STS'],
  ['targetPeriod', 'Période cible'],
  ['notes', 'Notes'],
  ['sourcePage', 'Page source'],
];

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function subjectText(value: string) {
  return value.replace(/\s+/g, ' ').trim().slice(0, 100);
}

export function renderInquiryEmail(payload: InquiryPayload) {
  const text = [
    'Nouvelle demande depuis le site français CalinMeters',
    '',
    ...LABELS.map(([key, label]) => `${label}: ${payload[key]}`),
  ].join('\n');

  const rows = LABELS.map(([key, label]) => `
    <tr>
      <th align="left" style="padding:8px;border:1px solid #dbe2ea;background:#f8fafc">${escapeHtml(label)}</th>
      <td style="padding:8px;border:1px solid #dbe2ea;white-space:pre-wrap">${escapeHtml(String(payload[key]))}</td>
    </tr>`).join('');

  return {
    text,
    html: `
      <h1 style="font:600 20px Arial,sans-serif">Nouvelle demande depuis le site français CalinMeters</h1>
      <table style="border-collapse:collapse;font:14px Arial,sans-serif">${rows}</table>
    `,
  };
}

export async function sendInquiryEmail(
  payload: InquiryPayload,
  env: EmailEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true } | { ok: false; code: 'delivery_failed' }> {
  const content = renderInquiryEmail(payload);
  try {
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
        'user-agent': 'calinmeters-inquiry-worker/1.0',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to: [env.INQUIRY_RECIPIENT],
        reply_to: payload.email,
        subject: `[FR] ${payload.productCategory} inquiry - ${subjectText(payload.country)} - ${subjectText(payload.company)}`,
        text: content.text,
        html: content.html,
      }),
    });
    return response.ok ? { ok: true } : { ok: false, code: 'delivery_failed' };
  } catch {
    return { ok: false, code: 'delivery_failed' };
  }
}
```

- [ ] **Step 4: Run email tests and all package checks**

Run:

```bash
npm --prefix workers/inquiry run check
```

Expected: type checking passes and all validation, security, and email tests pass.

- [ ] **Step 5: Commit**

```bash
git add workers/inquiry/src/email.ts workers/inquiry/tests/email.test.ts
git commit -m "feat: deliver inquiry email through Resend"
```

---

### Task 4: Implement the HTTP handler and stable error contract

**Files:**

- Create: `workers/inquiry/src/index.ts`
- Create: `workers/inquiry/tests/handler.test.ts`

**Interfaces:**

- Consumes: validation, security, email, and bindings from Tasks 1-3.
- Produces: `POST /v1/inquiries` and `OPTIONS /v1/inquiries`.
- Response body: `{ ok: true }` or `{ ok: false, code: string, fields?: string[] }`.

- [ ] **Step 1: Write failing handler tests**

Create `workers/inquiry/tests/handler.test.ts` with the valid payload from Task 1 and these assertions:

```ts
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
  vendingStatus: 'needed',
  targetPeriod: 'T4 2026',
  notes: '',
  sourcePage: '/fr/produits/compteur-eau-prepaye-sts/',
  language: 'fr',
  turnstileToken: 'token',
  website: ''
};

function env(rateAllowed = true): Env {
  return {
    ALLOWED_ORIGINS: 'https://calinmeters.com',
    INQUIRY_RECIPIENT: 'scott@szcalinmeter.com',
    RESEND_FROM: 'CalinMeters Website <website@calinmeters.com>',
    TURNSTILE_EXPECTED_ACTION: 'fr_inquiry',
    TURNSTILE_EXPECTED_HOSTNAME: 'calinmeters.com',
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

function request(body = valid, origin = 'https://calinmeters.com') {
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
  });

  it('rejects an unapproved origin', async () => {
    const response = await createHandler(deps)(request(valid, 'https://example.com'), env());
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
    expect(response.headers.get('access-control-allow-origin')).toBe('https://calinmeters.com');
  });

  it('silently rejects the honeypot', async () => {
    const response = await createHandler(deps)(request({ ...valid, website: 'spam' }), env());
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(deps.sendInquiryEmail).not.toHaveBeenCalled();
  });

  it('returns 429 when rate limited', async () => {
    const response = await createHandler(deps)(request(), env(false));
    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({ ok: false, code: 'rate_limited' });
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
    deps.verifyTurnstile.mockResolvedValueOnce({ ok: false, code: 'turnstile_failed' });
    const response = await createHandler(deps)(request(), env());
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      code: 'turnstile_failed',
    });
  });

  it('returns a stable delivery error', async () => {
    deps.sendInquiryEmail.mockResolvedValueOnce({ ok: false, code: 'delivery_failed' });
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
```

- [ ] **Step 2: Run the handler tests and verify failure**

Run:

```bash
npm --prefix workers/inquiry test -- handler.test.ts
```

Expected: FAIL because `createHandler` is not defined.

- [ ] **Step 3: Implement the Worker handler**

Create `workers/inquiry/src/index.ts`:

```ts
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
  const allowed = env.ALLOWED_ORIGINS.split(',').map((value) => value.trim());
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
    const url = new URL(request.url);
    const origin = allowedOrigin(request, env);

    try {
      if (url.pathname !== '/v1/inquiries') return json(origin, 404, { ok: false, code: 'not_found' });
      if (!origin) return json(null, 403, { ok: false, code: 'origin_denied' });
      if (request.method === 'OPTIONS') return json(origin, 204, null);
      if (request.method !== 'POST') return json(origin, 405, { ok: false, code: 'method_not_allowed' });

      const contentType = request.headers.get('content-type') ?? '';
      if (!contentType.toLowerCase().startsWith('application/json')) {
        return json(origin, 415, { ok: false, code: 'invalid_content_type' });
      }

      const body = await readBoundedBody(request, MAX_BODY_BYTES);
      if (!body.ok) return json(origin, 413, { ok: false, code: 'payload_too_large' });

      let value: unknown;
      try {
        value = JSON.parse(body.text);
      } catch {
        return json(origin, 400, { ok: false, code: 'invalid_json' });
      }

      if (value && typeof value === 'object' && String((value as { website?: unknown }).website ?? '').trim()) {
        return json(origin, 200, { ok: true });
      }

      const key = await rateLimitKey(request, env.RATE_LIMIT_KEY_SECRET);
      const rate = await env.INQUIRY_RATE_LIMITER.limit({ key });
      if (!rate.success) return json(origin, 429, { ok: false, code: 'rate_limited' });

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

      const deliveryPayload: InquiryPayload = { ...validation.value, turnstileToken: '' };
      const delivery = await deps.sendInquiryEmail(deliveryPayload, env);
      if (!delivery.ok) return json(origin, 503, { ok: false, code: delivery.code });
      return json(origin, 200, { ok: true });
    } catch {
      console.error(JSON.stringify({
        event: 'inquiry_worker_error',
        method: request.method,
        path: url.pathname,
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
```

- [ ] **Step 4: Run all checks**

Run:

```bash
npm --prefix workers/inquiry run check
```

Expected: type checking passes and all Worker tests pass.

- [ ] **Step 5: Commit**

```bash
git add workers/inquiry/src/index.ts workers/inquiry/tests/handler.test.ts
git commit -m "feat: expose secure inquiry endpoint"
```

---

### Task 5: Provision production services and deploy the Worker

**Files:**

- Create: `.github/workflows/deploy-inquiry-worker.yml`
- Modify: `docs/HANDOFF.md`

**Interfaces:**

- Consumes: Cloudflare account, Turnstile widget, verified Resend domain, and Worker code.
- Produces: a public Worker URL ending in `/v1/inquiries`, plus a public Turnstile sitekey for the website plan.

- [ ] **Step 1: Create production Turnstile and Resend resources**

Create a managed Turnstile widget named `CalinMeters French Inquiry` with allowed hostname:

```text
calinmeters.com
```

Verify the `calinmeters.com` sending domain in Resend and authorize:

```text
CalinMeters Website <website@calinmeters.com>
```

Do not continue to production deployment until both services show an active/verified state.

- [ ] **Step 2: Authenticate Wrangler without exposing credentials**

Run:

```bash
cd workers/inquiry
npx wrangler login
npx wrangler whoami
```

Expected: Wrangler reports the intended Cloudflare account without printing an API token.

- [ ] **Step 3: Set Worker secrets**

Run each command and paste the secret only into Wrangler's hidden prompt:

```bash
cd workers/inquiry
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RATE_LIMIT_KEY_SECRET
```

Paste a password-manager-generated random value of at least 32 bytes for `RATE_LIMIT_KEY_SECRET`. Expected: all three secret uploads succeed; no secret value appears in terminal output.

- [ ] **Step 4: Deploy and capture the production endpoint**

Run:

```bash
cd workers/inquiry
npm run check
npm run deploy
```

Expected: Wrangler deploys `calinmeters-inquiry` and prints an HTTPS `workers.dev` URL. Record that URL plus `/v1/inquiries` as the value for the website's `NEXT_PUBLIC_INQUIRY_ENDPOINT`.

The first production release may use `workers.dev`. A later custom-domain change is allowed only after confirming the Cloudflare zone and adding an exact custom-domain route; it is not required for form operation.

- [ ] **Step 5: Add the deployment workflow**

Create `.github/workflows/deploy-inquiry-worker.yml`:

```yaml
name: Deploy Inquiry Worker

on:
  push:
    branches: [main]
    paths:
      - "workers/inquiry/**"
      - ".github/workflows/deploy-inquiry-worker.yml"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "npm"
          cache-dependency-path: workers/inquiry/package-lock.json

      - name: Install dependencies
        working-directory: workers/inquiry
        run: npm ci

      - name: Test and typecheck
        working-directory: workers/inquiry
        run: npm run check

      - name: Deploy Worker
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: workers/inquiry
          command: deploy
```

Add repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The API token must be limited to Worker deployment. Resend and Turnstile secrets stay in Cloudflare and are not copied into GitHub.

- [ ] **Step 6: Document operations**

Add to `docs/HANDOFF.md`:

```markdown
## French inquiry Worker

- Worker package: `workers/inquiry`
- Public contract: `POST /v1/inquiries`
- Allowed production origin: `https://calinmeters.com`
- Delivery recipient: `scott@szcalinmeter.com`
- Worker secrets live in Cloudflare: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `RATE_LIMIT_KEY_SECRET`
- GitHub deployment secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Never log inquiry payloads or copy secret values into repository files.
- Validate changes with `npm --prefix workers/inquiry run check`.
```

- [ ] **Step 7: Commit**

```bash
git add .github/workflows/deploy-inquiry-worker.yml docs/HANDOFF.md workers/inquiry/package-lock.json
git commit -m "ci: deploy French inquiry Worker"
```

---

### Task 6: Verify production delivery and failure behavior

**Files:**

- Modify: `docs/ANALYTICS-AUTOMATION.md`

**Interfaces:**

- Consumes: deployed Worker endpoint and website form from the companion plan.
- Produces: verified production delivery with no personal data in analytics or logs.

- [ ] **Step 1: Verify CORS preflight**

Run with the deployed endpoint:

```bash
curl -i -X OPTIONS "$NEXT_PUBLIC_INQUIRY_ENDPOINT" \
  -H 'Origin: https://calinmeters.com' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type'
```

Expected:

```text
HTTP/2 204
access-control-allow-origin: https://calinmeters.com
access-control-allow-methods: POST, OPTIONS
```

- [ ] **Step 2: Verify origin rejection**

Run:

```bash
curl -i -X POST "$NEXT_PUBLIC_INQUIRY_ENDPOINT" \
  -H 'Origin: https://example.com' \
  -H 'Content-Type: application/json' \
  --data '{}'
```

Expected: HTTP 403 with `{"ok":false,"code":"origin_denied"}`.

- [ ] **Step 3: Submit one production test through the French website**

Use a clearly labeled internal test company and a real team-controlled reply address. Complete the production Turnstile widget and submit through `/fr/`.

Expected:

- The page reports success only after HTTP 200.
- `scott@szcalinmeter.com` receives one structured email.
- Reply-to is the supplied test address.
- The email contains no Turnstile token.
- Worker logs contain status/latency only and no inquiry fields.

- [ ] **Step 4: Verify delivery failure UI**

Temporarily point a local website build to an unreachable endpoint:

```bash
NEXT_PUBLIC_INQUIRY_ENDPOINT=https://127.0.0.1.invalid/v1/inquiries \
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA \
npm run dev
```

Expected: the French form displays its delivery-failure message and visible WhatsApp/email fallbacks, and emits `fr_quote_submit` once with `result: "server_error"` and no personal data.

- [ ] **Step 5: Document analytics privacy**

Add to `docs/ANALYTICS-AUTOMATION.md`:

```markdown
French inquiry analytics record only interface language, product category, product ID, buyer-type selection and source-page group. Names, companies, email addresses, phone or WhatsApp numbers, country free text, technical requirements and inquiry notes must not be sent to GA4.
```

- [ ] **Step 6: Run final checks and commit**

Run:

```bash
npm --prefix workers/inquiry run check
npm run lint
npm run build
npm run verify:seo
```

Expected: all commands pass.

Commit:

```bash
git add docs/ANALYTICS-AUTOMATION.md
git commit -m "docs: verify French inquiry delivery"
```

---

## Worker Reference Sources

- [Cloudflare Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Turnstile test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
- [Cloudflare Workers Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Cloudflare Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Cloudflare Workers Vitest integration](https://developers.cloudflare.com/workers/testing/vitest-integration/write-your-first-test/)
- [Wrangler generated types](https://developers.cloudflare.com/workers/wrangler/commands/workers/#types)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Resend REST authentication](https://resend.com/docs/api-reference/introduction)
- [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)
