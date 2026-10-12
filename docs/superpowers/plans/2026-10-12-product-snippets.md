# Quote-only Product Page Structured Data Implementation Plan

**Goal:** Resolve the Search Console Product snippets issue without inventing prices, offers or reviews.

**Architecture:** English and French model routes emit `WebPage` plus `BreadcrumbList`. Product descriptions, specifications, images, PDFs, canonicals and language alternates stay in their existing sources. Product rich-result markup is deferred until genuine visible offer/review evidence meets Google's requirements.

**Tech Stack:** Next.js 14 static export, TypeScript, JSON-LD, Node SEO verifier, GitHub Pages.

## Constraints and evidence

- Owner requested investigation and repair of the opened Search Console notification on October 12.
- Search Console reports eight French model items missing offers/review/aggregateRating, all crawled October 11; validation not started.
- No approved public prices or reviews exist. A zero price would incorrectly mean a free product.
- Preserve all 27 routes, 11 language pairs, existing media and inquiry configuration; no GA4 patch is included.
- Keep pre-existing untracked `CalinMeter-KnowledgeBase/` untouched.

## Execution

- [x] Add export regression checks in `scripts/verify-seo.mjs`: recursively reject Product/Offer/Review/rating markup for the current quote-only catalog; require one matching WebPage and breadcrumbs on all 18 model routes. Run against the existing export and confirm rejection.
- [x] In `app/(en)/products/[slug]/page.tsx`, replace the model Product node with WebPage (`#webpage`, canonical URL, name, description, image, `inLanguage: en`, website reference). In `app/(fr)/fr/produits/[slug]/page.tsx`, retain the French WebPage, add image and remove its Product/mainEntity block.
- [x] Set only the 18 affected model dates in `data/page-modified.json` to `2026-10-12`; regenerate sitemap through build. Update current decision/project/operations documentation with the reason and rich-result tradeoff.
- [x] Run `npm run verify` and `git diff --check`; inspect generated English/French JSON-LD and confirm visible body markup did not change.
- [ ] Commit, push, create and attach PR, merge and confirm Pages success. Check all production model HTML and sitemap, run a Google live test, then start the existing Product snippets validation. Record acceptance separately from Google's eventual completion.

## Acceptance

All 18 model pages keep readable product content and valid page/breadcrumb markup. No artificial commercial or review data is emitted. Build, SEO, image and i18n checks pass. Production verification and Google's asynchronous validation status are reported accurately.
