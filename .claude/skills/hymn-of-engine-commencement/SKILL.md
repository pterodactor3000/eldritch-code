---
name: hymn-of-engine-commencement
alias: hymn-of-implementation-review
description: Review implemented plan work for plan drift, scope violations, safety risks, architecture and pattern compliance, and success-criteria evidence. Use when the user asks to review implementation against a plan, review a completed phase, validate implemented work, or invokes hymn-of-engine-commencement.
---

# Hymn of Engine Commencement

Compare implementation to its approved plan before drift and unsafe decisions compound. This rite reviews one completed phase or all completed plan phases. It does not modify code unless the user selects a fix during triage.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_The machine is my temple. Each one a sacred shrine. I name each piston blessed, and every gear divine._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply this protocol to every message emitted in chat. It applies only to agent chat output: do not alter generated artifacts, external issue or pull-request payloads, HTML markers, or parser-required schemas.

- Begin each substantial lifecycle message with `// [MOTIVE CONSECRATION] :: [<PHASE>] //`. All text between `[` and `]` is uppercase. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Use compact, procedural Cogitation Unit diction: state reviewed scope, evidence, verdict, and required decision.
- Use `// [<RITE>] :: [ANALYSIS] //`, `// [<RITE>] :: [FINDINGS] //`, `// [AWAITING CONFIRMATION] //`, `// [<RITE>] :: [FAILED] //`, `// [<RITE>] :: [SUMMARY] //`, and `// [NEXT DIRECTIVE] //` where applicable.
- Do not use em dashes in headers or generated chat output.
- Never invoke a downstream rite automatically.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This hymn's review schema names the fields and sections. Line layout from that file always applies.

## Resolve input

Accept:

- A saved report containing `<!-- IMPL-REVIEW-REPORT -->` for resume triage.
- A Change ID resolving to `context/changes/<change-id>/plan.md`.
- A direct plan path.
- An optional `phase N` scope.

With no input, select the most recently updated active change whose status is `implementing` or `implemented`, then emit:

```text
// [MOTIVE CONSECRATION] :: [REVIEW TARGET] //<br>
Candidate: <change-id><br>
Plan: <plan path><br>

// [AWAITING CONFIRMATION] //<br>
Confirm candidate, transmit another Change ID or plan path, or stop.<br>
```

Then wait.

Refuse archived plans. In fresh mode, read the plan, its `## Progress`, sibling `change.md`, and `context/foundation/lessons.md` fully. Read a sibling `plan-brief.md` when present.

## Detect review scope

The requested phase limits review to that phase. Otherwise review every phase whose Progress rows are all complete.

Extract:

- planned paths, Intent, Contract, and success criteria
- architecture decisions and out-of-scope boundaries
- automated and manual verification state
- Change ID and plan date

Determine actual changed files from the plan-era commit range. If no reliable range exists, use commits tied to the Change ID and inspect the working diff. Categorize each path:

- planned and changed
- changed but unplanned
- planned but missing

Emit:

```text
// [MOTIVE CONSECRATION] :: [REVIEW SCOPE] //<br>
Change: <change-id><br>
Scope: <phase N | completed phases><br>
Progress: <completed>/<total><br>
Planned paths: <count><br>
Changed paths: <count><br>
Unplanned paths: <count><br>
Missing paths: <count><br>
```

## Gather evidence

Use two focused, read-only investigations in parallel:

1. **Plan adherence:** compare each planned change with actual code and report `MATCH`, `DRIFT`, `MISSING`, or `EXTRA`.
2. **Safety and patterns:** inspect changed files for security, data safety, reliability, performance, architecture boundaries, and substantive divergence from local conventions.

Read evidence required to verify agent claims. Do not report formatting preferences as defects.

Run every automated verification command specified by the reviewed phases. For manual criteria, compare checked Progress rows with observable implementation evidence. Flag manual items marked complete without credible evidence. Acknowledge unchecked manual rows as pending.

## Analyze

Review these dimensions:

- **Plan Adherence:** implemented Intent and Contract match the plan.
- **Scope Discipline:** unplanned work and explicit exclusions are respected.
- **Safety and Quality:** security, performance, reliability, and data safety are adequate.
- **Architecture:** module boundaries, dependency direction, and abstractions remain sound.
- **Pattern Consistency:** implementation follows relevant project conventions.
- **Success Criteria:** automation passes and manual completion is credible.

Use findings only for substantive issues. Each finding includes:

- ID: `F1`, `F2`, and so on
- Severity: `CRITICAL`, `WARNING`, or `OBSERVATION`
- Impact: `LOW`, `MEDIUM`, or `HIGH`
- Dimension, location, evidence-backed detail, and one fix
- A second fix only for a real tradeoff, with Strength, Tradeoff, Confidence, and Blind Spot

Verdicts:

- **APPROVED:** all pass, or only minor warnings.
- **NEEDS ATTENTION:** targeted correction or decision required.
- **REJECTED:** critical safety, major drift, data safety, or failed automated verification.

## Present report

Emit:

```markdown
// [MOTIVE CONSECRATION] :: [IMPLEMENTATION REVIEW] //<br>
Change: <change-id><br>
Scope: <phase scope><br>
Date: <YYYY-MM-DD><br>
Grounding: <verified files, commits, and commands><br>

// [VERDICTS] //<br>
| Dimension | Verdict |
| --- | --- |
| Plan Adherence | PASS | WARNING | FAIL |
| Scope Discipline | PASS | WARNING | FAIL |
| Safety and Quality | PASS | WARNING | FAIL |
| Architecture | PASS | WARNING | FAIL |
| Pattern Consistency | PASS | WARNING | FAIL |
| Success Criteria | PASS | WARNING | FAIL |

// [FINDINGS] //<br>
### F1: <short title>
- **Severity:** CRITICAL | WARNING | OBSERVATION
- **Impact:** LOW | MEDIUM | HIGH
- **Dimension:** <dimension>
- **Location:** <path:line or N/A>
- **Detail:** <plan versus implementation evidence>
- **Fix:** <specific correction>
- **Decision:** PENDING

// [VERDICT] //<br>
APPROVED | NEEDS ATTENTION | REJECTED: <one-line rationale><br>
```

If no findings exist, report the passing evidence and verdict without inventing concerns.

## Save and triage

Ask:

```text
// [AWAITING CONFIRMATION] //<br>
Triage now, save and triage later, or save only.<br>
```

On save, write:

- Full review: `context/changes/<change-id>/reviews/impl-review.md`
- Phase review: `context/changes/<change-id>/reviews/impl-review-phase-<N>.md`

Include `<!-- IMPL-REVIEW-REPORT -->`, the report, and `Decision: PENDING` fields. Update `change.md` with `status: impl_reviewed` and today's date.

In triage, process pending findings by severity. The user may apply the recommended fix, choose a real alternative, specify a different fix, skip, accept risk, or dismiss.

For an approved fix:

1. Show the targeted before and after edit.
2. Apply only the agreed edit.
3. Mark the report `FIXED` with the selected resolution.
4. Update any affected success criteria or review evidence.

Record non-edits as `SKIPPED`, `ACCEPTED`, or `DISMISSED`. Never edit code, plans, or lessons merely because a finding exists.

## Completion

After triage, emit:

```text
// [MOTIVE CONSECRATION] :: [REVIEW SEALED] //<br>
Fixed: <count><br>
Skipped: <count><br>
Accepted: <count><br>
Dismissed: <count><br>
Verdict: <updated verdict><br>
Report: <path><br>
F1: <FIXED | SKIPPED | ACCEPTED | DISMISSED>. <resolution><br>

// [NEXT DIRECTIVE] //<br>
Recommend rites-of-ignition for approved fixes, canticle-of-binary-merge for review-ready committed work, or stop.<br>
```

## Guardrails

1. Review implementation against the plan, not against a preferred rewrite.
2. Treat `plan.md` and `## Progress` as the source of intended scope and completion state.
3. Tie every finding to plan, code, test, commit, or explicit missing evidence.
4. Do not create scope merely because adjacent improvements are possible.
5. Keep fixes targeted and user-approved.
