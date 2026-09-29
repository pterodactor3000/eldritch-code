# Provider Adapters — Infomemetatric

Issue creation from roadmap, plus optional repository mirrors. Read tool schemas before calling. Names below are typical, not guaranteed.

## Discovery signals

### Primary (task management)

A server is a **primary provider** when its tools can:

- List or search issues/tasks
- Create an issue with at least `title` and `description` / body

Prefer providers that also support team/project/milestone attach and comments.

Known primaries: Linear, Jira, GitHub Issues (only when no dedicated project tracker is available).

### Repository mirror

A server is a **repository provider** when its tools can:

- Create an issue in a git repository (GitHub Issues, GitLab Issues, or equivalent)
- List issues in that repository (for idempotent mirror diffs)
- Preferably return a URL or number after create

Known mirrors: GitHub (`gh` MCP or GitHub MCP), GitLab.

### Primary vs mirror selection

| Situation | Primary | Mirror candidate |
| --------- | ------- | ---------------- |
| Linear (or Jira) + GitHub Issues MCP | Linear / Jira | GitHub Issues |
| Only GitHub Issues MCP | GitHub Issues | None (Gate 2 skipped: already on repo tracker) |
| Only Linear | Linear | None |
| User names primary | Named provider when available | Still ask Gate 2 if a distinct repo MCP exists |

Never auto-select mirror writes. Gate 2 is mandatory whenever a distinct repository MCP is present.

## Field mapping — create

| Concept | Linear | GitHub Issues | Jira |
| ------- | ------ | ------------- | ---- |
| Create | `save_issue` · `title` + `team` | create issue · `title` + repo | create issue · project + type |
| Description | `description` (markdown) | body | description |
| Project | `project` | project (v2) optional | project key |
| Milestone | `milestone` | milestone | fixVersion / sprint |
| Team | `team` (required on create) | — | — |
| State | `state` · default backlog/Todo | — | initial transition |
| Labels | `labels` · include `change-id` | labels · include change-id | labels/components |
| Comment / link | `save_comment` | issue comment | comment |

## Field mapping — mirror link

| Step | Linear primary | GitHub mirror |
| ---- | -------------- | ------------- |
| Create mirror | — | create issue with same title prefix + mirror description template |
| Link on primary | comment or description append with `#N` / URL | — |
| Link on mirror | — | body already cites Linear `ENG-123` |
| Idempotent remirror | search mirror titles for `// [S-NN]::[change-id] //` | skip if exact prefix match exists |

Same pattern for GitLab: use IID / web URL in cross-links.

## Fetch patterns

1. **Schemas** — read create/list/comment tool descriptors for primary (and mirror when present).
2. **Scope** — resolve team/project/repo from user input, PRD `project` name, or recent issues.
3. **Existing primary** — search/list issues; match by title prefix and change-id (see mapping-rules).
4. **Milestones** — `list_milestones` when attaching; resolve UUIDs before create.
5. **Create primary** — one call per approved `create` draft; pass literal newlines in description.
6. **Mirror (Gate 2 yes)** — create repo issues; then comment/update primary with mirror link.
7. **Sync marker** — update project description when supported.

## Write pattern (Linear primary example)

```
save_issue:
  title: "// [S-04]::dashboard-tile-style // feat: themed header strip on dashboard"
  team: "<team>"
  project: "<project name if known>"
  milestone: "<milestone if known>"
  description: "<assembled primary template>"
  state: "Todo"
  labels: ["dashboard-tile-style"]
```

## Write pattern (GitHub mirror example)

```
create_issue:
  owner: "<org>"
  repo: "<repo>"
  title: "// [S-04]::dashboard-tile-style // feat: themed header strip on dashboard"
  body: "<assembled mirror template citing Linear ENG-123>"
  labels: ["dashboard-tile-style"]
```

Then on Linear:

```
save_comment:
  issueId: "<ENG-123 id>"
  body: "## Repository Mirror\n\n- **Mirror:** GitHub #<N>\n- **Mirror URL:** <url>"
```

Pass literal newlines. Do not escape markdown.

## Failure handling

- Partial primary creates → report successes and failures; do not roll back successful creates.
- Mirror failure after primary success → leave primary issues; report mirror failures; do not delete primary.
- Ambiguous match → never create; require user resolution.
- Duplicate on create (provider rejects) → treat as exists when identifier returned; else report under Failed.

## Normalization

```text
Roadmap slice → Draft:
  sliceId, changeId, title (prefixed), description,
  project, milestone, team, labels[],
  diffStatus: create | exists | ambiguous,
  existingIdentifier?: string
```

```text
Created primary → Mirror candidate:
  primaryIdentifier, primaryUrl?, title, description (mirror template)
```

Empty values stay empty. Never invent team IDs, project UUIDs, or issue numbers.
