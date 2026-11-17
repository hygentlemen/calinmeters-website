# Complete-week collector readiness — November 17, 2026

## Finding and actual recovery

The screenshot's missing-artifact observation was valid at review time. It did not establish that the preceding week's export was never generated.

- [November 10 quiet run 42843292119](https://github.com/hygentlemen/calinmeters-website/actions/runs/42843292119) started at **23:20 Asia/Shanghai**, 8 hours 20 minutes after the configured 15:00 trigger. Its job log identifies `REPORT_SCHEDULE=0 7 * * 2`. Artifact **13776733309** contains `weekly-analytics-2026-11-08.raw.json` and the matching daily evidence. Both seven-day periods and all six source sections per period are available. It arrived after that day's 16:00 review.
- [November 17 run 44044405506](https://github.com/hygentlemen/calinmeters-website/actions/runs/44044405506) started at **16:09**, but its log identifies the **daily** `30 0 * * *` trigger. Artifact **14310069625** contains only November 16 daily files. This does not demonstrate that the weekly branch failed.
- Existing [Issue #52](https://github.com/hygentlemen/calinmeters-website/issues/52) recorded the missing weekly artifact at 16:02. No duplicate issue or repair PR was open when this investigation began.
- A quiet manual collection on existing main, with `report_date=2026-11-15`, `include_weekly=true`, `notify=false`, completed as [run 44103625996](https://github.com/hygentlemen/calinmeters-website/actions/runs/44103625996). Artifact **14338235158** (9,592 bytes; SHA-256 `e101c6ef3025725e366904dc949e187cd66da42791e0db54b1fdc949d1efd7c1`) was downloaded and parsed. It contains the real November 15 weekly raw JSON plus daily raw JSON/Markdown. No notification, production change or test inquiry was sent.

GitHub documents that scheduled events [can be delayed or dropped under load](https://docs.github.com/en/actions/how-tos/troubleshoot-workflows#scheduled-workflows-running-at-unexpected-times). The observed delay is established by these logs; platform load as its particular cause is not established.

## Recovered evidence

| Source / calendar | Current period | Previous period | Current | Previous |
| --- | --- | --- | --- | --- |
| GA4 property calendar, America/Los_Angeles | Nov 9–15 | Nov 2–8 | 81 users; 89 sessions; 152 views | 92 users; 107 sessions; 134 views |
| GSC Pacific calendar, final | Nov 6–12 | Oct 30–Nov 5 | 618 impressions; 40 clicks | 678 impressions; 41 clicks |

Both GA4 cohorts return all seven expected dates, and their daily views sum to the whole-window view totals. Whole-window users are queried directly, never summed across days. These GA4 weekly responses report no thresholding, sampling or truncation. GSC matched query rows are uncapped but omit anonymized queries; property totals above are queried independently, not summed from query/page rows. GA4 may still revise processed data.

The accompanying daily file has separate 30/90-day windows. Its French raw search-page arrays return **8/11** and **9/11** URLs. Missing rows remain unmeasured, not zero and not proof of deindexing. The 90-day GA4 controlled-event report remains `dataTruncated=true`, `countsReliable=false`, complete only after **September 17**. French 30-day data contains one classified success; delivery and qualification remain unknown. No country-page or commercial-content change follows from this recovery.

## Proposed repair and release boundary

The changes are prepared in [PR #53](https://github.com/hygentlemen/calinmeters-website/pull/53), branch `codex/report-readiness-2026-11-17`; they are **not merged or active on main** at this receipt.

1. Move the quiet trigger to **Monday 23:17 Asia/Shanghai**, away from the top of the hour and with more lead time. This improves the margin; it does not guarantee timely execution.
2. Refresh the latest completed Sunday cohort in **every scheduled daily run**, independently of the daily file's date. Keep manual weekly export opt-in. No new job, credential or notification destination is added. This adds 12 existing logical weekly source queries per scheduled run, plus bounded retries/pagination.
3. Consumers search actual artifacts across runs for the expected Sunday file, inspect both periods, all seven dates and source-quality flags, and revisit later arrivals. The earlier Monday refresh can be provisional because GA4 uses its property calendar and processing can lag. A successful workflow or an existing file alone does not establish completeness.
4. Preserve all 11 French priority URLs. Missing page rows get `status=not_returned` and null metrics; returned zeros remain zeros. Zero impressions have no defined CTR/position. Original raw page rows and all other quality flags are retained.

The existing Tuesday 16:00 cloud review and daily 16:30 inspection have not been rescheduled. Their saved prompt/settings were not edited in this repair; current repository instructions now describe correct artifact selection. A later acceptance must confirm each consumer follows that selection instead of retaining a strict Tuesday-only filter.

**Automatic scheduled inspection → Dot → Codex repair remains unverified.** November 6 confirmed explicit Dot-to-Codex dispatch, not an unattended trigger. Dot supports recurring work according to its official documentation; the observed account/tool gap is not a claim that Dot lacks this feature. This local repair and manual collection do not constitute automatic-handoff acceptance.

## Validation

- Regression first: 41 report tests passed, four new tests failed on the missing date resolver/coverage export.
- After implementation: **45 report tests passed**, covering delayed runs, Sunday/Monday midnight, year boundary, quiet/manual behavior, all 11 missing rows, genuine zero and canonical grouping.
- Inquiry tests: **2 passed**.
- `npm run verify`: i18n, TypeScript, production export, SEO and image checks passed; **27 HTML routes / 27 sitemap URLs / 11 reciprocal locale pairs**.
- `npm run lint`: passed without warnings.
- Workflow YAML parsed and 30 local documentation links verified.
- Live quiet branch [run 44107357805](https://github.com/hygentlemen/calinmeters-website/actions/runs/44107357805), code commit `d5096d88db12c6ce8a65f8ffd693a12cddaeab75`, completed successfully. Artifact **14338193836** (9,653 bytes; SHA-256 `6bc72f75ec2116278e4c125f4faaacaa8dabaa8c6fb646332222ff0022090444`) was downloaded and parsed. The expected Sunday weekly file and collection timestamp exist; both cohorts contain seven dates and reconcile to whole-window views. French coverage retains 11 URLs with 3/2 `not_returned` rows for 30/90 days, all four missing metrics null. The 90-day truncation/counts-unreliable flags remain intact. This is manual branch acceptance, not a future scheduled-run receipt.

Release requires the owner's specific approval under AGENTS and the operating agreement. After merge, verify a real scheduled daily run and inspect its Sunday weekly file. Do not close the recurring operations issue merely because this repair PR exists.
