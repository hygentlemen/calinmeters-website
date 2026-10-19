# TODO

## P0 - Production Indexing and Measurement

1. Done: September 8, 14 and 21 changes were merged and deployed in PRs #25, #27 and #29. Latest weekly review and explicit deferrals: [2026-10-19](weekly/2026-10-19.md).
2. Done October 7: verified all 27 production pages, 11 language pairs, 10 HTML-linked PDFs plus the gateway/DCU PDFs, `robots.txt`, `llms.txt`, sitemap and public contact. Quietly recovered the missing September 30 GSC data before comparing complete weeks. October 12 repeated all 27 live HTML/locale checks; final PDF and deployed-chunk receipts are on issue #37.
3. Done 2026-07-21: reissued the production OAuth token with GA4 read-only and Search Console write scopes; `Submit Search Console Sitemap` run `29838520351` completed with zero errors and warnings.
4. Done October 11: all 11 French URLs passed separate Google live tests and received successful indexing-request confirmations. Started repair validation for all six historical noindex pages (6 pending, 0 failed) and requested a fresh canonical robots.txt crawl. Sitemap, security/manual-action and host-health checks pass. October 12 API inspection confirms 10 of 11 French pages submitted/indexed, with matching Google-selected canonicals. Only the electricity category retains the August 12 noindex snapshot; compare its next crawl and verdict; do not repeat accepted requests merely because the stored report has not updated. [Full operation record](FRENCH-INDEXING-2026-10-11.md). Field CWV was checked October 13: both device types have insufficient usage data; see P3 below.
5. Record the deployment date in the weekly SEO/GEO issue.
6. Done October 19: refreshed both weekly cohorts and the matched query × country × device × page export. Current matched rows cover only 2/22 property clicks; anonymized-query limits still prevent causal attribution. GA4 October 18 is missing, so the current weekly traffic comparison is provisional. The daily formatter no longer turns a missing GA4 summary into zeros. Reuse the export at the October 26 checkpoint.
7. October 19: fresh inspection confirms 10/11 French pages indexed after brass recovered from the morning snapshot. Electricity category live test passes; its stored August crawl remains. Product-snippets validation is Looking good with one pending plastic item, zero failed and seven other. Monitor processing without repeating accepted requests or restoring removed certificate PDFs.

## P1 - Evidence and Conversion

1. Collect reviewable sources for any certification, test capability, production capacity, market coverage, warranty or customer project statement before publishing it.
2. Create buyer evidence pages only from approved source documents and customer permissions.
3. Done: English/French forms use the Worker/Resend endpoint. Next: verify private delivery records and qualified-lead follow-up.
4. CA168-L01 and CA368-Z04 specification PDFs added; resolve table/nameplate option differences during final quotation.
5. October 19: all four definitions remain available; the fresh 30-day English query now has two classified success responses and three unclassified submit outcomes. French 30-day inquiry rows remain absent and 90-day queries are truncated. Preserve historical unknowns. The connected Gmail search does not establish destination-mailbox coverage; private delivery and qualified/unqualified/duplicate/spam/unreviewed aggregates remain an operational review. Reporting now passes 41 tests; the existing form/remount regressions remain in place.

## P2 - Demand-Led Content Expansion

1. Select the first country or regional page from actual Search Console impressions, not assumptions.
2. Publish original field content: installation photos, commissioning steps, network survey examples, pilot criteria and engineering answers.
3. Add real crawlable articles only when subject matter and source evidence are available.
4. Build relevant industry citations, distributor links, partner references and digital PR outside the repository.
5. Review whether CIU, DCU and gateway products merit standalone pages based on search and buyer behavior.

## P3 - Platform Maintenance

1. Plan and test a future Next.js major-version upgrade; current production is static export, but the Next.js 14 package line receives audit advisories.
2. Add automated accessibility and performance checks after the route architecture stabilizes.
3. Rechecked October 19: Search Console reports insufficient CWV usage data for both Mobile and Desktop, and 13 HTTPS / 0 non-HTTPS URLs with no issues. Revisit CWV after traffic reaches a useful level; do not mark insufficient data as a performance pass. Production English/French Turnstile loading and return navigation were verified automatically successful in native Chrome on October 13.
4. Keep the product/FAQ/SEO registries and generated sitemap in parity through `npm run verify:seo`.
