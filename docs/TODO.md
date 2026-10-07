# TODO

## P0 - Production Indexing and Measurement

1. Done: September 8, 14 and 21 changes were merged and deployed in PRs #25, #27 and #29. Latest weekly review and explicit deferrals: [2026-10-05, executed October 7](weekly/2026-10-05.md).
2. Done October 7: verified all 27 production pages, 11 language pairs, 10 HTML-linked PDFs plus the gateway/DCU PDFs, `robots.txt`, `llms.txt`, sitemap and public contact. Quietly recovered the missing September 30 GSC data before comparing complete weeks. Repeat at the October 12 checkpoint or after a material release.
3. Done 2026-07-21: reissued the production OAuth token with GA4 read-only and Search Console write scopes; `Submit Search Console Sitemap` run `29838520351` completed with zero errors and warnings.
4. Done: October 5/7 inspections confirm the three English authority pages, both solution pages and English homepage indexed; gas and homepage have October 2 crawls. French pages still have six stale noindex records, four discovered/unindexed URLs and one now-unknown brass-water URL, reconfirmed October 7. Live technical checks pass. Search Console owner: live-test/request indexing for the French home and categories, then models, prioritizing brass; field CWV and manual indexing remain UI follow-ups.
5. Record the deployment date in the weekly SEO/GEO issue.
6. Obtain a matched query × country × device × page GSC export for the two complete weeks; focus on Nigeria and homepage/electricity. Existing capped marginal rows cannot establish the cause of the decline. Monitor the three primary clusters through the October 12 checkpoint.

## P1 - Evidence and Conversion

1. Collect reviewable sources for any certification, test capability, production capacity, market coverage, warranty or customer project statement before publishing it.
2. Create buyer evidence pages only from approved source documents and customer permissions.
3. Done: English/French forms use the Worker/Resend endpoint. Next: verify private delivery records and qualified-lead follow-up.
4. CA168-L01 and CA368-Z04 specification PDFs added; resolve table/nameplate option differences during final quotation.
5. Done: all-site event reporting and missing English/footer clicks are deployed and processed production reports succeed. GA4 result/product/buyer dimensions remain unavailable in the October 7 review; the property admin must configure event-scoped `result`, `product_category`, `product_id` and `buyer_type`, then verify future processed data. No historical outcome backfill is assumed.

## P2 - Demand-Led Content Expansion

1. Select the first country or regional page from actual Search Console impressions, not assumptions.
2. Publish original field content: installation photos, commissioning steps, network survey examples, pilot criteria and engineering answers.
3. Add real crawlable articles only when subject matter and source evidence are available.
4. Build relevant industry citations, distributor links, partner references and digital PR outside the repository.
5. Review whether CIU, DCU and gateway products merit standalone pages based on search and buyer behavior.

## P3 - Platform Maintenance

1. Plan and test a future Next.js major-version upgrade; current production is static export, but the Next.js 14 package line receives audit advisories.
2. Add automated accessibility and performance checks after the route architecture stabilizes.
3. Review Search Console page experience and Core Web Vitals after production traffic reaches a useful level.
4. Keep the product/FAQ/SEO registries and generated sitemap in parity through `npm run verify:seo`.
