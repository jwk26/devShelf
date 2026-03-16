# Plan: nextjs-codeshelf Documentation Scaffold

## Context

Rebuilding codeshelf-nextjs from scratch using a document-driven workflow. The goal is to reproduce the codeshelf design/functionality with clean architecture and strengthen the developer workflow by testing whether well-structured docs can faithfully drive implementation.

**Key insight:** codeshelf-nextjs was agent-driven without documentation discipline. Its `design-tokens.ts` may not accurately reflect what was actually implemented — agents likely hardcoded values and bypassed the token system. We must audit the real design first, then extract tokens from verified reality.

All design decisions have been made through conversation. This plan covers **documentation creation only** — no implementation code.

---

## Step 1: Comprehensive Audit of codeshelf-nextjs `[CURRENT]`

**Goal:** Fully understand what codeshelf-nextjs actually is — visually and functionally.

### Deliverables
- `docs/DESIGN_AUDIT.md` — Combined audit report with:
  - Part 1: Design token findings (declared vs actually used)
  - Part 2: Feature inventory table (keep/improve/delete)
  - Part 3: Architecture observations

---

## Step 2: Create Project + Initialize Git

- `git init` in `newblog/`
- Confirm `docs/` and `docs/references/` directories exist

---

## Step 3: Write `docs/DESIGN_TOKENS.md`

**Source:** Audit report (Step 1) + screenshots, cross-referenced with `design-tokens.ts` where it matches reality.

**Output format** (follow workspace2 pattern):
- CSS Variable Layer (`:root` and `.dark`)
- `tailwind.config.ts` reference config
- Component Usage Quick Reference

**Key adaptation:** codeshelf raw hex → Shadcn HSL CSS variables
- Stone palette replaces zinc
- Orange accent maps to `--accent` or custom `--accent-orange`
- `--radius` configurable (mixed radii, not sharp-corners-globally)
- Dark mode tokens designed fresh (codeshelf had none)

---

## Step 4: Write `docs/PRD.md`

**Template:** workspace2 PRD structure
- Overview, target users, core features, explicit non-features
- Auth model, scale constraints, design direction

---

## Step 5: Write `docs/SPEC.md`

**Template:** workspace2 SPEC structure
- Tech stack, architecture decisions, route table, page layouts, responsive breakpoints

---

## Step 6: Write `docs/SCHEMA.md`

**Base from:** codeshelf-nextjs Supabase schema, adapted for self-registration
- Remove `is_admin`, `user_profiles` admin checks
- Replace with author-owns-their-content RLS
- Add `profiles` table (auto-created on signup)

---

## Step 7: Write `docs/EXECUTION_PLAN.md`

**Template:** workspace2 execution plan structure
- Phased tasks with status checkboxes
- Features marked "improve" include specific improvement notes

---

## Step 8: Write Root Files

- `CLAUDE.md` — project guide
- `AGENTS.md` — agent guidance
- `docs/README_PATTERN.md` — folder-level README template

---

## Files Created

```
newblog/
├── CLAUDE.md
├── AGENTS.md
├── docs/
│   ├── PLAN.md                  ← this file
│   ├── DESIGN_AUDIT.md          ← Step 1 output
│   ├── DESIGN_TOKENS.md         ← Step 3
│   ├── PRD.md                   ← Step 4
│   ├── SPEC.md                  ← Step 5
│   ├── SCHEMA.md                ← Step 6
│   ├── EXECUTION_PLAN.md        ← Step 7
│   ├── README_PATTERN.md        ← Step 8
│   └── references/              ← screenshots (Step 1)
```

## Reference Files (read-only, from existing projects)

- `workspace/codeshelf-nextjs/` — source codebase being audited
- `workspace2/` — documentation structure templates (PRD, SPEC, SCHEMA, DESIGN_TOKENS, EXECUTION_PLAN)
