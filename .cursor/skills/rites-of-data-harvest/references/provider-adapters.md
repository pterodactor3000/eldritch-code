# Provider Adapters

Map each MCP provider to the common issue shape before applying triage rules. Read tool schemas first - names below are typical, not guaranteed.

## Discovery signals

A server is a task-management provider when its tools can:

- List or search issues/tasks
- Return at least identifier, title, and status/state

Known providers (not exhaustive): Linear, Jira, GitHub Issues. New providers follow the same normalize → classify → report flow.

## Field mapping

| Concept | Linear | GitHub Issues | Jira |
| ------- | ------ | ------------- | ---- |
| Identifier | `ENG-123` | `#123` | `PROJ-123` |
| List my work | `list_issues` · `assignee: "me"` | issues search · `assignee:@me` | JQL · `assignee = currentUser()` |
| Status list | `list_issue_statuses` | labels / project columns | `getIssueTypes` / workflow statuses |
| Blocked | relations · `get_issue` + `includeRelations` | `blocked` label · linked issue | "Blocked" status · "is blocked by" link |
| Review ready | state / label | `ready for review` label | "In Review" |
| Out of scope | canceled + label | closed + `wontfix` label | "Won't Do" / canceled |
| Priority | issue priority field | labels / project field | priority field |
| Cycle/sprint | `cycle` on issue | milestone / iteration | sprint field |

If the provider lacks relations, rely on labels and state names only.

## Fetch patterns

Use the smallest number of calls that cover all sections:

1. **Statuses/labels** - one call to map done/canceled/review states before filtering.
2. **My active work** - list issues assigned to current user; exclude done/canceled.
3. **Review queue** - list issues in review-ready states (team-wide if user asked for team scope).
4. **Team radar** - list unassigned or stale issues when scope is team/project; use provider date filters when available (e.g. `updatedAt: "-P14D"`).
5. **Blocking detail** - fetch relations only for issues that might be blocked (label/state/title signals), not for every issue.

Paginate until all in-scope active issues are retrieved or the user capped the scope.

## Normalization example

```text
Raw (provider-specific) → Common shape:
  identifier, title, stateName, stateType, labels[],
  priority, assignee, updatedAt, cycleOrSprint,
  blockingRelations[] (optional)
```

Empty arrays and nulls are fine. Classification skips rules that need missing data rather than guessing.
