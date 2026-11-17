# Weekly report readiness implementation plan

> **For agentic workers:** Execute inline, task by task, preserving the existing checkout and private untracked knowledge base.

**Goal:** Make complete-week artifacts discoverable despite delayed scheduled collection, and distinguish absent French page rows from measured zero.

**Architecture:** Keep the existing Actions workflow and Google access. Collect the latest completed Sunday cohort alongside each scheduled daily report, with a separate weekly date. Move the quiet refresh to Monday 23:17 Asia/Shanghai for additional lead time; no cron timing is a delivery guarantee. Consumers locate the required dated file across runs rather than require a Tuesday trigger.

**Tech Stack:** Node.js ES modules, node:test, GitHub Actions, existing GA4/GSC clients.

## Constraints

- Preserve Tuesday 16:00 review, daily report notification behavior, all 11 French URLs and existing quality flags.
- Preserve private data, website content, inquiry routing and deployment configuration.
- Prepare a scoped PR; do not merge/deploy without specific authorization.
- Automatic delivery to Dot is a separate unverified path; this repair must not claim to connect it.

## Task 1: Dates and scheduled delivery

Files: `scripts/analytics-report-windows.mjs`, `scripts/daily-analytics-report.mjs`, `.github/workflows/daily-analytics-report.yml`, `scripts/analytics-collection.test.mjs`.

- [x] Add regression cases for delayed Tuesday and Wednesday execution, Sunday before midnight, Monday after midnight, year boundaries, quiet refresh and manual opt-in. Use `resolveReportDates({now: new Date('2026-11-17T08:09:59Z'), eventName: 'schedule'})` and assert daily `2026-11-16`, weekly `2026-11-15`.
- [x] Run `npm run test:report`; expect missing exported resolver failures.
- [x] Implement `resolveReportDates` returning `{reportDate, weeklyDate}`. For scheduled runs calculate the last Sunday strictly before today's Asia/Shanghai date. Daily reports use yesterday; quiet refresh uses Sunday. Manual runs retain the specified report date and generate weekly data only when `includeWeekly === 'true'`.
- [x] Replace the workflow's inline Sunday arithmetic with the tested resolver; move quiet cron from `0 7 * * 2` to `17 15 * * 1`. Keep scheduled daily notification and explicit manual `notify=false` behavior.
- [x] Log weekly file/date; upload real existing artifacts only. Update current operating documentation to search expected file contents across runs, never infer readiness from time or workflow success alone.

## Task 2: French missing rows

Files: `scripts/daily-analytics-report.mjs`, `scripts/analytics-collection.test.mjs`.

- [x] Assert `buildPriorityCoverage([])` returns all 11 URLs with `status='not_returned'` and null metrics; distinguish a returned zero-impression row from missing data.
- [x] Run regression tests and observe failure before implementing.
- [x] Track source row counts; use nullable metrics for absent rows and null CTR/position for zero impressions. Preserve canonical grouping and genuine returned zeros.
- [x] Run `npm run test:report`, `npm run test:inquiry-events`, `npm run verify`, and `npm run lint`.

## Task 3: Evidence and delivery

- [x] Parse quiet manual backfill for Sunday 2026-11-15; retain source windows and all quality flags.
- [x] Record November 10 delayed weekly artifact and November 17 daily-only artifact with exact run IDs. Distinguish delayed arrival from permanent generation failure.
- [x] Inspect final diff, commit scoped files, push branch and open PR #53 linked to existing Issue #52. No new weekly issue, deployment, or customer messages. Live branch run 44107357805 also passed artifact-content acceptance.
