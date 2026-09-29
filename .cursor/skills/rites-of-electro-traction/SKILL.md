---
name: rites-of-electro-traction
alias: rites-of-agents-markdown
description: Generate or surgically update an AGENTS.md onboarding document for AI coding agents. Inspect repository commands, configuration, layout, and history, then create a concise, evidence-backed guide. Use when the user asks to create AGENTS.md, write an agent onboarding document, generate a contributor guide for agents, or invokes rites-of-electro-traction.
---

# Rites of Electro Traction

Generate a short, repository-specific `AGENTS.md` that lets a fresh AI coding agent act safely without repeated discovery.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_All praise the edd and flow, All feel the nimbus rising, All sing the body electric, Feel the full charge crackle! Invest this device with Your holy charge._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply [Cogitation Output Conventions](../conventions.md) (including line layout) to every chat message. This rite's templates name the fields and sections. Line layout from that file always applies.

- Begin substantial lifecycle messages with `// [ELECTRO TRACTION] :: [<PHASE>] //`. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Use compact procedural diction. State verified inputs, action, and result.
- Gate every write under `// [AWAITING CONFIRMATION] //`.
- Report failed operations under `// [ELECTRO TRACTION] :: [FAILED] //` with operation and decisive reason.
- Never invoke another rite automatically.

## Resolve target and scope

`$ARGUMENTS` is optional:

- Empty: target `AGENTS.md` at repository root.
- Directory path: target `<directory>/AGENTS.md`.
- Full `.md` path: target that file.

Resolve repository root with `git rev-parse --show-toplevel`.

- Target directory equals repository root: generate a repository-level onboarding guide.
- Target directory is below repository root: generate a directory-level guide. Read local siblings, tests, parent guidance, and local configuration first. Link once to root `AGENTS.md` for global rules. Do not include repository structure, global build commands, or commit conventions.

Check target existence before discovery:

- Missing target: use Create path.
- Empty target: use Create path.
- Existing target: use Update path. Never overwrite it silently.

## Create path

### Discover

Inspect only sources that exist and record evidence:

1. `README.md`, existing `AGENTS.md` or `CLAUDE.md`, top-level documentation index.
2. Package manifest and scripts: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, or equivalent.
3. Lint, format, and type configuration.
4. Test configuration, test locations, and CI workflow.
5. Repository layout, limited to two directory levels.
6. Recent history: `git log --oneline -n 30`.

For directory scope, inspect the target directory's siblings, nearest parent instructions, local configuration, and co-located tests before any repository-level sources.

Every output claim must trace to an inspected file, command, or commit. Do not invent project facts, restate framework defaults, write generic advice, or embed multi-line code or configuration.

### Draft

Repository-level document:

- Title: `# Repository Guidelines`.
- Body: 200 to 400 words.
- Open with one or two sentences naming repository purpose and primary stack.
- Order high-leverage rules and frequent commands first.
- Include only applicable sections: hard rules, structure, commands, style, tests, commits and pull requests, security/configuration, architecture.

Directory-level document:

- Body: 120 to 250 words.
- Put local rules first.
- Include only local conventions: adding a unit, layout and naming, allowed imports or data flow, local testing, and tripwires.
- Cite one sibling through an `@` reference when it demonstrates the expected shape.

Use `@path/to/file` references for canonical details instead of duplication. Each rule must be checkable against a diff.

### Validate draft

Before requesting approval, verify:

1. Body meets scope length budget.
2. No fenced block contains more than one command line.
3. Every claim has repository evidence.
4. Each rule is concrete and reviewable.
5. Critical rules and frequent commands appear in first third.
6. No stale or missing `@` reference appears.

Present:

```text
// [ELECTRO TRACTION] :: [DRAFT READY] //<br>
Target: <path><br>
Scope: <repository|directory><br>
Evidence inspected: <key paths><br>
Body words: <count><br>
Sections: <ordered list><br>

// [AWAITING CONFIRMATION] //<br>
Approve write; revise; or cancel.<br>
```

Write only after explicit approval. Then report:

```text
// [ELECTRO TRACTION] :: [GUIDE SEALED] //<br>
Path: <path><br>
Body words: <count><br>
Sections: <ordered list><br>

// [NEXT DIRECTIVE] //<br>
Test this guide with a fresh agent session on a real task.<br>
```

## Update path

Treat existing content as authorial. Default to surgical edits.

1. Read full target. Inventory headings, rules, commands, `@` references, and relative paths.
2. Determine last committed edit with `git log --follow --format="%h %ad %s" --date=short -- <path>`. If untracked, preserve valid project-specific content while using Create-path discovery.
3. Inspect current referenced files and relevant changes since the last edit: documentation, manifests and scripts, tooling config, tests, CI, and recent commit history.
4. Classify each existing statement:
   - `KEEP`: still accurate.
   - `UPDATE`: right intent, stale detail.
   - `REMOVE`: source no longer exists or contradicts authoritative guidance.
   - `MISSING`: high-leverage current fact absent from guide.
5. Present evidence-backed classification with `path:line` citations for every `UPDATE`, `REMOVE`, and `MISSING` item.

Then emit:

```text
// [ELECTRO TRACTION] :: [UPDATE ANALYSIS] //<br>
Target: <path><br>
KEEP: <count><br>
UPDATE: <count><br>
REMOVE: <count><br>
MISSING: <count><br>

// [AWAITING CONFIRMATION] //<br>
Choose: apply targeted updates; full regenerate; show analysis again; or cancel.<br>
```

For targeted updates, preserve `KEEP` wording. Edit only approved `UPDATE`, `REMOVE`, and `MISSING` items. Full regeneration requires explicit approval. Re-run draft validation before writing.

## Guardrails

1. Write exactly one onboarding Markdown file. Do not modify unrelated paths.
2. Preserve uncommitted user edits unless a CI-enforced rule directly contradicts them.
3. Never claim a command, convention, or layout not verified by inspection.
4. Do not add generic software-engineering advice.
5. Do not auto-run downstream rites.
