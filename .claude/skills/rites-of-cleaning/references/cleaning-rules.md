# Cleaning Rules

Defaults for backlog cleaning after normalizing to the common shape. Read actual labels and statuses from MCP before applying - do not hardcode team-specific IDs.

## Common issue shape

Extends the rites-of-data-harvest shape with cleaning fields:

| Field | Used for |
| ----- | -------- |
| `identifier`, `title` | Plan and summary lines |
| `stateName` / `stateType` | Exclude done/canceled/duplicate from scan |
| `labels` | Skip re-tagging; detect existing duplicate markers |
| `assignee` | Missing-assignee tag |
| `description` | Acceptance-criteria detection |
| `milestone`, `project`, `cycleOrSprint`, `parentId` | Missing-milestone/epic tag |
| `updatedAt`, `createdAt` | Staleness |
| `duplicateOf`, `relatedRelations` | Duplicate detection |

## Active scope

Include only issues that are not Done, Canceled, or Duplicate. Resolve exact state names via the provider's status-list tool.

## Duplicate detection

Flag as duplicate candidate when **any** of:

- Provider exposes `duplicateOf` pointing to another open issue
- Label (case-insensitive): `duplicate`
- Another active issue has the same **normalized title** (trim, lowercase, collapse whitespace, strip `[...]` prefix)
- Title similarity ≥ 0.9 after normalization (minor wording drift only - use judgment; list both in plan)

When multiple issues match, pick **one canonical** issue to keep:

1. Has assignee (prefer over unassigned)
2. Has acceptance criteria in description
3. Has milestone/epic/cycle/project
4. Most recently updated
5. Lowest identifier / oldest created as tiebreaker

All others → close as duplicate of the canonical issue.

## Missing assignee

Tag `needs-assignee` when:

- `assignee` is null/empty
- Issue is active (not done/canceled/duplicate)

Skip if label already present (case-insensitive match on `needs-assignee`).

## Missing acceptance criteria

Tag `needs-acceptance-criteria` when description/body lacks acceptance criteria.

Treat as **present** when description contains **any** of:

- Heading (case-insensitive): `acceptance criteria`, `acceptance`, `AC:`, `definition of done`, `DoD`
- Markdown checklist with ≥ 2 items (`- [ ]` or `- [x]`) under an acceptance-related heading
- Provider custom field for acceptance criteria (Jira) with non-empty value

Treat as **missing** when description is empty or only has a title-level stub with no checklist or AC section.

Skip if label `needs-acceptance-criteria` already present.

## Missing milestone / epic / cycle

Tag `needs-milestone` when **all** of the following are empty:

| Provider | Fields checked (any one satisfies) |
| -------- | ---------------------------------- |
| Linear | `milestone`, `project`, `cycle`, `parentId` (epic) |
| GitHub | milestone, project (v2), parent issue / epic link |
| Jira | fix version, epic link, sprint |

Note in the plan which field type the provider uses (`milestone`, `epic`, `cycle`, `project`).

Skip if label `needs-milestone` already present.

## Stale issues

Tag `stale` when:

- Issue is active
- `updatedAt` is **≥ 14 days** before today (calendar days, UTC)
- Not already labeled `stale`

Staleness is independent of assignee - stale assigned work gets flagged too.

## Label bootstrap

Before tagging, list existing labels. Create missing cleaning labels if the provider supports label creation:

| Label | Suggested color | Purpose |
| ----- | --------------- | ------- |
| `needs-assignee` | `#f2c94c` | No owner |
| `needs-acceptance-criteria` | `#eb5757` | No AC / DoD |
| `needs-milestone` | `#9b51e0` | No milestone/epic/cycle |
| `stale` | `#828282` | Untouched ≥ 14 days |

Only create labels the user approved applying. Prefer team-scoped labels when the provider requires a team ID.

## Execution limits

- Batch writes in groups of ≤ 10; report progress between batches on large plans.
- On partial failure, continue remaining items and list failures under `[Skipped / failed]`.
- Never delete issues - close or tag only.
