---
name: litany-of-sacred-priming
alias: litany-of-infrastructure-research
description: Facilitate and research an MVP deployment-platform decision. Interview the developer, research current platform capabilities, score viable candidates, stress-test the recommendation, and write context/foundation/infrastructure.md. Use when the user asks where to deploy, which platform to choose, for infrastructure research, or invokes litany-of-infrastructure-research.
---

# Litany of Sacred Priming

Research and record an MVP deployment decision in `context/foundation/infrastructure.md`. Optimize for viable low-operations deployment and iteration speed, not production-scale architecture.

## Initialization

The first emitted content on every invocation must be:

<div align="center">

_No task that is easy is ever worthwhile._

</div>

Then emit the applicable lifecycle header. Never omit, move, alter, or repeat this quote during the invocation.

## Cogitation Unit Output Protocol

Apply [Cogitation Output Conventions](../conventions.md) (including line layout) to every chat message. This litany's templates name the fields and sections. Line layout from that file always applies.

- Begin substantial lifecycle messages with `// [SACRED PRIMING] :: [<PHASE>] //`. End every `// [...] //` header and every labeled field with `<br>`. Chat markdown joins a plain newline into one paragraph.
- State verified constraints, research status, recommendation, and result in compact procedural diction.
- Gate every file write under `// [AWAITING CONFIRMATION] //`.
- Never invoke a downstream rite automatically.

## Scope

Use after product requirements or technical-stack selection when possible. Read:

- `context/foundation/tech-stack.md` for language, framework, runtime, and data-service constraints.
- `context/foundation/prd.md` for user scale, latency, and product constraints.

These are optional. If absent, state the gap and infer only from inspected repository files. Do not configure CI/CD, write Dockerfiles, provision infrastructure, or design high-availability architecture.

## Constraint interview

Ask each question separately. Use structured choices when available. Store answers as research constraints:

1. Does the application require persistent processes, WebSockets, long polling, or background workers?
2. Is minimizing monthly cost or deployment speed and developer experience more important?
3. Does the team have deployment experience with Vercel/Netlify, Cloudflare, Railway/Render/Fly.io, or a hyperscaler?
4. Does global latency matter, or is one region sufficient?
5. Must database, storage, and queues be co-located with hosting, or may they be external?

If the user does not know an answer, record it as uncertainty rather than guessing.

## Research

Research candidates in parallel: Cloudflare Workers/Pages, Vercel, Netlify, Fly.io, Railway, and Render. Use official current documentation and pricing pages. For each platform, verify:

- Supported languages and runtimes against hard tech-stack constraints.
- Deploy, rollback, and log-access workflow.
- Free tier or expected MVP cost.
- Persistent-process and WebSocket support.
- Managed database, storage, and queue availability.
- Documentation quality, CLI maturity, and agent integration.
- Feature maturity and material limitations.

For platform or CLI documentation, query current official documentation before making claims. Mark beta, preview, deprecated, region-limited, and pricing-dependent capabilities inline.

Drop a platform only when it fails a hard constraint, such as a required unsupported runtime or persistent process. Otherwise, retain it for comparison.

## Score and shortlist

Score each viable platform as `Pass`, `Partial`, or `Fail` against:

1. CLI-first deployment, rollback, and logs.
2. Managed or serverless operational model.
3. Agent-readable documentation.
4. Stable deployment API and workflow.
5. Useful integrations and managed services.

Weight scores by interview answers: cost, existing familiarity, global reach, and co-location preference. Shortlist three candidates. Present evidence links and a brief rationale for each.

## Anti-bias cross-check

For the provisional winner, produce:

1. Devil's advocate: three to five concrete failure modes, hidden costs, and technical limits.
2. Pre-mortem: short account of how this choice could fail within six months.
3. Unknown unknowns: three to five non-obvious operational, platform, or lock-in risks.

Present the cross-check before writing. Ask whether to proceed with the winner, choose runner-up, choose third option, or stop. If the user switches platform, repeat this cross-check for the new recommendation.

## Decision artifact

Before writing, inspect `context/foundation/infrastructure.md`.

- Missing: propose creating it.
- Existing: present `overwrite`, `save as infrastructure-v2.md` (or next available version), or `cancel`.

Present:

```text
// [SACRED PRIMING] :: [DECISION READY] //<br>
Recommended platform: <platform><br>
Runner-up: <platform><br>
Hard constraints: <list><br>
Uncertainties: <list><br>
Research sources: <count><br>
Target: <path><br>

// [AWAITING CONFIRMATION] //<br>
Approve write; select another shortlisted platform; revise constraints; or cancel.<br>
```

Write only after explicit approval. Create `context/foundation/` only as part of approved output creation.

Use this document structure:

```markdown
---
project: <name>
researched_at: <ISO 8601 date>
recommended_platform: <platform>
runner_up: <platform>
context_type: mvp
tech_stack:
  language: <language or unknown>
  framework: <framework or unknown>
  runtime: <runtime or unknown>
---

## Recommendation
## Platform Comparison
## Shortlisted Platforms
## Anti-Bias Cross-Check
## Operational Story
## Risk Register
## Getting Started
## Out of Scope
## Sources
```

The artifact must include:

- Full scored matrix with evidence-backed notes.
- Chosen option and two shortlisted alternatives.
- Preview deployment, secrets, rollback, approval, and read-only log workflow.
- Risk register with source, likelihood, impact, and concrete mitigation.
- Three to five version-accurate getting-started actions.
- Source links and access dates.
- Explicit MVP exclusions: Docker configuration, CI/CD implementation, and production-scale HA unless requirements demand them.

After a successful write, emit:

```text
// [SACRED PRIMING] :: [INFRASTRUCTURE DECISION RECORDED] //<br>
Platform: <recommended platform><br>
Runner-up: <platform><br>
Artifact: <path><br>
Risks recorded: <count><br>

// [NEXT DIRECTIVE] //<br>
Invoke: rites-of-true-aim <change-id> when planning the next change, or rites-of-ignition <change-id> when a plan already exists. Do not deploy automatically.<br>
```

## Guardrails

1. Research before recommending. Never rely solely on remembered platform facts.
2. Treat runtime compatibility and persistent-process requirements as hard constraints.
3. Always present three viable alternatives when three exist.
4. Preserve uncertainty, pricing caveats, and non-GA capability status.
5. Do not write the artifact or create directories before user approval.
6. Do not make deployment changes, send requests, or create cloud resources.
