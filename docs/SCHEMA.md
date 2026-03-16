# SCHEMA — Data Model & Access Control

> Canonical SQL source: `supabase/migrations/00001_initial_schema.sql`
> Adapted from codeshelf-nextjs schema. Key changes: removed admin role, added profiles table with self-registration, author-owns-content RLS.

## Table of Contents

- [Tables](#tables)
- [Row Level Security](#row-level-security)
- [Triggers](#triggers)
- [Key Queries](#key-queries)

---

## Tables

### profiles

Extends Supabase `auth.users`. Auto-created on signup via trigger.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK, references `auth.users(id)` ON DELETE CASCADE |
| `username` | `text` | UNIQUE, NOT NULL, regex: `^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$` |
| `display_name` | `text` | NOT NULL, default `''` |
| `bio` | `text` | NOT NULL, default `''` |
| `avatar_url` | `text` | NOT NULL, default `''` (from OAuth provider) |
| `website_url` | `text` | NOT NULL, default `''` |
| `created_at` | `timestamptz` | NOT NULL, default `now()` |

### series

Book-like groupings of posts.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `author_id` | `uuid` | FK → profiles, ON DELETE CASCADE, NOT NULL |
| `slug` | `text` | NOT NULL, UNIQUE with `(author_id, slug)` |
| `title` | `text` | NOT NULL |
| `description` | `text` | default `''` |
| `category` | `text` | NOT NULL, FK → categories(name) ON UPDATE CASCADE |
| `color_theme` | `text` | default `'bg-card'` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()` |

Indexes: `idx_series_slug`, `idx_series_author_id`

### posts

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `author_id` | `uuid` | FK → profiles, ON DELETE CASCADE, NOT NULL |
| `series_id` | `uuid` | FK → series, ON DELETE SET NULL |
| `series_order` | `integer` | Position in series (1, 2, 3...) |
| `slug` | `text` | NOT NULL, UNIQUE with `(author_id, slug)` |
| `title` | `text` | NOT NULL |
| `content` | `text` | NOT NULL, default `''` (raw markdown) |
| `excerpt` | `text` | default `''` (auto-generated, ~160 chars) |
| `category` | `text` | FK → categories(name) ON UPDATE CASCADE |
| `published` | `boolean` | default `false` |
| `character_count` | `integer` | NOT NULL, default `0` |
| `shadow_title` | `text` | Shadow draft title (null = no pending edit) |
| `shadow_content` | `text` | Shadow draft content |
| `shadow_updated_at` | `timestamptz` | Shadow draft timestamp |
| `published_at` | `timestamptz` | Set on first publish |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()` (auto-updated via trigger) |

Indexes: `idx_posts_author_id`, `idx_posts_series_id`, `idx_posts_slug`, `idx_posts_published`, `idx_posts_published_at` (DESC), `idx_posts_shadow_updated_at` (WHERE NOT NULL)

### categories

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `text` | UNIQUE, NOT NULL |
| `created_at` | `timestamptz` | default `now()` |

Seed data: `API`, `DOCS`, `LIB`, `TOOL`, `DEV`, `CLOUD`, `DATA`

### tags

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `text` | UNIQUE, NOT NULL, regex: `^[a-z0-9-]+$`, max 13 chars |
| `created_at` | `timestamptz` | default `now()` |

### post_tags (junction)

| Column | Type | Constraints |
|--------|------|-------------|
| `post_id` | `uuid` | FK → posts, ON DELETE CASCADE |
| `tag_id` | `uuid` | FK → tags, ON DELETE CASCADE |
| PK | composite | `(post_id, tag_id)` |

Index: `idx_post_tags_tag_id`

---

## Row Level Security

All tables have RLS enabled. The model is **author-owns-their-content** — no admin role.

### profiles

| Operation | Policy |
|-----------|--------|
| SELECT | Anyone (public profiles) |
| INSERT | — (trigger creates on signup) |
| UPDATE | Own row: `auth.uid() = id` |
| DELETE | — (cascades from auth.users) |

### series

| Operation | Policy |
|-----------|--------|
| SELECT | Anyone |
| INSERT | Authenticated: `auth.uid() = author_id` |
| UPDATE | Own: `auth.uid() = author_id` |
| DELETE | Own: `auth.uid() = author_id` |

### posts

| Operation | Policy |
|-----------|--------|
| SELECT | Published posts: anyone. Unpublished: own only (`auth.uid() = author_id`) |
| INSERT | Authenticated: `auth.uid() = author_id` |
| UPDATE | Own: `auth.uid() = author_id` |
| DELETE | Own: `auth.uid() = author_id` |

### categories

| Operation | Policy |
|-----------|--------|
| SELECT | Anyone |
| INSERT | Authenticated (any user can create a category) |
| UPDATE | — |
| DELETE | — |

### tags

| Operation | Policy |
|-----------|--------|
| SELECT | Anyone |
| INSERT | Authenticated (any user can create a tag) |
| UPDATE | — |
| DELETE | — (orphan cleanup via server action) |

### post_tags

| Operation | Policy |
|-----------|--------|
| SELECT | Anyone |
| INSERT | Post author: `EXISTS (SELECT 1 FROM posts WHERE id = post_id AND author_id = auth.uid())` |
| DELETE | Post author: same check |

---

## Triggers

1. **`on_auth_user_created`** — after INSERT on `auth.users`, creates a `profiles` row with:
   - `username` from OAuth metadata (falls back to `user-{id_prefix}`)
   - `display_name` from OAuth `full_name` or `name` metadata
   - `avatar_url` from OAuth `avatar_url` metadata

2. **`posts_updated_at`** — before UPDATE on `posts`, sets `updated_at = now()`

3. **`series_updated_at`** — before UPDATE on `series`, sets `updated_at = now()`

---

## Key Queries

| Query | Used by | Pattern |
|-------|---------|---------|
| All series with post counts | Homepage `/` (bookshelf) | `series` + LEFT JOIN `posts` (published) GROUP BY, with author join |
| Posts in a series | `/series/[slug]` | `posts` WHERE `series_id` matches, ORDER BY `series_order` |
| Single post + metadata | Post detail | Single `posts` + profile join + tags via `post_tags` |
| Archive with filters | `/archive` | `posts` (published) with optional category/tag filter, paginated |
| Search across content | Search modal | `posts` + `series` filtered by title ILIKE, client-side |
| User's posts (all states) | `/dashboard` | `posts` WHERE `author_id = auth.uid()`, both published and drafts |
| User's series | `/dashboard` | `series` WHERE `author_id = auth.uid()` |
| Shadow draft check | Edit page | `posts` WHERE `id` matches AND `shadow_updated_at IS NOT NULL` |
| Tag autocomplete | Publish modal | `tags` ORDER BY name, filtered ILIKE |
| Category autocomplete | Publish modal | `categories` ORDER BY name |
| Orphan tag cleanup | After post mutation | DELETE `tags` WHERE NOT EXISTS in `post_tags` |

### Key Changes from codeshelf-nextjs

| Change | Why |
|--------|-----|
| Added `profiles` table | Self-registration needs user profiles (codeshelf had `user_profiles` with only `is_admin`) |
| Added `author_id` to `series` and `posts` | Author ownership — codeshelf had no author column (single admin authored everything) |
| Removed `user_profiles.is_admin` | No admin role in rebuild |
| Removed `is_admin()` function | No admin role |
| Changed RLS from admin-based to ownership-based | `auth.uid() = author_id` instead of `is_admin()` |
| Removed `author_name`, `author_role`, `author_avatar` from `posts` | Replaced by `author_id` FK → profiles (normalized) |
| Removed `meta_volume`, `meta_reference`, `meta_version`, `read_time`, `complexity` from `posts` | Over-engineered metadata. Character count + category sufficient |
| Removed `is_recent`, `is_latest` from `series` | Compute at query time from `updated_at` instead of storing flags |
| Slug uniqueness scoped to author | `UNIQUE(author_id, slug)` — different authors can use the same slug |
