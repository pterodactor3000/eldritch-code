# Provider Adapters - Sanctified Alteration

Issue creation after roadmap write. Read tool schemas before calling - names below are typical.

## Discovery signals

Same as rites-of-data-harvest: server must list/create issues with `title` and `description`. Prefer providers that expose `save_issue`, `create_issue`, or equivalent.

Known providers: Linear, Jira, GitHub Issues.

## Issue title

Always set **title** to the full prefixed form:

```
// [S-NN]::[change-id] // <type>: <≤10 words>
```

Do not strip the prefix for any provider.

## Issue description template

```markdown
## Outcome

<slice Outcome field - one line>

## Acceptance Criteria

<user-supplied AC from intake>

## Roadmap

- **Slice:** S-NN
- **Change ID:** <change-id>
- **PRD refs:** <refs>
- **Prerequisites:** <refs or ->
- **Status:** <status>

## Plan

Run `/10x-plan <change-id>` when ready.
```

## Field mapping

| Concept | Linear | GitHub Issues | Jira |
| ------- | ------ | ------------- | ---- |
| Create | `save_issue` · `title` + `team` | create issue · `title` + repo | create issue · project + type |
| Description | `description` (markdown) | body | description |
| Project | `project` | project (v2) | project key |
| Milestone | `milestone` | milestone | fixVersion / sprint |
| Team | `team` (required on create) | - | - |
| State | `state` · default backlog/Todo | - | initial transition |
| Labels | `labels` · optional `change-id` | labels | labels/components |

## Context inference

When user does not specify team/project/milestone:

1. List recent issues or projects; match PRD `project` name from roadmap frontmatter.
2. If sacred-fabrication sync marker exists on project description, use mapped milestone when slice PRD refs overlap a stream chain.
3. If still ambiguous, include `- specify on approve` in preview and ask at Gate 2.

## Write pattern (Linear example)

```
save_issue:
  title: "// [S-04]::dashboard-tile-style // feat: themed header strip on dashboard"
  team: "<team>"
  project: "<project name if known>"
  milestone: "<milestone if known>"
  description: "<assembled template>"
  state: "Todo"
```

Pass literal newlines in description - do not escape markdown.

## Failure handling

- Roadmap written but issue failed → report identifier error; do not roll back roadmap.
- Duplicate Change ID in tracker (title search) → warn in preview if detected; on create failure suggest linking existing issue.

## Normalization

```text
Draft slice → Issue payload:
  title: prefixed string
  description: Outcome + AC + Roadmap + Plan sections
  project, milestone, team: optional strings
  labels: [change-id] when supported
```

Never invent team IDs or project UUIDs - use names the provider resolves.
