---
name: rites-of-engine-invocation
alias: rites-of-bootstrap-scaffold
description: Scaffold a greenfield project from context/foundation/tech-stack.md, preserve existing context files, verify the resulting dependency tree, and record the run. Use when the user asks to bootstrap, scaffold, initialize, or set up the selected project stack, or invokes rites-of-engine-invocation.
---

# Rites of Engine Invocation

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_Thus we invoke the Master of All Knowledge. Shed Your powers upon this machine. Invest this device with Your holy charge._

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
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This rite's scaffold safeguards name the fields and sections. Line layout from that file always applies.

Materialize a selected starter in the current directory. This rite consumes the binding record. It does not select stacks, replace missing decisions with chat context, or overwrite the repository's context records.

Read [bootstrap-config.md](references/bootstrap-config.md) before execution.

## Preconditions

1. Resolve a supplied handoff path, stripping a leading `@`, or default to `context/foundation/tech-stack.md`.
2. If it is absent, report the path and stop. Direct the user to the stack-selection rite. Do not conduct an inline stack interview.
3. Read the handoff fully and validate its shape against [selection-contract.md](../litany-of-noospheric-binding/references/selection-contract.md).
4. Resolve `starter_id` in [starter-catalog.md](../litany-of-noospheric-binding/references/starter-catalog.md) and its scaffold command in [bootstrap-config.md](references/bootstrap-config.md).
5. If either lookup fails, report catalog drift and stop. Do not substitute another starter.
6. Present the resolved starter, project name, package manager, language, deployment target, feature flags, and scaffolding confidence under `// [SYNAPTIC ALIGNMENT] :: [PREFLIGHT] //`, followed by:

   ```text
   // [AWAITING CONFIRMATION] //<br>
   Confirm resolved binding, transmit an in-memory correction, or stop.<br>
   ```

   Then wait.

## Protect existing work

Check the current directory for scaffold fingerprints such as `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, `pom.xml`, `composer.json`, `*.csproj`, or `pubspec.yaml`.

If any exist, warn under `// [SYNAPTIC ALIGNMENT] :: [EXISTING WORK DETECTED] //` and ask for explicit confirmation under `// [AWAITING CONFIRMATION] //` before running a scaffold command.

The conflict policy is binding:

| Incoming path  | Existing path | Resolution                                                                |
| -------------- | ------------- | ------------------------------------------------------------------------- |
| `context/**`   | any           | Drop the scaffold copy. Existing context is canonical.                    |
| `.gitignore`   | exists        | Append only unique scaffold lines after a `# from <starter_id>` marker.   |
| Any other path | exists        | Preserve the existing path. Write the incoming file as `<path>.scaffold`. |
| Any other path | absent        | Move incoming file into place.                                            |

Never delete, overwrite, or rename user files. Never initialize Git. If the starter is cloned from a repository, remove its `.git/` before merging so upstream history does not enter the current project.

## Verify source recency

Before scaffolding, perform read-only verification:

1. Use Context7 to confirm the selected framework's current official starter command and documentation.
2. If the command conflicts with [bootstrap-config.md](references/bootstrap-config.md), stop and report the exact drift.
3. If the starter command or documentation cannot be checked because of a network or tool failure, warn, record it, and let the user choose whether to continue.

## Scaffold

Use the selected starter's configured strategy:

- **Temporary directory:** scaffold into `.synaptic-scaffold/`, then merge with the conflict policy.
- **Current directory:** scaffold directly only after the populated-directory confirmation.
- **Repository clone:** clone into `.synaptic-scaffold/`, remove its `.git/`, then merge.

Substitute `{name}` with `.synaptic-scaffold` for temporary or clone strategies, or `.` for current-directory scaffolds. Substitute `{pm}` with the handoff package manager or the configuration default.

Capture the command, stdout, stderr, and exit status.

If the command fails:

1. Do not merge files.
2. Leave `.synaptic-scaffold/` in place for inspection.
3. Write a partial verification record with `scaffold_status: failed`.
4. Report the exit status and final stderr lines under `// [SYNAPTIC ALIGNMENT] :: [FAILED] //`.
5. Stop. Do not run an audit.

## Audit the aligned project

After a successful scaffold, run the language-specific command in [bootstrap-config.md](references/bootstrap-config.md).

Audit results are informative, not a blocking gate:

- Report CRITICAL and HIGH counts in chat.
- Record MODERATE and LOW findings in the log.
- If the tool is unavailable, cannot parse output, or fails because of network conditions, record the reason and continue.
- Do not run automatic fixes.

## Write verification record

Write `context/changes/bootstrap-verification/verification.md`. If it exists, ask under `// [AWAITING CONFIRMATION] //` whether to overwrite, save as the next `verification-vN.md`, or stop.

The record contains:

```markdown
---
bootstrapped_at: <ISO 8601>
starter_id: <id>
project_name: <name>
language_family: <family>
package_manager: <resolved value or omitted>
scaffold_status: <ok|failed>
audit_command: <command|skipped>
---

## Binding Record

<verbatim handoff frontmatter and rationale>

## Source Verification

<documentation command check and any warnings>

## Scaffold Log

<resolved command, exit status, files moved, conflict siblings, ignore-file handling>

## Dependency Audit

<severity counts, findings, raw output or failure reason>

## Hints Observed

<handoff hints not acted on by this rite>

## Next Actions

- Review any `.scaffold` sibling files.
- Address dependency findings according to project risk tolerance.
- Initialize repository history if needed.
```

## Completion response

```text
// [SYNAPTIC ALIGNMENT] :: [MATERIALIZATION COMPLETE] //<br>
Starter: <starter id><br>
Scaffold: <files moved and conflicts><br>
Audit: <summary><br>
Verification record: <path><br>
```

State any manual follow-up. Emit `// [NEXT DIRECTIVE] //` with `Invoke: rites-of-rousing` when a PRD exists and roadmap is next, or `Invoke: litany-of-sacred-priming` when deployment platform is undecided. Stop. Do not automatically invoke another workflow.

## Binding rules

1. The binding record on disk is mandatory.
2. `context/` always wins conflicts.
3. A failed starter command is a hard stop. Audit findings are warnings.
4. Catalog and bootstrap-command drift must be corrected before scaffold execution.
5. Keep user-facing explanations concise and procedural. Internal strategy and schema names exist only for the rite's operation.
