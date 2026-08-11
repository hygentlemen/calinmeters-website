# French SEO/GEO Operations

This runbook governs measurement and weekly decisions for the first French release. It complements the existing English reporting and does not replace the site-wide daily metrics.

## Release scope

The first release contains exactly 11 French URLs:

1. `https://calinmeters.com/fr/`
2. `https://calinmeters.com/fr/produits/compteur-electricite-prepaye-sts/`
3. `https://calinmeters.com/fr/produits/compteur-eau-prepaye-sts/`
4. `https://calinmeters.com/fr/produits/ca168-compteur-electricite-prepaye-sts-lorawan/`
5. `https://calinmeters.com/fr/produits/ca168-compteur-electricite-prepaye-sts-gprs/`
6. `https://calinmeters.com/fr/produits/ca168-compteur-electricite-prepaye-sts/`
7. `https://calinmeters.com/fr/produits/ca368-compteur-electricite-prepaye-triphase-gprs/`
8. `https://calinmeters.com/fr/produits/ca368-compteur-electricite-prepaye-triphase-sts/`
9. `https://calinmeters.com/fr/produits/ca568-compteur-eau-prepaye-multijet-plastique/`
10. `https://calinmeters.com/fr/produits/ca568-compteur-eau-prepaye-multijet-laiton/`
11. `https://calinmeters.com/fr/produits/ca568-compteur-eau-prepaye-ultrasonique/`

The current release has no country pages. Country data is evidence for prioritization, not permission to publish a country page.

## Automated cadence

The `Daily Analytics Report` workflow runs daily at 08:30 Asia/Shanghai. The Feishu message is a compact Simplified Chinese summary with:

- one-line GA4 traffic and Search Console totals;
- top-five search terms, merged pages, and countries plus a compact device split;
- one French-market section combining same-day activity with 30-day and 90-day user totals;
- successful inquiries, contact actions, and up to three PDF filenames;
- one deterministic interpretation sentence.

The summary hides empty optional sections and contains no raw API field names or Markdown tables. GA4 and Search Console are collected as independent source groups: if one group fails, the report marks that source unavailable and still renders the healthy group. If both fail, the workflow writes and sends a short failure notice.

The workflow stores the complete privacy-safe aggregate rows in a `.raw.json` artifact beside the compact Markdown summary. The raw artifact retains the 30-day and 90-day French traffic, organic landing, inquiry, controlled action, page/query, country/query, and priority-page evidence needed by the weekly review. It is the working evidence source; the Feishu card is only the daily summary.

GA4 windows end on the requested report date. Search Console windows end three days earlier to avoid reporting on likely partial data. Both windows are inclusive: 30 days means the end date plus the preceding 29 days, and 90 days means the end date plus the preceding 89 days.

The `Weekly SEO/GEO Execution` workflow runs each Monday at 09:15 Asia/Shanghai. Its GitHub Issue is the operating checklist for indexing, hreflang, content gaps, inquiry quality, native-French review, and the country-page decision gate.

## Local deterministic checks

These commands use synthetic aggregate data, require no Google credentials, do not call external services, and do not write report files:

```bash
node scripts/daily-analytics-report.mjs --fixture
node scripts/seo-geo-weekly-issue.mjs --fixture
```

Each fixture validates required report sections before printing the deterministic Markdown. The daily formatter also has focused empty-data and partial-source tests through `npm run test:report`. The two GitHub Actions workflows run their fixture checks before using credentials or creating an Issue.

## GA4 event contract

Only these inquiry event names are included in the French funnel:

| Event | When emitted |
| --- | --- |
| `fr_quote_start` | The visitor first engages with the French quote form. |
| `fr_quote_submit` | A form submission attempt returns a controlled outcome. |

The event payload may contain only these controlled analytical dimensions:

| GA4 custom dimension | Scope | Allowed value source |
| --- | --- | --- |
| `product_category` | Event | A fixed site value such as `electricity` or `water`. |
| `product_id` | Event | A fixed product ID from the site catalog. |
| `buyer_type` | Event | A fixed form selection such as distributor, integrator, engineering company, or utility. |
| `result` | Event | A fixed submit outcome: `success`, `validation_error`, `challenge_error`, `rate_limited`, or `server_error`. |

Create these four event-scoped custom dimensions in GA4 Admin before expecting breakdown tables to populate. If they are not registered, the daily report falls back to event totals and prints a clear warning; authentication and the rest of the report continue to work.

Never send or copy a visitor's name, email address, phone/WhatsApp number, company name, country entered in free text, project notes, IP address, Turnstile token, or message content into GA4. Never place those values in report artifacts or GitHub Issues. Inquiry quality and spam reporting must use aggregate counts from an authorized CRM/mailbox review.

## Search Console contract

French Search Console requests use a page filter containing `https://calinmeters.com/fr/` and these dimensions:

- `page` plus `query` for landing-page and keyword performance;
- `country` plus `query` for aggregate market context.

Every row reports clicks, impressions, CTR, and average position. Search Console can omit anonymized or low-volume queries, so totals grouped by query may be lower than property totals. A zero in the priority-page table means the API returned no matching page/query row for that window; it does not by itself prove that the page is unindexed.

Country codes in Search Console are analytical context only. They must not be presented publicly as proof of a customer, installation, approval, office, installed base, or operating market.

## Weekly interpretation

Review the 30-day window for current movement and the 90-day window for direction and consistency:

1. Verify all 11 French URLs in the sitemap and monitor indexing coverage.
2. Validate self-canonicals and reciprocal English/French/`x-default` hreflang.
3. Separate electricity intent from water intent and assign each meaningful query to one canonical owner.
4. Record unanswered buyer questions as content gaps; do not create overlapping pages for keyword variants.
5. Compare organic landing sessions, engaged sessions, quote starts, successful submissions, and controlled error results.
6. Review aggregate inquiry quality and spam totals outside GA4.
7. Route any edited French technical copy through native-French review before requesting indexing.

Low-volume data should lead to measurement and improvement of existing owner pages, not speculative expansion. Do not infer demand from average position alone; consider impressions, clicks, query relevance, landing-page match, and consistency across the 90-day window.

## Internal market priorities

The operating checklist tracks these planning signals:

- Cameroon and Senegal: prepaid electricity-meter intent;
- Côte d'Ivoire: prepaid water-meter intent;
- Togo: prepaid electricity- and water-meter intent;
- Haiti: prepaid electricity-meter signal.

These are internal priorities only. Do not publish them as customer evidence, and do not state a customer relationship or market presence unless separately approved evidence supports that claim.

## Country-page gate

Create a country-page proposal only when a country has either:

1. at least two qualified inquiries in the rolling 90 days, or
2. sustained non-brand organic query demand in the rolling 90 days,

and the team can add unique, factual value beyond changing the country name.

Passing the numerical threshold permits a proposal, not automatic publication. The proposal must document the query/inquiry evidence, a distinct buyer need, unique factual content, an existing canonical-overlap review, and a native-French review path. If those are absent, improve the existing French category or product owner instead.

## Authentication and secrets

The live report preserves the existing authentication order:

1. OAuth client ID, client secret, and refresh token when all three are configured;
2. service-account JSON when configured;
3. GitHub Workload Identity Federation otherwise.

Required repository secrets remain `GA_PROPERTY_ID` and `GSC_SITE_URL`, plus one complete Google authentication method. `FEISHU_WEBHOOK_URL` remains optional. Do not store tokens, credentials, webhook URLs, analytics identifiers intended to remain private, or raw inquiry data in this repository.

For a manual historical run, dispatch `Daily Analytics Report` with `report_date` in `YYYY-MM-DD` format. The selected date becomes the GA4 window end; the Search Console end date is calculated three days earlier.

## Failure handling

- `invalid_grant` or a revoked-token error: issue a new production OAuth refresh token with the documented scopes, update the GitHub Secret, and rerun the workflow.
- Missing controlled dimensions: register the four event-scoped GA4 custom dimensions; event totals still render.
- No French rows: confirm the French release is deployed, GA4 is receiving page views, the Search Console property matches the canonical domain, and the report window follows the deployment/crawl dates.
- Priority page shows zero: check sitemap presence, canonical/hreflang output, URL Inspection, crawl status, and page/query data before editing content.
- A sudden increase in errors or spam: inspect Worker/Turnstile and mailbox aggregates without copying personal fields into analytics or GitHub.
