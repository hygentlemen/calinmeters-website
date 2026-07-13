# AGENTS.md

## Project

CalinMeters site for Shenzhen Calinmeter Co., Ltd. Domain: `https://calinmeters.com/`. Static inquiry site.

## Stack

Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, `output: 'export'`. Production deploys to GitHub Pages.

## Structure

- `app/`: layout, CSS, homepage.
- `components/`: UI sections, analytics, JSON-LD.
- `data/`: products and FAQ.
- `public/`: images, PDFs, `CNAME`, SEO files.
- `scripts/`: report and weekly issue scripts.
- `.github/workflows/`: deploy/report/SEO jobs.
- `docs/`: docs and handoff.

## Commands

- Install: `npm ci`
- Dev: `npm run dev`
- Build/export: `npm run build`
- Lint: `npm run lint`
- Reports: `npm run report:daily`, `npm run seo-geo:weekly`

## Verification

Run `npm run build` before pushing. Check desktop/mobile for UI edits. Inspect workflows with `gh`.

## Style

Use existing Tailwind/component patterns. Keep `data/products.ts` and `data/faq.ts` as source of truth. Copy must be factual and buyer-oriented.

## Forbidden

- Do not switch deployment to Vercel unless asked.
- Do not remove `public/CNAME`, GA4, `robots.txt`, `sitemap.xml`, `llms.txt`.
- Do not commit secrets, OAuth tokens, webhook URLs, keys.
- Do not rename asset/PDF paths without updating data and links.
- Do not add certificate files back to the public site.
- Do not claim certifications, approvals, prices, markets, or warranty without sources.
