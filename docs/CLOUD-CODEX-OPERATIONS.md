# Cloud Codex operating assessment — October 26, 2026

## Recommendation

Use cloud Codex for the repository/API-based portion of weekly operations, with GitHub Actions retaining deterministic collection and deployment. Keep authenticated browser-only checks and private inquiry classification as explicit separate operations until equivalent cloud access is configured and verified. This is an assessment and handoff guide: no cloud environment, scheduled task, credential grant or migration was created by this review.

This repository is a good candidate: it has reproducible Node builds, checked-in product facts and image derivatives, a weekly checklist, versioned measurement rules, tests, aggregate analytics artifacts and separate Pages/Worker workflows. A new cloud task must read AGENTS, README, PROJECT_STATE, HANDOFF, TODO and the latest weekly memo, then inspect status/diff/history and the current weekly issue before editing.

Official OpenAI documentation says a published [cloud environment](https://learn.chatgpt.com/docs/environments/cloud-environments) provides repositories, dependencies, tools and access settings, with a separate workspace per task; work can continue while the owner's computer is asleep. This does not transfer the Mac's files, browser session or service permissions automatically. A configured network destination still needs service authorization.

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

Scheduling is separate from cloud task execution. [OpenAI's scheduled-task documentation](https://learn.chatgpt.com/docs/automations) distinguishes desktop project tasks, which require the computer and app to remain running, from web tasks using accessible context and connected tools. Verify the account's actual cloud/scheduling capabilities before promising a fully unattended weekly repository run. Do not relabel a local desktop automation as cloud execution. No duplicate schedule is needed merely to collect the reports already produced by Actions.
