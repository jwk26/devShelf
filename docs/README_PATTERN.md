# README Pattern (AI-First)

Use this exact structure for each folder-level `README.md`.

```md
# <Folder Name>

## Scope
What this folder owns. Keep to 1-3 sentences.

## Key Paths
- `file-or-subfolder`: short responsibility note
- `file-or-subfolder`: short responsibility note

## Edit Rules
- What can be changed here safely
- What must stay in parent/other layers
- Naming/contract rules used in this folder

## Verify Before Exit
- Commands to run after edits in this folder
- Mention route/page flows to smoke test manually

## Pitfalls
- Known regressions/race conditions
- Cross-folder dependencies that can break silently
```

## Constraints
- Keep each README short (100-250 words preferred).
- Prefer concrete file paths over abstract description.
- Update README whenever contracts or data flow change.
