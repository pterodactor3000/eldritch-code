# Noospheric Binding Contract

This reference defines the `context/foundation/tech-stack.md` handoff written by Litany of Noospheric Binding. The selected `starter_id` must exist in [starter-catalog.md](starter-catalog.md).

## Handoff format

```yaml
---
starter_id: <catalog identifier>
package_manager: <string, omit only when the ecosystem has no external choice>
project_name: <kebab-case string>
hints:
  language_family: js | python | ruby | java | go | rust | php | dotnet | dart
  team_size: solo | small | mixed
  deployment_target: <starter-supported target>
  ci_provider: github-actions | gitlab-ci | circleci | cloudflare-builds
  ci_default_flow: auto-deploy-on-merge | manual-promotion
  scaffolding_confidence: verified | first-class | best-effort
  path_taken: standard | custom
  quality_override: <boolean>
  self_check_answers: <object|null>
  has_auth: <boolean>
  has_payments: <boolean>
  has_realtime: <boolean>
  has_ai: <boolean>
  has_background_jobs: <boolean>
---

## Why this stack

<One paragraph, 200 words maximum.>
```

The body has exactly one heading and one paragraph. Keep alternatives, detailed tradeoffs, and quality-gate analysis in the conversation.

## Five-point self-check

For a custom selection, record these booleans in `self_check_answers`:

```yaml
self_check_answers:
  typed: <boolean>
  official_starter: <boolean>
  conventions: <boolean>
  current_docs: <boolean>
  can_judge_agent_output: <boolean>
```

If two or more answers are false, warn that the vetted default is safer. The user may continue after explicit confirmation.

## Quality override

Set `quality_override: true` only if the user selects a catalog candidate that fails one or more quality gates after the rite has named the failures and explained the compensation burden.

The compensation burden must state:

1. Which project conventions need to be documented.
2. Which validation and typing practices need to be enforced.
3. That the team owns ongoing maintenance of those instructions.
