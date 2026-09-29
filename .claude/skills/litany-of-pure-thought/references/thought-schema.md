# Pure Thought Note Contract

This reference defines `context/foundation/shape-notes.md`, the artifact produced by Litany of Pure Thought. A later requirements-writing workflow consumes these notes. Update this contract before changing either workflow.

## Frontmatter

```yaml
---
project: <string|null>
context_type: <greenfield|brownfield>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
product_type: <web-app|api|cli|mobile|desktop|library|data-pipeline|other|null>
target_scale:
  users: <small|medium|large|enterprise|null>
timeline_budget:
  delivery_weeks: <integer|null>
  hard_deadline: <YYYY-MM-DD|null>
  after_hours_only: <boolean|null>
checkpoint:
  current_phase: <1..8>
  phases_completed: [<integer>, ...]
  gray_areas_resolved:
    - topic: <string>
      decision: <string>
  frs_drafted: <integer>
  quality_check_status: <pending|warned|accepted>
---
```

`current_phase: 8` means discovery is sealed. `warned` means the user knowingly accepted unresolved gaps. `accepted` means the cross-check found no material gaps.

## Required body sections

### Greenfield

```markdown
## Vision & Problem Statement
## User & Persona
## Access Control
## Success Criteria
## User Stories
## Functional Requirements
## Non-Functional Requirements
## Business Logic
## Non-Goals
## Open Questions
```

### Brownfield

```markdown
## Current System
## Problem Statement & Motivation
## User & Persona
## Access Control
## Success Criteria
## User Stories
## Scope of Change
## Constraints & Compatibility
## Business Logic Changes
## Non-Goals
## Open Questions
```

Brownfield notes must identify preserved behavior. In `## Scope of Change`, classify each item as `[new]`, `[modified]`, `[removed]`, or `[preserved]`.

## Content rules

- Requirements use `FR-NNN`, with a zero-padded three-digit number.
- User scenarios use `US-NN`, with a zero-padded two-digit number and Given/When/Then statements.
- `## Success Criteria` contains `### Primary`, `### Secondary`, and `### Guardrails` in that order.
- `## Business Logic` or `## Business Logic Changes` begins with one declarative domain-rule sentence. An infrastructure-only brownfield change may instead state: `No domain logic change. This is an infrastructure/technical change.`
- `## Non-Functional Requirements` expresses user-observable outcomes, not implementation mechanisms.
- `## Open Questions` lists uncertainty verbatim with an owner and resolution date when known.
- Technical preferences may appear only in `## Forward: technical considerations`. They are not requirements.

## Generated PRD contract

The requirements-writing rite emits `context/foundation/prd.md` using this frontmatter:

```yaml
---
project: <string>
version: <integer>
status: draft
created: <YYYY-MM-DD>
context_type: <greenfield|brownfield>
product_type: <web-app|api|cli|mobile|desktop|library|data-pipeline|other>
target_scale:
  users: <small|medium|large|enterprise>
timeline_budget:
  delivery_weeks: <integer>
  hard_deadline: <YYYY-MM-DD|null>
  after_hours_only: <boolean>
---
```

Use the greenfield or brownfield body section list above in its documented order. Missing input content becomes `# TODO: <missing item> - see Open Questions` in the relevant section and a matching numbered item in `## Open Questions`.
For required frontmatter values that are unknown, use the YAML scalar `TBD` and add the matching open question.

Do not include implementation decisions, data models, testing strategy, deployment details, vendors, frameworks, database choices, transport protocols, or UI implementation affordances in the generated PRD. The brownfield `## Current System` section may name existing technologies because it documents reality, not a new decision.
