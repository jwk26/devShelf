# Repository Guidelines

## Common Rules
- **Important:** No code changes until explicit approval when planning.
- **Important:** Always read `docs/EXECUTION_PLAN.md` first to find the current task.

## Documentation Reading Order

1. `docs/EXECUTION_PLAN.md` — What to work on now (check status checkboxes)
2. `docs/SPEC.md` — Architecture, routes, page layouts
3. `docs/DESIGN_TOKENS.md` — How things should look (CSS variables, Tailwind classes, component patterns)
4. `docs/SCHEMA.md` — Database tables, RLS policies
5. `docs/PRD.md` — What we're building and what we're NOT building
6. `docs/DESIGN_AUDIT.md` — Reference: what codeshelf-nextjs actually did (for context, not as a spec)

## Project Structure & Module Organization

- `src/app/` — Next.js App Router pages and server actions (`src/app/actions/*`)
- `src/components/` — UI and feature components (series, post-detail, dashboard, admin, shared, ui, search, archive)
- `src/hooks/` — Reusable React hooks (useAutoSave, useActiveSection, useScrollProgress, useFocusTrap)
- `src/lib/` — Domain utilities (supabase clients, design-tokens helpers, validation)
- `src/types/` — Shared TypeScript types (supabase.ts for DB, index.ts for frontend)
- `src/context/` — React contexts (SearchContext)
- `supabase/` — SQL migrations
- `tests/` — Playwright specs
- `public/` — Static assets
- `docs/` — Project documentation (PRD, SPEC, SCHEMA, DESIGN_TOKENS, EXECUTION_PLAN)

## Build, Test, and Development Commands

- `pnpm dev` — start local Next.js dev server
- `pnpm build` — production build
- `pnpm lint` — run ESLint
- `pnpm typecheck` — run TypeScript checks (`tsc --noEmit`)
- `pnpm test:e2e` — run Playwright E2E tests

## Coding Style & Naming Conventions

- Language: TypeScript (`strict`), React function components, Next.js App Router
- Style: 2-space indentation, single quotes, minimal semicolons
- Path alias: `@/` for all imports (never deep relative paths)
- Naming:
  - Components: `PascalCase` (e.g., `PostEditor.tsx`)
  - Hooks: `useXxx` (e.g., `useAutoSave.ts`)
  - Utilities/actions: `camelCase`
  - Tests: `feature-name.spec.ts`

## Design System Rules

- **Never use raw hex codes.** All colors through CSS variables via Tailwind semantic classes.
- **Never use raw `stone-*` or default Tailwind `orange-*`.** Use `bg-background`, `text-muted-foreground`, `text-orange-500` etc. which are wired to CSS variables.
- **Two fonts only:** `font-serif` (Playfair Display) for headings, `font-sans` (Pretendard, default) for everything else. No `font-mono`.
- **Metadata labels:** Use `text-meta-base` / `text-meta-sm` / `text-meta-xs` / `text-meta-md` with `tracking-label` or other tracking tokens. Uppercase.
- **Component patterns:** See Component Usage Quick Reference in `docs/DESIGN_TOKENS.md`.

## Key Patterns

- **ActionResult<T>:** All server actions return `{ data, error? }`. Use `ok()`, `fail()`, `okSuccess()`, `failSuccess()` from `actions/result.ts`.
- **Two-type system:** DB flat shape in `types/supabase.ts`, frontend nested shape in `types/index.ts`. Each page has local `transformPost()` to convert.
- **Shadow drafts:** Editing published posts writes to `shadow_*` columns. Live content untouched until explicit publish.
- **Auto-save:** Hybrid local (1s debounce) + remote (5s debounce, 90s force). Change score minimizes spurious saves.

## Testing Guidelines

- Framework: Playwright (`@playwright/test`)
- Keep tests deterministic; avoid network-dependent assertions where possible
- Run before PR: `pnpm lint && pnpm typecheck && pnpm build`

## Commit & Pull Request Guidelines

- Conventional commits: `fix(editor): prevent discard from deleting checkpoints`
- Keep commits scoped to one concern
- Never include AI attribution/watermark lines in commit messages

## Security & Configuration

- Keep secrets in `.env.local` only; never commit secrets
- Supabase RLS enforces data access — don't rely on UI-only guards
- All server actions validate ownership via RLS (no manual admin checks)
