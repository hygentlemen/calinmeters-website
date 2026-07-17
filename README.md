# CalinMeters Website

Static English-language inquiry site for Shenzhen Calinmeter Co., Ltd. (CalinMeters): [https://calinmeters.com/](https://calinmeters.com/).

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
npm run gsc:submit-sitemap
```

`npm run build` exports the site, preserves `CNAME` and generates `out/sitemap.xml` from the exported HTML. `npm run verify:seo` validates route coverage, metadata, canonicals, H1s, JSON-LD, sitemap parity, internal links and local image/PDF references.

## SEO/GEO Page Architecture

The homepage is the company and product-portfolio hub. Three canonical authority pages own the primary search topics:

- `/products/sts-prepaid-electricity-meter/`
- `/products/sts-prepaid-water-meter/`
- `/products/sts-prepaid-gas-meter/`

Ten model pages are statically generated from the product catalog. Category and model routes are implemented in `app/products/[slug]/page.tsx` through `generateStaticParams`.

## Content Sources

- `data/products.ts`: product identity, model, slug, description, images, PDF links and published specifications
- `data/faq.ts`: FAQ questions and answers
- `data/seoPages.ts`: category-page buyer guidance that references product IDs and FAQ questions
- `public/specs/`: downloadable product datasheets
- `public/llms.txt`: canonical GEO discovery map

Do not duplicate product names or PDF paths in route files. Do not add certification, approval, price, market, production-capacity, project-history or warranty claims without a reviewable source.

## Analytics and Automation

- GA4 uses `NEXT_PUBLIC_GA_MEASUREMENT_ID` during the production build.
- Specification clicks emit `specification_download` events.
- Daily GA4/Search Console reporting runs through `.github/workflows/daily-analytics-report.yml`.
- The weekly SEO/GEO work item runs through `.github/workflows/seo-geo-weekly.yml`.
- Sitemap submission is available through the manually dispatched `.github/workflows/search-console-submit.yml` workflow.

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
2. Check homepage plus electricity, water and gas category/model samples on desktop and mobile.
3. Push to `main` to deploy through GitHub Pages.
4. Confirm production canonical URLs and `sitemap.xml`.
5. Submit the sitemap and request indexing for the three authority pages in Google Search Console.
