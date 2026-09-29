---
name: rites-of-commission
alias: rites-of-new-change
description: Initialize context/changes/<change-id>/ with its change.md identity record. Use when the user asks to start a new change, initialize a change folder, create a change record, or invokes rites-of-commission.
---

# Rites of Commission

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_This machine is discharged into your care. Fight with this machine, and guard it from the shame of defeat. Serve this machine, as you would have fight it for you. (response) - I shall._

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
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This rite's change-record schema names the fields and sections. Line layout from that file always applies.

Create one active change folder and its identity record. A change is one unit of work. Its research, planning, implementation, reviews, and related artifacts live under `context/changes/<change-id>/`.

This rite creates only the folder and `change.md`. It does not create a plan, research, frame, implementation, review, or issue.

## Input

Accept:

```text
rites-of-commission <change-id> [freeform intent]
```

The first token is a Change ID reference. Everything after it is freeform intent.

When no argument is provided, emit:

```text
// [COMMISSION] :: [INPUT REQUIRED] //<br>
Transmit a kebab-case Change ID and optional intent.<br>

rites-of-commission oauth-login<br>
rites-of-commission oauth-login add Google sign-in for faster onboarding<br>
rites-of-commission @context/changes/oauth-login/<br>
```

Then wait.

## Parse the Change ID

Normalize the first token:

1. Strip leading `@`.
2. Strip trailing `/`.
3. When it contains `/`, use the last non-empty segment.
4. Treat the result as `<change-id>`.

Keep all remaining text as intent. It is source material for the title and Notes body, not a title to copy blindly.

## Validate before writing

Check all conditions before creating any file:

1. `<change-id>` matches `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`.
2. `context/changes/<change-id>/` does not exist.
3. No active or archived change has the same Change ID.
4. `context/changes/` exists.

On invalid ID, stop with:

```text
// [COMMISSION] :: [FAILED] //<br>
Operation: validate Change ID<br>
Reason: "<id>" is not kebab-case. Use lowercase letters, digits, and single hyphens only, such as "oauth-login".<br>
```

On collision, stop with:

```text
// [COMMISSION] :: [FAILED] //<br>
Operation: reserve Change ID<br>
Reason: change "<id>" already exists at <path>. Pick a different Change ID or work inside the existing folder.<br>
```

If `context/changes/` is absent, stop with `// [COMMISSION] :: [FAILED] //`, identify the missing parent, and direct the user to **rites-of-waking**. Do not create the parent structure here.

## Create the identity record

Create `context/changes/<change-id>/`.

Derive a concise, sentence-case title:

- With no intent: humanize the Change ID, for example `multi-course-access` becomes `Multi course access`.
- With intent: write a title of 80 characters or fewer that captures the requested outcome without copying an entire sentence.

Use the intent verbatim as the Notes body when provided. Otherwise use this comment:

```markdown
<!-- Free-form notes for this change: links, ad-hoc context, and decisions that do not belong in research, framing, or planning. -->
```

Write exactly:

```markdown
---
change_id: <change-id>
title: <title>
status: new
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
archived_at: null
---

## Notes

<intent or hint comment>
```

Use today's date for both dates.

## Roadmap compatibility

When `context/foundation/roadmap.md` exists, search it for the Change ID and report under `// [COMMISSION] :: [ROADMAP COMPATIBILITY] //`:

- If found, report its roadmap ID and status.
- If found but blocked, explain that planning must wait for its recorded blocker.
- If it is a ready roadmap item, recommend **rites-of-true-aim `<change-id>`**.
- If not found, create the change normally. Do not add or modify roadmap entries.

## Hand off

After success, report:

```text
// [COMMISSION] :: [SUMMARY] //<br>
Change ID: <change-id><br>
Status: new<br>
Record: context/changes/<change-id>/change.md<br>
Created: <YYYY-MM-DD><br>

// [NEXT DIRECTIVE] //<br>
Invoke: rites-of-true-aim <change-id><br>
```

Recommend **rites-of-true-aim** by default. Recommend discovery or framing first only when the user's intent clearly describes an unverified bug cause, ambiguous problem, or a feature needing substantial codebase investigation.
