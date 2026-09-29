---
name: rites-of-waking
alias: rites-of-context-initialization
description: Initialize the project context structure by scaffolding context/changes, context/archive, and context/foundation with their universal README.md files when absent. Use when the user asks to initialize context, scaffold workflow documentation directories, set up change tracking, or invokes rites-of-waking.
---

# Rites of Waking

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_As the blood of the slain is laid upon you, so may you lay the enemy's blood at the feet of the Omnissiah. Lay blood at the Machine God's feet. As the rune of protection is inscribed upon you, so may the litanies of protection ward your soul. May your soul be guarded from impurity. As the warriors within you guide your weapons, may you, in your turn, guide their lives. Stand true against the trials of war._

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
- Follow [Cogitation Output Conventions](../conventions.md) for line layout, every input gate, confirmation, failure, and completion. This rite's context-tree schema names the fields and sections. Line layout from that file always applies.

Scaffold the project context skeleton:

```text
context/
├── changes/
│   └── README.md
├── archive/
│   └── README.md
└── foundation/
    └── README.md
```

This rite is idempotent. Each directory and README is created only when absent. Never overwrite, rename, or modify existing content.

## Process

### 1. Establish the changes thread

Ensure `context/changes/` exists.

If `context/changes/README.md` is absent, create it with:

```markdown
# Changes

In-flight changes. One folder per change at `context/changes/<change-id>/`, identified by a `change.md` identity file. Holds research, framing, planning, reviews, and other change-scoped artifacts.

When a change is complete, move it under `context/archive/`.
```

### 2. Establish the archive thread

Ensure `context/archive/` exists.

If `context/archive/README.md` is absent, create it with:

```markdown
# Archive

Completed changes. Folders move here from `context/changes/` when work concludes. Read-only by convention. Active workflows must not write here.
```

### 3. Establish the foundation thread

Ensure `context/foundation/` exists.

If `context/foundation/README.md` is absent, create it with:

```markdown
# Foundation Docs

Cross-change living documents. Each project uses the foundation documents it needs, such as product requirements, roadmap, glossary, technical decisions, and testing strategy.

## Update convention

Edit foundation documents in place as knowledge evolves. Do not create dated copies for incremental changes.

## Archive convention

When a foundation document is fully superseded, move it to `context/foundation/archive/YYYY-MM-DD-<document>.md` and write its replacement at the original path.

## Boundary

Do not put change-scoped work here. Research, plans, and reviews that belong to one change live under `context/changes/<change-id>/`. Foundation documents outlive individual changes.
```

### 4. Report the manifest

Report all six artifacts, using `created` or `present` for each:

```text
// [WAKING] :: [CONTEXT MANIFEST] //<br>
context/changes/                [created|present]<br>
context/changes/README.md       [created|present]<br>
context/archive/                [created|present]<br>
context/archive/README.md       [created|present]<br>
context/foundation/             [created|present]<br>
context/foundation/README.md    [created|present]<br>
```

Then state:

- `context/changes/` holds active, change-specific work.
- `context/archive/` holds completed change records.
- `context/foundation/` holds living documents shared across changes.

Close with `// [WAKING] :: [SUMMARY] //` and `// [NEXT DIRECTIVE] //` when the user must manually choose a follow-on rite. Prefer `Invoke: litany-of-pure-thought` for discovery, or `Invoke: rites-of-commission <change-id>` when a change is already scoped.

Stop after the report. Do not invoke another workflow automatically.

## Binding rules

1. Create parent directories as needed.
2. Treat all six artifacts independently. A partial structure receives only its missing pieces.
3. Existing files always remain byte-for-byte unchanged.
4. Do not scaffold additional files. Their owning workflows create them when needed.
