# PRD — CodeShelf

## Table of Contents

- [Overview](#overview)
- [Target Users](#target-users)
- [Core Features](#core-features)
- [Explicit Non-Features](#explicit-non-features)
- [Auth Model](#auth-model)
- [Scale Constraints](#scale-constraints)
- [Design Direction](#design-direction)

---

## Overview

A developer publishing platform built around the bookshelf metaphor. Authors write technical content organized into series (books) displayed on a virtual shelf. Readers browse and discover content through an interactive bookshelf view, archive listings, and post detail pages.

**Tagline:** "Write once. Index forever."

## Target Users

- **Authors:** Developers who want a structured publishing platform with markdown support, shadow drafts, and auto-save. Self-registration via OAuth — no admin gatekeeping.
- **Readers:** Developers browsing and discovering technical content organized by series, categories, and tags. No account needed to read.

## Core Features

| Feature | Description |
|---------|-------------|
| OAuth self-registration | Google + GitHub sign-in, profile auto-created on first login |
| Bookshelf view | Interactive book volumes on a virtual shelf — height/width driven by post count and title length |
| Series detail page | All posts in a series with series metadata, navigation between posts |
| Archive view | Grid/table view with filtering by category, tag, and sorting (pagination, not infinite scroll) |
| Post detail page | Rendered markdown with table of contents, series navigation sidebar |
| Markdown editor | EasyMDE-based editor with preview toggle |
| Shadow draft system | Edit published posts without affecting live content until explicit publish |
| Auto-save | Hybrid local (1s debounce) + remote (5s debounce, 90s force) with checkpoint crash recovery |
| Search modal | Keyboard-accessible (Cmd/Ctrl+K) search overlay across posts, series, tags |
| Series + Categories | Organize posts into series (books) and categories (API, DOCS, LIB, TOOL, DEV, CLOUD, DATA) |
| Tag system | Freeform tags per post with autocomplete, validation, and orphan cleanup |
| Dark mode | System-aware with manual toggle (NEW — not in codeshelf-nextjs) |
| Author profiles | Display name, bio, avatar from OAuth provider |
| Responsive | Mobile through 4K UHD (sm, md, lg, laptop, fhd, qhd, uhd breakpoints) |
| Skeleton loaders | Layout-matching placeholders during async loading with reduced-motion support |
| Publish modal | Two-column publish flow with OG preview, series picker, category/tag input, inline series creation |

## Explicit Non-Features

These are intentional omissions, not gaps. Items marked `(audit)` were found in codeshelf-nextjs and explicitly excluded from the rebuild.

| Non-Feature | Reason |
|-------------|--------|
| AI-powered semantic discovery | Mockup advertised it; not building it |
| Automated repository indexing | Out of scope |
| Source-linked validation | Out of scope |
| Code execution blocks | Code blocks are display-only |
| Newsletter / email integration | Out of scope |
| Analytics dashboard | Out of scope |
| RSS feed | Out of scope |
| Admin role / email allowlist `(audit)` | Everyone owns their own content equally |
| Infinite scroll `(audit)` | Pagination only — simpler, more predictable |
| View count tracking `(audit)` | Column existed but no tracking implemented; removing |
| Comment system `(audit)` | DB schema existed with no complete UI; removing entirely |
| Comment approval workflow `(audit)` | Removed with comment system |
| Delayed post grid `(audit)` | Artificial delay wrapper; unnecessary |
| OpenGraph preview generation | Keep in publish modal only; no server-side OG image generation |

## Auth Model

- Self-registration via Google and GitHub OAuth (Supabase Auth)
- No admin role — each author manages their own content only
- Profile auto-created on first login via database trigger
- Protected routes: `/dashboard`, `/write`, `/edit/[id]`, `/settings`
- Public routes: everything else (homepage, series, archive, post detail, login)

## Scale Constraints

- ~10-50 authors, ~500-1000 posts total
- Read-heavy, write-light workload
- No need for full-text search infrastructure — client-side filtering sufficient at this scale
- Pagination for all list views (no infinite scroll)
- ISR with `revalidatePath` on mutations

## Design Direction

Verified from codeshelf-nextjs audit (see `docs/DESIGN_AUDIT.md`):

- **Background:** Warm off-white (`#fafaf7`) — distinct from tcrei's cool zinc
- **Palette:** Stone scale — `stone-50` through `stone-900`, warm neutral
- **Accent:** Full orange scale (50-900) for links, selection, focus, badges, active states
- **Headings:** Playfair Display serif — italic for section headings, bold for page titles
- **Body + Metadata:** Pretendard Variable for everything (no mono font — see `DESIGN_TOKENS.md` Intentional Departures)
- **Metadata style:** Small Pretendard (9-12px) with wide letter-spacing (0.1-0.6em), uppercase
- **Shadows:** Subtle layered shadows for depth (book cards, hover states)
- **Borders:** Stone-200 hairlines
- **Radius:** Mixed — `rounded-lg` default, `rounded-full` for tags/avatars, `rounded-sm` for book cards
- **Dark mode:** Stone palette inverted, orange accent preserved
- **Bookshelf metaphor:** Books with dynamic height/width based on content, auto-rotating preview, "recent" indicators

Full token spec in `docs/DESIGN_TOKENS.md`.
