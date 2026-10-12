# Product snippets repair — October 12, 2026

## Finding

The owner opened a Google Search Console notification and requested repair. The notification says `Either "offers", "review", or "aggregateRating" should be specified`. The live property report, last updated October 11, shows **8 invalid items, 0 valid items**, with validation not started and first detection May 31. All eight current examples are French model pages crawled October 11: CA168 LoRaWAN/GPRS/STS, CA368 GPRS/STS, and plastic/brass/ultrasonic water meters. These crawl dates show renewed crawling; they do not alone prove indexing.

The two model route generators emitted Product nodes without those properties, affecting 10 English and 8 French pages even though Google's current examples include only the eight French pages. Generic Schema.org validity is different from Google's rich-result eligibility. The existing build checked JSON parsing, but did not prevent this eligibility mismatch.

## Fix and tradeoff

- All 18 quote-only model pages now emit canonical `WebPage` metadata with name, description, image and language, plus the existing `BreadcrumbList`.
- Removed Product nodes and French references to the removed `#product` entity. No offer, price, rating, review or availability is invented. Product names/specifications remain visible in HTML and linked PDFs.
- Added recursive export guards against unapproved Product types, offers and reviews, plus checks for canonical model page metadata and breadcrumbs.
- Advanced only the 18 materially changed model dates to October 12 and regenerated sitemap metadata.
- The current catalog opts out of Product rich results until genuine published offer/review data is available. This is not a new price/rating-rich-result implementation. Ordinary page indexing is a separate process.
- No layout, images, form, GA4, Worker, certificates, URL inventory or French indexability changes are included. The separate inquiry-measurement patch remains outside this repair.

## Verification and release

The new regression checks rejected all 18 old model exports before the fix. `npm run verify` then passed: i18n, TypeScript, production build/lint, 27 HTML pages, 27 sitemap URLs, 11 reciprocal language pairs and 131 image candidates. The generated body HTML, excluding script elements, is byte-identical before/after on all 27 pages; there is no rendered UI change. `git diff --check` passed.

Production deployment and Search Console validation follow this commit; release evidence is recorded on the associated pull request. Google validation acceptance must be distinguished from eventual completion; old report rows may persist until recrawled.

## References

- [Google Product snippet required properties](https://developers.google.com/search/docs/appearance/structured-data/product-snippet#structured-data-type-definitions): a name plus genuine review, aggregateRating or offers is required. An Offer requires a numeric price; zero means free, not quotation on request.
- [Google structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): markup must represent visible content; rich-result eligibility is distinct from ordinary web results.
