# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CodeShelf — a developer publishing platform with bookshelf metaphor. Next.js 16 App Router + Supabase + Tailwind CSS + Shadcn/ui.

## Documentation Map

- **What we are building:** `docs/PRD.md`
- **How it's structured:** `docs/SPEC.md` (tech stack, routes, page layouts, architecture decisions)
- **Data blueprint:** `docs/SCHEMA.md` (tables, RLS policies, triggers)
- **Design system:** `docs/DESIGN_TOKENS.md` (CSS variables, Tailwind config, font loading, component usage)
- **Design alignment:** `docs/DESIGN_ALIGNMENT.md` (gap analysis vs codeshelf-nextjs, target patterns for each page)
- **Current progress:** `docs/EXECUTION_PLAN.md` (task list with status checkboxes)
- **Audit reference:** `docs/DESIGN_AUDIT.md` (findings from codeshelf-nextjs codebase audit)
- **Canonical SQL:** `supabase/migrations/*`

**Guideline:** Always check `docs/EXECUTION_PLAN.md` first to see the current task before starting work.

## Build Commands

```bash
pnpm install          # install dependencies
pnpm dev              # dev server
pnpm build            # production build
pnpm lint             # run ESLint
pnpm typecheck        # tsc --noEmit
pnpm test:e2e         # Playwright E2E tests
```

**Pre-PR gate:** `pnpm lint && pnpm typecheck && pnpm build`

## Key Architecture Rules

- Server Components by default. Client Components only for: editor, dark mode toggle, search modal, bookshelf interactions, mobile nav, publish modal.
- No API routes. Use Server Actions for mutations.
- Supabase RLS is the auth layer. Middleware only protects route access (`/dashboard`, `/write`, `/edit/*`, `/settings`).
- Author-owns-their-content model. No admin role. RLS: `auth.uid() = author_id`.
- All server actions return `ActionResult<T>` via `ok()` / `fail()` helpers. Check `.error` before `.data`.
- Two-type system: flat DB types (`types/supabase.ts`) ↔ nested frontend types (`types/index.ts`). Transform at page boundary.
- Shadow draft system: edits write to `shadow_*` columns. Live content untouched until explicit publish.
- Use Shadcn semantic classes (`bg-background`, `text-muted-foreground`, `text-orange-500`). Never hardcode hex values. All colors through CSS variables.
- Two fonts only: Playfair Display (serif, headings) + Pretendard Variable (sans, everything else). No mono font.
- `--radius: 0.5rem` for rounded-lg default. `rounded-full` preserved for pills/avatars.

## Key Paths

| Path | Purpose |
|------|---------|
| `src/lib/supabase/server.ts` | Supabase server client |
| `src/lib/supabase/client.ts` | Supabase browser client |
| `src/lib/supabase/middleware.ts` | Session refresh helper |
| `src/middleware.ts` | Route protection |
| `src/app/actions/` | Server Actions (posts, series, categories, tags, profile) |
| `src/app/actions/result.ts` | ActionResult<T> helpers |
| `src/types/index.ts` | Frontend types (nested shape) |
| `src/types/supabase.ts` | Database types (flat shape) |
| `src/components/` | Shared components |
| `src/hooks/` | Custom hooks (useAutoSave, useActiveSection, useScrollProgress, useFocusTrap) |
| `src/lib/design-tokens.ts` | Helper functions (generateBookDimensions, formatCharacterCount) |
| `src/app/globals.css` | CSS variables (design tokens) |
| `tailwind.config.ts` | Tailwind configuration |

## Coding Conventions

- 2-space indent, single quotes, minimal semicolons
- `@/` path alias for all imports
- Server Components by default; `'use client'` only when needed
- Functional components with named exports
- Interfaces for object shapes, types for unions
- Hooks: `useXxx`, Components: `PascalCase`, Utils/actions: `camelCase`, Tests: `feature-name.spec.ts`
- Conventional commits: `fix(editor):`, `feat(search):` — no AI attribution in commits
- pnpm as package manager

## Architecture Learnings (from workspace2)

- Next.js 16: `params` and `searchParams` are `Promise<{...}>` in App Router server entries. Always await before reading.
- Supabase nested join casts need `as unknown as TargetType` when TypeScript overlap checks reject direct cast.
- EasyMDE: do not use `dynamic({ ssr: false })` in Server Components. Import the client component normally and guard browser-only setup in `useEffect`.
- Supabase join types: profile joins often type as arrays even when runtime response is singular. Normalize via `normalizePost()` pattern.
- Shadcn init overwrites `globals.css`. Always restore CSS variables after running `shadcn init` or `shadcn add`.
- `resolvedTheme` (not `theme`) for dark mode toggle condition. `theme` returns `"system"`.

## Navigation

This repo uses folder-level `README.md` files. When changing a folder's contracts, update its README in the same commit. See `docs/README_PATTERN.md` for template.
