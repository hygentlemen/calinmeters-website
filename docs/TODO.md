# TODO

## P0 - Production Indexing and Measurement

1. Done: the 2026-09-08 release was merged in PR #25 and deployed in Pages run 34242798354. Current weekly work and release evidence: [2026-09-14](weekly/2026-09-14.md).
2. Verify the three authority pages, representative model pages, `robots.txt` and `sitemap.xml` on the production domain.
3. Done 2026-07-21: reissued the production OAuth token with GA4 read-only and Search Console write scopes; `Submit Search Console Sitemap` run `29838520351` completed with zero errors and warnings.
4. Done: 2026-09-14 URL inspection reports all three English authority pages and both solution pages indexed. French indexation was authorized by the owner on 2026-09-08; verify recrawl after deployment (six stale noindex records, four discovered URLs and one unknown URL remain).
5. Record the deployment date in the weekly SEO/GEO issue.
6. Monitor the three primary query clusters by country, device and landing page for 4-8 weeks.

## P1 - Evidence and Conversion

1. Collect reviewable sources for any certification, test capability, production capacity, market coverage, warranty or customer project statement before publishing it.
2. Create buyer evidence pages only from approved source documents and customer permissions.
3. Done: English/French forms use the Worker/Resend endpoint. Next: verify private delivery records and qualified-lead follow-up.
4. CA168-L01 and CA368-Z04 specification PDFs added; resolve table/nameplate option differences during final quotation.
5. Done: all-site event reporting and missing English/footer clicks are deployed and processed production reports succeed. GA4 result/product/buyer dimensions remain unavailable as of the September 14 report; the property admin must configure them before outcome breakdowns can be verified.

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
