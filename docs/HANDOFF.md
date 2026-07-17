# Handoff

生产站点为 `https://calinmeters.com/`，仓库 `hygentlemen/calinmeters-website`，生产分支 `main`。技术栈是 Next.js 14.2.35 + React 18 + TypeScript + Tailwind，`output: 'export'` 静态导出后部署到 GitHub Pages。不要切换到 Vercel；`public/CNAME` 必须保留。

## 2026-07-17 SEO/GEO 架构

首页现在是公司实体和产品组合入口，不再承担全部关键词。三个核心主题各有独立权威页：

- `/products/sts-prepaid-electricity-meter/`
- `/products/sts-prepaid-water-meter/`
- `/products/sts-prepaid-gas-meter/`

电、水、气产品共有十个独立型号页。动态路由在 `app/products/[slug]/page.tsx`，但全部通过 `generateStaticParams` 导出为静态 HTML。产品身份、图片、PDF 和规格仍以 `data/products.ts` 为准；品类买家内容在 `data/seoPages.ts`；FAQ 答案在 `data/faq.ts`。

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

当前预期结果：14 个 HTML 页面、14 个 sitemap URL、13 个 `/products/` 路由全部通过。完成 UI 修改后还要检查 1440px 桌面和 390px 移动布局。

## 联系和分析

联系表单仍只打开访客本地邮件客户端，不会把内容上传到网站；页面已明确说明并提供直接 email/WhatsApp。主要邮箱 `scott@szcalinmeter.com`，WhatsApp/WeChat `+8613713788753`。

GA4 使用 `NEXT_PUBLIC_GA_MEASUREMENT_ID`。PDF 自定义事件是 `specification_download`，型号页会带 `source_page`。日报和每周 SEO/GEO Issue 工作流保持不变。

## 上线后的首要工作

1. 确认 GitHub Pages 部署成功。
2. 检查生产域名上的三个权威页、代表性型号页、robots 和 sitemap。
3. 在 Search Console 提交 sitemap，并请求索引三个权威页。
4. 用 4-8 周数据建立 query/country/page 基线。
5. 只根据真实 impressions 选择首个国家页或支持主题。
6. 收集可公开验证的公司证据和相关行业外链；站内改造不能单独保证全球 Top 5。
