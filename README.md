# Eldritch Code

Landing page and writings for [Eldritch Code](https://eldritchcode.it) - a static site with an eldritch/lovecraftian theme.

## Structure

```
index.html          # Landing page
styles.css          # Shared styles
script.js           # Landing page effects
posts/              # Markdown source for writings
templates/          # HTML templates for build
scripts/            # Build tooling
writings/           # Generated writings output (built from posts/)
```

## Writings

Posts live in `posts/` as Markdown with YAML frontmatter:

```yaml
---
title: "Post Title"
date: 2026-03-15
tags: [angular, typescript]
category: programming
excerpt: "Optional summary. Auto-generated from first paragraph if omitted."
---
```

**Required fields:** `title`, `date`  
**Optional:** `tags`, `category`, `excerpt`

Add a new post by creating `posts/your-slug.md` (slug = filename without `.md`), then rebuild.

### Security

- Raw HTML in Markdown is disabled (`html: false`)
- Rendered output is sanitized with an allowlist before publishing
- Frontmatter values are HTML-escaped in templates
- Do not embed `<script>` or event handlers in Markdown - they will be stripped

## Local development

Install dependencies (first time only):

```bash
npm install
```

Build writings and start Wrangler:

```bash
npm run dev
```

Open [http://localhost:8787](http://localhost:8787).

Or build and serve separately:

```bash
npm run build
wrangler dev
```

**Simple static server** (no build):

```bash
python -m http.server 8080
```

## Deploy

Rebuild writings, then deploy:

```bash
npm run build
wrangler deploy
```

Generated `writings/` output is committed to the repo so deploy works without a CI build step. Run `npm run build` after editing posts before deploying.
