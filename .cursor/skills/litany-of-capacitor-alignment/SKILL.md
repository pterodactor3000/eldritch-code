---
name: litany-of-capacitor-alignment
alias: litany-of-frame
description: Challenge assumptions about what to build before planning how to build it, then write a verified Frame Brief. Use when a bug and its proposed fix, a scope question, a design choice, or an assumed cause are presented as one fact, or when the user invokes litany-of-capacitor-alignment.
---

# Litany of Capacitor Alignment

Separate observation from claimed cause and proposed response before planning begins. This rite produces a verified framing record, not a technical plan or implementation.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_No task that is easy is ever worthwhile._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply this protocol to every message emitted in chat. It applies only to agent chat output: do not alter generated artifacts, external issue or pull-request payloads, HTML markers, or parser-required schemas.

- Begin each substantial lifecycle message with `// [CAPACITOR ALIGNMENT] :: [<PHASE>] //`. All text between `[` and `]` is uppercase. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Use compact, procedural Cogitation Unit diction: state verified inputs, hypothesis status, and result.
- Use `// [<RITE>] :: [ANALYSIS] //`, `// [<RITE>] :: [FINDINGS] //`, `// [AWAITING CONFIRMATION] //`, `// [<RITE>] :: [FAILED] //`, `// [<RITE>] :: [SUMMARY] //`, and `// [NEXT DIRECTIVE] //` where applicable.
- Do not use em dashes in headers or generated chat output.
- Never invoke a downstream rite automatically.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, clarification, confirmation, failure, and completion. This litany's framing templates name the fields and sections. Line layout from that file always applies.

## When to invoke

Use when a request contains:

- a bug plus a presumed fix
- a symptom plus a presumed cause
- a scope or design decision that may rest on an untested premise
- a request to challenge, rethink, or verify the problem before planning

Skip when the task is purely mechanical, the premise is already verified, or a feature is clearly scoped with no meaningful assumption to test.

## Resolve input

Accept a problem statement, a Change ID, or a file path.

- A Change ID resolves to `context/changes/<change-id>/research.md` when present.
- Read every supplied file fully before analysis.
- Read `context/foundation/lessons.md` when present.

When no input is supplied, emit:

```text
// [CAPACITOR ALIGNMENT] :: [AWAITING PRIMARY IMPULSE] //<br>
Transmit:<br>
1. Observation: what is happening or what scope is in question.
2. Initial framing: suspected cause or proposed approach.
3. Proposed direction: the response currently under consideration.
4. Optional evidence: research, incidents, or relevant files.
```

Then wait.

## Capture the framing

Record these separately and preserve the user's wording:

1. **Reported observation:** the literal visible effect, decision, or scope question.
2. **Initial framing:** the user's suspected cause or approach.
3. **Proposed direction:** what the user wants to do about it.

Echo the separation before investigation:

```text
// [CAPACITOR ALIGNMENT] :: [INITIAL IMPULSE] //<br>
Observation: <literal observable><br>
Initial framing: <user theory or approach><br>
Proposed direction: <requested response><br>

// [AWAITING CONFIRMATION] //<br>
Confirm this separation or correct the record. Observation remains evidence; cause and direction remain hypotheses until verified.<br>
```

Ask one short narrowing round before research. Questions must clarify the observation's scope or pattern. They must not propose solutions.

## Build the dimension map

Read the relevant code, documents, and adjacent context. Build only plausible dimensions where a failure or wrong decision could explain the observation. Pin the user's initial framing to one dimension without treating it as fact.

Present:

```text
// [CAPACITOR ALIGNMENT] :: [DIMENSION MAP] //<br>
1. <dimension>: <what evidence would indicate a break here>
2. <dimension>: <what evidence would indicate a break here> [INITIAL FRAMING]
3. <dimension>: <what evidence would indicate a break here>
```

## Investigate hypotheses

Create one read-only investigation per plausible dimension, usually two to four and never more than five. Use parallel exploration when available.

Every investigator receives:

- the literal observation
- one dimension hypothesis
- the expected evidence if that dimension is responsible
- a requirement to report `STRONG`, `WEAK`, or `NONE` with file and line or document and section evidence

Synthesize results without inventing certainty. If one hypothesis is already decisive, state why narrowing questions are unnecessary. Otherwise ask two to five questions that distinguish observations or tradeoff positions, always including an uncertainty option.

Pressure-test the leading hypothesis through at least one independent angle:

- an independent search that does not name the leading hypothesis
- prior occurrences in active or archived change records
- an inverse prediction or expected absence
- comparison against the initial framing

If the initial framing remains equally supported, retain it. Do not manufacture a reframe.

## Write the Frame Brief

Resolve `context/changes/<change-id>/`:

- Use the supplied Change ID when its folder exists.
- Otherwise derive a unique kebab-case Change ID and create the folder plus `change.md`, following **rites-of-commission** semantics.
- Refuse paths under `context/archive/`.
- Update `change.md` with today's date. Advance `status: new` to `status: preparing`; preserve any other status.

Write `context/changes/<change-id>/frame.md`:

```markdown
# Frame Brief: <Topic>

> Framing record before implementation planning. It separates verified observation from initial assumptions.

## Reported Observation

<Literal user observation, unchanged.>

## Initial Framing (preserved)

- **User's stated cause or approach:** <initial framing>
- **User's proposed direction:** <proposed direction>
- **Pre-dispatch narrowing:** <scope or pattern clarification>

## Dimension Map

1. **<Dimension>:** <expected evidence>
2. **<Dimension>:** <expected evidence, initial framing if applicable>

## Hypothesis Investigation

| Hypothesis | Evidence | Verdict |
| --- | --- | --- |
| <dimension> | <file:line or document:section evidence> | STRONG | WEAK | NONE |

## Narrowing Signals

- <Decisive user answer or verified observation>

## Cross-System Check

<Independent evidence that strengthened, weakened, or preserved the leading hypothesis.>

## Reframed (or Confirmed) Problem Statement

<One clear statement of the actual problem to plan around, or that the initial framing held.>

## Confidence

**HIGH | MEDIUM | LOW:** <evidence-based reason and required next verification if Low.>

## What Changes for Planning

<What the future plan must address, without choosing an implementation approach.>

## References

- <file:line or document:section>
```

Keep the brief focused. Do not include implementation phases, file-change prescriptions, framework choices, or solution design.

## Completion

Emit:

```text
// [CAPACITOR ALIGNMENT] :: [FRAME SEALED] //<br>
Change: <change-id><br>
Confidence: <HIGH | MEDIUM | LOW><br>
Observation: <one line><br>
Initial framing: <one line><br>
Reframed problem: <one line, or INITIAL FRAMING CONFIRMED><br>
Record: context/changes/<change-id>/frame.md<br>

// [NEXT DIRECTIVE] //<br>
<Recommend rites-of-true-aim <change-id>, further verification, discussion, or stop.><br>
```

Do not automatically invoke planning.

## Guardrails

1. Keep observation, cause, and proposed direction separate throughout.
2. Do not propose a technical solution, phase breakdown, or implementation plan.
3. Ground every conclusion in project evidence. Priors may form hypotheses but never prove them.
4. Investigate only plausible dimensions. Do not pad hypothesis count.
5. A confirmed initial framing is a successful outcome.
6. If confidence remains low, recommend reproduction or evidence gathering before planning.
