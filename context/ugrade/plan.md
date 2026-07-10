# Upgrade build-writings.js

## Restructure for testability

`scripts/build-writings.js` currently calls `build()` unconditionally at module load (line 386), so it can't be imported for tests without triggering a full build.

Split into:
- `scripts/lib/writings-utils.js` (new): all pure functions, exported (`escapeHtml`, `fillTemplate`, `validateSlug`, `validateDate`, `validateTagValue`, `normalizeTags`, `formatDate`, `plainTextExcerpt`, `renderMarkdown`, `relationScore`, `findRelated`, `buildTagHtml`, `buildPostCard`, `buildTagFilters`, `buildRelatedHtml`, `loadPosts`).
- `scripts/build-writings.js`: thin entry point - imports from `lib/writings-utils.js`, keeps `build()` orchestration (file writes, template fill, sitemap/feed generation), wraps the top-level call in try/catch.

## Fix correctness bugs

- **Excerpt/meta-description markdown leak**: replace [`autoExcerpt`](scripts/build-writings.js:98) with `plainTextExcerpt(markdown, maxLength)`. Use `md.renderInline()` on the first paragraph, then `sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })` to collapse markdown formatting to plain text (reuses existing deps, no regex hacks). Truncate at the last word boundary within `maxLength` and append `…` when truncated. Used for both card excerpt and `<meta name="description">`.
- **Remove dead `search-index.json`**: delete [`buildSearchIndex`](scripts/build-writings.js:261) and its `writeFileSync` call in `build()` - confirmed nothing reads this file; `writings.js` filters via inline `data-*` attributes only.
- **Draft flag**: in `loadPosts`, skip files where frontmatter has `draft: true`; log skipped count in the final build summary line.
- **Related posts ignore category**: extend `tagOverlapScore` into `relationScore(a, b)` = shared tag count + 1 if same non-empty category. Still require `score > 0` to qualify, so category alone can produce a related link.
- **No top-level error handling**: wrap the final `build()` call in try/catch, print `error.message` (not the full stack) to stderr, `process.exit(1)`.

## Robustness cleanup

- Remove the weak sanitizer-length-heuristic warning (`raw.length` vs `clean.length` check) - low value since `markdown-it` already runs with `html: false`; keep the `sanitizeHtml` call itself as defense-in-depth.
- After rendering each post, scan for `<img>` tags with missing/empty `alt` and `console.warn` with the post slug (non-fatal accessibility check).
- `escapeHtml`: also escape `'` to `&#39;` for attribute-safety hardening.
- Validate `title`/`date`/`category` frontmatter aren't arrays/objects before `String()` coercion; throw a clear error otherwise (consistent with existing slug/tag validation strictness).

## SEO / site-consistency additions

- Add `const SITE_URL = 'https://eldritchcode.it';` (site domain confirmed via existing contact/subdomain links in `index.html`).
- Add `<link rel="canonical">` to both `templates/writings-index.html` and `templates/writings-post.html`.
- Add missing Open Graph tags to `templates/writings-index.html` (currently has none, post template already has some) and add `twitter:card`/`twitter:title`/`twitter:description` to both templates for consistency.
- Generate `sitemap.xml` at the site root covering the home page, writings index, and every post URL.
- Generate `writings/feed.xml` (RSS 2.0) listing posts (title, link, pubDate, description = excerpt); link it from `templates/writings-index.html` head via `<link rel="alternate" type="application/rss+xml">`.

## Minor optimization

- Precompute a numeric timestamp per post at `loadPosts` time (`post.timestamp`); use it in the main sort and in `findRelated`'s date tiebreaker instead of repeated `new Date(...)` construction.
- Precompute a `Set` of tags per post; use it for O(1) membership checks in `relationScore` instead of `Array.includes` in a nested loop.

## Tests

- New `scripts/lib/writings-utils.test.js` using Node's built-in `node:test` + `node:assert/strict` (no new dependency, Node v26 available).
- Add `"test": "node --test scripts/"` to `package.json` scripts.
- Coverage: `validateSlug` (valid, invalid chars, path traversal), `validateDate` (valid ISO, invalid string), `validateTagValue`/`normalizeTags` (string, array, empty, invalid chars), `plainTextExcerpt` (strips bold/code/links, truncates at word boundary with ellipsis, leaves short text untouched), `fillTemplate` (basic substitution, missing key renders empty), `relationScore`/`findRelated` (tag overlap, category-only bonus, excludes self), `escapeHtml` (all escaped characters).

## Files touched

- `scripts/lib/writings-utils.js` (new)
- `scripts/lib/writings-utils.test.js` (new)
- `scripts/build-writings.js` (rewritten as thin entry point)
- `templates/writings-index.html` (canonical, OG, twitter, RSS link)
- `templates/writings-post.html` (canonical, twitter)
- `package.json` (add `test` script)

# Scroll indicator (CSS-first) and homepage writings sync

## Scroll progress indicator

CSS Scroll-Driven Animations (`animation-timeline: scroll()`) drives this natively in supporting browsers, no JS needed there. A small JS fallback covers browsers that don't support it yet.

Class name: `.scroll-progress` (not `.scroll-indicator`) - the codebase already has a `.scroll-indicator` class for an unrelated feature, the bouncing "↓" scroll-down cue at the bottom of the hero section (`index.html`, `styles.css`). Reusing that name for the new nav progress bar would have made both elements inherit each other's CSS rules via the shared selector.

In [styles.css](styles.css):

```css
.scroll-progress {
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--eldritch-glow), var(--cosmic-fog));
  transform: scaleX(0);
  transform-origin: left;
  animation: scroll-progress-fill linear;
  animation-timeline: scroll(root block);
}

@keyframes scroll-progress-fill {
  to {
    transform: scaleX(1);
  }
}
```

Positioned `absolute` inside `<nav>` (which is `position: fixed`), `bottom: -3px` sits it right on the nav's bottom edge - "right under the header" - using the site's existing green tokens (`--eldritch-glow`, `--cosmic-fog`).

Markup: `<div class="scroll-progress"></div>` as the last child inside `<nav>...</nav>` in all three files that render a nav bar:
- [index.html](index.html)
- [templates/writings-index.html](templates/writings-index.html)
- [templates/writings-post.html](templates/writings-post.html)

### Firefox fallback (bug fix)

Firefox stable does not support `animation-timeline: scroll()` (ships in Firefox 155+; still behind the `layout.css.scroll-driven-animations.enabled` flag as of this build). There, the invalid `animation-timeline` declaration is dropped, `animation-duration: auto` resolves to `0s` against the default document timeline, the animation completes instantly, and - with no `fill-mode: forwards` - the bar reverts to the base `scaleX(0)`. Net effect: permanently invisible in Firefox, confirmed by manual testing ("visible in Chromium, not in Firefox-based browser").

Fix in [script.js](script.js) - `initScrollProgressFallback()`:
- Feature-detects with `CSS.supports('animation-timeline: scroll(root block)')`.
- If supported (Chromium, Safari 26+): returns immediately, zero JS runs, CSS handles everything.
- If not supported (Firefox today): attaches a `rAF`-throttled `scroll`/`resize` listener (same pattern as `initMobileNav`/`initBackToTop` elsewhere in the file) that computes `window.scrollY / (documentHeight - viewportHeight)` and sets `transform: scaleX(progress)` directly on every `.scroll-progress` element found via `querySelectorAll`, which covers every page since `script.js` is loaded on the homepage and both writings templates.

## Homepage writings preview, synced on every build

[index.html](index.html) had a hand-written `#writings` section with 2 hardcoded post cards that were already stale (missing a third real post). Fixed by generating this block at build time from the same posts the `/writings/` page uses.

- Grid content wrapped in HTML comment markers in `index.html`:

```html
<div class="writings-grid">
  <!-- WRITINGS_PREVIEW:START -->
  <!-- Generated by scripts/build-writings.js on every build - do not edit by hand. -->
  <!-- WRITINGS_PREVIEW:END -->
</div>
```

- `buildHomePostCard(post)` added to [scripts/lib/writings-utils.js](scripts/lib/writings-utils.js), mirroring the homepage card markup exactly (plain `<span class="tag">`, no `data-tag`/`writings-tag`/`data-search` attributes - those are only needed by the `/writings/` index page's client-side filter script).
- `build()` in [scripts/build-writings.js](scripts/build-writings.js), after `loadPosts()`:
  - `HOME_PAGE_PATH`, `HOME_PREVIEW_LIMIT = 6`, and `HOME_PREVIEW_MARKER_PATTERN` constants.
  - `updateHomePageWritingsPreview(posts)` takes `posts.slice(0, HOME_PREVIEW_LIMIT)` (posts are already sorted newest-first), reads `index.html`, regex-replaces the content between the two markers with the generated cards, writes back to `index.html`.
  - Throws a clear error if the markers aren't found, so a manual edit to `index.html` that removes them fails the build loudly instead of silently no-op-ing.
- `node:test` coverage for `buildHomePostCard` added to [scripts/lib/writings-utils.test.js](scripts/lib/writings-utils.test.js): renders title/meta/excerpt/category/tags, omits the category span when a post has no category, and confirms no `data-tag`/`data-search` attributes leak in.

## Files touched

- `styles.css` (`.scroll-progress` rule, `@keyframes scroll-progress-fill`)
- `script.js` (`initScrollProgressFallback`)
- `index.html` (`.scroll-progress` div in nav; `WRITINGS_PREVIEW` markers replacing hardcoded cards)
- `templates/writings-index.html` (`.scroll-progress` div in nav)
- `templates/writings-post.html` (`.scroll-progress` div in nav)
- `scripts/lib/writings-utils.js` (`buildHomePostCard` export)
- `scripts/build-writings.js` (`updateHomePageWritingsPreview` step in `build()`)
- `scripts/lib/writings-utils.test.js` (tests for `buildHomePostCard`)

## Verification

- `npm test`: 25/25 passing.
- `npm run build`: rebuilds `writings/` output and injects the 3 newest posts into `index.html` between the preview markers.
- Confirmed `.scroll-progress` present in all 7 rendered pages (home, writings index, 3 post pages, both templates).
- Confirmed the Firefox-vs-Chromium visibility gap by manual cross-browser testing; fixed with the JS fallback above.
