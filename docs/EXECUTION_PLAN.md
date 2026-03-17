# EXECUTION PLAN — CodeShelf

> **Guideline:** Check this file first to see the current task before looking into other docs.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

---

## Phase 1: Foundation

### Task 1: Scaffold Next.js Project
- **Status:** `[x]`
- **Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`
- **Actions:**
  - `pnpm create next-app@latest` with TypeScript, Tailwind, App Router, src directory
  - Install all dependencies per `docs/SPEC.md` tech stack
  - Configure path alias `@/` in tsconfig
- **Acceptance:** `pnpm build` passes, dev server starts
- **Commit:** `feat: scaffold Next.js 16 project with dependencies`

### Task 2: Configure Design Tokens + Tailwind
- **Status:** `[x]`
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
- **Status:** `[x]`
- **Files:** `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`
- **Actions:**
  - `pnpm dlx shadcn@latest init` — select Radix base (not base-nova)
  - Add base components: button, input, textarea, label, separator, dialog, dropdown-menu
  - **Critical:** Verify `globals.css` not overwritten by init — restore CSS variables if needed
  - Remove `@import "tw-animate-css"` and `@import "shadcn/tailwind.css"` if added (incompatible with Tailwind v3)
- **Acceptance:** Button renders with `--radius: 0.5rem` (rounded-lg). Dark mode class toggles correctly.
- **Commit:** `feat: initialize Shadcn/ui with base components`

### Task 4: Supabase Schema + RLS
- **Status:** `[x]`
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
- **Status:** `[x]`
- **Files:** `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/middleware.ts`, `src/middleware.ts`, `.env.local`
- **Actions:**
  - Create server/client/middleware Supabase helpers per `@supabase/ssr` docs
  - Middleware: protect `/dashboard`, `/write`, `/edit/*`, `/settings` — redirect to `/login?returnUrl=<path>`
  - Middleware: refresh Supabase session on every request
- **Acceptance:** `pnpm build` passes, protected routes redirect to `/login`
- **Commit:** `feat: add Supabase client helpers and auth middleware`

#### Phase 1 Notes

> **Next.js 16 middleware deprecation:** `middleware.ts` triggers a build warning — Next.js 16 expects `proxy.ts` instead. Deferred to Phase 7 (Task 20 area). Functionality works, but migrate before production.

> **Supabase schema via dashboard:** Migration SQL in `supabase/migrations/` is canonical reference but was applied via Supabase dashboard SQL editor, not `supabase db push`. Track applied state manually.

> **Shadcn init overwrites globals.css:** After running `shadcn init` or `shadcn add`, always verify CSS variables in `globals.css` are intact. Restore from `DESIGN_TOKENS.md` if overwritten.

> **Full issue log:** `docs/issues/Issues_Phase_1.md`

---

## Phase 2: Auth

### Task 6: Login Page + OAuth
- **Status:** `[x]`
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
- **Status:** `[x]`
- **Files:** `src/app/settings/page.tsx`, `src/app/settings/settings-form.tsx`, `src/app/actions/profile.ts`
- **Actions:**
  - Server component loads profile, client form for editing
  - Fields: username, display name, bio, website
  - Avatar from OAuth (read-only display)
  - Username validation: lowercase, alphanumeric + hyphens, 3-30 chars, unique
  - `updateProfile` server action with Zod validation
- **Acceptance:** Can update profile fields. Username uniqueness enforced.
- **Commit:** `feat: add settings page with profile form`

#### Phase 2 Notes

> **Shadcn component preflight:** Before delegating form-heavy phases to Codex, verify all required `src/components/ui/` files exist. Missing components cause Codex to stop and ask. Run `pnpm dlx shadcn@latest add <components>` upfront.

> **Open redirect pattern:** Every `returnUrl` handler must check both `!startsWith('/')` AND `startsWith('//')`. Protocol-relative URLs (`//evil.com`) pass a plain `/` prefix check but redirect externally in browsers. Apply to all login/callback/redirect flows.

> **Codex + missing dependency = early stop:** If Codex finds a constraint contradiction (use X + no extra files, but X doesn't exist), it stops cleanly. Resolve the contradiction, then re-run — Codex picks up the full task correctly on retry.

> **Full issue log:** `docs/issues/Issues_Phase_2.md`

---

## Phase 3: Core Components

### Task 8: Layout Shell — Header, Nav, Dark Mode Toggle
- **Status:** `[x]`
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
- **Status:** `[x]`
- **Files:** `src/components/mobile-nav.tsx`, `src/components/site-header.tsx`
- **Actions:**
  - Hamburger menu on mobile (`md:hidden`), full nav on desktop (`hidden md:flex`)
  - Focus trap with Tab/Shift-Tab cycling (use `useFocusTrap` hook)
  - Close on Escape
  - Use `transition-[transform,opacity]` not `transition-all`
- **Acceptance:** Nav collapses to hamburger on mobile, all links accessible, focus trapped
- **Commit:** `feat: add responsive mobile navigation`

### Task 10: Shared Components — TagBadge, Skeleton, ModalWrapper
- **Status:** `[x]`
- **Files:** `src/components/shared/tag-badge.tsx`, `src/components/ui/skeleton.tsx`, `src/components/ui/modal-wrapper.tsx`, `src/hooks/useFocusTrap.ts`
- **Actions:**
  - TagBadge: `rounded-full` pill, orange hover, `tracking-label`, multiple variants (default, outline, ghost, active)
  - Skeleton: `animate-pulse` with `motion-reduce:animate-none`
  - ModalWrapper: focus trap, Esc close, backdrop click, portal rendering
  - useFocusTrap hook from codeshelf (well-implemented, keep as-is)
- **Acceptance:** Components render with correct token classes in both light/dark
- **Commit:** `feat: add TagBadge, Skeleton, and ModalWrapper components`

#### Phase 3 Notes

> **Codex "Do NOT ask questions" pattern:** Codex stops and asks when it hits ambiguity. Always add "Do NOT ask questions — make reasonable design decisions and proceed" to every Codex prompt. Pre-answer 3-5 likely decision points (avatar fallback, file conflicts, component variants). Budget 2-3 Codex runs per phase.

> **Gemini post-code catches layout/touch gaps:** Codex nails functionality and a11y but misses CLS prevention (`width`/`height` on images) and touch scroll containment (`overscroll-contain` on drawers/modals). Always run both Gemini pre-code and post-code reviews — they catch different categories of issues.

> **Shadcn components needed for Phase 3:** `skeleton`, `dropdown-menu` (plus `separator` from Phase 2). Verify all UI dependencies exist before launching Codex.

> **Full issue log:** `docs/issues/Issues_Phase_3.md`

---

## Phase 4: Public Pages

### Task 11: Homepage — Bookshelf View
- **Status:** `[x]`
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
- **Status:** `[x]`
- **Files:** `src/app/series/[slug]/page.tsx`, `src/lib/queries.ts`
- **Actions:**
  - Create shared queries module for reusable Supabase queries
  - Series header: title (font-serif), description, category, post count, character total
  - Post list ordered by `series_order`
  - Each post: title, excerpt, metadata labels (text-meta-base, tracking-label)
- **Acceptance:** `/series/[slug]` shows series with all posts in order
- **Commit:** `feat: add series detail page with post listing`

### Task 13: Post Detail Page
- **Status:** `[x]`
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
- **Status:** `[x]`
- **Files:** `src/app/archive/page.tsx`, `src/components/archive/archive-sidebar.tsx`, `src/components/archive/archive-post-list.tsx`
- **Actions:**
  - Sidebar on `bg-background-sidebar`: category filter, tag filter, sort options
  - Post list with pagination (NOT infinite scroll)
  - **Improve from codeshelf:** Replace `InfinitePostList` with paginated `ArchivePostList`
- **Acceptance:** `/archive` shows filtered, paginated posts. Sidebar filters work.
- **Commit:** `feat: add archive page with filtering and pagination`

#### Phase 4 Notes

> **Codex design fidelity gap:** Codex built functional pages from spec descriptions but never saw the original codeshelf-nextjs components. Result is architecturally sound but visually unrelated to the original editorial design. Lesson: For design-heavy phases, include original component source in Codex prompt or split into function-first then design-alignment passes.

> **Next.js 16 route param collision:** `series/[slug]` and `series/[seriesSlug]/[postSlug]` caused `slug !== seriesSlug` error. All dynamic segments at the same path level must share the same param name. Fixed by renaming to `series/[seriesSlug]`.

> **Full issue log:** `docs/issues/Issues_Phase_4.md`

---

## Phase 4B: Design Alignment

> **Why:** Phase 4 implementation is functionally correct but visually doesn't match the codeshelf-nextjs editorial design. This phase brings public pages to visual parity.
> **Reference:** `docs/DESIGN_ALIGNMENT.md` for full gap analysis and target patterns.

### Task 4B-1: Homepage Bookshelf Redesign
- **Status:** `[ ]`
- **Files:** `src/app/page.tsx`, `src/components/series/bookshelf.tsx`, `src/components/series/bookshelf-skeleton.tsx`
- **Actions:**
  - Full viewport height on desktop (`h-[calc(100vh-3.5rem)]`), scrollable on mobile
  - Two-panel layout: 400px sidebar (book stack) + large preview panel
  - Horizontal book bar cards with color themes, layered shadows, paper texture, shine gradient
  - Giant preview title (`text-6xl md:text-8xl fhd:text-9xl`), description with quote mark
  - Section header: `Section 01` + serif italic `series` + Korean subtitle
  - Visible auto-cycle control (play/pause + status)
  - "Explore archive" CTA with animated arrow + statistics panel
  - Remove "Recent Posts" section (original was bookshelf-only homepage)
- **Acceptance:** Homepage matches codeshelf-nextjs bookshelf layout and visual feel
- **Commit:** `feat: redesign homepage bookshelf to match editorial design`

### Task 4B-2: Archive Page Redesign
- **Status:** `[ ]`
- **Files:** `src/app/archive/page.tsx`, `src/components/archive/archive-sidebar.tsx`, `src/components/archive/archive-post-list.tsx`
- **Actions:**
  - Sidebar: section header pattern (`Section 02` + italic `archive` + Korean), category counts, bilingual sort labels, info box
  - Replace card grid with data-table rows: index + date + category + title + excerpt + tags + metrics + hover arrow
  - Table headers with bilingual labels
  - Keep mobile collapsible sidebar (improvement over original)
  - Keep pagination (improvement over original infinite scroll)
- **Acceptance:** Archive matches codeshelf-nextjs editorial row-based layout
- **Commit:** `feat: redesign archive with editorial data-table rows`

### Task 4B-3: Post Detail Redesign
- **Status:** `[ ]`
- **Files:** `src/components/post-detail/post-detail-layout.tsx`, `src/components/post-detail/article-content.tsx`, `src/components/post-detail/table-of-contents.tsx`, `src/app/series/[seriesSlug]/[postSlug]/page.tsx`, `src/app/post/[slug]/page.tsx`
- **Actions:**
  - Three-column layout: TOC left (`lg:`, clamp width) + article center (`max-w-[800px]`) + toolbox right (`xl:`, placeholder)
  - Article in card wrapper (`bg-card rounded-lg shadow-sm`)
  - Article header inside card: category + tags → title (`text-4xl md:text-5xl`) + excerpt → author card + metadata
  - Mobile: bottom toolbar for toolbox content
  - Update prose styling in globals.css (serif italic h2, font-light paragraphs)
- **Acceptance:** Post detail matches codeshelf-nextjs three-column article card layout
- **Commit:** `feat: redesign post detail with three-column article card layout`

### Task 4B-4: Cross-cutting Visual Identity
- **Status:** `[ ]`
- **Files:** `src/components/shared/section-header.tsx`, `src/components/shared/tag-badge.tsx`, `src/components/shared/post-row.tsx`, `src/app/globals.css`, `src/app/series/[seriesSlug]/page.tsx`
- **Actions:**
  - Create `SectionHeader` component (number + serif title + Korean subtitle)
  - Create `PostRow` component (data-table row with index, date, category, title, tags, metrics)
  - Update `TagBadge` — add Hash icon prefix, review variant styling to match original
  - Update prose overrides in globals.css
  - Replace `rounded-3xl` with `rounded-sm`/`rounded-[4px]` on cards
  - Update series detail page to use editorial patterns
- **Acceptance:** Shared components match codeshelf-nextjs editorial aesthetic. Series detail uses same patterns.
- **Commit:** `feat: add editorial shared components and cross-cutting visual polish`

---

## Phase 5: Protected Pages

### Task 15: Dashboard
- **Status:** `[ ]`
- **Files:** `src/app/dashboard/page.tsx`, `src/components/dashboard/dashboard-client.tsx`, `src/components/dashboard/content-list-panel.tsx`
- **Design Reference:** `docs/DESIGN_ALIGNMENT.md` → Task 5A-1
- **Actions:**
  - Server component fetches user's posts, series, stats
  - **Match original design:** Profile section (serif italic name, mono role, avatar, stats) + 2×2 `RecentSection` grid
  - `ContentListPanel`: search input + sort dropdown, selected state `bg-stone-900 text-white`, `content-visibility: auto`
  - `RecentItemRow`: icon + title/subtitle + hover edit/delete actions (opacity-0 → group-hover:opacity-100)
  - Density-responsive via `fhd:`/`qhd:`/`uhd:` breakpoints
  - All labels: `font-mono text-[9px]-[11px] uppercase tracking-[0.2em]-[0.6em]`, Korean bilingual
  - Cards: `rounded-sm border-stone-200`, not `rounded-lg`
  - Footer bar with total stats in mono text
- **Acceptance:** Dashboard matches codeshelf-nextjs editorial layout. Profile + grid + density-responsive rows.
- **Commit:** `feat: add dashboard with editorial content management panels`

### Task 16: Write Page — New Post Editor
- **Status:** `[ ]`
- **Files:** `src/app/write/page.tsx`, `src/components/admin/post-editor.tsx`, `src/components/admin/markdown-editor.tsx`, `src/components/admin/publish-modal.tsx`, `src/app/actions/posts.ts`
- **Design Reference:** `docs/DESIGN_ALIGNMENT.md` → Task 5A-2 (editor) + Task 5A-3 (publish modal)
- **Actions:**
  - Server Actions: `createPost` (slug generation, excerpt auto-generation, tag upsert)
  - **Match original design:** Full-screen `h-screen bg-stone-50` split-pane layout
  - Header: `h-16 bg-white/80 backdrop-blur-sm border-b`, close button (`font-mono text-[10px] uppercase tracking-[0.3em]`), publish button (`bg-stone-900 rounded-sm`)
  - Title input: `text-2xl font-serif`, borderless, placeholder "Untitled"
  - Split pane: markdown editor (left) + live preview (right) with resizable divider
  - Traffic light save indicator: green/yellow/red `w-2 h-2 rounded-full`
  - **Note from workspace2:** Don't wrap `"use client"` component in `dynamic({ ssr: false })` — guard browser-only code in `useEffect`
  - **PublishModal:** `w-[60vw] max-h-[85vh]`, two-column (55% form + 45% OG preview)
  - Form labels: `font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500`
  - Category combobox with colored badges, tag autocomplete with validation, series picker with search/sort/inline create
  - OG preview: mock social card (image placeholder, title, description, URL in mono)
  - Redirect to `/settings` if user has no username
  - All actions use `ActionResult<T>` pattern
- **Acceptance:** Full-screen editor matches codeshelf-nextjs split-pane design. Publish modal has two-column OG preview.
- **Commit:** `feat: add write page with split-pane editor and publish modal`

### Task 17: Edit Page — Shadow Draft System
- **Status:** `[ ]`
- **Files:** `src/app/edit/[id]/page.tsx`, `src/app/actions/posts.ts`, `src/hooks/useAutoSave.ts`, `src/lib/checkpoint.ts`
- **Design Reference:** `docs/DESIGN_ALIGNMENT.md` → Task 5A-2 (shares editor layout with Task 16)
- **Actions:**
  - Load existing post (verify ownership via RLS)
  - Reuse PostEditor with initial values (same full-screen split-pane design as write page)
  - Shadow draft: writes to `shadow_title`/`shadow_content`/`shadow_updated_at`
  - Auto-save: hybrid local (1s) + remote (5s, 90s force) with change score
  - Checkpoint: localStorage crash recovery (3-day window for unsaved drafts)
  - Traffic light indicator: green (synced) / yellow (saving) / red (error) — `w-2 h-2 rounded-full` + pulse animation
  - Checkpoint timer: `font-mono text-[10px] text-stone-400` countdown to next remote save
  - Exit confirmation modal if unsaved changes (close button triggers warning)
  - `updatePost` and `deletePost` server actions
  - Publish action: atomic swap shadow → live
- **Acceptance:** Edit page reuses same editorial editor layout. Auto-save with traffic light. Shadow draft doesn't affect live. Publish swaps atomically.
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
