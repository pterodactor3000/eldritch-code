# Cogitation Output Conventions

## Scope

These conventions govern agent chat output only. Do not alter generated artifacts, issue or pull-request payloads, HTML markers, or parser-required schemas unless a skill explicitly requires that format.

## Skill naming

Use `{class}-of-{stem}` for a skill directory and its frontmatter `name`. Select the class by primary workflow:

| Prefix      | Use when                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------- |
| `litany-`   | Main loop is agent and user dialogue: facilitation, confirmation, or decision interview. |
| `hymn-`     | Review or audit of codebase, plan, implementation, or project readiness.                 |
| `rites-`    | Generate or scaffold artifacts, or execute an implementation workflow.                   |
| `prayer-`   | Work does not fit another class.                                                         |
| `canticle-` | Issue-tracker or project-management workflow using MCP.                                  |

Use lowercase kebab-case names. The printed liturgy type may differ from the class prefix, but the prefix must describe the workflow.

## Lifecycle header

Begin each substantial lifecycle message with:

```text
// [<RITE>] :: [<PHASE>] //<br>
```

Use uppercase text between brackets. State verified inputs, status, action, and result in compact procedural diction. Put each verified input on its own labeled line ending in `<br>`. Separate rite and phase with ` :: `. Do not use em dashes.

## Line layout

Chat markdown joins adjacent lines into one paragraph. A plain newline is not a break. End every header, labeled field, finding, and extra sentence with `<br>`. Copy that tag from the template into chat.

These rules apply to every chat message that uses lifecycle headers or list-style report sections. Skill templates inherit them. A skill may name fields and section order. Emit the field list. Do not wrap it into a paragraph.

Forbidden:

```text
// [MOTIVE CONSECRATION] :: [REVIEW SEALED] // Fixed: 6 Skipped: 0 Accepted: 0 Dismissed: 0 Verdict: APPROVED Report: not written.
```

Required:

```text
// [MOTIVE CONSECRATION] :: [REVIEW SEALED] //<br>
Fixed: 6<br>
Skipped: 0<br>
Accepted: 0<br>
Dismissed: 0<br>
Verdict: APPROVED<br>
Report: not written.<br>
Ask mode cannot save <path>.<br>
```

Rules:

- End the header line at the closing `//`, then write `<br>`. The next field starts after that break.
- Every lifecycle report body is a field list. This includes ANALYSIS, PREVIEW, OVERVIEW, FINDINGS, SUMMARY, status, scope, readiness, confirmation, next-directive, and sealed-completion blocks.
- One labeled field per line, ending in `<br>`.
- One finding, issue, or extra sentence per line, ending in `<br>`.
- Do not join report fields with commas, spaces, semicolons, or `·`.
- Empty sections still get `None.` (or the skill's empty token) under that header, ending in `<br>`.
- Markdown tables and markdown lists stay contiguous and do not take `<br>`. The renderer already breaks those rows and items.
- Prefer fenced `text` code blocks for chat-output templates so `<br>` stays visible in the skill source.
- Structured multi-field blocks (for example `What:` / `Flag:` under one issue, or `F1:` finding cards) may use indented continuation lines. Each continuation still ends in `<br>` unless it is a markdown list item.
- Confirmation command words may stay on one line, ending in `<br>`: `Reply: approve, skip, or describe edits.<br>`
- Keep `<br>` in chat. When writing a saved artifact from the same schema, omit `<br>`.

```text
// [<RITE>] :: [ANALYSIS] //<br>
Change: <change-id><br>
Status: <status><br>
```

## Initialization quote

When a skill requires an initialization quote, emit it as the first content of every invocation. The quote shape is always:

```text
{quote}
```

Always print that block as a centered HTML block so the quote wraps in the chat pane:

<div align="center">

_<quote>_

</div>

Rules:

- Emit a centered HTML `<div align="center">` with the quote body italicized with `_…_`
- Do not use a Markdown pipe table. Pipe tables do not wrap and clip off screen
- Quote text is verbatim from the skill
- Emit the lifecycle header immediately after the block
- Do not repeat the quote during that invocation unless the skill explicitly requires repetition

## Input required

When required input is missing, emit a concrete phase header and a numbered `Transmit:` list:

```text
// [<RITE>] :: [INPUT REQUIRED] //<br>
Transmit:<br>
1. <required input>
2. <required input>
```

Then wait. Do not use `// [NEXT DIRECTIVE] //` for an initial input gate.

## Clarification

Ask only for information the user can supply. Do not request facts the repository, supplied artifacts, or connected systems can establish.

```text
// [<RITE>] :: [COGITATION REQUIRED] //<br>
Verified input: <known fact>.<br>
Unresolved datum: <decision or gap>.<br>
Transmit:<br>
1. <concise question>
2. <optional concise question>
```

Use at most three questions unless the skill defines a stricter limit.

## Confirmation

Gate every write, commit, destructive operation, triage action, and material user decision:

```text
// [AWAITING CONFIRMATION] //<br>
<approved action and available command words><br>
```

Retain each skill's existing command words, such as `approve`, `skip`, `yes`, and `no`.

## Failure

Report a failed operation with a decisive reason:

```text
// [<RITE>] :: [FAILED] //<br>
Operation: <operation><br>
Reason: <decisive reason><br>
```

## Completion

Use a rite-specific completion header. Add `// [NEXT DIRECTIVE] //` only when a manual follow-up action exists. Never invoke a downstream rite automatically.

## Audience boundaries

Cogitation Unit prompts to the user use the structured protocol above. Questions intended for external interviewees, survey respondents, customers, or issue-tracker readers stay natural, concise, and appropriate to their audience.

## Skill-specific formats

Explicit skill templates take precedence for field names, field order, and section names. Line layout from this file always applies. Preserve artifact schemas and tracker-specific `PREVIEW`, `OVERVIEW`, `FINDINGS`, `VERDICT`, and summary section names when they provide clearer domain output.
