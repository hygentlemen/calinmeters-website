# GA4 Daily Report Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the daily analytics report from exhausting the GA4 concurrent-request quota while preserving every existing metric and fallback behavior.

**Architecture:** Add a small request-control module that owns ordered bounded concurrency and transient retry policy. The daily collector will pass its existing 17 GA4 report groups through that module, while each GA4 API call uses the same retry classifier and deterministic backoff. Existing report formatting and GA4/GSC partial-source degradation remain unchanged.

**Tech Stack:** Node.js ES modules, Google Analytics Data API v1beta, Node test runner, Next.js verification scripts, GitHub Actions.

## Global Constraints

- Keep GitHub Pages as the production deployment target.
- Preserve GA4, GSC, Feishu, `public/CNAME`, `robots.txt`, `sitemap.xml`, and `llms.txt` behavior.
- Do not commit credentials, tokens, webhook URLs, or quota identifiers.
- Do not change metric definitions, date windows, website copy, or French `noindex` behavior.
- Use TDD for request-control behavior and run `npm run verify` before publishing.

---

### Task 1: Add Tested Request-Control Utilities

**Files:**
- Create: `scripts/analytics-request-control.mjs`
- Create: `scripts/analytics-request-control.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `runWithConcurrency(tasks: Array<() => Promise<T>>, options?: { limit?: number }): Promise<T[]>`
- Produces: `isRetryableAnalyticsError(error: unknown): boolean`
- Produces: `retryTransientRequest<T>(operation: () => Promise<T>, options?: { attempts?: number, baseDelayMs?: number, sleep?: (ms: number) => Promise<void> }): Promise<T>`

- [ ] **Step 1: Write failing concurrency and retry tests**

Create tests that assert the configured concurrency maximum, input-order result preservation, recovery after a quota error, immediate failure for an invalid-dimension error, and propagation after three transient failures. Use an injected zero-time sleep function so the retry tests are deterministic.

```js
test('runWithConcurrency respects the limit and preserves task order', async () => {
  let active = 0;
  let maximumActive = 0;
  const tasks = [30, 5, 20, 1].map((delay, index) => async () => {
    active += 1;
    maximumActive = Math.max(maximumActive, active);
    await new Promise((resolve) => setTimeout(resolve, delay));
    active -= 1;
    return index;
  });

  const result = await runWithConcurrency(tasks, { limit: 2 });
  assert.deepEqual(result, [0, 1, 2, 3]);
  assert.equal(maximumActive, 2);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node --test scripts/analytics-request-control.test.mjs`

Expected: FAIL because `scripts/analytics-request-control.mjs` does not exist.

- [ ] **Step 3: Implement the minimal utility module**

Implement an ordered worker pool with a default limit of three. Reject non-positive or non-integer limits. Classify HTTP 429 and 500/502/503/504 plus messages containing quota, resource exhaustion, rate limiting, or temporary unavailability as retryable. Retry three total attempts with delays of `baseDelayMs * 2 ** (attempt - 1)`.

```js
export async function runWithConcurrency(tasks, { limit = 3 } = {}) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit must be a positive integer');
  const results = new Array(tasks.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < tasks.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await tasks[index]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()));
  return results;
}
```

- [ ] **Step 4: Run tests and add them to the report test command**

Change `test:report` to:

```json
"test:report": "node --test scripts/daily-report-formatter.test.mjs scripts/analytics-request-control.test.mjs"
```

Run: `npm run test:report`

Expected: all formatter and request-control tests pass.

- [ ] **Step 5: Commit the utility**

```bash
git add package.json scripts/analytics-request-control.mjs scripts/analytics-request-control.test.mjs
git commit -m "test: add analytics request controls"
```

### Task 2: Apply Concurrency and Retry to GA4 Collection

**Files:**
- Modify: `scripts/daily-analytics-report.mjs`
- Test: `scripts/analytics-request-control.test.mjs`

**Interfaces:**
- Consumes: `runWithConcurrency`, `retryTransientRequest`
- Preserves: `collectGa4Data` return shape and `runGaReport` normalized row output

- [ ] **Step 1: Import request controls and declare policy constants**

Add:

```js
import { retryTransientRequest, runWithConcurrency } from './analytics-request-control.mjs';

const GA_REPORT_CONCURRENCY = 3;
const GA_REPORT_RETRY_ATTEMPTS = 3;
const GA_REPORT_RETRY_BASE_DELAY_MS = 750;
```

- [ ] **Step 2: Convert the 17 GA4 report calls into ordered tasks**

Wrap every existing call in `collectGa4Data` with `() => ...`, keep the array order exactly aligned to the existing destructuring order, and execute:

```js
const results = await runWithConcurrency(tasks, { limit: GA_REPORT_CONCURRENCY });
```

Destructure `results` into the same local names used by the returned object.

- [ ] **Step 3: Retry each GA4 API request at the lowest shared call site**

Replace the direct `analyticsData.properties.runReport` call in `runGaReport` with:

```js
const response = await retryTransientRequest(
  () => analyticsData.properties.runReport({ property: gaProperty, requestBody }),
  {
    attempts: GA_REPORT_RETRY_ATTEMPTS,
    baseDelayMs: GA_REPORT_RETRY_BASE_DELAY_MS,
  },
);
```

- [ ] **Step 4: Run focused and full verification**

Run: `npm run test:report`

Expected: all tests pass.

Run: `npm run verify`

Expected: i18n validation, typecheck, 28-route build, 25-URL sitemap verification, and 11 reciprocal locale-pair checks pass.

- [ ] **Step 5: Commit the integration**

```bash
git add scripts/daily-analytics-report.mjs
git commit -m "fix: limit and retry GA4 report requests"
```

### Task 3: Publish and Prove the Fix

**Files:**
- No additional repository files expected.

**Interfaces:**
- Produces: merged GitHub pull request and successful post-merge daily analytics artifact
- Validates: `sourceStatus.ga4` equals `available` for report date `2026-08-30`

- [ ] **Step 1: Push the branch and open a pull request**

Push `codex/weekly-seo-2026-08-31`, create a PR against `main`, and include the August 26 quota-exhaustion workflow log plus local test and build evidence.

- [ ] **Step 2: Merge after checks pass**

Use squash merge. Do not modify the user's divergent local `main`; production deploys from remote `main`.

- [ ] **Step 3: Run the daily workflow for 2026-08-30**

Dispatch `Daily Analytics Report` with `report_date=2026-08-30` and wait for completion.

- [ ] **Step 4: Validate the saved artifact and Feishu path**

Download the artifact and confirm:

```text
sourceStatus.ga4 = available
sourceStatus.gsc = available
```

Confirm `FEISHU_WEBHOOK_URL` was present in the masked workflow environment and the generation step completed without a webhook error.

- [ ] **Step 5: Add weekly evidence to Issue #22 and close it**

Record the 30/90-day French metrics, 14-day data-quality caveat, URL Inspection results, live technical checks, inquiry-quality limitations, country-page decision, PR/deployment links, and next action. Include aggregate data only.
