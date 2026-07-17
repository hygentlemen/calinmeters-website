# STS Product SEO/GEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three crawlable STS product authority pages and one factual detail page per in-scope model, then harden metadata, structured data, sitemap generation, content trust, linting, and static-export verification.

**Architecture:** Keep `data/products.ts` and `data/faq.ts` as product and FAQ sources of truth, add an SEO content registry that references those IDs, and statically render all category/model routes through `app/products/[slug]/page.tsx`. The homepage becomes a server-rendered company hub with focused client islands; a postbuild verifier derives production sitemap coverage from exported HTML.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5, Tailwind CSS 3, static export to GitHub Pages, Node.js verification scripts, GA4.

## Global Constraints

- Production stays on GitHub Pages with `output: 'export'`.
- Preserve `public/CNAME`, GA4, `robots.txt`, `sitemap.xml`, `llms.txt`, all current image paths, and all current PDF paths.
- Do not publish certificate files.
- Do not claim certifications, approvals, prices, markets, production capacity, experience duration, installed base, or warranty without a repository source.
- `data/products.ts` remains the source of truth for product identity, images, descriptions, and PDF paths.
- `data/faq.ts` remains the source of truth for FAQ answers.
- The three primary canonical topics are exactly `STS prepaid electricity meter`, `STS prepaid water meter`, and `STS prepaid gas meter`.
- All new public pages must render as static HTML and work without client-side JavaScript.
- Every task preserves a buildable, reviewable state and must not commit secrets or unrelated user changes.

---

## File Map

### Create

- `data/seoPages.ts` — category authority-page content keyed by category slug and referencing product IDs/FAQ questions.
- `lib/catalog.ts` — typed catalog flattening, lookup, slug, and related-product helpers.
- `lib/site.ts` — canonical site URL, company identity, contact details, and URL builder.
- `components/catalog/Breadcrumbs.tsx` — visible crawlable breadcrumb navigation.
- `components/catalog/CategoryAuthorityPage.tsx` — server-rendered authority-page layout.
- `components/catalog/ProductDetailPage.tsx` — server-rendered product detail layout.
- `components/catalog/ProductPdfLink.tsx` — small client island for GA4 PDF download tracking.
- `components/catalog/InquiryCta.tsx` — reusable category/model-aware contact links.
- `components/JsonLd.tsx` — safe JSON-LD serialization.
- `app/products/[slug]/page.tsx` — static route dispatcher, metadata generator, and page JSON-LD composition.
- `scripts/postbuild.mjs` — retain CNAME and generate the production sitemap from exported HTML.
- `scripts/verify-seo.mjs` — verify exported routes, metadata, canonical URLs, H1s, JSON-LD, links, assets, and forbidden claims.
- `.eslintrc.json` — deterministic strict Next.js lint configuration.

### Modify

- `data/products.ts` — add stable category/model slugs and conservative product detail fields.
- `app/layout.tsx` — remove network-fetched font and simplify site-wide metadata.
- `app/page.tsx` — server-render the homepage shell and homepage JSON-LD.
- `app/globals.css` — add system font stack and shared content styles only where needed.
- `components/Navbar.tsx` — use canonical route links and accessible mobile controls.
- `components/ProductsSection.tsx` — expose category/model URLs as anchors and reduce homepage duplication.
- `components/FeaturesSection.tsx` — replace unsupported certification/standards claims.
- `components/AboutSection.tsx` — remove unsupported experience and country-count claims.
- `components/NewsSection.tsx` — remove from homepage/nav; retain no broken `href="#"` links.
- `components/Footer.tsx` — add crawlable authority-page links and consistent contact/entity text.
- `components/ContactSection.tsx` — keep mail-client behavior honest and add direct fallbacks/tracking-friendly links.
- `components/StructuredData.tsx` — reduce homepage graph to organization/site entities with real route URLs, or replace its homepage use with `JsonLd`.
- `public/sitemap.xml` — update committed fallback to the complete route set.
- `public/llms.txt` — list new canonical pages and their answer scope.
- `next.config.js` — remove empty unsupported static-export hooks.
- `package.json` — add deterministic typecheck/SEO verification and postbuild commands.
- `README.md` — replace obsolete Vercel deployment guidance with GitHub Pages/static-export instructions.
- `docs/PROJECT_STATE.md`, `docs/TODO.md`, `docs/DECISIONS.md`, `docs/HANDOFF.md` — record the new route architecture, checks, and remaining off-site work.

---

### Task 1: Make Local Quality Checks Deterministic

**Files:**

- Create: `.eslintrc.json`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `next.config.js`
- Modify: `package.json`

**Interfaces:**

- Consumes: current Next.js static-export configuration.
- Produces: non-interactive `npm run lint`, network-independent `npm run build`, and `npm run typecheck`.

- [ ] **Step 1: Record the current failures**

Run:

```bash
npm run lint
npm run build
```

Expected baseline: lint prompts for configuration; build fails when `next/font/google` cannot fetch Inter and logs warnings for empty `rewrites`, `redirects`, and `headers` hooks.

- [ ] **Step 2: Commit strict lint configuration**

Create `.eslintrc.json`:

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 3: Remove the build-time font network dependency**

Change `app/layout.tsx` so it no longer imports `Inter` from `next/font/google` and renders:

```tsx
<html lang="en">
  <body>
    <GoogleAnalytics />
    {children}
  </body>
</html>
```

Add this base rule to `app/globals.css`:

```css
body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

- [ ] **Step 4: Remove empty unsupported custom-route hooks**

Keep `next.config.js` equivalent to:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

module.exports = nextConfig
```

- [ ] **Step 5: Add typecheck command**

Add to `package.json` scripts:

```json
"typecheck": "tsc --noEmit"
```

- [ ] **Step 6: Verify deterministic checks**

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

Expected: all commands run without a prompt; build does not access Google Fonts and produces `out/index.html`.

- [ ] **Step 7: Commit**

```bash
git add .eslintrc.json app/layout.tsx app/globals.css next.config.js package.json
git commit -m "chore: make static build checks deterministic"
```

### Task 2: Add Stable Catalog URLs and Factual Page Content

**Files:**

- Modify: `data/products.ts`
- Create: `data/seoPages.ts`
- Create: `lib/catalog.ts`
- Create: `lib/site.ts`

**Interfaces:**

- Produces:
  - `ProductCategory.slug: string`
  - `ProductVariant.slug: string`
  - `ProductVariant.highlights?: string[]`
  - `ProductVariant.verifiedSpecs?: Array<{ label: string; value: string }>`
  - `ProductVariant.applications?: string[]`
  - `categorySeoPages: Record<string, CategorySeoPage>`
  - `getCategoryBySlug(slug: string): ProductCategory | undefined`
  - `getProductBySlug(slug: string): CatalogProduct | undefined`
  - `getAllCatalogSlugs(): string[]`
  - `absoluteUrl(path: string): string`

- [ ] **Step 1: Define exact canonical slugs**

Add category slugs:

```ts
'Energy Meter' -> 'sts-prepaid-electricity-meter'
'Water Meter' -> 'sts-prepaid-water-meter'
'Gas Meter' -> 'sts-prepaid-gas-meter'
```

Add product slugs:

```ts
ca168-lorawan -> ca168-lorawan-sts-prepaid-electricity-meter
ca168-gprs -> ca168-gprs-sts-prepaid-electricity-meter
ca168-sts -> ca168-sts-prepaid-electricity-meter
ca368-gprs -> ca368-gprs-sts-prepaid-three-phase-electricity-meter
ca368-sts -> ca368-sts-prepaid-three-phase-electricity-meter
ct-meter -> ct-operated-electricity-meter
water-multi-jet-plastic -> sts-prepaid-multi-jet-water-meter-plastic
water-multi-jet-brass -> sts-prepaid-multi-jet-water-meter-brass
water-ultrasonic -> sts-prepaid-ultrasonic-water-meter
ca768-lorawan -> ca768-lorawan-sts-prepaid-gas-meter
```

CIU, DCU, and Gateway remain homepage support products in this phase and do not receive fabricated STS category associations.

- [ ] **Step 2: Extract only verified PDF facts**

For each existing in-scope PDF, render/text-extract the document and enter only clearly visible values into `verifiedSpecs`. Use no value for unclear or absent fields. Keep current product descriptions for models without PDFs.

Commands:

```bash
pdftotext public/specs/energy-meter/CA168-LoRaWAN.pdf -
pdftotext public/specs/energy-meter/CA168-GPRS.pdf -
pdftotext public/specs/energy-meter/CA368-GPRS.pdf -
pdftotext public/specs/energy-meter/CA368-STS.pdf -
pdftotext public/specs/water-meter/Multi-Jet-Plastic.pdf -
pdftotext public/specs/water-meter/Multi-Jet-Brass.pdf -
pdftotext public/specs/water-meter/Ultrasonic.pdf -
pdftotext public/specs/gas-meter/CA768-LoRaWAN.pdf -
```

Expected: every transcribed value can be located verbatim in its source PDF; no certification conclusion is inferred from a logo or general standard reference.

- [ ] **Step 3: Implement site identity constants**

Create `lib/site.ts` with this public interface:

```ts
export const site = {
  url: 'https://calinmeters.com',
  name: 'CalinMeters',
  legalName: 'Shenzhen Calinmeter Co., Ltd.',
  email: 'scott@szcalinmeter.com',
  phone: '+8613713788753',
  whatsappUrl: 'https://wa.me/8613713788753',
} as const;

export function absoluteUrl(path = '/') {
  return new URL(path, site.url).toString();
}
```

- [ ] **Step 4: Implement typed catalog lookups**

Create `lib/catalog.ts` so it flattens existing category/subcategory variants without duplicating names or PDF paths. The returned product type must retain its parent category and subcategory:

```ts
export interface CatalogProduct {
  product: ProductVariant;
  category: ProductCategory;
  subCategoryName?: string;
}
```

Only the three in-scope categories participate in `getAllCatalogSlugs()`.

- [ ] **Step 5: Create the three authority-page records**

Create `data/seoPages.ts` with one record per exact category slug. Each record contains:

```ts
export interface CategorySeoPage {
  slug: string;
  primaryKeyword: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  directAnswer: string;
  intro: string;
  selectionSteps: Array<{ title: string; text: string }>;
  quotationChecklist: string[];
  faqQuestions: string[];
  productIds: string[];
}
```

Use these title/H1 pairs:

```text
STS Prepaid Electricity Meters for Utility Projects
STS Prepaid Water Meters for Utility and Community Projects
STS Prepaid Gas Meter with Token Prepayment and Remote Reading
```

Direct answers must explain the product, STS token role, and project-dependent communication in 40–70 words. Electricity maps to six existing electricity IDs, water to three existing water IDs, and gas to `ca768-lorawan`.

- [ ] **Step 6: Validate types and claims**

Run:

```bash
npm run typecheck
rg -n -i "certified|certification|approved|warranty|countries served|years experience" data/products.ts data/seoPages.ts
```

Expected: typecheck passes; any match is a buyer instruction to confirm destination requirements, not a claim that CalinMeters already holds an approval.

- [ ] **Step 7: Commit**

```bash
git add data/products.ts data/seoPages.ts lib/catalog.ts lib/site.ts
git commit -m "feat: define crawlable STS product catalog"
```

### Task 3: Build Static Category and Product Routes

**Files:**

- Create: `components/JsonLd.tsx`
- Create: `components/catalog/Breadcrumbs.tsx`
- Create: `components/catalog/InquiryCta.tsx`
- Create: `components/catalog/ProductPdfLink.tsx`
- Create: `components/catalog/CategoryAuthorityPage.tsx`
- Create: `components/catalog/ProductDetailPage.tsx`
- Create: `app/products/[slug]/page.tsx`

**Interfaces:**

- Consumes: `categorySeoPages`, catalog helpers, current GA4 `trackEvent`, and `faqCategories`.
- Produces: 13 static category/product pages, unique metadata, visible breadcrumbs, category JSON-LD, and product JSON-LD.

- [ ] **Step 1: Add safe JSON-LD component**

Implement:

```tsx
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
```

- [ ] **Step 2: Add visible breadcrumb navigation**

`Breadcrumbs` accepts `Array<{ label: string; href?: string }>` and emits a `<nav aria-label="Breadcrumb">` with real links for Home and category ancestors. The final item is text with `aria-current="page"`.

- [ ] **Step 3: Add tracked PDF link island**

`ProductPdfLink` accepts `productId`, `productName`, `href`, and `label`; on click it sends the existing `specification_download` event including `source_page: window.location.pathname` before opening the PDF in a new tab.

- [ ] **Step 4: Build category authority renderer**

The category renderer must output, in order:

1. Breadcrumbs
2. H1 and direct answer
3. Product cards with normal links to model routes
4. Selection steps
5. STS workflow explanation
6. Quotation checklist
7. Visible mapped FAQs
8. Inquiry CTA

Every page includes a link back to `/` and to at least two other authority pages.

- [ ] **Step 5: Build product renderer**

The product renderer must output, in order:

1. Breadcrumbs
2. Product H1, summary, image, and category link
3. Verified highlights/specifications when present
4. Honest `Confirm for your project` list for voltage/current/size/flow/communication/compliance parameters that vary
5. Existing PDF link when present
6. Related model links from the same category
7. Inquiry CTA

Never display an empty specification table or a fabricated placeholder value.

- [ ] **Step 6: Implement static route dispatcher**

`app/products/[slug]/page.tsx` must:

```ts
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCatalogSlugs().map((slug) => ({ slug }));
}
```

`generateMetadata` resolves category first, then product, and returns unique title, description, canonical, Open Graph URL/image/alt, and index/follow metadata. Unknown slugs call `notFound()`.

- [ ] **Step 7: Emit page-type JSON-LD**

Category pages emit `CollectionPage`, `BreadcrumbList`, and `ItemList` with actual product URLs. Product pages emit one `Product` without offers/ratings plus `BreadcrumbList`. FAQ entities are included only for questions rendered on that category page.

- [ ] **Step 8: Verify static routes**

Run:

```bash
npm run lint
npm run typecheck
npm run build
find out/products -name index.html | sort
```

Expected: exactly 13 in-scope category/model HTML files exist under `out/products/**/index.html`.

- [ ] **Step 9: Commit**

```bash
git add app/products components/catalog components/JsonLd.tsx
git commit -m "feat: add STS category and product pages"
```

### Task 4: Turn the Homepage into a Crawlable Entity Hub

**Files:**

- Modify: `app/page.tsx`
- Modify: `components/StructuredData.tsx`
- Modify: `components/Navbar.tsx`
- Modify: `components/ProductsSection.tsx`
- Modify: `components/FeaturesSection.tsx`
- Modify: `components/AboutSection.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/ContactSection.tsx`
- Stop rendering: `components/NewsSection.tsx`

**Interfaces:**

- Consumes: canonical category/model routes.
- Produces: server-rendered homepage shell, real internal links, honest trust copy, and homepage-only entity JSON-LD.

- [ ] **Step 1: Remove the homepage client boundary**

Delete `'use client'` from `app/page.tsx`. Continue rendering client components as isolated children. Remove `NewsSection` from imports and JSX.

- [ ] **Step 2: Simplify homepage JSON-LD**

Homepage JSON-LD contains:

- `Organization` with the visible legal name, site URL, logo, email, phone, and address.
- `WebSite` with the organization as publisher.
- An `ItemList` containing the three category authority URLs.

Remove fragment-URL product entities, service claims, and HowTo entities from the homepage graph.

- [ ] **Step 3: Replace fragment-only product navigation**

Desktop and mobile product menus must use:

```text
/products/sts-prepaid-electricity-meter/
/products/sts-prepaid-water-meter/
/products/sts-prepaid-gas-meter/
```

Keep CIU/DCU/Gateway links as homepage fragments until they receive real pages. Add `aria-expanded`, `aria-controls`, and an accessible menu label to the mobile button.

- [ ] **Step 4: Add real product anchors to homepage cards**

Each in-scope category overview and model card gets a normal crawlable link to its canonical route. Interactive filtering can remain, but the HTML must expose the authority/model link regardless of filter state.

- [ ] **Step 5: Remove unsupported trust claims**

Apply exact replacements:

```text
"Secure Prepaid" description -> "Token-based prepaid options with project-specific vending and customer access workflows"
"Certified Quality" -> "Project Configuration"
"International standards and multiple product certifications" -> "Confirm destination standards, utility specifications, and documentation before final model selection"
"Trusted by customers worldwide" -> "Metering products and project configuration support"
```

Remove the `15+ Years Experience` and `50+ Countries Served` statistic cards. Replace them with factual cards for `Electricity, Water & Gas` and `Meters, CIUs & Network Devices`.

- [ ] **Step 6: Remove broken news paths**

Remove the News link from desktop/mobile navigation and stop rendering `NewsSection`. Confirm no rendered source contains `href="#"`.

- [ ] **Step 7: Improve entity and inquiry consistency**

Use `Shenzhen Calinmeter Co., Ltd. (CalinMeters)` consistently in about/footer copy. Add direct `mailto:` and `https://wa.me/8613713788753` links in the contact/footer areas and describe the form as opening the visitor's email app.

- [ ] **Step 8: Verify homepage output**

Run:

```bash
npm run lint
npm run typecheck
npm run build
rg -n -i "certified|multiple product certifications|50\+|15\+|href=\"#\"" out/index.html
rg -n "/products/sts-prepaid-(electricity|water|gas)-meter/" out/index.html
```

Expected: forbidden-claim search has no matches; all three category URLs are present in static homepage HTML.

- [ ] **Step 9: Commit**

```bash
git add app/page.tsx components/StructuredData.tsx components/Navbar.tsx components/ProductsSection.tsx components/FeaturesSection.tsx components/AboutSection.tsx components/Footer.tsx components/ContactSection.tsx
git commit -m "refactor: make homepage a crawlable product hub"
```

### Task 5: Generate and Verify the SEO Export

**Files:**

- Create: `scripts/postbuild.mjs`
- Create: `scripts/verify-seo.mjs`
- Modify: `package.json`
- Modify: `public/sitemap.xml`
- Preserve: `public/robots.txt`

**Interfaces:**

- Consumes: exported `out/**/*.html`, public assets, canonical domain.
- Produces: production `out/sitemap.xml`, copied `out/CNAME`, and a failing verification command for SEO regressions.

- [ ] **Step 1: Replace shell postbuild with Node postbuild**

`scripts/postbuild.mjs` must:

1. Copy `public/CNAME` to `out/CNAME`.
2. Recursively find `out/index.html` and `out/**/index.html`.
3. Exclude any 404 page.
4. Convert each file to an absolute trailing-slash URL under `https://calinmeters.com`.
5. Sort with `/` first and write escaped XML to `out/sitemap.xml`.

Set:

```json
"postbuild": "node scripts/postbuild.mjs",
"verify:seo": "node scripts/verify-seo.mjs"
```

- [ ] **Step 2: Add export verification**

For every exported public HTML page, `scripts/verify-seo.mjs` checks:

- exactly one non-empty `<title>`
- one meta description
- one absolute self-referencing canonical
- one visible H1
- parseable JSON-LD
- no `href="#"`
- no unsupported trust phrases
- every root-relative image/PDF link exists in `out/`
- every root-relative HTML route resolves to an exported file

It also checks that every public HTML URL appears exactly once in `out/sitemap.xml`, that robots references the absolute sitemap, and that the 13 expected product routes exist.

- [ ] **Step 3: Update committed sitemap fallback**

Write all 14 HTML URLs (homepage plus 13 category/model routes) to `public/sitemap.xml` using absolute canonical trailing-slash URLs. Use one accurate `lastmod` value of `2026-07-17` for this release and omit ignored `priority`/`changefreq` fields.

- [ ] **Step 4: Run the verifier**

Run:

```bash
npm run build
npm run verify:seo
```

Expected:

```text
SEO verification passed: 14 HTML pages, 14 sitemap URLs, 13 product routes.
```

- [ ] **Step 5: Commit**

```bash
git add scripts/postbuild.mjs scripts/verify-seo.mjs package.json public/sitemap.xml
git commit -m "test: verify static SEO export"
```

### Task 6: Update GEO Discovery and Project Documentation

**Files:**

- Modify: `public/llms.txt`
- Modify: `README.md`
- Modify: `docs/PROJECT_STATE.md`
- Modify: `docs/TODO.md`
- Modify: `docs/DECISIONS.md`
- Modify: `docs/HANDOFF.md`

**Interfaces:**

- Consumes: final canonical route inventory and verification commands.
- Produces: accurate human/agent handoff and canonical GEO discovery map.

- [ ] **Step 1: Rewrite the canonical page map in `llms.txt`**

List the homepage, three authority pages, and ten model pages. For each authority page, describe in one sentence the buyer questions it answers. Remove fragment URLs as primary solution-page references.

- [ ] **Step 2: Correct README deployment and commands**

Replace Vercel sections with:

```text
Production deployment: GitHub Pages via .github/workflows/deploy.yml
Static output: out/
Required production environment variable: NEXT_PUBLIC_GA_MEASUREMENT_ID
Required checks: npm run lint, npm run typecheck, npm run build, npm run verify:seo
```

- [ ] **Step 3: Record completed and remaining work**

Update project docs to state:

- three authority pages and ten model pages now exist
- sitemap is generated from exported HTML
- no certification/case/country claims are published without sources
- country pages, evidence pages, real articles, reliable form submission, and authority-building remain Phase 2
- Search Console indexing requests and 4–8 week observation are required after deployment

- [ ] **Step 4: Check consistency**

Run:

```bash
rg -n "Vercel|homepage only|no individual product|fragment" README.md docs public/llms.txt
npm run verify:seo
```

Expected: remaining matches describe historical context or explicit non-goals, not the current architecture.

- [ ] **Step 5: Commit**

```bash
git add public/llms.txt README.md docs/PROJECT_STATE.md docs/TODO.md docs/DECISIONS.md docs/HANDOFF.md
git commit -m "docs: hand off STS SEO product architecture"
```

### Task 7: Full Static and Browser Verification

**Files:**

- Modify only files required to fix defects discovered during verification.

**Interfaces:**

- Consumes: complete implementation.
- Produces: verified desktop/mobile static site suitable for GitHub Pages deployment.

- [ ] **Step 1: Run complete automated checks**

```bash
npm run lint
npm run typecheck
npm run build
npm run verify:seo
git diff --check
```

Expected: every command exits zero.

- [ ] **Step 2: Start a static export server**

```bash
npx serve out -l 4173
```

Expected: server listens on `http://localhost:4173` and serves trailing-slash routes.

- [ ] **Step 3: Verify desktop and mobile route samples**

At 1440×1000 and 390×844, inspect:

```text
/
/products/sts-prepaid-electricity-meter/
/products/ca168-gprs-sts-prepaid-electricity-meter/
/products/sts-prepaid-water-meter/
/products/sts-prepaid-ultrasonic-water-meter/
/products/sts-prepaid-gas-meter/
/products/ca768-lorawan-sts-prepaid-gas-meter/
```

Check navigation, H1 visibility, image layout, comparison overflow, breadcrumbs, FAQ controls, PDF links, email/WhatsApp links, and absence of horizontal page overflow.

- [ ] **Step 4: Verify rendered metadata and JSON-LD**

For the homepage, one category page, and one product page, confirm title, description, canonical, OG URL/image, JSON-LD page type, and real internal links in browser DOM/source.

- [ ] **Step 5: Fix defects and rerun all checks**

Any defect fix must be followed by:

```bash
npm run lint && npm run typecheck && npm run build && npm run verify:seo
```

Expected: all checks pass after the final fix.

- [ ] **Step 6: Final review and commit**

```bash
git status --short
git diff --stat HEAD~1
git diff --check
git add app components data lib scripts public package.json next.config.js .eslintrc.json README.md docs
git commit -m "fix: resolve final SEO verification issues"
```

Skip the final commit if verification required no additional edits.

## Post-Deployment Actions

These require production/Search Console state and are not performed by local code alone:

1. Confirm the GitHub Pages deploy workflow succeeds.
2. Open all three authority pages on `https://calinmeters.com` and confirm status/metadata/layout.
3. Submit `https://calinmeters.com/sitemap.xml` in Search Console.
4. Request indexing for the three authority pages.
5. Annotate the deployment date in weekly SEO reporting.
6. Monitor the three query clusters by country and device for 4–8 weeks.
7. Use actual impressions to choose the first country/supporting-topic page.
8. Collect verifiable company evidence and relevant industry backlinks; local on-page work cannot guarantee a global Top 5 ranking.
