---
name: rites-of-true-aim
alias: rites-of-plan
description: Create an implementation plan for a ready roadmap item by researching the codebase, resolving material design decisions, and writing context/changes/<change-id>/plan.md plus plan-brief.md. Use when the user asks to plan a roadmap slice, plan a feature, create an implementation plan, or invokes rites-of-true-aim.
---

# Rites of True Aim

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
- Emit `// [TRUE AIM] :: [ANALYSIS] //` as the field list in ## Analysis report. One labeled field per line.
- Place every write approval in `// [AWAITING CONFIRMATION] //`, preserving the existing command words such as `approve`, `skip`, `yes`, and `no`.
- Report errors in `// [<RITE>] :: [FAILED] //` with the operation and decisive reason.
- End completed work with `// [NEXT DIRECTIVE] //` when a manual next step exists. Never invoke a downstream rite automatically.
- Separate rite and phase with ` :: `. Do not use em dashes.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This rite's plan and brief schemas name the fields and sections. Line layout from that file always applies.

Turn one roadmap item into a complete, actionable implementation plan. This rite plans one Change ID at a time. It does not implement the plan.

## Input and roadmap resolution

Accept one of:

- A roadmap Change ID, such as `first-gated-generation`.
- A roadmap ID, such as `S-01` or `F-01`.
- A task description or path to a frame brief, research document, or existing plan.

When no input is supplied, emit:

```text
// [TRUE AIM] :: [INPUT REQUIRED] //<br>
Transmit:<br>
1. Ready roadmap Change ID or roadmap ID.
2. Task description, frame brief, research record, or existing plan path.
```

Then wait.

When a roadmap identifier is supplied:

1. Read `context/foundation/roadmap.md` fully.
2. Locate the matching item in `## At a glance`, then read its full item body.
3. Read `context/foundation/prd.md` and every referenced requirement, story, non-functional requirement, unknown, and prerequisite.
4. Refuse an item with `Status: blocked`, explaining its blocking Unknown or external Blocker.
5. Refuse an item whose prerequisites are neither `done` nor confirmed present in `## Baseline`.
6. Treat the roadmap Outcome, PRD references, risk, and scope as authoritative. Do not expand scope with unrelated ideas.

If the roadmap is missing, accept a task description but explain that no roadmap constraints are available. If the requested item is not found, ask the user to provide a valid Change ID, roadmap ID, or task description.

## Gather upstream context

Read all explicitly supplied files fully before delegating research. Also read, when present:

- `context/changes/<change-id>/change.md`
- `context/changes/<change-id>/frame.md`
- `context/changes/<change-id>/research.md`
- `context/foundation/lessons.md`

Respect upstream decisions:

- A frame brief owns the problem statement and reported observation.
- A research document owns findings it already established. Research only gaps.
- Roadmap and PRD own feature intent, ordering, and scope.
- Lessons are accepted team priors unless current code proves otherwise.

Do not plan from an archived change. If the resolved location is under `context/archive/`, stop and direct the user to create a new change.

## Analysis report

After roadmap resolution and upstream gather, emit this field list before research. Keep every field. Write `None.` when a field has no value. One labeled field per line. One sentence per extra fact. Do not wrap these fields into a paragraph.

```text
// [TRUE AIM] :: [ANALYSIS] //<br>
Change: <change-id><br>
Roadmap: <roadmap ID or None.><br>
Status: <ready | blocked | missing | ...><br>
Blocked: no | <reason><br>
PRD in scope: <FR-... or None.><br>
Guardrails in scope: <ids or None.><br>
Prerequisite: <id and roadmap status, or None.><br>
Baseline: <what foundation baseline claims, or None.><br>
Live evidence: <what code confirms, or None.><br>
Research: <path or None.><br>
Frame: <path or None.><br>
Lessons: <present or None.><br>
Unknowns: <recorded unknowns that remain out of scope, or None.><br>
Proceed: yes | no. <one-line reason><br>
```

## Research before questions

Before asking design questions, research actual code and prior work. Delegate parallel focused investigations when available:

1. Locate relevant feature code, routes, components, models, tests, configuration, and adjacent changes.
2. Find analogous existing behavior and identify conventions to preserve.
3. Trace the affected data flow, error handling, authorization, and user-visible state.
4. Find existing tests and test commands that apply.
5. Search active and archived change records for related decisions or rejected approaches.

Read the relevant files identified by research before making conclusions. Report findings with file and line references. Verify corrections from the user against the codebase before accepting them into the plan.

## Complexity and decisions

Assess complexity from the verified scope:

- **Low:** established single-area pattern with limited edge cases.
- **Medium:** multiple components, data or API work, meaningful failure paths, or integration boundaries.
- **High:** cross-cutting behavior, migrations, authorization, concurrency, external integrations, or material rollback risk.

Present the assessment and ask the user to confirm it under:

```text
// [TRUE AIM] :: [COMPLEXITY ASSESSMENT] //<br>
Change: <change-id><br>
Assessment: <Low | Medium | High><br>
Evidence: <verified scope and integration factors><br>
Questions remaining: <count and decision areas><br>

// [AWAITING CONFIRMATION] //<br>
Confirm assessment, raise complexity, or reduce complexity with rationale.<br>
```

Ask only questions that require a human product or solution decision and are not resolved by the roadmap, PRD, upstream documents, or codebase.

Ask in short rounds with two to four options. Put a grounded `(Recommended)` choice first, explain its tradeoff, and include a free-form alternative. Relevant topics include:

- user-visible behavior and edge cases
- failure handling and recovery
- data ownership, migration, and compatibility
- authorization and privacy boundaries
- testing and manual acceptance
- performance or observability constraints

Do not pad the interview to a fixed question count. Stop once all decisions needed for an actionable plan are settled. Do not write a final plan with unresolved material questions.

## Plan design

Build a phased plan before writing it:

1. Keep phases incremental, testable, and ordered by dependency.
2. Reuse established patterns and code paths where they fit.
3. Name exact files to change or create, with file and line references for existing code.
4. State each edit's Intent and Contract, not routine code.
5. Include code only for a non-obvious interface, ordering rule, workaround, or invariant.
6. Include automated and manual success criteria for every phase.
7. Include migration, rollback, security, performance, and observability details only when evidence makes them relevant.
8. Explicitly list out-of-scope work from the roadmap and PRD.

Present the phase outline and get user approval before writing plan files:

```text
// [TRUE AIM] :: [PHASE PROPOSAL] //<br>
Phase 1: <name><br>
Outcome: <outcome><br>
Phase 2: <name><br>
Outcome: <outcome><br>

// [AWAITING CONFIRMATION] //<br>
Approve phases, request revision, or specify a split or merge.<br>
```

## Write artifacts

Resolve the change directory as `context/changes/<change-id>/`.

- Create it when absent.
- Create `change.md` when absent with the title, Change ID, `status: planned`, current date, and roadmap reference.
- When it exists, preserve unrelated fields and update its status to `planned` and `updated` date.

Write `plan.md`:

```markdown
# <Feature> Implementation Plan

## Overview

<What changes and why, tied to roadmap Outcome and PRD references.>

## Current State Analysis

<Verified codebase behavior, constraints, and file:line evidence.>

## Desired End State

<Concrete user-visible outcome and how to verify it.>

## What We're NOT Doing

- <Explicit exclusions from roadmap or PRD>

## Implementation Approach

<High-level approach and why it follows existing patterns.>

## Critical Implementation Details

<Omit this entire section unless a load-bearing constraint, lifecycle issue, ordering rule, or unusual verification requirement exists.>

## Phase 1: <Descriptive name>

### Overview

<What this phase delivers.>

### Changes Required

#### 1. <File or cohesive file group>

**File:** `path/to/file`

**Intent:** <What changes and why.>

**Contract:** <Interface, invariant, data shape, route behavior, or structure affected.>

### Success Criteria

#### Automated Verification

- <Specific test, type check, lint command, or deterministic assertion>

#### Manual Verification

- <Specific user-visible behavior to verify>

---

## Testing Strategy

### Unit Tests

- <Behavior and edge cases>

### Integration Tests

- <Cross-boundary scenarios>

### Manual Testing Steps

1. <Concrete step>

## Migration and Rollback

<Omit if not applicable. Otherwise explain safe rollout, compatibility, and reversal.>

## References

- Roadmap: `context/foundation/roadmap.md` (<roadmap ID>)
- PRD: `context/foundation/prd.md` (<literal PRD refs>)
- <Relevant file:line references>

## Progress

> `- [ ]` is pending and `- [x]` is complete. Append a commit SHA when a step lands.

### Phase 1: <Name>

#### Automated

- [ ] 1.1 <Automated criterion from Phase 1>

#### Manual

- [ ] 1.2 <Manual criterion from Phase 1>
```

Each phase uses plain bullets. `## Progress` is the only section that uses checkboxes, and it must mirror every phase success criterion.

Write `plan-brief.md`:

```markdown
# <Feature> Plan Brief

> Full plan: `context/changes/<change-id>/plan.md`
> Roadmap item: `context/foundation/roadmap.md` (<roadmap ID>)

## What and Why

<Two or three sentences.>

## Starting Point

<What exists today and the delta.>

## Desired End State

<What users can do when complete.>

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| <area> | <choice> | <reason> | Roadmap, PRD, research, frame, or plan |

## Scope

**In scope:**

- <item>

**Out of scope:**

- <item>

## Approach

<One short paragraph.>

## Phases at a Glance

| Phase | Deliverable | Key risk |
| --- | --- | --- |
| 1. <name> | <outcome> | <risk> |

## Risks and Assumptions

- <risk or assumption>

## Success Criteria

- <user-visible outcome>
```

Keep the brief concise enough to understand without reading the full plan.

## Final validation

Before reporting completion, verify:

1. `plan.md` and `plan-brief.md` exist in the resolved change directory.
2. `change.md` has `status: planned` and an updated date.
3. Every roadmap and PRD requirement in scope is covered by at least one phase.
4. No phase adds work outside the roadmap item, PRD, or confirmed decisions.
5. Each phase has specific automated and manual verification.
6. `## Progress` mirrors phase criteria and is the only checkbox section.
7. References point to real files and code locations.
8. The plan contains no unresolved material questions.

Report completion as this field list. Do not implement automatically.

```text
// [TRUE AIM] :: [PLAN SEALED] //<br>
Plan: context/changes/<change-id>/plan.md<br>
Brief: context/changes/<change-id>/plan-brief.md<br>
Roadmap: <roadmap ID><br>
Phases: <count><br>
Risks: <key risks or None.><br>

// [NEXT DIRECTIVE] //<br>
Invoke: hymn-of-consecration-of-a-new-machine <change-id><br>
Then: rites-of-ignition <change-id> phase 1 after a passing review.<br>
```
