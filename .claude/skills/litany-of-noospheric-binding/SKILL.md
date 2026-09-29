---
name: litany-of-noospheric-binding
alias: litany-of-stack-selection
description: Select a greenfield project starter and technology stack from a written PRD, applying agent-friendly quality gates and recording the decision in context/foundation/tech-stack.md. Use when the user asks what stack, framework, language, starter, deployment target, or CI/CD shape to choose, or invokes litany-of-noospheric-binding.
---

# Litany of Noospheric Binding

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
- Place every write approval in `// [AWAITING CONFIRMATION] //`, preserving the existing command words such as `approve`, `skip`, `yes`, and `no`.
- Report errors in `// [<RITE>] :: [FAILED] //` with the operation and decisive reason.
- End completed work with `// [NEXT DIRECTIVE] //` when a manual next step exists. Never invoke a downstream rite automatically.
- Separate rite and phase with ` :: `. Do not use em dashes.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, clarification, confirmation, failure, and completion. This litany's selection record schema names the fields and sections. Line layout from that file always applies.

Bind a written product definition to a practical starter and stack. This rite facilitates an explicit engineering decision over a curated catalog. It does not select from memory alone or silently impose a stack.

Read these before deciding:

- [selection-contract.md](references/selection-contract.md)
- [starter-catalog.md](references/starter-catalog.md)

## Preconditions

1. Resolve a supplied PRD path, stripping a leading `@`, or default to `context/foundation/prd.md`.
2. If no PRD exists at that path, report the missing path and stop. Do not replace it with chat context or an improvised interview.
3. Read the PRD fully. Extract project name, product type, user scale, time budget, functional requirements, non-goals, and forward technical considerations.
4. If `context_type` is brownfield, stop and explain that this rite selects a new-project stack. Existing systems need an assessment of the current stack and targeted change decisions instead.

## Confirm priors

Report the extracted priors and detected technology-forcing feature signals:

- Authentication
- Payments
- Realtime updates
- AI features
- Background work
- File storage
- Internationalization

Present the priors under `// [NOOSPHERIC BINDING] :: [PRIORS DETECTED] //`, then ask:

```text
// [AWAITING CONFIRMATION] //<br>
Confirm extracted priors or transmit corrections. The PRD remains unchanged.<br>
```

Keep corrections in memory only.

## Choose the path

Determine the language family from `## Forward: technical considerations`, the user request, or a focused question.

Find the product type and language family in [starter-catalog.md](references/starter-catalog.md).

- If a vetted default exists, present it with a one-line fit and ask the user to accept it or explore alternatives.
- If no default exists, take the custom path.

The default is editorial, never silent. The user must explicitly accept it.
Present every candidate, preference, and record-collision choice under a concrete `// [NOOSPHERIC BINDING] :: [<PHASE>] //` header followed by `// [AWAITING CONFIRMATION] //`.

### Standard path

For an accepted default, ask only for:

1. Deployment target, using the selected card's supported targets.
2. CI provider and merge-to-deploy flow.
3. Kebab-case project directory name.

Use `team_size: solo` unless the user volunteers a different team composition.

### Custom path

Ask concise, decision-relevant questions:

1. Confirm technology-forcing features detected from the PRD.
2. Team composition: solo, small team, or mixed experience.
3. Soft preferences and explicit technology avoids.
4. Deployment constraint.
5. CI provider and deployment flow.
6. Present the constrained candidate set and ask for a preferred variant.
7. Run the five-point self-check from [selection-contract.md](references/selection-contract.md).
8. Confirm the kebab-case project directory name.

Do not ask for a technology preference already recorded in the PRD's forward technical considerations.

## Evaluate candidates

For the custom path, filter catalog cards in this order:

1. Language family.
2. Product type.
3. Required features and deployment compatibility.
4. Explicit technology avoids.
5. Agent-friendly quality gates.

The four quality gates are:

- Explicit types or schemas.
- Strong conventions.
- Popularity within its own language family.
- Current, authoritative documentation.

An unprompted custom-path recommendation must pass all four gates. A vetted default may carry a known gate limitation, which must be stated before the user accepts it. Evaluate popularity within the language family, never against JavaScript volume.

If the user explicitly wants a failing candidate, name every failed gate, present the strongest passing alternative, and describe the extra documentation and maintenance burden. The user may still choose it. Set `quality_override: true` only after explicit confirmation.

For every lead, provide:

```text
// [NOOSPHERIC BINDING] :: [CANDIDATE VERDICT] //<br>
Lead: <starter id> - <name><br>
Scaffolding confidence: <verified | first-class | best-effort><br>
Rationale: <one concise paragraph><br>

Alternatives:<br>
- <starter id> - <tradeoff>
- <starter id> - <tradeoff>
```

For the selected starter, use Context7 to verify current official documentation and starter commands before writing the handoff. If the catalog conflicts with current documentation, stop and report the drift rather than writing stale commands.

## Write the binding record

Build `context/foundation/tech-stack.md` in memory using [selection-contract.md](references/selection-contract.md).

If the file is absent, write it.

If it exists, ask the user to choose:

- Overwrite it (Recommended).
- Save as the next available `tech-stack-vN.md`.
- Cancel.

Write only after an explicit choice. The body is one paragraph, no more than 200 words, explaining the selected stack from the PRD priors and confirmed decisions.

## Completion response

```text
// [NOOSPHERIC BINDING] :: [SEAL APPLIED] //<br>
Starter: <starter id><br>
Path: <standard | custom><br>
Scaffolding confidence: <verified | first-class | best-effort><br>
Binding record: <path><br>
Quality override: <true | false><br>
```

State any known friction and the next manual action. Emit `// [NEXT DIRECTIVE] //` with `Invoke: rites-of-engine-invocation`. Stop. Do not invoke a project-scaffolding workflow automatically.

## Binding rules

1. The PRD on disk is mandatory input.
2. The catalog is the source of candidates. Documentation verification prevents stale starter commands.
3. The four quality gates shape recommendations, not user autonomy.
4. Keep stack and deployment decisions out of `prd.md`. This rite owns `tech-stack.md`.
5. Never overwrite an existing binding record without explicit user confirmation.
