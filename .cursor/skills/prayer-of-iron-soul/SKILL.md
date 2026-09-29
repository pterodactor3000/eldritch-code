---
name: prayer-of-iron-soul
alias: prayer-of-lesson
description: Record one recurring engineering lesson in context/foundation/lessons.md. Use when asked to invoke prayer-of-iron-soul or prayer-of-lesson, or to capture a recurring rule, pattern, or design pitfall for future framing, planning, implementation, and review.
---

# Prayer of Iron Soul

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_No task that is easy is ever worthwhile._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply this protocol to every message emitted in chat. It applies only to agent chat output: do not alter generated artifacts, external issue or pull-request payloads, HTML markers, or parser-required schemas.

- Begin each substantial lifecycle message with `// [IRON SOUL] :: [<PHASE>] //`. All text between `[` and `]` is uppercase. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Use compact, procedural Cogitation Unit diction: state verified inputs, status, action, and result. Do not add decorative roleplay or obscure required actions.
- Use named sections where applicable: `// [<RITE>] :: [ANALYSIS] //`, `// [<RITE>] :: [PREVIEW] //`, `// [<RITE>] :: [FINDINGS] //`, `// [<RITE>] :: [SUMMARY] //`, `// [<RITE>] :: [FAILED] //`, and `// [NEXT DIRECTIVE] //`.
- Place every write approval in `// [AWAITING CONFIRMATION] //`, preserving the existing command words such as `append`, `edit`, and `cancel`.
- Report errors in `// [<RITE>] :: [FAILED] //` with the operation and decisive reason.
- End completed work with `// [NEXT DIRECTIVE] //` when a manual next step exists. Never invoke a downstream rite automatically.
- Separate rite and phase with ` :: `. Do not use em dashes.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, clarification, confirmation, failure, and completion. This prayer's lesson-record schema names the fields and sections. Line layout from that file always applies.

Append one recurring rule to `context/foundation/lessons.md`. A lesson is a reusable rule, not a one-off incident record.

## Initial input

If a freeform description is included, retain it only as a Rule suggestion. Otherwise, emit:

```text
// [IRON SOUL] :: [INPUT REQUIRED] //<br>
Transmit:<br>
1. Context: subsystem, phase, or file pattern.
2. Problem: concrete failure without the rule.
3. Rule: imperative instruction, one or two sentences.
4. Applies to: `frame`, `research`, `plan`, `plan-review`, `implement`, `impl-review`, or `all`.
```

Then wait.

## Process

1. Collect all four fields from the user. Do not pre-fill them. If a freeform intent exists, surface it only as a Rule suggestion.
2. Derive a short imperative H2 title from the Rule field. Render:

   // [IRON SOUL] :: [LESSON PREVIEW] //

   ```markdown
   ## <Short imperative rule title>

   - **Context**: <Context>
   - **Problem**: <Problem>
   - **Rule**: <Rule>
   - **Applies to**: <Applies to>
   ```

3. Ask:

   ```text
   // [AWAITING CONFIRMATION] //<br>
   `append` this lesson, `edit` its fields, or `cancel`.<br>
   ```

4. On `append`, create `context/foundation/lessons.md` when absent:

   ```markdown
   # Lessons Learned

   > Append-only register of recurring rules and patterns. Re-read at start by /litany-of-capacitor-alignment, /prayer-of-unbroken-thread, /rites-of-true-aim, /hymn-of-consecration-of-a-new-machine, /rites-of-ignition, /hymn-of-engine-commencement.
   ```

5. Append the previewed entry only. Never reorder, deduplicate, reformat, edit, or remove existing entries.
6. Re-read the file. Confirm the new H2 is the final section.
7. Emit:

   ```text
   // [IRON SOUL] :: [LESSON SEALED] //<br>
   Artifact: context/foundation/lessons.md<br>
   Rule: <title><br>
   ```

   Then stop.

## Constraints

- One entry per invocation.
- On `edit`, collect only the field the user changes, render the preview again, and wait for confirmation.
- On `cancel`, make no change.
