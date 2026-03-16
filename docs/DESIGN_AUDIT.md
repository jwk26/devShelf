# Design Audit — codeshelf-nextjs

> Audited from: `/Users/jwk/Documents/workspace/codeshelf-nextjs/`
> Date: 2026-03-15

---

## Table of Contents

- [Part 1: Design Token Findings](#part-1-design-token-findings)
- [Part 2: Feature Inventory](#part-2-feature-inventory)
- [Part 3: Architecture Observations](#part-3-architecture-observations)

---

## Part 1: Design Token Findings

### Executive Summary

`design-tokens.ts` exists but is **functionally unused for styling**. Only 3 of ~110 source files import it (2.7%), and only for helper functions (`formatCharacterCount`, `generateBookDimensions`) — never for colors, spacing, or typography. The entire codebase uses inline Tailwind classes and hardcoded values that bypass the token system.

### 1.1 Token Import Adoption

| Metric | Value |
|--------|-------|
| Files importing design-tokens.ts | 3 / ~110 (2.7%) |
| What's imported | `formatCharacterCount`, `generateBookDimensions` only |
| Color tokens imported | 0 |
| Typography tokens imported | 0 |
| Spacing tokens imported | 0 |
| Shadow tokens imported | 0 |

**Files that DO import:**
- `src/components/post-detail/ArticleContent.tsx` — `formatCharacterCount`
- `src/components/posts/PostGrid.tsx` — `formatCharacterCount`
- `src/components/series/Bookshelf.tsx` — `generateBookDimensions`, `formatCharacterCount`

### 1.2 Colors — Declared vs Actually Used

#### Hardcoded Hex Values (13 instances in 11 files)

| Hex | Files | In Tokens? | Notes |
|-----|-------|-----------|-------|
| `#fafaf7` | layout.tsx, admin editor layout, PostEditor | Yes (`background.primary`) | Used as `bg-[#fafaf7]` — bypasses tokens |
| `#f8f8f5` | Footer, Navbar | Yes (`background.secondary`) | Same bypass pattern |
| `#f3f3f0` | PostGrid | Yes (`background.card`) | Same bypass pattern |
| `#fbfbfa` | ArchiveSidebar, DashboardSidebar | **No** | Undeclared variant |
| `#fafaf9` | global-error.tsx | Yes (`stone.50`) | — |
| `#1c1917` | global-error.tsx, editor.css | Yes (`stone.900`) | — |
| `#a8a29e` | globals.css scrollbar | Yes (`stone.400`) | — |
| `#78716c` | globals.css scrollbar | Yes (`stone.500`) | — |
| `#fecaca` | global-error.tsx | **No** | Red error color |
| `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335` | login page | **No** | Google OAuth brand colors |

**Verdict:** 8/13 match declared tokens but are hardcoded inline instead of imported.

#### Stone Palette — Primary Color System

The full stone scale (`stone-50` through `stone-900`) is used extensively across 50+ files but is **NOT declared in design-tokens.ts** at all. It's used purely through Tailwind defaults. The tailwind.config.ts does override some stone values:

| Token Stone Value | Tailwind Config Value | Match? |
|---|---|---|
| `stone.100: #f7f7f6` | `stone.100: #f5f5f4` | **Different** |
| `stone.200: #efefed` | `stone.200: #e7e5e4` | **Different** |
| `stone.300: #e0dfdd` | `stone.300: #d6d3d1` | **Different** |
| `stone.400: #a8a29e` | `stone.400: #a8a29e` | Same |
| `stone.500: #78716c` | `stone.500: #78716c` | Same |

The design-tokens.ts declares lighter stone-100/200/300 values that differ from what's in tailwind.config.ts. Tailwind config uses standard Tailwind stone defaults. **The tokens file is wrong for 100-300 shades.**

#### Orange Accent — Partially Declared

Only `orange-400` (#fb923c) and `orange-500` (#f97316) are in tokens. But code uses the full palette: `orange-50`, `orange-100`, `orange-200`, `orange-400`, `orange-500`, `orange-600`, `orange-700`, `orange-900`.

Key orange usage:
- `selection:bg-orange-100 selection:text-orange-900` (layout.tsx — text selection color)
- `focus:ring-orange-100 focus:border-orange-200` (form focus states)
- `text-orange-500`, `hover:text-orange-600` (links, accents)
- `bg-orange-50`, `text-orange-600` (blockquote styling in prose)

### 1.3 Typography — Declared and Used (via Tailwind, not imports)

| Font | Token Declaration | Tailwind Config | Actual Usage |
|------|------------------|-----------------|--------------|
| Playfair Display | `typography.serif.family` | `fontFamily.serif` | `font-serif` class (50+ uses) — headings, titles |
| Pretendard Variable | `typography.sans.family` | `fontFamily.sans` + `fontFamily.mono` | `font-sans` — body text; loaded via CDN |
| JetBrains Mono | `typography.mono.family` | Not in config | `font-mono` class (100+ uses) — metadata, labels |

**Note:** tailwind.config.ts maps both `font-mono` and `font-sans` to Pretendard, not JetBrains Mono. JetBrains Mono is NOT loaded anywhere — `font-mono` actually renders as Pretendard. This is a **config bug**.

Token mono sizes are used inline: `text-[9px]`, `text-[10px]`, `text-[11px]`, `text-[12px]`.
Token tracking values are used inline: `tracking-[0.1em]`, `tracking-[0.2em]`, `tracking-[0.4em]`, `tracking-[0.6em]`.
Undeclared variants also found: `tracking-[0.3em]`, `tracking-[0.5em]`.

### 1.4 Spacing — Declared, Used Inline, with Undeclared Variants

| Token Value | In Code? | Notes |
|-------------|---------|-------|
| `max-w-[1920px]` (page max) | Yes | Used in PostDetailLayout |
| `max-w-[850px]` (content max) | Yes | Used in article layouts |
| `px-6 md:px-12` (page padding) | Yes | Multiple layouts |
| `gap-12` (section gap) | Yes | Multiple sections |
| `space-y-12` (section spacing) | Yes | Multiple layouts |
| `top-24` (sidebar sticky) | Yes | Sticky headers |

**Undeclared variants also used:** `max-w-[800px]`, `max-w-[1000px]`, `gap-2`, `gap-3`, `gap-6`, `gap-8`.

### 1.5 Shadows — Declared but Standard Tailwind Used Instead

Tokens declare complex layered shadows (`shadow-sm`, `shadow-md`, `shadow-lg`), but code uses standard Tailwind: `shadow-sm`, `shadow-lg`, `shadow-xl`, `shadow-2xl`. Custom glow effects in TrafficLight.tsx use undeclared arbitrary shadows.

### 1.6 Borders & Radius — Used Inline, Never Imported

- `border-stone-200` is ubiquitous (the primary border color)
- `border-stone-200/60` (subtle variant)
- `border-stone-400/50` (active variant)
- Radius: mixed usage — `rounded-sm` (30+), `rounded-lg` (15+), `rounded-xl` (10+), `rounded-full` (20+)

### 1.7 Animations — Hardcoded Durations

Code uses `transition-all duration-300 ease-out` pattern throughout. Token-declared durations (200ms, 300ms, 500ms) match what's used, but are never imported. Custom easing `cubic-bezier(0.23, 1, 0.32, 1)` is in Tailwind config as `ease-smooth`.

### 1.8 Design Findings Summary

| Category | Declared | Used | Import Rate | Verdict |
|----------|----------|------|------------|---------|
| Background colors (hex) | 3 | All 3 used (hardcoded) | 0% | Correct values, wrong usage |
| Stone palette | Not in tokens | Full scale used | N/A | Must add to new tokens |
| Orange accent | 2 shades | 9 shades used | 0% | Must expand |
| Typography families | 3 declared | 3 used (via Tailwind) | 0% | Config bug: JetBrains Mono not loaded |
| Mono sizes | 4 declared | 4 used + 3 undeclared | 0% | Expand set |
| Spacing | 10 values | Most used + undeclared variants | 0% | Clean up variants |
| Shadows | 3 custom | Standard Tailwind used instead | 0% | Simplify to Tailwind defaults |
| Borders | 3 patterns | Used inline | 0% | Document actual patterns |
| Animations | 5 durations, 2 easings | Used inline | 0% | Keep durations, add to config |

---

## Part 2: Feature Inventory

### Feature Table

| Feature | Key Files | Quality | Rec. | Notes |
|---------|-----------|---------|------|-------|
| **Bookshelf view** | `Bookshelf.tsx`, `BookshelfSkeleton.tsx` | Excellent | **Keep** | Dynamic dimensions, auto-rotate, prefers-reduced-motion, is_recent indicator |
| **Archive view** | `ArchiveSidebar.tsx`, `ArchivePostListFetcher.tsx` | Good | **Keep** | Category/tag filters, sorting. Remove infinite scroll portion |
| **Post editor** | `PostEditor.tsx`, `MarkdownEditor.tsx`, `PublishModal.tsx` | Excellent | **Keep** | Hybrid auto-save, shadow drafts, checkpoint recovery, publish modal |
| **Shadow draft system** | `posts.ts` actions, PostEditor | Excellent | **Keep** | Edits to shadow columns; live content untouched until publish |
| **Auto-save (hybrid)** | `useAutoSave.ts` | Excellent | **Keep** | Local 1s + remote 5s debounce + 90s force. Change score minimizes spurious saves |
| **Checkpoint recovery** | `checkpoint.ts`, PostEditor | Good | **Keep** | localStorage crash recovery, 3-day window |
| **Search modal** | `SearchModal.tsx`, `SearchContext.tsx` | Good | **Keep** | Cmd+K trigger, searches posts/drafts/series/tags |
| **Tag system** | `TagBadge.tsx`, `tags.ts` actions | Good | **Keep** | Autocomplete, validation (max 13 chars, a-z/0-9/hyphen), orphan cleanup |
| **Category system** | `categories.ts` actions, PublishModal | Good | **Keep** | Free-text input with autocomplete, DB-backed |
| **Series management** | `series.ts` actions, PublishModal | Needs work | **Improve** | Publish modal series picker works. No dedicated series edit page |
| **Login/Auth** | `login/page.tsx`, `auth.ts`, middleware | Good | **Keep** | OAuth Google+GitHub. Remove admin email allowlist for rebuild |
| **Navigation** | `Navbar.tsx`, `NavbarWrapper.tsx`, `Footer.tsx` | Good | **Keep** | Top nav, returnUrl handling, context-aware footer |
| **Post detail** | `PostDetailClient.tsx`, `PostDetailLayout.tsx`, `ArticleContent.tsx` | Good | **Keep** | Two-column layout, series navigation, TOC |
| **Table of Contents** | `TableOfContents.tsx`, `useActiveSection.ts` | Needs work | **Improve** | Hook exists but TOC integration incomplete |
| **Markdown preview** | `MarkdownPreview.tsx` | Poor | **Improve** | Regex-based parsing — fragile, missing XSS sanitization. Replace with react-markdown |
| **Modal system** | `ModalWrapper.tsx`, `useFocusTrap.ts` | Good | **Keep** | Accessible focus trap, Esc close, backdrop click |
| **Publish modal** | `PublishModal.tsx` | Excellent | **Keep** | 2-column (editor+preview), OG preview, series creation inline |
| **Skeleton loaders** | `skeleton.tsx`, BookshelfSkeleton, etc. | Good | **Keep** | Matches target layout, motion-reduce support |
| **Scroll progress** | `useScrollProgress.ts` | Good | **Keep** | Lightweight, 60fps debounced |
| **Design tokens** | `design-tokens.ts` | Poor adoption | **Improve** | Good concept, 2.7% adoption. Rebuild properly via CSS variables |
| **Content list panel** | `ContentListPanel.tsx` | Good | **Keep** | Reusable two-panel list/detail for dashboard |
| **OG preview** | `OpenGraphPreview.tsx` | Good | **Keep** | Live social preview in publish modal |
| **Traffic light** | `TrafficLight.tsx` | Good | **Keep** | Visual save status indicator |
| **Exit confirmation** | `ExitConfirmationModal.tsx` | Good | **Keep** | Prevents data loss on editor exit |
| **Dashboard** | `AdminDashboardClient.tsx` | Needs work | **Improve** | Currently just counts. Add meaningful insights |
| **Infinite scroll** | `InfinitePostList.tsx`, `useInfiniteScroll.ts` | Complex | **Delete** | Out of scope — pagination only. Complex state, closure bugs |
| **Comments system** | `comments.ts` actions, CommentSection | Incomplete | **Delete** | DB schema exists, no complete UI. Out of scope |
| **Admin role system** | `admin.ts`, `requireAdmin()`, email allowlist | Working | **Delete** | Out of scope — no admin role in rebuild |
| **View count tracking** | `view_count` column, `increment_post_view_count()` | Incomplete | **Delete** | Column exists, no tracking action implemented. Out of scope |
| **Delayed post grid** | `DelayedPostGrid.tsx` | Unnecessary | **Delete** | Wrapper that adds artificial delay. Not needed |

### Features for PRD "Explicit Non-Features" (from Delete recommendations)

- Infinite scroll → pagination only
- Admin role / email allowlist → everyone owns their own content
- View count tracking → no analytics
- Comment approval workflow → simplified or removed
- AI-powered features → none existed, confirming non-feature

---

## Part 3: Architecture Observations

### Patterns Worth Preserving

1. **Two-Type System (DB ↔ Frontend)**
   - `types/supabase.ts`: flat DB shape (`author_name`, `meta_volume`)
   - `types/index.ts`: nested frontend shape (`author.name`, `metadata.volume`)
   - Each page has local `transformPost()` — keeps DB flexible, UI clean
   - **Verdict: Excellent pattern. Keep.**

2. **ActionResult<T> Shape** (`actions/result.ts`)
   - All server actions return `{ data, error? }`
   - Helper functions: `ok()`, `fail()`, `okSuccess()`, `failSuccess()`
   - Consistent error handling: `if (result.error) { ... }`
   - **Verdict: Simple, predictable. Keep.**

3. **Shadow Draft System**
   - Edit writes to `shadow_title`, `shadow_content`, `shadow_updated_at`
   - Live `title`/`content` untouched until explicit publish
   - Atomic swap on publish
   - **Verdict: Prevents accidental overwrites. Keep.**

4. **Hybrid Auto-Save**
   - Local buffer (1s debounce) + remote sync (5s debounce, 90s force)
   - Change score calculation minimizes spurious saves
   - Status state machine: SYNCED → CHANGING → SYNCING → ERROR
   - **Verdict: Excellent UX/backend balance. Keep.**

5. **Server Components + Client Components Split**
   - Pages are async server components
   - Data fetched server-side, passed as props
   - Client components handle interactivity only
   - Middleware refreshes Supabase session
   - **Verdict: Clean data flow. Keep.**

### Anti-Patterns to Avoid

1. **Design tokens declared but never imported** — rebuild must enforce usage through CSS variables + Tailwind config, not a TS file of Tailwind class strings
2. **Infinite scroll complexity** — stale closures, complex refs, hard to test. Use pagination
3. **Regex-based markdown parsing** — fragile, XSS risk. Use react-markdown + rehype-sanitize
4. **Admin role via email allowlist** — removes self-service. Not needed for multi-author platform
5. **JetBrains Mono declared but never loaded** — tailwind config maps `font-mono` to Pretendard. Must actually load the font
6. **`transition-all`** — causes layout recalculations. Scope to specific properties

### Dependencies Assessment

| Dependency | Keep? | Notes |
|------------|-------|-------|
| Next.js 16 | Yes | Latest, App Router |
| React 19 | Yes | Latest |
| Tailwind CSS 3.4 | Yes | Core styling |
| `@supabase/supabase-js` + `@supabase/ssr` | Yes | Auth + DB |
| `date-fns` | Yes | Lightweight date utils |
| `zod` | Yes | Validation |
| `slugify` | Yes | Slug generation |
| `lucide-react` | Yes | Icons |
| `react-markdown` + `remark-gfm` | Yes | Markdown rendering (use more) |
| `rehype-highlight` + `rehype-sanitize` | Yes | Syntax highlighting + XSS |
| `@tailwindcss/typography` | Yes | Prose styling |
| `easymde` / `react-simplemde-editor` | Consider | Large bundle — evaluate lighter alternatives |
| Playwright | Yes | E2E testing |
| **NEW: `next-themes`** | Add | Dark mode (from workspace2) |
| **NEW: Shadcn/ui** | Add | Component library (from workspace2) |

### Code Quality Summary

| Area | Score | Notes |
|------|-------|-------|
| Architecture | 8/10 | Two-type system excellent. Server/client split clean |
| Type Safety | 8/10 | TypeScript strict. Some casts needed for Supabase joins |
| Accessibility | 7/10 | Focus trap, prefers-reduced-motion. Needs more aria-labels |
| Performance | 7/10 | Good debouncing, skeletons. Infinite scroll risky |
| Error Handling | 6/10 | ActionResult good. Missing error boundaries in some views |
| Testing | 5/10 | Playwright exists. No unit tests. Needs more E2E |
| Maintainability | 8/10 | Well-organized. Some large components could split |
| **Overall** | **7/10** | Solid foundation with clear improvement areas |
