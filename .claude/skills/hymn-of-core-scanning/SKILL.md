---
name: hymn-of-core-scanning
alias: hymn-of-stack-assessment
description: Assess an existing codebase for AI-agent readiness across type safety, conventions, ecosystem familiarity, and documentation. Writes context/foundation/stack-assessment.md with evidence-backed scores and ready-to-paste instruction-file compensation rules. Use when the user asks to assess an existing stack, evaluate agent friendliness, or invokes hymn-of-core-scanning.
---

# Hymn of Core Scanning

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

Assess an existing stack. Do not recommend replacing it. Identify the existing strengths, gaps, and concrete compensating instructions that let an AI agent work safely within the stack the team already chose.

## Preconditions

Look for at least one project marker:

- `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Gemfile`
- `composer.json`, `*.csproj`, or `pubspec.yaml`

If no marker exists, explain that an existing codebase is required and stop. A greenfield project needs stack selection, not stack assessment.

Optionally read `context/foundation/prd.md`. If it describes a brownfield change, use its current-system and scope sections to prioritize the relevant components. The PRD is context, not a requirement.

## Detect the machine's components

Read files on disk. Do not infer components from conversation alone.

Detect and report:

- Language and version where available.
- Framework and version where available.
- Build tool and package manager.
- Test runner, type checker, linter, and formatter.
- CI provider and deployment configuration.
- Existing AI instruction files, including `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, and Copilot instructions.

Use these evidence sources:

| Ecosystem                | Sources                                                                     |
| ------------------------ | --------------------------------------------------------------------------- |
| JavaScript or TypeScript | `package.json`, lockfile, `tsconfig.json`, framework and test configuration |
| Python                   | `pyproject.toml`, requirements files, lockfiles, type-checker configuration |
| Rust                     | `Cargo.toml`                                                                |
| Go                       | `go.mod`                                                                    |
| Ruby                     | `Gemfile`, RBS or Sorbet configuration                                      |
| PHP                      | `composer.json`, PHPStan or Psalm configuration                             |
| .NET                     | project and solution files                                                  |
| Dart                     | `pubspec.yaml`                                                              |

Present the detected stack under `// [CORE SCAN] :: [DETECTED STACK] //`, then ask:

```text
// [AWAITING CONFIRMATION] //<br>
Confirm detected stack or transmit corrections. Corrections apply only to this run.<br>
```

Then wait.

## Evaluate the four readiness qualities

Assess every detected language, framework, build tool, and test runner where the quality applies. Cite the file or missing configuration that supports every result.

### Explicit contracts

Pass when the language is typed by default or the project enforces static types or schemas at boundaries.

- Strong evidence: TypeScript with `strict`, Rust, Go, Java, C#, Dart, Python with mypy or pyright, Ruby with Sorbet or RBS, PHP with PHPStan or Psalm.
- Gap: JavaScript without TypeScript, or dynamically typed languages without configured static analysis.

### Recognizable conventions

Pass when the framework supplies predictable structure, or the repository documents its local structure and patterns.

- Strong evidence: convention-oriented frameworks or clear repository instruction files.
- Gap: minimal frameworks plus undocumented routing, error handling, directory layout, or registration order.
- A documented local convention may pass with a note.

### Ecosystem familiarity

Assess popularity within the component's own language family. Do not compare Python, Ruby, PHP, or Rust ecosystems against JavaScript volume.

- Pass: mainstream framework or tool in its ecosystem.
- Gap: a niche, new, forked, or internal-only component.

### Current authoritative documentation

Pass when official, current, version-aligned documentation exists.

- Confirm unfamiliar frameworks or tools through Context7 before scoring.
- Gap: stale docs, scattered blog posts, or version mismatch.

## Report the assessment

Use this matrix:

```text
// [CORE SCAN] :: [READINESS MATRIX] //<br>
| Component | Contracts | Conventions | Familiarity | Documentation | Verdict |
| --- | --- | --- | --- | --- | --- |
| <component> | pass | pass | pass | pass | ready |
```

Use `partial` only when an explicit local convention compensates for a framework weakness. State the evidence immediately after the matrix.

## Forge compensation rules

For every gap, write ready-to-paste rules for the repository's AI instruction files. Never offer generic advice.

Examples:

- Contract gap: `All new public functions require explicit parameter and return types. Validate external input at the boundary before domain logic runs.`
- Convention gap: `HTTP routes live in src/routes/. Each route module exports one handler. Register middleware only in src/app.ts, in the documented order.`
- Familiarity gap: `Before changing <framework>, read the official guide linked below. Follow the documented <pattern> example and do not introduce undocumented abstractions.`
- Documentation gap: `This project pins <component> to <version>. Use <URL> as the canonical reference; record any version-specific workaround beside the affected code.`

For each rule, name why it matters and where the supporting evidence came from.

## Determine verdict

Choose one:

- `ready`: all applicable qualities pass.
- `ready-with-compensation`: gaps have clear, documented mitigation.
- `significant-friction`: multiple gaps require substantial steering and review.

The verdict is informational. Never turn a low verdict into a demand to migrate.

## Write assessment artifact

Build the assessment in memory. If `context/foundation/stack-assessment.md` exists, ask under `// [AWAITING CONFIRMATION] //` whether to overwrite it, save as the next `stack-assessment-vN.md`, or cancel.

Write:

```markdown
---
project: <detected name or directory name>
assessed_at: <ISO 8601>
agent_readiness: <ready|ready-with-compensation|significant-friction>
context_type: brownfield
gates_passed: <number>
gates_failed: <number>
---

## Stack Components

<evidence-backed component inventory>

## Quality Gate Assessment

<matrix and detailed evidence>

## Gaps and Compensation

<each gap, impact, and mitigation>

### Recommended Instruction File Additions

<ready-to-paste rules>

## Summary

<verdict, strengths, gaps, and recommended verification work>
```

## Completion response

```text
// [CORE SCAN] :: [DIAGNOSTIC SEALED] //<br>
Project: <name><br>
Readiness: <verdict><br>
Assessment: <path><br>
Compensation rules: <count><br>
```

Stop after reporting. Emit `// [NEXT DIRECTIVE] //` with `Invoke: hymn-of-clear-thought`. Do not modify instruction files automatically and do not invoke subsequent workflows.

## Binding rules

1. Existing code and configuration are the evidence source.
2. Every assessment result cites evidence or the specific missing file or configuration.
3. Evaluate, do not prescribe a stack replacement.
4. Compensation rules must be directly usable in an instruction file.
5. Ecosystem familiarity is language-family relative.
