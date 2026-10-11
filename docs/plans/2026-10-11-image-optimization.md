# Website image optimization

## Scope and design

Requested by the owner on 2026-10-11. Preserve the site's existing layout, catalog, hosting and factual product photography. The current static export serves original files, including a 4 MB CT photograph and a 3.1 MB exterior photograph. Product cards also enlarge images inside clipped containers. The homepage banner has baked-in English text and loses products on narrow screens.

Use Compositor for a text-free crop of the existing product banner, retaining all seven real products. Use deterministic Sharp resizing/encoding for static WebP candidates; no generated product details or altered nameplates. Retain original public URLs for existing links and structured data. Source material is available in `/Volumes/My Passport/表计`; exact byte matches establish the provenance of the current factory and CT photographs. Do not substitute a different office building for the factory.

## Implementation

1. Record source provenance and Compositor export; provide a compact mobile arrangement of the same product photos.
2. Generate checked-in, content-hashed image sizes and a dimensions/srcset manifest. Add a reproducible command; normal builds do not require the external drive.
3. Render native responsive images compatible with GitHub Pages, with intrinsic dimensions, eager/high-priority heroes and lazy lower-page images. Keep screenshot text lossless and existing water WebP masters intact.
4. Remove product-card overscaling; keep the entire product visible. Correct the exterior image's inaccurate interior alt text. Avoid downloading hidden carousel photos until a slide is first visited.
5. Check emitted HTML/image references and decoded dimensions, run existing verification and lint, visually inspect desktop/mobile English/French routes, then publish using the existing GitHub Pages workflow.

## Acceptance

No broken image links, no runtime image service, no new product claims, no altered QR/account masking, no removed originals, readable product labels at the delivered master size, no clipped product silhouettes, and measured per-file byte savings. Loading-time or SEO ranking improvements are not assumed from file-size savings.
