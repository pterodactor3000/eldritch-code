---
name: hymn-of-prevention-of-malfunction
alias: hymn-of-code-review
description: Review code changes against team engineering conventions, testing standards and security expectations. Use when reviewing pull requests, examining code changes, or when the user asks for a code review, diagnostic interrogation, or invokes hymn-of-prevention-of-malfunction.
---

# Hymn of Prevention of Malfunction

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_May your weapon be guarded against malfunction, As your soul is guarded from impurity. The Machine God watches over you. Unleash the weapons of war. Unleash the Deathdealer._

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
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This hymn's diagnostic schema names the fields and sections. Line layout from that file always applies.

Use this skill when the user says "review code", "check this PR", "review my changes", "code review", or "hymn-of-prevention-of-malfunction".

## Workflow

1. Identify the scope: staged diff, PR files, or files the user pointed at.
2. Read each changed file fully before judging it.
3. Evaluate against the six categories below using the team's engineering conventions.
4. Emit findings in severity order, then deliver a single verdict.

If review scope is unavailable, emit:

```text
// [DIAGNOSTIC INTERROGATION] :: [INPUT REQUIRED] //<br>
Transmit:<br>
1. Staged diff, pull request, branch, or file paths.
2. Optional review focus.
```

Then wait.

## Review Categories

### Naming

- Variables and functions use descriptive camelCase; only `url`, `id`, `api`, and `config` may be abbreviated.
- Booleans are prefixed with `is`, `has`, `should`, or `can`.
- Functions are verb-first (`getUserById`, not `user`).
- File names match the primary export (`UserService.ts` exports `UserService`).
- Constants use UPPER_SNAKE_CASE.

### Error Handling

- Async work uses try/catch or `.catch()`.
- Error messages state what failed and include relevant inputs.
- No empty catch blocks; at minimum log or rethrow.
- HTTP errors include status code and an actionable message.
- Resource cleanup lives in `finally` when resources are opened.

### TypeScript

- No `any` without an explicit justification comment.
- Prefer `interface` over `type` for object shapes.
- External data is `unknown` until narrowed with type guards.
- States are modeled with discriminated unions, not optional-field sprawl.
- Generic parameters use descriptive names (`TUser`, not `T`).

### Function Design

- Each function has a single responsibility; split anything that needs "and" in its description.
- At most three parameters; beyond that, use an options object.
- Prefer early returns over nested conditionals.
- Query functions (`get*`, `find*`, `is*`) stay pure.

### Security

- No secrets in source; use environment variables.
- Validate user input at system boundaries.
- SQL uses parameterized statements only.
- API responses never expose stack traces or internal paths.

### Testing

- Test names describe behavior (for example, "returns empty array when no results found").
- Each test owns its setup and teardown.
- Assertions are specific (`toEqual(expected)` over `toBeTruthy()`).
- Edge cases covered: empty, null, boundary values, and error paths.

## Output Format

In emitted output, **all characters between `[` and `]` must be UPPERCASE**: section headers, labels, and any dynamic bracket text.

Structure the review with these headers exactly. Line layout follows [Cogitation Output Conventions](../conventions.md): `<br>` after every header and every finding.

```text
// [DIAGNOSTIC INTERROGATION] :: [FINDINGS] //<br>

// [CRITICAL] //<br>
<file:line>: <finding><br>

// [WARNING] //<br>
<file:line>: <finding><br>

// [SUGGESTION] //<br>
<file:line>: <finding><br>

// [VERDICT] //<br>
APPROVE | REQUEST CHANGES | NEEDS DISCUSSION: <one-line rationale><br>

// [NEXT DIRECTIVE] //<br>
<single required human action, or `None: review disposition is complete.`><br>
```

Rules for output:

- List **Critical** findings first, then **Warning**, then **Suggestion**.
- Include `file:line` when the location is known; omit the prefix only when the finding is cross-cutting.
- One finding per line under each severity header. No paragraphs. Never join findings onto one line.
- If a severity has no findings, write `None.` under that header.
- End with exactly one verdict line under `// [VERDICT] //`.

### Verdict guidance

- **APPROVE**: no Critical or Warning findings; Suggestions are optional polish.
- **REQUEST CHANGES**: any Critical finding, or Warning findings that affect correctness, security, or maintainability.
- **NEEDS DISCUSSION**: trade-offs, ambiguous requirements, or convention conflicts that need a human decision before merge.
