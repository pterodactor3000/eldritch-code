# Slice Schema - Sanctified Alteration

Roadmap slice contract aligned with `/10x-roadmap` output. New slices must match existing slices in the live `roadmap.md` byte-for-byte in structure.

## Slice body template

```markdown
### S-NN: <Slice title>

- **Outcome:** <user can …>
- **Change ID:** <kebab-case-change-id>
- **PRD refs:** <FR-NNN, US-NN, …>
- **Prerequisites:** <S-NN, F-NN, external state, or ->
- **Parallel with:** <IDs or ->
- **Blockers:** <external pending or ->
- **Unknowns:**
  - <question> - Owner: <user|team|TBD>. Block: <yes|no>.
  - (or `-` if none)
- **Risk:** <one line>
- **Status:** proposed | ready | blocked
```

## Field rules

| Field | Rule |
| ----- | ---- |
| **Slice ID** | `S-NN` zero-padded; next = max existing + 1 |
| **Title** | Noun phrase; not the outcome sentence |
| **Outcome** | Verb-led: _"user can …"_ - never a noun phrase |
| **Change ID** | Kebab-case; unique in roadmap; suitable for `context/changes/<id>/`; not equal to `S-NN` |
| **PRD refs** | Literal IDs from PRD; at least one `FR-\d{3}` or `US-\d{2}` |
| **Prerequisites** | Existing IDs only; comma-separated; external state in plain English |
| **Parallel with** | Derive from dep graph when possible; else `-` |
| **Blockers** | External-only (vendor, design, stakeholder); resolvable team questions → Unknowns |
| **Unknowns** | `Block: yes` forces `Status: blocked` |
| **Status** | Default `proposed`; `ready` only when prerequisites met and no blocking unknowns |

## At a glance row

Append to the table under `## At a glance` (or insert in dependency order if the table is sorted):

```markdown
| S-NN | <change-id> | <outcome - user-facing, truncated if needed> | <prerequisites> | <PRD refs> | <status> |
```

Foundation rows use `(foundation)` prefix in Outcome column; slice rows do not.

## Backlog Handoff row

Append under `## Backlog Handoff`:

```markdown
| S-NN | <change-id> | <short issue title> | <yes if ready else no> | Run `/10x-plan <change-id>` or - |
```

`Suggested issue title` is the human short title **without** the `// [S-NN]::… //` prefix.

## Insertion order

1. Locate `## Slices` section.
2. Insert `### S-NN:` block after the last slice whose prerequisites are satisfied by existing items, but **before** any slice that lists `S-NN` in its Prerequisites. If ambiguous, append at end of `## Slices` and note ordering in summary.
3. Insert At a glance row in the same relative position.
4. Append Backlog Handoff row (table need not be dependency-sorted).
5. Update frontmatter `updated: <YYYY-MM-DD>`; leave `version` unchanged unless the user asked for a version bump.

## Acceptance criteria (issue only)

Not part of the roadmap slice schema. Collect from the user and place in MCP issue description:

```markdown
## Acceptance Criteria

- **Given** … **When** … **Then** …
```

Or checklist:

```markdown
## Acceptance Criteria

- [ ] …
- [ ] …
```

Minimum 2 criteria items or one Given/When/Then block.

## Validation before write

- [ ] `S-NN` not already used
- [ ] Change ID unique in At a glance
- [ ] Every prerequisite ID exists in roadmap
- [ ] PRD refs present; flagged if missing from `prd.md`
- [ ] All 9 slice fields present
- [ ] Status consistent with Unknowns (`Block: yes` → `blocked`)
