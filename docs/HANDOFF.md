# Handoff

本项目是 CalinMeters 官网，生产域名 `https://calinmeters.com/`，仓库 `hygentlemen/calinmeters-website`，分支 `main`。技术栈是 Next.js 14 + React + TypeScript + Tailwind，`output: 'export'` 静态导出，部署到 GitHub Pages。README 仍有 Vercel 旧说明，权威配置看 `deploy.yml`。

最近修改集中在 SEO/GEO、产品展示、分析追踪和自动化。`components/ProductsSection.tsx` 有分类卡、细分产品、买家指南、STS token workflow、CA368 对比；自定义下载事件使用 `specification_download`，避免与 GA4 自动 `file_download` 重复。`components/SolutionsSection.tsx` 有解决方案、非洲采购清单、LoRaWAN 水表和预付费燃气表指南。`components/StructuredData.tsx` 输出 Organization、Product、Service、FAQPage、HowTo。`data/products.ts`、`data/faq.ts` 是内容源，`public/llms.txt` 是 AI/GEO 引用入口。

自动化：`daily-analytics-report.yml` 每天生成 GA4/Search Console 日报并推送飞书；`seo-geo-weekly.yml` 每周创建 SEO/GEO issue。最近日报、周任务、Pages 部署均成功。相关 Secrets：`GA_PROPERTY_ID`、`GSC_SITE_URL`、Google OAuth 配置、`FEISHU_WEBHOOK_URL`。

关键决策：网站是静态展示和询盘站，不做在线交易；联系表单只打开 `mailto:scott@szcalinmeter.com`；不存储用户提交；部署保持 GitHub Pages；不要把证书文件放回 public；不能添加无依据的认证、价格或市场承诺。

主要风险：产品仍是单页 hash anchor，不是独立可索引 URL；联系表单无后端；日报依赖 OAuth refresh token。下一步建议先做“产品/品类独立页面与 sitemap 扩展”，从 `data/products.ts` 派生路由，并同步 canonical、BreadcrumbList、Product JSON-LD。开始前跑 `npm ci` 和 `npm run build`，完成后检查首页、产品页、PDF、结构化数据。
