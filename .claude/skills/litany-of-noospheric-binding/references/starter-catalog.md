# Starter Catalog

This catalog is the curated candidate source for Litany of Noospheric Binding. Custom-path recommendations must pass all four quality gates. Vetted defaults remain available with their known limitations stated explicitly.

## Vetted defaults

| Product type | Language family | Starter ID |
| --- | --- | --- |
| web-app | js | next |
| web-app | python | django |
| web-app | ruby | rails |
| web-app | php | laravel |
| web-app | dart | flutter |
| api | js | hono |
| api | python | fastapi |
| api | java | spring-boot |
| api | go | go-api |
| api | rust | axum |
| api | dotnet | aspnet-core |
| cli | rust | rust-cli |
| cli | go | go-cli |
| mobile | js | expo |
| mobile | dart | flutter |
| desktop | rust | tauri |

No listed default means the rite must take the custom path.

## Cards

### next

- **Name:** Next.js
- **Language:** js
- **Fits:** web-app, full-stack, SaaS
- **Package manager:** npm
- **Deployment targets:** vercel, cloudflare-pages, fly, self-host
- **Scaffolding confidence:** verified
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** nuxt, react-router

### django

- **Name:** Django
- **Language:** python
- **Fits:** web-app, full-stack, SaaS, admin
- **Package manager:** uv
- **Deployment targets:** fly, railway, render, self-host
- **Scaffolding confidence:** verified
- **Quality gates:** typed no, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** fastapi

### rails

- **Name:** Ruby on Rails
- **Language:** ruby
- **Fits:** web-app, full-stack, SaaS
- **Package manager:** bundle
- **Deployment targets:** fly, render, self-host
- **Scaffolding confidence:** verified
- **Quality gates:** typed no, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** none

### laravel

- **Name:** Laravel
- **Language:** php
- **Fits:** web-app, full-stack, SaaS
- **Package manager:** composer
- **Deployment targets:** fly, render, self-host
- **Scaffolding confidence:** verified
- **Quality gates:** typed no, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** none

### hono

- **Name:** Hono
- **Language:** js
- **Fits:** api, backend, edge
- **Package manager:** npm
- **Deployment targets:** cloudflare-workers, fly, railway, self-host
- **Scaffolding confidence:** verified
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** fastify, nestjs

### fastapi

- **Name:** FastAPI
- **Language:** python
- **Fits:** api, backend, data services
- **Package manager:** uv
- **Deployment targets:** fly, railway, render, self-host
- **Scaffolding confidence:** first-class
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** django

### spring-boot

- **Name:** Spring Boot
- **Language:** java
- **Fits:** api, backend, enterprise
- **Package manager:** maven
- **Deployment targets:** fly, render, self-host
- **Scaffolding confidence:** verified
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** none

### go-api

- **Name:** Go standard library API
- **Language:** go
- **Fits:** api, backend, service
- **Package manager:** omit
- **Deployment targets:** self-host, fly, google-cloud-run
- **Scaffolding confidence:** first-class
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** none

### axum

- **Name:** Axum
- **Language:** rust
- **Fits:** api, backend, service
- **Package manager:** cargo
- **Deployment targets:** self-host, fly
- **Scaffolding confidence:** first-class
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** none

### aspnet-core

- **Name:** ASP.NET Core
- **Language:** dotnet
- **Fits:** api, backend, enterprise
- **Package manager:** dotnet
- **Deployment targets:** azure-app-service, fly, self-host
- **Scaffolding confidence:** verified
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** none

### rust-cli

- **Name:** Rust binary crate
- **Language:** rust
- **Fits:** cli
- **Package manager:** cargo
- **Deployment targets:** self-host
- **Scaffolding confidence:** verified
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** go-cli

### go-cli

- **Name:** Go CLI
- **Language:** go
- **Fits:** cli
- **Package manager:** omit
- **Deployment targets:** self-host
- **Scaffolding confidence:** first-class
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** rust-cli

### expo

- **Name:** Expo
- **Language:** js
- **Fits:** mobile, cross-platform
- **Package manager:** npm
- **Deployment targets:** appstore-via-eas, testflight
- **Scaffolding confidence:** verified
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** flutter

### flutter

- **Name:** Flutter
- **Language:** dart
- **Fits:** mobile, desktop, cross-platform
- **Package manager:** pub
- **Deployment targets:** appstore, playstore, self-host
- **Scaffolding confidence:** verified
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** expo

### tauri

- **Name:** Tauri
- **Language:** rust
- **Fits:** desktop
- **Package manager:** cargo
- **Deployment targets:** self-host, github-releases
- **Scaffolding confidence:** verified
- **Quality gates:** typed yes, convention-based yes, popular-in-family yes, current-docs yes
- **Alternatives:** flutter
