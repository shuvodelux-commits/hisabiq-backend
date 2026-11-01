# HisabIQ Backend (greenfield)

New TypeScript/Hono backend project for HisabIQ. **Pre-production foundation only.** No business, accounting or authentication endpoint is implemented yet.

## Workflow

- Read the plan: `docs/superpowers/plans/2026-11-01-greenfield-backend-foundation.md`.
- Install: `pnpm install`.
- Test: `pnpm test`; Type-check: `pnpm typecheck`.
- Local Worker: `pnpm dev`.

`GET /health` is intentionally public and contains no customer data. All later business endpoints must enforce tenant membership, subscription entitlements and placement fencing. Do not reuse BanijjIQ or SherHisab backend code. `hisabiq_ui` is the unchanged frontend source of truth.
