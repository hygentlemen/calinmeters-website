# Cloud Codex operations — updated November 3, 2026

## Recommendation

Use cloud Codex for the repository/API-based portion of weekly operations, with GitHub Actions retaining deterministic collection and deployment. Keep authenticated browser-only checks and private inquiry classification as explicit separate operations until equivalent cloud access is configured and verified. The October 26 assessment has now progressed to a published private environment; publication, actual report access and scheduling remain separate acceptance states.

This repository is a good candidate: it has reproducible Node builds, checked-in product facts and image derivatives, a weekly checklist, versioned measurement rules, tests, aggregate analytics artifacts and separate Pages/Worker workflows. A new cloud task must read AGENTS, README, PROJECT_STATE, HANDOFF, TODO and the latest weekly memo, then inspect status/diff/history and the current weekly issue before editing.

Official OpenAI documentation says a published [cloud environment](https://learn.chatgpt.com/docs/environments/cloud-environments) provides repositories, dependencies, tools and access settings, with a separate workspace per task; work can continue while the owner's computer is asleep. This does not transfer the Mac's files, browser session or service permissions automatically. A configured network destination still needs service authorization.

## November 3 configuration receipt

- Created and published **calinmeters-website** through the supported web Cloud environment wizard, selecting only `hygentlemen/calinmeters-website` with the existing GitHub connection. The environment panel shows **Only me**; the published environment appears in the new-task picker after refresh.
- Saved a fail-fast installation script requiring Node 24, Git and GitHub CLI, then installing both root and `workers/inquiry` lockfiles. No dependency manifests or tracked source were changed by setup.
- Cloud setup passed 41 report tests, both inquiry-event/remount suites, full i18n/typecheck/build/SEO/image verification, lint, and the Worker check including 32 tests, typecheck and dry-run. These checks ran against main `7f134e56b7ddb858406e19343b6eee7a52e10fd9`; dry-run is not production deployment.
- Saved startup instructions for fresh-main inspection, preserving existing work, actual report artifacts, data-quality boundaries, sourced content, separate release authorization and the [weekly run prompt](CLOUD-CODEX-RUN-PROMPT.md). New tasks must refresh the repository; a prepared filesystem is not automatically the latest main revision.
- Networking keeps all-public-Internet access off and package-manager domains on, with only `api.github.com`, `calinmeters.com` and `www.calinmeters.com` added. No HTTP secrets or environment credentials were added, and no Mac/Google/Cloudflare/Resend tokens were copied.
- The original setup instance retained its old network policy after the draft changed, producing proxy CONNECT 403 for GitHub API requests. A fresh task from the published environment verified the effective policy, remote main, Issue #46 and Actions through both gh and the existing GitHub connector. No new credential was required.
- Fresh-task acceptance actually downloaded artifact `13233870984` from run `41642616773` through the GitHub connector, verified its 9,564-byte ZIP against GitHub's SHA-256 `1d3f5c926541439640c9246bc7eda201514971af0f555fcc688c8c65ebaef057`, and independently parsed both complete weekly windows: GSC 38/25 clicks, 616/676 impressions and GA4 140/124 views. It preserved query anonymization, date coverage and quality flags. Report 41/41, inquiry suites 2/2 and mocked Worker 32/32 tests also passed; no redundant full build was needed.
- Direct shell artifact download followed the actual redirect to `productionresultssa15.blob.core.windows.net` and then received proxy CONNECT 403. The existing GitHub connector successfully supplied the same ZIP through `sdmntprcentralus.oaiusercontent.com`; use that verified connector route. No wildcard or extra artifact host was added merely to duplicate an already working path. Public `/`, `/fr/`, `/robots.txt` and `/sitemap.xml` returned HTTP 200 through curl; Python urllib returned 403, so distinguish client-specific fetch failures from a site outage.

For full-route local preview in this cloud environment, use `npm run build` and `python3 -m http.server 4173 --bind 127.0.0.1 --directory out`. Setup verified English/French homepages and the electricity category as HTTP 200. Next dev served both homepages but returned a product-route 500 from its static-export fallback check; this is an observed development-mode limitation, not a demonstrated production failure. Do not use `npm start` for the exported site or claim public form delivery from a preview without production variables.

## Work that fits this project

| Task | Suggested cadence | Cloud deliverable and limit |
| --- | --- | --- |
| Technical site health | Daily or after deployment | Check canonical pages, redirects, missing images/PDFs, metadata, robots/sitemap/llms; report actual regressions with URLs. |
| Analytics quality | Daily collection, weekly review | Detect missing dates, dimension loss, truncation, pagination caps and processing revisions; quiet backfill only where needed. Never substitute zero for absent totals. |
| SEO/GEO acquisition and intent | Weekly | Re-query comparable windows, review all 11 French URLs, map queries to owners, review sourced buyer gaps, update the memo and issue. A no-copy-change decision is acceptable. |
| Code regression repair | On failure | Reproduce a CI or form/report defect, make a scoped fix, run relevant tests and open a PR with evidence. |
| Dependency/security maintenance | Monthly or on an applicable advisory | Assess affected dependency paths, propose updates and test the static export and Worker separately. Do not assume a framework upgrade is safe from a successful install. |
| Browser/accessibility/performance checks | After UI changes or periodically | Use a supported cloud browser/test runner for public desktop/mobile flows; distinguish lab measurements from field CWV. |
| Source-backed product/document maintenance | When approved facts change | Compare catalog, English/French copy, PDFs, image links and schema; correct inconsistencies without inventing certification, price or warranty claims. |
| Deployment and documentation upkeep | Per merged change | Check the exact revision's workflow/job results, verify public output, and update handoff/decision records. |
| Inquiry quality summaries | Only with authorized private data access | Aggregate delivery, duplicates, spam and qualified leads in a private system; do not place customer content or identities in GA4, public issues or the site repo. |

A sample-based AI answer/citation review is also possible, but only with access to the actual engines/tools and a recorded date, question and answer. The GA4 `AI Assistant` channel alone does not prove a named AI engine cited the site or establish an AI search ranking.

## Recommended data and release path

1. Keep scheduled GA4/GSC collection in the existing GitHub Actions workflows. They already use repository secrets and produce aggregate `.raw.json` artifacts; the weekly workflow currently creates a checklist issue, not a full autonomous Codex execution.
2. Give the cloud task the repository and the ability to read relevant issues, workflow status and artifacts. If quiet backfills are needed, verify narrowly scoped workflow-dispatch permission. Repository checkout access alone does not establish these API permissions.
3. Use the existing scripts and measurement contract. Record exact run IDs, reporting dates, source quality and revised comparison cohorts. Do not combine capped page/query rows into property totals.
4. Have the cloud task prepare a focused PR and reviewed weekly evidence. Define the unattended release scope separately when setting up the service. Merge/deployment automation should retain existing checks and must distinguish a skipped Worker deploy from an actual deployed version.
5. Review an initial end-to-end cloud run before scheduling it. Verify that it can download a real artifact, run tests, inspect the public site, create the intended output and report any missing private/browser evidence honestly.

## Environment preparation

- Connect `hygentlemen/calinmeters-website` and use the current remote main revision; preserve any work already in the task.
- Install Node 24 and Git/GitHub CLI tools as needed; run `npm ci` and `npm ci --prefix workers/inquiry` from the checked-in lockfiles.
- Verify `npm run test:report`, `npm run test:inquiry-events`, `npm run verify`, `npm run lint` and `npm run check --prefix workers/inquiry` in the prepared environment.
- Permit the required package, GitHub API/artifact and public-site destinations. Test actual download hosts as well as `github.com`, `api.github.com`, `registry.npmjs.org` and `calinmeters.com`; an allowlist entry is not authentication.
- Prefer consuming Actions artifacts over copying Google OAuth or Cloudflare/Resend secrets into another runtime. If direct service calls are needed later, configure and test their specific permissions in the cloud environment's supported secret mechanism. Never commit tokens or secret values.
- The public contact remains `scott@szcalinmeter.com`; as of this release, the shared English/French Worker recipient is `tom.qi@qq.com`. The verified sender remains `info@calinmeters.com` and Reply-To remains the visitor's validated address.

## What remains separate

The local external drive `/Volumes/My Passport/表计`, untracked knowledge base and Mac-only editing tools are not cloud inputs. Use approved repository assets or explicitly provided cloud sources when a task needs them. Public derivatives already in the repo are sufficient for normal builds.

The current Search Console validation/CWV checks use Scott's authenticated local Chrome session. API URL Inspection covers stored index status and canonicals; it does not run Google's live test or request indexing. Do not claim those browser-only actions were performed from an API artifact. Keep them assigned to a signed-in operator unless a suitable authorized cloud mechanism is verified. Likewise, successful form responses do not establish QQ inbox delivery or lead quality.

Scheduling is separate from cloud task execution. [OpenAI's scheduled-task documentation](https://learn.chatgpt.com/docs/automations) distinguishes desktop project tasks, which require the computer and app to remain running, from web tasks using accessible context and connected tools. November 3's ordinary cloud schedule test downloaded/parsed the real weekly/inspection artifacts and reconciled all seven GSC daily property totals. Its existing GitHub connector did not expose workflow-dispatch inputs. A second one-time test created from the repository environment returned `environment_selection=inherited` but no environment IDs; the actual run had only a scratch directory, no Git checkout or cloud-environment runtime. That test remains paused. These are verified product/access limits, not a request to copy credentials or open the Mac.

The supported [scheduled review](CLOUD-SCHEDULED-REVIEW.md) is prepared for Tuesday at 16:00 Asia/Shanghai after a new quiet 15:00 complete-week refresh in the existing report workflow. Its one-time test is paused; saving/activating the recurring schedule awaits the unlocked browser, with final receipt on issue #46. It supports report review and evidence; code changes/builds remain separate interactive tasks in the already published cloud repository environment. The Tuesday cadence gives Sunday data more processing time than an early Monday run. First intended future scheduled checkpoint is November 10; no claim is made that activation or a future clock-triggered execution has already happened. No desktop automation was created.
