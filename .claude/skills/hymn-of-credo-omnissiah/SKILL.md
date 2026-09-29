---
name: hymn-of-credo-omnissiah
alias: hymn-of-rule-review
description: Audit an AI rules artifact such as CLAUDE.md, AGENTS.md, .cursor/rules/*.mdc, or Copilot instructions. Score length, snippets, precision, redundancy, and ordering, then propose concrete fixes. Use when reviewing AI rules, auditing AGENTS.md or CLAUDE.md, or scoring agent instructions.
---

# Hymn of Credo Omnissiah

Audit the condition of one rules-for-AI file. Default behavior is read-only. Produce evidence-backed findings and a five-point scorecard. Never judge product architecture or code quality through this rite.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_There is no truth in flesh, Only betrayal, There is no strength in flesh, Only weakness, There is no constancy in flesh, Only decay, There is no certainty in flesh but death._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply [Cogitation Output Conventions](../conventions.md) (including line layout) to every chat message. This hymn's scorecard format names the fields and sections. Line layout from that file always applies.

- Begin substantial lifecycle messages with `// [CREDO OMNISSIAH] :: [<PHASE>] //`. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- State path, evidence, finding, and consequence in compact procedural diction.
- Do not edit rule content. Reordering requires explicit user approval.
- Never invoke a downstream rite automatically.

## Resolve input

Accept one path to a rules artifact: `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/*.mdc`, `.github/copilot-instructions.md`, `.windsurfrules`, or equivalent.

- Empty input: request a path. Do not guess.
- Directory: ask which file to audit.
- Multiple files: audit each separately. Never merge scorecards.
- Missing file: report path and stop.

Read the target fully. For files longer than 2,000 lines, read chunks until complete.

## Five checks

### 1. Length

Count non-empty, non-separator lines. Ignore rule-file frontmatter.

- `0-200`: `OK`.
- `201-500`: `WARN`.
- `501+`: `FAIL`.

For warnings, recommend splitting area-specific rules, replacing duplication with `@` references, or removing rules not tied to recurring agent failures.

### 2. Direct code and configuration snippets

Flag fenced or multiline inline blocks that duplicate code, tests, migrations, scripts, or configuration already belonging in repository files.

Do not flag one-line commands, short mandatory output formats, Mermaid diagrams, or schemas needed to define artifact shape.

For every finding, cite its line range and propose a canonical `@path` reference. Score `OK` for zero findings, `WARN` for one or two, and `FAIL` for three or more.

### 3. Precise language

Flag phrases that cannot be checked against a diff, including "clean code", "best practices", "be consistent", "modern patterns", "handle errors properly", and "keep it simple".

For each, propose a concrete replacement based on inspected repository evidence. Use nearby rules, manifests, linting, tests, and sibling instructions. If no project signal exists, label a sensible replacement `(assumed)`.

Score `OK` for zero vague phrases, `WARN` for one to three, and `FAIL` for four or more.

### 4. Redundant knowledge

Flag paragraphs that an agent already knows from training, framework defaults, a type checker, lint configuration, README, or generic documentation.

Do not flag project-specific deviations, local failure modes, internal naming, or rules tied to a documented incident.

For each finding, recommend exactly one:

- Delete it.
- Replace it with an `@` reference.
- Keep it only when backed by an incident note.

Score `OK` for zero redundant rules, `WARN` for one to three, and `FAIL` for four or more.

### 5. Rule ordering

List top-level headings and line numbers. Classify each as `CRITICAL`, `USEFUL`, `INTRO`, `REDUNDANT`, `VAGUE`, or `REFERENCE`.

Evaluate whether security, irreversibility, money, and project-specific tripwires occur early. Score:

- `OK`: dense critical or useful rules at top, clear headings.
- `WARN`: material rules are mixed with introductory content or partly buried.
- `FAIL`: critical rules appear after line 200, no headings exist, or first 30 lines are introduction without action.

If ordering is weak, propose moved, retained, lowered, and removed sections. Do not rewrite rule content.

Then request confirmation:

```text
// [CREDO OMNISSIAH] :: [ORDERING PROPOSAL] //<br>
Target: <path><br>
Proposed moves: <sections><br>

// [AWAITING CONFIRMATION] //<br>
Reorder all sections; move critical rules only; show diff; or retain current order.<br>
```

Only after explicit approval may you move complete section blocks. Preserve all rule wording byte-for-byte. Apply one edit. Remind the user to test one structural change in a fresh agent session before making another.

## Scorecard format

Use this format exactly. Cite `path:line` for every specific finding.

```markdown
# Rule Review: <path>

**Overall:** <one-line condition summary>

## Scorecard
| # | Check | Verdict | Score |
|---|---|---|---|
| 1 | Length | OK/WARN/FAIL | <non-blank line count> |
| 2 | Direct snippets | OK/WARN/FAIL | <flagged block count> |
| 3 | Precise language | OK/WARN/FAIL | <vague phrase count> |
| 4 | Redundant knowledge | OK/WARN/FAIL | <redundant rule count> |
| 5 | Rule ordering | OK/WARN/FAIL | <reason> |

## Findings
### 1. Length: <verdict>
### 2. Direct snippets: <verdict>
### 3. Precise language: <verdict>
### 4. Redundant knowledge: <verdict>
### 5. Rule ordering: <verdict>

## Top 3 actions
1. <highest-leverage action>
2. <second action>
3. <third action>
```

For `OK` checks, provide one short line only. Rank top actions by leverage, not check order. Stop after scorecard and any approved ordering edit.

## Guardrails

1. Audit one specified rule artifact at a time.
2. Read fully before judging.
3. Every finding needs a line citation and a concrete corrective action.
4. Never silently edit, regenerate, or delete a rules artifact.
5. Preserve established output templates and parser-required schemas.
