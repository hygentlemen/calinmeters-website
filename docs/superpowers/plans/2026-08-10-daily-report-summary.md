# CalinMeters Daily Report Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a compact Simplified Chinese CalinMeters daily report and one-card Feishu payload without removing aggregate GA4 or Search Console collection.

**Architecture:** `daily-analytics-report.mjs` remains the acquisition and delivery entry point. A new pure formatter module converts aggregate API rows into a semantic summary, Markdown artifact, and Feishu card payload; Node tests validate presentation independently from Google credentials.

**Tech Stack:** Node.js 24 ESM, Node built-in test runner, Google Analytics Data API, Google Search Console API, Feishu custom-bot interactive cards, GitHub Actions.

## Global Constraints

- Keep Next.js 14 static export and GitHub Pages deployment unchanged.
- Do not remove `public/CNAME`, GA4, `robots.txt`, `sitemap.xml`, or `llms.txt`.
- Do not commit secrets, OAuth tokens, webhook URLs, keys, personal data, or free-text inquiry data.
- Do not send the preview to the production Feishu webhook.
- Search terms/pages/countries are limited to 5; PDF downloads are limited to 3.
- The Feishu summary contains no raw GA4/GSC field names or Markdown tables.

---

### Task 1: Pure daily-report formatter and tests

**Files:**
- Create: `scripts/daily-report-formatter.mjs`
- Create: `scripts/daily-report-formatter.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: raw aggregate report object with `date`, `sourceStatus`, GA4 arrays, GSC arrays, and compact French windows.
- Produces: `buildDailyReportData(raw)`, `formatDailyReport(data)`, and `buildFeishuCard(report)`.

- [ ] **Step 1: Write failing formatter tests**

Use `node:test` and `node:assert/strict` to construct aggregate fixtures and assert the seven required availability/empty-data scenarios, Top-N limits, normalized paths and filenames, banned-field absence, no table separators, and `msg_type: 'interactive'`.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `node --test scripts/daily-report-formatter.test.mjs`

Expected: FAIL because `scripts/daily-report-formatter.mjs` does not exist.

- [ ] **Step 3: Implement the semantic formatter**

Implement numeric coercion, source-status handling, query/page/country/device/download Top-N transforms, French window summaries, conversion totals, deterministic hint selection, compact Markdown rendering, and card payload construction. Export only the three public interfaces used by the acquisition script and tests.

- [ ] **Step 4: Add the report test command and rerun**

Add `"test:report": "node --test scripts/daily-report-formatter.test.mjs"` to `package.json`.

Run: `npm run test:report`

Expected: all formatter scenarios pass.

### Task 2: Connect collection, raw artifact, and Feishu delivery

**Files:**
- Modify: `scripts/daily-analytics-report.mjs`
- Modify: `.github/workflows/daily-analytics-report.yml`

**Interfaces:**
- Consumes: formatter exports from Task 1 and existing GA4/GSC query helpers.
- Produces: compact Markdown, raw JSON artifact, and tested Feishu card payload.

- [ ] **Step 1: Group GA4 and GSC acquisition independently**

Run both source groups with `Promise.allSettled`. Preserve all existing queries and add property-level GSC totals, device mix, and same-day French traffic/inquiry/actions/organic landing queries. Throw only when both sources fail; otherwise set `sourceStatus` and pass empty arrays for the unavailable source.

- [ ] **Step 2: Replace the legacy renderer call**

Pass the aggregate object through `buildDailyReportData` and `formatDailyReport`. Remove the legacy Markdown table renderer and its fixture assertions while retaining collection normalization and French aggregation helpers required by the data layer.

- [ ] **Step 3: Preserve complete aggregate data**

Write `reports/daily-analytics-YYYY-MM-DD.raw.json` beside the Markdown summary and include both `reports/*.md` and `reports/*.json` in the workflow artifact upload.

- [ ] **Step 4: Send one Feishu card**

Change `sendFeishu` to post the output of `buildFeishuCard` using `msg_type: 'interactive'`. Do not add a test-send or invoke the live webhook locally.

- [ ] **Step 5: Validate the CLI fixture**

Run: `npm run report:daily -- --fixture`

Expected: a compact Chinese preview followed by `Fixture validation passed.` and no report files or network calls.

### Task 3: Documentation and full verification

**Files:**
- Modify: `docs/ANALYTICS-AUTOMATION.md`
- Modify: `docs/SEO-GEO-OPERATIONS.md`

**Interfaces:**
- Consumes: the implemented report behavior.
- Produces: accurate operator documentation and weekly-task evidence.

- [ ] **Step 1: Update reporting documentation**

Describe the Chinese summary sections, partial-source behavior, raw JSON artifact, Feishu interactive card, fixture preview, Top-N limits, and the unchanged privacy contract.

- [ ] **Step 2: Generate a current-data preview**

Transform the 2026-08-09 GitHub Actions artifact values into the new formatter input without inventing fields missing from the old artifact. Save the local ignored Markdown preview under `reports/` for review.

- [ ] **Step 3: Run complete verification**

Run:

```bash
npm run test:report
npm run report:daily -- --fixture
npm run verify
npm run seo-geo:weekly -- --fixture
```

Expected: formatter tests, fixture validations, typecheck, production build/export, and SEO verification all pass.

- [ ] **Step 4: Review the diff and secrets**

Run `git diff --check`, inspect `git diff`, confirm reports remain ignored, and search changed tracked files for webhook URLs, OAuth tokens, or private inquiry data.
