# Issues — Phase 2

## Issue 1: Missing Shadcn UI primitives (Input, Textarea, Label)

- **Problem:** Phase 2 settings form required `Input`, `Textarea`, `Label` components but only `Button` was added in Phase 1 Task 3
- **Root Cause:** Task 3 listed all base components but implementation only added `Button`
- **Solution:** Ran `pnpm dlx shadcn@latest add input textarea label separator` at the start of Phase 2
- **Learning:** When a phase lists component dependencies, verify they exist before delegating to Codex — missing components cause Codex to stop and ask

## Issue 2: Codex stopped to ask about missing components

- **Problem:** First Codex run terminated early requesting clarification on missing Shadcn components instead of implementing
- **Root Cause:** Prompt said "use Shadcn Input/Textarea/Label" + "no extra files" — Codex correctly identified the contradiction
- **Solution:** Added missing components, re-ran Codex with updated prompt clarifying components are available
- **Learning:** Preflight-check that all listed Shadcn components exist before firing Codex on form-heavy phases

## Issue 3: Protocol-relative open redirect bypass

- **Problem:** Gemini post-code review caught that `returnUrl.startsWith('/')` allows `//evil.com` (protocol-relative URL treated as external redirect by browsers)
- **Root Cause:** Standard `/` prefix check is insufficient — `//` also passes
- **Solution:** Added `|| returnUrl.startsWith('//')` guard in both `login-form.tsx` and `auth/callback/route.ts`
- **Learning:** Open redirect normalization must check both `!startsWith('/')` AND `startsWith('//')` — apply this pattern to every returnUrl/redirect handler

## Summary

| # | Issue | Resolution |
|---|-------|------------|
| 1 | Missing Shadcn Input/Textarea/Label | Added via `shadcn add` before re-running Codex |
| 2 | Codex stopped on missing component conflict | Re-launched after adding components |
| 3 | Protocol-relative open redirect bypass (`//evil.com`) | Added `startsWith('//')` guard in login form + callback route |
