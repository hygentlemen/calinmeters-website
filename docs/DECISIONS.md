# Decisions

## Project Identity

- Website name: CalinMeters.
- Legal company/entity name: Shenzhen Calinmeter Co., Ltd.
- Primary domain: `https://calinmeters.com/`.
- Preferred citation: `Shenzhen Calinmeter Co., Ltd. (CalinMeters)`.

## Service Category

- The site presents smart prepaid metering products and utility metering solutions.
- Primary product categories: Energy Meter, Water Meter, Gas Meter, CIU, DCU, Gateway.
- Primary SEO/GEO topics: STS prepaid electricity meter, STS prepaid water meter and STS prepaid gas meter.
- LoRaWAN, token workflow, meter form factor, AMI and regional phrases are supporting topics. They must reinforce the relevant category/model page instead of competing with the three primary pages.

## Deployment

- Deployment target is GitHub Pages, not Vercel.
- `main` is the production branch.
- Static export output is `out/`.
- `public/CNAME` must remain in the repository and be copied into `out/CNAME`.
- GitHub Actions should use Node 24.

## Domain and HTTPS

- `calinmeters.com` is the primary public domain.
- DNS and GitHub Pages custom domain are expected to support HTTPS.
- Do not change DNS/deployment assumptions without checking the live site and GitHub Pages settings.

## ICP / Hosting Strategy

- Current repository reflects overseas static hosting through GitHub Pages.
- No ICP/备案 number or mainland China hosting configuration is stored in this codebase.
- If China mainland hosting becomes necessary, treat it as a separate infrastructure project.

## Transactions and Legal Positioning

- The website is an inquiry and product information site.
- No online checkout, cart, payment, price list, or legally binding quote flow is implemented.
- Product pricing and commercial terms should be handled by direct communication with the company.
- Do not add transaction claims, payment promises, or certifications without source confirmation.

## Contact Handling

- Primary recipient email: `scott@szcalinmeter.com`.
- Current form behavior opens a `mailto:` draft instead of storing or sending through a backend.
- No customer inquiry database exists.

## Data Model

- Product catalog source of truth is `data/products.ts`.
- FAQ source of truth is `data/faq.ts`.
- Static assets live in `public/`.
- Do not duplicate product names, PDF paths, or FAQ answers in multiple places unless a route-specific rendering requires it.

## Page Structure

- The homepage is the company and product-portfolio hub.
- Three authority pages own the STS prepaid electricity, water and gas meter topics.
- Ten model pages are generated from `data/products.ts` through `app/products/[slug]/page.tsx`.
- Product and category links use real trailing-slash URLs; fragments are limited to homepage sections.
- Placeholder news is removed until real crawlable articles exist.

## SEO/GEO

- Keep answer-style buyer guidance on the site.
- Keep `public/llms.txt` updated when major buyer-facing content changes.
- Structured data should stay aligned with visible content.
- Prefer factual descriptions over broad claims such as "world class" unless evidence is added.
- Category pages use `CollectionPage`, `BreadcrumbList`, `ItemList` and visible FAQ markup.
- Model pages use a single `Product` entity plus `BreadcrumbList`; do not add price, offer, rating or availability data that is not present.
- Build output is the source for the production sitemap; `scripts/postbuild.mjs` generates `out/sitemap.xml`.
- `npm run verify:seo` is required before deployment.
- Country and regional pages require Search Console demand evidence and first-party value.
- A Top 5 ranking is a business target, not a deliverable that can be guaranteed by on-site changes.

## Evidence Policy

- Product datasheets may support visible model specifications when the value is clearly readable.
- A datasheet reference to a standard does not authorize a broad company certification claim.
- Certification, approval, price, market coverage, project history, production capacity and warranty language requires a reviewable source and explicit page-level fit.
- Project-dependent conditions must be labeled as items to confirm, not universal product promises.

## Analytics

- GA4 measurement ID is injected through `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Daily reports use GA4 property ID and Search Console site URL from GitHub Secrets.
- Download reporting should rely on GA4 enhanced `file_download`; custom product click tracking uses `specification_download`.
- Product-page download events also include the source page path.
