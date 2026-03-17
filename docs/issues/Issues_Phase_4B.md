# Issues — Phase 4B (Design Alignment)

## Issue 1: generateBookDimensions return type change broke callers

- **Problem:** Changed `width` return type from `number` to `string` (Tailwind class like `'h-14'`). Any caller using `dimensions.width` as a pixel value would silently break.
- **Root Cause:** The bookshelf was redesigned from vertical spines (needed pixel width) to horizontal bars (needed Tailwind height class). The function signature changed meaning mid-phase.
- **Solution:** The only caller was `bookshelf.tsx`, which was fully rewritten in the same phase. No breakage occurred.
- **Learning:** When changing a utility function's return type, grep all callers before the change: `grep -r "generateBookDimensions" src/`. If multiple callers exist, either keep the old signature and add a new function, or update all callers atomically.

## Issue 2: ReactNode not imported in post-detail-layout.tsx

- **Problem:** `MetadataRow` used `ReactNode` as a type annotation but `ReactNode` was not imported from `'react'`.
- **Root Cause:** Wrote `children: ReactNode` without adding the import; the JSX transform handles rendering but not TypeScript type imports.
- **Solution:** Added `import type { ReactNode } from 'react'` before running the build.
- **Learning:** When writing type annotations for React primitives (`ReactNode`, `RefObject`, `CSSProperties`), always add the type import explicitly. The build catches it, but it's faster to add upfront.

## Issue 3: zsh glob expansion on bracket paths in git add

- **Problem:** `git add src/app/series/[seriesSlug]/page.tsx` failed with `no matches found: src/app/series/[seriesSlug]/page.tsx` in zsh.
- **Root Cause:** zsh treats `[...]` as a glob character class. Without quoting, it tries to match files with a single character from `s`, `e`, `r`, `i`, `e`, `s`, `S`, `l`, `u`, `g` — no match found.
- **Solution:** Quote the path: `git add 'src/app/series/[seriesSlug]/page.tsx'`
- **Learning:** Always quote bracket-containing paths in shell commands. Applies to `git add`, `cp`, `mv`, `cat`, etc. Next.js dynamic route directories (`[slug]`, `[id]`) always need quoting in zsh.

## Issue 4: globals.css @layer ordering

- **Problem:** The `@layer components` block was inserted inside the existing `@layer base` block (before the `.hljs` rules), splitting the base layer across two `@layer base { }` declarations.
- **Root Cause:** Inserted the new components layer at the wrong location in the file.
- **Solution:** Moved the insertion point to just before `@layer base { .hljs { ... } }`, keeping both layers separate and ordered correctly: `base` → `components` → `base` (hljs).
- **Learning:** When adding a new `@layer` block to `globals.css`, always check the full file structure first. The file has multiple `@layer base` blocks (root vars, dark vars, global resets, hljs). Insert `@layer components` between the resets block and the hljs block.

## Issue 5: Design spec vs implementation scope mismatch

- **Problem:** The 4B task specs described some features that were descoped in implementation: full viewport height bookshelf, play/pause auto-cycle control, statistics panel, "Explore archive" CTA with animated arrow, and table headers with bilingual labels.
- **Root Cause:** The spec was aspirational/comprehensive; implementation prioritized the core layout transformation and shared component patterns over decorative features.
- **Solution:** Implemented the structural and typographic changes (two-panel bookshelf, three-column post detail, data-table rows, SectionHeader, PostRow, TagBadge redesign). Decorative extras left for Phase 5 or polish pass.
- **Learning:** Flag aspirational vs essential scope in the spec. Mark items as `[required]` vs `[nice-to-have]` so the implementer can make informed cuts without accidentally omitting structural requirements.

---

## Summary

| # | Issue | Resolution |
|---|-------|------------|
| 1 | `generateBookDimensions` type change | Only one caller (rewritten same phase) — no breakage |
| 2 | Missing `ReactNode` import | Added `import type { ReactNode }` before build |
| 3 | zsh glob expansion on `[slug]` paths | Quote bracket paths in all shell commands |
| 4 | `@layer` ordering in globals.css | Insert `@layer components` before the hljs block |
| 5 | Spec scope vs implementation scope | Distinguish required vs nice-to-have in specs |
