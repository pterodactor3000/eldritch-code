---
name: hymn-of-clear-thought
alias: hymn-of-vitals-check
description: Audit an existing project's dependency health, tests, CI/CD, and development configuration, then write an evidence-backed prioritized report to context/foundation/health-check.md. Use when the user asks for a project health check, dependency audit, readiness audit, or invokes hymn-of-clear-thought.
---

# Hymn of Clear Thought

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
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This hymn's findings and report schema name the fields and sections. Line layout from that file always applies.

Examine the current project state before substantial agent-assisted work. This rite is read-only: it identifies risk, explains impact, and produces a prioritized report. It never installs packages, upgrades dependencies, edits configuration, or runs automatic security fixes.

## Preconditions and context

Require an existing-project marker:

- `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Gemfile`
- `composer.json`, `*.csproj`, or `pubspec.yaml`

If none exists, explain that health analysis needs a codebase and stop.

When present, read these optional artifacts:

- `context/foundation/stack-assessment.md`
- `context/foundation/prd.md`, if it describes a brownfield change

Use them to connect operational findings to known readiness gaps and planned scope. Do not duplicate their stack assessment.

## Dependency health

Determine the language family and package manager from marker files and lockfiles.

### Lockfiles

Check for the matching dependency lock:

| Ecosystem                | Expected lock                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------- |
| JavaScript or TypeScript | `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, or `bun.lockb`                 |
| Python                   | `uv.lock`, `poetry.lock`, `Pipfile.lock`, or `requirements.txt` as a weak fallback |
| Rust                     | `Cargo.lock`                                                                       |
| Go                       | `go.sum`                                                                           |
| Ruby                     | `Gemfile.lock`                                                                     |
| PHP                      | `composer.lock`                                                                    |
| .NET                     | `packages.lock.json`                                                               |
| Dart                     | `pubspec.lock`                                                                     |

An absent lockfile is a finding: builds are less reproducible, and dependency state is harder to reason about.

### Vulnerability audit

Run the relevant audit command and capture stdout, stderr, and exit code. A nonzero audit exit signals findings, not a failure of this rite.

| Ecosystem                | Command                                                        |
| ------------------------ | -------------------------------------------------------------- |
| JavaScript or TypeScript | `npm audit --json`                                             |
| Python                   | `pip-audit --format json`                                      |
| Rust                     | `cargo audit --json`                                           |
| Go                       | `govulncheck -json ./...`                                      |
| Ruby                     | `bundle audit check --update`                                  |
| PHP                      | `composer audit --format json`                                 |
| .NET                     | `dotnet list package --vulnerable --include-transitive`        |
| Java or Dart             | Skip, then recommend an ecosystem-appropriate external scanner |

Classify findings as CRITICAL, HIGH, MODERATE, or LOW. Surface CRITICAL and HIGH counts in conversation; keep lower severities in the report. Distinguish direct from transitive findings when the tool supports it.

If the audit tool is missing, fails, or cannot parse output, record the reason and continue.

### Dependency staleness

When supported, run a lightweight outdated-dependency check:

- JavaScript or TypeScript: `npm outdated --json`
- Python: `pip list --outdated --format json`
- Rust: `cargo outdated --root-deps-only`, when installed
- Ruby: `bundle outdated --only-explicit`

Report only packages with major-version gaps. Do not turn ordinary minor upgrades into noise.

## Verification infrastructure

### Tests

Detect the test runner from manifest scripts and configuration. Confirm it can at least discover or compile tests without modifying the project.

Examples:

- JavaScript or TypeScript: test runner list or non-watch run.
- Python: `python -m pytest --collect-only`.
- Rust: `cargo test --no-run`.
- Go: `go test -list '.*' ./...`.

Report whether tests were detected, whether the runner executed, and any error. A missing or nonfunctional test runner is a high-impact finding because agents cannot verify changes safely.

### CI/CD

Inspect CI definitions such as GitHub Actions, GitLab CI, Jenkins, CircleCI, Cloud Build, or Bitbucket Pipelines.

Record whether the pipeline covers:

- Linting
- Tests
- Build or compilation
- Type checking
- Security scanning

Missing CI is a future-work item, not an urgent failure, when local verification works.

### Development configuration

Inspect:

- `.gitignore`
- `.editorconfig`
- Formatter and linter configuration
- Strict TypeScript configuration, when applicable
- `.env.example` or equivalent environment documentation
- Agent instruction files

Prioritize missing `.gitignore`, missing strict type checking, and absent formatter or linter above editor and environment-documentation polish.

## Synthesize findings

Cross-reference the stack assessment when available:

- Reinforce a type-safety gap when no type check runs in CI.
- Flag missing compensation rules that the stack assessment recommended.
- Do not repeat the entire quality matrix.

Choose one status:

- `healthy`: no critical or high dependency findings, working tests, and no high-impact configuration gaps.
- `needs-attention`: addressable operational issues exist.
- `critical-issues`: critical dependencies, no working test runner, or compounding high-impact gaps.

This status informs prioritization. It never blocks work or implies that the project must be abandoned.

## Prioritized fixes

For every finding, provide:

1. What is wrong.
2. Why it affects safe agent-assisted development.
3. A concrete command or action to fix it.
4. Effort: `quick` (under 5 minutes), `moderate` (15 to 30 minutes), or `significant` (over 1 hour).

Order immediate fixes:

1. Critical vulnerabilities.
2. No test runner or tests that cannot execute.
3. Missing lockfile.
4. High vulnerability findings.
5. Missing strict type checking.
6. Missing formatter or linter.
7. Major-version dependency gaps.

List CI/CD, deployment configuration, and agent instruction files as follow-up work unless their absence compounds an immediate verification failure.

## Write the report

Build the report in memory. If `context/foundation/health-check.md` exists, ask under `// [AWAITING CONFIRMATION] //` whether to overwrite it, save as the next `health-check-vN.md`, or cancel.

Write:

```markdown
---
project: <project or directory name>
checked_at: <ISO 8601>
health: <healthy|needs-attention|critical-issues>
language_family: <family>
---

## Dependency Health

<lockfile, audit, direct versus transitive, and staleness findings>

## Verification Infrastructure

<tests, CI/CD, and configuration findings>

## Stack Assessment Links

<relevant prior assessment gaps, or None.>

## Prioritized Fixes

<ranked, concrete fixes with effort>

## Follow-up Work

<nonurgent CI/CD, deployment, and instruction-file items>

## Summary

<overall status and immediate recommendation>
```

## Completion response

```text
// [CLEAR THOUGHT] :: [HEALTH REPORT SEALED] //<br>
Project: <name><br>
Health: <status><br>
Dependencies: <critical and high counts><br>
Tests: <working | unavailable | not detected><br>
Report: <path><br>
```

Stop after reporting. Emit `// [NEXT DIRECTIVE] //` with `Invoke: rites-of-electro-traction` when agent onboarding is next, or address prioritized fixes manually. Do not run fixes automatically.

## Binding rules

1. All analysis is read-only.
2. A failed check is a finding, never a reason to abandon the report.
3. Recommendations name concrete commands or actions.
4. Prioritize by impact on agents' ability to make and verify safe changes.
5. Preserve existing project files and configuration.
