# Missing daily GA4 summary correction

**Goal:** Apply the established missing-data contract to daily GA4 totals: an absent summary is unknown, while an explicit zero-valued row remains zero.

**Design and authorization:** The weekly SEO/GEO execution includes reporting correctness; the existing measurement contract already requires missing totals to remain unknown. This is a correction to that approved rule. A fallback sum of page/country rows would be capped and potentially overlapping, so it is rejected. Dropping the whole GA4 source would also discard valid rolling windows. Retain source availability and all independent sections; only the absent headline summary becomes unavailable. Preserve the raw artifact and request/authentication paths.

**Architecture:** In `scripts/daily-report-formatter.mjs`, retain the nullable first overview row, build traffic only if it exists, add a visible missing-summary line, and prioritize a missing-summary hint over traffic judgements. Qualify the status when both API sources are available but either summary is absent. Explicit zero-valued summary rows remain normal data. No website UI, public content dates, credentials, recipient or schema changes.

**Validation and execution:**

- [x] Add three behavior regressions to `scripts/daily-report-formatter.test.mjs`: absent GA overview preserves other evidence and emits no zero/low-traffic claim; explicit zero row remains zero; both absent summaries emit independent warnings rather than healthy status.
- [x] Run `npm run test:report` before the fix and retain the expected failures in ignored reports.
- [x] Apply the scoped formatter correction, rerun the report suite and deterministic fixture, and render the actual October 18 artifact locally without notifications.
- [x] Complete the weekly source/quality/indexing memo. Run lint, typecheck, build, SEO and image checks before push.
- [ ] Create and attach a PR, merge after checks, verify Pages and a quiet main-branch report, then close issue #42 with explicit external/operational deferrals.

Source evidence: run `39201968006` and quiet refreshed run `39250431586`, both `daily-analytics-2026-10-18.raw.json` with `overview: []`. The fresh full-week export is separate evidence and is not used to fabricate a daily summary.
