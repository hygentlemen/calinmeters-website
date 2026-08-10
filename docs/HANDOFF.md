# Handoff

生产站点为 `https://calinmeters.com/`，仓库 `hygentlemen/calinmeters-website`，生产分支 `main`。技术栈是 Next.js 14.2.35 + React 18 + TypeScript + Tailwind，`output: 'export'` 静态导出后部署到 GitHub Pages。不要切换到 Vercel；`public/CNAME` 必须保留。

## 2026-07-17 SEO/GEO 架构

首页现在是公司实体和产品组合入口，不再承担全部关键词。三个核心主题各有独立权威页：

- `/products/sts-prepaid-electricity-meter/`
- `/products/sts-prepaid-water-meter/`
- `/products/sts-prepaid-gas-meter/`

英文电、水、气产品共有十个独立型号页。英文动态路由在 `app/(en)/products/[slug]/page.tsx`，法语动态路由在 `app/(fr)/fr/produits/[slug]/page.tsx`，两者全部通过 `generateStaticParams` 导出为静态 HTML。产品身份、图片、PDF 和规格仍以 `data/products.ts` 为准；品类买家内容在 `data/seoPages.ts`；FAQ 答案在 `data/faq.ts`。

型号页参数来自现有 PDF 的可读内容。不要根据 Logo、标准编号或竞争网站推断认证、批准、价格、市场、产能、项目记录或保修。无 PDF 的型号只显示已有目录事实和询价前待确认参数。

## 结构化数据和搜索发现

- 首页：Organization、WebSite、三个品类 URL 的 ItemList。
- 品类页：CollectionPage、BreadcrumbList、真实型号 URL 的 ItemList、与可见问题一致的 FAQPage。
- 型号页：单个 Product 和 BreadcrumbList；无 Offer、价格、库存、评分或评论。
- `public/llms.txt` 列出全部 canonical 页面。
- `scripts/postbuild.mjs` 从 `out/**/*.html` 生成生产 `out/sitemap.xml` 并保留 CNAME。
- `scripts/verify-seo.mjs` 检查导出页面、元数据、canonical、H1、JSON-LD、内部链接、资源和 sitemap 一致性。

## 必跑验证

```bash
npm run lint
npm run typecheck
npm run build
npm run verify:seo
```

当前预期结果：25 个 HTML 页面、25 个 sitemap URL、11 对 reciprocal hreflang，以及 13 个英文 `/products/` 路由和 10 个法语 `/fr/produits/` 路由全部通过。完成 UI 修改后还要检查 1440px 桌面和 390px 移动布局。

## 联系和分析

英文和法语询盘表单在生产 Worker 和 Turnstile 变量配置后都会安全提交；变量缺失时仅显示 email/WhatsApp 降级通道。公开邮箱 `info@calinmeters.com`，WhatsApp/WeChat `+8613713788753`。

GA4 使用 `NEXT_PUBLIC_GA_MEASUREMENT_ID`。英文 PDF 自定义事件是 `specification_download`；法语站另外记录受控的询盘、联系方式、PDF 与语言切换事件。日报和每周 SEO/GEO Issue 工作流包含 30/90 天法语分段。

Search Console sitemap 可通过 `Submit Search Console Sitemap` 工作流手动提交。它复用日报的 Google OAuth/服务账号 Secrets，先验证公开 sitemap，再调用官方 Sitemaps API 并读取提交状态。2026-07-21 已在 OAuth 应用恢复 In production 后重新签发长期 token，同时包含 `https://www.googleapis.com/auth/analytics.readonly` 与 `https://www.googleapis.com/auth/webmasters`。工作流运行 `29838520351` 使用新 token 成功提交 `https://calinmeters.com/sitemap.xml`，回读结果为 `errors=0`、`warnings=0`，当时 `isPending=true`。

`Search Console URL Inspection` 工作流每周一 08:45（Asia/Shanghai）自动检查三个 STS 权威页，也可手动传入逗号分隔 URL。它使用现有只读 scope，报告 Google 当前已知版本的 coverage、robots、抓取、canonical、sitemap 和富结果状态；不执行实时测试，也不能提交普通产品页索引请求。

## 上线后的首要工作

1. 确认 GitHub Pages 部署成功。
2. 检查生产域名上的三个权威页、代表性型号页、robots 和 sitemap。
3. 确认 Search Console 完成 sitemap 处理，并请求索引三个权威页。
4. 用 4-8 周数据建立 query/country/page 基线。
5. 只根据真实 impressions 选择首个国家页或支持主题。
6. 收集可公开验证的公司证据和相关行业外链；站内改造不能单独保证全球 Top 5。

## Inquiry Worker

英文和法语询盘接口共用独立的 Cloudflare Worker，主站仍由 GitHub Pages 部署。

- Worker package: `workers/inquiry`
- Public contract: `POST /v1/inquiries`
- Allowed production origins: `https://calinmeters.com`, `https://www.calinmeters.com`
- Delivery recipient: `tom.qi@qq.com`
- Resend sender: `Calin Meter Website <info@calinmeters.com>`
- Reply-To: the validated customer email from each inquiry
- Worker secrets live in Cloudflare: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `RATE_LIMIT_KEY_SECRET`
- GitHub deployment secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Never log inquiry payloads or copy secret values into repository files.
- Validate changes with `npm --prefix workers/inquiry run check`.

Production provisioning remains an operator step:

1. Create a managed Turnstile widget named `CalinMeters Inquiry`, restrict it to `calinmeters.com` and `www.calinmeters.com`; the Worker accepts the `en_inquiry` and `fr_inquiry` actions.
2. Verify the `calinmeters.com` sending domain in Resend before using `Calin Meter Website <info@calinmeters.com>`.
3. From `workers/inquiry`, authenticate with `npx wrangler login`, verify the account using `npx wrangler whoami`, then add each Worker secret through `npx wrangler secret put`.
4. Add repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; restrict the API token to Worker deployment.
5. After deployment, append `/v1/inquiries` to the Worker URL and use it as `NEXT_PUBLIC_INQUIRY_ENDPOINT`; use the managed Turnstile public sitekey as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

Resend and Turnstile secret keys stay in Cloudflare and must not be copied into GitHub. Local or automated tests use Cloudflare's official Turnstile dummy keys only. For local end-to-end testing, set `LOCAL_TURNSTILE_TEST_MODE=true`, `ALLOWED_ORIGINS=http://127.0.0.1:4173,http://localhost:4173` and the official dummy secret in the ignored `workers/inquiry/.dev.vars`. The committed production test-mode value is `false` and production origin is `https://calinmeters.com`; never enable test mode or a localhost origin in a production deployment.
