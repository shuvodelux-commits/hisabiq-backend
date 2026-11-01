# HisabIQ — Super Board Backend Execution Plan

**Date:** 2026-11-01 · **Status:** Execution plan approved by owner; P0 evidence review and draft-PR alignment authorized. New implementation, issue publication, workers, merges and deployment remain separately gated.
**Repository:** `shuvodelux-commits/hisabiq-backend` · **Primary execution:** GitHub Actions · **Supporting methods:** Remote Desktop Commander, Codex Cloud, local Codex · **Inspected local host:** Codex · **Board:** [HisabIQ Backend #1](https://github.com/users/shuvodelux-commits/projects/1).

## 1. Authority, scope and present evidence

The [greenfield backend foundation](../superpowers/plans/2026-11-01-greenfield-backend-foundation.md) remains the technical source of truth. Preserve its P0–P12 sequence and ADR decisions. This document owns execution, issue contracts, skill selection and advancement. The [subscription/placement specification](../superpowers/specs/2026-11-01-subscription-database-lifecycle-design.md) owns lifecycle invariants; its explicitly proposed commercial/retention policies still need owner decisions.

The [older migration implementation plan](../superpowers/plans/2026-11-01-subscription-database-migration.md) supplies technical task detail for P2/P7/P8/P10. Its instructions to use `superpowers:subagent-driven-development`, `executing-plans`, a second TDD controller, or combined migration PRs are superseded by this document and AGENTS.md. Its ordering is mapped to the phase prerequisites below. No technical architecture is replaced, and none of those older instructions authorizes execution.

**Unchanged architecture:** TypeScript/Hono modular monolith on Cloudflare Workers; D1 domain storage; Drizzle for ordinary queries and reviewed SQL for posting; central tenant registry; server-approved binding manifest and placement epoch; shared Free pools, weighted Basic/Medium Paid pools, one dedicated Premium D1 per tenant. Free 250-business and Paid 5,000-unit admission defaults (Basic 100, Medium 167) are hypotheses subject to measured size/load and binding gates. Premium promises a database, not dedicated hardware or latency. PostgreSQL remains a future approved escape path, not a second launch database.

Financial postings commit invoice, stock, FIFO, payments/dues, COGS and balanced journals together or not at all, using integer poisha, exact unit ratios, tenant-scoped constraints and stable operation IDs. Posted history is immutable; corrections are linked reversals. Subscription entitlement and physical placement are separate states. One business has one authorized offline POS device; other authorized online devices remain possible. Preserve `hisabiq_ui` React components exactly; future integration adapts backend contracts to that UI. No BanijjIQ, SherHisab, SherERP or Vue runtime reuse.

### Historical planning evidence snapshot — distinguish setup from product readiness

Owner approval is recorded in this conversation. The subsequent [P0 exit evidence review](p0-exit-evidence-2026-11-01.md) records current baseline results and outstanding gates; P0 phase acceptance has not been established.

| Evidence inspected or executed during this documentation task | Result / limit |
|---|---|
| `src/app.ts`, `src/index.ts` | Public `GET /health`; no business/auth/accounting endpoints |
| `src/tenancy/placement-policy.ts` | Pure admission calculation; no actual allocation or registry |
| `pnpm typecheck`; `pnpm test` | Executed: pass; 2 files, 9 tests. These are scaffold tests, not D1 proofs |
| `super-board-setup.py check --host codex --text` | Executed: core setup green; does not prove conditional helpers or application safety |
| `super-board-verification-ready.py --config .claude/super-board/configs/hisabiq-backend.json` | Executed: nonblank real verification commands accepted; does not execute them |
| Saved config / onboarding record | Board #1, Codex, `main`, one worker, human merges; Project access and `main` protection verified during prior onboarding, not revalidated remotely in this edit |
| `.github/workflows/ci.yml` | Source includes frozen install, typecheck, tests and high-level dependency audit in job `verify`; no fresh CI/audit pass claimed here |
| Workers/D1 integration, security audit, backup drill, load tests | Not executed; no completion or security certification claimed |
| Current checkout | `feat/p0-greenfield-foundation`, existing dirty work and an ahead commit. Preserve all unrelated changes; not a clean dispatch base |

There is no `test:workers`, lint, Playwright or migration package script yet. Existing Vitest configuration runs in Node. A SQLite mock or Hono request test cannot establish Workers D1 semantics. `wrangler.jsonc` is a development configuration, not deployment approval. Onboarding is complete; P0 acceptance and lint/run readiness are separate gates.

## 2. Installed contracts and host readiness

Source paths below describe the inspected local host installation unless marked as active plugin entries. The executable skill pack and machine-specific helper links are not bundled in this PR; the presence of this plan/config alone does not make a fresh clone worker-ready. Read the exact resolved files after upgrades; `skills-lock.json`, a cache directory and installation success alone are not proof of worker access.

| Skill / capability | Actual state and selection rule |
|---|---|
| `.agents/skills/super-board/SKILL.md`, `super-build`, `super-qa`, `super-review`, `pr-security-review` | Installed; resolved by the Codex setup checker. Super Board 3.3.0 is the sole orchestrator |
| `mattpocock-skills:implement`, `tdd`, `diagnosing-bugs`, `code-review`, `codebase-design` | Resolved through project helper links to installed active Matt Pocock files |
| `verification-before-completion`; `testing-strategy` | Resolved; the former is a completion gate, the latter informs coverage, not test placement |
| `mattpocock-skills:domain-modeling`, `resolving-merge-conflicts`, `ask-matt` | Installed helpers; resolve the specific conditional helper before using it |
| `mattpocock-skills:to-spec`, `to-tickets`, `writing-for-agents` | Active plugin files inspected; spec/ticket/writing helpers resolve when the actual enabled host catalog is supplied. Bare filesystem resolution misses spec/ticket entries. They remain supporting tools, not dispatchers |
| Cloudflare `security-audit` | Installed via `.codex/skills/security-audit/SKILL.md` (resolves to `.claude/skills/security-audit/SKILL.md`). Explicit conditional resolution passes with the active catalog; a bare checker misses this surface. Read in guidance mode for this plan; **no audit executed** |
| `ponytail:ponytail`, `ponytail:ponytail-review` | Exact lane identifiers resolve to documented fallbacks. An active `engineering-suite-ponytail` plugin exists and was inspected; that namespace is not evidence that the lane's `ponytail:*` identifiers resolve. Use the official fallback unless exact activation is verified |
| `vitest` helper skill | Missing from the checked Codex surfaces. The installed Vitest package is a runner, not this skill. Resolve/install this exact helper before a P1 worker activates it; no declared fallback |
| `playwright-best-practices` | Missing from checked surfaces; blocks browser-test tasks when selected, not unrelated backend documentation |
| `shape`, `clarify`, `qa-test-planner` | Mentioned by lint; availability not established. Do not invoke or claim them installed. Backend tickets normally use source/contract evidence and native lint clarification; unresolved necessary helpers halt their branch |
| `verify-app` starter template | Pack template exists; no source-backed project feature map/runner. Optional, not evidence of feature verification |

The conditional inspection intentionally returned missing entries; the unconditional setup check remained green. A second check with an authoritative catalog of actual enabled entries resolved audit/spec/ticket helpers. No helper was installed, launcher patched, or readiness requirement bypassed in this task. Temporary inspection catalogs are session evidence, not a portable installation strategy. Before dispatch, provide the worker with an effective catalog via the supported `SUPER_BOARD_SKILLS_CATALOG` mechanism, or repair its visible skill surface; verify again from the actual lane environment. Do not fabricate aliases or point at inactive caches.

**Installed references governing this plan:** onboarding (`.agents/skills/super-board/references/onboard.md` on the installed host), ticket format (`.agents/skills/super-board/references/ticket-format.md` on the installed host), lint (`.agents/skills/super-board/references/lint.md` on the installed host), design preflight (`.agents/skills/super-board/references/design-preflight.md` on the installed host), skill readiness (`.agents/skills/super-board/references/skills-readiness.md` on the installed host), lane lifecycles (`.agents/skills/super-board/references/run.md` on the installed host), Codex execution (`.agents/skills/super-board/references/run-workflow.md` on the installed host), config/merge policy (`.agents/skills/super-board/references/config-schema.json` on the installed host), blocked exits and approvals (`.agents/skills/super-board/references/block-template.md` on the installed host), decision policy (`.agents/skills/super-build/references/decision-policy.md` on the installed host), and GitHub rate discipline (`.agents/skills/super-board/references/rate-limit-etiquette.md` on the installed host).

## 3. One orchestration system and distinct responsibilities

The ordered process is Architecture, Specification, Task Breakdown, GitHub Issues, Lint, Build, QA, required Security, Review, Human Approval, then Next Task. Planning/specification/triage occur with the owner before a run. Build, QA and Review are the actual board lanes. Deeper security is an explicitly requested checkpoint, not an invented fourth automatic lane.

### Implementation execution environments

The owner has selected **GitHub Actions as the primary implementation and verification path**, supported by **Remote Desktop Commander, Codex Cloud and local Codex**. The [accepted execution-method decision](decisions/2026-11-01-implementation-execution-method.md) defines their roles and handoffs. Super Board still owns task selection, dependency handling and the single active task; these environments are not competing orchestrators.

Use an approved configured Actions implementation job when available. Select a supporting method for approved remote interaction, cloud execution or local debugging/runtime needs, and record why. Handoffs retain the same issue, branch/PR and pinned Git revision; stop/checkpoint the previous writer before switching environments. Required TDD, independent QA/security/review, owner-requested merge and phase gates apply everywhere. Verify actual skills, tools, permissions and synthetic test-data access on the selected runner/host; local readiness does not establish cloud readiness.

The current checked-in Actions workflow is **verification-only**. No issue-driven coding job or Super Board-to-Actions implementation adapter has been established by inspecting it. Separately scope and verify that integration before using Actions for code-writing dispatch. The existing `host: codex` / `worker_backend: workflow` configuration and local launcher details below remain descriptions of the installed local path, not an implementation of the new primary-path integration. This documentation change does not alter those settings or launch work.

### Stage ownership, activation and model profile

Profiles are defined in section 6; helpers listed as conditional are used only when their trigger applies.

| Stage | Responsible agent | Primary skill / contract | Supporting skills and activation | Profile |
|---|---|---|---|---|
| Architecture | Architect + owner, outside a run | Super Board design preflight | `codebase-design` for unsettled expensive ownership/interface choices; `domain-modeling` for terminology/ADR; audit guidance for a sensitive boundary | A |
| Specification | Planner + owner | Approved architecture and native issue/spec contract | `to-spec` only after host resolution and when synthesis is needed; retain local drafts until publication is separately approved | S |
| Task Breakdown | Planner | Super Board ticket format and dependencies | `to-tickets` for slicing a settled spec; suppress its publication/ready defaults until owner approval | S |
| GitHub Issues | Board operator | Super Board issue contract | Approved drafts, exact prerequisite IDs, risk/type labels; no automatic mass-Ready promotion | O |
| Lint/readiness | Board operator with owner | `$super-board lint` | Diagnosis for missing repro, design preflight for criterion 19; interactive clarification outside workers | S |
| Build | Fresh Super Build worker | `super-build` integration contract | Label-based `implement`/diagnosis/TDD/design; always simplest-first, verification and self-review; official vendor docs for external APIs | B or F |
| QA | Fresh independent Super QA worker | `super-qa` **board integration** | TDD, diagnosis, test strategy, conditional test mechanics; `pr-security-review` on each PR | Q or QH |
| Security checkpoint | Independent security auditor, scheduled by owner/operator | Cloudflare `security-audit` | Scoped/full audit contract, local synthetic validation and independent finding verification; never launched automatically by a lane | H |
| Review | Fresh independent Super Review worker | `super-review` integration contract | Two-axis `code-review`, design vocabulary, simplicity fallback; adversarial checks when triggered | R or RH |
| Human Approval | Repository owner | HisabIQ human-only merge and phase gate | Current PR/SHA, CI, QA, review/audit and recovery evidence; a model has no approval authority | Human; S may summarize |
| Next Task | Board operator under owner curation | Super Board reconciliation and dependency checks | Confirm landing and closure, phase acceptance where needed, next issue lint/readiness | O |

### Stage contracts — inputs, outputs, proof and advancement

| Stage | Required inputs | Expected output and verification | Block / advance rule |
|---|---|---|---|
| Architecture | Foundation ADRs, current callers/state owners, security/accounting requirements | Follow an existing decision; otherwise two distinct sketches, tradeoffs, chosen seam, rollback and test witnesses | Unknown business/trust boundary blocks; advance only with owner-approved decision |
| Specification | Approved decision, actors, roles/plans, failure semantics, limits | Scope, observable contracts, **owner-agreed test seams**, exclusions and 2–5 checkable outcomes per future slice | Unresolved money/auth/public-contract meaning blocks; approval authorizes the slice, not production |
| Task Breakdown | Approved spec, existing code and test surface | Independently verifiable slices, normally under 400 changed lines; ordered dependency graph and a real-integration owner for each fake | Oversized/unowned real adapter blocks; owner approves granularity/edges |
| GitHub Issues | Approved publication scope and drafts | One issue per slice; correct labels; exact `## Blocked by` references, linked spec and measurable ACs | No invented IDs or publication in this documentation task; proceed only after authorized issue creation |
| Lint/readiness | One candidate in Ready, remaining work in Backlog, source/config/issue bodies | Native 19-criterion review, approved issue edits and real `docs/super-board/pre-flight.md`; host/verification checks | Any unchecked preflight, invalid dependency or missing necessary skill blocks run; an empty lint does not certify P1 |
| Build | Linted issue, approved seams/design, clean base, lane skill report | Real RED for the right reason, minimal GREEN, scoped review-stage refactoring, checks, commit/push, one linked **draft PR**, builder handoff | RED absent, AC unmet, unapproved trust change or safety failure blocks/bounces; pass hands same task to QA |
| QA | Current issue/PR/diff, builder evidence, independent test plan | One observable proof per AC; edge/test-gap analysis, functional/negative tests, PR security report, committed non-secret evidence, exact `Local tests:` command | Kept security finding or missing critical proof fails QA; product fix returns to Build, test fix stays/routes to QA |
| Security | Approved scope/profile, pinned SHA, threat model, synthetic fixtures, sandbox capability | Audited boundary/coverage ledger, independent validation, structured findings and report; explicit gaps and remediation ownership | Missing/incomplete required audit, unresolved high/critical or essential `needs_validation` blocks; changed relevant code requires revalidation |
| Review | ACs/raw diff before summaries, prior report, QA/audit proof, current head/base | 2–4 independent hypotheses, finding rechecks, exact QA-command rerun, current CI, adversarial confidence when required | Open blocker, stale SHA/base or failing check blocks; clean result is verified/readied **awaiting owner merge**, not Done |
| Human Approval | Exact reviewed head and current base, CI/QA/security, rollback, residual risk/cost | Owner's explicit PR decision in chat; agent may perform the requested merge after required checks; separate recorded phase acceptance | Approval of this plan, merge, phase, billing/data and deployment are distinct; none implies the others |
| Next Task | Confirmed merged PR/base ancestry, linked issue closure, gate evidence | Board reconciliation to Done, next genuinely eligible issue selected | Closed-as-duplicate/dropped is not delivered dependency proof; next stays Backlog until all applicable human and technical prerequisites pass |

### Actual lane and recovery behavior

- Status columns are **Backlog, Ready, Building, QA, Review, Blocked, Done**. `feature`/`bug` enter Build; `qa` skips Build and tests existing behavior. Docs/tests/refactor labels select helper rows but do not add lanes. A `security` label never invokes Cloudflare audit.
- One issue has branch `issue-<N>-<slug>` and one draft PR targeting `main`. Build, QA and Review use separate `.claude/worktrees/issue-<N>-build/`, `-qa/`, `-review/` worktrees on that branch, **sequentially**. Preserve handed-down branch/worktree and interrupted commits.
- Inter-lane truth is the issue body/all comments, PR description/comments and review threads. Local result JSON, manifests and halt records are operational state, not substitute acceptance evidence.
- Build pushes its tests/code and opens a draft PR; QA pushes its tests/evidence. QA failure returns QA to Ready for the same issue. Reviewer `[builder]` threads return Review to Ready; `[qa]` threads return Review to QA; both open means handle the older owner first. Every fix uses the same branch/PR and is reverified and re-reviewed; resolving a thread is not proof of a fix.
- Review remembers stable finding IDs in `<!-- super-review:report -->`, rechecks prior findings before a fresh pass, and reruns QA's exact `Local tests:` command. Relevant changes invalidate earlier proof. No self-approval by the builder. Saved `truth_gate: non-trivial` triggers on a diff of at least 10 lines or a security/migration/payments/auth label; use code-grounder and historian checks, the minimum confidence and saved threshold 70. Missing evidence fails closed; over-engineering alone does not reduce confidence.
- Use **board integration mode**, not standalone Super Build's legacy dispatcher or standalone Super QA's BFS crawler/second board/direct-branch workflow. Do not read dotenv files or bootstrap Supabase admin users from generic standalone examples. Use synthetic fixtures and repository secrets rules.
- In Codex, plain `run` acts as explicit `--codex`; `worker_backend: "workflow"` does not require a nonexistent Workflow tool here. The installed Codex wave helper runs lane contexts. It performs preflight/classification and truth checking inline rather than launching Claude subagents. Preserve their checks; do not claim separate Codex truth-check agents ran. Independent Build/QA/Review contexts and independent audit validation remain required.
- **Codex helper-independence limitation:** the launcher explicitly forbids worker subagents, while the generic two-axis code-review and PR security skills describe parallel/fresh helper contexts. Do not claim those helper agents ran. The host adaptation supports separate inline passes, which are not equivalent to fresh-context validation. Run both axes and all security filters, record that limitation, and hold any acceptance criterion requiring fresh validation until the operator explicitly schedules a fresh read-only validator for this same task outside the lane. Required Cloudflare milestone audits retain their independent validator contract outside the Codex lane. This is a readiness/acceptance gap to resolve before the affected task, not permission to edit the launcher, waive independence or start another product task.
- Missing verification commands: halt exit 9; missing selected skills: halt exit 10; malformed input/catalog: exit 64; required GitHub evidence failure: halt exit 79. Preserve claims, worktrees, statuses and approval records as the relevant contract requires. Report exact reason; no empty-board/green-proof substitutes, forced cleanup or automatic mutation retries.
- Repeated same-cause lane failures use `rebuild_cap: 2`; no-progress cycles use the saved limit 6. Failure feedback includes `root-cause-hash:`. Use the mandatory full block template, owner, evidence and `blocked-by:` line. A human decision uses `blocked-by: -`; dependency blocks name real issues.

## 4. Strict one-task-at-a-time policy — every phase

`max_workers: 1` limits concurrency; it does **not** by itself stop a board from advancing through many unrelated eligible cards. Keep it at 1 through **P12**, not just P1/P2, and curate the queue as follows:

1. Select exactly one eligible issue with approved scope and satisfied real dependencies. Keep all other prospective work in Backlog, including unrelated work. There may be only one current task across Ready/Building/QA/Review or a human-gated Blocked state.
2. Complete that issue's Build, independent QA, required audit checkpoint and independent Review. Read-only reviewer/auditor helper analyses of this same task are permitted; they do not authorize a second product issue or simultaneous branch writers.
3. Keep the next task in Backlog while the current task awaits a fix, evidence, audit, owner decision or merge. Pause for the explicit audit checkpoint; do not launch the next issue to fill idle time.
4. Present the PR's exact head, current CI, AC proof, review/audit status and rollback to the owner. Keep unattended board merging disabled with `human_approves_merge: true` and `merge_policy.default: "human"`; the normal lane stops in Review. An explicit owner-chat instruction to merge the named PR authorizes the attended procedure in section 9 without a second GitHub confirmation. Actual blocker findings still block completion.
5. On an explicit owner merge request, the agent merges the verified PR using section 9, or the owner merges it directly. Reconcile only after the actual merge is confirmed and the merge commit is an ancestor of fetched `main`. Mark delivered work Done and verify issue closure. Never fabricate a human GitHub approval comment; none is required merely to repeat the owner's chat authorization.
6. Check the next issue's dependencies and the phase gate. Only then promote that single issue and lint it. If the last task of a phase is merged, wait for separate owner phase acceptance before closing its phase-gate record and promoting the next phase.

Publish real GitHub issues later in topological order. `P1.1`, `P2.G`, etc. below are **draft identifiers**, never literal published dependency values. Replace each edge with an actual issue number. The parser reads a section containing only `- #N — reason` bullets or exactly `- None.`; title order, a milestone, `Depends on:` prose and native sub-issue relationships alone do not enforce this contract. Native relationships may supplement it.

For a phase gate, use a real evidence/review issue (`qa`, with no product changes) and record owner acceptance only after all prerequisite PRs land. Its QA report does not authorize the audit automatically. Because the dependency helper checks issue closure, the operator must also check delivered behavior and explicit phase acceptance; closure alone, especially a dropped card, cannot waive a gate. Do not place a future issue in dependency-only Blocked where the automatic sweep could promote it before owner curation.

A WIP-partial, dropped issue, failed audit or stopped run does not unlock later work. If scope is rejected/dropped, the owner must explicitly revise the affected dependencies; no chronological assumptions. No parallel phases and no competing Superpowers/Addy orchestrator, standalone auto-fix loop, or whole-repo refactor campaign.

## 5. Skill-routing rules, TDD and evidence

| Trigger | Activate | Limits / output |
|---|---|---|
| Setup repair, curated execution, status/stop | `super-board` corresponding verb | Setup fixes installation; `run` dispatches workers, never implements product code in the orchestrator |
| Feature | Super Build with `implement`, `tdd`, `codebase-design` label row | Deliver only approved ACs; design is vocabulary unless an unsettled expensive choice triggers two-sketch preflight |
| Defect | Super Build with `diagnosing-bugs`, then `tdd` | Obtain a deterministic red-capable minimal reproduction; ranked falsifiable hypotheses, focused instrumentation, original-repro rerun and retained regression |
| Tests-only / refactor / docs | Native matching Build helper row | Tests: TDD; refactor: design + TDD; docs: no behavior TDD. Always verification and self-review. Don't add conflicting type labels |
| All Build tasks | Ponytail full if exact helper resolves, otherwise `simplest-solution-first` fallback | Existing code, stdlib, native capability, existing dependency, then minimum code. Never remove validation, authorization, recoverability or an AC to shorten code |
| All completed Build diffs | `verification-before-completion` and `mattpocock-skills:code-review` | Run evidence first; Standards and Spec axes against a supplied merge-base. Built-in helper analyses may be independent without adding another task workflow |
| QA | Super QA board contract, `testing-strategy`, TDD/diagnosis and necessary mechanics | AC ledger, concrete edge values, test-the-tests, High gap remediation; backend logs/HTTP/DB proof, not invented UI screenshots |
| Every PR in QA | `pr-security-review` | Diff against actual base; candidate discovery and false-positive filtering under the installed host adaptation; disclose inline versus fresh-context validation as above; retain only findings meeting its high-confidence contract. Any retained finding fails QA. No diff on QA-first card must say `pr-security-review: no diff` |
| Sensitive milestone / boundary change | Explicit independent Cloudflare `security-audit` | Deeper scoped or full assessment before approval. Never a side effect of installing a skill or applying a label |
| Independent Review | Super Review + two-axis code review/design; Ponytail review or `over-engineering-ladder` | Diff-scoped; prior findings; rerun QA proof; taste-only simplification is Should fix and never blocks alone. Financial/security failures do block |
| Unclear product/trust decision | Human clarification in planning/lint | `grilling` only interactively if necessary and available. Never invoke interview skills in unattended workers |
| Genuine terminology/ADR / conflict / flow ambiguity | `domain-modeling` / `resolving-merge-conflicts` / `ask-matt` respectively | Check selected host helper first; keep scope and existing lane boundaries |
| Spec/ticket drafting | Native contract, optionally resolved `to-spec`/`to-tickets` | HisabIQ publication approval and exact Super Board ticket/dependency format override generic publish/ready templates |
| Interface to a vendor, dependency upgrade, auth/billing | Current official vendor docs before implementation | Pin installed major, cite exact fact settled in PR `Docs:` lines. Unverified critical D1/auth assumptions block acceptance |

`Skills:` outside a code fence **replaces** a Build label row; the always-list still applies. Avoid overrides unless necessary, resolved and approved. QA-only overrides add requested helpers. Readiness's `REGISTRY` is executable authority for selection; a plugin catalog does not waive a missing helper's contract. There is no declared fallback for missing `vitest`/Playwright skills. Installing them is future setup work, not part of this documentation change.

### TDD policy

- Agree the public seams in the approved issue before dispatch. Prefer direct domain interfaces for pure logic, real Workers/D1 collaborators for storage/atomicity, HTTP for authorization/contracts, and browser tests only when browser behavior is the requirement. A storage adapter's agreed readback/reconciliation interface is valid persistence evidence; a test-only SQL backdoor is not a substitute public contract.
- Work one behavioral slice at a time: run RED for the intended missing/wrong behavior, implement the smallest GREEN, then review and refactor while green. The installed Matt Pocock TDD skill places refactoring in review; do not substitute another TDD workflow. Missing runtime, timeout or selector failure is a harness failure, not behavioral RED.
- Use independently derived expected amounts, balances and states. Preserve regression behavior through implementation refactoring. No assertions about the mock itself, duplicated implementation calculations, or snapshots that merely echo generated output.
- For financial/concurrency/recovery correctness, real local Workers D1 is mandatory; do not claim a Node/SQLite fake proves D1 rollback or cross-database cutover. External billing/OTP events can use agreed deterministic contracts/synthetic events, with integration readiness separately owned.
- QA's High gaps include uncovered ACs, auth/ownership, money, security and data loss. A passing added test must be shown red by a bounded temporary mutation when needed; restore it before commit. If the test reveals a necessary product-code change, fail QA and return to Build. Medium/Low gaps are reported honestly; any actual integrity failure blocks regardless of its gap classification.

### Required evidence on every task

Record issue/PR, exact reviewed head and base, actual commands/versions, inputs/fixtures, RED/GREEN outputs where applicable, AC-to-test `file:line`, data-state reconciliation, independent QA and PR security outcomes, audit scope/status, review findings, rollback limits, resource/cost observations when relevant, and explicit production state. Retain non-secret QA artifacts under `docs/super-board/runs/issue-<N>-qa-v<V>/` on the issue branch and link from issue and PR. QA supplies the exact `Local tests:` command for Review to rerun. Backend-only ACs explicitly omit screenshot tables; future authorized UI integration requires the installed screenshot contract without changing UI components.

A passing build/typecheck alone is never a financial, security, restore or release gate. Mark unavailable proof as unverified. Do not weaken expectations, bypass failing CI, use generic billing-budget bypasses, or claim an audit from an installation/readiness check. Repository rules override stock skill examples mentioning PostgreSQL `numeric`, Supabase, alternate error envelopes or UI redesign: HisabIQ uses integer poisha and `{code,message,requestId}`, `/api/v1` after contract review, and standalone `/health`.

## 6. Model and reasoning strategy

These are HisabIQ recommendations, not automatic lane settings or claims that a model proves correctness. Official [Codex/Work model guidance](https://learn.chatgpt.com/docs/models) identifies GPT-6.1 Sol for repeated complex work, Astra for demanding work and Luna for focused tasks; [model selection](https://developers.openai.com/api/docs/guides/model-selection) recommends measuring quality/cost tradeoffs. [Reasoning guidance](https://developers.openai.com/api/docs/guides/reasoning) makes supported effort model-dependent. Recheck account availability before execution; no pricing promise or model migration is made here.

| Profile | Role / task | Recommended model | Effort | Escalation / cost rule |
|---|---|---|---|---|
| O | Board bookkeeping, issue formatting, status summary | `gpt-6.1-sol`; `gpt-6-luna` only for mechanical extraction | low; Luna medium | Keep interpretation of business/security gates with S/A; use deterministic scripts for IDs and checks |
| A | Architecture, trust seams, D1 feasibility and recovery design | `gpt-6-astra` | high; xhigh for competing financial/concurrency designs | Escalate on unresolved invariants, not ordinary documentation length |
| S | Specification, task breakdown, lint, approval evidence summary | `gpt-6.1-sol` | high for decisions; medium for settled formatting | Astra high for unresolved auth/accounting semantics |
| B | Routine scoped backend implementation | `gpt-6.1-sol` | medium | high for a difficult defect; F for critical boundary/race work |
| F | Atomic financial posting, fencing, migration and offline synchronization | `gpt-6-astra` | high; xhigh for crash/concurrency proof | Use Sol only for isolated mechanical follow-ups that cannot change the invariant |
| T | Unit/integration test creation | `gpt-6.1-sol` | medium; high for negative cases | Astra high/xhigh for failure-injection or concurrency test design |
| D | Bug investigation | `gpt-6.1-sol` | high | Astra xhigh for intermittent financial loss, tenant leak or cutover race; preserve minimal repro |
| Q / QH | Independent QA / security-critical QA | `gpt-6.1-sol` / `gpt-6-astra` | high / high to xhigh | Test risk determines depth; QA independence comes from fresh context and evidence |
| R / RH | Independent diff review / high-risk review | `gpt-6.1-sol` / `gpt-6-astra` | high / high to xhigh | Current-head test reruns and prior-finding checks remain mandatory |
| H | Independent Cloudflare security assessment | `gpt-6-astra` | xhigh for sensitive boundary analysis | Bound scope/profile and reserve verification budget; incomplete coverage stays incomplete |
| Human | Product decisions, merge, phase sign-off and production activation | Owner | n/a | A model can summarize; it cannot supply human authorization |

Use the lightest profile that passes the same meaningful checks. Avoid defaulting every routine task to Astra/xhigh. Security helpers and truth-check analyses remain inside the current task's budget and scope; changing model does not replace them.

### What the inspected local Codex launcher actually supports

`.claude/bin/super-board-lane.sh`, class `Codex.LADDERS`, is the source for tier-to-model dispatch:

| Run tier | Low-complexity card | Medium-complexity card | High-complexity card |
|---|---|---|---|
| low | `gpt-6-luna` | `gpt-6.1-sol` | `gpt-6.1-sol` |
| medium (saved default) | `gpt-6.1-sol` | `gpt-6.1-sol` | `gpt-6-astra` |
| high | `gpt-6-astra` | `gpt-6-astra` | `gpt-6-astra` |

The router uses Luna; a card entering after Ready uses its tier's medium cell. `$super-board run --codex=gpt-6-astra` pins one model for **all lanes/cards of that run** and skips the router; `codex.model` is another supported run-wide pin. There is no inspected per-role model/effort field, and `--high` is a **model tier**, not `reasoning_effort=high`.

The launcher passes `-m` but does not explicitly pass reasoning effort. Worker effort comes from effective Codex configuration; this plan does not silently change it. Before a future run, the operator must verify the intended model and effective effort from the actual worker configuration/logs. If different role efforts cannot be applied through the installed host controls, use the highest effort needed by the current single task consistently and record that limitation; do not invent a `super-board --effort` flag. For P1/P2/P7/P8 critical work, prefer the supported Astra pin and verify high/xhigh effort separately. The role matrix is not a new dispatcher and does not authorize changing launcher code.

## 7. Dependency-aware P0–P12 roadmap

**Common contract for every phase:** its first implementation issue depends on the previous accepted phase gate; each numbered issue below depends on its named predecessors and the immediately preceding issue within its phase. This conservative chain enforces the owner's serial policy; the graph must encode it using real IDs when published. All later phases remain Backlog. Every issue uses the stage, TDD, QA, security and owner-merge contracts above. Split an entry further if it cannot stay independently testable and normally below 400 changed lines; preserve its blocking edges.

**Assignment shorthand:** `B` = Super Build + appropriate label row/always-list; `Q` = independent Super QA + PR security; `H` = explicitly invoked independent audit; `R` = independent Super Review; `G` = owner phase acceptance recorded in a real phase-gate issue. Profile letters refer to section 6, not additional agents or automatic flags. Each `Pn.G` is an evidence-only QA/review record after its implementation chain, with owner sign-off after its own PR/evidence is reviewed and merged where applicable.

### P0 — Foundation and execution readiness

**Objective / prerequisites:** retain the existing scaffold and establish a trustworthy baseline. Requires owner approval of this plan; do not rebuild implemented health or pure placement behavior.

**Ordered proposed issues:** P0.1 reconcile existing scaffold/setup changes into reviewed draft PRs without overwriting dirty work (the [local P0.1 contract and scope map](tasks/p0-1-reconcile-foundation.md) awaits publication authorization); P0.2 validate baseline tests/CI and required branch checks, dependency and secret/license review; P0.3 resolve selected P1 test-helper visibility, Codex model/effort and local-runtime readiness; P0.G review baseline evidence and accept P0. Each is a separate task; if earlier work is already delivered, verify and link it rather than duplicate it.

**Assignments / models:** planner S; existing-code review B/R with B/R profiles, readiness operator O; Q for independent baseline tests; H for the foundation's scoped security review required by the architecture; owner G.

**Tests / integrity / security:** existing health and placement boundary/corrupt-input tests; frozen install, typecheck, full unit suite and current GitHub `verify`; actual dependency/secret checks and source/config inspection for accidental live resources. Confirm no posting/storage/auth behavior is claimed from pure policy tests. Do not recreate historical RED evidence if it was not retained; record that gap and obtain an explicit owner disposition.

**Acceptance / exit gate:** reviewed foundation landed on `main`, required CI/protection and separate security evidence present, intended worker/test helpers resolved, clean base checkout and owner P0 acceptance. Existing green tests/onboarding alone do not satisfy P0.G. **Next eligible:** P1.1 local D1 harness.

### P1 — D1 atomicity, idempotency and final-stock feasibility

**Objective / prerequisites:** prove financial and stock primitives on actual local Workers D1 before broad ERP work; depends on P0.G and an approved posting/readback seam.

**Ordered issues:** P1.1 isolated Workers D1 harness and real runtime/constraint witness; P1.2 balanced two-line sandbox posting with fail-at-each-statement rollback; P1.3 tenant-scoped same-operation replay and changed-payload conflict; P1.4 two concurrent cashiers race for the last unit through atomic posting; P1.G independent proof/audit evidence and owner D1 go/no-go. Full proposed contracts are in section 10.

**Assignments / models:** architect A for D1 semantics; B/F and test T with F escalation; independent QH; explicit H for the transaction boundary; RH; owner G. No auth subsystem or production ledger is implied by this isolated PoC.

**Tests / integrity / security:** invalid/unsafe/nonpositive poisha and wrong-tenant references; independent debit=credit readback; each SQL failure leaves no partial journal, stock or operation result; zero-row guard must abort the batch rather than silently commit; identical payload replays after lost acknowledgement; changed payload conflicts; same operation ID across two tenants stays isolated; final-unit contention admits at most one sale with no negative stock in the approved spike fixture. Capture real runtime/query observations; mocks cannot satisfy exit.

**Acceptance / exit gate:** reproducible independent rollback/replay/race proof, scoped Cloudflare audit and no unresolved integrity/tenant or high/critical security failure, owner approval of D1 suitability. If D1 cannot meet invariants, stop and propose a specific ADR revision for owner approval; do not switch databases silently. **Next eligible:** P2.1 Better Auth runtime PoC.

### P2 — Identity, tenant registry and subscription-aware routing

**Objective / prerequisites:** authenticated server-derived tenant context and placement authority; depends on P1.G. Better Auth remains subject to its PoC, not an assumed integration.

**Ordered issues:** P2.1 Workers-compatible Better Auth identity/session proof (split each external login/phone/OTP contract if needed); P2.2 tenant membership/role authorization on one protected test route; P2.3 central placement registry and atomic pool admission reservation; P2.4 approved prebound binding-manifest/epoch resolver; P2.5 subscription-versus-placement decision contract and entitlement version enforcement; P2.6 revocation/tenant/routing adversarial suite; P2.G audit and owner isolation acceptance. P2.5 prepares lifecycle decisions only; full relocation jobs/copy stay in P7.

**Assignments / models:** A for trust/session/storage ownership; B/F for auth/registry mutations and B for settled contracts; QH, H, RH and G.

**Tests / integrity / security:** password/KDF/runtime compatibility where applicable, OAuth state/phone verification and OTP replay/expiry on agreed seams; session/role revocation; wrong tenant and role/plan, nested reference tampering, stale entitlement/placement epoch, rejected arbitrary database ID/binding, canary tenant isolation. Concurrent admission never exceeds tested reservation limits or allocates Premium twice. Denied reads/exports and mutations return no other tenant's data. A mock provider is contract evidence only; real integration readiness has a named issue/gate.

**Acceptance / exit gate:** one approved identity authority, server-resolved tenant/entitlement/placement, tenant-scoped constraints and negative suite, documented approved revocation window, dedicated-binding path proven in allowed fixtures, scoped Cloudflare audit and owner G. **Next eligible:** P3.1 tenant product master.

### P3 — Catalog, exact units and stock master

**Objective / prerequisites:** tenant-safe catalog/inventory primitives; depends on P2.G and P1 posting constraints.

**Ordered issues:** P3.1 product master with agreed English/Bangla/search contract; P3.2 category/brand references in small tenant-scoped slices; P3.3 exact unit ratios/symbols and explicit rounding; P3.4 stock movement/read-model contract; P3.5 FIFO lot ownership/allocation primitive; P3.6 serial uniqueness; P3.7 expiry/warranty rules; P3.G catalog/stock evidence acceptance. Product deletions cannot erase future posted references.

**Assignments / models:** B/B for master records, B/F for stock/FIFO; T high for unit properties; Q/QH and R/RH by risk; audit H if introducing a new sensitive surface or expanding the approved P2 boundary.

**Tests / integrity / security:** unit round trips and fractional/overflow boundaries, tenant-scoped foreign keys, duplicate serials, FIFO cost examples, expiry/time boundaries and immutable movement reconciliation; invalid bulk inputs and ID tampering. No unapproved negative-stock or cost policy is inferred.

**Acceptance / exit gate:** exact quantities and tenant ownership proven, stock reconciles to movements/lots, serial/expiry rules match approved decisions, no integrity blockers, owner G. **Next eligible:** P4.1 immutable accounting journal.

### P4 — Double-entry accounting and purchases

**Objective / prerequisites:** real immutable accounting with purchases; depends on P3.G, P1 atomicity and P2 authorization.

**Ordered issues:** P4.1 account/journal and linked reversal contract; P4.2 opening-balance posting; P4.3 minimal atomic purchase with stock/lot and journal; P4.4 purchase FIFO/cost allocation; P4.5 supplier due/payment settlement; P4.6 purchase return at original cost; P4.G reconciled purchasing/accounting and audit acceptance. Separate postings from drafts where needed to keep each PR small.

**Assignments / models:** A/S for unsettled accounting semantics, B/F, T high/F for race/rollback tests, QH, explicit transaction H, RH and G.

**Tests / integrity / security:** trial balance, integer amount bounds/rounding, immutable posted entries and linked reversals, invoice/stock/lot/dues/COGS atomicity at each failure, duplicate operations/payments, concurrent settlement/return, forbidden posted deletion and wrong-tenant/role calls. Reconcile supplier subledger independently to journal.

**Acceptance / exit gate:** balanced immutable entries and conserved stock/cost/dues with no partial purchase or repeat settlement; scoped Cloudflare audit for the new posting paths; owner accounting sign-off. **Next eligible:** P5.1 unchanged React sales contract.

### P5 — Online POS, payments, returns and unchanged UI contract

**Objective / prerequisites:** atomic online sale/return APIs matching existing React behavior; depends on P4.G.

**Ordered issues:** P5.1 inspect and freeze existing UI request/response/error contract without UI edits; P5.2 sale draft and safe invoice sequence reservation; P5.3 minimal atomic sale; P5.4 mixed-unit/discount/price-override rules; P5.5 payment splits and customer due; P5.6 returns/refunds at original allocations; P5.7 backend contract compatibility/E2E against the unchanged UI when its test environment is explicitly available; P5.G POS safety acceptance. Each payment/return variant is a separate slice when required by size.

**Assignments / models:** S for contract, B/F for sale/payment/return, QH/RH; explicit H for checkout/payment boundary changes; owner G. Test mechanics/Playwright readiness must be proven before browser work.

**Tests / integrity / security:** totals in poisha, invoice uniqueness, concurrent last-stock and price authority, discounts/rounding, split tender exact sum, idempotent double submit/lost ack, sale and return fail-at-each-statement rollback, over-return prevention, original FIFO/COGS reversal and tenant/role checks. UI contract test does not authorize changing its components or calling real payment services.

**Acceptance / exit gate:** complete observed online checkout/return fixture reconciles invoice, stock, allocations, cash and receivable/journal; unchanged UI compatibility proven; relevant security audit and owner G. **Next eligible:** P6.1 customer/supplier ledger views.

### P6 — Parties, ledgers, counter and cash sessions

**Objective / prerequisites:** auditable balances and operator cash controls; depends on P5.G.

**Ordered issues:** P6.1 customer/supplier ledger read contract; P6.2 invoice-linked reconciliation and adjustments through reversals; P6.3 counter/operator ownership; P6.4 cash-session open/post/close; P6.5 concurrent close and reconciliation exceptions; P6.G owner cash/ledger acceptance.

**Assignments / models:** B/B for read models, B/F for cash movements/settlement; QH/RH for monetary changes, Q/R for simple views; H for newly exposed privileged operations; G.

**Tests / integrity / security:** receivable/payable totals equal immutable source journals, bounded tenant filters, session opening/closing and backdated input rules, duplicate/concurrent close and payment retries, expected-vs-counted cash, wrong counter/role/export denial. No direct balance editing bypasses posting.

**Acceptance / exit gate:** ledgers reconcile exactly, cash sessions are attributable and replay-safe, privileges and exports remain tenant-scoped; owner G. **Next eligible:** P7.1 tenant backup/restore contract.

### P7 — Backup, restore and fenced tenant relocation

**Objective / prerequisites:** recover and move exactly one tenant without harming peers or creating two writers; depends on P6.G, proven P1/P2 invariants and owner decisions for the affected retention/recovery policy.

**Ordered issues:** P7.1 tenant backup manifest/integrity contract; P7.2 off-account backup verification using synthetic allowed resources; P7.3 restore into a scratch placement plus financial/stock reconciliation; P7.4 persisted migration state/one active job and transactional destination reservation; P7.5 bounded tenant copy/checkpoints; P7.6 source fence/in-flight drain; P7.7 independent reconciliation proof; P7.8 placement CAS/destination activation/forward recovery; P7.9 crash/retry matrix; P7.10 guarded read-only cooldown/source retirement; P7.G restore/relocation audit and owner acceptance. Destructive cleanup is a separate reviewed slice, never bundled into first cutover.

**Assignments / models:** A/xhigh for cutover protocol; B/F, T/F for independent crash and corruption fixtures; QH, H/xhigh, RH and G.

**Tests / integrity / security:** Free-to-Premium, Premium-to-Basic/Medium/Free, Paid-to-Free, Basic/Medium in-place weight change and oversized/no-capacity deferral. Validate every permitted state/exception and inject crash just before/after each transition, especially fence, registry CAS and destination activation. Test concurrent sale/copy, duplicate jobs/callbacks, schema mismatch and tenant canaries. Reconcile trial balance, AR/AP, stock/FIFO/serials, payments/returns, invoice sequences, operation results and attachment manifests, not just row counts. Prove no two writers despite **no cross-D1 atomic transaction**; after switch recover forward. A shared pool must never be rewound for one tenant or whole-pool exported for live single-tenant relocation.

**Acceptance / exit gate:** source stays authoritative until verified switch, target becomes the sole writer, restart is deterministic, unrelated tenant data is unchanged, no history is deleted to fit a plan, scratch restore and measured RPO/RTO/cooldown evidence meet approved targets; full sensitive-boundary audit and owner G. Frozen-copy versus proven delta design and binding/cell provisioning must be settled in design preflight before their issue is Ready. **Next eligible:** P8.1 one-device enrollment/lease.

### P8 — One authorized offline POS device and safe synchronization

**Objective / prerequisites:** durable single-device offline commands with safe online reconciliation; depends on P7.G and the unchanged UI/offline contract agreed with the owner.

**Ordered issues:** P8.1 enrollment/revocation and one active device lease; P8.2 durable local Pending queue/operation identity contract; P8.3 idempotent server synchronization; P8.4 deterministic stock/serial conflicts; P8.5 lease/placement changes during synchronization; P8.6 interruption/retry and unchanged UI contract checks; P8.G independent offline audit and owner acceptance. Queue integration does not permit React redesign or unapproved edits to `hisabiq_ui`.

**Assignments / models:** A for lease/fencing semantics; B/F, T/F for replay/races; QH, H/xhigh, RH and G.

**Tests / integrity / security:** second device denied; revoked/expired lease denied; old placement and lease epochs distinguished; duplicate sync/lost ack never double-posts; device crash preserves accepted/pending commands; migration fence produces retryable Pending using the original key, not Needs Review. Needs Review is reserved for genuine stock/serial/business rejection. Other valid online devices keep the approved online behavior.

**Acceptance / exit gate:** exactly one authorized offline device, no duplicate financial posting or lost accepted command, bounded revocation and deterministic migration recovery proven; scoped audit complete and owner G. **Next eligible:** P9.1 source-linked reporting contracts.

### P9 — Reconciled reports, advisor and audit views

**Objective / prerequisites:** bounded reports traceable to posted source records; depends on P8.G.

**Ordered issues:** P9.1 source-linked report/read-model contract; P9.2 sales report; P9.3 stock/valuation report; P9.4 profit/COGS report; P9.5 dues/cash report; P9.6 advisor/audit explanations and permissioned exports; P9.G reconciliation/performance acceptance. Each report is independently verifiable, not one all-reports PR.

**Assignments / models:** B/B, Q/R with high effort for reconciliation; F/QH/RH if monetary semantics change; H for new export/advisor trust surfaces; G.

**Tests / integrity / security:** totals reconcile to journal/invoices/movements/reversals, timezone and period boundaries, zero/one/many rows, pagination and bounded query plans. Tenant/role/plan scoping applies to exports and advisor context as well as screens. Do not introduce an external AI data processor or send tenant data without a separately approved decision.

**Acceptance / exit gate:** independently computed totals match posted data, every figure is traceable, bounded-query and access tests pass, no unexplained balance drift; owner G. **Next eligible:** P10.1 subscription/RBAC control contract.

### P10 — Subscription, RBAC, settings and control center

**Objective / prerequisites:** complete business control without coupling entitlement changes to unsafe data moves; depends on P9.G and P2/P7 lifecycle contracts. P2 supplied mandatory auth/entitlements earlier; P10 completes management workflows, not delayed foundational security.

**Ordered issues:** P10.1 owner-approved entitlement/role/plan transition matrix; P10.2 scoped role/settings administration; P10.3 signed/idempotent synthetic billing event adapter; P10.4 effective-dated upgrade/downgrade/version handling; P10.5 deferred placement exceptions/alerts and credit/refund decision handling; P10.6 existing subscription/control UI contract verification; P10.G subscription/control audit and owner acceptance.

**Assignments / models:** S/A for business policy; B/F for auth/billing/version changes, QH, H, RH and G.

**Tests / integrity / security:** stale role/session revocation, operator privilege separation, webhook signatures and replay/reordering, cancellation/refund in transit, downgrade effective-date rollover and quota overflow. Premium availability promise starts only under the approved ready/cutover policy; downgrade entitlements can change while a safe dedicated-placement exception remains. Preserve immutable financial history and required historical/export access. Fixture events never charge a customer.

**Acceptance / exit gate:** approved commercial policies implemented against synthetic provider contracts, entitlement/placement separation and all transition/revocation cases proven, scoped audit passed and owner G. Actual billing activation still requires separate explicit approval. **Next eligible:** P11.1 release threat model and coverage review.

### P11 — Security, load, scale and recovery certification

**Objective / prerequisites:** assess the assembled system and prove release claims; depends on P10.G and resolved earlier audit blockers.

**Ordered issues:** P11.1 current threat/coverage/dependency/secrets/license review; P11.2 bounded synthetic load scenarios for 50/100/250/500/1000 shops (each higher level gated by the prior result); P11.3 noisy-neighbor/binding/storage/cost evidence; P11.4 backup/restore and relocation recovery rehearsal; P11.5 independent **full** Cloudflare audit and remediation/re-audit slices; P11.G owner certification decision. Each remediation stays its own current task before the certification issue resumes.

**Assignments / models:** S/A for budgets and claims, B only for approved test/hardening slices, QH, independent H/xhigh, RH and G.

**Tests / integrity / security:** full unit/Workers/API/authorized UI regression; adversarial tenant/role/entitlement tests across endpoints/exports/files/jobs; financial conservation under retries/faults/load, offline migration crash matrix and tenant-safe recovery. Measure latency/errors, D1 reads/writes/storage, Workers CPU/invocations, R2/SMS/backup cost and recovery windows. Execute only approved isolated environments/budgets; audit skill itself forbids live/shared probing. Platform quotas/pricing/binding availability must be freshly verified, not copied from conflicting snapshots.

**Acceptance / exit gate:** CI and regressions green, no financial/isolation/recovery failure, no unresolved confirmed high/critical or essential unvalidated boundary, full-audit validators and coverage gaps reviewed, measured capacity/RPO/RTO within owner-approved budgets. Report failures honestly; no claim of universal safety or guaranteed $5–10 operation. Owner G. **Next eligible:** P12.1 approved pilot deployment/rollback plan.

### P12 — Controlled pre-production pilot

**Objective / prerequisites:** validate the certified build operationally in an owner-approved pilot; depends on P11.G. Development approval is not deployment approval.

**Ordered issues:** P12.1 review exact artifact/environment, smoke/rollback/recovery and monitoring plan; P12.2 separately authorized staging deployment with synthetic data; P12.3 smoke/load-boundary/restore rehearsal; P12.4 owner pilot go/no-go and, only if separately authorized, limited real-data activation; P12.5 observed reconciliation/incident review; P12.G pilot acceptance. Any source fix returns through Build/QA/security/Review with a new artifact decision.

**Assignments / models:** operator O/S for approved steps; QH/RH for validation; H for pre-release independent security evidence and any changed configuration/trust surface; owner G/deployment/data decision.

**Tests / integrity / security:** artifact/config/secret boundaries, authenticated smoke, tenant canaries, health versus business readiness, posting/replay/reconciliation checks, monitoring/alerts and recovery runbook rehearsal. Separately authorized operational smoke checks are not a live pen-test expansion of `security-audit`.

**Acceptance / exit gate:** exact release approved, no unauthorized customer data/billing/migration, measured smoke/recovery/monitoring evidence and owner pilot acceptance. **Next eligible:** one owner-curated pilot defect or explicitly approved later release task; no automatic general-availability launch.

## 8. Continuous security and independent audit schedule

Security is part of every stage, not just P11. Before Ready, identify actor, input, authorization, tenant/placement, data and irreversible effects; settle owner-approved seams and threat assumptions. During Build, write wrong-tenant/role/epoch, replay and failure-path tests alongside successful behavior. During QA, perform PR security review **on every PR**. During Review, independently assess the current diff, test evidence and any security report.

| Checkpoint | Required independent scope | Acceptance owner |
|---|---|---|
| P0 foundation | Dependencies/secrets/configuration and intended external-tool choices; no live resources | Owner + reviewer |
| P1 D1 go/no-go | Posting atomicity, assertions, tenant references, replay and concurrent stock | Owner after auditor + RH |
| P2 identity/isolation | Sessions, revocation, RBAC/entitlements, pooled isolation, registry/binding/epoch trust | Owner after auditor + RH |
| P4 and P5 posting extensions | Purchase/sale/payment/return boundaries and conservation; audit before accepting newly sensitive flow | Owner after auditor + RH |
| P7 recovery/migration | Snapshot/copy, one-writer fencing, CAS/recovery, cleanup and off-account restore | Owner after auditor + RH |
| P8 offline | Device identity/lease, persistent queue, retries, conflict and relocation | Owner after auditor + RH |
| P10 control/billing | Privileged controls, provider event verification, plan/entitlement versions and deferred placement | Owner after auditor + RH |
| P11 / before P12 release | Full assembled-codebase audit; current release diff/config revalidation when relevant | Owner certification/release approval |
| Any phase changes an approved trust/financial boundary | Explicitly scoped re-audit of changed boundary and affected prior findings | Owner before that task/phase advances |

Cloudflare's skill distinguishes **guidance** from **full audit mode**. Merely loading its instructions, installing it or marking a ticket `security` runs neither the audit nor its validators. Required milestones need an explicit audit request naming target revision, scope/profile (`quick`, `standard`, `deep`), synthetic/local environment and any budget. A scoped full-workflow run covers only its stated surfaces; it is never described as a whole-codebase audit.

The full workflow has reconnaissance/coverage planning, hunting, fresh candidate validation, structured output, independent final record verification and report generation. Retain `run-metadata.json`, `coverage-ledger.json`, `findings.json`, `REPORT.md`, `FINDINGS-DETAIL.md` and `NEEDS-VALIDATION.md` as required, validate with the installed schema/validator tools and state scope/gaps. Run artifacts belong in an approved external location (or explicitly selected ignored directory), with skill-mandated scratch/artifact isolation; do not make ad hoc copies of target-produced artifacts. The skill is read-only on target source; fixes return to Super Build.

Audit execution requires its OS-enforced no-network/isolated-loopback sandbox, explicit safe environment, read-only target/toolchain, scratch-only writes and resource/time limits. Availability of all controls has **not** been established here. Without them, perform allowed source analysis, retain the precise `needs_validation` or incomplete blocker, and make no dynamic validation claim. No deployed probes, credential access, paid quota or live/customer databases. This safety sandbox is distinct from a normal board worker's network-enabled execution profile.

PR security review has deliberately narrow exclusions, including DoS/resource exhaustion and some secured on-disk storage concerns. It does not certify cost abuse, backup, operational secrecy or recovery; those require separate approved tests/audits. Every retained PR finding fails QA, even if its confidence-filtered severity is medium. Critical accounting/auth/tenant/restore/migration failures and confirmed high/critical audit findings block advancement immediately. A material unresolved `needs_validation` cannot be renamed a pass; only the owner can resolve the missing fact with valid evidence, without waiving a failed invariant. Relevant fixes invalidate the prior audit/review head and require revalidation.

## 9. Verification, human approval and release operation

### Persisted policy — preserve until a separately approved change

The saved config is `.claude/super-board/configs/hisabiq-backend.json`; the local active slug is `hisabiq-backend`. Preserve `host: codex`, `base_branch: main`, `max_workers: 1`, `human_approves_merge: true`, `merge_policy.default: human`, `allow_auto_on_production: false`. No automatic PR merges at any phase. Current `migrations.allowed_envs` is **empty**, with no migration commands/checks. This disables board-controlled migrations; it is not approval to run test/staging/live migrations elsewhere. An approved P1 harness may initialize isolated synthetic local D1 fixtures inside its tests; no migration-on-merge command is thereby enabled.

Before any later migration environment is allowed, approve its exact command, read-only reachability check, environment/data scope and recovery/irreversibility policy. No placeholder migration command, customer DB, billing or production activation is authorized by this plan. Keep automatic board merges disabled. An explicit owner-chat merge request is sufficient merge authorization under the attended procedure below; do not toggle the human-only switch or require the owner to repeat that approval in GitHub. Deployment, migration, customer data and billing remain separate authorizations.

### Attended merge on explicit owner request

**Rule:** Never merge automatically. When the owner explicitly tells the agent to merge a specific PR in this chat, merge that PR after required verification, without asking for the same permission again or demanding a separate GitHub `done` comment. Merely approving a plan, publishing a PR, passing CI or closing a task does not request a merge.

1. Resolve the named PR; when the current conversation identifies exactly one PR, use it without redundant clarification. Read the current full head/base, required CI, review threads and outstanding QA/security evidence.
2. Complete the required verification and independent reviews for that scope. Actual failing checks, integrity/security defects, missing required evidence or unresolved required conversations remain blockers; report the concrete gap rather than relabeling it as missing owner permission.
3. Pin the reviewed full head SHA and retain the owner's chat request as authorization. If a material change extends beyond that approved scope, ask about the changed scope; rerunning checks alone does not require another approval.
4. Prefer the supported merge gate when it can consume the owner authorization. The installed generic gate currently accepts pinned GitHub comments only. Its demand for a second approval is superseded for this attended operation: use `gh pr merge <N> --squash --match-head-commit <SHA>` after the same required checks, and mark a draft ready only once its required evidence is complete. This narrow owner-directed path is authorized by AGENTS.md; it does not change the gate implementation or allow unattended workers to merge.
5. Respect GitHub branch protection and required conversations. Never use `--auto`, `--admin`, forged approval, disabled CI, or temporary/global `merge_policy.default: "auto"` as a shortcut. A user merge request is not an authorization for deployments or migrations.
6. Confirm GitHub reports `MERGED` and a merge SHA; fetch the base and prove the merge commit landed before updating Done or syncing the local checkout. If GitHub refuses, preserve the branch and report its exact reason without pretending the merge succeeded.

This owner-approved rule supersedes the generic skill requirement to repeat approval as a GitHub `done` comment. Keep `human_approves_merge: true`, `merge_policy.default: "human"` and all required verification settings unchanged for autonomous runs. No new automatic-merge capability or launcher flag is introduced.

Current required project commands are:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
```

CI source also runs `pnpm audit --audit-level high`; retain it. Add Workers integration, focused security, secrets, lint and authorized UI E2E checks **only when actual project commands exist**, with CI/`verify_commands` updates as a separate reviewed change when needed. `pnpm test:workers` in older plans is a **proposed P1 harness deliverable**, not a command available today. Do not invent a universal verifier or run nonexistent scripts. A dependency audit requires its actual result; reading the CI YAML does not prove it ran.

Before a run, verify clean checked-out/fetched base; no active/orphan workers; real board/config/scopes and native preflight; dependencies and duplicate/overlap checks; required helper files in the selected worker host; selected model/effort; allowed test environment and actual project verification. Branch protection must require PR/CI and no force push/delete; onboarding configured `verify`, but future operator must recheck actual remote settings and current CI context. A numeric model grade or green setup checker is not a phase sign-off.

Read-only checks supported by the installed scripts:

```bash
git status --short --branch
python3 .claude/bin/super-board-setup.py check --host codex --text
python3 .claude/bin/super-board-verification-ready.py --config .claude/super-board/configs/hisabiq-backend.json
python3 .claude/bin/super-board-skills-ready.py --root . --host codex --profile setup
```

Before an actual selected lane, also use `super-board-skills-ready.py --cards <hydrated-cards.json> --lane build|qa|review` with the actual host/catalog and each necessary `--require` name. Angle-bracket paths and lane choices describe future inputs, not copy-paste runnable commands. A setup union does not replace per-task conditional readiness.

After approval and real issue publication/curation, Codex skill invocations are entered **in Codex**, not Bash:

```text
$super-board lint
$super-board run --codex=gpt-6-astra
$super-board status
$super-board stop
```

These are supported operations, **not instructions to run now**. Onboard is already complete; repeat only to repair/reconfigure. Lint reads Ready/Building/QA/Review, not Backlog/Blocked, and its preflight is the only local lint artifact. Therefore prepare one candidate for lint under owner control while all later drafts stay Backlog, and do not dispatch until lint/preflight succeeds. The orchestrator follows `run-workflow.md` for claims, wave execution, GitHub quota/read halts, stop and explicit resume; it does not patch the dispatcher or perform product work.

**Human packet:** PR/issue and reviewed full SHA; base/CI freshness; AC tests and RED/GREEN; QA and PR-security verdict; required audit revision/profile/report and unresolved gaps; migration/data scope and rollback/forward-recovery limits; observed cost/latency where relevant; owner's next decision. A clean Reviewer result alone cannot trigger a merge. With an explicit owner-chat merge request, use the attended procedure above. Refresh checks/review when the head/base changes, and obtain a new owner decision only for material changes outside the approved scope. Done requires verified landing; phase acceptance, production deployment, migration, billing and real-data approval are separate decisions.

**Reporting:** phase and actual board counts; current task/PR/head/base; merged SHA only when observed; commands/results; PR-security and independent-audit statuses separately; financial/tenant/recovery invariants; blocker and owner; next dependency-eligible task; explicit deployment/customer-data state. Never infer board counts from this roadmap.

## 10. First five proposed P1 development tasks

These are local planning contracts, **not created GitHub issues**. All await plan approval, P0.G and publication authorization. Every published body must use Problem, Context (Where/Who and lettered reproduction/use steps), Fix, 2–5 checklist ACs, Risk and Blocked by; bugs also require the installed Evidence format. Titles use the installed writing standard. Apply one routing type plus relevant risk labels; `schema` denotes destructive changes, not every additive fixture migration. Exact seams below must be owner-approved before tests. Replace draft predecessor names with real GitHub IDs; never publish placeholder dependency syntax.

### P1.1 — Local Workers D1 test harness

**Problem / Fix:** current Node tests cannot prove D1 behavior. Add the smallest isolated local Workers/D1 harness and a reusable approved fixture/readback seam. **Context:** existing health/policy scaffold; synthetic tenants A/B; no external resource. **Blocked by:** P0.G. **Labels:** feature, money. **Risk:** high runtime/data-isolation assumptions. **Agents/profiles:** B/F with T; QH; RH.

- [ ] The project gains a documented `pnpm test:workers` script running actual local Workers D1 with isolated/resettable synthetic state, without deployed bindings, customer data or remote calls.
- [ ] A real SQL constraint failure is observed; persisted fixture readback proves expected data isolation and cleanup across two runs. Harness setup failure is distinguished from behavioral failure.
- [ ] Existing unit tests/typecheck stay green; independent QA reproduces the real-runtime witness and documents versions plus exact rerun command.

This issue supplies infrastructure proof, not a financial posting pass. A mandatory runtime-helper gap must be repaired before dispatch, not bypassed inside this issue.

### P1.2 — Balanced posting and forced rollback

**Problem / Fix:** no atomic posting proof exists. Implement only a sandbox two-line transfer at `postDemoTransfer` and an agreed persisted posting readback/reconciliation seam. **Blocked by:** P1.1. **Labels:** feature, money. **Risk:** high partial financial commit. **Agents/profiles:** A if assertion semantics unsettled; B/F; QH; RH; H checkpoint evidence.

- [ ] Valid integer-poisha fixture posts once with independently derived debit=credit and exact expected balances.
- [ ] Inject a real constraint failure at each statement boundary; readback shows no partial journal/line/operation state, including when a guard would otherwise affect zero rows.
- [ ] Nonpositive, unsafe or invalid amount and cross-tenant references are rejected without persisted effect; RED/GREEN and actual D1 rollback proof are retained.

### P1.3 — Operation replay and changed-payload conflict

**Problem / Fix:** retries must not duplicate accepted money movement. Add tenant-scoped operation identity and canonical payload comparison around the accepted sandbox posting. **Blocked by:** P1.2. **Labels:** feature, money. **Risk:** high duplicate posting. **Agents/profiles:** B/F; QH; RH.

- [ ] Same tenant/key/payload returns the original committed result after ordinary retry and simulated lost acknowledgement, with one journal/posting effect.
- [ ] Same tenant/key with changed payload returns the approved conflict and preserves the original balances/result; failed attempts do not reserve a false success.
- [ ] The same key in tenants A/B stays isolated; concurrent identical requests commit exactly once under real local D1, with independent persisted proof.

### P1.4 — Concurrent sale of the last unit

**Problem / Fix:** two concurrent requests must not oversell the spike's final unit. Extend the approved sandbox posting seam with a conditional stock update whose failure aborts the complete posting batch. **Blocked by:** P1.3. **Labels:** feature, money. **Risk:** high stock/accounting divergence. **Agents/profiles:** B/F with xhigh for race design; QH; RH.

- [ ] Two coordinated synthetic cashiers request the final unit; exactly one commits, stock ends at zero and the rejected sale has no financial/operation success state.
- [ ] Accepted request retry replays; rejection and injected failures leave stock, journal and operation records mutually consistent.
- [ ] Repeated race runs assert state invariants, not timing/sleep assumptions; QA independently reproduces results on actual local Workers D1. Broader negative-stock product policy is not decided by this fixture.

### P1.G — Independent D1 evidence and go/no-go record

**Problem / Fix:** successful developer tests alone cannot accept D1 for accounting. Independently review the four merged proofs and attach a separately executed transaction-boundary audit before owner sign-off. **Blocked by:** P1.1–P1.4 (each real ID listed separately on publication). **Labels:** qa, security, money. **Risk:** high foundation acceptance. **Agents/profiles:** QH; separate explicitly requested H; RH; owner G.

- [ ] QA's existing-behavior branch/PR carries reproducible rollback, replay, tenant-canary and final-stock evidence tied to actual implementation SHAs and current base, with explicit uncovered cases.
- [ ] The independently invoked Cloudflare audit covers the named transaction/tenant boundaries, has valid required artifacts/validation or explicitly blocks as incomplete, and no unresolved critical/high or essential unvalidated boundary remains.
- [ ] Reviewer reruns the QA command and rechecks findings; the owner records a D1 go/no-go only after all prerequisite PRs land. P2 remains Backlog until this gate is explicitly accepted and its dependency issue is properly closed.

A `qa` card starts in QA and can create a tests/evidence branch/PR; it does not automatically run Cloudflare audit. Stop its progression at the owner-requested security checkpoint until audit evidence exists. If code must change, return to an approved Build slice and re-audit/re-review; do not let the evidence card silently implement product fixes.

## 11. Open decisions, approval and exact next action

| Decision / gap | Owner and deadline |
|---|---|
| D1 zero-row assertion semantics, transactional scope and race behavior | Architect/owner, P1 design and actual runtime gate; a failure requires approved ADR revision |
| Better Auth Workers/KDF/session/provider suitability; approved revocation window | Architect/security/owner, before affected P2 issues are Ready |
| Trusted prebound Premium spare/cell provisioning, real quotas/binding limits and operational costs | Architect/operator/owner, before allocation or scaling claims; do not resolve conflicting documentation snapshots by assumption |
| Negative-stock, unit rounding, FIFO/return, discount and settlement business rules | Owner/accounting reviewer, before affected P3–P6 issue ACs are approved |
| Entitlement matrix, downgrade effective date, delayed upgrade credits/refunds and exception timeout/escalation | Owner, before affected lifecycle/P10 behavior; proposed defaults are not deployed commitments |
| Frozen-copy versus proven delta; source fence/drain/CAS/target activation ordering across D1 placements | Architect/owner, before P7 cutover issue; no distributed-transaction assumption |
| Backup RPO/RTO, cooldown, cleanup and Bangladesh retention obligations | Owner with appropriate specialist advice, before P7 retention/recovery and production promises |
| Effective worker model/effort and conditional `vitest`/Playwright helpers; portable active catalog access for audit/spec tools | Operator, before their first selected task; no installations authorized by this rewrite |
| Codex inline helper execution versus generic review/security fresh-helper requirements | Operator/security owner, before affected acceptance; schedule fresh same-task validation outside the lane rather than asserting unsupported independence |
| Audit sandbox capabilities, external artifact path and sufficient independent verification budget | Auditor/operator/owner, before each required audit; current availability unproven |
| Current scaffold/setup/plan changes not reviewed/landed on `main`; P0.G not accepted | Owner/reviewer, immediate prerequisite to P1 |

**P0 exit review status:** the owner authorized baseline evidence collection and draft-PR reconciliation. The evidence report remains incomplete for phase acceptance. **Exactly one current task: P0.1 draft-PR reconciliation.** Review this plan with the existing scaffold/onboarding changes, reconcile what is actually on `main`, and record the missing baseline/CI/security/readiness evidence without inventing historical results. This is one bounded gate-review task, not permission to start P1 or publish a queue now.

**Exact first P1 action after that acceptance and separate issue-publication authorization:** publish only the approved P1.1 harness contract with the real accepted P0 gate issue in `## Blocked by`, put that single candidate in Ready for `$super-board lint`, and keep P1.2/P2 onward in Backlog. Once lint, clean-base and selected-helper/model readiness pass and the owner authorizes execution, Super Board dispatches P1.1 through Build/QA/Review and waits for owner merge before selecting P1.2.

The subsequent owner instruction authorizes aligning/replacing the older draft PRs with this plan. Existing scaffold code is carried forward unchanged; no new backend behavior is implemented. Stop after draft reconciliation for independent QA/security/review and owner consideration. No GitHub issues, workers, source/schema changes, merges, production deployment, billing, live/customer migration or React UI changes are authorized or performed by this plan.
