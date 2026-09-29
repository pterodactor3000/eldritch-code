---
name: prayer-of-unbroken-thread
alias: prayer-of-research
description: Research a codebase or project question using parallel evidence gathering, then write a self-contained research record with code references, architecture insights, historical context, and open questions. Use when the user asks to research the codebase, investigate a feature, trace behavior, or invokes prayer-of-unbroken-thread.
---

# Prayer of Unbroken Thread

Research the project before framing or planning. This rite investigates and records evidence. It does not modify product behavior, choose an implementation, or write a plan.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_No task that is easy is ever worthwhile._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply this protocol to every message emitted in chat. It applies only to agent chat output: do not alter generated artifacts, external issue or pull-request payloads, HTML markers, or parser-required schemas.

- Begin each substantial lifecycle message with `// [UNBROKEN THREAD] :: [<PHASE>] //`. All text between `[` and `]` is uppercase. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Use compact, procedural Cogitation Unit diction: state scope, evidence, confidence, and result.
- Use `// [<RITE>] :: [ANALYSIS] //`, `// [<RITE>] :: [FINDINGS] //`, `// [AWAITING CONFIRMATION] //`, `// [<RITE>] :: [FAILED] //`, `// [<RITE>] :: [SUMMARY] //`, and `// [NEXT DIRECTIVE] //` where applicable.
- Do not use em dashes in headers or generated chat output.
- Never invoke a downstream rite automatically.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, clarification, confirmation, failure, and completion. This prayer's investigation and research-record schemas name the fields and sections. Line layout from that file always applies.

## Input

Accept a research question, Change ID, or path to relevant files.

When no research question is supplied, emit:

```text
// [UNBROKEN THREAD] :: [AWAITING QUERY] //<br>
Transmit research question or target area.<br>
Optional: Change ID, relevant files, known constraints, and desired depth.<br>
```

Then wait.

## Read before dispatch

Read every directly mentioned file fully before delegating work. Also read `context/foundation/lessons.md` when present.

Treat lessons as accepted priors that narrow investigation. They do not replace fresh evidence.

Extract:

- the exact research question
- stated scope and constraints
- relevant systems, names, paths, and prior decisions
- evidence gaps that require investigation

## Scope the investigation

Decompose the question into focused research dimensions. For an ambiguous request, ask at most three questions about scope, depth, focus, or desired output. Skip questioning when the query is already precise.

Present the chosen scope:

```text
// [UNBROKEN THREAD] :: [INVESTIGATION SCOPE] //<br>
Question: <original query><br>
Dimensions: <area A>; <area B>; <area C><br>
Depth: <targeted | comprehensive><br>
Evidence sources: live code; tests; configuration; change history<br>

// [AWAITING CONFIRMATION] //<br>
Confirm scope or transmit correction.<br>
```

Do not ask the user for facts the repository can answer.

## Gather evidence

Use two to four parallel, read-only investigations when the surface warrants it. Each investigation must own a distinct dimension:

- feature and data-flow discovery
- analogous patterns and integration points
- tests, failure handling, and operational boundaries
- historical decisions in `context/changes/` and `context/archive/`

Each investigator receives the research question, exact sub-question, expected evidence, and a requirement to return file and line or document and section references. Use focused probes, not broad unbounded searches.

Read the key sources identified by investigators before synthesis. Prefer live code evidence. Use historical records as context, not proof that current behavior remains unchanged.

## Synthesize findings

Connect evidence across components. State:

- current behavior and relevant data flow
- existing patterns that future work should preserve
- integration points, consumers, or blast radius
- test coverage and verification surfaces
- historical decisions that remain relevant
- unanswered questions, with their impact

Do not turn findings into an implementation plan. Keep conclusions evidence-backed and distinguish verified facts from hypotheses.

## Write the research record

Resolve `context/changes/<change-id>/`:

- Use a supplied Change ID when its folder exists.
- Otherwise derive a unique kebab-case Change ID from the topic and create the folder plus `change.md`, following **rites-of-commission** semantics.
- Refuse archived changes.
- Update `change.md` with today's date. Advance `status: new` to `status: preparing`; preserve any other status.

Gather the current timestamp, branch, commit, repository name, and researcher identity. Do not write placeholder values.

Write `context/changes/<change-id>/research.md`:

```markdown
---
date: <ISO 8601 timestamp>
researcher: <name>
git_commit: <commit>
branch: <branch>
repository: <repository>
topic: "<original research question>"
tags: [research, codebase, <relevant-area>]
status: complete
last_updated: <YYYY-MM-DD>
last_updated_by: <name>
---

# Research: <Topic>

## Research Question

<Original question.>

## Summary

<Direct answer and highest-value findings.>

## Detailed Findings

### <Component or area>

- <Evidence-backed finding with `path:line` reference.>
- <Connection to another component or constraint.>

## Code References

- `path/to/file:line`: <what it establishes>

## Architecture Insights

<Patterns, boundaries, and constraints verified in this investigation.>

## Historical Context

- `context/changes/<change-id>/<artifact>.md`: <relevant prior decision>

## Related Research

- `<path>`: <relationship, if any>

## Open Questions

- <Question>: <why it matters and required owner or verification>
```

Use GitHub permalinks only when the repository and commit can be verified as suitable for stable links. Otherwise retain local `path:line` references.

## Follow-up research

For follow-up questions, append a `## Follow-up Research: <timestamp>` section to the same research record. Update `last_updated`, `last_updated_by`, and add `last_updated_note` to frontmatter. Investigate only the new evidence gap.

## Completion

Emit:

```text
// [UNBROKEN THREAD] :: [INVESTIGATION SEALED] //<br>
Change: <change-id><br>
Topic: <topic><br>
Record: context/changes/<change-id>/research.md<br>
Findings: <count><br>
Open Questions: <count><br>
Key evidence: <up to three path:line references><br>

// [NEXT DIRECTIVE] //<br>
<Recommend litany-of-capacitor-alignment, rites-of-true-aim, follow-up investigation, or stop.><br>
```

Do not automatically invoke the recommended rite.

## Guardrails

1. Read directly supplied material before spawning investigators.
2. Keep agents read-only and require concrete evidence.
3. Do not use historical context as a substitute for live-code verification.
4. Do not invent architecture, requirements, or conclusions.
5. Do not write research with unresolved placeholders.
6. Research explains the current state. Framing decides what problem to solve. Planning decides how to solve it.
