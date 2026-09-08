# French Indexing Decision and Historical Review Gate

## Current decision — 2026-09-08

The site owner explicitly instructed that the French pages should be `index,follow` and that professional copy review is not required for this release. This supersedes the previous approval gate below. No professional reviewer sign-off is claimed.

All 11 French routes retain self-canonicals, reciprocal hreflang and sitemap inclusion. Automated specification parity, route, metadata and link checks remain required. The French SIM/STS answer is aligned with the distinction between local token entry and vending/payment connectivity. The release also includes water buyer segments and owner-confirmed stock/support information.

Publish after `npm run verify` and desktop/mobile checks, submit the sitemap, then inspect Google’s recorded state. URL Inspection reports can lag the live metadata; it does not request indexing.

## Historical gate — superseded

The remaining checklist and review packets record the earlier preparation only. They are not publication prerequisites.

## Review scope

- [ ] Review the French homepage.
- [ ] Review both French category authority pages.
- [ ] Review all eight French model pages.
- [ ] Compare every translated specification against the linked English source datasheet.
- [ ] Confirm consistent use of `compteur électrique`, `compteur d'eau`, `prépayé`, `jeton`, `CIU`, `vente de crédit`, `monophasé`, `triphasé`, `multijet`, `débit`, `pression` and communication terminology.
- [ ] Confirm that sentences are natural for distributor, integrator, engineering-company and utility readers.
- [ ] Confirm that no text implies certification, approval, local office, country deployment, customer relationship, price, warranty or guaranteed performance.
- [ ] Confirm that English PDFs are clearly labelled `Fiche technique en anglais (PDF)`.
- [ ] Review form labels, errors, success text and direct-contact fallbacks.
- [ ] Record reviewer name, date, role and any corrections below.

## Sign-off

- Reviewer:
- Role or qualification:
- Review date:
- Corrections completed by:
- Final approval:

## Indexation change after sign-off

Historical sequence before the owner waiver:

1. Change French layout and route metadata from `index: false` to `index: true`.
2. Run `npm run verify` and update the SEO assertion that currently enforces `noindex`.
3. Deploy the reviewed build.
4. Submit `https://calinmeters.com/sitemap.xml` to Google Search Console.
5. Request indexing for `/fr/`, both French authority pages and the priority model pages.

## 2026-09-08 review preparation

- Packet: [11 rendered English/French page pairs](FRENCH-REVIEW-PACKET-2026-09-08.md), including source PDF links and HTML hashes.
- Companion: [conditional form and shared-control strings](FRENCH-REVIEW-STRINGS-2026-09-08.md).
- Technical precheck: `npm run verify` confirms the eight translated model specifications still match the English source values. This does not approve linguistic quality or the source datasheets themselves.
- Priority issue: review the French SIM/STS answer against the clarified English answer. Local token entry does not imply offline token vending or payment reconciliation, and LoRaWAN remote reading does not need a cellular SIM in every meter.
- English buyer routes and the new mini-grid/tender/manufacturing FAQ need a separate reviewed translation before French publication.
- Coordination owner: site owner (Scott), to nominate the professional reviewer. Reviewer not yet assigned; no sign-off is implied by this packet.
- Superseded by the owner decision above; no reviewer assignment is needed for this release.
