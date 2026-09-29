---
name: rites-of-reforging
alias: rites-of-prd
description: Generate context/foundation/prd.md from context/foundation/shape-notes.md or supplied raw notes, preserving user decisions and routing missing information to Open Questions. Use when the user asks to write or generate a PRD, turn discovery notes into requirements, or invokes rites-of-reforging.
---

# Rites of Reforging

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_Thus do we invoke the Machine God. Thus do we make whole that which was sundered._

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
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This rite's PRD schema names the fields and sections. Line layout from that file always applies.

Generate a product requirements document from existing discovery notes. This rite is a document generator, not a discovery session. It never invents domain rules, success criteria, requirements, scenarios, priorities, or non-goals.

Read [thought-schema.md](../litany-of-pure-thought/references/thought-schema.md) before generation. The schema defines the input note contract and the generated PRD contract.

## When to use

Use when:

- `context/foundation/shape-notes.md` exists and is ready for conversion.
- The user supplies a path to product or change notes.
- The user explicitly requests a PRD draft.

Do not use when the user is still exploring the problem and has no notes. Direct them to the discovery workflow first.

## Input and context

1. Use the supplied path, stripping a leading `@`, or default to `context/foundation/shape-notes.md`.
2. If the file exists, read it fully.
3. If it does not, emit:

   ```text
   // [REFORGING] :: [INPUT REQUIRED] //<br>
   Source record unavailable: <path><br>

   Transmit:<br>
   1. Raw product or change notes.
   2. A replacement note path.
   3. `discovery` to begin product discovery.
   4. `cancel` to stop.
   ```

   Then wait.
4. Determine `context_type` from input frontmatter.
5. If it is absent, inspect the workspace:
   - Git history, lockfiles, or substantive source files indicate brownfield.
   - No indicators suggest greenfield.
   - A manifest alone is ambiguous. Ask the user to confirm.

## Input assessment

Before generating, score the input from 0 to 4:

1. A frontmatter `checkpoint` block.
2. At least one `FR-NNN` requirement.
3. At least one Given, When, Then scenario.
4. A declarative business-rule sentence.

For brownfield input, also require a `## Current System` section as part of the checkpoint signal.

If the score is below 2, name every missing signal and its consequence, then emit:

```text
// [REFORGING] :: [INPUT DEFICIENT] //<br>
<missing signals and consequences><br>

// [AWAITING CONFIRMATION] //<br>
Choose `discovery`, `proceed with TODOs`, or `cancel`.<br>
```

Proceed only on explicit `proceed with TODOs`.

## Generate in memory

Build the entire PRD before writing it.

### Frontmatter

Copy values from notes when present:

- `project`
- `context_type`
- `product_type`
- `target_scale`
- `timeline_budget`

Set:

- `version: 1`
- `status: draft`
- `created` to today

If a required frontmatter value is missing, use the YAML scalar `TBD` and add the exact gap to `## Open Questions`. Use `# TODO: <missing item> - see Open Questions` only in body sections.

### Sections

Use the matching ordered section list in [thought-schema.md](../litany-of-pure-thought/references/thought-schema.md).

- Transcribe input content faithfully. Only normalize formatting required by the contract.
- Preserve requirement challenge notes verbatim.
- Keep `### Primary`, `### Secondary`, and `### Guardrails` inside `## Success Criteria`.
- For incomplete or missing sections, write `# TODO: <missing item> - see Open Questions` and create a numbered open question.
- If no domain rule exists, write `# TODO: domain rule - see Open Questions`. Never infer one from entities, requirement nouns, or scenarios.
- For brownfield work, preserve the delta framing and explicit `[preserved]` scope items.

Keep technical preferences, implementation details, data models, architecture, deployment, testing, vendors, protocols, and UI mechanics out of the PRD. Do not discard them: summarize them in the handoff as forward technical considerations. The existing stack may be described only in the brownfield current-system section.

## Pre-write validation

Validate the in-memory document before any file write:

1. All required frontmatter keys exist.
2. All required `##` headings exist once, in the exact schema order.
3. `## Success Criteria` contains its three required `###` headings.
4. Every TODO has a corresponding entry in `## Open Questions`.
5. No retired sections appear: data model, implementation decisions, testing strategy, or deployment details.
6. No technical decision leaked into the generated product requirements, except current-state technology in brownfield context.

If validation fails, do not write. Report each exact failure and stop.

## Collision handling

If `context/foundation/prd.md` does not exist, write the validated document there.

If it exists, ask under `// [AWAITING CONFIRMATION] //`:

- Save as the next available `prd-vN.md` (Recommended).
- Overwrite `prd.md`.
- Cancel.

For a versioned save, calculate the next number from existing `prd-v*.md` files and set the frontmatter `version` to that number. Never replace the unversioned file in this mode.

## Completion response

After a successful write, report:

```text
// [REFORGING MANIFEST] //<br>
Project: <project><br>
Context: <greenfield | brownfield><br>
Artifact: <path><br>
Schema sections: <present>/<required><br>
Open questions: <count><br>
Status: draft<br>

// [FORWARD TECHNICAL CONSIDERATIONS] //<br>
<captured items, or None.><br>
```

State which sections are complete and which contain TODOs. Then emit `// [NEXT DIRECTIVE] //`: for greenfield recommend `Invoke: litany-of-noospheric-binding`; for brownfield recommend `Invoke: hymn-of-core-scanning`. Do not invoke another workflow automatically.

## Binding rules

1. Generate from evidence. Never author product decisions.
2. Missing content stays visible as TODOs and open questions.
3. Preserve existing PRDs by default through versioned saves.
4. The schema is authoritative. If the skill and schema conflict, stop and report the drift.
