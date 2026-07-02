---
name: rites-of-diagnostic-interrogation
description: Review code changes against team engineering conventions, testing standards and security expectations. Use when reviewing pull requests, examining code changes, or when the user asks for a code review, diagnostic interrogation, or invokes rites-of-diagnostic-interrogation.
---

# Diagnostic Interrogation

Use this skill when the user says "review code", "check this PR", "review my changes", "code review", or "rites-of-diagnostic-interrogation".

## Workflow

1. Identify the scope: staged diff, PR files, or files the user pointed at.
2. Read each changed file fully before judging it.
3. Evaluate against the six categories below using the team's engineering conventions.
4. Emit findings in severity order, then deliver a single verdict.

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

In emitted output, **all characters between `[` and `]` must be UPPERCASE** — section headers, labels, and any dynamic bracket text.

Structure the review with these headers exactly:

```
// [CRITICAL] //
<file:line> — <finding>

// [WARNING] //
<file:line> — <finding>

// [SUGGESTION] //
<file:line> — <finding>

// [VERDICT] //
APPROVE | REQUEST CHANGES | NEEDS DISCUSSION — <one-line rationale>
```

Rules for output:

- List **Critical** findings first, then **Warning**, then **Suggestion**.
- Include `file:line` when the location is known; omit the prefix only when the finding is cross-cutting.
- One finding per bullet under each severity header.
- If a severity has no findings, write `None.` under that header.
- End with exactly one verdict line under `// [VERDICT] //`.

### Verdict guidance

- **APPROVE** — no Critical or Warning findings; Suggestions are optional polish.
- **REQUEST CHANGES** — any Critical finding, or Warning findings that affect correctness, security, or maintainability.
- **NEEDS DISCUSSION** — trade-offs, ambiguous requirements, or convention conflicts that need a human decision before merge.
