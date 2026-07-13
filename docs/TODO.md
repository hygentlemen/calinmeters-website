# TODO

## P0

1. Create standalone category pages for Energy Meter, Water Meter, Gas Meter, CIU, DCU, and Gateway using `data/products.ts` as the source.
2. Create standalone product detail pages for each product variant with stable URLs, canonical metadata, product copy, images, and PDF links.
3. Update `public/sitemap.xml` to include category and product URLs with current `lastmod`.
4. Add BreadcrumbList structured data for new category/product pages.
5. Verify new pages with `npm run build` and production browser checks after deployment.

## P1

1. Replace the `mailto:`-only contact form with a reliable submission flow, such as Formspree, Basin, Cloudflare Worker, or another approved endpoint.
2. Keep a no-database fallback message showing `scott@szcalinmeter.com` if the submission endpoint fails.
3. Replace generic Facebook URL with the real company Facebook page or remove the Facebook button.
4. Add missing product PDFs or hide empty specification actions for products without files.
5. Refresh `public/sitemap.xml` automatically during build instead of editing it manually.

## P2

1. Update `README.md` so it matches the current GitHub Pages deployment instead of Vercel.
2. Add an SEO check script that verifies title, description, canonical, sitemap, robots, GA tag, and JSON-LD presence in `out/index.html`.
3. Add a link-check script for all PDF/image assets referenced by `data/products.ts`.
4. Add a weekly workflow step that posts the latest daily analytics artifact link into the SEO/GEO issue.

## P3

1. Add alt-text review for every product and banner image.
2. Add actual news/article pages or remove the news section if it remains static.
3. Add region-focused landing content for Southeast Asia if Search Console shows related impressions.
4. Add FAQ schema tests to catch invalid JSON-LD after FAQ edits.
5. Review mobile navigation anchors after standalone pages are introduced.
