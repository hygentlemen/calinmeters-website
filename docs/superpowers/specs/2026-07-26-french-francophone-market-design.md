# CalinMeters French Site and Francophone Market Design

Date: 2026-07-26  
Status: Approved for implementation planning  
Domain: `https://calinmeters.com/`

## 1. Objective

Add an indexable French version of the CalinMeters website that generates qualified distributor, system-integrator, and engineering-company inquiries from validated Francophone markets.

The first release focuses on:

- STS prepaid electricity meters for Cameroon, Senegal, and Togo.
- STS prepaid water meters for Côte d'Ivoire and Togo.
- Early demand validation for prepaid electricity meters in Haiti.

The French site must remain factual, technically aligned with the English catalog, compatible with the current Next.js static export and GitHub Pages deployment, and measurable through Search Console and GA4.

Top 5 rankings are a business target, not a guaranteed outcome. The first release is intended to establish indexation, market-specific search visibility, and qualified inquiry signals that can guide later country-page and off-site authority work.

## 2. Confirmed Business Context

### 2.1 Sales handling

- French inquiries can be handled in writing with translation assistance.
- The website must not imply that CalinMeters has a local French-speaking team, a local office, or real-time French support.
- Visitors may submit inquiries in French or English.
- Technical PDFs remain in English during the first release and must be labeled `Fiche technique en anglais`.

### 2.2 Target buyer

The primary buyer is a local:

- Meter distributor.
- System integrator.
- Utility-project engineering company.

Utility buyers, property operators, and industrial end users may use the pages, but the copy and conversion path primarily support channel and project partners.

### 2.3 First-party demand evidence

- CalinMeters has an existing Cameroon customer interested in prepaid electricity meters.
- CalinMeters has received prepaid electricity meter inquiries from Senegal.
- CalinMeters has received prepaid water meter inquiries from Côte d'Ivoire.
- CalinMeters has received prepaid electricity and prepaid water meter inquiries from Togo.
- Haiti currently represents a market signal only, with no confirmed customer or active project inquiry.

The Cameroon customer is confidential. The site must not state or imply that CalinMeters has a Cameroon customer, project, installation, reference, or local partner unless separate publication permission and reviewable evidence are obtained.

## 3. Public Market Evidence

The market terminology and content plan are supported by public operator and standards sources:

- The [STS Association](https://www.sts.org.za/who-we-are/what-is-the-sts-and-who-is-the-sts-association/) describes STS as a secure token-transfer system and identifies electricity, water, and gas as supported payment-meter types.
- Senegal's [Senelec Woyofal](https://www.senelec.sn/woyofal/page/a-propos/) pages demonstrate established French-language prepaid electricity terminology, customer interface keyboards, credit purchase, and consumption-management workflows.
- [Eneo Cameroon](https://my.eneo.cm/) uses terms including `compteur prépayé`, `token`, and prepaid credit purchase in its customer journey.
- Côte d'Ivoire's [CIE PEPT](https://www.cie.ci/pept/achat-energie) describes a 20-digit prepaid electricity credit code, confirming that token-based prepayment language is familiar in the market. This evidence must not be used to imply that a CalinMeters product is approved by or integrated with CIE.
- Burkina Faso's [SONABEL](https://www.sonabel.bf/actualites/communique-mise-a-jour-des-compteurs-prepayes-cash-power/) uses `Cash Power`, `STS`, prepaid meters, and recharge-code terminology.
- Togo's [CEET LAFIA](https://www.ceet.tg/tg/?page_id=70) describes single-phase and three-phase prepaid service and mobile credit purchase.

Local service names such as Woyofal and LAFIA may appear only in clearly informational terminology or market-context content. They must not appear in CalinMeters product names, primary metadata, compatibility claims, partner claims, or approval claims.

## 4. Scope

### 4.1 Included

- French homepage.
- French STS prepaid electricity meter authority page.
- French STS prepaid water meter authority page.
- Five French prepaid electricity meter model pages.
- Three French prepaid water meter model pages.
- French navigation, footer, FAQ, language switching, metadata, structured data, image text alternatives, and inquiry calls to action.
- Bidirectional English/French alternate-language metadata.
- French URLs in the production sitemap.
- A reliable French inquiry form plus WhatsApp and email fallbacks.
- French-market GA4 events and Search Console reporting.
- Build-time validation for locale coverage, route mappings, metadata, and language alternates.

### 4.2 Excluded from the first release

- French prepaid gas meter pages.
- French CIU, DCU, gateway, and vending-system detail pages.
- Country landing pages.
- Claims about local customers, installations, approvals, certifications, offices, support teams, distributors, warranties, prices, or delivery times.
- Automatic IP- or browser-language redirects.
- French PDF production.
- Online checkout, pricing, CRM, customer accounts, or inquiry database.
- A Haiti landing page.

## 5. URL and Locale Architecture

### 5.1 Public routes

The existing English URLs remain unchanged.

The first French release adds:

```text
/fr/
/fr/produits/compteur-electricite-prepaye-sts/
/fr/produits/compteur-eau-prepaye-sts/
/fr/produits/ca168-compteur-electricite-prepaye-sts-lorawan/
/fr/produits/ca168-compteur-electricite-prepaye-sts-gprs/
/fr/produits/ca168-compteur-electricite-prepaye-sts/
/fr/produits/ca368-compteur-electricite-prepaye-triphase-gprs/
/fr/produits/ca368-compteur-electricite-prepaye-triphase-sts/
/fr/produits/ca568-compteur-eau-prepaye-multijet-plastique/
/fr/produits/ca568-compteur-eau-prepaye-multijet-laiton/
/fr/produits/ca568-compteur-eau-prepaye-ultrasonique/
```

All production links keep the project's existing trailing-slash behavior.

### 5.2 Multiple root layouts

The emitted French HTML must contain `<html lang="fr">` before JavaScript executes. A nested layout under the current English root layout cannot correctly replace the root `lang` attribute.

The App Router must therefore use two route groups with independent root layouts:

```text
app/
├── (en)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── products/[slug]/page.tsx
└── (fr)/
    ├── layout.tsx
    └── fr/
        ├── page.tsx
        └── produits/[slug]/page.tsx
```

The route groups do not add URL segments. The English site stays at `/` and `/products/...`; the French site stays at `/fr/` and `/fr/produits/...`.

Both root layouts import the global stylesheet and render the existing GA component. The French layout uses `lang="fr"` and French metadata defaults.

### 5.3 Language switching

- Every translated page has an explicit English/French route pair.
- The language switcher opens the equivalent page rather than the other language's homepage.
- Pages without a translated equivalent, including gas, CIU, DCU, and gateway pages, link to the French homepage only when the visitor explicitly selects French.
- No language change occurs automatically.

## 6. SEO and GEO Requirements

### 6.1 Canonical and alternate languages

Each English and French page uses:

- A self-referencing canonical.
- Bidirectional `hreflang="en"` and `hreflang="fr"` links where a translated counterpart exists.
- `hreflang="x-default"` pointing to the English page.

French pages must never canonicalize to English pages.

### 6.2 Metadata

Each French page requires a unique:

- Title.
- Meta description.
- H1.
- Open Graph title and description.
- Social image alternative text.

French Open Graph metadata uses `fr_FR`. English metadata remains `en_US`.

### 6.3 Structured data

Visible French content and JSON-LD must match.

French authority pages use:

- `CollectionPage`.
- `BreadcrumbList`.
- `ItemList`.
- `FAQPage`.
- `inLanguage: "fr-FR"`.

French model pages use:

- `Product`.
- `BreadcrumbList`.
- `inLanguage: "fr-FR"`.

No price, offer, rating, availability, certification, or approval data may be added without evidence already accepted under the project evidence policy.

### 6.4 Sitemap, robots, and LLM discovery

- The postbuild sitemap includes all indexable English and French URLs.
- Each translated URL entry includes XHTML alternate-language links for English, French, and `x-default`.
- `robots.txt` continues to expose the production sitemap.
- The root `llms.txt` adds a French section with the French homepage and two French authority pages.
- Model pages remain discoverable through the French authority pages, sitemap, and visible internal links.

## 7. Content and Keyword Design

### 7.1 Electricity cluster

Primary phrases:

- `compteur électrique prépayé STS`
- `compteur à prépaiement STS`
- `compteur électrique prépayé`
- `compteur Cash Power`
- `compteur électrique à jeton`
- `compteur électrique à code`

Commercial and technical phrases:

- `fabricant de compteurs électriques prépayés`
- `fournisseur de compteurs STS`
- `compteur prépayé monophasé`
- `compteur prépayé triphasé`
- `compteur prépayé avec clavier déporté`
- `compteur prépayé avec CIU`
- `compteur prépayé GPRS`
- `compteur prépayé LoRaWAN`
- `système de vente de crédit STS`

### 7.2 Water cluster

Primary phrases:

- `compteur d'eau prépayé STS`
- `compteur d'eau à prépaiement`
- `compteur d'eau prépayé`
- `compteur d'eau à jeton`
- `compteur d'eau avec vanne`

Commercial and technical phrases:

- `fabricant de compteurs d'eau prépayés`
- `compteur d'eau prépayé multijet`
- `compteur d'eau prépayé ultrasonique`
- `compteur d'eau prépayé en plastique`
- `compteur d'eau prépayé en laiton`
- `compteur d'eau LoRaWAN`
- `système de gestion de compteurs d'eau prépayés`

### 7.3 Authority-page structure

Each French authority page contains:

1. A concise 40-60 word direct answer.
2. An explanation of the product category and intended project buyer.
3. A comparison of relevant published models.
4. An explanation of STS 20-digit token workflow.
5. Product-selection guidance.
6. CIU and communication-architecture guidance.
7. Distributor and integrator pilot-purchase workflow.
8. A quotation-preparation checklist.
9. Visible market-language and technical FAQs.
10. French quote, WhatsApp, email, and specification CTAs.

### 7.4 Market context

- Cameroon electricity content emphasizes token workflows, single-phase and three-phase selection, CIU, GPRS, and operator-system requirements.
- Senegal electricity content explains the distinction between the generic STS meter and locally branded prepaid services without claiming Woyofal compatibility.
- Togo electricity content covers single-phase, three-phase, token, communication, and mobile-payment integration questions without claiming LAFIA or CEET compatibility.
- Côte d'Ivoire water content emphasizes residential and community projects, pipe sizes, body material, flow, valve operation, customer interface, and remote reading.
- Togo water content emphasizes project design, customer credit workflows, valve control, and communications.
- Haiti appears only as a selectable country and an internal reporting segment. No Haiti-specific visible claim or landing page is included until demand passes the expansion gate.

Country and service names must not be inserted repeatedly for keyword density.

## 8. Translation and Data Architecture

### 8.1 Sources of truth

`data/products.ts` remains the source of truth for:

- Product IDs.
- Models.
- Images.
- PDF paths.
- Verified specification values.
- Product relationships.

`data/faq.ts` remains the English FAQ source.

French translation modules contain only locale-specific copy and translated labels:

```text
data/locales/fr/
├── common.ts
├── home.ts
├── products.ts
├── seoPages.ts
└── faq.ts
```

All French catalog entries are keyed by the existing English product ID. A typed merge layer combines verified product facts with French copy at build time.

### 8.2 Shared components

Existing homepage and catalog components must be refactored to accept locale messages or translated content objects. The implementation must not create a separate duplicated French component tree.

Reusable units include:

- Navigation and footer.
- Language switcher.
- Product cards.
- Comparison sections.
- Selection and workflow sections.
- Breadcrumbs.
- FAQ.
- Inquiry CTA.
- PDF link.
- Structured data builders.

### 8.3 Translation quality

- Translation assistance may produce the first draft.
- Technical values are read from the shared catalog rather than retyped.
- The French homepage, two authority pages, navigation, inquiry form, and CTA text require review by a native French technical reviewer before indexation.
- Model pages use the approved glossary and receive an editorial sample review covering at least one electricity and one water page before release.
- Unsupported superlatives and claims such as `meilleur`, `leader`, `certifié`, or `agréé` are prohibited unless a source and page-level justification are approved.

## 9. Inquiry and Conversion Design

### 9.1 Calls to action

Approved French CTA labels include:

- `Demander un devis`
- `Discuter du projet sur WhatsApp`
- `Télécharger la fiche technique`
- `Demander un échantillon ou un projet pilote`
- `Devenir partenaire ou distributeur`

The site may say that inquiries are accepted in French or English. It must not promise real-time French support or a response-time SLA.

### 9.2 Form fields

The French inquiry form collects:

- Country or region.
- Company.
- Contact name and job role.
- Email.
- WhatsApp number.
- Buyer type.
- Product category.
- Application.
- Estimated quantity.
- Electricity phase/current or water pipe size.
- STS, CIU, GPRS, LoRaWAN, or other communication requirements.
- Existing vending-system status.
- Target pilot or procurement period.
- Free-text project notes.

No file upload is included in the first release.

### 9.3 Delivery architecture

The static website posts JSON to a Cloudflare Worker endpoint configured through `NEXT_PUBLIC_INQUIRY_ENDPOINT`.

The Worker:

1. Validates Cloudflare Turnstile.
2. Applies a honeypot check, payload-size limit, input allowlists, and per-IP rate limit.
3. Normalizes and escapes all fields.
4. Sends a structured email to `scott@szcalinmeter.com` through the Resend API.
5. Returns a stable French success or failure response.
6. Avoids writing inquiry content to application logs.

Worker, Turnstile, and Resend secrets remain outside the repository. The website does not store inquiries in a database.

If the endpoint fails, the interface offers a prefilled WhatsApp link and direct email link. It must not falsely show a successful submission.

### 9.4 WhatsApp template

The French WhatsApp link uses a prefilled structure:

```text
Bonjour CalinMeters,

Pays :
Entreprise :
Produit recherché :
Quantité estimée :
Application :
Communication requise :
Délai du projet :
```

## 10. Analytics and Reporting

GA4 receives:

- `fr_quote_start`
- `fr_quote_submit`
- `fr_whatsapp_click`
- `fr_email_click`
- `fr_specification_download`
- `language_switch`

Allowed event parameters include:

- Page path.
- Interface language.
- Product category.
- Product ID.
- Buyer-type selection.

GA4 must not receive names, company names, email addresses, phone numbers, WhatsApp numbers, free-text inquiry content, or other direct identifiers.

The daily and weekly SEO/GEO reports add:

- French landing pages.
- French query clusters.
- Search country.
- French PDF downloads.
- French WhatsApp and inquiry events.
- Indexation status for the French homepage and two authority pages.

## 11. Error Handling and Build Validation

The build fails when:

- A first-release French route has no registered English counterpart.
- A translated page is missing a title, description, H1, or primary body copy.
- A required product ID is missing from `data/products.ts`.
- A French slug is duplicated.
- An English/French route pair lacks reciprocal language alternates.
- A sitemap URL has no exported HTML file.
- French structured data references an English canonical.

Verified product values may come from the English source of truth. English marketing copy must not silently appear as a fallback inside an indexable French page.

The form UI explicitly handles:

- Initial state.
- Client validation errors.
- Turnstile failure.
- Rate limiting.
- Delivery failure.
- Successful delivery.

## 12. Verification

### 12.1 Automated

- `npm run lint`
- `npm run build`
- `npm run verify:seo`
- Validate all locale route mappings.
- Validate canonical and reciprocal `hreflang`.
- Validate sitemap alternate-language entries.
- Validate one H1 per page.
- Validate French `lang`, metadata, and JSON-LD.
- Scan core French pages for untranslated interface labels.
- Verify all product images and PDF paths.
- Test Worker validation, rate limiting, email-delivery failure, and success responses.

### 12.2 Manual

- Desktop and mobile navigation.
- English/French route-preserving language switching.
- French homepage, authority pages, and representative model pages.
- Specification-download labeling and behavior.
- WhatsApp prefilled message.
- Inquiry success, failure, and fallback behavior.
- GA4 events without personal data.
- Rich Results validation.
- Search Console crawl and canonical inspection.
- Native French technical review sign-off.

## 13. Release Sequence

### Release 1: Locale foundation and authority pages

- Multiple root layouts.
- French homepage.
- French electricity and water authority pages.
- Navigation, language switcher, metadata, structured data, sitemap, and internal links.
- French inquiry form, WhatsApp template, fallbacks, and analytics.

### Release 2: Model pages

- Five electricity model pages.
- Three water model pages.
- Cross-links between authority and model pages.
- Final translation consistency review.

### Release 3: Indexation and measurement

- Submit the updated sitemap.
- Inspect the French homepage and two authority pages in Search Console.
- Monitor country, query, landing-page, download, WhatsApp, and inquiry data.
- Add French-market evidence to weekly SEO/GEO issues.

## 14. Country-Page Expansion Gate

A country page is eligible only when:

1. The rolling 90-day data shows at least two qualified inquiries from that country, or sustained Search Console demand for a clear product-plus-country query cluster.
2. CalinMeters can add unique country-specific buyer value such as electrical configuration, water-meter sizing, procurement workflow, payment integration requirements, communication constraints, or verified project evidence.
3. The page can avoid unsupported claims about local approvals, utility compatibility, customers, offices, or partners.

Priority evaluations after 8-12 weeks:

- Electricity: Cameroon, Senegal, and Togo.
- Water: Côte d'Ivoire and Togo.
- Haiti electricity: only after a concrete inquiry or sustained organic demand appears.

## 15. Success Measures

### First 30 days

- All French release URLs are exportable, crawlable, and present in the sitemap.
- Canonical and language alternates validate correctly.
- The French form and all fallback contact paths work.
- Search Console discovers the French homepage and authority pages.

### Days 30-90

- French pages receive impressions from one or more target markets.
- Search Console records relevant phrases such as `compteur prépayé`, `compteur STS`, or `compteur d'eau prépayé`.
- French visitors trigger specification downloads, WhatsApp clicks, or qualified inquiries.
- Evidence identifies the strongest country/product/query combinations.

### Months 3-6

- Relevant commercial French queries begin entering the top 20 and top 10.
- Evidence-backed query clusters are selected for Top 5 optimization.
- The site generates qualified distributor or system-integrator inquiries from the target markets.

## 16. Principal Risks and Controls

| Risk | Control |
| --- | --- |
| Machine-translated technical errors | Shared product facts, approved glossary, native French technical review |
| Thin or duplicated country pages | No country pages in the first release; enforce the expansion gate |
| Implying local utility compatibility | Keep local service names out of product titles and compatibility claims |
| English/French specification drift | Product IDs and verified values remain in the shared source of truth |
| Mixed-language pages | Build failure for missing core translations; no English marketing fallback |
| Lost mobile inquiries | Reliable endpoint plus WhatsApp and email fallbacks |
| Spam or form abuse | Turnstile, honeypot, validation, payload limit, and rate limiting |
| Personal data in analytics | Event allowlist and explicit prohibition on direct identifiers |
| Premature Haiti investment | Track as a market signal; no country page until the evidence gate passes |

## 17. Implementation Planning Boundary

The implementation plan must stay within this approved first-release scope. Gas pages, country pages, French PDFs, CRM, pricing, and public customer references require a separate design decision supported by new evidence.
