---
name: rites-of-protector-imperative
alias: rites-of-test-driven-development
description: Execute approved plan phases test-first through red, green, and refactor. Verify test infrastructure and implementation absence, update plan progress, require manual validation, and commit each verified phase. Use when the user asks for TDD, test-first execution, red-green-refactor, or invokes rites-of-test-driven-development.
---

# Rites of Protector Imperative

Execute an approved `context/changes/<change-id>/plan.md` one phase at a time through red, green, and refactor. This rite applies only to unimplemented behavior that can be driven by a failing test.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_01001001 01110010 01101111 01101110 00100000 01101111 01110110 01100101 01110010 00100000 01100110 01101100 01100101 01110011 01101000 00101100 00001010 01100011 01101111 01100111 01101001 01110100 01100001 01110100 01101001 01101111 01101110 00100000 01101111 01110110 01100101 01110010 00100000 01110100 01101000 01101111 01110101 01100111 01101000 01110100 00101100 00001010 01101001 01101110 01100110 01101111 01110010 01101101 01100001 01110100 01101001 01101111 01101110 00100000 01101111 01110110 01100101 01110010 00100000 01100011 01101111 01101110 01101010 01100101 01100011 01110100 01110101 01110010 01100101 00101110 00001010 01010100 01101000 01110101 01110011 00100000 01101001 01110011 00100000 01110000 01110101 01110010 01101001 01110100 01111001 00101100 00100000 01100001 01101110 01100100 00100000 01110110 01101001 01100011 01110100 01101111 01110010 01111001 00101100 00100000 01100001 01110011 01110011 01110101 01110010 01100101 01100100 00101110_

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply [Cogitation Output Conventions](../conventions.md) (including line layout) to every chat message. This rite's templates name the fields and sections. Line layout from that file always applies.

- Begin substantial lifecycle messages with `// [PROTECTOR IMPERATIVE] :: [<PHASE>] //`. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- State phase, behavior, verification result, and required confirmation in compact procedural diction.
- Gate commits, progress-changing writes, and material plan changes under `// [AWAITING CONFIRMATION] //`.
- Never invoke another rite automatically.

## Resolve plan

Accept `<change-id> [phase N]` or a direct `plan.md` path. Refuse plans under `context/archive/`.

When no plan is supplied:

```text
// [PROTECTOR IMPERATIVE] :: [INPUT REQUIRED] //<br>
Transmit:<br>
1. Change ID, optional phase number, or plan path.
```

Read the resolved plan fully. `## Progress` is the only execution-state authority. Also read `context/foundation/lessons.md` when present.

## Preflight

Before changing code:

1. Confirm a test runner, test configuration, single-test command, and one or two representative tests exist.
2. Identify test conventions: imports, nesting, setup, mocks, placement, and assertions.
3. Inspect the pending phase for its required behavior.
4. Search only the relevant paths and symbols to confirm production implementation is absent.
5. Set `change.md.status` to `implementing` only when current status is `planned` or `plan_reviewed`.

If no test infrastructure exists, stop. Do not install a runner, create configuration, scaffold fixtures, or wire CI.

If phase implementation already exists, stop. Do not add retroactive tests under a TDD label. Recommend `rites-of-ignition` for that phase.

## Eligibility gate

Drive a phase test-first only when an observable outcome can be asserted before production code exists.

Suitable:

- Functions, transforms, parsers, validators, reducers, and state machines.
- API contracts and authorization behavior.
- Business rules with clear inputs and outputs.
- Integration flows across controlled boundaries.
- Bugs with a reproducible failing case.

Redirect to direct implementation when the work is configuration, scaffolding, deployment wiring, visual polish without automation, documentation, or an exploratory spike.

For mixed phases, ask whether to TDD the behavioral part and implement thin non-testable work directly, redirect the phase, or stop.

## Red, green, refactor

Work one behavior at a time. Each automated plan step maps to one small loop.

### RED

1. Write a focused test using existing repository patterns.
2. Name the expected outcome, not an internal function call.
3. Assert observable output, response, UI state, or state shape, never private internals.
4. Run the smallest relevant test command.
5. Confirm failure occurs for the intended missing behavior, not a syntax error, bad import, or broken test setup.

Never skip a test to pass a phase.

### GREEN

1. Implement only the minimum production code needed for the failing test.
2. Re-run the focused test and confirm it passes.
3. Fix regressions in related tests without weakening assertions.

### REFACTOR

1. Improve types, naming, structure, or duplication without changing behavior.
2. Re-run tests after meaningful refactors.
3. Mark only the completed automated `## Progress` row from `- [ ]` to `- [x]`.

Repeat until the phase's automated criteria pass.

## Verify and close phase

Maintain a touched-file set containing every modified path plus the plan. Include untracked change-folder artifacts in the first phase only.

Before proposing a commit:

1. Run full applicable test suite, lint, types, and plan-required automated checks.
2. Fix all failures. Never commit while tests are red or skipped.
3. Present manual verification criteria and await user confirmation.
4. Detect unrelated dirty paths. Ask whether to stage only touched paths, include extras, or stop.
5. Stage approved paths explicitly. Never use `git add .` or `git add -A`.
6. Propose `<type>(<change-id>): <phase title> (p<N>)`.
7. Await approval, then commit without bypassing hooks or amending.
8. Append commit short SHA to Progress rows completed in that phase.
9. Update `change.md.updated`; preserve `implementing` until final completion.

Present:

```text
// [PROTECTOR IMPERATIVE] :: [PHASE SEALED] //<br>
Phase: <N><br>
Progress: <completed>/<total><br>
Commit: <short SHA|none><br>

// [AWAITING CONFIRMATION] //<br>
Continue; clear context and resume; inspect phase; or stop.<br>
```

## Completion

When every Progress row is complete:

1. Re-scan for pending rows.
2. Set `change.md.status` to `implemented` after confirmation.
3. If needed, separately commit the plan and change-record closeout.

```text
// [PROTECTOR IMPERATIVE] :: [IMPLEMENTATION SEALED] //<br>
Change: <change-id><br>
Phases: <completed>/<total><br>
Tests: <key paths><br>
Status: implemented<br>

// [NEXT DIRECTIVE] //<br>
Invoke: hymn-of-engine-commencement <change-id><br>
```

## Guardrails

1. Failing test precedes each behavior's production code.
2. Test outcomes, not implementation details.
3. Keep loops small. Do not batch speculative production code.
4. Preserve unrelated changes.
5. Stop and ask when plan contract conflicts with repository reality.
6. Never mark manual verification complete without user confirmation.
