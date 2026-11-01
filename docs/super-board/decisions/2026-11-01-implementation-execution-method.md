# Decision — GitHub Actions first, with supporting execution environments

**Date:** 2026-11-01
**Status:** Accepted owner decision; recorded from the owner's instruction in this conversation.
**Scope:** Development execution and handoffs. Backend architecture, phase gates and approval rules are unchanged.

## Context

The owner reports that development has mostly used GitHub Actions-based implementation, with Remote Desktop Commander, Codex Cloud and local Codex also used. The execution plan previously emphasized the inspected local Codex launcher. That describes one installed mechanism, not the complete implementation method the owner wants the project to follow.

## Decision

Use **GitHub Actions as the primary implementation execution and verification path**, with **Remote Desktop Commander, Codex Cloud and local Codex as supporting execution options** selected for the current task. GitHub remains the source of truth for code, issues, PRs, dependencies, checks and retained review evidence. Super Board remains the **single task orchestrator** across all four options.

An execution environment answers where approved work runs. It does not choose a new task, bypass the issue contract, supply human approval or establish another orchestration queue.

| Method | Role | When to select it | Required handoff |
|---|---|---|---|
| GitHub Actions | Primary path for configured implementation jobs and authoritative repeatable CI | A curated task has an approved, configured workflow and required runner/skill/tool access | Issue, workflow/run identity, exact input/output SHAs, test logs/artifacts and the task's existing branch/draft PR |
| Remote Desktop Commander | Supervised access to an approved remote desktop or host | Setup, inspection, reproduction or interaction requires the designated remote environment | Target environment, approved actions, resulting SHA/evidence and sanitized reproduction notes on the same task |
| Codex Cloud | Supporting hosted execution for a bounded approved task | The task fits the selected cloud environment and its required tools, skills and access are verified | Starting SHA, resulting commit/diff, actual commands/results and the same issue/PR |
| Local Codex | Supporting local implementation, debugging and orchestration | Local tools/runtime or direct inspection are needed, or the primary implementation workflow is not ready or cannot reproduce the issue | Isolated worktree, starting/resulting SHAs, actual tests and a GitHub-visible commit/PR handoff |

These roles express project policy, not a claim that every integration or hosted environment is already available. Record the selected method and reason on the current task. Prefer Actions when the implementation job is ready; otherwise use an available approved supporting method and state the reason. A failed or absent Actions implementation adapter must not be disguised as a successful workflow run.

## Common operating contract

1. Super Board selects one owner-approved, dependency-eligible task. Keep `max_workers: 1` and one current task through P12.
2. Select and verify the execution environment for that task, including the exact source revision, tools, skills, permissions and test data. A local plugin cache is not evidence of cloud/runner readiness.
3. Apply the same Super Build TDD and scope rules in the selected environment. Environment changes do not waive RED/GREEN evidence, tenant boundaries or accounting invariants.
4. Transfer work through Git commits and the task's one branch/PR. Checkpoint and stop the prior writer before another environment continues; do not create parallel writers or duplicate PRs for a handoff.
5. Run independent Super QA, PR security review, required explicit Cloudflare assessment and Super Review. Retain environment-specific evidence with the exact reviewed SHA; an Actions job or a different machine does not by itself make review independent.
6. Merge only after required checks and an explicit owner merge request. Chat authorization is sufficient under the attended merge procedure; never enable automatic merges. Phase acceptance, deployment, billing, live migration and customer-data authorization remain separate.

GitHub Actions run records must identify what executed. Verification-only jobs prove only their checks; an implementation job must also identify the issue, authorized scope and resulting code change. Keep implementation credentials/permissions limited to the approved task, distinguish trusted implementation jobs from ordinary/untrusted PR verification, and use synthetic non-production data. Do not expose developer-machine credentials or customer data through remote/cloud handoffs or artifacts.

## Current implementation versus decision

At the time this decision is recorded, `.github/workflows/ci.yml` contains the `verify` job: frozen dependency install, typecheck, tests and dependency audit. It does **not** define an issue-triggered coding agent or a Super Board-to-Actions implementation adapter. The earlier local Codex launcher inventory remains valid historical evidence for that host only.

This decision does not add a workflow, trigger a run, install an adapter, configure Codex Cloud, open a remote desktop, or change runtime/merge settings. Before moving implementation execution to Actions, its adapter/dispatch contract, permissions, dependencies, evidence handoff and serialization must be separately scoped, verified and approved through Super Board. Keep the current supported local host configuration until such a reviewed integration exists; do not invent a `github-actions` host/backend value or unsupported flags.

## Consequences

- The default strategy becomes Actions first rather than treating local Codex as the only execution method.
- Supporting methods remain available for task-specific needs; the selected environment is explicit and the resulting work returns to GitHub.
- Reproducibility and visible run evidence improve, while runner/bootstrap/credential work must be verified rather than assumed.
- Switching environments does not duplicate orchestration, weaken independent checks or unlock another task.
- The P0–P12 roadmap, unchanged React UI, greenfield Hono/Workers/D1 architecture, financial/tenant invariants and owner gates remain in force.

## Related policy

- [Execution plan](../hisabiq-execution-plan.md)
- [Project context](../PROJECT.md)
- [Backend architecture and phase gates](../../superpowers/plans/2026-11-01-greenfield-backend-foundation.md)
