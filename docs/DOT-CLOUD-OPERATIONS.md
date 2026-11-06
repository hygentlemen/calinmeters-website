# Dot and Codex Cloud operating agreement

Effective November 6, 2026, under the owner's request to implement the [shared division of responsibilities](https://chatgpt.com/share/6aede582-8b98-83ea-a33a-2c4b432d3f6b). Scope is only `hygentlemen/calinmeters-website` and `https://calinmeters.com/`. Other Dot responsibilities are independent.

## Responsibility and cadence

| Owner | Work | Output |
| --- | --- | --- |
| GitHub Actions | Existing daily GA4/GSC collection, Monday URL Inspection and checklist, Tuesday 15:00 quiet complete-week refresh | Real dated artifacts and workflow/job results |
| Existing Tuesday 16:00 cloud review | Compare complete cohorts, inspect source quality, buyer intent and all 11 French URLs | One Chinese weekly readout and aggregate evidence on the existing weekly issue |
| Independent daily cloud inspection | Daily 16:30 read-only artifact/site checks; Tuesday reuse of the existing weekly review | Exception evidence in its own task, with a ready-to-forward work order |
| Dot | Ongoing responsibility notes, investigation when asked to review evidence, deduplicated cloud task dispatch and follow-through | Private findings, technical work orders and review of returned results |
| Codex Cloud | Evidence-based repository diagnosis, scoped repair, appropriate tests and production build | A focused `codex/` branch and reviewable PR, with exact validation evidence |
| Scott | Specific production release, significant structure/content publication, commercial facts, form routing and access decisions | Recorded approval for the concrete change |

All times are **Asia/Shanghai**. The independent daily inspection is enabled; this is **not** a saved Dot wake-up schedule. Current tools/UI did not expose a verified way to bind an ordinary scheduled run to Dot or wake it on completion. Scott must bring an actionable result to Dot, or explicitly ask Dot to read the named task. Do not claim unattended scheduled inspection → Dot → Codex repair is connected end to end.

Check actual run timestamps, artifact dates and source windows rather than treating the scheduled time as proof of collection. Where supported, perform at most two follow-ups for an active run, about 30 minutes apart, then record the gap without repeated unchanged alerts. Do not claim a follow-up was scheduled if no supported mechanism saved it. A stale or absent source is unavailable, never zero.

The existing weekly review `6ae9e6eb2b7c8190b631605e46114c19` remains the single complete weekly report. Keep its Tuesday 16:00 schedule and the paused inheritance test `6ae9e83310b88191841e947d8a6f764d` intact. Daily inspection handles exceptions, not a second full weekly report. On Tuesday, inspect the actual review result when it finishes; do not assume 16:30 proves it finished. Do not create a new weekly issue or post a duplicate weekly summary.

## Dot's operating instructions

1. Read current main's AGENTS, README, this agreement, HANDOFF, PROJECT_STATE, SEO-GEO-OPERATIONS, MEASUREMENT-CONTRACT, CLOUD-SCHEDULED-REVIEW and latest weekly memo. Use the existing weekly issue and inspect open PRs/tasks before assigning work.
2. Download and parse real Actions artifacts through the existing authorized GitHub connection. Record run ID, artifact, collection time, data windows and quality flags. An accessible workflow summary does not establish artifact contents. Prefer the verified connector download route if the direct shell redirect is blocked.
3. Check public English/French homepages, the three English authority pages and discovery files. On an isolated failure, make one bounded retry and check another available client/source before alleging downtime. Distinguish an access-client failure from a production failure.
4. Review missing dates, failed collectors and controlled-dimension loss before interpreting trends. Compare like-for-like complete windows, preserve processing revisions, and show absolute counts alongside percentages. A one-day change in a very small sample alone does not justify an incident or a code task.
5. Track all 11 French URLs, including absent rows. Separate stored Google crawl evidence from live indexability; do not repeatedly request indexing merely to refresh an unchanged queue. Investigate actual buyer queries and source-backed content opportunities. AI referral traffic is not proof of an AI citation.
6. Maintain one private ledger entry per open finding: fingerprint (repository + affected URL/component + symptom), first/last observation, source/run, owner, task link, PR, validation, release approval, deployment and post-release result. Continue the original task/PR for the same finding. Persist the ledger in Dot's own notes; never store credentials or customer message bodies in this repository.
7. Notify Scott in the existing Dot conversation only for a new actionable failure, a meaningful sustained change, a verified fix or a concrete decision. Keep unchanged healthy checks and repeated blocked checks quiet. Do not add customer messages, marketing, email or chat broadcasts to this responsibility.

## Codex task dispatch and acceptance

Use the already published private **`calinmeters-website`** environment. Do not create another environment or copy credentials. Select that environment explicitly; a generic scheduled scratch workspace or a local task on a connected PC is not a substitute. Verify the actual selected environment and repository inside the task.

Each technical work order must carry:

- The affected route/component and observed versus expected behavior.
- The actual evidence/run IDs, relevant dates and data-quality caveats.
- The existing issue, task and PR references, or confirmation that no duplicate exists.
- The approved scope and explicit acceptance criteria; separate diagnosis from changes requiring Scott's approval.
- This agreement and the scoped task instructions below, including release and privacy boundaries.

Start from current remote main while preserving existing work; read AGENTS/README and relevant source files, then inspect status, diff and commits. Verify the repository before running commands. A prepared cloud filesystem may contain an older main revision.

Use [CLOUD-CODEX-RUN-PROMPT](CLOUD-CODEX-RUN-PROMPT.md) for a full weekly repository task. For a specific defect, perform only its investigation and repair; do not launch an unrelated full weekly content cycle. Normal required validation for relevant changes is `npm run test:report`, `npm run test:inquiry-events`, `npm run verify`, and `npm run lint`; Worker changes also require `npm run check --prefix workers/inquiry`. Run the required production build before pushing. Avoid redundant tests when a documentation-only change needs only link/content review and the required build.

Return exact commands/results, changed files, remaining limitations and PR link to Dot. Dot inspects the result and required checks, asks Scott for a concrete release decision when needed, and follows the same task after approval. A completed task is not proof of a merged PR or deployment. After an approved release, verify the exact commit's Pages/Worker job and live output; a skipped Worker job is not a Worker release.

## Change and data boundaries

Read-only research, report analysis and diagnostics may proceed. Demonstrated low-risk technical fixes may be prepared in a branch and PR for review. There is no blanket unattended merge/deploy authorization. Website structure changes, publication of new content, commercial facts/prices/product parameters, inquiry-form routing, permissions and credentials require Scott's specific approval before the respective change is applied. A task's narrowly recorded approval takes precedence over generic instructions within its scope.

Keep GitHub Pages, `public/CNAME`, analytics/discovery files, the separate Cloudflare Worker, public contact `scott@szcalinmeter.com`, inquiry recipient `tom.qi@qq.com`, verified sender and visitor Reply-To intact. Do not send production test inquiries, make customer contact, change account security or copy secrets to task output. Local source drives and the untracked knowledge base are not authorized public inputs.

Classified form success is not verified QQ delivery, a unique customer or a qualified lead. Private delivery/qualification remains unknown unless an authorized private source provides it. Publish only necessary aggregate evidence; no customer identities, contact details or message text in GitHub, GA4 or public content. Keep historical unknown submissions and returned 90-day truncation flags.

## Handoff baseline and limitations

The November 3 receipt established a published repository environment and genuine artifact/build access. It also established that an ordinary scheduled review did **not** inherit the repository runtime. Dot's explicit cloud-task dispatch is a distinct route and needs its own actual acceptance; do not infer success from those earlier tests.

At that baseline, French indexing was **10/11**, with the electricity category awaiting a fresh Google crawl. CA568 was not established as the remaining defect. French classified successful submissions already existed; an older missing-event discussion does not establish a current bug. Read newer evidence before acting.

Existing Google browser sessions, QQ inbox access and private customer classifications are not automatically inherited by either cloud runtime. Record precise access gaps and use available aggregate evidence without inventing results or requesting new tokens as a first workaround.

## November 6 acceptance receipt

- Dot received and acknowledged the scoped CalinMeters responsibility and approval boundaries in its existing conversation. Other responsibilities were not modified.
- Dot actually downloaded and parsed `daily-analytics-report` artifact **13484800359**, 4,253 bytes, from [run 42178314936](https://github.com/hygentlemen/calinmeters-website/actions/runs/42178314936). ZIP SHA-256: `a00a0e38917aa6ab64a96c6c72c41431e6cc46d576f582b6540eab854e9cee9d`; GitHub metadata was independently checked. The files were `daily-analytics-2026-11-05.md` and `.raw.json`, not a weekly export or fresh inspection snapshot. Dot retained the 90-day truncation and unreturned French-row caveats.
- Dot explicitly dispatched one [read-only repository acceptance task](https://chatgpt.com/local/01a1b152-789a-755b-9264-15ea6964e01e). Its runtime reported `provider=cloud`, connected/current observations and the selected cloud environment; the actual repository was `/workspace/calinmeters-website`. HEAD and a read-only `git ls-remote origin refs/heads/main` both gave `7c7e552e4ca8428e7fdef7110df4d0e3a4995a88`. Local `main`/`origin/main` refs were absent, correctly reported rather than invented. Node was v24.22.1. `npm run test:report` exited 0 with **41 passed, 0 failed**. Repository status/diff remained clean. The task was independently opened in the web UI; it was not a local connected-PC or generic scratch task.
- The existing weekly review remains enabled for Tuesday 16:00, with the UI showing November 10; the separate inheritance test remains paused.
- Dot's exposed schedule tools could view/update existing tasks but could not create a new plan or set a Dot owner/target conversation. Its GitHub event triggers did not establish Actions `workflow_run` completion delivery. The web creation dialog likewise had no Dot assignment control. No unsupported/private API was used.
- Created [CalinMeters 每日云端巡检](https://chatgpt.com/scheduled?automationId=6aedeaba50448190b6c55bf21c693d3a&automationSource=cloud), ID **6aedeaba50448190b6c55bf21c693d3a**, through the supported web UI as the independent fallback. It is enabled daily at **16:30 China Standard Time**, with the UI confirming **November 7, 2026, 16:30 GMT+8** as the next run. It is read-only, deduplicates exceptions, preserves existing weekly work and explicitly discloses the missing automatic Dot handoff. No future clock-triggered run is claimed.
- Initial source review found that `priorityCoverage30/90` fills missing French page rows with zeros. Cross-check the original `searchPage30/90` arrays and source status; absence is not measured zero. Dot recorded this as a follow-up, with no repair task or production change during this configuration.

The tested route is **Dot → explicit Codex Cloud task → test result returned to Dot**. The unconnected route is **scheduled inspection result → automatic Dot wake-up**. Operational notes must preserve that distinction.

Official behavior references: [Dot tasks, recurring work and explicit cloud coding environments](https://learn.chatgpt.com/docs/dots/tasks-and-memory), [Dot controls and review](https://learn.chatgpt.com/docs/dots/controls). These describe supported capabilities; the project's actual acceptance receipts establish which routes worked for this account.
