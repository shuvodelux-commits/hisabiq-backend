# Backend development rules

Read `docs/superpowers/plans/2026-11-01-greenfield-backend-foundation.md` for **technical architecture and phase gates**, and `docs/super-board/hisabiq-execution-plan.md` for **Super Board issue/agent/skill routing**. Super Board is the only task orchestrator: plan and approve scope first, curate and lint GitHub issues, then Super Build (test RED→GREEN), independent Super QA (including `pr-security-review`), and Super Review. Cloudflare `security-audit` is a separate, intentionally invoked gate at high-risk milestones; never claim installation equals execution. Apply the simplest safe Ponytail guidance/fallback; other external specialist skills may supplement the work only after host skill-readiness verification. Preserve `hisabiq_ui` exactly; do not reuse older backend runtime code. No production deployment, PR merge, live migration, billing, or customer-data processing without explicit owner approval. Block on financial integrity, auth, cross-tenant access, restore and migration safety failures.

For backend work through P12, keep `max_workers: 1` and exactly one current task across Build, QA, security checks, Review and owner approval. Keep later tasks in Backlog until the current PR is confirmed merged and its real GitHub dependencies and any phase acceptance gate are satisfied. A worker cap alone does not enforce this rule. Follow `docs/super-board/hisabiq-execution-plan.md` over execution instructions in older migration plans; use those plans for technical requirements only.

<!-- super-board:begin v3.3.0 (managed; edits inside are overwritten on upgrade) -->
## Super Board

Board: Backlog · Ready · Building · QA · Review · Blocked · Done. Labels route: `qa` skips Building · `bug`, `feature`, none → built first.

| When | Use | NEVER |
|---|---|---|
| Set up / repair the board | `/super-board onboard` | DON'T hand-edit config mid-run |
| Check tickets before a run | `/super-board lint` | NEVER run with AC-less tickets |
| Drain the board | `/super-board run` | NEVER build, test or merge from the orchestrator |
| Board state / halt | `/super-board status` · `/super-board stop` | |
| Build one ticket | `/super-build` | NEVER build outside the card's worktree |
| QA a branch, or a live URL alone | `/super-qa` · `/super-qa <url>` | NEVER mark QA pass without evidence |
| Review a PR, merge | `/super-review` | NEVER `gh pr merge` direct — merge gate only |
| Turn Sentry, PostHog, PR problems into tickets | `/super-collect` | DON'T skip the verifier; it hands off to `/to-spec` |
| UI polish | `/ui-refine-loop` (human runs it) | board NEVER runs it |
| Diagram / explainer page | `/visual` | |
| Commit, pull, push this branch | `/git-sync` | NEVER force push or rebase shared history |

| Rule | Value |
|---|---|
| Config | `.claude/super-board/configs/<slug>.json` |
| Isolation | 1 card · 1 worktree · 1 branch |
| Merge | EVERY PR requires explicit owner approval; NEVER auto-merge |
| Migrations | Synthetic local/test D1 only after real commands exist; NEVER staging/live migrations without explicit owner approval |
| Blocked card | block-template comment · last line `blocked-by:` · 🙋 = needs you |
| Secrets | NEVER read `.env`; key names via `.claude/bin/super-board-env-check.sh` |

## Writing (super-board)

| Thing | Format → `.claude/skills/super-board/references/writing-standard.md` |
|---|---|
| Commit, PR title | `<emoji> [type] scope: subject` + short bullets · ✨ feat 🐛 fix 🔧 chore ♻️ refactor 🧪 test 📝 docs |
| PR body | blocks: status · Problem · Solution · AC + proof · history · Before\|After · Risk — `super-board-pr-body.sh` |
| Ticket | Problem · Context · Fix · AC · Risk · Blocked by → `docs/agents/issue-tracker.md` |
| Comment | `[role] [label] status` · Did · ✅ Done · ❌ Not done · Next · ≤ 8 lines |
| PR author notes | file + critical inline review comments: Purpose · What changed · Why it matters → `pr-author-notes.md` |

- NEVER chain steps with arrows. One step per line, lettered under Where.
- NEVER link screenshots. Embed a raw URL pinned to a sha.
- DON'T repeat file lists in status comments. DON'T write "Not verified" or "Next" in a PR body.
<!-- super-board:end -->
