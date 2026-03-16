# Issues — Phase 3

## Issue 1: Codex stops to ask questions (3 runs needed)

- **Problem:** Codex stopped implementation twice to ask clarifying questions instead of writing code. First about a `skeleton.tsx` file conflict, then about avatar fallback behavior when `avatar_url` is empty.
- **Root Cause:** Codex (gpt-5.4) defaults to asking when it encounters ambiguity, even when the answer is inferrable from context. This is the same pattern seen in Phase 2 with missing Shadcn components.
- **Solution:** Added explicit "Do NOT ask questions — make reasonable design decisions and proceed" instruction to the Codex prompt, plus pre-answered all likely decision points (e.g., "use initial letter fallback for empty avatars", "leave skeleton.tsx untouched").
- **Learning:** Always include "Do NOT ask questions" and pre-answer 3-5 likely ambiguities in every Codex prompt. Budget 2-3 Codex runs per phase.

## Issue 2: Gemini post-code caught CLS and scroll containment gaps

- **Problem:** Avatar `<img>` in UserNav lacked explicit `width`/`height` attributes (CLS risk). Mobile nav drawer and modal wrapper lacked `overscroll-behavior: contain` (background scroll leakage on touch).
- **Root Cause:** Codex focused on functionality and accessibility but missed layout shift prevention and touch device scroll containment.
- **Solution:** Added `width={32} height={32}` to avatar img. Added `overscroll-contain` Tailwind class to mobile-nav drawer and modal-wrapper dialog.
- **Learning:** Gemini post-code reviews consistently catch layout/touch issues that Codex misses. Always run both pre-code and post-code Gemini reviews.

## Summary

| # | Issue | Resolution |
|---|-------|------------|
| 1 | Codex stops to ask questions | "Do NOT ask questions" instruction + pre-answered decisions |
| 2 | Missing CLS prevention + scroll containment | Added width/height to img, overscroll-contain to drawer/modal |
