# EXECUTION PLAN — CodeShelf

> **Guideline:** Check this file first to see the current task before looking into other docs.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

---

## Phase 1: Foundation

### Task 1: Scaffold Next.js Project
- **Status:** `[ ]`
- **Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`
- **Actions:**
  - `pnpm create next-app@latest` with TypeScript, Tailwind, App Router, src directory
  - Install all dependencies per `docs/SPEC.md` tech stack
  - Configure path alias `@/` in tsconfig
- **Acceptance:** `pnpm build` passes, dev server starts
- **Commit:** `feat: scaffold Next.js 16 project with dependencies`

### Task 2: Configure Design Tokens + Tailwind
- **Status:** `[ ]`
- **Files:** `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`
- **Actions:**
  - Copy CSS variables from `docs/DESIGN_TOKENS.md` into `globals.css`
  - Copy Tailwind config from `docs/DESIGN_TOKENS.md`
  - Wire fonts per Font Loading section: Playfair via `next/font/google`, Pretendard via CDN
  - Follow the single wiring chain: CSS variable → Tailwind config → component class
  - Verify dark mode variables are present in `.dark` block
- **Acceptance:** `pnpm build` passes. Token classes resolve: `bg-background` (warm off-white), `text-muted-foreground` (stone-500), `text-orange-500` (accent), `text-meta-base` (11px), `tracking-label` (0.2em), `font-serif` (Playfair), `max-w-reading` (850px)
- **Commit:** `feat: configure design tokens, Tailwind, and fonts`

### Task 3: Initialize Shadcn/ui
- **Status:** `[ ]`
- **Files:** `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`
- **Actions:**
  - `pnpm dlx shadcn@latest init` — select Radix base (not base-nova)
  - Add base components: button, input, textarea, label, separator, dialog, dropdown-menu
  - **Critical:** Verify `globals.css` not overwritten by init — restore CSS variables if needed
  - Remove `@import "tw-animate-css"` and `@import "shadcn/tailwind.css"` if added (incompatible with Tailwind v3)
- **Acceptance:** Button renders with `--radius: 0.5rem` (rounded-lg). Dark mode class toggles correctly.
- **Commit:** `feat: initialize Shadcn/ui with base components`

### Task 4: Supabase Schema + RLS
- **Status:** `[ ]`
- **Files:** `supabase/migrations/00001_initial_schema.sql`
- **Actions:**
  - Write SQL per `docs/SCHEMA.md` — all 6 tables, indexes, RLS policies
  - Key difference from codeshelf-nextjs: `author_id` on posts/series, ownership-based RLS, `profiles` table
  - Seed categories: API, DOCS, LIB, TOOL, DEV, CLOUD, DATA
  - Add triggers: profile auto-creation, updated_at
  - Apply via Supabase dashboard SQL editor or `supabase db push`
- **Acceptance:** All tables created, RLS policies active, trigger creates profile on signup
- **Commit:** `feat: add Supabase schema, RLS policies, and triggers`

### Task 5: Supabase Client Helpers
- **Status:** `[ ]`
- **Files:** `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/middleware.ts`, `src/middleware.ts`, `.env.local`
- **Actions:**
  - Create server/client/middleware Supabase helpers per `@supabase/ssr` docs
  - Middleware: protect `/dashboard`, `/write`, `/edit/*`, `/settings` — redirect to `/login?returnUrl=<path>`
  - Middleware: refresh Supabase session on every request
- **Acceptance:** `pnpm build` passes, protected routes redirect to `/login`
- **Commit:** `feat: add Supabase client helpers and auth middleware`

---

## Phase 2: Auth

### Task 6: Login Page + OAuth
- **Status:** `[ ]`
- **Files:** `src/app/login/page.tsx`, `src/app/login/login-form.tsx`, `src/app/auth/callback/route.ts`
- **Actions:**
  - Server component checks if logged in (redirects to `/`)
  - Client form with Google + GitHub buttons via `supabase.auth.signInWithOAuth`
  - Google button uses brand colors (#4285F4, #34A853, #FBBC05, #EA4335)
  - Callback route exchanges code for session, redirects to `returnUrl` or `/`
  - **Note from codeshelf audit:** Next.js 16 `searchParams` are Promises — always await
- **Acceptance:** OAuth flow completes, profile auto-created, user redirected
- **Commit:** `feat: add login page with Google/GitHub OAuth and callback`

### Task 7: Settings Page
- **Status:** `[ ]`
- **Files:** `src/app/settings/page.tsx`, `src/app/settings/settings-form.tsx`, `src/app/actions/profile.ts`
- **Actions:**
  - Server component loads profile, client form for editing
  - Fields: username, display name, bio, website
  - Avatar from OAuth (read-only display)
  - Username validation: lowercase, alphanumeric + hyphens, 3-30 chars, unique
  - `updateProfile` server action with Zod validation
- **Acceptance:** Can update profile fields. Username uniqueness enforced.
- **Commit:** `feat: add settings page with profile form`

---

## Phase 3: Core Components

### Task 8: Layout Shell — Header, Nav, Dark Mode Toggle
- **Status:** `[ ]`
- **Files:** `src/components/site-header.tsx`, `src/components/theme-toggle.tsx`, `src/components/theme-provider.tsx`, `src/components/user-nav.tsx`, `src/app/layout.tsx`
- **Dependencies:** Install `next-themes`
- **Actions:**
  - ThemeProvider wrapping app with `attribute="class"`, `defaultTheme="system"`
  - Header: logo (font-serif) + nav links (Series, Archive) + search trigger + UserNav + ThemeToggle
  - UserNav: avatar + write link when logged in, "Sign in" when not
  - ThemeToggle: use `resolvedTheme` (not `theme`) for condition — `theme` returns "system"
  - **Note from workspace2:** Dual-icon CSS animation (scale-0/scale-100 + rotate) instead of mounted state check
- **Acceptance:** Header renders, dark mode toggles, nav shows auth state
- **Commit:** `feat: add site header, dark mode toggle, and user nav`

### Task 9: Mobile Nav
- **Status:** `[ ]`
- **Files:** `src/components/mobile-nav.tsx`, `src/components/site-header.tsx`
- **Actions:**
  - Hamburger menu on mobile (`md:hidden`), full nav on desktop (`hidden md:flex`)
  - Focus trap with Tab/Shift-Tab cycling (use `useFocusTrap` hook)
  - Close on Escape
  - Use `transition-[transform,opacity]` not `transition-all`
- **Acceptance:** Nav collapses to hamburger on mobile, all links accessible, focus trapped
- **Commit:** `feat: add responsive mobile navigation`

### Task 10: Shared Components — TagBadge, Skeleton, ModalWrapper
- **Status:** `[ ]`
- **Files:** `src/components/shared/tag-badge.tsx`, `src/components/ui/skeleton.tsx`, `src/components/ui/modal-wrapper.tsx`, `src/hooks/useFocusTrap.ts`
- **Actions:**
  - TagBadge: `rounded-full` pill, orange hover, `tracking-label`, multiple variants (default, outline, ghost, active)
  - Skeleton: `animate-pulse` with `motion-reduce:animate-none`
  - ModalWrapper: focus trap, Esc close, backdrop click, portal rendering
  - useFocusTrap hook from codeshelf (well-implemented, keep as-is)
- **Acceptance:** Components render with correct token classes in both light/dark
- **Commit:** `feat: add TagBadge, Skeleton, and ModalWrapper components`

---

## Phase 4: Public Pages

### Task 11: Homepage — Bookshelf View
- **Status:** `[ ]`
- **Files:** `src/app/page.tsx`, `src/components/series/bookshelf.tsx`, `src/components/series/bookshelf-skeleton.tsx`, `src/lib/design-tokens.ts`
- **Actions:**
  - Server component fetches all series with post counts + author info
  - Bookshelf component: dynamic book dimensions via `generateBookDimensions()` helper
  - Auto-rotating preview cycles through series
  - "Recent" indicator computed from series `updated_at` (not stored flag)
  - Category badges on book spines
  - `prefers-reduced-motion` support — disable auto-rotation
  - **Improve from codeshelf:** Korean-aware title width calculation (keep `hasKorean()` helper)
- **Acceptance:** Bookshelf renders with dynamic books, auto-rotates, shows recent indicator
- **Commit:** `feat: add homepage with interactive bookshelf view`

### Task 12: Series Detail Page
- **Status:** `[ ]`
- **Files:** `src/app/series/[slug]/page.tsx`, `src/lib/queries.ts`
- **Actions:**
  - Create shared queries module for reusable Supabase queries
  - Series header: title (font-serif), description, category, post count, character total
  - Post list ordered by `series_order`
  - Each post: title, excerpt, metadata labels (text-meta-base, tracking-label)
- **Acceptance:** `/series/[slug]` shows series with all posts in order
- **Commit:** `feat: add series detail page with post listing`

### Task 13: Post Detail Page
- **Status:** `[ ]`
- **Files:** `src/app/series/[seriesSlug]/[postSlug]/page.tsx`, `src/app/post/[slug]/page.tsx`, `src/components/post-detail/post-detail-layout.tsx`, `src/components/post-detail/article-content.tsx`, `src/components/post-detail/table-of-contents.tsx`, `src/components/post-detail/series-navigation.tsx`
- **Actions:**
  - Markdown rendering: `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-sanitize`
  - **Improve from codeshelf:** Replace regex-based MarkdownPreview with react-markdown (audit flagged XSS risk)
  - 2-column layout: sidebar (sticky, metadata + TOC + series nav) + article (prose, max-w-reading)
  - **Improve from codeshelf:** Integrate `useActiveSection` hook with TableOfContents (audit flagged incomplete integration)
  - `useScrollProgress` hook for reading progress
  - generateMetadata for SEO (title, description, OpenGraph)
- **Acceptance:** Markdown renders with syntax highlighting, 2-col layout on lg+, TOC highlights active section
- **Commit:** `feat: add post detail page with 2-column layout and markdown rendering`

### Task 14: Archive Page
- **Status:** `[ ]`
- **Files:** `src/app/archive/page.tsx`, `src/components/archive/archive-sidebar.tsx`, `src/components/archive/archive-post-list.tsx`
- **Actions:**
  - Sidebar on `bg-background-sidebar`: category filter, tag filter, sort options
  - Post list with pagination (NOT infinite scroll)
  - **Improve from codeshelf:** Replace `InfinitePostList` with paginated `ArchivePostList`
- **Acceptance:** `/archive` shows filtered, paginated posts. Sidebar filters work.
- **Commit:** `feat: add archive page with filtering and pagination`

---

## Phase 5: Protected Pages

### Task 15: Dashboard
- **Status:** `[ ]`
- **Files:** `src/app/dashboard/page.tsx`, `src/components/dashboard/dashboard-client.tsx`, `src/components/dashboard/content-list-panel.tsx`, `src/components/dashboard/preview-pane.tsx`
- **Actions:**
  - Server component fetches user's posts, series, stats
  - Two-panel layout: content list (searchable, sortable) + preview pane (markdown headings outline)
  - Stats: draft count, published count, series count
  - Quick actions: edit, delete, publish draft
  - **Improve from codeshelf:** Add meaningful insights beyond raw counts
- **Acceptance:** Dashboard shows user's content with search, sort, preview
- **Commit:** `feat: add dashboard with content management panels`

### Task 16: Write Page — New Post Editor
- **Status:** `[ ]`
- **Files:** `src/app/write/page.tsx`, `src/components/admin/post-editor.tsx`, `src/components/admin/markdown-editor.tsx`, `src/components/admin/publish-modal.tsx`, `src/app/actions/posts.ts`
- **Actions:**
  - Server Actions: `createPost` (slug generation, excerpt auto-generation, tag upsert)
  - PostEditor client component with EasyMDE (dynamic import, no SSR)
  - **Note from workspace2:** Don't wrap `"use client"` component in `dynamic({ ssr: false })` — guard browser-only code in `useEffect`
  - PublishModal: 2-column (form + OG preview), category/tag autocomplete, series picker with inline creation
  - Redirect to `/settings` if user has no username (needed for post URL)
  - All actions use `ActionResult<T>` pattern
- **Acceptance:** Can create a post with title, content, tags, category, series. Post appears on homepage/archive.
- **Commit:** `feat: add write page with markdown editor and publish modal`

### Task 17: Edit Page — Shadow Draft System
- **Status:** `[ ]`
- **Files:** `src/app/edit/[id]/page.tsx`, `src/app/actions/posts.ts`, `src/hooks/useAutoSave.ts`, `src/lib/checkpoint.ts`
- **Actions:**
  - Load existing post (verify ownership via RLS)
  - Reuse PostEditor with initial values
  - Shadow draft: writes to `shadow_title`/`shadow_content`/`shadow_updated_at`
  - Auto-save: hybrid local (1s) + remote (5s, 90s force) with change score
  - Checkpoint: localStorage crash recovery (3-day window for unsaved drafts)
  - Traffic light indicator: synced/saving/error
  - Exit confirmation modal if unsaved changes
  - `updatePost` and `deletePost` server actions
  - Publish action: atomic swap shadow → live
- **Acceptance:** Can edit post with auto-save. Shadow draft doesn't affect live. Publish swaps atomically. Checkpoint recovers after crash.
- **Commit:** `feat: add edit page with shadow drafts, auto-save, and crash recovery`

---

## Phase 6: Features

### Task 18: Search Modal
- **Status:** `[ ]`
- **Files:** `src/components/search/search-modal.tsx`, `src/components/search/search-modal-host.tsx`, `src/context/search-context.tsx`
- **Actions:**
  - Cmd/Ctrl+K keyboard shortcut to open
  - Search across posts, series, tags
  - Client-side filtering (sufficient at our scale)
  - Results grouped by category
  - Focus trap, Esc to close
- **Acceptance:** Search modal opens with keyboard shortcut, finds content, navigates on selection
- **Commit:** `feat: add search modal with keyboard shortcut`

### Task 19: Series Management
- **Status:** `[ ]`
- **Files:** `src/app/actions/series.ts`, `src/components/dashboard/series-create-modal.tsx`, `src/components/dashboard/series-edit-modal.tsx`
- **Actions:**
  - Server actions: create, update, delete series (ownership-based)
  - **Improve from codeshelf:** Add dedicated series edit modal in dashboard (codeshelf only had series picker in publish modal)
  - Series creation inline from publish modal (keep from codeshelf)
- **Acceptance:** Can create, edit, delete series from dashboard. Can assign posts to series.
- **Commit:** `feat: add series management with create and edit modals`

---

## Phase 7: Polish

### Task 20: SEO Metadata
- **Status:** `[ ]`
- **Files:** `src/app/series/[slug]/page.tsx`, `src/app/series/[seriesSlug]/[postSlug]/page.tsx`, `src/app/post/[slug]/page.tsx`, `src/app/layout.tsx`
- **Actions:**
  - `generateMetadata` on post detail and series pages
  - OpenGraph tags (title, description, type)
  - Root layout metadata (site title, description, keywords)
  - `<meta name="theme-color">` responsive to dark mode
- **Acceptance:** Page titles and descriptions correct, OG tags present in HTML
- **Commit:** `feat: add SEO metadata to post and series pages`

### Task 21: E2E Tests
- **Status:** `[ ]`
- **Files:** `playwright.config.ts`, `tests/e2e-critical-flows.spec.ts`
- **Actions:**
  - Configure Playwright
  - Tests: homepage loads with bookshelf, archive page loads, login page loads, protected routes redirect, dark mode toggles, search modal opens
- **Acceptance:** `pnpm test:e2e` passes
- **Commit:** `feat: add Playwright E2E tests for critical flows`

### Task 22: Finalize CLAUDE.md + AGENTS.md
- **Status:** `[ ]`
- **Files:** `CLAUDE.md`, `AGENTS.md`
- **Actions:**
  - Update CLAUDE.md with verified build commands, key paths, architecture summary
  - Update AGENTS.md with verified project structure
  - Ensure a new Claude Code session can orient using CLAUDE.md alone
- **Acceptance:** Fresh Claude Code session can understand project from CLAUDE.md
- **Commit:** `docs: finalize CLAUDE.md and AGENTS.md with project context`

---

## Cross-Cutting Concerns

These apply across all phases:

- **Design tokens:** Use semantic classes (`bg-background`, `text-muted-foreground`, `text-orange-500`) from `DESIGN_TOKENS.md`. Never hardcode hex values. Never use raw `stone-*` or `orange-*` Tailwind defaults — always go through CSS variables.
- **ActionResult pattern:** All server actions return `ActionResult<T>`. Use `ok()` / `fail()` helpers.
- **Two-type system:** DB types in `types/supabase.ts`, frontend types in `types/index.ts`. Transform at page boundary.
- **Accessibility:** `prefers-reduced-motion`, focus traps on modals, skip-to-main link, `aria-labels` on interactive elements.
- **Responsive:** Test at sm, md, lg, fhd minimum. Use breakpoint tokens from DESIGN_TOKENS.md.
- **Error boundaries:** Add `error.tsx` at route group level. Server actions return errors via `ActionResult`, not thrown exceptions.
