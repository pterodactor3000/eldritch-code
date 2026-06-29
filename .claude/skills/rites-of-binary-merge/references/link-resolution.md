# Link Resolution - Binary Merge

Resolve which tracker issues are involved in the current branch. Read schemas before MCP fetches.

## Resolution order

Collect candidates from all sources; dedupe by identifier; verify each via `get_issue` (or equivalent).

| Priority | Source | Pattern |
| -------- | ------ | ------- |
| 1 | Branch name | `<TEAM>-123`, `#123`, `S-NN`, `<change-id>`, `feature/<change-id>` |
| 2 | Commit messages | `Fixes #N`, `Closes TEAM-123`, `Refs FR-001` (issue IDs only for Fixes/Closes) |
| 3 | `context/changes/` | Folder name = change-id; read `change.md` for linked issue ID if present |
| 4 | Issue title prefix | `// [S-NN]::[change-id] //` in tracker search by change-id or slice ID |

## Branch name patterns

```text
ENG-123-short-desc          → ENG-123
feature/dashboard-tile      → search issues titled *dashboard-tile* or change-id match
S-03-auth-flow              → search // [S-03]:: in titles
change-id-only-branch       → match roadmap Backlog Handoff / issue labels
```

## Commit message patterns

Extract issue identifiers from:

- `Fixes #123`, `Fixes TEAM-123`, `Closes #123`
- `Fixes ENG-123, ENG-124` (multiple)
- Footer `Refs:` lines - informational only; do not treat as auto-close unless `Fixes`/`Closes`

Do **not** link from bare `FR-NNN` or `US-NN` unless an issue title/description explicitly carries that ref and matches the change scope.

## context/changes/ lookup

When `context/changes/<change-id>/change.md` exists:

- Parse `Change ID`, roadmap slice refs (`S-NN`), and any `Issue:` / `Tracker:` line if present.
- Search tracker for issues whose title contains `[change-id]` or assigned label `change-id`.

## Verification

For each candidate:

1. Fetch issue; confirm not done/canceled.
2. Confirm relevance: branch/commit/change-id appears in title, description, or labels - or user named the issue explicitly.
3. Drop duplicates and cross-repo false positives (wrong team prefix).

## Involved issue set

Final set = verified linked issues. Empty set is valid - PR still created; no `Fixes` lines unless user supplies IDs; no Synaptic comments unless user names issues to notify.

User override: `approve ENG-123, ENG-124` adds those IDs even if heuristics missed them.

## PR body linkage

For each involved issue, add to PR body:

```markdown
Fixes <IDENTIFIER>
```

Use provider-native close keywords (`Fixes`, `Closes`, `Resolves`) so merge auto-closes when configured.

## One sentence brief

Derive from:

1. PR title (strip conventional-commit prefix), or
2. First commit subject, or
3. Issue outcome line from linked issue description

Example: `https://github.com/org/repo/pull/42 - Adds themed dashboard header strip.`
