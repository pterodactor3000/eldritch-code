---
name: rites-of-data-harvest
description: Produce a short status report from a task management system via MCP (Linear, Jira, GitHub Issues). Surfaces blocked items, review-ready work, out-of-scope and off-radar issues, and up to three recommended next picks. Use when the user asks for status, standup, triage, "what should I work on", or invokes rites-of-data-harvest.
---

# Data Harvest

Use this skill when the user says "status", "standup", "what's blocked", "what should I take", "triage", or "rites-of-data-harvest".

## Workflow

1. **Discover provider** - scan enabled MCP servers for issue/task tools (`list_issues`, `search_issues`, `get_issue`, or equivalent). If the user names a provider, use it when available. If multiple qualify, prefer the named one; otherwise pick the first that can list issues assigned to the current user. If none is available, say so and stop.
2. **Read tool schemas** - list and read MCP tool descriptors for the chosen provider before calling anything. Never guess parameter names.
3. **Resolve scope** - default to issues assigned to the current user. If the user names a team, project, sprint, or cycle, narrow to that.
4. **Fetch metadata once** - pull statuses/states and labels (or equivalent) from the provider and build a local map. Do not hardcode team-specific state names.
5. **Fetch issues** - pull active (non-done, non-canceled) issues in scope. Paginate when results hit the limit. For blocked classification, fetch blocking relations or linked issues when the provider supports them.
6. **Normalize** - map each raw issue to the common shape in [provider-adapters.md](references/provider-adapters.md). Unknown fields stay empty; never invent data.
7. **Classify** - apply rules in [triage-rules.md](references/triage-rules.md). Each issue lands in exactly one primary section.
8. **Recommend picks** - choose at most three unblocked, in-scope issues (see Recommendations below).
9. **Emit report** - use the output template exactly. Keep the whole report short; one line per issue unless the user asked for detail.

## Report Sections

| Section | Meaning |
| ------- | ------- |
| **Blocked** | Cannot proceed - blocking relation, blocked label/state, or explicit dependency in title/description |
| **Review ready** | Implementation done; waiting on review, QA, or merge |
| **Out of scope** | Explicitly deferred, canceled, or labeled/named as out of scope / won't do |
| **Out of radar** | Active but neglected - stale updates, no assignee, icebox/radar labels, or outside current cycle with no owner |
| **Recommended** | Up to three issues to pick up next |

Classification priority when multiple rules match: Out of scope → Blocked → Review ready → Out of radar → (eligible for Recommended).

## Recommendations

Pick **at most three** from issues that are:

- In scope (not out of scope, not done)
- Unblocked
- Assigned to the user **or** unassigned on the user's team (prefer user's assignments first)

Rank by:

1. Priority (Urgent > High > Medium > Low > None)
2. In current cycle/sprint over backlog
3. Most recently updated among ties

Each recommendation is one line: `IDENTIFIER - title - <why now>` where *why now* is brief (priority, cycle, unblocks others, review SLA, etc.).

## Output Format

In emitted output, **all characters between `[` and `]` must be UPPERCASE** - section headers, labels, and any dynamic bracket text.

Structure the report with these headers exactly:

```
// [STATUS REPORT] //
Provider: <name> · Scope: <me | team | project> · As of: <YYYY-MM-DD>

// [BLOCKED] //
<IDENTIFIER> - <title> - <blocker or reason>
… or `None.`

// [REVIEW READY] //
<IDENTIFIER> - <title> - <reviewer or waiting-on if known>
… or `None.`

// [OUT OF SCOPE] //
<IDENTIFIER> - <title> - <reason>
… or `None.`

// [OUT OF RADAR] //
<IDENTIFIER> - <title> - <why off radar, e.g. stale 21d, unassigned>
… or `None.`

// [RECOMMENDED] //
1. <IDENTIFIER> - <title> - <why now>
… up to 3 items, or `None - nothing ready; resolve blocked items first.`
```

Rules for output:

- One issue per bullet; no paragraphs.
- Use the tracker's human identifier (e.g. `ENG-123`, `#42`, `PROJ-123`), not internal UUIDs.
- If a section has no items, write `None.` under that header.
- Do not invent issues, assignees, or blockers - only report what MCP returned.
- If classification is ambiguous, pick the best fit and append `(?)` to the reason.

## Additional Resources

- Classification rules and staleness thresholds: [references/triage-rules.md](references/triage-rules.md)
- Provider field mapping and fetch patterns: [references/provider-adapters.md](references/provider-adapters.md)
