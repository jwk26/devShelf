# Design Alignment Plan — Phase 4B + Phase 5

> **Problem:** Phase 4 implementation was built from spec descriptions, not from the actual codeshelf-nextjs components. The result is functionally correct but visually unrelated to the original design.
>
> **Goal:** Bring all pages (public and protected) to visual parity with codeshelf-nextjs while keeping architecture improvements (CSS variables, react-markdown, Shadcn/Radix, dark mode, pagination).
>
> **Scope:** Tasks 4B-1 through 4B-4 cover public pages. Tasks 5A-1 through 5A-3 cover protected pages (dashboard, editor, publish modal) — these serve as design references for Phase 5 implementation.

---

## Table of Contents

- [Design Principles to Preserve from Original](#design-principles-to-preserve-from-original)
- [Architecture Improvements to Keep](#architecture-improvements-to-keep)
- [Task 4B-1: Homepage Bookshelf Redesign](#task-4b-1-homepage-bookshelf-redesign)
- [Task 4B-2: Archive Page Redesign](#task-4b-2-archive-page-redesign)
- [Task 4B-3: Post Detail Redesign](#task-4b-3-post-detail-redesign)
- [Task 4B-4: Cross-cutting Visual Identity](#task-4b-4-cross-cutting-visual-identity)
- [Task 5A-1: Dashboard Redesign](#task-5a-1-dashboard-redesign)
- [Task 5A-2: Post Editor Redesign](#task-5a-2-post-editor-redesign)
- [Task 5A-3: Publish Modal Redesign](#task-5a-3-publish-modal-redesign)
- [Reference: Original vs Current Component Map](#reference-original-vs-current-component-map)

---

## Design Principles to Preserve from Original

The original codeshelf-nextjs has a **editorial/magazine-inspired** design identity with these pillars:

1. **Immersive layouts** — Full viewport height bookshelf, generous whitespace, content breathes
2. **Giant typography** — Preview titles at `text-6xl` to `text-9xl`, serif italic section headers
3. **Technical metadata aesthetic** — Tiny uppercase mono text (`9px`-`11px`) with wide letter-spacing (`0.1em`-`0.6em`), resembling a terminal or technical document index
4. **Bilingual Korean/English** — Section headers and labels include Korean subtitles (`시리즈 // 전체 시리즈 목록`)
5. **Section numbering** — `Section 01`, `Section 02` pattern for major page areas
6. **Layered visual depth** — Paper textures, shine gradients, subtle layered shadows on book cards
7. **Decorative elements** — Vertical text references, oversized quote marks, dot indicators, thin lines
8. **Sharp edges** — `rounded-sm` / `rounded-[4px]` for cards, not rounded-3xl
9. **Stone palette** — Direct `stone-*` colors with warm off-white backgrounds
10. **Data-dense list views** — Table-like rows with index numbers, metrics columns, hover arrows (not card grids)

## Architecture Improvements to Keep

These improvements from the rebuild should NOT be reverted:

- **CSS variables + Shadcn tokens** — Keep the token system, but ADD direct stone-* usage where needed for editorial styling (bookshelf decorative elements don't need dark mode)
- **react-markdown** — Keep (replaces vulnerable regex parser)
- **Pagination** — Keep (replaces complex infinite scroll)
- **Dark mode support** — Keep, but some decorative elements (textures, shine) may be light-only
- **prefers-reduced-motion** — Keep
- **Server Components by default** — Keep
- **Accessibility (aria-labels, focus-visible rings)** — Keep

---

## Task 4B-1: Homepage Bookshelf Redesign

**Scope:** Complete visual overhaul of `page.tsx` + `bookshelf.tsx`

### Current → Target

| Aspect | Current | Target (from original) |
|--------|---------|----------------------|
| Page height | Scrollable | Full viewport `h-[calc(100vh-3.5rem)]` on desktop, scrollable on mobile |
| Layout | Stacked sections | Two-panel: 400px sidebar + preview panel (flex, not grid) |
| Book cards | Vertical spines, side by side | Horizontal bars stacked vertically (flex-col-reverse), with color themes |
| Book styling | `border border-border bg-card rounded-sm` | Color theme bg, `rounded-[4px]`, layered shadows, paper texture, shine gradient |
| Book interaction | Hover highlights, float animation | Hover slides right (`translate-x-8`), z-index stacking |
| Preview | Small info card below books | Large preview panel: huge title `text-6xl md:text-8xl`, description with quote mark, "Explore archive" CTA, statistics |
| Section header | "Featured Series" label | `Section 01` + `series` (serif italic 4xl-5xl) + Korean subtitle |
| Auto-cycle | Hidden/automatic | Visible play/pause control with status text |
| Footer | None | "Hover to preview / Click to browse" instruction + recent activity legend |
| Recent posts | Card grid below bookshelf | Remove from homepage (original was bookshelf-only) |

### Key Original Patterns to Reproduce

**Book card structure:**
```
<Link> (relative, group, transition-all duration-700, dynamic width)
  ├── Recent indicator (absolute, -left-6, ping animation)
  └── Book card (color_theme bg, dynamic height, layered shadows)
      ├── Bottom gradient shadow
      ├── Content (title + post count, mono text)
      ├── Paper texture overlay (opacity-[0.03])
      ├── Shine gradient (opacity-0 → group-hover:opacity-100)
      └── Bottom blur shadow
```

**Preview panel structure:**
```
<div> (flex-grow, pl-16 lg:pl-24)
  ├── Decorative vertical text (writing-mode:vertical-lr, rotate-180)
  ├── Header metadata (tags + dates + auto-cycle control + line)
  ├── Giant title (font-serif, text-6xl to text-9xl, leading-[0.9])
  ├── Three dots (orange if recent)
  ├── Description with oversized quote mark
  └── Action footer (Explore archive CTA + Posts/Characters stats)
```

### Files to Modify
- `src/app/page.tsx` — Remove recent posts section, change to viewport-height layout
- `src/components/series/bookshelf.tsx` — Complete rewrite of visual structure
- `src/components/series/bookshelf-skeleton.tsx` — Match new two-panel layout

### New Data Requirements
- `color_theme` field on series (e.g., `bg-white`, `bg-stone-50`) — check if schema has this
- `topTags` per series for preview metadata

---

## Task 4B-2: Archive Page Redesign

**Scope:** Overhaul archive layout, sidebar, and post list format

### Current → Target

| Aspect | Current | Target (from original) |
|--------|---------|----------------------|
| Sidebar layout | `bg-background-sidebar` card with "Filters" | 400px sidebar with border-right, same editorial header pattern |
| Sidebar header | "Sort" / "Categories" / "Tags" headings | `Section 02` + `archive` (serif italic) + Korean `아카이브 // 전체 글 목록` |
| Category filter | Text buttons, no counts | Text buttons with count numbers right-aligned, "All" option |
| Tag filter | TagBadge pills | TagBadge pills with "click again to deactivate" hint |
| Sort options | "Latest" / "Oldest" buttons | Full-width buttons with Korean labels: `Latest 최신순`, `Oldest 오래된순` |
| Info box | None | Stats box at bottom: `N categories / N tags / N posts` |
| Post list | Card grid with pagination | **Data-table rows**: index + date + category + title + excerpt + tags + metrics + hover arrow |
| Table header | None | Column headers with bilingual labels |
| Mobile sidebar | details/summary collapsible | Keep collapsible (improvement over original which had no mobile consideration) |

### Key Original Patterns to Reproduce

**Post row structure:**
```
<Link> (flex, border-b border-stone-200, hover:bg-[#f3f3f0]/60, rounded-sm)
  ├── Index/Date (w-36): zero-padded index + date
  ├── Content (flex-grow): CategoryBadge + title (text-[15px] mono) + excerpt
  ├── Tags (w-72, hidden md:flex): up to 3 TagBadge ghost
  └── Metrics (w-40, border-l): character count + view count + hover arrow
```

**Table header:**
```
<div> (hidden md:flex, border-b border-stone-200)
  ├── "Index/Date 날짜"
  ├── "Subject 제목"
  ├── "Tags 태그"
  └── "Metrics 통계"
```

### Files to Modify
- `src/app/archive/page.tsx` — Change layout structure
- `src/components/archive/archive-sidebar.tsx` — Complete visual overhaul
- `src/components/archive/archive-post-list.tsx` — Replace card grid with data-table rows

---

## Task 4B-3: Post Detail Redesign

**Scope:** Restructure layout and article presentation

### Current → Target

| Aspect | Current | Target (from original) |
|--------|---------|----------------------|
| Column layout | 2-column (sidebar + article) | 3-column (TOC left + article center + toolbox right) |
| Left sidebar | Metadata + TOC + series nav combined | TOC only (sticky) |
| Right sidebar | None | Toolbox (scroll progress, share, comments link) — can simplify for now |
| Article wrapper | Bare prose | White card: `bg-white rounded-lg shadow-sm` (or `bg-card` for dark mode) |
| Article header | `h1` above article | Header inside card: category + tags → title (4xl-5xl) + excerpt → author card + metadata |
| Author display | Name in sidebar metadata | Avatar circle + name + role in article header |
| Metadata | All in left sidebar | Date + Length in article header footer |
| Series nav | In left sidebar | Next to title in article header |
| Title size | `text-3xl md:text-4xl` | `text-4xl md:text-5xl` with `text-balance` |
| Breakpoints | 2-col at `laptop:` (1440px) | 3-col: left at `lg:` (1024px), right at `xl:` (1280px), with `clamp()` widths |

### Key Original Patterns to Reproduce

**Three-column layout:**
```
<div> (max-w-[1920px], flex gap-6 xl:gap-8)
  ├── Left sidebar (hidden lg:block, clamp(200px, 15vw, 280px), sticky top-24)
  │   └── TableOfContents
  ├── Main content (flex-1, max-w-[800px])
  │   └── Article card (bg-card rounded-lg shadow-sm)
  │       ├── Header (p-8, border-b)
  │       │   ├── Category + Tags
  │       │   ├── Title + Excerpt + Series Nav
  │       │   └── Author card + Metadata (Date, Length)
  │       └── Content (p-8, prose)
  └── Right sidebar (hidden xl:block, clamp(180px, 14vw, 240px), sticky top-24)
      └── Toolbox (mobile: fixed bottom bar)
```

### Files to Modify
- `src/components/post-detail/post-detail-layout.tsx` — Restructure to three-column
- `src/components/post-detail/article-content.tsx` — Add article card wrapper, header section
- `src/components/post-detail/table-of-contents.tsx` — Separate from metadata sidebar
- `src/app/series/[seriesSlug]/[postSlug]/page.tsx` — Pass new props
- `src/app/post/[slug]/page.tsx` — Pass new props

### Deferred (Phase 6)
- Toolbox component (share, comments CTA, progress) — can use a minimal placeholder for now
- Comment section — out of Phase 4 scope

---

## Task 4B-4: Cross-cutting Visual Identity

**Scope:** Apply editorial design patterns across all public pages

### Changes

1. **Section header pattern** — Create reusable component:
   ```tsx
   <SectionHeader
     number="01"
     title="series"        // serif italic
     subtitle="시리즈 // 전체 시리즈 목록"  // mono, stone-400
   />
   ```

2. **Border radius** — Replace `rounded-3xl` with `rounded-sm` or `rounded-[4px]` on:
   - Post cards (archive)
   - Series cards (homepage)
   - Info boxes
   - Keep `rounded-lg` for article card wrapper, sidebar containers
   - Keep `rounded-full` for pills/avatars/badges

3. **Post row component** — Reusable data-table row for archive + recent posts:
   - Zero-padded index
   - Formatted date
   - Category badge
   - Title (mono, text-[15px])
   - Excerpt (truncated)
   - Tags (ghost badges, hidden on mobile)
   - Metrics (character count, optional view count)
   - Hover arrow

4. **TagBadge update** — Add `Hash` icon prefix (original has `#` icon via lucide `Hash`)

5. **Category badge** — Original uses colored backgrounds per category (from `getCategoryConfig`). May need a category color config.

6. **Prose styling** — Update `globals.css` prose overrides:
   - `prose h2`: `font-serif text-3xl mt-12 mb-6 italic font-normal` + `text-wrap: balance`
   - `prose h3`: `font-serif text-2xl mt-8 mb-4 font-normal`
   - `prose p`: `leading-relaxed mb-6 font-light`
   - `prose a`: `text-blue-600 hover:text-blue-800 underline` (not orange in prose body)
   - `prose blockquote`: `border-l-4 border-stone-300 pl-4 italic text-stone-600`

7. **Series detail page** — Update to match editorial pattern:
   - Section header with Korean subtitle
   - Post list as ordered data-table rows (not card grid)

### Files to Modify
- `src/components/shared/section-header.tsx` — New shared component
- `src/components/shared/tag-badge.tsx` — Add Hash icon, review sizing
- `src/components/shared/post-row.tsx` — New shared component for data-table rows
- `src/app/globals.css` — Update prose overrides
- `src/app/series/[seriesSlug]/page.tsx` — Apply editorial patterns

---

## Task 5A-1: Dashboard Redesign

**Scope:** Align dashboard layout and visual identity with original codeshelf-nextjs `AdminDashboardClient.tsx` + `ContentListPanel.tsx`

### Current → Target

| Aspect | Current (Phase 5 planned) | Target (from original) |
|--------|--------------------------|----------------------|
| Header | Generic heading | Serif italic heading + Korean subtitle (`대시보드 // 나의 콘텐츠`) |
| Layout | Two-panel (list + preview) | Profile view + 2×2 `RecentSection` grid (Recent Posts, Recent Series, Recent Drafts, Recent Tags) |
| List panel | Basic searchable list | `ContentListPanel`: search input + sort dropdown, selected state `bg-stone-900 text-white`, `content-visibility: auto` optimization |
| Row items | Standard list items | `RecentItemRow`: icon + title/subtitle + hover edit/delete actions (opacity-0 → group-hover:opacity-100) |
| Density | Single density | Density-responsive via breakpoints: `fhd:` (1920px), `qhd:` (2560px), `uhd:` (3840px) — controls row count per section |
| Profile section | None | Top area: serif italic name, mono role text, avatar, join date, post/series/character stats |
| Labels | English only | Mono uppercase `text-[9px]-[11px] tracking-[0.2em]-[0.6em]` with Korean bilingual labels |
| Cards | `bg-card rounded-lg` | `bg-white border border-stone-200 rounded-sm` with `hover:shadow-sm` transition |

### Key Original Patterns to Reproduce

**Dashboard structure:**
```
<div> (h-[calc(100vh-4rem)], flex flex-col)
  ├── Profile section (px-8, border-b border-stone-200)
  │   ├── Avatar + name (font-serif italic) + role (mono, tracking-widest)
  │   └── Stats row: posts / series / characters (mono, stone-400)
  ├── Content grid (flex-1, grid grid-cols-2, gap-6, p-8, overflow-y-auto)
  │   ├── RecentSection "Recent Posts 최근 글"
  │   │   └── RecentItemRow[] (icon + title + subtitle + hover actions)
  │   ├── RecentSection "Recent Series 최근 시리즈"
  │   ├── RecentSection "Recent Drafts 최근 임시저장"
  │   └── RecentSection "Recent Tags 최근 태그"
  └── Footer bar (px-8, border-t, mono text-[10px]: total stats)
```

**ContentListPanel (for dedicated list views):**
```
<div> (flex flex-col, h-full)
  ├── Header (px-4 py-3, border-b)
  │   ├── Search input (text-sm, placeholder mono)
  │   └── Sort dropdown (font-mono text-[11px])
  ├── List (flex-1, overflow-y-auto)
  │   └── Item[] (px-4 py-3, border-b, cursor-pointer)
  │       ├── Selected: bg-stone-900 text-white
  │       ├── Hover: bg-stone-50
  │       └── content-visibility: auto (performance)
  └── Footer (px-4 py-2, border-t, mono: "N items")
```

### Files to Modify
- `src/app/dashboard/page.tsx` — Restructure to profile + grid layout
- `src/components/dashboard/dashboard-client.tsx` — 2×2 RecentSection grid, density-responsive
- `src/components/dashboard/content-list-panel.tsx` — Search, sort, selected state, content-visibility

---

## Task 5A-2: Post Editor Redesign

**Scope:** Align write/edit page with original codeshelf-nextjs `PostEditor.tsx` full-screen split-pane design

### Current → Target

| Aspect | Current (Phase 5 planned) | Target (from original) |
|--------|--------------------------|----------------------|
| Layout | Standard page with editor | Full-screen `h-screen bg-stone-50` split-pane |
| Header | Standard page header | `h-16 bg-white/80 backdrop-blur-sm border-b border-stone-200` floating header |
| Close button | Back link | `font-mono text-[10px] uppercase tracking-[0.3em]` close button with unsaved warning |
| Publish button | Standard button | `bg-stone-900 text-white rounded-sm font-mono text-[11px] uppercase tracking-[0.2em]` |
| Split pane | EasyMDE only | Left: markdown editor, Right: live preview (resizable divider) |
| Save indicator | None planned | Traffic light: green (synced) / yellow (saving) / red (error) — `text-[9px] mono` status |
| Checkpoint | localStorage recovery | Checkpoint timer display: `font-mono text-[10px]` countdown to next remote save |
| Auto-save | 1s local + 5s remote | Keep same intervals, add visual feedback via traffic light |
| Title input | Standard text input | Large `text-2xl font-serif` input, borderless, placeholder "Untitled" |

### Key Original Patterns to Reproduce

**Editor layout:**
```
<div> (h-screen, flex flex-col, bg-stone-50)
  ├── Header (h-16, bg-white/80 backdrop-blur-sm, border-b, flex items-center px-6)
  │   ├── Close button (font-mono text-[10px] uppercase tracking-[0.3em], hover:text-stone-900)
  │   ├── Traffic light (w-2 h-2 rounded-full, green/yellow/red + pulse animation)
  │   ├── Checkpoint timer (font-mono text-[10px] text-stone-400)
  │   └── Publish button (bg-stone-900 text-white rounded-sm px-4 py-1.5)
  ├── Title bar (px-8 py-4, bg-white border-b)
  │   └── Title input (text-2xl font-serif, border-none, w-full, placeholder="Untitled")
  └── Split pane (flex-1, flex, overflow-hidden)
      ├── Editor panel (flex-1, overflow-y-auto, p-8)
      │   └── Markdown textarea or EasyMDE
      ├── Resizable divider (w-1 bg-stone-200, cursor-col-resize, hover:bg-stone-400)
      └── Preview panel (flex-1, overflow-y-auto, p-8, bg-white)
          └── Rendered markdown (prose styling)
```

### Files to Modify
- `src/app/write/page.tsx` — Full-screen layout wrapper
- `src/app/edit/[id]/page.tsx` — Full-screen layout wrapper
- `src/components/admin/post-editor.tsx` — Split-pane with header bar, traffic light, checkpoint
- `src/components/admin/markdown-editor.tsx` — Editor panel styling

---

## Task 5A-3: Publish Modal Redesign

**Scope:** Align publish modal with original codeshelf-nextjs `PublishModal.tsx` two-column layout

### Current → Target

| Aspect | Current (Phase 5 planned) | Target (from original) |
|--------|--------------------------|----------------------|
| Size | Standard dialog | `w-[60vw] max-h-[85vh]` large modal |
| Layout | Single column form | Two-column: 55% form (left) + 45% OG preview (right) |
| Labels | Standard text labels | `font-mono text-[11px] uppercase tracking-[0.15em] text-stone-500` |
| Category picker | Dropdown | Combobox with search, colored category badges |
| Tag input | Basic tag pills | Autocomplete with validation (lowercase, max 13 chars, alphanumeric+hyphen), animated add/remove |
| Series picker | Basic select | Searchable list with sort, inline "Create new series" at bottom |
| OG preview | None | Right panel: mock social card preview (title, description, site URL, image placeholder) |
| Excerpt | Auto-generated | Auto-generated with manual edit toggle, character count indicator |
| Slug | Auto-generated | Auto-generated from title with manual edit, `slugify()` with `Date.now().toString(36)` fallback |

### Key Original Patterns to Reproduce

**Publish modal structure:**
```
<Dialog> (w-[60vw], max-h-[85vh])
  ├── Header (px-6 py-4, border-b)
  │   ├── Title "Publish 게시하기" (font-serif text-xl)
  │   └── Close button (rounded-sm)
  ├── Body (flex, flex-1, overflow-hidden)
  │   ├── Form column (w-[55%], overflow-y-auto, p-6, space-y-6)
  │   │   ├── Category (mono label + combobox with colored badges)
  │   │   ├── Tags (mono label + autocomplete input + tag pills)
  │   │   ├── Series (mono label + searchable picker + inline create)
  │   │   ├── Excerpt (mono label + textarea + char count)
  │   │   └── Slug (mono label + input + auto-generate toggle)
  │   └── Preview column (w-[45%], bg-stone-50, p-6, border-l)
  │       ├── "Preview 미리보기" header (mono label)
  │       └── OG card mock (bg-white rounded-sm shadow-sm border)
  │           ├── Image placeholder (bg-stone-100, aspect-video)
  │           ├── Title (font-serif text-lg, truncate)
  │           ├── Description (text-sm text-stone-500, line-clamp-2)
  │           └── URL (font-mono text-[11px] text-stone-400)
  └── Footer (px-6 py-4, border-t, flex justify-end gap-3)
      ├── Cancel (border border-stone-200 rounded-sm, mono)
      └── Publish (bg-stone-900 text-white rounded-sm, mono)
```

### Files to Modify
- `src/components/admin/publish-modal.tsx` — Two-column layout with OG preview
- `src/components/shared/category-badge.tsx` — Colored category badges (may need category color config)

---

## Reference: Original vs Current Component Map

| Original File | Current File | Gap |
|--------------|-------------|-----|
| `Bookshelf.tsx` (397 lines) | `bookshelf.tsx` (214 lines) | Major — completely different visual structure |
| `PostDetailLayout.tsx` (88 lines) | `post-detail-layout.tsx` (117 lines) | Major — 2-col vs 3-col, different content arrangement |
| `PostDetailClient.tsx` (99 lines) | (merged into layout) | Need to restructure |
| `ArticleContent.tsx` (189 lines) | `article-content.tsx` | Major — needs card wrapper, header section |
| `ArchiveSidebar.tsx` (212 lines) | `archive-sidebar.tsx` (198 lines) | Major — different header, labels, layout |
| `PostGrid.tsx` / `PostRow` (163 lines) | `archive-post-list.tsx` | Major — data rows vs card grid |
| `TagBadge.tsx` (55 lines) | `tag-badge.tsx` | Moderate — missing Hash icon, variant differences |
| Homepage `page.tsx` (98 lines) | `page.tsx` (99 lines) | Major — viewport-height vs scrollable, bookshelf-only vs sections |
| `AdminDashboardClient.tsx` (536 lines) | `dashboard-client.tsx` (not yet built) | Major — 2×2 grid with density, profile view, Korean labels |
| `ContentListPanel.tsx` (181 lines) | `content-list-panel.tsx` (not yet built) | Major — search/sort, selected `bg-stone-900`, content-visibility |
| `PostEditor.tsx` (899 lines) | `post-editor.tsx` (not yet built) | Major — full-screen split-pane, traffic light, checkpoint timer |
| `PublishModal.tsx` (846 lines) | `publish-modal.tsx` (not yet built) | Major — 2-column 60vw, OG preview, series picker with inline create |
