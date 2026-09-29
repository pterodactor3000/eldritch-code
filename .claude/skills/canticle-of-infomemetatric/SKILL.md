---
name: canticle-of-infomemetatric
alias: canticle-of-issue-creation
description: Create issues from context/foundation/roadmap.md in an MCP task-management provider (Linear, Jira, GitHub Issues). Diffs existing tracker issues by slice or change-id prefix, presents an overview for approval, then creates missing issues. When a repository MCP is present (GitHub, GitLab, or equivalent), asks whether to mirror each created issue into that repo tracker and cross-link both sides. Use when the user asks to create issues from the roadmap, sync roadmap slices to Linear/Jira, mirror issues to GitHub, or invokes canticle-of-infomemetatric.
---

# Infomemetatric

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_Flesh makes us mighty. Faith makes us strong. The machine and the flesh, alloyed, serving as one the holy purpose of the Omnissiah. Thus must it ever be._

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
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This canticle's tracker-specific schemas name the fields and sections. Line layout from that file always applies.

Use this skill when the user says "create issues from roadmap", "sync roadmap to Linear", "seed tracker from roadmap", "mirror issues to GitHub", "canticle-of-issue-creation", or "canticle-of-infomemetatric".

**Primary tracker writes are forbidden until Gate 1 approval. Mirror writes are forbidden until Gate 2 approval.** Steps before each gate are read-only for that write path.

## Workflow

1. **Locate artifacts**: read `context/foundation/roadmap.md` fully (no `limit`/`offset`). Read `context/foundation/prd.md` when present for project name and PRD ref validation. If roadmap is missing, emit `// [INFOMEMETATRIC] :: [FAILED] //` with reason and stop unless the user supplies an alternate path.
2. **Discover primary provider**: scan enabled MCP servers for task-management issue tools (`list_issues`, `save_issue`, `create_issue`, or equivalent with `title` + `description`). If the user names a provider, use it when available. Prefer Linear or Jira when both a project tracker and a repository Issues API qualify: repository Issues is the mirror target, not the primary, unless it is the only provider. If none qualifies, fail and stop. Read tool schemas before any MCP call.
3. **Discover repository MCP (best effort)**: scan for repository issue tools (GitHub Issues, GitLab Issues, or equivalent create/list). Record availability for Gate 2. Do not treat repository Issues as primary when a dedicated task-management provider exists.
4. **Parse & draft**: extract every `F-NN` / `S-NN` slice per [mapping-rules.md](references/mapping-rules.md). Build one draft issue per slice (title prefix, description template, optional project/milestone).
5. **Diff existing**: search the primary provider for issues whose title contains `// [S-NN]::` / `// [F-NN]::` or the change-id slug. Mark each draft as `create`, `exists` (link found), or `ambiguous` (multiple matches). Never invent identifiers.
6. **Present overview**: emit the overview block exactly. End with Gate 1 approval ask. **Do not call tools in this turn.** Wait for user reply.
7. **Create primary issues**: on `approve`, create only drafts marked `create` (minus any IDs the user excluded). Attach team/project/milestone when resolved. Apply only what the overview promised.
8. **Mirror gate (when repository MCP present)**: after primary creates succeed (or when creates were all skips/`exists`), ask whether to mirror **created** issues into the repository tracker. **Separate turn; wait for reply.** Skip Gate 2 entirely when no repository MCP was found: say so in the summary.
9. **Mirror (optional)**: on `yes` / `mirror`, create repository issues with the same title prefix and a body that links the primary identifier. Cross-link: comment or append on the primary issue with the mirror URL/number when the provider supports it. Mirror only issues created or explicitly selected in this run unless the user asks to backfill `exists` rows.
10. **Emit summary**: report planned, created, mirrored, skipped, and failed items.

For a missing roadmap or unavailable primary provider, emit:

```text
// [INFOMEMETATRIC] :: [FAILED] //<br>
Operation: <operation><br>
Reason: <decisive reason><br>
```

Then stop.

## Issue Title Format

Use this prefix **verbatim** on every created primary and mirror issue (same as rites-of-sanctified-alteration):

```
// [S-NN]::[change-id] // <type>: <description under 10 words><br>
```

| Part            | Rule                                                                                 |
| --------------- | ------------------------------------------------------------------------------------ |
| `S-NN` / `F-NN` | Slice or foundation ID from roadmap                                                  |
| `change-id`     | Kebab-case Change ID from slice (foundation rows may use a derived slug)             |
| `<type>`        | Conventional commit type: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf` |
| `<description>` | Imperative, ≤ 10 words, no trailing period                                           |

Prefer the Backlog Handoff suggested title for `<type>: <description>` when present. Otherwise derive from Outcome (≤ 10 words). Default type: `feat`.

Example: `// [S-04]::dashboard-tile-style // feat: themed header strip on dashboard`

## Scope Defaults

| Input | Default |
| ----- | ------- |
| Which slices | All `F-NN` / `S-NN` in `## At a glance` (or `## Slices` bodies if At a glance is absent) |
| Status filter | Include all statuses unless user narrows (`ready` only, exclude `blocked`, etc.) |
| Already tracked | `exists` rows: do not recreate; list in overview |
| Foundation rows | Include; same title prefix with `F-NN` |
| Acceptance criteria | Use slice AC when present in body or notes; else omit AC section and note `AC: none in roadmap` |

## Approval Gates

### Gate 1: primary create (after overview)

```
// [AWAITING CONFIRMATION] //<br>
Approve **create** of <N> issues in <provider>? Reply: `approve`, `skip`, or list slice IDs to include/exclude.<br>
```

- Default: no writes.
- Never create in the same turn as the overview.
- Never use `AskQuestion`: overview must stay visible in chat.

### Gate 2: repository mirror (after primary execution, only if repository MCP present)

```
// [AWAITING CONFIRMATION] //<br>
Mirror <N> issues to <repository provider> (<repo>)? Reply: `yes`, `no`, or list primary IDs / slice IDs to include/exclude.<br>
```

- Default: no mirror.
- Ask every time repository MCP is available, even if the user previously mirrored elsewhere: do not assume.
- Never mirror in the same turn as the ask.
- If repository MCP is absent, do not invent a Gate 2; note `No repository MCP.` in the summary.

## Output Format

In emitted output, **all characters between `[` and `]` must be UPPERCASE** in section headers and labels. Issue title prefixes (`// [S-NN]::[change-id] //`) keep documented ID casing for tracker writes. Line layout follows [Cogitation Output Conventions](../conventions.md): `<br>` after every header and every create, exists, or ambiguous row.

### Overview (before Gate 1: required)

```text
// [INFOMEMETATRIC] :: [OVERVIEW] //<br>
Provider: <primary name><br>
Repo MCP: <name + repo | none><br>
Roadmap: <slice count><br>
Create: <N><br>
Exists: <M><br>
Ambiguous: <K><br>

// [CREATE] //<br>
<S-NN | F-NN>: <change-id>: <full prefixed title><br>
  Team/Project: <inferred or `: specify on approve`><br>
  Milestone: <inferred or :><br>
  AC: <present | none in roadmap><br>
… one block per create candidate; or `None.`

// [EXISTS] //<br>
<S-NN | F-NN>: <primary IDENTIFIER>: <title match note><br>
… or `None.`

// [AMBIGUOUS] //<br>
<S-NN | F-NN>: <match count> candidates: <identifiers><br>
… or `None.` Resolve before create, or exclude from approve.

// [MIRROR] //<br>
Mirror available: yes | no<br>
Mirror provider: <name or None.><br>
Mirror repo: <repo or None.><br>
Gate 2 runs after primary creates when Mirror available is yes.<br>

// [AWAITING CONFIRMATION] //<br>
Approve **create** of <N> issues in <provider>? Reply: `approve`, `skip`, or list slice IDs to include/exclude.<br>
```

Overview rules:

- Do not invent slices, milestones, or existing issue links: only report parsed roadmap and MCP data.
- Ambiguous rows are never auto-created; user must exclude them or name the canonical identifier.
- When team/project/milestone is unresolved, keep `: specify on approve` and accept overrides in the Gate 1 reply.
- One create/exists/ambiguous candidate per top-level line (continuation fields may indent under it).

### Summary (after execution)

```text
// [INFOMEMETATRIC SUMMARY] //<br>
Primary: <name><br>
Mirror: <name | none | declined><br>
Executed: <YYYY-MM-DD><br>

// [CREATED] //<br>
<IDENTIFIER>: <S-NN | F-NN>: <title><br>
… or `None.`

// [MIRRORED] //<br>
<primary IDENTIFIER> ↔ <mirror IDENTIFIER or URL><br>
… or `None: declined, skipped, or no repository MCP.`

// [SKIPPED] //<br>
<item>: <reason><br>
… or `None.`

// [FAILED] //<br>
<item>: <reason><br>
… or `None.`
```

Summary rules:

- One created, mirrored, skipped, or failed row per line under its header.

## Relationship to Sibling Rites

| Skill | Role |
| ----- | ---- |
| `canticle-of-sacred-fabrication` | Project + milestones from PRD/roadmap. Run before this when milestones should exist for attachment. |
| `rites-of-sanctified-alteration` | One new roadmap slice, optional single issue. This canticle bulk-creates from the full roadmap. |
| `canticle-of-binary-merge` | PR open + link existing issues. Consumes issues this canticle created. |
| `canticle-of-cleaning` | Triage after seeding; does not create from roadmap. |

Do not invoke siblings automatically. Suggest them under `// [NEXT DIRECTIVE] //` when relevant.

## Additional Resources

- Roadmap → issue field mapping and sync marker: [references/mapping-rules.md](references/mapping-rules.md)
- Provider discovery, writes, and mirror linking: [references/provider-adapters.md](references/provider-adapters.md)
