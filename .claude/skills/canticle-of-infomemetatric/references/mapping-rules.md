# Mapping Rules — Infomemetatric

How `context/foundation/roadmap.md` maps to task-management issues (and optional repository mirrors).

## Roadmap → Issue drafts

Primary sources, in order:

1. `## At a glance` table rows (`F-NN` / `S-NN`)
2. Matching bodies under `## Slices` (and foundation section when present)
3. `## Backlog Handoff` for suggested short titles

| Roadmap source | Issue field | Notes |
| -------------- | ----------- | ----- |
| Slice / foundation ID | Title prefix `[S-NN]` or `[F-NN]` | Required; zero-padded as in roadmap |
| **Change ID** | Title prefix `[change-id]` · label when supported | Kebab-case; unique |
| Backlog Handoff suggested title | `<type>: <description>` after prefix | Prefer over derived text |
| **Outcome** | Description `## Outcome` · fallback short title | One line |
| **PRD refs** | Description `## Roadmap` | Literal `FR-` / `US-` IDs |
| **Prerequisites** | Description `## Roadmap` | IDs or plain external state |
| **Status** | Description · optional state mapping | Do not force provider state unless user asks |
| **Risk** / **Blockers** / **Unknowns** | Description optional subsections | Include when non-empty |
| Acceptance criteria (if present in notes/body) | Description `## Acceptance Criteria` | Often absent on bulk seed; note when missing |
| Stream membership (`## Streams` chain) | Milestone attach when known | Match sacred-fabrication milestone names when sync marker exists |

### Foundation rows

`F-NN` rows use the same title prefix shape with `F-NN`. If Change ID is missing, derive a kebab slug from the outcome or title; note `derived change-id` in overview.

### Conventional-commit type

| Signal | Type |
| ------ | ---- |
| Default | `feat` |
| Fix / bug language in title or outcome | `fix` |
| Docs-only | `docs` |
| Chore / tooling | `chore` |
| Explicit user override | Use user type |

## Description template (primary)

```markdown
## Outcome

<slice Outcome — one line>

## Acceptance Criteria

<AC bullets when present>

## Roadmap

- **Slice:** S-NN | F-NN
- **Change ID:** <change-id>
- **PRD refs:** <refs>
- **Prerequisites:** <refs or —>
- **Status:** <status>

## Plan

Run `/rites-of-true-aim <change-id>` when ready.
```

When AC is absent, replace the Acceptance Criteria section with:

```markdown
## Acceptance Criteria

_None in roadmap. Add before implementation._
```

## Description template (mirror)

Same sections as primary, plus:

```markdown
## Tracker Mirror

- **Primary:** <provider> <IDENTIFIER>
- **Primary URL:** <url when known>
```

After mirror create, append or comment on the primary:

```markdown
## Repository Mirror

- **Mirror:** <provider> <IDENTIFIER or #N>
- **Mirror URL:** <url when known>
```

## Diff / idempotency

An existing primary issue **matches** a slice when any of:

1. Title contains `// [S-NN]::[change-id] //` (or `F-NN`) exactly for that pair
2. Title contains `// [S-NN]::` and the change-id slug appears in title or labels
3. Label `change-id` equals the slice Change ID (when provider supports labels)

| Diff result | Action |
| ----------- | ------ |
| No match | `create` |
| Exactly one match | `exists` (do not recreate) |
| Two or more matches | `ambiguous` (exclude from create until user resolves) |

Re-runs are idempotent: overview shows `exists` for already-seeded slices.

## Sync marker

After a successful create run, when a project description is writable and sacred-fabrication (or this canticle) owns the project, append or refresh:

```markdown
<!-- infomemetatric:sync
roadmap_slices: <count>
created: <S-01=ENG-101,S-02=ENG-102,...>
mirrored: <S-01=#12,S-02=#13,...>   <!-- omit when no mirror -->
synced_at: <YYYY-MM-DD>
-->
```

Replace an existing `<!-- infomemetatric:sync … -->` block in place. Do not duplicate markers. Skip marker writes when no project description API is available; summary still lists identifiers.

Prefer reading `<!-- sacred-fabrication:sync … -->` for milestone map when attaching milestones.

## Context inference

When the user does not specify team/project/milestone:

1. Match PRD or roadmap frontmatter `project` name via `list_projects`.
2. If sacred-fabrication sync marker exists, map stream → milestone ID for slices in that chain.
3. If still ambiguous, overview shows `: specify on approve` and Gate 1 accepts overrides.
