---
name: rites-of-ignition
alias: rites-of-implementation
description: Implement a prepared plan from context/changes/<change-id>/plan.md phase by phase, verify each phase, update canonical progress, and record approved commits. Use when the user asks to implement a prepared plan, execute a plan phase, continue implementation, or invokes rites-of-ignition.
---

# Rites of Ignition

Implement an approved plan one verified phase at a time. `plan.md` remains the plan contract. Its `## Progress` section is the only execution-state authority.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_The soul of the Machine God surrounds thee. The power of the Machine God invests thee. The hate of the Machine God drives thee. The Machine God endows thee with life. Live!_

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply this protocol to every message emitted in chat. It applies only to agent chat output: do not alter generated artifacts, external issue or pull-request payloads, HTML markers, or parser-required schemas.

- Begin each substantial lifecycle message with `// [MOTIVE IMPLEMENTATION] :: [<PHASE>] //`. All text between `[` and `]` is uppercase. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Use compact, procedural Cogitation Unit diction: state plan step, verified result, mismatch, or required human confirmation.
- Use `// [<RITE>] :: [ANALYSIS] //`, `// [<RITE>] :: [FINDINGS] //`, `// [AWAITING CONFIRMATION] //`, `// [<RITE>] :: [FAILED] //`, `// [<RITE>] :: [SUMMARY] //`, and `// [NEXT DIRECTIVE] //` where applicable.
- Do not use em dashes in headers or generated chat output.
- Never invoke a downstream rite automatically.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This rite's phase and verification templates name the fields and sections. Line layout from that file always applies.

## Resolve the plan

Accept:

- `<change-id> [phase N]`, resolving to `context/changes/<change-id>/plan.md`
- a direct `plan.md` path

When no input is supplied, emit:

```text
// [MOTIVE IMPLEMENTATION] :: [AWAITING PLAN] //<br>
Transmit a Change ID, optional phase number, or plan path.<br>
```

Then wait.

Refuse plans under `context/archive/`. Read the resolved plan fully, including `## Progress`, and read all files it references. Also read `context/foundation/lessons.md` when present.

Before changing code:

1. Verify that `## Progress` occurs exactly once at the end of the plan.
2. Verify phase blocks use plain bullets and progress checkboxes occur only in `## Progress`.
3. Find the first pending `- [ ]` item, or the first pending item in the requested phase.
4. Update `change.md` to `status: implementing` only when current status is `planned` or `plan_reviewed`; update its date.
5. Create one tracked task for each phase and mark the active phase in progress.

Emit:

```text
// [MOTIVE IMPLEMENTATION] :: [PLAN LOADED] //<br>
Change: <change-id><br>
Phase: <N and title><br>
Progress: <completed>/<total><br>
Next operation: <progress item><br>
```

## Implement a phase

Follow the plan's Intent and Contract while adapting to verified repository reality.

- Read the affected source and tests before editing.
- Maintain a touched-file set for the active phase.
- Add every created or modified path to that set.
- Include `context/changes/<change-id>/plan.md` in every phase set.
- In the first phase, include pre-existing changed or untracked files under the change folder.
- Do not add unrelated dirty paths to the set.

Implement all required work for the current phase before moving onward. Reuse existing patterns. Do not expand scope, add abstractions, or rewrite unrelated code without a plan-backed reason.

## Mismatch protocol

When repository reality materially conflicts with the plan, stop before adapting:

```text
// [MOTIVE IMPLEMENTATION] :: [PLAN MISMATCH] //<br>
Phase: <N><br>
Expected: <plan statement><br>
Observed: <repository evidence><br>
Impact: <why intent, safety, or verification changes><br>

// [AWAITING CONFIRMATION] //<br>
Choose: adapt and continue; skip this work; or stop for rites-of-true-aim replanning.<br>
```

Do not proceed until the user chooses. Record a chosen adaptation in the plan only when it changes the plan's durable contract and the user approved it.

## Verify and update progress

After implementation:

1. Run every automated verification command from the phase.
2. Fix failures before marking work complete.
3. Flip only the corresponding rows inside `## Progress` from `- [ ]` to `- [x]`.
4. Do not modify phase descriptions, success criteria, or add sidecar state files.
5. Mark the phase task complete only when all its automated and manual criteria are satisfied or explicitly deferred by the user.

For each phase with passing automated verification, pause for manual verification:

```text
// [MOTIVE IMPLEMENTATION] :: [MANUAL VERIFICATION REQUIRED] //<br>
Phase: <N><br>
Automated verification: passed<br>
Completed checks:<br>
- <automated command or assertion>
Manual checks required:<br>
- <manual criterion>

// [AWAITING CONFIRMATION] //<br>
Confirm manual verification, report failure, or request plan revision.<br>
```

Do not check off manual criteria until the user confirms them.

## Phase commit ritual

After manual verification succeeds, prepare one phase commit:

1. Union the touched-file set with `plan.md`.
2. Detect dirty paths outside that set.
3. If unrelated paths exist, show them under `// [MOTIVE IMPLEMENTATION] :: [UNRELATED WORK DETECTED] //` and ask whether to stage only the phase set, include the extra paths, or abort.
4. Stage explicit approved paths only. Never use `git add .` or `git add -A`.
5. If the staged diff is empty, leave progress rows SHA-less and report it.
6. Propose a Conventional Commit subject: `<type>(<change-id>): <phase title> (p<N>)`.
7. Include touched paths and user-supplied tracking references in the body.
8. Request approval under `// [AWAITING CONFIRMATION] //` before committing.
9. Commit without bypassing hooks or amending.
10. Capture the short SHA and append it to every Progress row completed in the phase.
11. Update `change.md.updated`, keep `status: implementing`, and clear the touched-file set.

Never infer issue references from branch names, filenames, or Change IDs.

## Between phases

When a next phase exists, report:

```text
// [MOTIVE IMPLEMENTATION] :: [PHASE SEALED] //<br>
Phase: <N><br>
Commit: <short SHA or none><br>
Progress: <completed>/<total><br>

// [AWAITING CONFIRMATION] //<br>
Choose: continue to Phase <N+1>; clear context then resume; or inspect the completed phase.<br>
```

If the user asks to run multiple phases consecutively, continue without the between-phase gate.

## Completion

When every progress row is complete:

1. Re-scan `## Progress` for pending rows.
2. If pending rows exist, report them under `// [MOTIVE IMPLEMENTATION] :: [INCOMPLETE PROGRESS] //` and ask whether to pause or continue to closeout with the remaining items recorded.
3. Set `change.md.status: implemented` and update its date.
4. Stage only `plan.md` and `change.md` for a closeout commit when they remain dirty after the final phase.
5. Propose `chore(<change-id>): close out plan (epilogue)` and obtain approval before committing.
6. Do not append the epilogue SHA to the plan.

Emit:

```text
// [MOTIVE IMPLEMENTATION] :: [IMPLEMENTATION SEALED] //<br>
Change: <change-id><br>
Phases: <completed>/<total><br>
Files changed: <key paths><br>
Plan: context/changes/<change-id>/plan.md<br>
Status: implemented<br>

// [NEXT DIRECTIVE] //<br>
Recommend hymn-of-engine-commencement <change-id> for implementation review, hymn-of-prevention-of-malfunction for convention code review, hymn-of-consecration-of-a-new-machine only when the plan changes, or stop.<br>
```

## Guardrails

1. Treat `## Progress` as the sole execution-state source.
2. Mark no manual verification item complete without explicit user confirmation.
3. Preserve unrelated dirty files unless the user explicitly includes them.
4. Never bypass hooks, amend prior commits, or use destructive Git commands.
5. Stop on material plan mismatch. Replanning is safer than improvising scope.
6. Implementation follows the approved plan. Plan-vs-implementation review belongs to **hymn-of-engine-commencement**. Plan review belongs to **hymn-of-consecration-of-a-new-machine**. Convention code review belongs to **hymn-of-prevention-of-malfunction**.
