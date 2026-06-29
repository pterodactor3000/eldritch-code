# Provider Adapters — Sacred Fabrication

Map each MCP provider to the common project shape before create/update. Read tool schemas first — names below are typical, not guaranteed.

## Discovery signals

A server is a **project-management provider** when its tools can:

- List or search projects
- Create or update a project (name + description at minimum)
- List or create milestones, epics, phases, or iterations scoped to a project

Known providers (not exhaustive): Linear, Jira, GitHub Projects. New providers follow the same parse → map → overview → execute flow.

A server is a **repository provider** when its tools can:

- List pull requests for a repository
- Create a comment or review comment on a pull request
- Resolve issue links from PR metadata

Known providers: GitHub (`gh` MCP or GitHub MCP), GitLab. Skip PR propagation when none is available.

## Field mapping — project

| Concept | Linear | Jira | GitHub Projects |
| ------- | ------ | ---- | --------------- |
| List projects | `list_projects` | project search / `getProject` | org/user project list |
| Create/update | `save_project` | create/update project API | create/update project |
| Name | `name` | `name` | `title` |
| Summary | `summary` | — | `short_description` |
| Description | `description` (markdown) | `description` | project body / README field |
| Labels | `labels` | labels/components | labels |
| Target date | `targetDate` | release date / custom field | — |
| Team scope | `addTeams` / `setTeams` | project lead / category | org repo scope |
| Match existing | `list_projects` filter by name | JQL / search by name | list by title |

## Field mapping — milestones

| Concept | Linear | Jira | GitHub Projects |
| ------- | ------ | ---- | --------------- |
| List | `list_milestones` · `project` | fixVersions / sprints in project | milestones / iterations |
| Create/update | `save_milestone` · `project` + `name` | create version / sprint | create milestone |
| Name | `name` | `name` | `title` |
| Description | `description` | description | body |
| Target date | `targetDate` | release date | due_on |
| Comment on milestone | `save_comment` · `milestoneId` | comment on version | — |

## Field mapping — audit comments

| Target | Linear | Jira | GitHub |
| ------ | ------ | ---- | ------ |
| Project | `save_comment` · `projectId` | project comment (if supported) or description append | issue/discussion — prefer project-level when available |
| Milestone | `save_comment` · `milestoneId` | version comment | — |
| Pull request | — | — | `create_pull_request_comment` / review comment API |

Resolve milestone UUIDs via `list_milestones` before commenting — names alone are not accepted on all providers.

## Fetch patterns — create flow

1. **Teams / org context** — one call when provider requires team for project creation.
2. **Existing project check** — list/search by PRD `project` name before create.
3. **Create project** — name, summary, description (assembled template + empty sync marker).
4. **Create milestones** — one call per stream; set description from chain + slice scope.
5. **Finalize sync marker** — update project description with populated marker (milestone IDs filled in).

## Fetch patterns — update flow

1. **Get project** — fetch current description and milestone list.
2. **Parse sync marker** — extract baseline; diff against fresh parse.
3. **Update project description** — merge changed PRD sections; refresh Streams table; bump sync marker.
4. **Upsert milestones** — update by name match; create new streams; do not delete milestones unless user approved deletion in overview.
5. **Post audit comments** — project first, then each changed milestone.
6. **PR propagation** — see below.

## PR linking patterns

Resolve linked issues per PR using the smallest reliable set of calls:

| Provider | Link signals |
| -------- | ------------ |
| GitHub | PR body `Fixes #N` / `Closes`; branch name containing issue key; `linked_issues` in GraphQL if exposed |
| GitLab | `Closes #N` in description; milestone overlap |
| Linear + GitHub | Linear issue attachment URLs; branch naming `ENG-123-feature` |

For each linked issue, extract roadmap/PRD refs from:

- Issue title/body (`S-01`, `FR-003`, change-id slugs)
- Issue labels (`change-id`, slice IDs)
- Milestone/epic membership matching fabrication milestones

**In scope** when any extracted ref intersects the current diff set from Step 4.

## Normalization

```text
Raw (provider-specific) → Common shape:
  projectId, projectName, description, summary, labels[],
  milestones[]: { id, name, description, targetDate },
  syncMarker: { prdVersion, streams[], milestoneMap, syncedAt } | null
```

```text
Raw PR → Common shape:
  prNumber, title, url, state, linkedIssueIds[], linkedIssueRefs[]
```

Empty values stay empty. Never invent project IDs, milestone IDs, or PR links.

## Write safety

- Merge labels; do not replace entire label set if API replaces rather than merges.
- Append sync marker; do not duplicate markers — replace the existing `<!-- sacred-fabrication:sync … -->` block in place.
- Idempotent re-run: matching name + unchanged marker → overview shows "already in sync"; skip writes unless user approves refresh.
