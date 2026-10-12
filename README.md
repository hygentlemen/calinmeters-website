# CalinMeters Website

Static English/French inquiry site for Shenzhen Calinmeter Co., Ltd. (CalinMeters): [https://calinmeters.com/](https://calinmeters.com/).

## Stack and Deployment

- Next.js 14 App Router
- React 18 and TypeScript
- Tailwind CSS
- Static export through `output: 'export'`
- GitHub Pages deployment from `main` through `.github/workflows/deploy.yml`
- Production output directory: `out/`

Do not switch deployment to Vercel without an explicit infrastructure decision. `public/CNAME` is required for the production domain.

## Local Commands

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm run verify:seo
npm run verify
npm run gsc:submit-sitemap
```

`npm run build` exports the site, preserves `CNAME` and generates `out/sitemap.xml` from the exported HTML. `data/page-modified.json` supplies known significant content/indexability dates for sitemap `lastmod`; unknown dates are omitted, and build timestamps are never substituted. `npm run verify:seo` validates route coverage, metadata, canonicals, H1s, JSON-LD, sitemap/date parity, internal links and local image/PDF references.

## SEO/GEO Page Architecture

The homepage is the company and product-portfolio hub. Three canonical authority pages own the primary search topics:

- `/products/sts-prepaid-electricity-meter/`
- `/products/sts-prepaid-water-meter/`
- `/products/sts-prepaid-gas-meter/`

Ten model pages are statically generated from the product catalog. English category and model routes are implemented in `app/(en)/products/[slug]/page.tsx` through `generateStaticParams`. Two solution pages cover solar mini-grid metering and OEM/SKD/CKD manufacturing cooperation. There are 27 public HTML routes in total.

Model pages use `WebPage` and `BreadcrumbList` JSON-LD. This is a quote-only catalog without published price/review evidence; do not emit `Product` rich-result markup or invent its required commercial/rating fields. See [the Product snippets decision](docs/PRODUCT-SNIPPETS-2026-10-12.md).

The French release adds `/fr/`, two authority pages and eight model pages under `/fr/produits/`. `data/i18n-routes.json` is the single registry for reciprocal language switching, metadata alternates and sitemap hreflang entries. All 11 French pages use `index,follow` under the owner's 2026-09-08 review waiver in `docs/FRENCH-COPY-REVIEW.md`. Source parity and technical checks remain required.

## Content Sources

- `data/products.ts`: product identity, model, slug, description, images, PDF links and published specifications
- `data/faq.ts`: FAQ questions and answers
- `data/seoPages.ts`: category-page buyer guidance that references product IDs and FAQ questions
- `public/specs/`: downloadable product datasheets
- `public/llms.txt`: canonical GEO discovery map

Do not duplicate product names or PDF paths in route files. Do not add certification, approval, price, market, production-capacity, project-history or warranty claims without a reviewable source.

## Analytics and Automation

- GA4 uses `NEXT_PUBLIC_GA_MEASUREMENT_ID` during the production build.
- The English and French inquiry forms use the public repository variables `NEXT_PUBLIC_INQUIRY_ENDPOINT` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- The static site posts to the separate `workers/inquiry` Cloudflare Worker, which uses the official Resend SDK to deliver mail from `info@calinmeters.com` to `scott@szcalinmeter.com` with the validated customer email as Reply-To.
- Public contact links, fallback messages, FAQ and Organization metadata use `scott@szcalinmeter.com` from `lib/site.ts`. The authenticated Resend sender is a separate delivery setting; changing the public/recipient address does not require changing that sender.
- `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` and `RATE_LIMIT_KEY_SECRET` exist only as Cloudflare Worker secrets; never expose them to the website build.
- Specification clicks emit `specification_download` events.
- Daily GA4/Search Console reporting runs through `.github/workflows/daily-analytics-report.yml`.
- The weekly SEO/GEO work item runs through `.github/workflows/seo-geo-weekly.yml`.
- Sitemap submission is available through the manually dispatched `.github/workflows/search-console-submit.yml` workflow. Its OAuth refresh token must include `https://www.googleapis.com/auth/webmasters`; the read-only scope used for reports cannot submit a sitemap.

Production report workflows use GitHub Secrets documented in `docs/ANALYTICS-AUTOMATION.md`. Never commit OAuth credentials, webhook URLs, keys or tokens.

## Repository Layout

```text
app/                    App Router pages, layout and global CSS
components/             Homepage, catalog, analytics and structured-data UI
data/                   Product, FAQ and authority-page content sources
lib/                    Site identity and catalog lookup helpers
public/                 Images, PDFs, CNAME and search discovery files
scripts/                Postbuild, SEO verification and reporting scripts
.github/workflows/      GitHub Pages, analytics and weekly SEO automation
docs/                   Project state, decisions, plans and handoff
```

## Release Checklist

1. Run lint, typecheck, build and SEO verification.
2. Check English and French homepages plus electricity, water and gas category/model samples on desktop and mobile.
3. Push to `main` to deploy through GitHub Pages.
4. Confirm production canonical URLs and `sitemap.xml`.
5. Submit the sitemap and request indexing for the three authority pages in Google Search Console.

## Static image optimization

GitHub Pages does not run an image optimizer. `components/StaticImage.tsx` uses the checked-in `data/image-manifest.json` and content-hashed files in `public/images/optimized/` to serve real responsive `srcset` candidates. Original public URLs remain available for existing links and structured data.

After changing an image, register its original path in `scripts/optimize-images.mjs`, then run `npm run images:optimize` and `npm run verify`. Commit the generated files and manifest together. Normal builds do not need an external drive or Compositor. Source dimensions determine the HTML aspect ratio; use CSS for the display box and set `sizes` to its rendered width. Below-fold images are lazy by default; use `priority` for a hero.

The product banner was rebuilt from seven independent product cutouts. Its 2800×1200 desktop master, 1440×1200 mobile composition and editable eight-layer Compositor project are retained in `assets/image-sources/`. All desktop carousel slides share a 7:3 canvas. See [banner correction evidence](docs/BANNER-CORRECTION-2026-10-11.md) for source provenance and reproduction steps, and [initial image optimization](docs/IMAGE-OPTIMIZATION-2026-10-11.md) for the broader responsive-image pipeline.
