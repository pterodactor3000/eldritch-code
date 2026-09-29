# Synaptic Alignment Configuration

This configuration maps catalog identifiers to scaffold commands. The execution rite must verify each command against current official documentation before use.

## Scaffold commands

| Starter ID | Strategy | Command |
| --- | --- | --- |
| `next` | temporary directory | `npx create-next-app@latest {name} --ts --tailwind --eslint --app --src-dir --use-{pm}` |
| `django` | current directory | `django-admin startproject {name} .` |
| `rails` | temporary directory | `rails new {name} --database postgresql` |
| `laravel` | temporary directory | `composer create-project laravel/laravel {name}` |
| `hono` | temporary directory | `npm create hono@latest {name} -- --template nodejs --pm {pm}` |
| `fastapi` | current directory | `uv init . && uv add fastapi uvicorn` |
| `spring-boot` | temporary directory | `curl -fsSL https://start.spring.io/starter.tgz -d dependencies=web -d type=maven-project -d artifactId={name} \| tar -xzf - -C {name}` |
| `go-api` | current directory | `go mod init {name}` |
| `axum` | temporary directory | `cargo new {name} --bin --edition 2024` |
| `aspnet-core` | temporary directory | `dotnet new webapi -n {name}` |
| `rust-cli` | temporary directory | `cargo new {name} --bin --edition 2024` |
| `go-cli` | current directory | `go mod init {name}` |
| `expo` | temporary directory | `npx create-expo-app@latest {name} --yes` |
| `flutter` | temporary directory | `flutter create {name}` |
| `tauri` | temporary directory | `npm create tauri-app@latest {name} -- --template react-ts --manager {pm} --yes` |

The pipeline symbol in the Spring Boot command is literal shell syntax. Create the target temporary directory first if the current shell cannot extract into a missing directory.

## Dependency-audit commands

| Language family | Command | Parsing note |
| --- | --- | --- |
| js | `npm audit --json` | Read metadata vulnerability counts. Nonzero exit means findings, not scaffold failure. |
| python | `pip-audit --format json` | If unavailable, record the tool failure. |
| ruby | `bundle audit check --update` | Parse advisories from text output. |
| rust | `cargo audit --json` | Parse vulnerability list. |
| go | `govulncheck -json ./...` | Aggregate JSON output. |
| dotnet | `dotnet list package --vulnerable --include-transitive` | Parse severity markers. |
| java | skipped | Recommend an external dependency scanner. |
| php | skipped | Recommend a Composer security advisory tool. |
| dart | skipped | Recommend `dart pub outdated` as a maintenance check. |

## Command validation

Before execution, resolve the selected framework through Context7. Confirm:

1. The documented starter command still exists.
2. The configured command flags are valid.
3. The documented package manager and runtime expectations match the binding record.

If one check fails, do not guess a replacement command. Report the configured and documented values, then require the catalog maintainer to update this file.
