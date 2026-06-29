---
name: rites-of-sanctified-alteration
description: Add a new vertical slice to context/foundation/roadmap.md with acceptance criteria, matching existing slice schema. Shows a roadmap preview and MCP issue-tracker preview, writes the slice on approval, then optionally creates a matching task via MCP (Linear, Jira, GitHub Issues). Issue titles use the // [S-NN]::[change-id] // conventional-commit prefix. Use when the user asks to add a roadmap slice, create a slice, alter the roadmap, or invokes rites-of-sanctified-alteration.
---

# Sanctified Alteration

Use this skill when the user says "add a slice", "new roadmap slice", "create slice", "alter roadmap", or "rites-of-sanctified-alteration".

**Roadmap writes are forbidden until Step 6 approval. Issue creation is forbidden until Step 8 approval.**

## Workflow

1. **Locate artifacts** - read `context/foundation/roadmap.md` fully. Read `context/foundation/prd.md` when validating PRD refs. If roadmap is missing, stop and point at `/10x-roadmap` unless the user supplies a path.
2. **Parse baseline** - list existing `S-NN` / `F-NN` IDs, slice body pattern, and `## At a glance` / `## Backlog Handoff` table shape from the live file. Next slice ID = highest `S-NN` + 1 (zero-padded).
3. **Intake** - gather fields per [slice-schema.md](references/slice-schema.md). Infer what you can from the user's message; ask in chat for gaps. **Always collect acceptance criteria** before preview (Step 4).
4. **Build draft** - assemble slice body, At a glance row, and Backlog Handoff row. Validate PRD refs against `prd.md` when available.
5. **Preview** - emit roadmap preview and issue-tracker preview (see Output Format). End with roadmap approval ask. **No tools in this turn.**
6. **Write roadmap** - on `approve`, insert slice in dependency order under `## Slices`, append At a glance and Backlog Handoff rows, bump roadmap frontmatter `updated`. Do not reorder unrelated slices.
7. **Issue gate** - after successful roadmap write, ask whether to create the matching MCP task. **Separate turn; wait for reply.**
8. **Create issue (optional)** - on `yes` / `create issue`, discover task-management MCP, read schemas, create issue with prefixed title and AC in description. Attach milestone/project when user named one or sync marker from sacred-fabrication exists.
9. **Summary** - report slice ID, files touched, issue identifier if created, and failures.

## Intake - Required Questions

Ask in plain chat (never `AskQuestion` during preview). Minimum before preview:

| Field | Required | Default |
| ----- | -------- | ------- |
| Slice title | yes | - |
| Outcome (`user can …`) | yes | derive from title |
| Change ID (kebab-case) | yes | propose from title |
| Acceptance criteria | **yes** | - |
| PRD refs (`FR-`, `US-`) | yes | warn if absent from PRD |
| Prerequisites | yes | `-` if none |
| Status | no | `proposed` |
| Risk | no | one line from context |
| Conventional-commit type | no | `feat` unless fix/chore/docs fits |

Acceptance criteria format - prefer Given/When/Then bullets or a `#### Acceptance Criteria` checklist (≥ 2 items). Stored in the **issue description**, not in the roadmap slice body (schema has no AC field).

## Issue Title Format

Use this prefix **verbatim** on every created issue:

```
// [S-NN]::[change-id] // <type>: <description under 10 words>
```

| Part | Rule |
| ---- | ---- |
| `S-NN` | Assigned slice ID |
| `change-id` | Kebab-case Change ID from slice |
| `<type>` | Conventional commit type: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf` |
| `<description>` | Imperative, ≤ 10 words, no trailing period |

Example: `// [S-04]::dashboard-tile-style // feat: themed header strip on dashboard`

## Approval Gates

### Gate 1 - roadmap (after preview)

```
Approve **roadmap slice S-NN**? Reply: `approve` · `skip` · or describe edits.
```

- Default: no write.
- Never write roadmap in the same turn as preview.

### Gate 2 - issue (after roadmap write)

```
Create matching task in <provider>? Reply: `yes` · `no` · or `<team/project/milestone overrides>`.
```

- Default: no issue.
- Skip Gate 2 when no task-management MCP is available - say so after roadmap write.

## Output Format

In emitted output, **all characters between `[` and `]` must be UPPERCASE** in section headers and labels. Issue title prefixes (`// [S-NN]::[change-id] //`) keep documented ID casing for tracker writes.

### Preview (before roadmap approval)

```
// [SANCTIFIED ALTERATION - PREVIEW] //
Next ID: S-NN · Change ID: <kebab-case> · Status: <proposed | ready | blocked>

// [ROADMAP - AT A GLANCE ROW] //
| S-NN | <change-id> | <outcome truncated> | <prerequisites> | <PRD refs> | <status> |

// [ROADMAP - SLICE BODY] //
### S-NN: <Slice title>

- **Outcome:** <user can …>
- **Change ID:** <change-id>
- **PRD refs:** <refs>
- **Prerequisites:** <refs or ->
- **Parallel with:** <IDs or ->
- **Blockers:** <external or ->
- **Unknowns:** <bullets or ->
- **Risk:** <one line>
- **Status:** <status>

// [ROADMAP - BACKLOG HANDOFF ROW] //
| S-NN | <change-id> | <suggested issue title sans prefix> | <yes | no> | <notes> |

// [ISSUE TRACKER PREVIEW] //
Provider: <name or `none detected`>
Title: // [S-NN]::[change-id] // <type>: <≤10 words>
Team/Project: <inferred or `- specify on approve`>
Milestone: <inferred or ->
Description:
## Outcome
<one line>

## Acceptance Criteria
<user-supplied AC>

## Roadmap
- Slice: S-NN
- Change ID: <change-id>
- PRD refs: <refs>
- Prerequisites: <refs>

Approve **roadmap slice S-NN**? Reply: `approve` · `skip` · or describe edits.
```

Preview rules:

- Slice body must match an existing slice's field order and markdown shape exactly.
- Issue title uses the full prefix; Backlog Handoff `Suggested issue title` column stays **without** the prefix (human-readable short title).
- If PRD refs are not in `prd.md`, note `(?)` in preview - still allow if user confirms.

### Summary (after execution)

```
// [ALTERATION SUMMARY] //
Slice: S-NN · Change ID: <change-id> · Executed: <YYYY-MM-DD>

// [ROADMAP] //
roadmap.md - <updated | skipped>

// [ISSUE] //
<IDENTIFIER> - <created | skipped> - <title>
… or `None - user declined or no MCP.`

// [FAILED] //
<item> - <reason>
… or `None.`
```

## Streams Note

New slices do not auto-edit `## Streams`. After write, if the slice belongs to an obvious stream chain, tell the user which stream row to extend - or offer a follow-up edit if they reply with stream letter.

## Additional Resources

- Slice field semantics and insertion rules: [references/slice-schema.md](references/slice-schema.md)
- Issue creation and description template: [references/provider-adapters.md](references/provider-adapters.md)
