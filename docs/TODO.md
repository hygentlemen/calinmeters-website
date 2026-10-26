# TODO

## P0 - Production Indexing and Measurement

1. Done: September 8, 14 and 21 changes were merged and deployed in PRs #25, #27 and #29. Latest weekly review and explicit deferrals: [2026-10-26](weekly/2026-10-26.md).
2. Done October 7: verified all 27 production pages, 11 language pairs, 10 HTML-linked PDFs plus the gateway/DCU PDFs, `robots.txt`, `llms.txt`, sitemap and public contact. Quietly recovered the missing September 30 GSC data before comparing complete weeks. October 12 repeated all 27 live HTML/locale checks; final PDF and deployed-chunk receipts are on issue #37.
3. Done 2026-07-21: reissued the production OAuth token with GA4 read-only and Search Console write scopes; `Submit Search Console Sitemap` run `29838520351` completed with zero errors and warnings.
4. Done October 11: all 11 French URLs passed separate Google live tests and received successful indexing-request confirmations. Started repair validation for all six historical noindex pages (6 pending, 0 failed) and requested a fresh canonical robots.txt crawl. Sitemap, security/manual-action and host-health checks pass. October 12 API inspection confirms 10 of 11 French pages submitted/indexed, with matching Google-selected canonicals. Only the electricity category retains the August 12 noindex snapshot; compare its next crawl and verdict; do not repeat accepted requests merely because the stored report has not updated. [Full operation record](FRENCH-INDEXING-2026-10-11.md). Field CWV was checked October 13: both device types have insufficient usage data; see P3 below.
5. Record the deployment date in the weekly SEO/GEO issue.
6. Done October 26: re-queried both weekly cohorts and matched dimensions. GSC 676 impressions/25 clicks versus 613/22; matched queries cover 4/25 current clicks. October 18 recovered (7 views), restating the prior GA4 week to 94 views; current week 124, with all seven dates returned but latest-day processing still mutable. Reuse the export at the November 2 checkpoint.
7. October 26: French inspection remains 10/11 indexed; the electricity category retains its August crawl despite live indexable HTML and the accepted earlier requests. Product-snippets validation is Passed with zero invalid items. Monitor the final French crawl and one inquiry-parameter duplicate classification; preserve working prefills and removed-certificate policy.

## P1 - Evidence and Conversion

1. Collect reviewable sources for any certification, test capability, production capacity, market coverage, warranty or customer project statement before publishing it.
2. Create buyer evidence pages only from approved source documents and customer permissions.
3. Done: English/French forms use the Worker/Resend endpoint. October 26 changes the shared form recipient to `tom.qi@qq.com`, leaving public contact unchanged. Next: verify QQ inbox delivery and qualified-lead follow-up.
4. CA168-L01 and CA368-Z04 specification PDFs added; resolve table/nameplate option differences during final quotation.
5. October 26: all four event definitions are available. The 30-day query has English submits 7 (3 success, 1 challenge_error, 3 historical unknown) and French submits 1 (success). Ninety-day controlled data is complete only after August 26. Preserve historical unknowns; private delivery and qualified/unqualified/duplicate/spam/unreviewed aggregates remain an operational review. Reporting passes 41 tests; existing form/remount regressions remain in place.

## P2 - Demand-Led Content Expansion

1. Select the first country or regional page from actual Search Console impressions, not assumptions.
2. Publish original field content: installation photos, commissioning steps, network survey examples, pilot criteria and engineering answers.
3. Add real crawlable articles only when subject matter and source evidence are available.
4. Build relevant industry citations, distributor links, partner references and digital PR outside the repository.
5. Review whether CIU, DCU and gateway products merit standalone pages based on search and buyer behavior.

## P3 - Platform Maintenance

1. Plan and test a future Next.js major-version upgrade; current production is static export, but the Next.js 14 package line receives audit advisories.
2. Add automated accessibility and performance checks after the route architecture stabilizes.
3. Rechecked October 26: Search Console reports insufficient CWV usage data for both Mobile and Desktop, and 13 HTTPS / 0 non-HTTPS URLs with no issues. Do not mark insufficient field data as a performance pass. Native Chrome verified automatic English and French Turnstile success and working public email links; no inquiry was submitted.
4. Keep the product/FAQ/SEO registries and generated sitemap in parity through `npm run verify:seo`.

## Cloud operations assessment

[Recommended handoff](CLOUD-CODEX-OPERATIONS.md): repository/Actions-based checks, analysis and scoped repair PRs are suitable for cloud Codex. Actual setup, cloud access verification and scheduling are not yet requested or activated. Preserve explicit browser/private-data follow-ups.
