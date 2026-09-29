---
name: canticle-of-cleaning
alias: canticle-of-tidy-backlog
description: Clean and triage a task backlog via MCP (Linear, Jira, GitHub Issues). Detects duplicate issues, tags missing metadata (assignee, acceptance criteria, milestone/epic), and flags stale work (2+ weeks). Requires explicit user approval before any write. Use when the user asks to clean the backlog, triage issues, close duplicates, tag untriaged work, flag stale tickets, or invokes canticle-of-cleaning.
---

# Backlog Cleaning

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
- Separate rite and phase with ` :: `. Do not use em dashes.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This canticle's tracker-specific schemas name the fields and sections. Line layout from that file always applies.

Use this skill when the user says "clean backlog", "triage issues", "close duplicates", "tag untriaged", "flag stale", or "canticle-of-cleaning".

**Writes are forbidden until Step 5 approval.** Steps 1–4 are read-only.

## Workflow

1. **Discover provider**: scan enabled MCP servers for issue/task tools. If the user names a provider, use it when available. If none qualifies, say so and stop. Read tool schemas before any MCP call.
2. **Resolve scope**: default to the user's team or project active backlog (non-done, non-canceled). Narrow when the user names a team, project, sprint, or cycle.
3. **Fetch & analyze**: pull active issues (paginate at limits). Normalize to the common shape in [provider-adapters.md](references/provider-adapters.md). Apply rules in [cleaning-rules.md](references/cleaning-rules.md). For every issue that may appear in an overview, fetch full description when the list response is truncated: extract a **one-line summary** (prefer `## Outcome`, else first substantive sentence, else roadmap/change ID). Build the cleaning plan; do not mutate anything yet.
4. **Present findings**: post the counts-only findings block as the first part of your reply. **End this section before the overview**: user reads counts first.
5. **Approval gate (mandatory)**: one category per **assistant turn**. Each turn is: findings or overview **in plain chat text only**, then a one-line approval ask. **Do not call `AskQuestion` or any other tool in a turn that contains an overview.** Stop and wait for the user's chat reply before the next category or execution.
6. **Execute approved actions only**: apply only what the user approved per category. Ensure cleaning labels exist (create if the provider supports it and the label is missing). Close duplicates per [cleaning-rules.md](references/cleaning-rules.md). Append labels; do not remove existing labels unless the user asked.
7. **Emit summary**: report what was planned, what was approved, what succeeded, and what failed.

## Cleaning Categories

| Category                        | Action                                      | Trigger                                                                      |
| ------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| **Duplicates**                  | Close as duplicate; link to canonical issue | Same title (normalized), `duplicateOf` relation, or explicit duplicate label |
| **Missing assignee**            | Add label `needs-assignee`                  | No assignee on an active issue                                               |
| **Missing acceptance criteria** | Add label `needs-acceptance-criteria`       | No acceptance-criteria section in description/body (see rules)               |
| **Missing milestone/epic**      | Add label `needs-milestone`                 | No milestone, epic, cycle, sprint, or project (whichever the provider uses)  |
| **Stale**                       | Add label `stale`                           | Active issue with `updatedAt` **≥ 14 days** ago                              |

One issue may receive multiple tags. Duplicates are mutually exclusive with other categories: close them, do not tag.

## Approval Gate

After Step 4 findings, approve in this **fixed order**: one category per turn:

1. Duplicates: close
2. Tag `needs-assignee`
3. Tag `needs-acceptance-criteria`
4. Tag `needs-milestone`
5. Tag `stale`

### Per-category flow (two-part message, one turn per category)

For each category where N > 0:

**Part A: overview (required)**
Post the full `// [CLEANING] :: [OVERVIEW <CATEGORY>] //` block: every issue with plain title, **What**, and **Flag**. User must be able to decide without opening Linear.

**Part B: approval ask (same message, after overview)**
One line at the bottom:

```
// [AWAITING CONFIRMATION] //<br>
Approve **<action>** for all <N> issues above? Reply: `approve all`, `skip`, or list IDs to include/exclude.<br>
```

Then **end the turn**. No tools. No `AskQuestion`. Wait for the user's next message.

After the user replies, record approved, skipped, and modified, then post the next category overview (if any). After all categories, run Step 6 once.

When N = 0, skip the category silently.

### Approval rules

- **Never use `AskQuestion`**: it hides the overview behind a modal. Chat reply only.
- **Never call tools in the same turn as findings or overview**: fetch data first; overview is the last thing in the reply.
- Default is **no writes**: silence or ambiguity means skip that category.
- Never combine two categories in one turn.
- Never execute mid-approval: collect all replies first, then write once.

## Output Format

In emitted output, **all characters between `[` and `]` must be UPPERCASE**: section headers, labels, and any dynamic bracket text (e.g. `[OVERVIEW: NEEDS-ASSIGNEE]`). Line layout follows [Cogitation Output Conventions](../conventions.md).

### Findings (before approval: counts only)

Show this first. Counts only. One labeled field per line. No per-issue detail here: that goes in category overviews.

```text
// [FINDINGS] //<br>
Provider: <name><br>
Scope: <team | project><br>
Scanned total: <N><br>
Scanned active: <M><br>
Duplicates: <N><br>
Unassigned: <N><br>
Missing AC: <N><br>
Missing milestone: <N><br>
Stale: <N><br>
Already clean: <one line><br>
Proposed: <comma-separated actions with counts, or `No changes needed.`><br>
```

Then **in the same reply**, if the first category with N > 0 is duplicates, post its overview immediately below findings. Otherwise post the first non-empty category overview. Do not split findings and first overview across turns.

Findings rules:

- Counts, `Already clean:`, and `Proposed:` are field-list lines. No per-issue lists in findings.
- Per-issue detail always in the overview block below, never in findings alone.

### Category overview (required: user reads this before approving)

**Must be visible chat text**, not a tool prompt. One block per category turn. Each issue starts on its own line; `What:`, `Flag:`, `State:`, and `Milestone:` indent under it.

```text
// [OVERVIEW] :: [<CATEGORY NAME>] //<br>
Action: <what will happen if approved, e.g. "Add label needs-assignee"><br>

<IDENTIFIER>: <short plain title, not raw tracker slug><br>
  What: <one line: what this task delivers><br>
  Flag: <why this issue is listed><br>
  State: <status or None.><br>
  Milestone: <name or None.><br>

<IDENTIFIER>: <short plain title><br>
  What: <one line><br>
  Flag: <why listed><br>
  State: <status or None.><br>
  Milestone: <name or None.><br>
… cap at 20; append `… and N more.`
```

Overview rules:

- **Short plain title**: strip `// [S-NN]::[change-id] // feat:` prefixes; keep readable (e.g. "Square UI containers").
- **What**: from description/outcome; ≤ 15 words; say what the user gets, not internal IDs.
- **Flag**: category-specific reason. Put status on `State:` and milestone on `Milestone:`.
- Duplicates: include canonical ID and why it wins.
- Stale: include days since last update.
- Stale: include days since last update.
- End every overview with the one-line approval ask (Part B).

Example (full turn: this is the entire assistant reply for that category):

```text
// [FINDINGS] //<br>
Provider: Linear<br>
Scope: Tech Heresy<br>
Scanned total: 24<br>
Scanned active: 5<br>
Duplicates: 0<br>
Unassigned: 5<br>
Missing AC: 0<br>
Missing milestone: 0<br>
Stale: 0<br>
Already clean: duplicates closed; AC tagged; milestones set; updated yesterday<br>
Proposed: needs-assignee (5)<br>

// [OVERVIEW] :: [NEEDS-ASSIGNEE] //<br>
Action: Add label needs-assignee<br>

TEC-19: Square UI containers<br>
  What: Squared corners on every screen: visual-only restyle<br>
  Flag: no assignee<br>
  State: Todo<br>
  Milestone: Polish & theming<br>

TEC-20: Dashboard tile style<br>
  What: Themed header strip and uniform handout tiles on dashboard<br>
  Flag: no assignee<br>
  State: Todo<br>
  Milestone: Polish & theming<br>

// [AWAITING CONFIRMATION] //<br>
Approve **needs-assignee** for all 5 issues above? Reply: `approve all`, `skip`, or list IDs.<br>
```

### Summary (after execution)

```text
// [CLEANING SUMMARY] //<br>
Provider: <name><br>
Approved: <categories><br>
Executed: <YYYY-MM-DD><br>

// [CLOSED DUPLICATES] //<br>
<IDENTIFIER> → closed as duplicate of <CANONICAL_ID><br>
… or `None.`

// [TAGGED] //<br>
<IDENTIFIER>: added: <label1>, <label2><br>
… or `None.`

// [SKIPPED / FAILED] //<br>
<IDENTIFIER>: <reason><br>
… or `None.`
```

Output rules (plan + summary):

- Follow [Cogitation Output Conventions](../conventions.md) line layout: `<br>` after every header and every issue.
- Use human identifiers (`ENG-123`, `#42`), not UUIDs.
- Cap each section at **20 items**; append `… and N more.` when truncated.
- Do not invent issues or actions: only report MCP data and confirmed results.
- Findings + first overview belong in one reply when starting approval; later categories get their own reply turns.
- Approval is chat-only: overview first, one-line ask last, then wait for user reply.

## Additional Resources

- Detection rules, duplicate canonical pick, acceptance-criteria patterns: [references/cleaning-rules.md](references/cleaning-rules.md)
- Provider field mapping and write operations: [references/provider-adapters.md](references/provider-adapters.md)
