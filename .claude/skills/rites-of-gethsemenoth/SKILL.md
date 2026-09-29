---
name: rites-of-gethsemenoth
alias: rites-of-goal-implementation
description: Autonomously execute approved technical plans under /goal without human gates. Implement each phase, verify automated criteria, perform deliberate-break checks, commit on green, and report pending manual verification. Use for unattended, headless, autonomous, or /goal plan execution.
---

# Rites of Gethsemenoth

Autonomously execute an approved `context/changes/<change-id>/plan.md` under `/goal`. Human gates are prohibited. This rite completes automated work, commits each green phase, and reports manual rows as a final checklist.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_Let the weaker in mind follow the words of the strong!_

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply [Cogitation Output Conventions](../conventions.md) (including line layout) to every chat message, except confirmation gates. This rite is unattended and must not request approval.

- Begin substantial lifecycle messages with `// [GETHSEMENOTH] :: [<PHASE>] //`. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Narrate gate verdicts, adaptations, commits, and pending manual rows. `/goal` evaluators rely on conversation evidence.
- Never invoke interactive question tools.
- Resolve ambiguity conservatively: touch fewer files, preserve behavior, and follow the plan's literal intent.
- Stop only for a structural mismatch or exhausted automatic gate-fix attempts.

## Resolve and load

Accept `<change-id> [phase N]` or a direct `plan.md` path. Refuse plans under `context/archive/`.

If no plan resolves, print a decisive failure and stop. Do not guess.

Read the plan fully, including `## Progress`, referenced change artifacts, and `context/foundation/lessons.md` when present. `## Progress` is the sole execution-state authority. Only rows under `#### Automated` are within this rite's jurisdiction.

Before implementation:

1. Verify every automated command in the plan can run in current environment.
2. Set `change.md.status` to `implementing` only from `planned` or `plan_reviewed`.
3. Create one tracked task per phase. Set current task in progress.
4. Find the first unchecked automated Progress row, or the first in requested phase.

If a required command is unavailable, stop when the affected phase begins. Do not skip verification.

## Mismatch policy

Classify differences between plan and repository:

- Minor: moved file, renamed symbol, import drift, or trivial API/configuration difference. Adapt, narrate the change, and continue.
- Structural: missing dependency, incompatible architecture, absent assumed API, or redesign requirement. Stop.

When uncertain, treat mismatch as structural.

```text
// [GETHSEMENOTH] :: [STOPPED] //<br>
Phase: <N><br>
Expected: <plan requirement><br>
Found: <repository evidence><br>
Reason: <why autonomous continuation would redesign scope><br>
Resume: resolve issue, then rerun rites-of-goal-implementation <change-id> phase <N>.<br>
```

## Execute phase

Maintain a touched-file set:

- Add every modified or created path.
- Always include `context/changes/<change-id>/plan.md`.
- In phase one, include existing dirty or untracked files under the change directory.
- Never stage paths outside this set.

Implement the full phase using established repository patterns. Update only matching automated Progress rows from `- [ ]` to `- [x]`. Do not change phase descriptions, success criteria, or manual rows.

## Automatic gate stack

Run this order after phase implementation. Narrate each result as `GATE <name>: PASS` or `GATE <name>: FAIL (<summary>, attempt <n>/2)`.

1. Run phase automated success-criteria commands.
2. Stage touched files explicitly by path.
3. When a test changed or was added, perform a deliberate-break check:
   - Make an unstaged, temporary production behavior break.
   - Run relevant test.
   - Confirm test fails.
   - Restore temporary edit unconditionally before continuing.
4. Run full applicable repository test, lint, and type checks.
5. Commit only after every gate passes.

For any failed gate, make at most two safe self-fix attempts. Never weaken an assertion, delete a test, relax lint or type rules, or skip a check unless plan explicitly requires it.

On a third failure, restore any deliberate break, leave completed work uncommitted, print the stopped template, and stop.

## Autonomous commit ritual

After green gates:

1. List dirty paths outside touched set as unstaged and preserve them.
2. Stage only touched paths. Never use `git add .` or `git add -A`.
3. If staged diff is empty, leave Progress rows SHA-less and continue.
4. Commit using `<type>(<change-id>): <phase title> (p<N>)`.
5. Never bypass hooks, amend, or disable signing.
6. On hook failure, treat it as an automatic gate failure and create a new commit only after fix.
7. Capture short SHA and append it to Progress rows completed in phase.
8. Update `change.md.updated`, mark phase task complete, reset touched set, and continue directly to next phase.

No commit or phase requires approval.

## Manual rows

Never flip rows under `#### Manual`. They do not block automated completion or commit. Include pending manual rows from each phase in final run report.

## Completion

When all automated Progress rows are complete:

1. Set `change.md.status` to `implemented`.
2. Commit remaining plan SHA updates and `change.md` status with `chore(<change-id>): close out plan (epilogue)`.
3. Do not append epilogue SHA to Progress.
4. Mark remaining phase tasks complete.

End every success or stop with:

```text
// [GETHSEMENOTH] :: [RUN REPORT] //<br>
Change: <change-id><br>
Phases: <completed>/<total><br>
Commits: <phase and SHA list><br>
Gate verdicts: <summary><br>
Adaptations: <list|none><br>
Pending manual verification:<br>
- <verbatim Progress rows|none>
Status: <implemented|stopped><br>
```

## Guardrails

1. No human approval, questions, or confirmation gates.
2. Automated verification cannot be skipped.
3. Commit only on green.
4. Preserve unrelated working-tree changes.
5. Manual verification remains human work.
6. Stop rather than redesigning a plan autonomously.
