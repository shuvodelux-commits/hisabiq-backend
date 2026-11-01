# HisabIQ Greenfield Backend — Final Architecture and Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Date:** 2026-11-01  
**Status:** Approved direction; development authorized for non-production code and proof-of-concept work. Production activation is explicitly gated.  
**Goal:** Implement a secure, resource-efficient ERP backend that connects unchanged HisabIQ_UI components to real business operations, starting with a verifiable Cloudflare D1 accounting foundation.  
**Architecture:** A Hono modular monolith on Cloudflare Workers. An authoritative central control plane locates businesses in separately managed D1 placements; business operations share a single domain engine. Critical ledger, stock, payment and invoice actions are atomic per database, tenant-scoped and idempotent.  
**Tech stack:** TypeScript, Hono, Cloudflare Workers, D1, Drizzle for ordinary queries, reviewed SQL guards for posting, Better Auth (subject to PoC), Zod, R2, Vitest, Playwright, k6, GitHub Actions.  
**Source spec:** User-provided `HisabIQ_Hybrid_MultiTenant_Architecture_Revision_2026-11-01(1).md` (2026-11-01). Source claims are rechecked where needed.  
**Frontend source of truth:** `shuvodelux-commits/hisabiq_ui`; do not redesign or replace frontend components.  
**Excluded runtime code:** BanijjIQ, SherHisab, SherERP and Vue implementations.

## Global Constraints

- Every authenticated read/write must prove actor membership, authorization, entitlement and current placement. Never trust a client-supplied tenant binding or database ID.
- Financial integrity never depends on subscription plan. All tiers share immutable journals, idempotency and recoverability guarantees.
- Persist BDT in integer poisha; use exact unit conversion ratios and explicit rounding.
- One transaction commits invoice, stock, FIFO allocations, splits, receivable, COGS and journal or none of them.
- Posted journals/invoices are immutable; corrections are linked reversals, not deletes.
- Only ONE pre-authorized offline POS device per business. Online use on other devices remains permitted.
- Free/Basic/Medium may share D1 storage, but each tenant's rows are isolated using tenant-scoped keys, references, constraints, middleware and adversarial tests.
- No general-purpose sensitive-read authorization cache until the revocation window is proven and approved.
- No actual customer data, production migration, production secrets, customer billing or deployment in PoC.
- Work only in a dedicated backend repository/branch; create draft PRs; never auto-merge or auto-deploy to production.
- Apply Ponytail full mode: simplest safe implementation; no microservices, speculative generic repositories or unmeasured caching.
- A failed accounting, isolation, restore or migration safety gate is an absolute launch blocker.

## ADRs — Baseline Decisions

| ADR | Decision | Verification |
|---|---|---|
| 001 | Greenfield Hono modular monolith, Workers runtime | Minimal app smoke test and Workers integration test |
| 002 | Registry-driven Free + Paid shared pools and dedicated Premium D1 | Routing/placement + isolation tests |
| 003 | Free initial 250 businesses per D1; Paid integer capacity 5,000 units, Basic 100, Medium 167 | Admission and noisy-neighbor benchmark; these are hypotheses, not service guarantees |
| 004 | Better Auth as one identity authority | Workers/KDF, mobile OTP, Google+verified phone, session revocation PoC |
| 005 | Dedicated transactional posting adapter and double-entry engine | Actual D1 failure-injection, rollback, idempotency and last-stock race tests |
| 006 | Server-side tenant context and DB constraints | Cross-tenant adversarial suite for CRUD, nested references, reports, exports, files |
| 007 | Sensitive reads and all mutations re-check current rights/placement | Immediate or documented bounded revocation tests |
| 008 | Tenant-consistent backup/recovery in shared pools | Restore into scratch, recovery-point accuracy and checkout interruption measurement |
| 009 | One fenced relocation state machine | Crash/retry, balances/checksums, offline queue and source/destination write exclusion |
| 010 | One authorized offline POS device per business | Lease/epoch sync tests and conflict UX proof |
| 011 | PostgreSQL only after load/size triggers; adapter-tested in advance | Portability contract tests, no second live engine at launch |
| 012 | Market Premium as a dedicated *database*, not hardware or latency guarantee | Product wording review |

## Cloudflare Documentation Verification Gate (rechecked 2026-11-01)

Official D1 documentation snapshots retrieved at different revisions currently disagree: an older page reports **50,000 Workers Paid databases/account**, while the newer limits page updated 2026-10-30 reports **100,000 included**, **1,000,000 account maximum** and charges above included count. The user-provided hybrid architecture revision cites the newer allowance. Do not hardcode either as an immutable contract: confirm the live canonical docs, account entitlements and billing before large-scale provisioning. Other constraints to verify include **about 5,000 D1 bindings per Worker**, **10 GB per database**, **1 TB default account storage**, **100 bound parameters per query** and **30 seconds for the entire D1 batch call**. Prebound Premium spare capacity/Worker cells must be proven; the tenant registry cannot dynamically attach an arbitrary D1 binding at request time.
Sources: https://developers.cloudflare.com/d1/platform/limits/ ; https://developers.cloudflare.com/d1/platform/pricing/
Routine D1 export blocks requests: https://developers.cloudflare.com/d1/best-practices/import-export-data/

## Subscription Placement Contract

| Plan | Initial placement | Admission constraints |
|---|---|---|
| Free | `shared_free` | <=250 businesses per D1 AND measured size/load gates |
| Basic | `shared_paid` | 100/5000 integer capacity units per business |
| Medium | `shared_paid` | 167/5000 units per business, upgrade in place if space |
| Premium | `dedicated` | One business per D1 |
| Hot / >10GB path | Approved relocation | Fenced migration; PostgreSQL when proven necessary |

For security, the tenant registry resolves the active placement and epoch; the client supplies neither database ID nor binding name. Sealed pools stop *new admission*, never silently discard valid in-flight financial postings. **Subscription plan and database placement are separate states**: a safe downgrade can temporarily leave a lower-tier customer on a dedicated database as a monitored placement exception without granting Premium entitlements.

## Upgrade / Downgrade Lifecycle — Required Design

Detailed owner-review specification: [Subscription & Database Placement Lifecycle](../specs/2026-11-01-subscription-database-lifecycle-design.md).
Test-first implementation tasks: [Subscription-Aware Tenant Migration Plan](2026-11-01-subscription-database-migration.md).

- **Free → Premium:** verified payment request → reserve prebound dedicated Premium D1 → tenant-filtered copy → source write fence → final consistency copy → accounting/inventory reconciliation → compare-and-swap placement epoch → activate dedicated placement/entitlements → read-only source retention.
- **Premium → Basic / Medium / Free:** at the approved downgrade effective date apply lower-plan entitlements; relocate to eligible Paid/Free D1 if all storage/load/isolation gates pass. If too large or no target is available, keep the old database temporarily as an audited placement exception, alert operators, and retry; never delete invoices, journals or history to fit.
- **Basic ↔ Medium:** same Paid D1 when capacity and schema gates allow; change subscription weights and entitlements without unnecessary data movement. **Paid → Free:** move to eligible Free pool only when safe.
- **Every move:** preserve tenant identity, operation IDs, invoice sequences, FIFO lots, stock, balances, returns, attachments, authorized offline device lease and queued transactions. Only one placement can accept writes; after cutover recover forward rather than blindly switching backward.
- **Production gates:** validate upgrade credit/refund and downgrade-at-renewal policies with owner; test crashes at every migration state, double billing callbacks, concurrent sales, stale routing, oversized data, source cleanup and offline sync retries.


## Bounded Contexts and Data Ownership

1. Control plane: identity, users, business memberships, roles/permissions, subscriptions, tenant placements, binding manifest, database catalog, migration jobs, audit.
2. Catalog: products, categories, brands, English/Bangla names, units and short symbols, unit conversion, prices, warranty, serial/expiry configuration.
3. Inventory: movements, stock snapshot, supplier lots, FIFO cost layers, serial allocations, expiry/warranty, shortages and stock reservations.
4. Sales and POS: draft, sale, mixed units, multiple payments, credit/due, price override, return, refund, invoice numbering.
5. Purchasing: supplier, purchase, purchase returns, payment, planning/orders and receipt attachment.
6. Accounting: immutable balanced journals, opening balances, cash/bank/mobile accounts, reconciled customer/supplier subledgers and daybook.
7. Parties: customer/supplier records, ledger views, outstanding, search and transaction links.
8. Reporting: source-linked sales/stock/profit/dues/cash/audit reports; no unscoped direct SQL access.
9. Offline: one-device lease, local queue, stock reservation, server-authoritative idempotent sync.
10. Operations: R2, backup/restore, customer export, audit, observability and subscription entitlements.

## Priority Order, Deliverables and Release Gates

| Phase | Deliverable | Non-negotiable acceptance |
|---|---|---|
| P0 | Greenfield repo, CI, health endpoint, initial tests and contracts | RED→GREEN evidence; tests and type-check green; no production deployment |
| P1 | D1 atomicity/accounting spike | Rollback of each failed statement, no duplicate posting, final-unit race passes on actual D1 |
| P2 | Auth/control plane & pooled tenant routing | Role revocation, entitlement, placement and cross-tenant tests pass |
| P3 | Product + unit + stock master | Exact units, FIFO, serial/expiry constraints and correct tenant data |
| P4 | Immutable accounting and purchase posting | Balanced journals, supplier dues, stock and original-cost reversals |
| P5 | Online POS, sales, returns, payments | Fully atomic sale, multi-unit, discounts, splits and return; unchanged UI connected |
| P6 | Customer/supplier ledger and counter | Invoice-linked balances, reconciliation and cash sessions |
| P7 | Tenant backup, restore and migration | One fenced engine for Free→Premium and Premium→Free/Paid, tenant-specific recovery, no data loss or double writer; full failure-injection suite |
| P8 | Offline POS single-device mode | Pending/Synced; Needs Review only exceptional business conflicts; no double sales |
| P9 | Reports, advisor and audit | Exact reconciliation to posted source entries, bounded queries |
| P10 | Control center, plans, RBAC, settings | Subscription gating with no deletion of historical financial data |
| P11 | Security/load/scale certification | Cloudflare audit, 50/100/250/500/1000 shop burst evidence, backup/RTO proof |
| P12 | Controlled pre-production pilot | Human-approved deploy, rollback/recovery drill, real monitoring, sign-off |

Do not implement all modules in parallel. First complete P1 accounting and P2 isolation/identity PoCs. If D1 cannot satisfy atomicity or recovery, revisit the storage decision before building ERP-wide APIs.

## Review Focus — Mandatory Adversarial Inputs

1. Cross-tenant ID manipulation including nested invoice/lot/attachment IDs — must return no other tenant data.
2. Same operation ID retried with same payload, different payload, or after lost acknowledgement — exactly one committed result or conflict.
3. Two cashiers concurrently sell the last stock unit — at most one accepted sale unless negative-stock policy explicitly permits.
4. Tenant placement switches while a sale or offline queue is in flight — at most one writable source and safe retries using same operation IDs.
5. Shared-pool tenant restore following other shops' valid sales — no other shop is rolled back and restored tenant reconciles.

## P0 — Detailed Superpowers Test-First Work Plan

### Task 1: Repository baseline and public health route

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `wrangler.jsonc`, `.gitignore`, `.github/workflows/ci.yml`
- Create: `src/app.ts`, `src/index.ts`, `tests/health.test.ts`
- Create: `README.md`, `AGENTS.md`

**Interfaces:** `createApp(): Hono` returns route app. `GET /health` returns `{status:"ok",service:"hisabiq-backend"}` with status 200, no customer data.

- [ ] Step 1: Write `tests/health.test.ts` using Hono request testing; assert status and exact response.
- [ ] Step 2: Run `pnpm test -- tests/health.test.ts` and observe expected RED due to missing `src/app.ts`.
- [ ] Step 3: Implement minimal `createApp()`, Workers entrypoint and config (no auth, database or demo sale endpoints).
- [ ] Step 4: Run `pnpm test` and `pnpm typecheck` and observe GREEN.
- [ ] Step 5: Commit only task files with evidence in PR description.

### Task 2: Placement admission policy — pure contract, not provisioning

**Files:** Create `src/tenancy/placement-policy.ts`, `tests/placement-policy.test.ts`.

**Interfaces:** `getPlacementClass(plan: Plan): "shared_free"|"shared_paid"|"dedicated"`; `canAdmit(plan: Plan, capacity: {businesses:number;usedUnits:number;state:"OPEN"|"SEALED"}): boolean`.

- [ ] Step 1: Write tests for 249/250 Free, 4900/5000 Basic, 4833/5000 Medium and Premium dedicated eligibility; sealed pool never admits.
- [ ] Step 2: Run test and observe RED for missing code.
- [ ] Step 3: Implement only exact policy computation (integer arithmetic; no live registry or D1 routing).
- [ ] Step 4: Run full test and type-check, observe GREEN.
- [ ] Step 5: Commit and document that real DB provisioning requires transactional registry reservations and measured load gates.

### Task 3: D1 accounting-failure proof — isolated PoC

**Files:** `migrations/0001_poc.sql`, `src/poc/d1-posting.ts`, `tests/workers/d1-posting.integration.test.ts`.

**Interfaces:** `postDemoTransfer(db: D1Database, tenantId: string, operationId: string, amountPoisha: number): Promise<PostResult>` strictly for sandbox test data; implementation never becomes production ledger without review.

- [ ] Step 1: Write tests for balanced journal, same operation replays, conflicting replay, wrong tenant FK, zero amount, forced failure after debit and parallel last-stock update.
- [ ] Step 2: Run against Cloudflare Workers local D1 and observe RED; test command `pnpm test:workers`.
- [ ] Step 3: Implement SQL-guarded D1 batch; zero-row guards must raise a SQL assertion in the batch; prove rollback (no partial posted documents).
- [ ] Step 4: Run the full Workers test suite plus injections and record query statistics; fail the gate if any partial commit occurs.
- [ ] Step 5: Create draft PR and include exact results; no live D1 provision or production copy.

### Task 4: First complete dependency/security review

**Files:** `docs/security/p0-review.md`, `docs/architecture/adr-001.md`, `docs/architecture/adr-002.md`.

- [ ] Step 1: Verify Hono, Workers and D1 API choices against current official docs.
- [ ] Step 2: Run dependency audit, package/license review, secret scan and scoped Cloudflare security-audit guidance.
- [ ] Step 3: Run Ponytail review for avoidable dependencies and speculative abstractions.
- [ ] Step 4: Confirm no live provisioning and no production deployment.
- [ ] Step 5: Draft PR with a gate report; do not merge without owner acceptance.

## P1–P2 Exact Foundation Acceptance Suite

- D1 injection at every statement; runtime constraint failure rolls back invoice, stock, journal and idempotency state together.
- Accepted transaction's operation ID returns the original result on exact replay, including after lost acknowledgement.
- Concurrent last-unit purchase, POS sale and return race suites pass.
- Central control-plane session revocation prevents financial mutation and sensitive export after authorization change.
- Shared database: canary businesses A and B cannot read, update, attach to, export or settle each other's records.
- Pool admission uses compare-and-swap or transactional reservation, not read-then-write allocation.
- Tenant routing always verifies active placement epoch and server-approved binding manifest.
- Real D1 measurements replace theoretical rows-written and TPS assumptions.

## P7–P8 Recovery, Migration and Offline Acceptance Suite

- Pool restore is tenant-consistent and isolated; no whole-pool point-in-time rewind for a single tenant.
- Routine off-account recovery target initially **within 24h**, only advertised after restore drills; no claim of guaranteed zero-loss yet.
- Standard D1 export blocks requests; no checkout-hour full-pool backup job.
- Migration state machine: REQUESTED → AUTHORIZED → TARGET_RESERVED → SCHEMA_CHECKED → COPYING → SOURCE_WRITE_FENCED → FINAL_DELTA_OR_FROZEN_COPY → RECONCILED → ROUTING_SWITCHED → VERIFIED → COOLDOWN_READ_ONLY_SOURCE → RETIRED; support safe capacity deferral and pre-switch cancellation.
- Only one placement is write-authoritative; reconcile accounting balances, stock, serial, invoice sequence, operation IDs and attachments before switching.
- Offline-device lease epoch is separate from placement epoch. A paused sync remains Pending; only rejected business-validity exceptions show Needs Review.
- Sync retries keep original operation IDs and cannot double-post.
- Premium→Free/Basic/Medium downgrades keep all protected financial records even if shared target capacity is insufficient; entitlements can change while placement temporarily remains dedicated.
- Basic↔Medium updates normally require no physical move when Paid pool admission remains safe.
- Migration tests inject power/network failures immediately before/after CAS route switch, concurrent final-stock sales, duplicate billing events, and overdue offline queue resync.
- Target provisioning must use a verified binding manifest/Worker-cell plan, never arbitrary client DB identifiers.

## Skill Execution Policy

| Stage | Primary skill | Supporting skill | Gate |
|---|---|---|---|
| Design/phase breakdown | obra/superpowers:writing-plans | addyosmani:spec-driven-development | Explicit specs, interfaces, acceptance tests |
| Coding | obra/superpowers:test-driven-development | Ponytail full + addyosmani:incremental-implementation | Failing test before production code; full green suite |
| API contract | addyosmani:api-and-interface-design | addyosmani:source-driven-development | OpenAPI contract + compatibility tests |
| Complexity | Ponytail full/review | addyosmani:code-simplification | No speculative abstraction |
| Security per PR | addyosmani:security-and-hardening | Cloudflare security-audit-skill guidance/focused review | No critical/high boundary failures |
| Release audit | Cloudflare security-audit-skill full audit | independent review | Verified findings and coverage ledger |
| Delivery | obra/superpowers:finishing-a-development-branch | addyosmani:ci-cd-and-automation | Draft PR, human approval for merge/deploy |

For Codex CLI, install/version-pin the required external skills explicitly after reviewing their upstream source and licensing:
- https://github.com/addyosmani/agent-skills
- https://github.com/obra/superpowers
- https://github.com/cloudflare/security-audit-skill
- Ponytail is a separately installed engineering-suite skill in ChatGPT; verify the intended local Codex distribution before claiming Codex has it.

Use one orchestrating workflow: Superpowers owns execution and TDD; Addy skills supplement API/testing/quality, Ponytail simplifies; security-audit-skill evaluates security. Do not run contradictory TDD coordinators in parallel.

## Repository and Delivery Rules

- New backend repo separate from React UI; branch for each isolated task. Feature PRs target main and begin as drafts.
- Protected main with checks: typecheck, lint when configured, unit tests, Workers D1 integration, dependency audit, security tests and (when UI is wired) Playwright E2E.
- Never disable a failed check, modify test expectations merely to go green, invent success logs or merge solely because compilation passed.
- No production deployment keys in development PRs. Preview/staging use synthetic tenant data.
- Keep one normalized API error envelope: `{code,message,requestId}`. Version API endpoints under `/api/v1` after contract review; keep health standalone.
- Write ADRs for changes to isolation, migrations, accounting semantics and recovery objectives.
- Observe operational costs (D1 rows read/written, storage, Workers invocations/CPU, R2, SMS, off-provider backup). Do not advertise the $5–10 budget as a guarantee.

## Explicitly Deferred (Ponytail/YAGNI)

- Microservices, Kubernetes, mandatory Redis, dual live SQL engines.
- Complex abstraction factories, generic repository framework, optimistic performance caches.
- Automated Premium-to-PostgreSQL movement before D1 growth/load evidence.
- UI component rewrites or new ERP screen design.
- Automatic PR merge, production deployment or customer migration.
