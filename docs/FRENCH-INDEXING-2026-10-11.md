# French indexing recovery — October 11, 2026

Property: `sc-domain:calinmeters.com`. Times below use Asia/Shanghai unless marked UTC.

## Existing state preserved

Reviewed `AGENTS.md`, `README.md`, the project state, handoff, TODO, French copy decision, recent weekly evidence, Git status/diff/history, locale routes, French metadata and Search Console workflows before operating. Started from production commit `437928a`; the existing untracked `CalinMeter-KnowledgeBase/` directory is outside this change.

The September 8 release already removed the French `noindex` gate with the owner's authorization. All 11 French routes have discovery links, self-canonicals and reciprocal language alternates. Contact and inquiry recipient changes to `scott@szcalinmeter.com` were already deployed in PR #29.

## Baseline and live checks

- [URL Inspection workflow 38120225099](https://github.com/hygentlemen/calinmeters-website/actions/runs/38120225099) succeeded on October 11. All five inspected English category/solution URLs were indexed. The 11 French URLs were not indexed: six still reflected July/August `noindex` crawls; five were discovered but not indexed. The brass-water URL was discovered again, superseding its October 7 unknown status.
- All 11 production French URLs returned HTTP 200, allowed indexing, declared the correct canonical and passed language-alternate checks. `robots.txt` and `sitemap.xml` matched the repository versions.
- `npm run verify` passed lint, typecheck, build and SEO verification: 27 HTML pages, 27 sitemap URLs, 11 reciprocal locale pairs.
- The shared investigation reported one public client receiving Cloudflare 403/error 1010. That result alone does not establish a Googlebot block. The actual Google live tests below test access from Google's inspection infrastructure.

## Search Console operations

Operation results are recorded after visible confirmation in the signed-in Search Console UI. A successful request means acceptance into the priority crawl queue, not completed indexing. Do not repeat accepted requests merely to refresh the date.

All **11 of 11** French URLs passed a separate Google live test and received the visible **Indexing requested** confirmation. Each live test reported smartphone inspection, crawl allowed **Yes**, page fetch **Successful**, indexing allowed **Yes**, and the correct self-canonical. Google's rendered screenshot of the brass-water page was also reviewed and showed the actual French product page.

| French URL | Stored baseline | Live test time | Request result |
| --- | --- | --- | --- |
| [CA568 brass water](https://calinmeters.com/fr/produits/ca568-compteur-eau-prepaye-multijet-laiton/) | Discovered, not indexed | 15:06:38 | Accepted into priority crawl queue |
| [French home](https://calinmeters.com/fr/) | Old noindex crawl | 15:17:17 | Accepted into priority crawl queue |
| [Water category](https://calinmeters.com/fr/produits/compteur-eau-prepaye-sts/) | Discovered, not indexed | 15:19:23 | Accepted into priority crawl queue |
| [Electricity category](https://calinmeters.com/fr/produits/compteur-electricite-prepaye-sts/) | Old noindex crawl | 15:21:01 | Accepted into priority crawl queue |
| [CA568 plastic water](https://calinmeters.com/fr/produits/ca568-compteur-eau-prepaye-multijet-plastique/) | Old noindex crawl | 15:22:50 | Accepted into priority crawl queue |
| [CA568 ultrasonic water](https://calinmeters.com/fr/produits/ca568-compteur-eau-prepaye-ultrasonique/) | Discovered, not indexed | 15:25:41 | Accepted into priority crawl queue |
| [CA168 standalone STS](https://calinmeters.com/fr/produits/ca168-compteur-electricite-prepaye-sts/) | Discovered, not indexed | 15:28:46 | Accepted into priority crawl queue |
| [CA368 standalone STS](https://calinmeters.com/fr/produits/ca368-compteur-electricite-prepaye-triphase-sts/) | Discovered, not indexed | 15:32:29 | Accepted into priority crawl queue |
| [CA168 LoRaWAN](https://calinmeters.com/fr/produits/ca168-compteur-electricite-prepaye-sts-lorawan/) | Old noindex crawl | 15:34:42 | Accepted into priority crawl queue |
| [CA168 GPRS](https://calinmeters.com/fr/produits/ca168-compteur-electricite-prepaye-sts-gprs/) | Old noindex crawl | 15:37:12 | Accepted into priority crawl queue |
| [CA368 GPRS](https://calinmeters.com/fr/produits/ca368-compteur-electricite-prepaye-triphase-gprs/) | Old noindex crawl | 15:38:51 | Accepted into priority crawl queue |

These operations close the previously deferred UI steps. No current French `noindex`, canonical or discovery-link defect was found that required rewriting working site code. Stored crawl scheduling/index selection remains Google's responsibility; the live tests alone do not establish why its previous crawl delay occurred.

## Property checks

- Sitemaps: `https://calinmeters.com/sitemap.xml`, status **Success**, 27 discovered pages, zero videos. Last submitted September 21; last read October 2. No sitemap resubmission was needed. The homepage inspection's temporary sitemap-processing message is not evidence that the property-level sitemap failed.
- Manual actions: **No issues detected**.
- Security issues: **No issues detected**.
- Google's robots.txt report: all four HTTP/HTTPS and www/apex files show **Fetched**, 69 bytes and no listed issues. The canonical HTTPS copy was checked September 28 at 06:28; its saved content allows `/` and points to the canonical sitemap. These dates are historical, separate from today's live page tests.
- Requested a fresh crawl of `https://calinmeters.com/robots.txt` after the reported error-1010 concern. Search Console confirmed **Recrawl request sent**. That acknowledgement does not yet confirm a new robots.txt fetch.
- Crawl stats (last updated October 6): 1,153 requests over the report window, 1,106 for the apex and 47 for www; both hosts show **No problems**. The response breakdown lists 200, 301, 404 and 304, with no 403 or server-error bucket. The historical report cannot rule out a later or intermittent block. No Cloudflare security rule was weakened.
- Inspected all six examples in **Excluded by ‘noindex’ tag**: French home, electricity category, CA168 GPRS, CA368 GPRS, CA168 LoRaWAN and plastic water. All belong to the French release whose live pages now permit indexing. Clicked **VALIDATE FIX** and observed **Validation started — Started: 10/11/26**. [Validation details](https://search.google.com/search-console/index/validation?resource_id=sc-domain%3Acalinmeters.com&item_key=CAMYCCAC) confirmed **6 pending, 0 failed**. Validation is pending, not passed. The page-indexing aggregate was last updated October 4 and still showed six affected pages at submission.

The plastic-water live test's product-snippet issue was inspected: it requires one of `offers`, `review` or `aggregateRating`. This inquiry-only catalog has no approved public prices/reviews/ratings. Google's same live test explicitly says the page can be indexed; this warning concerns product-rich-result eligibility. Preserve factual `Product` metadata rather than inventing an offer or rating to silence the warning. See [Google's product-snippet requirements](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).

## Completion criteria and next check

The existing Monday inspection workflow is scheduled for October 12 at 08:45 Asia/Shanghai. Compare its stored Google records with the baseline: a new crawl date, `INDEXING_ALLOWED`, Google's selected canonical and an indexed verdict are separate observations. A live test does not itself update the stored Google Index report.

Google controls crawl scheduling and inclusion; requests do not guarantee indexing. See [request recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) and [URL Inspection live-test limitations](https://support.google.com/webmasters/answer/9012289).
