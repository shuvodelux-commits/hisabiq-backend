# HisabIQ Subscription & Database Placement Lifecycle — Design Specification

**Date:** 2026-11-01
**Status:** Proposed policy update for owner review; no implementation approval implied.
**Inputs:** Existing HisabIQ hybrid D1 architecture revision dated 2026-11-01, backend foundation plan, and owner discussion about Free→Premium upgrades and Premium→lower-tier downgrades.
**Why:** Subscription changes cannot be allowed to delete financial history, trigger unsafe shared-pool placement, or result in two writable copies of one business.

## Scope and design approach

**Chosen direction:** One registry-driven, auditable Tenant Migration Engine for upgrades, downgrades, load rebalancing and restore. **Subscription entitlement state and physical database placement are independent**. The control plane is authoritative for both; neither the client nor a stale cache chooses its database.

Considered but rejected:
- **Plan switch = immediate database switch:** dangerous; no space/copy/reconciliation proof and creates dual-writer windows.
- **Never relocate on downgrade:** operationally expensive and does not meet intended Paid/Free pool allocation.
- **Recommended:** async relocation job with fencing and verification, retaining exception placement when movement is unsafe.

No new UI design; reuse the current HisabIQ_UI settings/subscription flows, with minimal clear migration status and retry messaging when needed.

## Invariants (all tiers)

1. Stable `tenant_id` and business identity across placement, plan and schema changes.
2. **Exactly one authoritative data placement for writes** at any time. No uncoordinated dual writes; do not pretend D1-to-D1 transactions are globally atomic.
3. Each migration uses a stable `migration_id` and monotonic `placement_epoch`; retries are safe and resumable.
4. Posted invoices, audit, operation-idempotency results, journals, journal lines, stock movements, FIFO lots/allocations, serials, returns, refunds, payments, dues and sequences are preserved in full.
5. All tenant-owned records carry tenant context and are copied with a trusted manifest. Cross-tenant data must not appear in the destination.
6. Source stays authoritative until destination copy, final delta, financial reconciliation and registry switch are verified.
7. After a completed registry switch, **prefer forward repair**; never blindly reactivate the old source while the new target could accept writes.
8. Offline-device lease epoch is independent from placement epoch. Pending offline actions are never discarded, renumbered, or reissued with a new idempotency key.
9. No billing change can silently erase protected history. Quotas restrict *new eligible operations*, not immutable financial records or lawful recovery.
10. No single-tenant restore via destructive rollback of a multi-tenant shared pool.

## Transition matrix

| From → To | Subscription state | Preferred placement action | Exception |
|---|---|---|---|
| Free → Basic / Medium | Verified upgrade pending | Move `shared_free` → `shared_paid` | Retain source until Paid pool reserved and verified |
| Free → Premium | Paid upgrade pending | Move `shared_free` → dedicated Premium D1 | Do not claim dedicated placement until migration completes |
| Basic ↔ Medium | Plan change at effective time | Stay in existing Paid pool if weighted admission is safe | Reserve/rebalance to another Paid pool only if necessary |
| Basic / Medium → Free | Downgrade at effective time | Move `shared_paid` → `shared_free` | Delay relocation if target cannot fit; apply Free entitlements, retain safe source |
| Premium → Medium / Basic | Downgrade at effective time | Move dedicated D1 → eligible `shared_paid` | Temporary dedicated placement exception with operator alert |
| Premium → Free | Downgrade at effective time | Move dedicated D1 → eligible `shared_free` | Capacity/storage exception; no forced partial copy or historical deletion |
| Hot or over-limit tenant | No forced plan change | Controlled relocation to suitable pool/dedicated/approved PG adapter | Escalate before hard D1 size limit |

Capacity defaults: Free up to **250 businesses/pool**; Paid **5,000 integer units/pool**, Basic **100**, Medium **167**. All are **admission assumptions** and additionally require storage, load, schema and tenant-size gates. Only Premium is marketed as having a dedicated database.

## Subscription and placement records

Control plane keeps distinct:
- `subscriptions`: `tenant_id`, `active_plan`, `requested_plan`, `status`, `paid_through`, `effective_at`, `entitlement_version`, `payment_reference`; payment provider is not authoritative for routing.
- `tenant_placements`: `tenant_id`, `placement_id`, `placement_class`, `db_resource_id`, `binding_key`, `worker_cell`, `schema_version`, `placement_epoch`, `state`, `placement_exception_reason`.
- `migration_jobs`: `migration_id`, `tenant_id`, source/destination placements and epochs, target plan, state, manifest/checkpoint, row counts/hash proof, financial reconciliation proof, last error, retry count, approvals, timestamps.
- `database_catalog`: pool class, `OPEN|SEALED|DRAINING|RETIRED`, used admission units, tenants, free/forecast space and load, supported schema version.
- `placement_audit_events`: immutable actor/reason/when and request ID for every transition.
- Tenant-specific fence/epoch information in both source and destination, checked by every critical transaction.

A server-issued binding manifest maps allowed IDs to actual, deployed Workers D1 bindings. **Dynamic allocation must not presume a request can attach an arbitrary new D1 binding**; a Premium spare database/binding or verified cell provisioning workflow is prerequisite.

## Entitlement and payment policy (recommendation; owner confirmation before production)

- **Upgrade:** accept verified payment and record `UPGRADE_PENDING`. Provision/migrate first. Make the dedicated-database promise (and the Premium entitlement activation) effective only after the dedicated target is ready and routing switched; if this cannot be delivered within the promised window, use a documented credit, reschedule or refund policy. Never charge full Premium indefinitely while Premium database placement is unavailable without informing the owner.
- **Downgrade:** default effective time is **end of paid billing period**, unless the product's actual billing terms explicitly say otherwise. Prepare relocation beforehand. At the effective time apply the lower plan's entitlements **even if physical relocation is deferred for safety**.
- **Downgrade with oversized records:** keep the old database as a `placement_exception`, with internal cost alert, retry schedule and support review. This is not a permanent lower-tier dedicated-database benefit or promise.
- **Limit overflow:** do not delete historical records. Enforce allowed new actions, preserve essential access to records for legally/accountingly required follow-up, and provide compliant export/recovery options. Exact feature gating remains governed by the separate subscription entitlement matrix.
- **Payment cancellation/refund in transit:** lock job decision to a validated subscription version; retry or safely terminate before switch. If switched already, use a new fenced migration, not a reverse pointer flip.
- **Repeated callbacks/upgrade/downgrade requests:** idempotent by request/event key; no double reservation or contradictory running migrations.

## Migration state machine

```text
REQUESTED -> AUTHORIZED -> TARGET_RESERVED -> SCHEMA_CHECKED -> COPYING
 -> SOURCE_WRITE_FENCED -> FINAL_DELTA_OR_FROZEN_COPY
 -> RECONCILED -> ROUTING_SWITCHED -> VERIFIED
 -> COOLDOWN_READ_ONLY_SOURCE -> RETIRED
```

Optional terminal/exception outcomes: `DEFERRED_CAPACITY`, `FAILED_SAFE`, `CANCELLED_BEFORE_SWITCH`, `RECOVERY_REVIEW`. Explicitly define permitted transitions and operator authorization for each. A resumed job reads persisted state and idempotently continues; it never starts a second unsupervised copy.

### Safe copy and cutover protocol

1. Authenticate owner/admin intent or trusted verified billing event; authorize requested plan and tenant status; acquire **one migration lock per tenant** using authoritative control-plane atomicity.
2. Reserve destination capacity transactionally. For Premium choose a prebound spare dedicated D1 or prove the provisioning-and-binding path first. Destination is inactive for tenant writes.
3. Validate compatible schema and copy a verified tenant-owned table/relationship manifest in bounded, resumable chunks; preserve canonical IDs, cents/poisha, timestamps, sequences, lot/serial states, idempotency results, audit and R2 reference keys.
4. While source remains authoritative, normal writes may continue; capture changes with a proven delta/replay design, or use a shorter **write-fenced frozen copy** for initial implementation. Do not describe unimplemented change capture as functional.
5. Before final transfer, fence source financial writes using tenant/placement epochs, drain in-flight posts, wait or reject new writes with retryable `TENANT_MIGRATING` **while keeping original operation IDs**. Preserve online reads only if they use a consistent verified placement.
6. Final data copy/delta and independently reconcile counts plus checksums and **trial balance, receivables, payables, stock movements vs balances, FIFO, serial uniqueness, settlements, invoice sequences, attachments and operation IDs**. Any mismatch blocks switch.
7. Commit registry compare-and-swap on expected prior `placement_epoch`, and ensure destination fence becomes active only in the approved cutover protocol. Explicitly prove no window allows two authoritative writers or stale privileged reads.
8. Resume writes on target, verify, observe, then retain read-only source for a documented cooldown/retention window. Later remove **only that tenant's** source rows after approved recoverability checks, legal-retention review and off-account backup.
9. Once routed to destination, recover forward after failures; do not flip back to a source that could be stale. All cutover and cleanup steps are audited.

Protect other tenants' checkout latency: **never use standard D1 whole-pool export for live single-tenant relocation**. Test snapshot consistency and bounded copying under concurrent sales.

## Minimal UX/API behavior

- Customer-facing: `Preparing upgrade`, `Securing data`, `Ready` or `Migration delayed — your data is safe`; do not expose database IDs. Use existing subscription screens and compact HisabIQ style.
- During short source fence, sale/purchase mutations return structured retryable error with original request key; offline clients remain `Pending`.
- A completed plan can be lower than the current physical placement; show correct entitlements, not database implementation details.
- Data needed for historical audit, warranty/refund or statutory records is retained even if creation of new Premium-only features becomes unavailable.

## Recovery and security gates

- Test failure/kill/restart **at every migration transition**, including just before and immediately after registry switch.
- Test concurrent migration triggers, two billing webhooks, refund, downgrade effective-date rollover, and stale session/placement cache.
- Test Free→Premium, Premium→Basic, Premium→Free, Paid→Free, Basic↔Medium (same DB) and oversized tenant deferred relocation.
- Verify no cross-tenant copy, no duplicate transaction, no double stock allocation, no broken attachment references, no lost offline command, and no double-writer cutover.
- Test shared pool utilization and checkout latency during copy, freeze and target cleanup.
- Run tenant-scoped recovery drill, immutable financial reconciliation and Cloudflare security audit before production use.
- Operational gates: explicit owner-approved billing communication, RPO/RTO target proven, service quotas benchmarked, provisioned bindings/resources tested.

## Platform evidence and unresolved claims

- Cloudflare D1 standard export blocks other requests: https://developers.cloudflare.com/d1/best-practices/import-export-data/
- Workers access D1 via environment bindings, and `db.batch()` rolls back if a statement fails: https://developers.cloudflare.com/d1/worker-api/d1-database/
- D1 limits are versioned and retrieved official snapshots may disagree (older 50,000 vs newer 100,000 included databases). **Do not hardcode the included count or infer deployable Worker bindings**; verify official current limits/pricing and actual account entitlements immediately before provisioning/scaling: https://developers.cloudflare.com/d1/platform/limits/

## Implementation sequencing

P2: model control-plane subscription/placement separation and routing authority.
P7: implement the migration state machine, copy, validation, cutover and recovery after D1 accounting/isolation proofs and identity gates pass.
P8: verify single-device offline queue behavior with migration.
P10: connect actual billing/entitlements and customer upgrade/downgrade UI in existing HisabIQ_UI components.

**Open owner approval items:** end-of-period downgrade default; exact customer messaging/payment credits after failed Premium activation; temporary dedicated-placement exception duration and operator escalation; minimum off-account backup RPO/RTO; applicable Bangladeshi retention obligations. **Until approved, these are recommended policy defaults, not deployed commitments.**
