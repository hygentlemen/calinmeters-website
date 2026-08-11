# CalinMeters Daily Report Summary Design

## Goal

Replace the current raw GA4/Search Console dump sent to Feishu with a concise Simplified Chinese daily summary while preserving aggregate collection and a complete raw artifact for later analysis.

## Scope

- Keep the existing Google authentication, GA4 report helpers, Search Console helpers, schedule, GitHub Pages deployment, analytics tracking, and privacy contract.
- Change the report presentation boundary, Feishu payload, and report artifact output.
- Add only the small daily queries needed by the requested summary: Search Console property totals, device mix, and same-day French traffic/conversion activity.
- Do not send a test message to the production Feishu webhook.

## Chosen Approach

Extract a pure formatter module from `scripts/daily-analytics-report.mjs`. The acquisition script continues to own authentication and API calls, then passes aggregate API rows plus source availability to the formatter. The formatter creates a human-readable `DailyReportData` object and renders both Markdown and a Feishu interactive-card payload.

This is preferred over editing the current template in place because the current 1,300-line script mixes collection, aggregation, formatting, fixture data, and delivery. It is preferred over a full reporting rewrite because that would create unnecessary risk in the production Google API queries.

## Data Flow

1. Run the existing GA4 and Search Console query helpers.
2. Set GA4 and GSC availability independently so one source can still produce a useful report when the other fails.
3. Preserve the complete privacy-safe aggregate response in `reports/daily-analytics-YYYY-MM-DD.raw.json`.
4. Convert API field names into semantic Chinese summary fields in `buildDailyReportData`.
5. Render `reports/daily-analytics-YYYY-MM-DD.md` without raw field names or Markdown tables.
6. If `FEISHU_WEBHOOK_URL` exists, send the same summary as one blue interactive card. Fixture and test modes never send.

## Summary Rules

- Core: users, sessions, views, events, GSC clicks, impressions, CTR, and average position when their source is available.
- Search terms: top 5; show one `暂无数据` line when GSC is healthy but no terms exist.
- Pages: merge GA4 page views/users with GSC clicks/impressions by normalized path; remove origin and query strings; top 5.
- Countries: top 5 GA4 countries; hide when empty.
- Devices: percentage split for multiple device categories or one short line for a single category; hide when empty.
- French market: same-day traffic and actions when available, followed by compact 30/90-day totals. Never label a 30-day value as today's value.
- Conversions: successful French quote submissions when controlled result dimensions are available, WhatsApp clicks, email clicks, and GA4 PDF downloads. Show one no-conversion sentence when all totals are zero.
- PDF downloads: top 3 filenames; hide when empty.
- Closing hint: one deterministic Chinese sentence selected from conversion, search, product-page traffic, or low-traffic conditions.
- Normal output target: 25-45 non-empty lines and no raw GA4/GSC field names, English technical sections, or Markdown tables.

## Failure Handling

- GA4 unavailable, GSC available: show GSC metrics/search terms and hide GA-only modules.
- GSC unavailable, GA4 available: show GA4 metrics/modules and mark GSC unavailable in data status and search terms.
- Both unavailable: retain the existing failure artifact and failure notice path.
- Missing arrays, null values, unregistered controlled dimensions, and empty 30/90-day windows produce compact omissions or human-readable fallback text.
- Raw API error strings remain in workflow logs; the Feishu summary exposes only source availability, not technical stack traces.

## Testing

Use Node's built-in test runner against the pure formatter. Cover normal data, no search terms, zero conversions, GA4-only, GSC-only, partial failure, empty 30/90-day data, Top-N limits, path/filename normalization, banned raw field names, absence of Markdown tables, and Feishu interactive-card structure. Keep the existing deterministic CLI fixture as an end-to-end preview check.

## Current-Data Preview Baseline

The GitHub Actions artifact for 2026-08-09 is the preview source: 3 users, 3 sessions, 15 views, 23 events; no search keyword rows; Mozambique, Solomon Islands, and Yemen; five top pages; one CA368-GPRS.pdf download; 3 French users in both 30 and 90 days; 8 language switches; no recorded French conversions. Values absent from the old artifact must not be invented.
