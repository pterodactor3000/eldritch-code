---
name: litany-of-war-doctrina-alpha
alias: litany-of-opportunity-map
description: Classify recurring friction into build, buy, complement, or wait decisions. Produce an evidence-backed opportunity map with existing responses, a thin complement, a first useful version, data-risk caveats, and one recommended candidate. Use when deciding whether an idea is worth building, buying, complementing, or deferring.
---

# Litany of War Doctrina Alpha

Turn repeated friction or unmet need into a build, buy, complement, or wait decision. Produce a decision artifact, never an implementation plan. Do not write product code, infrastructure, CI, authentication, or backlog items.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_Broadcast the psalms of war to drive the macroclades to triumph._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply [Cogitation Output Conventions](../conventions.md) (including line layout) to every chat message. This litany's templates name the fields and sections. Line layout from that file always applies.

- Begin substantial lifecycle messages with `// [WAR DOCTRINA ALPHA] :: [<PHASE>] //`. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Use compact procedural diction. State signal, evidence, decision, and consequence.
- Gate each artifact write under `// [AWAITING CONFIRMATION] //`.
- Never invoke another rite automatically.

## Intake

Accept recurring frictions from notes, tickets, support records, analytics, repository history, or user-provided descriptions.

If no concrete signal is supplied, request three to five recurring frictions and their evidence sources. Do not accept "build a dashboard", "add an agent", or "automate everything" as signals. Ask which repeated pain, delay, coordination cost, or manual check each proposal removes.

Ask one data question:

```text
// [WAR DOCTRINA ALPHA] :: [DATA CONSTRAINT] //<br>
Transmit:<br>
1. Mock, local, read-only, or non-sensitive data.
2. Real company, customer, or production data.
3. Unknown.
```

Record uncertainty. Do not treat it as permission to access sensitive data.

## Classify signals

Process one signal at a time. For each, identify:

```text
Signal: <observable repeated pain>
Existing/default response: <current tool, SaaS, or workflow>
Buy: <viable existing product, if any>
Thin complement: <small addition around source systems>
First useful version: <local, read-only, mockable validation>
Data risk: <classification and required restriction>
Direction if valuable: <product|feature|internal tool|service|wait>
```

Apply these rules:

1. Prefer buying or existing workflows for generic utility needs.
2. Prefer complementing systems of record over replacing them.
3. First useful version stays narrow, read-only, local or mockable, and easy to discard.
4. Real company or customer data requires access, permission, and auditability decisions before implementation.
5. Distinguish accidental complexity from necessary constraints. Do not call a control or decision process "friction" without testing why it exists.
6. Do not predict revenue, career, growth, or adoption outcomes.

After all signals are validated, present a compact comparison matrix.

## Choose a candidate

Recommend at most one first useful version. It earns recommendation only when it:

- Occurs regularly.
- Has clear manual cost.
- Joins at least two sources or roles.
- Can be validated read-only or with mock/exported data.
- Does not replace an existing platform responsibility.
- Has a plausible direction if valuable.

If none meet these criteria, recommend `wait` or an existing response. State what evidence would change the decision.

For the selected candidate, define:

```text
Candidate: <working name>
Reads: <specific sources>
Returns: <report, view, or digest>
Does not do: <intentional exclusions>
Data risk: <constraint and required safeguard>
Direction if valuable: <product|feature|internal tool|service|wait>
Why this candidate: <why it outranks alternatives>
```

## Decide next move

Ask the user to choose one:

1. Validate through past-behavior conversations before shaping work.
2. Shape now, accepting validation risk.
3. Build a narrow, already-understood candidate.
4. Save evidence and wait.

State the consequence of the selected route. Do not start another workflow unless separately requested.

## Artifact

Offer to save the final map:

```text
// [WAR DOCTRINA ALPHA] :: [MAP READY] //<br>
Signals classified: <count><br>
Recommended candidate: <candidate|none><br>
Data constraint: <classification><br>
Target: context/team/opportunity-map.md<br>

// [AWAITING CONFIRMATION] //<br>
Approve write; provide another path; retain in chat only; or cancel.<br>
```

Create the target directory only after explicit approval. Use this structure:

```markdown
# Opportunity Map

## Context
- **Project / context**:
- **Data constraint**:
- **Date**:

## Map
| Signal | Existing/default response | Buy | Thin complement | First useful version | Data risk | Direction if valuable |
|---|---|---|---|---|---|---|

## Recommended First Candidate

## Why This Candidate

## Next Direction If Valuable
```

On completion:

```text
// [WAR DOCTRINA ALPHA] :: [MAP SEALED] //<br>
Artifact: <path><br>
Decision: <build|buy|complement|wait><br>
Candidate: <name|none><br>

// [NEXT DIRECTIVE] //<br>
Follow selected next move when ready.<br>
```

## Guardrails

1. Classify observed friction, not attractive solution ideas.
2. Do not turn an opportunity map into an implementation plan.
3. Preserve links to source systems. Do not position a complement as a system of record.
4. Keep sensitive-data access and auditing unresolved until explicitly designed.
5. Write no artifact or directory without approval.
