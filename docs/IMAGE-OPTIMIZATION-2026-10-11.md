# Image optimization — 2026-10-11

## Starting state

Inspected AGENTS.md, README.md, handoff/release documentation, git status/diff and recent commits before editing. Started from `origin/main` after the French indexing recovery PR #34. The only pre-existing untracked directory was `CalinMeter-KnowledgeBase/`, which is outside this change.

The static export had `images.unoptimized: true`, so image display dimensions did not reduce transferred file sizes. The largest active originals were a 4,095,765-byte CT-meter photograph and a 3,209,423-byte factory-exterior photograph. The homepage product banner included English lettering, and narrow screens cropped the product row. Product cards used CSS enlargement within clipped boxes.

## Changes

- 23 active originals now map to pre-generated responsive WebP files, plus a new mobile banner arrangement: 24 image families, 127 files.
- Native responsive HTML works on GitHub Pages without a runtime image service. Real decoded widths form `srcset`; original aspect ratios reserve the correct space. Heroes are eager/high priority; lower-page images are lazy.
- Compositor cropped the original 1400 × 600 product banner to a 1400 × 361 text-free strip. The retained export is `assets/image-sources/banner-products-clean.png`. The editable `.comp` project and screenshots are in the local ignored `reports/image-optimization-2026-10-11/` directory.
- The mobile English hero and French hero arrange the same four electricity meters and three water/gas products in two rows. No product details, branding or nameplates were generated or retouched.
- Product-card enlargement was removed so product outlines stay inside their containers. Mobile carousel controls sit below the product image. Manual slide selection pauses automatic rotation; unvisited carousel images are not included in the initial HTML and load when first shown.
- Corrected the exterior photograph's alt text (it previously called the image an interior). Existing public image/PDF paths, Open Graph references and structured-data image URLs remain intact.
- Platform screenshot full-resolution pixels remain identical, including the existing account mask. Existing 720-pixel water WebP masters are copied byte-for-byte at maximum size.

## Source provenance

The supplied drive contains 835 candidate image files. The CT and factory originals were matched by both file size and SHA-256 against these supplied sources:

- CT: `/Volumes/My Passport/表计/Website www.calinmeters.com/Products/ENERGY METER/CT meter/Product Picture/a90f620ff7d6e568966ad202e980ca67.jpg`
- Factory: `/Volumes/My Passport/表计/阿里巴巴/工厂照片2025/微信图片_20250905114257_98_495.jpg`

Reviewed the separate company-exterior image set; it shows a different building, so it was not substituted for the existing factory photo. Source-drive originals were not modified. No certificate material was published. The platform/field/manufacturing source limitations in COMMERCIAL-RELEASE-2026-09-08.md still apply.

## Measured file sizes

The same 23 existing image families total **13,777,501 bytes** as originals versus **1,629,594 bytes** using each family's largest delivered candidate: **88.2% smaller**. At the 720-pixel candidate size, the same set totals **769,732 bytes**, or **94.4% smaller**. The added mobile banner is approximately 23 KB at maximum resolution and is excluded from this like-for-like comparison.

| Image | Original KiB | Largest delivered KiB | Maximum width |
| --- | ---: | ---: | ---: |
| CT meter | 3999.8 | 284.6 | 1440 |
| Factory exterior | 3134.2 | 343.2 | 1440 |
| CA368 STS | 724.8 | 43.5 | 1000 |
| CA168 GPRS | 676.4 | 44.6 | 1000 |
| Product banner | 103.2 | 23.1 | 1400 |
| Platform screenshot | 73.6 | 28.8 | 1920 |

These are file-size comparisons, not measured load-time, Core Web Vitals or ranking improvements. Browsers choose candidates based on viewport and pixel density; they may retain a previously cached larger candidate after resizing. The original files remain published for compatibility, so total repository/export storage is not the transfer-saving metric.

## Verification

- `npm run verify`: i18n, TypeScript, production build, 27-route SEO checks and image checks passed.
- `npm run lint`: no warnings or errors.
- `verify:images` decodes all 127 candidates, checks width descriptors/aspect ratios/no EXIF, matches exported files, checks responsive image references throughout 29 emitted HTML files (27 public routes plus framework error documents), and compares screenshot pixels and existing water masters.
- Browser visual checks: English/French homepages, CT product, French water category, product-card fit, and manufacturing imagery; desktop 1440 px and mobile 390/320 px. No horizontal overflow or image console errors in the checked views.
- Evidence: local `reports/image-optimization-2026-10-11/` contains the source contact sheet, generated size audit, editable Compositor project and page screenshots.

## Maintenance

Run `npm run images:optimize` after updating a registered original or the Compositor source; commit source, manifest and generated files together. `npm run verify` runs the image checks in the existing Pages CI workflow. Normal deployment uses the checked-in files and does not access the external drive. No changes to French indexing requests or contact/form handling are part of this release.
