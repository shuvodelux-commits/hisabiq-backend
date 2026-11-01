# Proposed issue: 📝 [docs] foundation: reconcile P0 delivery scopes

**Publication state:** Local draft only. No GitHub issue number, worker or branch is created by this document.

## Problem

The foundation is an open draft PR while approved workflow/setup changes remain local. A migration-documentation commit is also on the local foundation branch even though its document tree is already represented by PR #2. Publishing the whole checkout would mix scopes and include machine-specific skill links.

## Context

- **Where:** `shuvodelux-commits/hisabiq-backend`, foundation PR #1 and local workflow/setup documents.
  - a. Compare PR #1 head `b818c217bbd43da117fb916ca6b5d8987ba53a97` with local `8ac2a25` and dirty changes.
  - b. Compare the migration document tree with PR #2 head `52afc6ec164b55c0bcc2802a8648faf6b9f80835`.
  - c. Inventory local setup files and separate portable instructions from host state and generated evidence.
- **Who:** Owner and independent QA/reviewer accepting P0.
- The owner-approved execution plan controls routing. This task is documentation/delivery reconciliation; it does not authorize new backend behavior, source/configuration changes, skill installation, security audit, merge or deployment.
- Public seams: existing `/health` and pure placement policy remain unchanged. This task has document/PR-scope witnesses rather than new behavioral tests.

## Fix

Retain the existing foundation and migration draft PRs with distinct responsibilities. Produce the file-to-PR scope map and accurate evidence status, and prepare the smallest sequential documentation/setup slices without publishing host-specific state or duplicating migration content.

## Acceptance Criteria

- [ ] The scope map below assigns every current change group to its existing PR, a proposed sequential follow-up, or preserved local work, with no duplicated migration commit on PR #1.
- [ ] PR #1's draft description reflects its exact published head, actual CI and pending independent QA/security/review, with no D1 or platform-capacity certification claim.
- [ ] Portable setup versus local-only state is explicit: the nine absolute plugin-cache symlinks, onboarding answers/backups/active state and generated caches are excluded from blind staging. Reproducible skill distribution and licensing remain review gates.
- [ ] Verification records source/tree comparisons and document checks, distinguishes local dirty-checkout tests from published-head CI, and makes no merge/phase/audit pass claim. Later implementation stays Backlog until this task is accepted through the approved process.

## Risk

🔴 **High** · An indiscriminate push could contaminate the foundation with migration scope or publish nonportable/local setup state. Changes remain reversible draft/document edits; no production or financial data is touched.

## Blocked by

- None.

> This draft has no predecessor implementation issue: the owner has approved planning/P0 evidence work. Issue publication and worker execution still require separate authorization; this is not a Ready card.

## Reconciliation scope map

| Change group | Placement / disposition | Evidence / review boundary |
|---|---|---|
| Hono source, placement function, existing tests, package/lockfile, CI | Existing draft PR #1 at `b818c21`; retain current product scope | No source changes during reconciliation; exact-head independent QA/security/review still pending |
| Lifecycle spec, nine-task migration plan and lifecycle additions to foundation architecture | Existing draft PR #2 at `52afc6e`; preserve separately | `git diff 52afc6e 8ac2a25 -- docs` is empty. The local migration commit is not a reason to push it into PR #1 |
| Approved execution-plan rewrite, P0 evidence report, issue tracker and project overview; corresponding AGENTS/CLAUDE policy pointers and foundation execution-authority edits | Proposed documentation-only follow-up to the foundation/migration baseline, one approved slice at a time | The full approved plan exceeds the usual 400-line target; retain as a single coherent planning artifact only with an explicit size disposition, or agree a reference-file split before Build. Do not invent new product scope |
| Vendored `.agents` scripts/skills/workflows/hooks, `.claude` compatibility distribution, `.codex` relative links, skill provenance/lock and permissions/config | Separate proposed workflow-packaging follow-up after document scope approval | Hundreds of files are not a small incidental docs commit. Inventory licenses/upstream revision, duplicate links and portability; split into independently verifiable slices before publication/Build |
| Nine `.agents/skills/*` absolute symlinks to `/home/shoaib/.codex/plugins/cache/...` | Local host repair state; exclude from portable PRs | Use an approved reproducible install/catalog strategy later; do not silently vendor or relink plugins here |
| `.claude/super-board/configs/hisabiq-backend.json` plus reviewed `.gitignore` additions | Workflow configuration follow-up, with human merges/one worker/no migrations preserved | Distinguish intended tracked config from local active pointer, answers, backup, inflight and migration recovery state |
| `wrangler.jsonc` compatibility-date edit | Preserve untouched and unstaged; owner/runtime review required before deciding placement | Existing local change from `2026-11-01` to `2026-10-30`; not made by this reconciliation and not proven by Node tests |
| Local `8ac2a25`, all dirty/untracked work and existing refs | Preserve in place | No reset, rebase, force push, branch deletion, sweeping add, commit or checkout required for this preparation |

## Current verification

- PR #1 is a draft and has successful `verify` CI on `b818c21`; it is unmerged.
- PR #2 is a separate draft with no returned checks; it is unmerged.
- The two migration document trees compare equal; their commit IDs differ.
- Previous P0 evidence records frozen install, typecheck, nine local tests and a zero-advisory dependency audit. These results do not substitute exact-head independent QA.
- The board is empty and there is no P0 issue/dependency/preflight record.
- No worker, audit, source/schema/UI change, merge or deployment is performed by preparing this packet.

## Execution handoff

After owner authorization, publish only this issue using the installed ticket format and label `docs` (leave out `feature` so the docs helper row remains effective). Link the existing foundation PR in Context. Review the scope map in native lint before any worker starts. Any actual packaging, changed runtime configuration or publication of additional PRs must be separately scoped; do not turn this reconciliation card into a bulk tooling import. P0.2/P0.3/P1 remain unselected.
