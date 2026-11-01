# Subscription-Aware Tenant Migration Implementation Plan

> **Execution authority:** Follow [the HisabIQ Super Board execution plan](../../super-board/hisabiq-execution-plan.md). This document supplies technical requirements only. Owner-approved GitHub issues, native lint, Super Build, independent QA/security and Super Review govern execution; work one task at a time and wait for human merge/phase approval.

**Goal:** Safely migrate a HisabIQ business between Free, Paid and dedicated Premium D1 placements, including upgrades, downgrades, capacity exceptions, crashes and offline retries, without losing financial history or enabling simultaneous writers.

**Architecture:** A single tenant-migration state machine lives in the control plane. It reserves a verified destination, copies a tenant-scoped manifest, write-fences the source, reconciles complete financial/inventory invariants and compare-and-swaps the authoritative placement epoch. Plan entitlements/billing are tracked separately from the physical placement; failed/oversized moves are deferred safely.

**Tech Stack:** TypeScript, Hono, D1, Drizzle for ordinary records, explicit reviewed SQL for fences and atomic registry transitions, Vitest, Cloudflare Workers/D1 integration tests, Playwright for approved UI integration.

**Spec:** `docs/superpowers/specs/2026-11-01-subscription-database-lifecycle-design.md`.
**Prerequisites:** P0 foundation merged; P1 real-D1 posting proof passed; P2 authenticated tenant registry, role checks and binding resolver proven. This plan is for **P2 contract preparation + P7 full migration + P8/P10 integration**, not a license to implement migration before the safety prerequisites.

## Global Constraints

- Existing HisabIQ_UI React components are immutable as a design source. No replacement or redesign.
- Every plan uses the same tenant-scoped financial schema, exact integer poisha, invoice/stock/journal invariants and immutable posted history.
- Plans: Free `shared_free` (250 tentative tenants); Basic/Medium `shared_paid` (capacity 5000 integer units, weight 100/167); Premium dedicated D1 (one tenant).
- Capacity is checked against business slots, storage, forecast load, supported schema and actual binding availability; a slot is **not** a capacity guarantee.
- No raw client database selection, cross-tenant export or unreviewed SQL bypass.
- No direct cross-D1 atomic transaction; all moves are resumable, fenced and auditable with at most one active writer.
- A migration's source remains authoritative before route switch; after switch forward recovery, not unchecked rollback.
- Historical invoices, subledgers, attachments and all accepted operation IDs are never deleted to satisfy downgraded quotas.
- Downgrade effective-date policy and customer notification/payment handling require owner sign-off before production.
- Use the Super Build label-selected TDD discipline and documented Ponytail fallback. Verify RED before GREEN, refactor during review, and intentionally invoke Cloudflare security-audit at required milestones. One issue and draft PR per approved slice; no competing orchestrator.
- Tests use synthetic tenants only. Do not deploy, provision production, merge or migrate customer data without explicit approval.

## Review Focus

1. **Payment event duplicated or reordered**: one job per transition request, no double pool reservation, stale event cannot reverse active plan/placement (Tasks 1, 2, 7).
2. **Oversized Premium→Free**: safely defer relocation, apply approved Free entitlements at effective time, preserve all history (Tasks 1, 2, 7).
3. **Failure between write fence, CAS and new target activation**: recover to exactly one writer and never accept transactions on stale source (Tasks 4, 6).
4. **Other businesses keep selling during shared-source copy**: tenant filter and bounded chunks prevent cross-tenant data movement or whole-pool blocking (Tasks 3, 4, 5).
5. **Offline sync arrives during or after move**: retryable Pending uses original idempotency key, no duplicate stock/invoice and no offline lease reassignment (Task 8).

## Task 1 — Lifecycle decision contract and transition table (P2)

**Files:** Create `src/tenancy/plan-lifecycle.ts`, `tests/tenancy/plan-lifecycle.test.ts`. Consume established `Plan` from `src/tenancy/placement-policy.ts` (P0) and do not duplicate it.

**Interfaces:**
- `type LifecycleAction = { kind: 'NO_MOVE' | 'MOVE' | 'DEFER'; targetClass: PlacementClass; reason?: 'NO_CAPACITY' | 'UNAVAILABLE_BINDING' | 'SCHEMA_INCOMPATIBLE' }`
- `decidePlacementChange(input: { fromPlan: Plan; toPlan: Plan; currentClass: PlacementClass; targetReady: boolean; targetCapacityValid: boolean }): LifecycleAction`

- [ ] Write failing table-driven tests for Free→Premium, Free→Basic, Premium→Basic, Premium→Free, Paid→Free, Basic↔Medium (no move if current Paid capacity allows), plus oversized/unavailable target → DEFER.
- [ ] Run `pnpm test -- tests/tenancy/plan-lifecycle.test.ts`; expected RED: module or export missing.
- [ ] Implement minimal pure decision function, reusing P0 `getPlacementClass()`; no DB dependency.
- [ ] Run `pnpm test && pnpm typecheck`; expected GREEN including existing suite.
- [ ] Commit `feat(tenancy): define subscription placement decisions` and attach decision matrix to draft PR.

## Task 2 — Registry schema, capacity reservation and exactly-one-job policy (P2/P7)

**Files:** Create `migrations/control/0001_tenant_lifecycle.sql`, `src/tenancy/migration-registry.ts`, `tests/workers/tenant-lifecycle-registry.integration.test.ts`.

**Interfaces:**
- `reserveMigration(db: D1Database, input: { tenantId: string; migrationId: string; expectedPlacementEpoch: number; destinationId: string; targetPlan: Plan }): Promise<'RESERVED' | 'EXISTING' | 'DEFERRED'>`
- `loadMigration(db: D1Database, migrationId: string): Promise<MigrationJob | null>`
- A database-level unique active migration per tenant; idempotent migration ID; atomic reservation accounting and epoch checks.

- [ ] Write Worker D1 failing tests for duplicate requests, concurrent migrations, reordering, sealed pool, paid 5000-unit limit, Premium already reserved, and negative/corrupt capacity.
- [ ] Run `pnpm test:workers`; expected RED until schema and adapter exist.
- [ ] Implement minimal control-plane SQL constraints and transactional reservation/immutable audit; do not use read-then-write slots.
- [ ] Run `pnpm test:workers && pnpm test && pnpm typecheck`; expected GREEN with actual D1 semantics.
- [ ] Commit and document resource-binding provisioning as a separate verified precondition; no invented dynamic binding support.

## Task 3 — Tenant manifest and resumable source copy (P7)

**Files:** Create `src/tenancy/migration-manifest.ts`, `src/tenancy/copy-tenant.ts`, `tests/workers/copy-tenant.integration.test.ts`.

**Interfaces:**
- `listTenantOwnedTables(): readonly TenantTableDescriptor[]` (explicit allowlisted tables with tenant-scoped relationships and ordered dependencies).
- `copyTenantChunk(input: { source: D1Database; destination: D1Database; tenantId: string; table: TenantTableDescriptor; cursor: string | null; limit: number }): Promise<{ nextCursor: string | null; copied: number }>`

- [ ] Write failing tests for rows in two tenants, FK chains, duplicate chunk retry, 100-bound-parameter and duration-safe pagination, preserved original IDs, journal and idempotency tables, attachment references.
- [ ] Run `pnpm test:workers`; expected RED until copier exists.
- [ ] Implement bounded tenant-filtered source reads + idempotent target inserts; record cursors/checkpoints in migration job, avoid whole-pool exports.
- [ ] Run Workers integration suite and assert zero cross-tenant rows, exact copied values and repeatable restart.
- [ ] Commit and review all unscoped SQL with security-audit skill.

## Task 4 — Fencing and deterministic frozen cutover protocol (P7)

**Files:** Create `src/tenancy/tenant-fence.ts`, `tests/workers/tenant-fence.integration.test.ts`; modify business posting entry points only after P1/P2 contracts are stable.

**Interfaces:**
- `fenceTenantWrites(db: D1Database, tenantId: string, expectedEpoch: number, migrationId: string): Promise<boolean>`
- `assertTenantWriteAllowed(db: D1Database, tenantId: string, placementEpoch: number): D1PreparedStatement` (guard must cause a constraint failure **within the posting batch**, not merely return zero rows).

- [ ] Write failing tests for in-flight sale, stale epoch, checkout during fence, concurrent last-unit sale, and network retry preserving same operation ID.
- [ ] Run `pnpm test:workers`; expected RED.
- [ ] Implement per-tenant fence guard inside actual D1 posting operations; return retryable `TENANT_MIGRATING` for client requests where appropriate.
- [ ] Run real D1 rollback/injection suite; expected no accepted writes after fence and no partial committed journals.
- [ ] Commit with explicit trace of control-plane/tenant-DB fence ordering.

## Task 5 — Domain reconciliation and cutover proof (P7)

**Files:** Create `src/tenancy/reconcile-migration.ts`, `tests/workers/reconcile-migration.integration.test.ts`.

**Interfaces:** `reconcileMigration(source: D1Database, destination: D1Database, tenantId: string): Promise<{ ok: boolean; mismatches: readonly string[]; proofHash: string }>`.

- [ ] Write failing tests for equal datasets and independent intentional corruption of balances, AR/AP, FIFO lot, serials, invoice counter, payments, idempotency rows, R2 reference manifest and cross-tenant canary.
- [ ] Run `pnpm test:workers`; expected RED.
- [ ] Implement manifest-driven row hashes and independently derived financial/stock reconciliation; reject any discrepancy or unsupported schema.
- [ ] Run Workers integration suite; expected GREEN with each corruption detected.
- [ ] Commit and include machine-readable proof snapshot in job's audit trail.

## Task 6 — Placement CAS switch, crash recovery and cleanup safety (P7)

**Files:** Create `src/tenancy/cutover.ts`, `src/tenancy/recover-migration.ts`, `tests/workers/migration-crash.integration.test.ts`.

**Interfaces:**
- `switchAuthoritativePlacement(registry: D1Database, input: { tenantId: string; migrationId: string; expectedEpoch: number; verifiedProofHash: string }): Promise<'SWITCHED' | 'ALREADY_SWITCHED' | 'REJECTED'>`.
- `resumeMigration(jobId: string, deps: MigrationDependencies): Promise<MigrationJob>` (deps limited to real registry/DB binding interfaces; no speculative universal repository framework).

- [ ] Write failing tests injecting restart at each state, duplicate switches, late writes into source, mismatch proof, recovery after CAS, and deletion before cooldown.
- [ ] Run `pnpm test:workers`; expected RED.
- [ ] Implement CAS and permitted state transitions, destination activation, source read-only retention and forward-repair rules.
- [ ] Run full crash matrix; expected exactly one writable placement and no lost acknowledged sale.
- [ ] Commit; do not allow tenant-specific source cleanup without separately approved retention/restore proof.

## Task 7 — Billing-effective entitlements, downgrades and exceptions (P10)

**Files:** Create `src/subscriptions/plan-transitions.ts`, `tests/subscriptions/plan-transitions.test.ts`, `tests/workers/subscription-migration.integration.test.ts`.

**Interfaces:**
- `applySubscriptionTransition(input: { tenantId: string; eventId: string; requestedPlan: Plan; effectiveAt: string; expectedVersion: number }): Promise<SubscriptionResult>` with authoritative repository implementation provided after Better Auth/billing decision.
- `SubscriptionResult` includes `effectivePlan`, `placementStatus: 'READY' | 'MIGRATING' | 'DEFERRED'`, and `entitlementVersion`.

- [ ] Write failing tests for Premium paid but destination not ready, downgrade end-of-period, oversized Premium→Free, long-deferred placement exception, duplicate/out-of-order payment webhook and access to historical records.
- [ ] Run `pnpm test` and Workers integration; expected RED for missing contract.
- [ ] Implement subscription versioning and entitlement checks separately from physical placement; support operator alerts and documented upgrade credit/refund path after owner approval.
- [ ] Run all checks; expected GREEN with no accidental Premium entitlement promise and no deletion of posted history.
- [ ] Commit; use existing HisabIQ_UI subscription controls without redesign.

## Task 8 — One offline device during placement changes (P8)

**Files:** Create `src/offline/migration-sync-guard.ts`, `tests/workers/migration-offline-sync.integration.test.ts`; existing Dexie queue behavior is validated via later Playwright E2E.

**Interfaces:** `authorizeOfflineSync(input: { tenantId: string; authorizedDeviceId: string; leaseEpoch: number; placementEpoch: number; operationId: string }, state: VerifiedTenantState): 'ACCEPT' | 'RETRY_PENDING' | 'NEEDS_REVIEW' | 'DENY'`.

- [ ] Write failing tests for pending operations before/after switch, no second offline device (DENY), revoked/expired lease (DENY), migration fence (RETRY_PENDING), duplicate sync, lost acknowledgment and substantive stock/serial rejection (NEEDS_REVIEW).
- [ ] Run `pnpm test:workers`; expected RED.
- [ ] Implement minimal lease/placement validation plus unchanged operation key; unauthorized devices must be DENY, retryable migration must be `RETRY_PENDING`, not `NEEDS_REVIEW`.
- [ ] Run Workers suite and existing UI Playwright coverage once integrated; expected no duplicate posted operation and unchanged Pending/Synced UX.
- [ ] Commit and request security/correctness review.

## Task 9 — Read-only cooldown, final cleanup, recovery drill and operations (P7/P11)

**Files:** Create `src/tenancy/retire-placement.ts`, `tests/workers/tenant-cleanup.integration.test.ts`, `docs/runbooks/tenant-downgrade-recovery.md`.

**Interfaces:** `eligibleForSourceRetirement(job: MigrationJob, checks: { cooldownElapsed: boolean; offAccountBackupVerified: boolean; retentionApproved: boolean; noUnreconciledWrites: boolean }): boolean`.

- [ ] Write failing tests for every missing retirement precondition and two-tenant shared pool cleanup where unaffected tenant data must remain intact.
- [ ] Run `pnpm test:workers`; expected RED.
- [ ] Implement guarded per-tenant cleanup only after recovered destination and read-only source verification; irreversible operations remain human-approved in early releases.
- [ ] Run synthetic scratch restore and consistency checks and document results; expected GREEN with zero collateral deletion.
- [ ] Commit runbook and independent security-audit findings.

## Delivery boundaries

The PR labels below are historical conceptual groups, not execution batches. The current Super Board roadmap assigns their content to P2/P7/P8/P10/P11; split into independently verifiable issues within the normal size limit. Complete, review and obtain owner merge approval for one task before selecting the next.

- **PR A (P2):** Task 1 pure lifecycle decision; can be reviewed before live migration.
- **PR B (P2/P7):** Task 2 registry/admission and idempotent jobs.
- **PR C (P7):** Task 3 manifest/copy.
- **PR D (P7):** Tasks 4–5 fence + reconciliation (separate PRs if independently reviewable).
- **PR E (P7):** Task 6 crash-safe cutover.
- **PR F (P10):** Task 7 billing and entitlement state.
- **PR G (P8):** Task 8 offline sync.
- **PR H (P11):** Task 9 safe retention, restoration and operational gate.

All PRs start as drafts; CI and code review are required. No production customer migration, automatic merging or production deployment as part of this plan. P1 accounting correctness, P2 isolation and P7 tenant-level backup/restore remain blocking dependencies.

## Definition of Done

A synthetic Free→Premium→Basic→Free migration chain passes with stable business ID, unchanged financial balances, no double-posted operation, no other tenant's data copied or deleted, preserved offline queue and one authoritative DB at each step. An oversized downgrade is deferred without loss, while subscription entitlements follow the approved billing-effective policy. Every crash point is recoverable, independently audited, and proven in real Cloudflare Workers/D1 tests.

## Handoff

**Required implementation mode:** Super Board only, with `max_workers: 1`, selected-host readiness, native issue/dependency contracts, Super Build TDD, independent Super QA with PR security review, explicit milestone Cloudflare audit and independent Super Review. The owner approves every merge and phase gate. Keep future tasks in Backlog; this technical plan does not authorize implementation, migration or deployment.
