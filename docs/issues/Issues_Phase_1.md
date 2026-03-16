# Issues — Phase 1

## Issue 1: Next.js 16 middleware deprecation warning

- **Problem:** Build outputs `The "middleware" file convention is deprecated. Please use "proxy" instead.` (Next.js 16.1.6)
- **Root Cause:** Next.js 16 replaced `middleware.ts` with `proxy.ts` convention
- **Solution:** Deferred to Phase 7 — migrate `src/middleware.ts` to `src/proxy.ts` during polish
- **Learning:** Next.js 16 moves fast; check release notes before scaffolding middleware-dependent code

## Issue 2: Supabase schema applied via dashboard SQL editor

- **Problem:** No local Supabase CLI tooling (`supabase db push`) — schema applied directly in Supabase dashboard
- **Root Cause:** Project doesn't use local Supabase dev environment; migration file is for reference only
- **Solution:** Migration SQL kept in `supabase/migrations/` as canonical reference; applied manually via dashboard
- **Learning:** Document which SQL has been applied and where. The migration file is source of truth for schema shape, even if not applied via CLI.

## Summary

| # | Issue | Resolution |
|---|-------|------------|
| 1 | `middleware.ts` deprecated in Next.js 16 | Deferred to Phase 7 — migrate to `proxy.ts` |
| 2 | Schema applied via dashboard, not CLI | Migration file kept as canonical reference |
