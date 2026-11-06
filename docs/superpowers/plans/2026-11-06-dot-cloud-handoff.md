# Dot and Codex Cloud Handoff Implementation Plan

**Goal:** Implement the owner's approved shared-conversation division of responsibilities, using the existing cloud environment and weekly review.

**Architecture:** Actions collects evidence; the existing scheduled review produces the weekly report; an independent daily cloud task handles read-only inspection; Dot owns ongoing responsibility notes and explicit technical dispatch when findings are brought to it. Codex Cloud prepares tested repository changes for review. Actual checks found no automatic schedule-to-Dot binding/wake-up route, which remains explicit. Execute this configuration in the current session; preserve the existing checkout and private untracked files.

**Tech stack:** Existing ChatGPT Dot and Codex Cloud UI, GitHub Actions/CLI, Markdown operating instructions, existing Next.js build.

## Constraints

- Scope only `hygentlemen/calinmeters-website`; retain existing collection and single Tuesday review.
- All schedule times use Asia/Shanghai.
- No new credentials, production inquiries, customer communications or unattended releases.
- Use actual saved schedules and cloud-task results as acceptance; a handoff message alone is insufficient.

## Configuration and verification

- [x] Read AGENTS, README, git status/diffs/history, relevant cloud and measurement documents, and the shared conversation's original Chrome thread.
- [x] Fetch remote main and inspect recent Actions/PRs; confirmed no tracked working changes and no open PRs before this change.
- [x] Read official Dot task/controls documentation; inspect the existing Dot without changing unrelated duties.
- [x] Deliver the scoped daily 16:30 responsibility and request one explicit read-only cloud repository acceptance.
- [x] Verify the saved responsibility, real artifact access and actual cloud repository/test result. Dot cannot create/bind its own plan with current tools; an independent daily cloud inspection was enabled through the web UI at 16:30 China Standard Time, first scheduled November 7. Automatic Dot wake-up remains unconnected.
- [x] Add the operating agreement and link it from AGENTS, README and existing cloud handoff prompts; record actual receipts and limitations.
- [x] Review changed Markdown links/content, run `npm run build`, review `git diff --check`, and create a focused PR with evidence. PR #49 merged as `9fa97d6`; 51 local Markdown links passed and the build exported 27 pages.
- [x] Make the operating instructions available to current main under the owner's configuration authorization and have Dot acknowledge the final source and task boundaries. Dot independently verified merged PR #49/main `9fa97d6`, read the agreement and confirmed the independent schedule and missing automatic wake-up. The main publication, actual manual inspection result and independent live discovery-file checks are recorded in the agreement.
- [x] Record the manual daily inspection's successful artifact/five-page reads and its three discovery-file network gaps; independently confirm those files return HTTP 200. Preserve the cloud-runtime limitation and first future scheduled-run checkpoints rather than claiming unobserved success.

Production website behavior is outside this change. A documentation-only repository publication makes the new operating contract available to future tasks without modifying site content, form logic or workflow schedules.
