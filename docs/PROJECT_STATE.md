# Project State

Last reviewed: 2026-09-08.

Current implementation: 27 public HTML routes (16 English, 11 French). The owner authorized French `index,follow` on 2026-09-08 and waived professional copy review; see FRENCH-COPY-REVIEW.md. Both inquiry forms use the separate Worker/Resend endpoint when public configuration is present. Week 1 fixes all-site measurement and adds buyer paths, two solution pages, real company media and the CA168-L01 / CA368-Z04 PDFs on existing model routes. Release scope and source limits are recorded in COMMERCIAL-RELEASE-2026-09-08.md.

## Current Status

CalinMeters is a static Next.js inquiry site for Shenzhen Calinmeter Co., Ltd. Production is `https://calinmeters.com/`, exported to `out/` and deployed from `main` through GitHub Pages.

The site now has a crawlable SEO/GEO architecture for the three primary topics:

- STS prepaid electricity meter
- STS prepaid water meter
- STS prepaid gas meter

## Implemented

- Three statically generated authority pages:
  - `/products/sts-prepaid-electricity-meter/`
  - `/products/sts-prepaid-water-meter/`
  - `/products/sts-prepaid-gas-meter/`
- Ten statically generated model pages covering the current electricity, water and gas catalog.
- Page-specific title, description, self-referencing canonical, Open Graph and Twitter metadata.
- Homepage `Organization`, `WebSite` and category `ItemList` JSON-LD.
- Category `CollectionPage`, `BreadcrumbList`, `ItemList` and visible FAQ JSON-LD.
- Product `Product` and `BreadcrumbList` JSON-LD without invented offers, prices, ratings or availability.
- Crawlable homepage, navigation, footer, category and related-model links.
- Published specification tables transcribed conservatively from existing product PDFs.
- Buyer selection, STS workflow, quotation checklist, FAQ and inquiry content for each primary category.
- Automated postbuild sitemap generation from exported HTML.
- Automated SEO export checks for routes, titles, descriptions, canonicals, H1s, JSON-LD, links, sitemap parity, local images/PDFs and unsupported trust phrases.
- Deterministic lint and typecheck configuration.
- Network-independent build font stack.
- Next.js updated within the required major line from 14.1.0 to 14.2.35.
- Placeholder news, generic Facebook link and unsupported certification, market-count, experience, warranty, deployment-count and fixed LoRaWAN-capacity claims removed or rewritten.
- GA4 and `specification_download` tracking retained.
- `robots.txt`, `sitemap.xml`, `llms.txt` and `CNAME` retained.
- Daily analytics and weekly SEO/GEO GitHub Actions retained.
- A manually dispatched Search Console sitemap-submission workflow validates the public sitemap, submits it through the official API and reads back its status.
- A scheduled and manually dispatched Search Console URL Inspection workflow records Google index coverage, crawl, canonical, sitemap and rich-result status for the three English authority pages and all 11 French pages using read-only credentials.

## Verified Baseline

The current local export passes:

```bash
npm run lint
npm run typecheck
npm run build
npm run verify:seo
```

Expected SEO verification summary:

```text
SEO verification passed: 27 HTML pages, 27 sitemap URLs, 13 product routes, 11 localized pairs.
```

Recent Search Console daily artifacts contained no query or landing-page rows before the authority pages were added. Current traffic is very small and was previously concentrated on `/`, so ranking movement must be measured after indexing.

On 2026-07-21, the OAuth app was restored to In production and the repository refresh token was reissued through the production consent flow with GA4 read-only and Search Console write scopes. `Submit Search Console Sitemap` run `29838520351` verified the new token and successfully submitted `https://calinmeters.com/sitemap.xml`; the API readback reported zero errors, zero warnings and pending Google processing.

## Not Implemented

- The 2026-09-07 inspection reported all three English authority pages indexed; French pages need recrawling after the indexable release.
- Individual URL indexing requests still require Search Console UI access; Google does not provide a general-purpose indexing API for ordinary product pages.
- Private delivery verification and qualified-inquiry reporting still require the operator’s mail/CRM records; GA4 event counts alone do not establish lead quality.
- No CMS/admin interface exists.
- No ecommerce, price list, cart, payment, quotation database or CRM exists.
- No country pages are published because current Search Console data does not yet support a specific country/topic priority.
- Manufacturing documentation now has scoped certificate summaries and a company factory photograph; no production-capacity, pass-rate or pilot-result claims have been established.
- No real article/news library exists.
- No link-acquisition or digital-PR campaign is part of the repository.

## Current Risks and Limits

- A global Top 5 ranking cannot be guaranteed by on-site code. Indexing, query geography, competitors, domain authority, relevant backlinks and first-party evidence materially affect results.
- Search performance needs a 4-8 week post-indexing baseline before expanding into country or supporting-topic pages.
- CA168-L01 and CA368-Z04 PDFs have current-table/nameplate-image discrepancies; pages state the table values and require final ordered-configuration confirmation.
- Inquiry forms depend on the configured Worker/Resend endpoint and Turnstile; email and WhatsApp are fallback contact channels.
- The daily report depends on Google authentication and GitHub Secrets.
- `npm audit` reports advisories against the Next.js 14 package line. Production uses static files on GitHub Pages and does not run the affected Next.js server, middleware, image optimizer or WebSocket features; a future major-version upgrade should still be planned and tested separately.

## Deployment

- Production branch: `main`
- Workflow: `.github/workflows/deploy.yml`
- Runner Node version: 24
- Output: `out/`
- Required production secret: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Domain file: `public/CNAME`

No ICP filing or mainland-China hosting configuration is stored in this repository.
