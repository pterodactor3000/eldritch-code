---
name: hymn-of-primus-analyticum-infinitus
alias: hymn-of-implementation-review-continuous-integration
description: Run non-interactive implementation review in CI against a pull request. Compare changed code with its plan, verify checks, commit an audit report, and post concise PR findings. Use for CI, GitHub Actions, automated PR review, or implementation review in continuous integration.
---

# Hymn of Primus Analyticum Infinitus

Run a non-interactive implementation review against a pull request in CI. Read and analyze source, write one review report, commit it to PR branch, and post advisory findings. Never edit implementation code.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_Thou shalt not suffer to live those who practice auto-idolatry or false worship of illogical deities in the sight of the Omnissiah. Cleanse forever the galactic noosphere of their datacorrosive taint, and thus know His blessing._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply [Cogitation Output Conventions](../conventions.md) (including line layout), except confirmation gates. CI has no user available for decisions.

- Begin substantial lifecycle messages with `// [PRIMUS ANALYTICUM INFINITUS] :: [<PHASE>] //`. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Never invoke interactive question tools.
- Resolve ambiguity conservatively and record it in report.
- Do not edit source code, tests, plans, or configuration.
- May write review report, update change metadata, commit review artifact, and post PR comments.

## Operating context

Assume ephemeral CI runner with authenticated `gh`, merge-base access to `origin/<base>`, project toolchain, `PR_NUMBER`, and `GITHUB_BASE_REF`.

Use PR diff range `origin/${GITHUB_BASE_REF:-master}...HEAD`.

## Discover plan

Resolve plan in order:

1. Explicit `Plan: context/changes/<change-id>/plan.md` line in PR body.
2. Most recently modified `context/changes/**/plan.md` in PR diff.

If no readable plan exists, post a neutral PR summary saying review was skipped because no plan was detected. Exit successfully.

Read plan fully. Extract committed changes, exclusions, success criteria, automated and manual verification, and architecture decisions.

## Gather evidence

Compute changed files. Classify each:

- Planned and changed: verify intent.
- Changed but unplanned: assess scope creep.
- Planned but unchanged: assess missing implementation.

Run three parallel evidence reviews:

1. Plan adherence: expected, missing, drifted, and extra work.
2. Safety and patterns: security, reliability, data safety, performance, and local conventions.
3. Test coverage: plan test commitments, changed tests, uncovered behavior, and declared test commands.

Run non-test automated checks from plan success criteria, including lint, build, formatting, and type checks. Record concise failure summaries.

Grade:

| Dimension | Verdict |
| --- | --- |
| Plan Adherence | PASS / WARNING / FAIL |
| Scope Discipline | PASS / WARNING / FAIL |
| Safety & Quality | PASS / WARNING / FAIL |
| Architecture | PASS / WARNING / FAIL |
| Pattern Consistency | PASS / WARNING / FAIL |
| Test Coverage | PASS / WARNING / FAIL |
| Success Criteria | PASS / WARNING / FAIL |

Derive overall `APPROVED`, `NEEDS ATTENTION`, or `REJECTED`. Consolidate findings to ten or fewer, severity ordered: `CRITICAL`, `WARNING`, `OBSERVATION`.

## Write review artifact

Derive target from plan parent:

`<change-dir>/reviews/impl-review.md`

Also update `<change-dir>/change.md`:

- `status: impl_reviewed`
- `updated: <today>`

Report must begin exactly with `<!-- IMPL-REVIEW-REPORT -->`. Every finding must include `- **Decision**: PENDING`.

```markdown
<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: <plan title>

- **Plan**: `<plan path>`
- **Scope**: Full plan, CI review on PR #<number>
- **Date**: <date>
- **Verdict**: <APPROVED|NEEDS ATTENTION|REJECTED>
- **Findings**: <counts>

## Verdicts
| Dimension | Verdict |
|---|---|

## Findings
### F1: <title>
- **Severity**: <CRITICAL|WARNING|OBSERVATION>
- **Dimension**: <dimension>
- **Location**: <file:line|no file>
- **Detail**: <evidence>
- **Fix**: <concrete correction>
- **Decision**: PENDING

<!-- End of report -->
```

Redact secrets. Never write literal credentials into report or comments.

## Commit and publish

Create a new audit commit. Never amend or bypass hooks:

`chore(review): impl-review for <change-id> [skip ci]`

The `[skip ci]` marker is mandatory to prevent CI recursion. Stage only report and `change.md`. Push once, then pull-rebase and retry once if branch moved.

If push fails, post report contents in a collapsed PR comment and exit successfully. Do not lose review evidence.

## Post PR feedback

For findings with a changed `file:line`, post one advisory inline comment. Other findings remain summary-only.

Each inline comment contains severity, dimension, evidence, one-line fix, report link, and:

`<!-- impl-review-ci:marker -->`

Post the new summary before deleting marker-tagged comments from older runs. If inline posting fails, include those findings in summary instead. Inline comments are advisory only. Never approve or request changes formally.

Post a summary containing overall verdict, plan and report links, seven-dimension table, counts, and up to five unanchored findings. End summary with `<!-- impl-review-ci:marker -->`.

`REJECTED` is recorded in report for an external workflow gate. This skill itself exits successfully after publishing artifacts.

## Guardrails

1. No human gates or interactive tools.
2. No implementation source, test, plan, or configuration changes.
3. Missing plan is neutral skip, not CI failure.
4. Report marker and finding decision fields are parser contract. Preserve exactly.
5. Never expose secrets.
6. Never create a formal PR approval or request-changes event.
