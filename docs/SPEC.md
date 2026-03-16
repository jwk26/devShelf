# SPEC — System Architecture & Technical Design

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Decisions](#architecture-decisions)
- [Routes](#routes)
- [Page Layouts](#page-layouts)
- [Responsive Breakpoints](#responsive-breakpoints)
- [Key File Paths](#key-file-paths)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI Runtime | React 19 |
| Database + Auth | Supabase (PostgreSQL, OAuth, RLS, Storage) |
| Styling | Tailwind CSS 3.4 + Shadcn/ui (Radix primitives) |
| Fonts | Playfair Display (serif, via next/font) + Pretendard Variable (sans, via CDN) |
| Markdown Editor | EasyMDE / react-simplemde-editor |
| Markdown Rendering | react-markdown + remark-gfm + rehype-highlight + rehype-sanitize |
| Dark Mode | next-themes |
| Validation | Zod |
| Icons | Lucide React |
| Date Utils | date-fns |
| Slug Generation | slugify |
| Package Manager | pnpm |
| Testing | Playwright |

## Architecture Decisions

1. **Server Components by default** — all public/read pages render on the server. No client JS for reading.
2. **Client Components only for:** markdown editor, dark mode toggle, search modal, bookshelf interactions, mobile nav, publish modal, tag autocomplete.
3. **No API routes** — Server Actions for all mutations. Supabase SSR client talks to DB directly.
4. **Supabase RLS as auth layer** — row-level security enforces ownership. Middleware only protects route access.
5. **Author-owns-their-content model** — no admin role. Each authenticated user can only CRUD their own posts/series/profile. RLS policy: `auth.uid() = author_id`.
6. **Shadow draft system** — editing a published post writes to `shadow_title`/`shadow_content`/`shadow_updated_at` columns. Live `title`/`content` untouched until explicit publish. Atomic swap on publish.
7. **Hybrid auto-save** — local buffer (1s debounce) + remote sync (5s debounce, 90s force). Change score minimizes spurious saves. Checkpoint system in localStorage for crash recovery.
8. **Revalidate on mutations** — `revalidatePath()` after create/edit/delete for ISR invalidation.
9. **Two-type system** — Supabase returns flat DB shape (`author_name`, `meta_volume`). Frontend uses nested shape (`author.name`, `metadata.volume`). Each page has a local `transformPost()`.
10. **ActionResult<T> pattern** — all server actions return `{ data, error? }` via `ok()` / `fail()` helpers. Consumers check `.error` before using `.data`.
11. **Design tokens via CSS variables** — all colors/spacing/typography in `:root` CSS variables. Tailwind config references variables. No hardcoded hex values in components.

## Routes

| Route | Purpose | Auth | Rendering |
|-------|---------|------|-----------|
| `/` | Homepage — bookshelf | Public | Server |
| `/series/[slug]` | Series detail — posts in series | Public | Server |
| `/series/[seriesSlug]/[postSlug]` | Post detail (series context) | Public | Server |
| `/post/[slug]` | Post detail (standalone) | Public | Server |
| `/archive` | Archive grid with filtering | Public | Server + Client |
| `/login` | OAuth login (Google + GitHub) | Public | Server |
| `/auth/callback` | OAuth callback (exchange code) | System | Route Handler |
| `/dashboard` | Personal workspace — stats, content lists | Protected | Server + Client |
| `/write` | New post editor | Protected | Client |
| `/edit/[id]` | Edit existing post (shadow draft) | Protected | Client |
| `/settings` | Profile settings | Protected | Client |

### Route Protection

Middleware (`src/middleware.ts`) protects `/dashboard`, `/write`, `/edit/*`, `/settings`. Unauthenticated users redirect to `/login?returnUrl=<original>`. After OAuth callback, redirect back to `returnUrl`.

## Page Layouts

### Homepage `/`

- Full-width bookshelf display with 3D book volumes
- Books sized dynamically: height by post count, width by title length
- Auto-rotating preview cycles through series
- "Recent" indicator (orange pulse) for recently updated series
- Category badges on book spines
- Below bookshelf: recent standalone posts (paginated)

### Series Detail `/series/[slug]`

- Series header: title (Playfair serif), description, category badge, post count, total characters
- Post list: ordered by series_order, each showing title, excerpt, metadata labels
- Navigation to individual posts within series

### Post Detail `/series/[seriesSlug]/[postSlug]` and `/post/[slug]`

- 2-column layout at `lg+`: `400px` sidebar + `850px max` main content
- Sidebar (sticky): metadata labels (PUBLISHED, AUTHOR, CATEGORY, TAGS, CHARACTER COUNT), table of contents with active section highlighting, series navigation (prev/next)
- Main: rendered markdown with `prose` class from `@tailwindcss/typography`, syntax-highlighted code blocks
- Collapses to single column on mobile/tablet — metadata moves above article

### Archive `/archive`

- Sidebar: category filter, tag filter, sort (latest/oldest)
- Main: post grid/list with pagination
- Sidebar on `bg-background-sidebar`, collapsible on mobile

### Write/Edit `/write`, `/edit/[id]`

- EasyMDE markdown editor (dynamic import, no SSR)
- Title input
- Publish modal: 2-column (form + OG preview), category/tag input with autocomplete, series picker with inline creation
- Auto-save indicator (traffic light: synced/saving/error)
- Exit confirmation modal if unsaved changes
- Checkpoint timer showing time since last save

### Dashboard `/dashboard`

- Stats overview: draft count, published count, series count, categories, tags
- Two-panel layout: content list (searchable, sortable) + preview pane (markdown headings outline)
- Quick actions: edit, delete, publish draft
- Profile summary with edit link

### Login `/login`

- Centered card with Google + GitHub OAuth buttons
- Google button with brand colors
- Redirect to returnUrl after successful auth

### Settings `/settings`

- Profile form: display name, bio, website
- Avatar from OAuth (read-only)
- Connected accounts section (read-only)

## Responsive Breakpoints

| Token | Width | Behavior |
|-------|-------|----------|
| `sm` | `< 768px` | Single column, hamburger nav, metadata above content |
| `md` | `768-1023px` | Single column, full horizontal nav |
| `lg` | `1024-1439px` | 2-column post detail starts, sidebar appears |
| `laptop` | `1440-1919px` | Full layout with generous spacing |
| `fhd` | `1920-2559px` | Full HD, content centered within max-w-layout |
| `qhd` | `2560-3839px` | QHD, generous margins around centered content |
| `uhd` | `3840px+` | 4K UHD, same layout, maximum whitespace |

## Key File Paths

| Path | Purpose |
|------|---------|
| `src/lib/supabase/server.ts` | Supabase server client (Server Components + Actions) |
| `src/lib/supabase/client.ts` | Supabase browser client (Client Components) |
| `src/lib/supabase/middleware.ts` | Session refresh middleware helper |
| `src/middleware.ts` | Route protection (redirects to /login) |
| `src/app/actions/` | Server Actions (posts, series, categories, tags, auth) |
| `src/app/actions/result.ts` | ActionResult<T> helpers (ok, fail, okSuccess, failSuccess) |
| `src/types/index.ts` | Frontend types (nested shape) |
| `src/types/supabase.ts` | Database types (flat shape) |
| `src/components/` | Shared components |
| `src/hooks/` | Custom hooks (useAutoSave, useActiveSection, useScrollProgress, useFocusTrap) |
| `src/lib/design-tokens.ts` | Helper functions (generateBookDimensions, formatCharacterCount) |
| `src/app/globals.css` | CSS variables (design tokens from DESIGN_TOKENS.md) |
| `tailwind.config.ts` | Tailwind configuration (references CSS variables) |
| `supabase/migrations/` | Database schema SQL |
