---
name: rites-of-vows-acquisitorius
alias: rites-of-e2e
description: Drive approved browser-level E2E plan phases against a running application, one named risk at a time. Generate, review, deliberately break-verify, and commit resilient Playwright tests. Use when the user asks for E2E testing, browser test coverage, Playwright test generation, or invokes rites-of-e2e.
---

# Rites of Vows Acquisitorius

Drive approved E2E phases from `context/changes/<change-id>/plan.md`. This rite protects one concrete browser-level risk at a time. It does not scaffold an E2E framework or implement missing product features.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_The Quest for Knowledge is our sacred task. Ours is not to understand or question, ours is to possess, to reclaim, to seize. Ours is the logic and the power._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply [Cogitation Output Conventions](../conventions.md) (including line layout) to every chat message. This rite's templates name the fields and sections. Line layout from that file always applies.

- Begin substantial lifecycle messages with `// [VOWS ACQUISITORIUS] :: [<PHASE>] //`. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- State verified risk, application status, action, and result in compact procedural diction.
- Gate every write, progress update, and commit under `// [AWAITING CONFIRMATION] //`.
- Never invoke a downstream rite automatically.

## Resolve invocation

Accept:

- `<change-id> [phase N]`, resolving to `context/changes/<change-id>/plan.md`.
- A direct `plan.md` path.
- A standalone risk identifier or no argument, which selects one browser-level risk from `context/foundation/test-plan.md`.

Refuse plans under `context/archive/`.

For plan-driven work, read the whole plan, especially `## Progress`, then read `context/foundation/test-plan.md` and `context/foundation/lessons.md` when present. `## Progress` is the only execution-state authority.

If no plan or standalone risk is available, emit:

```text
// [VOWS ACQUISITORIUS] :: [INPUT REQUIRED] //<br>
Transmit:<br>
1. Change ID and optional phase, plan path, or browser-level risk.
```

## Preflight

Before a phase, verify all of these:

1. The phase protects a browser-level risk crossing real boundaries or visible only in the rendered UI.
2. The feature is implemented and the application runs.
3. Playwright configuration and at least one E2E spec exist.
4. No passing E2E test already protects the same risk.

Inspect Playwright configuration, one representative spec, authentication setup, the single-spec command, and application startup configuration. Do not install Playwright, invent configuration, or configure CI.

If Playwright is absent, the feature is missing, or the risk is better proven by an isolated unit or integration test, stop and report evidence. Recommend the correct existing workflow:

- Missing implementation or general plan work: `rites-of-ignition`.
- Isolated test-first risk: appropriate TDD workflow.
- Existing failing E2E test: debug root cause. Do not overwrite assertions.

If a passing test already protects the risk, report it. Do not duplicate coverage.

## E2E loop

For each eligible risk, execute `PLAN`, `GENERATE`, `REVIEW`, then `VERIFY`.

### PLAN

State one observable user outcome. Map the real browser flow through the accessibility tree, not screenshots or guessed selectors. Identify:

- Internal boundaries that stay real, including routing, authentication, and data flow.
- External, expensive, or nondeterministic APIs that may be mocked at their actual call boundary.
- The assertion that must fail if the named risk materializes.

Keep the budget tight: normally one test per risk and rarely more than three tests per phase.

### GENERATE

Follow the repository's test placement and seed-test conventions. If none exist, stop rather than inventing a framework structure.

Each test must:

- Use role-based, accessible locators.
- Own setup, action, assertion, and cleanup.
- Use unique data and authenticate without the UI.
- Wait for observable state, never fixed time.
- Have a risk-specific test name.
- Exercise real internal boundaries and mock only permitted external boundaries.

Do not use `test.skip()`, `test.fixme()`, shared state, CSS selectors, pixel assertions for functional risks, or arbitrary timeouts.

### REVIEW

Review every generated test for:

1. Hallucinated assertions not observed in the running app.
2. Brittle selectors.
3. Shared state or missing cleanup.
4. Time-based waits.
5. Assertions that do not protect the named risk.

Correct each identified defect with the concrete observed UI state or project pattern. Do not silently accept a generated test.

### VERIFY

Run the project's single-spec command. Test must pass against the running application.

Then conduct a deliberate-break check: temporarily invert or weaken the exact behavior under test, rerun the spec, and confirm it fails. Revert the break immediately. Never stage or commit it.

If the test stays green, its assertion is decorative. Return to PLAN or GENERATE.

After a green run and reverted deliberate break, present:

```text
// [VOWS ACQUISITORIUS] :: [RISK VERIFIED] //<br>
Risk: <named risk><br>
Spec: <path><br>
Verification: green; deliberate break detected<br>

// [AWAITING CONFIRMATION] //<br>
Approve progress update; revise test; or stop.<br>
```

On approval, flip only the matching automated `## Progress` row from `- [ ]` to `- [x]`. In standalone mode, report the protected risk and spec, then stop.

## Phase closure

After all automated risks in a phase pass:

1. Run every new or changed phase spec again.
2. Present the plan's manual verification criteria and await confirmation.
3. Track every changed path, including `plan.md` and first-phase E2E support files.
4. Detect dirty paths outside the touched set. Ask whether to stage only the phase set, include extras, or stop.
5. Stage explicit approved paths only. Never use `git add .` or `git add -A`.
6. Propose `test(<change-id>): <phase title> (p<N>)`.
7. Await commit approval. Commit normally, never bypass hooks or amend.
8. Append the short commit SHA to only Progress rows completed in this phase.

When another eligible phase remains, report status and await confirmation to continue, clear context, or stop. Do not mark manual criteria complete without explicit confirmation.

## Completion

When all relevant Progress rows are complete, update `change.md` to `status: implemented` only after user approval. Commit remaining plan and status changes separately if needed.

```text
// [VOWS ACQUISITORIUS] :: [E2E SEALED] //<br>
Change: <change-id><br>
Risks protected: <count><br>
Specs added: <paths><br>
Progress: <completed>/<total><br>

// [NEXT DIRECTIVE] //<br>
Invoke: hymn-of-engine-commencement <change-id><br>
```

## Guardrails

1. E2E tests protect named cross-boundary or UI-only risks, not coverage counts.
2. Never create E2E coverage for a feature that is not built and runnable.
3. Never claim risk protection without a green run and deliberate-break failure.
4. Preserve unrelated working-tree changes.
5. Do not install tools, scaffold test infrastructure, or mutate CI unless explicitly requested.
