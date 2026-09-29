---
name: rites-of-rousing
alias: rites-of-roadmap
description: Generate context/foundation/roadmap.md from a PRD as ordered, vertical end-to-end slices with foundations, dependencies, blockers, and backlog handoff. Use when the user asks to write, generate, or create a roadmap from a PRD, asks what to build first, or invokes rites-of-rousing.
---

# Rites of Rousing

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_Let chime ring out! Part the veil of circuit and gear. For now is the hour of motion._

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
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This rite's roadmap schema names the fields and sections. Line layout from that file always applies.

Turn a product requirements document into an ordered roadmap. This rite decomposes and sequences work. It does not choose frameworks, libraries, schemas, file paths, implementation details, estimates, points, or delivery dates.

Read the supplied PRD path (strip a leading `@`), or default to `context/foundation/prd.md`.

## Preconditions

1. Read the PRD fully. If it is absent, stop and direct the user to **rites-of-reforging**.
2. Read these files when present:
   - `context/foundation/shape-notes.md`
   - `context/foundation/tech-stack.md`
   - `context/foundation/lessons.md`
   - `context/foundation/roadmap.md`
3. A roadmap is for multiple user-visible outcomes. For detailed planning of one change, use the project's planning workflow instead.

## Readiness check

Score one point for each:

- Vision and Problem Statement has at least two substantive sentences.
- At least one populated `US-NN` story has a Given/When/Then block.
- At least one `must-have` functional requirement exists.
- Business Logic begins with a declarative rule, not a TODO.

Show the score and Open Question count under:

```text
// [ROUSING] :: [PRD READINESS SCAN] //<br>
Vision: <present | absent><br>
User story: <present | absent><br>
Must-have requirement: <present | absent><br>
Business logic: <present | absent><br>
Readiness: <N>/4<br>
Open Questions: <N><br>
```

- Score 3 or 4: continue.
- Score below 3: explain the missing signals and their roadmap consequence. Ask whether to firm up the PRD, proceed with blocked slices, or cancel. Do not write without a user choice.

## Baseline inventory

Inspect the codebase before asking the user what exists. Use parallel subagents when available, otherwise inspect sequentially. For each layer, return `present`, `partial`, or `absent` with file evidence:

- Frontend
- Backend / API
- Data
- Auth
- Deploy / infrastructure
- Observability

If `tech-stack.md` declares a layer, record it as declared there rather than probing it again. Present the compact inventory under `// [ROUSING] :: [BASELINE SCAN] //`, then use `// [AWAITING CONFIRMATION] //` to ask the user to confirm or correct it before using it.

## Roadmap framing

Derive a recommendation from the PRD, baseline, and any `Forward: technical-roadmap` material in shape notes. Ask at most three load-bearing questions, one at a time:

1. **Main goal:** `market-feedback`, `quality`, `low-complexity`, `speed`, `learn`, or `other`.
2. **First proof:** the smallest user-visible slice that tests the core product claim.
3. **Top blocker:** `skills`, `capacity`, `time`, `decisions`, `external`, `motivation`, or `none`.

For every question:

- Put the grounded recommendation first and label it `(Recommended)`.
- Include at most two genuine alternatives, each with a one-line reason it is reasonable.
- Include `Something else, I'll explain`.
- Skip only values stated unambiguously in the artifacts. State the supporting quote when skipping.
- Emit the request under `// [ROUSING] :: [COGITATION REQUIRED] //` with `Transmit:` and end material choices under `// [AWAITING CONFIRMATION] //`.

Do not ask separately about investment areas. Derive them from the main goal, non-functional requirements, baseline gaps, and unanswered questions. Present a short framing recap under `// [ROUSING] :: [SEQUENCING COGITATION] //`, followed by `// [AWAITING CONFIRMATION] //`. Accept user overrides.

## Build the roadmap in memory

### Foundations

Create a Foundation (`F-NN`) only when a minimal cross-cutting enabler is needed before a vertical slice can be planned, verified, or safely implemented.

- Every Foundation needs a concrete `Unlocks` value naming downstream slices, blocked unknowns, or a verification path.
- Do not create generic API, database, UI, or auth layer projects.
- Do not recreate anything the confirmed baseline says is present.
- Prefer introducing technical work inside the first vertical slice that needs it.

### Slices

Create zero-padded `S-NN` vertical slices from PRD user stories and functional requirements.

- Every slice delivers one end-to-end, user-visible capability stated as `user can ...`.
- Every slice traces to at least one literal PRD ID: `US-NN`, `FR-NNN`, or `NFR-NN`.
- Split oversized slices by user outcome, workflow phase, persona, or risk boundary. Never split them by technical layer.
- Give every Foundation and Slice a unique, stable kebab-case Change ID.

### Dependency graph

For every item, establish:

- `Prerequisites`: Foundation IDs, Slice IDs, or concrete external state.
- `Parallel with`: independent sibling work that can safely run concurrently.
- `Blockers`: external pending work only.
- `Unknowns`: research or decision questions with owner and whether planning is blocked.
- `Risk`: one line explaining why this order is safest.
- `Status`: `ready`, `proposed`, or `blocked`.

Order the graph topologically. Put the first proof as early as prerequisites permit. Break ties by the confirmed main goal:

- `market-feedback`: test the riskiest product assumption early.
- `quality`: establish required safety, access control, and observability early.
- `low-complexity`: prefer the smallest viable outcome and park extras.
- `speed`: sequence only the must-have path.
- `learn`: exercise unfamiliar technology early.

Use `blocked` only when an Unknown has `Block: yes`. A cross-cutting question belongs in Open Roadmap Questions. Per-slice questions stay on that slice.

Derive up to five Streams only when they clarify parallel dependency chains. Each item must appear in exactly one stream.

## Required artifact

Write this exact structure to `context/foundation/roadmap.md`:

```markdown
---
project: <PRD project>
version: 1
status: draft
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
prd_version: <PRD version>
main_goal: <confirmed value>
top_blocker: <confirmed value>
---

# Roadmap: <Project>

> Derived from `<PRD path>` plus a confirmed codebase baseline.
> Edit in place. Archive and replace only for full regeneration.

## Vision recap

<Two or three sentences from the PRD. Define unfamiliar strategy terms in plain language on first use.>

## North star

**<S-NN>: <Outcome>**: <Why this smallest end-to-end outcome validates the product claim.>

## At a glance

| ID | Change ID | Outcome (user can ...) | Prerequisites | PRD refs | Status |
| --- | --- | --- | --- | --- | --- |
| F-01 | <change-id> | (foundation) <outcome> | - | <refs> | proposed |
| S-01 | <change-id> | <outcome> | F-01 | US-01, FR-001 | ready |

## Streams

<Omit this section when fewer than two useful dependency chains exist.>

| Stream | Theme | Chain | Note |
| --- | --- | --- | --- |
| A | <theme> | `F-01` then `S-01` | <reason> |

## Baseline

- **Frontend:** <present, partial, or absent>: <evidence>
- **Backend / API:** <verdict>: <evidence>
- **Data:** <verdict>: <evidence>
- **Auth:** <verdict>: <evidence>
- **Deploy / infrastructure:** <verdict>: <evidence>
- **Observability:** <verdict>: <evidence>

## Foundations

### F-01: <Title>

- **Outcome:** (foundation) <state now in place>
- **Change ID:** <kebab-case>
- **PRD refs:** <literal references>
- **Unlocks:** <S-NN IDs, unknowns, or verification path>
- **Prerequisites:** <IDs or ->
- **Parallel with:** <IDs or ->
- **Blockers:** <external pending or ->
- **Unknowns:** <question, Owner: person, Block: yes|no, or ->
- **Risk:** <one line>
- **Status:** proposed | ready | blocked

## Slices

### S-01: <Title>

- **Outcome:** user can <capability>
- **Change ID:** <kebab-case>
- **PRD refs:** <literal references>
- **Prerequisites:** <IDs or external state>
- **Parallel with:** <IDs or ->
- **Blockers:** <external pending or ->
- **Unknowns:** <question, Owner: person, Block: yes|no, or ->
- **Risk:** <one line>
- **Status:** proposed | ready | blocked

## Backlog Handoff

| Roadmap ID | Change ID | Suggested issue title | Ready for planning | Notes |
| --- | --- | --- | --- | --- |
| F-01 | <change-id> | <title> | no | <why> |
| S-01 | <change-id> | <title> | yes | <planning handoff> |

## Open Roadmap Questions

1. **<Question>**: Owner: <who>. Block: <roadmap IDs or roadmap-wide>.

## Parked

- **<Item>**: Why parked: <PRD non-goal or confirmed rationale>.

## Done
```

Keep `## Done` empty on first generation. Archive workflows own its future entries.

## Self-review before writing

Abort the write and report failures if any check fails:

1. All frontmatter keys and required sections exist in order.
2. Every must-have PRD requirement and user story appears in a slice.
3. Every slice has an actual PRD reference and every Change ID is unique kebab-case.
4. The dependency graph has no cycles, every prerequisite exists, and item order is topological.
5. At-a-glance and Backlog Handoff rows match item bodies.
6. Every blocked item has an Unknown with `Block: yes`.
7. No Foundation duplicates a present baseline layer or lacks `Unlocks`.
8. Slices are user-visible and balanced, not horizontal layers or oversized catch-alls.
9. If Streams exist, every item appears exactly once.
10. No estimates, dates, framework choices, file paths, schema details, or invented PRD scope appears.

## Collision handling

If `context/foundation/roadmap.md` already exists, ask before writing under `// [ROUSING] :: [COLLISION DETECTED] //` and `// [AWAITING CONFIRMATION] //`:

- **Archive and replace (Recommended):** move it to `context/foundation/archive/<YYYY-MM-DD>-roadmap.md`, adding `-2`, `-3`, and so on on same-day collision.
- **Overwrite without archiving:** replace it in place.
- **Cancel:** make no change.

## Hand off

After writing, report the path, main goal, top blocker, baseline-present layers, Foundation and Slice counts, status breakdown, PRD coverage, open-question count, and parked-item count under `// [ROUSING] :: [ROADMAP SEALED] //`. Follow with `// [NEXT DIRECTIVE] //` containing one recommended manual planning move.

Recommend one next planning move:

1. The first proof if ready: `Invoke: rites-of-commission <change-id>`.
2. Otherwise, its ready prerequisite Foundation.
3. Otherwise, the highest-leverage unresolved question or blocker.
4. Otherwise, the ready item with the greatest downstream fan-out.

Do not automatically invoke another workflow.
