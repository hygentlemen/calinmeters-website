# French Technical Copy Review Gate

The French pages are exported with `noindex,follow` until this gate is completed by a native or professional French reviewer who is comfortable with electricity and water metering terminology.

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

Only after final approval:

1. Change French layout and route metadata from `index: false` to `index: true`.
2. Run `npm run verify` and update the SEO assertion that currently enforces `noindex`.
3. Deploy the reviewed build.
4. Submit `https://calinmeters.com/sitemap.xml` to Google Search Console.
5. Request indexing for `/fr/`, both French authority pages and the priority model pages.
