# Provider Adapters - Cleaning

Discovery and normalization follow the same patterns as rites-of-data-harvest. This file covers **cleaning-specific** reads and writes.

## Discovery signals

Same as rites-of-data-harvest: server must list/search issues and return identifier, title, and status. Prefer a provider that also exposes update/save and label tools.

## Field mapping (cleaning fields)

| Concept | Linear | GitHub Issues | Jira |
| ------- | ------ | ------------- | ---- |
| Close duplicate | `save_issue` · `state: "duplicate"` · `duplicateOf: "<canonical>"` | Close issue · `state_reason: "not_planned"` + comment linking canonical | Transition to Duplicate / link duplicate |
| Add label | `save_issue` · `labels: ["needs-assignee", …]` (append) | Add labels via issue update API | Add label field |
| Create label | `create_issue_label` | Create label if missing | Create label component |
| Milestone/epic | `milestone`, `project`, `cycle`, `parentId` | milestone, project, parent | epic link, sprint, fixVersions |
| Acceptance criteria | `description` markdown | issue body | description or custom field |
| Staleness filter | `list_issues` · `updatedAt: "-P14D"` (for targeted fetch) | `updated:<'YYYY-MM-DD'` in search | JQL `updated <= -14d` |

Read tool schemas first - parameter names above are typical, not guaranteed.

## Fetch patterns

1. **Statuses/labels** - one call to map done/canceled/duplicate states and list existing cleaning labels.
2. **Active backlog** - list all active issues in scope; paginate until complete.
3. **Duplicate detail** - for title-match candidates only, `get_issue` with relations when supported.
4. **Description fetch** - if list response omits full description, batch `get_issue` for AC checks (cap at 50 per batch).

Use date filters only to supplement a full scan - do not rely on `-P14D` alone or non-stale issues are missed.

## Write patterns

### Close duplicate (Linear example)

```
save_issue:
  id: "<duplicate-id>"
  state: "duplicate"          # or "canceled" if no duplicate state
  duplicateOf: "<canonical-id>"
```

Keep the canonical issue open. Add a comment linking duplicates when the provider supports comments and the user approved.

### Tag issue (Linear example)

```
save_issue:
  id: "<issue-id>"
  labels: ["<existing-labels>", "needs-assignee"]   # merge with current labels
```

Pass the full merged label set if the API replaces rather than merges.

### Create label (Linear example)

```
create_issue_label:
  name: "needs-assignee"
  color: "#f2c94c"
  teamId: "<team-uuid>"       # when required
```

Create only labels needed for approved actions.

## Normalization

```text
Raw → Common shape (+ cleaning fields):
  identifier, title, stateName, stateType, labels[],
  assignee, description, updatedAt, createdAt,
  milestone, project, cycleOrSprint, parentId,
  duplicateOf (optional), relatedRelations[] (optional)
```

Empty values stay empty. Skip rules that need missing data rather than guessing.
