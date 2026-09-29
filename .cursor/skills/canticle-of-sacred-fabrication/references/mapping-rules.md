# Mapping Rules — Sacred Fabrication

How `context/foundation/prd.md` and `context/foundation/roadmap.md` map to a project-management project and milestones.

## PRD → Project

| PRD source | Project field | Notes |
| ---------- | ------------- | ----- |
| Frontmatter `project` | **Name** | Required; primary match key for create vs update |
| Frontmatter `product_type`, `context_type`, `status` | **Labels / tags** | When provider supports labels on projects |
| Frontmatter `timeline_budget` | **Target date / summary** | Use `hard_deadline` when set; else omit dates — never invent |
| `## Vision & Problem Statement` | **Summary** (≤ 255 chars) + **Description** section | Summary = first sentence of vision |
| `## Success Criteria` | **Description** section `### Success Criteria` | Copy Primary, Secondary, Guardrails subsections |
| `## User Stories` (`US-NN`) | **Description** section `### User Stories` | One bullet per story: `US-NN: <title>` |
| `## Functional Requirements` (`FR-NNN`) | **Description** section `### Functional Requirements` | One bullet per FR line; preserve priority |
| `## Non-Goals` | **Description** section `### Non-Goals` | Copy bullets |
| `## Open Questions` | **Description** section `### Open Questions` | Copy numbered list |
| Frontmatter `version` | Sync marker + overview | Bumped version triggers update diff |

Do not map NFRs or Business Logic to separate tracker entities unless the user explicitly asks — keep them in the project description under optional `### NFRs` / `### Business Logic` subsections when present in PRD.

## Roadmap → Milestones

Primary source: `## Streams` table.

| Roadmap column | Milestone field | Notes |
| -------------- | --------------- | ----- |
| `Theme` | **Name** | Prefix with stream letter when helpful: `A — <Theme>` |
| `Chain` | **Description** opening line | Literal chain: `` `F-01` → `S-01` → `S-02` `` |
| `Note` | **Description** body | One paragraph on stream rationale |
| Slice rows in chain (from `## At a glance` + body) | **Description** scope bullets | For each ID in chain: `<ID> — <Outcome> — PRD refs: <refs>` |

### Fallback when `## Streams` is absent

1. Read `## At a glance` table rows in dependency order.
2. Group into milestones of 2–4 consecutive items when they share prerequisites; otherwise one milestone per `F-NN`/`S-NN`.
3. Name: `<ID>: <short outcome>` (truncate outcome to ~60 chars).

### Milestone ordering

Create/update milestones in stream table order (A → B → C). Do not reorder existing milestones unless the diff requires it — note reorder in audit comment.

## Sync Marker

Append to project description on every successful create/update:

```markdown
<!-- sacred-fabrication:sync
prd_version: <N>
roadmap_slices: <count>
streams: <comma-separated stream themes>
milestones: <name>=<provider-id or slug>, ...
synced_at: <YYYY-MM-DD>
-->
```

Hidden in rendered views on most providers. Used on next run for diff baseline.

## Diff Detection (update mode)

Compare current artifacts to sync marker (or live project state):

| Change type | Detected when | Audit mentions |
| ----------- | ------------- | -------------- |
| PRD version bump | `prd_version` increased | `PRD v<N>→v<M>` |
| New/changed FR or US | Text diff in PRD sections | Literal IDs |
| Stream added/removed/renamed | Streams table diff | Stream letter + theme |
| Chain membership change | Chain cell diff | Affected `F-NN`/`S-NN` IDs |
| Slice status flip in At a glance | Status column diff | ID + old→new status |
| Milestone scope change | Derived scope bullets diff | Milestone name + IDs |

Immaterial edits (whitespace, typo fixes with no ID change) may be omitted from audit unless the user asked for full fidelity.

## Description Assembly Template

```markdown
## Vision

<from PRD Vision & Problem Statement>

## Success Criteria

<from PRD>

## User Stories

- US-01: …
…

## Functional Requirements

- FR-001: …
…

## Non-Goals

…

## Open Questions

…

## Roadmap Streams

| Stream | Theme | Chain |
| ------ | ----- | ----- |
| … copied from roadmap.md Streams table … |

<!-- sacred-fabrication:sync … -->
```

Keep under provider size limits; if truncated, prioritize Vision, Success Criteria, Streams table, and sync marker.
