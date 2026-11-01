# HisabIQ Backend — Project context

Repository: `shuvodelux-commits/hisabiq-backend`. This is a greenfield, pre-production backend for the existing `hisabiq_ui` frontend.

## Authority

- [AGENTS.md](../../AGENTS.md) defines repository boundaries.
- [Greenfield backend architecture](../superpowers/plans/2026-11-01-greenfield-backend-foundation.md) owns technical decisions and phase gates.
- [Super Board execution plan](hisabiq-execution-plan.md) owns issue contracts, agent routing, reviews and human approvals.
- [Subscription and placement lifecycle](../superpowers/specs/2026-11-01-subscription-database-lifecycle-design.md) describes planned relocation behavior.

## Implemented scaffold

| Surface | Source | Current behavior |
|---|---|---|
| Worker entrypoint | `src/index.ts` | Exports the Hono application |
| Public health route | `src/app.ts` | `GET /health` returns status 200 and `{status:"ok",service:"hisabiq-backend"}` |
| Pure placement policy | `src/tenancy/placement-policy.ts` | Maps plans to placement classes; computes integer admission limits and rejects sealed or corrupt capacity inputs |
| Unit tests | `tests/health.test.ts`, `tests/placement-policy.test.ts` | Nine test cases cover health and the pure placement contract |
| CI | `.github/workflows/ci.yml` | Pull-request/main checks install dependencies, typecheck, test and audit dependencies |

The placement policy does not provision databases, reserve shared capacity transactionally, authenticate users or route requests to tenant storage. No business, accounting or authentication endpoint is implemented.

Current dependencies are Hono, TypeScript, Workers types, Wrangler and Vitest. The package manager is pnpm 12.16.1. `wrangler.jsonc` configures the `hisabiq-backend-dev` Worker; its presence does not authorize deployment.

## Project-owned commands

| Purpose | Command |
|---|---|
| Reproducible dependency install | `pnpm install --frozen-lockfile` |
| Typecheck | `pnpm typecheck` |
| Unit tests | `pnpm test` |
| Existing CI dependency audit | `pnpm audit --audit-level high` |
| Local Worker development | `pnpm dev` |

Required board verification commands are the frozen install, typecheck and unit-test commands. `test:workers`, lint, Playwright, secrets scanning and migration commands are not current package scripts; add real checks only when implemented. This overview records source and policy, not a fresh execution result or CI pass.

## Board operation

Host: Codex. Base branch: `main`. Initial concurrency: `max_workers: 1` through P1/P2. Every merge requires explicit owner approval (`human_approves_merge: true`, `merge_policy.default: "human"`). Required GitHub CI and main branch protection are readiness gates, not assumed facts.

Super Board is the sole task orchestrator. Approve narrow scope first; curate dependency-aware issues with testable acceptance criteria; onboard and lint before running eligible work. Build uses a failing behavioral test before implementation. Independent QA includes bundled `pr-security-review`; independent Review checks the exact PR head and evidence. Cloudflare `security-audit` is a separate, deliberately invoked milestone gate. Installation or readiness never proves an audit ran.

Columns: Backlog, Ready, Building, QA, Review, Blocked, Done. `feature` and `bug` use Build, QA and Review; `qa` starts at QA. Each issue has one branch and draft PR, with separate lane worktrees. Keep later phases in Backlog until preceding owner-approved gates pass. Preserve existing working-tree changes and require a clean base before waves.

## Planned foundation

P1 must prove atomic D1 posting, forced-failure rollback, idempotency and final-stock concurrency on the actual local/test Workers D1 runtime. P2 must prove identity, authorization, tenant isolation, entitlement and placement fencing. These are planned gates, not capabilities of the current scaffold.

Later phases cover catalog/inventory, accounting/purchasing, POS/returns, ledgers, recovery/relocation, one-device offline POS, reporting, control-plane subscriptions, certification and an owner-approved pilot. Do not start unrelated modules in parallel or advance past a failed financial, tenant, restore or migration gate.

## Safety boundaries

- Preserve `hisabiq_ui` exactly; do not redesign or replace its components.
- Do not reuse BanijjIQ, SherHisab, SherERP or other older backend runtime code.
- No production deployment, live migration, customer-data processing, billing or PR merge without explicit owner approval. Deployment, merge and phase acceptance have separate approvals.
- Initially use synthetic local/test D1 data only. Do not invent migration commands or configure live resources/credentials.
- Financial operations must be tenant-scoped, atomic and idempotent, with integer poisha and exact unit ratios. Posted records are immutable; corrections use linked reversals.
- Block immediately on financial integrity, authorization, cross-tenant access, restore or migration safety failures, failed required CI, or unresolved high/critical security findings.
- Apply the simplest safe solution and the documented Ponytail fallback when the dedicated skill is unavailable. Verify specialist skills for the actual host before use.
