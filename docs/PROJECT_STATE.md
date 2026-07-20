# Project State

Last reviewed: 2026-07-17.

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
- A scheduled and manually dispatched Search Console URL Inspection workflow records Google index coverage, crawl, canonical, sitemap and rich-result status for the three authority pages using read-only credentials.

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
SEO verification passed: 14 HTML pages, 14 sitemap URLs, 13 product routes.
```

Recent Search Console daily artifacts contained no query or landing-page rows before the authority pages were added. Current traffic is very small and was previously concentrated on `/`, so ranking movement must be measured after indexing.

## Not Implemented

- Search Console sitemap submission was attempted on 2026-07-17. The site property is available, but the current GitHub OAuth refresh token has read-only Search Console scope. Replace it with a token authorized for `https://www.googleapis.com/auth/webmasters`, then rerun `Submit Search Console Sitemap`.
- Individual URL indexing requests still require Search Console UI access; Google does not provide a general-purpose indexing API for ordinary product pages.
- No reliable server-side contact submission exists; the form honestly opens the visitor's email app.
- No CMS/admin interface exists.
- No ecommerce, price list, cart, payment, quotation database or CRM exists.
- No country pages are published because current Search Console data does not yet support a specific country/topic priority.
- No verified public certification, testing, production-capacity, market-coverage or customer-case evidence pages exist.
- No real article/news library exists.
- No link-acquisition or digital-PR campaign is part of the repository.

## Current Risks and Limits

- A global Top 5 ranking cannot be guaranteed by on-site code. Indexing, query geography, competitors, domain authority, relevant backlinks and first-party evidence materially affect results.
- Search performance needs a 4-8 week post-indexing baseline before expanding into country or supporting-topic pages.
- Some catalog models do not have public PDF specifications; their pages intentionally list only current catalog facts and parameters to confirm.
- The contact form depends on a local email client.
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
