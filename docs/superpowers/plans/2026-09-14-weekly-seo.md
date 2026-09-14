# Weekly water buyer guidance and sitemap implementation plan

**Goal:** Complete issue #26 with a sourced water procurement improvement and verified crawl metadata.
**Architecture:** Extend existing category data/rendering, central FAQ translations and model specification tables. Maintain significant page dates in a JSON registry consumed by postbuild and export checks.
**Stack:** Next.js 14 static export, React 18, TypeScript, Node scripts; GitHub Pages.

- [x] Read current issue, report, index inspection, public water PDFs and Google sitemap documentation. Preserve unknown outcome/quality classifications.
- [x] Add operationGuide data (title, intro, steps) in EN/FR category records; render it with catalog-derived model/PDF links and a topic-preserving inquiry CTA.
- [x] Add three central water FAQ answers plus French translations; add source-backed non-return valve values to both multi-jet model variants and translations. Validate with npm run verify:i18n.
- [x] Add data/page-modified.json; postbuild emits recorded lastmod only. Export validation rejects invalid/future dates, unexported keys and mismatched sitemap values. Temporary registry/sitemap mutations verified calendar, future, format, unknown-route, missing, mismatched and duplicate dates; originals restored byte-for-byte.
- [x] Run npm run test:report, npm run seo-geo:weekly -- --fixture and npm run verify. Test the water guide, FAQ, source PDFs and inquiry context at 1440×1000 and 390×844 without sending a message. Interrupted-session UI evidence recovered and reviewed; fresh continuation build/report/SEO checks passed.
- [ ] Commit, open/merge the authorized PR, verify Pages and sitemap submission. Record evidence and explicit operational deferrals in docs/weekly and issue #26.

Source of publication evidence after the final commit: issue #26 and the corresponding PR/deployment run. No new country URLs, certificate originals, business contact records or unverified ceramic-valve product claims.
