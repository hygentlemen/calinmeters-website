# STS Product SEO/GEO Redesign

**Date:** 2026-07-17  
**Status:** Approved for autonomous implementation  
**Primary market:** English-language Google search worldwide, with buyer intent from Africa and Southeast Asia prioritized  
**Primary audience:** Utilities, municipalities, system integrators, property operators, and metering procurement teams

## Objective

Build a crawlable, fact-based product information architecture capable of competing for these three primary topics:

1. STS prepaid electricity meter
2. STS prepaid water meter
3. STS prepaid gas meter

The implementation should improve organic visibility and generative-search citation readiness while increasing qualified specification downloads and inquiries. A Top 5 ranking is the business target, not a guarantee: ranking also depends on indexing, backlinks, verified company evidence, competitors, geography, and time.

## Evidence and Current-State Findings

- The website currently exposes only the homepage as a stable indexable HTML URL. Product categories and models are selected through client-side state and fragment links.
- `public/sitemap.xml` contains only the homepage.
- Recent automated Search Console reports contain no query or landing-page rows, so there is not yet enough demand evidence to justify scaled country landing pages.
- Search results for the three primary topics favor sites with dedicated category pages, individual model pages, visible specifications, downloadable documents, verified company evidence, and crawlable internal links.
- The homepage contains unsupported trust claims, including certification, market-count, and standards language. These conflict with the repository rule that certifications, approvals, markets, prices, and warranties require sources.
- Placeholder news items link to `#`, which weakens trust and creates dead interaction paths.
- The homepage is a client component, which ships unnecessary JavaScript and forces most content into one route.
- The baseline build depends on downloading Google Fonts and fails when that network resource is unavailable.
- `next.config.js` defines empty custom-route functions that produce static-export warnings.
- ESLint has no committed configuration and prompts interactively instead of performing a deterministic check.
- The current JSON-LD places every product in a homepage `ItemList`, uses fragment URLs as product identities, and mixes organization, services, products, FAQ, and multiple HowTo objects in one oversized graph.

## Scope

### Phase 1: Implement Now

- Create three category authority pages:
  - `/products/sts-prepaid-electricity-meter/`
  - `/products/sts-prepaid-water-meter/`
  - `/products/sts-prepaid-gas-meter/`
- Create one stable detail page for each electricity, water, and gas product variant currently present in `data/products.ts`.
- Turn the homepage into a concise entity and portfolio hub with crawlable links to the three authority pages and model pages.
- Add page-specific metadata, self-referencing canonicals, Open Graph data, breadcrumbs, and type-appropriate JSON-LD.
- Add an automatically maintained sitemap containing every public HTML page.
- Keep `robots.txt`, `llms.txt`, GA4, `CNAME`, PDF paths, and GitHub Pages deployment.
- Remove or rewrite unsupported claims and broken news interactions.
- Make build and lint deterministic.
- Add automated checks for metadata, structured data, routes, assets, and internal links.
- Update project documentation to reflect GitHub Pages and the new SEO architecture.

### Phase 2: Prepare but Do Not Mass-Generate

- Country or region pages based on Search Console query/country evidence.
- Procurement case studies supported by customer permission and verifiable project facts.
- Certification, testing, factory-capability, production-capacity, and warranty evidence pages supported by source documents.
- Original field content such as installation photos, commissioning checklists, network survey examples, videos, and engineering articles.
- Digital PR, relevant industry citations, distributor links, and utility ecosystem backlinks.

### Explicit Non-Goals

- No Vercel migration.
- No ecommerce, price claims, checkout, or binding quote flow.
- No invented technical specifications, approvals, certifications, case studies, markets, performance data, or warranties.
- No thin country pages or scaled AI articles without first-party value.
- No public certificate files unless the user later provides and approves them.
- No backend or CRM integration in this phase.

## Information Architecture

### Homepage

The homepage remains the canonical company/brand page. It should:

- State clearly that Shenzhen Calinmeter Co., Ltd. (CalinMeters) supplies prepaid electricity, water, and gas metering products and supporting AMI devices.
- Link through normal `<a href>` URLs to the three authority pages.
- Show representative products without duplicating the full authority-page content.
- Preserve useful company, solutions, FAQ, and contact content.
- Remove placeholder news cards until real articles exist.
- Avoid unverified trust claims.

### Category Authority Pages

Each category page owns one primary keyword and its close buyer-intent variants. It includes:

1. One descriptive H1 containing the primary topic naturally.
2. A 40–70 word direct answer defining the product and buyer fit.
3. A product comparison grid sourced from `data/products.ts`.
4. A selection framework covering application, meter type, customer access, communication, integration, and destination requirements.
5. A concise STS workflow explanation relevant to the utility type.
6. A procurement information checklist for quotation requests.
7. Category-specific FAQ content sourced from `data/faq.ts` or a route-specific FAQ mapping without duplicating answers.
8. Related product and supporting-device links.
9. A visible inquiry call to action with category context.

The pages must be useful without JavaScript and must not rely on keyword repetition.

### Product Detail Pages

Each current electricity, water, and gas model receives a stable product URL. Product pages include:

1. Model name and exact meter type.
2. Direct product summary sourced from `data/products.ts`.
3. Product image with descriptive alt text and intrinsic dimensions.
4. Verified highlights and specifications extracted from the existing product PDF when available.
5. Application and buyer-fit guidance written conservatively.
6. Communication and STS-prepayment explanation only where supported by the product source.
7. Specification PDF link using the existing path and GA4 download event.
8. Related models and a link back to the category authority page.
9. A quotation checklist and contact call to action.

Products without a source PDF may receive a page using only current verified catalog facts. Missing values must be labeled as items to confirm for quotation, never guessed.

## Content and Data Boundaries

- `data/products.ts` remains the source of truth for category names, model names, descriptions, images, and PDF paths.
- Add stable slugs and category associations to the existing product data rather than duplicating product identities in route files.
- Route-specific buyer guidance, keyword targets, metadata, FAQ selection, and comparison copy live in a focused SEO content registry that references product IDs.
- Existing PDFs are factual source material. Extract only statements visible in those files; preserve ambiguity where a PDF is unclear.
- FAQ content remains sourced from `data/faq.ts`. Page mappings reference exact questions rather than copying answer text.
- Entity naming stays consistent: `Shenzhen Calinmeter Co., Ltd.` for the legal entity and `CalinMeters` for the brand/site.

## Page Rendering and Components

- Convert `app/page.tsx` back to a server component. Keep interaction only in focused client islands such as navigation, carousel, category filters, FAQ toggles, analytics, and the contact form.
- Add a static dynamic route at `app/products/[slug]/page.tsx` using `generateStaticParams` and `generateMetadata` for all category and product slugs.
- Resolve page type from shared registries and call `notFound()` for unknown slugs.
- Build focused reusable server components for breadcrumbs, direct-answer blocks, product lists, product specifications, related links, calls to action, and JSON-LD.
- Keep components small enough that category and product rendering can be reviewed independently.
- Use crawlable Next.js links for all route navigation and retain fragment links only for within-page sections.

## Metadata and Structured Data

### Metadata

Every public HTML page receives:

- A unique title that leads with the page topic or model.
- A factual description written for procurement intent.
- A self-referencing canonical URL.
- Open Graph title, description, URL, image, and image alt text.
- Index/follow robots metadata.

The obsolete keyword meta tag is not used as a ranking tactic.

### JSON-LD

- Homepage: `Organization` and `WebSite` only, plus a concise `ItemList` of crawlable category URLs if helpful.
- Category pages: `CollectionPage`, `BreadcrumbList`, and an `ItemList` that links to actual model URLs.
- Product pages: one `Product` entity and `BreadcrumbList` matching visible content. Do not add `Offer`, price, availability, rating, review, certification, or identifiers not supported by current sources.
- FAQ markup is emitted only for questions visibly rendered on the same page. It is treated as semantic support rather than a promised rich result.
- Structured-data URLs use stable page URLs, not fragments.
- JSON-LD serialization escapes `<` to prevent script injection.

## GEO and Citation Readiness

GEO work follows the same factual foundation as SEO:

- Put the direct answer near the top of each authority page.
- Use short, self-contained paragraphs and comparison tables that remain meaningful when quoted.
- Define STS, CIU, AMI, GPRS, and LoRaWAN before relying on abbreviations.
- Keep product, company, communication, and workflow terminology consistent across visible copy, metadata, JSON-LD, sitemap, and `llms.txt`.
- Distinguish facts, selection guidance, and project-dependent conditions.
- State which parameters must be confirmed rather than presenting universal claims.
- Update `llms.txt` with the new canonical pages and a compact map of what each page answers.
- Do not add special AI crawler directives that reduce normal search visibility.

## Trust and Content Hygiene

- Remove `STS certified`, `Certified Quality`, `multiple product certifications`, `15+ years`, `50+ countries`, and similar statements unless a repository source proves each claim.
- Replace broad superlatives with buyer-verifiable descriptions of available products, documents, and configuration choices.
- Remove the current placeholder news section from navigation and homepage rendering. Preserve the component only if it is converted to real crawlable articles in a future phase.
- Keep contact details consistent in footer, contact section, metadata, JSON-LD, and `llms.txt`.
- The contact form may remain mail-client based in this phase, but the action must be described honestly and include direct email and WhatsApp fallbacks.

## Technical SEO and Reliability

- Replace build-time Google Font fetching with a system font stack or checked-in local font.
- Remove empty `rewrites`, `redirects`, and `headers` functions from the static-export configuration.
- Add a committed ESLint configuration so `npm run lint` is non-interactive.
- Generate `public/sitemap.xml` from the route registry before build while keeping the required file in the repository/output.
- Preserve `public/robots.txt` and its absolute sitemap reference.
- Preserve `public/CNAME` and GitHub Pages static export.
- Use optimized HTML image attributes while retaining `images.unoptimized: true` for static export.
- Avoid homepage-wide client rendering and unnecessary hydration.
- Ensure every route returns a static HTML page in `out/`.

## Analytics and Measurement

- Continue GA4 page-view measurement through the existing environment variable.
- Preserve `specification_download` events and include product ID, name, file name, link URL, and source page.
- Add category/model context to inquiry links where practical without collecting form data in the site.
- Update the daily report interpretation so new product routes appear as individual landing pages.
- Track these weekly indicators:
  - Indexed authority and model pages
  - Impressions, clicks, CTR, and average position for the three primary query clusters
  - Countries producing relevant impressions
  - Authority/model page entrances
  - Specification downloads
  - Email and WhatsApp inquiry clicks
- Ranking assessment should use country/device-aware Search Console data, not one manual search result.

## Verification

Automated verification must cover:

- `npm run lint`
- `npm run build`
- All expected static route files under `out/`
- Unique title, description, canonical, H1, and JSON-LD on every public HTML page
- Sitemap URL coverage and route parity
- No broken local image or PDF references
- No `href="#"` placeholders
- No forbidden unsupported trust phrases
- JSON parseability of every `application/ld+json` block
- Internal crawlability from homepage to categories and from categories to products

Browser verification must cover desktop and mobile layouts for:

- Homepage
- One electricity category/product pair
- One water category/product pair
- The gas category/product pair
- Navigation, breadcrumbs, PDF download, inquiry actions, and FAQ interaction

## Release and Follow-Up

1. Build and validate the static export locally.
2. Commit code and content changes without secrets or public certificates.
3. Deploy through the existing GitHub Pages workflow.
4. Inspect the deployed canonical pages, sitemap, structured data, and mobile layout.
5. Submit or re-submit the sitemap in Google Search Console and request indexing for the three authority pages.
6. Establish a 4–8 week baseline before deciding which country or supporting-topic pages to add.
7. Begin authority-building work with verifiable first-party evidence and relevant industry citations; on-site changes alone are unlikely to secure a global Top 5 position.

## Acceptance Criteria

- The homepage and every new product route are statically generated and crawlable without JavaScript.
- The three primary topics each have one unambiguous canonical authority page.
- Each in-scope model has one stable detail URL linked from its category page.
- Metadata and structured data are unique, factual, and consistent with visible content.
- Sitemap, robots, `llms.txt`, navigation, and internal links reference the new canonical URLs.
- Unsupported certification, market, standards, experience, price, and warranty claims are absent.
- Build and lint complete non-interactively.
- Automated SEO checks pass.
- Desktop and mobile browser checks show no blocking layout or interaction defects.
