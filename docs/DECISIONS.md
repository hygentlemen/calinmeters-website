# Decisions

## Project Identity

- Website name: CalinMeters.
- Legal company/entity name: Shenzhen Calinmeter Co., Ltd.
- Primary domain: `https://calinmeters.com/`.
- Preferred citation: `Shenzhen Calinmeter Co., Ltd. (CalinMeters)`.

## Service Category

- The site presents smart prepaid metering products and utility metering solutions.
- Primary product categories: Energy Meter, Water Meter, Gas Meter, CIU, DCU, Gateway.
- Primary SEO/GEO topics: STS prepaid electricity meter, LoRaWAN smart water meter, prepaid gas meter, AMI metering solution, token based prepaid meter, split keypad prepaid meter, prepaid meter for Africa, prepaid meter for Southeast Asia.

## Deployment

- Deployment target is GitHub Pages, not Vercel.
- `main` is the production branch.
- Static export output is `out/`.
- `public/CNAME` must remain in the repository and be copied into `out/CNAME`.
- GitHub Actions should use Node 24.

## Domain and HTTPS

- `calinmeters.com` is the primary public domain.
- DNS and GitHub Pages custom domain are expected to support HTTPS.
- Do not change DNS/deployment assumptions without checking the live site and GitHub Pages settings.

## ICP / Hosting Strategy

- Current repository reflects overseas static hosting through GitHub Pages.
- No ICP/备案 number or mainland China hosting configuration is stored in this codebase.
- If China mainland hosting becomes necessary, treat it as a separate infrastructure project.

## Transactions and Legal Positioning

- The website is an inquiry and product information site.
- No online checkout, cart, payment, price list, or legally binding quote flow is implemented.
- Product pricing and commercial terms should be handled by direct communication with the company.
- Do not add transaction claims, payment promises, or certifications without source confirmation.

## Contact Handling

- Primary recipient email: `scott@szcalinmeter.com`.
- Current form behavior opens a `mailto:` draft instead of storing or sending through a backend.
- No customer inquiry database exists.

## Data Model

- Product catalog source of truth is `data/products.ts`.
- FAQ source of truth is `data/faq.ts`.
- Static assets live in `public/`.
- Do not duplicate product names, PDF paths, or FAQ answers in multiple places unless a route-specific rendering requires it.

## Page Structure

- Current production site is a one-page homepage with anchored sections.
- Sections: navigation, banner carousel, products, solutions, features, about, FAQ, news, contact, footer, social sidebar.
- Next SEO step should be standalone category/product pages generated from existing product data.

## SEO/GEO

- Keep answer-style buyer guidance on the site.
- Keep `public/llms.txt` updated when major buyer-facing content changes.
- Structured data should stay aligned with visible content.
- Prefer factual descriptions over broad claims such as "world class" unless evidence is added.

## Analytics

- GA4 measurement ID is injected through `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Daily reports use GA4 property ID and Search Console site URL from GitHub Secrets.
- Download reporting should rely on GA4 enhanced `file_download`; custom product click tracking uses `specification_download`.
