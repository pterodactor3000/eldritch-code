---
name: canticle-of-sacred-fabrication
alias: canticle-of-project-creation
description: Fabricate or update a project-management project from context/foundation/prd.md and roadmap.md via MCP (Linear, Jira, GitHub Projects). Maps PRD entries to project metadata, roadmap streams to milestones, presents an overview for approval, then creates or syncs the project. On update, posts Liturgy of Holy Sustenance audit comments to the project and to linked PRs when a repository MCP is available. Use when the user asks to fabricate a project, sync PRD to Linear/Jira, create milestones from roadmap, or invokes canticle-of-sacred-fabrication.
---

# Sacred Fabrication

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
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This canticle's tracker-specific schemas name the fields and sections. Line layout from that file always applies.

Use this skill when the user says "fabricate project", "sync PRD to Linear", "create project from roadmap", "update project from PRD", or "canticle-of-sacred-fabrication".

**Writes are forbidden until Step 5 approval.** Steps 1–4 are read-only.

## Workflow

1. **Locate artifacts**: read `context/foundation/prd.md` and `context/foundation/roadmap.md` fully (no `limit`/`offset`). If either is missing, report which and stop unless the user supplies an alternate path.
2. **Discover providers**: scan enabled MCP servers for project-management tools (`list_projects`, `save_project`, `list_milestones`, `save_milestone`, or equivalent). If the user names a provider, use it when available. If none qualifies, say so and stop. Read tool schemas before any MCP call.
3. **Discover repository MCP (best effort)**: scan for PR/repository tools (`list_pull_requests`, `create_pull_request_comment`, or equivalent). Optional; needed only for Step 7 PR audit propagation.
4. **Parse & map**: extract PRD entries and roadmap streams per [mapping-rules.md](references/mapping-rules.md). Resolve whether this is **create** or **update** (see Mode detection below).
5. **Present overview**: emit the overview block exactly. End with the one-line approval ask. **Do not call tools in this turn.** Wait for user reply.
6. **Execute approved plan**: create or update project, milestones, and project description. Apply only what the overview promised.
7. **Audit propagation (update mode only)**: post Liturgy audit comments on the project (and each affected milestone when the provider supports it). If repository MCP is available, find PRs linked to in-scope issues and post the same audit comment on each qualifying PR.
8. **Emit summary**: report what was planned, approved, created/updated, and any failures.

For a missing required artifact or unavailable project-management provider, emit `// [SACRED FABRICATION] :: [FAILED] //` with `Operation:` and `Reason:`, then stop.

## Mode Detection

| Mode       | Signal                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| **Create** | No existing project matches PRD `project` name (case-insensitive) or user explicitly says "create" / "new project" |
| **Update** | A project with matching name exists, or user names an existing project ID/name to sync                             |

On update, diff artifacts against the last known state:

1. Prefer a `<!-- sacred-fabrication:sync -->` marker block at the bottom of the project description (see mapping rules): parse stored PRD version, roadmap hash, and milestone map.
2. If no marker exists, diff against current project description and milestone names vs parsed artifacts.

Record every detected change for the audit comment and overview.

## Approval Gate

After Step 5 overview, wait for chat reply. **Never use `AskQuestion`**: overview must stay visible.

```
// [AWAITING CONFIRMATION] //<br>
Approve **<create | update>** for project "<name>"? Reply: `approve`, `skip`, or describe edits.<br>
```

- Default is **no writes**: silence or ambiguity means skip.
- Never execute in the same turn as the overview.

## Output Format

In emitted output, **all characters between `[` and `]` must be UPPERCASE**: section headers, labels, and any dynamic bracket text (e.g. `[PTERODACTOR3000]` in audit comments). Line layout follows [Cogitation Output Conventions](../conventions.md): `<br>` after every header and every row or block.

### Overview (before approval: required)

```text
// [SACRED FABRICATION] :: [OVERVIEW] //<br>
Mode: <create | update><br>
Provider: <name><br>
Project: <PRD project name><br>
PRD: v<version><br>
Roadmap slices: <slice count><br>
Roadmap streams: <stream count><br>

// [PROJECT] //<br>
Name: <from PRD frontmatter><br>
Summary: <one line from Vision & Problem Statement><br>
Description sections: <comma-separated section names to write, e.g. Vision, Success Criteria, User Stories, FR index><br>

// [MILESTONES] //<br>
<Stream letter or ordinal>: <Theme>: Chain: <F-01 → S-01 → …><br>
  Scope: <one line from stream Note or derived from slice outcomes><br>
… one block per stream; or `None: roadmap has no Streams section.`

// [CHANGES] :: [UPDATE MODE ONLY] //<br>
<field or milestone>: <what changed>: <why, from PRD/roadmap diff><br>
… or `None: already in sync.`

// [PR AUDIT] :: [UPDATE MODE ONLY] //<br>
<PR #N>: linked issue <IDENTIFIER>: in scope: <yes | no>: <reason><br>
… or `No repository MCP.`
… or `No linked PRs in scope.`

// [AWAITING CONFIRMATION] //<br>
Approve **<create | update>** for project "<name>"? Reply: `approve`, `skip`, or describe edits.<br>
```

Overview rules:

- Milestones come from `## Streams` in roadmap.md. If Streams is absent, derive one milestone per `F-NN`/`S-NN` in `## At a glance` (cap at 10; note truncation).
- PRD refs in milestone scope use literal IDs (`FR-001`, `US-01`) from the roadmap slice rows in that stream's chain.
- Update mode must list every material diff on its own line; do not collapse into "misc updates".
- Do not invent streams, milestones, or PR links: only report parsed artifacts and MCP data.

### Summary (after execution)

```text
// [FABRICATION SUMMARY] //<br>
Provider: <name><br>
Mode: <create | update><br>
Executed: <YYYY-MM-DD><br>

// [PROJECT] //<br>
<name>: <created | updated>: <provider identifier or URL if returned><br>

// [MILESTONES] //<br>
<name>: <created | updated | unchanged><br>
… or `None.`

// [AUDIT COMMENTS] //<br>
<target>: posted<br>
… or `None.`

// [PR AUDIT COMMENTS] //<br>
<PR #N>: posted<br>
… or `None.`

// [SKIPPED / FAILED] //<br>
<item>: <reason><br>
… or `None.`
```

Summary rules:

- One milestone, audit target, or failure row per line under its header.

## Liturgy Audit Comment

On **update mode only**, post this exact format (Markdown body) to the project and to each in-scope linked PR:

```
// <who> :: Liturgy of Holy Sustenance :: <when> //
<what changed; why>
```

| Field                 | Rule                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `<who>`               | Current user display name from MCP if available; else `agent`                                                 |
| `<when>`              | `YYYY-MM-DD` (today)                                                                                          |
| `<what changed; why>` | One or two sentences from the diff: concrete IDs (`FR-003`, `S-02`, stream B) and rationale from PRD/roadmap |

Post the **same body** on project, affected milestones (when supported), and each in-scope PR. Do not paraphrase differently per target.

## PR Scope Rules (update mode)

When repository MCP is available:

1. List open PRs for the connected repository (or repo the user named).
2. For each PR, resolve linked issues via provider metadata (`Fixes #`, `Closes`, branch name, or MCP link fields).
3. An issue is **in scope** when it references a roadmap Change ID, slice ID (`S-NN`/`F-NN`), or PRD ref (`FR-`, `US-`) that appears in the current diff.
4. Post the Liturgy audit comment only on in-scope PRs. Skip merged/closed PRs unless the user explicitly included them.

Details and provider-specific fetch patterns: [references/provider-adapters.md](references/provider-adapters.md).

## Additional Resources

- PRD/roadmap → project/milestone field mapping and sync marker: [references/mapping-rules.md](references/mapping-rules.md)
- Provider discovery, writes, and PR linking: [references/provider-adapters.md](references/provider-adapters.md)
