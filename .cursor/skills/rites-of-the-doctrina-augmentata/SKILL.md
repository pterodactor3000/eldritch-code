---
name: rites-of-the-doctrina-augmentata
alias: rites-of-archivisation
description: Archive a completed change by moving its folder to context/archive, stamping change.md as archived, and closing an exact matching roadmap item. Use when the user asks to archive, close, or retire a completed change, or invokes rites-of-the-doctrina-augmentata.
---

# Rites of the Doctrina Augmentata

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_Although flesh may blacken and fail, fear not, for this too can be replaced. You can be reincarnated - reborn in steel by the will of the Omnissiah._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply this protocol to every message emitted in chat. It applies only to agent chat output: do not alter generated artifacts, issue or pull-request payloads, HTML markers, or parser-required schemas.

- Begin each substantial lifecycle message with `// [DOCTRINA AUGMENTATA] :: [<PHASE>] //`. All text between `[` and `]` is uppercase. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- Use compact, procedural Cogitation Unit diction: state verified inputs, status, action, and result. Do not add decorative roleplay or obscure required actions.
- Use named sections where applicable: `// [<RITE>] :: [ANALYSIS] //`, `// [<RITE>] :: [PREVIEW] //`, `// [<RITE>] :: [FINDINGS] //`, `// [<RITE>] :: [SUMMARY] //`, `// [<RITE>] :: [FAILED] //`, and `// [NEXT DIRECTIVE] //`.
- Place every archive confirmation in `// [AWAITING CONFIRMATION] //`, preserving the command words `archive`, `resume`, and `cancel`.
- Report errors in `// [DOCTRINA AUGMENTATA] :: [FAILED] //` with operation and decisive reason.
- End completion with `// [NEXT DIRECTIVE] //` only when a manual next step exists. Never invoke a downstream rite automatically.
- Separate rite and phase with ` :: `. Do not use em dashes.
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This rite's archive and roadmap schemas name the fields and sections. Line layout from that file always applies.

Move a completed change from `context/changes/<change-id>/` to `context/archive/<created-date>-<change-id>/`. Stamp `change.md` with archived status, preserve history with `git mv` when available, and close an exact matching roadmap item when present.

Archive checks are lenient except for uncommitted change-folder work and pre-existing staged changes. Archived folders are read-only by convention.

## Input and resolution

Accept a kebab-case Change ID or a path to `context/changes/<change-id>/`.

When no input is supplied, emit:

```text
// [DOCTRINA AUGMENTATA] :: [INPUT REQUIRED] //<br>
Transmit:<br>
1. Change ID.
2. Active change-folder path.
```

Then wait.

Normalize the first whitespace-delimited token:

1. Strip a leading `@`.
2. Strip a trailing `/`.
3. When a path remains, use its last non-empty segment as `<change-id>`.

Resolve `context/changes/<change-id>/` and read its `change.md` frontmatter.

Stop with `// [DOCTRINA AUGMENTATA] :: [FAILED] //` when:

- The active change folder does not exist. Check `context/archive/` for a directory ending in `-<change-id>` and report it as already archived when found.
- `change.md` reports `status: archived` while the folder remains active.
- `change.md.created` is absent or is not `YYYY-MM-DD`.

## Hard refusal

Before warning or moving anything, verify:

1. `git status --porcelain "context/changes/<change-id>/"` is empty.
2. `git diff --cached --quiet` succeeds.

When either check fails, emit:

```text
// [DOCTRINA AUGMENTATA] :: [FAILED] //<br>
Operation: archive preflight<br>
Reason: <uncommitted change-folder path or pre-existing staged path><br>
Required action: Commit, stash, or unstage the reported work, then invoke this rite again.<br>
```

Then stop. Do not offer a warning override.

When Git is unavailable or the workspace is not a Git repository, report that history preservation and the archive commit will be skipped. Continue with filesystem archival.

## Warning assessment

Collect these non-blocking warnings:

- `change.md.status` is not `implemented` or `impl_reviewed`.
- `plan.md` is absent.
- `## Progress` contains pending automated or manual rows. For legacy plans without those subsections, count all pending rows by phase.
- Completed Progress rows lack a trailing commit SHA.
- No `reviews/impl-review*.md` exists.

Present all warnings together:

```text
// [DOCTRINA AUGMENTATA] :: [ARCHIVE ASSESSMENT] //<br>
Change: <change-id><br>
Source: context/changes/<change-id>/<br>
Destination: context/archive/<created-date>-<change-id>/<br>

// [FINDINGS] //<br>
<warnings, or `None. Archive readiness verified.`><br>

// [AWAITING CONFIRMATION] //<br>
`archive` despite warnings, `resume` implementation, or `cancel`.<br>
```

With no warnings, continue directly. On `resume`, provide `/rites-of-ignition <change-id>` and stop. On `cancel`, leave all paths unchanged and stop.

## Archive operation

1. Compute destination `context/archive/<created-date>-<change-id>/`.
2. Refuse if destination already exists.
3. Before moving, update only these `change.md` frontmatter fields:
   - `status: archived`
   - `archived_at: <UTC ISO-8601 datetime>`
   - `updated: <UTC YYYY-MM-DD>`
4. Prefer `git mv "context/changes/<change-id>" "<destination>"`. If unavailable or unsuccessful, create `context/archive/` when needed, move the directory normally, and report the fallback.
5. Confirm destination exists and source no longer exists. Stop on a mismatch.
6. When Git is available, stage `<destination>/change.md` so the stamp lands with the rename.

Do not write inside the destination after the move.

## Roadmap close

When `context/foundation/roadmap.md` exists, search for an exact `Change ID` match:

- The matching `## At a glance` row.
- The matching `## Foundations` or `## Slices` item body.

If no exact match exists, leave the roadmap unchanged.

For an exact match:

1. Set the matching table Status cell to `done`.
2. Set the matching item-body `- **Status:**` field to `done`.
3. Append under `## Done`, creating that heading if absent:

   ```markdown
   - **<roadmap-id>: <outcome>** - Archived <today> to `context/archive/<created-date>-<change-id>/`. Lesson: -.
   ```

4. Set roadmap frontmatter `updated` to today when frontmatter exists.
5. Stage `context/foundation/roadmap.md` only when it was clean before this rite. If it was already dirty, leave the roadmap edit unstaged and report it.

Roadmap closure is best effort. Failure never rolls back a completed folder move.

## Archive commit

When Git is available, create one commit:

```bash
git commit -m "$(cat <<'EOF'
chore(archive): close <change-id>
EOF
)"
```

Do not pass `--no-verify`, signing-bypass flags, or amend options. If a hook fails, fix the cause and create a new commit.

## Completion

Emit:

```text
// [DOCTRINA AUGMENTATA] :: [ARCHIVISATION SEALED] //<br>
Change: <change-id><br>
Archive: context/archive/<created-date>-<change-id>/<br>
Status: archived<br>
Archived at: <timestamp><br>
Roadmap: <closed <roadmap-id> | no exact match | skipped><br>
Commit: <short SHA | not created><br>

// [NEXT DIRECTIVE] //<br>
Open a new change with `/rites-of-commission <new-change-id>` when further work is required.<br>
```

## Boundaries

- Never archive a folder with uncommitted change-folder edits or pre-existing staged work.
- Never alter a near-matching roadmap item.
- Never reorder roadmap slices, recompute dependencies, or create a missing roadmap.
- Never push. The archive commit remains local.
- Never unarchive. Start a new change and reference the archive when work resumes.
