# GA4 Daily Report Reliability Design

## Context

The scheduled report for 2026-08-26 marked GA4 unavailable while GSC remained available. The workflow log identifies the cause as `Exhausted concurrent requests quota`. `collectGa4Data` currently launches 17 report groups at once, and several groups may issue a second request when an optional custom dimension is unavailable.

The weekly SEO/GEO process relies on these reports for traffic, French acquisition, inquiry-funnel, and download decisions. A quota failure therefore creates a false data gap and weakens week-over-week comparisons.

## Goal

Keep the existing GA4 metrics and partial-source behavior while preventing this process from exhausting the GA4 concurrent-request quota during normal operation.

## Options Considered

### 1. Retry the current fully concurrent request batch

This is the smallest code change, but every retry can reproduce the same burst of 17 requests. It treats the symptom without reducing the cause.

### 2. Run every GA4 report serially

This minimizes local concurrent quota use, but needlessly lengthens the daily workflow and makes transient slow requests block all following work.

### 3. Bound concurrency and retry transient failures

Run at most three GA4 report groups concurrently and retry only quota, rate-limit, and temporary server failures with short deterministic backoff. This stays below the property's concurrent-request quota, retains reasonable execution time, and remains robust when another client temporarily uses the same quota.

Option 3 is selected.

## Architecture

Create `scripts/analytics-request-control.mjs` with two independent utilities:

- `runWithConcurrency(tasks, { limit })` accepts an ordered array of promise-returning functions, runs no more than `limit` at a time, preserves result order, and rejects when a task ultimately fails.
- `retryTransientRequest(operation, options)` retries only errors classified by `isRetryableAnalyticsError`. It uses three total attempts and deterministic exponential delays. Non-retryable errors are rethrown immediately.

`scripts/daily-analytics-report.mjs` will:

1. represent its existing 17 GA4 report groups as ordered task functions;
2. execute them with a concurrency limit of three;
3. wrap each GA4 `runReport` API call with transient retry control;
4. keep the existing fallback queries for unregistered custom dimensions;
5. keep the existing source-level `Promise.allSettled` behavior so a final GA4 failure still produces a GSC-only report rather than fabricating values.

No GA4 metric, dimension, date window, filter, output field, Feishu format, GSC query, or website page changes.

## Error Handling

Retryable failures include HTTP 429, HTTP 500/502/503/504, explicit resource-exhaustion or quota messages, rate-limit messages, and temporary-unavailable messages. Authentication failures, permission failures, invalid dimensions, and other deterministic request errors are not retried.

The backoff schedule is short and deterministic so workflow duration remains bounded and tests do not depend on randomness. After the final attempt fails, the original error propagates to the existing partial-source handling.

## Testing

Add `scripts/analytics-request-control.test.mjs` to verify:

- the active task count never exceeds the configured limit;
- results retain input order even when tasks finish out of order;
- a quota-style transient error is retried and can recover;
- a deterministic error fails immediately without retry;
- exhausting all transient attempts rethrows the final error.

Update `npm run test:report` to run both the existing formatter tests and the new request-control tests. Run the focused test suite first, then `npm run verify` for typecheck, static export, i18n, sitemap, canonical, hreflang, and SEO validation.

After merge, manually run the daily workflow for 2026-08-30. Completion requires `sourceStatus.ga4 = available` in the saved artifact and a successful Feishu step.

## Scope Boundaries

- Do not change public website copy or French indexability.
- Do not register GA4 custom dimensions from code.
- Do not add credentials, tokens, or quota values to the repository.
- Do not modify Search Console concurrency because the observed failure came from GA4 and the two APIs use separate quotas.
- Do not infer missing traffic values when GA4 remains unavailable after retries.
