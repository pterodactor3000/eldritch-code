---
name: canticle-of-data-harvest
alias: canticle-of-issues-report
description: Produce a short status report from a task management system via MCP (Linear, Jira, GitHub Issues). Surfaces blocked items, review-ready work, out-of-scope and off-radar issues, and up to three recommended next picks. Use when the user asks for status, standup, triage, "what should I work on", or invokes canticle-of-data-harvest.
---

# Data Harvest

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_No task that is easy is ever worthwhile._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply this protocol to every message emitted in chat. It applies only to agent chat output: do not alter generated artifacts, external issue or pull-request payloads, HTML markers, or parser-required schemas.

- Begin each substantial lifecycle message with `// [<RITE>] :: [<PHASE>] //`. All text between `[` and `]` is uppercase. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Use compact, procedural Cogitation Unit diction: state verified inputs, status, action, and result. Do not add decorative roleplay or obscure required actions.
- Use named sections where applicable: `// [<RITE>] :: [ANALYSIS] //`, `// [<RITE>] :: [PREVIEW] //`, `// [<RITE>] :: [FINDINGS] //`, `// [<RITE>] :: [SUMMARY] //`, `// [<RITE>] :: [FAILED] //`, and `// [NEXT DIRECTIVE] //`.
- Place every write approval in `// [AWAITING CONFIRMATION] //`, preserving the existing command words such as `approve`, `skip`, `yes`, and `no`.
- Report errors in `// [<RITE>] :: [FAILED] //` with the operation and decisive reason.
- End completed work with `// [NEXT DIRECTIVE] //` when a manual next step exists. Never invoke a downstream rite automatically.
- Separate rite and phase with `::`. Do not use em dashes.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This canticle's tracker-specific status schema names the fields and sections. Line layout from that file always applies.

Use this skill when the user says "status", "standup", "what's blocked", "what should I take", "triage", or "canticle-of-data-harvest".

## Workflow

1. **Discover provider**: scan enabled MCP servers for issue/task tools (`list_issues`, `search_issues`, `get_issue`, or equivalent). If the user names a provider, use it when available. If multiple qualify, prefer the named one; otherwise pick the first that can list issues assigned to the current user. If none is available, emit:

   ```text
   // [DATA HARVEST] :: [FAILED] //<br>
   Operation: discover task-management provider<br>
   Reason: No enabled provider exposes issue-listing tools.<br>
   ```

   Then stop.

2. **Read tool schemas**: list and read MCP tool descriptors for the chosen provider before calling anything. Never guess parameter names.
3. **Resolve scope**: default to issues assigned to the current user. If the user names a team, project, sprint, or cycle, narrow to that.
4. **Fetch metadata once**: pull statuses/states and labels (or equivalent) from the provider and build a local map. Do not hardcode team-specific state names.
5. **Fetch issues**: pull active (non-done, non-canceled) issues in scope. Paginate when results hit the limit. For blocked classification, fetch blocking relations or linked issues when the provider supports them.
6. **Normalize**: map each raw issue to the common shape in [provider-adapters.md](references/provider-adapters.md). Unknown fields stay empty; never invent data.
7. **Classify**: apply rules in [triage-rules.md](references/triage-rules.md). Each issue lands in exactly one primary section.
8. **Recommend picks**: choose at most three unblocked, in-scope issues (see Recommendations below).
9. **Emit report**: use the output template exactly. Keep the whole report short. Follow conventions line layout: `<br>` after every header and every issue.

## Report Sections

| Section          | Meaning                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| **Blocked**      | Cannot proceed: blocking relation, blocked label/state, or explicit dependency in title/description           |
| **Review ready** | Implementation done; waiting on review, QA, or merge                                                          |
| **Out of scope** | Explicitly deferred, canceled, or labeled/named as out of scope / won't do                                    |
| **Out of radar** | Active but neglected: stale updates, no assignee, icebox/radar labels, or outside current cycle with no owner |
| **Recommended**  | Up to three issues to pick up next                                                                            |

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

Each recommendation is one line: `IDENTIFIER: title: <why now>` where _why now_ is brief (priority, cycle, unblocks others, review SLA, etc.).

## Output Format

In emitted output, **all characters between `[` and `]` must be UPPERCASE**: section headers, labels, and any dynamic bracket text.

Structure the report with these headers exactly. Line layout follows [Cogitation Output Conventions](../conventions.md): `<br>` after every header and every issue.

```text
// [DATA HARVEST] :: [STATUS REPORT] //<br>
Provider: <name><br>
Scope: <me | team | project><br>
As of: <YYYY-MM-DD><br>

// [BLOCKED] //<br>
<IDENTIFIER>: <title>: <blocker or reason><br>
… or `None.`

// [REVIEW READY] //<br>
<IDENTIFIER>: <title>: <reviewer or waiting-on if known><br>
… or `None.`

// [OUT OF SCOPE] //<br>
<IDENTIFIER>: <title>: <reason><br>
… or `None.`

// [OUT OF RADAR] //<br>
<IDENTIFIER>: <title>: <why off radar, e.g. stale 21d, unassigned><br>
… or `None.`

// [RECOMMENDED] //<br>
1. <IDENTIFIER>: <title>: <why now>
… up to 3 items, or `None: nothing ready; resolve blocked items first.`

// [NEXT DIRECTIVE] //<br>
<single recommended action, or state that blocked items require resolution><br>
```

Example (multi-issue sections; `<br>` after every header and every issue):

```text
// [DATA HARVEST] :: [STATUS REPORT] //<br>
Provider: Linear<br>
Scope: me<br>
As of: 2026-08-08<br>

// [BLOCKED] //<br>
ENG-12: Fix auth refresh: blocked by ENG-9<br>
ENG-18: Ship billing webhook: waiting on vendor API key<br>

// [REVIEW READY] //<br>
ENG-7: Dashboard tiles: awaiting review<br>

// [OUT OF SCOPE] //<br>
None.<br>

// [OUT OF RADAR] //<br>
ENG-3: Icebox polish: stale 21d, unassigned<br>

// [RECOMMENDED] //<br>
1. ENG-15: Add invite flow: High, in current cycle
2. ENG-22: Tighten rate limits: unblocks ENG-18

// [NEXT DIRECTIVE] //<br>
Unblock ENG-12 and ENG-18, then take ENG-15.<br>
```

Rules for output:

- Follow conventions line layout. Recommended items use a numbered list (`1.` `2.` `3.`). Each issue still ends with `<br>` except those numbered list lines.
- Use the tracker's human identifier (e.g. `ENG-123`, `#42`, `PROJ-123`), not internal UUIDs.
- If a section has no items, write `None.<br>` under that header.
- Do not invent issues, assignees, or blockers: only report what MCP returned.
- If classification is ambiguous, pick the best fit and append `(?)` to the reason.

## Additional Resources

- Classification rules and staleness thresholds: [references/triage-rules.md](references/triage-rules.md)
- Provider field mapping and fetch patterns: [references/provider-adapters.md](references/provider-adapters.md)
