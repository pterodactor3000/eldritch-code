---
name: rites-of-bulwark-imperative
alias: rites-of-test-plan
description: Create and maintain a phased brownfield test-rollout strategy in context/foundation/test-plan.md. Derive risks from evidence, prioritize cheapest useful test layers, and hand each rollout phase to the change, research, plan, and implementation workflow. Use when the user asks for a test plan, test strategy, QA specification, or phased test rollout.
---

# Rites of Bulwark Imperative

Create and manage `context/foundation/test-plan.md` as a phased test-rollout strategy. It identifies risks and proof obligations, then routes each phase through existing change, research, planning, and implementation workflows. It does not write tests or configure CI directly.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_01001001 01110010 01101111 01101110 00100000 01101111 01110110 01100101 01110010 00100000 01100110 01101100 01100101 01110011 01101000 00101100 00001010 01100011 01101111 01100111 01101001 01110100 01100001 01110100 01101001 01101111 01101110 00100000 01101111 01110110 01100101 01110010 00100000 01110100 01101000 01101111 01110101 01100111 01101000 01110100 00101100 00001010 01101001 01101110 01100110 01101111 01110010 01101101 01100001 01110100 01101001 01101111 01101110 00100000 01101111 01110110 01100101 01110010 00100000 01100011 01101111 01101110 01101010 01100101 01100011 01110100 01110101 01110010 01100101 00101110 00001010 01010100 01101000 01110101 01110011 00100000 01101001 01110011 00100000 01110000 01110101 01110010 01101001 01110100 01111001 00101100 00100000 01100001 01101110 01100100 00100000 01110110 01101001 01100011 01110100 01101111 01110010 01111001 00101100 00100000 01100001 01110011 01110011 01110101 01110010 01100101 01100100 00101110_

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply [Cogitation Output Conventions](../conventions.md) (including line layout) to every chat message. This rite's state and handoff templates name the fields and sections. Line layout from that file always applies.

- Begin substantial lifecycle messages with `// [BULWARK IMPERATIVE] :: [<PHASE>] //`. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- State evidence, risk, rollout status, and next handoff in compact procedural diction.
- Gate guide creation and every guide update under `// [AWAITING CONFIRMATION] //`.
- Stop at each downstream handoff. Never invoke another rite automatically.

## Invocation and state

Accept:

- No arguments: derive state and act on next pending rollout operation.
- One or more document paths: use as context sources for initial discovery.
- `--status`: report current rollout state without writing.
- `--refresh`: open a new refresh change. Never rewrite an existing guide in place.

Every invocation:

1. Confirm a project marker or existing PRD.
2. Check `context/foundation/test-plan.md`.
3. If missing, follow Initial planning.
4. If present, read it, find first rollout phase not `complete`, reconcile on-disk status, and present one handoff.

Status vocabulary is fixed: `not started`, `change opened`, `researched`, `planned`, `implementing`, `complete`.

## Principles

1. Choose the cheapest test that produces real signal for a named risk.
2. User concerns are evidence equal to requirements and repository history.
3. Risks are behavior scenarios, not code locations. Do not insert file anchors or symbols into the risk map.
4. Protect high-impact, high-likelihood risks first.
5. AI-native testing, browser automation, and quality gates earn inclusion only when they add signal beyond cheaper deterministic tests.

## Initial planning

### Discover evidence

Read only available sources:

- Supplied paths, PRD, roadmap, archived change plans, technical-stack notes.
- Repository instructions and test configuration.
- Manifest, test runner, existing test layout, and test count.

Build a concise test-base profile:

- `none`: no runner and fewer than three real test files.
- `sparse`: limited coverage or narrow clustering.
- `meaningful`: runner and broad suite across repository.

Perform a scoped 30-day hot-spot scan over hand-written source roots. Exclude generated output, dependencies, coverage, lockfiles, fixtures, and archives. Use churn as likelihood evidence only. If fewer than five relevant commits exist, state insufficient history.

Do not inspect call graphs, schemas, or failure ownership. That belongs to the later research phase.

### Interview

Ask one question at a time:

1. What product failure worries the team most?
2. What past failure caused real cost or mistrust?
3. Which area changes often without confidence?
4. What feels under-tested, when a meaningful suite exists?
5. What should not receive test budget?

Echo each answer compactly. Record user skips and uncertainty. Ask for confirmation before synthesis.

### Create risk brief

Derive five to seven evidence-backed risks. For each, record:

- Failure scenario.
- Impact and likelihood: `High`, `Medium`, or `Low`.
- Evidence source: requirements, interview, archived work, or hot-spot directory.
- Observable proof of protection.
- Assumption to challenge.
- Context required from later research.
- Likely cheapest test layer.
- Test anti-pattern to avoid.

When authentication, payments, or untrusted input exist, include applicable abuse risks: authorization, validation, data leakage, or resource abuse.

Drop speculative risks that lack evidence or cannot state observable protection.

### Draft rollout

Create three to five phases ordered by risk and cost. Typical phases:

1. Critical-path coverage.
2. Integration around high-churn risks.
3. Browser or AI-native coverage only where justified.
4. Quality-gate wiring.

Present brief and rollout for confirmation:

```text
// [BULWARK IMPERATIVE] :: [ROLLOUT READY] //<br>
Test base: <none|sparse|meaningful><br>
Risks: <count><br>
Proposed phases: <ordered names><br>
Target: context/foundation/test-plan.md<br>

// [AWAITING CONFIRMATION] //<br>
Approve guide; revise risks; revise phases; or cancel.<br>
```

After approval, create `context/foundation/` when needed and write:

```markdown
# Test Plan

## Strategy
## Risk Map
## Risk Response Guidance
## Phased Rollout
| # | Phase | Goal | Risks | Test types | Status | Change folder |
|---|---|---|---|---|---|---|

## Stack and Test Base
## Evidence and Hot Spots
## Cookbook Patterns
## Negative Space
```

The risk map cites evidence, never file anchors. The phased-rollout status table is authoritative state for this rite.

## Handoff state machine

For current phase, inspect the mapped change folder:

- Folder missing: propose `testing-<phase-name>` and hand off to `rites-of-commission`.
- `change.md` only: hand off to `prayer-of-unbroken-thread` with risks, proof obligations, evidence, and anti-patterns.
- `research.md` present, no `plan.md`: hand off to `rites-of-true-aim` with grounded research and risk response guidance.
- `plan.md` has pending Progress: hand off to `rites-of-ignition`.
- `plan.md` Progress complete: mark rollout phase `complete` after confirmation, then select next pending phase.

Before each handoff, reconcile stale state only after approval. Print:

```text
// [BULWARK IMPERATIVE] :: [HANDOFF READY] //<br>
Rollout phase: <N and name><br>
Status: <status><br>
Next rite: <name><br>
Reason: <on-disk evidence><br>

// [NEXT DIRECTIVE] //<br>
Run: <exact invocation><br>
```

Stop after handoff. Do not execute the next rite.

## Refresh and completion

`--refresh` opens a new `test-plan-refresh-<YYYY-MM-DD>` change when priorities, stack, or tool guidance are stale. Do not edit strategy or risk history in place.

When all rollout phases are complete, report phases, change folders, current test strategy, and unresolved negative space. Recommend testing the guide in a fresh agent session. Stop.

## Guardrails

1. Brownfield only. For a project without implementation, requirements, or historical evidence, stop and request product definition first.
2. Never invent risks or file-level failure anchors.
3. Never write test code, CI configuration, or production code in this rite.
4. Never move to a downstream rite automatically.
5. Preserve completed rollout history. Refresh through a new tracked change.
