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

- Confirm sitemap, robots.txt, canonical URLs, redirects, and HTTPS.
- Improve page titles, meta descriptions, headings, image alt text, and internal links.
- Add structured data for Organization, Product, BreadcrumbList, and FAQ where applicable.
- Confirm PDF downloads and contact actions are trackable in GA4.

## Phase 2: Product Page Depth

- Expand product pages around buyer questions, not generic marketing claims.
- Each product page should explain:
  - Meter type and model name
  - Communication method
  - Application scenario
  - Utility/customer fit
  - Key specifications
  - Related downloads
  - FAQ

## Phase 3: GEO Readiness

- Write concise answer-style sections that AI search engines can quote.
- Use stable entity names and consistent terminology.
- Add comparison, selection, and use-case content for utility buyers.
- Avoid vague claims unless supported by visible evidence.

## Phase 4: Market Expansion

- Build country/region-oriented content when Search Console shows demand.
- Prioritize Africa, Southeast Asia, Latin America, and utility procurement queries when data supports them.
- Create pages around AMI systems, prepaid metering, LoRaWAN water metering, and STS token workflows.

## Success Metrics

- More indexed product and support pages.
- More impressions for commercial-intent keywords.
- More clicks from target countries.
- More engagement with product pages and PDF downloads.
- More qualified inquiries through the contact form, WhatsApp, WeChat, and email.
