# Homepage banner, Products menu and gas image correction

This supersedes the first-banner artwork in the earlier image optimization release. The old 1400×361 crop was still based on a small precomposed image and was displayed inside an inset frame. It was not suitable as the final desktop banner.

## Completed changes

- Rebuilt the banner from seven independent product photos: CA168 DIN rail, CA168 GPRS, CA168 STS, CA368 GPRS, brass multi-jet water, ultrasonic water, and CA768 gas. No product details or markings were generated.
- Removed edge-connected white backgrounds from opaque originals; preserved existing transparent cutouts where available. Removed separate corner logos by keeping the product component. Checked the cutouts on a contrasting background.
- Composed seven independent transparent layers over a white background in Compositor. The editable project is `assets/image-sources/banner-seven-products.comp`; the export is `banner-products-desktop.png` (2800×1200). Individual products are resized without enlargement when composing.
- Created a two-row 1440×1200 mobile/French composition from the same cutouts. Both compositions replace the old low-resolution source.
- Unified all desktop carousel slides at 7:3, matching the original 1400×600 field and factory photos. The first slide now fills the same image box. Its responsive candidates extend to 2800 pixels, at WebP quality 90.
- Kept the existing public banner URL, updating its 1400×600 JPEG for metadata and external references.
- Replaced the homepage gas category with the keypad-facing CA768 photo. Its original comes from the 4160×4160 `STS Keypad Prepaid Gas Meter (6).jpg` marketing image. The previous rear-photo URL remains available for external links.
- Preserved native keyboard-accessible Products disclosure semantics, with closing on mouse exit, outside pointer press, Escape (restoring trigger focus), focus leaving, and link selection.

## Source and editing workflow

`assets/image-sources/product-cutouts/sources.json` records the seven paths relative to `/Volumes/My Passport/表计`. Original marketing photos remain unchanged on the external drive. The committed cutouts allow routine work without that drive.

To repeat source preparation only when needed:

```sh
node scripts/prepare-banner-cutouts.mjs '/Volumes/My Passport/表计'
node scripts/compose-banner-assets.mjs
```

The second script prepares the mobile composition, front-facing gas source, and seven full-canvas transparent layers under ignored `reports/banner-correction-2026-10-11/layers/`. Import these into a white 2800×1200 Compositor canvas, or edit the retained project directly. Export PNG to `assets/image-sources/banner-products-desktop.png`.

After editing the desktop master, update the public 1400×600 JPEG if needed, then run `npm run images:optimize` and, after it finishes, `npm run verify`. Commit the manifest and generated files together. Normal builds use committed assets and do not require Compositor or the external drive.

## Verification

- `npm run verify`: TypeScript/build, i18n, SEO and image checks passed; 27 sitemap URLs, 11 reciprocal locale pairs, 131 decoded image candidates.
- `npm run lint` and `git diff --check` passed.
- Browser checks: 1440-pixel desktop screenshot; 1920-pixel wide layout geometry; 1024-pixel layout; 390- and 320-pixel mobile layouts. No horizontal overflow. All three slide image boxes have identical dimensions.
- A fresh page load at 1440 pixels and device pixel ratio 2 selects the 2800-pixel product banner (135,614 bytes). The 1920-pixel candidate is 77,678 bytes. Browser emulation was reset after testing.
- Verified inside-popup pointer movement keeps Products open; moving out closes it. Outside click, Escape, Shift+Tab out, and selecting the same-page products link also close it. Mobile navigation closes after link selection. French Products disclosure and shared composition checked.
- Gas category visibly shows the display and keypad facing the viewer.
- Local screenshots are retained in ignored `reports/banner-correction-2026-10-11/`. Local export intentionally lacks production-only inquiry/analytics environment variables; GitHub Pages injects the existing configuration during deployment.

Automated image verification now rejects a cropped/non-7:3 carousel master, a missing 2800-pixel banner candidate, or a homepage using the old gas category image.
