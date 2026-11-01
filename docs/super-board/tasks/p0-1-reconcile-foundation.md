# P0.1 — Align the foundation draft with the approved plan

**State:** Owner-authorized draft-PR reconciliation. No GitHub issue or board worker is created by this document. This contract replaces the earlier proposal to retain the older PRs separately.

## Problem

The older drafts split useful scaffold and lifecycle documentation while retaining obsolete execution policy. The approved Super Board plan needs one current review target without losing either draft's useful work or publishing host-local state.

## Context

- **Where:** `shuvodelux-commits/hisabiq-backend`, replacement P0 draft targeting `main`.
  - a. Preserve foundation commits `717efdc` and `b818c21` with unchanged backend source, tests, dependencies, CI and Wrangler.
  - b. Preserve lifecycle document content represented by `8ac2a25` and older PR #2 at `52afc6e`.
  - c. Add the approved Super Board execution, issue, human-gate and one-task policy in an isolated checkout.
  - d. Publish and verify the replacement before closing older drafts #1 and #2 as superseded; retain their branches and commits.
- **Who:** The owner and independent P0 QA/security/review agents.
- No new backend feature, schema, UI change, issue publication, worker, merge or deployment is authorized by this reconciliation. Test seams remain the existing health and placement interfaces.

## Fix

Publish one replacement P0 draft containing the existing foundation and lifecycle design plus current Super Board policy. Remove competing orchestration instructions, preserve unrelated local work and close the two older drafts only after their content is safely represented by the replacement.

## Acceptance Criteria

- [ ] The replacement preserves all unique foundation and lifecycle work; backend source/tests/dependencies/CI/Wrangler match published foundation head `b818c21` byte-for-byte.
- [ ] AGENTS and both implementation plans defer to Super Board, one current task, separate QA/security/review and human-only merges; no audit or phase acceptance is implied.
- [ ] The replacement includes only explicit reviewed documentation/configuration paths and excludes executable skill-pack imports, nine absolute plugin links, local answers/backups and unrelated Wrangler edits.
- [ ] After verifying the new draft and its head, older PRs #1/#2 are closed as superseded without deleting branches or changing unrelated work. CI and independent QA/security blockers remain visible.

## Risk

🔴 **High** · This preserves a substantial owner-approved planning artifact together with the pre-existing scaffold, exceeding the normal per-task size target. It remains a draft for explicit scope/size and independent safety review; no automatic merge or phase advancement.

## Blocked by

- None.

> Administrative reconciliation of existing drafts was directly authorized by the owner. This file is not a published Ready issue and does not authorize additional product tasks or worker dispatch.

## Scope and exclusion map

| Group | Disposition |
|---|---|
| Existing Hono scaffold, placement policy, tests, dependencies and CI | Carry existing commits unchanged into replacement |
| Subscription/placement lifecycle design | Carry existing unique documentation forward; change orchestration prose only |
| Approved execution plan, project context, issue format, evidence/contract records, AGENTS/CLAUDE and architecture execution pointers | Include current reviewed documentation in replacement |
| Board config and local-state ignore rules | Include reviewed policy: one worker, human merges, no automatic migrations |
| Executable installed skill pack, runtime scripts, absolute helper links | Exclude; portable distribution and selected-helper readiness remain P0 work |
| Original checkout's Wrangler compatibility-date change and other uncommitted state | Preserve untouched; do not stage from original checkout |
| Older draft PRs #1 and #2 | Close as superseded only after replacement publication and readback; preserve branches/commits |

## Verification and handoff

The isolated replacement runs the locked install, typecheck and nine existing tests. Local links, whitespace, safety config and byte-for-byte runtime preservation are checked. Separate read-only Standards/Spec reviews assess this reconciliation delta; they do not substitute full P0 application QA, PR security review or the required Cloudflare audit.

After publication, stop for current CI, independent P0 evidence and owner review. P0.2/P0.3/P1 are not started by this contract. Issue publication, Super Board workers, merges and deployment remain separately gated.
