# CalinMeters SEO/GEO Roadmap

This roadmap keeps SEO and GEO work continuous, measurable, and easy for any executor to pick up.

## Operating Rhythm

- Daily: review the automated GA4 and Search Console report pushed by GitHub Actions.
- Weekly: complete the GitHub Issue created by `Weekly SEO/GEO Execution`.
- Monthly: review Search Console trends, keyword movement, indexed pages, and lead quality.
- Quarterly: refresh product positioning, target-country pages, and high-value content topics.

## Durable Execution Rules

- GitHub Issues are the source of truth for recurring SEO/GEO work.
- Every weekly issue must close with evidence: data reviewed, pages changed or deferred, and next action.
- Website changes must pass `npm run build` before deployment.
- Major content changes should mention target keyword, buyer intent, and expected page outcome.
- If Codex, OpenClaw, Hermes, Claude Code, or another agent executes the task, it should comment on the issue with what it changed and what remains.

## Weekly Handoff

The weekly GitHub Action creates one Issue and sends a short Feishu notice with the Issue link. The Feishu notice is only a reminder, not the working document.

To ask Codex to execute the task, say either:

- `执行本周 SEO/GEO 任务`
- `执行 GitHub issue #<number>`

Codex can then read the Issue from GitHub, perform the checks or website changes, push commits if needed, and comment back on the Issue with evidence.

## Phase 1: Technical Foundation

- Status: implemented locally on 2026-07-17; production verification remains after deployment.
- Sitemap generation, robots declaration, self-canonicals, titles, descriptions, H1s, image alt text and crawlable internal links are automated or verified.
- Organization, WebSite, CollectionPage, Product, BreadcrumbList, ItemList and visible FAQ structured data are scoped to the appropriate pages.
- PDF downloads and contact actions emit GA4 events when the production measurement ID is configured.

## Phase 2: Product Page Depth

- Status: implemented for three category authority pages and ten model pages on 2026-07-17.
- Continue improving only from product documents, engineering input, approved customer evidence and measured buyer demand.
- Keep model identity, communication, applications, published specifications, related downloads and quotation-confirmation fields aligned with `data/products.ts`.

## Phase 3: GEO Readiness

- Status: initial implementation complete.
- Three category pages provide concise direct answers, comparison/selection guidance, workflows, quotation checklists and visible FAQ answers.
- `llms.txt`, structured data and preferred company naming use stable canonical URLs and consistent entities.
- The next improvement is first-party evidence, not more generic prose.

## Phase 4: Market Expansion

- Status: intentionally deferred until production pages are indexed and have 4-8 weeks of data.
- Build country/region-oriented content only when Search Console shows demand and the company can add specific first-party value.
- Prioritize Africa, Southeast Asia, Latin America and utility procurement queries only when query/country/page evidence supports them.
- Create AMI, LoRaWAN and STS workflow support pages only when they answer a distinct intent without competing with the three category owners.

## Current Next Actions

1. Deploy and verify the production export.
2. Submit the sitemap and request indexing for the three authority pages.
3. Establish a 4-8 week Search Console baseline by query, country, device and landing page.
4. Add reviewable technical/company/customer evidence.
5. Earn relevant industry, partner and distributor citations outside the repository.

## Success Metrics

- More indexed product and support pages.
- More impressions for commercial-intent keywords.
- More clicks from target countries.
- More engagement with product pages and PDF downloads.
- More qualified inquiries through the contact form, WhatsApp, WeChat, and email.
